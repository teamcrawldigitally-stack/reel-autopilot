// Background + finishing layers: BgMesh (bottom), Grade, Grain, Vignette (top).
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { useTheme } from "../theme";

export const BgMesh: React.FC = () => {
  const t = useTheme();
  const frame = useCurrentFrame();
  const d1 = Math.sin(frame / 55) * 60;
  const d2 = Math.cos(frame / 70) * 50;
  const d3 = Math.sin(frame / 90) * 40;
  return (
    <AbsoluteFill style={{ background: t.colors.bg, overflow: "hidden" }}>
      <div
        style={{
          position: "absolute",
          width: 1300,
          height: 1300,
          borderRadius: "50%",
          top: -520 + d3,
          left: -420 + d1,
          background: `radial-gradient(circle closest-side, ${t.rgba(t.colors.primary, 0.3)}, ${t.rgba(t.colors.primary, 0.08)} 55%, transparent 100%)`,
        }}
      />
      <div
        style={{
          position: "absolute",
          width: 1100,
          height: 1100,
          bottom: -380,
          right: -420 - d2,
          background: `radial-gradient(circle closest-side, ${t.rgba(t.colors.accent, 0.16)}, ${t.rgba(t.colors.accent, 0.04)} 55%, transparent 100%)`,
        }}
      />
      {/* faint dot grid for texture, drifting slowly */}
      <AbsoluteFill
        style={{
          backgroundImage: `radial-gradient(${t.rgba(t.colors.text, 0.07)} 1.5px, transparent 1.6px)`,
          backgroundSize: "44px 44px",
          backgroundPosition: `0px ${-(frame * 0.4) % 44}px`,
          maskImage: "linear-gradient(180deg, transparent, black 25%, black 70%, transparent)",
          WebkitMaskImage: "linear-gradient(180deg, transparent, black 25%, black 70%, transparent)",
        }}
      />
    </AbsoluteFill>
  );
};

export const Grade: React.FC = () => {
  const t = useTheme();
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <AbsoluteFill style={{ backgroundColor: t.colors.primary, mixBlendMode: "soft-light", opacity: 0.12 }} />
      <AbsoluteFill
        style={{
          background:
            "linear-gradient(180deg, rgba(0,0,0,0.35), transparent 18%, transparent 72%, rgba(0,0,0,0.45))",
        }}
      />
    </AbsoluteFill>
  );
};

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
        opacity: 0.07,
        mixBlendMode: "overlay",
      }}
    />
  );
};

export const Vignette: React.FC = () => (
  <AbsoluteFill
    style={{
      pointerEvents: "none",
      background: "radial-gradient(ellipse at center, transparent 55%, rgba(0,0,0,0.38) 100%)",
    }}
  />
);
