import React from "react";
import { AbsoluteFill } from "remotion";
import { Logo } from "../../components/kit";
import { C } from "../../theme";
import { BP, BlueprintBg, Coin, DarkFinish, big, label } from "../../components/hisaab";


/** Cover: inside the 3:4 grid crop (y 240–1680). */
export const Case15Cover: React.FC = () => {
  const cols = 10;
  const rows = 10;
  return (
    <AbsoluteFill style={{ background: C.navy }}>
      <BlueprintBg sheet="#15" />
      <div style={{ position: "absolute", top: 290, left: 84, right: 84, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14, background: "rgba(13,2,56,0.7)", border: `2.5px solid ${BP.line}`, borderRadius: 999, padding: "12px 26px 12px 20px", ...label(30, BP.text), letterSpacing: "0.1em" }}>
          <div style={{ width: 18, height: 18, borderRadius: "50%", background: BP.red }} />
          CASE #15
        </div>
        <div style={{ background: C.white, borderRadius: 16, padding: "6px 12px" }}>
          <Logo width={160} />
        </div>
      </div>
      <div style={{ position: "absolute", top: 440, left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
        <div style={label(34, BP.dim)}>ROAS</div>
        <div style={{ ...big(250, BP.green), textShadow: "0 0 70px rgba(43,212,107,0.4)" }}>3.0</div>
        <div style={big(92)}>phir bhi</div>
        <div style={{ ...big(150, C.white), background: C.red, borderRadius: 30, padding: "18px 44px 0", transform: "rotate(-3deg)", marginTop: 18, boxShadow: "0 0 80px rgba(229,72,77,0.45)" }}>LOSS?</div>
      </div>
      {/* mini tower with one row over the line */}
      <div style={{ position: "absolute", left: 390, top: 1180, width: 300, height: 330 }}>
        {Array.from({ length: cols * rows }).map((_, i) => {
          const r = Math.floor(i / cols);
          const c = i % cols;
          const tint = r === 0 ? "red" : r < 4 ? "ad" : "cost";
          return <Coin key={i} x={c * 30 + 2} y={r * 30 + 2} tint={tint} glow={r === 0 ? 1 : 0} />;
        })}
        <div style={{ position: "absolute", left: -70, top: 29, width: 440, borderTop: `4px dashed ${BP.green}` }} />
      </div>
      <div style={{ position: "absolute", left: 84, top: 1182, ...big(54, BP.red) }}>−₹1,000</div>
      <div style={{ position: "absolute", right: 84, top: 1226, ...label(22, BP.green) }}>SALE LINE</div>
      <DarkFinish />
    </AbsoluteFill>
  );
};
