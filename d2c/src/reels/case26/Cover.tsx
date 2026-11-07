import React from "react";
import { AbsoluteFill } from "remotion";
import { BP, BlueprintBg, DarkFinish, big, label } from "../../components/hisaab";
import { Logo } from "../../components/kit";
import { C } from "../../theme";
import { Dude, Pill } from "../../components/hisaabArt";
/** Cover: inside the 3:4 grid crop (y 240–1680). */
export const Case26Cover: React.FC = () => (
  <AbsoluteFill style={{ background: C.navy }}>
    <BlueprintBg sheet="#26" />
    <div style={{ position: "absolute", top: 290, left: 84, right: 84, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 14, background: "rgba(13,2,56,0.7)", border: `2.5px solid ${BP.line}`, borderRadius: 999, padding: "12px 26px 12px 20px", ...label(30, BP.text), letterSpacing: "0.1em" }}>
        <div style={{ width: 18, height: 18, borderRadius: "50%", background: BP.red }} />
        CASE #26
      </div>
      <div style={{ background: C.white, borderRadius: 16, padding: "6px 12px" }}>
        <Logo width={160} />
      </div>
    </div>
    <div style={{ position: "absolute", left: 0, right: 0, top: 440, display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
      <div style={label(32, BP.dim)}>3 SECOND LATE</div>
      <div style={{ ...big(240, BP.red), textShadow: "0 0 70px rgba(255,90,95,0.4)" }}>53%</div>
      <div style={big(80)}>log chale gaye</div>
    </div>
    <div style={{ position: "absolute", left: 0, right: 0, top: 1020, display: "flex", justifyContent: "center", gap: 18 }}>
      {Array.from({ length: 10 }).map((_, i) => (
        <Dude key={i} s={64} color={i % 2 === 0 ? BP.red : "rgba(223,200,253,0.5)"} />
      ))}
    </div>
    <div style={{ position: "absolute", left: 0, right: 0, top: 1170, display: "flex", justifyContent: "center" }}>
      <Pill size={96}>Website slow?</Pill>
    </div>

    <DarkFinish />
  </AbsoluteFill>
);
