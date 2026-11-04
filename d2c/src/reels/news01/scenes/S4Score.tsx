import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { AdTile } from "../../../components/AdTile";
import { ChangeHeader } from "../../../components/ChangeHeader";
import { PersonIcon } from "../../../components/icons";
import { Chip, SceneShell, Sfx, clamp, useFloat, useSpring } from "../../../components/kit";
import { C, theme } from "../../../theme";
import { cue } from "../timeline";

const SCORES = [42, 67, 94, 31, 55, 88, 23, 71];
const TINTS = ["#DFC8FD", "#FFD9C2", "#C9F0DA", "#CFE0FF", "#FFE7A8", "#F7C9DE", "#DFC8FD", "#CFE0FF"];
const BEST = 2;
const TW = 180;
const GAP = 28;
const GX = (1080 - (4 * TW + 3 * GAP)) / 2;
const GY = 800;
const TH = TW * 1.25;

export const S4Score: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const score = cue("s4", "score");
  const har = cue("s4", "har", 2);
  const dhoondh = cue("s4", "dhoondhta");
  const fit = cue("s4", "fit");

  const scanStart = score - 2;
  const scanLen = 34;
  const scanX = interpolate(frame, [scanStart, scanStart + scanLen], [GX - 60, GX + 4 * TW + 3 * GAP + 20], { ...clamp, easing: theme.ease.inOut });
  const scanOn = frame >= scanStart && frame <= scanStart + scanLen + 4;
  const best = spring({ frame: frame - dhoondh, fps, config: theme.spring.smooth });
  const line = interpolate(frame, [dhoondh + 4, dhoondh + 22], [0, 1], { ...clamp, easing: theme.ease.out });
  const match = useSpring(fit - 2, "bouncy");
  const person = useSpring(har - 4, "bouncy");
  const fl = useFloat(3, 4);

  const bx = GX + BEST * (TW + GAP) + TW / 2;
  const by = GY;

  return (
    <SceneShell dur={dur}>
      <ChangeHeader n={2} title="Har ad ka score" hl={["score"]} size={104} />

      {/* person */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 560,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: 20,
          opacity: interpolate(person, [0, 0.4], [0, 1], clamp),
          transform: `scale(${interpolate(person, [0, 1], [0.6, 1])}) translateY(${fl}px)`,
        }}
      >
        <PersonIcon size={120} />
        <div
          style={{
            opacity: interpolate(match, [0, 0.4], [0, 1], clamp),
            transform: `translateX(${interpolate(match, [0, 1], [-30, 0])}px)`,
          }}
        >
          <Chip size={30} bg={C.lavender} color={C.navy} style={{ boxShadow: `0 10px 30px -12px ${C.glow}` }}>
            BEST MATCH · 94
          </Chip>
        </div>
      </div>

      {/* connector line */}
      <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0, zIndex: 3 }}>
        <path
          d={`M${bx} ${by + 10} C ${bx} ${by - 60}, 540 ${700}, 540 ${690}`}
          fill="none"
          stroke={C.violet}
          strokeWidth={6}
          strokeLinecap="round"
          strokeDasharray="300"
          strokeDashoffset={300 * (1 - line)}
        />
      </svg>

      {SCORES.map((s, i) => {
        const col = i % 4;
        const row = Math.floor(i / 4);
        const x = GX + col * (TW + GAP);
        const y = GY + row * (TH + GAP);
        const p = spring({ frame: frame - (score - 14) - i * 2, fps, config: theme.spring.snappy });
        const hitF = scanStart + ((x + TW / 2 - (GX - 60)) / (4 * TW + 3 * GAP + 80)) * scanLen;
        const badge = spring({ frame: frame - hitF, fps, config: theme.spring.bouncy });
        const isBest = i === BEST;
        const dim = isBest ? 0 : best;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x,
              top: y,
              zIndex: isBest ? 2 : 1,
              opacity: interpolate(p, [0, 0.4], [0, 1], clamp),
              transform: `translateY(${interpolate(p, [0, 1], [40, 0])}px) scale(${isBest ? 1 + 0.08 * best : 1})`,
            }}
          >
            <div
              style={{
                borderRadius: TW * 0.09,
                boxShadow: isBest ? `0 0 0 ${6 * best}px rgba(109,74,253,${0.9 * best}), 0 0 ${60 * best}px rgba(109,74,253,${0.5 * best})` : undefined,
              }}
            >
              <AdTile w={TW} tint={TINTS[i]} dim={0.75 * dim} />
            </div>
            <div
              style={{
                position: "absolute",
                right: -14,
                top: -18,
                width: 74,
                height: 74,
                borderRadius: "50%",
                background: isBest && best > 0.5 ? C.violet : C.navy,
                color: C.white,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: theme.fonts.body,
                fontWeight: 800,
                fontSize: 32,
                border: `4px solid ${C.white}`,
                opacity: interpolate(badge, [0, 0.4], [0, 1], clamp) * (1 - 0.5 * dim),
                transform: `scale(${interpolate(badge, [0, 1], [0.3, 1])})`,
              }}
            >
              {s}
            </div>
          </div>
        );
      })}

      {/* scan bar */}
      {scanOn && (
        <div
          style={{
            position: "absolute",
            left: scanX - 30,
            top: GY - 40,
            width: 60,
            height: 2 * TH + GAP + 80,
            borderRadius: 30,
            background: "linear-gradient(90deg, rgba(109,74,253,0) 0%, rgba(109,74,253,0.35) 50%, rgba(109,74,253,0) 100%)",
            zIndex: 4,
          }}
        >
          <div style={{ position: "absolute", left: 28, top: 0, bottom: 0, width: 4, borderRadius: 4, background: C.violet }} />
        </div>
      )}

      <Sfx at={score - 3} name="riser" vol={0.3} />
      {SCORES.map((_, i) => (
        <Sfx key={i} at={Math.round(scanStart + 3 + i * 3.6)} name="tick" vol={0.3} />
      ))}
      <Sfx at={dhoondh - 2} name="whoosh" vol={0.4} />
      <Sfx at={fit - 3} name="ding" vol={0.45} />
    </SceneShell>
  );
};
