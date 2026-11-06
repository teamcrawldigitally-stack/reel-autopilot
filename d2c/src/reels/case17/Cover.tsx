import React from "react";
import { AbsoluteFill } from "remotion";
import { BP, BlueprintBg, DarkFinish, big, label } from "../../components/hisaab";
import { PhotoCard, Pill } from "../../components/hisaabArt";
import { Logo } from "../../components/kit";
import { C } from "../../theme";

/** Cover: inside the 3:4 grid crop (y 240–1680). */
export const Case17Cover: React.FC = () => (
  <AbsoluteFill style={{ background: C.navy }}>
    <BlueprintBg sheet="#17" />
    <div style={{ position: "absolute", top: 290, left: 84, right: 84, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 14, background: "rgba(13,2,56,0.7)", border: `2.5px solid ${BP.line}`, borderRadius: 999, padding: "12px 26px 12px 20px", ...label(30, BP.text), letterSpacing: "0.1em" }}>
        <div style={{ width: 18, height: 18, borderRadius: "50%", background: BP.red }} />
        CASE #17
      </div>
      <div style={{ background: C.white, borderRadius: 16, padding: "6px 12px" }}>
        <Logo width={160} />
      </div>
    </div>
    <div style={{ position: "absolute", top: 450, left: 0, right: 0, display: "flex", justifyContent: "center", gap: 40 }}>
      {(["plain", "hand"] as const).map((k) => (
        <div key={k} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
          <PhotoCard kind={k} w={400} />
          <div style={big(84, k === "plain" ? BP.dim : BP.green)}>{k === "plain" ? "2 click" : "5 click"}</div>
        </div>
      ))}
    </div>
    <div style={{ position: "absolute", top: 1230, left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
      <div style={big(96)}>Photo badlo,</div>
      <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
        <Pill size={100} bg={BP.green} color={C.navy}>CLICK</Pill>
        <div style={big(96)}>badlo</div>
      </div>
    </div>
    <DarkFinish />
  </AbsoluteFill>
);
