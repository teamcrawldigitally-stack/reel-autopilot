import React from "react";
import { AbsoluteFill } from "remotion";
import { deva, num } from "../../components/kit";
import { Finish, HANDLE, SheetBg } from "../../components/sheet";
import { G } from "../../theme";

/** Cover: everything inside the 3:4 grid crop (y 240–1680). */
export const Ep03Cover: React.FC = () => {
  const w = 76;
  const top = 1250;
  const rise = 46;
  return (
    <AbsoluteFill style={{ background: G.ink }}>
      <SheetBg />
      <div style={{ position: "absolute", top: 290, left: 84, right: 84, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, background: G.gold, borderRadius: 999, padding: "6px 28px 2px" }}>
          <div style={deva(44, G.ink, 800)}>गीता श्लोक सीरीज़</div>
          <div style={num(40, G.ink)}>· EP 03</div>
        </div>
        <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
          <div style={deva(40, G.dim, 700)}>गीता</div>
          <div style={num(40, G.gold)}>2.62–63</div>
        </div>
      </div>
      <div style={{ position: "absolute", top: 450, left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center" }}>
        <div style={deva(128)}>बर्बादी के</div>
        <div style={{ display: "flex", alignItems: "baseline", gap: 30, marginTop: -10 }}>
          <div style={{ ...num(300, G.gold), textShadow: "0 0 80px rgba(242,184,75,0.45)" }}>8</div>
          <div style={deva(170)}>कदम</div>
        </div>
        <div style={{ ...deva(96, G.white), background: G.red, borderRadius: 26, padding: "4px 36px 0", transform: "rotate(-3deg)", marginTop: 10, boxShadow: "0 0 80px rgba(255,90,95,0.45)" }}>गुस्सा सिर्फ़ चौथा</div>
      </div>
      {/* mini staircase */}
      <div style={{ position: "absolute", left: (1080 - 8 * w) / 2, top: 0 }}>
        {Array.from({ length: 8 }).map((_, i) => {
          const y = top + i * rise;
          const red = i === 3;
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                left: i * w + 2,
                top: y,
                width: w - 4,
                height: 1640 - y,
                borderRadius: "10px 10px 0 0",
                background: red ? "rgba(255,90,95,0.4)" : i < 3 ? "rgba(255,154,60,0.2)" : "rgba(255,244,223,0.06)",
                border: `2.5px solid ${red ? G.red : i < 3 ? "rgba(255,154,60,0.6)" : G.lineSoft}`,
                borderBottom: "none",
                boxShadow: red ? "0 0 40px rgba(255,90,95,0.55)" : undefined,
                boxSizing: "border-box",
                display: "flex",
                justifyContent: "center",
                paddingTop: 10,
                ...num(34, red ? G.white : G.dim),
              }}
            >
              {i + 1}
            </div>
          );
        })}
      </div>
      <div style={{ position: "absolute", left: 84, right: 84, top: 1640, height: 3, background: G.lineSoft }} />
      <div style={{ position: "absolute", right: 84, top: 1180, fontFamily: "Inter", fontWeight: 800, fontSize: 24, letterSpacing: "0.12em", color: G.dim }}>{HANDLE.toUpperCase()}</div>
      <Finish />
    </AbsoluteFill>
  );
};
