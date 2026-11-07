import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { Person, ROHIT } from "../../components/Cartoon";
import { Doctor, PoseKey } from "../../components/Doctor";
import { Camera } from "../../components/fx";
import { CtaFlow, HookTitle, LINE, Place, makeMouth } from "../../components/format";
import { Card, Chip, Enter, SceneShell, Sfx, clamp } from "../../components/kit";
import { Clinic, MoneyRoom, Whiteboard } from "../../components/sets";
import { Stamp } from "../../components/widgets";
import { C, theme } from "../../theme";
import { Browser } from "../case28/scenes";
import { T, cue } from "./timeline";

const sceneMouth = makeMouth(T);
const TAG = "CASE #31";
const big = (size: number, color: string = LINE): React.CSSProperties => ({ fontFamily: theme.fonts.display, fontWeight: 700, fontSize: size, lineHeight: 1.05, color, whiteSpace: "nowrap" });
const body = (size: number, color: string = LINE): React.CSSProperties => ({ fontFamily: theme.fonts.body, fontWeight: 800, fontSize: size, color, whiteSpace: "nowrap" });

const TINTS = ["#F9C6D0", "#C9E8FF", "#FFE6A8", "#D9F2D0", "#E6DAFF", "#FFD6BF"];

/** A small ad thumbnail card with a status dot and an age line. */
export const AdThumb: React.FC<{ w?: number; i?: number; age?: string; live?: boolean; hl?: number }> = ({ w = 250, i = 0, age = "", live = true, hl = 0 }) => (
  <div style={{ width: w, background: C.white, border: `5px solid ${LINE}`, borderRadius: 18, boxShadow: `${5 + hl * 4}px ${5 + hl * 4}px 0 ${hl > 0.5 ? C.green : LINE}`, overflow: "hidden", transform: `scale(${1 + hl * 0.06})` }}>
    <div style={{ height: w * 0.62, background: TINTS[i % TINTS.length], borderBottom: `4px solid ${LINE}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <svg width={w * 0.22} height={w * 0.5} viewBox="0 0 40 90">
        <rect x={14} y={0} width={12} height={10} rx={3} fill={LINE} />
        <rect x={6} y={10} width={28} height={78} rx={8} fill={C.white} stroke={LINE} strokeWidth={4} />
        <rect x={10} y={40} width={20} height={18} rx={3} fill={C.violet} />
      </svg>
    </div>
    <div style={{ padding: "8px 12px 6px", display: "flex", alignItems: "center", gap: 8 }}>
      <div style={{ width: 14, height: 14, borderRadius: "50%", background: live ? C.green : C.muted, border: `2px solid ${LINE}` }} />
      <div style={body(18, C.muted)}>{live ? "Active" : "Band"}</div>
      <div style={{ marginLeft: "auto", ...body(18, LINE) }}>{age}</div>
    </div>
  </div>
);

/** Ad Library page: search + grid of ads. */
const Library: React.FC<{ w?: number; typed?: number; show?: number; hl?: number[] }> = ({ w = 900, typed = 1, show = 1, hl = [] }) => {
  const name = "XYZ Skin";
  const ages = ["3 mahine", "2 hafte", "5 mahine", "4 din", "1 mahina", "6 din"];
  return (
    <Browser w={w} url="facebook.com/ads/library">
      <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 16 }}>
        <div style={big(36, C.violetDeep)}>Meta Ad Library</div>
        <div style={{ flex: 1, background: "#F4F1FC", border: `3px solid ${LINE}`, borderRadius: 999, padding: "8px 18px 4px", ...body(28) }}>
          {name.slice(0, Math.round(name.length * typed))}
          {typed < 1 && <span style={{ color: C.violet }}>|</span>}
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
        {ages.map((a, i) => {
          const p = interpolate(show * 6 - i, [0, 1], [0, 1], clamp);
          return (
            <div key={i} style={{ opacity: p, transform: `translateY(${(1 - p) * 30}px)` }}>
              <AdThumb w={(w - 36 - 32) / 3} i={i} age={a} hl={hl[i] ?? 0} />
            </div>
          );
        })}
      </div>
    </Browser>
  );
};

/* ===== S1: hook ===== */
export const S1Hook: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const free = cue("s1", "free");
  return (
    <SceneShell dur={dur} noExit>
      <Camera dur={dur} punches={[free]} push={0.03}>
        <MoneyRoom />
        <HookTitle
          top={300}
          lines={[
            { text: "Competitor ke ads?", at: -8, kind: "plain", size: 84, rot: -1 },
            { text: "Free, 2 minute mein", at: -6, kind: "green", size: 92, rot: 2 },
          ]}
        />
        <div style={{ position: "absolute", left: 90, top: 690, zIndex: 6 }}>
          <Library w={900} typed={1} show={interpolate(frame, [0, 24], [0.2, 1], clamp)} />
        </div>
      </Camera>
      <Sfx at={1} name="whoosh" vol={0.4} />
      <Sfx at={free - 4} name="ding" vol={0.4} />
    </SceneShell>
  );
};

/* ===== S2: Rohit wonders which ads the competitor runs ===== */
export const S2Wonder: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const comp = cue("s2", "competitor");
  const chal = cue("s2", "chal");
  return (
    <SceneShell dur={dur} noExit>
      <Camera dur={dur} push={0.02}>
        <MoneyRoom />
        <div style={{ position: "absolute", left: 430, top: 400, zIndex: 6, opacity: interpolate(frame, [comp - 8, comp], [0, 1], clamp), transform: `scale(${interpolate(frame, [comp - 8, comp + 4], [0.8, 1], clamp)})` }}>
          <Card style={{ padding: "18px 22px", border: `6px solid ${LINE}`, boxShadow: `8px 8px 0 ${LINE}` }}>
            <div style={{ ...body(26, C.muted), marginBottom: 12 }}>XYZ Skin ke ads</div>
            <div style={{ display: "flex", gap: 14 }}>
              {[0, 1, 2].map((i) => (
                <div key={i} style={{ position: "relative" }}>
                  <AdThumb w={175} i={i + 2} age="?" />
                  <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", ...big(90, C.violet), opacity: interpolate(frame, [chal - 6 + i * 3, chal + i * 3], [0, 1], clamp) }}>?</div>
                </div>
              ))}
            </div>
          </Card>
        </div>
        <Place x={120} y={760} s={0.8} z={5}>
          <Person look={ROHIT} seed="r312" track={[{ at: -100, pose: "idle", mood: "neutral" }, { at: comp, pose: "shrug", mood: "neutral" }]} />
        </Place>
      </Camera>
      <Sfx at={comp - 6} name="pop" vol={0.4} />
      <Sfx at={chal - 4} name="tick" vol={0.35} />
    </SceneShell>
  );
};

/* ===== S3: Ad Library → name → all active ads ===== */
export const S3Library: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const lib = cue("s3", "meta ad library");
  const naam = cue("s3", "naam");
  const saare = cue("s3", "saare");
  return (
    <SceneShell dur={dur} noExit>
      <Camera dur={dur} punches={[saare]} push={0.02}>
        <MoneyRoom />
        <div style={{ position: "absolute", left: 90, top: 330, zIndex: 6, opacity: interpolate(frame, [lib - 8, lib], [0, 1], clamp), transform: `translateY(${interpolate(frame, [lib - 8, lib + 4], [50, 0], clamp)}px)` }}>
          <Library w={900} typed={interpolate(frame, [naam - 10, naam + 10], [0, 1], clamp)} show={interpolate(frame, [saare - 6, saare + 18], [0, 1], clamp)} />
        </div>
        <Enter delay={saare + 10} from="none" cfg="snappy" style={{ position: "absolute", left: 0, right: 0, top: 1060, display: "flex", justifyContent: "center", zIndex: 8 }}>
          <Chip size={36} bg={C.green} color={LINE} border={LINE}>
            Saare chalu ads · free
          </Chip>
        </Enter>
      </Camera>
      <Sfx at={lib - 6} name="whoosh" vol={0.4} />
      <Sfx at={naam - 8} name="key" vol={0.35} />
      <Sfx at={saare - 4} name="pop" vol={0.45} />
    </SceneShell>
  );
};

/* ===== S4: an ad running for months is working ===== */
export const S4Old: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const mahino = cue("s4", "mahino");
  const kaam = cue("s4", "kaam");
  const band = cue("s4", "band");
  const poses: PoseKey[] = [
    { at: -100, pose: "explain" },
    { at: kaam - 4, pose: "point" },
    { at: band, pose: "think" },
  ];
  return (
    <SceneShell dur={dur} noExit>
      <Camera dur={dur} punches={[kaam]} push={0.02}>
        <Clinic />
        <div style={{ position: "absolute", left: 330, top: 400, display: "flex", gap: 30, zIndex: 6 }}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14, opacity: interpolate(frame, [mahino - 8, mahino], [0, 1], clamp) }}>
            <AdThumb w={320} i={2} age="5 mahine" hl={interpolate(frame, [kaam - 6, kaam + 4], [0, 1], clamp)} />
            <div style={body(28, C.green)}>5 mahine se chalu</div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14, opacity: interpolate(frame, [band - 8, band], [0, 1], clamp) }}>
            <AdThumb w={320} i={3} age="4 din" live={false} />
            <div style={body(28, C.muted)}>kharab ad jaldi band</div>
          </div>
        </div>
        <div style={{ position: "absolute", left: 470, top: 880, zIndex: 9 }}>
          <Stamp at={kaam} text="KAAM KAR RAHA" size={56} rotate={-6} color={C.green} />
        </div>
        <Place x={-140} y={930} s={0.9} z={4}>
          <Doctor poses={poses} mouth={sceneMouth("s4")} brows={[mahino, kaam]} caseTag={TAG} />
        </Place>
      </Camera>
      <Sfx at={mahino - 6} name="pop" vol={0.4} />
      <Sfx at={kaam} name="stamp" vol={0.45} />
      <Sfx at={band - 6} name="pop" vol={0.35} />
    </SceneShell>
  );
};

/* ===== S5: three steps ===== */
export const S5Fixes: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const a = cue("s5", "dhoondho");
  const b = cue("s5", "purane");
  const c = cue("s5", "angle");
  const marks = [a, b, c];
  const poses: PoseKey[] = [
    { at: -100, pose: "one" },
    { at: b - 6, pose: "two" },
    { at: c - 6, pose: "three" },
  ];
  const fixes = ["Ad Library mein competitor ka page", "Sabse purane chalu ads note karo", "Angle samjho, copy kabhi nahi"];
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
            <div style={{ background: C.lavenderSoft, borderRadius: 14, padding: "10px 16px 6px", ...body(28, C.violetDeep) }}>Competitor se seekho · free</div>
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
const GuideIcon: React.FC = () => (
  <svg width={92} height={92} viewBox="0 0 92 92">
    <rect x={8} y={8} width={76} height={76} rx={12} fill={C.white} stroke={LINE} strokeWidth={5} />
    <circle cx={40} cy={40} r={16} stroke={C.violet} strokeWidth={7} fill="none" />
    <line x1={52} y1={52} x2={70} y2={70} stroke={C.violet} strokeWidth={8} strokeLinecap="round" />
  </svg>
);

export const S6Cta: React.FC<{ dur: number }> = ({ dur }) => {
  const kw = cue("s6", "spy");
  const gift = cue("s6", "guide");
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
          keyword="SPY"
          typeAt={kw - 8}
          giftAt={gift - 6}
          giftTitle="Ad Library Guide"
          giftSub="free · competitor ke ads kaise padhein"
          giftIcon={<GuideIcon />}
          nextAt={kal}
          nextNum="#32"
          nextLabel="KAL DOPAHAR 1 BAJE · AGLA CASE"
          next={
            <div style={{ fontFamily: theme.fonts.display, fontWeight: 700, fontSize: 52, lineHeight: 1.12, color: LINE, textAlign: "center" }}>
              Jo ad chal raha tha,
              <br />
              achanak <span style={{ color: C.red }}>mehenga</span> kyun?
            </div>
          }
          followAt={follow}
        />
        <Place x={250} y={1010} s={0.96} z={4}>
          <Doctor poses={poses} mouth={sceneMouth("s6")} brows={[kw, kal]} caseTag={TAG} />
        </Place>
      </Camera>
      {Array.from({ length: 3 }).map((_, i) => (
        <Sfx key={i} at={kw - 8 + i * 2} name="key" vol={0.4} />
      ))}
      <Sfx at={gift - 10} name="pop" vol={0.5} />
      <Sfx at={kal - 4} name="whoosh" vol={0.45} />
      <Sfx at={follow + 12} name="pop" vol={0.55} />
      <Sfx at={follow + 15} name="ding" vol={0.45} />
    </SceneShell>
  );
};
