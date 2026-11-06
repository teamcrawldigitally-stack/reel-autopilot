import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile } from "remotion";
import { Finish, SeriesBar, SheetBg, Swipes } from "../../components/sheet";
import { G } from "../../theme";
import { S1Hook, S2Source, S3Start, S4Anger, S5Fall, S6Catch, S7Cta } from "./scenes";
import script from "./script.json";
import { sceneById, sceneFrames } from "./timeline";

const MAP: Record<string, React.FC<{ dur: number }>> = { s1: S1Hook, s2: S2Source, s3: S3Start, s4: S4Anger, s5: S5Fall, s6: S6Catch, s7: S7Cta };
// no swipe between the step scenes (s3 → s4 → s5): the staircase stays in place
const NO_SWIPE = new Set(["s4", "s5"]);

export const Ep03Reel: React.FC = () => {
  const cuts = script.scenes.slice(1).filter((s) => !NO_SWIPE.has(s.id)).map((s) => sceneFrames(s.id).from);
  return (
    <AbsoluteFill style={{ background: G.ink }}>
      <SheetBg tag="GITA SHLOK SERIES · EP 03 · BHAGAVAD GITA 2.62–63" />
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
      <SeriesBar ep={script.tag} />
      <Finish />
    </AbsoluteFill>
  );
};
