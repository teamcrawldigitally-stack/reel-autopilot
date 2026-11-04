// Synthesizes a tiny SFX kit (whoosh + bass hit) into public/sfx as 16-bit WAVs.
// Deterministic, no downloads. Run once: `npm run sfx`.
import fs from "node:fs";
import path from "node:path";

const RATE = 48000;
const outDir = path.resolve("public/sfx");
fs.mkdirSync(outDir, { recursive: true });

const writeWav = (file, samples) => {
  const data = Buffer.alloc(samples.length * 2);
  samples.forEach((s, i) => data.writeInt16LE(Math.max(-1, Math.min(1, s)) * 32767, i * 2));
  const h = Buffer.alloc(44);
  h.write("RIFF", 0);
  h.writeUInt32LE(36 + data.length, 4);
  h.write("WAVE", 8);
  h.write("fmt ", 12);
  h.writeUInt32LE(16, 16);
  h.writeUInt16LE(1, 20);
  h.writeUInt16LE(1, 22);
  h.writeUInt32LE(RATE, 24);
  h.writeUInt32LE(RATE * 2, 28);
  h.writeUInt16LE(2, 32);
  h.writeUInt16LE(16, 34);
  h.write("data", 36);
  h.writeUInt32LE(data.length, 40);
  fs.writeFileSync(path.join(outDir, file), Buffer.concat([h, data]));
};

// Seeded noise so the files are identical every run.
let seed = 1234567;
const rnd = () => ((seed = (seed * 1103515245 + 12345) & 0x7fffffff) / 0x7fffffff) * 2 - 1;

// Whoosh: band-limited noise sweeping up then down, swelling into the cut.
{
  const dur = 0.55;
  const n = Math.floor(RATE * dur);
  const out = new Float32Array(n);
  let lp = 0;
  let lp2 = 0;
  for (let i = 0; i < n; i++) {
    const t = i / n;
    const env = Math.pow(Math.sin(Math.PI * Math.pow(t, 0.8)), 2.2);
    const cutoff = 0.02 + 0.18 * Math.sin(Math.PI * t); // one-pole coefficient sweep
    lp += cutoff * (rnd() - lp);
    lp2 += cutoff * (lp - lp2);
    out[i] = (lp - lp2 * 0.6) * env * 3.2;
  }
  writeWav("whoosh.wav", out);
}

// Hit: sub-bass thump with a short click on top.
{
  const dur = 0.7;
  const n = Math.floor(RATE * dur);
  const out = new Float32Array(n);
  let phase = 0;
  for (let i = 0; i < n; i++) {
    const t = i / RATE;
    const freq = 42 + 60 * Math.exp(-t * 18);
    phase += (2 * Math.PI * freq) / RATE;
    const body = Math.sin(phase) * Math.exp(-t * 5.5);
    const click = t < 0.012 ? rnd() * (1 - t / 0.012) * 0.5 : 0;
    out[i] = (body * 0.9 + click) * 0.9;
  }
  writeWav("hit.wav", out);
}

// Singing bowl: inharmonic partials with long, slightly beating decays.
{
  const dur = 4.5;
  const n = Math.floor(RATE * dur);
  const out = new Float32Array(n);
  const partials = [
    [220, 1.0, 1.1],
    [221.8, 0.5, 1.0],
    [598, 0.42, 1.8],
    [1121, 0.22, 2.6],
    [1786, 0.1, 3.4],
  ];
  for (let i = 0; i < n; i++) {
    const t = i / RATE;
    const attack = Math.min(1, t / 0.008);
    let s = 0;
    for (const [f, a, d] of partials) s += a * Math.sin(2 * Math.PI * f * t) * Math.exp(-t * d);
    out[i] = s * attack * 0.32;
  }
  writeWav("bowl.wav", out);
}

// Pop: short pitch-drop blip for stamps and badges.
{
  const dur = 0.18;
  const n = Math.floor(RATE * dur);
  const out = new Float32Array(n);
  let phase = 0;
  for (let i = 0; i < n; i++) {
    const t = i / RATE;
    const f = 900 * Math.exp(-t * 22) + 180;
    phase += (2 * Math.PI * f) / RATE;
    out[i] = Math.sin(phase) * Math.exp(-t * 26) * 0.7;
  }
  writeWav("pop.wav", out);
}

// Drone: soft devotional pad (Sa–Pa–Sa) with slow swells, 75 s so it covers any reel.
{
  const dur = 75;
  const n = Math.floor(RATE * dur);
  const out = new Float32Array(n);
  const voices = [
    [110, 0.5],
    [110.35, 0.35],
    [164.8, 0.3],
    [220, 0.22],
    [219.6, 0.16],
    [329.6, 0.06],
  ];
  for (let i = 0; i < n; i++) {
    const t = i / RATE;
    const swell = 0.75 + 0.25 * Math.sin((2 * Math.PI * t) / 9);
    const fade = Math.min(1, t / 2.5) * Math.min(1, (dur - t) / 3);
    let s = 0;
    for (const [f, a] of voices) s += a * Math.sin(2 * Math.PI * f * t + Math.sin(t * 0.7) * 0.4);
    out[i] = s * swell * fade * 0.11;
  }
  writeWav("drone.wav", out);
}

// Riser: noise + rising tone that builds for 1.2 s into a reveal.
{
  const dur = 1.2;
  const n = Math.floor(RATE * dur);
  const out = new Float32Array(n);
  let phase = 0;
  let lp = 0;
  for (let i = 0; i < n; i++) {
    const t = i / RATE;
    const k = t / dur;
    const f = 180 * Math.pow(6, k);
    phase += (2 * Math.PI * f) / RATE;
    const cutoff = 0.02 + 0.3 * k * k;
    lp += cutoff * (rnd() - lp);
    const env = Math.pow(k, 2.2) * (k > 0.97 ? (1 - k) / 0.03 : 1);
    out[i] = (Math.sin(phase) * 0.35 + lp * 1.6) * env * 0.55;
  }
  writeWav("riser.wav", out);
}

// Sparkle: three quick bell tones for reveals.
{
  const dur = 0.9;
  const n = Math.floor(RATE * dur);
  const out = new Float32Array(n);
  const notes = [
    [0.0, 1568],
    [0.06, 2093],
    [0.12, 2637],
  ];
  for (let i = 0; i < n; i++) {
    const t = i / RATE;
    let s = 0;
    for (const [at, f] of notes) {
      if (t < at) continue;
      const u = t - at;
      s += (Math.sin(2 * Math.PI * f * u) + 0.3 * Math.sin(2 * Math.PI * f * 2.01 * u)) * Math.exp(-u * 7) * Math.min(1, u / 0.003);
    }
    out[i] = s * 0.22;
  }
  writeWav("sparkle.wav", out);
}

console.log(`SFX written to ${outDir}`);
