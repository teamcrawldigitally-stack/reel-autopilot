import React from "react";
import { AbsoluteFill } from "remotion";
import { AB, AstroLogo, Coin, Finish, SheetBg, big, lab } from "../../components/astroHisaab";

/** Cover: inside the 3:4 grid crop (y 240–1680). */
export const Astro01Cover: React.FC = () => (
  <AbsoluteFill style={{ background: AB.ink }}>
    <SheetBg sheet="धन हिसाब #1" />
    <div style={{ position: "absolute", top: 290, left: 84, right: 84, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 14, background: "rgba(11,5,2,0.72)", border: `2.5px solid ${AB.line}`, borderRadius: 999, padding: "10px 26px 8px 20px", ...lab(32, AB.text) }}>
        <div style={{ width: 18, height: 18, borderRadius: "50%", background: AB.orange }} />
        धन हिसाब #1
      </div>
      <AstroLogo scale={1.1} />
    </div>
    <div style={{ position: "absolute", top: 440, left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 0 }}>
      <div style={lab(40, AB.dim)}>सैलरी</div>
      <div style={{ ...big(230, AB.green), textShadow: "0 0 70px rgba(43,212,107,0.4)" }}>₹30,000</div>
      <div style={big(96)}>फिर भी आख़िर में</div>
      <div style={{ ...big(170, "#fff"), background: AB.red, borderRadius: 30, padding: "8px 48px 0", transform: "rotate(-3deg)", marginTop: 24, boxShadow: "0 0 80px rgba(229,72,77,0.45)" }}>₹0?</div>
    </div>
    <div style={{ position: "absolute", left: 390, top: 1260, width: 300, height: 300 }}>
      {Array.from({ length: 100 }).map((_, i) => {
        const r = Math.floor(i / 10);
        const c = i % 10;
        return <Coin key={i} x={c * 30 + 2} y={r * 30 + 2} tint={r < 2 ? "red" : r < 5 ? "cream" : r < 7 ? "deep" : "orange"} glow={r < 2 ? 0.8 : 0} />;
      })}
    </div>
    <div style={{ position: "absolute", left: 84, top: 1300, ...big(54, AB.orange) }}>दिवाली</div>
    <div style={{ position: "absolute", left: 84, top: 1370, ...big(54, AB.orange) }}>उपाय</div>
    <Finish />
  </AbsoluteFill>
);
