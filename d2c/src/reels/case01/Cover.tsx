import React from "react";
import { AbsoluteFill } from "remotion";
import { Particles } from "../../components/fx";
import { Bg, Card, Chip, Grade, Grain, Logo, Vignette } from "../../components/kit";
import { C, theme } from "../../theme";

const BARS = [38, 52, 46, 64, 58, 72, 66, 80, 6, 6, 6, 6];

/** Static cover; key content inside the 3:4 grid crop (y 240–1680). */
export const Case01Cover: React.FC = () => (
  <AbsoluteFill style={{ background: C.paper }}>
    <Bg />
    <Particles seed="cover01" />
    <div style={{ position: "absolute", top: 300, left: 84, right: 84, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
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
        CASE #01
      </div>
      <Logo width={200} />
    </div>
    <div style={{ position: "absolute", top: 470, left: 70, right: 70, display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
      <div style={{ fontFamily: theme.fonts.display, fontWeight: 700, fontSize: 150, lineHeight: 1.02, letterSpacing: "-0.03em", color: C.navy, textAlign: "center" }}>
        Ads band
      </div>
      <div style={{ fontFamily: theme.fonts.display, fontWeight: 700, fontSize: 96, lineHeight: 1.1, color: C.muted }}>=</div>
      <div style={{ display: "flex", alignItems: "center", gap: 26 }}>
        <div style={{ fontFamily: theme.fonts.display, fontWeight: 700, fontSize: 150, lineHeight: 1.02, letterSpacing: "-0.03em", color: C.navy }}>sales</div>
        <div
          style={{
            fontFamily: theme.fonts.display,
            fontWeight: 700,
            fontSize: 140,
            lineHeight: 1,
            color: C.red,
            border: `12px solid ${C.red}`,
            borderRadius: 30,
            padding: "22px 30px 4px",
            transform: "rotate(-8deg)",
            background: "rgba(255,255,255,0.9)",
          }}
        >
          ZERO?
        </div>
      </div>
    </div>
    <div style={{ position: "absolute", left: 84, top: 1090 }}>
      <Card style={{ width: 912, height: 420, boxSizing: "border-box", padding: "30px 40px", position: "relative" }}>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <div style={{ fontFamily: theme.fonts.body, fontWeight: 700, fontSize: 30, color: C.muted, letterSpacing: "0.06em" }}>AAJ KE ORDERS</div>
          <Chip size={24} bg={C.redSoft} color={C.red}>
            ● ADS OFF
          </Chip>
        </div>
        <div style={{ position: "absolute", left: 40, right: 40, bottom: 34, height: 270, display: "flex", alignItems: "flex-end", gap: 18 }}>
          {BARS.map((h, i) => (
            <div key={i} style={{ flex: 1, height: (h / 100) * 260, borderRadius: 10, background: h < 10 ? C.red : theme.grad.violet }} />
          ))}
        </div>
      </Card>
    </div>
    <Grade />
    <Grain />
    <Vignette />
  </AbsoluteFill>
);
