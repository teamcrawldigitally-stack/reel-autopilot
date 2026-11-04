// Posts the next ready-made reel from queue/<page>/manifest.json to Instagram, at most one per day.
//   node pipeline/post-queue.mjs --page astro24x7 [--dry-run] [--force]
//   --dry-run  checks the token, the account, the queue and the video link, but posts nothing
//   --force    posts the next reel even if one already went out today
import fs from "node:fs";
import path from "node:path";
import { hostVideo } from "./host-video.mjs";
import { account, loadToken, publishingQuota, publishReelFromUrl, recentMedia, refreshTokenIfDue } from "./instagram.mjs";
import { localDate, log, readJson, ROOT, writeJson } from "./lib.mjs";

const args = process.argv.slice(2);
const page = args[args.indexOf("--page") + 1] || "astro24x7";
const dryRun = args.includes("--dry-run");
const force = args.includes("--force");

const queueDir = path.join(ROOT, "queue", page);
const manifest = readJson(path.join(queueDir, "manifest.json"));
const statePath = path.join(ROOT, "state", `${page}-posted.json`);
const posted = readJson(statePath, []);
const today = localDate();

const summary = (lines) => {
  const out = process.env.GITHUB_STEP_SUMMARY;
  if (out) fs.appendFileSync(out, lines.join("\n") + "\n");
  lines.forEach((l) => log(l.replace(/[*#]/g, "")));
};

const main = async () => {
  if (manifest.paused && !dryRun) return summary([`Paused: queue/${page}/manifest.json has "paused": true. Nothing posted.`]);
  if (!force && !dryRun && posted.some((p) => p.date === today)) return summary([`Already posted today (${today}). Nothing to do.`]);
  const next = manifest.items.find((i) => !posted.some((p) => p.id === i.id));
  if (!next && !dryRun) return summary([`The queue for ${page} is empty. Add reels to queue/${page}/manifest.json.`]);

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

  // Guard against double posts: if a recent post already has this caption, just record it.
  const head = next.caption.slice(0, 60);
  const dup = (await recentMedia(t.token, me.user_id).catch(() => [])).find((m) => (m.caption ?? "").startsWith(head));
  if (dup) {
    if (!dryRun) {
      posted.push({ id: next.id, date: today, mediaId: dup.id, permalink: dup.permalink, postedAt: dup.timestamp, note: "found already on Instagram" });
      writeJson(statePath, posted);
    }
    return summary([`"${next.title}" is already on @${me.username} (${dup.permalink}). Recorded it, nothing posted.`]);
  }

  const host = await hostVideo(video);
  try {
    if (dryRun) {
      return summary([
        `### Test OK, nothing posted`,
        `- Account: @${me.username} (${me.account_type})`,
        `- Next reel: **${next.title}** (${(fs.statSync(video).size / 1e6).toFixed(1)} MB)`,
        `- Temporary video link works (${host.how})`,
        `- ${posted.length} of ${manifest.items.length} reels posted so far`,
      ]);
    }
    const result = await publishReelFromUrl({
      token: t.token,
      userId: me.user_id,
      videoUrl: host.url,
      caption: next.caption,
      shareToFeed: manifest.shareToFeed ?? true,
      thumbOffsetMs: next.thumbOffsetMs,
      audioName: next.audioName,
    });
    posted.push({ id: next.id, date: today, mediaId: result.mediaId, permalink: result.permalink, postedAt: new Date().toISOString() });
    writeJson(statePath, posted);
    summary([
      `### Posted: ${next.title}`,
      `- ${result.permalink ?? result.mediaId}`,
      `- @${me.username} · ${posted.length} of ${manifest.items.length} reels posted`,
      ...((n) => (n ? [`- Next: ${n.title}`] : [`- The queue is now empty`]))(manifest.items.find((i) => !posted.some((p) => p.id === i.id))),
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
