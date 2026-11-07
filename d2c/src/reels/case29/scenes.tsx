import React from "react";
import { useCurrentFrame } from "remotion";
import { BP, FigLabel, FixCard, HisaabCta, Hl, big, ease, glass, label, useCount } from "../../components/hisaab";
import { Face, PhoneShell, Pill, Stamp, useTalk } from "../../components/hisaabArt";
import { SceneShell, Sfx, inr } from "../../components/kit";
import { C } from "../../theme";
import { cue } from "./timeline";

type SP = { dur: number };

/** Studio light on a stand. */
const Light: React.FC<{ h?: number; flip?: boolean; on?: number }> = ({ h = 300, flip = false, on = 1 }) => (
  <svg width={h * 0.6} height={h} viewBox="0 0 120 200" style={{ transform: flip ? "scaleX(-1)" : undefined, overflow: "visible" }}>
    <path d="M18 20 L82 6 L96 62 L32 76 Z" fill="#2A1C55" stroke={BP.lineSoft} strokeWidth={3} />
    <path d="M96 62 L82 6 L170 -20 L190 120 Z" fill={`rgba(255,240,200,${0.22 * on})`} />
    <line x1={58} y1={70} x2={58} y2={186} stroke={BP.lineSoft} strokeWidth={6} />
    <path d="M58 186 L24 200 M58 186 L92 200 M58 186 L58 200" stroke={BP.lineSoft} strokeWidth={6} strokeLinecap="round" />
  </svg>
);

/** Big pro camera glyph. */
const Cam: React.FC<{ w?: number }> = ({ w = 170 }) => (
  <svg width={w} height={w * 0.7} viewBox="0 0 170 120">
    <rect x={6} y={26} width={118} height={84} rx={14} fill="#2A1C55" stroke={BP.lineSoft} strokeWidth={4} />
    <rect x={30} y={10} width={44} height={20} rx={6} fill="#2A1C55" stroke={BP.lineSoft} strokeWidth={4} />
    <circle cx={64} cy={68} r={28} fill="#0E0638" stroke={C.lavender} strokeWidth={5} />
    <circle cx={64} cy={68} r={12} fill={C.violet} />
    <path d="M124 52 L164 36 V100 L124 84 Z" fill="#2A1C55" stroke={BP.lineSoft} strokeWidth={4} />
  </svg>
);

/** Studio card: camera + two lights + a model. */
export const Studio: React.FC<{ w?: number; f: number; lights?: number; model?: number; cam?: number }> = ({ w = 460, f, lights = 1, model = 1, cam = 1 }) => (
  <div style={{ position: "relative", width: w, height: w * 1.1, ...glass, borderRadius: 30, overflow: "hidden" }}>
    <div style={{ position: "absolute", left: w * 0.02, top: w * 0.18, opacity: lights }}>
      <Light h={w * 0.62} on={lights} />
    </div>
    <div style={{ position: "absolute", right: w * 0.02, top: w * 0.18, opacity: lights }}>
      <Light h={w * 0.62} flip on={lights} />
    </div>
    <div style={{ position: "absolute", left: 0, right: 0, top: w * 0.18, display: "flex", justifyContent: "center", opacity: model, transform: `translateY(${(1 - model) * 30}px)` }}>
      <Face kind="customer" w={w * 0.44} talk={0} />
    </div>
    <div style={{ position: "absolute", left: 0, right: 0, bottom: w * 0.05, display: "flex", justifyContent: "center", opacity: cam, transform: `rotate(${Math.sin(f / 30) * 1.5}deg)` }}>
      <Cam w={w * 0.36} />
    </div>
  </div>
);

/** Phone selfie video of a happy customer. */
export const PhoneVid: React.FC<{ w?: number; talk?: number; secs?: string }> = ({ w = 300, talk = 0, secs = "0:15" }) => (
  <PhoneShell w={w} screen="#2A1C55">
    <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg,#3A2A7A,#1A1050)" }} />
    <div style={{ position: "absolute", left: 0, right: 0, top: w * 0.3, display: "flex", justifyContent: "center" }}>
      <Face kind="customer" w={w * 0.82} talk={talk} />
    </div>
    <div style={{ position: "absolute", left: w * 0.08, top: w * 0.12, background: BP.red, borderRadius: 8, padding: "4px 10px 1px", ...label(w * 0.06, C.white) }}>● {secs}</div>
  </PhoneShell>
);

/** Small parcel glyph. */
const Parcel: React.FC<{ s?: number; color?: string }> = ({ s = 56, color = "rgba(223,200,253,0.32)" }) => (
  <svg width={s} height={s} viewBox="0 0 40 40">
    <rect x={4} y={10} width={32} height={26} rx={4} fill={color} />
    <rect x={18} y={10} width={4} height={26} fill="rgba(13,2,56,0.35)" />
    <path d="M4 14 L12 4 H28 L36 14 Z" fill={color} opacity={0.8} />
  </svg>
);

/* s1 · hook (on screen from frame 0) */
export const S1Hook: React.FC<SP> = ({ dur }) => {
  const f = useCurrentFrame();
  const haar = cue("s1", "haar");
  const phone = cue("s1", "phone");
  return (
    <SceneShell dur={dur}>
      <div style={{ position: "absolute", left: 60, top: 330 }}>
        <Studio w={440} f={f} />
        <div style={{ ...big(84, BP.red), textAlign: "center", marginTop: 14 }}>₹50,000</div>
      </div>
      <div style={{ position: "absolute", left: 540, top: 410, ...big(70, BP.dim) }}>vs</div>
      <div style={{ position: "absolute", right: 70, top: 300, opacity: 0.55 + 0.45 * ease(f, phone - 8, phone + 2), transform: `scale(${0.94 + 0.06 * ease(f, phone - 8, phone + 4)})` }}>
        <PhoneVid w={300} talk={useTalk(phone, dur)} />
        <div style={{ ...big(84, BP.green), textAlign: "center", marginTop: 14 }}>₹0</div>
      </div>
      <Stamp text="HAAR GAYA" at={haar} size={70} rot={-10} style={{ left: 280, top: 620 }} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 1130, display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
        <div style={big(70)}>₹50,000 ka shoot haara,</div>
        <Pill size={84} bg={BP.green} color={C.navy}>₹0 ke phone video se?</Pill>
      </div>
      <Sfx at={haar} name="stamp" vol={0.45} />
      <Sfx at={phone - 6} name="pop" vol={0.4} />
    </SceneShell>
  );
};

/* s2 · Rohit's studio shoot: lights, model, ₹50,000 */
export const S2Studio: React.FC<SP> = ({ dur }) => {
  const f = useCurrentFrame();
  const lights = cue("s2", "lights");
  const model = cue("s2", "model");
  const cost = cue("s2", "pachaas hazaar");
  const n = useCount(50000, cost - 4, cost + 16);
  const tag = (t: string, at: number) => (
    <div style={{ ...glass, borderRadius: 16, padding: "10px 20px 6px", ...label(30, BP.text), opacity: ease(f, at - 6, at + 2), transform: `translateX(${(1 - ease(f, at - 6, at + 4)) * 40}px)` }}>{t}</div>
  );
  return (
    <SceneShell dur={dur}>
      <FigLabel n={1} text="ROHIT KA STUDIO AD" />
      <div style={{ position: "absolute", left: 84, top: 400 }}>
        <Studio w={520} f={f} lights={ease(f, lights - 6, lights + 4)} model={ease(f, model - 6, model + 4)} cam={ease(f, 0, 12)} />
      </div>
      <div style={{ position: "absolute", left: 650, top: 440, display: "flex", flexDirection: "column", gap: 22 }}>
        {tag("LIGHTS", lights)}
        {tag("MODEL", model)}
        {tag("CAMERA CREW", model + 8)}
      </div>
      <div style={{ position: "absolute", left: 84, top: 1050, opacity: ease(f, cost - 8, cost) }}>
        <div style={label(28, BP.dim)}>SHOOT KA KHARCHA</div>
        <div style={big(130, BP.red)}>₹{inr(n)}</div>
      </div>
      <Sfx at={lights - 4} name="pop" vol={0.4} />
      <Sfx at={model - 4} name="pop" vol={0.4} />
      <Sfx at={cost - 4} name="tick" vol={0.35} />
    </SceneShell>
  );
};

/* s3 · Priya's 15-second phone video; two weeks later */
export const S3Phone: React.FC<SP> = ({ dur }) => {
  const f = useCurrentFrame();
  const vid = cue("s3", "video");
  const pandrah = cue("s3", "pandrah");
  const hafte = cue("s3", "hafte");
  return (
    <SceneShell dur={dur}>
      <FigLabel n={2} text="PRIYA KA PHONE VIDEO" />
      <div style={{ position: "absolute", left: 84, top: 390, opacity: ease(f, 0, 12), transform: `translateY(${(1 - ease(f, 0, 14)) * 50}px)` }}>
        <PhoneVid w={380} talk={useTalk(6, vid + 20)} />
      </div>
      <div style={{ position: "absolute", left: 540, top: 470, display: "flex", flexDirection: "column", gap: 26 }}>
        <div style={{ opacity: ease(f, pandrah - 6, pandrah + 2) }}>
          <div style={label(28, BP.dim)}>LENGTH</div>
          <div style={big(96)}>15 sec</div>
        </div>
        <div style={{ opacity: ease(f, vid - 4, vid + 4) }}>
          <div style={label(28, BP.dim)}>KHARCHA</div>
          <div style={big(96, BP.green)}>₹0</div>
        </div>
        <div style={{ opacity: ease(f, hafte - 8, hafte + 2) }}>
          <div style={label(28, BP.dim)}>TEST</div>
          <div style={big(64, C.lavender)}>2 hafte →</div>
        </div>
      </div>
      <Sfx at={pandrah - 4} name="pop" vol={0.4} />
      <Sfx at={hafte - 6} name="whoosh" vol={0.35} />
    </SceneShell>
  );
};

/* s4 · same budget: studio 8 orders, phone 20 */
export const S4Result: React.FC<SP> = ({ dur }) => {
  const f = useCurrentFrame();
  const budget = cue("s4", "budget");
  const aath = cue("s4", "aath");
  const bees = cue("s4", "bees");
  const phone = cue("s4", "phone");
  const col = (name: string, n: number, at: number, color: string, w: number, numAt: number = at) => (
    <div style={{ width: w }}>
      <div style={label(28, BP.dim)}>{name}</div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 70px)", gap: 12, marginTop: 18, minHeight: 4 * 82, alignContent: "start" }}>
        {Array.from({ length: n }).map((_, i) => {
          const p = ease(f, at - 4 + i * 1.2, at + 4 + i * 1.2);
          return (
            <div key={i} style={{ opacity: p, transform: `scale(${0.6 + 0.4 * p})` }}>
              <Parcel s={70} color={color} />
            </div>
          );
        })}
      </div>
      <div style={{ ...big(104, color), opacity: ease(f, numAt - 4, numAt + 4), marginTop: 10 }}>{n} order</div>
    </div>
  );
  return (
    <SceneShell dur={dur}>
      <FigLabel n={3} text="MAAN LO · EK HI BUDGET" />
      <div style={{ position: "absolute", left: 84, top: 380, ...glass, borderRadius: 16, padding: "10px 22px 6px", ...label(30, BP.text), opacity: ease(f, budget - 6, budget + 2) }}>DONO ADS · SAME BUDGET</div>
      <div style={{ position: "absolute", left: 84, right: 84, top: 500, display: "flex", justifyContent: "space-between" }}>
        {col("STUDIO AD", 8, aath, "rgba(223,200,253,0.55)", 430)}
        {col("PHONE VIDEO", 20, phone, BP.green, 430, bees)}
      </div>
      <Sfx at={aath - 2} name="tick" vol={0.35} />
      <Sfx at={phone - 2} name="tick" vol={0.3} />
      <Sfx at={bees - 2} name="ding" vol={0.45} />
    </SceneShell>
  );
};

/* s5 · why + fixes */
export const S5Fixes: React.FC<SP> = ({ dur }) => {
  const f = useCurrentFrame();
  const dost = cue("s5", "dost");
  return (
    <SceneShell dur={dur}>
      <FigLabel n={4} text="AISE KARO" />
      <div style={{ position: "absolute", left: 84, right: 84, top: 380, ...glass, borderRadius: 24, padding: "22px 30px 16px", display: "flex", alignItems: "center", gap: 20, opacity: ease(f, dost - 8, dost + 2) }}>
        <div style={big(52)}>Phone video =</div>
        <Pill size={56} bg={BP.green} color={C.navy} rot={0}>dost ki salah</Pill>
      </div>
      <div style={{ position: "absolute", left: 84, top: 560, display: "flex", flexDirection: "column", gap: 28 }}>
        <FixCard n={1} at={cue("s5", "paanch") - 8} title={<><Hl>5 khush customers</Hl> se 15 sec video maango</>} sub="phone se, apni awaaz mein" />
        <FixCard n={2} at={cue("s5", "pehli") - 8} title={<>Pehli line mein <Hl c={BP.red}>problem</Hl></>} sub="'baal bahut girte the...'" />
        <FixCard n={3} at={cue("s5", "dono") - 8} title={<>Dono ads <Hl c={BP.green}>ek hi budget</Hl> pe test</>} sub="jo zyada order laaye, wahi chalao" />
      </div>
      <Sfx at={dost - 6} name="pop" vol={0.4} />
      <Sfx at={cue("s5", "paanch") - 8} name="pop" vol={0.5} />
      <Sfx at={cue("s5", "pehli") - 8} name="pop" vol={0.5} />
      <Sfx at={cue("s5", "dono") - 8} name="pop" vol={0.5} />
    </SceneShell>
  );
};

const BriefIcon: React.FC = () => (
  <svg width={86} height={100} viewBox="0 0 86 100">
    <rect x={3} y={3} width={80} height={94} rx={12} fill={C.violet} stroke={C.navy} strokeWidth={5} />
    <rect x={18} y={16} width={30} height={46} rx={6} fill={C.navy} />
    <circle cx={33} cy={36} r={8} fill="#C98A60" />
    <circle cx={60} cy={26} r={6} fill={BP.red} />
    {[0, 1, 2].map((r) => (
      <rect key={r} x={16} y={70 + r * 8} width={54 - r * 12} height={5} rx={2} fill={C.white} />
    ))}
  </svg>
);

/* s6 · CTA */
export const S6Cta: React.FC<SP> = ({ dur }) => (
  <SceneShell dur={dur} noExit>
    <HisaabCta
      keyword="UGC"
      typeAt={cue("s6", "u g c") - 8}
      giftAt={cue("s6", "brief") - 8}
      giftTitle="Customer Video Brief"
      giftSub="free · kya bolein, kaise shoot karein"
      giftIcon={<BriefIcon />}
      nextAt={cue("s6", "kal")}
      nextLabel="KAL DOPAHAR 1 BAJE · AGLA CASE"
      next={
        <>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{ ...big(58, C.white), background: C.violet, borderRadius: 16, padding: "8px 20px 0" }}>Premium quality</div>
          </div>
          <div style={big(54, C.navy)}>kyun nahi bikta?</div>
        </>
      }
      followAt={cue("s6", "follow")}
    />
  </SceneShell>
);
