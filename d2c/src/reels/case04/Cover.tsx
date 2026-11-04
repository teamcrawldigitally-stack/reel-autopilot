import React from "react";
import { AbsoluteFill } from "remotion";
import { Parcel, Person, PRIYA, ROHIT } from "../../components/Cartoon";
import { LINE } from "../../components/format";
import { Grade, Grain, Logo, Vignette } from "../../components/kit";
import { Doorstep } from "../../components/sets";
import { C, theme } from "../../theme";

/** Cover: inside the 3:4 grid crop (y 240–1680). */
export const Case04Cover: React.FC = () => (
  <AbsoluteFill style={{ background: C.paper }}>
    <Doorstep />
    <div style={{ position: "absolute", top: 290, left: 84, right: 84, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 14, background: C.white, border: `3px solid ${LINE}`, borderRadius: 999, padding: "12px 24px 12px 20px", fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 32, letterSpacing: "0.1em", color: LINE, boxShadow: `5px 5px 0 ${LINE}` }}>
        <div style={{ width: 18, height: 18, borderRadius: "50%", background: C.red }} />
        CASE #04
      </div>
      <div style={{ background: C.white, borderRadius: 18, padding: "8px 12px" }}>
        <Logo width={180} />
      </div>
    </div>
    <div style={{ position: "absolute", top: 420, left: 50, right: 50, display: "flex", flexDirection: "column", alignItems: "center", gap: 18 }}>
      <div style={{ fontFamily: theme.fonts.display, fontWeight: 700, fontSize: 78, lineHeight: 1, color: LINE, background: C.white, border: `6px solid ${LINE}`, borderRadius: 22, padding: "16px 30px 2px", boxShadow: `6px 6px 0 ${LINE}`, transform: "rotate(2deg)" }}>Pehle order pe</div>
      <div style={{ fontFamily: theme.fonts.display, fontWeight: 700, fontSize: 150, lineHeight: 1, color: C.white, background: C.red, borderRadius: 30, padding: "22px 40px 2px", transform: "rotate(-4deg)", border: `8px solid ${LINE}`, boxShadow: `10px 10px 0 ${LINE}` }}>₹150 LOSS</div>
      <div style={{ fontFamily: theme.fonts.display, fontWeight: 700, fontSize: 92, lineHeight: 1, color: C.white, background: C.green, borderRadius: 24, padding: "18px 30px 2px", transform: "rotate(3deg)", border: `7px solid ${LINE}`, boxShadow: `8px 8px 0 ${LINE}`, marginTop: 22 }}>phir bhi PROFIT?</div>
    </div>
    <div style={{ position: "absolute", left: 90, top: 930, transform: "scale(0.88)", transformOrigin: "0 0" }}>
      <Person look={ROHIT} seed="cov" track={[{ at: -100, pose: "shrug", mood: "grin" }]} />
    </div>
    <div style={{ position: "absolute", left: 600, top: 920, transform: "scale(0.88)", transformOrigin: "0 0" }}>
      <Person
        look={PRIYA}
        seed="cov2"
        track={[{ at: -100, pose: "hold", mood: "happy" }]}
        prop={
          <g transform="translate(110 360)">
            <foreignObject x={0} y={0} width={240} height={220}>
              <Parcel w={200} tag="#3" />
            </foreignObject>
          </g>
        }
      />
    </div>
    <Grade />
    <Grain />
    <Vignette />
  </AbsoluteFill>
);
