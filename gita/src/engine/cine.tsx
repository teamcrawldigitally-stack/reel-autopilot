// "v2" cinematic look (from EP 16): full scene backgrounds with a slow camera, light rays,
// bokeh and embers, light-leak transitions, warm grade. Episodes opt in with "style": "v2".
import React, { createContext, useContext } from "react";
import { AbsoluteFill, Audio, Img, Sequence, interpolate, random, staticFile, useCurrentFrame } from "remotion";
import { clamp, ease } from "../components/kit";
import { theme } from "../theme";

export const StyleCtx = createContext<{ v2: boolean }>({ v2: false });
export const useV2 = () => useContext(StyleCtx).v2;

export type Mood = "gold" | "red" | "green" | "blue" | "saffron" | undefined;
const moodRGB = (m: Mood) => (m === "red" ? "255,70,60" : m === "green" ? "60,220,140" : m === "blue" ? "120,170,255" : m === "saffron" ? "255,150,60" : "255,196,96");

/** Full-bleed scene picture, dimmed and softly blurred, slowly pushing in and drifting (Ken Burns). */
export const Backdrop: React.FC<{ src: string; dur: number; lead?: number; pan?: number; dim?: number; blur?: number; mood?: Mood; seed?: string }> = ({ src, dur, lead = 10, pan, dim = 0.5, blur = 3, mood, seed = "b" }) => {
  const f = useCurrentFrame();
  const total = dur + lead;
  const t = interpolate(f, [0, total], [0, 1], clamp);
  const dir = pan ?? (random(seed) > 0.5 ? 1 : -1);
  const scale = 1.12 + 0.1 * t;
  const tx = dir * (-30 + 60 * t);
  const ty = -20 + 30 * t;
  const fadeIn = lead > 0 ? interpolate(f, [0, lead], [0, 1], clamp) : 1;
  const zoomIn = lead > 0 ? 1 + 0.08 * (1 - ease(f, 0, lead + 10)) : 1;
  return (
    <AbsoluteFill style={{ opacity: fadeIn, overflow: "hidden" }}>
      <Img
        src={staticFile(src.replace(/\.jpg$/, "-soft.jpg"))}
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          width: 1080,
          height: 1920,
          objectFit: "cover",
          transform: `translate(-50%, -50%) translate(${tx}px, ${ty}px) scale(${scale * zoomIn})`,
          // blur + dim are baked into the -soft.jpg copy (fast to render)
        }}
      />
      {/* tint to the mood + readable top / bottom */}
      <AbsoluteFill style={{ background: `radial-gradient(ellipse 80% 60% at 50% 55%, rgba(${moodRGB(mood)},0.10), transparent 70%)` }} />
      <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(5,6,18,0.82) 0%, rgba(5,6,18,0.35) 26%, rgba(5,6,18,0.05) 50%, rgba(5,6,18,0.45) 78%, rgba(5,6,18,0.9) 100%)" }} />
    </AbsoluteFill>
  );
};

/** Soft god rays from the top, slowly swaying. */
export const LightRays: React.FC<{ mood?: Mood; o?: number }> = ({ mood, o = 1 }) => {
  const f = useCurrentFrame();
  const sway = Math.sin(f / 70) * 6;
  const rgb = moodRGB(mood);
  return (
    <AbsoluteFill style={{ pointerEvents: "none", mixBlendMode: "screen", opacity: 0.55 * o }}>
      <div
        style={{
          position: "absolute",
          left: -400,
          top: -500,
          width: 1900,
          height: 2400,
          transformOrigin: "50% 0%",
          transform: `rotate(${sway}deg)`,
          background: `repeating-conic-gradient(from 160deg at 50% 0%, rgba(${rgb},0.0) 0deg, rgba(${rgb},0.05) 1.5deg, rgba(${rgb},0.12) 3.5deg, rgba(${rgb},0.05) 5.5deg, rgba(${rgb},0.0) 7deg, rgba(${rgb},0.0) 11deg)`,
          WebkitMaskImage: "linear-gradient(180deg, black 0%, black 25%, transparent 70%)",
          maskImage: "linear-gradient(180deg, black 0%, black 25%, transparent 70%)",
        }}
      />
    </AbsoluteFill>
  );
};

/** Big soft bokeh discs + small embers rising. */
export const Atmos: React.FC<{ mood?: Mood; n?: number; embers?: number; seed?: string }> = ({ mood, n = 14, embers = 26, seed = "a" }) => {
  const f = useCurrentFrame();
  const rgb = moodRGB(mood);
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      {Array.from({ length: n }).map((_, i) => {
        const x = random(`${seed}bx${i}`) * 1080;
        const y0 = random(`${seed}by${i}`) * 1920;
        const r = 40 + random(`${seed}br${i}`) * 110;
        const y = ((y0 - f * (0.3 + random(`${seed}bs${i}`) * 0.6)) % 2100 + 2100) % 2100 - 100;
        const tw = 0.25 + 0.35 * Math.abs(Math.sin(f / 40 + i));
        return <div key={`b${i}`} style={{ position: "absolute", left: x + Math.sin(f / 60 + i) * 30, top: y, width: r, height: r, borderRadius: "50%", background: `radial-gradient(circle, rgba(${rgb},${0.22 * tw}), rgba(${rgb},0) 70%)` }} />;
      })}
      {Array.from({ length: embers }).map((_, i) => {
        const x = random(`${seed}ex${i}`) * 1080;
        const sp = 1.2 + random(`${seed}es${i}`) * 2.4;
        const y = 1960 - (((random(`${seed}ey${i}`) * 2000 + f * sp) % 2000));
        const s = 3 + random(`${seed}ez${i}`) * 4;
        const fl = 0.4 + 0.6 * Math.abs(Math.sin(f / 5 + i * 3));
        return <div key={`e${i}`} style={{ position: "absolute", left: x + Math.sin(f / 18 + i) * 24, top: y, width: s, height: s, borderRadius: "50%", background: `rgb(${rgb})`, opacity: 0.8 * fl, boxShadow: `0 0 ${s * 3}px rgba(${rgb},0.9)` }} />;
      })}
    </AbsoluteFill>
  );
};

/** Warm light-leak flash on a cut (replaces the hard swipe). */
const Leak: React.FC<{ dir: number }> = ({ dir }) => {
  const f = useCurrentFrame();
  const p = interpolate(f, [0, 7, 18], [0, 1, 0], clamp);
  const x = interpolate(f, [0, 18], [dir > 0 ? -200 : 1280, dir > 0 ? 1280 : -200], clamp);
  return (
    <AbsoluteFill style={{ pointerEvents: "none", mixBlendMode: "screen" }}>
      <div style={{ position: "absolute", left: x - 700, top: 300, width: 1400, height: 1400, borderRadius: "50%", background: "radial-gradient(circle, rgba(255,214,140,0.95), rgba(255,140,50,0.55) 35%, rgba(255,90,30,0) 70%)", opacity: p, filter: "blur(30px)" }} />
      <AbsoluteFill style={{ background: "rgba(255,226,170,1)", opacity: 0.35 * p }} />
    </AbsoluteFill>
  );
};
export const Leaks: React.FC<{ at: number[] }> = ({ at }) => (
  <>
    {at.map((b, i) => (
      <Sequence key={i} from={Math.max(0, b - 8)} durationInFrames={20} layout="none">
        <Leak dir={i % 2 === 0 ? 1 : -1} />
        <Audio src={staticFile("sfx/whoosh.wav")} volume={0.35 * theme.audio.sfxGain} />
      </Sequence>
    ))}
  </>
);

/** Camera on the picture layer: slow push for the whole scene + a short punch-in at each beat. */
export const Camera: React.FC<{ dur: number; punches: number[]; children: React.ReactNode; strength?: number }> = ({ dur, punches, children, strength = 1 }) => {
  const f = useCurrentFrame();
  const t = interpolate(f, [0, dur], [0, 1], clamp);
  let punch = 0;
  for (const a of punches) {
    if (a <= 2) continue;
    const k = f - a;
    if (k >= -2 && k < 26) punch = Math.max(punch, Math.sin(Math.PI * Math.min(1, (k + 2) / 10)) * (k < 8 ? 1 : Math.max(0, 1 - (k - 8) / 18)));
  }
  const s = 1 + strength * (0.07 * t + 0.035 * punch);
  const y = strength * (-24 * t);
  return <AbsoluteFill style={{ transform: `translateY(${y}px) scale(${s})`, transformOrigin: "50% 62%" }}>{children}</AbsoluteFill>;
};

/** Final grade for v2: warm gold soft-light, teal shadows, grain, vignette, slight bloom. */
const NOISE =
  "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='220' height='220'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23n)' opacity='0.9'/></svg>\")";
export const CineFinish: React.FC = () => {
  const f = useCurrentFrame();
  const breathe = 0.5 + 0.5 * Math.sin(f / 50);
  return (
    <>
      <AbsoluteFill style={{ pointerEvents: "none", background: "linear-gradient(180deg, rgba(255,190,90,0.10), rgba(255,140,60,0.06) 50%, rgba(40,90,140,0.10))", mixBlendMode: "soft-light" }} />
      <AbsoluteFill style={{ pointerEvents: "none", background: `radial-gradient(ellipse 70% 45% at 50% 40%, rgba(255,210,140,${0.05 + 0.03 * breathe}), transparent 70%)`, mixBlendMode: "screen" }} />
      <AbsoluteFill style={{ pointerEvents: "none", backgroundImage: NOISE, backgroundSize: "220px", backgroundPosition: `${(f * 7) % 220}px ${(f * 13) % 220}px`, opacity: 0.09, mixBlendMode: "overlay" }} />
      <AbsoluteFill style={{ pointerEvents: "none", background: "radial-gradient(ellipse at center, transparent 50%, rgba(2,2,8,0.7) 100%)" }} />
    </>
  );
};
