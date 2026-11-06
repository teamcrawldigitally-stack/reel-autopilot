import React from "react";
import { AbsoluteFill } from "remotion";
import { BP, BlueprintBg, DarkFinish, big, label } from "../../components/hisaab";
import { Logo } from "../../components/kit";
import { C } from "../../theme";
import { Pill } from "../../components/hisaabArt";
import { AppTile } from "./scenes";
/** Cover: inside the 3:4 grid crop (y 240–1680). */
export const Case21Cover: React.FC = () => (
  <AbsoluteFill style={{ background: C.navy }}>
    <BlueprintBg sheet="#21" />
    <div style={{ position: "absolute", top: 290, left: 84, right: 84, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 14, background: "rgba(13,2,56,0.7)", border: `2.5px solid ${BP.line}`, borderRadius: 999, padding: "12px 26px 12px 20px", ...label(30, BP.text), letterSpacing: "0.1em" }}>
        <div style={{ width: 18, height: 18, borderRadius: "50%", background: BP.red }} />
        CASE #21
      </div>
      <div style={{ background: C.white, borderRadius: 16, padding: "6px 12px" }}>
        <Logo width={160} />
      </div>
    </div>
    <div style={{ position: "absolute", top: 440, left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
      <div style={label(32, BP.dim)}>SAAL KA</div>
      <div style={{ ...big(210, BP.red), textShadow: "0 0 70px rgba(255,90,95,0.4)" }}>₹58,800</div>
      <div style={big(80)}>un apps pe jo</div>
      <Pill size={90}>khulte hi nahi</Pill>
    </div>
    <div style={{ position: "absolute", left: 0, right: 0, top: 1160, display: "flex", justifyContent: "center", flexWrap: "wrap", gap: 24, padding: "0 140px" }}>
      {[0, 1, 2, 3, 4, 5, 6].map((i) => (
        <AppTile key={i} i={i} s={120} dead={[1, 3, 5].includes(i) ? 1 : 0} />
      ))}
    </div>

    <DarkFinish />
  </AbsoluteFill>
);
