import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { Parcel, Person, ROHIT, Truck } from "../../components/Cartoon";
import { Doctor, PoseKey } from "../../components/Doctor";
import { Camera } from "../../components/fx";
import { CtaFlow, HookTitle, LINE, Place, makeMouth } from "../../components/format";
import { Card, Chip, Enter, SceneShell, Sfx, clamp, inr, useSpring } from "../../components/kit";
import { QMarks } from "../../components/props";
import { Clinic, MoneyRoom, Stage, Whiteboard } from "../../components/sets";
import { C, theme } from "../../theme";
import { T, cue } from "./timeline";

const sceneMouth = makeMouth(T);
const TAG = "CASE #14";
const big = (size: number, color: string = LINE): React.CSSProperties => ({ fontFamily: theme.fonts.display, fontWeight: 700, fontSize: size, lineHeight: 1.05, color, whiteSpace: "nowrap" });
const body = (size: number, color: string = LINE): React.CSSProperties => ({ fontFamily: theme.fonts.body, fontWeight: 800, fontSize: size, color, whiteSpace: "nowrap" });

/** Profit sheet on paper: green profit with a tick. */
export const ProfitSheet: React.FC<{ w?: number }> = ({ w = 560 }) => (
  <div style={{ width: w, background: "#FFFDF5", border: `7px solid ${LINE}`, borderRadius: 22, boxShadow: `9px 9px 0 ${LINE}`, padding: "22px 30px 26px", boxSizing: "border-box", display: "flex", flexDirection: "column", gap: 10, transform: "rotate(-2deg)" }}>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <div style={body(26, C.muted)}>📄 KAAGAZ PE · IS MAHINE</div>
    </div>
    {[...Array(3)].map((_, i) => (
      <div key={i} style={{ height: 10, borderRadius: 5, background: "#E8E1F7", width: `${90 - i * 18}%` }} />
    ))}
    <div style={{ height: 5, background: LINE, borderRadius: 3, marginTop: 6 }} />
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <span style={body(36)}>Profit</span>
      <span style={big(w * 0.13, C.green)}>₹1,20,000 ✓</span>
    </div>
  </div>
);

/** Bank app on a phone: balance in red. */
export const BankPhone: React.FC<{ amount: string; w?: number }> = ({ amount, w = 420 }) => (
  <div style={{ width: w, height: w * 1.25, background: LINE, borderRadius: w * 0.12, padding: 14, boxSizing: "border-box", boxShadow: "10px 12px 0 rgba(18,4,75,0.18)" }}>
    <div style={{ width: "100%", height: "100%", borderRadius: w * 0.09, overflow: "hidden", background: C.white, display: "flex", flexDirection: "column" }}>
      <div style={{ background: C.violetDeep, padding: `${w * 0.07}px 20px ${w * 0.04}px`, ...body(w * 0.065, C.white), textAlign: "center" }}>🏦 ROHIT'S BANK</div>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 8 }}>
        <div style={body(w * 0.06, C.muted)}>Account balance</div>
        <div style={big(w * 0.2, C.red)}>{amount}</div>
        <div style={{ width: "70%", height: 10, borderRadius: 5, background: "#F1ECFB", marginTop: 10 }} />
        <div style={{ width: "50%", height: 10, borderRadius: 5, background: "#F1ECFB" }} />
      </div>
    </div>
  </div>
);

/* ===== S1: Profit ₹1.2 lakh, bank ₹8,000. Paisa kahan? ===== */
export const S1Hook: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const bank = cue("s1", "bank");
  const kahan = cue("s1", "kahan");
  const bankIn = useSpring(bank - 4, "bouncy");
  const sheetOut = interpolate(frame, [bank - 6, bank], [0, 1], clamp);
  return (
    <SceneShell dur={dur} noExit>
      <Camera dur={dur} punches={[bank, kahan]} push={0.03}>
        <MoneyRoom />
        {frame < bank + 2 && (
          <div style={{ position: "absolute", left: 0, right: 0, top: 720, display: "flex", justifyContent: "center", zIndex: 4, opacity: 1 - sheetOut, transform: `translateX(${-200 * sheetOut}px)` }}>
            <Enter delay={0} from="down" dist={60}>
              <ProfitSheet w={760} />
            </Enter>
          </div>
        )}
        {frame >= bank - 4 && (
          <div style={{ position: "absolute", left: 0, right: 0, top: 640, display: "flex", justifyContent: "center", zIndex: 5 }}>
            <div style={{ transform: `scale(${0.6 + 0.4 * bankIn}) rotate(2deg)`, opacity: Math.min(1, bankIn * 2) }}>
              <BankPhone amount="₹8,000" w={560} />
            </div>
          </div>
        )}
        {frame >= kahan - 6 && (
          <div style={{ position: "absolute", left: 160, top: 640, width: 760, height: 700, zIndex: 6 }}>
            <QMarks at={kahan - 6} />
          </div>
        )}
        <HookTitle
          top={300}
          lines={[
            { text: "Profit ₹1.2 lakh", at: -8, kind: "green", size: 96, rot: -2 },
            { text: "Bank mein ₹8,000?", at: -6, kind: "red", size: 96, rot: 2 },
          ]}
        />
      </Camera>
      <Sfx at={0} name="whoosh" vol={0.45} />
      <Sfx at={2} name="stamp" vol={0.5} />
      <Sfx at={bank - 4} name="pop" vol={0.5} />
      <Sfx at={kahan - 4} name="ding" vol={0.3} />
    </SceneShell>
  );
};

/* ===== S2: profit is on paper, cash is in the bank ===== */
export const S2Paper: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const kaagaz = cue("s2", "kaagaz");
  const cash = cue("s2", "cash");
  const ek = cue("s2", "ek");
  const hisaab = cue("s2", "hisaab");
  const neq = useSpring(cash - 2, "bouncy");
  const card = (label: string, title: string, amount: string, color: string, at: number, from: "left" | "right") => (
    <Enter delay={at} from={from} dist={80}>
      <Card style={{ width: 420, padding: "20px 24px", border: `6px solid ${LINE}`, boxShadow: `8px 8px 0 ${LINE}`, display: "flex", flexDirection: "column", alignItems: "center", gap: 10, boxSizing: "border-box" }}>
        <div style={body(26, C.muted)}>{label}</div>
        <div style={big(48)}>{title}</div>
        <div style={big(64, color)}>{amount}</div>
      </Card>
    </Enter>
  );
  return (
    <SceneShell dur={dur} noExit>
      <Camera dur={dur} punches={[cash, ek]} push={0.02}>
        <Stage />
        <div style={{ position: "absolute", left: 60, top: 330, zIndex: 5 }}>{card("📄 KAAGAZ PE", "Profit", "₹1,20,000", C.green, Math.max(0, kaagaz - 8), "left")}</div>
        <div style={{ position: "absolute", left: 600, top: 330, zIndex: 5 }}>{card("🏦 BANK MEIN", "Cash", "₹8,000", C.red, cash - 8, "right")}</div>
        {frame >= cash - 2 && (
          <div style={{ position: "absolute", left: 0, right: 0, top: 410, display: "flex", justifyContent: "center", zIndex: 7 }}>
            <div style={{ transform: `scale(${neq})`, ...big(90, C.white), background: C.red, border: `6px solid ${LINE}`, borderRadius: "50%", width: 130, height: 130, display: "flex", alignItems: "center", justifyContent: "center", paddingTop: 6, boxSizing: "border-box", boxShadow: `6px 6px 0 ${LINE}` }}>≠</div>
          </div>
        )}
        <Enter delay={ek - 6} from="down" style={{ position: "absolute", left: 0, right: 0, top: 640, display: "flex", justifyContent: "center", zIndex: 6 }}>
          <div style={{ ...big(48), background: C.white, border: `6px solid ${LINE}`, borderRadius: 20, padding: "14px 28px 6px", boxShadow: `6px 6px 0 ${LINE}`, transform: "rotate(-1deg)" }}>Dono ek din nahi aate ⏳</div>
        </Enter>
        <Place x={150} y={800} s={0.62} z={4}>
          <Person
            look={ROHIT}
            seed="r142"
            track={[
              { at: -100, pose: "shrug", mood: "shock" },
              { at: hisaab - 6, pose: "hold", mood: "neutral" },
            ]}
          />
        </Place>
        <Enter delay={hisaab - 6} from="none" cfg="snappy" style={{ position: "absolute", left: 470, top: 960, zIndex: 8 }}>
          <Chip size={28} bg={C.violet} color={C.white} border={LINE}>
            MAAN LO · ROHIT KA HISAAB
          </Chip>
        </Enter>
      </Camera>
      <Sfx at={Math.max(0, kaagaz - 8)} name="whoosh" vol={0.35} />
      <Sfx at={cash - 8} name="whoosh" vol={0.35} />
      <Sfx at={cash - 2} name="stamp" vol={0.5} />
      <Sfx at={ek - 6} name="pop" vol={0.35} />
      <Sfx at={hisaab - 6} name="pop" vol={0.35} />
    </SceneShell>
  );
};

/* ===== Where the money is stuck: rows that subtract from ₹1,20,000 ===== */
const BillIcon: React.FC<{ w?: number }> = ({ w = 130 }) => (
  <svg width={w} height={w} viewBox="0 0 130 130">
    <path d="M22 8 H108 V122 L94 112 L80 122 L66 112 L52 122 L38 112 L22 122 Z" fill={C.white} stroke={LINE} strokeWidth={6} strokeLinejoin="round" />
    <rect x={36} y={22} width={58} height={22} rx={6} fill={C.violet} />
    <text x={65} y={39} textAnchor="middle" fontFamily="Inter" fontWeight="800" fontSize="16" fill={C.white}>ADS</text>
    <rect x={36} y={56} width={58} height={8} rx={4} fill={C.lavender} />
    <rect x={36} y={72} width={40} height={8} rx={4} fill={C.lavender} />
    <text x={65} y={102} textAnchor="middle" fontFamily="Inter" fontWeight="800" fontSize="18" fill={C.red}>PAID</text>
  </svg>
);

const Boxes: React.FC = () => (
  <div style={{ position: "relative", width: 150, height: 130 }}>
    <div style={{ position: "absolute", left: 0, top: 58 }}><Parcel w={80} /></div>
    <div style={{ position: "absolute", left: 70, top: 58 }}><Parcel w={80} /></div>
    <div style={{ position: "absolute", left: 35, top: 0 }}><Parcel w={80} /></div>
  </div>
);

type Row = { icon: React.ReactNode; label: string; sub: string; v: number; at: number };
const StuckBoard: React.FC<{ rows: Row[]; totalAt?: number; bankAt?: number }> = ({ rows, totalAt = 1e9, bankAt = 1e9 }) => {
  const frame = useCurrentFrame();
  const stuck = rows.reduce((a, r) => a + (frame >= r.at ? r.v : 0), 0);
  const tot = useSpring(totalAt - 2, "bouncy");
  const bank = useSpring(bankAt - 2, "bouncy");
  return (
    <>
      <div style={{ position: "absolute", left: 0, right: 0, top: 292, display: "flex", justifyContent: "center", zIndex: 6 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14, background: C.white, border: `5px solid ${LINE}`, borderRadius: 18, padding: "10px 22px 4px", boxShadow: `5px 5px 0 ${LINE}` }}>
          <span style={body(30, C.muted)}>Profit</span>
          <span style={big(46, C.green)}>₹1,20,000</span>
          <span style={body(30, C.muted)}>· kahan atka?</span>
        </div>
      </div>
      <div style={{ position: "absolute", left: 60, right: 60, top: 390, display: "flex", flexDirection: "column", gap: 18, zIndex: 5 }}>
        {rows.map((r) => {
          const p = interpolate(frame, [r.at - 6, r.at + 4], [0, 1], { ...clamp, easing: theme.ease.out });
          return (
            <div key={r.label} style={{ opacity: p, transform: `translateX(${(1 - p) * 80}px)` }}>
              <Card style={{ padding: "12px 24px", border: `6px solid ${LINE}`, boxShadow: `7px 7px 0 ${LINE}`, display: "flex", alignItems: "center", gap: 20, height: 170, boxSizing: "border-box" }}>
                <div style={{ width: 160, display: "flex", justifyContent: "center", flexShrink: 0 }}>{r.icon}</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  <div style={big(42)}>{r.label}</div>
                  <div style={body(24, C.muted)}>{r.sub}</div>
                </div>
                <div style={{ marginLeft: "auto", ...big(54, C.red) }}>− ₹{inr(r.v)}</div>
              </Card>
            </div>
          );
        })}
      </div>
      {frame >= totalAt - 4 && (
        <div style={{ position: "absolute", left: 60, right: 60, top: 1000, zIndex: 7, transform: `scale(${0.7 + 0.3 * tot})`, display: "flex", justifyContent: "space-between", alignItems: "center", background: C.navy, borderRadius: 20, padding: "16px 28px 10px" }}>
          <span style={body(32, C.white)}>Kul atka</span>
          <span style={{ ...big(58, "#FF8A8A"), fontVariantNumeric: "tabular-nums" }}>₹{inr(stuck)}</span>
        </div>
      )}
      {frame >= bankAt - 4 && (
        <div style={{ position: "absolute", left: 0, right: 0, top: 1140, display: "flex", justifyContent: "center", zIndex: 8 }}>
          <div style={{ transform: `scale(${bank}) rotate(-2deg)`, ...big(64, C.white), background: C.red, border: `7px solid ${LINE}`, borderRadius: 24, padding: "16px 34px 6px", boxShadow: `8px 8px 0 ${LINE}` }}>Bank mein bacha: ₹8,000</div>
        </div>
      )}
    </>
  );
};

const rowsFor = (s3: { cod: number; stock: number }, ads: number): Row[] => [
  { icon: <Truck w={150} />, label: "COD courier ke paas", sub: "delivered, paisa abhi aaya nahi", v: 52000, at: s3.cod },
  { icon: <Boxes />, label: "Stock godown mein", sub: "maal khareeda, bika nahi", v: 40000, at: s3.stock },
  { icon: <BillIcon />, label: "Ad bill pehle bhara", sub: "orders ka paisa baad mein", v: 20000, at: ads },
];

/* ===== S3: COD with courier, stock in godown ===== */
export const S3Stuck: React.FC<{ dur: number }> = ({ dur }) => {
  const cod = cue("s3", "baawan");
  const stock = cue("s3", "chaalees");
  return (
    <SceneShell dur={dur} noExit>
      <Camera dur={dur} punches={[cod, stock]} push={0.02}>
        <MoneyRoom />
        <StuckBoard rows={rowsFor({ cod, stock }, 1e9)} />
      </Camera>
      <Sfx at={1} name="whoosh" vol={0.35} />
      <Sfx at={cod - 4} name="pop" vol={0.45} />
      <Sfx at={stock - 4} name="pop" vol={0.45} />
    </SceneShell>
  );
};

/* ===== S4: ad bills, total stuck ₹1,12,000, bank ₹8,000 ===== */
export const S4Total: React.FC<{ dur: number }> = ({ dur }) => {
  const ads = cue("s4", "bees");
  const kul = cue("s4", "kul");
  const aath = cue("s4", "aath");
  return (
    <SceneShell dur={dur} noExit>
      <Camera dur={dur} punches={[ads, kul, aath]} push={0.02}>
        <MoneyRoom />
        <StuckBoard rows={rowsFor({ cod: -100, stock: -100 }, ads)} totalAt={kul} bankAt={aath} />
      </Camera>
      <Sfx at={ads - 4} name="pop" vol={0.45} />
      <Sfx at={kul - 2} name="swish" vol={0.4} />
      <Sfx at={aath - 2} name="stamp" vol={0.55} />
    </SceneShell>
  );
};

/* ===== S5: Doctor's 3 fixes ===== */
export const S5Fixes: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const a = cue("s5", "chhota");
  const b = cue("s5", "chhote");
  const c = cue("s5", "monday");
  const marks = [a, b, c];
  const poses: PoseKey[] = [
    { at: -100, pose: "one" },
    { at: b - 6, pose: "two" },
    { at: c - 6, pose: "three" },
  ];
  const fixes = ["Courier se chhota COD payout cycle", "Stock chhote batch mein, best-seller pehle", "Har Monday: bank ka cash check"];
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
            <div style={{ background: C.lavenderSoft, borderRadius: 14, padding: "10px 16px 6px", ...body(28, C.violetDeep) }}>Profit ≠ Cash · paisa ka raasta dekho</div>
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
const SheetIcon: React.FC = () => (
  <svg width={92} height={92} viewBox="0 0 92 92">
    <rect x={12} y={6} width={68} height={80} rx={10} fill={C.white} stroke={LINE} strokeWidth={5} />
    <rect x={12} y={6} width={68} height={18} rx={8} fill={C.green} stroke={LINE} strokeWidth={5} />
    {[0, 1, 2, 3].map((r) => (
      <g key={r}>
        <rect x={20} y={32 + r * 13} width={22} height={7} rx={2} fill={C.lavender} />
        <rect x={48} y={32 + r * 13} width={24} height={7} rx={2} fill={r === 2 ? "#FFB3B3" : "#BDEBD0"} />
      </g>
    ))}
  </svg>
);

export const S6Cta: React.FC<{ dur: number }> = ({ dur }) => {
  const kw = cue("s6", "cash");
  const tracker = cue("s6", "cashtracker");
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
          keyword="CASH"
          typeAt={kw - 8}
          giftAt={tracker - 10}
          giftTitle="Weekly Cash Tracker"
          giftSub="free · 1 page · har Monday 10 minute"
          giftIcon={<SheetIcon />}
          nextAt={aaj}
          nextNum="#13"
          nextLabel="AAJ SHAAM 7 BAJE · AGLA CASE"
          next={
            <>
              <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                <div style={{ ...big(44, C.white), background: C.green, borderRadius: 14, padding: "10px 16px 4px" }}>ROAS 3.0</div>
                <div style={{ ...big(44, C.white), background: C.red, borderRadius: 14, padding: "10px 16px 4px" }}>LOSS</div>
              </div>
              <div style={{ fontFamily: theme.fonts.display, fontWeight: 700, fontSize: 52, lineHeight: 1.12, color: LINE, textAlign: "center" }}>
                ROAS 3 hai, phir bhi
                <br />
                <span style={{ color: C.red }}>loss kyun?</span>
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
      <Sfx at={tracker - 14} name="pop" vol={0.5} />
      <Sfx at={aaj - 4} name="whoosh" vol={0.45} />
      <Sfx at={follow + 12} name="pop" vol={0.55} />
      <Sfx at={follow + 15} name="ding" vol={0.45} />
    </SceneShell>
  );
};
