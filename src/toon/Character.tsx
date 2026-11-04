// Original 2D narrator for Astro 24x7 (flat vector style). Rigged in code:
// blink, brows, mouth driven by the voice loudness, head bob, poseable arms.
import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

const INK = "#1A1410";

export type Pose = "idle" | "point" | "explain" | "both" | "ear" | "wave" | "shrug";
type ArmPose = { a1: number; a2: number }; // degrees from straight down; + = outward, - = inward
const POSES: Record<Pose, { L: ArmPose; R: ArmPose }> = {
  idle: { L: { a1: 12, a2: 4 }, R: { a1: 12, a2: 4 } },
  point: { L: { a1: 12, a2: 4 }, R: { a1: 148, a2: 162 } },
  explain: { L: { a1: 14, a2: 8 }, R: { a1: 42, a2: 146 } },
  both: { L: { a1: 40, a2: 140 }, R: { a1: 42, a2: 146 } },
  ear: { L: { a1: 12, a2: 4 }, R: { a1: 120, a2: -146 } },
  wave: { L: { a1: 12, a2: 4 }, R: { a1: 132, a2: 172 } },
  shrug: { L: { a1: 52, a2: -150 }, R: { a1: 52, a2: -150 } },
};

export type Look = {
  skin: string;
  skinShade: string;
  kurta: string;
  kurtaShade: string;
  trim: string;
  hair: string;
  variant: "guy" | "girl";
};

export const NARRATOR: Look = { skin: "#C98A5E", skinShade: "#B07650", kurta: "#FF7A1A", kurtaShade: "#E8590C", trim: "#FFF3E6", hair: "#1A1410", variant: "guy" };
export const FRIEND: Look = { skin: "#E0A57A", skinShade: "#C98D66", kurta: "#1C7C7D", kurtaShade: "#145E5F", trim: "#FFE7CC", hair: "#2A1C14", variant: "girl" };

const rad = (d: number) => (d * Math.PI) / 180;

export const Character: React.FC<{
  width: number;
  look?: Look;
  pose: Pose;
  poseAt?: number; // frame the current pose started (for the blend)
  prevPose?: Pose;
  mouth?: number; // 0..1 openness
  brows?: number; // -1 angry .. 0 .. 1 raised
  mood?: "smile" | "flat" | "o";
  lookX?: number;
  seed?: number;
  flip?: boolean;
}> = ({ width, look = NARRATOR, pose, poseAt = 0, prevPose = "idle", mouth = 0, brows = 0, mood = "smile", lookX = 0, seed = 0, flip }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const k = spring({ frame: frame - poseAt, fps, config: { damping: 14, stiffness: 120, mass: 0.8 } });
  const from = POSES[prevPose];
  const to = POSES[pose];
  const wiggle = pose === "wave" ? Math.sin(frame / 3.2) * 16 : pose === "explain" || pose === "both" ? Math.sin(frame / 7 + seed) * 7 : 0;
  const arm = (side: "L" | "R") => ({
    a1: from[side].a1 + (to[side].a1 - from[side].a1) * k + (side === "R" ? wiggle * 0.3 : -wiggle * 0.3),
    a2: from[side].a2 + (to[side].a2 - from[side].a2) * k + (side === "R" ? wiggle : -wiggle * 0.6),
  });

  // blink every ~3 s (two quick frames), offset by seed
  const t = (frame + seed * 37) % 96;
  const blink = t < 4 ? [1, 0.15, 0.1, 0.6][t] : 1;
  const breathe = Math.sin(frame / 22 + seed) * 0.008;
  const bob = mouth * 3 + Math.sin(frame / 22 + seed) * 2;
  const tilt = Math.sin(frame / 31 + seed) * 2.2 + (mouth - 0.3) * 2;
  const m = Math.max(0, Math.min(1, mouth));

  const shoulder = { L: { x: 108, y: 392 }, R: { x: 292, y: 392 } };
  const len1 = 118;
  const len2 = 104;
  const armPath = (side: "L" | "R") => {
    const s = side === "L" ? -1 : 1;
    const { a1, a2 } = arm(side);
    const sh = shoulder[side];
    const el = { x: sh.x + s * Math.sin(rad(a1)) * len1, y: sh.y + Math.cos(rad(a1)) * len1 };
    const hd = { x: el.x + s * Math.sin(rad(a2)) * len2, y: el.y + Math.cos(rad(a2)) * len2 };
    return { sh, el, hd, a2, s };
  };
  const arms = (["L", "R"] as const).map((side) => ({ side, ...armPath(side) }));

  const browY = 160 - brows * 8;
  const browRot = brows < 0 ? -brows * 16 : -brows * 4;

  // mouth shapes
  let mouthEl: React.ReactNode;
  if (m > 0.08) {
    const ry = 5 + 21 * m;
    const rx = 22 + 5 * m;
    mouthEl = (
      <g>
        <ellipse cx={200} cy={258} rx={rx} ry={ry} fill="#5A1A1A" stroke={INK} strokeWidth="5" />
        <ellipse cx={200} cy={258 + ry * 0.45} rx={rx * 0.55} ry={ry * 0.4} fill="#E06060" />
        <rect x={200 - rx * 0.6} y={258 - ry + 2} width={rx * 1.2} height={Math.min(8, ry * 0.5)} rx={3} fill="#FFFFFF" />
      </g>
    );
  } else if (mood === "o") {
    mouthEl = <ellipse cx={200} cy={260} rx={10} ry={12} fill="#5A1A1A" stroke={INK} strokeWidth="5" />;
  } else if (mood === "flat") {
    mouthEl = <path d="M 178 262 Q 200 254 222 262" fill="none" stroke={INK} strokeWidth="6" strokeLinecap="round" />;
  } else {
    mouthEl = <path d="M 176 252 Q 200 272 224 252" fill="none" stroke={INK} strokeWidth="6" strokeLinecap="round" />;
  }

  const girl = look.variant === "girl";
  return (
    <svg width={width} height={width * 1.4} viewBox="0 0 400 560" style={{ overflow: "visible", transform: flip ? "scaleX(-1)" : undefined }} aria-hidden="true">
      <g transform={`translate(200 560) scale(${1 + breathe} ${1 - breathe}) translate(-200 -560)`}>
        {/* back hair for the girl */}
        {girl ? <path d="M 110 170 C 100 300 120 360 150 380 L 250 380 C 280 360 300 300 290 170 Z" fill={look.hair} stroke={INK} strokeWidth="5" /> : null}
        {/* body */}
        <path d="M 52 600 C 52 452 88 372 200 362 C 312 372 348 452 348 600 Z" fill={look.kurta} stroke={INK} strokeWidth="6" strokeLinejoin="round" />
        <path d="M 200 362 C 250 366 290 380 316 410 C 300 470 300 540 304 600 L 348 600 C 348 452 312 372 200 362 Z" fill={look.kurtaShade} opacity="0.55" />
        {/* stole / dupatta */}
        <path d="M 128 384 C 150 440 168 520 160 600 L 196 600 C 198 520 182 430 168 372 Z" fill={look.trim} stroke={INK} strokeWidth="5" strokeLinejoin="round" />
        {/* collar placket */}
        <path d="M 200 368 L 200 470" stroke={INK} strokeWidth="5" />
        {[400, 430, 460].map((y) => (
          <circle key={y} cx={212} cy={y} r={5} fill={look.trim} stroke={INK} strokeWidth="3" />
        ))}
        {/* neck */}
        <path d="M 174 290 L 174 366 Q 200 384 226 366 L 226 290 Z" fill={look.skinShade} stroke={INK} strokeWidth="5" />
        {/* head group */}
        <g transform={`translate(0 ${-bob}) rotate(${tilt} 200 300)`}>
          <ellipse cx={110} cy={210} rx={16} ry={24} fill={look.skin} stroke={INK} strokeWidth="5" />
          <ellipse cx={290} cy={210} rx={16} ry={24} fill={look.skin} stroke={INK} strokeWidth="5" />
          {girl ? (
            <>
              <circle cx={108} cy={240} r={7} fill="#F2C14E" stroke={INK} strokeWidth="3" />
              <circle cx={292} cy={240} r={7} fill="#F2C14E" stroke={INK} strokeWidth="3" />
            </>
          ) : null}
          <path d="M 200 86 C 268 86 296 140 294 210 C 292 278 252 318 200 318 C 148 318 108 278 106 210 C 104 140 132 86 200 86 Z" fill={look.skin} stroke={INK} strokeWidth="6" />
          {/* hair */}
          {girl ? (
            <>
              <path d="M 104 196 C 96 110 150 74 204 76 C 262 78 306 116 296 196 C 280 150 250 120 204 118 C 160 120 124 146 104 196 Z" fill={look.hair} stroke={INK} strokeWidth="5" />
              <circle cx={200} cy={70} r={34} fill={look.hair} stroke={INK} strokeWidth="5" />
            </>
          ) : (
            <path d="M 106 190 C 92 110 150 66 208 70 C 270 74 312 118 296 188 C 288 160 272 132 240 124 C 226 140 180 146 150 136 C 132 150 116 168 106 190 Z" fill={look.hair} stroke={INK} strokeWidth="5" />
          )}
          {/* tilak */}
          <ellipse cx={200} cy={142} rx={5} ry={11} fill="#FF7A1A" stroke={INK} strokeWidth="2.5" />
          {/* brows */}
          <rect x={146} y={browY} width={40} height={10} rx={5} fill={INK} transform={`rotate(${browRot} 166 ${browY + 5})`} />
          <rect x={214} y={browY} width={40} height={10} rx={5} fill={INK} transform={`rotate(${-browRot} 234 ${browY + 5})`} />
          {/* eyes */}
          {[166, 234].map((x) => (
            <g key={x} transform={`translate(${x} 198) scale(1 ${blink})`}>
              <ellipse rx={16} ry={18} fill="#FFFFFF" stroke={INK} strokeWidth="4" />
              <circle cx={lookX * 6} cy={2} r={8.5} fill={INK} />
              <circle cx={lookX * 6 + 3} cy={-2} r={2.6} fill="#FFFFFF" />
            </g>
          ))}
          {/* nose */}
          <path d="M 200 206 Q 194 228 204 232" fill="none" stroke={INK} strokeWidth="4.5" strokeLinecap="round" />
          {/* cheeks */}
          <ellipse cx={146} cy={240} rx={14} ry={8} fill="#E8590C" opacity="0.18" />
          <ellipse cx={254} cy={240} rx={14} ry={8} fill="#E8590C" opacity="0.18" />
          {mouthEl}
        </g>
        {/* arms */}
        {arms.map(({ side, sh, el, hd, a2, s }) => {
          const pointing = side === "R" && (pose === "point" || pose === "wave") && k > 0.5;
          const dir = { x: s * Math.sin(rad(a2)), y: Math.cos(rad(a2)) };
          return (
            <g key={side}>
              <line x1={sh.x} y1={sh.y} x2={el.x} y2={el.y} stroke={INK} strokeWidth="52" strokeLinecap="round" />
              <line x1={sh.x} y1={sh.y} x2={el.x} y2={el.y} stroke={look.kurta} strokeWidth="42" strokeLinecap="round" />
              <line x1={el.x} y1={el.y} x2={hd.x} y2={hd.y} stroke={INK} strokeWidth="40" strokeLinecap="round" />
              <line x1={el.x} y1={el.y} x2={hd.x} y2={hd.y} stroke={look.skin} strokeWidth="30" strokeLinecap="round" />
              <circle cx={el.x} cy={el.y} r={23} fill={look.kurta} stroke={INK} strokeWidth="5" />
              {pointing && pose === "point" ? (
                <>
                  <line x1={hd.x} y1={hd.y} x2={hd.x + dir.x * 40} y2={hd.y + dir.y * 40} stroke={INK} strokeWidth="20" strokeLinecap="round" />
                  <line x1={hd.x} y1={hd.y} x2={hd.x + dir.x * 40} y2={hd.y + dir.y * 40} stroke={look.skin} strokeWidth="11" strokeLinecap="round" />
                </>
              ) : null}
              <circle cx={hd.x} cy={hd.y} r={pose === "wave" && side === "R" ? 28 : 24} fill={look.skin} stroke={INK} strokeWidth="5" />
            </g>
          );
        })}
      </g>
    </svg>
  );
};

// Smoothed mouth value for frame `f` from the per-frame loudness track.
export const mouthAt = (track: number[], f: number) => {
  if (!track.length) return 0;
  const g = (i: number) => track[Math.max(0, Math.min(track.length - 1, i))] ?? 0;
  const v = (g(f - 1) + g(f) * 2 + g(f + 1)) / 4;
  return interpolate(v, [0.15, 0.85], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
};
