import React from "react";
import { Composition, staticFile } from "remotion";
import { loadFont } from "@remotion/fonts";
import { Ep03Reel } from "./reels/ep03/Reel";
import { Ep03Cover } from "./reels/ep03/Cover";
import { totalFrames as ep03Frames } from "./reels/ep03/timeline";
import { EPISODES } from "./episodes";
import { EpisodeCover, EpisodeReel } from "./engine/Episode";
import { STORY01_FRAMES, Story01, Story01Cover } from "./story/Story01";
import { STORY01V_FRAMES, Story01V } from "./story/Story01V";

const fonts: [string, string, string][] = [
  ["Poppins", "Poppins-Regular.ttf", "400"],
  ["Poppins", "Poppins-Medium.ttf", "500"],
  ["Poppins", "Poppins-Bold.ttf", "700"],
  ["Inter", "Inter-Medium.otf", "500"],
  ["Inter", "Inter-Bold.otf", "700"],
  ["Inter", "Inter-ExtraBold.otf", "800"],
  ["Mukta", "Mukta-Deva-500.woff2", "500"],
  ["Mukta", "Mukta-Deva-700.woff2", "700"],
  ["Mukta", "Mukta-Deva-800.woff2", "800"],
  ["TiroSanskrit", "Tiro-Sanskrit-Deva.woff2", "400"],
  ["Anton", "Anton.woff2", "400"],
  ["Oswald", "Oswald-600.woff2", "600"],
  ["SpecialElite", "SpecialElite.woff2", "400"],
];
fonts.forEach(([family, file, weight]) => {
  loadFont({ family, url: staticFile(`fonts/${file}`), weight });
});

const V = { fps: 30, width: 1080, height: 1920 };

export const Root: React.FC = () => (
  <>
    <Composition id="Ep03" component={Ep03Reel} durationInFrames={ep03Frames} {...V} />
    <Composition id="Ep03Cover" component={Ep03Cover} durationInFrames={1} {...V} />
    <Composition id="Story01" component={Story01} durationInFrames={STORY01_FRAMES} {...V} />
    <Composition id="Story01Cover" component={Story01Cover} durationInFrames={1} {...V} />
    <Composition id="Story01V" component={Story01V} durationInFrames={STORY01V_FRAMES} {...V} />
    {EPISODES.map(({ id, ep, timing }) => {
      const name = id.charAt(0).toUpperCase() + id.slice(1);
      return (
        <React.Fragment key={id}>
          <Composition id={name} component={EpisodeReel} durationInFrames={Math.ceil(timing.total * 30)} defaultProps={{ ep, timing }} {...V} />
          <Composition id={`${name}Cover`} component={EpisodeCover} durationInFrames={1} defaultProps={{ ep, timing }} {...V} />
        </React.Fragment>
      );
    })}
  </>
);
