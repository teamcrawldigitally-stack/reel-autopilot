import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame } from "remotion";
import { Swipes } from "../../components/fx";
import { C } from "../../theme";
import { BlueprintBg, BpTopBar } from "./blueprint";
import { S1Hook, S2AdSale, S3Break, S4Overflow, S5Meter, S6Fixes, S7Cta } from "./scenes";
import script from "./script.json";
import { sceneById, sceneFrames } from "./timeline";

const MAP: Record<string, React.FC<{ dur: number }>> = { s1: S1Hook, s2: S2AdSale, s3: S3Break, s4: S4Overflow, s5: S5Meter, s6: S6Fixes, s7: S7Cta };

const NOISE = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='220' height='220'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/%3E%3C/filter%3E%3Crect width='220' height='220' filter='url(%23n)' opacity='0.5'/%3E%3C/svg%3E")`;

/** Dark-sheet finish: violet soft-light grade, overlay grain, deep vignette. */
export const DarkFinish: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <>
      <AbsoluteFill style={{ pointerEvents: "none", backgroundColor: C.violet, mixBlendMode: "soft-light", opacity: 0.12 }} />
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
      <AbsoluteFill style={{ pointerEvents: "none", background: "radial-gradient(ellipse at center, transparent 55%, rgba(5,0,25,0.5) 100%)" }} />
    </>
  );
};

export const Case15Reel: React.FC = () => {
  const cuts = script.scenes.slice(1).map((s) => sceneFrames(s.id).from);
  return (
    <AbsoluteFill style={{ background: C.navy }}>
      <BlueprintBg />
      {script.scenes.map((s) => {
        const { from, dur } = sceneFrames(s.id);
        const Comp = MAP[s.id];
        const t = sceneById(s.id);
        return (
          <Sequence key={s.id} from={from} durationInFrames={dur} name={s.id}>
            <Comp dur={dur} />
            {t.audio && <Audio src={staticFile(t.audio)} />}
          </Sequence>
        );
      })}
      <Swipes at={cuts} />
      <BpTopBar tag={script.tag} />
      <DarkFinish />
    </AbsoluteFill>
  );
};
