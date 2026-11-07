import React from "react";
import { AbsoluteFill } from "remotion";
import { BP, BlueprintBg, DarkFinish, big, label } from "../../components/hisaab";
import { Logo } from "../../components/kit";
import { C } from "../../theme";
import { Pill } from "../../components/hisaabArt";
import { SayCard } from "./scenes";
/** Cover: inside the 3:4 grid crop (y 240–1680). */
export const Case30Cover: React.FC = () => (
  <AbsoluteFill style={{ background: C.navy }}>
    <BlueprintBg sheet="#30" />
    <div style={{ position: "absolute", top: 290, left: 84, right: 84, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 14, background: "rgba(13,2,56,0.7)", border: `2.5px solid ${BP.line}`, borderRadius: 999, padding: "12px 26px 12px 20px", ...label(30, BP.text), letterSpacing: "0.1em" }}>
        <div style={{ width: 18, height: 18, borderRadius: "50%", background: BP.red }} />
        CASE #30
      </div>
      <div style={{ background: C.white, borderRadius: 16, padding: "6px 12px" }}>
        <Logo width={160} />
      </div>
    </div>
    <div style={{ position: "absolute", left: 84, top: 430 }}>
      <SayCard who="AAPKA AD" text={<>"Premium quality"</>} w={620} dim />
    </div>
    <div style={{ position: "absolute", right: 84, top: 720 }}>
      <SayCard who="CUSTOMER" text={<>"Baal girna <span style={{ color: BP.green }}>band hua</span>"</>} w={660} />
    </div>
    <div style={{ position: "absolute", left: 0, right: 0, top: 1150, display: "flex", flexDirection: "column", alignItems: "center", gap: 18 }}>
      <div style={big(84)}>Kiske shabd</div>
      <Pill size={104}>bechte hain?</Pill>
    </div>
    <div style={{ display: "none", ...label(10) }} />

    <DarkFinish />
  </AbsoluteFill>
);
