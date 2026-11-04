import React from "react";
import {
  AbsoluteFill,
  Audio,
  Img,
  Sequence,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { C, theme } from "../theme";

export const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

/** Spring progress starting at `delay` frames. */
export const useSpring = (delay: number, cfg: keyof typeof theme.spring = "smooth") => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({ frame: frame - delay, fps, config: theme.spring[cfg] });
};

/** Eased 0→1 progress between two frames. */
export const useRamp = (from: number, to: number, ease: keyof typeof theme.ease = "out") => {
  const frame = useCurrentFrame();
  return interpolate(frame, [from, to], [0, 1], { ...clamp, easing: theme.ease[ease] });
};

type EnterProps = {
  delay?: number;
  from?: "up" | "down" | "left" | "right" | "none";
  dist?: number;
  scaleFrom?: number;
  cfg?: keyof typeof theme.spring;
  style?: React.CSSProperties;
  children: React.ReactNode;
};

/** Premium entrance: opacity + translate + scale together. */
export const Enter: React.FC<EnterProps> = ({ delay = 0, from = "up", dist = 46, scaleFrom = 0.94, cfg = "smooth", style, children }) => {
  const p = useSpring(delay, cfg);
  const d = interpolate(p, [0, 1], [dist, 0]);
  const tx = from === "left" ? -d : from === "right" ? d : 0;
  const ty = from === "up" ? d : from === "down" ? -d : 0;
  return (
    <div
      style={{
        opacity: interpolate(p, [0, 0.6], [0, 1], clamp),
        transform: `translate(${tx}px, ${ty}px) scale(${interpolate(p, [0, 1], [scaleFrom, 1])})`,
        ...style,
      }}
    >
      {children}
    </div>
  );
};

/** Wraps a scene: fast exit in the final frames. */
export const SceneShell: React.FC<{ dur: number; noExit?: boolean; children: React.ReactNode }> = ({ dur, noExit, children }) => {
  const frame = useCurrentFrame();
  const x = noExit ? 0 : interpolate(frame, [dur - 9, dur - 1], [0, 1], { ...clamp, easing: theme.ease.in });
  return (
    <AbsoluteFill style={{ opacity: 1 - x, transform: `translateY(${-50 * x}px) scale(${1 - 0.03 * x})` }}>
      {children}
    </AbsoluteFill>
  );
};

/** Graph-paper background with slow drift and two soft colour fields. */
export const Bg: React.FC = () => {
  const frame = useCurrentFrame();
  const drift = frame * 0.35;
  const d1 = Math.sin(frame / 70) * 60;
  const d2 = Math.cos(frame / 90) * 50;
  return (
    <AbsoluteFill style={{ background: C.paper }}>
      <div
        style={{
          position: "absolute",
          width: 1300,
          height: 1300,
          left: -420 + d1,
          top: -520,
          borderRadius: "50%",
          background: `radial-gradient(circle, rgba(223,200,253,0.55) 0%, rgba(223,200,253,0) 62%)`,
        }}
      />
      <div
        style={{
          position: "absolute",
          width: 1200,
          height: 1200,
          right: -480 - d2,
          bottom: -380,
          borderRadius: "50%",
          background: `radial-gradient(circle, rgba(109,74,253,0.16) 0%, rgba(109,74,253,0) 62%)`,
        }}
      />
      <AbsoluteFill
        style={{
          backgroundImage: `linear-gradient(${C.grid} 1.5px, transparent 1.5px), linear-gradient(90deg, ${C.grid} 1.5px, transparent 1.5px), linear-gradient(${C.gridStrong} 2px, transparent 2px), linear-gradient(90deg, ${C.gridStrong} 2px, transparent 2px)`,
          backgroundSize: "45px 45px, 45px 45px, 225px 225px, 225px 225px",
          backgroundPosition: `0px ${drift}px, 0px ${drift}px, 0px ${drift}px, 0px ${drift}px`,
        }}
      />
    </AbsoluteFill>
  );
};

export const Grade: React.FC = () => (
  <AbsoluteFill style={{ pointerEvents: "none" }}>
    <AbsoluteFill style={{ backgroundColor: C.violet, mixBlendMode: "soft-light", opacity: 0.08 }} />
    <AbsoluteFill
      style={{ background: "linear-gradient(180deg, rgba(18,4,75,0.05), transparent 22%, transparent 78%, rgba(18,4,75,0.08))" }}
    />
  </AbsoluteFill>
);

const NOISE = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='220' height='220'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/%3E%3C/filter%3E%3Crect width='220' height='220' filter='url(%23n)' opacity='0.5'/%3E%3C/svg%3E")`;

export const Grain: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill
      style={{
        pointerEvents: "none",
        backgroundImage: NOISE,
        backgroundSize: "220px",
        backgroundPosition: `${(frame * 7) % 220}px ${(frame * 13) % 220}px`,
        opacity: 0.045,
        mixBlendMode: "multiply",
      }}
    />
  );
};

export const Vignette: React.FC = () => (
  <AbsoluteFill
    style={{ pointerEvents: "none", background: "radial-gradient(ellipse at center, transparent 62%, rgba(18,4,75,0.07) 100%)" }}
  />
);

export const Logo: React.FC<{ width: number; style?: React.CSSProperties }> = ({ width, style }) => (
  <Img src={staticFile("img/logo.png")} style={{ width, height: "auto", display: "block", ...style }} />
);

/** Small uppercase chip. */
export const Chip: React.FC<{
  children: React.ReactNode;
  bg?: string;
  color?: string;
  border?: string;
  size?: number;
  style?: React.CSSProperties;
}> = ({ children, bg = C.navy, color = C.white, border, size = 30, style }) => (
  <div
    style={{
      display: "inline-flex",
      alignItems: "center",
      gap: 12,
      background: bg,
      color,
      border: border ? `3px solid ${border}` : undefined,
      fontFamily: theme.fonts.body,
      fontWeight: 800,
      fontSize: size,
      letterSpacing: "0.08em",
      padding: `${size * 0.36}px ${size * 0.7}px`,
      borderRadius: 999,
      lineHeight: 1,
      whiteSpace: "nowrap",
      ...style,
    }}
  >
    {children}
  </div>
);

/** White case-file card. */
export const Card: React.FC<{ style?: React.CSSProperties; children?: React.ReactNode; glow?: number }> = ({ style, children, glow = 0 }) => (
  <div
    style={{
      background: C.white,
      borderRadius: 30,
      border: `2.5px solid rgba(18,4,75,0.10)`,
      boxShadow: `0 22px 50px -22px rgba(18,4,75,0.28)${glow > 0 ? `, 0 0 0 ${6 * glow}px rgba(109,74,253,${0.25 * glow}), 0 0 ${70 * glow}px rgba(109,74,253,${0.45 * glow})` : ""}`,
      ...style,
    }}
  >
    {children}
  </div>
);

/** One-shot sound effect at a scene-relative frame. */
export const Sfx: React.FC<{ at: number; name: string; vol?: number }> = ({ at, name, vol = 0.6 }) => (
  <Sequence from={Math.max(0, at)} durationInFrames={60} layout="none">
    <Audio src={staticFile(`sfx/${name}.wav`)} volume={vol * theme.audio.sfxGain} />
  </Sequence>
);

/** Big headline that reveals word by word. */
export const Headline: React.FC<{
  text: string;
  delay?: number;
  size?: number;
  color?: string;
  hl?: string[];
  align?: "left" | "center";
  per?: number;
  style?: React.CSSProperties;
}> = ({ text, delay = 0, size = 96, color = C.navy, hl = [], align = "center", per = 3, style }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const words = text.split(" ");
  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        justifyContent: align === "center" ? "center" : "flex-start",
        columnGap: size * 0.24,
        rowGap: size * 0.02,
        fontFamily: theme.fonts.display,
        fontWeight: 700,
        fontSize: size,
        lineHeight: 1.08,
        letterSpacing: "-0.025em",
        color,
        textAlign: align,
        ...style,
      }}
    >
      {words.map((w, i) => {
        const p = spring({ frame: frame - delay - i * per, fps, config: theme.spring.snappy });
        const isHl = hl.includes(w.replace(/[?.,!]/g, ""));
        const hp = spring({ frame: frame - delay - i * per - 6, fps, config: theme.spring.smooth });
        return (
          <span
            key={i}
            style={{
              position: "relative",
              display: "inline-block",
              opacity: interpolate(p, [0, 0.5], [0, 1], clamp),
              transform: `translateY(${interpolate(p, [0, 1], [size * 0.4, 0])}px)`,
            }}
          >
            {isHl && (
              <span
                style={{
                  position: "absolute",
                  left: -size * 0.12,
                  right: -size * 0.12,
                  top: size * 0.14,
                  bottom: size * 0.02,
                  background: C.lavender,
                  borderRadius: size * 0.16,
                  transform: `scaleX(${hp}) rotate(-1.5deg)`,
                  transformOrigin: "left center",
                  zIndex: 0,
                }}
              />
            )}
            <span style={{ position: "relative", zIndex: 1 }}>{w}</span>
          </span>
        );
      })}
    </div>
  );
};

/** Indian number format (1,00,00,00,000). */
export const inr = (n: number) => Math.round(n).toLocaleString("en-IN");

/** Gentle idle float for elements that sit on screen. */
export const useFloat = (seed = 0, amp = 5) => {
  const frame = useCurrentFrame();
  return Math.sin((frame + seed * 17) / 28) * amp;
};
