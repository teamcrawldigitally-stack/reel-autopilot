import React from "react";
import { interpolate, random, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { Camera } from "../../../components/fx";
import { CheckIcon, CrossIcon } from "../../../components/icons";
import { Card, Chip, Enter, SceneShell, Sfx, clamp, useSpring } from "../../../components/kit";
import { Toggle } from "../../../components/widgets";
import { C, theme } from "../../../theme";
import { cue } from "../timeline";

const COLS = 15;
const N = 300;
const CELL = 26.5;
const DOT = 20;
const IDLE = "#E6DAFE";

type DotsProps = { ads: number; appearAt: number; adsAt: number; orgAt: number; offAt: number; pulseAt: number; seed: string };

const Dots: React.FC<DotsProps> = ({ ads, appearAt, adsAt, orgAt, offAt, pulseAt, seed }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <div style={{ position: "relative", width: COLS * CELL, height: (N / COLS) * CELL }}>
      {Array.from({ length: N }).map((_, i) => {
        const row = Math.floor(i / COLS);
        const col = i % COLS;
        const ap = spring({ frame: frame - appearAt - (row + col) * 0.45, fps, config: theme.spring.snappy });
        const isAds = i < ads;
        const ct = isAds ? frame - adsAt - i * 0.07 : frame - orgAt - (i - ads) * 0.25;
        const colored = ct >= 0;
        const cpop = colored && ct < 8 ? 1 + 0.35 * Math.sin((Math.PI * ct) / 8) : 1;
        let y = 0;
        let op = interpolate(ap, [0, 0.4], [0, 1], clamp);
        let rot = 0;
        if (isAds) {
          const t = frame - offAt - random(`${seed}${i}`) * 18;
          if (t > 0) {
            y = 0.85 * t * t + t * 2;
            op *= Math.max(0, 1 - t / 24);
            rot = t * (random(`${seed}r${i}`) * 20 - 10);
          }
        }
        const pt = frame - pulseAt - (i - ads) * 0.2;
        const pulse = !isAds && pt >= 0 && pt < 12 ? 1 + 0.45 * Math.sin((Math.PI * pt) / 12) : 1;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: col * CELL,
              top: row * CELL,
              width: DOT,
              height: DOT,
              borderRadius: "50%",
              background: colored ? (isAds ? C.violet : C.green) : IDLE,
              opacity: op,
              transform: `translateY(${y}px) rotate(${rot}deg) scale(${ap * cpop * pulse})`,
              boxShadow: colored && !isAds ? "0 0 10px rgba(22,163,74,0.35)" : undefined,
            }}
          />
        );
      })}
    </div>
  );
};

const BrandCard: React.FC<{
  name: string;
  ads: number;
  cues: { appear: number; ads: number; org: number; off: number; pulse: number; verdict: number };
  good: boolean;
  seed: string;
}> = ({ name, ads, cues, good, seed }) => {
  const frame = useCurrentFrame();
  const org = N - ads;
  const upCount = interpolate(frame, [cues.appear, cues.appear + 22], [0, N], { ...clamp, easing: theme.ease.out });
  const downCount = interpolate(frame, [cues.off + 2, cues.off + 26], [N, org], { ...clamp, easing: theme.ease.out });
  const total = Math.round(frame < cues.off ? upCount : downCount);
  const after = frame >= cues.off + 4;
  const v = useSpring(cues.verdict, "slam");
  const glow = good ? interpolate(frame, [cues.verdict, cues.verdict + 12], [0, 1], clamp) : 0;
  const dim = !good ? interpolate(frame, [cues.verdict, cues.verdict + 12], [0, 0.25], clamp) : 0;
  const adsN = Math.round(interpolate(frame, [cues.ads, cues.ads + 18], [0, ads], clamp));
  const orgN = Math.round(interpolate(frame, [cues.org, cues.org + 12], [0, org], clamp));
  return (
    <div style={{ position: "relative" }}>
      <Card glow={glow} style={{ width: 440, height: 760, boxSizing: "border-box", padding: "22px 21px", opacity: 1 - dim }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", height: 80 }}>
          <div style={{ fontFamily: theme.fonts.display, fontWeight: 700, fontSize: 44, color: C.navy }}>{name}</div>
          <div
            style={{
              fontFamily: theme.fonts.display,
              fontWeight: 700,
              fontSize: 70,
              lineHeight: 1,
              fontVariantNumeric: "tabular-nums",
              color: after ? (good ? C.green : C.red) : C.navy,
            }}
          >
            {total}
          </div>
        </div>
        <div style={{ marginTop: 6 }}>
          <Dots ads={ads} appearAt={cues.appear} adsAt={cues.ads} orgAt={cues.org} offAt={cues.off} pulseAt={cues.pulse} seed={seed} />
        </div>
        <div style={{ display: "flex", gap: 10, marginTop: 24 }}>
          <div
            style={{
              flex: 1,
              textAlign: "center",
              background: C.lavenderSoft,
              color: C.violetDeep,
              borderRadius: 14,
              padding: "12px 6px",
              fontFamily: theme.fonts.body,
              fontWeight: 800,
              fontSize: 26,
              opacity: frame >= cues.ads ? (after ? 0.35 : 1) : 0.3,
              textDecoration: after ? "line-through" : "none",
            }}
          >
            Ads se {adsN}
          </div>
          <div
            style={{
              flex: 1,
              textAlign: "center",
              background: C.greenSoft,
              color: C.green,
              borderRadius: 14,
              padding: "12px 6px",
              fontFamily: theme.fonts.body,
              fontWeight: 800,
              fontSize: 26,
              opacity: frame >= cues.org ? 1 : 0.3,
            }}
          >
            Bina ads {orgN}
          </div>
        </div>
      </Card>
      {/* verdict badge */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: 250,
          translate: "-50% 0",
          opacity: interpolate(v, [0, 0.3], [0, 1], clamp),
          transform: `scale(${interpolate(v, [0, 1], [1.8, 1])}) rotate(${good ? 4 : -4}deg)`,
          display: "flex",
          alignItems: "center",
          gap: 10,
          background: good ? C.green : C.red,
          color: C.white,
          borderRadius: 18,
          fontFamily: theme.fonts.display,
          fontWeight: 700,
          fontSize: 44,
          padding: "14px 24px 12px 16px",
          whiteSpace: "nowrap",
          boxShadow: "0 14px 30px -12px rgba(18,4,75,0.45)",
        }}
      >
        {good ? <CheckIcon size={50} bg={C.white} color={C.green} /> : <CrossIcon size={50} bg={C.white} color={C.red} />}
        {good ? "MAJBOOT" : "KAMZOR"}
      </div>
    </div>
  );
};

export const S3Dots: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const doBr = cue("s3", "do");
  const n300 = cue("s3", "300");
  const n270 = cue("s3", "270");
  const n30 = cue("s3", "30");
  const n180 = cue("s3", "180");
  const n120 = cue("s3", "120");
  const band = cue("s3", "band");
  const a30 = cue("s3", "30", 2);
  const b120 = cue("s3", "120", 2);
  const majboot = cue("s3", "majboot");
  const off = band + 2;
  const legend = useSpring(n270 - 6, "snappy");

  return (
    <SceneShell dur={dur} noExit>
      <Camera dur={dur} punches={[off, majboot]} push={0.02}>
        <div style={{ position: "absolute", left: theme.layout.padX, right: theme.layout.padX, top: 300, height: 100, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Enter delay={0} cfg="snappy" from="left">
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <Chip size={24} bg={C.lavenderSoft} color={C.violetDeep} style={{ alignSelf: "flex-start" }}>
                EXAMPLE · MAAN LO
              </Chip>
              <div style={{ fontFamily: theme.fonts.display, fontWeight: 700, fontSize: 46, color: C.navy, lineHeight: 1.1 }}>300 orders / mahina</div>
            </div>
          </Enter>
          <Enter delay={4} cfg="snappy" from="right">
            <Toggle offAt={off} w={170} label="ADS" />
          </Enter>
        </div>
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 418,
            display: "flex",
            justifyContent: "center",
            gap: 40,
            opacity: legend,
            transform: `translateY(${(1 - legend) * 16}px)`,
            fontFamily: theme.fonts.body,
            fontWeight: 700,
            fontSize: 28,
            color: C.navy,
          }}
        >
          <span style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ width: 22, height: 22, borderRadius: "50%", background: C.violet }} /> Ads se aaye
          </span>
          <span style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ width: 22, height: 22, borderRadius: "50%", background: C.green }} /> Bina ads ke
          </span>
        </div>
        <Enter delay={doBr - 2} from="left" dist={90} style={{ position: "absolute", left: theme.layout.padX, top: 475 }}>
          <BrandCard name="Brand A" ads={270} seed="a" good={false} cues={{ appear: n300 - 4, ads: n270, org: n30, off, pulse: a30, verdict: majboot + 4 }} />
        </Enter>
        <Enter delay={doBr + 4} from="right" dist={90} style={{ position: "absolute", left: 1080 - theme.layout.padX - 440, top: 475 }}>
          <BrandCard name="Brand B" ads={180} seed="b" good cues={{ appear: n300 - 1, ads: n180, org: n120, off, pulse: b120, verdict: majboot }} />
        </Enter>
      </Camera>
      <Sfx at={doBr - 3} name="whoosh" vol={0.45} />
      <Sfx at={n300 - 6} name="riser" vol={0.3} />
      {[0, 1, 2, 3, 4].map((i) => (
        <Sfx key={`a${i}`} at={n270 + i * 4} name="tick" vol={0.3} />
      ))}
      <Sfx at={n30} name="pop" vol={0.45} />
      {[0, 1, 2, 3].map((i) => (
        <Sfx key={`b${i}`} at={n180 + i * 4} name="tick" vol={0.3} />
      ))}
      <Sfx at={n120} name="pop" vol={0.45} />
      <Sfx at={off - 1} name="key" vol={0.9} />
      <Sfx at={off + 2} name="bass" vol={0.8} />
      <Sfx at={off + 4} name="whoosh" vol={0.5} />
      <Sfx at={a30} name="error" vol={0.35} />
      <Sfx at={b120} name="check" vol={0.45} />
      <Sfx at={majboot - 2} name="ding" vol={0.5} />
    </SceneShell>
  );
};
