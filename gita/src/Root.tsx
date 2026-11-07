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
import { STORY02_FRAMES, Story02, Story02Cover } from "./story/Story02";
import { STORY03_FRAMES, Story03, Story03Cover } from "./story/Story03";
import { STORY04_FRAMES, Story04, Story04Cover } from "./story/Story04";
import { STORY05_FRAMES, Story05, Story05Cover } from "./story/Story05";
import { STORY06_FRAMES, Story06, Story06Cover } from "./story/Story06";
import { STORY07_FRAMES, Story07, Story07Cover } from "./story/Story07";
import { STORY08_FRAMES, Story08, Story08Cover } from "./story/Story08";
import { STORY09_FRAMES, Story09, Story09Cover } from "./story/Story09";
import { STORY10_FRAMES, Story10, Story10Cover } from "./story/Story10";
import { STORY11_FRAMES, Story11, Story11Cover } from "./story/Story11";
import { STORY12_FRAMES, Story12, Story12Cover } from "./story/Story12";
import { STORY13_FRAMES, Story13, Story13Cover } from "./story/Story13";
import { STORY14_FRAMES, Story14, Story14Cover } from "./story/Story14";
import { STORY15_FRAMES, Story15, Story15Cover } from "./story/Story15";
import { STORY16_FRAMES, Story16, Story16Cover } from "./story/Story16";
import { STORY17_FRAMES, Story17, Story17Cover } from "./story/Story17";

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
    <Composition id="Story02" component={Story02} durationInFrames={STORY02_FRAMES} {...V} />
    <Composition id="Story02Cover" component={Story02Cover} durationInFrames={1} {...V} />
    <Composition id="Story03" component={Story03} durationInFrames={STORY03_FRAMES} {...V} />
    <Composition id="Story03Cover" component={Story03Cover} durationInFrames={1} {...V} />
    <Composition id="Story04" component={Story04} durationInFrames={STORY04_FRAMES} {...V} />
    <Composition id="Story04Cover" component={Story04Cover} durationInFrames={1} {...V} />
    <Composition id="Story05" component={Story05} durationInFrames={STORY05_FRAMES} {...V} />
    <Composition id="Story05Cover" component={Story05Cover} durationInFrames={1} {...V} />
    <Composition id="Story06" component={Story06} durationInFrames={STORY06_FRAMES} {...V} />
    <Composition id="Story06Cover" component={Story06Cover} durationInFrames={1} {...V} />
    <Composition id="Story07" component={Story07} durationInFrames={STORY07_FRAMES} {...V} />
    <Composition id="Story07Cover" component={Story07Cover} durationInFrames={1} {...V} />
    <Composition id="Story08" component={Story08} durationInFrames={STORY08_FRAMES} {...V} />
    <Composition id="Story08Cover" component={Story08Cover} durationInFrames={1} {...V} />
    <Composition id="Story09" component={Story09} durationInFrames={STORY09_FRAMES} {...V} />
    <Composition id="Story09Cover" component={Story09Cover} durationInFrames={1} {...V} />
    <Composition id="Story10" component={Story10} durationInFrames={STORY10_FRAMES} {...V} />
    <Composition id="Story10Cover" component={Story10Cover} durationInFrames={1} {...V} />
    <Composition id="Story11" component={Story11} durationInFrames={STORY11_FRAMES} {...V} />
    <Composition id="Story11Cover" component={Story11Cover} durationInFrames={1} {...V} />
    <Composition id="Story12" component={Story12} durationInFrames={STORY12_FRAMES} {...V} />
    <Composition id="Story12Cover" component={Story12Cover} durationInFrames={1} {...V} />
    <Composition id="Story13" component={Story13} durationInFrames={STORY13_FRAMES} {...V} />
    <Composition id="Story13Cover" component={Story13Cover} durationInFrames={1} {...V} />
    <Composition id="Story14" component={Story14} durationInFrames={STORY14_FRAMES} {...V} />
    <Composition id="Story14Cover" component={Story14Cover} durationInFrames={1} {...V} />
    <Composition id="Story15" component={Story15} durationInFrames={STORY15_FRAMES} {...V} />
    <Composition id="Story15Cover" component={Story15Cover} durationInFrames={1} {...V} />
    <Composition id="Story16" component={Story16} durationInFrames={STORY16_FRAMES} {...V} />
    <Composition id="Story16Cover" component={Story16Cover} durationInFrames={1} {...V} />
    <Composition id="Story17" component={Story17} durationInFrames={STORY17_FRAMES} {...V} />
    <Composition id="Story17Cover" component={Story17Cover} durationInFrames={1} {...V} />
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
