import React from "react";
import { AbsoluteFill } from "remotion";
import { Person, ROHIT } from "../../components/Cartoon";
import { LINE } from "../../components/format";
import { Grade, Grain, Logo, Vignette } from "../../components/kit";
import { OfficeWall } from "../../components/sets";
import { C, theme } from "../../theme";
import { Diya } from "./scenes";

const T = (size: number, color: string = LINE): React.CSSProperties => ({ fontFamily: theme.fonts.display, fontWeight: 700, fontSize: size, lineHeight: 1, color, whiteSpace: "nowrap" });

const Bars: React.FC = () => {
  const vals = [38, 41, 39, 42, 40, 12, 11, 12];
  return (
    <div style={{ width: 470, height: 340, display: "flex", alignItems: "flex-end", gap: 10, background: C.white, border: `7px solid ${LINE}`, borderRadius: 24, padding: "20px 22px 0", boxSizing: "border-box", boxShadow: `9px 9px 0 ${LINE}` }}>
      {vals.map((v, i) => (
        <div key={i} style={{ flex: 1, height: (v / 44) * 290, background: i < 5 ? C.green : C.red, border: `4px solid ${LINE}`, borderBottom: "none", borderRadius: "10px 10px 0 0", boxSizing: "border-box" }} />
      ))}
    </div>
  );
};

/** Cover: inside the 3:4 grid crop (y 240–1680). */
export const Case16Cover: React.FC = () => (
  <AbsoluteFill style={{ background: C.paper }}>
    <OfficeWall />
    <div style={{ position: "absolute", top: 290, left: 84, right: 84, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 14, background: C.white, border: `3px solid ${LINE}`, borderRadius: 999, padding: "12px 24px 12px 20px", fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 32, letterSpacing: "0.1em", color: LINE, boxShadow: `5px 5px 0 ${LINE}` }}>
        <div style={{ width: 18, height: 18, borderRadius: "50%", background: C.red }} />
        CASE #16
      </div>
      <div style={{ background: C.white, borderRadius: 18, padding: "8px 12px" }}>
        <Logo width={180} />
      </div>
    </div>
    <div style={{ position: "absolute", top: 420, left: 40, right: 40, display: "flex", flexDirection: "column", alignItems: "center", gap: 22 }}>
      <div style={{ ...T(92), background: C.white, border: `8px solid ${LINE}`, borderRadius: 30, padding: "22px 36px 4px", boxShadow: `10px 10px 0 ${LINE}`, transform: "rotate(-2deg)" }}>Diwali ke baad</div>
      <div style={{ ...T(96, C.white), background: C.red, border: `8px solid ${LINE}`, borderRadius: 30, padding: "22px 36px 4px", boxShadow: `10px 10px 0 ${LINE}`, transform: "rotate(2deg)" }}>sale giri?</div>
      <div style={{ ...T(64, C.white), background: C.violet, border: `7px solid ${LINE}`, borderRadius: 24, padding: "18px 30px 4px", boxShadow: `8px 8px 0 ${LINE}`, transform: "rotate(-1deg)" }}>🪔 Diwali hangover</div>
    </div>
    <div style={{ position: "absolute", left: 540, top: 1000 }}><Bars /></div>
    <div style={{ position: "absolute", left: 830, top: 900 }}><Diya w={130} /></div>
    <div style={{ position: "absolute", left: 60, top: 940, transform: "scale(0.7)", transformOrigin: "0 0" }}>
      <Person look={ROHIT} seed="cov16" track={[{ at: -100, pose: "shrug", mood: "shock" }]} />
    </div>
    <Grade />
    <Grain />
    <Vignette />
  </AbsoluteFill>
);
