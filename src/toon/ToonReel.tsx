// Astro 24x7 2D character reel: an original narrator explains the idea with flat-vector
// graphics. Mouth follows the voice; brand colours, captions and progress bar as in Reel 1.
import React from "react";
import { Audio } from "@remotion/media";
import { AbsoluteFill, interpolate, Sequence, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import "../astro/fonts";
import { AstroCaptions } from "../astro/AstroCaptions";
import { BrandBar, CutFlash, Sfx } from "../astro/AstroReel";
import { AstroBg, AstroFinish, findWordFrame, W } from "../astro/parts";
import { astro } from "../astro/theme";
import { BudhScene, ElongationScene, EgoScene, ListenScene, PointUpScene, TalkScene, ToonCta, ToonScene, TP } from "./scenes";

const C = astro.colors;
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

export type ToonReelProps = {
  audio: string | null;
  music: string | null;
  musicVolume: number;
  sfx: boolean;
  captions: boolean;
  scenes: ToonScene[];
  words: W[];
  durationMs: number;
  mouth: number[];
};

const SceneSwitch: React.FC<TP> = (p) => {
  switch (p.scene.visual) {
    case "talk":
      return <TalkScene {...p} />;
    case "pointUp":
      return <PointUpScene {...p} />;
    case "budh":
      return <BudhScene {...p} />;
    case "elongation":
      return <ElongationScene {...p} />;
    case "ego":
      return <EgoScene {...p} />;
    case "listen":
      return <ListenScene {...p} />;
    default:
      return <ToonCta {...p} />;
  }
};

// Cartoon-style scene change: quick slide in from the side, slight squash, out the other way.
const Slide: React.FC<{ children: React.ReactNode; index: number }> = ({ children, index }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const dir = index % 2 ? -1 : 1;
  const tin = index === 0 ? 1 : interpolate(frame, [0, 9], [0, 1], { ...clamp, easing: astro.ease.out });
  const tout = interpolate(frame, [durationInFrames - 7, durationInFrames - 1], [0, 1], { ...clamp, easing: astro.ease.in });
  const x = (1 - tin) * 900 * dir - tout * 900 * dir;
  const squash = 1 - 0.06 * (1 - tin) - 0.06 * tout;
  return <AbsoluteFill style={{ transform: `translateX(${x}px) scale(${2 - squash}, ${squash})` }}>{children}</AbsoluteFill>;
};

const Floor: React.FC = () => (
  <div style={{ position: "absolute", left: -100, right: -100, top: 1330, height: 700, borderRadius: "50% 50% 0 0", background: `linear-gradient(180deg, ${C.orangeSoft}, ${C.bgDeep})`, borderTop: `6px solid ${C.ink}` }} />
);

export const ToonReel: React.FC<ToonReelProps> = (props) => {
  const { fps, durationInFrames } = useVideoConfig();
  const toFrame = (ms: number) => Math.round((ms / 1000) * fps);
  const starts = props.scenes.map((s, i) => (i === 0 ? 0 : toFrame(s.startMs)));
  const cue = (s: ToonScene, w?: string) => (w ? findWordFrame(props.words, s.startMs, w, -1, fps) : -1);
  const pops: number[] = [];
  const hits: number[] = [];
  props.scenes.forEach((s, i) => {
    [cue(s, s.planetWord), cue(s, s.reasonWord), ...(s.items ?? []).map((x) => cue(s, x.word)), cue(s, s.withWord), cue(s, s.nextWord), cue(s, s.meWord), cue(s, s.baatWord), cue(s, s.astWord), cue(s, s.noWord), cue(s, s.keyword), cue(s, s.teaserWord)]
      .filter((f) => f >= 0)
      .forEach((f) => pops.push(starts[i] + f));
    [cue(s, s.misWord), cue(s, s.nameWord), cue(s, s.statWord), cue(s, s.heavyWord)].filter((f) => f >= 0).forEach((f) => hits.push(starts[i] + f));
  });
  return (
    <AbsoluteFill style={{ backgroundColor: C.bg }}>
      <AstroBg />
      <Floor />
      {props.scenes.map((scene, i) => {
        const from = starts[i];
        const to = starts[i + 1] ?? durationInFrames;
        return (
          <Sequence key={i} from={from} durationInFrames={Math.max(1, to - from)} premountFor={fps}>
            <Slide index={i}>
              <SceneSwitch scene={scene} words={props.words} mouth={props.mouth} start={from} />
            </Slide>
            {i > 0 ? <CutFlash /> : null}
          </Sequence>
        );
      })}
      <BrandBar starts={starts} total={durationInFrames} />
      {props.captions && props.words.length ? <AstroCaptions words={props.words} sceneEnds={props.scenes.map((s) => s.endMs)} /> : null}
      <AstroFinish />

      {props.audio ? <Audio src={staticFile(props.audio)} /> : null}
      {props.music ? (
        <Audio src={staticFile(props.music)} volume={(f) => props.musicVolume * interpolate(f, [0, 6, durationInFrames - 50, durationInFrames - 1], [0.4, 1, 1, 0], clamp)} />
      ) : null}
      {props.sfx ? (
        <>
          <Sfx at={0} src="sfx/pop.wav" volume={0.3} len={0.4} />
          {starts.slice(1).map((f, i) => (
            <Sfx key={`w${i}`} at={f - 5} src="sfx/whoosh.wav" volume={0.24} len={0.6} />
          ))}
          {pops.map((f, i) => (
            <Sfx key={`p${i}`} at={f} src="sfx/pop.wav" volume={0.26} len={0.4} />
          ))}
          {hits.map((f, i) => (
            <Sfx key={`h${i}`} at={f} src="sfx/hit.wav" volume={0.42} />
          ))}
        </>
      ) : null}
    </AbsoluteFill>
  );
};
