import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { Enter, SceneShell, Sfx, clamp, deva, ease, glass, label, num, sanskrit, useSpring } from "../../components/kit";
import { FigLabel, HANDLE } from "../../components/sheet";
import { ST, StepState, Stairs, orbAt, stepX, stepY, useOrb } from "../../components/stairs";
import { G, theme } from "../../theme";
import { cue } from "./timeline";

type SP = { dur: number };

/* step names: Hindi + the Sanskrit word from 2.62–63 */
const STEPS: { hi: string; sa: string; size: number }[] = [
  { hi: "बार-बार सोचना", sa: "ध्यायतो विषयान्", size: 84 },
  { hi: "लगाव", sa: "सङ्ग", size: 116 },
  { hi: "चाहत", sa: "काम", size: 116 },
  { hi: "गुस्सा", sa: "क्रोध", size: 116 },
  { hi: "भ्रम", sa: "सम्मोह", size: 116 },
  { hi: "याददाश्त गड़बड़", sa: "स्मृतिविभ्रम", size: 80 },
  { hi: "बुद्धि का नाश", sa: "बुद्धिनाश", size: 88 },
  { hi: "पतन", sa: "प्रणश्यति", size: 116 },
];

const stepColor = (k: number) => (k <= 3 ? G.saffron : G.red);

/** Big "k/8 · name · sanskrit" readout at the top of the steps scenes. */
const Readout: React.FC<{ entries: { at: number; k: number }[]; top?: number }> = ({ entries, top = 380 }) => {
  const f = useCurrentFrame();
  return (
    <>
      {entries.map((e, idx) => {
        const next = entries[idx + 1];
        const inP = ease(f, e.at - 6, e.at + 8);
        const outP = next ? ease(f, next.at - 6, next.at) : 0;
        if (inP <= 0 || outP >= 1) return null;
        const s = STEPS[e.k - 1];
        const c = stepColor(e.k);
        return (
          <div key={idx} style={{ position: "absolute", left: 84, right: 84, top, height: 330, opacity: inP * (1 - outP), transform: `translateY(${(1 - inP) * 40 - outP * 40}px)` }}>
            <div style={{ position: "absolute", left: 0, top: 0, display: "flex", alignItems: "baseline" }}>
              <div style={{ ...num(230, c), textShadow: e.k === 4 ? "0 0 60px rgba(255,90,95,0.45)" : undefined }}>{e.k}</div>
              <div style={num(72, G.dim)}>/8</div>
            </div>
            <div style={{ position: "absolute", left: 300, top: 24, display: "flex", flexDirection: "column", gap: 4 }}>
              <div style={deva(s.size, e.k === 4 ? G.red : G.cream)}>{s.hi}</div>
              <div style={{ ...sanskrit(54, G.gold), lineHeight: 1.2 }}>{s.sa}</div>
            </div>
          </div>
        );
      })}
    </>
  );
};

/* ================= S1 · hook ================= */

export const S1Hook: React.FC<SP> = ({ dur }) => {
  const f = useCurrentFrame();
  const barbaad = cue("s1", "barbaad");
  const chautha = cue("s1", "chautha");
  const pehla = cue("s1", "pehla");
  const shake = f >= barbaad && f < barbaad + 12 ? Math.sin(f * 2.4) * (12 - (f - barbaad)) * 1.2 : 0;
  const fourPulse = Math.sin(Math.PI * ease(f, chautha - 2, chautha + 12));
  const oneOn = ease(f, pehla - 4, pehla + 8);
  const onePulse = f >= pehla ? 0.5 + 0.5 * Math.sin((f - pehla) / 4) : 0;
  const state = (i: number): StepState => (i === 3 ? "anger" : i === 0 && oneOn > 0.5 ? "warn" : "idle");
  return (
    <SceneShell dur={dur}>
      <Sfx at={barbaad - 2} name="bass" vol={0.6} />
      <Sfx at={chautha - 2} name="stamp" vol={0.65} />
      <Sfx at={pehla - 2} name="ding" vol={0.45} />

      {/* hook text: on screen from frame 0 */}
      <div style={{ position: "absolute", left: 0, right: 0, top: 330, display: "flex", flexDirection: "column", alignItems: "center", gap: 26 }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 26 }}>
          <div style={deva(118)}>बर्बादी के</div>
          <div style={{ ...num(150, G.gold), textShadow: "0 0 50px rgba(242,184,75,0.45)" }}>8</div>
          <div style={deva(118)}>कदम</div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 22 }}>
          <div
            style={{
              ...deva(104, G.white),
              background: G.red,
              borderRadius: 24,
              padding: "4px 30px 0",
              transform: `rotate(-2deg) scale(${1 + 0.08 * fourPulse})`,
              boxShadow: "0 0 70px rgba(255,90,95,0.4)",
            }}
          >
            गुस्सा
          </div>
          <div style={deva(96)}>सिर्फ़ चौथा है</div>
        </div>
      </div>

      <Stairs state={state} pop={(i) => (i === 3 ? fourPulse : i === 0 ? onePulse * oneOn * 0.6 : 0)} shake={shake} />

      {/* "4" leader from the steps */}
      <div style={{ position: "absolute", left: stepX(3) + ST.w / 2 - 1.5, top: stepY(3) - 92, width: 3, height: 70, background: G.red, opacity: 0.8 }} />
      <div style={{ position: "absolute", left: stepX(3) + ST.w / 2 - 70, top: stepY(3) - 150, width: 140, textAlign: "center", ...deva(44, G.red, 700) }}>क्रोध</div>

      {/* step 1 question */}
      <div style={{ position: "absolute", left: 84, top: stepY(0) - 128, opacity: oneOn, transform: `translateY(${(1 - oneOn) * 20}px)` }}>
        <div style={{ ...deva(52, G.ink, 800), background: G.gold, borderRadius: 16, padding: "2px 22px 0" }}>पहला कदम?</div>
        <div style={{ width: 3, height: 40, marginLeft: 90, background: G.gold }} />
      </div>
    </SceneShell>
  );
};

/* ================= S2 · source ================= */

const CHAIN = (p: (n: number) => number): React.ReactNode[] => {
  const H: React.FC<{ n: number; children: string }> = ({ n, children }) => {
    const v = p(n);
    return (
      <span style={{ background: `rgba(255,154,60,${0.42 * v})`, borderRadius: 8, boxShadow: v > 0 ? `0 0 0 ${3 * v}px rgba(255,154,60,${0.42 * v})` : undefined }}>{children}</span>
    );
  };
  return [
    <>
      <H n={1}>ध्यायतो</H> विषयान्पुंसः <H n={2}>सङ्ग</H>स्तेषूपजायते।
    </>,
    <>
      सङ्गात्सञ्जायते <H n={3}>कामः</H> कामात्<H n={4}>क्रोधो</H>ऽभिजायते॥
    </>,
    <>
      क्रोधाद्भवति <H n={5}>सम्मोहः</H> सम्मोहात्<H n={6}>स्मृतिविभ्रमः</H>।
    </>,
    <>
      स्मृतिभ्रंशाद्<H n={7}>बुद्धिनाशो</H> बुद्धिनाशात्<H n={8}>प्रणश्यति</H>॥
    </>,
  ];
};

export const S2Source: React.FC<SP> = ({ dur }) => {
  const f = useCurrentFrame();
  const series = cue("s2", "series");
  const ep = cue("s2", "episode");
  const adh = cue("s2", "adhyay");
  const b62 = cue("s2", "baasath");
  const b63 = cue("s2", "tirsath");
  const epIn = useSpring(ep - 4, "bouncy");
  const epOut = ease(f, adh - 8, adh);
  const card = useSpring(adh - 4, "smooth");
  const l12 = ease(f, b62 - 6, b62 + 6);
  const l34 = ease(f, b63 - 6, b63 + 6);
  const hiStart = b62 + 8;
  const hiAt = (n: number) => (n <= 4 ? b62 + 8 + (n - 1) * 3 : b63 + 4 + (n - 5) * 3);
  const lines = CHAIN((n) => ease(f, hiAt(n), hiAt(n) + 6));
  return (
    <SceneShell dur={dur}>
      <Sfx at={series - 2} name="swish" vol={0.45} />
      <Sfx at={ep - 2} name="pop" vol={0.5} />
      <Sfx at={adh - 4} name="whoosh" vol={0.45} />
      <Sfx at={hiStart} name="tick" vol={0.35} />
      <Sfx at={b63 + 4} name="tick" vol={0.35} />

      {/* series pill */}
      <Enter delay={series - 6} cfg="snappy" style={{ position: "absolute", left: 0, right: 0, top: 300, display: "flex", justifyContent: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16, background: G.gold, borderRadius: 999, padding: "6px 34px 2px" }}>
          <div style={deva(52, G.ink, 800)}>गीता श्लोक सीरीज़</div>
        </div>
      </Enter>

      {/* episode number, then the palm-leaf shloka card */}
      {epOut < 1 && (
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 470,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            opacity: interpolate(epIn, [0, 0.4], [0, 1], clamp) * (1 - epOut),
            transform: `scale(${interpolate(epIn, [0, 1], [0.7, 1]) - 0.1 * epOut})`,
          }}
        >
          <div style={deva(70, G.dim, 700)}>एपिसोड</div>
          <div style={{ ...num(260, G.gold), textShadow: "0 0 70px rgba(242,184,75,0.45)" }}>03</div>
        </div>
      )}

      <div
        style={{
          position: "absolute",
          left: 84,
          top: 420,
          width: 912,
          opacity: interpolate(card, [0, 0.4], [0, 1], clamp),
          transform: `translateY(${interpolate(card, [0, 1], [80, 0])}px) rotate(${interpolate(card, [0, 1], [2, -0.6])}deg)`,
        }}
      >
        <div
          style={{
            position: "relative",
            borderRadius: 26,
            background: `linear-gradient(180deg, ${G.leaf} 0%, #DDB878 55%, ${G.leafDeep} 100%)`,
            boxShadow: "0 40px 80px -30px rgba(0,0,0,0.75), inset 0 0 40px rgba(120,70,10,0.35)",
            padding: "30px 40px 34px",
            overflow: "hidden",
          }}
        >
          {/* leaf grain */}
          {Array.from({ length: 9 }).map((_, i) => (
            <div key={i} style={{ position: "absolute", left: 0, right: 0, top: 36 + i * 44, height: 2, background: "rgba(90,52,10,0.10)" }} />
          ))}
          {/* binding holes */}
          {[34, 878].map((x) => (
            <div key={x} style={{ position: "absolute", left: x - 12, top: "50%", marginTop: -12, width: 24, height: 24, borderRadius: "50%", background: G.ink, opacity: 0.75 }} />
          ))}
          <div style={{ position: "relative", display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
            <div style={deva(40, G.leafInk, 700)}>भगवद् गीता</div>
            <div style={{ display: "flex", alignItems: "baseline", gap: 10 }}>
              <div style={deva(40, G.leafInk, 700)}>अध्याय</div>
              <div style={num(42, G.leafInk)}>2</div>
              <div style={deva(40, G.leafInk, 700)}>· श्लोक</div>
              <div style={num(42, "#9A3B0E")}>62–63</div>
            </div>
          </div>
          <div style={{ position: "relative", height: 2, background: "rgba(58,35,11,0.35)", marginBottom: 14 }} />
          {lines.map((ln, i) => {
            const p = i < 2 ? l12 : l34;
            return (
              <div key={i} style={{ ...sanskrit(47, G.leafInk), textAlign: "center", opacity: 0.15 + 0.85 * p, transform: `translateY(${(1 - p) * 10}px)` }}>
                {ln}
              </div>
            );
          })}
        </div>
        <div style={{ marginTop: 26, display: "flex", justifyContent: "center", opacity: ease(f, b63 + 10, b63 + 22) }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{ width: 22, height: 22, borderRadius: 6, background: "rgba(255,154,60,0.55)" }} />
            <div style={deva(42, G.dim, 700)}>= बर्बादी के 8 कदम</div>
          </div>
        </div>
      </div>

      <Stairs state={() => "off"} opacity={0.6} />
    </SceneShell>
  );
};

/* ================= S3–S5 · walking down the steps ================= */

const reached = (i: number, upto: number): StepState => {
  if (i + 1 > upto) return "idle";
  if (i + 1 <= 3) return "warn";
  if (i + 1 === 4) return "anger";
  return "fall";
};

const popOf = (f: number, keys: { at: number; step: number }[]) => (i: number) => {
  const k = keys.find((x) => x.step === i + 1);
  if (!k) return 0;
  return Math.sin(Math.PI * ease(f, k.at - 3, k.at + 9));
};

export const S3Start: React.FC<SP> = ({ dur }) => {
  const f = useCurrentFrame();
  const keys = [
    { at: cue("s3", "pehla"), step: 1 },
    { at: cue("s3", "lagaav"), step: 2 },
    { at: cue("s3", "chaahat"), step: 3 },
  ];
  const upto = keys.filter((k) => f >= k.at - 2).length;
  const orb = useOrb(keys);
  return (
    <SceneShell dur={dur}>
      <FigLabel n={1} text="बर्बादी की सीढ़ी" />
      <Readout entries={keys.map((k) => ({ at: k.at, k: k.step }))} />
      <Stairs state={(i) => reached(i, upto)} pop={popOf(f, keys)} orb={orb} />
      {keys.map((k) => (
        <Sfx key={k.step} at={k.at - 3} name="pop" vol={0.45} />
      ))}
    </SceneShell>
  );
};

export const S4Anger: React.FC<SP> = ({ dur }) => {
  const f = useCurrentFrame();
  const g = cue("s4", "gussa");
  const keys = [{ at: g, step: 4 }];
  const upto = f >= g - 2 ? 4 : 3;
  const orb = useOrb(keys, 3);
  const shake = f >= g && f < g + 14 ? Math.sin(f * 2.4) * (14 - (f - g)) * 1.5 : 0;
  const flash = interpolate(f, [g, g + 3, g + 16], [0, 0.22, 0], clamp);
  return (
    <SceneShell dur={dur}>
      <FigLabel n={1} text="बर्बादी की सीढ़ी" at={-20} />
      {/* while "chaahat poori nahi hui" plays: step 3 stays on the readout */}
      <Readout entries={[{ at: -20, k: 3 }, { at: g, k: 4 }]} />
      <Stairs state={(i) => reached(i, upto)} pop={popOf(f, keys)} orb={orb} shake={shake} />
      <div style={{ position: "absolute", inset: 0, background: G.red, opacity: flash, mixBlendMode: "screen" }} />
      <Sfx at={g - 3} name="stamp" vol={0.75} />
      <Sfx at={g - 1} name="error" vol={0.5} />
    </SceneShell>
  );
};

export const S5Fall: React.FC<SP> = ({ dur }) => {
  const f = useCurrentFrame();
  const krodh = cue("s5", "krodhaad");
  const keys = [
    { at: cue("s5", "bhram"), step: 5 },
    { at: cue("s5", "yaaddaasht"), step: 6 },
    { at: cue("s5", "buddhi"), step: 7 },
    { at: cue("s5", "gir"), step: 8 },
  ];
  const fallAt = cue("s5", "gir") + 12;
  const orbKeys = [...keys, { at: fallAt, step: 9 }];
  const upto = 4 + keys.filter((k) => f >= k.at - 2).length;
  const orb = useOrb(orbKeys, 4);
  const quoteIn = ease(f, krodh - 6, krodh + 8);
  const quoteOut = ease(f, keys[0].at - 8, keys[0].at - 2);
  const dark = ease(f, fallAt + 6, fallAt + 24);
  return (
    <SceneShell dur={dur}>
      <FigLabel n={1} text="बर्बादी की सीढ़ी" at={-20} />
      {quoteOut < 1 && (
        <div style={{ position: "absolute", left: 84, right: 84, top: 400, display: "flex", flexDirection: "column", alignItems: "center", gap: 18, opacity: quoteIn * (1 - quoteOut), transform: `scale(${0.92 + 0.08 * quoteIn})` }}>
          <div style={{ ...sanskrit(96, G.gold), textShadow: "0 0 50px rgba(242,184,75,0.35)" }}>क्रोधाद्भवति सम्मोहः</div>
          <div style={deva(52, G.dim, 700)}>गुस्से से भ्रम पैदा होता है</div>
        </div>
      )}
      <Readout entries={keys.map((k) => ({ at: k.at, k: k.step }))} />
      <Stairs state={(i) => reached(i, upto)} pop={popOf(f, keys)} orb={orb} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 820, bottom: 0, background: `linear-gradient(180deg, transparent, rgba(7,8,24,${0.55 * dark}))` }} />
      <Sfx at={krodh - 3} name="swish" vol={0.45} />
      {keys.map((k) => (
        <Sfx key={k.step} at={k.at - 3} name="pop" vol={0.45} />
      ))}
      <Sfx at={fallAt + 4} name="bass" vol={0.7} />
    </SceneShell>
  );
};

/* ================= S6 · catch it at step 1 ================= */

export const S6Catch: React.FC<SP> = ({ dur }) => {
  const f = useCurrentFrame();
  const chauthe = cue("s6", "chauthe");
  const pehle = cue("s6", "pehle");
  const pakdo = cue("s6", "pakdo");
  const ghoome = cue("s6", "ghoome");
  const poochho = cue("s6", "poochho");
  // rewind: orb climbs back from step 8 to step 1 at the start
  const rewind = ease(f, 0, 22, "inOut");
  const k = 8 - Math.round(rewind * 7);
  const pos1 = orbAt(8);
  const pos2 = orbAt(1);
  const orb = { x: pos1.x + (pos2.x - pos1.x) * rewind, y: pos1.y + (pos2.y - pos1.y) * rewind - Math.abs(Math.sin(rewind * Math.PI * 7)) * 30, o: 1 };
  const good = f >= pakdo - 2;
  const state = (i: number): StepState => (i === 0 ? (good ? "good" : "warn") : i + 1 > k ? "off" : reached(i, 8));
  const strike = ease(f, chauthe + 4, chauthe + 14);
  const l2 = useSpring(pehle - 4, "snappy");
  const bar = ease(f, pakdo - 4, pakdo + 8);
  const ask = useSpring(ghoome - 6, "smooth");
  const askHi = ease(f, poochho - 4, poochho + 8);
  return (
    <SceneShell dur={dur}>
      <FigLabel n={2} text="यहीं पकड़ो" />
      <Sfx at={2} name="swish" vol={0.4} />
      <Sfx at={pakdo - 2} name="check" vol={0.6} />
      <Sfx at={ghoome - 4} name="pop" vol={0.45} />

      {/* headline */}
      <div style={{ position: "absolute", left: 84, right: 84, top: 370, display: "flex", flexDirection: "column", gap: 10 }}>
        <div style={{ position: "relative", alignSelf: "flex-start", opacity: ease(f, chauthe - 6, chauthe + 4) }}>
          <div style={deva(78, G.dim, 700)}>चौथे कदम पर नहीं,</div>
          <div style={{ position: "absolute", left: -6, top: "54%", height: 7, width: `${104 * strike}%`, background: G.red, borderRadius: 4 }} />
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 20, opacity: interpolate(l2, [0, 0.4], [0, 1], clamp), transform: `translateX(${(1 - l2) * 50}px)` }}>
          <div style={{ ...deva(92, G.ink), background: G.green, borderRadius: 20, padding: "2px 26px 0" }}>पहले कदम</div>
          <div style={deva(92, f >= pakdo - 2 ? G.green : G.cream)}>पर पकड़ो</div>
        </div>
      </div>

      {/* the question card */}
      <div
        style={{
          position: "absolute",
          left: 84,
          top: 610,
          width: 912,
          ...glass,
          padding: "24px 36px 22px",
          boxSizing: "border-box",
          opacity: interpolate(ask, [0, 0.4], [0, 1], clamp),
          transform: `translateY(${(1 - ask) * 40}px)`,
          borderColor: askHi > 0.5 ? G.line : G.lineSoft,
        }}
      >
        <div style={deva(40, G.gold, 700)}>खुद से पूछो</div>
        <div style={deva(64, G.cream, 800)}>क्या इसे सोचना ज़रूरी है?</div>
      </div>

      <Stairs state={state} pop={(i) => (i === 0 ? Math.sin(Math.PI * ease(f, pakdo - 2, pakdo + 10)) : 0)} orb={orb} />
      {/* green stop bar between step 1 and 2 */}
      <div style={{ position: "absolute", left: stepX(1) - 4, top: stepY(0) - 70, width: 8, height: (stepY(1) - stepY(0) + 120) * bar, background: G.green, borderRadius: 4, boxShadow: "0 0 24px rgba(43,212,107,0.7)" }} />
    </SceneShell>
  );
};

/* ================= S7 · share + comment + next + follow ================= */

const SendGlyph: React.FC<{ size?: number; color?: string }> = ({ size = 70, color = G.ink }) => (
  <svg width={size} height={size} viewBox="0 0 24 24">
    <path d="M3 11.5 L21 3 L13.5 21 L11 13 Z" fill="none" stroke={color} strokeWidth={2.2} strokeLinejoin="round" />
    <path d="M11 13 L21 3" stroke={color} strokeWidth={2.2} strokeLinecap="round" />
  </svg>
);

const Check: React.FC<{ size?: number; draw?: number }> = ({ size = 46, draw = 1 }) => (
  <svg width={size} height={size} viewBox="0 0 48 48">
    <circle cx={24} cy={24} r={22} fill={G.green} />
    <path d="M14 25 L21 32 L35 17" fill="none" stroke={G.white} strokeWidth={5} strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - draw} />
  </svg>
);

const Cursor: React.FC = () => (
  <svg width={86} height={86} viewBox="0 0 24 24">
    <path d="M5 3 L19 12 L12.5 13.5 L16 20.5 L13.2 21.8 L9.8 14.8 L5 19 Z" fill={G.white} stroke={G.ink} strokeWidth={1.4} strokeLinejoin="round" />
  </svg>
);

const TYPED = ["क", "द", "म", " ", "4"];

export const S7Cta: React.FC<SP> = ({ dur }) => {
  const f = useCurrentFrame();
  const bhejo = cue("s7", "bhejo");
  const comment = cue("s7", "comment");
  const kadam = cue("s7", "kadam");
  const ep = cue("s7", "episode");
  const arjun = cue("s7", "arjun");
  const miss = cue("s7", "miss");
  const follow = cue("s7", "follow");
  const out = ease(f, ep - 8, ep, "in");
  const typed = Math.max(0, Math.min(TYPED.length, Math.floor((f - kadam + 4) / 3)));
  const sent = useSpring(kadam - 4 + TYPED.length * 3 + 4, "bouncy");
  const btn = useSpring(follow - 10, "bouncy");
  const cursorIn = ease(f, follow - 4, follow + 10);
  const press = f >= follow + 12 && f < follow + 16 ? 0.94 : 1;
  const followed = f >= follow + 14;
  return (
    <SceneShell dur={dur} noExit>
      <Sfx at={bhejo - 4} name="whoosh" vol={0.45} />
      <Sfx at={kadam} name="key" vol={0.4} />
      <Sfx at={ep - 2} name="swish" vol={0.5} />
      <Sfx at={follow + 12} name="ding" vol={0.5} />

      {f < ep + 2 && (
        <div style={{ position: "absolute", inset: 0, opacity: 1 - out, transform: `translateY(${-70 * out}px)` }}>
          {/* share */}
          <Enter delay={bhejo - 8} from="right" dist={90} style={{ position: "absolute", left: 84, top: 400, width: 912 }}>
            <div style={{ ...glass, borderColor: G.line, padding: "30px 34px", display: "flex", alignItems: "center", gap: 30 }}>
              <div style={{ flex: "0 0 120px", height: 120, borderRadius: "50%", background: theme.grad.gold, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <SendGlyph size={66} />
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <div style={deva(76, G.cream)}>उसे भेजो</div>
                <div style={deva(44, G.dim, 700)}>जिसे गुस्सा जल्दी आता है</div>
              </div>
            </div>
          </Enter>
          {/* comment */}
          <Enter delay={comment - 8} from="left" dist={90} style={{ position: "absolute", left: 84, top: 700, width: 912 }}>
            <div style={{ ...deva(44, G.gold, 700), marginBottom: 14 }}>कमेंट में बताओ, आप किस कदम पर अटकते हो?</div>
            <div style={{ background: G.white, borderRadius: 30, height: 140, padding: "0 30px", boxSizing: "border-box", display: "flex", alignItems: "center", gap: 22, boxShadow: "0 30px 60px -30px rgba(0,0,0,0.6)" }}>
              <div style={{ width: 70, height: 70, borderRadius: "50%", background: G.leaf, flex: "0 0 70px" }} />
              <div style={{ flex: 1, height: 82, borderRadius: 41, border: "3px solid rgba(7,8,24,0.15)", display: "flex", alignItems: "center", padding: "0 28px" }}>
                {typed ? (
                  <div style={{ ...deva(52, G.ink), display: "flex", alignItems: "center" }}>
                    {TYPED.slice(0, typed).join("")}
                    {typed < TYPED.length && Math.floor(f / 8) % 2 === 0 && <span style={{ width: 4, height: 50, background: G.goldDeep, marginLeft: 4 }} />}
                  </div>
                ) : (
                  <div style={{ fontFamily: theme.fonts.label, fontWeight: 500, fontSize: 36, color: "rgba(7,8,24,0.45)" }}>Add a comment…</div>
                )}
              </div>
              <div style={{ transform: `scale(${1 + 0.25 * Math.sin(Math.PI * sent)}) rotate(${-20 * sent}deg)` }}>
                <SendGlyph size={60} color={typed === TYPED.length ? G.goldDeep : "rgba(7,8,24,0.3)"} />
              </div>
            </div>
          </Enter>
        </div>
      )}

      {/* next episode */}
      {f >= ep - 4 && (
        <div style={{ position: "absolute", left: 84, right: 84, top: 330, display: "flex", flexDirection: "column", alignItems: "center", gap: 20 }}>
          <Enter delay={ep} cfg="snappy">
            <div style={{ display: "flex", alignItems: "center", gap: 14, background: G.gold, borderRadius: 999, padding: "6px 30px 2px" }}>
              <div style={deva(46, G.ink, 800)}>अगला एपिसोड</div>
              <div style={num(42, G.ink)}>· #04</div>
            </div>
          </Enter>
          <Enter delay={ep + 4}>
            <div style={{ background: G.cream, borderRadius: 30, border: `5px solid ${G.gold}`, boxShadow: `10px 10px 0 ${G.goldDeep}`, padding: "26px 54px 18px", display: "flex", flexDirection: "column", alignItems: "center" }}>
              <div style={deva(92, G.ink)}>मन कंट्रोल</div>
              <div style={deva(92, G.ink)}>क्यों नहीं होता?</div>
            </div>
          </Enter>
          <div style={{ marginTop: 10, opacity: ease(f, arjun - 6, arjun + 6), transform: `translateY(${(1 - ease(f, arjun - 6, arjun + 6)) * 16}px)` }}>
            <div style={deva(50, G.gold, 700)}>अर्जुन की भी यही शिकायत थी</div>
          </div>
        </div>
      )}

      {/* follow */}
      {f >= miss - 8 && (
        <div style={{ position: "absolute", left: 0, right: 0, top: 1000, display: "flex", flexDirection: "column", alignItems: "center", gap: 26 }}>
          <div style={{ ...deva(48, G.dim, 700), opacity: ease(f, miss - 6, miss + 6) }}>गीता का अगला श्लोक मिस न हो</div>
          <div
            style={{
              position: "relative",
              opacity: interpolate(btn, [0, 0.4], [0, 1], clamp),
              transform: `translateY(${interpolate(btn, [0, 1], [60, 0])}px) scale(${press})`,
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 18,
                background: followed ? G.cream : theme.grad.gold,
                border: followed ? `4px solid ${G.gold}` : "4px solid transparent",
                borderRadius: 999,
                padding: "22px 48px 18px",
                boxShadow: followed ? undefined : "0 24px 60px -18px rgba(242,184,75,0.6)",
                fontFamily: theme.fonts.num,
                fontWeight: 700,
                fontSize: 50,
                color: G.ink,
              }}
            >
              {followed && <Check size={50} draw={ease(f, follow + 14, follow + 28)} />}
              {followed ? "Following" : "Follow"} {HANDLE}
            </div>
            <div style={{ position: "absolute", right: -30, top: 62, opacity: cursorIn, transform: `translate(${(1 - cursorIn) * 220}px, ${(1 - cursorIn) * 260}px) scale(${press})` }}>
              <Cursor />
            </div>
          </div>
        </div>
      )}
    </SceneShell>
  );
};
