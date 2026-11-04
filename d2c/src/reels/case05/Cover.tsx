import React from "react";
import { AbsoluteFill } from "remotion";
import { Person, PRIYA } from "../../components/Cartoon";
import { LINE } from "../../components/format";
import { Grade, Grain, Logo, Vignette } from "../../components/kit";
import { MoneyRoom } from "../../components/sets";
import { C, theme } from "../../theme";

const Star: React.FC<{ size: number; fill?: string }> = ({ size, fill = "#F5B400" }) => (
  <svg width={size} height={size} viewBox="0 0 100 100">
    <path d="M50 6 L62 36 L94 38 L69 58 L78 90 L50 72 L22 90 L31 58 L6 38 L38 36 Z" fill={fill} stroke={LINE} strokeWidth={7} strokeLinejoin="round" />
  </svg>
);

/** Cover: inside the 3:4 grid crop (y 240–1680). */
export const Case05Cover: React.FC = () => (
  <AbsoluteFill style={{ background: C.paper }}>
    <MoneyRoom />
    <div style={{ position: "absolute", top: 290, left: 84, right: 84, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 14, background: C.white, border: `3px solid ${LINE}`, borderRadius: 999, padding: "12px 24px 12px 20px", fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 32, letterSpacing: "0.1em", color: LINE, boxShadow: `5px 5px 0 ${LINE}` }}>
        <div style={{ width: 18, height: 18, borderRadius: "50%", background: C.red }} />
        CASE #05
      </div>
      <div style={{ background: C.white, borderRadius: 18, padding: "8px 12px" }}>
        <Logo width={180} />
      </div>
    </div>
    <div style={{ position: "absolute", top: 420, left: 50, right: 50, display: "flex", flexDirection: "column", alignItems: "center", gap: 18 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 14, background: C.white, border: `6px solid ${LINE}`, borderRadius: 26, padding: "16px 28px", boxShadow: `8px 8px 0 ${LINE}`, transform: "rotate(-2deg)" }}>
        {[0, 1, 2, 3, 4].map((i) => (
          <Star key={i} size={92} />
        ))}
        <div style={{ fontFamily: theme.fonts.display, fontWeight: 700, fontSize: 96, lineHeight: 1, color: LINE, paddingTop: 12, marginLeft: 8 }}>5.0</div>
      </div>
      <div style={{ fontFamily: theme.fonts.display, fontWeight: 700, fontSize: 92, lineHeight: 1, color: LINE, background: C.white, border: `6px solid ${LINE}`, borderRadius: 22, padding: "16px 30px 2px", boxShadow: `6px 6px 0 ${LINE}`, transform: "rotate(2deg)", marginTop: 14 }}>phir bhi</div>
      <div style={{ fontFamily: theme.fonts.display, fontWeight: 700, fontSize: 150, lineHeight: 1, color: C.white, background: C.red, borderRadius: 30, padding: "22px 40px 2px", transform: "rotate(-3deg)", border: `8px solid ${LINE}`, boxShadow: `10px 10px 0 ${LINE}`, whiteSpace: "nowrap" }}>KAM SALE?</div>
    </div>
    <div style={{ position: "absolute", left: 290, top: 1170, transform: "scale(0.92)", transformOrigin: "0 0" }}>
      <Person look={PRIYA} seed="cov5" track={[{ at: -100, pose: "shrug", mood: "shock" }]} />
    </div>
    <div style={{ position: "absolute", left: 170, top: 1250, fontFamily: theme.fonts.display, fontWeight: 700, fontSize: 130, color: C.red, transform: "rotate(-12deg)" }}>?</div>
    <div style={{ position: "absolute", left: 820, top: 1230, fontFamily: theme.fonts.display, fontWeight: 700, fontSize: 104, color: C.violet, transform: "rotate(10deg)" }}>?</div>
    <Grade />
    <Grain />
    <Vignette />
  </AbsoluteFill>
);
