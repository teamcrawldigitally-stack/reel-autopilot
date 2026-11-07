import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { Person, PRIYA, ROHIT } from "../../components/Cartoon";
import { Doctor, PoseKey } from "../../components/Doctor";
import { Camera } from "../../components/fx";
import { CtaFlow, HookTitle, LINE, Place, makeMouth } from "../../components/format";
import { Card, Chip, Enter, SceneShell, Sfx, clamp, inr } from "../../components/kit";
import { Clinic, Doorstep, MoneyRoom, Whiteboard } from "../../components/sets";
import { Stamp } from "../../components/widgets";
import { C, theme } from "../../theme";
import { T, cue } from "./timeline";

const sceneMouth = makeMouth(T);
const TAG = "CASE #27";
const big = (size: number, color: string = LINE): React.CSSProperties => ({ fontFamily: theme.fonts.display, fontWeight: 700, fontSize: size, lineHeight: 1.05, color, whiteSpace: "nowrap" });
const body = (size: number, color: string = LINE): React.CSSProperties => ({ fontFamily: theme.fonts.body, fontWeight: 800, fontSize: size, color, whiteSpace: "nowrap" });

/** 1,000 visitors as a 40×25 dot field; the first `buy` dots green, the rest fade by `fade` (0..1). */
export const Crowd: React.FC<{ w?: number; buy?: number; fade?: number; show?: number }> = ({ w = 900, buy = 10, fade = 0, show = 1 }) => {
  const cols = 40;
  const s = w / cols;
  const greens = new Set(Array.from({ length: buy }, (_, i) => (i * 97 + 13) % 1000));
  return (
    <div style={{ width: w, display: "grid", gridTemplateColumns: `repeat(${cols}, ${s}px)`, rowGap: 4 }}>
      {Array.from({ length: 1000 }).map((_, i) => {
        const g = greens.has(i);
        const vis = i / 1000 < show;
        return <div key={i} style={{ width: s * 0.62, height: s * 0.62, borderRadius: "50%", background: g ? C.green : C.violet, opacity: vis ? (g ? 1 : 1 - 0.75 * fade) : 0, border: g ? `2px solid ${LINE}` : undefined, boxSizing: "border-box" }} />;
      })}
    </div>
  );
};

/* ===== S1: hook ===== */
export const S1Hook: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const das = cue("s1", "das");
  const baaki = cue("s1", "nau sau nabbe");
  return (
    <SceneShell dur={dur} noExit>
      <Camera dur={dur} punches={[baaki]} push={0.03}>
        <MoneyRoom />
        <HookTitle
          top={300}
          lines={[
            { text: "1,000 aaye, 10 ne liya,", at: -8, kind: "plain", size: 74, rot: -1 },
            { text: "baaki 990?", at: -6, kind: "red", size: 108, rot: 2 },
          ]}
        />
        <div style={{ position: "absolute", left: 90, top: 700, zIndex: 6 }}>
          <Card style={{ padding: 22, border: `6px solid ${LINE}`, boxShadow: `8px 8px 0 ${LINE}` }}>
            <Crowd w={856} buy={frame >= das - 4 ? 10 : 0} fade={interpolate(frame, [baaki - 6, baaki + 10], [0, 1], clamp)} />
          </Card>
        </div>
      </Camera>
      <Sfx at={1} name="whoosh" vol={0.4} />
      <Sfx at={das - 4} name="ding" vol={0.4} />
      <Sfx at={baaki - 4} name="swish" vol={0.4} />
    </SceneShell>
  );
};

/* ===== S2: ₹10,000 ad → 1,000 visitors → 10 orders ===== */
export const S2Funnel: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const ad = cue("s2", "das hazaar");
  const log = cue("s2", "hazaar");
  const ord = cue("s2", "das");
  const box = (t: string, v: string, col: string, at: number) => (
    <div style={{ opacity: interpolate(frame, [at - 8, at], [0, 1], clamp), transform: `scale(${interpolate(frame, [at - 8, at], [0.8, 1], clamp)})` }}>
      <Card style={{ width: 290, padding: "14px 14px 8px", border: `6px solid ${LINE}`, boxShadow: `6px 6px 0 ${LINE}`, textAlign: "center", boxSizing: "border-box" }}>
        <div style={body(24, C.muted)}>{t}</div>
        <div style={big(70, col)}>{v}</div>
      </Card>
    </div>
  );
  return (
    <SceneShell dur={dur} noExit>
      <Camera dur={dur} punches={[ord]} push={0.02}>
        <MoneyRoom />
        <Enter delay={0} from="none" cfg="snappy" style={{ position: "absolute", left: 0, right: 0, top: 292, display: "flex", justifyContent: "center", zIndex: 8 }}>
          <Chip size={28} bg={C.violet} color={C.white} border={LINE}>
            MAAN LO · EXAMPLE
          </Chip>
        </Enter>
        <div style={{ position: "absolute", left: 50, right: 50, top: 380, display: "flex", justifyContent: "space-between", alignItems: "center", zIndex: 6 }}>
          {box("AD", "₹10,000", C.red, ad)}
          <div style={{ ...big(60, C.violet), opacity: interpolate(frame, [log - 10, log - 4], [0, 1], clamp) }}>→</div>
          {box("VISITORS", inr(interpolate(frame, [log - 4, log + 12], [0, 1000], clamp)), C.violet, log)}
          <div style={{ ...big(60, C.violet), opacity: interpolate(frame, [ord - 10, ord - 4], [0, 1], clamp) }}>→</div>
          {box("ORDER", "10", C.green, ord)}
        </div>
        <Place x={300} y={760} s={0.78} z={5}>
          <Person look={ROHIT} seed="r272" track={[{ at: -100, pose: "megaphone", mood: "shout" }, { at: ord, pose: "cheer", mood: "happy" }]} />
        </Place>
      </Camera>
      <Sfx at={ad - 6} name="pop" vol={0.4} />
      <Sfx at={log - 4} name="tick" vol={0.35} />
      <Sfx at={ord - 4} name="ding" vol={0.4} />
    </SceneShell>
  );
};

/* ===== S3: 990 saw it, liked it, stopped ===== */
export const S3Stopped: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const pasand = cue("s3", "pasand");
  const ruk = cue("s3", "ruk");
  return (
    <SceneShell dur={dur} noExit>
      <Camera dur={dur} punches={[ruk]} push={0.02}>
        <Doorstep />
        <Enter delay={0} from="down" style={{ position: "absolute", left: 0, right: 0, top: 300, display: "flex", justifyContent: "center", zIndex: 7 }}>
          <Card style={{ padding: "12px 28px 6px", border: `6px solid ${LINE}`, boxShadow: `6px 6px 0 ${LINE}`, ...big(60) }}>
            Baaki <span style={{ color: C.violet }}>990</span>
          </Card>
        </Enter>
        <div style={{ position: "absolute", left: 620, top: 520, zIndex: 8, fontSize: 120, opacity: interpolate(frame, [pasand - 6, pasand + 2], [0, 1], clamp), transform: `scale(${interpolate(frame, [pasand - 6, pasand + 4], [0.5, 1], clamp)})` }}>❤️</div>
        <div style={{ position: "absolute", left: 640, top: 800, zIndex: 9 }}>
          <Stamp at={ruk} text="RUK GAYE ⏸" size={60} rotate={-6} />
        </div>
        <Place x={180} y={780} s={0.78} z={5}>
          <Person look={PRIYA} seed="p273" track={[{ at: -100, pose: "hold", mood: "neutral" }, { at: pasand, pose: "hold", mood: "happy" }, { at: ruk, pose: "shrug", mood: "neutral" }]} />
        </Place>
      </Camera>
      <Sfx at={pasand - 6} name="pop" vol={0.4} />
      <Sfx at={ruk} name="stamp" vol={0.45} />
    </SceneShell>
  );
};

/* ===== S4: calling them back is the cheapest ===== */
export const S4Cheap: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const sasta = cue("s4", "sasta");
  const pehle = cue("s4", "pehle");
  const poses: PoseKey[] = [
    { at: -100, pose: "explain" },
    { at: sasta - 4, pose: "point" },
    { at: pehle, pose: "thumbs" },
  ];
  const row = (t: string, sub: string, tag: string, col: string, at: number) => (
    <div style={{ opacity: interpolate(frame, [at - 8, at], [0, 1], clamp), transform: `translateX(${interpolate(frame, [at - 8, at], [60, 0], clamp)}px)` }}>
      <Card style={{ width: 660, padding: "14px 22px 10px", border: `6px solid ${LINE}`, boxShadow: `6px 6px 0 ${LINE}`, display: "flex", alignItems: "center", gap: 18, boxSizing: "border-box" }}>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <span style={big(44)}>{t}</span>
          <span style={body(24, C.muted)}>{sub}</span>
        </div>
        <span style={{ marginLeft: "auto", ...big(44, C.white), background: col, border: `4px solid ${LINE}`, borderRadius: 14, padding: "8px 16px 2px" }}>{tag}</span>
      </Card>
    </div>
  );
  return (
    <SceneShell dur={dur} noExit>
      <Camera dur={dur} punches={[sasta]} push={0.02}>
        <Clinic />
        <div style={{ position: "absolute", left: 340, top: 360, display: "flex", flexDirection: "column", gap: 24, zIndex: 6 }}>
          {row("Naya insaan", "pehli baar dekhega", "MEHENGA", C.red, 6)}
          {row("990 visitors", "product dekh chuke", "SASTA", C.green, sasta - 2)}
        </div>
        <Enter delay={pehle - 4} from="none" cfg="snappy" style={{ position: "absolute", left: 340, top: 700, zIndex: 8 }}>
          <Chip size={32} bg={C.violet} color={C.white} border={LINE}>
            Yeh aapko pehle se jaante hain
          </Chip>
        </Enter>
        <Place x={-140} y={930} s={0.9} z={4}>
          <Doctor poses={poses} mouth={sceneMouth("s4")} brows={[sasta, pehle]} caseTag={TAG} />
        </Place>
      </Camera>
      <Sfx at={4} name="pop" vol={0.4} />
      <Sfx at={sasta - 4} name="ding" vol={0.4} />
    </SceneShell>
  );
};

/* ===== S5: three steps ===== */
export const S5Fixes: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const a = cue("s5", "alag");
  const b = cue("s5", "review");
  const c = cue("s5", "khareed");
  const marks = [a, b, c];
  const poses: PoseKey[] = [
    { at: -100, pose: "one" },
    { at: b - 6, pose: "two" },
    { at: c - 6, pose: "three" },
  ];
  const fixes = ["14 din ke visitors ke liye alag ad", "Review ya offer dikhao, purana ad nahi", "Jo khareed chuke, unhe hatao"];
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
            <div style={{ background: C.lavenderSoft, borderRadius: 14, padding: "10px 16px 6px", ...body(28, C.violetDeep) }}>990 ko wapas bulao · retargeting</div>
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
const StepsIcon: React.FC = () => (
  <svg width={92} height={92} viewBox="0 0 92 92">
    <rect x={8} y={8} width={76} height={76} rx={12} fill={C.white} stroke={LINE} strokeWidth={5} />
    <path d="M20 70 H36 V54 H52 V38 H68 V22" stroke={C.violet} strokeWidth={7} fill="none" strokeLinejoin="round" />
    <circle cx={68} cy={22} r={7} fill={C.green} stroke={LINE} strokeWidth={3} />
  </svg>
);

export const S6Cta: React.FC<{ dur: number }> = ({ dur }) => {
  const kw = cue("s6", "retarget");
  const gift = cue("s6", "setup");
  const kal = cue("s6", "kal");
  const follow = cue("s6", "follow");
  const poses: PoseKey[] = [
    { at: -100, pose: "point" },
    { at: kal - 2, pose: "explain" },
    { at: follow - 4, pose: "thumbs" },
  ];
  return (
    <SceneShell dur={dur} noExit>
      <Camera dur={dur} punches={[kw + 4]} push={0.02}>
        <Clinic plus={false} />
        <CtaFlow
          keyword="RETARGET"
          typeAt={kw - 8}
          giftAt={gift - 6}
          giftTitle="Retargeting setup, step-by-step"
          giftSub="free · Meta Ads Manager mein"
          giftIcon={<StepsIcon />}
          nextAt={kal}
          nextNum="#28"
          nextLabel="KAL DOPAHAR 1 BAJE · AGLA CASE"
          next={
            <div style={{ fontFamily: theme.fonts.display, fontWeight: 700, fontSize: 52, lineHeight: 1.12, color: LINE, textAlign: "center" }}>
              Ad ka click <span style={{ color: C.red }}>homepage</span> pe
              <br />
              kyun nahi bhejna?
            </div>
          }
          followAt={follow}
        />
        <Place x={250} y={1010} s={0.96} z={4}>
          <Doctor poses={poses} mouth={sceneMouth("s6")} brows={[kw, kal]} caseTag={TAG} />
        </Place>
      </Camera>
      {Array.from({ length: 4 }).map((_, i) => (
        <Sfx key={i} at={kw - 8 + i * 2} name="key" vol={0.4} />
      ))}
      <Sfx at={gift - 10} name="pop" vol={0.5} />
      <Sfx at={kal - 4} name="whoosh" vol={0.45} />
      <Sfx at={follow + 12} name="pop" vol={0.55} />
      <Sfx at={follow + 15} name="ding" vol={0.45} />
    </SceneShell>
  );
};
