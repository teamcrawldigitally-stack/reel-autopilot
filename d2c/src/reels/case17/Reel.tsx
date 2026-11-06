import React from "react";
import { HisaabReel } from "../../components/hisaabArt";
import { S1Hook, S2Plain, S3Hand, S4Clicks, S5Fixes, S6Cta } from "./scenes";
import script from "./script.json";
import { sceneById, sceneFrames } from "./timeline";

const MAP: Record<string, React.FC<{ dur: number }>> = { s1: S1Hook, s2: S2Plain, s3: S3Hand, s4: S4Clicks, s5: S5Fixes, s6: S6Cta };

export const Case17Reel: React.FC = () => (
  <HisaabReel tag={script.tag} ids={script.scenes.map((s) => s.id)} map={MAP} frames={sceneFrames} audio={(id) => sceneById(id).audio} />
);
