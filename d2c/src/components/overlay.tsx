import React, { useMemo } from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { SceneTiming } from "../lib/timeline";
import { C, theme } from "../theme";
import { Logo, clamp } from "./kit";

/** Violet progress bar, tag pill and small logo. */
export const TopBar: React.FC<{ tag: string }> = ({ tag }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const p = spring({ frame: frame - 2, fps, config: theme.spring.smooth });
  const blink = 0.55 + 0.45 * Math.abs(Math.sin(frame / 9));
  const prog = interpolate(frame, [0, durationInFrames - 1], [0, 1], clamp);
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div style={{ position: "absolute", left: 0, top: 0, height: 12, width: 1080, background: "rgba(109,74,253,0.15)" }} />
      <div style={{ position: "absolute", left: 0, top: 0, height: 12, width: 1080 * prog, background: theme.grad.violet }} />
      <div
        style={{
          position: "absolute",
          left: theme.layout.padX,
          right: theme.layout.padX,
          top: 168,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          opacity: p,
          transform: `translateY(${interpolate(p, [0, 1], [-24, 0])}px)`,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 14,
            background: C.white,
            border: `3px solid ${C.navy}`,
            borderRadius: 999,
            padding: "12px 24px 12px 20px",
            fontFamily: theme.fonts.body,
            fontWeight: 800,
            fontSize: 30,
            letterSpacing: "0.1em",
            color: C.navy,
            boxShadow: `5px 5px 0 ${C.navy}`,
          }}
        >
          <div style={{ width: 18, height: 18, borderRadius: "50%", background: C.red, opacity: blink }} />
          {tag}
        </div>
        <Logo width={170} />
      </div>
    </AbsoluteFill>
  );
};

type CW = { d: string; hl: boolean; s: number };
type Chunk = { words: CW[]; from: number; to: number };

const buildChunks = (scenes: SceneTiming[], fps: number): Chunk[] => {
  const out: Chunk[] = [];
  for (const sc of scenes) {
    const ws = sc.words;
    const mine: Chunk[] = [];
    let cur: typeof ws = [];
    const flush = () => {
      if (!cur.length) return;
      mine.push({ words: cur.map((w) => ({ d: w.d, hl: w.hl, s: Math.round((sc.start + w.s) * fps) })), from: Math.round((sc.start + cur[0].s) * fps), to: -1 });
      cur = [];
    };
    ws.forEach((w, i) => {
      const len = cur.reduce((a, x) => a + x.d.length + 1, 0);
      if (cur.length >= 3 || (cur.length >= 1 && len + w.d.length > 17)) flush();
      cur.push(w);
      if (w.p && /[,.:?!]/.test(w.p)) flush();
      if (i === ws.length - 1) flush();
    });
    const lastWordEnd = Math.round((sc.start + ws[ws.length - 1].e) * fps);
    mine.forEach((c, i) => {
      c.to = i < mine.length - 1 ? mine[i + 1].from : lastWordEnd + 8;
    });
    out.push(...mine);
  }
  return out;
};

/** Roman captions, 2–3 words. Karaoke: each word lights up as it is spoken; key words get a lavender pill. */
export const Captions: React.FC<{ scenes: SceneTiming[]; karaoke?: boolean; top?: number }> = ({ scenes, karaoke = false, top }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const chunks = useMemo(() => buildChunks(scenes, fps), [scenes, fps]);
  const c = chunks.find((x) => frame >= x.from && frame < x.to);
  if (!c) return null;
  const local = frame - c.from;
  const p = spring({ frame: local, fps, config: theme.spring.snappy });
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div
        style={{
          position: "absolute",
          left: 60,
          right: 60,
          top: top ?? theme.layout.captionY,
          display: "flex",
          justifyContent: "center",
          flexWrap: "wrap",
          columnGap: 20,
          rowGap: 4,
          transform: `translateY(${interpolate(p, [0, 1], [18, 0])}px) scale(${interpolate(p, [0, 1], [0.9, 1])})`,
          opacity: interpolate(p, [0, 0.5], [0, 1], clamp),
        }}
      >
        {c.words.map((w, i) => {
          const spoken = !karaoke || frame >= w.s - 1;
          const wp = spring({ frame: frame - w.s + 1, fps, config: theme.spring.snappy });
          const hp = karaoke
            ? spring({ frame: frame - w.s, fps, config: theme.spring.smooth })
            : spring({ frame: local - 4 - i * 2, fps, config: theme.spring.smooth });
          const pop = karaoke ? 1 + 0.08 * Math.sin(Math.PI * Math.min(1, Math.max(0, wp))) : 1;
          return (
            <span
              key={i}
              style={{
                position: "relative",
                display: "inline-block",
                fontFamily: theme.fonts.display,
                fontWeight: 700,
                fontSize: 70,
                lineHeight: 1.15,
                letterSpacing: "-0.015em",
                color: spoken ? C.navy : "#B7ACDB",
                WebkitTextStroke: w.hl && spoken ? undefined : `12px ${C.white}`,
                paintOrder: "stroke fill",
                padding: w.hl ? "0 14px" : 0,
                transform: `scale(${pop})`,
              }}
            >
              {w.hl && (
                <span
                  style={{
                    position: "absolute",
                    inset: "6px 0 2px 0",
                    background: C.lavender,
                    border: `3px solid ${C.white}`,
                    borderRadius: 18,
                    transform: `scaleX(${spoken ? hp : 0}) rotate(-1.5deg)`,
                    transformOrigin: "left center",
                    boxShadow: "0 8px 20px -10px rgba(18,4,75,0.4)",
                  }}
                />
              )}
              <span style={{ position: "relative" }}>{w.d}</span>
            </span>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
