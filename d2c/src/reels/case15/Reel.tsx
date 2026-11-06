import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile } from "remotion";
import { Swipes } from "../../components/fx";
import { C } from "../../theme";
import { BlueprintBg, BpTopBar, DarkFinish } from "../../components/hisaab";
import { S1Hook, S2AdSale, S3Break, S4Overflow, S5Meter, S6Fixes, S7Cta } from "./scenes";
import script from "./script.json";
import { sceneById, sceneFrames } from "./timeline";

const MAP: Record<string, React.FC<{ dur: number }>> = { s1: S1Hook, s2: S2AdSale, s3: S3Break, s4: S4Overflow, s5: S5Meter, s6: S6Fixes, s7: S7Cta };


export const Case15Reel: React.FC = () => {
  const cuts = script.scenes.slice(1).map((s) => sceneFrames(s.id).from);
  return (
    <AbsoluteFill style={{ background: C.navy }}>
      <BlueprintBg sheet="#15" />
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
