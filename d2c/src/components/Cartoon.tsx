import React from "react";
import { interpolate, random, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { C, theme } from "../theme";
import { Hand, HandType, Limb, dir } from "./Doctor";

/* =========================================================
   Cartoon cast + props for full-2D reels.
   Person rig: full body, viewBox 420×860, navy outlines.
   ========================================================= */

const LINE = C.navy;

export type Mood = "neutral" | "happy" | "grin" | "sad" | "shock" | "shout";
export type BodyPose = "idle" | "megaphone" | "cheer" | "shrug" | "hold" | "sad" | "wave";

const ARM: Record<BodyPose, { L: [number, number]; R: [number, number]; hl: HandType; hr: HandType }> = {
  idle: { L: [-12, -6], R: [12, 6], hl: "fist", hr: "fist" },
  megaphone: { L: [-12, -6], R: [62, 168], hl: "fist", hr: "fist" },
  cheer: { L: [-152, -172], R: [152, 172], hl: "open", hr: "open" },
  shrug: { L: [-48, -138], R: [48, 138], hl: "open", hr: "open" },
  hold: { L: [-22, 68], R: [22, -68], hl: "fist", hr: "fist" },
  sad: { L: [-4, -2], R: [4, 2], hl: "fist", hr: "fist" },
  wave: { L: [-12, -6], R: [140, 170], hl: "fist", hr: "open" },
};

export type Look = {
  skin: string;
  skinD: string;
  hair: string;
  top: string;
  topD: string;
  bottom: string;
  hairStyle: "messy" | "ponytail";
};

export const ROHIT: Look = { skin: "#D9A06B", skinD: "#BE8352", hair: "#1B1530", top: "#F5B400", topD: "#D99A00", bottom: "#2E3A6B", hairStyle: "messy" };
export const PRIYA: Look = { skin: "#C98B60", skinD: "#AE7247", hair: "#2A1A24", top: "#20B2A0", topD: "#178A7C", bottom: "#6D4AFD", hairStyle: "ponytail" };

export type PoseAt = { at: number; pose: BodyPose; mood?: Mood };

const usePoseTrack = (track: PoseAt[]) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const sorted = [...track].sort((a, b) => a.at - b.at);
  let i = -1;
  for (let k = 0; k < sorted.length; k++) if (frame >= sorted[k].at) i = k;
  const cur = i >= 0 ? sorted[i] : { at: -999, pose: "idle" as BodyPose, mood: "neutral" as Mood };
  const prev = i > 0 ? sorted[i - 1] : cur;
  const p = spring({ frame: frame - cur.at, fps, config: { damping: 14, stiffness: 150, mass: 0.7 } });
  const A = ARM[prev.pose];
  const B = ARM[cur.pose];
  const lerp = (a: number, b: number) => a + (b - a) * p;
  // mood: latest defined mood at or before frame
  let mood: Mood = "neutral";
  for (const k of sorted) if (frame >= k.at && k.mood) mood = k.mood;
  return {
    L: [lerp(A.L[0], B.L[0]), lerp(A.L[1], B.L[1])] as [number, number],
    R: [lerp(A.R[0], B.R[0]), lerp(A.R[1], B.R[1])] as [number, number],
    hl: p > 0.5 ? B.hl : A.hl,
    hr: p > 0.5 ? B.hr : A.hr,
    pose: cur.pose,
    mood,
    since: frame - cur.at,
  };
};

export const Person: React.FC<{ look: Look; track: PoseAt[]; seed?: string; prop?: React.ReactNode; flip?: boolean }> = ({ look, track, seed = "p", prop, flip }) => {
  const frame = useCurrentFrame();
  const st = usePoseTrack(track);
  const mood = st.mood;

  // blink
  let blink = 1;
  {
    let t = 14 + Math.floor(random(`${seed}b0`) * 40);
    let k = 0;
    while (t < frame + 10 && k < 300) {
      const d = frame - t;
      if (d >= 0 && d < 5) blink = [0.6, 0.1, 0.1, 0.5, 1][d];
      t += 75 + Math.floor(random(`${seed}b${k}`) * 70);
      k++;
    }
  }
  const jump = st.pose === "cheer" ? Math.abs(Math.sin((frame - 0) / 5)) * 26 : 0;
  const sway = Math.sin(frame / 32) * 1.5;
  const breathe = 1 + Math.sin(frame / 24) * 0.01;
  const slump = st.pose === "sad" ? 10 : 0;
  const wave = st.pose === "wave" ? Math.sin(frame / 3) * 14 : 0;
  const shake = mood === "shock" && st.since < 12 ? Math.sin(st.since * 2.5) * 6 * Math.exp(-st.since / 5) : 0;

  const SL: [number, number] = [128, 352];
  const SR: [number, number] = [292, 352];
  const arm = (S: [number, number], a: [number, number], extra = 0) => {
    const d1 = dir(a[0]);
    const E: [number, number] = [S[0] + d1[0] * 128, S[1] + d1[1] * 128];
    const d2 = dir(a[1] + extra);
    const W: [number, number] = [E[0] + d2[0] * 118, E[1] + d2[1] * 118];
    return { E, W, a2: a[1] + extra };
  };
  const L = arm(SL, [st.L[0] + Math.sin(frame / 19) * 2, st.L[1] + Math.sin(frame / 15) * 2]);
  const R = arm(SR, [st.R[0] - Math.sin(frame / 21) * 2, st.R[1] - Math.sin(frame / 17) * 2], wave);

  const eyeR = mood === "shock" ? 6 : 10;
  const brows: Record<Mood, [string, string]> = {
    neutral: ["M150 140 Q172 132 194 138", "M226 138 Q248 132 270 140"],
    happy: ["M150 136 Q172 122 194 132", "M226 132 Q248 122 270 136"],
    grin: ["M150 134 Q172 118 194 128", "M226 128 Q248 118 270 134"],
    sad: ["M150 132 Q174 136 194 146", "M226 146 Q246 136 270 132"],
    shock: ["M150 120 Q172 104 194 116", "M226 116 Q248 104 270 120"],
    shout: ["M152 128 Q176 140 196 150", "M224 150 Q244 140 268 128"],
  };
  const mouth = () => {
    switch (mood) {
      case "happy":
        return <path d="M178 238 Q210 266 242 238" fill="none" stroke={LINE} strokeWidth={7} strokeLinecap="round" />;
      case "grin":
        return (
          <g>
            <path d="M172 232 Q210 290 248 232 Z" fill="#3A1020" stroke={LINE} strokeWidth={5} strokeLinejoin="round" />
            <path d="M178 236 L242 236 L238 248 L182 248 Z" fill={C.white} />
          </g>
        );
      case "sad":
        return <path d="M184 258 Q210 236 236 258" fill="none" stroke={LINE} strokeWidth={7} strokeLinecap="round" />;
      case "shock":
        return <ellipse cx={210} cy={250} rx={15} ry={19} fill="#3A1020" stroke={LINE} strokeWidth={5} />;
      case "shout": {
        const o = 1 + Math.sin(frame / 2.2) * 0.12;
        return (
          <g transform={`translate(210 250) scale(1 ${o}) translate(-210 -250)`}>
            <ellipse cx={210} cy={250} rx={32} ry={28} fill="#3A1020" stroke={LINE} strokeWidth={5} />
            <ellipse cx={210} cy={262} rx={16} ry={9} fill="#E0707A" />
          </g>
        );
      }
      default:
        return <path d="M190 246 Q210 252 230 246" fill="none" stroke={LINE} strokeWidth={7} strokeLinecap="round" />;
    }
  };

  return (
    <svg width={420} height={860} viewBox="0 0 420 860" style={{ overflow: "visible", transform: flip ? "scaleX(-1)" : undefined }}>
      <g transform={`translate(${shake} ${-jump + slump}) rotate(${sway} 210 560)`}>
        {/* legs */}
        <Limb x1={168} y1={560} x2={160} y2={790} w={60} color={look.bottom} />
        <Limb x1={252} y1={560} x2={262} y2={790} w={60} color={look.bottom} />
        <rect x={110} y={786} width={92} height={40} rx={18} fill={C.white} stroke={LINE} strokeWidth={5} />
        <rect x={222} y={786} width={92} height={40} rx={18} fill={C.white} stroke={LINE} strokeWidth={5} />
        <rect x={116} y={812} width={80} height={8} rx={4} fill={C.lavender} />
        <rect x={228} y={812} width={80} height={8} rx={4} fill={C.lavender} />
        {/* torso */}
        <g transform={`translate(210 560) scale(1 ${breathe}) translate(-210 -560)`}>
          {look.hairStyle === "messy" && <ellipse cx={210} cy={318} rx={78} ry={30} fill={look.topD} stroke={LINE} strokeWidth={5} />}
          <rect x={186} y={262} width={48} height={72} rx={14} fill={look.skinD} stroke={LINE} strokeWidth={5} />
          <path d="M112 380 Q118 330 170 322 L250 322 Q302 330 308 380 L300 580 L120 580 Z" fill={look.top} stroke={LINE} strokeWidth={6} strokeLinejoin="round" />
          {look.hairStyle === "messy" ? (
            <>
              <rect x={160} y={470} width={100} height={58} rx={18} fill={look.topD} stroke={LINE} strokeWidth={4} />
              <path d="M196 330 L192 392" stroke={C.white} strokeWidth={6} strokeLinecap="round" />
              <path d="M224 330 L228 392" stroke={C.white} strokeWidth={6} strokeLinecap="round" />
            </>
          ) : (
            <>
              <path d="M170 322 Q210 380 250 322" fill="none" stroke={LINE} strokeWidth={5} />
              <path d="M140 420 Q210 450 280 420" fill="none" stroke={look.topD} strokeWidth={10} strokeLinecap="round" />
              <path d="M150 500 Q210 520 270 500" fill="none" stroke={look.topD} strokeWidth={10} strokeLinecap="round" />
            </>
          )}
        </g>
        {/* left arm */}
        <Limb x1={SL[0]} y1={SL[1]} x2={L.E[0]} y2={L.E[1]} w={50} color={look.top} />
        <Limb x1={L.E[0]} y1={L.E[1]} x2={L.W[0]} y2={L.W[1]} w={46} color={look.top} />
        <g transform={`translate(${L.W[0]} ${L.W[1]}) rotate(${-L.a2}) scale(0.82)`}>
          <Hand type={st.hl} skin={look.skin} />
        </g>
        {/* head */}
        <g transform={`rotate(${sway * 1.5 + (mood === "shout" ? Math.sin(frame / 3) * 2 : 0)} 210 300)`}>
          <circle cx={128} cy={196} r={20} fill={look.skinD} stroke={LINE} strokeWidth={5} />
          <circle cx={292} cy={196} r={20} fill={look.skinD} stroke={LINE} strokeWidth={5} />
          {look.hairStyle === "ponytail" && (
            <path d={`M270 120 Q352 150 ${336 + Math.sin(frame / 9) * 6} 280 Q320 200 262 150 Z`} fill={look.hair} stroke={LINE} strokeWidth={5} strokeLinejoin="round" />
          )}
          <ellipse cx={210} cy={190} rx={86} ry={98} fill={look.skin} stroke={LINE} strokeWidth={5.5} />
          {look.hairStyle === "messy" ? (
            <path d="M126 170 Q118 92 170 80 L178 62 L196 80 L214 56 L230 80 L250 62 L258 86 Q302 100 294 170 Q278 128 240 124 Q210 136 182 122 Q146 132 126 170 Z" fill={look.hair} stroke={LINE} strokeWidth={5} strokeLinejoin="round" />
          ) : (
            <path d="M124 196 Q112 92 210 86 Q306 92 296 196 Q290 140 252 124 Q214 150 170 128 Q134 146 124 196 Z" fill={look.hair} stroke={LINE} strokeWidth={5} strokeLinejoin="round" />
          )}
          {(mood === "happy" || mood === "grin") && (
            <>
              <ellipse cx={160} cy={226} rx={16} ry={10} fill="#F28C9A" opacity={0.55} />
              <ellipse cx={260} cy={226} rx={16} ry={10} fill="#F28C9A" opacity={0.55} />
            </>
          )}
          {[175, 245].map((cx) => (
            <g key={cx} transform={`translate(${cx} 182) scale(1 ${blink}) translate(${-cx} -182)`}>
              <ellipse cx={cx} cy={182} rx={19} ry={23} fill={C.white} stroke={LINE} strokeWidth={4.5} />
              <circle cx={cx + (mood === "sad" ? 0 : 2)} cy={mood === "sad" ? 190 : 184} r={eyeR} fill={LINE} />
              <circle cx={cx + 5} cy={178} r={3.5} fill={C.white} />
            </g>
          ))}
          <path d={brows[mood][0]} fill="none" stroke={look.hair} strokeWidth={10} strokeLinecap="round" />
          <path d={brows[mood][1]} fill="none" stroke={look.hair} strokeWidth={10} strokeLinecap="round" />
          <path d="M210 196 Q204 216 200 222 Q210 228 220 222" fill="none" stroke={look.skinD} strokeWidth={5} strokeLinecap="round" />
          {mouth()}
          {mood === "sad" && <path d={`M262 ${206 + ((frame % 40) / 40) * 30} q6 10 0 16 q-6 -6 0 -16`} fill="#7FC8F8" opacity={0.85} />}
        </g>
        {/* prop held in front (drawn by the scene) */}
        {prop}
        {/* right arm (front) */}
        <Limb x1={SR[0]} y1={SR[1]} x2={R.E[0]} y2={R.E[1]} w={50} color={look.top} />
        <Limb x1={R.E[0]} y1={R.E[1]} x2={R.W[0]} y2={R.W[1]} w={46} color={look.top} />
        <g transform={`translate(${R.W[0]} ${R.W[1]}) rotate(${-R.a2}) scale(0.82)`}>
          <Hand type={st.hr} skin={look.skin} />
        </g>
        {st.pose === "megaphone" && (
          <g transform="translate(250 200) rotate(-14)">
            <path d="M0 18 L150 -40 L150 96 L0 46 Z" fill={C.violet} stroke={LINE} strokeWidth={6} strokeLinejoin="round" />
            <rect x={-26} y={12} width={30} height={40} rx={8} fill={C.violetDeep} stroke={LINE} strokeWidth={5} />
            <ellipse cx={150} cy={28} rx={16} ry={68} fill={C.lavender} stroke={LINE} strokeWidth={6} />
          </g>
        )}
      </g>
    </svg>
  );
};

/* ---------- props ---------- */

export const Note: React.FC<{ w?: number; rot?: number; style?: React.CSSProperties }> = ({ w = 120, rot = 0, style }) => (
  <svg width={w} height={w * 0.5} viewBox="0 0 120 60" style={{ transform: `rotate(${rot}deg)`, ...style }}>
    <rect x={2} y={2} width={116} height={56} rx={8} fill="#9FE3B6" stroke={LINE} strokeWidth={4} />
    <circle cx={60} cy={30} r={15} fill="#6CCB8E" stroke={LINE} strokeWidth={3} />
    <text x={60} y={37} textAnchor="middle" fontFamily="Poppins" fontWeight="700" fontSize="20" fill={LINE}>
      ₹
    </text>
    <rect x={12} y={12} width={18} height={8} rx={3} fill="#6CCB8E" />
    <rect x={90} y={40} width={18} height={8} rx={3} fill="#6CCB8E" />
  </svg>
);

export const Coin: React.FC<{ size?: number }> = ({ size = 60 }) => (
  <svg width={size} height={size} viewBox="0 0 60 60">
    <circle cx={30} cy={30} r={27} fill="#F5B400" stroke={LINE} strokeWidth={4} />
    <circle cx={30} cy={30} r={19} fill="#FFD24D" />
    <text x={30} y={39} textAnchor="middle" fontFamily="Poppins" fontWeight="700" fontSize="26" fill={LINE}>
      ₹
    </text>
  </svg>
);

/** Glass jar that fills to `level` (0–1). */
export const Jar: React.FC<{ level: number; color: string; label: string; amount?: string; w?: number; icon?: React.ReactNode }> = ({ level, color, label, amount, w = 250, icon }) => {
  const h = w * 1.15;
  const cid = `jar-${label.replace(/[^a-z0-9]/gi, "")}`;
  return (
    <div style={{ width: w, display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
      <div style={{ fontFamily: theme.fonts.display, fontWeight: 700, fontSize: 64, lineHeight: 1, color, height: 66, fontVariantNumeric: "tabular-nums" }}>{amount ?? ""}</div>
      <svg width={w} height={h} viewBox="0 0 250 288">
        <rect x={52} y={6} width={146} height={28} rx={8} fill="#B9B3CC" stroke={LINE} strokeWidth={5} />
        <path d="M40 40 H210 Q236 40 236 70 V258 Q236 282 210 282 H40 Q14 282 14 258 V70 Q14 40 40 40 Z" fill="rgba(255,255,255,0.75)" stroke={LINE} strokeWidth={6} />
        <clipPath id={cid}>
          <path d="M40 44 H210 Q232 44 232 70 V258 Q232 278 210 278 H40 Q18 278 18 258 V70 Q18 44 40 44 Z" />
        </clipPath>
        <g clipPath={`url(#${cid})`}>
          <rect x={0} y={282 - 236 * level} width={250} height={240} fill={color} opacity={0.85} />
          <path d={`M0 ${282 - 236 * level} q30 -10 62 0 t62 0 t62 0 t64 0`} fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth={5} />
        </g>
        <path d="M44 70 V240" stroke="rgba(255,255,255,0.9)" strokeWidth={10} strokeLinecap="round" />
        {icon && <g transform="translate(125 170)">{icon}</g>}
      </svg>
      <div style={{ fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 30, color: LINE, textAlign: "center", lineHeight: 1.15, background: C.white, border: `4px solid ${LINE}`, borderRadius: 14, padding: "8px 14px", whiteSpace: "nowrap" }}>{label}</div>
    </div>
  );
};

export const Parcel: React.FC<{ w?: number; color?: string; tag?: string; ribbon?: boolean }> = ({ w = 220, color = "#D8B98A", tag, ribbon }) => (
  <svg width={w} height={w * 0.85} viewBox="0 0 220 187" style={{ overflow: "visible" }}>
    <path d="M20 50 L110 20 L200 50 L200 160 L110 185 L20 160 Z" fill={color} stroke={LINE} strokeWidth={6} strokeLinejoin="round" />
    <path d="M20 50 L110 80 L200 50 M110 80 V185" fill="none" stroke={LINE} strokeWidth={5} />
    <path d="M65 35 L155 65 L155 95" fill="none" stroke="#B89766" strokeWidth={14} />
    {ribbon && (
      <>
        <path d="M110 80 V185" stroke={C.red} strokeWidth={14} />
        <path d="M20 50 L110 80 L200 50" fill="none" stroke={C.red} strokeWidth={12} />
        <path d="M110 22 q-40 -30 -30 -2 q8 14 30 2 q22 12 30 -2 q10 -28 -30 2" fill={C.red} stroke={LINE} strokeWidth={4} />
      </>
    )}
    {tag && (
      <g transform="translate(150 120) rotate(-8)">
        <rect x={0} y={0} width={110} height={52} rx={10} fill={C.white} stroke={LINE} strokeWidth={5} />
        <text x={55} y={36} textAnchor="middle" fontFamily="Poppins" fontWeight="700" fontSize="28" fill={LINE}>
          {tag}
        </text>
      </g>
    )}
  </svg>
);

export const Piggy: React.FC<{ w?: number; color?: string }> = ({ w = 300, color = "#F7A8C4" }) => (
  <svg width={w} height={w * 0.8} viewBox="0 0 300 240">
    <ellipse cx={150} cy={130} rx={118} ry={92} fill={color} stroke={LINE} strokeWidth={7} />
    <ellipse cx={262} cy={130} rx={26} ry={30} fill="#F28CB0" stroke={LINE} strokeWidth={6} />
    <circle cx={256} cy={124} r={5} fill={LINE} />
    <circle cx={268} cy={136} r={5} fill={LINE} />
    <circle cx={210} cy={96} r={9} fill={LINE} />
    <path d="M150 42 L196 30 L190 74 Z" fill="#F28CB0" stroke={LINE} strokeWidth={6} strokeLinejoin="round" />
    <rect x={112} y={34} width={64} height={12} rx={6} fill={LINE} />
    {[80, 130, 180, 220].map((x) => (
      <rect key={x} x={x - 16} y={196} width={32} height={40} rx={10} fill={color} stroke={LINE} strokeWidth={6} />
    ))}
    <path d="M32 120 q-26 -10 -18 -32 q8 -16 22 0" fill="none" stroke={LINE} strokeWidth={6} strokeLinecap="round" />
  </svg>
);

export const Truck: React.FC<{ w?: number }> = ({ w = 240 }) => (
  <svg width={w} height={w * 0.6} viewBox="0 0 240 144">
    <rect x={6} y={20} width={140} height={86} rx={10} fill={C.violet} stroke={LINE} strokeWidth={6} />
    <path d="M146 46 H196 L230 78 V106 H146 Z" fill={C.lavender} stroke={LINE} strokeWidth={6} strokeLinejoin="round" />
    <rect x={164} y={56} width={30} height={22} rx={4} fill={C.white} stroke={LINE} strokeWidth={4} />
    <circle cx={52} cy={112} r={20} fill={LINE} />
    <circle cx={52} cy={112} r={8} fill={C.white} />
    <circle cx={186} cy={112} r={20} fill={LINE} />
    <circle cx={186} cy={112} r={8} fill={C.white} />
    <text x={76} y={72} textAnchor="middle" fontFamily="Poppins" fontWeight="700" fontSize="24" fill={C.white}>
      FREE
    </text>
  </svg>
);

/** Comic burst text. */
export const Burst: React.FC<{ at: number; text: string; color?: string; size?: number; rot?: number; style?: React.CSSProperties }> = ({ at, text, color = C.red, size = 64, rot = -6, style }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame: frame - at, fps, config: theme.spring.bouncy });
  if (frame < at - 1) return null;
  return (
    <div style={{ position: "absolute", transform: `scale(${p}) rotate(${rot}deg)`, ...style }}>
      <div
        style={{
          background: color,
          color: C.white,
          fontFamily: theme.fonts.display,
          fontWeight: 700,
          fontSize: size,
          lineHeight: 1,
          padding: `${size * 0.36}px ${size * 0.5}px ${size * 0.2}px`,
          clipPath:
            "polygon(0% 18%, 8% 0%, 20% 12%, 34% 0%, 48% 10%, 62% 0%, 76% 12%, 90% 0%, 100% 20%, 94% 50%, 100% 80%, 88% 100%, 72% 88%, 56% 100%, 42% 90%, 26% 100%, 12% 88%, 0% 100%, 6% 50%)",
          whiteSpace: "nowrap",
        }}
      >
        {text}
      </div>
    </div>
  );
};

/** Confetti burst from a point. */
export const Confetti: React.FC<{ at: number; x: number; y: number; n?: number }> = ({ at, x, y, n = 36 }) => {
  const frame = useCurrentFrame();
  const t = frame - at;
  if (t < 0 || t > 60) return null;
  const colors = [C.violet, C.green, "#F5B400", C.red, C.lavender];
  return (
    <>
      {Array.from({ length: n }).map((_, i) => {
        const ang = random(`cf${i}`) * Math.PI * 2;
        const sp = 9 + random(`cs${i}`) * 12;
        const px = x + Math.cos(ang) * sp * t;
        const py = y + Math.sin(ang) * sp * t + 0.45 * t * t;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: px,
              top: py,
              width: 16,
              height: 26,
              borderRadius: 4,
              background: colors[i % colors.length],
              opacity: interpolate(t, [40, 60], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
              transform: `rotate(${t * (10 + i)}deg)`,
            }}
          />
        );
      })}
    </>
  );
};
