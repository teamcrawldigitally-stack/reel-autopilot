import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { Camera } from "../../../components/fx";
import { Card, Chip, Enter, Headline, SceneShell, Sfx, clamp, useSpring } from "../../../components/kit";
import { C, theme } from "../../../theme";
import { cue } from "../timeline";

const Arrow: React.FC<{ size: number; color: string; style?: React.CSSProperties }> = ({ size, color, style }) => (
  <svg width={size} height={size * 1.2} viewBox="0 0 100 120" style={style}>
    <path d="M50 4 L94 52 H66 V116 H34 V52 H6 Z" fill={color} />
  </svg>
);

export const S4Why: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const sale = cue("s4", "sale");
  const meh = cue("s4", "mehenge");
  const profit = cue("s4", "profit");
  const girta = cue("s4", "girta");
  const jiska = cue("s4", "jiska");
  const up = useSpring(meh - 2, "bouncy");
  const bob = Math.sin(frame / 6) * 8 * up;
  const cost = interpolate(frame, [meh - 2, meh + 26], [0, 1], { ...clamp, easing: theme.ease.out });
  const hit = interpolate(frame, [profit - 2, girta + 10], [0, 1], { ...clamp, easing: theme.ease.inOut });
  const rows = [
    { name: "Brand A", sub: "90% orders ads se", from: 1, to: 0.18, color: C.red },
    { name: "Brand B", sub: "60% orders ads se", from: 1, to: 0.7, color: C.violet },
  ];
  return (
    <SceneShell dur={dur} noExit>
      <Camera dur={dur} punches={[meh, profit]}>
        <div style={{ position: "absolute", left: theme.layout.padX, right: theme.layout.padX, top: 300, display: "flex", flexDirection: "column", alignItems: "center", gap: 22 }}>
          <Enter delay={sale - 4} cfg="snappy">
            <Chip size={34} bg={C.red}>
              SALE SEASON
            </Chip>
          </Enter>
          <div style={{ display: "flex", alignItems: "center", gap: 26 }}>
            <Headline text="Ad ka kharcha" delay={sale} size={104} />
            <div style={{ opacity: up, transform: `translateY(${-bob}px) scale(${interpolate(up, [0, 1], [0.4, 1])})` }}>
              <Arrow size={92} color={C.red} />
            </div>
          </div>
        </div>
        {/* cost meter */}
        <Enter delay={meh - 6} style={{ position: "absolute", left: theme.layout.padX, top: 560 }}>
          <Card style={{ width: 912, height: 150, boxSizing: "border-box", padding: "0 36px", display: "flex", alignItems: "center", gap: 26 }}>
            <div style={{ fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 30, color: C.muted, width: 240, lineHeight: 1.15 }}>
              Har order ka
              <br />
              ad kharcha
            </div>
            <div style={{ flex: 1, height: 44, borderRadius: 22, background: "#F1ECFF", overflow: "hidden" }}>
              <div style={{ width: `${30 + 62 * cost}%`, height: "100%", borderRadius: 22, background: `linear-gradient(90deg, #F5B400, ${C.red})` }} />
            </div>
            <Chip size={26} bg={C.redSoft} color={C.red}>
              ↑ MEHENGA
            </Chip>
          </Card>
        </Enter>
        {/* profit bars */}
        <Enter delay={jiska - 4} style={{ position: "absolute", left: theme.layout.padX, top: 750 }}>
          <Card style={{ width: 912, height: 470, boxSizing: "border-box", padding: "30px 36px", display: "flex", flexDirection: "column", gap: 30 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ fontFamily: theme.fonts.display, fontWeight: 700, fontSize: 44, color: C.navy }}>Profit</div>
              <Chip size={22} bg={C.lavenderSoft} color={C.violetDeep}>
                EXAMPLE
              </Chip>
            </div>
            {rows.map((r, i) => {
              const w = interpolate(hit, [0, 1], [r.from, r.to]);
              return (
                <div key={i} style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontFamily: theme.fonts.body, fontWeight: 700, fontSize: 30, color: C.navy }}>
                    <span>{r.name}</span>
                    <span style={{ color: C.muted, fontWeight: 600 }}>{r.sub}</span>
                  </div>
                  <div style={{ height: 70, borderRadius: 18, background: "#F1ECFF", overflow: "hidden", position: "relative" }}>
                    <div style={{ width: `${w * 100}%`, height: "100%", borderRadius: 18, background: hit > 0.3 ? r.color : theme.grad.violet }} />
                    {i === 0 && hit > 0.5 && (
                      <div style={{ position: "absolute", right: 20, top: 14, fontFamily: theme.fonts.display, fontWeight: 700, fontSize: 36, color: C.red, opacity: interpolate(hit, [0.5, 0.8], [0, 1], clamp) }}>
                        sabse pehle gira
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </Card>
        </Enter>
      </Camera>
      <Sfx at={sale - 6} name="whoosh" vol={0.45} />
      <Sfx at={meh - 3} name="riser" vol={0.35} />
      <Sfx at={jiska - 6} name="swish" vol={0.4} />
      <Sfx at={profit + 2} name="error" vol={0.4} />
      <Sfx at={girta} name="bass" vol={0.6} />
    </SceneShell>
  );
};
