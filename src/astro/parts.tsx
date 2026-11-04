// Shared building blocks for Astro 24x7 reels.
import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { astro, rgba } from "./theme";

const C = astro.colors;
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

// Sticker look used across the reel: thick black outline + hard offset shadow.
export const sticker = (shadow: string = C.ink, offset = 8): React.CSSProperties => ({
  border: `4px solid ${C.ink}`,
  boxShadow: `${offset}px ${offset}px 0 ${shadow}`,
});

// ---------- background + finishing layers ----------

const RASHI = ["मेष", "वृषभ", "मिथुन", "कर्क", "सिंह", "कन्या", "तुला", "वृश्चिक", "धनु", "मकर", "कुंभ", "मीन"];

export const StarShape: React.FC<{ size: number; color: string; opacity?: number }> = ({ size, color, opacity = 1 }) => (
  <svg width={size} height={size} viewBox="-1 -1 2 2" aria-hidden="true" style={{ opacity, overflow: "visible" }}>
    <path d="M0,-1 C0.1,-0.1 0.1,-0.1 1,0 C0.1,0.1 0.1,0.1 0,1 C-0.1,0.1 -0.1,0.1 -1,0 C-0.1,-0.1 -0.1,-0.1 0,-1 Z" fill={color} />
  </svg>
);

export const AstroBg: React.FC = () => {
  const frame = useCurrentFrame();
  const rot = frame * 0.08;
  const d = Math.sin(frame / 60) * 40;
  const stars = Array.from({ length: 16 }).map((_, i) => {
    const x = ((i * 263) % 980) + 50;
    const speed = 0.5 + (i % 5) * 0.22;
    const y = ((((i * 517) % 1950) - frame * speed) % 1990 + 1990) % 1990 - 40;
    const size = 16 + ((i * 7) % 4) * 8;
    const tw = 0.22 + 0.3 * (0.5 + 0.5 * Math.sin(frame / 11 + i * 1.7));
    return { x, y, size, tw, i };
  });
  return (
    <AbsoluteFill style={{ background: `linear-gradient(180deg, ${C.bg} 0%, #FFF2E4 55%, ${C.bgDeep} 100%)`, overflow: "hidden" }}>
      {/* slow sun rays behind the content */}
      <div
        style={{
          position: "absolute",
          left: 540 - 1150,
          top: 820 - 1150,
          width: 2300,
          height: 2300,
          borderRadius: "50%",
          background: `repeating-conic-gradient(from ${frame * 0.12}deg, ${rgba(C.orange, 0.075)} 0deg 6deg, transparent 6deg 18deg)`,
          WebkitMaskImage: "radial-gradient(circle closest-side, #000 18%, transparent 72%)",
          maskImage: "radial-gradient(circle closest-side, #000 18%, transparent 72%)",
        }}
      />
      <div
        style={{
          position: "absolute",
          width: 1300,
          height: 1300,
          left: -330 + d,
          top: -580,
          background: `radial-gradient(circle closest-side, ${rgba(C.orange, 0.24)}, ${rgba(C.orange, 0.07)} 55%, transparent 100%)`,
        }}
      />
      <div
        style={{
          position: "absolute",
          width: 1200,
          height: 1200,
          right: -480 - d,
          bottom: -440,
          background: `radial-gradient(circle closest-side, ${rgba(C.orange, 0.22)}, ${rgba(C.orangeSoft, 0.25)} 55%, transparent 100%)`,
        }}
      />
      {/* zodiac wheel with the 12 rashi names */}
      <svg width="1080" height="1920" style={{ position: "absolute", inset: 0 }} aria-hidden="true">
        <g transform={`translate(540 820) rotate(${rot})`} fill="none" stroke={C.orangeDeep} strokeOpacity="0.16">
          <circle r="540" strokeWidth="2.5" />
          <circle r="452" strokeWidth="2" />
          <circle r="300" strokeWidth="1.5" />
          {RASHI.map((_, i) => (
            <line key={i} x1="0" y1="-452" x2="0" y2="-540" strokeWidth="2" transform={`rotate(${i * 30})`} />
          ))}
          {RASHI.map((_, i) => (
            <line key={`s${i}`} x1="0" y1="-300" x2="0" y2="-452" strokeWidth="1.5" strokeOpacity="0.6" transform={`rotate(${i * 30 + 15})`} />
          ))}
          {RASHI.map((name, i) => (
            <text
              key={`t${i}`}
              x="0"
              y="-484"
              textAnchor="middle"
              dominantBaseline="middle"
              transform={`rotate(${i * 30 + 15})`}
              fontFamily="Mukta, sans-serif"
              fontWeight={700}
              fontSize="34"
              fill={C.orangeDeep}
              fillOpacity="0.2"
              stroke="none"
            >
              {name}
            </text>
          ))}
        </g>
      </svg>
      {stars.map((s) => (
        <div key={s.i} style={{ position: "absolute", left: s.x, top: s.y, transform: `rotate(${frame * 0.6 + s.i * 20}deg)` }}>
          <StarShape size={s.size} color={C.orange} opacity={s.tw} />
        </div>
      ))}
    </AbsoluteFill>
  );
};

const NOISE = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='220' height='220'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/%3E%3C/filter%3E%3Crect width='220' height='220' filter='url(%23n)' opacity='0.5'/%3E%3C/svg%3E")`;

export const AstroFinish: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <>
      <AbsoluteFill
        style={{
          pointerEvents: "none",
          backgroundImage: NOISE,
          backgroundSize: "220px",
          backgroundPosition: `${(frame * 7) % 220}px ${(frame * 13) % 220}px`,
          opacity: 0.05,
          mixBlendMode: "multiply",
        }}
      />
      <AbsoluteFill
        style={{
          pointerEvents: "none",
          background: `radial-gradient(ellipse at center, transparent 60%, ${rgba("#8A3A00", 0.14)} 100%)`,
        }}
      />
    </>
  );
};

// ---------- timing helpers ----------

export type W = { text: string; startMs: number; endMs: number };

const norm = (s: string) => s.replace(/[^\p{L}\p{M}\p{N}]+/gu, "");

// Frame (relative to the scene's start) at which `word` is spoken, or `fallback`.
export const findWordFrame = (words: W[], sceneStartMs: number, word: string | undefined, fallback: number, fps: number) => {
  if (!word) return fallback;
  const target = norm(word);
  const hit = words.find((w) => w.startMs >= sceneStartMs - 50 && norm(w.text) === target);
  return hit ? Math.round(((hit.startMs - sceneStartMs) / 1000) * fps) : fallback;
};

export const useWordFrame = (words: W[], sceneStartMs: number, word: string | undefined, fallback: number) => {
  const { fps } = useVideoConfig();
  return findWordFrame(words, sceneStartMs, word, fallback, fps);
};

// ---------- motion primitives ----------

export const Rise: React.FC<{ delay?: number; y?: number; children: React.ReactNode; style?: React.CSSProperties }> = ({
  delay = 0,
  y = 40,
  children,
  style,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame: frame - delay, fps, config: astro.spring.snappy });
  return (
    <div
      style={{
        opacity: interpolate(p, [0, 0.5], [0, 1], clamp),
        transform: `translateY(${interpolate(p, [0, 1], [y, 0])}px) scale(${interpolate(p, [0, 1], [0.85, 1])})`,
        ...style,
      }}
    >
      {children}
    </div>
  );
};

// Pops in with overshoot (for stickers, badges, numbers).
export const Pop: React.FC<{ at: number; children: React.ReactNode; from?: number; rotate?: number; style?: React.CSSProperties }> = ({
  at,
  children,
  from = 0.3,
  rotate = 0,
  style,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame: frame - at, fps, config: astro.spring.bouncy });
  return (
    <div
      style={{
        opacity: interpolate(p, [0, 0.25], [0, 1], clamp),
        transform: `scale(${interpolate(p, [0, 1], [from, 1])}) rotate(${interpolate(p, [0, 1], [rotate * 2, rotate])}deg)`,
        ...style,
      }}
    >
      {children}
    </div>
  );
};

// A ring of little stars that bursts out at frame `at`.
export const Burst: React.FC<{ at: number; x: number; y: number; radius?: number; count?: number; color?: string }> = ({
  at,
  x,
  y,
  radius = 170,
  count = 8,
  color = C.orange,
}) => {
  const frame = useCurrentFrame();
  const t = frame - at;
  if (t < 0 || t > 26) return null;
  const k = interpolate(t, [0, 22], [0, 1], { ...clamp, easing: astro.ease.out });
  return (
    <div style={{ position: "absolute", left: x, top: y, width: 0, height: 0, pointerEvents: "none" }}>
      {Array.from({ length: count }).map((_, i) => {
        const a = (i / count) * Math.PI * 2 + 0.3;
        const r = radius * k;
        return (
          <div key={i} style={{ position: "absolute", left: Math.cos(a) * r - 18, top: Math.sin(a) * r - 18, transform: `scale(${1 - k * 0.7}) rotate(${t * 9}deg)` }}>
            <StarShape size={36} color={i % 2 ? C.ink : color} opacity={1 - k} />
          </div>
        );
      })}
    </div>
  );
};

const normW = (s: string) => s.replace(/[^\p{L}\p{M}\p{N}]+/gu, "");

export const Headline: React.FC<{
  text: string;
  highlight?: string;
  size: number;
  delay?: number;
  per?: number;
  align?: "left" | "center";
  color?: string;
  maxWidth?: number;
}> = ({ text, highlight = "", size, delay = 0, per = 2, align = "center", color = C.ink, maxWidth }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const words = text.split(/\s+/).filter(Boolean);
  const hiWords = highlight.split(/\s+/).map(normW).filter(Boolean);
  let hiStart = -1;
  for (let i = 0; i + hiWords.length <= words.length && hiWords.length; i++) {
    if (hiWords.every((h, j) => normW(words[i + j]) === h)) {
      hiStart = i;
      break;
    }
  }
  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        justifyContent: align === "center" ? "center" : "flex-start",
        columnGap: Math.round(size * 0.24),
        rowGap: Math.round(size * 0.02),
        fontFamily: astro.fonts.display,
        fontSize: size,
        lineHeight: 1.22,
        color,
        textAlign: align,
        maxWidth,
      }}
    >
      {words.map((w, i) => {
        const p = spring({ frame: frame - delay - i * per, fps, config: astro.spring.snappy });
        const hi = hiStart >= 0 && i >= hiStart && i < hiStart + hiWords.length;
        const mark = spring({ frame: frame - delay - i * per - 6, fps, config: astro.spring.smooth });
        return (
          <span
            key={i}
            style={{
              position: "relative",
              display: "inline-block",
              isolation: "isolate",
              color: hi ? C.orangeDeep : undefined,
              opacity: interpolate(p, [0, 0.4], [0, 1], clamp),
              transform: `translateY(${interpolate(p, [0, 1], [size * 0.45, 0])}px) scale(${interpolate(p, [0, 1], [0.7, 1])})`,
            }}
          >
            {hi ? (
              <span
                style={{
                  position: "absolute",
                  left: "-6%",
                  right: "-6%",
                  bottom: "10%",
                  height: "36%",
                  borderRadius: 10,
                  background: rgba(C.orange, 0.3),
                  transform: `scaleX(${mark}) skewX(-8deg)`,
                  transformOrigin: "left center",
                  zIndex: -1,
                }}
              />
            ) : null}
            {w}
          </span>
        );
      })}
    </div>
  );
};

export const Chip: React.FC<{ text: string; delay?: number; dark?: boolean; size?: number }> = ({ text, delay = 0, dark, size = 42 }) => (
  <Pop at={delay} from={0.5} rotate={-2}>
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 14,
        padding: "8px 30px 10px",
        borderRadius: 999,
        background: dark ? C.ink : C.white,
        ...sticker(dark ? C.orange : C.ink, 6),
        fontFamily: astro.fonts.body,
        fontWeight: 800,
        fontSize: size,
        color: dark ? C.white : C.ink,
      }}
    >
      <div style={{ width: 16, height: 16, borderRadius: 8, background: C.orange }} />
      {text}
    </div>
  </Pop>
);

export const Body: React.FC<{ text: string; delay: number; size?: number }> = ({ text, delay, size = 48 }) => (
  <Rise delay={delay} y={24}>
    <div
      style={{
        fontFamily: astro.fonts.body,
        fontWeight: 700,
        fontSize: size,
        lineHeight: 1.35,
        color: C.inkSoft,
        textAlign: "center",
      }}
    >
      {text}
    </div>
  </Rise>
);

// ---------- illustrations ----------

export const Person: React.FC<{ size: number; color: string; outline?: boolean }> = ({ size, color, outline }) => (
  <svg width={size} height={size * 1.25} viewBox="-2 -2 44 54" aria-hidden="true">
    <circle cx="20" cy="11" r="9" fill={color} stroke={outline ? C.ink : "none"} strokeWidth="3" />
    <path d="M4 48 C4 32 10 24 20 24 C30 24 36 32 36 48 Z" fill={color} stroke={outline ? C.ink : "none"} strokeWidth="3" strokeLinejoin="round" />
  </svg>
);

export const Moon: React.FC<{ size: number; glowBoost?: number }> = ({ size, glowBoost = 0 }) => {
  const frame = useCurrentFrame();
  const glow = 0.45 + Math.sin(frame / 20) * 0.08 + glowBoost * 0.35;
  return (
    <svg width={size} height={size} viewBox="0 0 400 400" aria-hidden="true">
      <defs>
        <radialGradient id="moon-g" cx="38%" cy="34%" r="70%">
          <stop offset="0" stopColor="#FFFDF8" />
          <stop offset="0.7" stopColor="#FFE7CC" />
          <stop offset="1" stopColor="#F7C79A" />
        </radialGradient>
        <radialGradient id="moon-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0.55" stopColor={C.orange} stopOpacity={Math.min(0.95, glow)} />
          <stop offset="1" stopColor={C.orange} stopOpacity="0" />
        </radialGradient>
        <mask id="moon-cut">
          <rect width="400" height="400" fill="#fff" />
          <circle cx="262" cy="168" r="122" fill="#000" />
        </mask>
      </defs>
      <circle cx="200" cy="200" r="198" fill="url(#moon-glow)" />
      <circle cx="200" cy="200" r="140" fill="url(#moon-g)" stroke={C.ink} strokeWidth="6" mask="url(#moon-cut)" />
      <g fill={C.orangeDeep} fillOpacity="0.16" mask="url(#moon-cut)">
        <circle cx="150" cy="230" r="18" />
        <circle cx="120" cy="170" r="10" />
        <circle cx="185" cy="290" r="12" />
      </g>
    </svg>
  );
};

// North-Indian kundli. `lagna` = which house is highlighted; `numbers` = labels per house (1-based).
const HOUSE_POLY: Record<number, string> = {
  1: "300,0 450,150 300,300 150,150",
  2: "0,0 300,0 150,150",
  3: "0,0 150,150 0,300",
  4: "0,300 150,150 300,300 150,450",
  5: "0,300 150,450 0,600",
  6: "0,600 150,450 300,600",
  7: "300,600 150,450 300,300 450,450",
  8: "300,600 450,450 600,600",
  9: "600,600 450,450 600,300",
  10: "600,300 450,450 300,300 450,150",
  11: "600,300 450,150 600,0",
  12: "600,0 450,150 300,0",
};
const HOUSE_LABEL: Record<number, [number, number]> = {
  1: [300, 165], 2: [150, 62], 3: [60, 155], 4: [150, 312], 5: [60, 460], 6: [150, 560],
  7: [300, 470], 8: [450, 560], 9: [540, 460], 10: [450, 312], 11: [540, 155], 12: [450, 62],
};

export type Planet = { name: string; house: number; dx?: number; dy?: number };

export const Kundli: React.FC<{
  size: number;
  draw: number; // 0..1 line drawing progress
  numbersIn: number; // frame-like progress for house numbers (0..12)
  numbers?: number[];
  lagna?: number;
  lagnaFill: number; // 0..1
  lagnaLabel?: string;
  planets?: Planet[];
  planetsIn?: number; // 0..planets.length
}> = ({ size, draw, numbersIn, numbers, lagna = 1, lagnaFill, lagnaLabel, planets = [], planetsIn = 0 }) => {
  const nums = numbers ?? [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
  const dash = { strokeDasharray: 1, strokeDashoffset: 1 - draw } as const;
  return (
    <svg width={size} height={size} viewBox="-12 -12 640 640" role="img" aria-label="North Indian kundli chart">
      <rect x="16" y="16" width="600" height="600" rx="12" fill={C.ink} opacity={Math.min(1, draw * 2)} />
      <rect x="0" y="0" width="600" height="600" rx="12" fill={C.white} opacity={Math.min(1, draw * 2)} />
      <polygon points={HOUSE_POLY[lagna]} fill={C.orange} opacity={0.95 * lagnaFill} />
      <g fill="none" stroke={C.ink} strokeWidth="8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="0" y="0" width="600" height="600" rx="12" pathLength={1} style={dash} />
        <path d="M0,0 L600,600" pathLength={1} style={dash} />
        <path d="M600,0 L0,600" pathLength={1} style={dash} />
        <path d="M300,0 L600,300 L300,600 L0,300 Z" pathLength={1} style={dash} />
      </g>
      {Object.entries(HOUSE_LABEL).map(([h, [x, y]]) => {
        const i = Number(h) - 1;
        const o = Math.max(0, Math.min(1, numbersIn - i));
        const isL = Number(h) === lagna && lagnaFill > 0.5;
        return (
          <text
            key={h}
            x={x}
            y={y}
            textAnchor="middle"
            fontFamily="Mukta, sans-serif"
            fontWeight={800}
            fontSize={isL ? 58 : 42}
            fill={isL ? C.white : C.inkSoft}
            opacity={o}
          >
            {nums[i]}
          </text>
        );
      })}
      {lagnaLabel ? (
        <text x="300" y="234" textAnchor="middle" fontFamily="Mukta, sans-serif" fontWeight={800} fontSize="42" fill={C.white} opacity={lagnaFill}>
          {lagnaLabel}
        </text>
      ) : null}
      {planets.map((p, i) => {
        const o = Math.max(0, Math.min(1, planetsIn - i));
        const [x, y] = HOUSE_LABEL[p.house];
        return (
          <g key={i} opacity={o} transform={`translate(${x + (p.dx ?? 0)} ${y + 46 + (p.dy ?? 0)}) scale(${0.4 + 0.6 * o})`}>
            <circle r="28" fill={C.orange} stroke={C.ink} strokeWidth="4" />
            <text y="10" textAnchor="middle" fontFamily="Mukta, sans-serif" fontWeight={800} fontSize="28" fill={C.white}>
              {p.name}
            </text>
          </g>
        );
      })}
    </svg>
  );
};

export const DownArrow: React.FC<{ color: string; size: number }> = ({ color, size }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" aria-hidden="true">
    <path d="M24 6 V38 M10 26 L24 40 L38 26" fill="none" stroke={color} strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
