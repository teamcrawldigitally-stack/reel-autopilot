import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { C, theme } from "../theme";
import { clamp } from "./kit";

/* Extra cartoon props shared by the cartoon reels. Navy outlines, brand palette. */

const LINE = C.navy;

/** Balance scale. tilt > 0 = left pan down. Contents sit on each pan. */
export const Scale: React.FC<{ tilt: number; left?: React.ReactNode; right?: React.ReactNode }> = ({ tilt, left, right }) => {
  const W = 900;
  const H = 700;
  const px = 450;
  const py = 140;
  const arm = 300;
  const str = 300;
  const t = (tilt * Math.PI) / 180;
  const L: [number, number] = [px - arm * Math.cos(t), py + arm * Math.sin(t)];
  const R: [number, number] = [px + arm * Math.cos(t), py - arm * Math.sin(t)];
  const pan = (E: [number, number], key: string) => {
    const y = E[1] + str;
    return (
      <g key={key}>
        <line x1={E[0]} y1={E[1]} x2={E[0] - 130} y2={y} stroke={LINE} strokeWidth={5} />
        <line x1={E[0]} y1={E[1]} x2={E[0] + 130} y2={y} stroke={LINE} strokeWidth={5} />
        <path d={`M${E[0] - 150} ${y} Q${E[0]} ${y + 80} ${E[0] + 150} ${y} Z`} fill="#F5B400" stroke={LINE} strokeWidth={7} strokeLinejoin="round" />
        <circle cx={E[0]} cy={E[1]} r={11} fill={LINE} />
      </g>
    );
  };
  const content = (E: [number, number], node: React.ReactNode) => (
    <div style={{ position: "absolute", left: E[0] - 160, top: E[1] + str - 250, width: 320, height: 250, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "flex-end" }}>{node}</div>
  );
  return (
    <div style={{ position: "relative", width: W, height: H }}>
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
        <path d={`M${px - 150} ${H} L${px - 110} ${H - 54} H${px + 110} L${px + 150} ${H} Z`} fill="#8B6DE8" stroke={LINE} strokeWidth={7} strokeLinejoin="round" />
        <rect x={px - 20} y={py} width={40} height={H - py - 50} rx={10} fill="#B9A2F0" stroke={LINE} strokeWidth={7} />
        <line x1={L[0]} y1={L[1]} x2={R[0]} y2={R[1]} stroke={LINE} strokeWidth={26} strokeLinecap="round" />
        <line x1={L[0]} y1={L[1]} x2={R[0]} y2={R[1]} stroke="#F5B400" strokeWidth={12} strokeLinecap="round" />
        <path d={`M${px - 30} ${py - 50} L${px + 30} ${py - 50} L${px} ${py - 10} Z`} fill={C.red} stroke={LINE} strokeWidth={5} strokeLinejoin="round" transform={`rotate(${-tilt} ${px} ${py})`} />
        {pan(L, "l")}
        {pan(R, "r")}
        <circle cx={px} cy={py} r={28} fill="#F5B400" stroke={LINE} strokeWidth={7} />
      </svg>
      {content(L, left)}
      {content(R, right)}
    </div>
  );
};

/** Phone with a chat app look (green header, beige chat area). */
export const Phone: React.FC<{ w?: number; h?: number; title?: string; children?: React.ReactNode; style?: React.CSSProperties }> = ({ w = 320, h = 560, title = "Rohit's Store", children, style }) => (
  <div style={{ position: "relative", width: w, height: h, background: LINE, borderRadius: 48, padding: 14, boxSizing: "border-box", boxShadow: "10px 12px 0 rgba(18,4,75,0.18)", ...style }}>
    <div style={{ width: "100%", height: "100%", borderRadius: 36, overflow: "hidden", background: "#EFE7DE", display: "flex", flexDirection: "column" }}>
      <div style={{ background: "#128C7E", padding: "30px 18px 16px", display: "flex", alignItems: "center", gap: 12 }}>
        <div style={{ width: 46, height: 46, borderRadius: "50%", background: "#F5B400", border: `3px solid ${C.white}`, fontFamily: theme.fonts.display, fontWeight: 700, fontSize: 24, color: LINE, display: "flex", alignItems: "center", justifyContent: "center", paddingTop: 3, boxSizing: "border-box" }}>R</div>
        <div style={{ fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 24, color: C.white, whiteSpace: "nowrap" }}>{title}</div>
      </div>
      <div style={{ flex: 1, padding: "16px 14px", display: "flex", flexDirection: "column", gap: 12 }}>{children}</div>
    </div>
  </div>
);

/** Chat bubble that pops in at `at`. */
export const Bubble: React.FC<{ at: number; me?: boolean; children: React.ReactNode; size?: number }> = ({ at, me, children, size = 24 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame: frame - at, fps, config: theme.spring.snappy });
  if (frame < at - 1) return null;
  return (
    <div
      style={{
        alignSelf: me ? "flex-end" : "flex-start",
        maxWidth: "86%",
        background: me ? "#D9FDD3" : C.white,
        borderRadius: me ? "20px 20px 6px 20px" : "20px 20px 20px 6px",
        padding: "12px 14px 10px",
        fontFamily: theme.fonts.body,
        fontWeight: 700,
        fontSize: size,
        lineHeight: 1.2,
        color: LINE,
        boxShadow: "0 3px 0 rgba(18,4,75,0.12)",
        opacity: interpolate(p, [0, 0.5], [0, 1], clamp),
        transform: `translateY(${(1 - p) * 20}px) scale(${0.85 + 0.15 * p})`,
        transformOrigin: me ? "100% 100%" : "0% 100%",
      }}
    >
      {children}
      <div style={{ textAlign: "right", fontSize: size * 0.6, color: me ? "#34B7F1" : C.muted, marginTop: 2 }}>{me ? "✓✓" : "now"}</div>
    </div>
  );
};

/** Discount coupon ticket. */
export const Coupon: React.FC<{ off?: string; code?: string; w?: number; style?: React.CSSProperties }> = ({ off = "₹100 OFF", code = "WAPAS100", w = 420, style }) => (
  <div style={{ position: "relative", width: w, background: "#FFE27A", border: `6px solid ${LINE}`, borderRadius: 22, padding: "20px 26px 16px", boxSizing: "border-box", boxShadow: "8px 10px 0 rgba(18,4,75,0.18)", ...style }}>
    <div style={{ position: "absolute", left: -22, top: "50%", marginTop: -20, width: 40, height: 40, borderRadius: "50%", background: C.white, border: `6px solid ${LINE}` }} />
    <div style={{ position: "absolute", right: -22, top: "50%", marginTop: -20, width: 40, height: 40, borderRadius: "50%", background: C.white, border: `6px solid ${LINE}` }} />
    <div style={{ fontFamily: theme.fonts.body, fontWeight: 800, fontSize: w * 0.06, letterSpacing: "0.1em", color: C.violetDeep, textAlign: "center" }}>AGLE ORDER PE</div>
    <div style={{ fontFamily: theme.fonts.display, fontWeight: 700, fontSize: w * 0.17, lineHeight: 1.05, color: C.red, textAlign: "center" }}>{off}</div>
    <div style={{ marginTop: 6, borderTop: `4px dashed ${LINE}`, paddingTop: 10, fontFamily: theme.fonts.body, fontWeight: 800, fontSize: w * 0.06, letterSpacing: "0.12em", color: LINE, textAlign: "center" }}>CODE: {code}</div>
  </div>
);

/** Wall calendar; `since` = frames since the month last changed (flip animation). */
export const Calendar: React.FC<{ month: number; since: number; label?: string; w?: number }> = ({ month, since, label = "MAHINA", w = 190 }) => {
  const flip = interpolate(since, [0, 6, 12], [1, 0, 1], clamp);
  return (
    <div style={{ width: w, background: C.white, border: `7px solid ${LINE}`, borderRadius: 18, overflow: "hidden", boxShadow: "8px 10px 0 rgba(18,4,75,0.15)" }}>
      <div style={{ background: C.red, color: C.white, fontFamily: theme.fonts.body, fontWeight: 800, fontSize: w * 0.15, letterSpacing: "0.1em", textAlign: "center", padding: "10px 0 6px", borderBottom: `6px solid ${LINE}` }}>{label}</div>
      <div style={{ height: w * 0.78, display: "flex", alignItems: "center", justifyContent: "center", transform: `scaleY(${flip})` }}>
        <div style={{ fontFamily: theme.fonts.display, fontWeight: 700, fontSize: w * 0.62, lineHeight: 1, color: LINE, paddingTop: w * 0.08 }}>{month}</div>
      </div>
    </div>
  );
};

/** Dropper bottle with liquid level 0–1. */
export const Bottle: React.FC<{ level: number; w?: number; color?: string; label?: string }> = ({ level, w = 170, color = "#F5A25D", label = "SERUM" }) => {
  const h = w * 1.9;
  const top = 120 + (1 - level) * 180;
  return (
    <svg width={w} height={h} viewBox="0 0 170 323">
      <rect x={62} y={4} width={46} height={54} rx={14} fill={LINE} />
      <rect x={52} y={52} width={66} height={34} rx={8} fill="#B9B3CC" stroke={LINE} strokeWidth={6} />
      <path d="M30 110 Q30 86 56 86 H114 Q140 86 140 110 V296 Q140 318 116 318 H54 Q30 318 30 296 Z" fill="rgba(255,255,255,0.85)" stroke={LINE} strokeWidth={7} />
      <clipPath id="btl">
        <path d="M34 112 Q34 90 56 90 H114 Q136 90 136 112 V296 Q136 314 116 314 H54 Q34 314 34 296 Z" />
      </clipPath>
      <g clipPath="url(#btl)">
        <rect x={0} y={top} width={170} height={330} fill={color} />
      </g>
      <rect x={44} y={170} width={82} height={56} rx={8} fill={C.white} stroke={LINE} strokeWidth={4} />
      <text x={85} y={206} textAnchor="middle" fontFamily="Inter" fontWeight="800" fontSize="20" fill={LINE}>
        {label}
      </text>
      <path d="M48 120 V280" stroke="rgba(255,255,255,0.9)" strokeWidth={9} strokeLinecap="round" />
    </svg>
  );
};

/** Bell icon that rings after `at`. */
export const Bell: React.FC<{ at: number; size?: number }> = ({ at, size = 90 }) => {
  const frame = useCurrentFrame();
  const d = frame - at;
  const ring = d >= 0 && d < 30 ? Math.sin(d * 1.4) * 18 * Math.exp(-d / 12) : 0;
  return (
    <svg width={size} height={size} viewBox="0 0 90 90" style={{ transform: `rotate(${ring}deg)`, transformOrigin: "50% 10%", overflow: "visible" }}>
      <path d="M45 10 Q70 12 70 40 V58 L80 70 H10 L20 58 V40 Q20 12 45 10 Z" fill="#F5B400" stroke={LINE} strokeWidth={6} strokeLinejoin="round" />
      <circle cx={45} cy={78} r={9} fill={LINE} />
      <circle cx={45} cy={8} r={6} fill={LINE} />
    </svg>
  );
};

/** Five stars. */
export const Stars: React.FC<{ size?: number; n?: number; at?: number }> = ({ size = 70, n = 5, at = 0 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <div style={{ display: "flex", gap: size * 0.12 }}>
      {Array.from({ length: n }).map((_, i) => {
        const p = spring({ frame: frame - at - i * 3, fps, config: theme.spring.bouncy });
        return (
          <svg key={i} width={size} height={size} viewBox="0 0 100 100" style={{ transform: `scale(${p}) rotate(${(1 - p) * -40}deg)` }}>
            <path d="M50 6 L62 36 L94 38 L69 58 L78 90 L50 72 L22 90 L31 58 L6 38 L38 36 Z" fill="#F5B400" stroke={LINE} strokeWidth={7} strokeLinejoin="round" />
          </svg>
        );
      })}
    </div>
  );
};

/** Bobbing question marks. */
export const QMarks: React.FC<{ at: number; color?: string }> = ({ at, color = C.violet }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const spots: [number, number, number, number][] = [
    [0, 40, -14, 120],
    [110, 0, 10, 150],
    [220, 60, 18, 104],
  ];
  return (
    <>
      {spots.map(([x, y, r, s], i) => {
        const p = spring({ frame: frame - at - i * 4, fps, config: theme.spring.bouncy });
        if (frame < at + i * 4 - 1) return null;
        return (
          <div key={i} style={{ position: "absolute", left: x, top: y + Math.sin((frame + i * 20) / 8) * 8, transform: `scale(${p}) rotate(${r}deg)`, fontFamily: theme.fonts.display, fontWeight: 700, fontSize: s, lineHeight: 1, color, WebkitTextStroke: `5px ${LINE}`, paintOrder: "stroke" }}>
            ?
          </div>
        );
      })}
    </>
  );
};

/** A label that flies along an arc from A to B during [at, at+len]. */
export const FlyTag: React.FC<{ at: number; len?: number; from: [number, number]; to: [number, number]; children: React.ReactNode; arc?: number }> = ({ at, len = 22, from, to, children, arc = 160 }) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [at, at + len], [0, 1], { ...clamp, easing: theme.ease.inOut });
  if (frame < at || frame > at + len) return null;
  const x = from[0] + (to[0] - from[0]) * p;
  const y = from[1] + (to[1] - from[1]) * p - Math.sin(Math.PI * p) * arc;
  return <div style={{ position: "absolute", left: x, top: y, transform: `translate(-50%, -50%) scale(${1 - 0.3 * p})`, zIndex: 20 }}>{children}</div>;
};

/** Name tag chip for a character. */
export const NameTag: React.FC<{ at: number; name: string; role: string; color?: string; style?: React.CSSProperties }> = ({ at, name, role, color = C.violet, style }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame: frame - at, fps, config: theme.spring.bouncy });
  if (frame < at - 1) return null;
  return (
    <div style={{ position: "absolute", transform: `scale(${p}) rotate(-3deg)`, transformOrigin: "0 100%", display: "flex", alignItems: "center", background: C.white, border: `5px solid ${LINE}`, borderRadius: 16, boxShadow: `5px 5px 0 ${LINE}`, overflow: "hidden", ...style }}>
      <div style={{ background: color, color: C.white, fontFamily: theme.fonts.display, fontWeight: 700, fontSize: 36, padding: "10px 16px 4px" }}>{name}</div>
      <div style={{ fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 24, letterSpacing: "0.08em", color: LINE, padding: "0 16px" }}>{role}</div>
    </div>
  );
};
