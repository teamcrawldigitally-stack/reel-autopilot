import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile } from "remotion";
import { Particles, Swipes } from "../../components/fx";
import { Bg, Grade, Grain, Vignette } from "../../components/kit";
import { Captions, TopBar } from "../../components/overlay";
import { C } from "../../theme";
import { S1Hook } from "./scenes/S1Hook";
import { S2Loop } from "./scenes/S2Loop";
import { S3Dots } from "./scenes/S3Dots";
import { S4Why } from "./scenes/S4Why";
import { S5Fix } from "./scenes/S5Fix";
import { S6Check } from "./scenes/S6Check";
import { S7Cta } from "./scenes/S7Cta";
import script from "./script.json";
import { sceneById, sceneFrames, scenes } from "./timeline";

const MAP: Record<string, React.FC<{ dur: number }>> = {
  s1: S1Hook,
  s2: S2Loop,
  s3: S3Dots,
  s4: S4Why,
  s5: S5Fix,
  s6: S6Check,
  s7: S7Cta,
};

export const Case01Reel: React.FC = () => {
  const cuts = script.scenes.slice(1).map((s) => sceneFrames(s.id).from);
  return (
    <AbsoluteFill style={{ background: C.paper }}>
      <Bg />
      <Particles seed="case01" />
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
      <Captions scenes={scenes} karaoke />
      <Swipes at={cuts} />
      <TopBar tag={script.tag} />
      <Grade />
      <Grain />
      <Vignette />
    </AbsoluteFill>
  );
};
