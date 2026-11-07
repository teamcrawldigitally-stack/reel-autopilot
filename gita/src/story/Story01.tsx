// Story reel (style of a painted storybook): painted backgrounds, cut-out characters,
// big condensed English titles, torn-paper labels with the verse reference, Hindi narration.
import React from "react";
import { AbsoluteFill, Audio, Img, Sequence, interpolate, random, staticFile, useCurrentFrame } from "remotion";
import { Sfx, clamp, ease } from "../components/kit";
import { createTimeline, type Timing } from "../lib/timeline";
import timingJson from "../reels/story01/timing.json";

export const timing = timingJson as unknown as Timing;
export const TL = createTimeline(timing);
export const LEAD = 8;

export const INK = "#1c1712";
export const CREAM = "#f6ecd6";
export const GOLD = "#f2b84b";
export const RED = "#d23a2c";
const PAPER = "#efe3c8";
const DISPLAY = "Anton, Oswald, sans-serif";
const TYPE = "SpecialElite, 'Courier New', monospace";
const DEV = /[\u0900-\u097F]/;

type Cue = string | number;
export const SceneId = React.createContext("s1");
/** Which story's timeline the cues read from (Story01 by default; other stories provide their own). */
export const TLCtx = React.createContext(TL);
export const useQ = () => {
  const id = React.useContext(SceneId);
  const TL = React.useContext(TLCtx);
  return (c: Cue | undefined, fb = 0): number => {
    if (c === undefined) return fb;
    if (typeof c === "number") return c;
    const m = c.match(/^(.+?)(?:#(\d+))?([+-]\d+)?$/)!;
    if (m[1] === "start") return Number(m[3] ?? 0);
    return TL.cue(id, m[1], m[2] ? Number(m[2]) : 1, m[3] ? Number(m[3]) : 0);
  };
};
const io = (f: number, a: number, b: number) => interpolate(f, [a, b], [0, 1], { ...clamp, easing: (t) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2) });
const vis = (f: number, at: number, out?: number, inLen = 8, outLen = 6) => ease(f, at, at + inLen) * (out !== undefined ? 1 - ease(f, out, out + outLen, "in") : 1);

/* ---------- painted background with a slow camera ---------- */
type Cam = { s: number; x?: number; y?: number };
export const Paint: React.FC<{ src: string; dur: number; from: Cam; to: Cam; dark?: number; blur?: number; tint?: string; at?: Cue; out?: Cue }> = ({ src, dur, from, to, dark = 0, blur = 0, tint, at, out }) => {
  const f = useCurrentFrame();
  const q = useQ();
  const a = at !== undefined ? q(at) : -LEAD;
  const o = out !== undefined ? q(out) : undefined;
  const t = io(f, -LEAD, dur);
  const s = from.s + (to.s - from.s) * t;
  const x = (from.x ?? 0) + ((to.x ?? 0) - (from.x ?? 0)) * t;
  const y = (from.y ?? 0) + ((to.y ?? 0) - (from.y ?? 0)) * t;
  const op = a <= -LEAD ? (o !== undefined ? 1 - ease(f, o, o + 8) : 1) : vis(f, a, o, 10, 8);
  return (
    <AbsoluteFill style={{ overflow: "hidden", opacity: op }}>
      <Img src={staticFile(src)} style={{ position: "absolute", left: 0, top: 0, width: 1080, height: 1920, objectFit: "cover", transform: `translate(${x}px, ${y}px) scale(${s})`, filter: blur ? `blur(${blur}px)` : undefined }} />
      {tint && <AbsoluteFill style={{ background: tint, mixBlendMode: "multiply" }} />}
      {dark > 0 && <AbsoluteFill style={{ background: `rgba(10,8,6,${dark})` }} />}
    </AbsoluteFill>
  );
};

/* ---------- cut-out character ---------- */
export const Cut: React.FC<{
  src: string; x?: number; bottom: number; h: number; at?: Cue; out?: Cue; from?: "left" | "right" | "up" | "none";
  shake?: [Cue, Cue]; tremble?: number; drive?: { from: number; at: Cue; len: number }; fall?: { at: Cue; len: number; deg: number; dy: number };
  glow?: string; zoom?: number; flip?: boolean;
}> = ({ src, x = 540, bottom, h, at, out, from = "up", shake, tremble = 0, drive, fall, glow, zoom = 0.05, flip }) => {
  const f = useCurrentFrame();
  const q = useQ();
  const a = at !== undefined ? q(at) : -LEAD;
  const o = out !== undefined ? q(out) : undefined;
  const p = a <= -LEAD ? 1 : ease(f, a, a + 14);
  const op = (a <= -LEAD ? 1 : ease(f, a, a + 8)) * (o !== undefined ? 1 - ease(f, o, o + 8, "in") : 1);
  const d = (1 - p) * 90;
  let tx = from === "left" ? -d : from === "right" ? d : 0;
  let ty = from === "up" ? d : 0;
  let rot = 0;
  let cx = x;
  if (drive) {
    const da = q(drive.at);
    cx = drive.from + (x - drive.from) * io(f, da, da + drive.len);
    ty += Math.abs(Math.sin(f / 3)) * -4 * (f >= da && f < da + drive.len ? 1 : 0);
  }
  if (shake) {
    const s0 = q(shake[0]), s1 = q(shake[1]);
    if (f >= s0 && f < s1) tx += Math.sin(f * 2.3) * 7;
  }
  if (tremble) tx += Math.sin(f * 1.9) * tremble + Math.sin(f * 3.1) * tremble * 0.5;
  if (fall) {
    const fa = q(fall.at);
    const k = interpolate(f, [fa, fa + fall.len], [0, 1], { ...clamp, easing: (t) => t * t });
    rot += fall.deg * k;
    ty += fall.dy * k;
  }
  const s = 1 + zoom * interpolate(f, [a, a + 240], [0, 1], clamp);
  return (
    <div style={{ position: "absolute", left: cx + tx, top: bottom - h + ty, height: h, transform: `translateX(-50%) rotate(${rot}deg) scale(${s * (0.94 + 0.06 * p)})${flip ? " scaleX(-1)" : ""}`, transformOrigin: "50% 100%", opacity: op }}>
      <Img src={staticFile(src)} style={{ height: h, width: "auto", display: "block", filter: `drop-shadow(0 18px 30px rgba(0,0,0,0.45))${glow ? ` drop-shadow(0 0 40px ${glow})` : ""}` }} />
    </div>
  );
};

/* ---------- big condensed title, word by word ---------- */
type TLine = { t: string; c?: string };
export const Title: React.FC<{ lines: TLine[]; at: Cue; out?: Cue; top?: number; size?: number; ink?: boolean }> = ({ lines, at, out, top = 250, size = 150, ink }) => {
  const f = useCurrentFrame();
  const q = useQ();
  const a = q(at);
  const o = out !== undefined ? q(out) : undefined;
  const fadeOut = o !== undefined ? 1 - ease(f, o, o + 6, "in") : 1;
  let k = 0;
  return (
    <div style={{ position: "absolute", left: 70, right: 60, top, opacity: fadeOut }}>
      {lines.map((ln, li) => (
        <div key={li} style={{ display: "flex", flexWrap: "wrap", columnGap: size * 0.22, lineHeight: 0.98 }}>
          {ln.t.split(" ").map((w, wi) => {
            const d = a + k++ * 3;
            const p = ease(f, d, d + 9);
            const pop = 1 + 0.08 * Math.sin(Math.PI * ease(f, d, d + 10));
            return (
              <span key={wi} style={{ display: "inline-block", fontFamily: DISPLAY, fontSize: size, color: ln.c ?? (ink ? INK : CREAM), textTransform: "uppercase", letterSpacing: 1, opacity: p, transform: `translateY(${(1 - p) * 50}px) scale(${pop})`, transformOrigin: "50% 100%", textShadow: ink ? "0 3px 0 rgba(255,250,235,0.35)" : "0 5px 0 rgba(0,0,0,0.35), 0 0 46px rgba(0,0,0,0.55)" }}>
                {w}
              </span>
            );
          })}
        </div>
      ))}
      <Sfx at={a} name="whoosh" vol={0.35} />
    </div>
  );
};

/* ---------- torn paper label ---------- */
const torn = (seed: string) => {
  const pts: string[] = [];
  const n = 18;
  for (let i = 0; i <= n; i++) pts.push(`${(i / n) * 100}% ${random(seed + "t" + i) * 7}%`);
  for (let i = n; i >= 0; i--) pts.push(`${(i / n) * 100}% ${100 - random(seed + "b" + i) * 7}%`);
  return `polygon(${pts.join(",")})`;
};
export const Label: React.FC<{ title?: string; red?: string; sub?: string; refx?: string; mono?: string; at: Cue; out?: Cue; x: number; y: number; rot?: number; size?: number; dark?: boolean; seed?: string }> = ({ title, red, sub, refx, mono, at, out, x, y, rot = -2, size = 92, dark, seed = "l" }) => {
  const f = useCurrentFrame();
  const q = useQ();
  const a = q(at);
  const o = out !== undefined ? q(out) : undefined;
  const p = ease(f, a, a + 7);
  const op = p * (o !== undefined ? 1 - ease(f, o, o + 6, "in") : 1);
  const s = 1 + 0.25 * (1 - p);
  return (
    <div style={{ position: "absolute", left: x, top: y, opacity: op, transform: `rotate(${rot + (1 - p) * 6}deg) scale(${s})`, transformOrigin: "0% 50%", filter: "drop-shadow(0 10px 18px rgba(0,0,0,0.45))" }}>
      <div style={{ background: dark ? "#141210" : PAPER, clipPath: torn(seed + (title ?? mono ?? "")), padding: mono ? "16px 30px" : "26px 34px 22px", backgroundImage: dark ? undefined : "radial-gradient(rgba(120,90,40,0.10) 1px, transparent 1px)", backgroundSize: "6px 6px" }}>
        {mono && (DEV.test(mono) ? <div style={{ fontFamily: "Mukta", fontWeight: 700, fontSize: size * 0.5, color: dark ? CREAM : INK, whiteSpace: "nowrap", lineHeight: 1.25 }}>{mono}</div> : <div style={{ fontFamily: TYPE, fontSize: size * 0.42, color: dark ? CREAM : INK, letterSpacing: 4, whiteSpace: "nowrap" }}>{mono}</div>)}
        {title && (DEV.test(title) ? (
          <div style={{ fontFamily: "TiroSanskrit", fontSize: size * 0.82, color: "#5a1a10", lineHeight: 1.35, maxWidth: 900, whiteSpace: "pre-line" }}>
            {title} {red && <span style={{ color: RED }}>{red}</span>}
          </div>
        ) : (
          <div style={{ fontFamily: DISPLAY, fontSize: size, color: INK, textTransform: "uppercase", lineHeight: 1, whiteSpace: "nowrap" }}>
            {title} {red && <span style={{ color: RED }}>{red}</span>}
          </div>
        ))}
        {sub && (DEV.test(sub) ? <div style={{ fontFamily: "Mukta", fontWeight: 700, fontSize: size * 0.56, color: INK, marginTop: 6, maxWidth: 900, lineHeight: 1.3 }}>{sub}</div> : <div style={{ fontFamily: TYPE, fontSize: size * 0.34, color: INK, letterSpacing: 2, marginTop: 10, textTransform: "uppercase", whiteSpace: "nowrap" }}>{sub}</div>)}
        {refx && (DEV.test(refx) ? <div style={{ fontFamily: "Mukta", fontWeight: 500, fontSize: size * 0.4, color: "#7a6a52", marginTop: 4, whiteSpace: "nowrap" }}>{refx}</div> : <div style={{ fontFamily: TYPE, fontSize: size * 0.27, color: "#7a6a52", letterSpacing: 3, marginTop: 6, textTransform: "uppercase", whiteSpace: "nowrap" }}>{refx}</div>)}
      </div>
      <Sfx at={a} name="stamp" vol={0.35} />
    </div>
  );
};

/* ---------- light, dust, finish ---------- */
export const Rays: React.FC<{ at?: Cue; color?: string }> = ({ at, color = "255,206,120" }) => {
  const f = useCurrentFrame();
  const q = useQ();
  const a = at !== undefined ? q(at) : -LEAD;
  const o = ease(f, a, a + 20);
  return (
    <AbsoluteFill style={{ opacity: o * 0.9, mixBlendMode: "screen" }}>
      <div style={{ position: "absolute", left: -540, top: -700, width: 2160, height: 2160, background: `conic-gradient(from ${170 + Math.sin(f / 40) * 6}deg at 50% 35%, rgba(${color},0) 0deg, rgba(${color},0.22) 8deg, rgba(${color},0) 16deg, rgba(${color},0.16) 26deg, rgba(${color},0) 34deg, rgba(${color},0.2) 46deg, rgba(${color},0) 56deg)` }} />
      <div style={{ position: "absolute", left: 140, top: 400, width: 800, height: 800, borderRadius: "50%", background: `radial-gradient(circle, rgba(${color},0.35), rgba(${color},0) 65%)` }} />
    </AbsoluteFill>
  );
};
export const Dust: React.FC<{ n?: number; seed?: string; color?: string }> = ({ n = 26, seed = "d", color = "255,230,180" }) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      {Array.from({ length: n }).map((_, i) => {
        const r = (k: string) => random(seed + i + k);
        const x = (r("x") * 1080 + f * (0.3 + r("v") * 0.8)) % 1080;
        const y = (r("y") * 1920 - f * (0.4 + r("u") * 0.9) + 1920 * 3) % 1920;
        const s = 3 + r("s") * 6;
        return <div key={i} style={{ position: "absolute", left: x, top: y, width: s, height: s, borderRadius: "50%", background: `rgba(${color},${0.25 + r("o") * 0.5})`, filter: "blur(1px)" }} />;
      })}
    </AbsoluteFill>
  );
};
export const Finish: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse 75% 60% at 50% 48%, rgba(0,0,0,0) 55%, rgba(10,6,2,0.55) 100%)" }} />
      <AbsoluteFill style={{ opacity: 0.09, mixBlendMode: "overlay", backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='300' height='300'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' seed='${f % 7}'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>")` }} />
    </AbsoluteFill>
  );
};
export const TopShade: React.FC<{ h?: number; a?: number }> = ({ h = 760, a = 0.55 }) => (
  <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: h, background: `linear-gradient(rgba(8,5,2,${a}), rgba(8,5,2,0))` }} />
);
export const SeriesTag: React.FC<{ n?: string }> = ({ n = "01" }) => (
  <div style={{ position: "absolute", right: 46, top: 120, transform: "rotate(1.5deg)", filter: "drop-shadow(0 6px 10px rgba(0,0,0,0.5))" }}>
    <div style={{ background: "#141210", clipPath: torn("series"), padding: "12px 26px", fontFamily: TYPE, fontSize: 30, color: CREAM, letterSpacing: 4, whiteSpace: "nowrap" }}>
      GITA SHLOK SERIES · STORY <span style={{ color: RED }}>{n}</span>
    </div>
  </div>
);

/* ---------- scenes ---------- */
const BG = "img/story/s-kurukshetra.jpg";
const IMG = (n: string) => `img/story/${n}-cut.png`;

const S1: React.FC<{ dur: number }> = ({ dur }) => (
  <>
    <Paint src={BG} dur={dur} from={{ s: 1.3, y: -40 }} to={{ s: 1.42, y: -10 }} blur={2} dark={0.12} />
    <TopShade />
    <Dust />
    <Cut src={IMG("s-chariot")} x={560} bottom={1700} h={1000} from="none" zoom={0.06} />
    <Title lines={[{ t: "HE DROPPED" }, { t: "HIS BOW.", c: GOLD }]} at={0} size={170} />
    <Label mono="अर्जुन · सबसे बड़ा धनुर्धर" at="धनुर्धर" x={90} y={1090} rot={-3} />
  </>
);

const S2: React.FC<{ dur: number }> = ({ dur }) => (
  <>
    <Paint src={BG} dur={dur} from={{ s: 1.04, y: 30 }} to={{ s: 1.12, y: 0 }} />
    <Dust />
    <Title lines={[{ t: "KURUKSHETRA" }]} at={0} out="अर्जुन-6" size={170} top={260} ink />
    <Label title="TWO ARMIES." sub="ONE FAMILY ON BOTH SIDES" at="सेनाएँ" out="अर्जुन-6" x={80} y={470} rot={-2} size={84} seed="a" />
    <Title lines={[{ t: "“TAKE ME TO" }, { t: "THE MIDDLE.”", c: RED }]} at="अर्जुन-2" size={140} top={260} ink />
    <Cut src={IMG("s-chariot")} x={560} bottom={1330} h={420} at="अर्जुन-4" from="none" drive={{ from: -380, at: "अर्जुन", len: 70 }} zoom={0} />
    <Label title="सेनयोरुभयोर्मध्ये रथं स्थापय मेऽच्युत" sub="“मेरा रथ दोनों सेनाओं के बीच ले चलो”" refx="भगवद् गीता 1.21" at="बीच" x={50} y={1440} rot={1.5} size={70} seed="b" />
  </>
);

const S3: React.FC<{ dur: number }> = ({ dur }) => (
  <>
    <Paint src={BG} dur={dur} from={{ s: 2.1, x: -330, y: -120 }} to={{ s: 2.2, x: -360, y: -120 }} dark={0.3} blur={4} />
    <TopShade h={900} a={0.6} />
    <Dust />
    <Cut src={IMG("s-bhishma-drona")} x={540} bottom={1800} h={1180} from="up" />
    <Title lines={[{ t: "AND ACROSS" }, { t: "THE FIELD…" }]} at={0} out="भाई-4" size={150} />
    <Title lines={[{ t: "HIS OWN" }, { t: "FAMILY.", c: RED }]} at="भाई-2" size={170} />
    <Label mono="दादा भीष्म" at="भीष्म" x={60} y={1250} rot={-3} seed="c" />
    <Label mono="गुरु द्रोण" at="द्रोण" x={600} y={1340} rot={2.5} seed="d" />
    <Label mono="भगवद् गीता 1.26" at="दोस्त" x={360} y={1730} rot={-1} size={70} dark seed="e" />
  </>
);

const S4: React.FC<{ dur: number }> = ({ dur }) => (
  <>
    <Paint src={BG} dur={dur} from={{ s: 2.5, y: 240 }} to={{ s: 2.7, y: 240 }} dark={0.45} blur={6} tint="rgba(255,150,130,1)" />
    <TopShade h={900} a={0.6} />
    <Cut src={IMG("s-arjun-shake")} x={540} bottom={1960} h={1360} from="none" tremble={2.2} shake={["काँपने", "काँपने+30"]} zoom={0.08} />
    <Title lines={[{ t: "HIS BODY" }, { t: "TREMBLED.", c: RED }]} at={0} out="गाण्डीव-6" size={170} />
    <Title lines={[{ t: "AND THE BOW" }, { t: "SLIPPED.", c: GOLD }]} at="गाण्डीव-2" size={160} />
    <Cut src={IMG("s-gandiva")} x={650} bottom={1460} h={780} at="गाण्डीव-4" from="right" fall={{ at: "फिसलने", len: 24, deg: 34, dy: 520 }} zoom={0} glow="rgba(255,200,90,0.7)" />
    <Label title="गाण्डीवं स्रंसते हस्तात्" sub="गाण्डीव हाथ से फिसलने लगता है" refx="भगवद् गीता 1.30" at="गाण्डीव+2" x={50} y={1480} rot={-2.5} size={80} seed="f" />
    <Sfx at={-2} name="bass" vol={0.5} />
  </>
);

export const S5: React.FC<{ dur: number }> = ({ dur }) => (
  <>
    <Paint src="img/story/s-arjun-sit.jpg" dur={dur} from={{ s: 1.08, y: 20 }} to={{ s: 1.18, y: -10 }} dark={0.12} />
    <TopShade h={900} a={0.7} />
    <Title lines={[{ t: "HE SAT" }, { t: "DOWN.", c: GOLD }]} at={0} size={180} />
    <Label title="विसृज्य सशरं चापं" sub="धनुष छोड़कर, रथ में बैठ गए" refx="भगवद् गीता 1.47" at="बैठ" x={60} y={1480} rot={-2} size={78} seed="g" />
  </>
);

export const S6: React.FC<{ dur: number }> = ({ dur }) => (
  <>
    <Paint src={BG} dur={dur} from={{ s: 2.2, y: 160 }} to={{ s: 2.35, y: 160 }} dark={0.3} blur={6} tint="rgba(255,214,150,1)" />
    <Rays />
    <TopShade h={900} a={0.55} />
    <Dust color="255,214,140" n={34} />
    <Cut src={IMG("s-krishna-speak")} x={540} bottom={1960} h={1400} from="up" glow="rgba(255,206,120,0.35)" />
    <Title lines={[{ t: "THEN KRISHNA" }, { t: "SPOKE.", c: GOLD }]} at={0} out="ये-4" size={150} />
    <Label title="क्लैब्यं मा स्म गमः पार्थ" sub="ये कमज़ोरी छोड़ो, और उठो" refx="भगवद् गीता 2.3" at="क्लैब्यं" x={50} y={1480} rot={-1.5} size={82} seed="h" />
    <Title lines={[{ t: "“STAND UP," }, { t: "PARTH.”", c: GOLD }]} at="ये-2" size={180} />
  </>
);

export const S7: React.FC<{ dur: number }> = ({ dur }) => (
  <>
    <Paint src="img/story/s-arjun-sit.jpg" dur={dur} from={{ s: 1.2, x: -30, y: -20 }} to={{ s: 1.3, x: -40, y: -30 }} dark={0.25} out="तब-4" />
    <Paint src={BG} dur={dur} from={{ s: 2.2, y: 160 }} to={{ s: 2.3, y: 160 }} dark={0.25} blur={6} tint="rgba(255,214,150,1)" at="तब-4" />
    <Rays at="तब-2" />
    <TopShade h={900} a={0.55} />
    <Dust color="255,214,140" n={40} />
    <Cut src={IMG("s-krishna-smile")} x={540} bottom={1960} h={1400} at="तब-4" from="none" glow="rgba(255,206,120,0.45)" />
    <Title lines={[{ t: "“I WILL" }, { t: "NOT FIGHT.”", c: RED }]} at={0} out="तब-6" size={170} />
    <Label title="न योत्स्य इति" sub="मैं नहीं लड़ूँगा" refx="भगवद् गीता 2.9" at="नहीं" out="तब-6" x={60} y={1480} rot={-2} size={82} seed="i" />
    <Title lines={[{ t: "KRISHNA" }, { t: "SMILED.", c: GOLD }]} at="तब-2" out="यहीं-6" size={170} />
    <Label title="प्रहसन्निव" sub="कृष्ण मुस्कुराए" refx="भगवद् गीता 2.10" at="मुस्कुराए" x={60} y={1500} rot={-2} size={86} seed="j" />
    <Title lines={[{ t: "AND THE GITA" }, { t: "BEGAN.", c: GOLD }]} at="यहीं-2" size={160} />
    <Sfx at={q7("तब") - 14} name="riser" vol={0.35} />
    <Sfx at={q7("यहीं")} name="ding" vol={0.45} />
  </>
);
const q7 = (w: string) => TL.cue("s7", w);

export const S8: React.FC<{ dur: number }> = ({ dur }) => (
  <>
    <Paint src={BG} dur={dur} from={{ s: 1.5, y: -60 }} to={{ s: 1.62, y: -40 }} dark={0.1} blur={3} />
    <Rays color="255,190,110" />
    <TopShade h={900} a={0.55} />
    <Dust color="255,214,140" n={34} />
    <Cut src={IMG("s-arjun-rise")} x={540} bottom={1880} h={1350} from="up" glow="rgba(255,190,100,0.35)" />
    <Title lines={[{ t: "AT THE END" }, { t: "OF THE GITA…", c: GOLD }]} at={0} out="नष्टो-4" size={150} />
    <Title lines={[{ t: "“MY DOUBT" }, { t: "IS GONE.”", c: GOLD }]} at="नष्टो-2" size={170} />
    <Label title="नष्टो मोहः" sub="मेरा भ्रम मिट गया" refx="भगवद् गीता 18.73" at="नष्टो" x={60} y={1500} rot={-2} size={92} seed="k" />
  </>
);

const S9: React.FC<{ dur: number }> = ({ dur }) => (
  <>
    <Paint src={BG} dur={dur} from={{ s: 1.15, y: 0 }} to={{ s: 1.25, y: -20 }} dark={0.35} blur={2} />
    <TopShade h={1100} a={0.6} />
    <Dust />
    <Cut src={IMG("s-chariot")} x={560} bottom={1820} h={640} from="none" />
    <Label title="SEND THIS" red="TO A FRIEND" sub="WHO IS LOSING HOPE TODAY" at={2} x={60} y={330} rot={-2} size={96} seed="m" />
    <Label title="COMMENT ·" red="DID YOU KNOW?" at="कमेंट" x={90} y={600} rot={1.5} size={78} seed="n" />
    <Label title="NEXT STORY ·" red="THE FIRST VERSE" sub="WHO SPOKE IT?" at="अगली" x={50} y={820} rot={-1.5} size={80} seed="o" />
    <Label title="FOLLOW" red="@GITA.SHLOK.SERIES" at="फॉलो" x={70} y={1070} rot={2} size={74} seed="p" />
  </>
);

const SCENES: Record<string, React.FC<{ dur: number }>> = { s1: S1, s2: S2, s3: S3, s4: S4, s5: S5, s6: S6, s7: S7, s8: S8, s9: S9 };

export const STORY01_FRAMES = TL.totalFrames;

export const Story01: React.FC = () => (
  <AbsoluteFill style={{ background: "#0b0805" }}>
    {timing.scenes.map((s, i) => {
      const { from, dur } = TL.sceneFrames(s.id);
      const lead = i === 0 ? 0 : LEAD;
      const Scene = SCENES[s.id];
      return (
        <Sequence key={s.id} from={from - lead} durationInFrames={dur + lead + (i === timing.scenes.length - 1 ? 0 : 4)} name={s.id}>
          <Fade lead={lead}>
            <Sequence from={lead} layout="none">
              <SceneId.Provider value={s.id}>
                <Scene dur={dur} />
              </SceneId.Provider>
            </Sequence>
          </Fade>
        </Sequence>
      );
    })}
    {timing.scenes.map((s) =>
      s.audio ? (
        <Sequence key={`a${s.id}`} from={TL.sceneFrames(s.id).from} durationInFrames={TL.sceneFrames(s.id).dur + 6} layout="none">
          <Audio src={staticFile(s.audio)} />
        </Sequence>
      ) : null,
    )}
    <SeriesTag />
    <Finish />
  </AbsoluteFill>
);
const Fade: React.FC<{ lead: number; children: React.ReactNode }> = ({ lead, children }) => {
  const f = useCurrentFrame();
  const o = lead > 0 ? ease(f, 0, lead) : 1;
  const s = lead > 0 ? 1.04 - 0.04 * ease(f, 0, lead + 6) : 1;
  return <AbsoluteFill style={{ opacity: o, transform: `scale(${s})` }}>{children}</AbsoluteFill>;
};

export const Story01Cover: React.FC = () => (
  <AbsoluteFill style={{ background: "#0b0805" }}>
    <SceneId.Provider value="s1">
      <Sequence from={-40} layout="none">
        <S1 dur={160} />
      </Sequence>
    </SceneId.Provider>
    <SeriesTag />
    <Finish />
  </AbsoluteFill>
);
