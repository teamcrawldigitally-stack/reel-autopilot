import React from "react";
import { AbsoluteFill, Audio, Sequence, interpolate, random, staticFile, useCurrentFrame } from "remotion";
import { C, theme } from "../theme";
import { clamp } from "./kit";

/** Slow push-in across the scene plus quick punch-zooms on given frames. */
export const Camera: React.FC<{ dur: number; punches?: number[]; push?: number; children: React.ReactNode }> = ({
  dur,
  punches = [],
  push = 0.035,
  children,
}) => {
  const frame = useCurrentFrame();
  const base = 1 + push * interpolate(frame, [0, dur], [0, 1], { ...clamp, easing: theme.ease.inOut });
  let punch = 0;
  for (const f of punches) {
    const t = frame - f;
    if (t >= 0 && t < 24) punch += 0.045 * (t < 3 ? t / 3 : Math.exp(-(t - 3) / 4.5));
  }
  return (
    <AbsoluteFill style={{ transform: `scale(${base + punch})`, transformOrigin: "50% 42%" }}>{children}</AbsoluteFill>
  );
};

/** Branded violet swipe that hides each scene cut. */
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
          background: `linear-gradient(${dir === 1 ? 90 : 270}deg, ${C.lavender} 0 26px, #7B5BFF 26px, ${C.violet} 45%, ${C.violetDeep} 100%)`,
          boxShadow: "0 0 80px rgba(54,24,180,0.45)",
        }}
      />
    </AbsoluteFill>
  );
};

/** Faint ₹ signs, plus marks and dots drifting up behind everything. */
export const Particles: React.FC<{ count?: number; seed?: string }> = ({ count = 18, seed = "p" }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      {Array.from({ length: count }).map((_, i) => {
        const x = random(`${seed}x${i}`) * 1080;
        const y0 = random(`${seed}y${i}`) * 2100;
        const speed = 0.35 + random(`${seed}s${i}`) * 0.6;
        const kind = Math.floor(random(`${seed}k${i}`) * 3);
        const size = 22 + random(`${seed}z${i}`) * 34;
        const y = ((y0 - frame * speed) % 2100 + 2100) % 2100 - 90;
        const sway = Math.sin((frame + i * 40) / 45) * 14;
        const rot = (frame * (0.2 + random(`${seed}r${i}`) * 0.4) + i * 30) % 360;
        const color = kind === 0 ? C.violet : C.lavender;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x + sway,
              top: y,
              opacity: kind === 0 ? 0.1 : 0.32,
              transform: `rotate(${rot}deg)`,
              fontFamily: theme.fonts.display,
              fontWeight: 700,
              fontSize: size,
              color,
              lineHeight: 1,
            }}
          >
            {kind === 0 ? "₹" : kind === 1 ? "+" : <div style={{ width: size * 0.4, height: size * 0.4, borderRadius: "50%", background: color }} />}
          </div>
        );
      })}
    </AbsoluteFill>
  );
};
