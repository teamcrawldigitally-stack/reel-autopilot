import React from "react";
import { C, theme } from "../theme";

export type AdKind = "plain" | "problem" | "review" | "use" | "compare";

const Art: React.FC<{ kind: AdKind; tint: string; w: number; h: number }> = ({ kind, tint, w, h }) => {
  const s = Math.min(w, h);
  if (kind === "review") {
    return (
      <svg width={w} height={h} viewBox="0 0 100 60">
        {[0, 1, 2, 3, 4].map((i) => (
          <path
            key={i}
            transform={`translate(${12 + i * 16} 18) scale(0.55)`}
            d="M12 0 L15.5 8 L24 8.6 L17.5 14 L19.6 22.5 L12 18 L4.4 22.5 L6.5 14 L0 8.6 L8.5 8 Z"
            fill={i < 4 ? "#F5B400" : "#E7DFFB"}
          />
        ))}
        <rect x="18" y="38" width="64" height="5" rx="2.5" fill="rgba(18,4,75,0.25)" />
        <rect x="26" y="47" width="48" height="5" rx="2.5" fill="rgba(18,4,75,0.15)" />
      </svg>
    );
  }
  if (kind === "problem") {
    return (
      <svg width={w} height={h} viewBox="0 0 100 60">
        <circle cx="50" cy="30" r="20" fill={C.redSoft} stroke={C.red} strokeWidth="3" />
        <text x="50" y="40" textAnchor="middle" fontFamily="Poppins" fontWeight="700" fontSize="28" fill={C.red}>
          ?
        </text>
      </svg>
    );
  }
  if (kind === "use") {
    return (
      <svg width={w} height={h} viewBox="0 0 100 60">
        <rect x="38" y="10" width="24" height="40" rx="6" fill={C.violet} />
        <rect x="43" y="4" width="14" height="8" rx="2" fill={C.navy} />
        <path d="M18 52 Q30 34 44 40" fill="none" stroke={C.navy} strokeWidth="4" strokeLinecap="round" />
        <circle cx="70" cy="22" r="4" fill="#F5B400" />
        <circle cx="78" cy="34" r="3" fill="#F5B400" />
      </svg>
    );
  }
  if (kind === "compare") {
    return (
      <svg width={w} height={h} viewBox="0 0 100 60">
        <rect x="12" y="12" width="30" height="36" rx="6" fill="#E7DFFB" />
        <rect x="58" y="12" width="30" height="36" rx="6" fill={C.violet} />
        <text x="50" y="36" textAnchor="middle" fontFamily="Inter" fontWeight="800" fontSize="12" fill={C.navy}>
          vs
        </text>
      </svg>
    );
  }
  return (
    <svg width={w} height={h} viewBox="0 0 100 60" preserveAspectRatio="xMidYMid slice">
      <rect x="0" y="0" width="100" height="60" fill={tint} />
      <circle cx="72" cy="20" r="9" fill="rgba(255,255,255,0.55)" />
      <path d="M0 60 L30 30 L50 46 L70 26 L100 60 Z" fill="rgba(18,4,75,0.18)" />
      <rect x={50 - s * 0} y="0" width="0" height="0" />
    </svg>
  );
};

export const AdTile: React.FC<{
  w: number;
  kind?: AdKind;
  tint?: string;
  label?: string;
  style?: React.CSSProperties;
  dim?: number;
}> = ({ w, kind = "plain", tint = C.lavender, label, style, dim = 0 }) => {
  const h = w * 1.25;
  const pad = w * 0.07;
  const artH = h * 0.5;
  return (
    <div
      style={{
        width: w,
        height: h,
        background: C.white,
        borderRadius: w * 0.09,
        border: `2px solid rgba(18,4,75,0.10)`,
        boxShadow: "0 12px 26px -14px rgba(18,4,75,0.35)",
        padding: pad,
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
        gap: pad * 0.8,
        opacity: 1 - dim * 0.6,
        filter: dim > 0 ? `saturate(${1 - dim * 0.8})` : undefined,
        ...style,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: pad * 0.6 }}>
        <div style={{ width: w * 0.13, height: w * 0.13, borderRadius: "50%", background: C.violet }} />
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: w * 0.025 }}>
          <div style={{ height: w * 0.035, width: "70%", borderRadius: 99, background: "rgba(18,4,75,0.30)" }} />
          <div style={{ height: w * 0.028, width: "45%", borderRadius: 99, background: "rgba(18,4,75,0.14)" }} />
        </div>
      </div>
      <div
        style={{
          height: artH,
          borderRadius: w * 0.05,
          overflow: "hidden",
          background: kind === "plain" ? tint : C.paperDeep,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Art kind={kind} tint={tint} w={w - pad * 2} h={artH} />
      </div>
      {label ? (
        <div
          style={{
            fontFamily: theme.fonts.body,
            fontWeight: 800,
            fontSize: w * 0.105,
            color: C.navy,
            textAlign: "center",
            letterSpacing: "-0.01em",
            marginTop: "auto",
            whiteSpace: "nowrap",
          }}
        >
          {label}
        </div>
      ) : (
        <div style={{ marginTop: "auto", height: w * 0.12, borderRadius: w * 0.04, background: C.navy, opacity: 0.85 }} />
      )}
    </div>
  );
};
