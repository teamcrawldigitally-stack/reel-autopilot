import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { Person, PRIYA, Piggy, ROHIT } from "../../components/Cartoon";
import { Doctor, PoseKey } from "../../components/Doctor";
import { Camera } from "../../components/fx";
import { CtaFlow, HookTitle, LINE, Place, makeMouth } from "../../components/format";
import { Card, Chip, Enter, SceneShell, Sfx, clamp, useSpring } from "../../components/kit";
import { QMarks } from "../../components/props";
import { Clinic, Doorstep, MoneyRoom, OfficeWall, Whiteboard } from "../../components/sets";
import { Stamp } from "../../components/widgets";
import { C, theme } from "../../theme";
import { T, cue } from "./timeline";

const sceneMouth = makeMouth(T);
const TAG = "CASE #16";
const big = (size: number, color: string = LINE): React.CSSProperties => ({ fontFamily: theme.fonts.display, fontWeight: 700, fontSize: size, lineHeight: 1.05, color, whiteSpace: "nowrap" });
const body = (size: number, color: string = LINE): React.CSSProperties => ({ fontFamily: theme.fonts.body, fontWeight: 800, fontSize: size, color, whiteSpace: "nowrap" });

/** Small diya (oil lamp) with a flickering flame. */
export const Diya: React.FC<{ w?: number; lit?: boolean }> = ({ w = 120, lit = true }) => {
  const frame = useCurrentFrame();
  const fl = 1 + Math.sin(frame / 2.3) * 0.08;
  return (
    <svg width={w} height={w * 0.9} viewBox="0 0 120 108" style={{ overflow: "visible" }}>
      {lit && (
        <g transform={`translate(60 40) scale(1 ${fl}) translate(-60 -40)`}>
          <path d="M60 4 C74 24 72 40 60 46 C48 40 46 24 60 4 Z" fill="#FFB020" stroke={LINE} strokeWidth={5} strokeLinejoin="round" />
          <path d="M60 22 C66 32 65 39 60 42 C55 39 54 32 60 22 Z" fill="#FFF1B8" />
        </g>
      )}
      <path d="M8 56 H112 C108 86 86 102 60 102 C34 102 12 86 8 56 Z" fill="#F08A3C" stroke={LINE} strokeWidth={6} strokeLinejoin="round" />
      <path d="M26 70 H94" stroke="#FFD27A" strokeWidth={6} strokeLinecap="round" />
    </svg>
  );
};

/** Daily orders bar chart: festive week (40/day) then after Diwali (12/day). */
const OrdersChart: React.FC<{ dropAt: number; w?: number; showLabels?: boolean; h?: number }> = ({ dropAt, w = 900, showLabels = true, h = 380 }) => {
  const frame = useCurrentFrame();
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun", "Mon", "Tue", "Wed"];
  const H = h;
  const vals = days.map((_, i) => (i < 6 ? 38 + ((i * 7) % 5) : 12 - ((i * 3) % 3)));
  return (
    <Card style={{ width: w, padding: "22px 26px 18px", border: `6px solid ${LINE}`, boxShadow: `8px 8px 0 ${LINE}`, boxSizing: "border-box" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
        <div style={body(28, C.muted)}>📦 ROZ KE ORDER</div>
        <Diya w={62} />
      </div>
      <div style={{ position: "relative", height: H, display: "flex", alignItems: "flex-end", gap: 14, borderBottom: `5px solid ${LINE}` }}>
        {vals.map((v, i) => {
          const after = i >= 6;
          const grow = after ? interpolate(frame, [dropAt - 4 + (i - 6) * 3, dropAt + 6 + (i - 6) * 3], [0, 1], { ...clamp, easing: theme.ease.out }) : interpolate(frame, [i * 2, i * 2 + 10], [0, 1], { ...clamp, easing: theme.ease.out });
          return (
            <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "flex-end", height: "100%" }}>
              <div style={{ width: "100%", height: (v / 44) * H * grow, background: after ? C.red : C.green, border: `4px solid ${LINE}`, borderBottom: "none", borderRadius: "12px 12px 0 0", boxSizing: "border-box" }} />
            </div>
          );
        })}
        {showLabels && (
          <>
            <div style={{ position: "absolute", left: 0, width: "58%", top: -6, display: "flex", justifyContent: "center" }}>
              <div style={{ ...body(26, C.green), background: C.greenSoft, borderRadius: 10, padding: "6px 12px" }}>DIWALI HAFTA</div>
            </div>
            <div style={{ position: "absolute", right: 0, width: "40%", top: H * 0.52, display: "flex", justifyContent: "center", opacity: interpolate(frame, [dropAt, dropAt + 6], [0, 1], clamp) }}>
              <div style={{ ...body(26, C.red), background: C.redSoft, borderRadius: 10, padding: "6px 12px" }}>DIWALI KE BAAD</div>
            </div>
          </>
        )}
      </div>
    </Card>
  );
};

/* ===== S1: Diwali ke baad sale giri? Diwali hangover ===== */
export const S1Hook: React.FC<{ dur: number }> = ({ dur }) => {
  const gir = cue("s1", "gir");
  const ghab = cue("s1", "ghabraiye");
  const hang = cue("s1", "diwalihangover");
  return (
    <SceneShell dur={dur} noExit>
      <Camera dur={dur} punches={[gir, hang]} push={0.03}>
        <OfficeWall />
        <div style={{ position: "absolute", left: 0, right: 0, top: 600, display: "flex", justifyContent: "center", zIndex: 4 }}>
          <Enter delay={0} from="down" dist={60}>
            <OrdersChart dropAt={gir - 4} w={820} h={250} showLabels={false} />
          </Enter>
        </div>
        {/* Hangover stamp overlays the chart once the phrase lands */}
        <div style={{ position: "absolute", left: 0, right: 0, top: 700, display: "flex", justifyContent: "center", zIndex: 8 }}>
          <Stamp at={hang} text="DIWALI HANGOVER" size={70} rotate={-6} color={C.violet} />
        </div>
        <Place x={360} y={1000} s={0.6} z={6}>
          <Person
            look={ROHIT}
            seed="r161"
            track={[
              { at: -100, pose: "idle", mood: "neutral" },
              { at: gir - 2, pose: "shrug", mood: "shock" },
              { at: ghab + 4, pose: "hold", mood: "neutral" },
            ]}
          />
        </Place>
        {gir < dur && (
          <div style={{ position: "absolute", left: 600, top: 1000, width: 360, height: 280, zIndex: 7 }}>
            <QMarks at={gir + 2} />
          </div>
        )}
        <HookTitle
          top={300}
          lines={[
            { text: "Diwali ke baad", at: -8, kind: "plain", size: 90, rot: -1 },
            { text: "sale achanak giri?", at: -6, kind: "red", size: 92, rot: 2 },
          ]}
        />
      </Camera>
      <Sfx at={0} name="whoosh" vol={0.45} />
      <Sfx at={2} name="stamp" vol={0.5} />
      <Sfx at={gir - 4} name="swish" vol={0.45} />
      <Sfx at={hang} name="stamp" vol={0.5} />
    </SceneShell>
  );
};

/* ===== S2: maan lo 40 a day → 12 a day ===== */
export const S2Drop: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const forty = cue("s2", "chaalees");
  const baad = cue("s2", "baad");
  const twelve = cue("s2", "baarah");
  const n = (at: number, from: number, to: number) => Math.round(interpolate(frame, [at - 6, at + 6], [from, to], clamp));
  const card = (label: string, v: number, color: string, at: number, from: "left" | "right") => (
    <Enter delay={at} from={from} dist={80}>
      <Card style={{ width: 430, padding: "18px 22px", border: `6px solid ${LINE}`, boxShadow: `8px 8px 0 ${LINE}`, display: "flex", flexDirection: "column", alignItems: "center", gap: 6, boxSizing: "border-box" }}>
        <div style={body(26, C.muted)}>{label}</div>
        <div style={{ ...big(96, color), fontVariantNumeric: "tabular-nums" }}>{v}</div>
        <div style={body(26)}>order roz</div>
      </Card>
    </Enter>
  );
  return (
    <SceneShell dur={dur} noExit>
      <Camera dur={dur} punches={[forty, twelve]} push={0.02}>
        <MoneyRoom />
        <Enter delay={0} from="none" cfg="snappy" style={{ position: "absolute", left: 0, right: 0, top: 292, display: "flex", justifyContent: "center", zIndex: 8 }}>
          <Chip size={28} bg={C.violet} color={C.white} border={LINE}>
            MAAN LO · EXAMPLE
          </Chip>
        </Enter>
        <div style={{ position: "absolute", left: 70, top: 380, zIndex: 5 }}>{card("🪔 DIWALI HAFTA", n(forty, 0, 40), C.green, Math.max(0, forty - 10), "left")}</div>
        <div style={{ position: "absolute", left: 580, top: 380, zIndex: 5 }}>{card("📉 DIWALI KE BAAD", n(twelve, 40, 12), C.red, baad - 8, "right")}</div>
        <div style={{ position: "absolute", left: 0, right: 0, top: 700, display: "flex", justifyContent: "center", zIndex: 4 }}>
          <Enter delay={2} from="down">
            <OrdersChart dropAt={twelve - 2} w={940} />
          </Enter>
        </div>
      </Camera>
      <Sfx at={Math.max(0, forty - 10)} name="whoosh" vol={0.35} />
      <Sfx at={baad - 8} name="whoosh" vol={0.35} />
      <Sfx at={twelve - 2} name="swish" vol={0.45} />
    </SceneShell>
  );
};

/* ===== S3: customers already spent bonus and budget on Diwali ===== */
const SpentTag: React.FC<{ title: string; at: number; color: string }> = ({ title, at, color }) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [at - 6, at + 4], [0, 1], { ...clamp, easing: theme.ease.out });
  return (
    <div style={{ opacity: p, transform: `translateY(${(1 - p) * 50}px) scale(${0.8 + 0.2 * p})` }}>
      <Card style={{ padding: "14px 26px 10px", border: `6px solid ${LINE}`, boxShadow: `7px 7px 0 ${LINE}`, display: "flex", alignItems: "center", gap: 16 }}>
        <div style={big(52, color)}>{title}</div>
        <div style={{ ...body(26, C.white), background: C.red, borderRadius: 10, padding: "6px 12px" }}>KHARCH ✓</div>
      </Card>
    </div>
  );
};

export const S3Why: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const bonus = cue("s3", "bonus");
  const budget = cue("s3", "budget");
  const kharch = cue("s3", "kharch");
  const shake = frame >= kharch && frame < kharch + 14 ? Math.sin((frame - kharch) * 2.2) * 8 * Math.exp(-(frame - kharch) / 6) : 0;
  return (
    <SceneShell dur={dur} noExit>
      <Camera dur={dur} punches={[kharch]} push={0.02}>
        <Doorstep />
        <div style={{ position: "absolute", left: 0, right: 0, top: 300, display: "flex", justifyContent: "center", zIndex: 6 }}>
          <Enter delay={0} from="down">
            <div style={{ ...big(54), background: C.white, border: `6px solid ${LINE}`, borderRadius: 20, padding: "14px 28px 6px", boxShadow: `6px 6px 0 ${LINE}` }}>Kyun? Priya ka wallet dekho</div>
          </Enter>
        </div>
        <div style={{ position: "absolute", left: 80, top: 460, display: "flex", flexDirection: "column", gap: 26, zIndex: 6 }}>
          <SpentTag title="🎁 Diwali bonus" at={bonus} color={C.violetDeep} />
          <SpentTag title="🛍️ Mahine ka budget" at={budget} color={C.violetDeep} />
        </div>
        <div style={{ position: "absolute", left: 120, top: 860, zIndex: 5, transform: `rotate(${shake}deg)` }}>
          <Piggy w={300} />
        </div>
        {frame >= kharch - 2 && (
          <div style={{ position: "absolute", left: 140, top: 800, zIndex: 8 }}>
            <Stamp at={kharch} text="KHAALI" size={66} rotate={-10} />
          </div>
        )}
        <Place x={560} y={760} s={0.78} z={4}>
          <Person
            look={PRIYA}
            seed="p161"
            track={[
              { at: -100, pose: "hold", mood: "happy" },
              { at: budget, pose: "shrug", mood: "neutral" },
              { at: kharch, pose: "sad", mood: "sad" },
            ]}
          />
        </Place>
      </Camera>
      <Sfx at={1} name="whoosh" vol={0.35} />
      <Sfx at={bonus - 4} name="pop" vol={0.45} />
      <Sfx at={budget - 4} name="pop" vol={0.45} />
      <Sfx at={kharch} name="stamp" vol={0.5} />
    </SceneShell>
  );
};

/* ===== S4: the mistake: panic-doubling the ad budget ===== */
const Arrow: React.FC<{ up: boolean; color: string; p: number }> = ({ up, color, p }) => (
  <svg width={90} height={110} viewBox="0 0 90 110" style={{ transform: `scale(${p})`, flexShrink: 0 }}>
    <path d={up ? "M45 6 L84 52 H60 V104 H30 V52 H6 Z" : "M45 104 L84 58 H60 V6 H30 V58 H6 Z"} fill={color} stroke={LINE} strokeWidth={6} strokeLinejoin="round" />
  </svg>
);

export const S4Mistake: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const galti = cue("s4", "galti");
  const dbl = cue("s4", "double");
  const kharcha = cue("s4", "kharcha");
  const order = cue("s4", "order");
  const kam = cue("s4", "kam");
  const x2 = useSpring(dbl - 2, "bouncy");
  const a1 = useSpring(kharcha - 2, "bouncy");
  const a2 = useSpring(order - 2, "bouncy");
  const budget = frame >= dbl ? "₹20,000" : "₹10,000";
  const row = (label: string, up: boolean, color: string, p: number, at: number) => (
    <div style={{ opacity: Math.min(1, p * 2) }}>
      <Card style={{ width: 510, padding: "14px 22px", border: `6px solid ${LINE}`, boxShadow: `7px 7px 0 ${LINE}`, display: "flex", alignItems: "center", gap: 14, boxSizing: "border-box" }}>
        <Arrow up={up} color={color} p={frame >= at - 2 ? p : 0} />
        <div style={big(52, color)}>{label}</div>
      </Card>
    </div>
  );
  return (
    <SceneShell dur={dur} noExit>
      <Camera dur={dur} punches={[dbl, kam]} push={0.02}>
        <OfficeWall />
        <Enter delay={0} from="down" style={{ position: "absolute", left: 90, right: 90, top: 300, zIndex: 5 }}>
          <Card style={{ padding: "22px 30px 18px", border: `6px solid ${LINE}`, boxShadow: `8px 8px 0 ${LINE}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <div style={body(28, C.muted)}>MAAN LO · AD BUDGET</div>
              <div style={{ ...big(80, frame >= dbl ? C.red : LINE), fontVariantNumeric: "tabular-nums" }}>{budget}</div>
            </div>
            {frame >= dbl - 2 && <div style={{ ...big(84, C.white), background: C.red, border: `6px solid ${LINE}`, borderRadius: 22, padding: "10px 24px 0", transform: `scale(${x2}) rotate(6deg)` }}>×2</div>}
          </Card>
        </Enter>
        <div style={{ position: "absolute", left: 90, top: 560, display: "flex", flexDirection: "column", gap: 22, zIndex: 6 }}>
          {row("Kharcha upar", true, C.red, a1, kharcha)}
          {row("Order kam", false, C.red, a2, order)}
        </div>
        <div style={{ position: "absolute", left: 640, top: 470, zIndex: 9 }}>
          <Stamp at={galti} text="GALTI" size={70} rotate={10} />
        </div>
        <Place x={560} y={760} s={0.78} z={4}>
          <Person
            look={ROHIT}
            seed="r164"
            track={[
              { at: -100, pose: "megaphone", mood: "shout" },
              { at: kharcha - 2, pose: "shrug", mood: "shock" },
              { at: kam, pose: "sad", mood: "sad" },
            ]}
          />
        </Place>
      </Camera>
      <Sfx at={galti} name="stamp" vol={0.55} />
      <Sfx at={dbl - 2} name="pop" vol={0.5} />
      <Sfx at={kharcha - 2} name="swish" vol={0.4} />
      <Sfx at={order - 2} name="swish" vol={0.4} />
    </SceneShell>
  );
};

/* ===== S5: Doctor's 3 fixes ===== */
export const S5Fixes: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const a = cue("s5", "thoda");
  const b = cue("s5", "thankyou");
  const c = cue("s5", "shaadi");
  const marks = [a, b, c];
  const poses: PoseKey[] = [
    { at: -100, pose: "one" },
    { at: b - 6, pose: "two" },
    { at: c - 6, pose: "three" },
  ];
  const fixes = ["Ad budget thoda kam, band nahi", "Diwali customers ko thank-you message", "Shaadi season ka offer abhi se ready"];
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
            <div style={{ background: C.lavenderSoft, borderRadius: 14, padding: "10px 16px 6px", ...body(28, C.violetDeep) }}>Ghabrao mat · teen kaam karo</div>
          </div>
          <div style={{ position: "absolute", left: 40, right: 30, top: 190, display: "flex", flexDirection: "column", gap: 30 }}>
            {fixes.map((f, i) => {
              const p = interpolate(frame, [marks[i] - 6, marks[i] + 4], [0, 1], { ...clamp, easing: theme.ease.out });
              return (
                <div key={f} style={{ display: "flex", alignItems: "center", gap: 18, opacity: p, transform: `translateX(${(1 - p) * 60}px)` }}>
                  <div style={{ width: 64, height: 64, borderRadius: 16, background: C.green, border: `5px solid ${LINE}`, display: "flex", alignItems: "center", justifyContent: "center", ...big(40, C.white), paddingTop: 4, boxSizing: "border-box", flexShrink: 0 }}>✓</div>
                  <div style={{ fontFamily: theme.fonts.display, fontWeight: 700, fontSize: 40, lineHeight: 1.1, color: LINE }}>{f}</div>
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
export const PlanIcon: React.FC = () => (
  <svg width={92} height={92} viewBox="0 0 92 92">
    <rect x={8} y={14} width={76} height={70} rx={10} fill={C.white} stroke={LINE} strokeWidth={5} />
    <rect x={8} y={14} width={76} height={18} rx={8} fill={C.violet} stroke={LINE} strokeWidth={5} />
    <text x={46} y={29} textAnchor="middle" fontFamily="Inter" fontWeight="800" fontSize="13" fill={C.white}>15 DIN</text>
    {[0, 1, 2].map((r) =>
      [0, 1, 2, 3].map((c) => <rect key={`${r}${c}`} x={16 + c * 16} y={40 + r * 13} width={11} height={9} rx={2} fill={(r * 4 + c) % 3 === 0 ? C.green : C.lavender} />),
    )}
  </svg>
);

const PhotoTile: React.FC<{ good?: boolean }> = ({ good }) => (
  <div style={{ width: 120, height: 120, borderRadius: 16, border: `5px solid ${LINE}`, background: good ? "#FFE3C2" : "#F4F2FA", display: "flex", alignItems: "center", justifyContent: "center", position: "relative", boxSizing: "border-box" }}>
    <div style={{ width: 34, height: 62, borderRadius: 10, background: "#F5A25D", border: `4px solid ${LINE}` }} />
    {good && <div style={{ position: "absolute", right: -14, top: -14, ...body(22, C.white), background: C.green, borderRadius: 10, padding: "4px 8px", border: `3px solid ${LINE}` }}>CLICK ↑</div>}
  </div>
);

export const S6Cta: React.FC<{ dur: number }> = ({ dur }) => {
  const kw = cue("s6", "plan");
  const gift = cue("s6", "pandrah");
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
          keyword="PLAN"
          typeAt={kw - 8}
          giftAt={gift - 10}
          giftTitle="Diwali ke baad: 15 din ka plan"
          giftSub="free · din-ba-din kya karna hai"
          giftIcon={<PlanIcon />}
          nextAt={aaj}
          nextNum="#17"
          nextLabel="AAJ SHAAM 7 BAJE · AGLA CASE"
          next={
            <>
              <div style={{ display: "flex", alignItems: "center", gap: 26 }}>
                <PhotoTile />
                <div style={big(56, C.violet)}>→</div>
                <PhotoTile good />
              </div>
              <div style={{ fontFamily: theme.fonts.display, fontWeight: 700, fontSize: 52, lineHeight: 1.12, color: LINE, textAlign: "center" }}>
                Photo badli, aur
                <br />
                <span style={{ color: C.green }}>clicks badh gaye?</span>
              </div>
            </>
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
