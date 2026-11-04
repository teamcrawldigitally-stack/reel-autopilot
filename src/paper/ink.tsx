// Engraving-style illustrations drawn in code: hatching for shade, a slight ink wobble,
// thick black outlines. Every illustration takes a unique `id` so its SVG defs don't clash.
import React from "react";
import { interpolate } from "remotion";
import { paper } from "./theme";

const C = paper.colors;
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

export const Hatch: React.FC<{ id: string; angle: number; gap?: number; w?: number; color?: string }> = ({ id, angle, gap = 7, w = 2.2, color = C.ink }) => (
  <pattern id={id} width={gap} height={gap} patternUnits="userSpaceOnUse" patternTransform={`rotate(${angle})`}>
    <line x1="0" y1="0" x2="0" y2={gap} stroke={color} strokeWidth={w} />
  </pattern>
);

// Slight hand-drawn wobble on every line inside.
export const Rough: React.FC<{ id: string; scale?: number; seed?: number }> = ({ id, scale = 3, seed = 3 }) => (
  <filter id={id} x="-10%" y="-10%" width="120%" height="120%">
    <feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves="2" seed={seed} result="n" />
    <feDisplacementMap in="SourceGraphic" in2="n" scale={scale} xChannelSelector="R" yChannelSelector="G" />
  </filter>
);

// Shade mask: white (= hatched) away from a light coming from the top-left.
const ShadeMask: React.FC<{ id: string; shape: React.ReactNode; inner?: number }> = ({ id, shape, inner = 0.35 }) => (
  <>
    <radialGradient id={`${id}-g`} cx="28%" cy="24%" r="90%">
      <stop offset={inner} stopColor="#000" />
      <stop offset="1" stopColor="#fff" />
    </radialGradient>
    <mask id={id} maskContentUnits="userSpaceOnUse">
      {React.cloneElement(shape as React.ReactElement<{ fill?: string }>, { fill: `url(#${id}-g)` })}
    </mask>
  </>
);

// ---------- Saturn ----------

export const Saturn: React.FC<{ id: string; width: number; draw?: number; tilt?: number }> = ({ id, width, draw = 1, tilt = -16 }) => {
  const R = 140;
  const rings = [
    { rx: 292, w: 6 },
    { rx: 276, w: 2 },
    { rx: 262, w: 9 },
    { rx: 240, w: 2.5 },
    { rx: 226, w: 4 },
    { rx: 206, w: 5 },
  ];
  const ry = (rx: number) => rx * 0.25;
  const dash = (len = 1) => ({ strokeDasharray: len, strokeDashoffset: len * (1 - draw) });
  const hatchOn = interpolate(draw, [0.45, 1], [0, 1], clamp);
  const ring = (half: "back" | "front") => (
    <g transform={`rotate(${tilt})`} clipPath={`url(#${id}-${half})`}>
      <ellipse rx={292} ry={ry(292)} fill={`url(#${id}-h0)`} mask={`url(#${id}-ringband)`} opacity={0.55 * hatchOn} />
      {rings.map((r, i) => (
        <ellipse key={i} rx={r.rx} ry={ry(r.rx)} fill="none" stroke={C.ink} strokeWidth={r.w} pathLength={1} style={dash()} />
      ))}
    </g>
  );
  return (
    <svg width={width} height={width * 0.66} viewBox="-330 -215 660 430" style={{ overflow: "visible" }} aria-hidden="true">
      <defs>
        <Hatch id={`${id}-h1`} angle={45} gap={7} w={2.4} />
        <Hatch id={`${id}-h2`} angle={-45} gap={8} w={2} />
        <Hatch id={`${id}-h0`} angle={-16} gap={6} w={1.6} />
        <ShadeMask id={`${id}-m1`} shape={<circle r={R} />} inner={0.38} />
        <ShadeMask id={`${id}-m2`} shape={<circle r={R} />} inner={0.62} />
        <clipPath id={`${id}-ball`}>
          <circle r={R} />
        </clipPath>
        <clipPath id={`${id}-back`}>
          <rect x={-400} y={-300} width={800} height={300} />
        </clipPath>
        <clipPath id={`${id}-front`}>
          <rect x={-400} y={0} width={800} height={300} />
        </clipPath>
        <mask id={`${id}-ringband`} maskContentUnits="userSpaceOnUse">
          <ellipse rx={292} ry={ry(292)} fill="#fff" />
          <ellipse rx={206} ry={ry(206)} fill="#000" />
        </mask>
        <Rough id={`${id}-rough`} />
      </defs>
      <g filter={`url(#${id}-rough)`}>
        {ring("back")}
        <circle r={R} fill={C.paper} />
        <g clipPath={`url(#${id}-ball)`} opacity={hatchOn}>
          <rect x={-R} y={-R} width={R * 2} height={R * 2} fill={`url(#${id}-h1)`} mask={`url(#${id}-m1)`} />
          <rect x={-R} y={-R} width={R * 2} height={R * 2} fill={`url(#${id}-h2)`} mask={`url(#${id}-m2)`} />
          <g transform={`rotate(${tilt})`} fill="none" stroke={C.ink} strokeWidth="2.6" opacity="0.75">
            {[-92, -58, -30, 4, 40, 78].map((y, i) => (
              <path key={i} d={`M ${-R - 10} ${y} Q 0 ${y + 26} ${R + 10} ${y}`} />
            ))}
          </g>
        </g>
        <circle r={R} fill="none" stroke={C.ink} strokeWidth="6" pathLength={1} style={dash()} />
        {ring("front")}
      </g>
    </svg>
  );
};

// ---------- Sun ----------

export const Sun: React.FC<{ id: string; size: number; draw?: number }> = ({ id, size, draw = 1 }) => {
  const rays = Array.from({ length: 16 });
  return (
    <svg width={size} height={size} viewBox="-120 -120 240 240" aria-hidden="true" style={{ overflow: "visible" }}>
      <defs>
        <Hatch id={`${id}-h`} angle={45} gap={6} w={2} />
        <ShadeMask id={`${id}-m`} shape={<circle r={56} />} inner={0.4} />
        <Rough id={`${id}-r`} />
      </defs>
      <g filter={`url(#${id}-r)`} opacity={Math.min(1, draw * 1.5)}>
        {rays.map((_, i) => (
          <line key={i} x1="0" y1={-70} x2="0" y2={i % 2 ? -100 : -112} stroke={C.ink} strokeWidth={i % 2 ? 3 : 5} strokeLinecap="round" transform={`rotate(${(i * 360) / 16})`} />
        ))}
        <circle r={56} fill={C.paper} />
        <circle r={56} fill={`url(#${id}-h)`} mask={`url(#${id}-m)`} />
        <circle r={56} fill="none" stroke={C.ink} strokeWidth="5" />
      </g>
    </svg>
  );
};

// ---------- crescent moon ----------

export const Crescent: React.FC<{ id: string; size: number }> = ({ id, size }) => (
  <svg width={size} height={size} viewBox="-60 -60 120 120" aria-hidden="true">
    <defs>
      <Hatch id={`${id}-h`} angle={45} gap={5} w={1.6} />
      <mask id={`${id}-cut`} maskContentUnits="userSpaceOnUse">
        <circle r={46} fill="#fff" />
        <circle cx={22} cy={-12} r={40} fill="#000" />
      </mask>
    </defs>
    <g mask={`url(#${id}-cut)`}>
      <circle r={46} fill={C.paper} />
      <circle r={46} fill={`url(#${id}-h)`} opacity="0.5" />
      <circle r={46} fill="none" stroke={C.ink} strokeWidth="5" />
    </g>
  </svg>
);

// ---------- dumbbell ----------

export const Dumbbell: React.FC<{ id: string; width: number; draw?: number }> = ({ id, width, draw = 1 }) => {
  const plates = [
    { x: -250, w: 58, h: 230 },
    { x: -186, w: 44, h: 178 },
    { x: 142, w: 44, h: 178 },
    { x: 192, w: 58, h: 230 },
  ];
  const d = { strokeDasharray: 1, strokeDashoffset: 1 - draw };
  const hatchOn = interpolate(draw, [0.4, 1], [0, 1], clamp);
  return (
    <svg width={width} height={width * 0.5} viewBox="-280 -140 560 280" aria-hidden="true" style={{ overflow: "visible" }}>
      <defs>
        <Hatch id={`${id}-h`} angle={90} gap={7} w={2.2} />
        <Hatch id={`${id}-h2`} angle={20} gap={8} w={1.8} />
        <linearGradient id={`${id}-g`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0.35" stopColor="#000" />
          <stop offset="1" stopColor="#fff" />
        </linearGradient>
        <Rough id={`${id}-r`} />
      </defs>
      <g filter={`url(#${id}-r)`}>
        <rect x={-150} y={-14} width={300} height={28} rx={8} fill={C.paper} stroke={C.ink} strokeWidth="5" pathLength={1} style={d} />
        <rect x={-150} y={-14} width={300} height={28} rx={8} fill={`url(#${id}-h2)`} opacity={0.5 * hatchOn} />
        {plates.map((p, i) => (
          <g key={i}>
            <rect x={p.x} y={-p.h / 2} width={p.w} height={p.h} rx={14} fill={C.paper} />
            <rect x={p.x} y={-p.h / 2} width={p.w} height={p.h} rx={14} fill={`url(#${id}-h)`} opacity={hatchOn} />
            <rect x={p.x + 8} y={-p.h / 2 + 10} width={p.w * 0.3} height={p.h - 20} rx={6} fill={C.paper} opacity={hatchOn} />
            <rect x={p.x} y={-p.h / 2} width={p.w} height={p.h} rx={14} fill="none" stroke={C.ink} strokeWidth="6" pathLength={1} style={d} />
          </g>
        ))}
      </g>
    </svg>
  );
};

// ---------- key ----------

export const Key: React.FC<{ id: string; width: number }> = ({ id, width }) => (
  <svg width={width} height={width * 0.4} viewBox="-200 -80 400 160" aria-hidden="true">
    <defs>
      <Hatch id={`${id}-h`} angle={45} gap={6} w={1.8} />
      <Rough id={`${id}-r`} />
    </defs>
    <g filter={`url(#${id}-r)`} stroke={C.ink} strokeWidth="6" strokeLinejoin="round">
      <path d="M -130 -58 A 58 58 0 1 0 -130 58 A 58 58 0 1 0 -130 -58 Z M -130 -24 A 24 24 0 1 1 -130 24 A 24 24 0 1 1 -130 -24 Z" fill={`url(#${id}-h)`} fillRule="evenodd" />
      <path d="M -74 -13 H 170 V 13 H 150 V 46 H 124 V 13 H 96 V 36 H 72 V 13 H -74 Z" fill={C.paper} />
    </g>
  </svg>
);

// ---------- barcode (footer) ----------

export const Barcode: React.FC<{ width: number; height: number; seed?: number }> = ({ width, height, seed = 7 }) => {
  let s = seed;
  const r = () => ((s = (s * 9301 + 49297) % 233280) / 233280);
  const bars: { x: number; w: number }[] = [];
  let x = 0;
  while (x < width) {
    const w = 1 + Math.floor(r() * 4);
    if (r() > 0.35) bars.push({ x, w });
    x += w + 1 + Math.floor(r() * 2);
  }
  return (
    <svg width={width} height={height} aria-hidden="true">
      {bars.map((b, i) => (
        <rect key={i} x={b.x} y={0} width={b.w} height={height} fill={C.ink} />
      ))}
    </svg>
  );
};

// Dotted connector that draws itself from (x1,y1) to (x2,y2).
export const DottedLine: React.FC<{ x1: number; y1: number; x2: number; y2: number; p: number; color?: string }> = ({ x1, y1, x2, y2, p, color = C.accent }) => {
  const len = Math.hypot(x2 - x1, y2 - y1);
  return (
    <line
      x1={x1}
      y1={y1}
      x2={x1 + (x2 - x1) * p}
      y2={y1 + (y2 - y1) * p}
      stroke={color}
      strokeWidth="4"
      strokeDasharray="6 10"
      strokeLinecap="round"
      opacity={p > 0 ? 1 : 0}
      data-len={len}
    />
  );
};
