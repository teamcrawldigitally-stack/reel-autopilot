// Single source of truth for the D2C Founders reel look.
import { Easing } from "remotion";

export const theme = {
  colors: {
    paper: "#FBFAFF",
    paperDeep: "#F3EEFF",
    grid: "rgba(109, 74, 253, 0.075)",
    gridStrong: "rgba(109, 74, 253, 0.13)",
    navy: "#12044B",
    navySoft: "#3B3168",
    muted: "#6E6894",
    violet: "#6D4AFD",
    violetDeep: "#3618B4",
    lavender: "#DFC8FD",
    lavenderSoft: "#EFE5FF",
    white: "#FFFFFF",
    red: "#E5484D",
    redSoft: "#FDE8E9",
    green: "#16A34A",
    greenSoft: "#E3F6EA",
    glow: "rgba(109, 74, 253, 0.45)",
    shadow: "rgba(18, 4, 75, 0.14)",
  },
  grad: {
    violet: "linear-gradient(135deg, #7B5BFF 0%, #6D4AFD 45%, #3618B4 100%)",
  },
  fonts: {
    display: "Poppins",
    body: "Inter",
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
  audio: {
    sfxGain: 0.55, // all sound effects are scaled by this (user: keep SFX low)
  },
  layout: {
    W: 1080,
    H: 1920,
    padX: 84,
    contentTop: 300,
    captionY: 1330,
  },
} as const;

export const C = theme.colors;
