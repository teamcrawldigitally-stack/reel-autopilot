import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { AdTile } from "../../../components/AdTile";
import { ChangeHeader } from "../../../components/ChangeHeader";
import { BoltIcon, PersonIcon } from "../../../components/icons";
import { Card, Chip, Enter, SceneShell, Sfx, clamp, inr, useFloat, useRamp, useSpring } from "../../../components/kit";
import { C, theme } from "../../../theme";
import { cue, cueEnd } from "../timeline";

const TINTS = ["#DFC8FD", "#FFD9C2", "#C9F0DA", "#CFE0FF", "#FFE7A8", "#F7C9DE"];
const PICK = [1, 6, 10];
const TW = 78;
const GAP = 12;
const GX = 84;
const GY = 660;

const Diagram: React.FC<{ andro: number; chunta: number }> = ({ andro, chunta }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pick = spring({ frame: frame - chunta, fps, config: theme.spring.smooth });
  const box = useSpring(andro + 8, "bouncy");
  const person = useSpring(andro + 14, "bouncy");
  const spin = frame * 4;
  const fl = useFloat(1, 4);
  return (
    <>
      {/* arrow grid -> box -> person */}
      <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0 }}>
        <path
          d="M352 873 L412 873"
          stroke={C.violet}
          strokeWidth={6}
          strokeLinecap="round"
          strokeDasharray="8 12"
          opacity={box}
        />
        <path d="M688 873 L728 873" stroke={C.violet} strokeWidth={6} strokeLinecap="round" strokeDasharray="8 12" opacity={pick} />
      </svg>
      {Array.from({ length: 12 }).map((_, i) => {
        const col = i % 3;
        const row = Math.floor(i / 3);
        const x0 = GX + col * (TW + GAP);
        const y0 = GY + row * (TW * 1.25 + GAP);
        const k = PICK.indexOf(i);
        const isPick = k >= 0;
        const x1 = 742;
        const y1 = 700 + k * (TW * 1.25 + 14);
        const x = isPick ? interpolate(pick, [0, 1], [x0, x1]) : x0;
        const y = isPick ? interpolate(pick, [0, 1], [y0, y1]) : y0;
        const p = spring({ frame: frame - andro - i * 1.5, fps, config: theme.spring.snappy });
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x,
              top: y,
              opacity: interpolate(p, [0, 0.4], [0, 1], clamp),
              transform: `scale(${interpolate(p, [0, 1], [0.5, 1]) * (isPick ? 1 + 0.08 * pick : 1)})`,
              zIndex: isPick ? 2 : 1,
              filter: isPick && pick > 0.3 ? `drop-shadow(0 0 ${14 * pick}px rgba(109,74,253,0.6))` : undefined,
            }}
          >
            <AdTile w={TW} tint={TINTS[i % TINTS.length]} dim={isPick ? 0 : 0.7 * pick} />
          </div>
        );
      })}
      {/* Andromeda box */}
      <div
        style={{
          position: "absolute",
          left: 416,
          top: 798,
          width: 268,
          height: 150,
          borderRadius: 28,
          background: theme.grad.violet,
          boxShadow: `0 20px 50px -18px ${C.glow}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
          opacity: interpolate(box, [0, 0.4], [0, 1], clamp),
          transform: `scale(${interpolate(box, [0, 1], [0.6, 1])}) translateY(${fl}px)`,
        }}
      >
        <div
          style={{
            position: "absolute",
            width: 360,
            height: 360,
            background: "conic-gradient(from 0deg, transparent 0 70%, rgba(255,255,255,0.35) 85%, transparent 100%)",
            transform: `rotate(${spin}deg)`,
          }}
        />
        <div style={{ position: "relative", fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 32, letterSpacing: "0.08em", color: C.white }}>ANDROMEDA</div>
      </div>
      {/* Person */}
      <div
        style={{
          position: "absolute",
          left: 868,
          top: 790,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 12,
          opacity: interpolate(person, [0, 0.4], [0, 1], clamp),
          transform: `scale(${interpolate(person, [0, 1], [0.5, 1])})`,
        }}
      >
        <PersonIcon size={128} />
        <Chip size={22} bg={C.lavenderSoft} color={C.navy}>
          1 INSAAN
        </Chip>
      </div>
    </>
  );
};

export const S3Speed: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const andro = cue("s3", "andromeda");
  const chunta = cue("s3", "chunta");
  const naya = cue("s3", "naya");
  const second = cue("s3", "second");
  const check = cueEnd("s3", "check");
  const pichhle = cue("s3", "pichhle");
  const x100 = cue("s3", "100x");

  const out = useRamp(naya - 6, naya + 4, "in");
  const count = interpolate(frame, [second, Math.max(second + 24, check)], [0, 1], { ...clamp, easing: theme.ease.out });
  const bar = useSpring(pichhle + 6, "smooth");
  const badge = useSpring(x100 - 1, "slam");

  return (
    <SceneShell dur={dur}>
      <ChangeHeader n={1} title="Speed" icon={<BoltIcon size={96} />} />

      {frame < naya + 6 && (
        <div style={{ position: "absolute", inset: 0, opacity: 1 - out, transform: `translateY(${-60 * out}px)` }}>
          <Diagram andro={andro} chunta={chunta} />
        </div>
      )}

      {frame >= naya - 2 && (
        <>
          <Enter delay={naya} style={{ position: "absolute", left: theme.layout.padX, top: 600 }}>
            <Card style={{ width: 912, height: 370, boxSizing: "border-box", padding: "34px 36px", display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
              <Chip size={26} bg={C.lavenderSoft} color={C.violetDeep}>
                NAYA VERSION · 1 SERVER
              </Chip>
              <div
                style={{
                  fontFamily: theme.fonts.body,
                  fontWeight: 800,
                  fontSize: 92,
                  letterSpacing: "-0.03em",
                  color: C.navy,
                  fontVariantNumeric: "tabular-nums",
                  lineHeight: 1.05,
                  marginTop: 6,
                }}
              >
                {inr(1_00_00_00_000 * count)}
                <span style={{ color: C.violet, opacity: count > 0.98 ? 1 : 0 }}>+</span>
              </div>
              <div style={{ fontFamily: theme.fonts.display, fontWeight: 700, fontSize: 46, color: C.violet }}>ads har second</div>
              <div style={{ fontFamily: theme.fonts.body, fontWeight: 600, fontSize: 24, color: C.muted, marginTop: "auto" }}>
                Source: Engineering at Meta · 28 Oct 2026
              </div>
            </Card>
          </Enter>
          <Enter delay={pichhle} style={{ position: "absolute", left: theme.layout.padX, top: 1006 }}>
            <Card style={{ width: 912, height: 230, boxSizing: "border-box", padding: "30px 36px", display: "flex", flexDirection: "column", justifyContent: "center", gap: 26 }}>
              {[
                { label: "2024", w: 7, color: C.muted, bg: "rgba(18,4,75,0.35)" },
                { label: "2.0", w: 470 * bar, color: C.violet, bg: theme.grad.violet },
              ].map((r, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 24 }}>
                  <div style={{ width: 110, fontFamily: theme.fonts.display, fontWeight: 700, fontSize: 40, color: r.color }}>{r.label}</div>
                  <div style={{ width: Math.max(7, r.w), height: 54, borderRadius: 14, background: r.bg }} />
                  {i === 1 && (
                    <div
                      style={{
                        marginLeft: 6,
                        opacity: interpolate(badge, [0, 0.3], [0, 1], clamp),
                        transform: `scale(${interpolate(badge, [0, 1], [2, 1])}) rotate(-4deg)`,
                        background: C.navy,
                        color: C.white,
                        fontFamily: theme.fonts.display,
                        fontWeight: 700,
                        fontSize: 52,
                        lineHeight: 1,
                        padding: "14px 20px 6px",
                        borderRadius: 18,
                      }}
                    >
                      100x
                    </div>
                  )}
                </div>
              ))}
            </Card>
          </Enter>
        </>
      )}

      <Sfx at={andro - 2} name="swish" vol={0.4} />
      <Sfx at={chunta - 1} name="whoosh" vol={0.45} />
      <Sfx at={naya - 3} name="whoosh" vol={0.5} />
      {Array.from({ length: 8 }).map((_, i) => (
        <Sfx key={i} at={second + i * 3} name="tick" vol={0.35} />
      ))}
      <Sfx at={pichhle + 4} name="riser" vol={0.35} />
      <Sfx at={x100 - 2} name="bass" vol={0.75} />
    </SceneShell>
  );
};
