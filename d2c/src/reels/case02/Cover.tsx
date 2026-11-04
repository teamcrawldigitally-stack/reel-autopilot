import React from "react";
import { AbsoluteFill } from "remotion";
import { Doctor } from "../../components/Doctor";
import { Particles } from "../../components/fx";
import { Bg, Grade, Grain, Logo, Vignette } from "../../components/kit";
import { C, theme } from "../../theme";

/** Cover: key content inside the 3:4 grid crop (y 240–1680). */
export const Case02Cover: React.FC = () => (
  <AbsoluteFill style={{ background: C.paper }}>
    <Bg />
    <Particles seed="cover02" />
    <div style={{ position: "absolute", top: 290, left: 84, right: 84, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 14,
          background: C.white,
          border: `3px solid ${C.navy}`,
          borderRadius: 999,
          padding: "12px 24px 12px 20px",
          fontFamily: theme.fonts.body,
          fontWeight: 800,
          fontSize: 32,
          letterSpacing: "0.1em",
          color: C.navy,
          boxShadow: `5px 5px 0 ${C.navy}`,
        }}
      >
        <div style={{ width: 18, height: 18, borderRadius: "50%", background: C.red }} />
        CASE #02
      </div>
      <Logo width={200} />
    </div>
    <div style={{ position: "absolute", top: 430, left: 60, right: 60, display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
      <div style={{ fontFamily: theme.fonts.display, fontWeight: 700, fontSize: 110, lineHeight: 1.04, letterSpacing: "-0.03em", color: C.navy, textAlign: "center" }}>
        Same <span style={{ background: C.lavender, borderRadius: 18, padding: "0 14px" }}>₹10,000</span>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 24, marginTop: 10 }}>
        <div style={{ fontFamily: theme.fonts.display, fontWeight: 700, fontSize: 104, color: C.red, background: C.redSoft, borderRadius: 24, padding: "10px 28px 0" }}>10</div>
        <div style={{ fontFamily: theme.fonts.display, fontWeight: 700, fontSize: 70, color: C.muted }}>ya</div>
        <div style={{ fontFamily: theme.fonts.display, fontWeight: 700, fontSize: 104, color: C.white, background: C.green, borderRadius: 24, padding: "10px 28px 0", transform: "rotate(-3deg)" }}>20</div>
      </div>
      <div style={{ fontFamily: theme.fonts.display, fontWeight: 700, fontSize: 78, color: C.navy }}>orders?</div>
    </div>
    <div style={{ position: "absolute", left: 230, top: 1000, transform: "scale(1.0)", transformOrigin: "0 0" }}>
      <Doctor poses={[{ at: -200, pose: "point" }]} mouth={() => 0.3} caseTag="CASE #02" />
    </div>
    <Grade />
    <Grain />
    <Vignette />
  </AbsoluteFill>
);
