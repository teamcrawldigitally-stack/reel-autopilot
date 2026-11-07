import React from "react";
import { AbsoluteFill } from "remotion";
import { BP, BlueprintBg, DarkFinish, big, label } from "../../components/hisaab";
import { Logo } from "../../components/kit";
import { C } from "../../theme";
import { Pill } from "../../components/hisaabArt";
import { PhoneVid, Studio } from "./scenes";
/** Cover: inside the 3:4 grid crop (y 240–1680). */
export const Case29Cover: React.FC = () => (
  <AbsoluteFill style={{ background: C.navy }}>
    <BlueprintBg sheet="#29" />
    <div style={{ position: "absolute", top: 290, left: 84, right: 84, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 14, background: "rgba(13,2,56,0.7)", border: `2.5px solid ${BP.line}`, borderRadius: 999, padding: "12px 26px 12px 20px", ...label(30, BP.text), letterSpacing: "0.1em" }}>
        <div style={{ width: 18, height: 18, borderRadius: "50%", background: BP.red }} />
        CASE #29
      </div>
      <div style={{ background: C.white, borderRadius: 16, padding: "6px 12px" }}>
        <Logo width={160} />
      </div>
    </div>
    <div style={{ position: "absolute", left: 70, top: 420 }}>
      <Studio w={430} f={0} />
      <div style={{ ...big(90, BP.red), textAlign: "center", marginTop: 10 }}>₹50,000</div>
    </div>
    <div style={{ position: "absolute", left: 528, top: 560, ...big(64, BP.dim) }}>vs</div>
    <div style={{ position: "absolute", right: 80, top: 400 }}>
      <PhoneVid w={290} />
      <div style={{ ...big(90, BP.green), textAlign: "center", marginTop: 10 }}>₹0</div>
    </div>
    <div style={{ position: "absolute", left: 0, right: 0, top: 1240, display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      <div style={big(84)}>Studio shoot haara</div>
      <Pill size={92} bg={BP.green} color={C.navy}>phone video se?</Pill>
    </div>
    <div style={{ display: "none", ...label(10) }} />

    <DarkFinish />
  </AbsoluteFill>
);
