// Saves a nightly engagement snapshot for every reel the queue has posted, tagged with its look,
// topic type and hook, plus the account's follower count. Read at each batch session to decide
// what the next batch should look like.
//   node pipeline/stats.mjs --page astro24x7
import fs from "node:fs";
import path from "node:path";
import { accountCounts, loadToken, mediaStats } from "./instagram.mjs";
import { localDate, log, readJson, ROOT, writeJson } from "./lib.mjs";

const args = process.argv.slice(2);
const page = args[args.indexOf("--page") + 1] || "astro24x7";
const manifest = readJson(path.join(ROOT, "queue", page, "manifest.json"));
const posted = readJson(path.join(ROOT, "state", `${page}-posted.json`), []);
const statsPath = path.join(ROOT, "state", `${page}-stats.json`);
const stats = readJson(statsPath, { snapshots: [] });

const t = loadToken();
const acct = await accountCounts(t.token, manifest.igUserId);
const byId = Object.fromEntries(manifest.items.map((i) => [i.id, i]));
const rows = [];
let refusedOnce = null;
for (const p of posted) {
  const item = byId[p.id] ?? {};
  try {
    const s = await mediaStats(t.token, p.mediaId);
    if (s.refused.length && !refusedOnce) refusedOnce = s.refused;
    const hours = (Date.now() - Date.parse(s.timestamp ?? p.postedAt)) / 36e5;
    rows.push({
      id: p.id, kind: p.kind ?? "normal", title: item.title, look: item.look, type: item.type, hook: item.hook,
      slot: p.postedAt ? new Date(Date.parse(p.postedAt) + 5.5 * 36e5).toISOString().slice(11, 16) : null,
      ageHours: Math.round(hours), likes: s.likes, comments: s.comments, ...s.insights, permalink: s.permalink,
    });
  } catch (e) {
    rows.push({ id: p.id, kind: p.kind ?? "normal", error: e.message.slice(0, 120) });
  }
}
stats.snapshots.push({ date: localDate(), at: new Date().toISOString(), followers: acct.followers, mediaCount: acct.media, reels: rows });
stats.snapshots = stats.snapshots.slice(-90);
if (refusedOnce) stats.insightsRefused = refusedOnce;
writeJson(statsPath, stats);

// Readable table in the run summary.
const cols = ["title", "kind", "look", "slot", "ageHours", "views", "reach", "likes", "comments", "shares", "saved", "follows"];
const lines = [
  `### @${acct.username} · ${acct.followers} followers · ${rows.length} posts tracked`,
  "",
  `| ${cols.join(" | ")} |`,
  `| ${cols.map(() => "---").join(" | ")} |`,
  ...rows.map((r) => `| ${cols.map((c) => (r[c] ?? "–")).join(" | ")} |`),
  ...(refusedOnce ? ["", `Not available with the current permission: ${refusedOnce.map((x) => x.split(":")[0]).join(", ")}`] : []),
];
if (process.env.GITHUB_STEP_SUMMARY) fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY, lines.join("\n") + "\n");
lines.forEach((l) => log(l));
process.exit(0);
