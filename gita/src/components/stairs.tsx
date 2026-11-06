import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { G } from "../theme";
import { clamp, ease, num } from "./kit";

/** The measured object of the anger reel: 8 steps going down, step 1 top-left. */
export const ST = { x0: 124, w: 104, top: 880, rise: 70, bottom: 1450 } as const;
export const stepX = (i: number) => ST.x0 + i * ST.w; // i = 0..7
export const stepY = (i: number) => ST.top + i * ST.rise;

export type StepState = "idle" | "warn" | "anger" | "fall" | "good" | "off";

const look = (s: StepState, i: number) => {
  switch (s) {
    case "warn":
      return { fill: "rgba(255,154,60,0.20)", strip: G.saffron, border: "rgba(255,154,60,0.65)", numC: G.cream, glow: "" };
    case "anger":
      return { fill: "rgba(255,90,95,0.36)", strip: G.red, border: G.red, numC: G.white, glow: "0 0 50px rgba(255,90,95,0.55)" };
    case "fall": {
      const a = 0.26 - (i - 4) * 0.04;
      return { fill: `rgba(255,90,95,${a})`, strip: "#C8363B", border: "rgba(255,90,95,0.55)", numC: "#FF9A9D", glow: "" };
    }
    case "good":
      return { fill: "rgba(43,212,107,0.26)", strip: G.green, border: G.green, numC: G.white, glow: "0 0 50px rgba(43,212,107,0.5)" };
    case "off":
      return { fill: "rgba(255,244,223,0.03)", strip: "rgba(242,184,75,0.12)", border: "rgba(242,184,75,0.12)", numC: "rgba(255,236,205,0.3)", glow: "" };
    default:
      return { fill: "rgba(255,244,223,0.05)", strip: G.lineSoft, border: G.lineSoft, numC: G.dim, glow: "" };
  }
};

export type Orb = { x: number; y: number; o: number; s?: number };

export const Stairs: React.FC<{
  state: (i: number) => StepState;
  pop?: (i: number) => number;
  orb?: Orb;
  opacity?: number;
  shake?: number;
}> = ({ state, pop = () => 0, orb, opacity = 1, shake = 0 }) => {
  return (
    <div style={{ position: "absolute", inset: 0, opacity, transform: `translateX(${shake}px)` }}>
      {/* ground line */}
      <div style={{ position: "absolute", left: 84, right: 84, top: ST.bottom, height: 3, background: G.lineSoft }} />
      {Array.from({ length: 8 }).map((_, i) => {
        const s = state(i);
        const l = look(s, i);
        const p = pop(i);
        const h = ST.bottom - stepY(i);
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: stepX(i) + 3,
              top: stepY(i),
              width: ST.w - 6,
              height: h,
              background: l.fill,
              border: `2.5px solid ${l.border}`,
              borderBottom: "none",
              borderRadius: "12px 12px 0 0",
              boxShadow: l.glow || undefined,
              boxSizing: "border-box",
              transform: `translateY(${-10 * p}px)`,
            }}
          >
            <div style={{ position: "absolute", left: -2.5, right: -2.5, top: -2.5, height: 12, borderRadius: "12px 12px 0 0", background: l.strip }} />
            <div style={{ position: "absolute", left: 0, right: 0, top: 22, textAlign: "center", ...num(44 + 10 * p, l.numC) }}>{i + 1}</div>
          </div>
        );
      })}
      {orb && orb.o > 0 && (
        <div
          style={{
            position: "absolute",
            left: orb.x - 22,
            top: orb.y - 22,
            width: 44,
            height: 44,
            borderRadius: "50%",
            background: "radial-gradient(circle at 35% 30%, #FFF1C9, #F2B84B 55%, #C98A1E 100%)",
            boxShadow: "0 0 34px 8px rgba(242,184,75,0.55)",
            opacity: orb.o,
            transform: `scale(${orb.s ?? 1})`,
          }}
        />
      )}
    </div>
  );
};

/** Orb centre on step k (1..8). k = 9 means "fallen off the last step". */
export const orbAt = (k: number) => {
  if (k >= 9) return { x: stepX(8) + 24, y: 1720 };
  return { x: stepX(k - 1) + ST.w / 2, y: stepY(k - 1) - 24 };
};

/** Orb hopping between steps; each key = { at: frame the step is spoken, step }. */
export const useOrb = (keys: { at: number; step: number }[], startStep?: number): Orb => {
  const f = useCurrentFrame();
  if (!keys.length) return { ...orbAt(startStep ?? 1), o: startStep ? 1 : 0 };
  let i = -1;
  for (let k = 0; k < keys.length; k++) if (f >= keys[k].at - 7) i = k;
  if (i < 0) {
    if (startStep) return { ...orbAt(startStep), o: 1 };
    return { ...orbAt(keys[0].step), o: 0 };
  }
  const to = keys[i].step;
  const from = i > 0 ? keys[i - 1].step : startStep ?? to;
  const a = keys[i].at - 7;
  if (to >= 9) {
    const p = interpolate(f, [a, a + 26], [0, 1], clamp);
    const A = orbAt(from);
    const x = A.x + (orbAt(9).x - A.x) * Math.min(1, p * 2.2);
    const y = A.y - Math.sin(Math.PI * Math.min(1, p * 2.2)) * 50 * (p < 0.45 ? 1 : 0) + Math.pow(Math.max(0, p - 0.3), 2) * 900;
    return { x, y, o: interpolate(p, [0.55, 1], [1, 0], clamp) };
  }
  const p = ease(f, a, a + 11, "inOut");
  const A = orbAt(from);
  const B = orbAt(to);
  const fresh = i === 0 && startStep === undefined;
  return {
    x: A.x + (B.x - A.x) * p,
    y: A.y + (B.y - A.y) * p - (from !== to ? Math.sin(Math.PI * p) * 70 : 0),
    o: fresh ? p : 1,
    s: fresh ? 0.4 + 0.6 * p : 1 + 0.12 * Math.sin(Math.PI * p),
  };
};
