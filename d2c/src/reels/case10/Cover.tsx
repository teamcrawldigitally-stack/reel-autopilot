import React from "react";
import { AbsoluteFill } from "remotion";
import { Person, PRIYA } from "../../components/Cartoon";
import { LINE } from "../../components/format";
import { Grade, Grain, Logo, Vignette } from "../../components/kit";
import { Doorstep } from "../../components/sets";
import { C, theme } from "../../theme";
import { CartIcon } from "./scenes";

const T = (size: number, color: string = LINE): React.CSSProperties => ({ fontFamily: theme.fonts.display, fontWeight: 700, fontSize: size, lineHeight: 1, color, whiteSpace: "nowrap" });

/** Cover: inside the 3:4 grid crop (y 240–1680). */
export const Case10Cover: React.FC = () => (
  <AbsoluteFill style={{ background: C.paper }}>
    <Doorstep />
    <div style={{ position: "absolute", top: 290, left: 84, right: 84, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 14, background: C.white, border: `3px solid ${LINE}`, borderRadius: 999, padding: "12px 24px 12px 20px", fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 32, letterSpacing: "0.1em", color: LINE, boxShadow: `5px 5px 0 ${LINE}` }}>
        <div style={{ width: 18, height: 18, borderRadius: "50%", background: C.red }} />
        CASE #10
      </div>
      <div style={{ background: C.white, borderRadius: 18, padding: "8px 12px" }}>
        <Logo width={180} />
      </div>
    </div>
    <div style={{ position: "absolute", top: 420, left: 40, right: 40, display: "flex", flexDirection: "column", alignItems: "center", gap: 22 }}>
      <div style={{ ...T(150, C.white), background: C.red, border: `8px solid ${LINE}`, borderRadius: 30, padding: "24px 44px 4px", boxShadow: `10px 10px 0 ${LINE}`, transform: "rotate(-3deg)" }}>10 mein se 7</div>
      <div style={{ ...T(84), background: C.white, border: `7px solid ${LINE}`, borderRadius: 24, padding: "20px 34px 6px", boxShadow: `8px 8px 0 ${LINE}`, transform: "rotate(2deg)" }}>cart chhod gaye</div>
      <div style={{ display: "flex", gap: 6, marginTop: 10, background: C.white, border: `5px solid ${LINE}`, borderRadius: 24, padding: "12px 16px 8px" }}>
        {Array.from({ length: 10 }).map((_, i) => (
          <CartIcon key={i} size={70} grey={[0, 1, 3, 4, 6, 7, 9].includes(i)} />
        ))}
      </div>
    </div>
    <div style={{ position: "absolute", left: 330, top: 1000, transform: "scale(0.8)", transformOrigin: "0 0" }}>
      <Person look={PRIYA} seed="cov10" track={[{ at: -100, pose: "wave", mood: "neutral" }]} />
    </div>
    <div style={{ position: "absolute", left: 90, top: 1120, ...T(64, C.red), background: C.white, border: `5px solid ${LINE}`, borderRadius: 18, padding: "14px 20px 4px", transform: "rotate(-6deg)" }}>₹799 → ₹947?</div>
    <Grade />
    <Grain />
    <Vignette />
  </AbsoluteFill>
);
