// Astro 24x7 "hisaab" kit: the D2C hisaab look (case15) ported to the Astro palette.
// Warm near-black sheet, orange blueprint lines, white text, a little black. Money in = green, money out = red.
// Hindi text uses Poppins (it has Devanagari glyphs); numbers stay Latin.
import React from "react";
import { AbsoluteFill, Audio, Sequence, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { Enter, clamp, useSpring } from "./kit";
import { theme } from "../theme";

export const AB = {
  ink: "#0B0502",
  orange: "#F28C1B",
  orangeDeep: "#B85A00",
  cream: "#FFE7C7",
  line: "rgba(255,196,140,0.55)",
  lineSoft: "rgba(255,196,140,0.22)",
  text: "#FFF6EC",
  dim: "rgba(255,220,185,0.74)",
  green: "#2BD46B",
  red: "#FF5A5F",
  black: "#120904",
};

const POP = theme.fonts.display; // Poppins (Latin + Devanagari)

export const big = (size: number, color: string = AB.text): React.CSSProperties => ({
  fontFamily: POP,
  fontWeight: 700,
  fontSize: size,
  lineHeight: 1.15,
  letterSpacing: "-0.01em",
  color,
  whiteSpace: "nowrap",
  fontVariantNumeric: "tabular-nums",
});
/** Small label: Hindi-friendly (no uppercase transform). */
export const lab = (size = 28, color: string = AB.dim): React.CSSProperties => ({
  fontFamily: POP,
  fontWeight: 600,
  fontSize: size,
  letterSpacing: "0.03em",
  color,
  whiteSpace: "nowrap",
});

export const ease = (frame: number, a: number, b: number, k: keyof typeof theme.ease = "out") =>
  interpolate(frame, [a, b], [0, 1], { ...clamp, easing: theme.ease[k] });

export const useCount = (to: number, a: number, b: number, from = 0) => {
  const f = useCurrentFrame();
  return interpolate(f, [a, b], [from, to], { ...clamp, easing: theme.ease.out });
};

export const glass: React.CSSProperties = {
  background: "rgba(255,196,140,0.06)",
  border: `2.5px solid ${AB.lineSoft}`,
  borderRadius: 30,
  boxShadow: "0 30px 60px -30px rgba(0,0,0,0.7)",
};

export const AstroLogo: React.FC<{ scale?: number }> = ({ scale = 1 }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 10 * scale }}>
    <span style={{ fontFamily: POP, fontWeight: 600, fontSize: 40 * scale, color: AB.text }}>Astro</span>
    <span style={{ fontFamily: POP, fontWeight: 700, fontSize: 26 * scale, color: AB.black, background: AB.orange, borderRadius: 10 * scale, padding: `${4 * scale}px ${12 * scale}px ${1 * scale}px` }}>24X7</span>
  </div>
);

/** Warm sheet + drifting orange grid + left ruler + corner marks. */
export const SheetBg: React.FC<{ sheet: string }> = ({ sheet }) => {
  const frame = useCurrentFrame();
  const drift = frame * 0.25;
  const gx = Math.sin(frame / 80) * 70;
  const gy = Math.cos(frame / 95) * 60;
  const minor = "rgba(255,196,140,0.05)";
  const major = "rgba(255,196,140,0.1)";
  return (
    <AbsoluteFill style={{ background: `radial-gradient(ellipse 90% 70% at 50% 42%, #2B1506 0%, #170A03 55%, ${AB.ink} 100%)` }}>
      <div style={{ position: "absolute", width: 1100, height: 1100, left: -10 + gx, top: 380 + gy, borderRadius: "50%", filter: "blur(90px)", background: "radial-gradient(circle, rgba(242,140,27,0.22), transparent 65%)" }} />
      <AbsoluteFill
        style={{
          backgroundImage: `linear-gradient(${minor} 1.5px, transparent 1.5px), linear-gradient(90deg, ${minor} 1.5px, transparent 1.5px), linear-gradient(${major} 2px, transparent 2px), linear-gradient(90deg, ${major} 2px, transparent 2px)`,
          backgroundSize: "36px 36px, 36px 36px, 180px 180px, 180px 180px",
          backgroundPosition: `0 ${drift}px, 0 ${drift}px, 0 ${drift}px, 0 ${drift}px`,
        }}
      />
      {Array.from({ length: 54 }).map((_, i) => (
        <div key={i} style={{ position: "absolute", left: 0, top: ((i * 36 + drift) % 1944) - 12, width: i % 5 === 0 ? 30 : 14, height: 2, background: "rgba(255,196,140,0.26)" }} />
      ))}
      {[
        [60, 262],
        [1020, 262],
        [60, 1590],
        [1020, 1590],
      ].map(([x, y], i) => (
        <div key={i} style={{ position: "absolute", left: x - 16, top: y - 16, width: 32, height: 32 }}>
          <div style={{ position: "absolute", left: 15, top: 0, width: 2, height: 32, background: AB.lineSoft }} />
          <div style={{ position: "absolute", top: 15, left: 0, height: 2, width: 32, background: AB.lineSoft }} />
        </div>
      ))}
      <div style={{ position: "absolute", left: 84, top: 1552, ...lab(22, "rgba(255,220,185,0.32)") }}>ASTRO 24X7 · {sheet}</div>
    </AbsoluteFill>
  );
};

/** Progress bar, tag pill and logo. */
export const TopBar: React.FC<{ tag: string }> = ({ tag }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const p = spring({ frame: frame - 2, fps, config: theme.spring.smooth });
  const blink = 0.55 + 0.45 * Math.abs(Math.sin(frame / 9));
  const prog = interpolate(frame, [0, durationInFrames - 1], [0, 1], clamp);
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div style={{ position: "absolute", left: 0, top: 0, height: 12, width: 1080, background: "rgba(255,196,140,0.12)" }} />
      <div style={{ position: "absolute", left: 0, top: 0, height: 12, width: 1080 * prog, background: `linear-gradient(90deg, ${AB.orange}, #FFB347)` }} />
      <div style={{ position: "absolute", left: 84, right: 84, top: 168, display: "flex", justifyContent: "space-between", alignItems: "center", opacity: p, transform: `translateY(${interpolate(p, [0, 1], [-24, 0])}px)` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14, background: "rgba(11,5,2,0.72)", border: `2.5px solid ${AB.line}`, borderRadius: 999, padding: "10px 26px 8px 20px", ...lab(30, AB.text) }}>
          <div style={{ width: 18, height: 18, borderRadius: "50%", background: AB.orange, opacity: blink }} />
          {tag}
        </div>
        <AstroLogo />
      </div>
    </AbsoluteFill>
  );
};

/** "चित्र n · TITLE" heading at y 290. */
export const FigLabel: React.FC<{ n: number; text: string; at?: number }> = ({ n, text, at = 0 }) => {
  const frame = useCurrentFrame();
  const p = ease(frame, at, at + 14);
  return (
    <div style={{ position: "absolute", left: 84, top: 290, display: "flex", alignItems: "center", gap: 16, opacity: p, transform: `translateX(${(1 - p) * -40}px)` }}>
      <div style={{ ...lab(26, AB.black), fontWeight: 700, background: AB.orange, borderRadius: 8, padding: "6px 12px 3px" }}>चित्र {n}</div>
      <div style={lab(30, AB.dim)}>{text}</div>
      <div style={{ width: 120 * p, height: 2, background: AB.lineSoft }} />
    </div>
  );
};

const NOISE = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='220' height='220'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/%3E%3C/filter%3E%3Crect width='220' height='220' filter='url(%23n)' opacity='0.5'/%3E%3C/svg%3E")`;

/** Warm grade, grain and vignette (top layer). */
export const Finish: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <>
      <AbsoluteFill style={{ pointerEvents: "none", backgroundColor: AB.orange, mixBlendMode: "soft-light", opacity: 0.08 }} />
      <AbsoluteFill style={{ pointerEvents: "none", backgroundImage: NOISE, backgroundSize: "220px", backgroundPosition: `${(frame * 7) % 220}px ${(frame * 13) % 220}px`, opacity: 0.07, mixBlendMode: "overlay" }} />
      <AbsoluteFill style={{ pointerEvents: "none", background: "radial-gradient(ellipse at center, transparent 55%, rgba(8,3,0,0.55) 100%)" }} />
    </>
  );
};

const Swipe: React.FC<{ dir: 1 | -1 }> = ({ dir }) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [0, 16], [0, 1], { ...clamp, easing: theme.ease.inOut });
  const left = dir === 1 ? interpolate(p, [0, 1], [1180, -1700]) : interpolate(p, [0, 1], [-1700, 1180]);
  return (
    <AbsoluteFill style={{ pointerEvents: "none", overflow: "hidden" }}>
      <div style={{ position: "absolute", top: -300, left, width: 1600, height: 2600, transform: `skewX(${-14 * dir}deg)`, background: `linear-gradient(${dir === 1 ? 90 : 270}deg, ${AB.cream} 0 26px, #FFB347 26px, ${AB.orange} 45%, ${AB.orangeDeep} 100%)`, boxShadow: "0 0 80px rgba(184,90,0,0.45)" }} />
    </AbsoluteFill>
  );
};

export const AstroSwipes: React.FC<{ at: number[] }> = ({ at }) => (
  <>
    {at.map((b, i) => (
      <Sequence key={i} from={Math.max(0, b - 8)} durationInFrames={17} layout="none">
        <Swipe dir={i % 2 === 0 ? 1 : -1} />
        <Audio src={staticFile("sfx/whoosh.wav")} volume={0.4 * theme.audio.sfxGain} />
      </Sequence>
    ))}
  </>
);

/* ---------- coin tower (10 coins per ₹1,000 row, 1 coin = ₹100) ---------- */

export const TW = { x0: 110, yb: 1380, p: 30, d: 26, cols: 10 } as const;
export const rowTop = (row: number) => TW.yb - (row + 1) * TW.p;
export const coinXY = (i: number) => {
  const row = Math.floor(i / TW.cols);
  const col = i % TW.cols;
  return { x: TW.x0 + col * TW.p + (TW.p - TW.d) / 2, y: rowTop(row) + (TW.p - TW.d) / 2 };
};
export const yAt = (rows: number) => TW.yb - rows * TW.p;

export type Tint = "green" | "orange" | "deep" | "cream" | "red" | "ghost";
const TINT: Record<Tint, { bg: string; fg: string; rim: string }> = {
  green: { bg: "radial-gradient(circle at 35% 30%, #7CF0A6, #1FB85A 68%)", fg: "#063B1A", rim: "#0E7A39" },
  orange: { bg: "radial-gradient(circle at 35% 30%, #FFC27A, #F28C1B 70%)", fg: AB.black, rim: "#B85A00" },
  deep: { bg: "radial-gradient(circle at 35% 30%, #E07A1F, #9A4A05 72%)", fg: AB.cream, rim: "#FFB347" },
  cream: { bg: "radial-gradient(circle at 35% 30%, #FFFFFF, #FFE0B8 74%)", fg: AB.orangeDeep, rim: "#F2B46B" },
  red: { bg: "radial-gradient(circle at 35% 30%, #FF9A9D, #E5484D 68%)", fg: "#FFFFFF", rim: "#A3161B" },
  ghost: { bg: "transparent", fg: "transparent", rim: "rgba(255,196,140,0.18)" },
};

export const Coin: React.FC<{ x: number; y: number; tint: Tint; s?: number; o?: number; glow?: number; r?: number }> = ({ x, y, tint, s = 1, o = 1, glow = 0, r = 0 }) => {
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
        transform: `scale(${s}) rotate(${r}deg)`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: theme.fonts.body,
        fontWeight: 900,
        fontSize: 14,
        color: t.fg,
        boxShadow: glow ? `0 0 ${18 * glow}px ${tint === "green" ? `rgba(43,212,107,${0.9 * glow})` : `rgba(255,90,95,${0.9 * glow})`}` : undefined,
      }}
    >
      ₹
    </div>
  );
};

/** Dashed outline of the 30-row tower slot with the "1 सिक्का = ₹100" key. */
export const TowerFrame: React.FC<{ o?: number }> = ({ o = 1 }) => (
  <>
    <div style={{ position: "absolute", left: TW.x0 - 12, top: yAt(30) - 12, width: TW.cols * TW.p + 24, height: 30 * TW.p + 24, border: `2.5px dashed ${AB.lineSoft}`, borderRadius: 14, opacity: o }} />
    <div style={{ position: "absolute", left: TW.x0 - 12, top: TW.yb + 26, display: "flex", alignItems: "center", gap: 12, opacity: o }}>
      <Coin x={0} y={0} tint="green" />
      <div style={{ ...lab(26, AB.dim), marginLeft: 34 }}>1 सिक्का = ₹100</div>
    </div>
  </>
);

export const DimLine: React.FC<{ x: number; y1: number; y2: number; p: number; color?: string; leader?: number }> = ({ x, y1, y2, p, color = AB.line, leader = 34 }) => {
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

export const DimLabel: React.FC<{ y: number; name: string; value: React.ReactNode; p: number; color?: string; size?: number; x?: number }> = ({ y, name, value, p, color = AB.text, size = 62, x = 498 }) => (
  <div style={{ position: "absolute", left: x, top: y, transform: `translateY(-50%) translateX(${(1 - p) * 40}px)`, opacity: p, display: "flex", flexDirection: "column", gap: 0 }}>
    <div style={lab(28, AB.dim)}>{name}</div>
    <div style={big(size, color)}>{value}</div>
  </div>
);

export const Hl: React.FC<{ children: React.ReactNode; c?: string; fg?: string }> = ({ children, c = AB.orange, fg = AB.black }) => (
  <span style={{ display: "inline-block", whiteSpace: "nowrap", background: c, color: fg, borderRadius: 12, padding: "2px 14px 0" }}>{children}</span>
);

/** Numbered fix card; stack 3 in a column (gap 30) from y 390. */
export const FixCard: React.FC<{ n: number; at: number; title: React.ReactNode; sub: React.ReactNode }> = ({ n, at, title, sub }) => (
  <Enter delay={at} from="right" dist={90} style={{ width: 912 }}>
    <div style={{ ...glass, padding: "28px 32px 26px", display: "flex", alignItems: "center", gap: 28 }}>
      <div style={{ flex: "0 0 92px", height: 92, borderRadius: "50%", background: `linear-gradient(135deg, #FFB347, ${AB.orange} 50%, ${AB.orangeDeep})`, border: `3px solid ${AB.cream}`, display: "flex", alignItems: "center", justifyContent: "center", ...big(54, AB.black), paddingTop: 6, boxSizing: "border-box" }}>{n}</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        <div style={{ ...big(46), whiteSpace: "normal", lineHeight: 1.35 }}>{title}</div>
        <div style={lab(28, AB.dim)}>{sub}</div>
      </div>
    </div>
  </Enter>
);

/** Instagram-style DM box with a word typed in. */
export const DmBox: React.FC<{ word: string; typeStart: number }> = ({ word, typeStart }) => {
  const frame = useCurrentFrame();
  const chars = Array.from(word);
  const typed = Math.max(0, Math.min(chars.length, Math.floor((frame - typeStart) / 3)));
  const sent = useSpring(typeStart + chars.length * 3 + 4, "bouncy");
  return (
    <div style={{ width: 912, height: 140, boxSizing: "border-box", padding: "0 30px", display: "flex", alignItems: "center", gap: 22, background: AB.text, borderRadius: 30, boxShadow: `10px 10px 0 ${AB.orange}` }}>
      <div style={{ flex: "0 0 70px", height: 70, borderRadius: "50%", background: AB.black, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <span style={{ ...big(26, AB.orange) }}>DM</span>
      </div>
      <div style={{ flex: 1, height: 82, borderRadius: 41, border: "3px solid rgba(18,9,4,0.15)", display: "flex", alignItems: "center", padding: "0 28px", ...big(48, typed ? AB.black : "rgba(18,9,4,0.4)") }}>
        {typed ? chars.slice(0, typed).join("") : <span style={{ fontWeight: 500, fontSize: 36 }}>Message…</span>}
      </div>
      <div style={{ transform: `scale(${1 + 0.25 * Math.sin(Math.PI * sent)}) rotate(${-20 * sent}deg)`, ...big(54, typed === chars.length ? AB.orange : "rgba(18,9,4,0.25)") }}>➤</div>
    </div>
  );
};

/** Follow button pressed by a cursor. */
export const FollowBtn: React.FC<{ at: number }> = ({ at }) => {
  const frame = useCurrentFrame();
  const btn = useSpring(at - 8, "bouncy");
  const press = frame >= at + 12 && frame < at + 16 ? 0.94 : 1;
  const followed = frame >= at + 14;
  return (
    <div style={{ display: "flex", justifyContent: "center", opacity: interpolate(btn, [0, 0.4], [0, 1], clamp), transform: `translateY(${interpolate(btn, [0, 1], [60, 0])}px) scale(${press})` }}>
      <div style={{ display: "flex", alignItems: "center", gap: 18, background: followed ? AB.text : AB.orange, color: AB.black, border: `4px solid ${followed ? AB.orange : "transparent"}`, ...big(54, AB.black), padding: "22px 52px 14px", borderRadius: 999, boxShadow: "0 24px 60px -18px rgba(242,140,27,0.6)" }}>
        {followed ? "✓ Following" : "Follow"} @astro_24x7
      </div>
    </div>
  );
};
