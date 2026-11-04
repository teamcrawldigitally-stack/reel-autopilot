// Persistent UI: brand handle chip + scene progress, and the per-scene shell
// (fast cut-in, slow camera drift, faster exit).
import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { useTheme } from "../theme";

export const BrandBar: React.FC<{
  handle: string;
  sceneStarts: number[]; // frames
  total: number; // frames
}> = ({ handle, sceneStarts, total }) => {
  const t = useTheme();
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = spring({ frame: frame - 4, fps, config: t.spring.smooth });
  return (
    <div
      style={{
        position: "absolute",
        top: 200,
        left: t.layout.side,
        right: t.layout.side,
        display: "flex",
        alignItems: "center",
        gap: 24,
        opacity: interpolate(enter, [0, 0.6], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
        transform: `translateY(${interpolate(enter, [0, 1], [-20, 0])}px)`,
      }}
    >
      {handle ? (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            padding: "12px 22px",
            borderRadius: 999,
            background: t.rgba(t.colors.text, 0.08),
            border: `1px solid ${t.rgba(t.colors.text, 0.14)}`,
            fontFamily: t.fonts.body,
            fontWeight: 600,
            fontSize: 30,
            color: t.colors.text,
            whiteSpace: "nowrap",
          }}
        >
          <div style={{ width: 14, height: 14, borderRadius: 7, background: t.colors.accent }} />
          {handle}
        </div>
      ) : null}
      <div style={{ flex: 1, display: "flex", gap: 8 }}>
        {sceneStarts.map((start, i) => {
          const end = sceneStarts[i + 1] ?? total;
          const fill = interpolate(frame, [start, end], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });
          return (
            <div
              key={i}
              style={{ flex: 1, height: 6, borderRadius: 3, background: t.rgba(t.colors.text, 0.16), overflow: "hidden" }}
            >
              <div style={{ width: `${fill * 100}%`, height: "100%", background: t.rgba(t.colors.text, 0.85) }} />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export const SceneShell: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const t = useTheme();
  const frame = useCurrentFrame();
  const { durationInFrames, fps } = useVideoConfig();
  const enter = spring({ frame, fps, config: t.spring.smooth });
  const exitStart = durationInFrames - 9;
  const exit = interpolate(frame, [exitStart, durationInFrames - 1], [0, 1], {
    easing: t.ease.in,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const drift = interpolate(frame, [0, durationInFrames], [1, 1.035], {
    easing: t.ease.inOut,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <AbsoluteFill
      style={{
        opacity: 1 - exit,
        transform: `translateY(${interpolate(exit, [0, 1], [0, -50])}px) scale(${
          interpolate(enter, [0, 1], [1.05, 1]) * drift
        })`,
        filter: `blur(${interpolate(exit, [0, 1], [0, 10])}px)`,
      }}
    >
      <div
        style={{
          position: "absolute",
          top: t.layout.contentTop,
          left: t.layout.side,
          right: t.layout.side,
          height: t.layout.contentHeight,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        {children}
      </div>
    </AbsoluteFill>
  );
};
