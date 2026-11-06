import React from "react";
import { AbsoluteFill, Audio, Sequence, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { G, theme } from "../theme";

export const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

export const ease = (frame: number, a: number, b: number, k: keyof typeof theme.ease = "out") =>
  interpolate(frame, [a, b], [0, 1], { ...clamp, easing: theme.ease[k] });

export const useSpring = (delay: number, cfg: keyof typeof theme.spring = "smooth") => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({ frame: frame - delay, fps, config: theme.spring[cfg] });
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

export const SceneShell: React.FC<{ dur: number; noExit?: boolean; children: React.ReactNode }> = ({ dur, noExit, children }) => {
  const frame = useCurrentFrame();
  const x = noExit ? 0 : interpolate(frame, [dur - 9, dur - 1], [0, 1], { ...clamp, easing: theme.ease.in });
  return <AbsoluteFill style={{ opacity: 1 - x, transform: `translateY(${-50 * x}px) scale(${1 - 0.03 * x})` }}>{children}</AbsoluteFill>;
};

export const Sfx: React.FC<{ at: number; name: string; vol?: number }> = ({ at, name, vol = 0.6 }) => (
  <Sequence from={Math.max(0, at)} durationInFrames={60} layout="none">
    <Audio src={staticFile(`sfx/${name}.wav`)} volume={vol * theme.audio.sfxGain} />
  </Sequence>
);

/* ---------- type styles ---------- */

export const deva = (size: number, color: string = G.cream, weight = 800): React.CSSProperties => ({
  fontFamily: theme.fonts.deva,
  fontWeight: weight,
  fontSize: size,
  lineHeight: 1.18,
  color,
  whiteSpace: "nowrap",
});

export const num = (size: number, color: string = G.cream): React.CSSProperties => ({
  fontFamily: theme.fonts.num,
  fontWeight: 700,
  fontSize: size,
  lineHeight: 1,
  letterSpacing: "-0.02em",
  color,
  whiteSpace: "nowrap",
  fontVariantNumeric: "tabular-nums",
});

export const label = (size = 28, color: string = G.dim): React.CSSProperties => ({
  fontFamily: theme.fonts.label,
  fontWeight: 800,
  fontSize: size,
  letterSpacing: "0.12em",
  textTransform: "uppercase",
  color,
  whiteSpace: "nowrap",
});

export const sanskrit = (size: number, color: string = G.leafInk): React.CSSProperties => ({
  fontFamily: theme.fonts.sanskrit,
  fontWeight: 400,
  fontSize: size,
  lineHeight: 1.45,
  color,
  whiteSpace: "nowrap",
});

export const glass: React.CSSProperties = {
  background: "rgba(255,244,223,0.06)",
  border: `2.5px solid ${G.lineSoft}`,
  borderRadius: 30,
  boxShadow: "0 30px 60px -30px rgba(0,0,0,0.6)",
};
