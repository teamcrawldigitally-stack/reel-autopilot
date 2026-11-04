import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { AdTile } from "../../../components/AdTile";
import { Chip, Enter, Headline, SceneShell, Sfx, clamp, useSpring } from "../../../components/kit";
import { C, theme } from "../../../theme";
import { cue } from "../timeline";

const TINTS = ["#DFC8FD", "#FFD9C2", "#C9F0DA", "#CFE0FF", "#FFE7A8", "#F7C9DE", "#DFC8FD"];

const Feed: React.FC<{ scroll: number }> = ({ scroll }) => (
  <div style={{ position: "absolute", left: 30, top: 70 - scroll, display: "flex", flexDirection: "column", gap: 26 }}>
    {TINTS.map((t, i) => (
      <div key={i} style={{ position: "relative" }}>
        <AdTile w={432} tint={t} />
        <div
          style={{
            position: "absolute",
            right: 22,
            top: 26,
            fontFamily: theme.fonts.body,
            fontWeight: 700,
            fontSize: 20,
            color: C.violet,
            background: C.lavenderSoft,
            borderRadius: 99,
            padding: "6px 12px",
          }}
        >
          Sponsored
        </div>
      </div>
    ))}
  </div>
);

export const S1Hook: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const ruko = cue("s1", "ruko");
  const meta = cue("s1", "meta");
  const badal = cue("s1", "badal");

  // Feed scrolls, then freezes when RUKO lands.
  const scroll = interpolate(frame, [0, ruko + 3], [0, (ruko + 3) * 11], { ...clamp, easing: theme.ease.soft });
  const stamp = useSpring(ruko - 1, "slam");
  const shakeT = frame - ruko;
  const shake = shakeT >= 0 && shakeT < 14 ? Math.sin(shakeT * 2.7) * 16 * Math.exp(-shakeT / 4) : 0;
  const flash = interpolate(shakeT, [0, 2, 10], [0, 0.16, 0], clamp);

  // Phone shrinks down when the headline arrives.
  const pm = useSpring(meta - 2, "smooth");
  const phoneScale = interpolate(pm, [0, 1], [1, 0.53]);
  const phoneY = interpolate(pm, [0, 1], [0, 240]);
  const date = useSpring(badal, "slam");

  return (
    <SceneShell dur={dur}>
      <AbsoluteFill style={{ transform: `translate(${shake}px, ${shake * 0.4}px)` }}>
        {/* Phone */}
        <div
          style={{
            position: "absolute",
            left: (1080 - 520) / 2,
            top: 330,
            width: 520,
            height: 930,
            transform: `translateY(${phoneY}px) scale(${phoneScale})`,
            transformOrigin: "50% 50%",
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: 0,
              borderRadius: 74,
              background: C.paperDeep,
              border: `14px solid ${C.navy}`,
              overflow: "hidden",
              boxShadow: "0 40px 80px -30px rgba(18,4,75,0.45)",
            }}
          >
            <Feed scroll={scroll} />
            <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: 60, background: C.navy, opacity: 0.95 }} />
            <div style={{ position: "absolute", left: 170, top: 14, width: 150, height: 30, borderRadius: 99, background: "#000" }} />
            <AbsoluteFill style={{ background: C.red, opacity: flash }} />
          </div>
          {/* RUKO stamp */}
          <div
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              top: 330,
              display: "flex",
              justifyContent: "center",
              opacity: interpolate(stamp, [0, 0.25], [0, 1], clamp),
              transform: `scale(${interpolate(stamp, [0, 1], [2.6, 1])}) rotate(-11deg)`,
            }}
          >
            <div
              style={{
                fontFamily: theme.fonts.display,
                fontWeight: 700,
                fontSize: 150,
                lineHeight: 1,
                letterSpacing: "0.04em",
                color: C.red,
                border: `12px solid ${C.red}`,
                borderRadius: 30,
                padding: "26px 40px 8px",
                background: "rgba(255,255,255,0.88)",
                boxShadow: "0 20px 50px -20px rgba(229,72,77,0.6)",
              }}
            >
              RUKO
            </div>
          </div>
        </div>

        {/* Headline block */}
        <div style={{ position: "absolute", left: theme.layout.padX, right: theme.layout.padX, top: 300, display: "flex", flexDirection: "column", alignItems: "center", gap: 22 }}>
          <Enter delay={meta - 2} cfg="snappy">
            <Chip bg={C.violet} size={34} style={{ background: theme.grad.violet, boxShadow: `0 10px 30px -10px ${C.glow}` }}>
              META ADS UPDATE
            </Chip>
          </Enter>
          <Headline text="Aapka ad kise dikhega?" delay={meta + 2} size={104} hl={["kise"]} />
          <Enter delay={meta + 12}>
            <div style={{ fontFamily: theme.fonts.body, fontWeight: 600, fontSize: 46, color: C.muted }}>Naya system tay karega</div>
          </Enter>
        </div>

        {/* Date stamp */}
        <div
          style={{
            position: "absolute",
            right: 150,
            top: 760,
            opacity: interpolate(date, [0, 0.25], [0, 1], clamp),
            transform: `scale(${interpolate(date, [0, 1], [2, 1])}) rotate(8deg)`,
          }}
        >
          <div
            style={{
              fontFamily: theme.fonts.body,
              fontWeight: 800,
              fontSize: 34,
              letterSpacing: "0.12em",
              color: C.violet,
              border: `5px solid ${C.violet}`,
              borderRadius: 14,
              padding: "12px 18px",
              background: "rgba(255,255,255,0.9)",
              textAlign: "center",
              lineHeight: 1.15,
            }}
          >
            LAUNCH
            <br />
            28 OCT 2026
          </div>
        </div>
      </AbsoluteFill>
      <Sfx at={0} name="swish" vol={0.45} />
      <Sfx at={ruko - 2} name="stamp" vol={0.9} />
      <Sfx at={meta - 4} name="whoosh" vol={0.55} />
      <Sfx at={badal - 1} name="stamp" vol={0.4} />
    </SceneShell>
  );
};
