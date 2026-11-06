import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { Logo, clamp } from "../../components/kit";
import { C, theme } from "../../theme";

/** "Hisaab" look: dark navy blueprint sheet, lavender lines, money in green/red only. */
export const BP = {
  ink: "#0D0238",
  line: "rgba(223,200,253,0.55)",
  lineSoft: "rgba(223,200,253,0.22)",
  text: "#F4EEFF",
  dim: "rgba(223,200,253,0.72)",
  green: "#2BD46B",
  red: "#FF5A5F",
};

export const big = (size: number, color: string = BP.text): React.CSSProperties => ({
  fontFamily: theme.fonts.display,
  fontWeight: 700,
  fontSize: size,
  lineHeight: 1.04,
  letterSpacing: "-0.02em",
  color,
  whiteSpace: "nowrap",
  fontVariantNumeric: "tabular-nums",
});
export const label = (size = 28, color: string = BP.dim): React.CSSProperties => ({
  fontFamily: theme.fonts.body,
  fontWeight: 800,
  fontSize: size,
  letterSpacing: "0.14em",
  textTransform: "uppercase",
  color,
  whiteSpace: "nowrap",
});

export const ease = (frame: number, a: number, b: number, k: keyof typeof theme.ease = "out") =>
  interpolate(frame, [a, b], [0, 1], { ...clamp, easing: theme.ease[k] });

/** Navy sheet + drifting blueprint grid + edge rulers + corner marks. */
export const BlueprintBg: React.FC = () => {
  const frame = useCurrentFrame();
  const drift = frame * 0.25;
  const gx = Math.sin(frame / 80) * 70;
  const gy = Math.cos(frame / 95) * 60;
  const minor = "rgba(223,200,253,0.055)";
  const major = "rgba(223,200,253,0.11)";
  return (
    <AbsoluteFill style={{ background: `radial-gradient(ellipse 90% 70% at 50% 42%, #1F0D72 0%, #14054F 55%, ${BP.ink} 100%)` }}>
      <div
        style={{
          position: "absolute",
          width: 1100,
          height: 1100,
          left: -10 + gx,
          top: 380 + gy,
          borderRadius: "50%",
          filter: "blur(90px)",
          background: "radial-gradient(circle, rgba(109,74,253,0.30), transparent 65%)",
        }}
      />
      <AbsoluteFill
        style={{
          backgroundImage: `linear-gradient(${minor} 1.5px, transparent 1.5px), linear-gradient(90deg, ${minor} 1.5px, transparent 1.5px), linear-gradient(${major} 2px, transparent 2px), linear-gradient(90deg, ${major} 2px, transparent 2px)`,
          backgroundSize: "36px 36px, 36px 36px, 180px 180px, 180px 180px",
          backgroundPosition: `0 ${drift}px, 0 ${drift}px, 0 ${drift}px, 0 ${drift}px`,
        }}
      />
      {/* left ruler */}
      {Array.from({ length: 54 }).map((_, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: 0,
            top: ((i * 36 + drift) % 1944) - 12,
            width: i % 5 === 0 ? 30 : 14,
            height: 2,
            background: "rgba(223,200,253,0.28)",
          }}
        />
      ))}
      {[
        [60, 262],
        [1020, 262],
        [60, 1590],
        [1020, 1590],
      ].map(([x, y], i) => (
        <div key={i} style={{ position: "absolute", left: x - 16, top: y - 16, width: 32, height: 32 }}>
          <div style={{ position: "absolute", left: 15, top: 0, width: 2, height: 32, background: BP.lineSoft }} />
          <div style={{ position: "absolute", top: 15, left: 0, height: 2, width: 32, background: BP.lineSoft }} />
        </div>
      ))}
      <div style={{ position: "absolute", left: 84, top: 1556, ...label(20, "rgba(223,200,253,0.32)") }}>D2C FOUNDERS · HISAAB SHEET #15</div>
    </AbsoluteFill>
  );
};

/** Progress bar, case pill and logo for the dark sheet. */
export const BpTopBar: React.FC<{ tag: string }> = ({ tag }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const p = spring({ frame: frame - 2, fps, config: theme.spring.smooth });
  const blink = 0.55 + 0.45 * Math.abs(Math.sin(frame / 9));
  const prog = interpolate(frame, [0, durationInFrames - 1], [0, 1], clamp);
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div style={{ position: "absolute", left: 0, top: 0, height: 12, width: 1080, background: "rgba(223,200,253,0.12)" }} />
      <div style={{ position: "absolute", left: 0, top: 0, height: 12, width: 1080 * prog, background: theme.grad.violet }} />
      <div
        style={{
          position: "absolute",
          left: 84,
          right: 84,
          top: 168,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          opacity: p,
          transform: `translateY(${interpolate(p, [0, 1], [-24, 0])}px)`,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 14,
            background: "rgba(13,2,56,0.7)",
            border: `2.5px solid ${BP.line}`,
            borderRadius: 999,
            padding: "12px 26px 12px 20px",
            ...label(28, BP.text),
            letterSpacing: "0.1em",
          }}
        >
          <div style={{ width: 18, height: 18, borderRadius: "50%", background: BP.red, opacity: blink }} />
          {tag}
          <span style={{ color: BP.dim, fontWeight: 700 }}>· HISAAB</span>
        </div>
        <div style={{ background: C.white, borderRadius: 16, padding: "6px 12px" }}>
          <Logo width={150} />
        </div>
      </div>
    </AbsoluteFill>
  );
};

/** Small "FIG. n · TITLE" heading, technical-drawing style. */
export const FigLabel: React.FC<{ n: number; text: string; at?: number }> = ({ n, text, at = 0 }) => {
  const frame = useCurrentFrame();
  const p = ease(frame, at, at + 14);
  return (
    <div style={{ position: "absolute", left: 84, top: 290, display: "flex", alignItems: "center", gap: 16, opacity: p, transform: `translateX(${(1 - p) * -40}px)` }}>
      <div style={{ ...label(26, BP.text), background: C.violet, borderRadius: 8, padding: "8px 12px 6px" }}>FIG. {n}</div>
      <div style={label(28, BP.dim)}>{text}</div>
      <div style={{ width: 120 * p, height: 2, background: BP.lineSoft }} />
    </div>
  );
};

/* ---------- coin tower ---------- */

export const TW = { x0: 110, yb: 1380, p: 30, d: 26, cols: 10 } as const;
export const rowTop = (row: number) => TW.yb - (row + 1) * TW.p;
export const coinXY = (i: number) => {
  const row = Math.floor(i / TW.cols);
  const col = i % TW.cols;
  return { x: TW.x0 + col * TW.p + (TW.p - TW.d) / 2, y: rowTop(row) + (TW.p - TW.d) / 2 };
};
/** y of a value line (in ₹1,000 rows from the bottom). */
export const yAt = (rows: number) => TW.yb - rows * TW.p;

export type Tint = "green" | "maal" | "pack" | "ret" | "cost" | "ad" | "red" | "ghost";
const TINT: Record<Tint, { bg: string; fg: string; rim: string }> = {
  green: { bg: "radial-gradient(circle at 35% 30%, #7CF0A6, #1FB85A 68%)", fg: "#063B1A", rim: "#0E7A39" },
  maal: { bg: "radial-gradient(circle at 35% 30%, #D9CCFF, #A98DFF 70%)", fg: C.navy, rim: "#7C5CF0" },
  pack: { bg: "radial-gradient(circle at 35% 30%, #9C83FF, #6D4AFD 70%)", fg: C.white, rim: "#4B2FD0" },
  ret: { bg: "radial-gradient(circle at 35% 30%, #5B3BE0, #3618B4 72%)", fg: C.lavender, rim: "#B79CFF" },
  cost: { bg: "radial-gradient(circle at 35% 30%, #9C83FF, #6D4AFD 70%)", fg: C.white, rim: "#4B2FD0" },
  ad: { bg: "radial-gradient(circle at 35% 30%, #FFFFFF, #DCD2FA 74%)", fg: C.violetDeep, rim: "#9C83FF" },
  red: { bg: "radial-gradient(circle at 35% 30%, #FF9A9D, #E5484D 68%)", fg: C.white, rim: "#A3161B" },
  ghost: { bg: "transparent", fg: "transparent", rim: "rgba(223,200,253,0.18)" },
};

export const Coin: React.FC<{ x: number; y: number; tint: Tint; s?: number; o?: number; glow?: number }> = ({ x, y, tint, s = 1, o = 1, glow = 0 }) => {
  const t = TINT[tint];
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: TW.d,
        height: TW.d,
        borderRadius: "50%",
        background: t.bg,
        border: `2px solid ${t.rim}`,
        boxSizing: "border-box",
        opacity: o,
        transform: `scale(${s})`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: theme.fonts.body,
        fontWeight: 900,
        fontSize: 14,
        color: t.fg,
        boxShadow: glow ? `0 0 ${18 * glow}px rgba(255,90,95,${0.9 * glow})` : undefined,
      }}
    >
      ₹
    </div>
  );
};

/** Dashed outline of the tower slot with "1 coin = ₹100" key. */
export const TowerFrame: React.FC<{ o?: number }> = ({ o = 1 }) => (
  <>
    <div
      style={{
        position: "absolute",
        left: TW.x0 - 12,
        top: yAt(30) - 12,
        width: TW.cols * TW.p + 24,
        height: 30 * TW.p + 24,
        border: `2.5px dashed ${BP.lineSoft}`,
        borderRadius: 14,
        opacity: o,
      }}
    />
    <div style={{ position: "absolute", left: TW.x0 - 12, top: TW.yb + 26, display: "flex", alignItems: "center", gap: 12, opacity: o }}>
      <Coin x={0} y={0} tint="green" />
      <div style={{ ...label(24, BP.dim), marginLeft: 34 }}>1 coin = ₹100</div>
    </div>
  </>
);

/** Dashed "sale line" across the sheet at the ₹30,000 mark. */
export const SaleLine: React.FC<{ p: number; tag?: boolean }> = ({ p, tag = true }) => (
  <>
    <div
      style={{
        position: "absolute",
        left: TW.x0 - 30,
        top: yAt(30) - 1,
        width: (1000 - (TW.x0 - 30)) * p,
        height: 0,
        borderTop: `3px dashed ${BP.green}`,
        opacity: 0.9,
      }}
    />
    {tag && (
      <div style={{ position: "absolute", right: 80, top: yAt(30) + 12, opacity: p, ...label(24, BP.green) }}>SALE LINE · ₹30,000</div>
    )}
  </>
);

/** Vertical dimension line (blueprint style) with end ticks and a leader. */
export const DimLine: React.FC<{ x: number; y1: number; y2: number; p: number; color?: string; leader?: number }> = ({ x, y1, y2, p, color = BP.line, leader = 34 }) => {
  const top = Math.min(y1, y2);
  const h = Math.abs(y2 - y1);
  const mid = top + h / 2;
  return (
    <>
      <div style={{ position: "absolute", left: x - 1.5, top: mid - (h / 2) * p, width: 3, height: h * p, background: color }} />
      <div style={{ position: "absolute", left: x - 12, top: top - 1.5, width: 24, height: 3, background: color, opacity: p }} />
      <div style={{ position: "absolute", left: x - 12, top: top + h - 1.5, width: 24, height: 3, background: color, opacity: p }} />
      <div style={{ position: "absolute", left: x, top: mid - 1.5, width: leader * p, height: 3, background: color }} />
    </>
  );
};

/** Label block placed right of a dimension line, vertically centred on `y`. */
export const DimLabel: React.FC<{ y: number; name: string; value: React.ReactNode; p: number; color?: string; size?: number }> = ({ y, name, value, p, color = BP.text, size = 62 }) => (
  <div
    style={{
      position: "absolute",
      left: 498,
      top: y,
      transform: `translateY(-50%) translateX(${(1 - p) * 40}px)`,
      opacity: p,
      display: "flex",
      flexDirection: "column",
      gap: 2,
    }}
  >
    <div style={label(24, BP.dim)}>{name}</div>
    <div style={big(size, color)}>{value}</div>
  </div>
);
