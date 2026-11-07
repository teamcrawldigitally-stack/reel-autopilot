import React from "react";
import { HisaabReel } from "../../components/hisaabArt";
import { S1Hook, S2Parcel, S3Month, S4Math, S5Fixes, S6Cta } from "./scenes";
import script from "./script.json";
import { sceneById, sceneFrames } from "./timeline";

const MAP: Record<string, React.FC<{ dur: number }>> = { s1: S1Hook, s2: S2Parcel, s3: S3Month, s4: S4Math, s5: S5Fixes, s6: S6Cta };

export const Case22Reel: React.FC = () => (
  <HisaabReel tag={script.tag} ids={script.scenes.map((s) => s.id)} map={MAP} frames={sceneFrames} audio={(id) => sceneById(id).audio} />
);
