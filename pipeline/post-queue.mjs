// Posts the next ready-made reel from queue/<page>/manifest.json to Instagram, at most `perDay` per day per kind.
//   node pipeline/post-queue.mjs --page astro24x7 [--kind normal|trial] [--dry-run] [--force]
//   --kind     normal (default): the next reel not posted yet, shared to followers
//              trial: a trial copy (shown to non-followers first) of the next reel that already went out
//              normally; needs "trialCopy": {"enabled": true, "graduation": "SS_PERFORMANCE"|"MANUAL"}
//   --dry-run  checks the token, the account, the queue and the video link, but posts nothing
//   --force    posts even if today's limit for this kind is reached
import fs from "node:fs";
import path from "node:path";
import { hostVideo } from "./host-video.mjs";
import { account, loadToken, publishingQuota, publishReelFromUrl, recentMedia, refreshTokenIfDue } from "./instagram.mjs";
import { localDate, log, readJson, ROOT, writeJson } from "./lib.mjs";

const args = process.argv.slice(2);
const page = args[args.indexOf("--page") + 1] || "astro24x7";
const dryRun = args.includes("--dry-run");
const force = args.includes("--force");
const kind = args.includes("--kind") ? args[args.indexOf("--kind") + 1] : "normal";
if (!["normal", "trial"].includes(kind)) throw new Error(`--kind must be normal or trial, not ${kind}`);

const queueDir = path.join(ROOT, "queue", page);
const manifest = readJson(path.join(queueDir, "manifest.json"));
const statePath = path.join(ROOT, "state", `${page}-posted.json`);
const posted = readJson(statePath, []);
const today = localDate();
const kindOf = (p) => p.kind ?? "normal";
const done = (item, k) => posted.some((p) => p.id === item.id && kindOf(p) === k);
const label = kind === "trial" ? "trial copy of " : "";
const nextItem = () =>
  manifest.items.find((i) => (kind === "trial" ? done(i, "normal") && !done(i, "trial") : !done(i, "normal")));

const summary = (lines) => {
  const out = process.env.GITHUB_STEP_SUMMARY;
  if (out) fs.appendFileSync(out, lines.join("\n") + "\n");
  lines.forEach((l) => log(l.replace(/[*#]/g, "")));
};

const main = async () => {
  if (manifest.paused && !dryRun) return summary([`Paused: queue/${page}/manifest.json has "paused": true. Nothing posted.`]);
  const trial = manifest.trialCopy ?? {};
  if (kind === "trial" && !trial.enabled) return summary([`Trial copies are off (queue/${page}/manifest.json → trialCopy.enabled). Nothing to do.`]);
  const perDay = Math.max(1, Number(manifest.perDay) || 1);
  const todayCount = posted.filter((p) => p.date === today && kindOf(p) === kind).length;
  if (!force && !dryRun && todayCount >= perDay)
    return summary([`Already posted ${todayCount} ${kind} reel${todayCount > 1 ? "s" : ""} today (${today}, limit ${perDay}). Nothing to do.`]);
  const next = nextItem();
  if (!next && !dryRun)
    return summary([kind === "trial" ? `No reel is waiting for a trial copy (each one gets its trial copy after its normal post).` : `The queue for ${page} is empty. Add reels to queue/${page}/manifest.json.`]);

  // Token + account check.
  let t = loadToken();
  const me = await account(t.token, manifest.igUserId);
  log(`account: @${me.username} (${me.account_type}, ${me.media_count} posts)`);
  if (manifest.expectUsername && me.username.toLowerCase() !== manifest.expectUsername.toLowerCase())
    throw new Error(`The token belongs to @${me.username}, but this queue is for @${manifest.expectUsername}. Nothing posted.`);
  t = await refreshTokenIfDue(t);
  const quota = await publishingQuota(t.token, me.user_id).catch(() => null);
  if (quota) log(`posts used in the last 24 h: ${quota.quota_usage}/${quota.config?.quota_total ?? "?"}`);

  if (!next) return summary([`Test OK for @${me.username}. The queue is empty.`]);
  const video = path.join(queueDir, next.video);
  if (!fs.existsSync(video)) throw new Error(`Video file missing: queue/${page}/${next.video}`);

  // Guard against double posts: if Instagram already shows this caption (twice, for a trial copy), just record it.
  const head = next.caption.slice(0, 60);
  const matches = (await recentMedia(t.token, me.user_id).catch(() => [])).filter((m) => (m.caption ?? "").startsWith(head));
  const dup = kind === "normal" ? matches[matches.length - 1] : matches.length >= 2 ? matches[0] : null;
  if (dup) {
    if (!dryRun) {
      posted.push({ id: next.id, kind, date: today, mediaId: dup.id, permalink: dup.permalink, postedAt: dup.timestamp, note: "found already on Instagram" });
      writeJson(statePath, posted);
    }
    return summary([`The ${label}"${next.title}" is already on @${me.username} (${dup.permalink}). Recorded it, nothing posted.`]);
  }

  const host = await hostVideo(video);
  try {
    if (dryRun) {
      return summary([
        `### Test OK, nothing posted`,
        `- Account: @${me.username} (${me.account_type})`,
        `- Next ${kind} post: **${label}${next.title}** (${(fs.statSync(video).size / 1e6).toFixed(1)} MB)`,
        `- Temporary video link works (${host.how})`,
        `- ${posted.filter((p) => kindOf(p) === "normal").length} of ${manifest.items.length} reels posted so far (${posted.filter((p) => kindOf(p) === "trial").length} trial copies)`,
      ]);
    }
    const result = await publishReelFromUrl({
      token: t.token,
      userId: me.user_id,
      videoUrl: host.url,
      caption: next.caption,
      shareToFeed: manifest.shareToFeed ?? true,
      thumbOffsetMs: next.thumbOffsetMs,
      audioName: kind === "trial" ? undefined : next.audioName,
      trialGraduation: kind === "trial" ? trial.graduation || "SS_PERFORMANCE" : undefined,
    });
    posted.push({ id: next.id, kind, date: today, mediaId: result.mediaId, permalink: result.permalink, postedAt: new Date().toISOString() });
    writeJson(statePath, posted);
    const n = nextItem();
    summary([
      `### Posted: ${label}${next.title}${kind === "trial" ? ` (trial reel, graduates: ${trial.graduation || "SS_PERFORMANCE"})` : ""}`,
      `- ${result.permalink ?? result.mediaId}`,
      `- @${me.username} · ${posted.filter((p) => kindOf(p) === "normal").length} of ${manifest.items.length} reels posted, ${posted.filter((p) => kindOf(p) === "trial").length} trial copies`,
      n ? `- Next ${kind}: ${n.title}` : kind === "trial" ? `- Next trial copy follows the next normal post` : `- The queue is now empty`,
    ]);
  } finally {
    host.close();
  }
};

main()
  .then(() => process.exit(0))
  .catch((e) => {
    summary([`### Failed, nothing posted`, "```", e.message, "```"]);
    process.exit(1);
  });
