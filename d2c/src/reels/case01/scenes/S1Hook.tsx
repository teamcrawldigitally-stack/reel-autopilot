import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { Camera } from "../../../components/fx";
import { Card, Chip, SceneShell, Sfx, clamp, useSpring } from "../../../components/kit";
import { Stamp, Toggle } from "../../../components/widgets";
import { C, theme } from "../../../theme";
import { cue } from "../timeline";

const BARS = [38, 52, 46, 64, 58, 72, 66, 80, 74, 88, 82, 94];

export const S1Hook: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const band = cue("s1", "band");
  const zero = cue("s1", "zero?");
  const brand = cue("s1", "brand");
  const adacc = cue("s1", "ad account");
  const off = band + 2;

  const count = frame < off ? 42 : Math.round(interpolate(frame, [off, off + 20], [42, 0], { ...clamp, easing: theme.ease.out }));
  const verdict = useSpring(brand - 4, "smooth");
  const strike = interpolate(frame, [brand + 8, brand + 18], [0, 1], { ...clamp, easing: theme.ease.out });
  const pill = useSpring(adacc - 2, "slam");
  const shakeT = frame - zero;
  const shake = shakeT >= 0 && shakeT < 14 ? Math.sin(shakeT * 2.7) * 14 * Math.exp(-shakeT / 4) : 0;

  return (
    <SceneShell dur={dur} noExit>
      <Camera dur={dur} punches={[off, zero]}>
        <div style={{ position: "absolute", inset: 0, transform: `translate(${shake}px, ${shake * 0.4}px)` }}>
          {/* switch */}
          <div style={{ position: "absolute", left: 0, right: 0, top: 330, display: "flex", justifyContent: "center" }}>
            <Toggle offAt={off} w={330} label="ADS" />
          </div>

          {/* orders chart */}
          <div style={{ position: "absolute", left: theme.layout.padX, top: 620 }}>
            <Card style={{ width: 912, height: 600, boxSizing: "border-box", padding: "34px 40px", position: "relative", overflow: "hidden" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div>
                  <div style={{ fontFamily: theme.fonts.body, fontWeight: 700, fontSize: 30, color: C.muted, letterSpacing: "0.06em" }}>AAJ KE ORDERS</div>
                  <div
                    style={{
                      fontFamily: theme.fonts.display,
                      fontWeight: 700,
                      fontSize: 150,
                      lineHeight: 1,
                      color: frame < off ? C.navy : C.red,
                      fontVariantNumeric: "tabular-nums",
                      marginTop: 10,
                    }}
                  >
                    {count}
                  </div>
                </div>
                <Chip size={24} bg={frame < off ? C.greenSoft : C.redSoft} color={frame < off ? C.green : C.red}>
                  {frame < off ? "● LIVE" : "● ADS OFF"}
                </Chip>
              </div>
              <div style={{ position: "absolute", left: 40, right: 40, bottom: 40, height: 270, display: "flex", alignItems: "flex-end", gap: 18 }}>
                {BARS.map((h, i) => {
                  const grow = spring({ frame: frame + 12 - i * 1.5, fps, config: theme.spring.smooth });
                  const fall = spring({ frame: frame - off - 3 - i * 1.6, fps, config: theme.spring.snappy });
                  const breathe = 1 + Math.sin((frame + i * 9) / 10) * 0.04;
                  const hh = Math.max(6, (h / 100) * 260 * grow * breathe * (1 - 0.97 * fall));
                  return (
                    <div
                      key={i}
                      style={{
                        flex: 1,
                        height: hh,
                        borderRadius: 10,
                        background: fall > 0.5 ? C.red : theme.grad.violet,
                        opacity: fall > 0.5 ? 0.85 : 1,
                      }}
                    />
                  );
                })}
              </div>
              {/* verdict overlay */}
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background: C.white,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 18,
                  transform: `translateY(${interpolate(verdict, [0, 1], [620, 0])}px)`,
                }}
              >
                <div style={{ fontFamily: theme.fonts.body, fontWeight: 700, fontSize: 40, color: C.muted }}>Aapke paas</div>
                <div style={{ position: "relative", fontFamily: theme.fonts.display, fontWeight: 700, fontSize: 150, lineHeight: 1, color: C.navy, letterSpacing: "-0.02em" }}>
                  BRAND
                  <div style={{ position: "absolute", left: -14, top: "48%", height: 16, width: `${strike * 108}%`, background: C.red, borderRadius: 8, transform: "rotate(-4deg)" }} />
                </div>
                <div style={{ fontFamily: theme.fonts.body, fontWeight: 700, fontSize: 40, color: C.muted, opacity: pill }}>nahi,</div>
                <div
                  style={{
                    opacity: interpolate(pill, [0, 0.3], [0, 1], clamp),
                    transform: `scale(${interpolate(pill, [0, 1], [1.8, 1])}) rotate(-2deg)`,
                    background: theme.grad.violet,
                    color: C.white,
                    fontFamily: theme.fonts.display,
                    fontWeight: 700,
                    fontSize: 84,
                    padding: "18px 40px 8px",
                    borderRadius: 26,
                    boxShadow: `0 24px 60px -20px ${C.glow}`,
                  }}
                >
                  AD ACCOUNT
                </div>
              </div>
            </Card>
          </div>

          {/* ZERO stamp */}
          {frame < brand && (
            <div style={{ position: "absolute", left: 0, right: 0, top: 820, display: "flex", justifyContent: "center" }}>
              <Stamp at={zero - 1} text="ZERO" size={170} />
            </div>
          )}
        </div>
      </Camera>
      <Sfx at={0} name="bass" vol={0.6} />
      <Sfx at={off - 1} name="key" vol={0.9} />
      <Sfx at={off + 2} name="error" vol={0.5} />
      <Sfx at={zero - 2} name="stamp" vol={0.9} />
      <Sfx at={brand - 6} name="whoosh" vol={0.5} />
      <Sfx at={adacc - 2} name="pop" vol={0.6} />
    </SceneShell>
  );
};
