import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { Confetti, Person, PRIYA, ROHIT } from "../../components/Cartoon";
import { Doctor, PoseKey } from "../../components/Doctor";
import { Camera } from "../../components/fx";
import { CtaFlow, HookTitle, LINE, Place, makeMouth } from "../../components/format";
import { Card, Chip, Enter, SceneShell, Sfx, clamp, useSpring } from "../../components/kit";
import { Bubble, Phone, QMarks } from "../../components/props";
import { Clinic, MoneyRoom, Stage, Whiteboard } from "../../components/sets";
import { C, theme } from "../../theme";
import { T, cue } from "./timeline";

const sceneMouth = makeMouth(T);
const TAG = "CASE #12";
const big = (size: number, color: string = LINE): React.CSSProperties => ({ fontFamily: theme.fonts.display, fontWeight: 700, fontSize: size, lineHeight: 1.05, color, whiteSpace: "nowrap" });
const body = (size: number, color: string = LINE): React.CSSProperties => ({ fontFamily: theme.fonts.body, fontWeight: 800, fontSize: size, color, whiteSpace: "nowrap" });
const MKT = "#F5A25D";

/** Marketplace stall (striped awning). */
export const Stall: React.FC<{ w?: number }> = ({ w = 300 }) => (
  <svg width={w} height={w * 0.9} viewBox="0 0 300 270" style={{ overflow: "visible" }}>
    <rect x={30} y={110} width={240} height={150} fill="#FFF1E6" stroke={LINE} strokeWidth={8} />
    {[0, 1, 2, 3, 4, 5].map((i) => (
      <path key={i} d={`M${10 + i * 47} 110 L${22 + i * 47} 40 H${69 + i * 47} L${57 + i * 47} 110 Z`} fill={i % 2 ? C.white : MKT} stroke={LINE} strokeWidth={6} strokeLinejoin="round" />
    ))}
    <path d="M10 110 Q33 140 57 110 Q80 140 104 110 Q127 140 151 110 Q174 140 198 110 Q221 140 245 110 Q268 140 292 110" fill="none" stroke={LINE} strokeWidth={6} />
    <rect x={60} y={170} width={70} height={90} fill={C.violet} stroke={LINE} strokeWidth={6} />
    <rect x={160} y={160} width={90} height={60} fill="#BFD8FF" stroke={LINE} strokeWidth={6} />
    <rect x={20} y={6} width={260} height={40} rx={10} fill={LINE} />
    <text x={150} y={35} textAnchor="middle" fontFamily="Inter" fontWeight="800" fontSize="24" fill={C.white} letterSpacing="3">MARKETPLACE</text>
  </svg>
);

/** Own website = own house. */
export const Home: React.FC<{ w?: number }> = ({ w = 300 }) => (
  <svg width={w} height={w * 0.9} viewBox="0 0 300 270" style={{ overflow: "visible" }}>
    <path d="M20 120 L150 30 L280 120 Z" fill={C.violet} stroke={LINE} strokeWidth={8} strokeLinejoin="round" />
    <rect x={45} y={120} width={210} height={140} fill={C.lavender} stroke={LINE} strokeWidth={8} />
    <rect x={125} y={180} width={50} height={80} fill={C.violetDeep} stroke={LINE} strokeWidth={6} />
    <rect x={65} y={150} width={44} height={44} fill="#BFD8FF" stroke={LINE} strokeWidth={6} />
    <rect x={191} y={150} width={44} height={44} fill="#BFD8FF" stroke={LINE} strokeWidth={6} />
    <rect x={70} y={-6} width={160} height={40} rx={10} fill={LINE} />
    <text x={150} y={23} textAnchor="middle" fontFamily="Inter" fontWeight="800" fontSize="24" fill={C.white} letterSpacing="3">WEBSITE</text>
  </svg>
);

/** A receipt: start ₹1,000, deductions appear at their frames, running total. */
type Ded = { label: string; v: number; at: number; color?: string; zero?: boolean };
const Receipt: React.FC<{ title: string; icon: React.ReactNode; items: Ded[]; finalAt: number; w?: number; accent?: string }> = ({ title, icon, items, finalAt, w = 620, accent = LINE }) => {
  const frame = useCurrentFrame();
  const left = 1000 - items.reduce((a, it) => a + (frame >= it.at ? it.v : 0), 0);
  const fin = useSpring(finalAt - 2, "bouncy");
  return (
    <Card style={{ width: w, padding: "22px 30px 22px", border: `6px solid ${LINE}`, boxShadow: `8px 8px 0 ${LINE}`, display: "flex", flexDirection: "column", gap: 8, boxSizing: "border-box" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        {icon}
        <div style={big(40, accent)}>{title}</div>
        <div style={{ marginLeft: "auto", ...body(22, C.muted) }}>MAAN LO</div>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", ...body(32) }}>
        <span>Sale</span>
        <span>₹1,000</span>
      </div>
      {items.map((it) => {
        const p = interpolate(frame, [it.at - 3, it.at + 5], [0, 1], clamp);
        return (
          <div key={it.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", opacity: p, transform: `translateX(${(1 - p) * 50}px)` }}>
            <span style={body(30, C.muted)}>{it.label}</span>
            <span style={big(38, it.zero ? C.green : it.color ?? C.red)}>{it.zero ? "₹0 ✓" : `− ₹${it.v}`}</span>
          </div>
        );
      })}
      <div style={{ height: 5, background: LINE, borderRadius: 3, marginTop: 4 }} />
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={body(32)}>Haath mein</span>
        <span style={{ ...big(64, frame >= finalAt - 2 ? C.green : LINE), transform: `scale(${frame >= finalAt - 2 ? 0.8 + 0.2 * fin : 1})`, fontVariantNumeric: "tabular-nums" }}>₹{left.toLocaleString("en-IN")}</span>
      </div>
    </Card>
  );
};

/* ===== S1: same ₹1,000 sale, marketplace or website? ===== */
export const S1Hook: React.FC<{ dur: number }> = ({ dur }) => {
  const mk = cue("s1", "marketplace");
  const web = cue("s1", "website");
  const kahan = cue("s1", "kahan");
  const tag = (t: string) => <div style={{ ...big(44, C.white), background: C.green, border: `5px solid ${LINE}`, borderRadius: 16, padding: "10px 18px 4px", boxShadow: `5px 5px 0 ${LINE}` }}>{t}</div>;
  return (
    <SceneShell dur={dur} noExit>
      <Camera dur={dur} punches={[3, mk, web, kahan]} push={0.03}>
        <MoneyRoom />
        <Enter delay={mk - 10} from="left" dist={80} style={{ position: "absolute", left: 30, top: 700, zIndex: 4, display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
          <Stall w={420} />
          {tag("₹1,000 sale")}
        </Enter>
        <Enter delay={web - 10} from="right" dist={80} style={{ position: "absolute", left: 630, top: 700, zIndex: 4, display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
          <Home w={420} />
          {tag("₹1,000 sale")}
        </Enter>
        <Place x={395} y={850} s={0.55} z={5}>
          <Person
            look={ROHIT}
            seed="r121"
            track={[
              { at: -100, pose: "idle", mood: "neutral" },
              { at: mk - 2, pose: "shrug", mood: "neutral" },
              { at: kahan - 2, pose: "shrug", mood: "shock" },
            ]}
          />
        </Place>
        <div style={{ position: "absolute", left: 400, top: 700, zIndex: 6 }}>
          <QMarks at={kahan - 2} />
        </div>
        <HookTitle
          top={276}
          lines={[
            { text: "Same ₹1,000 ki sale", at: 0, size: 60 },
            { text: "MARKETPLACE vs WEBSITE", at: 8, kind: "violet", size: 66 },
            { text: "zyada kahan BACHEGA?", at: 22, kind: "red", size: 70, rot: 2 },
          ]}
        />
      </Camera>
      <Sfx at={0} name="whoosh" vol={0.45} />
      <Sfx at={8} name="stamp" vol={0.5} />
      <Sfx at={22} name="stamp" vol={0.5} />
      <Sfx at={mk - 10} name="swish" vol={0.35} />
      <Sfx at={web - 10} name="swish" vol={0.35} />
    </SceneShell>
  );
};

/* ===== S2: marketplace receipt → ₹670 ===== */
export const S2Market: React.FC<{ dur: number }> = ({ dur }) => {
  const items: Ded[] = [
    { label: "Commission", v: 180, at: cue("s2", "₹180") },
    { label: "Fixed fee", v: 30, at: cue("s2", "₹30") },
    { label: "Shipping", v: 70, at: cue("s2", "₹70") },
    { label: "Returns ka hissa", v: 50, at: cue("s2", "₹50") },
  ];
  const fin = cue("s2", "₹670");
  return (
    <SceneShell dur={dur} noExit>
      <Camera dur={dur} punches={[fin]} push={0.02}>
        <MoneyRoom />
        <Enter delay={0} from="down" style={{ position: "absolute", left: 0, right: 0, top: 292, display: "flex", justifyContent: "center", zIndex: 6 }}>
          <Chip size={26} bg={C.white} color={LINE} border={LINE}>
            ORDER 1 · MARKETPLACE
          </Chip>
        </Enter>
        <Enter delay={2} style={{ position: "absolute", left: 230, top: 380, zIndex: 5 }}>
          <Receipt title="Marketplace" icon={<Stall w={80} />} items={items} finalAt={fin} w={780} accent={C.violetDeep} />
        </Enter>
        <Place x={-30} y={820} s={0.62} z={4}>
          <Person
            look={ROHIT}
            seed="r122"
            track={[
              { at: -100, pose: "hold", mood: "neutral" },
              { at: items[0].at - 2, pose: "shrug", mood: "shock" },
              { at: fin - 2, pose: "idle", mood: "happy" },
            ]}
          />
        </Place>
      </Camera>
      <Sfx at={0} name="whoosh" vol={0.4} />
      {items.map((it, i) => (
        <Sfx key={i} at={it.at - 3} name="pop" vol={0.35} />
      ))}
      <Sfx at={fin - 2} name="ding" vol={0.45} />
    </SceneShell>
  );
};

/* ===== S3: website receipt → ₹610; order 1 to marketplace ===== */
export const S3Website: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const zero = cue("s3", "zero");
  const ad = cue("s3", "₹250");
  const fin = cue("s3", "₹610");
  const win = cue("s3", "marketplace");
  const items: Ded[] = [
    { label: "Payment fee", v: 20, at: 6 },
    { label: "Shipping", v: 70, at: 10 },
    { label: "Returns ka hissa", v: 50, at: 14 },
    { label: "Commission", v: 0, at: zero, zero: true },
    { label: "Ad (naya customer)", v: 250, at: ad, color: C.violet },
  ];
  const winP = useSpring(win - 2, "bouncy");
  return (
    <SceneShell dur={dur} noExit>
      <Camera dur={dur} punches={[ad, win]} push={0.02}>
        <MoneyRoom />
        <Enter delay={0} from="down" style={{ position: "absolute", left: 0, right: 0, top: 292, display: "flex", justifyContent: "center", zIndex: 6 }}>
          <Chip size={26} bg={C.white} color={LINE} border={LINE}>
            ORDER 1 · WEBSITE
          </Chip>
        </Enter>
        <Enter delay={2} style={{ position: "absolute", left: 150, top: 370, zIndex: 5 }}>
          <Receipt title="Website" icon={<Home w={80} />} items={items} finalAt={fin} w={780} accent={C.violet} />
        </Enter>
        {frame >= win - 4 && (
          <div style={{ position: "absolute", left: 0, right: 0, top: 1060, display: "flex", justifyContent: "center", zIndex: 8 }}>
            <div style={{ transform: `scale(${winP}) rotate(-2deg)`, display: "flex", alignItems: "center", gap: 18, background: MKT, border: `7px solid ${LINE}`, borderRadius: 26, boxShadow: `8px 8px 0 ${LINE}`, padding: "16px 30px 8px" }}>
              <div style={big(56)}>🏆</div>
              <div style={big(52)}>Order 1: Marketplace ₹670</div>
            </div>
          </div>
        )}
        <div style={{ position: "absolute", left: 300, top: 1210, zIndex: 7, ...body(30, C.muted), opacity: interpolate(frame, [win + 6, win + 14], [0, 1], clamp) }}>Website ₹610 · ad ka kharcha</div>
      </Camera>
      <Sfx at={0} name="whoosh" vol={0.4} />
      {[6, 10, 14].map((a) => (
        <Sfx key={a} at={a - 3} name="tick" vol={0.3} />
      ))}
      <Sfx at={zero - 2} name="ding" vol={0.35} />
      <Sfx at={ad - 3} name="pop" vol={0.45} />
      <Sfx at={fin - 2} name="pop" vol={0.4} />
      <Sfx at={win - 2} name="stamp" vol={0.55} />
    </SceneShell>
  );
};

/* ===== S4: twist, order 2: marketplace ₹670 again, website ₹860 ===== */
export const S4Twist: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const doosra = cue("s4", "doosra");
  const m670 = cue("s4", "₹670");
  const wa = cue("s4", "whatsapp");
  const w860 = cue("s4", "₹860");
  const p860 = useSpring(w860 - 2, "bouncy");
  const totals = frame >= w860 + 16;
  const col = (icon: React.ReactNode, o1: string, o2: string, o2At: number, o2Col: string, tot: string, totCol: string, win: boolean) => (
    <Card style={{ width: 420, padding: "18px 22px", border: `6px solid ${LINE}`, boxShadow: `8px 8px 0 ${LINE}`, display: "flex", flexDirection: "column", alignItems: "center", gap: 8, boxSizing: "border-box" }}>
      {icon}
      <div style={{ display: "flex", justifyContent: "space-between", width: "100%", ...body(34, C.muted) }}>
        <span>Order 1</span>
        <span style={{ color: LINE }}>{o1}</span>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%", opacity: interpolate(frame, [o2At - 3, o2At + 4], [0, 1], clamp) }}>
        <span style={body(34, C.muted)}>Order 2</span>
        <span style={{ ...big(58, o2Col), transform: win ? `scale(${0.7 + 0.3 * p860})` : undefined }}>{o2}</span>
      </div>
      <div style={{ height: 4, background: LINE, width: "100%", borderRadius: 2, opacity: totals ? 1 : 0 }} />
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%", opacity: interpolate(frame, [w860 + 16, w860 + 24], [0, 1], clamp) }}>
        <span style={body(32)}>2 order ka total</span>
        <span style={big(52, totCol)}>{tot}</span>
      </div>
    </Card>
  );
  return (
    <SceneShell dur={dur} noExit>
      <Camera dur={dur} punches={[doosra, w860]} push={0.02}>
        <Stage />
        <Enter delay={doosra - 4} from="none" cfg="snappy" style={{ position: "absolute", left: 0, right: 0, top: 292, display: "flex", justifyContent: "center", zIndex: 6 }}>
          <div style={{ ...big(56, C.white), background: C.red, border: `6px solid ${LINE}`, borderRadius: 20, padding: "12px 30px 4px", transform: "rotate(-2deg)" }}>TWIST: ORDER 2</div>
        </Enter>
        <div style={{ position: "absolute", left: 60, top: 410, zIndex: 5 }}>
          <Enter delay={2} from="left">
            {col(<Stall w={180} />, "₹670", "₹670", m670, LINE, "₹1,340", LINE, false)}
          </Enter>
        </div>
        <div style={{ position: "absolute", left: 600, top: 410, zIndex: 5 }}>
          <Enter delay={4} from="right">
            {col(<Home w={180} />, "₹610", "₹860", w860, C.green, "₹1,470", C.green, true)}
          </Enter>
        </div>
        <div style={{ position: "absolute", left: 60, top: 860, zIndex: 6, ...body(26, C.white), opacity: interpolate(frame, [m670, m670 + 6], [0, 1], clamp), background: C.navy, borderRadius: 14, padding: "10px 16px 8px" }}>
          Commission phir se − ₹180
        </div>
        {frame >= wa - 8 && (
          <Place x={600} y={840} s={1.12} z={7}>
            <Phone w={360} h={300} title="Rohit's Store">
              <Bubble at={wa - 6}>Priya: Wahi wala ek aur bhejo! 🛍️</Bubble>
              <Bubble at={wa + 8} me>Done! Ad kharcha: ₹0</Bubble>
            </Phone>
          </Place>
        )}
        <Place x={200} y={900} s={0.5} z={6}>
          <Person
            look={PRIYA}
            seed="p124"
            track={[
              { at: -100, pose: "idle", mood: "neutral" },
              { at: wa - 4, pose: "hold", mood: "happy" },
              { at: w860, pose: "cheer", mood: "grin" },
            ]}
          />
        </Place>
        <Confetti at={w860} x={810} y={560} n={28} />
      </Camera>
      <Sfx at={doosra - 4} name="stamp" vol={0.5} />
      <Sfx at={m670 - 3} name="pop" vol={0.35} />
      <Sfx at={wa - 6} name="pop" vol={0.4} />
      <Sfx at={wa + 8} name="pop" vol={0.35} />
      <Sfx at={w860 - 2} name="ding" vol={0.5} />
      <Sfx at={w860 + 16} name="swish" vol={0.35} />
    </SceneShell>
  );
};

/* ===== S5: lesson + Doctor's 3 fixes ===== */
export const S5Fixes: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const hisaab = cue("s5", "hisaab");
  const high = cue("s5", "haai");
  const wa = cue("s5", "whatsapp");
  const marks = [hisaab, high, wa];
  const poses: PoseKey[] = [
    { at: -100, pose: "one" },
    { at: high - 6, pose: "two" },
    { at: wa - 6, pose: "three" },
  ];
  const fixes = ["Har channel ka hisaab alag", "Marketplace pe sirf high-margin", "Website customers: WhatsApp repeat"];
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
          <div style={{ position: "absolute", left: 30, right: 30, top: 96, display: "flex", gap: 14, alignItems: "center", justifyContent: "center" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, background: "#FFF1E6", borderRadius: 14, padding: "10px 14px 6px", ...body(27) }}>Marketplace = kiraye ki dukaan</div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, background: C.lavenderSoft, borderRadius: 14, padding: "10px 14px 6px", ...body(27, C.violetDeep) }}>Website = apna ghar</div>
          </div>
          <div style={{ position: "absolute", left: 40, right: 30, top: 190, display: "flex", flexDirection: "column", gap: 26 }}>
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
      {marks.map((a, i) => (
        <Sfx key={i} at={a - 5} name="check" vol={0.4} />
      ))}
    </SceneShell>
  );
};

/* ===== S6: CTA ===== */
const CalcIcon: React.FC = () => (
  <svg width={92} height={92} viewBox="0 0 92 92">
    <rect x={14} y={6} width={64} height={80} rx={12} fill={C.violet} stroke={LINE} strokeWidth={5} />
    <rect x={22} y={14} width={48} height={20} rx={4} fill={C.white} />
    {[0, 1, 2].map((r) => [0, 1, 2].map((c) => <rect key={`${r}${c}`} x={22 + c * 17} y={42 + r * 14} width={12} height={9} rx={2} fill={C.lavender} />))}
  </svg>
);

export const S6Cta: React.FC<{ dur: number }> = ({ dur }) => {
  const ch = cue("s6", "channel");
  const calc = cue("s6", "calculator");
  const kal = cue("s6", "kal");
  const follow = cue("s6", "follow");
  const poses: PoseKey[] = [
    { at: -100, pose: "point" },
    { at: kal - 2, pose: "explain" },
    { at: follow - 4, pose: "thumbs" },
  ];
  return (
    <SceneShell dur={dur} noExit>
      <Camera dur={dur} punches={[ch + 4]} push={0.02}>
        <Clinic plus={false} />
        <CtaFlow
          keyword="CHANNEL"
          typeAt={ch - 10}
          giftAt={calc - 10}
          giftTitle="Channel Profit Calculator"
          giftSub="free · har order ka asli bachat"
          giftIcon={<CalcIcon />}
          nextAt={kal}
          nextNum="#14"
          nextLabel="KAL DOPAHAR · CASE #14"
          next={
            <>
              <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                <div style={{ ...big(44, C.white), background: C.green, borderRadius: 14, padding: "10px 16px 4px" }}>Profit ₹1.2 lakh</div>
                <div style={{ ...big(44, C.white), background: C.red, borderRadius: 14, padding: "10px 16px 4px" }}>Bank ₹8,000</div>
              </div>
              <div style={{ fontFamily: theme.fonts.display, fontWeight: 700, fontSize: 52, lineHeight: 1.12, color: LINE, textAlign: "center" }}>
                Profit hai, phir bhi
                <br />
                <span style={{ color: C.red }}>paisa kahan gaya?</span>
              </div>
            </>
          }
          followAt={follow}
        />
        <Place x={250} y={1010} s={0.96} z={4}>
          <Doctor poses={poses} mouth={sceneMouth("s6")} brows={[ch, kal]} caseTag={TAG} />
        </Place>
      </Camera>
      {Array.from({ length: 7 }).map((_, i) => (
        <Sfx key={i} at={ch - 10 + i * 2} name="key" vol={0.4} />
      ))}
      <Sfx at={calc - 14} name="pop" vol={0.5} />
      <Sfx at={kal - 4} name="whoosh" vol={0.45} />
      <Sfx at={follow + 12} name="pop" vol={0.55} />
      <Sfx at={follow + 15} name="ding" vol={0.45} />
    </SceneShell>
  );
};

