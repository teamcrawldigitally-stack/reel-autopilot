import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { Parcel, Person, PRIYA, ROHIT } from "../../components/Cartoon";
import { Doctor, PoseKey } from "../../components/Doctor";
import { Camera } from "../../components/fx";
import { CtaFlow, HookTitle, LINE, Place, makeMouth } from "../../components/format";
import { Card, Chip, Enter, SceneShell, Sfx, clamp, inr } from "../../components/kit";
import { Clinic, MoneyRoom, Whiteboard } from "../../components/sets";
import { Stamp } from "../../components/widgets";
import { C, theme } from "../../theme";
import { T, cue } from "./timeline";

const sceneMouth = makeMouth(T);
const TAG = "CASE #36";
const big = (size: number, color: string = LINE): React.CSSProperties => ({ fontFamily: theme.fonts.display, fontWeight: 700, fontSize: size, lineHeight: 1.05, color, whiteSpace: "nowrap" });
const body = (size: number, color: string = LINE): React.CSSProperties => ({ fontFamily: theme.fonts.body, fontWeight: 800, fontSize: size, color, whiteSpace: "nowrap" });

/** Price tag; `cross` 0..1 strikes it. */
export const Tag: React.FC<{ label: string; value: string; color: string; cross?: number; w?: number }> = ({ label, value, color, cross = 0, w = 380 }) => (
  <div style={{ position: "relative", width: w }}>
    <Card style={{ padding: "16px 24px 10px", border: `6px solid ${LINE}`, boxShadow: `7px 7px 0 ${LINE}`, textAlign: "center" }}>
      <div style={body(26, C.muted)}>{label}</div>
      <div style={big(w * 0.24, color)}>{value}</div>
    </Card>
    <div style={{ position: "absolute", left: "8%", top: "56%", height: 12, width: `${84 * cross}%`, background: C.red, borderRadius: 6, transform: "rotate(-8deg)", border: `3px solid ${LINE}` }} />
  </div>
);

const MONTHS = ["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"];

/** Year strip; months at `on` indexes get a ₹500 order coin as `p` grows 0..1. */
const Year: React.FC<{ p: number; w?: number }> = ({ p, w = 900 }) => {
  const on = [0, 2, 4, 6, 8, 10];
  const s = (w - 11 * 8) / 12;
  return (
    <div style={{ display: "flex", gap: 8 }}>
      {MONTHS.map((m, i) => {
        const k = on.indexOf(i);
        const lit = k >= 0 && p * 6 > k;
        return (
          <div key={i} style={{ width: s, display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
            <div style={{ width: s, height: s * 1.6, background: lit ? "#E9FBEF" : C.white, border: `4px solid ${LINE}`, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", boxSizing: "border-box" }}>
              {lit && <div style={{ width: s * 0.72, height: s * 0.72, borderRadius: "50%", background: C.green, border: `3px solid ${LINE}`, display: "flex", alignItems: "center", justifyContent: "center", ...big(s * 0.24, C.white) }}>500</div>}
            </div>
            <div style={body(22, C.muted)}>{m}</div>
          </div>
        );
      })}
    </div>
  );
};

/* ===== S1: hook ===== */
export const S1Hook: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const nahi = cue("s1", "nahi");
  const th = cue("s1", "teen hazaar");
  return (
    <SceneShell dur={dur} noExit>
      <Camera dur={dur} punches={[th]} push={0.03}>
        <MoneyRoom />
        <HookTitle
          top={300}
          lines={[
            { text: "Ek customer = ₹500?", at: -8, kind: "plain", size: 80, rot: -1 },
            { text: "Asli number ₹3,000", at: -6, kind: "green", size: 88, rot: 2 },
          ]}
        />
        <div style={{ position: "absolute", left: 90, top: 720, zIndex: 6 }}>
          <Tag label="PEHLA ORDER" value="₹500" color={LINE} cross={interpolate(frame, [nahi - 2, nahi + 8], [0, 1], clamp)} w={400} />
        </div>
        <div style={{ position: "absolute", left: 560, top: 700, zIndex: 7, transform: `scale(${interpolate(frame, [th - 6, th + 4], [0.92, 1.06], clamp)})` }}>
          <Tag label="SAAL BHAR KA" value="₹3,000" color={C.green} w={430} />
        </div>
      </Camera>
      <Sfx at={1} name="whoosh" vol={0.4} />
      <Sfx at={nahi - 2} name="swish" vol={0.4} />
      <Sfx at={th - 4} name="ding" vol={0.45} />
    </SceneShell>
  );
};

/* ===== S2: first order ₹500; ₹300 on ads feels too much ===== */
export const S2First: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const sau = cue("s2", "paanch sau");
  const ad = cue("s2", "teen sau");
  const bahut = cue("s2", "bahut");
  return (
    <SceneShell dur={dur} noExit>
      <Camera dur={dur} punches={[bahut]} push={0.02}>
        <MoneyRoom />
        <div style={{ position: "absolute", left: 70, top: 330, zIndex: 7, opacity: interpolate(frame, [sau - 8, sau], [0, 1], clamp) }}>
          <Card style={{ padding: "12px 22px 6px", border: `5px solid ${LINE}`, boxShadow: `6px 6px 0 ${LINE}`, ...big(40) }}>
            Pehla order · <span style={{ color: C.green }}>₹500</span>
          </Card>
        </div>
        <div style={{ position: "absolute", left: 590, top: 330, zIndex: 7, opacity: interpolate(frame, [ad - 8, ad], [0, 1], clamp) }}>
          <Card style={{ padding: "12px 22px 6px", border: `5px solid ${LINE}`, boxShadow: `6px 6px 0 ${LINE}`, ...big(40) }}>
            Ad kharcha · <span style={{ color: C.red }}>₹300</span>
          </Card>
        </div>
        <div style={{ position: "absolute", left: 300, top: 720, zIndex: 6, opacity: interpolate(frame, [sau - 6, sau + 2], [0, 1], clamp) }}>
          <Parcel w={190} tag="₹500" />
        </div>
        <Place x={40} y={760} s={0.72} z={5}>
          <Person look={PRIYA} seed="p362" track={[{ at: -100, pose: "hold", mood: "happy" }]} />
        </Place>
        <Place x={640} y={760} s={0.72} z={5}>
          <Person look={ROHIT} seed="r362" track={[{ at: -100, pose: "idle", mood: "neutral" }, { at: bahut, pose: "shrug", mood: "shock" }]} />
        </Place>
        <div style={{ position: "absolute", left: 780, top: 600, zIndex: 9 }}>
          <Stamp at={bahut} text="BAHUT ZYADA?" size={48} rotate={8} />
        </div>
      </Camera>
      <Sfx at={sau - 6} name="pop" vol={0.4} />
      <Sfx at={ad - 6} name="pop" vol={0.4} />
      <Sfx at={bahut} name="stamp" vol={0.4} />
    </SceneShell>
  );
};

/* ===== S3: 6 orders a year × ₹500 = ₹3,000 ===== */
export const S3Year: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const chhe = cue("s3", "chhe");
  const guna = cue("s3", "guna");
  const th = cue("s3", "teen hazaar");
  const p = interpolate(frame, [chhe - 4, guna + 4], [0, 1], clamp);
  const total = interpolate(frame, [guna - 2, th + 6], [0, 3000], { ...clamp, easing: theme.ease.out });
  return (
    <SceneShell dur={dur} noExit>
      <Camera dur={dur} punches={[th]} push={0.02}>
        <MoneyRoom />
        <Enter delay={0} from="none" cfg="snappy" style={{ position: "absolute", left: 0, right: 0, top: 292, display: "flex", justifyContent: "center", zIndex: 8 }}>
          <Chip size={28} bg={C.violet} color={C.white} border={LINE}>
            MAAN LO · EXAMPLE
          </Chip>
        </Enter>
        <div style={{ position: "absolute", left: 90, top: 400, zIndex: 6 }}>
          <Card style={{ padding: 22, border: `6px solid ${LINE}`, boxShadow: `8px 8px 0 ${LINE}` }}>
            <div style={{ ...body(26, C.muted), marginBottom: 14 }}>PRIYA KE ORDER · 1 SAAL</div>
            <Year p={p} w={860} />
          </Card>
        </div>
        <div style={{ position: "absolute", left: 90, top: 780, zIndex: 7, opacity: interpolate(frame, [guna - 6, guna + 2], [0, 1], clamp) }}>
          <div style={big(56)}>6 × ₹500 =</div>
          <div style={big(150, C.green)}>₹{inr(total)}</div>
        </div>
      </Camera>
      <Sfx at={chhe - 2} name="tick" vol={0.35} />
      <Sfx at={th - 4} name="ding" vol={0.45} />
    </SceneShell>
  );
};

/* ===== S4: paid ₹300, got a ₹3,000 customer ===== */
export const S4Deal: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const ts = cue("s4", "teen sau");
  const th = cue("s4", "teen hazaar");
  const sasta = cue("s4", "sasta");
  const poses: PoseKey[] = [
    { at: -100, pose: "explain" },
    { at: th - 4, pose: "point" },
    { at: sasta, pose: "thumbs" },
  ];
  const row = (t: string, v: string, col: string, at: number) => (
    <div style={{ opacity: interpolate(frame, [at - 8, at], [0, 1], clamp), transform: `translateX(${interpolate(frame, [at - 8, at], [60, 0], clamp)}px)` }}>
      <Card style={{ width: 640, padding: "14px 24px 8px", border: `6px solid ${LINE}`, boxShadow: `6px 6px 0 ${LINE}`, display: "flex", alignItems: "baseline", gap: 18, boxSizing: "border-box" }}>
        <span style={body(32, C.muted)}>{t}</span>
        <span style={{ marginLeft: "auto", ...big(80, col) }}>{v}</span>
      </Card>
    </div>
  );
  return (
    <SceneShell dur={dur} noExit>
      <Camera dur={dur} punches={[sasta]} push={0.02}>
        <Clinic />
        <div style={{ position: "absolute", left: 360, top: 360, display: "flex", flexDirection: "column", gap: 24, zIndex: 6 }}>
          {row("DIYA · AD PE", "₹300", C.red, ts)}
          {row("MILA · CUSTOMER", "₹3,000", C.green, th)}
        </div>
        <Enter delay={sasta - 4} from="none" cfg="snappy" style={{ position: "absolute", left: 360, top: 700, zIndex: 8 }}>
          <Chip size={44} bg={C.green} color={LINE} border={LINE}>
            Sasta sauda
          </Chip>
        </Enter>
        <Place x={-140} y={930} s={0.9} z={4}>
          <Doctor poses={poses} mouth={sceneMouth("s4")} brows={[th, sasta]} caseTag={TAG} />
        </Place>
      </Camera>
      <Sfx at={ts - 6} name="pop" vol={0.4} />
      <Sfx at={th - 6} name="pop" vol={0.4} />
      <Sfx at={sasta - 4} name="ding" vol={0.45} />
    </SceneShell>
  );
};

/* ===== S5: three steps ===== */
export const S5Fixes: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const a = cue("s5", "bill");
  const b = cue("s5", "budget");
  const c = cue("s5", "dusra");
  const marks = [a, b, c];
  const poses: PoseKey[] = [
    { at: -100, pose: "one" },
    { at: b - 6, pose: "two" },
    { at: c - 6, pose: "three" },
  ];
  const fixes = ["Purane customers ka saal bhar ka bill", "Ad budget usi hisaab se socho", "Dusra order 30 din ke andar"];
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
            <div style={{ background: C.lavenderSoft, borderRadius: 14, padding: "10px 16px 6px", ...body(28, C.violetDeep) }}>Customer ki asli keemat nikaalo</div>
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
const CalcIcon: React.FC = () => (
  <svg width={92} height={92} viewBox="0 0 92 92">
    <rect x={14} y={8} width={64} height={76} rx={12} fill={C.white} stroke={LINE} strokeWidth={5} />
    <rect x={24} y={18} width={44} height={18} rx={4} fill={C.green} stroke={LINE} strokeWidth={3} />
    {[0, 1, 2].map((r) =>
      [0, 1, 2].map((c) => <rect key={`${r}${c}`} x={24 + c * 16} y={44 + r * 12} width={10} height={8} rx={2} fill={C.violet} />),
    )}
  </svg>
);

export const S6Cta: React.FC<{ dur: number }> = ({ dur }) => {
  const kw = cue("s6", "value");
  const gift = cue("s6", "calculator");
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
          keyword="VALUE"
          typeAt={kw - 8}
          giftAt={gift - 6}
          giftTitle="Customer Value Calculator"
          giftSub="free · ek customer saal mein kitna deta hai"
          giftIcon={<CalcIcon />}
          nextAt={aaj}
          nextNum="#37"
          nextLabel="AAJ SHAAM 7 BAJE · AGLA CASE"
          next={
            <div style={{ fontFamily: theme.fonts.display, fontWeight: 700, fontSize: 52, lineHeight: 1.12, color: LINE, textAlign: "center" }}>
              Black Friday ki sale,
              <br />
              <span style={{ color: C.green }}>7 din pehle</span> kaise jeetein?
            </div>
          }
          followAt={follow}
        />
        <Place x={250} y={1010} s={0.96} z={4}>
          <Doctor poses={poses} mouth={sceneMouth("s6")} brows={[kw, aaj]} caseTag={TAG} />
        </Place>
      </Camera>
      {Array.from({ length: 5 }).map((_, i) => (
        <Sfx key={i} at={kw - 8 + i * 2} name="key" vol={0.4} />
      ))}
      <Sfx at={gift - 10} name="pop" vol={0.5} />
      <Sfx at={aaj - 4} name="whoosh" vol={0.45} />
      <Sfx at={follow + 12} name="pop" vol={0.55} />
      <Sfx at={follow + 15} name="ding" vol={0.45} />
    </SceneShell>
  );
};
