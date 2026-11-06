import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { deva, num } from "../../components/kit";
import { Finish, HANDLE, SheetBg } from "../../components/sheet";
import { G } from "../../theme";

/** Cover: everything inside the 3:4 grid crop (y 240–1680). */
export const Ep03Cover: React.FC = () => (
  <AbsoluteFill style={{ background: G.ink }}>
    <SheetBg />
    {/* angry man, red glow */}
    <div style={{ position: "absolute", left: 540 - 480, top: 640, width: 960, height: 960, borderRadius: "50%", background: "radial-gradient(circle, rgba(255,60,70,0.45), transparent 66%)" }} />
    <Img src={staticFile("img/man-angry-cut.png")} style={{ position: "absolute", left: 540 - (1060 * 690) / 1714 / 2, top: 640, height: 1060, filter: "drop-shadow(0 0 50px rgba(255,60,70,0.7))" }} />
    <div style={{ position: "absolute", left: 0, right: 0, top: 1310, height: 400, background: `linear-gradient(180deg, transparent, ${G.ink} 70%)` }} />

    <div style={{ position: "absolute", top: 280, left: 84, right: 84, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, background: G.gold, borderRadius: 999, padding: "6px 28px 2px" }}>
        <div style={deva(44, G.ink, 800)}>गीता श्लोक सीरीज़</div>
        <div style={num(40, G.ink)}>· EP 03</div>
      </div>
      <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
        <div style={deva(40, G.cream, 700)}>गीता</div>
        <div style={num(40, G.gold)}>2.62–63</div>
      </div>
    </div>
    <div style={{ position: "absolute", top: 380, left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center", textShadow: "0 8px 40px rgba(0,0,0,0.9)" }}>
      <div style={{ display: "flex", alignItems: "baseline", gap: 26 }}>
        <div style={deva(124)}>बर्बादी के</div>
        <div style={{ ...num(190, G.gold), textShadow: "0 0 80px rgba(242,184,75,0.55)" }}>8</div>
        <div style={deva(124)}>कदम</div>
      </div>
    </div>
    <div style={{ position: "absolute", top: 1380, left: 0, right: 0, display: "flex", justifyContent: "center" }}>
      <div style={{ ...deva(104, G.white), background: G.red, borderRadius: 26, padding: "4px 38px 0", transform: "rotate(-3deg)", boxShadow: "0 0 80px rgba(255,90,95,0.5)" }}>गुस्सा सिर्फ़ चौथा</div>
    </div>
    <div style={{ position: "absolute", left: 0, right: 0, top: 1560, textAlign: "center", fontFamily: "Inter", fontWeight: 800, fontSize: 26, letterSpacing: "0.12em", color: G.dim }}>{HANDLE.toUpperCase()}</div>
    <Finish />
  </AbsoluteFill>
);
