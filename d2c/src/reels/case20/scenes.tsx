import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { Jar, Parcel, Person, ROHIT } from "../../components/Cartoon";
import { Doctor, PoseKey } from "../../components/Doctor";
import { Camera } from "../../components/fx";
import { CtaFlow, HookTitle, LINE, Place, makeMouth } from "../../components/format";
import { Card, Chip, Enter, SceneShell, Sfx, clamp, inr, useSpring } from "../../components/kit";
import { Clinic, MoneyRoom, OfficeWall, Whiteboard } from "../../components/sets";
import { Stamp } from "../../components/widgets";
import { C, theme } from "../../theme";
import { T, cue } from "./timeline";

const sceneMouth = makeMouth(T);
const TAG = "CASE #20";
const big = (size: number, color: string = LINE): React.CSSProperties => ({ fontFamily: theme.fonts.display, fontWeight: 700, fontSize: size, lineHeight: 1.05, color, whiteSpace: "nowrap" });
const body = (size: number, color: string = LINE): React.CSSProperties => ({ fontFamily: theme.fonts.body, fontWeight: 800, fontSize: size, color, whiteSpace: "nowrap" });

/** Black-friday price tag. */
export const SaleTag: React.FC<{ off?: string; w?: number; rot?: number }> = ({ off = "30% OFF", w = 360, rot = -6 }) => (
  <div style={{ width: w, background: "#121212", border: `6px solid ${LINE}`, borderRadius: 26, padding: "16px 20px 12px", boxSizing: "border-box", transform: `rotate(${rot}deg)`, boxShadow: `8px 8px 0 ${LINE}`, textAlign: "center" }}>
    <div style={body(w * 0.075, "#FFD54A")}>BLACK FRIDAY · 27 NOV</div>
    <div style={big(w * 0.22, C.white)}>{off}</div>
  </div>
);

const useN = (to: number, from: number, at: number, len = 14) => {
  const f = useCurrentFrame();
  return interpolate(f, [at, at + len], [from, to], { ...clamp, easing: theme.ease.out });
};

/* ===== S1: hook ===== */
export const S1Hook: React.FC<{ dur: number }> = ({ dur }) => {
  const bf = cue("s1", "black friday");
  const kitna = cue("s1", "kitna");
  return (
    <SceneShell dur={dur} noExit>
      <Camera dur={dur} punches={[bf, kitna]} push={0.03}>
        <MoneyRoom />
        <HookTitle
          top={300}
          lines={[
            { text: "Black Friday pe 30% off,", at: -8, kind: "plain", size: 80, rot: -1 },
            { text: "kitna bachega?", at: -6, kind: "red", size: 100, rot: 2 },
          ]}
        />
        <div style={{ position: "absolute", left: 600, top: 700, zIndex: 7 }}>
          <Enter delay={2} from="right">
            <SaleTag w={380} />
          </Enter>
        </div>
        <Place x={180} y={760} s={0.74} z={6}>
          <Person look={ROHIT} seed="r201" track={[{ at: -100, pose: "megaphone", mood: "shout" }, { at: kitna - 4, pose: "shrug", mood: "shock" }]} />
        </Place>
      </Camera>
      <Sfx at={1} name="whoosh" vol={0.4} />
      <Sfx at={kitna - 2} name="pop" vol={0.45} />
    </SceneShell>
  );
};

/* ===== S2: ₹1,000 → 450 + 250 + 300 jars ===== */
export const S2Split: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const price = cue("s2", "ek hazaar");
  const maal = cue("s2", "chaar sau pachaas");
  const ad = cue("s2", "do sau pachaas");
  const bacha = cue("s2", "teen sau");
  const lv = (at: number, to: number) => interpolate(frame, [at - 4, at + 14], [0, to], { ...clamp, easing: theme.ease.out });
  return (
    <SceneShell dur={dur} noExit>
      <Camera dur={dur} punches={[bacha]} push={0.02}>
        <MoneyRoom />
        <Enter delay={0} from="none" cfg="snappy" style={{ position: "absolute", left: 0, right: 0, top: 292, display: "flex", justifyContent: "center", zIndex: 8 }}>
          <Chip size={28} bg={C.violet} color={C.white} border={LINE}>
            MAAN LO · EXAMPLE
          </Chip>
        </Enter>
        <Enter delay={price - 8} from="down" style={{ position: "absolute", left: 0, right: 0, top: 370, display: "flex", justifyContent: "center", zIndex: 6 }}>
          <Card style={{ padding: "14px 34px 8px", border: `6px solid ${LINE}`, boxShadow: `7px 7px 0 ${LINE}`, display: "flex", alignItems: "baseline", gap: 18 }}>
            <span style={body(32, C.muted)}>PRODUCT PRICE</span>
            <span style={big(84)}>₹1,000</span>
          </Card>
        </Enter>
        <div style={{ position: "absolute", left: 40, right: 40, top: 560, display: "flex", justifyContent: "space-between", zIndex: 5 }}>
          <div style={{ opacity: interpolate(frame, [maal - 8, maal], [0, 1], clamp) }}>
            <Jar w={300} level={lv(maal, 0.45)} color={C.violet} label="Maal+packing+delivery" amount={`₹${inr(useN(450, 0, maal - 4))}`} />
          </div>
          <div style={{ opacity: interpolate(frame, [ad - 8, ad], [0, 1], clamp) }}>
            <Jar w={300} level={lv(ad, 0.25)} color={C.red} label="Ad" amount={`₹${inr(useN(250, 0, ad - 4))}`} />
          </div>
          <div style={{ opacity: interpolate(frame, [bacha - 8, bacha], [0, 1], clamp) }}>
            <Jar w={300} level={lv(bacha, 0.3)} color={C.green} label="Bacha" amount={`₹${inr(useN(300, 0, bacha - 4))}`} />
          </div>
        </div>
      </Camera>
      <Sfx at={price - 8} name="pop" vol={0.45} />
      <Sfx at={maal - 4} name="tick" vol={0.35} />
      <Sfx at={ad - 4} name="tick" vol={0.35} />
      <Sfx at={bacha - 4} name="ding" vol={0.4} />
    </SceneShell>
  );
};

/* ===== S3: 30% off → ₹700, cost still ₹700 → zero ===== */
export const S3Zero: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const off = cue("s3", "tees percent off");
  const price = cue("s3", "saat sau");
  const kharcha = cue("s3", "saat sau", 2);
  const zero = cue("s3", "zero");
  const strike = interpolate(frame, [price - 6, price + 4], [0, 1], clamp);
  const drain = interpolate(frame, [zero - 10, zero + 4], [0.3, 0], { ...clamp, easing: theme.ease.in });
  return (
    <SceneShell dur={dur} noExit>
      <Camera dur={dur} punches={[zero]} push={0.02}>
        <MoneyRoom />
        <div style={{ position: "absolute", left: 60, top: 320, zIndex: 7 }}>
          <Enter delay={off - 8} from="left">
            <SaleTag w={330} rot={-8} />
          </Enter>
        </div>
        <Enter delay={price - 10} from="right" style={{ position: "absolute", left: 470, top: 330, zIndex: 6 }}>
          <Card style={{ padding: "14px 26px 8px", border: `6px solid ${LINE}`, boxShadow: `7px 7px 0 ${LINE}`, display: "flex", flexDirection: "column", alignItems: "center" }}>
            <span style={body(28, C.muted)}>NAYA PRICE</span>
            <div style={{ position: "relative" }}>
              <span style={big(60, C.muted)}>₹1,000</span>
              <div style={{ position: "absolute", left: -6, right: -6, top: "48%", height: 7, background: C.red, transform: `scaleX(${strike})`, transformOrigin: "left" }} />
            </div>
            <span style={big(96, C.violetDeep)}>₹700</span>
          </Card>
        </Enter>
        <div style={{ position: "absolute", left: 40, right: 40, top: 700, display: "flex", justifyContent: "space-between", zIndex: 5 }}>
          <div style={{ opacity: interpolate(frame, [kharcha - 8, kharcha], [0.35, 1], clamp) }}>
            <Jar w={300} level={0.45} color={C.violet} label="Maal+packing+delivery" amount="₹450" />
          </div>
          <div style={{ opacity: interpolate(frame, [kharcha - 8, kharcha], [0.35, 1], clamp) }}>
            <Jar w={300} level={0.25} color={C.red} label="Ad" amount="₹250" />
          </div>
          <div>
            <Jar w={300} level={drain} color={C.green} label="Bacha" amount={frame >= zero ? "₹0" : "₹300"} />
          </div>
        </div>
        <div style={{ position: "absolute", left: 760, top: 900, zIndex: 9 }}>
          <Stamp at={zero} text="ZERO" size={80} rotate={-10} />
        </div>
      </Camera>
      <Sfx at={off - 8} name="whoosh" vol={0.4} />
      <Sfx at={price - 6} name="swish" vol={0.4} />
      <Sfx at={zero} name="stamp" vol={0.55} />
      <Sfx at={zero + 2} name="error" vol={0.4} />
    </SceneShell>
  );
};

/* ===== S4: orders double, profit gone ===== */
export const S4Gone: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const dbl = cue("s4", "double");
  const profit = cue("s4", "profit");
  const gayab = cue("s4", "gayab");
  const n = frame >= dbl - 2 ? 8 : 4;
  const pop = useSpring(dbl - 2, "bouncy");
  return (
    <SceneShell dur={dur} noExit>
      <Camera dur={dur} punches={[dbl, gayab]} push={0.02}>
        <OfficeWall />
        <div style={{ position: "absolute", left: 80, right: 80, top: 320, display: "flex", justifyContent: "space-between", zIndex: 6 }}>
          <Card style={{ padding: "14px 26px 8px", border: `6px solid ${LINE}`, boxShadow: `7px 7px 0 ${LINE}`, textAlign: "center" }}>
            <div style={body(28, C.muted)}>ORDER</div>
            <div style={{ ...big(96, C.green), transform: `scale(${frame >= dbl - 2 ? 0.8 + 0.2 * pop : 1})` }}>{frame >= dbl - 2 ? "×2 ↑" : "×1"}</div>
          </Card>
          <Card style={{ padding: "14px 26px 8px", border: `6px solid ${LINE}`, boxShadow: `7px 7px 0 ${LINE}`, textAlign: "center", opacity: interpolate(frame, [profit - 8, profit], [0, 1], clamp) }}>
            <div style={body(28, C.muted)}>PROFIT</div>
            <div style={big(96, C.red)}>₹0</div>
          </Card>
        </div>
        <div style={{ position: "absolute", left: 470, top: 720, display: "flex", flexWrap: "wrap", gap: 14, width: 560, zIndex: 5 }}>
          {Array.from({ length: n }).map((_, i) => (
            <div key={i} style={{ transform: `scale(${i >= 4 ? pop : 1})` }}>
              <Parcel w={122} />
            </div>
          ))}
        </div>
        <div style={{ position: "absolute", left: 560, top: 980, zIndex: 9 }}>
          <Stamp at={gayab} text="PROFIT GAYAB" size={58} rotate={-6} />
        </div>
        <Place x={60} y={760} s={0.78} z={4}>
          <Person look={ROHIT} seed="r204" track={[{ at: -100, pose: "idle", mood: "happy" }, { at: dbl, pose: "cheer", mood: "grin" }, { at: gayab - 2, pose: "sad", mood: "sad" }]} />
        </Place>
      </Camera>
      <Sfx at={dbl - 2} name="pop" vol={0.45} />
      <Sfx at={gayab} name="stamp" vol={0.5} />
    </SceneShell>
  );
};

/* ===== S5: hisaab first + 3 fixes ===== */
export const S5Fixes: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const hisaab = cue("s5", "hisaab");
  const a = cue("s5", "free gift");
  const b = cue("s5", "purane");
  const c = cue("s5", "do din");
  const marks = [a, b, c];
  const poses: PoseKey[] = [
    { at: -100, pose: "stop" },
    { at: a - 6, pose: "one" },
    { at: b - 6, pose: "two" },
    { at: c - 6, pose: "three" },
  ];
  const fixes = ["Discount ki jagah free gift", "Offer sirf purane customers ko", "Sale sirf 2 din, poora hafta nahi"];
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
          <div style={{ position: "absolute", left: 30, right: 30, top: 96, display: "flex", justifyContent: "center", opacity: interpolate(frame, [hisaab - 8, hisaab], [0, 1], clamp) }}>
            <div style={{ background: C.lavenderSoft, borderRadius: 14, padding: "10px 16px 6px", ...body(30, C.violetDeep) }}>Discount se pehle hisaab lagao</div>
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
          <Doctor poses={poses} mouth={sceneMouth("s5")} brows={[hisaab, ...marks]} caseTag={TAG} />
        </Place>
      </Camera>
      <Sfx at={1} name="whoosh" vol={0.4} />
      <Sfx at={hisaab - 6} name="pop" vol={0.4} />
      {marks.map((m, i) => (
        <Sfx key={i} at={m - 5} name="check" vol={0.4} />
      ))}
    </SceneShell>
  );
};

/* ===== S6: CTA ===== */
const CalcIcon: React.FC = () => (
  <svg width={86} height={100} viewBox="0 0 86 100">
    <rect x={3} y={3} width={80} height={94} rx={14} fill={C.violet} stroke={LINE} strokeWidth={5} />
    <rect x={14} y={14} width={58} height={22} rx={5} fill={C.lavender} />
    {[0, 1, 2].map((r) => [0, 1, 2].map((c) => <rect key={`${r}${c}`} x={14 + c * 21} y={46 + r * 16} width={15} height={10} rx={3} fill={r === 2 && c === 2 ? C.green : C.white} />))}
  </svg>
);

export const S6Cta: React.FC<{ dur: number }> = ({ dur }) => {
  const kw = cue("s6", "sale");
  const gift = cue("s6", "profit");
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
          keyword="SALE"
          typeAt={kw - 8}
          giftAt={gift - 10}
          giftTitle="Sale Profit Calculator"
          giftSub="free · discount se pehle hisaab"
          giftIcon={<CalcIcon />}
          nextAt={aaj}
          nextNum="#21"
          nextLabel="AAJ SHAAM 7 BAJE · AGLA CASE"
          next={
            <div style={{ fontFamily: theme.fonts.display, fontWeight: 700, fontSize: 54, lineHeight: 1.12, color: LINE, textAlign: "center" }}>
              Har mahine <span style={{ color: C.red }}>₹5,000</span>
              <br />
              kahan ja rahe hain?
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
      <Sfx at={gift - 14} name="pop" vol={0.5} />
      <Sfx at={aaj - 4} name="whoosh" vol={0.45} />
      <Sfx at={follow + 12} name="pop" vol={0.55} />
      <Sfx at={follow + 15} name="ding" vol={0.45} />
    </SceneShell>
  );
};
