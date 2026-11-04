import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { Camera } from "../../../components/fx";
import { Card, Chip, Enter, Headline, SceneShell, Sfx, useRamp, useSpring } from "../../../components/kit";
import { CommentBox, DmCard, FollowButton, Stamp } from "../../../components/widgets";
import { C, theme } from "../../../theme";
import { cue } from "../timeline";

export const S7Cta: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const brand = cue("s7", "brand");
  const ten = cue("s7", "10");
  const kal = cue("s7", "kal");
  const budget = cue("s7", "budget");
  const follow = cue("s7", "follow");
  const outA = useRamp(kal - 6, kal + 2, "in");
  const btn = useSpring(kal + 6, "bouncy");

  return (
    <SceneShell dur={dur} noExit>
      <Camera dur={dur} punches={[budget]} push={0.02}>
        {frame < kal + 4 && (
          <div style={{ position: "absolute", inset: 0, opacity: 1 - outA, transform: `translateY(${-60 * outA}px)` }}>
            <div style={{ position: "absolute", left: 0, right: 0, top: 320, display: "flex", justifyContent: "center" }}>
              <Enter delay={0} cfg="snappy">
                <Chip size={34} style={{ background: theme.grad.violet }}>
                  FREE · 10 TAREEKE
                </Chip>
              </Enter>
            </div>
            <Enter delay={1} style={{ position: "absolute", left: theme.layout.padX, top: 430 }}>
              <CommentBox word="BRAND" typeStart={brand - 8} />
            </Enter>
            <Enter delay={ten - 6} from="right" dist={120} style={{ position: "absolute", left: theme.layout.padX, top: 640 }}>
              <DmCard title="Bina Ads Orders: 10 Tareeke" />
            </Enter>
          </div>
        )}
        {frame >= kal - 2 && (
          <>
            <div style={{ position: "absolute", left: theme.layout.padX, right: theme.layout.padX, top: 320, display: "flex", flexDirection: "column", alignItems: "center", gap: 22 }}>
              <Enter delay={kal} cfg="snappy">
                <Chip size={34} bg={C.navy}>
                  KAL KA CASE
                </Chip>
              </Enter>
              <Headline text="Ad budget double karne se pehle" delay={kal + 4} size={88} hl={["double"]} />
            </div>
            <Enter delay={kal + 4} style={{ position: "absolute", left: theme.layout.padX, top: 640 }}>
              <Card style={{ width: 912, height: 380, position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <div
                  style={{
                    transform: `scale(${interpolate(btn, [0, 1], [0.6, 1])})`,
                    opacity: btn,
                    background: theme.grad.violet,
                    color: C.white,
                    fontFamily: theme.fonts.display,
                    fontWeight: 700,
                    fontSize: 96,
                    padding: "34px 70px 22px",
                    borderRadius: 40,
                    boxShadow: `0 30px 70px -24px ${C.glow}, inset 0 -10px 0 rgba(0,0,0,0.18)`,
                  }}
                >
                  BUDGET 2x
                </div>
                <div style={{ position: "absolute", right: 30, top: -46 }}>
                  <Stamp at={budget} text="RUKO" size={84} rotate={-10} />
                </div>
              </Card>
            </Enter>
          </>
        )}
        {frame >= follow - 10 && (
          <div style={{ position: "absolute", left: 0, right: 0, top: 1080 }}>
            <FollowButton at={follow} />
          </div>
        )}
      </Camera>
      <Sfx at={brand - 8} name="whoosh" vol={0.35} />
      {Array.from({ length: 5 }).map((_, i) => (
        <Sfx key={i} at={brand - 8 + i * 2} name="key" vol={0.35} />
      ))}
      <Sfx at={ten - 6} name="pop" vol={0.5} />
      <Sfx at={budget - 2} name="stamp" vol={0.7} />
      <Sfx at={follow + 12} name="pop" vol={0.6} />
      <Sfx at={follow + 15} name="ding" vol={0.45} />
    </SceneShell>
  );
};
