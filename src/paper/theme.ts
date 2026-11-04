// "Paper" look for Astro 24x7: old-paper editorial page, black header bar, ink engravings,
// one orange accent (the brand colour) instead of a full palette.
import { Easing } from "remotion";

export const paper = {
  colors: {
    paper: "#EEE7DA",
    paperDeep: "#E2D8C6",
    ink: "#171310",
    inkSoft: "#5B5248",
    accent: "#D9480F",
    accentSoft: "#F2B58F",
    white: "#FFFFFF",
  },
  fonts: {
    head: '"Mukta", sans-serif',
    display: '"Rozha One", "Mukta", serif',
  },
  ease: {
    out: Easing.bezier(0.16, 1, 0.3, 1),
    inOut: Easing.bezier(0.65, 0, 0.35, 1),
    in: Easing.bezier(0.7, 0, 0.84, 0),
  },
  layout: {
    side: 80,
    headerTop: 236,
    headerH: 112,
    contentTop: 380,
    contentHeight: 980,
    captionTop: 1408,
    footerTop: 1586,
  },
} as const;

export const rgba = (hex: string, a: number) => {
  const n = parseInt(hex.replace("#", ""), 16);
  return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${a})`;
};
