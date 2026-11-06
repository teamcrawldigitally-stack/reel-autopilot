// Gita Shlok Series (@gita.shlok.series) look: night-indigo sheet, gold + saffron lines,
// Devanagari display type. Hisaab rules: green = good, red = bad, one glowing hero per frame.
import { Easing } from "remotion";

export const G = {
  ink: "#070818",
  bgMid: "#10133A",
  bgCenter: "#1B2150",
  gold: "#F2B84B",
  goldDeep: "#C98A1E",
  saffron: "#FF9A3C",
  cream: "#FFF4DF",
  dim: "rgba(255,236,205,0.72)",
  line: "rgba(242,184,75,0.55)",
  lineSoft: "rgba(242,184,75,0.22)",
  red: "#FF5A5F",
  green: "#2BD46B",
  white: "#FFFFFF",
  leaf: "#E7C88E",
  leafDeep: "#C99A55",
  leafInk: "#3A230B",
};

export const theme = {
  fonts: {
    deva: "Mukta, Poppins, sans-serif",
    sanskrit: "TiroSanskrit, Mukta, serif",
    num: "Poppins, sans-serif",
    label: "Inter, Mukta, sans-serif",
  },
  grad: {
    gold: "linear-gradient(135deg, #FFD67E 0%, #F2B84B 45%, #C98A1E 100%)",
    saffron: "linear-gradient(135deg, #FFB46B 0%, #FF9A3C 50%, #E2701A 100%)",
  },
  ease: {
    out: Easing.bezier(0.16, 1, 0.3, 1),
    inOut: Easing.bezier(0.83, 0, 0.17, 1),
    in: Easing.bezier(0.7, 0, 0.84, 0),
    soft: Easing.bezier(0.33, 1, 0.68, 1),
  },
  spring: {
    snappy: { damping: 14, stiffness: 160, mass: 0.6 },
    smooth: { damping: 20, stiffness: 90, mass: 1 },
    bouncy: { damping: 11, stiffness: 170, mass: 0.7 },
    slam: { damping: 12, stiffness: 260, mass: 0.8 },
  },
  audio: { sfxGain: 0.55 },
} as const;
