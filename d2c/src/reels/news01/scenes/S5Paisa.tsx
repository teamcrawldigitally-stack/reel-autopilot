import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { ChangeHeader } from "../../../components/ChangeHeader";
import { CheckIcon, CrossIcon, LockIcon } from "../../../components/icons";
import { Card, Chip, Enter, SceneShell, Sfx, clamp, useSpring } from "../../../components/kit";
import { C, theme } from "../../../theme";
import { cue } from "../timeline";

export const S5Paisa: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const conv = cue("s5", "conversions");
  const meta = cue("s5", "meta");
  const yr = cue("s5", "2025");
  const chip = useSpring(yr - 2, "bouncy");
  const num = cue("s5", "+2.4%");
  const started = frame >= num;
  const fayda = cue("s5", "fayda");
  const nayi = cue("s5", "nayi");
  const unlock = useSpring(8, "bouncy");
  const count = interpolate(frame, [num, num + 26], [0, 2.4], { ...clamp, easing: theme.ease.out });
  const ck = interpolate(frame, [fayda + 4, fayda + 20], [0, 1], clamp);
  const cr = interpolate(frame, [nayi + 4, nayi + 20], [0, 1], clamp);
  const strike = interpolate(frame, [nayi + 10, nayi + 24], [0, 1], { ...clamp, easing: theme.ease.out });

  return (
    <SceneShell dur={dur}>
      <ChangeHeader
        n={3}
        title="Aapke paise wali"
        hl={["paise"]}
        size={86}
        icon={<LockIcon size={78} open={unlock} />}
      />

      <Enter delay={meta - 2} style={{ position: "absolute", left: theme.layout.padX, top: 590 }}>
        <Card style={{ width: 912, height: 420, boxSizing: "border-box", padding: "34px 36px", display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
          <div style={{ opacity: interpolate(chip, [0, 0.4], [0, 1], clamp), transform: `scale(${interpolate(chip, [0, 1], [0.5, 1])})` }}>
            <Chip size={26} bg={C.lavenderSoft} color={C.violetDeep}>
              2025 SE · FACEBOOK
            </Chip>
          </div>
          <div
            style={{
              fontFamily: theme.fonts.display,
              fontWeight: 700,
              fontSize: 190,
              lineHeight: 1.05,
              letterSpacing: "-0.03em",
              color: started ? C.green : C.lavender,
              fontVariantNumeric: "tabular-nums",
              marginTop: 8,
            }}
          >
            {started ? `+${count.toFixed(1)}%` : "+?%"}
          </div>
          <div style={{ fontFamily: theme.fonts.display, fontWeight: 700, fontSize: 48, color: C.navy, marginTop: -8 }}>conversions</div>
          <div style={{ fontFamily: theme.fonts.body, fontWeight: 600, fontSize: 24, color: C.muted, marginTop: "auto" }}>Source: Meta ka apna number (Engineering at Meta)</div>
        </Card>
      </Enter>

      <Enter delay={fayda} from="left" style={{ position: "absolute", left: theme.layout.padX, top: 1040 }}>
        <Card style={{ width: 912, height: 96, boxSizing: "border-box", padding: "0 30px", display: "flex", alignItems: "center", gap: 24 }}>
          <CheckIcon size={58} draw={ck} />
          <div style={{ fontFamily: theme.fonts.display, fontWeight: 700, fontSize: 46, color: C.navy }}>Fayda apne aap</div>
        </Card>
      </Enter>
      <Enter delay={nayi} from="left" style={{ position: "absolute", left: theme.layout.padX, top: 1152 }}>
        <Card style={{ width: 912, height: 96, boxSizing: "border-box", padding: "0 30px", display: "flex", alignItems: "center", gap: 24 }}>
          <CrossIcon size={58} draw={cr} />
          <div style={{ fontFamily: theme.fonts.display, fontWeight: 700, fontSize: 46, color: C.navy }}>Nayi setting</div>
          <div
            style={{
              marginLeft: "auto",
              fontFamily: theme.fonts.body,
              fontWeight: 700,
              fontSize: 30,
              color: C.red,
              opacity: strike,
              transform: `translateX(${(1 - strike) * 20}px)`,
            }}
          >
            zaroori nahi
          </div>
        </Card>
      </Enter>

      <Sfx at={meta - 4} name="whoosh" vol={0.4} />
      <Sfx at={yr - 3} name="pop" vol={0.4} />
      {Array.from({ length: 6 }).map((_, i) => (
        <Sfx key={i} at={num + i * 3} name="tick" vol={0.35} />
      ))}
      <Sfx at={num + 22} name="ding" vol={0.4} />
      <Sfx at={fayda + 4} name="check" vol={0.5} />
      <Sfx at={nayi + 4} name="error" vol={0.35} />
    </SceneShell>
  );
};
