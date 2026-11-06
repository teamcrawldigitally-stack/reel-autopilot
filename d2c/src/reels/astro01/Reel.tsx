import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile } from "remotion";
import { AB, AstroSwipes, Finish, SheetBg, TopBar } from "../../components/astroHisaab";
import { S1Hook, S2Salary, S3Break, S4Gone, S5Year, S6Rule, S7Fixes, S8Cta } from "./scenes";
import script from "./script.json";
import { sceneById, sceneFrames } from "./timeline";

const MAP: Record<string, React.FC<{ dur: number }>> = { s1: S1Hook, s2: S2Salary, s3: S3Break, s4: S4Gone, s5: S5Year, s6: S6Rule, s7: S7Fixes, s8: S8Cta };

export const Astro01Reel: React.FC = () => {
  const cuts = script.scenes.slice(1).map((s) => sceneFrames(s.id).from);
  return (
    <AbsoluteFill style={{ background: AB.ink }}>
      <SheetBg sheet="धन हिसाब #1" />
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
      <AstroSwipes at={cuts} />
      <TopBar tag={script.tag} />
      <Finish />
    </AbsoluteFill>
  );
};
