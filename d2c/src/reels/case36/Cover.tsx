import React from "react";
import { AbsoluteFill } from "remotion";
import { Person, PRIYA, ROHIT } from "../../components/Cartoon";
import { LINE } from "../../components/format";
import { Grade, Grain, Logo, Vignette } from "../../components/kit";
import { MoneyRoom } from "../../components/sets";
import { C, theme } from "../../theme";
import { Tag } from "./scenes";
const T = (size: number, color: string = LINE): React.CSSProperties => ({ fontFamily: theme.fonts.display, fontWeight: 700, fontSize: size, lineHeight: 1, color, whiteSpace: "nowrap" });
void PRIYA; void ROHIT; void Person;

/** Cover: inside the 3:4 grid crop (y 240–1680). */
export const Case36Cover: React.FC = () => (
  <AbsoluteFill style={{ background: C.paper }}>
    <MoneyRoom />
    <div style={{ position: "absolute", top: 290, left: 84, right: 84, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 14, background: C.white, border: `3px solid ${LINE}`, borderRadius: 999, padding: "12px 24px 12px 20px", fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 32, letterSpacing: "0.1em", color: LINE, boxShadow: `5px 5px 0 ${LINE}` }}>
        <div style={{ width: 18, height: 18, borderRadius: "50%", background: C.red }} />
        CASE #36
      </div>
      <div style={{ background: C.white, borderRadius: 18, padding: "8px 12px" }}>
        <Logo width={180} />
      </div>
    </div>
    <div style={{ position: "absolute", top: 430, left: 40, right: 40, display: "flex", flexDirection: "column", alignItems: "center", gap: 22 }}>
      <div style={{ ...T(86), background: C.white, border: `8px solid ${LINE}`, borderRadius: 30, padding: "22px 36px 4px", boxShadow: `10px 10px 0 ${LINE}`, transform: "rotate(-2deg)" }}>Ek customer = ₹500?</div>
      <div style={{ ...T(96, C.white), background: C.green, border: `8px solid ${LINE}`, borderRadius: 30, padding: "22px 36px 4px", boxShadow: `10px 10px 0 ${LINE}`, transform: "rotate(2deg)" }}>Asli: ₹3,000</div>
    </div>
    <div style={{ position: "absolute", left: 90, top: 900 }}>
      <Tag label="PEHLA ORDER" value="₹500" color={LINE} cross={1} w={400} />
    </div>
    <div style={{ position: "absolute", left: 560, top: 880, transform: "scale(1.05)" }}>
      <Tag label="SAAL BHAR KA" value="₹3,000" color={C.green} w={430} />
    </div>

    <Grade />
    <Grain />
    <Vignette />
  </AbsoluteFill>
);
