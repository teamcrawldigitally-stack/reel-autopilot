import React from "react";
import { AbsoluteFill } from "remotion";
import { Person, ROHIT } from "../../components/Cartoon";
import { LINE } from "../../components/format";
import { Grade, Grain, Logo, Vignette } from "../../components/kit";
import { MoneyRoom } from "../../components/sets";
import { C, theme } from "../../theme";
import { BankPhone } from "./scenes";

const T = (size: number, color: string = LINE): React.CSSProperties => ({ fontFamily: theme.fonts.display, fontWeight: 700, fontSize: size, lineHeight: 1, color, whiteSpace: "nowrap" });

/** Cover: inside the 3:4 grid crop (y 240–1680). */
export const Case14Cover: React.FC = () => (
  <AbsoluteFill style={{ background: C.paper }}>
    <MoneyRoom />
    <div style={{ position: "absolute", top: 290, left: 84, right: 84, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 14, background: C.white, border: `3px solid ${LINE}`, borderRadius: 999, padding: "12px 24px 12px 20px", fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 32, letterSpacing: "0.1em", color: LINE, boxShadow: `5px 5px 0 ${LINE}` }}>
        <div style={{ width: 18, height: 18, borderRadius: "50%", background: C.red }} />
        CASE #14
      </div>
      <div style={{ background: C.white, borderRadius: 18, padding: "8px 12px" }}>
        <Logo width={180} />
      </div>
    </div>
    <div style={{ position: "absolute", top: 420, left: 40, right: 40, display: "flex", flexDirection: "column", alignItems: "center", gap: 22 }}>
      <div style={{ ...T(92, C.white), background: C.green, border: `8px solid ${LINE}`, borderRadius: 30, padding: "22px 36px 4px", boxShadow: `10px 10px 0 ${LINE}`, transform: "rotate(-2deg)" }}>Profit ₹1.2 lakh</div>
      <div style={{ ...T(92, C.white), background: C.red, border: `8px solid ${LINE}`, borderRadius: 30, padding: "22px 36px 4px", boxShadow: `10px 10px 0 ${LINE}`, transform: "rotate(2deg)" }}>Bank mein ₹8,000</div>
      <div style={{ ...T(76), background: C.white, border: `7px solid ${LINE}`, borderRadius: 24, padding: "20px 34px 6px", boxShadow: `8px 8px 0 ${LINE}`, transform: "rotate(-1deg)" }}>Paisa kahan gaya?</div>
    </div>
    <div style={{ position: "absolute", left: 610, top: 960 }}><BankPhone amount="₹8,000" w={340} /></div>
    <div style={{ position: "absolute", left: 60, top: 940, transform: "scale(0.7)", transformOrigin: "0 0" }}>
      <Person look={ROHIT} seed="cov14" track={[{ at: -100, pose: "shrug", mood: "shock" }]} />
    </div>
    <Grade />
    <Grain />
    <Vignette />
  </AbsoluteFill>
);
