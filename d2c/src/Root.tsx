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
import { Case05Reel } from "./reels/case05/Reel";
import { Case05Cover } from "./reels/case05/Cover";
import { totalFrames as case05Frames } from "./reels/case05/timeline";
import { Case07Reel } from "./reels/case07/Reel";
import { Case07Cover } from "./reels/case07/Cover";
import { totalFrames as case07Frames } from "./reels/case07/timeline";
import { Case09Reel } from "./reels/case09/Reel";
import { Case09Cover } from "./reels/case09/Cover";
import { totalFrames as case09Frames } from "./reels/case09/timeline";
import { Case10Reel } from "./reels/case10/Reel";
import { Case10Cover } from "./reels/case10/Cover";
import { totalFrames as case10Frames } from "./reels/case10/timeline";
import { Case12Reel } from "./reels/case12/Reel";
import { Case12Cover } from "./reels/case12/Cover";
import { totalFrames as case12Frames } from "./reels/case12/timeline";
import { Case14Reel } from "./reels/case14/Reel";
import { Case14Cover } from "./reels/case14/Cover";
import { totalFrames as case14Frames } from "./reels/case14/timeline";
import { Case15Reel } from "./reels/case15/Reel";
import { Case15Cover } from "./reels/case15/Cover";
import { totalFrames as case15Frames } from "./reels/case15/timeline";
import { Case16Reel } from "./reels/case16/Reel";
import { Case16Cover } from "./reels/case16/Cover";
import { totalFrames as case16Frames } from "./reels/case16/timeline";
import { Case17Reel } from "./reels/case17/Reel";
import { Case17Cover } from "./reels/case17/Cover";
import { totalFrames as case17Frames } from "./reels/case17/timeline";
import { Case18Reel } from "./reels/case18/Reel";
import { Case18Cover } from "./reels/case18/Cover";
import { totalFrames as case18Frames } from "./reels/case18/timeline";
import { Case19Reel } from "./reels/case19/Reel";
import { Case19Cover } from "./reels/case19/Cover";
import { totalFrames as case19Frames } from "./reels/case19/timeline";
import { Case20Reel } from "./reels/case20/Reel";
import { Case20Cover } from "./reels/case20/Cover";
import { totalFrames as case20Frames } from "./reels/case20/timeline";
import { Case21Reel } from "./reels/case21/Reel";
import { Case21Cover } from "./reels/case21/Cover";
import { totalFrames as case21Frames } from "./reels/case21/timeline";
import { Case22Reel } from "./reels/case22/Reel";
import { Case22Cover } from "./reels/case22/Cover";
import { totalFrames as case22Frames } from "./reels/case22/timeline";
import { Case23Reel } from "./reels/case23/Reel";
import { Case23Cover } from "./reels/case23/Cover";
import { totalFrames as case23Frames } from "./reels/case23/timeline";
import { Case24Reel } from "./reels/case24/Reel";
import { Case24Cover } from "./reels/case24/Cover";
import { totalFrames as case24Frames } from "./reels/case24/timeline";
import { Case25Reel } from "./reels/case25/Reel";
import { Case25Cover } from "./reels/case25/Cover";
import { totalFrames as case25Frames } from "./reels/case25/timeline";
import { Case26Reel } from "./reels/case26/Reel";
import { Case26Cover } from "./reels/case26/Cover";
import { totalFrames as case26Frames } from "./reels/case26/timeline";
import { Case27Reel } from "./reels/case27/Reel";
import { Case27Cover } from "./reels/case27/Cover";
import { totalFrames as case27Frames } from "./reels/case27/timeline";
import { Case28Reel } from "./reels/case28/Reel";
import { Case28Cover } from "./reels/case28/Cover";
import { totalFrames as case28Frames } from "./reels/case28/timeline";
import { Case29Reel } from "./reels/case29/Reel";
import { Case29Cover } from "./reels/case29/Cover";
import { totalFrames as case29Frames } from "./reels/case29/timeline";
import { Case30Reel } from "./reels/case30/Reel";
import { Case30Cover } from "./reels/case30/Cover";
import { totalFrames as case30Frames } from "./reels/case30/timeline";
import { Case31Reel } from "./reels/case31/Reel";
import { Case31Cover } from "./reels/case31/Cover";
import { totalFrames as case31Frames } from "./reels/case31/timeline";
import { Case32Reel } from "./reels/case32/Reel";
import { Case32Cover } from "./reels/case32/Cover";
import { totalFrames as case32Frames } from "./reels/case32/timeline";
import { Case33Reel } from "./reels/case33/Reel";
import { Case33Cover } from "./reels/case33/Cover";
import { totalFrames as case33Frames } from "./reels/case33/timeline";
import { Case37Reel } from "./reels/case37/Reel";
import { Case37Cover } from "./reels/case37/Cover";
import { totalFrames as case37Frames } from "./reels/case37/timeline";
import { Case38Reel } from "./reels/case38/Reel";
import { Case38Cover } from "./reels/case38/Cover";
import { totalFrames as case38Frames } from "./reels/case38/timeline";
import { Case34Reel } from "./reels/case34/Reel";
import { Case34Cover } from "./reels/case34/Cover";
import { totalFrames as case34Frames } from "./reels/case34/timeline";
import { Case35Reel } from "./reels/case35/Reel";
import { Case35Cover } from "./reels/case35/Cover";
import { totalFrames as case35Frames } from "./reels/case35/timeline";
import { Case36Reel } from "./reels/case36/Reel";
import { Case36Cover } from "./reels/case36/Cover";
import { totalFrames as case36Frames } from "./reels/case36/timeline";
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
    <Composition id="Case05" component={Case05Reel} durationInFrames={case05Frames} {...V} />
    <Composition id="Case05Cover" component={Case05Cover} durationInFrames={1} {...V} />
    <Composition id="Case07" component={Case07Reel} durationInFrames={case07Frames} {...V} />
    <Composition id="Case07Cover" component={Case07Cover} durationInFrames={1} {...V} />
    <Composition id="Case09" component={Case09Reel} durationInFrames={case09Frames} {...V} />
    <Composition id="Case09Cover" component={Case09Cover} durationInFrames={1} {...V} />
    <Composition id="Case10" component={Case10Reel} durationInFrames={case10Frames} {...V} />
    <Composition id="Case10Cover" component={Case10Cover} durationInFrames={1} {...V} />
    <Composition id="Case12" component={Case12Reel} durationInFrames={case12Frames} {...V} />
    <Composition id="Case12Cover" component={Case12Cover} durationInFrames={1} {...V} />
    <Composition id="Case14" component={Case14Reel} durationInFrames={case14Frames} {...V} />
    <Composition id="Case14Cover" component={Case14Cover} durationInFrames={1} {...V} />
    <Composition id="Case15" component={Case15Reel} durationInFrames={case15Frames} {...V} />
    <Composition id="Case15Cover" component={Case15Cover} durationInFrames={1} {...V} />
    <Composition id="Case16" component={Case16Reel} durationInFrames={case16Frames} {...V} />
    <Composition id="Case16Cover" component={Case16Cover} durationInFrames={1} {...V} />
    <Composition id="Case17" component={Case17Reel} durationInFrames={case17Frames} {...V} />
    <Composition id="Case17Cover" component={Case17Cover} durationInFrames={1} {...V} />
    <Composition id="Case18" component={Case18Reel} durationInFrames={case18Frames} {...V} />
    <Composition id="Case18Cover" component={Case18Cover} durationInFrames={1} {...V} />
    <Composition id="Case19" component={Case19Reel} durationInFrames={case19Frames} {...V} />
    <Composition id="Case19Cover" component={Case19Cover} durationInFrames={1} {...V} />
    <Composition id="Case20" component={Case20Reel} durationInFrames={case20Frames} {...V} />
    <Composition id="Case20Cover" component={Case20Cover} durationInFrames={1} {...V} />
    <Composition id="Case21" component={Case21Reel} durationInFrames={case21Frames} {...V} />
    <Composition id="Case21Cover" component={Case21Cover} durationInFrames={1} {...V} />
    <Composition id="Case22" component={Case22Reel} durationInFrames={case22Frames} {...V} />
    <Composition id="Case22Cover" component={Case22Cover} durationInFrames={1} {...V} />
    <Composition id="Case23" component={Case23Reel} durationInFrames={case23Frames} {...V} />
    <Composition id="Case23Cover" component={Case23Cover} durationInFrames={1} {...V} />
    <Composition id="Case24" component={Case24Reel} durationInFrames={case24Frames} {...V} />
    <Composition id="Case24Cover" component={Case24Cover} durationInFrames={1} {...V} />
    <Composition id="Case25" component={Case25Reel} durationInFrames={case25Frames} {...V} />
    <Composition id="Case25Cover" component={Case25Cover} durationInFrames={1} {...V} />
    <Composition id="Case26" component={Case26Reel} durationInFrames={case26Frames} {...V} />
    <Composition id="Case26Cover" component={Case26Cover} durationInFrames={1} {...V} />
    <Composition id="Case27" component={Case27Reel} durationInFrames={case27Frames} {...V} />
    <Composition id="Case27Cover" component={Case27Cover} durationInFrames={1} {...V} />
    <Composition id="Case28" component={Case28Reel} durationInFrames={case28Frames} {...V} />
    <Composition id="Case28Cover" component={Case28Cover} durationInFrames={1} {...V} />
    <Composition id="Case29" component={Case29Reel} durationInFrames={case29Frames} {...V} />
    <Composition id="Case29Cover" component={Case29Cover} durationInFrames={1} {...V} />
    <Composition id="Case30" component={Case30Reel} durationInFrames={case30Frames} {...V} />
    <Composition id="Case30Cover" component={Case30Cover} durationInFrames={1} {...V} />
    <Composition id="Case31" component={Case31Reel} durationInFrames={case31Frames} {...V} />
    <Composition id="Case31Cover" component={Case31Cover} durationInFrames={1} {...V} />
    <Composition id="Case32" component={Case32Reel} durationInFrames={case32Frames} {...V} />
    <Composition id="Case32Cover" component={Case32Cover} durationInFrames={1} {...V} />
    <Composition id="Case33" component={Case33Reel} durationInFrames={case33Frames} {...V} />
    <Composition id="Case33Cover" component={Case33Cover} durationInFrames={1} {...V} />
    <Composition id="Case37" component={Case37Reel} durationInFrames={case37Frames} {...V} />
    <Composition id="Case37Cover" component={Case37Cover} durationInFrames={1} {...V} />
    <Composition id="Case38" component={Case38Reel} durationInFrames={case38Frames} {...V} />
    <Composition id="Case38Cover" component={Case38Cover} durationInFrames={1} {...V} />
    <Composition id="Case34" component={Case34Reel} durationInFrames={case34Frames} {...V} />
    <Composition id="Case34Cover" component={Case34Cover} durationInFrames={1} {...V} />
    <Composition id="Case35" component={Case35Reel} durationInFrames={case35Frames} {...V} />
    <Composition id="Case35Cover" component={Case35Cover} durationInFrames={1} {...V} />
    <Composition id="Case36" component={Case36Reel} durationInFrames={case36Frames} {...V} />
    <Composition id="Case36Cover" component={Case36Cover} durationInFrames={1} {...V} />
    <Composition id="CastTest" component={CastTest} durationInFrames={300} {...V} />
    <Composition id="DoctorTest" component={DoctorTest} durationInFrames={300} {...V} />
  </>
);
