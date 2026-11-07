import React from "react";
import { AbsoluteFill } from "remotion";
import { BP, BlueprintBg, DarkFinish, big, label } from "../../components/hisaab";
import { Logo } from "../../components/kit";
import { C } from "../../theme";
import { Pill } from "../../components/hisaabArt";
import { Tile } from "./scenes";
/** Cover: inside the 3:4 grid crop (y 240–1680). */
export const Case33Cover: React.FC = () => (
  <AbsoluteFill style={{ background: C.navy }}>
    <BlueprintBg sheet="#33" />
    <div style={{ position: "absolute", top: 290, left: 84, right: 84, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 14, background: "rgba(13,2,56,0.7)", border: `2.5px solid ${BP.line}`, borderRadius: 999, padding: "12px 26px 12px 20px", ...label(30, BP.text), letterSpacing: "0.1em" }}>
        <div style={{ width: 18, height: 18, borderRadius: "50%", background: BP.red }} />
        CASE #33
      </div>
      <div style={{ background: C.white, borderRadius: 16, padding: "6px 12px" }}>
        <Logo width={160} />
      </div>
    </div>
    <div style={{ position: "absolute", left: 0, right: 0, top: 440, display: "flex", justifyContent: "center" }}>
      <div style={big(150, "#FFD978")}>₹10,000</div>
    </div>
    <div style={{ position: "absolute", left: 84, right: 84, top: 680, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <Tile name="Meta" color="#4F7BFF" w={390} />
      <div style={big(70, BP.dim)}>ya</div>
      <Tile name="Google" color="#2BD46B" w={390} />
    </div>
    <div style={{ position: "absolute", left: 0, right: 0, top: 1100, display: "flex", flexDirection: "column", alignItems: "center", gap: 18 }}>
      <div style={big(84)}>Galat jagah lagaya,</div>
      <Pill size={104}>aadha bekaar</Pill>
    </div>
    <div style={{ display: "none", ...label(10, C.white) }} />

    <DarkFinish />
  </AbsoluteFill>
);
