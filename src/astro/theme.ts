// Astro 24x7 look: warm white, saffron orange, a little black.
import { Easing } from "remotion";

export const astro = {
  colors: {
    bg: "#FFF7EE",
    bgDeep: "#FFE9D4",
    orange: "#FF7A1A",
    orangeDeep: "#E8590C",
    orangeSoft: "#FFD9B8",
    ink: "#1A1410",
    inkSoft: "#5C4A3D",
    white: "#FFFFFF",
    line: "rgba(232, 89, 12, 0.16)",
  },
  fonts: {
    display: '"Rozha One", "Mukta", serif',
    body: '"Mukta", sans-serif',
  },
  ease: {
    out: Easing.bezier(0.16, 1, 0.3, 1),
    inOut: Easing.bezier(0.83, 0, 0.17, 1),
    in: Easing.bezier(0.7, 0, 0.84, 0),
  },
  spring: {
    snappy: { damping: 14, stiffness: 160, mass: 0.6 },
    smooth: { damping: 20, stiffness: 90, mass: 1 },
    bouncy: { damping: 10, stiffness: 170, mass: 0.7 },
    counter: { damping: 30, stiffness: 70, mass: 1 },
  },
  layout: {
    side: 80,
    contentTop: 290,
    contentHeight: 1080,
    captionTop: 1415,
  },
} as const;

export const rgba = (hex: string, a: number) => {
  const n = parseInt(hex.replace("#", ""), 16);
  return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${a})`;
};
