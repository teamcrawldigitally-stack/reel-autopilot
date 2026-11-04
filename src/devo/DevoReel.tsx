// Astro 24x7 "Devotional" look: near-black stage with a deep red glow, a large deity / photo
// hero with a red neon ring, stacked label boxes (black/white + white/red), a dasha dial,
// drifting objects and quiet white subtitles. Pictures come from public/devo/img/<key>.jpg;
// a missing picture shows a glowing placeholder so the layout can still be previewed.
import React, { useMemo } from "react";
import { Audio } from "@remotion/media";
import type { TikTokPage } from "@remotion/captions";
import { AbsoluteFill, Img, interpolate, Sequence, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import "../astro/fonts";
import { findWordFrame, W } from "../astro/parts";
import { ART_FOR, CodeArt } from "./art";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const K = {
  bg: "#0B0607",
  red: "#D7262E",
  redDeep: "#8E0F16",
  white: "#FFFFFF",
  ink: "#0E0A0A",
  gold: "#F4C46A",
};
const HEAD = '"Mukta", sans-serif';
const DISPLAY = '"Rozha One", "Mukta", serif';

type Hero = { img: string; kind: "deity" | "photo" | "object"; word?: string };
type Label = { top: string; bottom: string; word: string };
export type DevoScene = {
  visual: "devo";
  voiceover: string;
  heroes: Hero[];
  labels: Label[];
  title?: string;
  titleSub?: string;
  counter?: string;
  questionWord?: string;
  chakraWord?: string;
  paths?: boolean;
  rise?: boolean;
  dial?: { word?: string; planetsWord?: string; lifeWord?: string };
  startMs: number;
  endMs: number;
};

export type DevoReelProps = {
  audio: string | null;
  music: string | null;
  musicVolume: number;
  sfx: boolean;
  captions: boolean;
  scenes: DevoScene[];
  words: W[];
  durationMs: number;
  images: Record<string, string | null>;
  floats?: string[];
};

// ---------- background ----------

const Stage: React.FC = () => {
  const frame = useCurrentFrame();
  const pulse = 0.5 + 0.08 * Math.sin(frame / 24);
  return (
    <AbsoluteFill style={{ background: K.bg, overflow: "hidden" }}>
      <AbsoluteFill style={{ background: `radial-gradient(ellipse 70% 45% at 50% 42%, rgba(150,14,22,${pulse}) 0%, rgba(90,8,14,0.35) 45%, transparent 80%)` }} />
      <AbsoluteFill
        style={{
          opacity: 0.09,
          backgroundImage: "repeating-linear-gradient(45deg, #fff 0 1px, transparent 1px 46px), repeating-linear-gradient(-45deg, #fff 0 1px, transparent 1px 46px)",
          WebkitMaskImage: "radial-gradient(ellipse 80% 60% at 50% 45%, #000 30%, transparent 85%)",
          maskImage: "radial-gradient(ellipse 80% 60% at 50% 45%, #000 30%, transparent 85%)",
        }}
      />
    </AbsoluteFill>
  );
};

// Small glowing objects drifting in the corners (drawn in code).
const FloatIcon: React.FC<{ kind: string; size: number }> = ({ kind, size }) => {
  const s = { width: size, height: size };
  switch (kind) {
    case "phone":
      return (
        <svg viewBox="0 0 60 100" {...s} aria-hidden="true">
          <rect x="4" y="2" width="52" height="96" rx="10" fill="#1d1d24" stroke="#555" strokeWidth="3" />
          <rect x="9" y="12" width="42" height="72" rx="4" fill="#3A6FF7" opacity="0.8" />
          <rect x="14" y="20" width="32" height="10" rx="3" fill="#fff" opacity="0.7" />
          <rect x="14" y="36" width="24" height="24" rx="3" fill="#FF6B6B" opacity="0.8" />
        </svg>
      );
    case "coin":
      return (
        <svg viewBox="0 0 100 100" {...s} aria-hidden="true">
          <circle cx="50" cy="50" r="44" fill="#E0A82E" stroke="#8a5a00" strokeWidth="5" />
          <circle cx="50" cy="50" r="32" fill="none" stroke="#FFE08A" strokeWidth="4" />
          <text x="50" y="64" textAnchor="middle" fontSize="40" fontWeight="800" fill="#7a4a00" fontFamily="Mukta">₹</text>
        </svg>
      );
    case "smoke":
      return (
        <svg viewBox="0 0 100 100" {...s} aria-hidden="true">
          <path d="M50 95 C 20 80 70 65 40 50 C 15 37 60 25 45 5" fill="none" stroke="#9a8e9e" strokeWidth="8" strokeLinecap="round" opacity="0.8" />
        </svg>
      );
    case "book":
      return (
        <svg viewBox="0 0 100 80" {...s} aria-hidden="true">
          <path d="M50 14 C 36 4 16 4 4 10 V 74 C 16 68 36 68 50 78 C 64 68 84 68 96 74 V 10 C 84 4 64 4 50 14 Z" fill="#7a2f1d" stroke="#E0A82E" strokeWidth="3" />
          <path d="M50 14 V 78" stroke="#E0A82E" strokeWidth="3" />
        </svg>
      );
    case "hourglass":
      return (
        <svg viewBox="0 0 70 100" {...s} aria-hidden="true">
          <rect x="4" y="2" width="62" height="8" rx="3" fill="#C08A3E" />
          <rect x="4" y="90" width="62" height="8" rx="3" fill="#C08A3E" />
          <path d="M12 10 C 12 40 35 44 35 50 C 35 56 12 60 12 90 H 58 C 58 60 35 56 35 50 C 35 44 58 40 58 10 Z" fill="rgba(255,255,255,0.15)" stroke="#d9d0c0" strokeWidth="3" />
          <path d="M20 84 C 26 70 44 70 50 84 Z" fill="#E9C27A" />
        </svg>
      );
    case "diya":
      return (
        <svg viewBox="0 0 100 100" {...s} aria-hidden="true">
          <path d="M50 20 C 58 34 60 44 50 52 C 40 44 42 34 50 20 Z" fill="#FFC24A" />
          <path d="M10 60 C 20 84 80 84 90 60 Z" fill="#B5531E" stroke="#E0A82E" strokeWidth="3" />
        </svg>
      );
    case "moon":
      return (
        <svg viewBox="0 0 100 100" {...s} aria-hidden="true">
          <path d="M66 8 A 44 44 0 1 0 92 70 A 36 36 0 1 1 66 8 Z" fill="#F1E4C6" />
        </svg>
      );
    default:
      return (
        <svg viewBox="-1 -1 2 2" {...s} aria-hidden="true">
          <path d="M0,-1 C0.1,-0.1 0.1,-0.1 1,0 C0.1,0.1 0.1,0.1 0,1 C-0.1,0.1 -0.1,0.1 -1,0 C-0.1,-0.1 -0.1,-0.1 0,-1 Z" fill={K.gold} />
        </svg>
      );
  }
};

const Floats: React.FC<{ kinds: string[] }> = ({ kinds }) => {
  const frame = useCurrentFrame();
  const spots = [
    { x: 40, y: 330, s: 150, r: -14 },
    { x: 870, y: 420, s: 120, r: 12 },
    { x: 60, y: 1180, s: 130, r: 10 },
    { x: 880, y: 1260, s: 140, r: -8 },
  ];
  return (
    <>
      {kinds.slice(0, 4).map((k, i) => {
        const p = spots[i];
        const dy = Math.sin(frame / (40 + i * 7) + i) * 16;
        const dx = Math.cos(frame / (55 + i * 5) + i) * 8;
        return (
          <div key={i} style={{ position: "absolute", left: p.x + dx, top: p.y + dy, transform: `rotate(${p.r + Math.sin(frame / 50 + i) * 6}deg)`, filter: "blur(2.5px)", opacity: 0.42 }}>
            <FloatIcon kind={k} size={p.s} />
          </div>
        );
      })}
    </>
  );
};

// ---------- hero picture ----------

const Placeholder: React.FC<{ name: string; kind: Hero["kind"] }> = ({ name, kind }) => (
  <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 20 }}>
    <div style={{ width: kind === "photo" ? 700 : 420, height: kind === "photo" ? 900 : 820, borderRadius: kind === "photo" ? 30 : "200px 200px 40px 40px", background: "radial-gradient(ellipse at 50% 30%, rgba(244,196,106,0.55), rgba(140,30,30,0.35) 60%, transparent 80%)", border: "3px dashed rgba(255,255,255,0.35)", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <span style={{ fontFamily: HEAD, fontWeight: 800, fontSize: 54, color: "rgba(255,255,255,0.8)", letterSpacing: 4, textTransform: "uppercase" }}>{name}</span>
    </div>
  </div>
);

const NeonRing: React.FC<{ cx: number; cy: number; r: number; on: number }> = ({ cx, cy, r, on }) => {
  const frame = useCurrentFrame();
  const flick = 0.85 + 0.15 * Math.sin(frame / 5) * Math.sin(frame / 13);
  return (
    <svg width={1080} height={1920} style={{ position: "absolute", inset: 0, overflow: "visible" }} aria-hidden="true">
      <defs>
        <filter id="neon" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="14" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <circle cx={cx} cy={cy} r={r * 1.18} fill="none" stroke="rgba(255,255,255,0.18)" strokeWidth="3" opacity={on} />
      <circle cx={cx} cy={cy} r={r} fill="none" stroke={K.red} strokeWidth="9" filter="url(#neon)" opacity={on * flick} />
    </svg>
  );
};

const HeroPic: React.FC<{ hero: Hero; src: string | null; frame0: number; dur: number; punch: number; instant?: boolean }> = ({ hero, src, frame0, dur, punch, instant }) => {
  const frame = useCurrentFrame();
  const t = frame - frame0 + (instant ? 8 : 0);
  const tin = interpolate(t, [0, 8], [0, 1], { ...clamp, easing: (x) => 1 - Math.pow(1 - x, 3) });
  const push = 1 + 0.07 * interpolate(t, [0, Math.max(30, dur)], [0, 1], clamp);
  const scale = push * interpolate(tin, [0, 1], [1.12, 1]) + punch;
  if (!src && ART_FOR[hero.img]) {
    return (
      <AbsoluteFill style={{ opacity: tin, transform: `scale(${scale})`, transformOrigin: "540px 720px" }}>
        <CodeArt kind={ART_FOR[hero.img]} />
      </AbsoluteFill>
    );
  }
  const img = src ? (
    <Img src={staticFile(src)} style={{ width: "100%", height: "100%", objectFit: hero.kind === "photo" ? "cover" : "contain" }} />
  ) : (
    <Placeholder name={hero.img} kind={hero.kind} />
  );
  if (hero.kind === "photo") {
    return (
      <div style={{ position: "absolute", left: 0, top: 230, width: 1080, height: 1380, opacity: tin, transform: `scale(${scale})`, WebkitMaskImage: "linear-gradient(180deg, transparent 0%, #000 14%, #000 72%, transparent 100%)", maskImage: "linear-gradient(180deg, transparent 0%, #000 14%, #000 72%, transparent 100%)" }}>
        {img}
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 50% 45%, transparent 45%, rgba(11,6,7,0.85) 100%)" }} />
      </div>
    );
  }
  const deity = hero.kind === "deity";
  return (
    <>
      {deity ? <NeonRing cx={540} cy={src ? 470 : 560} r={src ? 165 : 190} on={tin} /> : null}
      <div
        style={{
          position: "absolute",
          left: deity ? 90 : src ? 40 : 140,
          top: deity ? 300 : src ? 220 : 430,
          width: deity ? 900 : src ? 1000 : 800,
          height: deity ? 1240 : src ? 1560 : 900,
          opacity: tin,
          transform: `scale(${scale})`,
          transformOrigin: "50% 30%",
          mixBlendMode: src ? "lighten" : undefined,
          WebkitMaskImage: "radial-gradient(ellipse 50% 52% at 50% 46%, #000 62%, transparent 100%)",
          maskImage: "radial-gradient(ellipse 50% 52% at 50% 46%, #000 62%, transparent 100%)",
          filter: hero.kind === "object" ? "drop-shadow(0 0 40px rgba(244,196,106,0.45))" : undefined,
        }}
      >
        {img}
      </div>
    </>
  );
};

// ---------- overlays ----------

const LabelStack: React.FC<{ label: Label; at: number; until: number }> = ({ label, at, until }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  if (frame < at || frame >= until) return null;
  const a = spring({ frame: frame - at, fps, config: { damping: 16, stiffness: 220, mass: 0.6 } });
  const b = spring({ frame: frame - at - 4, fps, config: { damping: 14, stiffness: 200, mass: 0.6 } });
  const out = interpolate(frame, [until - 4, until], [1, 0], clamp);
  const long = label.bottom.length > 12;
  return (
    <div style={{ position: "absolute", left: 0, width: 1080, top: 1010, display: "flex", flexDirection: "column", alignItems: "center", opacity: out }}>
      <div style={{ transform: `translateX(${(1 - a) * -260}px) rotate(-2deg) scaleX(${0.6 + 0.4 * a})`, opacity: a, background: K.ink, border: "3px solid rgba(255,255,255,0.9)", padding: "4px 30px 12px", fontFamily: HEAD, fontWeight: 800, fontSize: 70, lineHeight: 1.15, color: K.white, zIndex: 2, boxShadow: "0 12px 30px rgba(0,0,0,0.6)" }}>
        {label.top}
      </div>
      <div style={{ marginTop: -8, transform: `translateX(${(1 - b) * 260}px) rotate(1deg) scaleX(${0.6 + 0.4 * b})`, opacity: b, background: K.white, padding: "6px 36px 16px", fontFamily: HEAD, fontWeight: 800, fontSize: long ? 76 : 100, lineHeight: 1.1, color: K.red, boxShadow: "0 16px 40px rgba(0,0,0,0.7)", maxWidth: 960, textAlign: "center" }}>
        {label.bottom}
      </div>
    </div>
  );
};

const TitleCard: React.FC<{ text: string; sub?: string; until: number }> = ({ text, sub, until }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  if (frame >= until) return null;
  const s = spring({ frame: frame + 3, fps, config: { damping: 12, stiffness: 180, mass: 0.7 } });
  const out = interpolate(frame, [until - 5, until], [1, 0], clamp);
  return (
    <div style={{ position: "absolute", left: 0, width: 1080, top: 1000, display: "flex", flexDirection: "column", alignItems: "center", gap: 16, opacity: out }}>
      <div style={{ transform: `scale(${interpolate(s, [0, 1], [1.4, 1])})`, border: "4px solid #fff", padding: "4px 60px 20px", background: "rgba(11,6,7,0.55)", fontFamily: DISPLAY, fontSize: 170, lineHeight: 1.1, color: K.white, textShadow: `0 0 40px ${K.red}` }}>{text}</div>
      {sub ? <div style={{ fontFamily: HEAD, fontWeight: 700, fontSize: 28, letterSpacing: 8, color: "rgba(255,255,255,0.75)", opacity: s }}>{sub}</div> : null}
    </div>
  );
};

const Counter: React.FC<{ n: string }> = ({ n }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - 2, fps, config: { damping: 10, stiffness: 200, mass: 0.6 } });
  return (
    <div style={{ position: "absolute", left: 70, top: 330, transform: `scale(${s}) rotate(${(1 - s) * -30}deg)`, width: 170, height: 170, borderRadius: 85, background: K.red, border: "6px solid #fff", boxShadow: `0 0 50px ${K.red}`, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column" }}>
      <span style={{ fontFamily: DISPLAY, fontSize: 110, lineHeight: 1, color: K.white, marginTop: 8 }}>{n}</span>
      <span style={{ fontFamily: HEAD, fontWeight: 800, fontSize: 24, color: K.white, marginTop: -6 }}>/ 3</span>
    </div>
  );
};

const Question: React.FC<{ at: number }> = ({ at }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  if (frame < at) return null;
  const s = spring({ frame: frame - at, fps, config: { damping: 9, stiffness: 180, mass: 0.7 } });
  return (
    <div style={{ position: "absolute", right: 70, top: 300, transform: `scale(${s}) rotate(${12 + Math.sin(frame / 9) * 6}deg)`, fontFamily: DISPLAY, fontSize: 260, lineHeight: 1, color: K.red, textShadow: `0 0 40px ${K.red}, 0 0 90px ${K.redDeep}` }}>?</div>
  );
};

// Vimshottari order and years (total 120).
const DASHA = [
  { n: "के", y: 7 },
  { n: "शु", y: 20 },
  { n: "सू", y: 6 },
  { n: "चं", y: 10 },
  { n: "मं", y: 7 },
  { n: "रा", y: 18 },
  { n: "गु", y: 16 },
  { n: "श", y: 19 },
  { n: "बु", y: 17 },
];

const Dial: React.FC<{ at: number; planetsAt: number; lifeAt: number }> = ({ at, planetsAt, lifeAt }) => {
  const frame = useCurrentFrame();
  const cx = 540;
  const cy = 820;
  const R = 430;
  const draw = interpolate(frame, [at - 6, at + 20], [0, 1], { ...clamp, easing: (x) => 1 - Math.pow(1 - x, 3) });
  const rot = frame * 0.12;
  let acc = 0;
  const segs = DASHA.map((d) => {
    const a0 = (acc / 120) * 360;
    acc += d.y;
    const a1 = (acc / 120) * 360;
    return { ...d, a0, a1 };
  });
  const pt = (a: number, r: number) => [cx + r * Math.sin((a * Math.PI) / 180), cy - r * Math.cos((a * Math.PI) / 180)];
  const life = interpolate(frame, [lifeAt, lifeAt + 30], [0, 75], clamp);
  return (
    <svg width={1080} height={1920} style={{ position: "absolute", inset: 0, overflow: "visible" }} aria-hidden="true">
      <g opacity={draw} transform={`rotate(${rot} ${cx} ${cy})`}>
        <circle cx={cx} cy={cy} r={R} fill="none" stroke="rgba(255,255,255,0.55)" strokeWidth="3" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - draw} />
        {Array.from({ length: 120 }).map((_, i) => {
          const [x1, y1] = pt(i * 3, R - (i % 10 === 0 ? 26 : 12));
          const [x2, y2] = pt(i * 3, R);
          return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="rgba(255,255,255,0.5)" strokeWidth={i % 10 === 0 ? 3 : 1.5} />;
        })}
      </g>
      {[0, 30, 60, 90].map((v) => {
        const [x, y] = pt((v / 120) * 360, R + 50);
        return (
          <text key={v} x={x} y={y + 14} textAnchor="middle" fontFamily="Mukta" fontWeight={700} fontSize="40" fill="rgba(255,255,255,0.85)" opacity={draw}>
            {v}
          </text>
        );
      })}
      {segs.map((s, i) => {
        const on = interpolate(frame, [planetsAt + i * 4, planetsAt + i * 4 + 8], [0, 1], clamp);
        const mid = (s.a0 + s.a1) / 2;
        const [x, y] = pt(mid, R - 70);
        const [ax0, ay0] = pt(s.a0 + 1, R + 10);
        const [ax1, ay1] = pt(s.a1 - 1, R + 10);
        const large = s.a1 - s.a0 > 180 ? 1 : 0;
        return (
          <g key={i} opacity={on}>
            <path d={`M ${ax0} ${ay0} A ${R + 10} ${R + 10} 0 ${large} 1 ${ax1} ${ay1}`} fill="none" stroke={i % 2 ? K.red : K.gold} strokeWidth="12" strokeLinecap="round" />
            <circle cx={x} cy={y} r={36 * on} fill={i % 2 ? K.red : "#2a1a12"} stroke="#fff" strokeWidth="3" />
            <text x={x} y={y + 12} textAnchor="middle" fontFamily="Mukta" fontWeight={800} fontSize="30" fill="#fff">
              {s.n}
            </text>
          </g>
        );
      })}
      {lifeAt >= 0 && frame >= lifeAt && life > 0.5 ? (
        <>
          <path
            d={`M ${pt(0, R + 26)[0]} ${pt(0, R + 26)[1]} A ${R + 26} ${R + 26} 0 ${(life / 120) * 360 > 180 ? 1 : 0} 1 ${pt((life / 120) * 360, R + 26)[0]} ${pt((life / 120) * 360, R + 26)[1]}`}
            fill="none"
            stroke="#7CE38B"
            strokeWidth="14"
            strokeLinecap="round"
          />
          <text x={pt((life / 120) * 360, R + 80)[0]} y={pt((life / 120) * 360, R + 80)[1] + 12} textAnchor="middle" fontFamily="Mukta" fontWeight={800} fontSize="34" fill="#7CE38B">
            {`~${Math.round(life)} साल`}
          </text>
        </>
      ) : null}
    </svg>
  );
};

// Sudarshan chakra slash for the Rahu story.
const Chakra: React.FC<{ at: number }> = ({ at }) => {
  const frame = useCurrentFrame();
  const t = frame - at;
  if (t < -14 || t > 22) return null;
  const x = interpolate(t, [-14, 4], [-300, 1300], clamp);
  const y = interpolate(t, [-14, 4], [380, 640], clamp);
  const flash = interpolate(t, [2, 6, 20], [0, 0.7, 0], clamp);
  return (
    <>
      <div style={{ position: "absolute", left: x - 90, top: y - 90, width: 180, height: 180, transform: `rotate(${frame * 40}deg)`, opacity: t < 6 ? 1 : 0 }}>
        <svg viewBox="-100 -100 200 200" width={180} height={180} aria-hidden="true">
          <circle r="70" fill="none" stroke={K.gold} strokeWidth="12" />
          {Array.from({ length: 12 }).map((_, i) => (
            <path key={i} d="M -10 -70 L 0 -98 L 10 -70 Z" fill={K.gold} transform={`rotate(${i * 30})`} />
          ))}
          <circle r="16" fill={K.gold} />
        </svg>
      </div>
      <AbsoluteFill style={{ background: "#fff", opacity: flash, pointerEvents: "none" }} />
    </>
  );
};

// Straight road vs zig-zag arrow for "सीधा रास्ता बोरिंग".
const Paths: React.FC<{ at: number }> = ({ at }) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [at, at + 20], [0, 1], { ...clamp, easing: (x) => 1 - Math.pow(1 - x, 3) });
  return (
    <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }} aria-hidden="true">
      <line x1="200" y1="940" x2="200" y2="360" stroke="rgba(255,255,255,0.35)" strokeWidth="14" strokeDasharray="20 18" pathLength={1} opacity={p} />
      <path d="M 880 940 L 800 800 L 920 690 L 820 560 L 900 400" fill="none" stroke={K.red} strokeWidth="16" strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - p} style={{ filter: `drop-shadow(0 0 14px ${K.red})` }} />
      <path d="M 860 420 L 900 380 L 930 440" fill="none" stroke={K.red} strokeWidth="16" strokeLinecap="round" strokeLinejoin="round" opacity={p > 0.95 ? 1 : 0} />
    </svg>
  );
};

// ---------- subtitles ----------

const Subtitles: React.FC<{ words: W[]; sceneEnds: number[] }> = ({ words, sceneEnds }) => {
  const { fps } = useVideoConfig();
  const pages = useMemo(() => {
    const lastInScene = new Set(
      sceneEnds.map((end) => {
        let idx = -1;
        words.forEach((w, i) => {
          if (w.startMs < end) idx = i;
        });
        return idx;
      }),
    );
    const out: TikTokPage[] = [];
    let cur: W[] = [];
    const flush = () => {
      if (!cur.length) return;
      out.push({
        text: cur.map((w) => w.text).join(" "),
        startMs: cur[0].startMs,
        durationMs: cur[cur.length - 1].endMs - cur[0].startMs,
        tokens: cur.map((w, k) => ({ text: (k ? " " : "") + w.text, fromMs: w.startMs, toMs: w.endMs })),
      });
      cur = [];
    };
    words.forEach((w, i) => {
      cur.push(w);
      const chars = cur.reduce((n, x) => n + x.text.length + 1, 0);
      if (lastInScene.has(i) || /[,।?!;:]$/.test(w.text) || cur.length >= 7 || chars > 40) flush();
    });
    flush();
    return out;
  }, [words, sceneEnds]);
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      {pages.map((page, i) => {
        const next = pages[i + 1];
        const from = Math.round((page.startMs / 1000) * fps);
        const lastEnd = page.tokens[page.tokens.length - 1]?.toMs ?? page.startMs + 1500;
        const endMs = Math.min(next ? next.startMs : Infinity, lastEnd + 400);
        const dur = Math.round((endMs / 1000) * fps) - from;
        if (dur <= 0) return null;
        return (
          <Sequence key={i} from={from} durationInFrames={dur} layout="none">
            <SubPage page={page} />
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};

const SubPage: React.FC<{ page: TikTokPage }> = ({ page }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const nowMs = page.startMs + (frame / fps) * 1000;
  return (
    <div style={{ position: "absolute", top: 1470, left: 90, right: 90, textAlign: "center", opacity: interpolate(frame, [0, 4], [0, 1], clamp) }}>
      <span style={{ whiteSpace: "pre-wrap", fontFamily: HEAD, fontWeight: 700, fontSize: 48, lineHeight: 1.35, color: K.white, textShadow: "0 2px 12px rgba(0,0,0,0.9)" }}>
        {page.tokens.map((tok, i) => (
          <span key={i} style={{ color: tok.fromMs <= nowMs && tok.toMs > nowMs ? K.gold : K.white }}>
            {tok.text}
          </span>
        ))}
      </span>
    </div>
  );
};

// ---------- one scene ----------

const SceneView: React.FC<{ scene: DevoScene; words: W[]; images: Record<string, string | null>; isFirst: boolean }> = ({ scene, words, images, isFirst }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const at = (w?: string, fb = -1) => findWordFrame(words, scene.startMs, w, fb, fps);
  const heroAt = scene.heroes.map((h, i) => (i === 0 ? 0 : at(h.word, 40 * i)));
  let cur = 0;
  heroAt.forEach((f, i) => {
    if (frame >= f) cur = i;
  });
  const labelAt = scene.labels.map((l, i) => at(l.word, 20 + i * 40));
  const punchAt = [...labelAt, ...heroAt.slice(1)];
  let punch = 0;
  punchAt.forEach((f) => {
    const t = frame - f;
    if (t >= 0 && t < 24) punch += 0.045 * Math.exp(-t / 4);
  });
  const titleUntil = scene.title ? (labelAt[0] > 0 ? labelAt[0] : 60) : 0;
  const tin = isFirst ? 1 : interpolate(frame, [0, 6], [0, 1], clamp);
  const tout = interpolate(frame, [durationInFrames - 5, durationInFrames], [1, 0], clamp);
  const lift = scene.rise ? interpolate(frame, [0, durationInFrames], [40, -40]) : 0;
  return (
    <AbsoluteFill style={{ opacity: Math.min(tin, tout) }}>
      {scene.dial ? <Dial at={at(scene.dial.word, 10)} planetsAt={scene.dial.planetsWord ? at(scene.dial.planetsWord, 60) : -9999} lifeAt={scene.dial.lifeWord ? at(scene.dial.lifeWord, 80) : -1} /> : null}
      <div style={{ position: "absolute", inset: 0, transform: `translateY(${lift}px)` }}>
        {scene.heroes.map((h, i) =>
          i === cur ? <HeroPic key={i} hero={h} src={images[h.img] ?? null} frame0={heroAt[i]} dur={(heroAt[i + 1] ?? durationInFrames) - heroAt[i]} punch={punch} instant={isFirst && i === 0} /> : null,
        )}
      </div>
      {scene.paths ? <Paths at={labelAt[0]} /> : null}
      {scene.chakraWord ? <Chakra at={at(scene.chakraWord, 60)} /> : null}
      {scene.counter ? <Counter n={scene.counter} /> : null}
      {scene.questionWord ? <Question at={at(scene.questionWord, 50)} /> : null}
      {scene.title ? <TitleCard text={scene.title} sub={scene.titleSub} until={titleUntil} /> : null}
      {scene.labels.map((l, i) => (
        <LabelStack key={i} label={l} at={labelAt[i]} until={labelAt[i + 1] ?? durationInFrames + 1} />
      ))}
    </AbsoluteFill>
  );
};

const Sfx: React.FC<{ at: number; src: string; volume: number; len?: number }> = ({ at, src, volume, len = 1 }) => {
  const { fps } = useVideoConfig();
  return (
    <Sequence from={Math.max(0, at)} durationInFrames={Math.round(fps * len)} layout="none">
      <Audio src={staticFile(src)} volume={volume} />
    </Sequence>
  );
};

export const DevoReel: React.FC<DevoReelProps> = (props) => {
  const { fps, durationInFrames } = useVideoConfig();
  const toFrame = (ms: number) => Math.round((ms / 1000) * fps);
  const starts = props.scenes.map((s, i) => (i === 0 ? 0 : toFrame(s.startMs)));
  const pops: number[] = [];
  const swaps: number[] = [];
  props.scenes.forEach((s, i) => {
    s.labels.forEach((l) => {
      const f = findWordFrame(props.words, s.startMs, l.word, -1, fps);
      if (f >= 0) pops.push(starts[i] + f);
    });
    s.heroes.slice(1).forEach((h) => {
      const f = findWordFrame(props.words, s.startMs, h.word, -1, fps);
      if (f >= 0) swaps.push(starts[i] + f);
    });
  });
  return (
    <AbsoluteFill style={{ background: K.bg }}>
      <Stage />
      <Floats kinds={props.floats ?? ["diya", "moon", "star", "coin"]} />
      {props.scenes.map((scene, i) => {
        const from = starts[i];
        const to = starts[i + 1] ?? durationInFrames;
        return (
          <Sequence key={i} from={from} durationInFrames={Math.max(1, to - from)} premountFor={fps}>
            <SceneView scene={scene} words={props.words} images={props.images} isFirst={i === 0} />
          </Sequence>
        );
      })}
      <div style={{ position: "absolute", top: 190, left: 0, width: 1080, display: "flex", justifyContent: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, opacity: 0.9 }}>
          <span style={{ fontFamily: DISPLAY, fontSize: 40, color: K.white }}>Astro</span>
          <span style={{ padding: "2px 12px", borderRadius: 10, background: K.red, color: K.white, fontFamily: HEAD, fontWeight: 800, fontSize: 26 }}>24X7</span>
        </div>
      </div>
      {props.captions && props.words.length ? <Subtitles words={props.words} sceneEnds={props.scenes.map((s) => s.endMs)} /> : null}
      <AbsoluteFill style={{ pointerEvents: "none", background: "radial-gradient(ellipse at center, transparent 55%, rgba(0,0,0,0.6) 100%)" }} />

      {props.audio ? <Audio src={staticFile(props.audio)} /> : null}
      {props.music ? (
        <Audio src={staticFile(props.music)} volume={(f) => props.musicVolume * interpolate(f, [0, 6, durationInFrames - 50, durationInFrames - 1], [0.5, 1, 1, 0], clamp)} />
      ) : null}
      {props.sfx ? (
        <>
          <Sfx at={0} src="sfx/hit.wav" volume={0.5} />
          {starts.slice(1).map((f, i) => (
            <Sfx key={`w${i}`} at={f - 4} src="sfx/whoosh.wav" volume={0.2} len={0.6} />
          ))}
          {swaps.map((f, i) => (
            <Sfx key={`s${i}`} at={f - 3} src="sfx/whoosh.wav" volume={0.18} len={0.6} />
          ))}
          {pops.map((f, i) => (
            <Sfx key={`p${i}`} at={f} src="sfx/pop.wav" volume={0.22} len={0.4} />
          ))}
        </>
      ) : null}
    </AbsoluteFill>
  );
};
