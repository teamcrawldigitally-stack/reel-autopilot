import React from "react";
import { AbsoluteFill } from "remotion";
import { Person, ROHIT } from "../../components/Cartoon";
import { LINE } from "../../components/format";
import { Grade, Grain, Logo, Vignette } from "../../components/kit";
import { Bottle } from "../../components/props";
import { MoneyRoom } from "../../components/sets";
import { C, theme } from "../../theme";
import { Toran } from "./scenes";

const T = (size: number, color: string = LINE): React.CSSProperties => ({ fontFamily: theme.fonts.display, fontWeight: 700, fontSize: size, lineHeight: 1, color, whiteSpace: "nowrap" });

/** Cover: inside the 3:4 grid crop (y 240–1680). */
export const Case19Cover: React.FC = () => (
  <AbsoluteFill style={{ background: C.paper }}>
    <MoneyRoom />
    <Toran y={250} sag={40} />
    <div style={{ position: "absolute", top: 420, left: 84, right: 84, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 14, background: C.white, border: `3px solid ${LINE}`, borderRadius: 999, padding: "12px 24px 12px 20px", fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 32, letterSpacing: "0.1em", color: LINE, boxShadow: `5px 5px 0 ${LINE}` }}>
        <div style={{ width: 18, height: 18, borderRadius: "50%", background: C.red }} />
        CASE #19
      </div>
      <div style={{ background: C.white, borderRadius: 18, padding: "8px 12px" }}>
        <Logo width={180} />
      </div>
    </div>
    <div style={{ position: "absolute", top: 560, left: 40, right: 40, display: "flex", flexDirection: "column", alignItems: "center", gap: 22 }}>
      <div style={{ ...T(88), background: C.white, border: `8px solid ${LINE}`, borderRadius: 30, padding: "22px 36px 4px", boxShadow: `10px 10px 0 ${LINE}`, transform: "rotate(-2deg)" }}>Shaadi season mein</div>
      <div style={{ ...T(92, C.white), background: C.violet, border: `8px solid ${LINE}`, borderRadius: 30, padding: "22px 36px 4px", boxShadow: `10px 10px 0 ${LINE}`, transform: "rotate(2deg)" }}>aapka product?</div>
    </div>
    <div style={{ position: "absolute", left: 120, top: 980, transform: "scale(0.7)", transformOrigin: "0 0" }}>
      <Person look={ROHIT} seed="cov19" track={[{ at: -100, pose: "shrug", mood: "shock" }]} />
    </div>
    <div style={{ position: "absolute", left: 640, top: 1080 }}>
      <Bottle level={0.8} w={200} />
    </div>
    <div style={{ position: "absolute", left: 830, top: 1020, ...T(140, C.violet), transform: "rotate(10deg)" }}>?</div>
    <Grade />
    <Grain />
    <Vignette />
  </AbsoluteFill>
);
