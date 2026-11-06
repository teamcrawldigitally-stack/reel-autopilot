import React from "react";
import { AbsoluteFill, Audio, Sequence, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { G, theme } from "../theme";
import { clamp, deva, ease, label } from "./kit";

export const HANDLE = "@gita.shlok.series";

/** Night-indigo sheet, drifting gold grid, ruler, corner marks and the sheet tag. */
export const SheetBg: React.FC<{ tag?: string }> = ({ tag }) => {
  const frame = useCurrentFrame();
  const drift = frame * 0.25;
  const gx = Math.sin(frame / 80) * 70;
  const gy = Math.cos(frame / 95) * 60;
  const minor = "rgba(242,184,75,0.045)";
  const major = "rgba(242,184,75,0.09)";
  return (
    <AbsoluteFill style={{ background: `radial-gradient(ellipse 90% 70% at 50% 42%, ${G.bgCenter} 0%, ${G.bgMid} 55%, ${G.ink} 100%)` }}>
      <div
        style={{
          position: "absolute",
          width: 1100,
          height: 1100,
          left: -10 + gx,
          top: 420 + gy,
          borderRadius: "50%",
          filter: "blur(90px)",
          background: "radial-gradient(circle, rgba(242,184,75,0.16), transparent 65%)",
        }}
      />
      <AbsoluteFill
        style={{
          backgroundImage: `linear-gradient(${minor} 1.5px, transparent 1.5px), linear-gradient(90deg, ${minor} 1.5px, transparent 1.5px), linear-gradient(${major} 2px, transparent 2px), linear-gradient(90deg, ${major} 2px, transparent 2px)`,
          backgroundSize: "36px 36px, 36px 36px, 180px 180px, 180px 180px",
          backgroundPosition: `0 ${drift}px, 0 ${drift}px, 0 ${drift}px, 0 ${drift}px`,
        }}
      />
      {Array.from({ length: 54 }).map((_, i) => (
        <div
          key={i}
          style={{ position: "absolute", left: 0, top: ((i * 36 + drift) % 1944) - 12, width: i % 5 === 0 ? 30 : 14, height: 2, background: "rgba(242,184,75,0.26)" }}
        />
      ))}
      {[
        [60, 262],
        [1020, 262],
        [60, 1590],
        [1020, 1590],
      ].map(([x, y], i) => (
        <div key={i} style={{ position: "absolute", left: x - 16, top: y - 16, width: 32, height: 32 }}>
          <div style={{ position: "absolute", left: 15, top: 0, width: 2, height: 32, background: G.lineSoft }} />
          <div style={{ position: "absolute", top: 15, left: 0, height: 2, width: 32, background: G.lineSoft }} />
        </div>
      ))}
      {tag && <div style={{ position: "absolute", left: 84, top: 1556, ...label(20, "rgba(255,236,205,0.32)") }}>{tag}</div>}
    </AbsoluteFill>
  );
};

/** Progress bar + series pill (left) + handle (right). */
export const SeriesBar: React.FC<{ ep: string }> = ({ ep }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const p = spring({ frame: frame + 20, fps, config: theme.spring.smooth }); // already settled on frame 0
  const glow = 0.55 + 0.45 * Math.abs(Math.sin(frame / 9));
  const prog = interpolate(frame, [0, durationInFrames - 1], [0, 1], clamp);
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div style={{ position: "absolute", left: 0, top: 0, height: 12, width: 1080, background: "rgba(242,184,75,0.14)" }} />
      <div style={{ position: "absolute", left: 0, top: 0, height: 12, width: 1080 * prog, background: theme.grad.gold }} />
      <div style={{ position: "absolute", left: 84, right: 84, top: 164, display: "flex", justifyContent: "space-between", alignItems: "center", opacity: p }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 14,
            background: "rgba(7,8,24,0.72)",
            border: `2.5px solid ${G.line}`,
            borderRadius: 999,
            padding: "8px 28px 6px 20px",
          }}
        >
          <div style={{ width: 18, height: 18, borderRadius: "50%", background: G.saffron, opacity: glow, boxShadow: `0 0 16px ${G.saffron}` }} />
          <div style={deva(38, G.cream, 700)}>गीता श्लोक सीरीज़</div>
          <div style={{ ...deva(38, G.gold, 800), fontFamily: theme.fonts.num }}>· {ep}</div>
        </div>
        <div style={label(22, G.dim)}>{HANDLE}</div>
      </div>
    </AbsoluteFill>
  );
};

/** "FIG. n · title" heading (Devanagari title). */
export const FigLabel: React.FC<{ n: number; text: string; at?: number }> = ({ n, text, at = 0 }) => {
  const frame = useCurrentFrame();
  const p = ease(frame, at, at + 14);
  return (
    <div style={{ position: "absolute", left: 84, top: 282, display: "flex", alignItems: "center", gap: 16, opacity: p, transform: `translateX(${(1 - p) * -40}px)` }}>
      <div style={{ ...label(24, G.ink), background: G.gold, borderRadius: 8, padding: "8px 12px 6px" }}>FIG. {n}</div>
      <div style={deva(36, G.dim, 700)}>{text}</div>
      <div style={{ width: 120 * p, height: 2, background: G.lineSoft }} />
    </div>
  );
};

const NOISE = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='220' height='220'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/%3E%3C/filter%3E%3Crect width='220' height='220' filter='url(%23n)' opacity='0.5'/%3E%3C/svg%3E")`;

export const Finish: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <>
      <AbsoluteFill style={{ pointerEvents: "none", backgroundColor: G.gold, mixBlendMode: "soft-light", opacity: 0.08 }} />
      <AbsoluteFill
        style={{
          pointerEvents: "none",
          backgroundImage: NOISE,
          backgroundSize: "220px",
          backgroundPosition: `${(frame * 7) % 220}px ${(frame * 13) % 220}px`,
          opacity: 0.07,
          mixBlendMode: "overlay",
        }}
      />
      <AbsoluteFill style={{ pointerEvents: "none", background: "radial-gradient(ellipse at center, transparent 55%, rgba(3,3,12,0.55) 100%)" }} />
    </>
  );
};

/** Gold swipe that hides each scene cut. */
export const Swipes: React.FC<{ at: number[] }> = ({ at }) => (
  <>
    {at.map((b, i) => (
      <Sequence key={i} from={Math.max(0, b - 8)} durationInFrames={17} layout="none">
        <Swipe dir={i % 2 === 0 ? 1 : -1} />
        <Audio src={staticFile("sfx/whoosh.wav")} volume={0.4 * theme.audio.sfxGain} />
      </Sequence>
    ))}
  </>
);

const Swipe: React.FC<{ dir: 1 | -1 }> = ({ dir }) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [0, 16], [0, 1], { ...clamp, easing: theme.ease.inOut });
  const left = dir === 1 ? interpolate(p, [0, 1], [1180, -1700]) : interpolate(p, [0, 1], [-1700, 1180]);
  return (
    <AbsoluteFill style={{ pointerEvents: "none", overflow: "hidden" }}>
      <div
        style={{
          position: "absolute",
          top: -300,
          left,
          width: 1600,
          height: 2600,
          transform: `skewX(${-14 * dir}deg)`,
          background: `linear-gradient(${dir === 1 ? 90 : 270}deg, ${G.cream} 0 22px, ${G.gold} 22px, ${G.goldDeep} 45%, ${G.bgMid} 100%)`,
          boxShadow: "0 0 80px rgba(242,184,75,0.35)",
        }}
      />
    </AbsoluteFill>
  );
};
