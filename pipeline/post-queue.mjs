// Posts the next ready-made reel from queue/<page>/manifest.json to Instagram, at most `perDay` per day per kind.
//   node pipeline/post-queue.mjs --page astro24x7 [--kind normal|trial] [--dry-run] [--force]
//   --kind     normal (default): the next reel not posted yet, shared to followers
//              trial: a trial copy (shown to non-followers first) of the next reel that already went out
//              normally; needs "trialCopy": {"enabled": true, "graduation": "SS_PERFORMANCE"|"MANUAL"}
//   --dry-run  checks the token and account, uploads the video and lets Instagram process it, but publishes nothing
//   --force    posts even if today's limit for this kind is reached
//   --slot N   this run is for the Nth post of the day of this kind; skip if N posts of this kind already went out
//              today (lets backup start times retry a slot that GitHub dropped without posting twice)
import fs from "node:fs";
import path from "node:path";
import { hostVideo } from "./host-video.mjs";
import { account, canUploadDirectly, loadToken, prepareReel, publishContainer, publishingQuota, recentMedia, refreshTokenIfDue } from "./instagram.mjs";
import { localDate, log, readJson, ROOT, writeJson } from "./lib.mjs";

const args = process.argv.slice(2);
const page = args[args.indexOf("--page") + 1] || "astro24x7";
const dryRun = args.includes("--dry-run");
const force = args.includes("--force");
const kind = args.includes("--kind") ? args[args.indexOf("--kind") + 1] : "normal";
const slot = args.includes("--slot") ? Number(args[args.indexOf("--slot") + 1]) : 0;
if (!["normal", "trial"].includes(kind)) throw new Error(`--kind must be normal or trial, not ${kind}`);

const queueDir = path.join(ROOT, "queue", page);
const manifest = readJson(path.join(queueDir, "manifest.json"));
const statePath = path.join(ROOT, "state", `${page}-posted.json`);
const posted = readJson(statePath, []);
const today = localDate();
const kindOf = (p) => p.kind ?? "normal";
const NOT_ELIGIBLE = /trial reel follower requirement/i;
// Every caption ends with the page's standing offer (manifest "captionCta"), placed just above the hashtags.
const withCta = (caption, cta) => {
  if (!cta || caption.includes(cta)) return caption;
  const i = caption.lastIndexOf("\n\n#");
  return i >= 0 ? `${caption.slice(0, i)}\n${cta}${caption.slice(i)}` : `${caption}\n\n${cta}`;
};
const done = (item, k) => posted.some((p) => p.id === item.id && kindOf(p) === k);
const label = kind === "trial" ? "trial copy of " : "";
// An item with "notBefore": "YYYY-MM-DD" (IST) is never posted earlier than that date, e.g. a reel that says "आज रात".
// "notAfter" (IST) skips a dated reel once its day has passed; "trialCopy": false means that reel never gets a trial copy.
// "trialOnly": true means that reel is posted only as a trial reel (no normal feed post), on its dated day like a normal one.
const inDate = (i) => (!i.notBefore || i.notBefore <= today) && (!i.notAfter || i.notAfter >= today);
const nextItem = () =>
  manifest.items.find((i) =>
    kind === "trial"
      ? (done(i, "normal") || (i.trialOnly && inDate(i))) && !done(i, "trial") && i.trialCopy !== false
      : !i.trialOnly && !done(i, "normal") && inDate(i)
  );

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
  if (!force && !dryRun && slot && todayCount >= slot)
    return summary([`Slot ${slot} for ${kind} posts is already done today (${todayCount} posted). Nothing to do.`]);
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

  const opts = {
    token: t.token,
    userId: me.user_id,
    caption: withCta(next.caption, manifest.captionCta),
    shareToFeed: manifest.shareToFeed ?? true,
    thumbOffsetMs: next.thumbOffsetMs,
    audioName: kind === "trial" ? undefined : next.audioName,
    trialGraduation: kind === "trial" ? trial.graduation || "SS_PERFORMANCE" : undefined,
  };
  // 1st choice: upload the file straight to Instagram. Backup: a temporary public link Instagram fetches.
  let host;
  try {
    let containerId, how, why;
    try {
      if (!canUploadDirectly()) throw new Error("this token type can't upload files directly");
      containerId = await prepareReel({ ...opts, videoPath: video });
      how = "direct upload";
    } catch (e) {
      why = e.message.slice(0, 300);
      if (NOT_ELIGIBLE.test(why)) throw e; // a video link won't help: the account can't make trial reels yet
      log(`direct upload didn't work (${why}), using a temporary video link instead`);
      host = await hostVideo(video);
      containerId = await prepareReel({ ...opts, videoUrl: host.url });
      how = `temporary link, ${host.how}`;
    }
    if (dryRun) {
      return summary([
        `### Test OK, nothing posted`,
        `- Account: @${me.username} (${me.account_type})`,
        `- Next ${kind} post: **${label}${next.title}** (${(fs.statSync(video).size / 1e6).toFixed(1)} MB)`,
        `- Instagram received and processed the video (${how}); it was not published`,
        ...(why ? [`- Direct upload was refused: ${why}`] : []),
        `- ${posted.filter((p) => kindOf(p) === "normal").length} of ${manifest.items.length} reels posted so far (${posted.filter((p) => kindOf(p) === "trial").length} trial copies)`,
      ]);
    }
    const result = await publishContainer({ token: t.token, userId: me.user_id, containerId });
    posted.push({ id: next.id, kind, date: today, mediaId: result.mediaId, permalink: result.permalink, postedAt: new Date().toISOString(), via: how });
    writeJson(statePath, posted);
    const n = nextItem();
    summary([
      `### Posted: ${label}${next.title}${kind === "trial" ? ` (trial reel, graduates: ${trial.graduation || "SS_PERFORMANCE"})` : ""}`,
      `- ${result.permalink ?? result.mediaId}`,
      `- @${me.username} · ${posted.filter((p) => kindOf(p) === "normal").length} of ${manifest.items.length} reels posted, ${posted.filter((p) => kindOf(p) === "trial").length} trial copies · via ${how}`,
      n ? `- Next ${kind}: ${n.title}` : kind === "trial" ? `- Next trial copy follows the next normal post` : `- The queue is now empty`,
      ...(why ? [`- Direct upload was refused: ${why}`] : []),
    ]);
  } finally {
    host?.close();
  }
};

main()
  .then(() => process.exit(0))
  .catch((e) => {
    if (kind === "trial" && NOT_ELIGIBLE.test(e.message)) {
      // New or small accounts can't make trial reels yet; skip quietly so the run stays green.
      summary([`### Trial copy skipped`, `Instagram doesn't allow trial reels on this account yet (follower requirement). Normal posts are not affected; trial copies start by themselves once the account qualifies.`]);
      process.exit(0);
    }
    summary([`### Failed, nothing posted`, "```", e.message, "```"]);
    process.exit(1);
  });
