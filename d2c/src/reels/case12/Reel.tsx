import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile } from "remotion";
import { Swipes } from "../../components/fx";
import { Grade, Grain, Vignette } from "../../components/kit";
import { Captions, TopBar } from "../../components/overlay";
import { C } from "../../theme";
import { S1Hook, S2Market, S3Website, S4Twist, S5Fixes, S6Cta } from "./scenes";
import script from "./script.json";
import { sceneById, sceneFrames, scenes } from "./timeline";

const MAP: Record<string, React.FC<{ dur: number }>> = { s1: S1Hook, s2: S2Market, s3: S3Website, s4: S4Twist, s5: S5Fixes, s6: S6Cta };

export const Case12Reel: React.FC = () => {
  const cuts = script.scenes.slice(1).map((s) => sceneFrames(s.id).from);
  return (
    <AbsoluteFill style={{ background: C.paper }}>
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
      <Captions scenes={scenes} karaoke top={1440} />
      <Swipes at={cuts} />
      <TopBar tag={script.tag} />
      <Grade />
      <Grain />
      <Vignette />
    </AbsoluteFill>
  );
};
