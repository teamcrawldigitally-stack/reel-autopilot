import React from "react";
import { Img, interpolate, random, staticFile, useCurrentFrame } from "remotion";
import { G } from "../theme";
import { clamp, ease, num } from "./kit";

/** A cut-out picture (transparent PNG) with slow drift, glow and an entrance. */
export const CutOut: React.FC<{
  src: string;
  x: number; // centre x
  bottom: number; // y of the picture's bottom edge
  h: number; // display height
  at?: number;
  out?: number; // frame to start leaving
  glow?: string;
  filter?: string;
  drift?: number;
  from?: "up" | "down" | "left" | "right" | "none";
  style?: React.CSSProperties;
}> = ({ src, x, bottom, h, at = -30, out, glow = "rgba(242,184,75,0.45)", filter = "", drift = 0.04, from = "up", style }) => {
  const f = useCurrentFrame();
  const p = ease(f, at, at + 14);
  const o = out !== undefined ? 1 - ease(f, out, out + 8, "in") : 1;
  const s = 1 + drift * interpolate(f, [at, at + 300], [0, 1], clamp);
  const d = (1 - p) * 70;
  const tx = from === "left" ? -d : from === "right" ? d : 0;
  const ty = from === "up" ? d : from === "down" ? -d : 0;
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: bottom - h,
        height: h,
        transform: `translateX(-50%) translate(${tx}px, ${ty}px) scale(${s})`,
        transformOrigin: "50% 100%",
        opacity: p * o,
        ...style,
      }}
    >
      <Img src={staticFile(src)} style={{ height: h, width: "auto", display: "block", filter: `drop-shadow(0 0 40px ${glow}) ${filter}` }} />
    </div>
  );
};

/** Soft round light behind a figure. */
export const Halo: React.FC<{ x: number; y: number; r: number; color?: string; o?: number }> = ({ x, y, r, color = "rgba(242,184,75,0.35)", o = 1 }) => {
  const f = useCurrentFrame();
  const pulse = 1 + 0.04 * Math.sin(f / 18);
  return <div style={{ position: "absolute", left: x - r, top: y - r, width: 2 * r, height: 2 * r, borderRadius: "50%", background: `radial-gradient(circle, ${color}, transparent 68%)`, opacity: o, transform: `scale(${pulse})` }} />;
};

/** Floating gold dust across the frame. */
export const GoldDust: React.FC<{ n?: number; seed?: string; color?: string; o?: number }> = ({ n = 40, seed = "d", color = G.gold, o = 1 }) => {
  const f = useCurrentFrame();
  return (
    <>
      {Array.from({ length: n }).map((_, i) => {
        const x = random(`${seed}x${i}`) * 1080;
        const speed = 0.4 + random(`${seed}s${i}`) * 1.2;
        const y = 1920 - ((random(`${seed}y${i}`) * 1920 + f * speed * 2) % 2100);
        const r = 2 + random(`${seed}r${i}`) * 4;
        const tw = 0.3 + 0.7 * Math.abs(Math.sin(f / (10 + i % 7) + i));
        return <div key={i} style={{ position: "absolute", left: x + Math.sin(f / 30 + i) * 20, top: y, width: r, height: r, borderRadius: "50%", background: color, opacity: tw * 0.7 * o, boxShadow: `0 0 ${r * 3}px ${color}` }} />;
      })}
    </>
  );
};

/** Gold rings pulsing out of a point (a thought going round and round). */
export const ThoughtRings: React.FC<{ x: number; y: number; at: number; color?: string }> = ({ x, y, at, color = G.saffron }) => {
  const f = useCurrentFrame();
  if (f < at) return null;
  return (
    <>
      {[0, 1, 2, 3].map((k) => {
        const t = ((f - at + k * 12) % 48) / 48;
        return (
          <div
            key={k}
            style={{
              position: "absolute",
              left: x - 40 - t * 160,
              top: y - 40 - t * 160,
              width: 80 + t * 320,
              height: 80 + t * 320,
              borderRadius: "50%",
              border: `4px solid ${color}`,
              opacity: (1 - t) * 0.75 * ease(f, at, at + 8),
            }}
          />
        );
      })}
    </>
  );
};

/** Glitch: draws children several times in horizontal slices with offsets. */
export const Glitch: React.FC<{ amount: number; children: React.ReactNode; seed?: string }> = ({ amount, children, seed = "g" }) => {
  const f = useCurrentFrame();
  if (amount <= 0.01) return <>{children}</>;
  const slices = 9;
  const step = Math.floor(f / 3);
  return (
    <div style={{ position: "absolute", inset: 0 }}>
      {Array.from({ length: slices }).map((_, i) => {
        const top = (i / slices) * 100;
        const off = (random(`${seed}${i}-${step}`) - 0.5) * 90 * amount;
        const tint = i % 2 === 0 ? "drop-shadow(8px 0 0 rgba(255,40,70,0.55)) drop-shadow(-8px 0 0 rgba(60,200,255,0.45))" : "";
        return (
          <div key={i} style={{ position: "absolute", inset: 0, clipPath: `inset(${top}% 0 ${100 - top - 100 / slices}% 0)`, transform: `translateX(${off}px)`, filter: tint }}>
            {children}
          </div>
        );
      })}
    </div>
  );
};

/** Crack lines that grow from a point. */
export const Cracks: React.FC<{ x: number; y: number; p: number; color?: string; scale?: number }> = ({ x, y, p, color = G.red, scale = 1 }) => {
  const paths = [
    "M0,0 L40,-30 L70,-25 L120,-70 L160,-60",
    "M0,0 L-30,-50 L-20,-90 L-60,-140",
    "M0,0 L50,40 L60,90 L110,120",
    "M0,0 L-60,20 L-90,70 L-150,80",
    "M0,0 L10,60 L-20,110",
    "M40,-30 L60,-80",
    "M-60,20 L-80,-10",
  ];
  return (
    <svg width={400} height={400} viewBox="-200 -200 400 400" style={{ position: "absolute", left: x - 200 * scale, top: y - 200 * scale, width: 400 * scale, height: 400 * scale, overflow: "visible" }}>
      {paths.map((d, i) => (
        <path key={i} d={d} fill="none" stroke={color} strokeWidth={4} strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - Math.min(1, Math.max(0, p * 1.4 - i * 0.06))} style={{ filter: `drop-shadow(0 0 8px ${color})` }} />
      ))}
    </svg>
  );
};

/* ---------- compact staircase meter (the measured object) ---------- */

export type MeterState = "idle" | "warn" | "anger" | "fall" | "good" | "off";
export const SM = { x0: 96, w: 111, top: 1352, rise: 15, bottom: 1500 } as const;
const smX = (i: number) => SM.x0 + i * SM.w;
const smY = (i: number) => SM.top + i * SM.rise;

const tone = (s: MeterState) =>
  s === "warn"
    ? { fill: "rgba(255,154,60,0.28)", edge: G.saffron, numC: G.cream }
    : s === "anger"
      ? { fill: "rgba(255,90,95,0.45)", edge: G.red, numC: G.white }
      : s === "fall"
        ? { fill: "rgba(160,30,40,0.40)", edge: "#C8363B", numC: "#FF9A9D" }
        : s === "good"
          ? { fill: "rgba(43,212,107,0.32)", edge: G.green, numC: G.white }
          : s === "off"
            ? { fill: "rgba(255,244,223,0.03)", edge: "rgba(242,184,75,0.15)", numC: "rgba(255,236,205,0.3)" }
            : { fill: "rgba(255,244,223,0.06)", edge: G.lineSoft, numC: G.dim };

/** 8 small 3D steps along the bottom; `orb` = step (1..8, fractional while moving), 9 = fallen. */
export const StepMeter: React.FC<{ state: (i: number) => MeterState; orb?: number; orbO?: number; pop?: (i: number) => number }> = ({ state, orb, orbO = 1, pop = () => 0 }) => {
  const f = useCurrentFrame();
  const k = orb ?? 0;
  const i0 = Math.min(7, Math.max(0, Math.floor(k - 1)));
  const fr = Math.min(1, Math.max(0, k - 1 - i0));
  const ox = smX(i0) + SM.w / 2 + fr * SM.w;
  const oy = smY(i0) - 18 + fr * SM.rise - Math.sin(Math.PI * fr) * 34 + (k > 8 ? (k - 8) * 260 : 0);
  return (
    <div style={{ position: "absolute", inset: 0 }}>
      {Array.from({ length: 8 }).map((_, i) => {
        const t = tone(state(i));
        const p = pop(i);
        const h = SM.bottom - smY(i);
        return (
          <div key={i} style={{ position: "absolute", left: smX(i) + 3, top: smY(i) - 8 * p, width: SM.w - 6, height: h + 8 * p }}>
            {/* top face (3D) */}
            <div style={{ position: "absolute", left: 8, right: -8, top: -12, height: 12, background: t.edge, transform: "skewX(-35deg)", transformOrigin: "0 100%", opacity: 0.9 }} />
            <div style={{ position: "absolute", inset: 0, background: `linear-gradient(180deg, ${t.fill}, rgba(0,0,0,0.35))`, border: `2px solid ${t.edge}`, borderBottom: "none", boxSizing: "border-box", boxShadow: state(i) === "anger" || state(i) === "good" ? `0 0 30px ${t.edge}` : undefined }} />
            <div style={{ position: "absolute", left: 0, right: 0, top: 10, textAlign: "center", ...num(36, t.numC) }}>{i + 1}</div>
          </div>
        );
      })}
      {orb !== undefined && orbO > 0 && (
        <div
          style={{
            position: "absolute",
            left: ox - 16,
            top: oy - 16,
            width: 32,
            height: 32,
            borderRadius: "50%",
            background: "radial-gradient(circle at 35% 30%, #FFF1C9, #F2B84B 55%, #C98A1E 100%)",
            boxShadow: `0 0 ${24 + 6 * Math.sin(f / 5)}px 6px rgba(242,184,75,0.6)`,
            opacity: orbO * (k > 8 ? Math.max(0, 1 - (k - 8) * 1.5) : 1),
          }}
        />
      )}
    </div>
  );
};

/** Orb step position over time from keys (frame → step). Hops take 10 frames. */
export const orbStep = (f: number, keys: { at: number; step: number }[], start: number) => {
  let v = start;
  for (const k of keys) {
    const a = k.at - 6;
    if (f >= a) {
      const p = ease(f, a, a + (k.step >= 9 ? 26 : 10), k.step >= 9 ? "in" : "inOut");
      v = v + (k.step - v) * p;
    }
  }
  return v;
};
