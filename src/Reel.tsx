import React from "react";
import { Audio } from "@remotion/media";
import { AbsoluteFill, Sequence, staticFile, useVideoConfig } from "remotion";
import { Captions } from "./components/Captions";
import { BrandBar, SceneShell } from "./components/Chrome";
import { BgMesh, Grade, Grain, Vignette } from "./components/Layers";
import { CtaScene, HookScene, ListScene, PointScene, StatScene } from "./scenes/Scenes";
import { makeTheme, ThemeContext } from "./theme";
import type { ReelProps, Scene } from "./types";

const SceneSwitch: React.FC<{ scene: Scene; pointIndex: number; handle: string }> = ({ scene, pointIndex, handle }) => {
  switch (scene.type) {
    case "hook":
      return <HookScene scene={scene} />;
    case "point":
      return <PointScene scene={scene} index={pointIndex} />;
    case "stat":
      return <StatScene scene={scene} />;
    case "list":
      return <ListScene scene={scene} />;
    case "cta":
      return <CtaScene scene={scene} handle={handle} />;
    default:
      return <PointScene scene={scene} index={pointIndex} />;
  }
};

export const Reel: React.FC<ReelProps> = (props) => {
  const theme = makeTheme(props.brand.colors);
  const { fps, durationInFrames } = useVideoConfig();
  const toFrame = (ms: number) => Math.round((ms / 1000) * fps);

  // Each scene is on screen from its own start until the next scene starts.
  const starts = props.scenes.map((s, i) => (i === 0 ? 0 : toFrame(s.startMs)));
  let points = 0;

  return (
    <ThemeContext.Provider value={theme}>
      <AbsoluteFill style={{ backgroundColor: theme.colors.bg }}>
        <BgMesh />

        {props.scenes.map((scene, i) => {
          const from = starts[i];
          const to = starts[i + 1] ?? durationInFrames;
          if (scene.type === "point") points += 1;
          const pointIndex = points;
          return (
            <Sequence key={i} from={from} durationInFrames={Math.max(1, to - from)} premountFor={fps}>
              <SceneShell>
                <SceneSwitch scene={scene} pointIndex={pointIndex} handle={props.brand.handle} />
              </SceneShell>
            </Sequence>
          );
        })}

        <BrandBar handle={props.brand.handle} sceneStarts={starts} total={durationInFrames} />
        {props.captions && props.words.length ? <Captions words={props.words} scenes={props.scenes} /> : null}

        <Grade />
        <Grain />
        <Vignette />

        {props.audio ? <Audio src={staticFile(props.audio)} /> : null}
        {props.music ? <Audio src={staticFile(props.music)} volume={props.musicVolume} loop /> : null}
        {props.sfx
          ? starts.map((f, i) => (
              <Sequence key={`sfx-${i}`} from={Math.max(0, f - 3)} durationInFrames={Math.round(fps * 0.8)}>
                <Audio src={staticFile(i === 0 ? "sfx/hit.wav" : "sfx/whoosh.wav")} volume={i === 0 ? 0.28 : 0.2} />
              </Sequence>
            ))
          : null}
      </AbsoluteFill>
    </ThemeContext.Provider>
  );
};
