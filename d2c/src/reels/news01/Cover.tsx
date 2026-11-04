import React from "react";
import { AbsoluteFill } from "remotion";
import { LockIcon } from "../../components/icons";
import { Bg, Card, Chip, Grade, Grain, Logo, Vignette } from "../../components/kit";
import { C, theme } from "../../theme";

/** Static cover: key content inside the 3:4 grid crop (y 240–1680). */
export const News01Cover: React.FC = () => (
  <AbsoluteFill style={{ background: C.paper }}>
    <Bg />
    <AbsoluteFill style={{ alignItems: "center" }}>
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
          NEWS #01
        </div>
        <Logo width={200} />
      </div>
      <div style={{ position: "absolute", top: 460, left: 70, right: 70, display: "flex", flexDirection: "column", alignItems: "center", gap: 30 }}>
        <Chip size={40} style={{ background: theme.grad.violet }}>
          META ADS UPDATE
        </Chip>
        <div style={{ fontFamily: theme.fonts.display, fontWeight: 700, fontSize: 150, lineHeight: 1, letterSpacing: "-0.03em", color: C.navy, marginTop: 10 }}>
          ANDROMEDA
        </div>
        <div
          style={{
            background: theme.grad.violet,
            color: C.white,
            fontFamily: theme.fonts.display,
            fontWeight: 700,
            fontSize: 130,
            lineHeight: 1,
            padding: "24px 50px 10px",
            borderRadius: 36,
            transform: "rotate(-3deg)",
            boxShadow: `0 24px 60px -20px ${C.glow}`,
          }}
        >
          2.0
        </div>
        <div style={{ fontFamily: theme.fonts.display, fontWeight: 700, fontSize: 84, lineHeight: 1.12, color: C.navy, textAlign: "center", marginTop: 16 }}>
          Aapka ad{" "}
          <span style={{ background: C.lavender, borderRadius: 16, padding: "0 14px" }}>kise</span> dikhega?
        </div>
      </div>
      <div style={{ position: "absolute", top: 1330, display: "flex", gap: 26 }}>
        {[1, 2, 3].map((n) => (
          <Card key={n} style={{ width: 200, height: 220, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 6 }}>
            <div style={{ fontFamily: theme.fonts.display, fontWeight: 700, fontSize: 100, lineHeight: 1, color: n === 3 ? C.violet : C.navy }}>{n}</div>
            {n === 3 ? <LockIcon size={52} /> : <div style={{ fontFamily: theme.fonts.display, fontWeight: 700, fontSize: 52, color: C.lavender, lineHeight: 1 }}>?</div>}
          </Card>
        ))}
      </div>
      <div style={{ position: "absolute", top: 1580, fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 40, letterSpacing: "0.12em", color: C.navy }}>3 BADLAAV</div>
    </AbsoluteFill>
    <Grade />
    <Grain />
    <Vignette />
  </AbsoluteFill>
);
