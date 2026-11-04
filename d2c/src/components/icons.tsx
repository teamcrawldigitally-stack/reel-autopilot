import React from "react";
import { interpolate } from "remotion";
import { C } from "../theme";

type P = { size?: number; color?: string; bg?: string; draw?: number; style?: React.CSSProperties };

/** Check in a circle; `draw` 0→1 strokes it in. */
export const CheckIcon: React.FC<P> = ({ size = 64, color = C.white, bg = C.green, draw = 1, style }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" style={style}>
    <circle cx="32" cy="32" r="30" fill={bg} transform={`scale(${interpolate(draw, [0, 0.4], [0.4, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })})`} style={{ transformOrigin: "32px 32px" }} />
    <path
      d="M18 33 L28 43 L47 22"
      fill="none"
      stroke={color}
      strokeWidth="7"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeDasharray="48"
      strokeDashoffset={48 * (1 - interpolate(draw, [0.3, 1], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }))}
    />
  </svg>
);

export const CrossIcon: React.FC<P> = ({ size = 64, color = C.white, bg = C.red, draw = 1, style }) => {
  const d = interpolate(draw, [0.3, 1], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" style={style}>
      <circle cx="32" cy="32" r="30" fill={bg} />
      <path d="M21 21 L43 43" stroke={color} strokeWidth="7" strokeLinecap="round" strokeDasharray="32" strokeDashoffset={32 * (1 - Math.min(1, d * 2))} />
      <path d="M43 21 L21 43" stroke={color} strokeWidth="7" strokeLinecap="round" strokeDasharray="32" strokeDashoffset={32 * (1 - Math.max(0, d * 2 - 1))} />
    </svg>
  );
};

export const LockIcon: React.FC<P & { open?: number }> = ({ size = 90, color = C.violet, open = 0, style }) => (
  <svg width={size} height={size * 1.15} viewBox="0 0 80 92" style={style}>
    <path
      d="M22 40 V28 a18 18 0 0 1 36 0 V40"
      fill="none"
      stroke={color}
      strokeWidth="8"
      strokeLinecap="round"
      transform={`translate(0 ${-10 * open})`}
    />
    <rect x="8" y="38" width="64" height="50" rx="12" fill={color} />
    <text x="40" y="74" textAnchor="middle" fontFamily="Inter" fontWeight="800" fontSize="32" fill={C.white}>
      ₹
    </text>
  </svg>
);

export const PersonIcon: React.FC<P> = ({ size = 120, color = C.navy, bg = C.lavenderSoft, style }) => (
  <svg width={size} height={size} viewBox="0 0 120 120" style={style}>
    <circle cx="60" cy="60" r="58" fill={bg} />
    <circle cx="60" cy="47" r="20" fill={color} />
    <path d="M24 100 a36 30 0 0 1 72 0 Z" fill={color} />
  </svg>
);

export const PdfIcon: React.FC<P> = ({ size = 90, style }) => (
  <svg width={size} height={size * 1.2} viewBox="0 0 75 90" style={style}>
    <path d="M6 4 h44 l19 19 v61 a4 4 0 0 1 -4 4 h-59 a4 4 0 0 1 -4 -4 v-76 a4 4 0 0 1 4 -4z" fill={C.white} stroke={C.navy} strokeWidth="4" />
    <path d="M50 4 v19 h19" fill="none" stroke={C.navy} strokeWidth="4" />
    <rect x="10" y="50" width="48" height="22" rx="5" fill={C.red} />
    <text x="34" y="67" textAnchor="middle" fontFamily="Inter" fontWeight="800" fontSize="16" fill={C.white}>
      PDF
    </text>
  </svg>
);

export const SendIcon: React.FC<P> = ({ size = 48, color = C.violet, style }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" style={style}>
    <path d="M6 22 L42 6 L30 42 L24 27 Z" fill={color} />
  </svg>
);

export const BoltIcon: React.FC<P> = ({ size = 60, color = C.violet, style }) => (
  <svg width={size} height={size} viewBox="0 0 60 60" style={style}>
    <path d="M34 4 L10 34 H28 L24 56 L50 24 H32 Z" fill={color} />
  </svg>
);

export const CursorIcon: React.FC<P> = ({ size = 60, color = C.navy, style }) => (
  <svg width={size} height={size} viewBox="0 0 60 60" style={style}>
    <path d="M10 6 L10 48 L22 37 L30 54 L38 50 L30 34 L46 34 Z" fill={color} stroke={C.white} strokeWidth="3" strokeLinejoin="round" />
  </svg>
);
