import React from "react";
import { AbsoluteFill } from "remotion";
import { BP, BlueprintBg, DarkFinish, big, label } from "../../components/hisaab";
import { Logo } from "../../components/kit";
import { C } from "../../theme";
import { Pill, SerumBottle } from "../../components/hisaabArt";
import { Sachet } from "./scenes";
/** Cover: inside the 3:4 grid crop (y 240–1680). */
export const Case22Cover: React.FC = () => (
  <AbsoluteFill style={{ background: C.navy }}>
    <BlueprintBg sheet="#22" />
    <div style={{ position: "absolute", top: 290, left: 84, right: 84, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 14, background: "rgba(13,2,56,0.7)", border: `2.5px solid ${BP.line}`, borderRadius: 999, padding: "12px 26px 12px 20px", ...label(30, BP.text), letterSpacing: "0.1em" }}>
        <div style={{ width: 18, height: 18, borderRadius: "50%", background: BP.red }} />
        CASE #22
      </div>
      <div style={{ background: C.white, borderRadius: 16, padding: "6px 12px" }}>
        <Logo width={160} />
      </div>
    </div>
    <div style={{ position: "absolute", left: 0, right: 0, top: 440, display: "flex", justifyContent: "center", alignItems: "center", gap: 50 }}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
        <Sachet w={210} />
        <div style={big(130)}>₹5</div>
      </div>
      <div style={big(120, BP.dim)}>→</div>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
        <SerumBottle h={280} />
        <div style={{ ...big(130, BP.green), textShadow: "0 0 60px rgba(43,212,107,0.4)" }}>₹500</div>
      </div>
    </div>
    <div style={{ position: "absolute", left: 0, right: 0, top: 1110, display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      <div style={big(92)}>Sample se</div>
      <Pill size={100} bg={BP.green} color={C.navy}>agla order</Pill>
    </div>

    <DarkFinish />
  </AbsoluteFill>
);
