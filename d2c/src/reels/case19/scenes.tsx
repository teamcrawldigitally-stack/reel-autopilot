import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { Parcel, Person, PRIYA, ROHIT } from "../../components/Cartoon";
import { Doctor, PoseKey } from "../../components/Doctor";
import { Camera } from "../../components/fx";
import { CtaFlow, HookTitle, LINE, Place, makeMouth } from "../../components/format";
import { Card, Chip, Enter, SceneShell, Sfx, clamp, useSpring } from "../../components/kit";
import { Bottle, QMarks } from "../../components/props";
import { Clinic, Doorstep, MoneyRoom, OfficeWall, Whiteboard } from "../../components/sets";
import { Stamp } from "../../components/widgets";
import { C, theme } from "../../theme";
import { T, cue } from "./timeline";

const sceneMouth = makeMouth(T);
const TAG = "CASE #19";
const big = (size: number, color: string = LINE): React.CSSProperties => ({ fontFamily: theme.fonts.display, fontWeight: 700, fontSize: size, lineHeight: 1.05, color, whiteSpace: "nowrap" });
const body = (size: number, color: string = LINE): React.CSSProperties => ({ fontFamily: theme.fonts.body, fontWeight: 800, fontSize: size, color, whiteSpace: "nowrap" });

/** Marigold toran (wedding garland) across the top. */
export const Toran: React.FC<{ y?: number; sag?: number }> = ({ y = 250, sag = 45 }) => {
  const f = useCurrentFrame();
  return (
    <svg width={1080} height={200} viewBox="0 0 1080 200" style={{ position: "absolute", left: 0, top: y, zIndex: 3 }}>
      <path d={`M-10 20 Q270 ${20 + sag * 2} 540 20 Q810 ${20 + sag * 2} 1090 20`} stroke="#2E7D32" strokeWidth={6} fill="none" />
      {Array.from({ length: 23 }).map((_, i) => {
        const x = -10 + i * 50;
        const t = (x + 10) / 550;
        const yy = i < 12 ? 20 + sag * Math.sin(Math.PI * t) : 20 + sag * Math.sin(Math.PI * ((x - 540) / 550));
        const sw = Math.sin(f / 14 + i) * 3;
        return (
          <g key={i} transform={`translate(${x} ${yy})`}>
            <line x1={0} y1={0} x2={sw} y2={44} stroke="#2E7D32" strokeWidth={3} />
            <circle cx={sw} cy={50} r={15} fill={i % 2 ? "#FFB020" : "#F07A1C"} stroke={LINE} strokeWidth={3} />
            <circle cx={sw} cy={50} r={6} fill="#FFE08A" />
          </g>
        );
      })}
    </svg>
  );
};

/** "20 NOV" calendar page. */
const DatePage: React.FC<{ w?: number }> = ({ w = 300 }) => (
  <div style={{ width: w, background: C.white, border: `7px solid ${LINE}`, borderRadius: 24, boxShadow: `8px 8px 0 ${LINE}`, overflow: "hidden", textAlign: "center" }}>
    <div style={{ background: C.red, ...body(w * 0.1, C.white), padding: "10px 0 6px", borderBottom: `6px solid ${LINE}` }}>NOVEMBER</div>
    <div style={{ ...big(w * 0.42), padding: "14px 0 0" }}>20</div>
    <div style={{ ...body(w * 0.08, C.violet), paddingBottom: 14 }}>ke baad · shaadi season</div>
  </div>
);

/* ===== S1: hook ===== */
export const S1Hook: React.FC<{ dur: number }> = ({ dur }) => {
  const shaadi = cue("s1", "shaadi season");
  const kahan = cue("s1", "kahan");
  return (
    <SceneShell dur={dur} noExit>
      <Camera dur={dur} punches={[shaadi, kahan]} push={0.03}>
        <MoneyRoom />
        <Toran y={215} />
        <HookTitle
          top={400}
          lines={[
            { text: "Shaadi season shuru,", at: -8, kind: "plain", size: 86, rot: -1 },
            { text: "aapka product kahan?", at: -6, kind: "violet", size: 84, rot: 2 },
          ]}
        />
        <Place x={300} y={760} s={0.72} z={6}>
          <Person look={ROHIT} seed="r191" track={[{ at: -100, pose: "hold", mood: "neutral" }, { at: kahan - 4, pose: "shrug", mood: "shock" }]} />
        </Place>
        <div style={{ position: "absolute", left: 640, top: 820, zIndex: 7 }}>
          <Enter delay={4} from="right">
            <Bottle level={0.8} w={150} />
          </Enter>
        </div>
        <div style={{ position: "absolute", left: 600, top: 760, width: 360, height: 280, zIndex: 7 }}>
          <QMarks at={kahan} />
        </div>
      </Camera>
      <Sfx at={1} name="whoosh" vol={0.4} />
      <Sfx at={kahan - 2} name="pop" vol={0.45} />
    </SceneShell>
  );
};

/* ===== S2: after 20 Nov: gift, kapde, makeup ===== */
export const S2Season: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const items: [string, string, number][] = [
    ["🎁", "GIFT", cue("s2", "gift")],
    ["👗", "KAPDE", cue("s2", "kapde")],
    ["💄", "MAKEUP", cue("s2", "makeup")],
  ];
  const shop = cue("s2", "shopping");
  return (
    <SceneShell dur={dur} noExit>
      <Camera dur={dur} punches={[shop]} push={0.02}>
        <Doorstep />
        <Toran y={215} />
        <div style={{ position: "absolute", left: 80, top: 390, zIndex: 6 }}>
          <Enter delay={0} from="left">
            <DatePage w={320} />
          </Enter>
        </div>
        <div style={{ position: "absolute", left: 470, top: 400, display: "flex", flexDirection: "column", gap: 20, zIndex: 6 }}>
          {items.map(([ic, t, at]) => {
            const p = interpolate(frame, [at - 8, at + 2], [0, 1], { ...clamp, easing: theme.ease.out });
            return (
              <div key={t} style={{ opacity: p, transform: `translateX(${(1 - p) * 70}px)` }}>
                <Card style={{ padding: "12px 24px 8px", border: `6px solid ${LINE}`, boxShadow: `6px 6px 0 ${LINE}`, display: "flex", alignItems: "center", gap: 14 }}>
                  <span style={{ fontSize: 50 }}>{ic}</span>
                  <span style={big(54)}>{t}</span>
                </Card>
              </div>
            );
          })}
        </div>
        <div style={{ position: "absolute", left: 680, top: 860, zIndex: 9 }}>
          <Stamp at={shop - 2} text="SABKI SHOPPING" size={52} rotate={-6} color={C.green} />
        </div>
        <Place x={140} y={820} s={0.74} z={5}>
          <Person look={PRIYA} seed="p192" track={[{ at: -100, pose: "hold", mood: "happy" }, { at: shop, pose: "cheer", mood: "grin" }]} />
        </Place>
      </Camera>
      {items.map(([, t, at]) => (
        <Sfx key={t} at={at - 6} name="pop" vol={0.4} />
      ))}
      <Sfx at={shop - 2} name="stamp" vol={0.45} />
    </SceneShell>
  );
};

/* ===== S3: Rohit thinks his serum isn't a wedding product ===== */
export const S3Doubt: React.FC<{ dur: number }> = ({ dur }) => {
  const serum = cue("s3", "serum");
  const nahi = cue("s3", "nahi");
  const bubble = useSpring(serum - 8, "bouncy");
  return (
    <SceneShell dur={dur} noExit>
      <Camera dur={dur} punches={[nahi]} push={0.02}>
        <OfficeWall />
        <div style={{ position: "absolute", left: 300, top: 330, zIndex: 7, transform: `scale(${bubble})`, transformOrigin: "20% 100%" }}>
          <Card style={{ padding: "22px 30px 14px", border: `6px solid ${LINE}`, boxShadow: `7px 7px 0 ${LINE}`, borderRadius: 40, display: "flex", alignItems: "center", gap: 20 }}>
            <Bottle level={0.8} w={110} />
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <div style={big(46)}>Mera serum?</div>
              <div style={big(46, C.red)}>Shaadi ka nahi...</div>
            </div>
          </Card>
        </div>
        <Place x={300} y={760} s={0.78} z={5}>
          <Person look={ROHIT} seed="r193" track={[{ at: -100, pose: "idle", mood: "neutral" }, { at: nahi - 2, pose: "shrug", mood: "sad" }]} />
        </Place>
      </Camera>
      <Sfx at={serum - 8} name="pop" vol={0.4} />
    </SceneShell>
  );
};

/* ===== S4: Doctor: GALAT — every product has a place ===== */
export const S4Galat: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const galat = cue("s4", "galat");
  const spots: [string, string, number][] = [
    ["👰", "Dulhan ki skin care", cue("s4", "dulhan")],
    ["🎁", "Mehmaanon ke gift", cue("s4", "mehmaanon")],
    ["🛍️", "Return gift", cue("s4", "return")],
  ];
  const jagah = cue("s4", "ek");
  const poses: PoseKey[] = [
    { at: -100, pose: "stop" },
    { at: spots[0][2] - 4, pose: "one" },
    { at: spots[1][2] - 4, pose: "two" },
    { at: spots[2][2] - 4, pose: "three" },
    { at: jagah, pose: "thumbs" },
  ];
  return (
    <SceneShell dur={dur} noExit>
      <Camera dur={dur} punches={[galat, jagah]} push={0.02}>
        <Clinic />
        <div style={{ position: "absolute", left: 640, top: 300, zIndex: 9 }}>
          <Stamp at={galat} text="GALAT" size={78} rotate={8} />
        </div>
        <div style={{ position: "absolute", left: 300, top: 420, display: "flex", flexDirection: "column", gap: 20, zIndex: 6 }}>
          {spots.map(([ic, t, at]) => {
            const p = interpolate(frame, [at - 8, at + 2], [0, 1], { ...clamp, easing: theme.ease.out });
            return (
              <div key={t} style={{ opacity: p, transform: `translateX(${(1 - p) * 80}px)` }}>
                <Card style={{ width: 640, padding: "14px 22px 10px", border: `6px solid ${LINE}`, boxShadow: `6px 6px 0 ${LINE}`, display: "flex", alignItems: "center", gap: 16, boxSizing: "border-box" }}>
                  <span style={{ fontSize: 48 }}>{ic}</span>
                  <span style={big(46)}>{t}</span>
                  <span style={{ marginLeft: "auto" }}>
                    <Bottle level={0.8} w={56} />
                  </span>
                </Card>
              </div>
            );
          })}
        </div>
        <Enter delay={jagah - 4} from="none" cfg="snappy" style={{ position: "absolute", left: 300, top: 900, zIndex: 8 }}>
          <Chip size={34} bg={C.green} color={C.white} border={LINE}>
            Har product ki ek jagah hai
          </Chip>
        </Enter>
        <Place x={-140} y={930} s={0.9} z={4}>
          <Doctor poses={poses} mouth={sceneMouth("s4")} brows={[galat, jagah]} caseTag={TAG} />
        </Place>
      </Camera>
      <Sfx at={galat} name="stamp" vol={0.55} />
      {spots.map(([, t, at]) => (
        <Sfx key={t} at={at - 6} name="pop" vol={0.4} />
      ))}
      <Sfx at={jagah - 4} name="ding" vol={0.4} />
    </SceneShell>
  );
};

/* ===== S5: three fixes ===== */
export const S5Fixes: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const a = cue("s5", "combo");
  const b = cue("s5", "packaging");
  const c = cue("s5", "ad");
  const marks = [a, b, c];
  const poses: PoseKey[] = [
    { at: -100, pose: "one" },
    { at: b - 6, pose: "two" },
    { at: c - 6, pose: "three" },
  ];
  const fixes = ["Shaadi wala combo banao", "Packaging gift jaisi karo", "Ad mein shaadi dikhao, sirf product nahi"];
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
            <div style={{ background: C.lavenderSoft, borderRadius: 14, padding: "10px 16px 6px", ...body(28, C.violetDeep) }}>Shaadi season · teen kaam</div>
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
          <div style={{ position: "absolute", right: 40, bottom: 26, opacity: interpolate(frame, [b, b + 10], [0, 1], clamp) }}>
            <Parcel w={150} ribbon tag="SHAADI COMBO" />
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
const GiftIcon: React.FC = () => (
  <svg width={92} height={92} viewBox="0 0 92 92">
    <rect x={10} y={36} width={72} height={48} rx={8} fill={C.violet} stroke={LINE} strokeWidth={5} />
    <rect x={6} y={24} width={80} height={18} rx={6} fill={C.lavender} stroke={LINE} strokeWidth={5} />
    <rect x={40} y={24} width={12} height={60} fill="#FFB020" stroke={LINE} strokeWidth={4} />
    <path d="M46 24 C30 4 16 18 34 24 M46 24 C62 4 76 18 58 24" stroke={LINE} strokeWidth={5} fill="#FFB020" />
  </svg>
);

export const S6Cta: React.FC<{ dur: number }> = ({ dur }) => {
  const kw = cue("s6", "shaadi");
  const gift = cue("s6", "das");
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
          keyword="SHAADI"
          typeAt={kw - 8}
          giftAt={gift - 10}
          giftTitle="Shaadi season ke 10 offer ideas"
          giftSub="free · combo, packaging, ad ideas"
          giftIcon={<GiftIcon />}
          nextAt={kal}
          nextNum="#20"
          nextLabel="KAL DOPAHAR 1 BAJE · AGLA CASE"
          next={
            <div style={{ fontFamily: theme.fonts.display, fontWeight: 700, fontSize: 52, lineHeight: 1.12, color: LINE, textAlign: "center" }}>
              Black Friday pe <span style={{ color: C.red }}>30% off</span>,
              <br />
              haath mein kitna bachega?
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
      <Sfx at={gift - 14} name="pop" vol={0.5} />
      <Sfx at={kal - 4} name="whoosh" vol={0.45} />
      <Sfx at={follow + 12} name="pop" vol={0.55} />
      <Sfx at={follow + 15} name="ding" vol={0.45} />
    </SceneShell>
  );
};
