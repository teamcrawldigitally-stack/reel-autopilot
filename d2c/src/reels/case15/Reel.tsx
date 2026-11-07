import React from "react";
import { CartoonReel } from "../../components/toon";
import { S1Hook, S2AdSale, S3Break, S4Overflow, S5Meter, S6Fixes, S7Cta } from "./scenes";
import script from "./script.json";
import { T } from "./timeline";

const MAP: Record<string, React.FC<{ dur: number }>> = { s1: S1Hook, s2: S2AdSale, s3: S3Break, s4: S4Overflow, s5: S5Meter, s6: S6Fixes, s7: S7Cta };

export const Case15Reel: React.FC = () => <CartoonReel tag={script.tag} ids={script.scenes.map((s) => s.id)} map={MAP} T={T} />;
