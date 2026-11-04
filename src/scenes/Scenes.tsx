// The five scene layouts the script can use: hook, point, stat, list, cta.
import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { Entrance, fitSize, WordReveal } from "../components/Motion";
import { useTheme } from "../theme";
import type { Scene } from "../types";

const wordsIn = (s: string) => s.split(/\s+/).filter(Boolean).length;

const Kicker: React.FC<{ text: string; delay?: number }> = ({ text, delay = 0 }) => {
  const t = useTheme();
  if (!text) return null;
  return (
    <Entrance delay={delay} rise={24}>
      <div
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 14,
          padding: "12px 24px",
          borderRadius: 999,
          border: `2px solid ${t.rgba(t.colors.accent, 0.7)}`,
          background: t.colors.accentSoft,
          color: t.colors.accent,
          fontFamily: t.fonts.body,
          fontWeight: 600,
          fontSize: 34,
          letterSpacing: "0.06em",
          textTransform: "uppercase",
          marginBottom: 40,
        }}
      >
        {text}
      </div>
    </Entrance>
  );
};

const Body: React.FC<{ text: string; delay: number; center?: boolean }> = ({ text, delay, center }) => {
  const t = useTheme();
  if (!text) return null;
  return (
    <Entrance delay={delay} rise={30}>
      <div
        style={{
          marginTop: 44,
          display: "flex",
          gap: 26,
          justifyContent: center ? "center" : "flex-start",
        }}
      >
        {center ? null : (
          <div style={{ width: 6, borderRadius: 3, background: t.colors.accent, flexShrink: 0 }} />
        )}
        <div
          style={{
            fontFamily: t.fonts.body,
            fontWeight: 500,
            fontSize: 46,
            lineHeight: 1.32,
            color: t.colors.textDim,
            textAlign: center ? "center" : "left",
          }}
        >
          {text}
        </div>
      </div>
    </Entrance>
  );
};

// Gentle float for anything that stays on screen for a while.
const useFloat = (amp = 4, speed = 30) => Math.sin(useCurrentFrame() / speed) * amp;

export const HookScene: React.FC<{ scene: Scene }> = ({ scene }) => {
  const float = useFloat();
  const n = wordsIn(scene.headline);
  return (
    <div style={{ transform: `translateY(${float}px)` }}>
      <Kicker text={scene.kicker} delay={2} />
      <WordReveal text={scene.headline} highlight={scene.highlight} fontSize={fitSize(scene.headline)} delay={5} />
      <Body text={scene.body} delay={5 + n * 3 + 8} />
    </div>
  );
};

export const PointScene: React.FC<{ scene: Scene; index: number }> = ({ scene, index }) => {
  const t = useTheme();
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const n = wordsIn(scene.headline);
  const numIn = spring({ frame, fps, config: t.spring.bouncy });
  return (
    <div>
      <div
        style={{
          fontFamily: t.fonts.display,
          fontWeight: 800,
          fontSize: 200,
          lineHeight: 0.9,
          color: "transparent",
          WebkitTextStroke: `3px ${t.rgba(t.colors.text, 0.45)}`,
          letterSpacing: "-0.04em",
          marginBottom: 30,
          opacity: interpolate(numIn, [0, 0.5], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
          transform: `translateX(${interpolate(numIn, [0, 1], [-60, 0])}px) rotate(${interpolate(numIn, [0, 1], [-8, 0])}deg)`,
          transformOrigin: "0% 100%",
        }}
      >
        {String(index).padStart(2, "0")}
      </div>
      <WordReveal
        text={scene.headline}
        highlight={scene.highlight}
        highlightStyle="color"
        fontSize={fitSize(scene.headline, [116, 104, 92, 80])}
        delay={6}
      />
      <Body text={scene.body} delay={6 + n * 3 + 8} />
    </div>
  );
};

const formatStat = (v: number) =>
  Number.isInteger(v) ? Math.round(v).toLocaleString("en-IN") : v.toFixed(1);

export const StatScene: React.FC<{ scene: Scene }> = ({ scene }) => {
  const t = useTheme();
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame: frame - 6, fps, config: t.spring.counter });
  const value = interpolate(p, [0, 1], [0, scene.statValue]);
  const shown = Number.isInteger(scene.statValue) ? Math.round(value) : value;
  const finalText = `${scene.statPrefix}${formatStat(scene.statValue)}${scene.statSuffix}`;
  const size = finalText.length <= 4 ? 300 : finalText.length <= 6 ? 240 : finalText.length <= 8 ? 196 : 156;
  const pop = spring({ frame: frame - 6, fps, config: t.spring.bouncy });
  const breathe = 1 + Math.sin(frame / 22) * 0.012;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}>
      <Kicker text={scene.kicker} delay={0} />
      <div
        style={{
          fontFamily: t.fonts.display,
          fontWeight: 800,
          fontSize: size,
          lineHeight: 1,
          letterSpacing: "-0.04em",
          fontVariantNumeric: "tabular-nums",
          color: t.colors.primary,
          textShadow: `0 0 60px ${t.colors.glow}, 0 0 140px ${t.colors.glowSoft}`,
          whiteSpace: "nowrap",
          opacity: interpolate(pop, [0, 0.4], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
          transform: `scale(${interpolate(pop, [0, 1], [0.7, 1]) * breathe})`,
        }}
      >
        {scene.statPrefix}
        {formatStat(shown)}
        {scene.statSuffix}
      </div>
      <div style={{ height: 40 }} />
      <WordReveal text={scene.statLabel || scene.headline} fontSize={66} weight={700} align="center" delay={18} />
      <Body text={scene.body} delay={30} center />
    </div>
  );
};

const Check: React.FC<{ color: string }> = ({ color }) => (
  <svg width="56" height="56" viewBox="0 0 56 56" style={{ flexShrink: 0 }}>
    <circle cx="28" cy="28" r="26" fill={color} opacity="0.16" />
    <circle cx="28" cy="28" r="26" fill="none" stroke={color} strokeWidth="3" />
    <path d="M17 29 L25 37 L40 20" fill="none" stroke={color} strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const ListScene: React.FC<{ scene: Scene }> = ({ scene }) => {
  const t = useTheme();
  const { durationInFrames } = useVideoConfig();
  const items = scene.items.slice(0, 5);
  const n = wordsIn(scene.headline);
  const first = 6 + n * 3 + 4;
  const spread = Math.max(6, Math.floor((durationInFrames * 0.6 - first) / Math.max(1, items.length)));
  const itemSize = items.length >= 5 ? 42 : 48;
  return (
    <div>
      <Kicker text={scene.kicker} delay={0} />
      <WordReveal
        text={scene.headline}
        highlight={scene.highlight}
        highlightStyle="color"
        fontSize={fitSize(scene.headline, [104, 92, 80, 72])}
        delay={4}
      />
      <div style={{ display: "flex", flexDirection: "column", gap: 22, marginTop: 50 }}>
        {items.map((item, i) => (
          <Entrance key={i} delay={first + i * spread} rise={36}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 26,
                padding: "24px 30px",
                borderRadius: 28,
                background: t.rgba(t.colors.text, 0.06),
                border: `1px solid ${t.rgba(t.colors.text, 0.1)}`,
                boxShadow: "0 30px 60px -30px rgba(0,0,0,0.6)",
              }}
            >
              <Check color={t.colors.accent} />
              <div
                style={{
                  fontFamily: t.fonts.body,
                  fontWeight: 600,
                  fontSize: itemSize,
                  lineHeight: 1.2,
                  color: t.colors.text,
                }}
              >
                {item}
              </div>
            </div>
          </Entrance>
        ))}
      </div>
    </div>
  );
};

export const CtaScene: React.FC<{ scene: Scene; handle: string }> = ({ scene, handle }) => {
  const t = useTheme();
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const n = wordsIn(scene.headline);
  const pillDelay = 6 + n * 3 + 6;
  const pill = spring({ frame: frame - pillDelay, fps, config: t.spring.bouncy });
  const breathe = 1 + Math.sin(frame / 18) * 0.018;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}>
      <Kicker text={scene.kicker} delay={0} />
      <WordReveal
        text={scene.headline}
        highlight={scene.highlight}
        highlightStyle="color"
        fontSize={fitSize(scene.headline, [120, 104, 92, 80])}
        align="center"
        delay={4}
      />
      <div
        style={{
          marginTop: 70,
          display: "inline-flex",
          alignItems: "center",
          gap: 22,
          padding: "30px 54px",
          borderRadius: 999,
          background: t.colors.primary,
          boxShadow: `0 0 60px ${t.colors.glow}, 0 0 140px ${t.colors.glowSoft}`,
          fontFamily: t.fonts.display,
          fontWeight: 800,
          fontSize: 56,
          color: "#fff",
          opacity: interpolate(pill, [0, 0.4], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
          transform: `translateY(${interpolate(pill, [0, 1], [40, 0])}px) scale(${interpolate(pill, [0, 1], [0.8, 1]) * breathe})`,
        }}
      >
        {scene.body || "Follow for more"}
        <svg width="46" height="46" viewBox="0 0 46 46">
          <path d="M10 23 H34 M24 12 L35 23 L24 34" fill="none" stroke="#fff" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      {handle ? (
        <Entrance delay={pillDelay + 10} rise={20}>
          <div
            style={{
              marginTop: 40,
              fontFamily: t.fonts.body,
              fontWeight: 500,
              fontSize: 40,
              color: t.colors.textDim,
            }}
          >
            {handle}
          </div>
        </Entrance>
      ) : null}
    </div>
  );
};
