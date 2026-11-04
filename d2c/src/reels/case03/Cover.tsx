import React from "react";
import { AbsoluteFill } from "remotion";
import { Person, Piggy, ROHIT } from "../../components/Cartoon";
import { Grade, Grain, Logo, Vignette } from "../../components/kit";
import { C, theme } from "../../theme";
import { Stage } from "./sets";

/** Cover: inside the 3:4 grid crop (y 240–1680). */
export const Case03Cover: React.FC = () => (
  <AbsoluteFill style={{ background: C.paper }}>
    <Stage />
    <div style={{ position: "absolute", top: 290, left: 84, right: 84, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 14, background: C.white, border: `3px solid ${C.navy}`, borderRadius: 999, padding: "12px 24px 12px 20px", fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 32, letterSpacing: "0.1em", color: C.navy, boxShadow: `5px 5px 0 ${C.navy}` }}>
        <div style={{ width: 18, height: 18, borderRadius: "50%", background: C.red }} />
        CASE #03
      </div>
      <div style={{ background: C.white, borderRadius: 18, padding: "8px 12px" }}>
        <Logo width={180} />
      </div>
    </div>
    <div style={{ position: "absolute", top: 440, left: 60, right: 60, display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
      <div style={{ fontFamily: theme.fonts.display, fontWeight: 700, fontSize: 96, lineHeight: 1.05, color: C.white, textAlign: "center" }}>Same customers.</div>
      <div style={{ fontFamily: theme.fonts.display, fontWeight: 700, fontSize: 170, lineHeight: 1, color: C.white, background: C.green, borderRadius: 30, padding: "18px 40px 0", transform: "rotate(-4deg)", marginTop: 16, border: `8px solid ${C.navy}` }}>4× profit</div>
    </div>
    <div style={{ position: "absolute", left: 600, top: 930 }}>
      <Piggy w={380} />
    </div>
    <div style={{ position: "absolute", left: 90, top: 860, transform: "scale(0.95)", transformOrigin: "0 0" }}>
      <Person look={ROHIT} seed="cov" track={[{ at: -100, pose: "cheer", mood: "grin" }]} />
    </div>
    <Grade />
    <Grain />
    <Vignette />
  </AbsoluteFill>
);
