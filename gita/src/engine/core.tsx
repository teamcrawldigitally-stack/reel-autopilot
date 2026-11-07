import React, { createContext, useContext } from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { clamp, deva, ease, num, sanskrit, useSpring } from "../components/kit";
import { useV2 } from "./cine";
import { G, theme } from "../theme";
import { createTimeline } from "../lib/timeline";
import type { Cue, Row, Tone } from "./types";

type TL = ReturnType<typeof createTimeline>;
type Ctx = { id: string; T: TL; dur: number };
export const SceneCtx = createContext<Ctx | null>(null);

/** Resolve a cue ("शब्द#2+6", "start", "end-10", 42) to a frame relative to the scene. */
export const resolveCue = (ctx: Ctx, c: Cue | undefined, fallback = 0): number => {
  if (c === undefined || c === null) return fallback;
  if (typeof c === "number") return c;
  const m = c.match(/^(.+?)(?:#(\d+))?([+-]\d+)?$/);
  if (!m) throw new Error(`bad cue ${c}`);
  const key = m[1];
  const nth = m[2] ? Number(m[2]) : 1;
  const off = m[3] ? Number(m[3]) : 0;
  if (key === "start") return off;
  if (key === "end") return ctx.dur + off;
  return ctx.T.cue(ctx.id, key, nth, off);
};

export const useCue = () => {
  const ctx = useContext(SceneCtx);
  if (!ctx) throw new Error("no scene context");
  return (c: Cue | undefined, fallback = 0) => resolveCue(ctx, c, fallback);
};
export const useScene = () => {
  const ctx = useContext(SceneCtx);
  if (!ctx) throw new Error("no scene context");
  return ctx;
};

export const BLUE = "#8FC8FF";
export const toneColor = (t?: Tone | string) =>
  t === "blue" ? BLUE : t === "red" ? G.red : t === "green" ? G.green : t === "saffron" ? G.saffron : t === "cream" ? G.cream : t && t.startsWith("#") ? t : G.gold;
export const toneGlow = (t?: Tone | string, a = 0.45) =>
  t === "red" ? `rgba(255,60,70,${a})` : t === "green" ? `rgba(43,212,107,${a})` : t === "saffron" ? `rgba(255,154,60,${a})` : t === "blue" ? `rgba(90,140,255,${a})` : t === "cream" ? `rgba(255,244,223,${a})` : `rgba(242,184,75,${a})`;

/* ---------- rich text ---------- */

type Seg = { k: string; t: string };
const RX = /\{([gscdrGnxREb]):([^}]*)\}/g;
export const parseRich = (s: string): Seg[] => {
  const out: Seg[] = [];
  let last = 0;
  for (const m of s.matchAll(RX)) {
    if (m.index! > last) out.push({ k: "p", t: s.slice(last, m.index) });
    out.push({ k: m[1], t: m[2] });
    last = m.index! + m[0].length;
  }
  if (last < s.length) out.push({ k: "p", t: s.slice(last) });
  return out;
};

export const rowObj = (r: Row) => (typeof r === "string" ? { t: r } : r);

/** One line of rich text. `strike` 0..1 draws the red line over {x:..} parts. */
export const RichLine: React.FC<{ text: string; size: number; color?: string; weight?: number; strike?: number; align?: "center" | "left"; shadow?: boolean; anim?: number }> = ({
  text,
  size,
  color = G.cream,
  weight = 800,
  strike = 0,
  align = "center",
  shadow = true,
  anim,
}) => {
  const f = useCurrentFrame();
  const segs0 = parseRich(text);
  const base: React.CSSProperties = { ...deva(size, color, weight), display: "inline" };
  // v2: words come in one by one (each word = its own unit; pills / numbers are one unit)
  let k = 0;
  const wrap = (node: React.ReactNode, key: string | number) => {
    if (anim === undefined) return node;
    const a = anim + k++ * 2.5;
    const q = ease(f, a, a + 9);
    return (
      <span key={key} style={{ display: "inline-block", opacity: q, transform: `translateY(${(1 - q) * 26}px) scale(${0.85 + 0.15 * q})`, filter: q < 1 ? `blur(${(1 - q) * 6}px)` : undefined }}>
        {node}
      </span>
    );
  };
  const segs: Seg[] = [];
  for (const sg of segs0) {
    if (anim !== undefined && "pgscdRbE".includes(sg.k)) {
      sg.t.split(/(\s+)/).forEach((w) => w && segs.push({ k: /^\s+$/.test(w) ? "sp" : sg.k, t: w }));
    } else segs.push(sg);
  }
  return (
    <div style={{ textAlign: align, whiteSpace: "nowrap", textShadow: shadow ? "0 6px 30px rgba(0,0,0,0.85)" : undefined, lineHeight: 1.22 }}>
      {segs.map((s, i) => {
        if (s.k === "sp") return <span key={i} style={base}>{s.t}</span>;
        return wrap(segNode(s, i), i);
      })}
    </div>
  );
  function segNode(s: Seg, i: number): React.ReactNode {
      {
        if (s.k === "p") return <span key={i} style={base}>{s.t}</span>;
        if (s.k === "g") return <span key={i} style={{ ...base, color: G.gold }}>{s.t}</span>;
        if (s.k === "s") return <span key={i} style={{ ...base, color: G.saffron }}>{s.t}</span>;
        if (s.k === "c") return <span key={i} style={{ ...base, color: G.cream }}>{s.t}</span>;
        if (s.k === "d") return <span key={i} style={{ ...base, color: G.dim, fontWeight: 700 }}>{s.t}</span>;
        if (s.k === "R") return <span key={i} style={{ ...base, color: G.red }}>{s.t}</span>;
        if (s.k === "E") return <span key={i} style={{ ...base, color: G.green }}>{s.t}</span>;
        if (s.k === "b") return <span key={i} style={{ ...base, color: BLUE }}>{s.t}</span>;
        if (s.k === "n")
          return (
            <span key={i} style={{ ...num(size * 1.32, G.gold), display: "inline-block", padding: "0 0.06em", textShadow: "0 0 50px rgba(242,184,75,0.55)", verticalAlign: "baseline" }}>
              {s.t}
            </span>
          );
        if (s.k === "r" || s.k === "G")
          return (
            <span
              key={i}
              style={{
                ...deva(size * 0.92, s.k === "r" ? G.white : G.ink, 800),
                display: "inline-block",
                background: s.k === "r" ? G.red : G.green,
                borderRadius: size * 0.22,
                padding: `0 ${size * 0.26}px`,
                margin: "0 0.08em",
                textShadow: "none",
                boxShadow: `0 0 ${size * 0.7}px ${s.k === "r" ? "rgba(255,90,95,0.45)" : "rgba(43,212,107,0.45)"}`,
                transform: "rotate(-2deg)",
              }}
            >
              {s.t}
            </span>
          );
        if (s.k === "x")
          return (
            <span key={i} style={{ ...base, position: "relative", display: "inline-block", opacity: 1 - 0.35 * strike }}>
              {s.t}
              <span style={{ position: "absolute", left: -4, top: "52%", height: Math.max(5, size * 0.08), width: `calc(${100 * strike}% + 8px)`, background: G.red, borderRadius: 4 }} />
            </span>
          );
        return null;
      }
  }
};

/** A row that may come in late (`at`) and be struck out later (`strike`). */
export const RowView: React.FC<{ row: Row; size: number; align?: "center" | "left"; baseAt?: number }> = ({ row, size, align, baseAt }) => {
  const f = useCurrentFrame();
  const c = useCue();
  const v2 = useV2();
  const r = rowObj(row);
  const at = r.at !== undefined ? c(r.at) : -100;
  const appear = r.at !== undefined ? at : baseAt ?? -100;
  const anim = v2 && appear > 0 ? appear - 2 : undefined;
  const p = useSpring(at - 3, "snappy");
  const st = r.strike !== undefined ? c(r.strike) : 1e9;
  const strike = interpolate(f, [st, st + 10], [0, 1], clamp);
  return (
    <div style={{ opacity: interpolate(p, [0, 0.4], [0, 1], clamp), transform: `translateY(${(1 - p) * 30}px) scale(${0.92 + 0.08 * p})` }}>
      <RichLine text={r.t} size={r.size ?? size} color={r.color} weight={r.weight} strike={strike} align={align} anim={anim} />
    </div>
  );
};

export const SaLine: React.FC<{ text: string; size?: number; color?: string }> = ({ text, size = 70, color = G.gold }) => (
  <div style={{ ...sanskrit(size, color), textAlign: "center", textShadow: "0 0 40px rgba(242,184,75,0.4), 0 6px 30px rgba(0,0,0,0.9)" }}>{text}</div>
);

export const Pill: React.FC<{ text: string; tone?: Tone; size?: number }> = ({ text, tone = "gold", size = 44 }) => (
  <div style={{ display: "inline-flex", background: toneColor(tone), borderRadius: 999, padding: `4px ${size * 0.6}px 0`, boxShadow: `0 0 40px ${toneGlow(tone, 0.4)}` }}>
    <div style={{ ...deva(size, tone === "red" ? G.white : G.ink, 800) }}>{text}</div>
  </div>
);

export const graphemes = (s: string): string[] => {
  const Seg = (Intl as unknown as { Segmenter?: new (l: string, o: { granularity: string }) => { segment: (s: string) => Iterable<{ segment: string }> } }).Segmenter;
  if (Seg) return Array.from(new Seg("hi", { granularity: "grapheme" }).segment(s), (x) => x.segment);
  return Array.from(s);
};

export const fonts = theme.fonts;
