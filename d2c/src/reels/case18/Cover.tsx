import React from "react";
import { AbsoluteFill } from "remotion";
import { BP, BlueprintBg, DarkFinish, big, label } from "../../components/hisaab";
import { Face, Pill } from "../../components/hisaabArt";
import { CheckIcon, CrossIcon } from "../../components/icons";
import { Logo } from "../../components/kit";
import { C } from "../../theme";

/** Cover: inside the 3:4 grid crop (y 240–1680). */
export const Case18Cover: React.FC = () => (
  <AbsoluteFill style={{ background: C.navy }}>
    <BlueprintBg sheet="#18" />
    <div style={{ position: "absolute", top: 290, left: 84, right: 84, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 14, background: "rgba(13,2,56,0.7)", border: `2.5px solid ${BP.line}`, borderRadius: 999, padding: "12px 26px 12px 20px", ...label(30, BP.text), letterSpacing: "0.1em" }}>
        <div style={{ width: 18, height: 18, borderRadius: "50%", background: BP.red }} />
        CASE #18
      </div>
      <div style={{ background: C.white, borderRadius: 16, padding: "6px 12px" }}>
        <Logo width={160} />
      </div>
    </div>
    <div style={{ position: "absolute", top: 460, left: 0, right: 0, display: "flex", justifyContent: "center", gap: 50 }}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
        <div style={{ width: 380, height: 380, borderRadius: 60, background: "linear-gradient(150deg,#FFFFFF,#E9E2FA)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ width: 160, height: 160, borderRadius: "50%", background: C.violet, display: "flex", alignItems: "center", justifyContent: "center", ...big(92, C.white), paddingTop: 10, boxSizing: "border-box" }}>R</div>
        </div>
        <CrossIcon size={76} />
      </div>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
        <div style={{ width: 380, height: 380, borderRadius: 60, background: "linear-gradient(160deg,#FCE3D2,#E7B79B)", display: "flex", alignItems: "flex-end", justifyContent: "center", overflow: "hidden" }}>
          <Face kind="founder" w={320} talk={0.6} />
        </div>
        <CheckIcon size={76} />
      </div>
    </div>
    <div style={{ position: "absolute", top: 1060, left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      <div style={big(96)}>Logo nahi,</div>
      <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
        <Pill size={104} bg={BP.green} color={C.navy}>CHEHRA</Pill>
        <div style={big(96)}>bikta hai</div>
      </div>
    </div>
    <DarkFinish />
  </AbsoluteFill>
);
