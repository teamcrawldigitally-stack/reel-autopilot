import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { Camera } from "../../../components/fx";
import { LockIcon } from "../../../components/icons";
import { Card, Chip, Enter, SceneShell, Sfx, clamp, useFloat, useSpring } from "../../../components/kit";
import { C, theme } from "../../../theme";
import { cue } from "../timeline";

export const S2Loop: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const num = cue("s2", "number");
  const brand = cue("s2", "brand");
  const teen = cue("s2", "teen");
  const big = useSpring(num - 4, "slam");
  const fl = useFloat(2, 6);
  const ang = frame / 9;
  const mx = Math.cos(ang) * 150;
  const my = Math.sin(ang) * 70;
  const meter = interpolate(frame, [brand - 2, brand + 30], [0, 1], { ...clamp, easing: theme.ease.inOut });
  const meterOut = interpolate(frame, [teen - 8, teen - 1], [1, 0], clamp);
  const needle = -70 + 140 * (0.5 + 0.45 * Math.sin(frame / 6)) * meter;

  return (
    <SceneShell dur={dur} noExit>
      <Camera dur={dur} punches={[num]}>
        <div style={{ position: "absolute", left: 0, right: 0, top: 320, display: "flex", justifyContent: "center" }}>
          <Enter delay={0} cfg="snappy">
            <Chip size={34} bg={C.navy}>
              AAPKA &apos;APNA&apos; NUMBER
            </Chip>
          </Enter>
        </div>
        <Enter delay={2} style={{ position: "absolute", left: theme.layout.padX, top: 420 }}>
          <Card style={{ width: 912, height: 560, position: "relative", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div
              style={{
                fontFamily: theme.fonts.display,
                fontWeight: 700,
                fontSize: 330,
                lineHeight: 1,
                letterSpacing: "-0.04em",
                background: theme.grad.violet,
                WebkitBackgroundClip: "text",
                color: "transparent",
                opacity: interpolate(big, [0, 0.3], [0, 1], clamp),
                transform: `scale(${interpolate(big, [0, 1], [1.7, 1])}) translateY(${fl}px)`,
                paddingTop: 30,
              }}
            >
              ?%
            </div>
            {/* magnifier */}
            <svg width={190} height={190} viewBox="0 0 190 190" style={{ position: "absolute", left: 456 - 95 + mx, top: 280 - 95 + my, opacity: big }}>
              <circle cx="80" cy="80" r="58" fill="rgba(223,200,253,0.35)" stroke={C.navy} strokeWidth="12" />
              <path d="M124 124 L176 176" stroke={C.navy} strokeWidth="20" strokeLinecap="round" />
            </svg>
          </Card>
        </Enter>

        {/* brand meter */}
        <div style={{ position: "absolute", left: theme.layout.padX, top: 1010, opacity: meterOut }}>
        <Enter delay={brand - 4}>
          <Card style={{ width: 912, height: 220, boxSizing: "border-box", padding: "20px 34px", display: "flex", alignItems: "center", gap: 30 }}>
            <svg width={220} height={130} viewBox="0 0 220 130">
              <path d="M20 115 A90 90 0 0 1 200 115" fill="none" stroke="#EEE7FF" strokeWidth="22" strokeLinecap="round" />
              <path d="M20 115 A90 90 0 0 1 200 115" fill="none" stroke="url(#mg)" strokeWidth="22" strokeLinecap="round" strokeDasharray="283" strokeDashoffset={283 * (1 - meter)} />
              <defs>
                <linearGradient id="mg" x1="0" x2="1">
                  <stop offset="0" stopColor={C.red} />
                  <stop offset="0.5" stopColor="#F5B400" />
                  <stop offset="1" stopColor={C.green} />
                </linearGradient>
              </defs>
              <g transform={`translate(110 115) rotate(${needle})`}>
                <path d="M-5 0 L0 -80 L5 0 Z" fill={C.navy} />
                <circle r="12" fill={C.navy} />
              </g>
            </svg>
            <div style={{ fontFamily: theme.fonts.display, fontWeight: 700, fontSize: 52, lineHeight: 1.15, color: C.navy }}>
              Brand ban raha hai
              <br />
              <span style={{ color: C.muted }}>ya nahi?</span>
            </div>
          </Card>
        </Enter>
        </div>
      </Camera>

      {/* three locked fixes, revealed at "teen" */}
      {frame >= teen - 6 && (
        <div style={{ position: "absolute", left: 0, right: 0, top: 1010, display: "flex", justifyContent: "center", gap: 24, zIndex: 3 }}>
          {[1, 2, 3].map((n, i) => (
            <Enter key={n} delay={teen + i * 4} cfg="bouncy" dist={80}>
              <Card style={{ width: 200, height: 220, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 8 }}>
                <div style={{ fontFamily: theme.fonts.display, fontWeight: 700, fontSize: 96, lineHeight: 1, color: C.violet }}>{n}</div>
                <LockIcon size={48} />
              </Card>
            </Enter>
          ))}
          <Enter delay={teen + 14} from="none" scaleFrom={0.5} style={{ position: "absolute", top: -28, right: 120 }}>
            <Chip size={24} bg={C.green}>
              AAKHRI MEIN
            </Chip>
          </Enter>
        </div>
      )}
      <Sfx at={num - 6} name="whoosh" vol={0.45} />
      <Sfx at={num - 3} name="bass" vol={0.6} />
      <Sfx at={brand - 4} name="swish" vol={0.4} />
      {[0, 1, 2].map((i) => (
        <Sfx key={i} at={teen + i * 4 - 1} name="pop" vol={0.5} />
      ))}
    </SceneShell>
  );
};
