import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { LockIcon } from "../../../components/icons";
import { Card, Chip, Enter, SceneShell, Sfx, clamp, useFloat, useSpring } from "../../../components/kit";
import { C, theme } from "../../../theme";
import { cue } from "../timeline";

const Letters: React.FC<{ text: string; delay: number; size: number }> = ({ text, delay, size }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      {text.split("").map((ch, i) => {
        const p = spring({ frame: frame - delay - i * 2, fps, config: theme.spring.snappy });
        return (
          <span
            key={i}
            style={{
              display: "inline-block",
              fontFamily: theme.fonts.display,
              fontWeight: 700,
              fontSize: size,
              lineHeight: 1,
              letterSpacing: "-0.02em",
              color: C.navy,
              opacity: interpolate(p, [0, 0.4], [0, 1], clamp),
              transform: `translateY(${interpolate(p, [0, 1], [size * 0.5, 0])}px) scale(${interpolate(p, [0, 1], [0.7, 1])})`,
            }}
          >
            {ch}
          </span>
        );
      })}
    </div>
  );
};

export const S2Loop: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const andro = cue("s2", "andromeda");
  const teen = cue("s2", "teen");
  const paise = cue("s2", "paise");
  const two = useSpring(andro + 14, "slam");
  const glow = useSpring(paise, "smooth");
  const wiggle = frame >= paise ? Math.sin((frame - paise) * 1.3) * 10 * Math.exp(-(frame - paise) / 10) : 0;
  const fl = useFloat(2, 4);

  return (
    <SceneShell dur={dur}>
      <div style={{ position: "absolute", left: 0, right: 0, top: 320, display: "flex", flexDirection: "column", alignItems: "center", gap: 26 }}>
        <Enter delay={1} cfg="snappy">
          <Chip bg={C.lavenderSoft} color={C.violetDeep} size={30}>
            SYSTEM KA NAAM
          </Chip>
        </Enter>
        <Letters text="ANDROMEDA" delay={andro - 3} size={146} />
        <div
          style={{
            opacity: interpolate(two, [0, 0.3], [0, 1], clamp),
            transform: `scale(${interpolate(two, [0, 1], [1.8, 1])}) rotate(-3deg) translateY(${fl}px)`,
            background: theme.grad.violet,
            color: C.white,
            fontFamily: theme.fonts.display,
            fontWeight: 700,
            fontSize: 120,
            lineHeight: 1,
            padding: "22px 46px 10px",
            borderRadius: 34,
            boxShadow: `0 24px 60px -20px ${C.glow}`,
          }}
        >
          2.0
        </div>
      </div>

      <div style={{ position: "absolute", left: 105, top: 820, display: "flex", gap: 30 }}>
        {[1, 2, 3].map((n, i) => {
          const isLock = n === 3;
          const g = isLock ? glow : 0;
          const dim = isLock ? 0 : interpolate(glow, [0, 1], [0, 0.35]);
          return (
            <Enter key={n} delay={teen + i * 5} cfg="bouncy" dist={70}>
              <Card
                glow={g}
                style={{
                  width: 270,
                  height: 310,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 14,
                  opacity: 1 - dim,
                  transform: `scale(${1 + 0.06 * g}) rotate(${isLock ? wiggle * 0.4 : 0}deg)`,
                  border: isLock ? `4px solid ${interpolate(glow, [0, 1], [0, 1]) > 0.5 ? C.violet : "rgba(18,4,75,0.10)"}` : undefined,
                }}
              >
                <div style={{ fontFamily: theme.fonts.display, fontWeight: 700, fontSize: 130, lineHeight: 1, color: isLock ? C.violet : C.navy }}>{n}</div>
                {isLock ? (
                  <LockIcon size={70} style={{ transform: `rotate(${wiggle}deg)` }} />
                ) : (
                  <div style={{ fontFamily: theme.fonts.display, fontWeight: 700, fontSize: 70, lineHeight: 1, color: C.lavender }}>?</div>
                )}
              </Card>
            </Enter>
          );
        })}
      </div>
      <Sfx at={andro - 4} name="whoosh" vol={0.5} />
      <Sfx at={andro + 12} name="bass" vol={0.7} />
      {[0, 1, 2].map((i) => (
        <Sfx key={i} at={teen + i * 5 - 1} name="pop" vol={0.5} />
      ))}
      <Sfx at={paise - 2} name="ding" vol={0.45} />
    </SceneShell>
  );
};
