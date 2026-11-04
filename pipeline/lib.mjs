// Shared helpers for the pipeline steps.
import { spawn } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

export const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");

export const readJson = (p, fallback) => {
  try {
    return JSON.parse(fs.readFileSync(p, "utf8"));
  } catch (e) {
    if (fallback !== undefined) return fallback;
    throw e;
  }
};

export const writeJson = (p, data) => {
  fs.mkdirSync(path.dirname(p), { recursive: true });
  fs.writeFileSync(p, JSON.stringify(data, null, 2) + "\n");
};

export const log = (...a) => console.log(`[${new Date().toISOString().slice(11, 19)}]`, ...a);

export const sh = (cmd, args, opts = {}) =>
  new Promise((resolve, reject) => {
    const p = spawn(cmd, args, { stdio: opts.capture ? ["ignore", "pipe", "pipe"] : "inherit", cwd: ROOT, ...opts });
    let out = "";
    let err = "";
    if (opts.capture) {
      p.stdout.on("data", (d) => (out += d));
      p.stderr.on("data", (d) => (err += d));
    }
    p.on("error", reject);
    p.on("close", (code) =>
      code === 0 ? resolve(out) : reject(new Error(`${cmd} ${args.slice(0, 3).join(" ")} exited with ${code}\n${err.slice(-2000)}`)),
    );
  });

// Today's date in the channel's time zone, e.g. "2026-11-04".
export const localDate = (tz = "Asia/Kolkata") =>
  new Intl.DateTimeFormat("en-CA", { timeZone: tz, year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date());

const SCENE_TYPES = ["hook", "point", "stat", "list", "cta"];

// Make whatever the script step returned safe to render. Returns { script, problems }.
export const sanitizeScript = (raw, config) => {
  const problems = [];
  const str = (v, max = 400) => (typeof v === "string" ? v.replace(/\s+/g, " ").trim().slice(0, max) : "");
  const scenes = (Array.isArray(raw?.scenes) ? raw.scenes : []).map((s) => ({
    type: SCENE_TYPES.includes(s?.type) ? s.type : "point",
    voiceover: str(s?.voiceover, 600),
    kicker: str(s?.kicker, 28),
    headline: str(s?.headline, 90),
    highlight: str(s?.highlight, 40),
    body: str(s?.body, 120),
    statValue: Number.isFinite(Number(s?.statValue)) ? Number(s.statValue) : 0,
    statPrefix: str(s?.statPrefix, 3),
    statSuffix: str(s?.statSuffix, 4),
    statLabel: str(s?.statLabel, 70),
    items: (Array.isArray(s?.items) ? s.items : []).map((i) => str(i, 48)).filter(Boolean).slice(0, 5),
  }));

  const kept = scenes.filter((s) => s.voiceover && s.headline);
  if (kept.length < scenes.length) problems.push("dropped scenes with no voiceover or headline");
  if (kept.length) {
    kept[0].type = "hook";
    kept[kept.length - 1].type = "cta";
  }
  kept.forEach((s) => {
    if (s.type === "list" && s.items.length < 2) s.type = "point";
    if (s.type === "stat" && !s.statValue) s.type = "point";
    if (s.headline.length > 70) problems.push(`headline too long: "${s.headline}"`);
  });

  const { minScenes = 5, maxScenes = 7, targetSeconds = 35 } = config.reel ?? {};
  if (kept.length < minScenes || kept.length > maxScenes) problems.push(`has ${kept.length} scenes (want ${minScenes}-${maxScenes})`);
  const words = kept.reduce((n, s) => n + s.voiceover.split(/\s+/).length, 0);
  const maxWords = Math.round(targetSeconds * 3.3);
  if (words > maxWords) problems.push(`voiceover is ${words} words, too long for ~${targetSeconds}s (max ${maxWords})`);
  if (words < 35) problems.push(`voiceover is only ${words} words`);

  return {
    script: {
      topic: str(raw?.topic, 200),
      title: str(raw?.title, 120),
      angle: str(raw?.angle, 400),
      caption: typeof raw?.caption === "string" ? raw.caption.trim().slice(0, 1800) : "",
      hashtags: (Array.isArray(raw?.hashtags) ? raw.hashtags : [])
        .map((h) => "#" + String(h).replace(/[^\p{L}\p{N}_]/gu, ""))
        .filter((h) => h.length > 1),
      sources: Array.isArray(raw?.sources) ? raw.sources.slice(0, 10) : [],
      factCheck: str(raw?.factCheck, 2000),
      scenes: kept,
    },
    problems,
  };
};

// Script + voiceover timeline -> props for the Remotion composition.
export const buildProps = (script, timeline, config, audioPath = "run/vo.wav") => ({
  brand: {
    name: config.account?.name ?? "",
    handle: config.account?.handle ?? "",
    colors: config.colors ?? {},
  },
  audio: audioPath,
  music: config.reel?.music || null,
  musicVolume: config.reel?.musicVolume ?? 0.12,
  sfx: config.reel?.sfx ?? true,
  captions: config.reel?.captions ?? true,
  scenes: script.scenes.map((s, i) => ({
    type: s.type,
    kicker: s.kicker,
    headline: s.headline,
    highlight: s.highlight,
    body: s.body,
    statValue: s.statValue,
    statPrefix: s.statPrefix,
    statSuffix: s.statSuffix,
    statLabel: s.statLabel,
    items: s.items,
    startMs: timeline.scenes[i].startMs,
    endMs: timeline.scenes[i].endMs,
  })),
  words: timeline.words,
  durationMs: timeline.durationMs,
});

export const buildCaption = (script, config) => {
  const fixed = config.posting?.fixedHashtags ?? [];
  const max = config.posting?.maxHashtags ?? 5;
  const tags = [...new Set([...script.hashtags, ...fixed.map((t) => (t.startsWith("#") ? t : "#" + t))])].slice(0, max);
  return [script.caption, tags.join(" ")].filter(Boolean).join("\n\n").slice(0, 2200);
};

// Basic sanity checks on the rendered file before it goes anywhere.
export const checkVideo = async (file) => {
  const out = await sh("ffprobe", ["-v", "error", "-print_format", "json", "-show_format", "-show_streams", file], {
    capture: true,
  });
  const info = JSON.parse(out);
  const v = info.streams.find((s) => s.codec_type === "video");
  const a = info.streams.find((s) => s.codec_type === "audio");
  const dur = Number(info.format.duration);
  const size = Number(info.format.size);
  const issues = [];
  if (!v || v.width !== 1080 || v.height !== 1920) issues.push("video is not 1080x1920");
  if (!a) issues.push("no audio track");
  if (!(dur >= 5 && dur <= 90)) issues.push(`duration ${dur.toFixed(1)}s outside 5–90s`);
  if (size > 300 * 1024 * 1024) issues.push("file larger than 300MB");
  return { ok: issues.length === 0, issues, durationSec: dur, sizeMB: size / 1024 / 1024 };
};
