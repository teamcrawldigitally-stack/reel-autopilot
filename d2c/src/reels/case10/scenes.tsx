import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { Burst, Person, PRIYA, ROHIT } from "../../components/Cartoon";
import { Doctor, PoseKey } from "../../components/Doctor";
import { Camera } from "../../components/fx";
import { CtaFlow, HookTitle, LINE, Place, makeMouth } from "../../components/format";
import { Card, Chip, Enter, SceneShell, Sfx, clamp, useSpring } from "../../components/kit";
import { QMarks } from "../../components/props";
import { Clinic, Doorstep, OfficeWall, Whiteboard } from "../../components/sets";
import { Stamp } from "../../components/widgets";
import { C, theme } from "../../theme";
import { T, cue } from "./timeline";

const sceneMouth = makeMouth(T);
const TAG = "CASE #10";
const big = (size: number, color: string = LINE): React.CSSProperties => ({ fontFamily: theme.fonts.display, fontWeight: 700, fontSize: size, lineHeight: 1.05, color, whiteSpace: "nowrap" });
const body = (size: number, color: string = LINE): React.CSSProperties => ({ fontFamily: theme.fonts.body, fontWeight: 800, fontSize: size, color, whiteSpace: "nowrap" });

/** Shopping cart icon; grey = abandoned. */
export const CartIcon: React.FC<{ size?: number; grey?: boolean }> = ({ size = 90, grey }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" style={{ overflow: "visible" }}>
    <path d="M8 18 H24 L34 66 H82 L92 32 H30" fill={grey ? "#ECE8F5" : C.white} stroke={grey ? "#A9A3C4" : LINE} strokeWidth={8} strokeLinejoin="round" strokeLinecap="round" />
    <rect x={38} y={36} width={16} height={18} rx={3} fill={grey ? "#CFCAE0" : "#F5A25D"} stroke={grey ? "#A9A3C4" : LINE} strokeWidth={4} />
    <rect x={58} y={38} width={16} height={16} rx={3} fill={grey ? "#CFCAE0" : C.violet} stroke={grey ? "#A9A3C4" : LINE} strokeWidth={4} />
    <circle cx={40} cy={82} r={8} fill={grey ? "#A9A3C4" : LINE} />
    <circle cx={76} cy={82} r={8} fill={grey ? "#A9A3C4" : LINE} />
  </svg>
);

/** Row of 10 carts; 7 go grey and drop away from `goAt`. */
const CartRow: React.FC<{ goAt: number; size?: number }> = ({ goAt, size = 84 }) => {
  const frame = useCurrentFrame();
  const gone = [0, 1, 3, 4, 6, 7, 9];
  return (
    <div style={{ display: "flex", gap: 6 }}>
      {Array.from({ length: 10 }).map((_, i) => {
        const k = gone.indexOf(i);
        const t = k >= 0 ? frame - (goAt + k * 2) : -1;
        const g = k >= 0 && t >= 0;
        const drop = g ? interpolate(t, [6, 22], [0, 1], { ...clamp, easing: theme.ease.in }) : 0;
        return (
          <div key={i} style={{ transform: `translateY(${drop * 60}px) rotate(${drop * (i % 2 ? 14 : -14)}deg)`, opacity: 1 - drop * 0.75 }}>
            <CartIcon size={size} grey={g} />
          </div>
        );
      })}
    </div>
  );
};

/** Checkout screen on a phone. Rows appear at their frames; total updates. */
const Checkout: React.FC<{ shipAt: number; codAt: number; w?: number; scale?: number }> = ({ shipAt, codAt, w = 430 }) => {
  const frame = useCurrentFrame();
  const ship = frame >= shipAt;
  const cod = frame >= codAt;
  const total = 799 + (ship ? 99 : 0) + (cod ? 49 : 0);
  const row = (l: string, v: string, at: number, col: string = LINE) => {
    const p = interpolate(frame, [at - 2, at + 6], [0, 1], clamp);
    return (
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", opacity: p, transform: `translateX(${(1 - p) * 40}px)` }}>
        <span style={body(26, C.muted)}>{l}</span>
        <span style={big(34, col)}>{v}</span>
      </div>
    );
  };
  const bump = Math.max(useSpring(shipAt, "bouncy") * (frame < shipAt + 14 ? 1 : 0), useSpring(codAt, "bouncy") * (frame < codAt + 14 ? 1 : 0));
  return (
    <div style={{ width: w, background: LINE, borderRadius: 52, padding: 14, boxSizing: "border-box", boxShadow: "12px 14px 0 rgba(18,4,75,0.18)" }}>
      <div style={{ background: C.white, borderRadius: 40, overflow: "hidden" }}>
        <div style={{ background: C.violet, padding: "28px 24px 16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={body(24, C.white)}>Rohit's Store</span>
          <span style={body(20, C.lavender)}>CHECKOUT</span>
        </div>
        <div style={{ padding: "22px 26px 26px", display: "flex", flexDirection: "column", gap: 14 }}>
          {row("Product", "₹799", -10)}
          {row("Shipping", "+ ₹99", shipAt, C.red)}
          {row("COD fee", "+ ₹49", codAt, C.red)}
          <div style={{ height: 5, background: LINE, borderRadius: 3 }} />
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={body(30)}>TOTAL</span>
            <span style={{ ...big(56, total > 799 ? C.red : LINE), transform: `scale(${1 + 0.18 * bump})`, fontVariantNumeric: "tabular-nums" }}>₹{total}</span>
          </div>
          <div style={{ marginTop: 6, background: C.green, borderRadius: 18, padding: "16px 0 12px", textAlign: "center", ...big(30, C.white), opacity: 0.9 }}>PAY NOW</div>
        </div>
      </div>
    </div>
  );
};

/* ===== S1: ₹799 product, ₹947 at checkout, 7 of 10 leave ===== */
export const S1Hook: React.FC<{ dur: number }> = ({ dur }) => {
  const total = cue("s1", "₹947");
  const seven = cue("s1", "7");
  const gayab = cue("s1", "gayab");
  return (
    <SceneShell dur={dur} noExit>
      <Camera dur={dur} punches={[3, total, seven]} push={0.03}>
        <Doorstep />
        <Place x={20} y={700} s={0.9} z={4}>
          <Person
            look={PRIYA}
            seed="p101"
            track={[
              { at: -100, pose: "hold", mood: "happy" },
              { at: total - 2, pose: "shrug", mood: "shock" },
              { at: gayab - 2, pose: "wave", mood: "neutral" },
            ]}
          />
        </Place>
        <Place x={560} y={640} s={0.95} z={6}>
          <Checkout shipAt={total - 10} codAt={total - 4} />
        </Place>
        <div style={{ position: "absolute", left: 0, right: 0, top: 1230, display: "flex", justifyContent: "center", zIndex: 8 }}>
          <Enter delay={seven - 14} from="up" dist={30}>
            <div style={{ background: "rgba(255,255,255,0.92)", border: `5px solid ${LINE}`, borderRadius: 26, padding: "14px 18px 10px" }}>
              <CartRow goAt={seven} size={80} />
            </div>
          </Enter>
        </div>
        <HookTitle
          top={276}
          lines={[
            { text: "₹799 ka product, checkout pe ₹947", at: 0, size: 52 },
            { text: "10 MEIN SE 7", at: 8, kind: "red", size: 104 },
            { text: "cart chhod ke gayab!", at: 22, size: 64 },
          ]}
        />
      </Camera>
      <Sfx at={0} name="whoosh" vol={0.45} />
      <Sfx at={8} name="stamp" vol={0.55} />
      <Sfx at={total - 10} name="pop" vol={0.35} />
      <Sfx at={total - 4} name="pop" vol={0.35} />
      <Sfx at={total} name="error" vol={0.3} />
      <Sfx at={seven} name="swish" vol={0.4} />
      <Sfx at={gayab} name="whoosh" vol={0.35} />
    </SceneShell>
  );
};

/* ===== S2: ~70% carts are abandoned worldwide; 3 reasons ===== */
export const S2Fact: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const pct = cue("s2", "70%");
  const teen = cue("s2", "teen");
  const fix = cue("s2", "fix");
  const n = Math.round(interpolate(frame, [4, pct + 10], [0, 70], { ...clamp, easing: theme.ease.out }));
  const reasons = ["Extra charge", "Delivery date?", "Sign-up"];
  return (
    <SceneShell dur={dur} noExit>
      <Camera dur={dur} punches={[pct + 4, fix]} push={0.02}>
        <OfficeWall />
        <Enter delay={0} style={{ position: "absolute", left: 80, right: 80, top: 300, zIndex: 5 }}>
          <Card style={{ padding: "30px 36px 26px", border: `6px solid ${LINE}`, boxShadow: `8px 8px 0 ${LINE}`, display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
            <div style={body(28, C.muted)}>DUNIYA BHAR KA AVERAGE</div>
            <div style={{ display: "flex", alignItems: "baseline", gap: 18 }}>
              <div style={{ ...big(150, C.red), fontVariantNumeric: "tabular-nums" }}>{n}%</div>
              <div style={big(48)}>cart adhoore</div>
            </div>
            <div style={{ fontFamily: theme.fonts.body, fontWeight: 700, fontSize: 22, color: C.muted }}>Source: Baymard Institute · 50 studies ka average (70.22%)</div>
          </Card>
        </Enter>
        {frame >= teen - 6 && (
          <div style={{ position: "absolute", left: 80, right: 80, top: 690, display: "flex", flexDirection: "column", gap: 14, zIndex: 6 }}>
            <Enter delay={teen - 6} from="none" cfg="snappy">
              <Chip size={28} bg={C.navy}>
                TEEN BADE KAARAN
              </Chip>
            </Enter>
            {reasons.map((r, i) => (
              <Enter key={r} delay={teen + i * 5} from="left" dist={60}>
                <div style={{ display: "flex", alignItems: "center", gap: 18, background: C.white, border: `5px solid ${LINE}`, borderRadius: 20, padding: "12px 20px 8px", width: 520 }}>
                  <div style={{ width: 52, height: 52, borderRadius: "50%", background: C.violet, color: C.white, display: "flex", alignItems: "center", justifyContent: "center", ...big(30, C.white), paddingTop: 4, boxSizing: "border-box" }}>{i + 1}</div>
                  <div style={big(40)}>{r}</div>
                  {frame >= fix - 2 && <div style={{ marginLeft: "auto", ...body(24, C.white), background: C.green, borderRadius: 999, padding: "8px 14px 6px", transform: `scale(${interpolate(frame, [fix - 2 + i * 3, fix + 6 + i * 3], [0, 1], clamp)})` }}>FIX ✓</div>}
                </div>
              </Enter>
            ))}
          </div>
        )}
        <Place x={640} y={760} s={0.78} z={4}>
          <Person
            look={ROHIT}
            seed="r102"
            track={[
              { at: -100, pose: "shrug", mood: "shock" },
              { at: fix - 4, pose: "cheer", mood: "grin" },
            ]}
          />
        </Place>
      </Camera>
      <Sfx at={0} name="whoosh" vol={0.4} />
      <Sfx at={pct - 4} name="riser" vol={0.3} />
      <Sfx at={pct + 14} name="stamp" vol={0.45} />
      {[0, 1, 2].map((i) => (
        <Sfx key={i} at={teen + i * 5} name="pop" vol={0.35} />
      ))}
      <Sfx at={fix} name="ding" vol={0.4} />
    </SceneShell>
  );
};

/* ===== S3: reason 1, surprise charges at checkout ===== */
export const S3Charges: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const extra = cue("s3", "extra");
  const ship = cue("s3", "₹99");
  const cod = cue("s3", "₹49");
  const gayi = cue("s3", "gayi");
  const walk = interpolate(frame, [gayi, gayi + 22], [0, 1], { ...clamp, easing: theme.ease.in });
  return (
    <SceneShell dur={dur} noExit>
      <Camera dur={dur} punches={[extra, gayi]} push={0.02}>
        <Doorstep />
        <Enter delay={2} from="down" style={{ position: "absolute", left: 0, right: 0, top: 292, display: "flex", justifyContent: "center", gap: 14, zIndex: 7 }}>
          <Chip size={28} bg={C.white} color={LINE} border={LINE}>
            KAARAN 1 · EXTRA CHARGE
          </Chip>
        </Enter>
        <Enter delay={extra - 6} from="none" scaleFrom={0.5} cfg="snappy" style={{ position: "absolute", left: 0, right: 0, top: 380, display: "flex", justifyContent: "center", zIndex: 7 }}>
          <div style={{ ...big(44, C.white), background: C.red, border: `5px solid ${LINE}`, borderRadius: 18, padding: "12px 24px 6px", transform: "rotate(-2deg)" }}>40% log isi pe chhodte hain</div>
        </Enter>
        <Place x={530} y={520} s={1.05} z={6}>
          <Checkout shipAt={ship - 3} codAt={cod - 3} />
        </Place>
        <Place x={-10 - walk * 520} y={640} s={0.95} z={4}>
          <Person
            look={PRIYA}
            seed="p103"
            flip={frame >= gayi}
            track={[
              { at: -100, pose: "hold", mood: "happy" },
              { at: ship - 2, pose: "hold", mood: "neutral" },
              { at: cod - 2, pose: "shrug", mood: "shock" },
              { at: gayi - 2, pose: "wave", mood: "sad" },
            ]}
          />
        </Place>
        <Burst at={gayi + 2} text="BYE!" color={C.violet} size={70} rot={-8} style={{ left: 120, top: 620, zIndex: 9 }} />
      </Camera>
      <Sfx at={2} name="whoosh" vol={0.4} />
      <Sfx at={extra - 6} name="stamp" vol={0.5} />
      <Sfx at={ship - 3} name="pop" vol={0.4} />
      <Sfx at={cod - 3} name="pop" vol={0.4} />
      <Sfx at={cod + 2} name="error" vol={0.3} />
      <Sfx at={gayi} name="swish" vol={0.45} />
    </SceneShell>
  );
};

/* ===== S4: reasons 2 and 3, unknown delivery date + forced sign-up ===== */
export const S4More: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const kab = cue("s4", "kab");
  const teesra = cue("s4", "teesra");
  const acc = cue("s4", "account");
  const pw = cue("s4", "password");
  const fields = ["Naam", "Email", "Password", "Password dobara"];
  return (
    <SceneShell dur={dur} noExit>
      <Camera dur={dur} punches={[kab, acc]} push={0.02}>
        <Doorstep />
        <Enter delay={0} style={{ position: "absolute", left: 70, top: 300, width: 620, zIndex: 5 }}>
          <Card style={{ padding: "22px 28px", border: `6px solid ${LINE}`, boxShadow: `8px 8px 0 ${LINE}`, display: "flex", flexDirection: "column", gap: 10 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <Chip size={22} bg={C.violet}>KAARAN 2</Chip>
              <div style={body(26, C.red)}>20% log</div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <div style={big(46)}>Delivery:</div>
              <div style={{ ...big(64, C.red), transform: `scale(${1 + 0.15 * Math.sin(frame / 4) * (frame > kab ? 1 : 0)})` }}>???</div>
            </div>
          </Card>
        </Enter>
        <div style={{ position: "absolute", left: 720, top: 300, zIndex: 6 }}>
          <QMarks at={kab - 2} />
        </div>
        {frame >= teesra - 6 && (
          <Enter delay={teesra - 6} from="up" style={{ position: "absolute", left: 70, top: 600, width: 620, zIndex: 5 }}>
            <Card style={{ padding: "22px 28px", border: `6px solid ${LINE}`, boxShadow: `8px 8px 0 ${LINE}`, display: "flex", flexDirection: "column", gap: 10 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Chip size={22} bg={C.violet}>KAARAN 3</Chip>
                <div style={body(26, C.red)}>18% log</div>
              </div>
              <div style={big(40)}>Pehle account banao!</div>
              {fields.map((f, i) => (
                <div key={f} style={{ border: `4px solid ${LINE}`, borderRadius: 12, padding: "8px 14px 4px", ...body(24, C.muted), opacity: interpolate(frame, [acc + i * 4, acc + i * 4 + 5], [0, 1], clamp) }}>
                  {f}
                  {i >= 2 && <span style={{ float: "right", color: LINE }}>••••••</span>}
                </div>
              ))}
            </Card>
          </Enter>
        )}
        <div style={{ position: "absolute", left: 470, top: 1060, zIndex: 9 }}>
          <Stamp at={pw + 6} text="UFF!" size={70} rotate={-8} />
        </div>
        <Place x={700} y={700} s={0.8} z={4}>
          <Person
            look={PRIYA}
            seed="p104"
            track={[
              { at: -100, pose: "shrug", mood: "neutral" },
              { at: acc - 2, pose: "shrug", mood: "shock" },
              { at: pw + 4, pose: "sad", mood: "sad" },
            ]}
          />
        </Place>
      </Camera>
      <Sfx at={0} name="whoosh" vol={0.4} />
      <Sfx at={kab} name="error" vol={0.25} />
      <Sfx at={teesra - 6} name="swish" vol={0.4} />
      {fields.map((_, i) => (
        <Sfx key={i} at={acc + i * 4} name="tick" vol={0.25} />
      ))}
      <Sfx at={pw + 6} name="stamp" vol={0.5} />
    </SceneShell>
  );
};

/* ===== S5: Doctor's 3 fixes ===== */
export const S5Fixes: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const poora = cue("s5", "poora");
  const pin = cue("s5", "pincode");
  const sign = cue("s5", "sign-up");
  const phone = cue("s5", "phone");
  const marks = [poora, pin, sign];
  const step = frame >= sign - 4 ? 3 : frame >= pin - 4 ? 2 : 1;
  const vis = (s: number) => {
    const ins = s === 1 ? 0 : marks[s - 1] - 6;
    const outs = s < 3 ? marks[s] - 6 : 1e9;
    return Math.min(interpolate(frame, [ins, ins + 10], [0, 1], clamp), interpolate(frame, [outs, outs + 8], [1, 0], clamp));
  };
  const poses: PoseKey[] = [
    { at: -100, pose: "one" },
    { at: pin - 4, pose: "two" },
    { at: sign - 4, pose: "three" },
  ];
  const title = (t: React.ReactNode) => <div style={{ fontFamily: theme.fonts.display, fontWeight: 700, fontSize: 54, lineHeight: 1.12, color: LINE, textAlign: "center", whiteSpace: "nowrap" }}>{t}</div>;
  const typed = "560001".slice(0, Math.max(0, Math.floor((frame - pin) / 2)));
  const dateOn = frame >= pin + 14;
  return (
    <SceneShell dur={dur} noExit>
      <Camera dur={dur} push={0.02}>
        <Clinic />
        <Whiteboard style={{ left: 250, top: 300, width: 780, height: 640 }}>
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
          {/* 1: full total on the product page */}
          <div style={{ position: "absolute", inset: "100px 30px 20px", opacity: vis(1), display: "flex", flexDirection: "column", alignItems: "center", gap: 18 }}>
            {title(<>Poora total<br /><span style={{ color: C.violet }}>product page pe hi</span></>)}
            <div style={{ width: 620, background: C.lavenderSoft, border: `5px solid ${LINE}`, borderRadius: 18, padding: "16px 24px 12px", display: "flex", flexDirection: "column", gap: 6 }}>
              <div style={{ display: "flex", justifyContent: "space-between", ...body(38) }}><span>Price</span><span>₹799</span></div>
              <div style={{ display: "flex", justifyContent: "space-between", ...body(38), opacity: interpolate(frame, [poora + 4, poora + 10], [0, 1], clamp) }}><span>Delivery</span><span>₹99</span></div>
              <div style={{ height: 4, background: LINE, borderRadius: 2 }} />
              <div style={{ display: "flex", justifyContent: "space-between", ...big(52, C.green), opacity: interpolate(frame, [poora + 10, poora + 16], [0, 1], clamp) }}><span>Total</span><span>₹898</span></div>
            </div>
            <div style={body(28, C.muted)}>Koi surprise nahi = checkout pe bharosa</div>
          </div>
          {/* 2: pincode → delivery date */}
          <div style={{ position: "absolute", inset: "100px 30px 20px", opacity: vis(2), display: "flex", flexDirection: "column", alignItems: "center", gap: 22 }}>
            {title(<>Pincode daalo,<br /><span style={{ color: C.violet }}>delivery date dekho</span></>)}
            <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
              <div style={{ width: 320, border: `5px solid ${LINE}`, borderRadius: 14, padding: "12px 18px 6px", ...big(56), fontVariantNumeric: "tabular-nums" }}>
                {typed}
                <span style={{ opacity: frame % 20 < 10 ? 1 : 0, color: C.violet }}>|</span>
              </div>
              <div style={{ background: C.violet, borderRadius: 14, padding: "16px 20px 10px", ...body(34, C.white) }}>CHECK</div>
            </div>
            <div style={{ transform: `scale(${dateOn ? 1 : 0.6})`, opacity: dateOn ? 1 : 0, background: C.greenSoft, border: `5px solid ${C.green}`, borderRadius: 18, padding: "14px 26px 8px", ...big(56, C.green) }}>Delivery by Fri ✓</div>
          </div>
          {/* 3: phone + OTP only */}
          <div style={{ position: "absolute", inset: "100px 30px 20px", opacity: vis(3), display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
            {title(<>Sign-up hatao.<br /><span style={{ color: C.violet }}>Sirf phone + OTP</span></>)}
            {["Email", "Password", "Password dobara"].map((f, i) => (
              <div key={f} style={{ position: "relative", width: 560, border: `4px solid #B9B3CC`, borderRadius: 12, padding: "6px 14px 2px", ...body(30, "#B9B3CC") }}>
                {f}
                <div style={{ position: "absolute", left: -6, top: "50%", height: 6, background: C.red, borderRadius: 3, width: `${interpolate(frame, [sign + 2 + i * 3, sign + 8 + i * 3], [0, 104], clamp)}%` }} />
              </div>
            ))}
            <div style={{ width: 560, border: `5px solid ${C.green}`, borderRadius: 14, padding: "12px 18px 6px", ...big(44), display: "flex", justifyContent: "space-between", transform: `scale(${interpolate(frame, [phone - 4, phone + 4], [0.9, 1.06], clamp)})` }}>
              <span>📱 98xxx xxxxx</span>
              <span style={{ color: C.green }}>OTP</span>
            </div>
          </div>
        </Whiteboard>
        <Place x={-120} y={930} s={0.92} z={4}>
          <Doctor poses={poses} mouth={sceneMouth("s5")} brows={marks} caseTag={TAG} />
        </Place>
      </Camera>
      <Sfx at={1} name="whoosh" vol={0.4} />
      {marks.map((a, i) => (
        <Sfx key={i} at={a - 6} name="swish" vol={0.4} />
      ))}
      {Array.from({ length: 6 }).map((_, i) => (
        <Sfx key={`k${i}`} at={pin + i * 2} name="key" vol={0.3} />
      ))}
      <Sfx at={pin + 14} name="ding" vol={0.4} />
      <Sfx at={phone} name="ding" vol={0.4} />
    </SceneShell>
  );
};

/* ===== S6: CTA ===== */
const ChatIcon: React.FC = () => (
  <svg width={92} height={92} viewBox="0 0 92 92">
    <path d="M10 14 H82 Q86 14 86 18 V58 Q86 62 82 62 H34 L18 78 V62 H10 Q6 62 6 58 V18 Q6 14 10 14 Z" fill={C.green} stroke={LINE} strokeWidth={5} strokeLinejoin="round" />
    <rect x={18} y={26} width={52} height={7} rx={3} fill={C.white} />
    <rect x={18} y={40} width={36} height={7} rx={3} fill={C.white} />
  </svg>
);

const Shop: React.FC<{ size?: number }> = ({ size = 90 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100">
    <rect x={14} y={40} width={72} height={50} fill="#FFF1E6" stroke={LINE} strokeWidth={6} />
    <path d="M8 40 L16 14 H84 L92 40 Z" fill="#F5A25D" stroke={LINE} strokeWidth={6} strokeLinejoin="round" />
    <rect x={40} y={60} width={20} height={30} fill={C.violet} stroke={LINE} strokeWidth={5} />
  </svg>
);

const House: React.FC<{ size?: number }> = ({ size = 90 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100">
    <path d="M10 48 L50 12 L90 48" fill="none" stroke={LINE} strokeWidth={7} strokeLinejoin="round" strokeLinecap="round" />
    <rect x={20} y={44} width={60} height={46} fill={C.lavender} stroke={LINE} strokeWidth={6} />
    <rect x={42} y={62} width={16} height={28} fill={C.violet} stroke={LINE} strokeWidth={5} />
  </svg>
);

export const S6Cta: React.FC<{ dur: number }> = ({ dur }) => {
  const cart = cue("s6", "cart");
  const rem = cue("s6", "reminder");
  const aaj = cue("s6", "aaj");
  const follow = cue("s6", "follow");
  const poses: PoseKey[] = [
    { at: -100, pose: "point" },
    { at: aaj - 2, pose: "explain" },
    { at: follow - 4, pose: "thumbs" },
  ];
  return (
    <SceneShell dur={dur} noExit>
      <Camera dur={dur} punches={[cart + 4]} push={0.02}>
        <Clinic plus={false} />
        <CtaFlow
          keyword="CART"
          typeAt={cart - 8}
          giftAt={rem - 8}
          giftTitle="3 Cart Reminder Messages"
          giftSub="free · WhatsApp, copy-paste + sahi time"
          giftIcon={<ChatIcon />}
          nextAt={aaj}
          nextNum="#12"
          nextLabel="AAJ SHAAM 7 BAJE · CASE #12"
          next={
            <>
              <div style={{ display: "flex", alignItems: "center", gap: 22 }}>
                <Shop size={96} />
                <div style={big(56, C.violet)}>vs</div>
                <House size={96} />
              </div>
              <div style={{ fontFamily: theme.fonts.display, fontWeight: 700, fontSize: 50, lineHeight: 1.12, color: LINE, textAlign: "center" }}>
                Marketplace ya apni website?
                <br />
                <span style={{ color: C.green }}>Zyada kahan bachta hai?</span>
              </div>
            </>
          }
          followAt={follow}
        />
        <Place x={250} y={1010} s={0.96} z={4}>
          <Doctor poses={poses} mouth={sceneMouth("s6")} brows={[cart, aaj]} caseTag={TAG} />
        </Place>
      </Camera>
      {Array.from({ length: 4 }).map((_, i) => (
        <Sfx key={i} at={cart - 8 + i * 2} name="key" vol={0.4} />
      ))}
      <Sfx at={rem - 12} name="pop" vol={0.5} />
      <Sfx at={aaj - 4} name="whoosh" vol={0.45} />
      <Sfx at={follow + 12} name="pop" vol={0.55} />
      <Sfx at={follow + 15} name="ding" vol={0.45} />
    </SceneShell>
  );
};
