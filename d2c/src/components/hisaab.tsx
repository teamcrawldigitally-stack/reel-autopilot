import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { Enter, Logo, Sfx, clamp } from "./kit";
import { CommentBox, DmCard, FollowButton } from "./widgets";
import { C, theme } from "../theme";

/**
 * "Hisaab" look (standard for every reel from 7 Nov 2026; template reel: src/reels/case15).
 * Dark navy blueprint sheet, lavender lines, big counting numbers, one object measured.
 * Money numbers only in green (in) / red (out). See ../../HISAAB.md for the rules.
 */
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

/** Navy sheet + drifting blueprint grid + edge rulers + corner marks. `sheet` = the reel tag, e.g. "#15". */
export const BlueprintBg: React.FC<{ sheet?: string }> = ({ sheet }) => {
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
      <div style={{ position: "absolute", left: 84, top: 1556, ...label(20, "rgba(223,200,253,0.32)") }}>D2C FOUNDERS · HISAAB SHEET{sheet ? ` ${sheet}` : ""}</div>
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

const NOISE = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='220' height='220'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/%3E%3C/filter%3E%3Crect width='220' height='220' filter='url(%23n)' opacity='0.5'/%3E%3C/svg%3E")`;

/** Dark-sheet finish: violet soft-light grade, overlay grain, deep vignette. */
export const DarkFinish: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <>
      <AbsoluteFill style={{ pointerEvents: "none", backgroundColor: C.violet, mixBlendMode: "soft-light", opacity: 0.12 }} />
      <AbsoluteFill
        style={{
          pointerEvents: "none",
          backgroundImage: NOISE,
          backgroundSize: "220px",
          backgroundPosition: `${(frame * 7) % 220}px ${(frame * 13) % 220}px`,
          opacity: 0.07,
          mixBlendMode: "overlay",
        }}
      />
      <AbsoluteFill style={{ pointerEvents: "none", background: "radial-gradient(ellipse at center, transparent 55%, rgba(5,0,25,0.5) 100%)" }} />
    </>
  );
};

/* ---------- shared blocks for every hisaab reel ---------- */

export const glass: React.CSSProperties = {
  background: "rgba(223,200,253,0.06)",
  border: `2.5px solid ${BP.lineSoft}`,
  borderRadius: 30,
  boxShadow: "0 30px 60px -30px rgba(0,0,0,0.6)",
};

/** Count-up that lands on `to` between frames a and b (use with tabular numbers). */
export const useCount = (to: number, a: number, b: number) => {
  const f = useCurrentFrame();
  return interpolate(f, [a, b], [0, to], { ...clamp, easing: theme.ease.out });
};

/** Highlight pill for one or two words inside a title. */
export const Hl: React.FC<{ children: React.ReactNode; c?: string }> = ({ children, c = C.lavender }) => (
  <span style={{ display: "inline-block", whiteSpace: "nowrap", background: c, color: C.navy, borderRadius: 12, padding: "4px 14px 0" }}>{children}</span>
);

/** Numbered fix card (stack 3 in a column, gap 30, from top 390). */
export const FixCard: React.FC<{ n: number; at: number; title: React.ReactNode; sub: React.ReactNode }> = ({ n, at, title, sub }) => (
  <Enter delay={at} from="right" dist={90} style={{ width: 912 }}>
    <div style={{ ...glass, padding: "30px 34px 28px", display: "flex", alignItems: "center", gap: 30 }}>
      <div style={{ flex: "0 0 92px", height: 92, borderRadius: "50%", background: theme.grad.violet, border: `3px solid ${C.lavender}`, display: "flex", alignItems: "center", justifyContent: "center", ...big(54, C.white), paddingTop: 6, boxSizing: "border-box" }}>{n}</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <div style={{ ...big(48), whiteSpace: "normal", lineHeight: 1.25 }}>{title}</div>
        <div style={label(24, BP.dim)}>{sub}</div>
      </div>
    </div>
  </Enter>
);

const CtaStep: React.FC<{ n: number; text: string; at: number; top: number }> = ({ n, text, at, top }) => (
  <Enter delay={at} from="left" dist={60} style={{ position: "absolute", left: 84, top, display: "flex", alignItems: "center", gap: 16 }}>
    <div style={{ width: 62, height: 62, borderRadius: "50%", background: theme.grad.violet, border: `3px solid ${C.lavender}`, display: "flex", alignItems: "center", justifyContent: "center", ...big(34, C.white), paddingTop: 4, boxSizing: "border-box" }}>{n}</div>
    <div style={big(50)}>{text}</div>
  </Enter>
);

/**
 * The one CTA: ① Comment karo + keyword typed → ② DM mein milega + what arrives →
 * next-reel teaser card (label must match the real slot) → Follow.
 * All `*At` values are scene frames (use cue()). `next` is the teaser card body.
 */
export const HisaabCta: React.FC<{
  keyword: string;
  typeAt: number;
  giftAt: number;
  giftTitle: string;
  giftSub: string;
  giftIcon: React.ReactNode;
  nextAt: number;
  nextLabel: string;
  next: React.ReactNode;
  followAt: number;
}> = ({ keyword, typeAt, giftAt, giftTitle, giftSub, giftIcon, nextAt, nextLabel, next, followAt }) => {
  const f = useCurrentFrame();
  const out = ease(f, nextAt - 6, nextAt + 2, "in");
  return (
    <>
      {f < nextAt + 4 && (
        <div style={{ position: "absolute", inset: 0, opacity: 1 - out, transform: `translateY(${-60 * out}px)` }}>
          <CtaStep n={1} text="Comment karo" at={0} top={300} />
          <Enter delay={2} style={{ position: "absolute", left: 84, top: 385 }}>
            <CommentBox word={keyword} typeStart={typeAt} />
          </Enter>
          <CtaStep n={2} text="DM mein milega" at={giftAt - 4} top={570} />
          <Enter delay={giftAt} from="right" dist={120} style={{ position: "absolute", left: 84, top: 655 }}>
            <DmCard title={giftTitle} sub={giftSub} icon={giftIcon} />
          </Enter>
        </div>
      )}
      {f >= nextAt - 2 && (
        <div style={{ position: "absolute", left: 84, right: 84, top: 300, display: "flex", flexDirection: "column", alignItems: "center", gap: 18 }}>
          <Enter delay={nextAt} cfg="snappy">
            <div style={{ ...label(32, C.navy), background: C.lavender, borderRadius: 999, padding: "14px 28px 12px", letterSpacing: "0.08em" }}>{nextLabel}</div>
          </Enter>
          <Enter delay={nextAt + 4}>
            <div style={{ background: C.white, borderRadius: 30, border: `5px solid ${C.lavender}`, boxShadow: `10px 10px 0 ${C.violet}`, padding: "30px 44px 24px", display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>{next}</div>
          </Enter>
        </div>
      )}
      {f >= followAt - 10 && (
        <div style={{ position: "absolute", left: 0, right: 0, top: 880, zIndex: 6 }}>
          <FollowButton at={followAt} />
        </div>
      )}
      <Sfx at={typeAt} name="key" vol={0.4} />
      <Sfx at={giftAt} name="pop" vol={0.5} />
      <Sfx at={nextAt - 2} name="whoosh" vol={0.5} />
      <Sfx at={followAt + 12} name="ding" vol={0.5} />
    </>
  );
};
