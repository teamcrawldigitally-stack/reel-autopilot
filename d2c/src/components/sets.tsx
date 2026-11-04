import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { C, theme } from "../theme";

const LINE = C.navy;

/** Founder's office: window with skyline, shelf of product boxes, clock, sticky note. Desk drawn separately (front layer). */
export const OfficeWall: React.FC = () => {
  const frame = useCurrentFrame();
  const hand = (frame * 6) % 360;
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ background: "linear-gradient(180deg, #F4EEFF 0%, #EAE1FF 100%)" }} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 1236, bottom: 0, background: "#D9CCF6", borderTop: `10px solid ${LINE}` }} />
      {/* window */}
      <svg width={420} height={470} viewBox="0 0 420 470" style={{ position: "absolute", left: 70, top: 320 }}>
        <defs>
          <linearGradient id="sky" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0" stopColor="#BFD8FF" />
            <stop offset="1" stopColor="#EADCFF" />
          </linearGradient>
        </defs>
        <rect x={10} y={10} width={400} height={450} rx={16} fill="url(#sky)" stroke={LINE} strokeWidth={12} />
        {[
          [30, 250, 70, 210],
          [100, 190, 60, 270],
          [165, 280, 80, 180],
          [250, 160, 55, 300],
          [310, 240, 80, 220],
        ].map(([x, y, w, h], i) => (
          <g key={i}>
            <rect x={x} y={y} width={w} height={h} fill={i % 2 ? "#3B2E7A" : "#4A3C92"} />
            {Array.from({ length: Math.floor(h / 40) }).map((_, r) =>
              [0, 1].map((c) => (
                <rect key={`${r}${c}`} x={x + 12 + c * (w / 2 - 6)} y={y + 14 + r * 40} width={14} height={18} fill={(r + c + i) % 3 === 0 ? "#FFD24D" : "#7C6CC9"} />
              )),
            )}
          </g>
        ))}
        <rect x={203} y={10} width={14} height={450} fill={LINE} />
        <rect x={10} y={228} width={400} height={14} fill={LINE} />
      </svg>
      {/* clock */}
      <svg width={150} height={150} viewBox="0 0 150 150" style={{ position: "absolute", left: 830, top: 300 }}>
        <circle cx={75} cy={75} r={66} fill={C.white} stroke={LINE} strokeWidth={10} />
        <line x1={75} y1={75} x2={75} y2={36} stroke={LINE} strokeWidth={8} strokeLinecap="round" />
        <line x1={75} y1={75} x2={75 + Math.sin((hand * Math.PI) / 180) * 48} y2={75 - Math.cos((hand * Math.PI) / 180) * 48} stroke={C.red} strokeWidth={5} strokeLinecap="round" />
        <circle cx={75} cy={75} r={8} fill={LINE} />
      </svg>
      {/* shelf with product boxes */}
      <div style={{ position: "absolute", left: 560, top: 640, width: 460 }}>
        <div style={{ display: "flex", alignItems: "flex-end", gap: 14, paddingLeft: 24 }}>
          {[110, 140, 120, 96].map((h, i) => (
            <div
              key={i}
              style={{
                width: 84,
                height: h,
                background: i % 2 ? C.violet : C.white,
                border: `6px solid ${LINE}`,
                borderRadius: 12,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: theme.fonts.body,
                fontWeight: 800,
                fontSize: 24,
                color: i % 2 ? C.white : C.violet,
              }}
            >
              YB
            </div>
          ))}
          <svg width={80} height={130} viewBox="0 0 80 130">
            <path d="M40 70 Q10 40 20 10 Q40 30 40 70 Q46 30 70 16 Q72 52 40 70" fill="#3FBF7F" stroke={LINE} strokeWidth={5} />
            <path d="M14 70 H66 L58 126 H22 Z" fill="#F28C5A" stroke={LINE} strokeWidth={5} strokeLinejoin="round" />
          </svg>
        </div>
        <div style={{ height: 24, background: "#8B6DE8", border: `6px solid ${LINE}`, borderRadius: 8 }} />
      </div>
      {/* sticky note */}
      <div
        style={{
          position: "absolute",
          left: 600,
          top: 330,
          width: 190,
          height: 170,
          background: "#FFE27A",
          border: `5px solid ${LINE}`,
          transform: "rotate(5deg)",
          fontFamily: theme.fonts.display,
          fontWeight: 700,
          fontSize: 30,
          lineHeight: 1.1,
          color: LINE,
          padding: "22px 14px",
          boxSizing: "border-box",
          textAlign: "center",
          boxShadow: "6px 8px 0 rgba(18,4,75,0.15)",
        }}
      >
        GOAL:
        <br />
        1000
        <br />
        CUSTOMERS!
      </div>
    </AbsoluteFill>
  );
};

/** Desk (front layer) with laptop burning ₹ on ads. */
export const Desk: React.FC<{ burn?: boolean }> = ({ burn = true }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      {/* laptop */}
      <div style={{ position: "absolute", left: 600, top: 940 }}>
        <svg width={360} height={250} viewBox="0 0 360 250">
          <rect x={30} y={10} width={300} height={196} rx={14} fill={LINE} stroke={LINE} strokeWidth={6} />
          <rect x={44} y={24} width={272} height={168} rx={8} fill="#2B1F6B" />
          <text x={64} y={60} fontFamily="Inter" fontWeight="800" fontSize="22" fill="#B7A6FF">
            ADS MANAGER
          </text>
          {[40, 70, 55, 95, 120].map((h, i) => (
            <rect key={i} x={70 + i * 46} y={180 - h} width={30} height={h} rx={5} fill={i === 4 ? C.red : C.violet} />
          ))}
          <path d="M10 206 H350 L330 236 H30 Z" fill="#B9B3CC" stroke={LINE} strokeWidth={6} strokeLinejoin="round" />
        </svg>
        {burn &&
          Array.from({ length: 6 }).map((_, i) => {
            const t = (frame + i * 9) % 54;
            return (
              <div
                key={i}
                style={{
                  position: "absolute",
                  left: 150 + Math.sin(i * 2.1) * 90 + Math.sin((frame + i * 10) / 8) * 10,
                  top: 40 - t * 6,
                  opacity: 1 - t / 54,
                  fontFamily: theme.fonts.display,
                  fontWeight: 700,
                  fontSize: 46,
                  color: "#F5B400",
                  textShadow: `0 0 0 ${LINE}, 2px 2px 0 ${LINE}`,
                  transform: `rotate(${t * 3}deg)`,
                }}
              >
                ₹
              </div>
            );
          })}
      </div>
      {/* mug */}
      <svg width={90} height={100} viewBox="0 0 90 100" style={{ position: "absolute", left: 470, top: 1100 }}>
        <path d="M10 20 H66 V86 Q66 96 56 96 H20 Q10 96 10 86 Z" fill={C.white} stroke={LINE} strokeWidth={6} />
        <path d="M66 36 Q86 36 86 56 Q86 74 66 74" fill="none" stroke={LINE} strokeWidth={6} />
        <rect x={22} y={46} width={32} height={10} rx={4} fill={C.lavender} />
      </svg>
      {/* desk */}
      <div style={{ position: "absolute", left: 30, right: 30, top: 1186, height: 46, background: "#B9A2F0", border: `8px solid ${LINE}`, borderRadius: 14 }} />
      <div style={{ position: "absolute", left: 70, right: 70, top: 1236, bottom: 0, background: "#CDBDF3", borderLeft: `8px solid ${LINE}`, borderRight: `8px solid ${LINE}` }}>
        {[0, 1].map((r) => (
          <div key={r} style={{ position: "absolute", right: 60, top: 60 + r * 150, width: 280, height: 120, border: `6px solid ${LINE}`, borderRadius: 12, background: "#D9CCF6" }}>
            <div style={{ position: "absolute", left: 110, top: 46, width: 60, height: 16, borderRadius: 8, background: LINE }} />
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};

/** Customer's doorstep. */
export const Doorstep: React.FC = () => (
  <AbsoluteFill>
    <AbsoluteFill style={{ background: "linear-gradient(180deg, #FFF1E6 0%, #FFE4D2 100%)" }} />
    {Array.from({ length: 22 }).map((_, i) => (
      <div key={i} style={{ position: "absolute", left: 0, right: 0, top: 260 + i * 46, height: 3, background: "rgba(214,150,110,0.25)" }} />
    ))}
    {/* door */}
    <div style={{ position: "absolute", left: 250, top: 470, width: 580, height: 860, background: "#E9D9C9", border: `10px solid ${LINE}`, borderBottom: "none", borderRadius: "30px 30px 0 0" }}>
      <div style={{ position: "absolute", left: 40, right: 40, top: 40, bottom: 0, background: C.violet, border: `8px solid ${LINE}`, borderBottom: "none", borderRadius: "20px 20px 0 0" }}>
        <div style={{ position: "absolute", left: 60, right: 60, top: 60, height: 200, background: "#BFD8FF", border: `8px solid ${LINE}`, borderRadius: 16 }} />
        <div style={{ position: "absolute", right: 34, top: 430, width: 36, height: 36, borderRadius: "50%", background: "#F5B400", border: `6px solid ${LINE}` }} />
      </div>
    </div>
    <div style={{ position: "absolute", left: 0, right: 0, top: 1320, bottom: 0, background: "#E8C9B0", borderTop: `10px solid ${LINE}` }} />
    <div style={{ position: "absolute", left: 300, top: 1340, width: 480, height: 70, background: "#C77B4D", border: `6px solid ${LINE}`, borderRadius: 12, fontFamily: theme.fonts.display, fontWeight: 700, fontSize: 36, color: "#FFE4D2", display: "flex", alignItems: "center", justifyContent: "center", letterSpacing: "0.2em" }}>
      WELCOME
    </div>
    {/* plants */}
    <svg width={170} height={300} viewBox="0 0 170 300" style={{ position: "absolute", left: 50, top: 1040 }}>
      <path d="M85 160 Q20 120 30 40 Q70 80 85 160 Q90 70 150 30 Q150 120 85 160" fill="#3FBF7F" stroke={LINE} strokeWidth={6} />
      <path d="M30 160 H140 L124 290 H46 Z" fill="#F28C5A" stroke={LINE} strokeWidth={6} strokeLinejoin="round" />
    </svg>
    <svg width={170} height={300} viewBox="0 0 170 300" style={{ position: "absolute", right: 40, top: 1040 }}>
      <path d="M85 160 Q20 120 30 40 Q70 80 85 160 Q90 70 150 30 Q150 120 85 160" fill="#2FA86C" stroke={LINE} strokeWidth={6} />
      <path d="M30 160 H140 L124 290 H46 Z" fill={C.lavender} stroke={LINE} strokeWidth={6} strokeLinejoin="round" />
    </svg>
  </AbsoluteFill>
);

/** Money table. */
export const MoneyRoom: React.FC = () => (
  <AbsoluteFill>
    <AbsoluteFill style={{ background: "linear-gradient(180deg, #F4EEFF 0%, #E7DEFF 100%)" }} />
    <div style={{ position: "absolute", left: -20, right: -20, top: 1150, height: 60, background: "#B9A2F0", border: `8px solid ${LINE}`, borderRadius: 16 }} />
    <div style={{ position: "absolute", left: 0, right: 0, top: 1210, bottom: 0, background: "#CDBDF3", borderTop: `8px solid ${LINE}` }} />
  </AbsoluteFill>
);

/** Stage with spotlight. */
export const Stage: React.FC = () => (
  <AbsoluteFill>
    <AbsoluteFill style={{ background: "#2A1D6E" }} />
    <AbsoluteFill style={{ background: "radial-gradient(ellipse 70% 55% at 50% 40%, rgba(223,200,253,0.95) 0%, rgba(160,130,250,0.6) 45%, rgba(42,29,110,0) 75%)" }} />
    <div style={{ position: "absolute", left: 0, right: 0, top: 1220, bottom: 0, background: "#4A3C92", borderTop: `10px solid ${LINE}` }} />
    <div style={{ position: "absolute", left: 140, right: 140, top: 1180, height: 80, borderRadius: "50%", background: "rgba(255,255,255,0.35)" }} />
  </AbsoluteFill>
);

/** Doctor's clinic with a whiteboard. */
export const Clinic: React.FC<{ plus?: boolean }> = ({ plus = true }) => (
  <AbsoluteFill>
    <AbsoluteFill style={{ background: "linear-gradient(180deg, #EEF7FF 0%, #E6EEFF 100%)" }} />
    {Array.from({ length: 12 }).map((_, i) => (
      <div key={i} style={{ position: "absolute", top: 0, bottom: 0, left: i * 96, width: 2, background: "rgba(109,74,253,0.06)" }} />
    ))}
    <div style={{ position: "absolute", left: 0, right: 0, top: 1300, bottom: 0, background: "#D6E2FA", borderTop: `10px solid ${LINE}` }} />
    {/* plus sign */}
    {plus && <div style={{ position: "absolute", left: 70, top: 330, width: 120, height: 120, background: C.white, border: `6px solid ${LINE}`, borderRadius: 24, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ position: "absolute", width: 70, height: 20, background: C.red, borderRadius: 6 }} />
      <div style={{ position: "absolute", width: 20, height: 70, background: C.red, borderRadius: 6 }} />
    </div>}
  </AbsoluteFill>
);

export const Whiteboard: React.FC<{ children?: React.ReactNode; style?: React.CSSProperties }> = ({ children, style }) => (
  <div style={{ position: "absolute", background: C.white, border: `10px solid ${LINE}`, borderRadius: 26, boxShadow: "10px 12px 0 rgba(18,4,75,0.15)", ...style }}>
    {children}
    <div style={{ position: "absolute", left: 60, right: 60, bottom: -36, height: 22, background: "#B9B3CC", border: `6px solid ${LINE}`, borderRadius: 8 }} />
  </div>
);

/** Dispatch room: shelves of parcels, DISPATCH sign, exit door on the right. Table drawn separately (PackTable). */
export const Dispatch: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ background: "linear-gradient(180deg, #F4EEFF 0%, #E9E0FF 100%)" }} />
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} style={{ position: "absolute", top: 0, bottom: 0, left: 40 + i * 140, width: 3, background: "rgba(109,74,253,0.05)" }} />
      ))}
      {/* exit door */}
      <div style={{ position: "absolute", left: 840, top: 640, width: 260, height: 560, background: "#BFAEF2", border: `10px solid ${LINE}`, borderRight: "none", borderRadius: "24px 0 0 0" }}>
        <div style={{ position: "absolute", left: 26, top: 30, width: 150, height: 120, background: "#BFD8FF", border: `7px solid ${LINE}`, borderRadius: 12 }} />
      </div>
      <div style={{ position: "absolute", left: 846, top: 560, background: C.green, border: `6px solid ${LINE}`, borderRadius: 14, padding: "10px 18px 4px", fontFamily: theme.fonts.display, fontWeight: 700, fontSize: 40, color: C.white, transform: `rotate(-3deg) translateX(${Math.sin(frame / 14) * 3}px)` }}>
        OUT →
      </div>
      {/* back shelf with parcels */}
      <div style={{ position: "absolute", left: 470, top: 610, width: 340 }}>
        <div style={{ display: "flex", alignItems: "flex-end", gap: 10, paddingLeft: 10 }}>
          {[96, 120, 86].map((h, i) => (
            <div key={i} style={{ width: 96, height: h, background: i === 1 ? "#E9C99A" : "#D8B98A", border: `6px solid ${LINE}`, borderRadius: 10, position: "relative" }}>
              <div style={{ position: "absolute", left: "50%", top: 0, bottom: 0, width: 14, marginLeft: -7, background: "#B89766" }} />
            </div>
          ))}
        </div>
        <div style={{ height: 22, background: "#8B6DE8", border: `6px solid ${LINE}`, borderRadius: 8 }} />
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 1236, bottom: 0, background: "#D9CCF6", borderTop: `10px solid ${LINE}` }} />
    </AbsoluteFill>
  );
};

/** Packing table (front layer). */
export const PackTable: React.FC = () => (
  <AbsoluteFill style={{ pointerEvents: "none" }}>
    <div style={{ position: "absolute", left: -20, right: -20, top: 1186, height: 46, background: "#B9A2F0", border: `8px solid ${LINE}`, borderRadius: 14 }} />
    <div style={{ position: "absolute", left: 60, right: 60, top: 1236, bottom: 0, background: "#CDBDF3", borderLeft: `8px solid ${LINE}`, borderRight: `8px solid ${LINE}` }}>
      <div style={{ position: "absolute", left: 40, right: 40, top: 40, height: 16, borderRadius: 8, background: "rgba(18,4,75,0.12)" }} />
    </div>
  </AbsoluteFill>
);
