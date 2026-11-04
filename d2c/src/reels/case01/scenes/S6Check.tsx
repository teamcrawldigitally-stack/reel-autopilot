import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { Camera } from "../../../components/fx";
import { Card, Chip, Enter, Headline, SceneShell, Sfx, clamp, useSpring } from "../../../components/kit";
import { C, theme } from "../../../theme";
import { cue } from "../timeline";

const MONTHS = [10, 14, 17, 22, 26, 31];

export const S6Check: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const num = cue("s6", "number");
  const bina = cue("s6", "bina");
  const total = cue("s6", "total");
  const pct = cue("s6", "percent");
  const badh = cue("s6", "badhna");
  const res = useSpring(pct - 2, "slam");
  const blink = 0.4 + 0.6 * Math.abs(Math.sin(frame / 7));
  const line = interpolate(frame, [badh + 6, badh + 30], [0, 1], { ...clamp, easing: theme.ease.out });

  return (
    <SceneShell dur={dur} noExit>
      <Camera dur={dur} punches={[pct]}>
        <div style={{ position: "absolute", left: theme.layout.padX, right: theme.layout.padX, top: 300, display: "flex", flexDirection: "column", alignItems: "center", gap: 18 }}>
          <Enter delay={0} cfg="snappy">
            <Chip size={34} bg={C.navy}>
              AAJ KA KAAM
            </Chip>
          </Enter>
          <Headline text="Apna number nikalo" delay={num - 8} size={84} hl={["number"]} />
        </div>
        <Enter delay={bina - 8} style={{ position: "absolute", left: theme.layout.padX, top: 530 }}>
          <Card style={{ width: 912, height: 380, boxSizing: "border-box", padding: "30px 40px", display: "flex", alignItems: "center", gap: 30 }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10, flex: 1 }}>
              <div style={{ fontFamily: theme.fonts.display, fontWeight: 700, fontSize: 42, color: C.green, textAlign: "center", lineHeight: 1.1 }}>Bina ads ke orders</div>
              <div style={{ width: "100%", height: 8, borderRadius: 4, background: C.navy, transform: `scaleX(${interpolate(frame, [total - 6, total + 6], [0, 1], clamp)})` }} />
              <div style={{ fontFamily: theme.fonts.display, fontWeight: 700, fontSize: 42, color: C.navy, opacity: interpolate(frame, [total - 2, total + 6], [0, 1], clamp) }}>Total orders</div>
            </div>
            <div style={{ fontFamily: theme.fonts.display, fontWeight: 700, fontSize: 56, color: C.muted }}>=</div>
            <div
              style={{
                fontFamily: theme.fonts.display,
                fontWeight: 700,
                fontSize: 120,
                lineHeight: 1,
                color: C.violet,
                opacity: frame < pct ? 0.25 : interpolate(res, [0, 0.3], [0.25, 1], clamp),
                transform: `scale(${frame < pct ? 1 : interpolate(res, [0, 1], [1.5, 1])})`,
              }}
            >
              <span style={{ opacity: frame >= pct ? blink : 1 }}>__</span>%
            </div>
          </Card>
        </Enter>
        <Enter delay={pct + 4} cfg="snappy" from="none" scaleFrom={0.6} style={{ position: "absolute", left: 0, right: 0, top: 930, display: "flex", justifyContent: "center" }}>
          <Chip size={26} bg={C.lavenderSoft} color={C.violetDeep}>
            EXAMPLE · BRAND A: 30 ÷ 300 = 10%
          </Chip>
        </Enter>
        {/* monthly growth */}
        <Enter delay={badh - 6} style={{ position: "absolute", left: theme.layout.padX, top: 1000 }}>
          <Card style={{ width: 912, height: 240, boxSizing: "border-box", padding: "22px 36px", display: "flex", alignItems: "flex-end", gap: 22, position: "relative" }}>
            <div style={{ position: "absolute", left: 36, top: 22, fontFamily: theme.fonts.display, fontWeight: 700, fontSize: 34, color: C.navy }}>Goal: har mahine ↑</div>
            <div style={{ flex: 1 }} />
            {MONTHS.map((v, i) => {
              const p = spring({ frame: frame - badh - i * 4, fps, config: theme.spring.bouncy });
              return (
                <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
                  <div style={{ fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 22, color: C.green, opacity: p }}>{v}%</div>
                  <div style={{ width: 70, height: Math.max(4, v * 4.6 * p), borderRadius: 10, background: `linear-gradient(180deg, #2BC46A, ${C.green})` }} />
                </div>
              );
            })}
            <svg width={912} height={240} style={{ position: "absolute", left: 0, top: 0, pointerEvents: "none" }}>
              <path d="M300 200 L820 60" stroke={C.green} strokeWidth="6" strokeLinecap="round" strokeDasharray="560" strokeDashoffset={560 * (1 - line)} opacity={0.5} />
            </svg>
          </Card>
        </Enter>
      </Camera>
      <Sfx at={num - 10} name="whoosh" vol={0.4} />
      <Sfx at={bina - 8} name="swish" vol={0.4} />
      <Sfx at={pct - 3} name="stamp" vol={0.5} />
      {MONTHS.map((_, i) => (
        <Sfx key={i} at={badh + i * 4} name="tick" vol={0.3} />
      ))}
      <Sfx at={badh + 26} name="ding" vol={0.35} />
    </SceneShell>
  );
};
