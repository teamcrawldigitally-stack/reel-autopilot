import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { Sfx, clamp, deva, ease, glass, num, useSpring } from "../components/kit";
import { G } from "../theme";
import { RichLine, toneColor, toneGlow, useCue } from "./core";
import type { Cue, Tone, Widget } from "./types";

/* Every widget: { type, top?, at?, out? } plus its own fields. "at"/"out" = when the whole thing shows. */

const useShow = (w: Widget, firstAt: number) => {
  const f = useCurrentFrame();
  const c = useCue();
  const at = w.at !== undefined ? c(w.at as Cue) : firstAt;
  const out = w.out !== undefined ? c(w.out as Cue) : 1e9;
  const p = ease(f, at - 6, at + 8);
  const o = 1 - ease(f, out - 4, out + 6, "in");
  return { p, o, at, out, f, c };
};

/* ---------- dots: N little dots, groups light up at cues (e.g. 1 of 700 shlokas) ---------- */
type DotsW = Widget & {
  total: number;
  cols: number;
  top?: number;
  size?: number;
  groups: { n: number; at: Cue; tone?: Tone; label?: string }[];
  counter?: { label: string; total?: string }; // "श्लोक" → "श्लोक 1 / 700"
};
const Dots: React.FC<{ w: DotsW }> = ({ w }) => {
  const c = useCue();
  const groupAt = w.groups.map((g) => c(g.at));
  const { p, o, f } = useShow(w, groupAt[0] - 14);
  const size = w.size ?? 18;
  const gap = Math.round(size * 0.42);
  const rows = Math.ceil(w.total / w.cols);
  const width = w.cols * (size + gap) - gap;
  const top = w.top ?? 1060;
  // which group each dot belongs to
  const owner: number[] = [];
  w.groups.forEach((g, gi) => {
    for (let k = 0; k < g.n; k++) owner.push(gi);
  });
  let lit = 0;
  w.groups.forEach((g, gi) => {
    if (f >= groupAt[gi]) lit = gi + 1;
  });
  const shown = w.groups.slice(0, lit).reduce((a, g) => a + g.n, 0);
  return (
    <div style={{ position: "absolute", left: 540 - width / 2, top, width, opacity: p * o, transform: `translateY(${(1 - p) * 30}px)` }}>
      {w.counter && (
        <div style={{ display: "flex", justifyContent: "center", alignItems: "baseline", gap: 14, marginBottom: 18 }}>
          <div style={deva(48, G.cream, 700)}>{w.counter.label}</div>
          <div style={{ ...num(76, G.gold), textShadow: "0 0 40px rgba(242,184,75,0.5)" }}>{Math.max(1, shown)}</div>
          <div style={num(46, G.dim)}>/ {w.counter.total ?? w.total}</div>
        </div>
      )}
      <div style={{ position: "relative", height: rows * (size + gap) - gap }}>
        {Array.from({ length: w.total }).map((_, i) => {
          const gi = owner[i];
          const on = gi !== undefined && gi < lit;
          const tone = gi !== undefined ? w.groups[gi].tone ?? "gold" : "gold";
          const pop = gi !== undefined ? Math.sin(Math.PI * ease(f, groupAt[gi] + Math.min(i - (owner.indexOf(gi)), 30) * 0.3, groupAt[gi] + 12 + Math.min(i - owner.indexOf(gi), 30) * 0.3)) : 0;
          const col = on ? toneColor(tone) : "rgba(255,244,223,0.2)";
          const s = size * (1 + 0.8 * pop);
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                left: (i % w.cols) * (size + gap) + (size - s) / 2,
                top: Math.floor(i / w.cols) * (size + gap) + (size - s) / 2,
                width: s,
                height: s,
                borderRadius: "50%",
                background: col,
                boxShadow: on ? `0 0 ${size * (w.groups[gi].n === 1 ? 2.2 : 0.7)}px ${toneGlow(tone, 0.9)}` : undefined,
              }}
            />
          );
        })}
      </div>
      {w.groups.map((g, gi) => {
        if (g.n !== 1 || f < groupAt[gi]) return null;
        const i = owner.indexOf(gi);
        const k = ((f - groupAt[gi]) % 36) / 36;
        return (
          <div key={`ring${gi}`} style={{ position: "absolute", left: (i % w.cols) * (size + gap) + size / 2 - 50, top: (w.counter ? 94 : 0) + Math.floor(i / w.cols) * (size + gap) + size / 2 - 50, width: 100, height: 100, borderRadius: "50%", border: `4px solid ${toneColor(g.tone)}`, opacity: 1 - k, transform: `scale(${0.3 + 0.9 * k})` }} />
        );
      })}
      <div style={{ display: "flex", justifyContent: "center", gap: 30, marginTop: 20, flexWrap: "wrap" }}>
        {w.groups.map((g, gi) =>
          g.label ? (
            <div key={gi} style={{ display: "flex", alignItems: "center", gap: 10, opacity: ease(f, groupAt[gi], groupAt[gi] + 8) }}>
              <div style={{ width: 22, height: 22, borderRadius: "50%", background: toneColor(g.tone) }} />
              <div style={deva(40, G.cream, 700)}>{g.label}</div>
            </div>
          ) : null,
        )}
      </div>
      {groupAt.map((a, gi) => (
        <Sfx key={gi} at={a - 2} name="tick" vol={0.4} />
      ))}
    </div>
  );
};

/* ---------- items: a list that builds up (numbered / tick / cross) ---------- */
type ItemsW = Widget & {
  top?: number;
  size?: number;
  width?: number;
  items: { at: Cue; text: string; sub?: string; tone?: Tone; mark?: "num" | "check" | "cross" | "none"; strike?: Cue }[];
};
const Items: React.FC<{ w: ItemsW }> = ({ w }) => {
  const c = useCue();
  const f = useCurrentFrame();
  const ats = w.items.map((it) => c(it.at));
  const { o } = useShow(w, ats[0]);
  const size = w.size ?? 60;
  const width = w.width ?? 860;
  return (
    <div style={{ position: "absolute", left: 540 - width / 2, top: w.top ?? 1000, width, display: "flex", flexDirection: "column", gap: 18, opacity: o }}>
      {w.items.map((it, i) => (
        <ItemRow key={i} it={it} i={i} at={ats[i]} size={size} f={f} c={c} />
      ))}
    </div>
  );
};
const ItemRow: React.FC<{ it: ItemsW["items"][number]; i: number; at: number; size: number; f: number; c: (x: Cue | undefined, d?: number) => number }> = ({ it, i, at, size, f, c }) => {
  const p = useSpring(at - 3, "snappy");
  const tone = it.tone ?? "gold";
  const col = toneColor(tone);
  const st = it.strike !== undefined ? c(it.strike) : 1e9;
  const strike = interpolate(f, [st, st + 10], [0, 1], clamp);
  const mark = it.mark ?? "num";
  return (
    <div style={{ ...glass, background: "rgba(7,8,24,0.72)", borderColor: toneGlow(tone, 0.55), display: "flex", alignItems: "center", gap: 26, padding: "14px 28px 10px", opacity: interpolate(p, [0, 0.4], [0, 1], clamp) * (1 - 0.45 * strike), transform: `translateX(${(1 - p) * 80}px)` }}>
      {mark !== "none" && (
        <div style={{ flex: `0 0 ${size * 1.25}px`, height: size * 1.25, borderRadius: "50%", background: col, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: `0 0 30px ${toneGlow(tone, 0.5)}` }}>
          {mark === "num" && <div style={num(size * 0.8, G.ink)}>{i + 1}</div>}
          {mark === "check" && (
            <svg width={size * 0.8} height={size * 0.8} viewBox="0 0 48 48">
              <path d="M10 25 L20 35 L38 14" fill="none" stroke={G.ink} strokeWidth={6} strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
          {mark === "cross" && (
            <svg width={size * 0.7} height={size * 0.7} viewBox="0 0 48 48">
              <path d="M12 12 L36 36 M36 12 L12 36" stroke={G.white} strokeWidth={7} strokeLinecap="round" />
            </svg>
          )}
        </div>
      )}
      <div style={{ position: "relative", display: "flex", flexDirection: "column" }}>
        <RichLine text={it.text} size={size} align="left" shadow={false} />
        {it.sub && <div style={deva(size * 0.6, G.dim, 700)}>{it.sub}</div>}
        {strike > 0 && <div style={{ position: "absolute", left: -6, top: "42%", height: 7, width: `${104 * strike}%`, background: G.red, borderRadius: 4 }} />}
      </div>
      <Sfx at={at - 3} name="pop" vol={0.4} />
    </div>
  );
};

/* ---------- count: a big number that counts up ---------- */
type CountW = Widget & { top?: number; at: Cue; to: number; from?: number; dur?: number; prefix?: string; suffix?: string; label?: string; sub?: string; tone?: Tone; size?: number; indian?: boolean };
const fmt = (v: number, indian?: boolean) => (indian ? v.toLocaleString("en-IN") : v.toLocaleString("en-US"));
const Count: React.FC<{ w: CountW }> = ({ w }) => {
  const c = useCue();
  const at = c(w.at);
  const { p, o, f } = useShow(w, at);
  const t = ease(f, at, at + (w.dur ?? 24));
  const v = Math.round((w.from ?? 0) + ((w.to - (w.from ?? 0)) * t));
  const size = w.size ?? 200;
  const col = toneColor(w.tone);
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top: w.top ?? 900, display: "flex", flexDirection: "column", alignItems: "center", opacity: p * o, transform: `scale(${0.85 + 0.15 * p})` }}>
      {w.label && <div style={deva(size * 0.3, G.cream, 700)}>{w.label}</div>}
      <div style={{ display: "flex", alignItems: "baseline", gap: 10 }}>
        {w.prefix && <div style={num(size * 0.55, col)}>{w.prefix}</div>}
        <div style={{ ...num(size, col), textShadow: `0 0 70px ${toneGlow(w.tone, 0.55)}` }}>{fmt(v, w.indian)}</div>
        {w.suffix && <div style={deva(size * 0.4, col, 800)}>{w.suffix}</div>}
      </div>
      {w.sub && <div style={deva(size * 0.24, G.dim, 700)}>{w.sub}</div>}
      <Sfx at={at - 2} name="riser" vol={0.3} />
      <Sfx at={at + (w.dur ?? 24)} name="ding" vol={0.4} />
    </div>
  );
};

/* ---------- bars: horizontal bars that grow ---------- */
type BarsW = Widget & { top?: number; max?: number; items: { at: Cue; label: string; value: number; show?: string; tone?: Tone }[]; width?: number };
const Bars: React.FC<{ w: BarsW }> = ({ w }) => {
  const c = useCue();
  const ats = w.items.map((it) => c(it.at));
  const { o, f } = useShow(w, ats[0]);
  const max = w.max ?? Math.max(...w.items.map((i) => i.value));
  const width = w.width ?? 900;
  return (
    <div style={{ position: "absolute", left: 540 - width / 2, top: w.top ?? 1000, width, display: "flex", flexDirection: "column", gap: 22, opacity: o }}>
      {w.items.map((it, i) => {
        const p = ease(f, ats[i] - 2, ats[i] + 18);
        const col = toneColor(it.tone);
        return (
          <div key={i} style={{ opacity: ease(f, ats[i] - 6, ats[i] + 2) }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
              <div style={deva(46, G.cream, 700)}>{it.label}</div>
              <div style={num(52, col)}>{it.show ?? Math.round(it.value * p)}</div>
            </div>
            <div style={{ height: 30, borderRadius: 15, background: "rgba(255,244,223,0.1)", marginTop: 6 }}>
              <div style={{ height: 30, borderRadius: 15, width: `${Math.max(2.5, (100 * it.value * p) / max)}%`, background: col, boxShadow: `0 0 24px ${toneGlow(it.tone, 0.6)}` }} />
            </div>
            <Sfx at={ats[i] - 2} name="tick" vol={0.35} />
          </div>
        );
      })}
    </div>
  );
};

/* ---------- vs: two sides, one gets struck/marked ---------- */
type VsW = Widget & { top?: number; left: { text: string; tone?: Tone; at: Cue }; right: { text: string; tone?: Tone; at: Cue }; split?: Cue; size?: number };
const Vs: React.FC<{ w: VsW }> = ({ w }) => {
  const c = useCue();
  const la = c(w.left.at);
  const ra = c(w.right.at);
  const { o, f } = useShow(w, la);
  const sp = w.split !== undefined ? c(w.split) : 1e9;
  const crack = ease(f, sp, sp + 14);
  const size = w.size ?? 80;
  const side = (s: VsW["left"], a: number, dir: number) => {
    const p = ease(f, a - 4, a + 10);
    return (
      <div style={{ ...glass, background: "rgba(7,8,24,0.75)", borderColor: toneGlow(s.tone, 0.7), padding: "18px 40px 10px", opacity: p, transform: `translateX(${dir * (1 - p) * 60 + dir * 40 * crack}px) rotate(${dir * 4 * crack}deg)` }}>
        <RichLine text={s.text} size={size} color={toneColor(s.tone)} shadow={false} />
      </div>
    );
  };
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top: w.top ?? 1000, display: "flex", justifyContent: "center", alignItems: "center", gap: 40, opacity: o }}>
      {side(w.left, la, -1)}
      <div style={{ position: "relative", width: 8, height: 170 }}>
        <div style={{ position: "absolute", inset: 0, background: G.red, borderRadius: 4, opacity: crack, boxShadow: `0 0 30px ${G.red}`, transform: `scaleY(${crack})` }} />
        <div style={{ ...num(50, G.dim), position: "absolute", left: -30, top: 56, width: 70, textAlign: "center", opacity: 1 - crack }}>vs</div>
      </div>
      {side(w.right, ra, 1)}
      <Sfx at={sp - 2} name="stamp" vol={0.5} />
    </div>
  );
};

/* ---------- split: a glowing jagged line that cracks open between two sides ---------- */
type SplitW = Widget & { x?: number; top?: number; bottom?: number; at: Cue; tone?: Tone; seed?: string };
const Split: React.FC<{ w: SplitW }> = ({ w }) => {
  const c = useCue();
  const at = c(w.at);
  const { o, f } = useShow(w, at);
  const x = w.x ?? 540;
  const y0 = w.top ?? 700;
  const y1 = w.bottom ?? 1540;
  const n = 14;
  const pts = Array.from({ length: n + 1 }, (_, i) => {
    const y = y0 + ((y1 - y0) * i) / n;
    const dx = i === 0 || i === n ? 0 : (((i * 7919) % 13) / 13 - 0.5) * 46;
    return `${x + dx},${y}`;
  });
  const p = ease(f, at - 2, at + 14);
  const col = toneColor(w.tone ?? "red");
  return (
    <>
    <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0, opacity: o }}>
      <polyline points={pts.join(" ")} fill="none" stroke={col} strokeWidth={9} strokeLinejoin="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - p} style={{ filter: `drop-shadow(0 0 14px ${col}) drop-shadow(0 0 30px ${col})` }} />
      <polyline points={pts.join(" ")} fill="none" stroke={G.white} strokeWidth={3} strokeLinejoin="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - p} opacity={0.8} />
    </svg>
    <Sfx at={at - 2} name="stamp" vol={0.5} />
    </>
  );
};

export const WIDGETS: Record<string, React.FC<{ w: never }>> = {
  split: Split as React.FC<{ w: never }>,
  dots: Dots as React.FC<{ w: never }>,
  items: Items as React.FC<{ w: never }>,
  count: Count as React.FC<{ w: never }>,
  bars: Bars as React.FC<{ w: never }>,
  vs: Vs as React.FC<{ w: never }>,
};

/** Extra widgets for one episode can be added here from its own file. */
export const registerWidget = (name: string, comp: React.FC<{ w: never }>) => {
  WIDGETS[name] = comp;
};

export const WidgetView: React.FC<{ w: Widget }> = ({ w }) => {
  const Comp = WIDGETS[w.type];
  if (!Comp) throw new Error(`unknown widget ${w.type}`);
  return <Comp w={w as never} />;
};

/* ---------- wheel: 12 months, cold (blue) ↔ hot (orange); it keeps turning ---------- */
type WheelW = Widget & { top?: number; r?: number; at?: Cue; speed?: number; phase?: number; fast?: Cue; hot?: string; cold?: string };
const mix = (a: number[], b: number[], t: number) => `rgb(${a.map((v, i) => Math.round(v + (b[i] - v) * t)).join(",")})`;
const Wheel: React.FC<{ w: WheelW }> = ({ w }) => {
  const c = useCue();
  const { p, o, f, at } = useShow(w, -20);
  const r = w.r ?? 230;
  const cx = 540;
  const cy = (w.top ?? 760) + r;
  const fast = w.fast !== undefined ? c(w.fast) : 1e9;
  const speed = w.speed ?? 1.1; // degrees per frame
  const extra = 180 * ease(f, fast, fast + 30, "inOut");
  const rot = (w.phase ?? 0) + speed * (f - at) + extra;
  const segs = 12;
  const cold = [90, 169, 255];
  const hot = [255, 154, 60];
  // which part is at the pointer (top)? angle of the pointer in wheel space
  const a = ((((-rot) % 360) + 360) % 360) / 360; // 0..1
  const temp = Math.cos(a * 2 * Math.PI); // 1 = cold, -1 = hot
  const isCold = temp > 0;
  const arc = (i: number) => {
    const a0 = ((i / segs) * 360 - 90 - 15 + 1.2) * (Math.PI / 180);
    const a1 = (((i + 1) / segs) * 360 - 90 - 15 - 1.2) * (Math.PI / 180);
    const R = r, ri = r - 74;
    return `M ${cx + R * Math.cos(a0)} ${cy + R * Math.sin(a0)} A ${R} ${R} 0 0 1 ${cx + R * Math.cos(a1)} ${cy + R * Math.sin(a1)} L ${cx + ri * Math.cos(a1)} ${cy + ri * Math.sin(a1)} A ${ri} ${ri} 0 0 0 ${cx + ri * Math.cos(a0)} ${cy + ri * Math.sin(a0)} Z`;
  };
  return (
    <div style={{ position: "absolute", inset: 0, opacity: p * o }}>
      <div style={{ position: "absolute", left: cx - r * 1.5, top: cy - r * 1.5, width: r * 3, height: r * 3, borderRadius: "50%", background: `radial-gradient(circle, ${isCold ? "rgba(90,169,255,0.28)" : "rgba(255,154,60,0.3)"}, transparent 62%)` }} />
      <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0 }}>
        <g transform={`rotate(${rot} ${cx} ${cy})`}>
          {Array.from({ length: segs }).map((_, i) => {
            const t = (1 - Math.cos((i / segs) * 2 * Math.PI)) / 2; // 0 cold … 1 hot
            return <path key={i} d={arc(i)} fill={mix(cold, hot, t)} opacity={0.92} />;
          })}
          {Array.from({ length: 24 }).map((_, i) => (
            <circle key={`s${i}`} cx={cx + (r + 26) * Math.cos((i / 24) * 2 * Math.PI)} cy={cy + (r + 26) * Math.sin((i / 24) * 2 * Math.PI)} r={3} fill={G.lineSoft} />
          ))}
        </g>
        <path d={`M ${cx - 26} ${cy - r - 40} L ${cx + 26} ${cy - r - 40} L ${cx} ${cy - r + 6} Z`} fill={G.cream} style={{ filter: "drop-shadow(0 0 10px rgba(255,244,223,0.8))" }} />
      </svg>
      <div style={{ position: "absolute", left: cx - 140, top: cy - 70, width: 280, display: "flex", flexDirection: "column", alignItems: "center" }}>
        <div style={deva(86, isCold ? "#8FC8FF" : G.saffron, 800)}>{isCold ? (w.cold ?? "दुख") : (w.hot ?? "सुख")}</div>
        <div style={deva(36, G.dim, 700)}>{isCold ? "सर्दी" : "गर्मी"}</div>
      </div>
    </div>
  );
};

/* ---------- diary: a dated page; later a "+3 months" tag and a green stamp ---------- */
type DiaryW = Widget & { top?: number; at?: Cue; date: string; text: string; later?: { at: Cue; text: string }; stamp?: { at: Cue; text: string } };
const Diary: React.FC<{ w: DiaryW }> = ({ w }) => {
  const c = useCue();
  const { p, o, f } = useShow(w, -20);
  const top = w.top ?? 700;
  const la = w.later ? c(w.later.at) : 1e9;
  const sa = w.stamp ? c(w.stamp.at) : 1e9;
  const lp = useSpring(la - 4, "bouncy");
  const sp = useSpring(sa - 3, "slam");
  const write = ease(f, 6, 40);
  return (
    <div style={{ position: "absolute", left: 110, top, width: 860, opacity: p * o, transform: `translateY(${(1 - p) * 50}px) rotate(-2deg)` }}>
      <div style={{ position: "relative", background: "#FFF6E3", borderRadius: 18, padding: "34px 50px 40px 90px", boxShadow: "0 40px 80px -30px rgba(0,0,0,0.85), 0 0 60px rgba(242,184,75,0.2)", overflow: "hidden" }}>
        <div style={{ position: "absolute", left: 60, top: 0, bottom: 0, width: 3, background: "rgba(255,90,95,0.5)" }} />
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} style={{ position: "absolute", left: 0, right: 0, top: 112 + i * 62, height: 2, background: "rgba(80,120,200,0.18)" }} />
        ))}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
          <div style={deva(40, "#9A3B0E", 700)}>तारीख</div>
          <div style={{ ...num(46, G.ink), opacity: 1 - ease(f, la - 4, la + 4) }}>{w.date}</div>
        </div>
        <div style={{ ...deva(60, "#2A2A48", 700), whiteSpace: "normal", marginTop: 26, lineHeight: 1.2, clipPath: `inset(0 ${100 - 100 * write}% 0 0)` }}>{w.text}</div>
        <div style={{ height: 120 }} />
      </div>
      {w.later && (
        <div style={{ position: "absolute", right: -30, top: -40, opacity: interpolate(lp, [0, 0.4], [0, 1], clamp), transform: `scale(${interpolate(lp, [0, 1], [0.5, 1])}) rotate(6deg)` }}>
          <div style={{ ...deva(54, G.ink, 800), background: G.gold, borderRadius: 999, padding: "6px 30px 0", boxShadow: "0 0 40px rgba(242,184,75,0.6)" }}>{w.later.text}</div>
        </div>
      )}
      {w.stamp && (
        <div style={{ position: "absolute", left: 230, top: 230, opacity: interpolate(sp, [0, 0.3], [0, 1], clamp), transform: `scale(${interpolate(sp, [0, 1], [2.2, 1])}) rotate(-12deg)` }}>
          <div style={{ ...deva(78, G.green, 800), border: `8px solid ${G.green}`, borderRadius: 20, padding: "4px 30px 0", background: "rgba(255,246,227,0.85)" }}>{w.stamp.text}</div>
        </div>
      )}
      <Sfx at={la - 3} name="swish" vol={0.45} />
      <Sfx at={sa - 2} name="stamp" vol={0.7} />
    </div>
  );
};

/* ---------- rain / snow over a picture ---------- */
type RainW = Widget & { at?: Cue; out?: Cue; n?: number; snow?: boolean; color?: string; x0?: number; x1?: number; y0?: number; y1?: number };
const Rain: React.FC<{ w: RainW }> = ({ w }) => {
  const { p, o, f } = useShow(w, -20);
  const n = w.n ?? 70;
  const x0 = w.x0 ?? 120, x1 = w.x1 ?? 960, y0 = w.y0 ?? 560, y1 = w.y1 ?? 1600;
  return (
    <div style={{ position: "absolute", inset: 0, opacity: p * o, pointerEvents: "none" }}>
      {Array.from({ length: n }).map((_, i) => {
        const rx = ((i * 7919) % 1000) / 1000;
        const ry = ((i * 104729) % 1000) / 1000;
        const sp = w.snow ? 1.4 + ((i * 31) % 10) / 8 : 22 + ((i * 13) % 10);
        const x = x0 + rx * (x1 - x0) + (w.snow ? Math.sin(f / 20 + i) * 18 : -f * 2.2 * 0);
        const y = y0 + ((ry * (y1 - y0) + f * sp) % (y1 - y0));
        return w.snow ? (
          <div key={i} style={{ position: "absolute", left: x, top: y, width: 7, height: 7, borderRadius: "50%", background: "#EAF4FF", opacity: 0.8, boxShadow: "0 0 8px #EAF4FF" }} />
        ) : (
          <div key={i} style={{ position: "absolute", left: x, top: y, width: 2.5, height: 46, background: `linear-gradient(180deg, transparent, ${w.color ?? "rgba(170,210,255,0.75)"})`, transform: "rotate(8deg)" }} />
        );
      })}
    </div>
  );
};

registerWidget("wheel", Wheel as React.FC<{ w: never }>);
registerWidget("diary", Diary as React.FC<{ w: never }>);
registerWidget("rain", Rain as React.FC<{ w: never }>);
