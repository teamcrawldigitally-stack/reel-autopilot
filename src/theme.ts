// Single source of truth for colors, easing, springs and fonts.
// Brand colors come from config/channel.json -> props.brand.colors and override these defaults.
import { createContext, useContext } from "react";
import { Easing } from "remotion";

export type Palette = {
  bg: string;
  bgAlt: string;
  primary: string; // THE hero color: at most one element per frame
  accent: string;
  text: string;
  textDim: string;
};

export const defaultPalette: Palette = {
  bg: "#0B0B10",
  bgAlt: "#15151F",
  primary: "#FF5A36",
  accent: "#FFD23F",
  text: "#F5F4F0",
  textDim: "#A8A6B3",
};

const hexToRgba = (hex: string, alpha: number) => {
  const h = hex.replace("#", "");
  const n = parseInt(h.length === 3 ? h.split("").map((c) => c + c).join("") : h, 16);
  return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${alpha})`;
};

export const makeTheme = (overrides?: Partial<Palette>) => {
  const colors = { ...defaultPalette, ...(overrides ?? {}) };
  return {
    colors: {
      ...colors,
      glow: hexToRgba(colors.primary, 0.45),
      glowSoft: hexToRgba(colors.primary, 0.2),
      accentSoft: hexToRgba(colors.accent, 0.16),
      shade: "rgba(0,0,0,0.55)",
    },
    rgba: hexToRgba,
    fonts: {
      display: '"Bricolage Grotesque", "Noto Sans Devanagari", sans-serif',
      body: 'Inter, "Noto Sans Devanagari", sans-serif',
    },
    // Linear is forbidden.
    ease: {
      out: Easing.bezier(0.16, 1, 0.3, 1),
      inOut: Easing.bezier(0.83, 0, 0.17, 1),
      in: Easing.bezier(0.7, 0, 0.84, 0),
    },
    spring: {
      snappy: { damping: 14, stiffness: 160, mass: 0.6 },
      smooth: { damping: 20, stiffness: 90, mass: 1 },
      bouncy: { damping: 11, stiffness: 170, mass: 0.7 },
      counter: { damping: 30, stiffness: 60, mass: 1 },
    },
    // 9:16 layout. Instagram UI covers the top ~250px and bottom ~420px.
    layout: {
      width: 1080,
      height: 1920,
      side: 90,
      contentTop: 330,
      contentHeight: 820,
      captionTop: 1230,
    },
  } as const;
};

export type Theme = ReturnType<typeof makeTheme>;

export const ThemeContext = createContext<Theme>(makeTheme());
export const useTheme = () => useContext(ThemeContext);
