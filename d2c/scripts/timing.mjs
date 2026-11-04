// Builds the voice track and src/timing.json.
// Each scene has lines (one TTS clip per sentence). For each line clip in
// public/vo/lines/<scene>_<i>.wav: trim silence, detect inner pauses, spread
// words by syllable weight between pauses that match punctuation.
// Then joins the line clips (with short gaps) into public/vo/<scene>.wav.
import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const reel = process.argv[2];
if (!reel) { console.error("usage: node scripts/timing.mjs <reel-id>"); process.exit(1); }
const reelDir = path.join(root, "src/reels", reel);
const voDir = path.join(root, "public", reel, "vo");
const script = JSON.parse(fs.readFileSync(path.join(reelDir, "script.json"), "utf8"));
const SR = 44100;
let LEAD = 0.1; // before the first line of a scene
let GAP = 0.16; // between lines
let TAIL = 0.3; // after the last line, before the next scene
let END_HOLD = 1.4; // extra at the very end
if (script.timing) { GAP = script.timing.gap ?? GAP; TAIL = script.timing.tail ?? TAIL; END_HOLD = script.timing.endHold ?? END_HOLD; LEAD = script.timing.lead ?? LEAD; }
const PAUSE_S = { ",": 0.16, ":": 0.2, ".": 0.3, "?": 0.3, "!": 0.3 };
const SYL_PER_SEC = 5.2; // only for the no-audio estimate

const syllables = (w) => Math.max(1, (w.toLowerCase().match(/[aeiouy]+/g) || []).length);

function tokenize(roman) {
  return roman.split(/\s+/).filter(Boolean).map((raw) => {
    let hl = false;
    if (raw.startsWith("*")) { hl = true; raw = raw.slice(1); }
    const pm = raw.match(/[,.:?!]+$/);
    const punct = pm ? pm[0] : "";
    if (pm) raw = raw.slice(0, -punct.length);
    let [display, spoken] = raw.split("|");
    spoken = spoken ?? display;
    display = display.replace(/_/g, " ");
    spoken = spoken.replace(/_/g, " ");
    if (punct.includes("?")) display += "?";
    const weight = spoken.split(" ").reduce((a, w) => a + syllables(w), 0) + 0.35;
    return { d: display, sp: spoken.toLowerCase(), hl, punct, weight };
  });
}

const dur = (f) => parseFloat(execFileSync("ffprobe", ["-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", f]).toString());

function pausesOf(file) {
  const log = execFileSync("bash", ["-c", `ffmpeg -hide_banner -i "${file}" -af silencedetect=noise=-32dB:d=0.07 -f null - 2>&1`]).toString();
  const out = [];
  let cur = null;
  for (const line of log.split("\n")) {
    const s = line.match(/silence_start: ([\d.]+)/);
    const e = line.match(/silence_end: ([\d.]+)/);
    if (s) cur = { s: parseFloat(s[1]) };
    if (e && cur) { cur.e = parseFloat(e[1]); out.push(cur); cur = null; }
  }
  return out;
}

function trim(src, dst) {
  execFileSync("ffmpeg", [
    "-v", "error", "-y", "-i", src, "-af",
    "silenceremove=start_periods=1:start_threshold=-45dB:start_silence=0.04,areverse,silenceremove=start_periods=1:start_threshold=-45dB:start_silence=0.06,areverse",
    "-ar", String(SR), "-ac", "1", "-c:a", "pcm_s16le", dst,
  ]);
}

// Words between start/end, anchored at pauses that match punctuation.
function layout(tokens, start, end, pauses) {
  const n = tokens.length;
  const pu = (t) => (PAUSE_S[t.punct.slice(-1)] ?? 0) * SYL_PER_SEC;
  const total = tokens.reduce((a, t) => a + t.weight + pu(t), 0);
  let acc = 0;
  const pred = tokens.map((t) => { acc += t.weight; const v = acc; acc += pu(t); return v; });
  const toT = (u) => start + (u / total) * (end - start);
  const inner = pauses.filter((p) => p.s > start + 0.05 && p.e < end - 0.03);
  const anchors = [];
  let last = -1;
  tokens.forEach((t, i) => {
    if (!t.punct || i === n - 1) return;
    const g = toT(pred[i]);
    let best = -1, bd = 0.7;
    inner.forEach((p, j) => { if (j > last && Math.abs(p.s - g) < bd) { bd = Math.abs(p.s - g); best = j; } });
    if (best >= 0) { last = best; anchors.push({ i, s: inner[best].s, e: inner[best].e }); }
  });
  const words = new Array(n);
  let si = 0, st = start;
  for (const a of [...anchors, { i: n - 1, s: end, e: end }]) {
    const toks = tokens.slice(si, a.i + 1);
    const w = toks.reduce((x, t) => x + t.weight, 0);
    let t0 = st;
    toks.forEach((t, k) => { const len = ((a.s - st) * t.weight) / w; words[si + k] = { s: t0, e: t0 + len }; t0 += len; });
    si = a.i + 1; st = a.e;
  }
  return { words, anchors: anchors.length, pauses: inner.length };
}

const out = { fps: 30, scenes: [], total: 0 };
let T = 0;
fs.mkdirSync(path.join(voDir, "lines"), { recursive: true });
for (const [si, sc] of script.scenes.entries()) {
  let t = LEAD;
  const words = [];
  const parts = []; // [file, silenceBefore]
  let allAudio = true;
  let info = [];
  for (const [li, line] of sc.lines.entries()) {
    const tokens = tokenize(line.roman);
    const raw = path.join(voDir, "lines", `${sc.id}_${li}.wav`);
    const gapBefore = li === 0 ? 0 : line.gapBefore ?? sc.lines[li - 1].gapAfter ?? GAP;
    t += gapBefore;
    if (fs.existsSync(raw)) {
      const trimmed = path.join(voDir, "lines", `${sc.id}_${li}.trim.wav`);
      trim(raw, trimmed);
      const d = dur(trimmed);
      const res = layout(tokens, 0.02, d - 0.03, pausesOf(trimmed));
      res.words.forEach((w, i) => words.push({ tk: tokens[i], s: t + w.s, e: t + w.e }));
      parts.push([trimmed, gapBefore + (li === 0 ? LEAD : 0)]);
      info.push(`${d.toFixed(2)}s/${res.anchors}a`);
      t += d;
    } else {
      allAudio = false;
      const res = layout(tokens, 0, tokens.reduce((a, x) => a + x.weight / SYL_PER_SEC + (PAUSE_S[x.punct.slice(-1)] ?? 0), 0), []);
      res.words.forEach((w, i) => words.push({ tk: tokens[i], s: t + w.s, e: t + w.e }));
      t += res.words[res.words.length - 1].e;
    }
  }
  let sceneDur = t + TAIL + (si === script.scenes.length - 1 ? END_HOLD : 0);
  let audio = null;
  if (allAudio && parts.length) {
    // join: silence + clip + silence + clip ...
    const args = ["-v", "error", "-y"];
    const filters = [];
    let k = 0;
    parts.forEach(([f, sil], i) => {
      args.push("-f", "lavfi", "-t", sil.toFixed(3), "-i", `anullsrc=r=${SR}:cl=mono`);
      args.push("-i", f);
      filters.push(`[${k}:a][${k + 1}:a]`);
      k += 2;
    });
    args.push("-filter_complex", `${filters.join("")}concat=n=${k}:v=0:a=1[a]`, "-map", "[a]", "-ar", String(SR), "-ac", "1", "-c:a", "pcm_s16le");
    const dst = path.join(voDir, `${sc.id}.wav`);
    execFileSync("ffmpeg", [...args, dst + ".tmp.wav"]);
    fs.renameSync(dst + ".tmp.wav", dst);
    audio = `${reel}/vo/${sc.id}.wav`;
  }
  let mouth = null;
  if (audio) {
    const raw = execFileSync("ffmpeg", ["-v", "error", "-i", path.join(voDir, `${sc.id}.wav`), "-f", "s16le", "-ac", "1", "-ar", "16000", "-"], { maxBuffer: 1 << 28 });
    const samples = new Int16Array(raw.buffer, raw.byteOffset, Math.floor(raw.length / 2));
    const per = 16000 / 30;
    const n = Math.ceil(sceneDur * 30);
    const rms = [];
    for (let f = 0; f < n; f++) {
      let acc = 0, c = 0;
      for (let i = Math.floor(f * per); i < Math.min(samples.length, Math.floor((f + 1) * per)); i++) { acc += samples[i] * samples[i]; c++; }
      rms.push(c ? Math.sqrt(acc / c) / 32768 : 0);
    }
    const sorted = [...rms].filter((v) => v > 0.005).sort((a, b) => a - b);
    const ref = sorted.length ? sorted[Math.floor(sorted.length * 0.9)] : 1;
    mouth = rms.map((v) => +Math.min(1, v / ref).toFixed(2));
  }
  out.scenes.push({
    id: sc.id,
    start: +T.toFixed(3),
    dur: +sceneDur.toFixed(3),
    audio,
    mouth,
    words: words.map(({ tk, s, e }) => ({ d: tk.d, sp: tk.sp, hl: tk.hl, p: tk.punct, s: +s.toFixed(3), e: +e.toFixed(3) })),
  });
  console.log(sc.id, sceneDur.toFixed(2) + "s", audio ? info.join(" ") : "estimated");
  T += sceneDur;
}
out.total = +T.toFixed(3);
fs.writeFileSync(path.join(reelDir, "timing.json"), JSON.stringify(out, null, 1));
console.log("total", T.toFixed(2) + "s");
