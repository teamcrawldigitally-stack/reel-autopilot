// Daily pipeline: research -> script -> voiceover -> render -> check -> post -> log.
//
//   node pipeline/run-daily.mjs                 full run, posts to Instagram
//   node pipeline/run-daily.mjs --dry-run       everything except posting
//   node pipeline/run-daily.mjs --script f.json skip research, use this script
//   node pipeline/run-daily.mjs --tts espeak    override the voice provider
import fs from "node:fs";
import path from "node:path";
import { publishReel } from "./publish.mjs";
import { researchAndWrite } from "./research.mjs";
import { buildCaption, buildProps, checkVideo, localDate, log, readJson, ROOT, sanitizeScript, sh, writeJson } from "./lib.mjs";

try {
  process.loadEnvFile(path.join(ROOT, ".env"));
} catch {}

const args = process.argv.slice(2);
const flag = (name) => args.includes(name);
const opt = (name) => {
  const i = args.indexOf(name);
  return i >= 0 ? args[i + 1] : undefined;
};

const config = readJson(path.join(ROOT, "config/channel.json"));
const historyPath = path.join(ROOT, "history/posted.json");
const history = readJson(historyPath, []);
const dryRun = flag("--dry-run") || config.posting?.enabled === false;

const date = localDate(config.timezone);
const runId = `${date}_${new Date().toISOString().slice(11, 16).replace(":", "")}`;
const runDir = path.join(ROOT, "runs", runId);
fs.mkdirSync(runDir, { recursive: true });
const summary = { runId, date, status: "started", dryRun };
const saveSummary = () => writeJson(path.join(runDir, "summary.json"), summary);

const main = async () => {
  // Safety: never post twice on the same day.
  if (!dryRun && history.some((h) => h.date === date && h.mediaId) && !flag("--force")) {
    log(`already posted on ${date}; use --force to post again`);
    summary.status = "skipped";
    return;
  }

  // 1. Research + script
  let script;
  const scriptPath = path.join(runDir, "script.json");
  if (opt("--script")) {
    const { script: s, problems } = sanitizeScript(readJson(path.resolve(opt("--script"))), config);
    if (problems.length) log(`script warnings: ${problems.join("; ")}`);
    script = s;
    writeJson(scriptPath, script);
  } else {
    script = await researchAndWrite({ config, history, outPath: scriptPath });
  }
  summary.topic = script.topic;
  summary.title = script.title;
  log(`topic: ${script.topic}`);

  // 2. Voiceover + word timings
  const voDir = path.join(ROOT, "public/run");
  fs.rmSync(voDir, { recursive: true, force: true });
  const py = process.env.PYTHON || "python3";
  const ttsArgs = opt("--tts") ? ["--provider", opt("--tts")] : [];
  await sh(py, ["pipeline/voiceover.py", "--script", scriptPath, "--config", "config/channel.json", "--out-dir", voDir, ...ttsArgs]);
  const timeline = readJson(path.join(voDir, "timeline.json"));
  fs.copyFileSync(path.join(voDir, "timeline.json"), path.join(runDir, "timeline.json"));

  // 3. Render
  const props = buildProps(script, timeline, config);
  const propsPath = path.join(runDir, "props.json");
  writeJson(propsPath, props);
  const videoPath = path.join(runDir, "reel.mp4");
  log("render: starting");
  const browser = process.env.REMOTION_BROWSER ? [`--browser-executable=${process.env.REMOTION_BROWSER}`] : [];
  await sh("npx", [
    "remotion", "render", "src/index.ts", "Reel", videoPath,
    `--props=${propsPath}`, "--codec=h264", "--crf=18", "--pixel-format=yuv420p",
    "--audio-codec=aac", "--audio-bitrate=192k", ...browser,
  ]);

  // 4. Check
  const check = await checkVideo(videoPath);
  summary.video = check;
  if (!check.ok) throw new Error(`render check failed: ${check.issues.join("; ")}`);
  log(`render: ok, ${check.durationSec.toFixed(1)}s, ${check.sizeMB.toFixed(1)} MB`);

  // 5. Post
  const caption = buildCaption(script, config);
  fs.writeFileSync(path.join(runDir, "caption.txt"), caption);
  if (dryRun) {
    log("dry run: not posting. Video + caption are in " + path.relative(ROOT, runDir));
    summary.status = "rendered";
    return;
  }
  const result = await publishReel({ videoPath, caption, aiLabel: config.posting?.aiLabel ?? true });
  summary.status = "posted";
  summary.instagram = result;
  log(`posted: ${result.permalink ?? result.mediaId}`);

  // 6. Remember the topic so it isn't repeated
  history.push({ date, runId, topic: script.topic, title: script.title, mediaId: result.mediaId, permalink: result.permalink });
  writeJson(historyPath, history);
};

main()
  .catch((e) => {
    summary.status = "failed";
    summary.error = String(e?.stack ?? e);
    console.error(e);
    process.exitCode = 1;
  })
  .finally(saveSummary);
