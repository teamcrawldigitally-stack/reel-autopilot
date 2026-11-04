// Builds one Astro 24x7 reel from a script file: voiceover -> props -> render -> check.
//   node pipeline/make-astro-reel.mjs samples/astro-reel1.json [out-name] [--stills 30,120]
import fs from "node:fs";
import path from "node:path";
import { checkVideo, log, readJson, ROOT, sh, writeJson } from "./lib.mjs";

const args = process.argv.slice(2);
const scriptPath = path.resolve(args[0] ?? "samples/astro-reel1.json");
const name = args[1] && !args[1].startsWith("--") ? args[1] : path.basename(scriptPath, ".json");
const stillsIdx = args.indexOf("--stills");
const stills = stillsIdx >= 0 ? args[stillsIdx + 1] : null;
const skipVoice = args.includes("--skip-voice");
const clipsIdx = args.indexOf("--clips");
const clipsDir = clipsIdx >= 0 ? path.resolve(args[clipsIdx + 1]) : null;
const compIdx = args.indexOf("--comp");

const config = readJson(path.join(ROOT, "config/pages/astro24x7.json"));
const script = readJson(scriptPath);
const voDir = path.join(ROOT, "public/astro", name);
const outDir = path.join(ROOT, "runs/astro", name);
fs.mkdirSync(outDir, { recursive: true });

if (!skipVoice || !fs.existsSync(path.join(voDir, "timeline.json"))) {
  fs.rmSync(voDir, { recursive: true, force: true });
  await sh(process.env.PYTHON || "python3", ["pipeline/voiceover.py", "--script", scriptPath, "--config", "config/pages/astro24x7.json", "--out-dir", voDir, ...(clipsDir ? ["--clips-dir", clipsDir] : [])]);
}
const timeline = readJson(path.join(voDir, "timeline.json"));
const comp = compIdx >= 0 ? args[compIdx + 1] : script.composition ?? config.composition ?? "AstroReel";

const props = {
  audio: `astro/${name}/vo.wav`,
  music: script.music ?? config.reel?.music ?? null,
  musicVolume: script.musicVolume ?? config.reel?.musicVolume ?? 0.3,
  sfx: config.reel?.sfx ?? true,
  captions: config.reel?.captions ?? true,
  scenes: script.scenes.map((s, i) => ({ ...s, startMs: timeline.scenes[i].startMs, endMs: timeline.scenes[i].endMs })),
  words: timeline.words,
  durationMs: timeline.durationMs,
  header: script.header ?? null,
  mouth: timeline.mouth ?? [],
  floats: script.floats ?? null,
  images: Object.fromEntries(
    (script.images ?? []).map((k) => {
      const ext = ["jpg", "jpeg", "png", "webp"].find((e) => fs.existsSync(path.join(ROOT, "public/devo/img", `${k}.${e}`)));
      return [k, ext ? `devo/img/${k}.${ext}` : null];
    }),
  ),
};
const propsPath = path.join(outDir, "props.json");
writeJson(propsPath, props);
const sampleFile = { AstroReel: "src/astro-sample-props.json", PaperReel: "src/paper-sample-props.json", ToonReel: "src/toon-sample-props.json", DevoReel: "src/devo-sample-props.json" }[comp];
if (sampleFile) writeJson(path.join(ROOT, sampleFile), props);

const browser = process.env.REMOTION_BROWSER ? [`--browser-executable=${process.env.REMOTION_BROWSER}`] : [];
if (stills) {
  await sh("npx", ["remotion", "render", "src/index.ts", comp, path.join(outDir, "stills"), `--props=${propsPath}`, `--frames=${stills}`, "--image-format=png", "--scale=0.5", ...browser]);
  log(`stills in ${path.relative(ROOT, outDir)}/stills`);
} else {
  const video = path.join(outDir, `${name}.mp4`);
  const raw = path.join(outDir, `${name}.raw.mp4`);
  await sh("npx", ["remotion", "render", "src/index.ts", comp, raw, `--props=${propsPath}`, "--codec=h264", "--crf=18", "--pixel-format=yuv420p", "--audio-codec=aac", "--audio-bitrate=192k", ...browser]);
  // Master the final mix (voice + music + SFX) to -14 LUFS with peaks under -1.5 dB, video untouched.
  await sh("ffmpeg", ["-y", "-v", "error", "-i", raw, "-c:v", "copy", "-af", "loudnorm=I=-14:TP=-1.5:LRA=11", "-ar", "48000", "-c:a", "aac", "-b:a", "192k", "-movflags", "+faststart", video]);
  fs.rmSync(raw, { force: true });
  const check = await checkVideo(video);
  log(`render ${check.ok ? "ok" : "FAILED"}: ${check.durationSec.toFixed(1)}s, ${check.sizeMB.toFixed(1)} MB ${check.issues.join("; ")}`);
  const tags = [...(script.hashtags ?? []).map((t) => "#" + t), ...(config.posting?.fixedHashtags ?? [])].slice(0, config.posting?.maxHashtags ?? 5);
  fs.writeFileSync(path.join(outDir, "caption.txt"), [script.caption, tags.join(" ")].filter(Boolean).join("\n\n"));
}
