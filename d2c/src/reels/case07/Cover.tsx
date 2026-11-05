import React from "react";
import { AbsoluteFill } from "remotion";
import { Person, ROHIT } from "../../components/Cartoon";
import { LINE } from "../../components/format";
import { Grade, Grain, Logo, Vignette } from "../../components/kit";
import { OfficeWall } from "../../components/sets";
import { C, theme } from "../../theme";

const T = (size: number, color: string = LINE): React.CSSProperties => ({ fontFamily: theme.fonts.display, fontWeight: 700, fontSize: size, lineHeight: 1, color, whiteSpace: "nowrap" });

/** Cover: inside the 3:4 grid crop (y 240–1680). */
export const Case07Cover: React.FC = () => (
  <AbsoluteFill style={{ background: C.paper }}>
    <OfficeWall />
    <div style={{ position: "absolute", top: 290, left: 84, right: 84, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 14, background: C.white, border: `3px solid ${LINE}`, borderRadius: 999, padding: "12px 24px 12px 20px", fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 32, letterSpacing: "0.1em", color: LINE, boxShadow: `5px 5px 0 ${LINE}` }}>
        <div style={{ width: 18, height: 18, borderRadius: "50%", background: C.red }} />
        CASE #07
      </div>
      <div style={{ background: C.white, borderRadius: 18, padding: "8px 12px" }}>
        <Logo width={180} />
      </div>
    </div>
    <div style={{ position: "absolute", top: 420, left: 40, right: 40, display: "flex", flexDirection: "column", alignItems: "center", gap: 22 }}>
      <div style={{ ...T(70), background: C.white, border: `6px solid ${LINE}`, borderRadius: 22, padding: "18px 30px 6px", boxShadow: `6px 6px 0 ${LINE}`, transform: "rotate(-2deg)" }}>Influencer ko</div>
      <div style={{ ...T(150, C.white), background: C.violet, border: `8px solid ${LINE}`, borderRadius: 30, padding: "24px 40px 4px", boxShadow: `10px 10px 0 ${LINE}`, transform: "rotate(2deg)" }}>₹50,000</div>
      <div style={{ ...T(120, C.white), background: C.red, border: `8px solid ${LINE}`, borderRadius: 30, padding: "22px 40px 2px", boxShadow: `10px 10px 0 ${LINE}`, transform: "rotate(-3deg)" }}>→ 3 ORDER</div>
    </div>
    <div style={{ position: "absolute", left: 300, top: 1060, transform: "scale(0.85)", transformOrigin: "0 0" }}>
      <Person look={ROHIT} seed="cov7" track={[{ at: -100, pose: "shrug", mood: "shock" }]} />
    </div>
    <div style={{ position: "absolute", left: 170, top: 1180, ...T(130, C.red), transform: "rotate(-12deg)" }}>?</div>
    <div style={{ position: "absolute", left: 820, top: 1160, ...T(104, C.violet), transform: "rotate(10deg)" }}>!</div>
    <Grade />
    <Grain />
    <Vignette />
  </AbsoluteFill>
);
