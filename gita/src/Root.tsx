import React from "react";
import { Composition, staticFile } from "remotion";
import { loadFont } from "@remotion/fonts";
import { Ep03Reel } from "./reels/ep03/Reel";
import { Ep03Cover } from "./reels/ep03/Cover";
import { totalFrames as ep03Frames } from "./reels/ep03/timeline";

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
];
fonts.forEach(([family, file, weight]) => {
  loadFont({ family, url: staticFile(`fonts/${file}`), weight });
});

const V = { fps: 30, width: 1080, height: 1920 };

export const Root: React.FC = () => (
  <>
    <Composition id="Ep03" component={Ep03Reel} durationInFrames={ep03Frames} {...V} />
    <Composition id="Ep03Cover" component={Ep03Cover} durationInFrames={1} {...V} />
  </>
);
