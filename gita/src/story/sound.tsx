// Sound design for the music-free ("movie sound") story reels: ambience beds that duck under the voice, plus one-shot hits.
import React from "react";
import { Audio, Sequence, interpolate, staticFile } from "remotion";
import type { Timing } from "../lib/timeline";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

/** Per-frame 0..1 "voice is speaking" envelope for the whole reel, built from each scene's mouth curve. */
export const buildDuck = (timing: Timing & { scenes: { mouth?: number[] }[] }) => {
  const fps = timing.fps;
  const total = Math.ceil(timing.total * fps) + 2;
  const raw = new Float32Array(total);
  for (const s of timing.scenes) {
    const from = Math.round(s.start * fps);
    (s.mouth ?? []).forEach((m, i) => {
      if (from + i < total) raw[from + i] = m > 0.08 ? 1 : 0;
    });
  }
  // Hold through short gaps between words, then smooth so the bed glides instead of pumping.
  const held = new Float32Array(total);
  for (let f = 0; f < total; f++) {
    let v = 0;
    for (let k = -4; k <= 9; k++) v = Math.max(v, raw[Math.min(total - 1, Math.max(0, f + k))]);
    held[f] = v;
  }
  const out = new Float32Array(total);
  for (let f = 0; f < total; f++) {
    let sum = 0;
    for (let k = -6; k <= 6; k++) sum += held[Math.min(total - 1, Math.max(0, f + k))];
    out[f] = sum / 13;
  }
  return out;
};

/** A looping ambience bed. `levels` is a piecewise-linear volume curve over global frames: [[frame, volume], ...]. */
export const Bed: React.FC<{ src: string; levels: [number, number][]; duck: Float32Array; depth?: number; total: number }> = ({ src, levels, duck, depth = 0.45, total }) => {
  const fs = levels.map((l) => l[0]);
  const vs = levels.map((l) => l[1]);
  return (
    <Sequence from={0} durationInFrames={total} layout="none">
      <Audio
        src={staticFile(src)}
        loop
        volume={(f) => {
          const base = interpolate(f, fs, vs, clamp);
          return Math.max(0, base * (1 - depth * (duck[f] ?? 0)));
        }}
      />
    </Sequence>
  );
};

/** A one-shot sound effect at a global frame. */
export const Hit: React.FC<{ src: string; at: number; vol: number; dur?: number }> = ({ src, at, vol, dur = 120 }) => (
  <Sequence from={Math.max(0, at)} durationInFrames={dur} layout="none">
    <Audio src={staticFile(src)} volume={vol} />
  </Sequence>
);

/** "A few sounds" for a story reel (used together with a quiet music bed): soft ambience beds over chosen scenes + a couple of hits. */
type TLLike = { sceneFrames: (id: string) => { from: number; dur: number }; totalFrames: number };
export type BedSpan = { src: string; scenes: string[]; vol: number; depth?: number };
export type HitSpec = { src: string; at: number; vol: number; dur?: number };
export const StorySound: React.FC<{ TL: TLLike; duck: Float32Array; beds: BedSpan[]; hits?: HitSpec[] }> = ({ TL, duck, beds, hits = [] }) => {
  const T = TL.totalFrames;
  return (
    <>
      {beds.map((b, i) => {
        const a = TL.sceneFrames(b.scenes[0]).from;
        const last = TL.sceneFrames(b.scenes[b.scenes.length - 1]);
        const e = last.from + last.dur;
        return <Bed key={`b${i}`} src={b.src} duck={duck} depth={b.depth} total={T} levels={[[a - 8, 0], [a + 12, b.vol], [e - 10, b.vol], [e + 6, 0]]} />;
      })}
      {hits.map((h, i) => (
        <Hit key={`h${i}`} src={h.src} at={h.at} vol={h.vol} dur={h.dur} />
      ))}
    </>
  );
};
