import React from "react";
import { AbsoluteFill, Audio, Sequence, interpolate, staticFile } from "remotion";
import audioCfg from "./audio.json";
import { Bg, Grade, Grain, Vignette } from "../../components/kit";
import { Captions, TopBar } from "../../components/overlay";
import { S1Hook } from "./scenes/S1Hook";
import { S2Loop } from "./scenes/S2Loop";
import { S3Speed } from "./scenes/S3Speed";
import { S4Score } from "./scenes/S4Score";
import { S5Paisa } from "./scenes/S5Paisa";
import { S6Math } from "./scenes/S6Math";
import { S7Fix } from "./scenes/S7Fix";
import { S8Cta } from "./scenes/S8Cta";
import script from "./script.json";
import { FPS, sceneById, sceneFrames, scenes, totalFrames } from "./timeline";

const MAP: Record<string, React.FC<{ dur: number }>> = {
  s1: S1Hook,
  s2: S2Loop,
  s3: S3Speed,
  s4: S4Score,
  s5: S5Paisa,
  s6: S6Math,
  s7: S7Fix,
  s8: S8Cta,
};

const Music: React.FC = () => {
  if (!audioCfg.music) return null;
  const fadeOut = Math.round(1.2 * FPS);
  return (
    <Audio
      src={staticFile(audioCfg.music)}
      startFrom={Math.round((audioCfg.musicStart ?? 0) * FPS)}
      loop={audioCfg.musicLoop ?? false}
      volume={(f) =>
        audioCfg.musicVol *
        interpolate(f, [0, 12], [0.4, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) *
        interpolate(f, [totalFrames - fadeOut, totalFrames], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })
      }
    />
  );
};

export const News01Reel: React.FC = () => (
  <AbsoluteFill style={{ background: "#FBFAFF" }}>
    <Bg />
    {script.scenes.map((s) => {
      const { from, dur } = sceneFrames(s.id);
      const Comp = MAP[s.id];
      const t = sceneById(s.id);
      return (
        <Sequence key={s.id} from={from} durationInFrames={dur} name={s.id}>
          <Comp dur={dur} />
          {t.audio && <Audio src={staticFile(t.audio)} volume={audioCfg.voiceVol} />}
        </Sequence>
      );
    })}
    <TopBar tag={script.tag} />
    <Captions scenes={scenes} />
    <Grade />
    <Grain />
    <Vignette />
    <Music />
  </AbsoluteFill>
);
