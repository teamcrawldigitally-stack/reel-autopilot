import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { Confetti, Parcel, Person, ROHIT } from "../../components/Cartoon";
import { Doctor, PoseKey } from "../../components/Doctor";
import { Camera } from "../../components/fx";
import { CtaFlow, HookTitle, LINE, Place, makeMouth } from "../../components/format";
import { Card, Chip, Enter, SceneShell, Sfx, clamp, useSpring } from "../../components/kit";
import { Bottle } from "../../components/props";
import { Clinic, Dispatch, MoneyRoom, OfficeWall, PackTable, Stage, Whiteboard } from "../../components/sets";
import { Stamp } from "../../components/widgets";
import { C, theme } from "../../theme";
import { T, cue } from "./timeline";

const sceneMouth = makeMouth(T);
const TAG = "CASE #09";
const big = (size: number, color: string = LINE): React.CSSProperties => ({ fontFamily: theme.fonts.display, fontWeight: 700, fontSize: size, lineHeight: 1.05, color, whiteSpace: "nowrap" });

/** Price tag. */
const Tag: React.FC<{ text: string; color?: string; size?: number; strike?: number }> = ({ text, color = LINE, size = 64, strike = 0 }) => (
  <div style={{ position: "relative", display: "inline-flex", alignItems: "center", gap: 14, background: C.white, border: `6px solid ${LINE}`, borderRadius: "18px 40px 40px 18px", padding: `${size * 0.22}px ${size * 0.5}px ${size * 0.06}px ${size * 0.34}px`, boxShadow: `6px 6px 0 ${LINE}` }}>
    <div style={{ width: size * 0.26, height: size * 0.26, borderRadius: "50%", border: `5px solid ${LINE}`, background: C.lavenderSoft }} />
    <div style={big(size, color)}>{text}</div>
    {strike > 0 && <div style={{ position: "absolute", left: -8, top: "46%", height: 10, width: `${strike * 104}%`, background: C.red, borderRadius: 5, transform: "rotate(-6deg)" }} />}
  </div>
);

/* ===== S1: ₹300 product sold at ₹599, still a loss ===== */
export const S1Hook: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const sold = cue("s1", "₹599");
  const dbl = cue("s1", "double");
  const loss = cue("s1", "loss");
  return (
    <SceneShell dur={dur} noExit>
      <Camera dur={dur} punches={[3, dbl, loss]} push={0.03}>
        <Dispatch />
        <Place x={-30} y={620} s={1.0} z={4}>
          <Person
            look={ROHIT}
            seed="r91"
            track={[
              { at: -100, pose: "hold", mood: "happy" },
              { at: dbl - 2, pose: "cheer", mood: "grin" },
              { at: loss - 2, pose: "shrug", mood: "shock" },
            ]}
          />
        </Place>
        <PackTable />
        <Place x={470} y={1050} z={6}>
          <div style={{ display: "flex", alignItems: "flex-end", gap: 10 }}>
            {[0, 1, 2].map((i) => (
              <Enter key={i} delay={sold - 6 + i * 5} from="down" dist={60}>
                <Parcel w={170} tag="₹599" />
              </Enter>
            ))}
          </div>
        </Place>
        <Place x={540} y={790} z={6}>
          <div style={{ display: "flex", flexDirection: "column", gap: 14, alignItems: "flex-start" }}>
            <Enter delay={2} from="right">
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 26, color: C.muted, width: 110 }}>LAGAT</div>
                <Tag text="₹300" size={52} />
              </div>
            </Enter>
            <Enter delay={sold - 4} from="right">
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 26, color: C.muted, width: 110 }}>PRICE</div>
                <Tag text="₹599" size={52} color={C.green} />
              </div>
            </Enter>
          </div>
        </Place>
        <div style={{ position: "absolute", left: 620, top: 1040, zIndex: 9 }}>
          <Stamp at={loss - 1} text="LOSS" size={90} rotate={-10} />
        </div>
        <HookTitle
          top={276}
          lines={[
            { text: "₹300 ka maal, ₹599 mein becha.", at: 0, size: 58 },
            { text: "DOUBLE PRICE", at: 8, kind: "green", size: 84 },
            { text: "phir bhi LOSS?", at: 26, kind: "red", size: 84, rot: 2 },
          ]}
        />
      </Camera>
      <Sfx at={0} name="whoosh" vol={0.45} />
      <Sfx at={8} name="ding" vol={0.4} />
      <Sfx at={26} name="stamp" vol={0.6} />
      <Sfx at={loss - 1} name="stamp" vol={0.7} />
      <Sfx at={loss + 4} name="error" vol={0.3} />
    </SceneShell>
  );
};

/* ===== S2: the mistake: price from product cost only ===== */
export const S2Mistake: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const galti = cue("s2", "galti");
  const lagat = cue("s2", "lagat");
  const ring = useSpring(lagat - 2, "bouncy");
  return (
    <SceneShell dur={dur} noExit>
      <Camera dur={dur} punches={[lagat]} push={0.02}>
        <OfficeWall />
        <Enter delay={0} style={{ position: "absolute", left: 90, right: 90, top: 330, zIndex: 5 }}>
          <Card style={{ padding: "34px 40px 30px", border: `6px solid ${LINE}`, boxShadow: `8px 8px 0 ${LINE}`, display: "flex", flexDirection: "column", alignItems: "center", gap: 18 }}>
            <div style={{ fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 30, color: C.muted, letterSpacing: "0.08em" }}>ROHIT KA PRICE FORMULA</div>
            <div style={{ position: "relative", display: "flex", alignItems: "center", gap: 20 }}>
              <div style={{ position: "relative", padding: "6px 18px 0" }}>
                <div style={big(92, C.violet)}>Lagat</div>
                <svg width={330} height={150} viewBox="0 0 330 150" style={{ position: "absolute", left: -20, top: -24, overflow: "visible" }}>
                  <ellipse cx={165} cy={75} rx={160} ry={66} fill="none" stroke={C.red} strokeWidth={8} strokeDasharray={800} strokeDashoffset={800 * (1 - ring)} />
                </svg>
              </div>
              <div style={big(92)}>× 2</div>
            </div>
            <div style={{ fontFamily: theme.fonts.display, fontWeight: 700, fontSize: 40, color: C.red, opacity: interpolate(frame, [lagat + 6, lagat + 14], [0, 1], clamp) }}>Baaki kharche? Bhool gaye!</div>
          </Card>
        </Enter>
        <div style={{ position: "absolute", left: 640, top: 790, zIndex: 8 }}>
          <Stamp at={galti} text="GALTI" size={80} rotate={8} />
        </div>
        <Place x={300} y={820} s={0.85} z={4}>
          <Person
            look={ROHIT}
            seed="r92"
            track={[
              { at: -100, pose: "shrug", mood: "neutral" },
              { at: lagat, pose: "shrug", mood: "shock" },
            ]}
          />
        </Place>
      </Camera>
      <Sfx at={0} name="whoosh" vol={0.4} />
      <Sfx at={galti} name="stamp" vol={0.6} />
      <Sfx at={lagat - 2} name="swish" vol={0.4} />
    </SceneShell>
  );
};

/* ===== S3: cost stack builds past the price line ===== */
const ITEMS: { key: string; label: string; v: number; color: string }[] = [
  { key: "₹300", label: "Product", v: 300, color: "#F5A25D" },
  { key: "₹25", label: "Packing", v: 25, color: "#D8B98A" },
  { key: "₹70", label: "Shipping", v: 70, color: "#8FD3B6" },
  { key: "₹12", label: "Payment fee", v: 12, color: "#BFD8FF" },
  { key: "₹40", label: "Returns ka hissa", v: 40, color: "#F7A8C4" },
  { key: "₹200", label: "Ad per order", v: 200, color: C.violet },
];
const PX = 1.1; // px per rupee
const BASE = 1110; // bottom of the stack (y)

export const S3Stack: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const ats = ITEMS.map((it) => cue("s3", it.key));
  const ad = cue("s3", "ad");
  let acc = 0;
  let lastLabel = 1e9;
  const priceY = BASE - 599 * PX;
  const total = ITEMS.reduce((a, it, i) => a + (frame >= ats[i] - 3 ? it.v : 0), 0);
  const over = total > 599;
  return (
    <SceneShell dur={dur} noExit>
      <Camera dur={dur} punches={[ats[5]]} push={0.02}>
        <MoneyRoom />
        <Enter delay={2} from="down" style={{ position: "absolute", left: 0, right: 0, top: 292, display: "flex", justifyContent: "center", gap: 14, zIndex: 4 }}>
          <Chip size={26} bg={C.white} color={LINE} border={LINE}>
            MAAN LO · EK ORDER KA KHARCHA
          </Chip>
        </Enter>
        {/* price line */}
        <div style={{ position: "absolute", left: 60, right: 60, top: priceY, height: 0, borderTop: `7px dashed ${C.green}`, zIndex: 6 }} />
        <div style={{ position: "absolute", left: 60, top: priceY - 64, zIndex: 6, background: C.green, color: C.white, borderRadius: 14, padding: "8px 16px 2px", ...big(40, C.white) }}>PRICE ₹599</div>
        {/* stack */}
        {ITEMS.map((it, i) => {
          const h = it.v * PX;
          const y = BASE - acc - h;
          acc += it.v * PX;
          const p = interpolate(frame, [ats[i] - 4, ats[i] + 6], [0, 1], { ...clamp, easing: theme.ease.out });
          if (p <= 0) return null;
          const small = h < 40;
          const ly = Math.min(y + h / 2, lastLabel - 48);
          lastLabel = ly;
          return (
            <React.Fragment key={it.key}>
              <div style={{ position: "absolute", left: 120, top: y - (1 - p) * 120, width: 300, height: h, background: it.color, border: `5px solid ${LINE}`, borderRadius: 10, boxSizing: "border-box", opacity: p, zIndex: 4 }} />
              <div style={{ position: "absolute", left: 450, top: ly - (small ? 22 : 26), opacity: p, zIndex: 5, display: "flex", alignItems: "center", gap: 14 }}>
                <div style={{ width: 24, height: 5, background: LINE }} />
                <div style={{ fontFamily: theme.fonts.body, fontWeight: 800, fontSize: small ? 30 : 34, color: LINE, whiteSpace: "nowrap" }}>
                  {it.label} <span style={{ color: it.v === 200 ? C.violet : LINE, fontFamily: theme.fonts.display }}>₹{it.v}</span>
                </div>
              </div>
            </React.Fragment>
          );
        })}
        <div style={{ position: "absolute", left: 640, top: 1000, zIndex: 5, background: C.white, border: `5px solid ${LINE}`, borderRadius: 18, boxShadow: `6px 6px 0 ${LINE}`, padding: "10px 22px 2px", ...big(54, over ? C.red : LINE), fontVariantNumeric: "tabular-nums" }}>Total ₹{total}</div>
        {frame >= ad && (
          <div style={{ position: "absolute", left: 600, top: 470, zIndex: 8 }}>
            <Stamp at={ad + 8} text="PRICE SE ZYADA" size={46} rotate={-6} />
          </div>
        )}
      </Camera>
      <Sfx at={2} name="whoosh" vol={0.4} />
      {ats.map((a, i) => (
        <Sfx key={i} at={a - 3} name="pop" vol={0.35} />
      ))}
      <Sfx at={ad + 8} name="stamp" vol={0.55} />
    </SceneShell>
  );
};

/* ===== S4: total ₹647 → −₹48 per order ===== */
export const S4Loss: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const tot = cue("s4", "₹647");
  const minus = cue("s4", "₹48");
  const lossP = useSpring(minus - 2, "bouncy");
  return (
    <SceneShell dur={dur} noExit>
      <Camera dur={dur} punches={[minus]} push={0.02}>
        <Stage />
        <Enter delay={0} style={{ position: "absolute", left: 90, right: 90, top: 330, zIndex: 4 }}>
          <Card style={{ padding: "28px 40px", border: `6px solid ${LINE}`, boxShadow: `8px 8px 0 ${LINE}`, display: "flex", flexDirection: "column", gap: 14 }}>
            {[
              ["Price", "₹599", C.green, 0],
              ["Poora kharcha", "− ₹647", LINE, tot - 4],
            ].map(([l, v, col, at]) => (
              <div key={l as string} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", opacity: interpolate(frame, [(at as number), (at as number) + 6], [0, 1], clamp) }}>
                <div style={{ fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 40, color: C.muted }}>{l}</div>
                <div style={big(70, col as string)}>{v}</div>
              </div>
            ))}
            <div style={{ height: 6, background: LINE, borderRadius: 3 }} />
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", opacity: interpolate(frame, [minus - 4, minus + 2], [0, 1], clamp) }}>
              <div style={{ fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 40, color: LINE }}>Har order pe</div>
              <div style={big(70, C.red)}>− ₹48</div>
            </div>
          </Card>
        </Enter>
        {frame >= minus - 4 && (
          <div style={{ position: "absolute", left: 0, right: 0, top: 780, display: "flex", justifyContent: "center", zIndex: 6 }}>
            <div style={{ transform: `scale(${lossP}) rotate(-3deg)`, background: C.red, border: `8px solid ${LINE}`, borderRadius: 30, boxShadow: `10px 10px 0 ${LINE}`, padding: "22px 40px 6px", ...big(110, C.white) }}>LOSS</div>
          </div>
        )}
        <Place x={330} y={1020} s={0.6} z={5}>
          <Person
            look={ROHIT}
            seed="r94"
            track={[
              { at: -100, pose: "idle", mood: "neutral" },
              { at: minus - 2, pose: "sad", mood: "sad" },
            ]}
          />
        </Place>
      </Camera>
      <Sfx at={1} name="whoosh" vol={0.4} />
      <Sfx at={tot - 4} name="pop" vol={0.4} />
      <Sfx at={minus - 2} name="bass" vol={0.6} />
      <Sfx at={minus} name="error" vol={0.3} />
    </SceneShell>
  );
};

/* ===== S5: right price = full cost + profit ===== */
export const S5Formula: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const sahi = cue("s5", "sahi");
  const plus = cue("s5", "plus");
  const profit = cue("s5", "profit");
  const fin = cue("s5", "₹799");
  const finP = useSpring(fin - 2, "bouncy");
  const poses: PoseKey[] = [
    { at: -100, pose: "explain" },
    { at: plus - 2, pose: "point" },
    { at: fin - 2, pose: "thumbs" },
  ];
  return (
    <SceneShell dur={dur} noExit>
      <Camera dur={dur} punches={[fin]} push={0.02}>
        <Clinic />
        <Whiteboard style={{ left: 250, top: 300, width: 780, height: 640 }}>
          <div style={{ position: "absolute", left: 30, top: 24 }}>
            <Chip size={26} bg={C.green}>
              SAHI PRICE
            </Chip>
          </div>
          <div style={{ position: "absolute", left: 0, right: 0, top: 110, display: "flex", flexDirection: "column", alignItems: "center", gap: 20 }}>
            <Enter delay={sahi + 4} from="none" scaleFrom={0.6}>
              <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                <div style={{ ...big(52), background: C.lavenderSoft, borderRadius: 16, padding: "12px 18px 4px" }}>Poora kharcha</div>
                <div style={big(56, C.violet)}>+</div>
                <div style={{ ...big(52, C.white), background: C.green, borderRadius: 16, padding: "12px 18px 4px", opacity: interpolate(frame, [profit - 4, profit + 2], [0, 1], clamp) }}>Profit</div>
              </div>
            </Enter>
            <Enter delay={plus + 2} from="down">
              <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                <div style={big(64)}>₹647</div>
                <div style={big(64, C.violet)}>+</div>
                <div style={big(64, C.green)}>₹150</div>
                <div style={big(64, C.violet)}>=</div>
                <div style={big(64)}>₹797</div>
              </div>
            </Enter>
            <div style={{ display: "flex", alignItems: "center", gap: 26, marginTop: 10 }}>
              <Tag text="₹599" size={56} color={C.muted} strike={interpolate(frame, [fin - 6, fin + 4], [0, 1], clamp)} />
              {frame >= fin - 4 && (
                <div style={{ transform: `scale(${finP}) rotate(-3deg)` }}>
                  <Tag text="₹799" size={74} color={C.green} />
                </div>
              )}
            </div>
            <div style={{ fontFamily: theme.fonts.body, fontWeight: 700, fontSize: 22, color: C.muted }}>Example numbers · GST se pehle</div>
          </div>
        </Whiteboard>
        <Confetti at={fin + 6} x={760} y={800} n={24} />
        <Place x={-120} y={930} s={0.92} z={4}>
          <Doctor poses={poses} mouth={sceneMouth("s5")} brows={[sahi, plus, fin]} caseTag={TAG} />
        </Place>
      </Camera>
      <Sfx at={1} name="whoosh" vol={0.4} />
      <Sfx at={sahi + 4} name="pop" vol={0.45} />
      <Sfx at={plus + 2} name="swish" vol={0.4} />
      <Sfx at={fin - 2} name="ding" vol={0.5} />
    </SceneShell>
  );
};

/* ===== S6: Doctor's 3 fixes ===== */
export const S6Fixes: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const har = cue("s6", "har");
  const ad = cue("s6", "ad");
  const price = cue("s6", "price");
  const combo = cue("s6", "combo");
  const marks = [har, ad, price];
  const step = frame >= price - 4 ? 3 : frame >= ad - 4 ? 2 : frame >= har - 4 ? 1 : 0;
  const vis = (s: number) => {
    const ins = marks[s - 1] - 4;
    const outs = s < 3 ? marks[s] - 6 : 1e9;
    return Math.min(interpolate(frame, [ins, ins + 10], [0, 1], clamp), interpolate(frame, [outs, outs + 8], [1, 0], clamp));
  };
  const comboP = useSpring(combo - 2, "bouncy");
  const poses: PoseKey[] = [
    { at: -100, pose: "one" },
    { at: ad - 4, pose: "two" },
    { at: price - 4, pose: "three" },
  ];
  const title = (t: React.ReactNode) => <div style={{ fontFamily: theme.fonts.display, fontWeight: 700, fontSize: 46, lineHeight: 1.12, color: LINE, textAlign: "center", whiteSpace: "nowrap" }}>{t}</div>;
  const rows: [string, string][] = [
    ["Product", "₹300"],
    ["Packing", "₹25"],
    ["Shipping", "₹70"],
    ["Payment fee", "₹12"],
    ["Returns", "₹40"],
  ];
  return (
    <SceneShell dur={dur} noExit>
      <Camera dur={dur} push={0.02}>
        <Clinic />
        <Whiteboard style={{ left: 250, top: 300, width: 780, height: 700 }}>
          <div style={{ position: "absolute", left: 30, top: 24, display: "flex", gap: 12, alignItems: "center" }}>
            <Chip size={26} bg={C.green}>
              ILAAJ
            </Chip>
            {[1, 2, 3].map((n) => (
              <div key={n} style={{ width: 44, height: 44, borderRadius: "50%", background: step >= n ? C.violet : C.lavenderSoft, color: step >= n ? C.white : C.violetDeep, fontFamily: theme.fonts.display, fontWeight: 700, fontSize: 26, display: "flex", alignItems: "center", justifyContent: "center", paddingTop: 3, boxSizing: "border-box" }}>
                {n}
              </div>
            ))}
          </div>
          {/* 1: write down the full cost */}
          <div style={{ position: "absolute", inset: "100px 30px 20px", opacity: vis(1), display: "flex", flexDirection: "column", alignItems: "center", gap: 18 }}>
            {title(<>Har order ka<br /><span style={{ color: C.violet }}>poora kharcha likho</span></>)}
            <div style={{ width: 460, background: "#FFF6CC", border: `5px solid ${LINE}`, borderRadius: 18, padding: "14px 24px", display: "flex", flexDirection: "column", gap: 6 }}>
              {rows.map(([l, v], i) => (
                <div key={l} style={{ display: "flex", justifyContent: "space-between", fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 28, color: LINE, opacity: interpolate(frame, [har + i * 4, har + i * 4 + 4], [0, 1], clamp) }}>
                  <span>{l}</span>
                  <span>{v}</span>
                </div>
              ))}
            </div>
          </div>
          {/* 2: add ad cost per order */}
          <div style={{ position: "absolute", inset: "100px 30px 20px", opacity: vis(2), display: "flex", flexDirection: "column", alignItems: "center", gap: 22 }}>
            {title(<>Ad kharcha per order<br /><span style={{ color: C.violet }}>bhi jodo</span></>)}
            <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
              <div style={{ ...big(48), background: C.lavenderSoft, borderRadius: 16, padding: "14px 20px 6px" }}>₹447</div>
              <div style={big(56, C.violet)}>+</div>
              <div style={{ ...big(48, C.white), background: C.violet, borderRadius: 16, padding: "14px 20px 6px", border: `5px solid ${LINE}` }}>Ad ₹200</div>
              <div style={big(56, C.violet)}>=</div>
              <div style={big(56, C.red)}>₹647</div>
            </div>
            <div style={{ fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 26, color: C.red, letterSpacing: "0.04em" }}>SAB YAHI BHOOLTE HAIN</div>
          </div>
          {/* 3: can't raise price? sell a combo */}
          <div style={{ position: "absolute", inset: "100px 30px 20px", opacity: vis(3), display: "flex", flexDirection: "column", alignItems: "center", gap: 18 }}>
            {title(<>Price nahi badha sakte?<br /><span style={{ color: C.violet }}>Combo becho</span></>)}
            <div style={{ position: "relative", display: "flex", alignItems: "flex-end", gap: 16, background: C.lavenderSoft, borderRadius: 26, padding: "22px 34px", transform: `scale(${0.85 + 0.15 * comboP})` }}>
              <Bottle level={0.85} w={96} color="#F5A25D" label="SERUM" />
              <div style={big(56, C.violet)}>+</div>
              <Bottle level={0.85} w={96} color="#8FD3B6" label="TONER" />
              <div style={{ position: "absolute", right: -40, top: -26, transform: `rotate(8deg) scale(${comboP})`, background: C.red, color: C.white, border: `5px solid ${LINE}`, borderRadius: 999, padding: "8px 20px 2px", ...big(36, C.white) }}>COMBO</div>
            </div>
            <div style={{ fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 26, color: LINE }}>Ad ek baar, order value double</div>
          </div>
        </Whiteboard>
        <Place x={-120} y={930} s={0.92} z={4}>
          <Doctor poses={poses} mouth={sceneMouth("s6")} brows={[har, ad, price]} caseTag={TAG} />
        </Place>
      </Camera>
      <Sfx at={1} name="whoosh" vol={0.4} />
      {marks.map((a, i) => (
        <Sfx key={i} at={a - 5} name="swish" vol={0.4} />
      ))}
      {rows.map((_, i) => (
        <Sfx key={`r${i}`} at={har + i * 4} name="tick" vol={0.25} />
      ))}
      <Sfx at={combo - 2} name="ding" vol={0.45} />
    </SceneShell>
  );
};

/* ===== S7: CTA ===== */
const CalcIcon: React.FC = () => (
  <svg width={92} height={92} viewBox="0 0 92 92">
    <rect x={14} y={6} width={64} height={80} rx={12} fill={C.violet} stroke={LINE} strokeWidth={5} />
    <rect x={22} y={14} width={48} height={20} rx={4} fill={C.white} />
    {[0, 1, 2].map((r) =>
      [0, 1, 2].map((c) => <rect key={`${r}${c}`} x={22 + c * 17} y={42 + r * 14} width={12} height={9} rx={2} fill={C.lavender} />),
    )}
  </svg>
);

const CartIcon: React.FC<{ size?: number }> = ({ size = 90 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100">
    <path d="M8 18 H24 L34 66 H82 L92 32 H30" fill="none" stroke={LINE} strokeWidth={8} strokeLinejoin="round" strokeLinecap="round" />
    <rect x={38} y={36} width={16} height={18} rx={3} fill="#F5A25D" stroke={LINE} strokeWidth={4} />
    <rect x={58} y={38} width={16} height={16} rx={3} fill={C.violet} stroke={LINE} strokeWidth={4} />
    <circle cx={40} cy={82} r={8} fill={LINE} />
    <circle cx={76} cy={82} r={8} fill={LINE} />
  </svg>
);

export const S7Cta: React.FC<{ dur: number }> = ({ dur }) => {
  const price = cue("s7", "price");
  const calc = cue("s7", "calculator");
  const kal = cue("s7", "kal");
  const chhod = cue("s7", "chhod");
  const follow = cue("s7", "follow");
  const poses: PoseKey[] = [
    { at: -100, pose: "point" },
    { at: kal - 2, pose: "explain" },
    { at: follow - 4, pose: "thumbs" },
  ];
  return (
    <SceneShell dur={dur} noExit>
      <Camera dur={dur} punches={[price + 4]} push={0.02}>
        <Clinic plus={false} />
        <CtaFlow
          keyword="PRICE"
          typeAt={price - 10}
          giftAt={calc - 10}
          giftTitle="Pricing Calculator"
          giftSub="free · sahi price 1 minute mein"
          giftIcon={<CalcIcon />}
          nextAt={kal}
          nextNum="#10"
          nextLabel="KAL DOPAHAR · CASE #10"
          next={
            <>
              <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
                <CartIcon size={96} />
                <div style={big(76, C.red)}>7 / 10</div>
              </div>
              <div style={{ fontFamily: theme.fonts.display, fontWeight: 700, fontSize: 50, lineHeight: 1.12, color: LINE, textAlign: "center" }}>
                10 mein se 7 log cart
                <br />
                <span style={{ color: C.red }}>chhod kyun dete hain?</span>
              </div>
            </>
          }
          followAt={follow}
        />
        <Place x={250} y={1010} s={0.96} z={4}>
          <Doctor poses={poses} mouth={sceneMouth("s7")} brows={[price, kal]} caseTag={TAG} />
        </Place>
      </Camera>
      {Array.from({ length: 5 }).map((_, i) => (
        <Sfx key={i} at={price - 10 + i * 2} name="key" vol={0.4} />
      ))}
      <Sfx at={calc - 14} name="pop" vol={0.5} />
      <Sfx at={kal - 4} name="whoosh" vol={0.45} />
      <Sfx at={chhod - 2} name="error" vol={0.3} />
      <Sfx at={follow + 12} name="pop" vol={0.55} />
      <Sfx at={follow + 15} name="ding" vol={0.45} />
    </SceneShell>
  );
};
