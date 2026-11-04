import React from "react";
import { Composition, staticFile } from "remotion";
import { loadFont } from "@remotion/fonts";
import { Case01Cover } from "./reels/case01/Cover";
import { Case01Reel } from "./reels/case01/Reel";
import { totalFrames as case01Frames } from "./reels/case01/timeline";
import { News01Cover } from "./reels/news01/Cover";
import { DoctorTest } from "./test/DoctorTest";
import { CastTest } from "./test/CastTest";
import { Case03Reel } from "./reels/case03/Reel";
import { Case03Cover } from "./reels/case03/Cover";
import { totalFrames as case03Frames } from "./reels/case03/timeline";
import { Case02Reel } from "./reels/case02/Reel";
import { Case02Cover } from "./reels/case02/Cover";
import { totalFrames as case02Frames } from "./reels/case02/timeline";
import { Case04Reel } from "./reels/case04/Reel";
import { Case04Cover } from "./reels/case04/Cover";
import { totalFrames as case04Frames } from "./reels/case04/timeline";
import { News01Reel } from "./reels/news01/Reel";
import { totalFrames as news01Frames } from "./reels/news01/timeline";

const fonts: [string, string, string][] = [
  ["Poppins", "Poppins-Regular.ttf", "400"],
  ["Poppins", "Poppins-Medium.ttf", "500"],
  ["Poppins", "Poppins-Bold.ttf", "700"],
  ["Inter", "Inter-Medium.otf", "500"],
  ["Inter", "Inter-SemiBold.otf", "600"],
  ["Inter", "Inter-Bold.otf", "700"],
  ["Inter", "Inter-ExtraBold.otf", "800"],
  ["Inter", "Inter-Black.otf", "900"],
];
fonts.forEach(([family, file, weight]) => {
  loadFont({ family, url: staticFile(`fonts/${file}`), weight });
});

const V = { fps: 30, width: 1080, height: 1920 };

export const Root: React.FC = () => (
  <>
    <Composition id="News01" component={News01Reel} durationInFrames={news01Frames} {...V} />
    <Composition id="News01Cover" component={News01Cover} durationInFrames={1} {...V} />
    <Composition id="Case01" component={Case01Reel} durationInFrames={case01Frames} {...V} />
    <Composition id="Case01Cover" component={Case01Cover} durationInFrames={1} {...V} />
    <Composition id="Case02" component={Case02Reel} durationInFrames={case02Frames} {...V} />
    <Composition id="Case02Cover" component={Case02Cover} durationInFrames={1} {...V} />
    <Composition id="Case03" component={Case03Reel} durationInFrames={case03Frames} {...V} />
    <Composition id="Case03Cover" component={Case03Cover} durationInFrames={1} {...V} />
    <Composition id="Case04" component={Case04Reel} durationInFrames={case04Frames} {...V} />
    <Composition id="Case04Cover" component={Case04Cover} durationInFrames={1} {...V} />
    <Composition id="CastTest" component={CastTest} durationInFrames={300} {...V} />
    <Composition id="DoctorTest" component={DoctorTest} durationInFrames={300} {...V} />
  </>
);
