import React from "react";
import { CartoonReel } from "../../components/toon";
import { S1Hook, S2Statement, S3Math, S4Dead, S5Fixes, S6Cta } from "./scenes";
import script from "./script.json";
import { T } from "./timeline";

const MAP: Record<string, React.FC<{ dur: number }>> = { s1: S1Hook, s2: S2Statement, s3: S3Math, s4: S4Dead, s5: S5Fixes, s6: S6Cta };

export const Case21Reel: React.FC = () => <CartoonReel tag={script.tag} ids={script.scenes.map((s) => s.id)} map={MAP} T={T} />;
