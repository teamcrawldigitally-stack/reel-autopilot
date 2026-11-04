import React from "react";
import { interpolate, random, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { C, theme } from "../theme";

/**
 * "D2C Doctor": the page's 2D host. Half-body SVG rig (viewBox 600×900):
 * blinking eyes behind glasses, brows, voice-driven mouth, head sway/nod,
 * breathing, a right arm with poses + hand shapes, left arm holding the case file.
 */

export type Pose = "rest" | "point" | "explain" | "stop" | "thumbs" | "one" | "two" | "three" | "think";
export type PoseKey = { at: number; pose: Pose };

export type HandType = "fist" | "point" | "open" | "thumb" | "two" | "three";
const POSES: Record<Pose, { a1: number; a2: number; hand: HandType; look: [number, number] }> = {
  rest: { a1: 12, a2: 4, hand: "fist", look: [0, 0] },
  point: { a1: 128, a2: 152, hand: "point", look: [0.7, -0.8] },
  explain: { a1: 32, a2: 112, hand: "open", look: [0, 0] },
  stop: { a1: 68, a2: 176, hand: "open", look: [0, 0] },
  thumbs: { a1: 38, a2: 162, hand: "thumb", look: [0, 0] },
  one: { a1: 58, a2: 170, hand: "point", look: [0.3, -0.3] },
  two: { a1: 58, a2: 170, hand: "two", look: [0.3, -0.3] },
  three: { a1: 58, a2: 170, hand: "three", look: [0.3, -0.3] },
  think: { a1: 22, a2: 200, hand: "fist", look: [-0.5, -0.6] },
};

const SKIN = "#C98B60";
const SKIN_D = "#AE7247";
const HAIR = "#1B1530";
const BEARD = "#2B2238";
const LINE = C.navy;
const COAT = "#FFFFFF";
const COAT_S = "#E9E4F7";

const rad = (d: number) => (d * Math.PI) / 180;
export const dir = (deg: number): [number, number] => [Math.sin(rad(deg)), Math.cos(rad(deg))];

export const Limb: React.FC<{ x1: number; y1: number; x2: number; y2: number; w: number; color: string }> = ({ x1, y1, x2, y2, w, color }) => (
  <>
    <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={LINE} strokeWidth={w + 11} strokeLinecap="round" />
    <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth={w} strokeLinecap="round" />
  </>
);

export const Finger: React.FC<{ x: number; y1: number; y2: number; w?: number; skin?: string }> = ({ x, y1, y2, w = 15, skin = SKIN }) => (
  <>
    <line x1={x} y1={y1} x2={x} y2={y2} stroke={LINE} strokeWidth={w + 9} strokeLinecap="round" />
    <line x1={x} y1={y1} x2={x} y2={y2} stroke={skin} strokeWidth={w} strokeLinecap="round" />
  </>
);

/** Hand in local space: +y runs along the forearm, away from the elbow. */
export const Hand: React.FC<{ type: HandType; skin?: string }> = ({ type, skin = SKIN }) => {
  const F: React.FC<{ x: number; y1: number; y2: number; w?: number }> = (p) => <Finger {...p} skin={skin} />;
  const palm = (
    <>
      <circle cx={0} cy={22} r={30} fill={skin} stroke={LINE} strokeWidth={5.5} />
    </>
  );
  switch (type) {
    case "point":
      return (
        <g>
          {palm}
          <F x={4} y1={36} y2={86} />
          <path d="M-22 26 Q-30 40 -18 48" fill="none" stroke={LINE} strokeWidth={5} strokeLinecap="round" />
        </g>
      );
    case "two":
      return (
        <g>
          {palm}
          <F x={-8} y1={36} y2={84} />
          <F x={12} y1={36} y2={80} />
        </g>
      );
    case "three":
      return (
        <g>
          {palm}
          <F x={-16} y1={34} y2={76} w={13} />
          <F x={1} y1={36} y2={84} w={13} />
          <F x={18} y1={34} y2={78} w={13} />
        </g>
      );
    case "open":
      return (
        <g>
          {palm}
          <F x={-17} y1={34} y2={70} w={12} />
          <F x={-5} y1={38} y2={78} w={12} />
          <F x={7} y1={38} y2={78} w={12} />
          <F x={19} y1={34} y2={70} w={12} />
          <g transform="rotate(-50 -24 18)">
            <F x={-24} y1={18} y2={50} w={13} />
          </g>
        </g>
      );
    case "thumb":
      return (
        <g>
          {palm}
          <F x={-22} y1={20} y2={70} w={16} />
          <path d="M-6 42 Q10 46 22 38" fill="none" stroke={LINE} strokeWidth={5} strokeLinecap="round" />
        </g>
      );
    default:
      return (
        <g>
          {palm}
          <path d="M-14 40 Q0 48 16 40" fill="none" stroke={LINE} strokeWidth={5} strokeLinecap="round" />
        </g>
      );
  }
};

type Props = {
  poses: PoseKey[];
  mouth: (frame: number) => number;
  brows?: number[];
  caseTag?: string;
};

const usePose = (poses: PoseKey[]) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const sorted = [...poses].sort((a, b) => a.at - b.at);
  let idx = -1;
  for (let i = 0; i < sorted.length; i++) if (frame >= sorted[i].at) idx = i;
  const cur = idx >= 0 ? sorted[idx] : { at: -1000, pose: "rest" as Pose };
  const prev = idx > 0 ? sorted[idx - 1] : { at: -1000, pose: "rest" as Pose };
  const p = spring({ frame: frame - cur.at, fps, config: { damping: 15, stiffness: 140, mass: 0.7 } });
  const A = POSES[prev.pose];
  const B = POSES[cur.pose];
  return {
    a1: A.a1 + (B.a1 - A.a1) * p,
    a2: A.a2 + (B.a2 - A.a2) * p,
    hand: p > 0.45 ? B.hand : A.hand,
    look: [A.look[0] + (B.look[0] - A.look[0]) * p, A.look[1] + (B.look[1] - A.look[1]) * p] as [number, number],
    pose: cur.pose,
    p,
  };
};

export const Doctor: React.FC<Props> = ({ poses, mouth, brows = [], caseTag = "CASE" }) => {
  const frame = useCurrentFrame();
  const pose = usePose(poses);

  // voice → mouth (smoothed)
  const m = Math.max(0, Math.min(1, (mouth(frame) * 0.6 + mouth(frame - 1) * 0.25 + mouth(frame - 2) * 0.15)));
  const talking = m > 0.08;

  // blink: deterministic intervals of 70–140 frames
  let blink = 1;
  {
    let t = 20;
    let k = 0;
    while (t < frame + 10 && k < 400) {
      const d = frame - t;
      if (d >= 0 && d < 5) blink = [0.6, 0.1, 0.1, 0.5, 1][d];
      t += 70 + Math.floor(random(`blink${k}`) * 70);
      k++;
    }
  }

  // brows: raise around cue frames, and on "stop"
  let brow = 0;
  for (const b of brows) {
    const d = frame - b;
    if (d >= -3 && d < 26) brow = Math.max(brow, interpolate(d, [-3, 2, 18, 26], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }));
  }
  if (pose.pose === "stop") brow = Math.max(brow, pose.p);

  const sway = Math.sin(frame / 38) * 1.8 + (talking ? Math.sin(frame / 5) * m * 1.2 : 0);
  const nod = talking ? Math.sin(frame / 4.3) * m * 2.2 : 0;
  const breathe = 1 + Math.sin(frame / 26) * 0.008;
  const saccade = [Math.sin(frame / 53) * 0.15, Math.cos(frame / 71) * 0.1];
  const lx = pose.look[0] + saccade[0];
  const ly = pose.look[1] + saccade[1];

  // right arm (screen right)
  const beat = pose.pose === "explain" && talking ? Math.sin(frame / 4) * 6 * m : 0;
  const a1 = pose.a1 + Math.sin(frame / 21) * 2;
  const a2 = pose.a2 + Math.sin(frame / 17) * 2.5 + beat;
  const S: [number, number] = [448, 478];
  const L1 = 168;
  const L2 = 150;
  const d1 = dir(a1);
  const E: [number, number] = [S[0] + d1[0] * L1, S[1] + d1[1] * L1];
  const d2 = dir(a2);
  const W: [number, number] = [E[0] + d2[0] * L2, E[1] + d2[1] * L2];

  const mouthOpen = m > 0.12;
  const mw = 20 + 12 * m;
  const mh = 5 + 20 * m;

  return (
    <svg width={600} height={900} viewBox="0 0 600 900" style={{ overflow: "visible" }}>
      <g transform={`translate(300 900) scale(1 ${breathe}) translate(-300 -900)`}>
        {/* neck */}
        <rect x={262} y={330} width={76} height={110} rx={20} fill={SKIN_D} stroke={LINE} strokeWidth={5} />
        {/* torso / coat */}
        <path d="M118 520 Q130 452 222 440 L378 440 Q470 452 482 520 L520 900 L80 900 Z" fill={COAT} stroke={LINE} strokeWidth={6} strokeLinejoin="round" />
        <path d="M250 440 L350 440 L300 590 Z" fill={C.violet} stroke={LINE} strokeWidth={5} strokeLinejoin="round" />
        <path d="M290 452 L310 452 L320 610 L300 642 L280 610 Z" fill={LINE} />
        {/* lapels */}
        <path d="M222 440 L262 440 L300 650 L250 560 Z" fill={COAT} stroke={LINE} strokeWidth={5} strokeLinejoin="round" />
        <path d="M378 440 L338 440 L300 650 L350 560 Z" fill={COAT} stroke={LINE} strokeWidth={5} strokeLinejoin="round" />
        <path d="M150 600 Q160 760 140 900" fill="none" stroke={COAT_S} strokeWidth={14} strokeLinecap="round" />
        <path d="M450 600 Q440 760 460 900" fill="none" stroke={COAT_S} strokeWidth={14} strokeLinecap="round" />
        {/* stethoscope */}
        <path d="M236 446 Q206 560 262 612 Q300 640 338 612" fill="none" stroke={C.lavender} strokeWidth={11} strokeLinecap="round" />
        <circle cx={340} cy={612} r={17} fill={C.lavender} stroke={LINE} strokeWidth={5} />
        {/* badge */}
        <g transform="translate(372 600) rotate(-3)">
          <rect x={0} y={0} width={104} height={40} rx={9} fill={C.violet} stroke={LINE} strokeWidth={4} />
          <text x={52} y={27} textAnchor="middle" fontFamily="Inter" fontWeight="800" fontSize="17" fill={C.white} letterSpacing="1">
            D2C DOC
          </text>
        </g>

        {/* left arm + case file */}
        <Limb x1={160} y1={480} x2={170} y2={640} w={62} color={COAT} />
        <Limb x1={170} y1={640} x2={262} y2={700} w={58} color={COAT} />
        <g transform="translate(108 610) rotate(-7)">
          <rect x={0} y={0} width={186} height={236} rx={14} fill={C.violetDeep} stroke={LINE} strokeWidth={5} />
          <rect x={14} y={30} width={158} height={192} rx={6} fill={C.white} />
          <rect x={64} y={-10} width={58} height={26} rx={7} fill="#B9B3CC" stroke={LINE} strokeWidth={4} />
          <text x={93} y={66} textAnchor="middle" fontFamily="Inter" fontWeight="900" fontSize="22" fill={C.navy}>
            {caseTag}
          </text>
          {[92, 116, 140, 164, 188].map((y, i) => (
            <rect key={y} x={30} y={y} width={i % 2 ? 96 : 124} height={8} rx={4} fill={C.lavender} />
          ))}
        </g>
        <circle cx={262} cy={704} r={30} fill={SKIN} stroke={LINE} strokeWidth={5.5} />

        {/* head */}
        <g transform={`rotate(${sway} 300 400) translate(0 ${nod})`}>
          <circle cx={186} cy={258} r={27} fill={SKIN_D} stroke={LINE} strokeWidth={5} />
          <circle cx={414} cy={258} r={27} fill={SKIN_D} stroke={LINE} strokeWidth={5} />
          <ellipse cx={300} cy={244} rx={116} ry={136} fill={SKIN} stroke={LINE} strokeWidth={5.5} />
          {/* beard */}
          <path d="M186 248 Q190 352 300 384 Q410 352 414 248 Q398 300 352 312 Q300 300 248 312 Q202 300 186 248 Z" fill={BEARD} />
          {/* hair */}
          <path d="M182 222 Q172 118 258 96 Q336 76 388 110 Q434 140 420 222 Q404 170 352 158 Q312 176 262 156 Q214 166 182 222 Z" fill={HAIR} stroke={LINE} strokeWidth={5} strokeLinejoin="round" />
          <path d="M262 100 Q300 64 352 86" fill="none" stroke={HAIR} strokeWidth={22} strokeLinecap="round" />
          {/* eyes */}
          {[250, 350].map((cx, i) => (
            <g key={cx} transform={`translate(${cx} 228) scale(1 ${blink}) translate(${-cx} -228)`}>
              <ellipse cx={cx} cy={228} rx={22} ry={18} fill={C.white} />
              <circle cx={cx + lx * 7} cy={228 + ly * 6} r={10} fill={LINE} />
              <circle cx={cx + lx * 7 + 3} cy={224 + ly * 6} r={3} fill={C.white} />
            </g>
          ))}
          {/* brows */}
          <g transform={`translate(0 ${-10 * brow})`}>
            <path d="M226 188 Q250 176 276 184" fill="none" stroke={HAIR} strokeWidth={12} strokeLinecap="round" />
            <path d="M324 184 Q350 176 374 188" fill="none" stroke={HAIR} strokeWidth={12} strokeLinecap="round" />
          </g>
          {/* glasses */}
          <rect x={214} y={198} width={72} height={58} rx={18} fill="rgba(255,255,255,0.10)" stroke={LINE} strokeWidth={6} />
          <rect x={314} y={198} width={72} height={58} rx={18} fill="rgba(255,255,255,0.10)" stroke={LINE} strokeWidth={6} />
          <path d="M286 222 Q300 214 314 222" fill="none" stroke={LINE} strokeWidth={6} />
          {/* nose */}
          <path d="M300 246 Q292 276 286 284 Q298 292 312 284" fill="none" stroke={SKIN_D} strokeWidth={6} strokeLinecap="round" strokeLinejoin="round" />
          {/* mouth */}
          {mouthOpen ? (
            <g>
              <ellipse cx={300} cy={328} rx={mw} ry={mh} fill="#3A1020" stroke={LINE} strokeWidth={4} />
              <rect x={300 - mw * 0.7} y={328 - mh + 2} width={mw * 1.4} height={Math.min(8, mh * 0.5)} rx={3} fill={C.white} />
              {m > 0.4 && <ellipse cx={300} cy={328 + mh * 0.55} rx={mw * 0.55} ry={mh * 0.32} fill="#E0707A" />}
            </g>
          ) : (
            <path d="M276 322 Q300 338 324 322" fill="none" stroke={LINE} strokeWidth={6} strokeLinecap="round" />
          )}
        </g>

        {/* right arm (in front) */}
        <Limb x1={S[0]} y1={S[1]} x2={E[0]} y2={E[1]} w={64} color={COAT} />
        <Limb x1={E[0]} y1={E[1]} x2={W[0]} y2={W[1]} w={58} color={COAT} />
        <circle cx={W[0]} cy={W[1]} r={31} fill={C.violet} stroke={LINE} strokeWidth={5} />
        <g transform={`translate(${W[0]} ${W[1]}) rotate(${-a2}) translate(0 6)`}>
          <Hand type={pose.hand} />
        </g>
      </g>
    </svg>
  );
};

/** Pop-up speech bubble near the doctor's head. */
export const Shout: React.FC<{ at: number; text: string; color?: string; hold?: number }> = ({ at, text, color = C.violet, hold = 40 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame: frame - at, fps, config: theme.spring.bouncy });
  const out = interpolate(frame, [at + hold, at + hold + 8], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  if (frame < at - 1 || out <= 0) return null;
  return (
    <div
      style={{
        position: "absolute",
        right: 34,
        top: 1112,
        transformOrigin: "0% 100%",
        transform: `scale(${p * out}) rotate(-4deg)`,
        background: color,
        color: C.white,
        fontFamily: theme.fonts.display,
        fontWeight: 700,
        fontSize: 46,
        lineHeight: 1,
        padding: "20px 26px 12px",
        borderRadius: "30px 30px 30px 6px",
        border: `5px solid ${C.navy}`,
        boxShadow: `6px 6px 0 ${C.navy}`,
        whiteSpace: "nowrap",
      }}
    >
      {text}
    </div>
  );
};
