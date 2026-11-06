import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { Enter, SceneShell, Sfx, clamp, inr, useSpring } from "../../components/kit";
import { AB, Coin, DimLabel, DimLine, DmBox, FigLabel, FixCard, FollowBtn, Hl, TW, Tint, TowerFrame, big, coinXY, ease, glass, lab, useCount, yAt } from "../../components/astroHisaab";
import { cue } from "./timeline";

type SP = { dur: number };

/* ₹30,000 tower, 1 coin = ₹100: rent 0–99, EMI 100–159, ghar 160–249, bacha 250–299 */
const tintOf = (i: number): Tint => (i < 100 ? "orange" : i < 160 ? "deep" : i < 250 ? "cream" : "green");

const Stamp: React.FC<{ at: number; x: number; y: number; children: React.ReactNode; size?: number; rot?: number }> = ({ at, x, y, children, size = 110, rot = -8 }) => {
  const f = useCurrentFrame();
  const s = useSpring(at, "slam");
  if (f < at) return null;
  return (
    <div style={{ position: "absolute", left: x, top: y, transform: `translate(-50%, -50%) rotate(${rot}deg) scale(${interpolate(s, [0, 1], [2.3, 1])})`, opacity: interpolate(s, [0, 0.3], [0, 1], clamp), border: `10px solid ${AB.red}`, borderRadius: 26, padding: "10px 40px 0", background: "rgba(11,5,2,0.85)", ...big(size, AB.red), boxShadow: "0 0 80px rgba(255,90,95,0.35)" }}>
      {children}
    </div>
  );
};

/* ================= S1 · hook ================= */

export const S1Hook: React.FC<SP> = ({ dur }) => {
  const f = useCurrentFrame();
  const kh = cue("s1", "khatam");
  const ek = cue("s1", "ek");
  const hum = cue("s1", "humne");
  const drain = ease(f, kh - 4, kh + 12);
  const val = 30000 * (1 - drain);
  const red = drain > 0.5;
  const shake = f >= kh && f < kh + 10 ? Math.sin(f * 2.6) * (10 - (f - kh)) * 1.4 : 0;
  const scan = ease(f, hum - 2, hum + 22, "inOut");
  const dim = ease(f, hum, hum + 16);
  const upay = useSpring(ek - 4, "bouncy");
  return (
    <SceneShell dur={dur}>
      <Sfx at={kh - 3} name="stamp" vol={0.8} />
      <Sfx at={kh + 2} name="error" vol={0.5} />
      <Sfx at={ek - 4} name="pop" vol={0.5} />
      <Sfx at={hum - 2} name="swish" vol={0.5} />

      {/* bank card */}
      <div style={{ position: "absolute", left: 84, top: 320, width: 912, height: 400, ...glass, transform: `translateX(${shake}px)`, overflow: "hidden" }}>
        <div style={{ position: "absolute", left: 40, top: 34, display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{ width: 16, height: 16, borderRadius: "50%", background: red ? AB.red : AB.green }} />
          <div style={lab(30, AB.dim)}>{red ? "बैलेंस · महीने का आख़िर" : "सैलरी आई · 1 तारीख"}</div>
        </div>
        <div style={{ position: "absolute", left: 34, top: 120, ...big(200, red ? AB.red : AB.green), textShadow: `0 0 60px ${red ? "rgba(255,90,95,0.35)" : "rgba(43,212,107,0.35)"}` }}>₹{inr(val)}</div>
      </div>
      <Stamp at={kh - 3} x={760} y={600} size={96}>
        ख़त्म
      </Stamp>

      {/* hook line, on screen from frame 0 */}
      <div style={{ position: "absolute", left: 0, right: 0, top: 790, display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
        <div style={big(92)}>सैलरी आते ही</div>
        <div style={{ display: "flex", alignItems: "center", gap: 22 }}>
          <div style={big(92)}>पैसा</div>
          <div style={{ ...big(100, "#fff"), background: AB.red, borderRadius: 22, padding: "4px 28px 0", transform: `rotate(-2deg) scale(${1 + 0.08 * Math.sin(Math.PI * ease(f, kh, kh + 10))})` }}>ख़त्म?</div>
        </div>
      </div>

      {/* diwali upay pill */}
      <div style={{ position: "absolute", left: 0, right: 0, top: 1080, display: "flex", justifyContent: "center", opacity: interpolate(upay, [0, 0.4], [0, 1], clamp), transform: `scale(${interpolate(upay, [0, 1], [0.6, 1])})` }}>
        <div style={{ ...big(50, AB.black), background: AB.orange, borderRadius: 999, padding: "12px 36px 4px" }}>दिवाली का 1 उपाय</div>
      </div>

      {/* falling red coins */}
      {f >= kh &&
        Array.from({ length: 9 }).map((_, i) => {
          const t = f - kh - i * 3;
          if (t < 0) return null;
          return <Coin key={i} x={200 + i * 80 + Math.sin(i * 2.1) * 20} y={720 + t * t * 0.5} tint="red" o={interpolate(t, [0, 4, 26, 34], [0, 1, 1, 0], clamp)} s={1.4} />;
        })}

      {f >= hum - 2 && f < hum + 24 && <div style={{ position: "absolute", left: 0, right: 0, top: 300 + scan * 1100, height: 4, background: AB.cream, boxShadow: "0 0 40px 10px rgba(255,200,140,0.45)", opacity: 1 - scan * 0.6 }} />}
      <div style={{ position: "absolute", left: 84, top: 1250, width: 912, opacity: dim }}>
        <div style={{ position: "relative", height: 30 }}>
          <div style={{ position: "absolute", left: 0, top: 14, width: 912 * dim, height: 3, background: AB.line }} />
          <div style={{ position: "absolute", left: 0, top: 2, width: 3, height: 27, background: AB.line }} />
          <div style={{ position: "absolute", left: 909, top: 2, width: 3, height: 27, background: AB.line, opacity: dim }} />
        </div>
        <div style={{ ...lab(40, AB.text), textAlign: "center", marginTop: 14, transform: `translateY(${(1 - dim) * 20}px)` }}>हर ₹ का हिसाब ↓</div>
      </div>
    </SceneShell>
  );
};

/* ================= S2 · salary fills the tower ================= */

export const S2Salary: React.FC<SP> = ({ dur }) => {
  const f = useCurrentFrame();
  const sal = cue("s2", "salary");
  const tees = cue("s2", "tees hazaar");
  const fillA = sal - 6;
  const v = useCount(30000, fillA, tees + 4);
  const inP = ease(f, fillA, fillA + 10);
  return (
    <SceneShell dur={dur}>
      <FigLabel n={1} text="मान लो सैलरी" />
      <TowerFrame o={ease(f, 0, 10)} />
      {Array.from({ length: 300 }).map((_, i) => {
        const at = fillA + i * 0.06;
        const p = ease(f, at, at + 5);
        if (p <= 0) return null;
        const { x, y } = coinXY(i);
        return <Coin key={i} x={x} y={y - (1 - p) * 26} tint="green" o={p} s={0.6 + 0.4 * p} />;
      })}
      <div style={{ position: "absolute", left: 500, top: 760, opacity: inP, transform: `translateX(${(1 - inP) * 60}px)` }}>
        <div style={lab(34, AB.dim)}>सैलरी</div>
        <div style={big(120, AB.green)}>₹{inr(v)}</div>
      </div>
      {[0, 5, 10, 15].map((d) => (
        <Sfx key={d} at={fillA + d} name="tick" vol={0.35} />
      ))}
      <Sfx at={tees} name="ding" vol={0.45} />
    </SceneShell>
  );
};

/* ================= S3 · rent, EMI, ghar ================= */

const RENT_Y = (yAt(0) + yAt(10)) / 2;
const EMI_Y = (yAt(10) + yAt(16)) / 2;
const GHAR_Y = (yAt(16) + yAt(25)) / 2;
const BACHA_Y = (yAt(25) + yAt(30)) / 2;

export const S3Break: React.FC<SP> = ({ dur }) => {
  const f = useCurrentFrame();
  const a = cue("s3", "kiraya") - 4;
  const b = cue("s3", "ee em aai") - 4;
  const c = cue("s3", "ghar") - 4;
  const n1 = cue("s3", "das hazaar");
  const n2 = cue("s3", "chhah hazaar");
  const n3 = cue("s3", "nau hazaar");
  const v1 = useCount(10000, a + 4, n1 + 6);
  const v2 = useCount(6000, b + 4, n2 + 6);
  const v3 = useCount(9000, c + 4, n3 + 6);
  const startOf = (i: number) => (i < 100 ? a : i < 160 ? b : c);
  const seg = (s: number) => ease(f, s, s + 14);
  return (
    <SceneShell dur={dur}>
      <FigLabel n={2} text="₹30,000 कहाँ गया?" />
      <TowerFrame />
      {Array.from({ length: 300 }).map((_, i) => {
        const k = tintOf(i);
        if (k === "green") return <Coin key={i} {...coinXY(i)} tint="green" />;
        const base = i < 100 ? 0 : i < 160 ? 100 : 160;
        const at = startOf(i) + (i - base) * 0.12;
        const on = f >= at;
        return <Coin key={i} {...coinXY(i)} tint={on ? k : "green"} s={on ? 1 + 0.3 * Math.sin(Math.PI * ease(f, at, at + 7)) : 1} />;
      })}
      <DimLine x={440} y1={yAt(0) - 3} y2={yAt(10) + 3} p={seg(a)} />
      <DimLabel y={RENT_Y} name="किराया" value={`₹${inr(v1)}`} p={seg(a)} />
      <DimLine x={440} y1={yAt(10) - 3} y2={yAt(16) + 3} p={seg(b)} />
      <DimLabel y={EMI_Y} name="EMI" value={`₹${inr(v2)}`} p={seg(b)} />
      <DimLine x={440} y1={yAt(16) - 3} y2={yAt(25) + 3} p={seg(c)} />
      <DimLabel y={GHAR_Y} name="घर का खर्च" value={`₹${inr(v3)}`} p={seg(c)} />
      {[a, b, c].map((s, i) => (
        <Sfx key={i} at={s} name="pop" vol={0.45} />
      ))}
      {[n1, n2, n3].map((s, i) => (
        <Sfx key={i} at={s} name="key" vol={0.4} />
      ))}
    </SceneShell>
  );
};

/* ================= S4 · the 5,000 flies away → ₹0 ================= */

export const S4Gone: React.FC<SP> = ({ dur }) => {
  const f = useCurrentFrame();
  const bache = cue("s4", "bache");
  const ud = cue("s4", "ud");
  const zero = cue("s4", "zero");
  const bIn = ease(f, bache - 4, bache + 10);
  const turn = ease(f, ud - 8, ud);
  const gone = ease(f, ud + 18, ud + 26);
  return (
    <SceneShell dur={dur}>
      <FigLabel n={3} text="महीने का आख़िर" />
      <TowerFrame />
      {Array.from({ length: 250 }).map((_, i) => (
        <Coin key={i} {...coinXY(i)} tint={tintOf(i)} />
      ))}
      {Array.from({ length: 50 }).map((_, k) => {
        const i = 250 + k;
        const { x, y } = coinXY(i);
        const at = ud - 2 + k * 0.4;
        const t = Math.max(0, f - at);
        const fx = t * (6 + (k % 7)) + t * t * 0.15;
        const fy = -t * (10 + (k % 5) * 2) + t * t * 0.1;
        const o = interpolate(t, [0, 14, 22], [1, 1, 0], clamp);
        return <Coin key={i} x={x + fx} y={y + fy} tint={turn > 0.5 ? "red" : "green"} o={o} r={t * 18} s={1 + 0.2 * Math.min(1, t / 6)} />;
      })}
      <DimLine x={440} y1={yAt(0) - 3} y2={yAt(10) + 3} p={1} />
      <DimLabel y={RENT_Y} name="किराया" value="₹10,000" p={1} size={54} />
      <DimLine x={440} y1={yAt(10) - 3} y2={yAt(16) + 3} p={1} />
      <DimLabel y={EMI_Y} name="EMI" value="₹6,000" p={1} size={54} />
      <DimLine x={440} y1={yAt(16) - 3} y2={yAt(25) + 3} p={1} />
      <DimLabel y={GHAR_Y} name="घर का खर्च" value="₹9,000" p={1} size={54} />
      <DimLine x={440} y1={yAt(25) - 3} y2={yAt(30) + 3} p={bIn * (1 - gone)} color={turn > 0.5 ? AB.red : AB.green} />
      <DimLabel y={BACHA_Y} name={turn > 0.5 ? "छोटे-मोटे खर्च" : "बचे"} value={turn > 0.5 ? "−₹5,000" : "₹5,000"} p={bIn * (1 - gone)} color={turn > 0.5 ? AB.red : AB.green} />
      <div style={{ position: "absolute", left: 498, top: 380, opacity: ease(f, zero - 6, zero + 4) }}>
        <div style={lab(30, AB.red)}>बचत</div>
      </div>
      <Stamp at={zero - 3} x={700} y={500} size={140} rot={-6}>
        ₹0
      </Stamp>
      <Sfx at={bache - 4} name="pop" vol={0.45} />
      <Sfx at={ud - 2} name="whoosh" vol={0.55} />
      <Sfx at={zero - 3} name="stamp" vol={0.75} />
      <Sfx at={zero - 2} name="bass" vol={0.55} />
    </SceneShell>
  );
};

/* ================= S5 · twist: 12 months of small kharch ================= */

export const S5Year: React.FC<SP> = ({ dur }) => {
  const f = useCurrentFrame();
  const ye = cue("s5", "ye");
  const sath = cue("s5", "saath hazaar");
  const kabhi = cue("s5", "kabhi");
  const v = useCount(60000, ye, sath + 4);
  const hit = 1 + 0.1 * Math.sin(Math.PI * ease(f, sath, sath + 10));
  return (
    <SceneShell dur={dur}>
      <FigLabel n={4} text="साल भर का हिसाब" />
      <div style={{ position: "absolute", left: 0, right: 0, top: 380, display: "flex", flexDirection: "column", alignItems: "center", gap: 0 }}>
        <div style={lab(34, AB.dim)}>छोटे-मोटे खर्च · 12 महीने</div>
        <div style={{ ...big(170, AB.red), transform: `scale(${hit})`, textShadow: "0 0 60px rgba(255,90,95,0.4)" }}>−₹{inr(v)}</div>
      </div>
      {Array.from({ length: 12 }).map((_, m) => {
        const at = ye + m * ((sath - ye) / 12);
        const p = ease(f, at, at + 8);
        const x = 96 + m * 76;
        return (
          <div key={m} style={{ position: "absolute", left: x, top: 720, width: 60, height: 340, display: "flex", flexDirection: "column", justifyContent: "flex-end", alignItems: "center", gap: 10 }}>
            <div style={{ width: 52, height: 260 * p, borderRadius: 12, background: "linear-gradient(180deg, #FF8A8D, #E5484D)", border: "2px solid #A3161B", boxShadow: p > 0.9 ? "0 0 20px rgba(255,90,95,0.35)" : undefined }} />
            <div style={{ ...lab(24, AB.dim), opacity: p }}>{m + 1}</div>
          </div>
        );
      })}
      <div style={{ position: "absolute", left: 96, top: 1078, ...lab(26, AB.dim) }}>हर महीने ₹5,000 →</div>
      <Stamp at={kabhi - 2} x={540} y={1250} size={78} rot={-4}>
        बचत? कभी नहीं
      </Stamp>
      {[0, 6, 12, 18, 24].map((d) => (
        <Sfx key={d} at={ye + d} name="tick" vol={0.35} />
      ))}
      <Sfx at={sath} name="error" vol={0.5} />
      <Sfx at={kabhi - 2} name="stamp" vol={0.7} />
    </SceneShell>
  );
};

/* ================= S6 · rule: pehle bachat ================= */

const ENV = { x: 560, y: 780, w: 420, h: 260 };

export const S6Rule: React.FC<SP> = ({ dur }) => {
  const f = useCurrentFrame();
  const niyam = cue("s6", "niyam");
  const das = cue("s6", "das pratishat");
  const teen = cue("s6", "teen hazaar");
  const ch = cue("s6", "chhattees hazaar");
  const card = useSpring(niyam - 4, "bouncy");
  const envIn = ease(f, das - 10, das + 4);
  const year = useCount(36000, teen + 8, ch + 4);
  const yearIn = ease(f, teen + 6, teen + 16);
  const glow = ease(f, ch, ch + 10);
  return (
    <SceneShell dur={dur}>
      <FigLabel n={5} text="नियम" />
      <div style={{ position: "absolute", left: 84, top: 340, width: 912, padding: "20px 0 12px", ...glass, display: "flex", justifyContent: "center", alignItems: "center", gap: 18, opacity: interpolate(card, [0, 0.4], [0, 1], clamp), transform: `scale(${interpolate(card, [0, 1], [0.8, 1])})` }}>
        <div style={big(64)}>पहले</div>
        <Hl c={AB.green} fg="#06240F">
          <span style={big(68, "#06240F")}>बचत</span>
        </Hl>
        <div style={big(64)}>, फिर खर्च</div>
      </div>

      <TowerFrame />
      {Array.from({ length: 300 }).map((_, i) => {
        if (i < 270) return <Coin key={i} {...coinXY(i)} tint={tintOf(i) === "green" ? "green" : "cream"} o={0.55} />;
        const k = i - 270;
        const at = das - 4 + k * 0.5;
        const t = ease(f, at, at + 14, "inOut");
        const { x, y } = coinXY(i);
        const tx = ENV.x + 60 + (k % 10) * 30;
        const ty = ENV.y + 90 + Math.floor(k / 10) * 30;
        return <Coin key={i} x={interpolate(t, [0, 1], [x, tx])} y={interpolate(t, [0, 1], [y, ty]) - Math.sin(Math.PI * t) * 140} tint="green" glow={glow} />;
      })}

      {/* envelope */}
      <div style={{ position: "absolute", left: ENV.x, top: ENV.y, width: ENV.w, height: ENV.h, opacity: envIn, transform: `translateY(${(1 - envIn) * 40}px)` }}>
        <div style={{ position: "absolute", inset: 0, background: AB.cream, borderRadius: 18, border: `4px solid ${AB.orange}`, boxShadow: `0 0 ${60 * glow}px rgba(43,212,107,${0.5 * glow})` }} />
        <svg width={ENV.w} height={ENV.h} style={{ position: "absolute", left: 0, top: 0 }}>
          <path d={`M4,4 L${ENV.w / 2},${ENV.h * 0.42} L${ENV.w - 4},4`} fill="none" stroke={AB.orange} strokeWidth={4} />
        </svg>
        <div style={{ position: "absolute", left: 0, right: 0, bottom: 14, textAlign: "center", ...big(52, AB.orangeDeep) }}>बचत</div>
      </div>
      <div style={{ position: "absolute", left: ENV.x, top: ENV.y - 110, opacity: envIn }}>
        <div style={lab(30, AB.dim)}>सैलरी आते ही 10%</div>
        <div style={big(64, AB.green)}>₹3,000 अलग</div>
      </div>
      <div style={{ position: "absolute", left: ENV.x, top: ENV.y + ENV.h + 30, opacity: yearIn }}>
        <div style={lab(30, AB.dim)}>साल भर में</div>
        <div style={{ ...big(112, AB.green), textShadow: `0 0 ${50 * glow}px rgba(43,212,107,0.5)` }}>₹{inr(year)}</div>
      </div>
      <Sfx at={niyam - 4} name="pop" vol={0.5} />
      <Sfx at={das - 4} name="whoosh" vol={0.45} />
      <Sfx at={das + 14} name="check" vol={0.5} />
      <Sfx at={ch} name="ding" vol={0.55} />
    </SceneShell>
  );
};

/* ================= S7 · three upay/fixes ================= */

export const S7Fixes: React.FC<SP> = ({ dur }) => {
  const a = cue("s7", "lifaafa", 1, -14);
  const b = cue("s7", "har", 1, -8);
  const c = cue("s7", "diwali", 1, -8);
  return (
    <SceneShell dur={dur}>
      <FigLabel n={6} text="दिवाली उपाय" />
      <div style={{ position: "absolute", left: 84, top: 390, display: "flex", flexDirection: "column", gap: 30 }}>
        <FixCard n={1} at={a} title={<>लक्ष्मी पूजा में <Hl>बचत का लिफ़ाफ़ा</Hl></>} sub="उस पर लिखिए: बचत" />
        <FixCard n={2} at={b} title={<>हर सैलरी पर <Hl c={AB.green} fg="#06240F">पहले ₹3,000</Hl></>} sub="उसी लिफ़ाफ़े में, सैलरी वाले दिन" />
        <FixCard n={3} at={c} title={<>दिवाली सेल में <Hl c={AB.red} fg="#fff">EMI पर नया सामान नहीं</Hl></>} sub="नई किश्त = अगले महीने फिर ज़ीरो" />
      </div>
      <Sfx at={a} name="pop" vol={0.5} />
      <Sfx at={b} name="pop" vol={0.5} />
      <Sfx at={c} name="pop" vol={0.5} />
    </SceneShell>
  );
};

/* ================= S8 · CTA ================= */

const KundliIcon: React.FC = () => (
  <svg width={110} height={110} viewBox="0 0 110 110">
    <rect x={4} y={4} width={102} height={102} rx={10} fill={AB.cream} stroke={AB.orange} strokeWidth={5} />
    <path d="M4,4 L106,106 M106,4 L4,106 M55,4 L106,55 L55,106 L4,55 Z" fill="none" stroke={AB.orangeDeep} strokeWidth={4} />
  </svg>
);

export const S8Cta: React.FC<SP> = ({ dur }) => {
  const f = useCurrentFrame();
  const free = cue("s8", "free");
  const dm = cue("s8", "dee em");
  const aaj = cue("s8", "aaj");
  const kaun = cue("s8", "kaun");
  const follow = cue("s8", "follow");
  const out = ease(f, aaj - 6, aaj + 2, "in");
  const kp = useSpring(kaun - 2, "bouncy");
  return (
    <SceneShell dur={dur} noExit>
      {f < aaj + 4 && (
        <div style={{ position: "absolute", inset: 0, opacity: 1 - out, transform: `translateY(${-60 * out}px)` }}>
          <Enter delay={Math.max(0, free - 6)} from="right" dist={120} style={{ position: "absolute", left: 84, top: 330 }}>
            <div style={{ width: 912, boxSizing: "border-box", padding: "30px 34px", ...glass, display: "flex", alignItems: "center", gap: 30 }}>
              <KundliIcon />
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                <div style={big(60)}>फ़्री कुंडली रिपोर्ट</div>
                <div style={lab(30, AB.dim)}>Astro 24x7 · DM में</div>
              </div>
            </div>
          </Enter>
          <Enter delay={dm - 10} from="left" dist={60} style={{ position: "absolute", left: 84, top: 640 }}>
            <div style={big(54)}>DM में लिखिए</div>
          </Enter>
          <Enter delay={dm - 6} style={{ position: "absolute", left: 84, top: 740 }}>
            <DmBox word="कुंडली" typeStart={dm} />
          </Enter>
        </div>
      )}
      {f >= aaj - 2 && (
        <div style={{ position: "absolute", left: 84, right: 84, top: 330, display: "flex", flexDirection: "column", alignItems: "center", gap: 20 }}>
          <Enter delay={aaj} cfg="snappy">
            <div style={{ ...lab(34, AB.black), fontWeight: 700, background: AB.orange, borderRadius: 999, padding: "12px 30px 8px" }}>आज 3:47 PM · अगली रील</div>
          </Enter>
          <Enter delay={aaj + 4}>
            <div style={{ background: AB.text, borderRadius: 30, border: `5px solid ${AB.orange}`, boxShadow: `10px 10px 0 ${AB.orangeDeep}`, padding: "30px 48px 22px", display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
              <div style={big(64, AB.black)}>पीपल के नीचे</div>
              <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                <div style={{ ...big(70, "#fff"), background: AB.orange, borderRadius: 16, padding: "4px 22px 0", transform: `scale(${interpolate(kp, [0, 1], [0.7, 1])})` }}>कौन सा</div>
                <div style={big(64, AB.black)}>दीया?</div>
              </div>
            </div>
          </Enter>
        </div>
      )}
      {f >= follow - 10 && (
        <div style={{ position: "absolute", left: 0, right: 0, top: 900 }}>
          <FollowBtn at={follow} />
        </div>
      )}
      <Sfx at={free - 6} name="pop" vol={0.5} />
      <Sfx at={dm} name="key" vol={0.4} />
      <Sfx at={aaj - 2} name="whoosh" vol={0.5} />
      <Sfx at={follow + 12} name="ding" vol={0.5} />
    </SceneShell>
  );
};

export { TW };
