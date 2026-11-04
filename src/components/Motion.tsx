// Motion primitives: Entrance (fade + rise + scale) and WordReveal (staggered words
// with an optional highlighted phrase that gets a hero-color pill or color).
import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { useTheme } from "../theme";

export const Entrance: React.FC<{
  delay?: number;
  rise?: number;
  children: React.ReactNode;
  style?: React.CSSProperties;
}> = ({ delay = 0, rise = 40, children, style }) => {
  const t = useTheme();
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame: frame - delay, fps, config: t.spring.smooth });
  return (
    <div
      style={{
        opacity: interpolate(p, [0, 0.6], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
        transform: `translateY(${interpolate(p, [0, 1], [rise, 0])}px) scale(${interpolate(p, [0, 1], [0.94, 1])})`,
        ...style,
      }}
    >
      {children}
    </div>
  );
};

const norm = (s: string) => s.toLowerCase().replace(/[^\p{L}\p{N}]+/gu, "");

// Indexes of the words in `words` that belong to the highlight phrase.
const highlightIndexes = (words: string[], highlight: string): Set<number> => {
  const target = highlight.split(/\s+/).map(norm).filter(Boolean);
  const out = new Set<number>();
  if (!target.length) return out;
  for (let i = 0; i + target.length <= words.length; i++) {
    if (target.every((w, j) => norm(words[i + j]) === w)) {
      target.forEach((_, j) => out.add(i + j));
      return out;
    }
  }
  return out;
};

export const WordReveal: React.FC<{
  text: string;
  highlight?: string;
  highlightStyle?: "pill" | "color";
  delay?: number;
  per?: number;
  fontSize: number;
  color?: string;
  weight?: number;
  align?: "left" | "center";
}> = ({ text, highlight = "", highlightStyle = "pill", delay = 0, per = 3, fontSize, color, weight = 800, align = "left" }) => {
  const t = useTheme();
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const words = text.split(/\s+/).filter(Boolean);
  const hi = highlightIndexes(words, highlight);
  const gap = Math.round(fontSize * 0.26); // px, not em
  // Group the highlighted phrase into one unit so it gets a single pill.
  const units: { text: string; hi: boolean; index: number }[] = [];
  words.forEach((w, i) => {
    const last = units[units.length - 1];
    if (hi.has(i) && last?.hi) last.text += " " + w;
    else units.push({ text: w, hi: hi.has(i), index: i });
  });
  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        columnGap: gap,
        rowGap: Math.round(fontSize * 0.08),
        justifyContent: align === "center" ? "center" : "flex-start",
        fontFamily: t.fonts.display,
        fontWeight: weight,
        fontSize,
        lineHeight: 1.04,
        letterSpacing: "-0.03em",
        color: color ?? t.colors.text,
      }}
    >
      {units.map(({ text: word, hi: isHi, index: i }) => {
        const p = spring({ frame: frame - delay - i * per, fps, config: t.spring.snappy });
        const pill = spring({ frame: frame - delay - i * per - 5, fps, config: t.spring.smooth });
        return (
          <span
            key={i}
            style={{
              whiteSpace: "pre",
              position: "relative",
              display: "inline-block",
              opacity: interpolate(p, [0, 0.5], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
              transform: `translateY(${interpolate(p, [0, 1], [fontSize * 0.35, 0])}px) scale(${interpolate(p, [0, 1], [0.9, 1])})`,
              color: isHi && highlightStyle === "color" ? t.colors.primary : undefined,
              textShadow: isHi && highlightStyle === "color" ? `0 0 40px ${t.colors.glow}` : undefined,
              zIndex: 1,
            }}
          >
            {isHi && highlightStyle === "pill" ? (
              <span
                style={{
                  position: "absolute",
                  left: -fontSize * 0.12,
                  right: -fontSize * 0.12,
                  top: fontSize * 0.1,
                  bottom: fontSize * 0.02,
                  background: t.colors.primary,
                  borderRadius: fontSize * 0.16,
                  transform: `scaleX(${pill})`,
                  transformOrigin: "0% 50%",
                  boxShadow: `0 0 50px ${t.colors.glowSoft}`,
                  zIndex: -1,
                }}
              />
            ) : null}
            {word}
          </span>
        );
      })}
    </div>
  );
};

// Pick a headline size that fits the 900px-wide content column.
export const fitSize = (text: string, sizes: [number, number, number, number] = [132, 116, 100, 86]) => {
  const n = text.length;
  if (n <= 18) return sizes[0];
  if (n <= 34) return sizes[1];
  if (n <= 52) return sizes[2];
  return sizes[3];
};
