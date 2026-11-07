import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { Person, PRIYA } from "../../components/Cartoon";
import { Doctor, PoseKey } from "../../components/Doctor";
import { Camera } from "../../components/fx";
import { CtaFlow, HookTitle, LINE, Place, makeMouth } from "../../components/format";
import { Card, Chip, SceneShell, Sfx, clamp } from "../../components/kit";
import { Clinic, Doorstep, MoneyRoom, Whiteboard } from "../../components/sets";
import { Stamp } from "../../components/widgets";
import { C, theme } from "../../theme";
import { Browser } from "../case28/scenes";
import { T, cue } from "./timeline";

const sceneMouth = makeMouth(T);
const TAG = "CASE #34";
const big = (size: number, color: string = LINE): React.CSSProperties => ({ fontFamily: theme.fonts.display, fontWeight: 700, fontSize: size, lineHeight: 1.05, color, whiteSpace: "nowrap" });
const body = (size: number, color: string = LINE): React.CSSProperties => ({ fontFamily: theme.fonts.body, fontWeight: 800, fontSize: size, color, whiteSpace: "nowrap" });

/** One search result. */
const Result: React.FC<{ ad?: boolean; site: string; title: string; hl?: string; p?: number; tap?: number }> = ({ ad = false, site, title, hl, p = 1, tap = 0 }) => (
  <div style={{ opacity: p, transform: `translateY(${(1 - p) * 24}px) scale(${1 - 0.03 * tap})`, background: hl ? `${hl}18` : C.white, border: `4px solid ${hl ?? "#D9D2EC"}`, borderRadius: 16, padding: "12px 16px 8px" }}>
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      {ad && <div style={{ ...body(18, LINE), background: "#FFD54A", border: `2px solid ${LINE}`, borderRadius: 6, padding: "2px 8px 0" }}>Sponsored</div>}
      <div style={body(24, C.muted)}>{site}</div>
    </div>
    <div style={{ ...big(40, hl === C.red ? C.red : C.violetDeep), marginTop: 6 }}>{title}</div>
  </div>
);

/** Google-style results page for "rohit's skin"; `adIn` 0..1 brings the competitor ad. */
export const Serp: React.FC<{ w?: number; typed?: number; adIn?: number; ownIn?: number; tap?: number }> = ({ w = 900, typed = 1, adIn = 1, ownIn = 1, tap = 0 }) => {
  const q = "rohit's skin";
  return (
    <Browser w={w} url="google.com">
      <div style={{ border: `4px solid ${LINE}`, borderRadius: 999, padding: "10px 22px 6px", ...big(36), marginBottom: 16 }}>
        {q.slice(0, Math.round(q.length * typed))}
        {typed < 1 && <span style={{ color: C.violet }}>|</span>}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <Result ad site="xyzskin.in" title="XYZ Skin · Serum pe 40% off" hl={C.red} p={adIn} tap={tap} />
        <Result site="rohitskin.in" title="Rohit's Skin · Official site" p={ownIn} />
      </div>
    </Browser>
  );
};

/* ===== S1: hook ===== */
export const S1Hook: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const upar = cue("s1", "upar");
  return (
    <SceneShell dur={dur} noExit>
      <Camera dur={dur} punches={[upar]} push={0.03}>
        <MoneyRoom />
        <HookTitle
          top={300}
          lines={[
            { text: "Naam Google kiya,", at: -8, kind: "plain", size: 84, rot: -1 },
            { text: "upar competitor ka ad!", at: -6, kind: "red", size: 70, rot: 2 },
          ]}
        />
        <div style={{ position: "absolute", left: 90, top: 690, zIndex: 6 }}>
          <Serp w={900} adIn={interpolate(frame, [upar - 8, upar + 2], [0.4, 1], clamp)} />
        </div>
      </Camera>
      <Sfx at={1} name="whoosh" vol={0.4} />
      <Sfx at={upar - 4} name="error" vol={0.4} />
    </SceneShell>
  );
};

/* ===== S2: Priya searches Rohit's brand ===== */
export const S2Search: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const dh = cue("s2", "dhoondha");
  const upar = cue("s2", "upar");
  return (
    <SceneShell dur={dur} noExit>
      <Camera dur={dur} punches={[upar]} push={0.02}>
        <Doorstep />
        <div style={{ position: "absolute", left: 160, top: 320, zIndex: 6 }}>
          <Serp w={860} typed={interpolate(frame, [dh - 14, dh + 4], [0, 1], clamp)} adIn={interpolate(frame, [upar - 6, upar + 4], [0, 1], clamp)} ownIn={interpolate(frame, [upar + 4, upar + 14], [0, 1], clamp)} />
        </div>
        <Place x={40} y={840} s={0.74} z={7}>
          <Person look={PRIYA} seed="p342" track={[{ at: -100, pose: "hold", mood: "neutral" }, { at: upar, pose: "hold", mood: "shock" }]} />
        </Place>
      </Camera>
      <Sfx at={dh - 14} name="key" vol={0.3} />
      <Sfx at={upar - 4} name="pop" vol={0.4} />
    </SceneShell>
  );
};

/* ===== S3: she taps the competitor; Rohit's customer, competitor's order ===== */
export const S3Gone: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const chali = cue("s3", "chali");
  const cust = cue("s3", "customer");
  const order = cue("s3", "order");
  const tap = interpolate(frame, [chali - 4, chali + 2, chali + 6], [0, 1, 0], clamp);
  return (
    <SceneShell dur={dur} noExit>
      <Camera dur={dur} punches={[order]} push={0.02}>
        <Doorstep />
        <div style={{ position: "absolute", left: 160, top: 320, zIndex: 6 }}>
          <Serp w={860} tap={tap} />
        </div>
        <div style={{ position: "absolute", left: 160, right: 60, top: 780, display: "flex", alignItems: "center", gap: 18, zIndex: 7 }}>
          <div style={{ opacity: interpolate(frame, [cust - 6, cust + 2], [0, 1], clamp) }}>
            <Card style={{ padding: "12px 20px 6px", border: `5px solid ${LINE}`, boxShadow: `6px 6px 0 ${LINE}`, ...big(40, C.violet) }}>Rohit ka customer</Card>
          </div>
          <div style={{ ...big(60, LINE), opacity: interpolate(frame, [order - 10, order - 4], [0, 1], clamp) }}>→</div>
          <div style={{ opacity: interpolate(frame, [order - 6, order + 2], [0, 1], clamp) }}>
            <Card style={{ padding: "12px 20px 6px", border: `5px solid ${LINE}`, boxShadow: `6px 6px 0 ${LINE}`, ...big(40, C.red) }}>competitor ka order</Card>
          </div>
        </div>
        <Place x={40} y={880} s={0.7} z={8}>
          <Person look={PRIYA} seed="p343" track={[{ at: -100, pose: "hold", mood: "happy" }]} />
        </Place>
        <div style={{ position: "absolute", left: 640, top: 1000, zIndex: 9 }}>
          <Stamp at={order + 4} text="ORDER GAYA" size={56} rotate={-6} />
        </div>
      </Camera>
      <Sfx at={chali - 2} name="pop" vol={0.4} />
      <Sfx at={order + 4} name="stamp" vol={0.45} />
    </SceneShell>
  );
};

/* ===== S4: competitors can bid on your name; your own name is cheap for you ===== */
export const S4Why: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const chala = cue("s4", "chala");
  const sasta = cue("s4", "sasta");
  const poses: PoseKey[] = [
    { at: -100, pose: "explain" },
    { at: chala - 4, pose: "stop" },
    { at: sasta - 4, pose: "thumbs" },
  ];
  const row = (t: string, tag: string, col: string, at: number) => (
    <div style={{ opacity: interpolate(frame, [at - 8, at], [0, 1], clamp), transform: `translateX(${interpolate(frame, [at - 8, at], [60, 0], clamp)}px)` }}>
      <Card style={{ width: 660, padding: "14px 22px 10px", border: `6px solid ${LINE}`, boxShadow: `6px 6px 0 ${LINE}`, boxSizing: "border-box" }}>
        <div style={{ fontFamily: theme.fonts.display, fontWeight: 700, fontSize: 40, lineHeight: 1.12, color: LINE }}>{t}</div>
        <div style={{ marginTop: 10, display: "inline-block", ...big(34, C.white), background: col, border: `4px solid ${LINE}`, borderRadius: 14, padding: "6px 14px 0" }}>{tag}</div>
      </Card>
    </div>
  );
  return (
    <SceneShell dur={dur} noExit>
      <Camera dur={dur} punches={[sasta]} push={0.02}>
        <Clinic />
        <div style={{ position: "absolute", left: 340, top: 360, display: "flex", flexDirection: "column", gap: 26, zIndex: 6 }}>
          {row("Competitor aapke naam pe ad chala sakta hai", "HO SAKTA HAI", C.red, chala)}
          {row("Aapke naam pe aapka khud ka ad", "SASTA PADTA HAI", C.green, sasta)}
        </div>
        <Place x={-140} y={930} s={0.9} z={4}>
          <Doctor poses={poses} mouth={sceneMouth("s4")} brows={[chala, sasta]} caseTag={TAG} />
        </Place>
      </Camera>
      <Sfx at={chala - 6} name="pop" vol={0.4} />
      <Sfx at={sasta - 6} name="ding" vol={0.4} />
    </SceneShell>
  );
};

/* ===== S5: three steps ===== */
export const S5Fixes: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const a = cue("s5", "chhota");
  const b = cue("s5", "google business profile");
  const c = cue("s5", "hafte");
  const marks = [a, b, c];
  const poses: PoseKey[] = [
    { at: -100, pose: "one" },
    { at: b - 6, pose: "two" },
    { at: c - 6, pose: "three" },
  ];
  const fixes = ["Brand naam pe chhota Google ad", "Google Business Profile banao", "Har hafte apna naam khud search"];
  return (
    <SceneShell dur={dur} noExit>
      <Camera dur={dur} push={0.02}>
        <Clinic />
        <Whiteboard style={{ left: 230, top: 300, width: 800, height: 640 }}>
          <div style={{ position: "absolute", left: 30, top: 24 }}>
            <Chip size={26} bg={C.green}>
              ILAAJ
            </Chip>
          </div>
          <div style={{ position: "absolute", left: 30, right: 30, top: 96, display: "flex", justifyContent: "center" }}>
            <div style={{ background: C.lavenderSoft, borderRadius: 14, padding: "10px 16px 6px", ...body(28, C.violetDeep) }}>Apna naam bachao</div>
          </div>
          <div style={{ position: "absolute", left: 40, right: 30, top: 190, display: "flex", flexDirection: "column", gap: 30 }}>
            {fixes.map((t, i) => {
              const p = interpolate(frame, [marks[i] - 6, marks[i] + 4], [0, 1], { ...clamp, easing: theme.ease.out });
              return (
                <div key={t} style={{ display: "flex", alignItems: "center", gap: 18, opacity: p, transform: `translateX(${(1 - p) * 60}px)` }}>
                  <div style={{ width: 64, height: 64, borderRadius: 16, background: C.green, border: `5px solid ${LINE}`, display: "flex", alignItems: "center", justifyContent: "center", ...big(40, C.white), paddingTop: 4, boxSizing: "border-box", flexShrink: 0 }}>✓</div>
                  <div style={{ fontFamily: theme.fonts.display, fontWeight: 700, fontSize: 40, lineHeight: 1.1, color: LINE }}>{t}</div>
                </div>
              );
            })}
          </div>
        </Whiteboard>
        <Place x={-120} y={930} s={0.92} z={4}>
          <Doctor poses={poses} mouth={sceneMouth("s5")} brows={marks} caseTag={TAG} />
        </Place>
      </Camera>
      <Sfx at={1} name="whoosh" vol={0.4} />
      {marks.map((m, i) => (
        <Sfx key={i} at={m - 5} name="check" vol={0.4} />
      ))}
    </SceneShell>
  );
};

/* ===== S6: CTA ===== */
const ShieldIcon: React.FC = () => (
  <svg width={92} height={92} viewBox="0 0 92 92">
    <rect x={8} y={8} width={76} height={76} rx={12} fill={C.white} stroke={LINE} strokeWidth={5} />
    <path d="M46 18 L70 28 V46 Q70 66 46 76 Q22 66 22 46 V28 Z" fill={C.violet} stroke={LINE} strokeWidth={4} strokeLinejoin="round" />
    <path d="M36 47 L44 55 L58 39" stroke={C.white} strokeWidth={6} fill="none" strokeLinecap="round" />
  </svg>
);

export const S6Cta: React.FC<{ dur: number }> = ({ dur }) => {
  const kw = cue("s6", "naam");
  const gift = cue("s6", "steps");
  const aaj = cue("s6", "aaj");
  const follow = cue("s6", "follow");
  const poses: PoseKey[] = [
    { at: -100, pose: "point" },
    { at: aaj - 2, pose: "explain" },
    { at: follow - 4, pose: "thumbs" },
  ];
  return (
    <SceneShell dur={dur} noExit>
      <Camera dur={dur} punches={[kw + 4]} push={0.02}>
        <Clinic plus={false} />
        <CtaFlow
          keyword="NAAM"
          typeAt={kw - 8}
          giftAt={gift - 6}
          giftTitle="Brand Bachane ke Steps"
          giftSub="free · Google pe apna naam apne paas"
          giftIcon={<ShieldIcon />}
          nextAt={aaj}
          nextNum="#35"
          nextLabel="AAJ SHAAM 7 BAJE · AGLA CASE"
          next={
            <div style={{ fontFamily: theme.fonts.display, fontWeight: 700, fontSize: 52, lineHeight: 1.12, color: LINE, textAlign: "center" }}>
              Ad mein aap nahi,
              <br />
              <span style={{ color: C.green }}>customer</span> kyun bole?
            </div>
          }
          followAt={follow}
        />
        <Place x={250} y={1010} s={0.96} z={4}>
          <Doctor poses={poses} mouth={sceneMouth("s6")} brows={[kw, aaj]} caseTag={TAG} />
        </Place>
      </Camera>
      {Array.from({ length: 4 }).map((_, i) => (
        <Sfx key={i} at={kw - 8 + i * 2} name="key" vol={0.4} />
      ))}
      <Sfx at={gift - 10} name="pop" vol={0.5} />
      <Sfx at={aaj - 4} name="whoosh" vol={0.45} />
      <Sfx at={follow + 12} name="pop" vol={0.55} />
      <Sfx at={follow + 15} name="ding" vol={0.45} />
    </SceneShell>
  );
};
