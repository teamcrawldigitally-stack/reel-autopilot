import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { CheckIcon, CursorIcon, PdfIcon, SendIcon } from "../../../components/icons";
import { Card, Chip, Enter, Headline, Logo, SceneShell, Sfx, clamp, useFloat, useRamp, useSpring } from "../../../components/kit";
import { C, theme } from "../../../theme";
import { cue } from "../timeline";

const WORD = "ANDROMEDA";

export const S8Cta: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const andro = cue("s8", "andromeda");
  const dm = cue("s8", "dm");
  const das = cue("s8", "10");
  const kal = cue("s8", "kal");
  const zero = cue("s8", "zero?");
  const follow = cue("s8", "follow");

  const typeStart = andro - 6;
  const typed = Math.max(0, Math.min(WORD.length, Math.floor((frame - typeStart) / 2)));
  const caret = Math.floor(frame / 8) % 2 === 0;
  const sent = useSpring(typeStart + WORD.length * 2 + 4, "bouncy");
  const outA = useRamp(kal - 6, kal + 4, "in");
  const chart = interpolate(frame, [kal + 6, zero + 6], [0, 1], { ...clamp, easing: theme.ease.inOut });
  const zeroHit = useSpring(zero, "slam");
  const btn = useSpring(follow - 8, "bouncy");
  const cursorIn = interpolate(frame, [follow - 4, follow + 10], [0, 1], { ...clamp, easing: theme.ease.out });
  const press = frame >= follow + 12 && frame < follow + 16 ? 0.94 : 1;
  const followed = frame >= follow + 14;
  const tick = interpolate(frame, [follow + 14, follow + 28], [0, 1], clamp);
  const fl = useFloat(5, 4);

  return (
    <SceneShell dur={dur} noExit>
      {/* Beat A: comment + DM */}
      {frame < kal + 6 && (
        <div style={{ position: "absolute", inset: 0, opacity: 1 - outA, transform: `translateY(${-60 * outA}px)` }}>
          <div style={{ position: "absolute", left: 0, right: 0, top: 320, display: "flex", justifyContent: "center" }}>
            <Enter delay={0} cfg="snappy">
              <Chip bg={C.violet} size={34} style={{ background: theme.grad.violet }}>
                FREE · 10 CREATIVE ANGLES
              </Chip>
            </Enter>
          </div>
          <Enter delay={2} style={{ position: "absolute", left: theme.layout.padX, top: 430 }}>
            <Card style={{ width: 912, height: 140, boxSizing: "border-box", padding: "0 30px", display: "flex", alignItems: "center", gap: 22 }}>
              <div style={{ width: 70, height: 70, borderRadius: "50%", background: C.lavender, flex: "0 0 70px" }} />
              <div
                style={{
                  flex: 1,
                  height: 82,
                  borderRadius: 41,
                  border: `3px solid rgba(18,4,75,0.15)`,
                  display: "flex",
                  alignItems: "center",
                  padding: "0 28px",
                  fontFamily: theme.fonts.body,
                  fontWeight: 800,
                  fontSize: 46,
                  letterSpacing: "0.04em",
                  color: typed ? C.navy : C.muted,
                }}
              >
                {typed ? WORD.slice(0, typed) : <span style={{ fontWeight: 500, fontSize: 36, letterSpacing: 0 }}>Add a comment…</span>}
                {typed > 0 && typed < WORD.length && caret && <span style={{ width: 4, height: 50, background: C.violet, marginLeft: 4 }} />}
              </div>
              <div style={{ transform: `scale(${1 + 0.25 * Math.sin(Math.PI * sent)}) rotate(${-20 * sent}deg)` }}>
                <SendIcon size={60} color={typed === WORD.length ? C.violet : C.lavender} />
              </div>
            </Card>
          </Enter>

          {/* DM bubble */}
          {frame >= Math.min(das, dm) - 8 && (
            <Enter delay={Math.min(das, dm) - 4} from="right" dist={120} style={{ position: "absolute", left: theme.layout.padX, top: 640 }}>
              <Card style={{ width: 912, boxSizing: "border-box", padding: "30px 32px", display: "flex", flexDirection: "column", gap: 22 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                  <div style={{ width: 70, height: 70, borderRadius: "50%", background: C.white, border: `3px solid ${C.lavender}`, display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
                    <Logo width={58} />
                  </div>
                  <div style={{ fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 34, color: C.navy }}>d2cfounders</div>
                  <Chip size={22} bg={C.lavenderSoft} color={C.violetDeep} style={{ marginLeft: "auto" }}>
                    DM
                  </Chip>
                </div>
                <div
                  style={{
                    alignSelf: "flex-start",
                    background: C.paperDeep,
                    borderRadius: "34px 34px 34px 10px",
                    padding: "26px 30px",
                    display: "flex",
                    alignItems: "center",
                    gap: 24,
                    transform: `translateY(${fl}px)`,
                  }}
                >
                  <PdfIcon size={86} />
                  <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                    <div style={{ fontFamily: theme.fonts.display, fontWeight: 700, fontSize: 50, lineHeight: 1.1, color: C.navy }}>10 Creative Angles</div>
                    <div style={{ fontFamily: theme.fonts.body, fontWeight: 700, fontSize: 30, color: C.green }}>free · 1-page PDF</div>
                  </div>
                </div>
              </Card>
            </Enter>
          )}
        </div>
      )}

      {/* Beat B: tomorrow's case */}
      {frame >= kal - 2 && (
        <>
          <div style={{ position: "absolute", left: theme.layout.padX, right: theme.layout.padX, top: 320, display: "flex", flexDirection: "column", alignItems: "center", gap: 26 }}>
            <Enter delay={kal} cfg="snappy">
              <Chip size={34} bg={C.navy}>
                KAL KA CASE
              </Chip>
            </Enter>
            <Headline text="Ads band, sales zero?" delay={kal + 4} size={110} hl={["zero"]} />
          </div>
          <Enter delay={kal + 4} style={{ position: "absolute", left: theme.layout.padX, top: 650 }}>
            <Card style={{ width: 912, height: 340, boxSizing: "border-box", padding: "26px 30px", position: "relative" }}>
              <div style={{ fontFamily: theme.fonts.body, fontWeight: 700, fontSize: 28, color: C.muted }}>Daily sales</div>
              <svg width={852} height={250} viewBox="0 0 852 250" style={{ position: "absolute", left: 30, top: 70 }}>
                <line x1="0" y1="230" x2="852" y2="230" stroke="rgba(18,4,75,0.15)" strokeWidth="3" />
                <path
                  d="M0 120 L120 95 L240 110 L360 70 L480 85 L560 80 L620 200 L700 228 L852 228"
                  fill="none"
                  stroke={C.red}
                  strokeWidth="9"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeDasharray="1200"
                  strokeDashoffset={1200 * (1 - chart)}
                />
                <line x1="575" y1="20" x2="575" y2="230" stroke={C.navy} strokeWidth="3" strokeDasharray="8 10" opacity={chart > 0.55 ? 1 : 0} />
                <text x="590" y="40" fontFamily="Inter" fontWeight="800" fontSize="26" fill={C.navy} opacity={chart > 0.55 ? 1 : 0}>
                  ADS OFF
                </text>
              </svg>
              <div
                style={{
                  position: "absolute",
                  right: 34,
                  bottom: 64,
                  opacity: interpolate(zeroHit, [0, 0.3], [0, 1], clamp),
                  transform: `scale(${interpolate(zeroHit, [0, 1], [2, 1])}) rotate(-6deg)`,
                  background: C.red,
                  color: C.white,
                  fontFamily: theme.fonts.display,
                  fontWeight: 700,
                  fontSize: 48,
                  padding: "12px 22px 4px",
                  borderRadius: 16,
                }}
              >
                ₹0
              </div>
            </Card>
          </Enter>
        </>
      )}

      {/* Beat C: follow */}
      {frame >= follow - 10 && (
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 1060,
            display: "flex",
            justifyContent: "center",
            opacity: interpolate(btn, [0, 0.4], [0, 1], clamp),
            transform: `translateY(${interpolate(btn, [0, 1], [60, 0])}px) scale(${press})`,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 20,
              background: followed ? C.white : theme.grad.violet,
              color: followed ? C.navy : C.white,
              border: followed ? `4px solid ${C.navy}` : "4px solid transparent",
              fontFamily: theme.fonts.display,
              fontWeight: 700,
              fontSize: 54,
              padding: "26px 52px 18px",
              borderRadius: 999,
              boxShadow: followed ? "0 18px 40px -20px rgba(18,4,75,0.4)" : `0 24px 60px -18px ${C.glow}`,
            }}
          >
            {followed && <CheckIcon size={52} draw={tick} />}
            {followed ? "Following" : "Follow"} @d2cfounders
          </div>
          <div
            style={{
              position: "absolute",
              left: 800,
              top: 66,
              opacity: cursorIn,
              transform: `translate(${(1 - cursorIn) * 220}px, ${(1 - cursorIn) * 260}px) scale(${press})`,
            }}
          >
            <CursorIcon size={86} />
          </div>
        </div>
      )}

      <Sfx at={1} name="whoosh" vol={0.4} />
      {Array.from({ length: WORD.length }).map((_, i) => (
        <Sfx key={i} at={typeStart + i * 2} name="key" vol={0.35} />
      ))}
      <Sfx at={typeStart + WORD.length * 2 + 3} name="swish" vol={0.4} />
      <Sfx at={Math.min(das, dm) - 6} name="pop" vol={0.5} />
      <Sfx at={kal - 4} name="whoosh" vol={0.5} />
      <Sfx at={zero - 2} name="stamp" vol={0.6} />
      <Sfx at={follow + 12} name="pop" vol={0.6} />
      <Sfx at={follow + 15} name="ding" vol={0.45} />
    </SceneShell>
  );
};
