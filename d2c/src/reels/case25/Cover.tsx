import React from "react";
import { AbsoluteFill } from "remotion";
import { BP, BlueprintBg, DarkFinish, big, label } from "../../components/hisaab";
import { Logo } from "../../components/kit";
import { C } from "../../theme";
import { Pill } from "../../components/hisaabArt";
import { theme } from "../../theme";
/** Cover: inside the 3:4 grid crop (y 240–1680). */
export const Case25Cover: React.FC = () => (
  <AbsoluteFill style={{ background: C.navy }}>
    <BlueprintBg sheet="#25" />
    <div style={{ position: "absolute", top: 290, left: 84, right: 84, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 14, background: "rgba(13,2,56,0.7)", border: `2.5px solid ${BP.line}`, borderRadius: 999, padding: "12px 26px 12px 20px", ...label(30, BP.text), letterSpacing: "0.1em" }}>
        <div style={{ width: 18, height: 18, borderRadius: "50%", background: BP.red }} />
        CASE #25
      </div>
      <div style={{ background: C.white, borderRadius: 16, padding: "6px 12px" }}>
        <Logo width={160} />
      </div>
    </div>
    <div style={{ position: "absolute", left: 0, right: 0, top: 420, display: "flex", justifyContent: "center" }}>
      <svg width={520} height={520} viewBox="0 0 420 420">
        <circle cx={210} cy={210} r={180} stroke="rgba(223,200,253,0.15)" strokeWidth={30} fill="none" />
        <circle cx={210} cy={210} r={180} stroke={BP.red} strokeWidth={30} fill="none" strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={0.25} transform="rotate(-90 210 210)" />
        <text x={210} y={250} textAnchor="middle" fontFamily={theme.fonts.display} fontWeight={700} fontSize={150} fill={BP.text}>3s</text>
      </svg>
    </div>
    <div style={{ position: "absolute", left: 0, right: 0, top: 1010, display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      <div style={big(88)}>Aapka ad</div>
      <Pill size={110}>SKIP kyun?</Pill>
    </div>

    <DarkFinish />
  </AbsoluteFill>
);
