import React from "react";
import { CartoonReel } from "../../components/toon";
import { S1Hook, S2Studio, S3Phone, S4Result, S5Fixes, S6Cta } from "./scenes";
import script from "./script.json";
import { T } from "./timeline";

const MAP: Record<string, React.FC<{ dur: number }>> = { s1: S1Hook, s2: S2Studio, s3: S3Phone, s4: S4Result, s5: S5Fixes, s6: S6Cta };

export const Case29Reel: React.FC = () => <CartoonReel tag={script.tag} ids={script.scenes.map((s) => s.id)} map={MAP} T={T} />;
