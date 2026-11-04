import React from "react";
import { Composition, type CalculateMetadataFunction } from "remotion";
import { AstroReel, type AstroReelProps } from "./astro/AstroReel";
import { PaperReel, type PaperReelProps } from "./paper/PaperReel";
import paperSample from "./paper-sample-props.json";
import { ToonReel, type ToonReelProps } from "./toon/ToonReel";
import toonSample from "./toon-sample-props.json";
import { DevoReel, type DevoReelProps } from "./devo/DevoReel";
import devoSample from "./devo-sample-props.json";
import { Reel } from "./Reel";
import astroSample from "./astro-sample-props.json";
import sample from "./sample-props.json";
import type { ReelProps } from "./types";

const FPS = 30;
const TAIL_MS = 900; // breathing room after the last word

const calculateMetadata: CalculateMetadataFunction<ReelProps> = ({ props }) => ({
  durationInFrames: Math.max(FPS * 3, Math.ceil(((props.durationMs + TAIL_MS) / 1000) * FPS)),
  defaultOutName: "reel",
});

const astroMetadata: CalculateMetadataFunction<AstroReelProps> = ({ props }) => ({
  durationInFrames: Math.max(FPS * 3, Math.ceil(((props.durationMs + TAIL_MS) / 1000) * FPS)),
  defaultOutName: "astro-reel",
});

const paperMetadata: CalculateMetadataFunction<PaperReelProps> = ({ props }) => ({
  durationInFrames: Math.max(FPS * 3, Math.ceil(((props.durationMs + TAIL_MS) / 1000) * FPS)),
  defaultOutName: "paper-reel",
});

const toonMetadata: CalculateMetadataFunction<ToonReelProps> = ({ props }) => ({
  durationInFrames: Math.max(FPS * 3, Math.ceil(((props.durationMs + TAIL_MS) / 1000) * FPS)),
  defaultOutName: "toon-reel",
});

const devoMetadata: CalculateMetadataFunction<DevoReelProps> = ({ props }) => ({
  durationInFrames: Math.max(FPS * 3, Math.ceil(((props.durationMs + TAIL_MS) / 1000) * FPS)),
  defaultOutName: "devo-reel",
});

export const RemotionRoot: React.FC = () => (
  <>
    <Composition
      id="Reel"
      component={Reel}
      width={1080}
      height={1920}
      fps={FPS}
      durationInFrames={FPS * 30}
      defaultProps={sample as ReelProps}
      calculateMetadata={calculateMetadata}
    />
    <Composition
      id="AstroReel"
      component={AstroReel}
      width={1080}
      height={1920}
      fps={FPS}
      durationInFrames={FPS * 60}
      defaultProps={astroSample as unknown as AstroReelProps}
      calculateMetadata={astroMetadata}
    />
    <Composition
      id="PaperReel"
      component={PaperReel}
      width={1080}
      height={1920}
      fps={FPS}
      durationInFrames={FPS * 60}
      defaultProps={paperSample as unknown as PaperReelProps}
      calculateMetadata={paperMetadata}
    />
    <Composition
      id="ToonReel"
      component={ToonReel}
      width={1080}
      height={1920}
      fps={FPS}
      durationInFrames={FPS * 60}
      defaultProps={toonSample as unknown as ToonReelProps}
      calculateMetadata={toonMetadata}
    />
    <Composition
      id="DevoReel"
      component={DevoReel}
      width={1080}
      height={1920}
      fps={FPS}
      durationInFrames={FPS * 60}
      defaultProps={devoSample as unknown as DevoReelProps}
      calculateMetadata={devoMetadata}
    />
  </>
);
