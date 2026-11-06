import React from "react";
import { Img, interpolate, staticFile, useCurrentFrame } from "remotion";
import { Enter, SceneShell, Sfx, clamp, deva, ease, glass, num, sanskrit, useSpring } from "../../components/kit";
import { HANDLE } from "../../components/sheet";
import { Cracks, CutOut, Glitch, GoldDust, Halo, MeterState, StepMeter, ThoughtRings, orbStep } from "../../components/fx";
import { G, theme } from "../../theme";
import { cue } from "./timeline";

type SP = { dur: number };

/* step names: Hindi + the Sanskrit word from 2.62–63 */
const STEPS: { hi: string; sa: string; size: number }[] = [
  { hi: "बार-बार सोचना", sa: "ध्यायतो विषयान्", size: 80 },
  { hi: "लगाव", sa: "सङ्ग", size: 104 },
  { hi: "चाहत", sa: "काम", size: 104 },
  { hi: "गुस्सा", sa: "क्रोध", size: 104 },
  { hi: "भ्रम", sa: "सम्मोह", size: 104 },
  { hi: "याददाश्त गड़बड़", sa: "स्मृतिविभ्रम", size: 76 },
  { hi: "बुद्धि का नाश", sa: "बुद्धिनाश", size: 84 },
  { hi: "पतन", sa: "प्रणश्यति", size: 104 },
];
const stepColor = (k: number) => (k <= 3 ? G.saffron : G.red);

/** "k/8 · name · sanskrit" readout at the top of the step scenes. */
const Readout: React.FC<{ entries: { at: number; k: number }[]; top?: number }> = ({ entries, top = 300 }) => {
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
          <div key={idx} style={{ position: "absolute", left: 84, right: 84, top, height: 230, opacity: inP * (1 - outP), transform: `translateY(${(1 - inP) * 34 - outP * 34}px)` }}>
            <div style={{ position: "absolute", left: 0, top: 0, display: "flex", alignItems: "baseline" }}>
              <div style={{ ...num(196, c), textShadow: `0 0 60px ${e.k === 4 ? "rgba(255,90,95,0.5)" : "rgba(255,154,60,0.35)"}` }}>{e.k}</div>
              <div style={num(62, G.dim)}>/8</div>
            </div>
            <div style={{ position: "absolute", left: 250, top: 14, display: "flex", flexDirection: "column", gap: 2 }}>
              <div style={deva(s.size, e.k >= 4 ? G.red : G.cream)}>{s.hi}</div>
              <div style={{ ...sanskrit(50, G.gold), lineHeight: 1.2 }}>{s.sa}</div>
            </div>
          </div>
        );
      })}
    </>
  );
};

/* the man, always at the same spot in the step scenes */
const MAN = { x: 540, bottom: 1330, h: 760 };

/* ================= S1 · hook: Krishna → you ================= */

export const S1Hook: React.FC<SP> = ({ dur }) => {
  const f = useCurrentFrame();
  const barbaad = cue("s1", "barbaad");
  const gussa = cue("s1", "gussa");
  const chautha = cue("s1", "chautha");
  const pehla = cue("s1", "pehla");
  const aap = cue("s1", "aap");
  const fourPulse = Math.sin(Math.PI * ease(f, chautha - 2, chautha + 12));
  const shake = f >= barbaad && f < barbaad + 12 ? Math.sin(f * 2.4) * (12 - (f - barbaad)) * 1.2 : 0;
  const swap = ease(f, pehla - 6, pehla + 6);
  const tag = useSpring(aap - 4, "bouncy");
  return (
    <SceneShell dur={dur}>
      <Sfx at={barbaad - 2} name="bass" vol={0.55} />
      <Sfx at={gussa - 2} name="stamp" vol={0.6} />
      <Sfx at={pehla - 4} name="swish" vol={0.45} />
      <Sfx at={aap - 2} name="ding" vol={0.45} />
      <GoldDust n={36} seed="h" />

      {/* Krishna + Arjun on the chariot, then the viewer */}
      <div style={{ position: "absolute", inset: 0, transform: `translateX(${shake}px)`, opacity: 1 - swap }}>
        <Halo x={430} y={760} r={430} />
        <CutOut src="img/krishna-arjun-cut.png" x={560} bottom={1560} h={1010} at={-30} drift={0.05} glow="rgba(242,184,75,0.35)" />
      </div>
      {swap > 0 && (
        <div style={{ position: "absolute", inset: 0, opacity: swap }}>
          <Halo x={600} y={900} r={380} color="rgba(255,154,60,0.28)" />
          <CutOut src="img/man-think-cut.png" x={MAN.x + 20} bottom={1520} h={900} at={pehla - 6} from="right" glow="rgba(255,154,60,0.35)" />
          <ThoughtRings x={600} y={640} at={aap} />
        </div>
      )}

      {/* hook text: on screen from frame 0 */}
      <div style={{ position: "absolute", left: 0, right: 0, top: 290, display: "flex", flexDirection: "column", alignItems: "center", gap: 18 }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 24, textShadow: "0 6px 30px rgba(0,0,0,0.8)" }}>
          <div style={deva(112)}>बर्बादी के</div>
          <div style={{ ...num(146, G.gold), textShadow: "0 0 50px rgba(242,184,75,0.55)" }}>8</div>
          <div style={deva(112)}>कदम</div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div style={{ ...deva(96, G.white), background: G.red, borderRadius: 22, padding: "2px 28px 0", transform: `rotate(-2deg) scale(${1 + 0.1 * fourPulse})`, boxShadow: "0 0 70px rgba(255,90,95,0.45)" }}>गुस्सा</div>
          <div style={{ ...deva(88), textShadow: "0 6px 30px rgba(0,0,0,0.8)" }}>सिर्फ़ चौथा है</div>
        </div>
      </div>

      {/* "pehla kadam, aap" tag */}
      <div style={{ position: "absolute", left: 120, top: 760, opacity: interpolate(tag, [0, 0.4], [0, 1], clamp), transform: `scale(${interpolate(tag, [0, 1], [0.6, 1])}) rotate(-3deg)`, transformOrigin: "0 50%" }}>
        <div style={{ ...deva(60, G.ink), background: G.gold, borderRadius: 18, padding: "2px 24px 0", boxShadow: "0 0 50px rgba(242,184,75,0.5)" }}>पहला कदम?</div>
      </div>
    </SceneShell>
  );
};

/* ================= S2 · source ================= */

const CHAIN = (p: (n: number) => number): React.ReactNode[] => {
  const H: React.FC<{ n: number; children: string }> = ({ n, children }) => {
    const v = p(n);
    return <span style={{ background: `rgba(255,154,60,${0.42 * v})`, borderRadius: 8, boxShadow: v > 0 ? `0 0 0 ${3 * v}px rgba(255,154,60,${0.42 * v})` : undefined }}>{children}</span>;
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
  const hiAt = (n: number) => (n <= 4 ? b62 + 8 + (n - 1) * 3 : b63 + 4 + (n - 5) * 3);
  const lines = CHAIN((n) => ease(f, hiAt(n), hiAt(n) + 6));
  return (
    <SceneShell dur={dur}>
      <Sfx at={series - 2} name="swish" vol={0.45} />
      <Sfx at={ep - 2} name="pop" vol={0.5} />
      <Sfx at={adh - 4} name="whoosh" vol={0.45} />
      <Sfx at={b62 + 8} name="tick" vol={0.35} />
      <Sfx at={b63 + 4} name="tick" vol={0.35} />

      {/* Krishna + Arjun, dim, behind the card */}
      <div style={{ position: "absolute", inset: 0, opacity: 0.38, filter: "blur(1.5px)" }}>
        <CutOut src="img/krishna-arjun-cut.png" x={560} bottom={1640} h={1100} at={-30} drift={0.06} />
      </div>
      <GoldDust n={24} seed="s" />

      <Enter delay={series - 6} cfg="snappy" style={{ position: "absolute", left: 0, right: 0, top: 296, display: "flex", justifyContent: "center" }}>
        <div style={{ background: G.gold, borderRadius: 999, padding: "6px 34px 2px", boxShadow: "0 0 60px rgba(242,184,75,0.4)" }}>
          <div style={deva(52, G.ink, 800)}>गीता श्लोक सीरीज़</div>
        </div>
      </Enter>

      {epOut < 1 && (
        <div style={{ position: "absolute", left: 0, right: 0, top: 480, display: "flex", flexDirection: "column", alignItems: "center", opacity: interpolate(epIn, [0, 0.4], [0, 1], clamp) * (1 - epOut), transform: `scale(${interpolate(epIn, [0, 1], [0.7, 1]) - 0.1 * epOut})` }}>
          <div style={deva(70, G.cream, 700)}>एपिसोड</div>
          <div style={{ ...num(280, G.gold), textShadow: "0 0 80px rgba(242,184,75,0.5)" }}>03</div>
        </div>
      )}

      <div style={{ position: "absolute", left: 84, top: 430, width: 912, opacity: interpolate(card, [0, 0.4], [0, 1], clamp), transform: `translateY(${interpolate(card, [0, 1], [80, 0])}px) rotate(${interpolate(card, [0, 1], [2, -0.6])}deg)` }}>
        <div style={{ position: "relative", borderRadius: 26, background: `linear-gradient(180deg, ${G.leaf} 0%, #DDB878 55%, ${G.leafDeep} 100%)`, boxShadow: "0 40px 80px -30px rgba(0,0,0,0.85), 0 0 80px rgba(242,184,75,0.25), inset 0 0 40px rgba(120,70,10,0.35)", padding: "30px 40px 34px", overflow: "hidden" }}>
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} style={{ position: "absolute", left: 0, right: 0, top: 36 + i * 44, height: 2, background: "rgba(90,52,10,0.10)" }} />
          ))}
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
          <div style={{ display: "flex", alignItems: "center", gap: 14, background: "rgba(7,8,24,0.7)", borderRadius: 999, padding: "6px 26px 2px" }}>
            <div style={{ width: 22, height: 22, borderRadius: 6, background: "rgba(255,154,60,0.7)" }} />
            <div style={deva(44, G.cream, 700)}>= बर्बादी के 8 कदम</div>
          </div>
        </div>
      </div>
    </SceneShell>
  );
};

/* ================= S3–S5 · the man walks down the steps ================= */

const reached = (i: number, upto: number): MeterState => (i + 1 > upto ? "idle" : i + 1 <= 3 ? "warn" : i + 1 === 4 ? "anger" : "fall");
const popOf = (f: number, keys: { at: number; step: number }[]) => (i: number) => {
  const k = keys.find((x) => x.step === i + 1);
  return k ? Math.sin(Math.PI * ease(f, k.at - 3, k.at + 9)) : 0;
};

export const S3Start: React.FC<SP> = ({ dur }) => {
  const f = useCurrentFrame();
  const keys = [
    { at: cue("s3", "pehla"), step: 1 },
    { at: cue("s3", "lagaav"), step: 2 },
    { at: cue("s3", "chaahat"), step: 3 },
  ];
  const upto = keys.filter((k) => f >= k.at - 2).length;
  const orb = orbStep(f, keys.slice(1), 1);
  const bond = ease(f, keys[1].at - 4, keys[1].at + 10);
  const want = ease(f, keys[2].at - 4, keys[2].at + 12);
  return (
    <SceneShell dur={dur + 40}>
      <GoldDust n={24} seed="a" />
      <Readout entries={keys.map((k) => ({ at: k.at, k: k.step }))} />
      <Halo x={600} y={980} r={360 + 80 * want} color={`rgba(255,154,60,${0.22 + 0.18 * want})`} />
      <CutOut src="img/man-think-cut.png" x={MAN.x + 20} bottom={MAN.bottom} h={MAN.h} at={-20} glow={`rgba(255,154,60,${0.3 + 0.3 * want})`} />
      <ThoughtRings x={590} y={640} at={keys[0].at - 4} />
      {/* लगाव: gold threads from the phone; चाहत: the phone glows hotter */}
      <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0, opacity: bond }}>
        {[0, 1, 2, 3, 4].map((k) => (
          <path
            key={k}
            d={`M ${700} ${880} C ${780 + k * 40} ${760 - k * 60}, ${300 - k * 30} ${700 - k * 40}, ${560 + k * 10} ${620 + k * 8}`}
            fill="none"
            stroke={G.gold}
            strokeWidth={3}
            opacity={0.7}
            pathLength={1}
            strokeDasharray={1}
            strokeDashoffset={1 - bond}
            style={{ filter: "drop-shadow(0 0 6px rgba(242,184,75,0.9))" }}
          />
        ))}
      </svg>
      <Halo x={700} y={880} r={60 + 90 * want} color="rgba(255,190,90,0.85)" o={bond} />
      <StepMeter state={(i) => reached(i, upto)} orb={orb} orbO={ease(f, keys[0].at - 6, keys[0].at + 4)} pop={popOf(f, keys)} />
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
  const orb = orbStep(f, keys, 3);
  const swap = ease(f, g - 6, g + 2);
  const shake = f >= g && f < g + 16 ? Math.sin(f * 2.4) * (16 - (f - g)) * 1.8 : 0;
  const flash = interpolate(f, [g, g + 3, g + 16], [0, 0.25, 0], clamp);
  return (
    <SceneShell dur={dur + 40}>
      <GoldDust n={24} seed="a" color={swap > 0.5 ? G.red : G.gold} />
      <Readout entries={[{ at: -20, k: 3 }, { at: g, k: 4 }]} />
      <div style={{ position: "absolute", inset: 0, transform: `translateX(${shake}px)` }}>
        <Halo x={600} y={980} r={360} color="rgba(255,154,60,0.3)" o={1 - swap} />
        <div style={{ opacity: 1 - swap }}>
          <CutOut src="img/man-think-cut.png" x={MAN.x + 20} bottom={MAN.bottom} h={MAN.h} at={-30} glow="rgba(255,154,60,0.5)" />
        </div>
        <Halo x={540} y={900} r={460} color="rgba(255,60,70,0.45)" o={swap} />
        <div style={{ opacity: swap }}>
          <CutOut src="img/man-angry-cut.png" x={MAN.x} bottom={MAN.bottom} h={MAN.h + 40} at={g - 8} from="none" glow="rgba(255,60,70,0.75)" filter="saturate(1.2)" />
        </div>
      </div>
      <div style={{ position: "absolute", inset: 0, background: G.red, opacity: flash, mixBlendMode: "screen" }} />
      <StepMeter state={(i) => reached(i, upto)} orb={orb} pop={popOf(f, keys)} />
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
  const fallAt = cue("s5", "gir") + 10;
  const upto = 4 + keys.filter((k) => f >= k.at - 2).length;
  const orb = orbStep(f, [...keys, { at: fallAt, step: 9 }], 4);
  const quoteIn = ease(f, krodh - 6, krodh + 8);
  const quoteOut = ease(f, keys[0].at - 8, keys[0].at - 2);
  const dbl = ease(f, keys[0].at - 4, keys[0].at + 8); // भ्रम: double vision
  const glitch = f >= keys[1].at - 4 ? 0.55 + 0.45 * Math.abs(Math.sin(f / 2.3)) : 0; // याददाश्त
  const crack = ease(f, keys[2].at - 4, keys[2].at + 16); // बुद्धि का नाश
  const fall = ease(f, keys[3].at - 6, keys[3].at + 2);
  const drop = ease(f, fallAt - 4, fallAt + 30, "in");
  const dim = 0.35 * crack;
  const man = (
    <div style={{ position: "absolute", inset: 0 }}>
      <CutOut src="img/man-angry-cut.png" x={MAN.x} bottom={MAN.bottom} h={MAN.h + 40} at={-30} from="none" glow="rgba(255,60,70,0.6)" filter={`brightness(${1 - dim}) blur(${1.5 * dbl * (1 - crack)}px)`} />
    </div>
  );
  return (
    <SceneShell dur={dur + 40}>
      <GoldDust n={24} seed="b" color={G.red} />
      {/* quote */}
      {quoteOut < 1 && (
        <div style={{ position: "absolute", left: 84, right: 84, top: 310, display: "flex", flexDirection: "column", alignItems: "center", gap: 14, opacity: quoteIn * (1 - quoteOut), transform: `scale(${0.92 + 0.08 * quoteIn})` }}>
          <div style={{ ...sanskrit(92, G.gold), textShadow: "0 0 50px rgba(242,184,75,0.45)" }}>क्रोधाद्भवति सम्मोहः</div>
          <div style={deva(50, G.cream, 700)}>गुस्से से भ्रम पैदा होता है</div>
        </div>
      )}
      <Readout entries={keys.map((k) => ({ at: k.at, k: k.step }))} />

      <Halo x={540} y={900} r={440} color="rgba(255,60,70,0.35)" o={1 - fall} />
      {fall < 1 && (
        <div style={{ position: "absolute", inset: 0, opacity: 1 - fall }}>
          {/* double vision ghosts */}
          {dbl > 0 && crack < 1 && (
            <>
              <div style={{ position: "absolute", inset: 0, opacity: 0.35 * dbl, transform: `translateX(${-26 * dbl + Math.sin(f / 4) * 8}px)` }}>{man}</div>
              <div style={{ position: "absolute", inset: 0, opacity: 0.35 * dbl, transform: `translateX(${26 * dbl - Math.sin(f / 4) * 8}px)` }}>{man}</div>
            </>
          )}
          <Glitch amount={glitch * (1 - crack * 0.6)}>{man}</Glitch>
          <Cracks x={545} y={640} p={crack} scale={1.1} />
        </div>
      )}
      {fall > 0 && (
        <div style={{ position: "absolute", inset: 0, opacity: fall * (1 - ease(f, fallAt + 20, fallAt + 34)), transform: `translateY(${drop * 900}px) rotate(${drop * 25}deg)`, transformOrigin: "50% 60%" }}>
          <CutOut src="img/man-fall-cut.png" x={560} bottom={1300} h={620} at={keys[3].at - 6} from="none" glow="rgba(255,60,70,0.5)" />
        </div>
      )}
      <div style={{ position: "absolute", left: 0, right: 0, top: 0, bottom: 0, background: `radial-gradient(ellipse at 50% 60%, transparent 30%, rgba(3,3,12,${0.6 * drop}) 75%)` }} />
      <StepMeter state={(i) => reached(i, upto)} orb={orb} pop={popOf(f, keys)} />
      <Sfx at={krodh - 3} name="swish" vol={0.45} />
      {keys.map((k) => (
        <Sfx key={k.step} at={k.at - 3} name="pop" vol={0.45} />
      ))}
      <Sfx at={keys[2].at} name="error" vol={0.45} />
      <Sfx at={fallAt + 4} name="bass" vol={0.7} />
    </SceneShell>
  );
};

/* ================= S6 · Krishna: catch it at step 1 ================= */

export const S6Catch: React.FC<SP> = ({ dur }) => {
  const f = useCurrentFrame();
  const chauthe = cue("s6", "chauthe");
  const pehle = cue("s6", "pehle");
  const pakdo = cue("s6", "pakdo");
  const ghoome = cue("s6", "ghoome");
  const poochho = cue("s6", "poochho");
  const rewind = ease(f, 0, 22, "inOut");
  const k = 8 - Math.round(rewind * 7);
  const good = f >= pakdo - 2;
  const state = (i: number): MeterState => (i === 0 ? (good ? "good" : "warn") : i + 1 > k ? "off" : reached(i, 8));
  const strike = ease(f, chauthe + 4, chauthe + 14);
  const l2 = useSpring(pehle - 4, "snappy");
  const ask = useSpring(ghoome - 6, "smooth");
  const askHi = ease(f, poochho - 4, poochho + 8);
  return (
    <SceneShell dur={dur}>
      <Sfx at={2} name="swish" vol={0.4} />
      <Sfx at={pakdo - 2} name="check" vol={0.6} />
      <Sfx at={ghoome - 4} name="pop" vol={0.45} />
      <GoldDust n={40} seed="k" />
      <Halo x={540} y={780} r={520} color="rgba(242,184,75,0.32)" />
      <CutOut src="img/krishna-face-cut.png" x={540} bottom={1350} h={900} at={-14} drift={0.05} glow="rgba(242,184,75,0.5)" />

      {/* headline */}
      <div style={{ position: "absolute", left: 84, right: 84, top: 290, display: "flex", flexDirection: "column", gap: 8, textShadow: "0 6px 30px rgba(0,0,0,0.85)" }}>
        <div style={{ position: "relative", alignSelf: "flex-start", opacity: ease(f, chauthe - 6, chauthe + 4) }}>
          <div style={deva(76, G.cream, 700)}>चौथे कदम पर नहीं,</div>
          <div style={{ position: "absolute", left: -6, top: "54%", height: 7, width: `${104 * strike}%`, background: G.red, borderRadius: 4 }} />
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 18, opacity: interpolate(l2, [0, 0.4], [0, 1], clamp), transform: `translateX(${(1 - l2) * 50}px)` }}>
          <div style={{ ...deva(90, G.ink), background: G.green, borderRadius: 20, padding: "2px 26px 0", textShadow: "none", boxShadow: "0 0 50px rgba(43,212,107,0.45)" }}>पहले कदम</div>
          <div style={deva(90, good ? G.green : G.cream)}>पर पकड़ो</div>
        </div>
      </div>

      {/* the question card */}
      <div
        style={{
          position: "absolute",
          left: 84,
          top: 1110,
          width: 912,
          ...glass,
          background: "rgba(7,8,24,0.78)",
          padding: "22px 36px 18px",
          boxSizing: "border-box",
          opacity: interpolate(ask, [0, 0.4], [0, 1], clamp),
          transform: `translateY(${(1 - ask) * 40}px)`,
          borderColor: askHi > 0.5 ? G.line : G.lineSoft,
        }}
      >
        <div style={deva(38, G.gold, 700)}>खुद से पूछो</div>
        <div style={deva(62, G.cream, 800)}>क्या इसे सोचना ज़रूरी है?</div>
      </div>

      <StepMeter state={state} orb={8 - rewind * 7} pop={(i) => (i === 0 ? Math.sin(Math.PI * ease(f, pakdo - 2, pakdo + 10)) : 0)} />
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
      <GoldDust n={30} seed="c" />

      {f < ep + 2 && (
        <div style={{ position: "absolute", inset: 0, opacity: 1 - out, transform: `translateY(${-70 * out}px)` }}>
          {/* the angry man, small, as the "friend" */}
          <Halo x={540} y={1180} r={300} color="rgba(255,60,70,0.25)" />
          <CutOut src="img/man-angry-cut.png" x={540} bottom={1480} h={560} at={bhejo - 10} glow="rgba(255,60,70,0.5)" />
          <Enter delay={bhejo - 8} from="right" dist={90} style={{ position: "absolute", left: 84, top: 300, width: 912 }}>
            <div style={{ ...glass, background: "rgba(7,8,24,0.75)", borderColor: G.line, padding: "26px 34px", display: "flex", alignItems: "center", gap: 30 }}>
              <div style={{ flex: "0 0 112px", height: 112, borderRadius: "50%", background: theme.grad.gold, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <SendGlyph size={62} />
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <div style={deva(74, G.cream)}>उसे भेजो</div>
                <div style={deva(44, G.dim, 700)}>जिसे गुस्सा जल्दी आता है</div>
              </div>
            </div>
          </Enter>
          <Enter delay={comment - 8} from="left" dist={90} style={{ position: "absolute", left: 84, top: 560, width: 912 }}>
            <div style={{ ...deva(42, G.gold, 700), marginBottom: 12, textShadow: "0 4px 20px rgba(0,0,0,0.8)" }}>कमेंट में बताओ, आप किस कदम पर अटकते हो?</div>
            <div style={{ background: G.white, borderRadius: 30, height: 130, padding: "0 30px", boxSizing: "border-box", display: "flex", alignItems: "center", gap: 22, boxShadow: "0 30px 60px -30px rgba(0,0,0,0.6)" }}>
              <div style={{ width: 66, height: 66, borderRadius: "50%", background: G.leaf, flex: "0 0 66px" }} />
              <div style={{ flex: 1, height: 78, borderRadius: 39, border: "3px solid rgba(7,8,24,0.15)", display: "flex", alignItems: "center", padding: "0 28px" }}>
                {typed ? (
                  <div style={{ ...deva(50, G.ink), display: "flex", alignItems: "center" }}>
                    {TYPED.slice(0, typed).join("")}
                    {typed < TYPED.length && Math.floor(f / 8) % 2 === 0 && <span style={{ width: 4, height: 48, background: G.goldDeep, marginLeft: 4 }} />}
                  </div>
                ) : (
                  <div style={{ fontFamily: theme.fonts.label, fontWeight: 500, fontSize: 36, color: "rgba(7,8,24,0.45)" }}>Add a comment…</div>
                )}
              </div>
              <div style={{ transform: `scale(${1 + 0.25 * Math.sin(Math.PI * sent)}) rotate(${-20 * sent}deg)` }}>
                <SendGlyph size={58} color={typed === TYPED.length ? G.goldDeep : "rgba(7,8,24,0.3)"} />
              </div>
            </div>
          </Enter>
        </div>
      )}

      {/* next episode: troubled Arjun */}
      {f >= ep - 4 && (
        <>
          <div style={{ position: "absolute", left: 84, right: 84, top: 290, display: "flex", flexDirection: "column", alignItems: "center", gap: 18 }}>
            <Enter delay={ep} cfg="snappy">
              <div style={{ display: "flex", alignItems: "center", gap: 14, background: G.gold, borderRadius: 999, padding: "6px 30px 2px" }}>
                <div style={deva(46, G.ink, 800)}>अगला एपिसोड</div>
                <div style={num(42, G.ink)}>· #04</div>
              </div>
            </Enter>
            <Enter delay={ep + 4}>
              <div style={{ background: G.cream, borderRadius: 30, border: `5px solid ${G.gold}`, boxShadow: `10px 10px 0 ${G.goldDeep}`, padding: "20px 50px 12px", display: "flex", flexDirection: "column", alignItems: "center" }}>
                <div style={deva(84, G.ink)}>मन कंट्रोल</div>
                <div style={deva(84, G.ink)}>क्यों नहीं होता?</div>
              </div>
            </Enter>
          </div>
          <Halo x={540} y={900} r={300} color="rgba(242,184,75,0.28)" o={ease(f, ep + 4, ep + 16)} />
          <CutOut src="img/arjun-sad-cut.png" x={540} bottom={1150} h={480} at={ep + 6} glow="rgba(242,184,75,0.4)" />
          <div style={{ position: "absolute", left: 0, right: 0, top: 1160, display: "flex", justifyContent: "center", opacity: ease(f, arjun - 6, arjun + 6), transform: `translateY(${(1 - ease(f, arjun - 6, arjun + 6)) * 16}px)` }}>
            <div style={deva(48, G.gold, 700)}>अर्जुन की भी यही शिकायत थी</div>
          </div>
        </>
      )}

      {/* follow */}
      {f >= miss - 8 && (
        <div style={{ position: "absolute", left: 0, right: 0, top: 1250, display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
          <div style={{ ...deva(44, G.cream, 700), opacity: ease(f, miss - 6, miss + 6) }}>गीता का अगला श्लोक मिस न हो</div>
          <div style={{ position: "relative", opacity: interpolate(btn, [0, 0.4], [0, 1], clamp), transform: `translateY(${interpolate(btn, [0, 1], [60, 0])}px) scale(${press})` }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 18,
                background: followed ? G.cream : theme.grad.gold,
                border: followed ? `4px solid ${G.gold}` : "4px solid transparent",
                borderRadius: 999,
                padding: "18px 44px 14px",
                boxShadow: followed ? undefined : "0 24px 60px -18px rgba(242,184,75,0.6)",
                fontFamily: theme.fonts.num,
                fontWeight: 700,
                fontSize: 46,
                color: G.ink,
              }}
            >
              {followed && <Check size={46} draw={ease(f, follow + 14, follow + 28)} />}
              {followed ? "Following" : "Follow"} {HANDLE}
            </div>
            <div style={{ position: "absolute", right: -30, top: 56, opacity: cursorIn, transform: `translate(${(1 - cursorIn) * 220}px, ${(1 - cursorIn) * 260}px) scale(${press})` }}>
              <Cursor />
            </div>
          </div>
        </div>
      )}
    </SceneShell>
  );
};
