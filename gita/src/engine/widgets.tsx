import React from "react";
import { Img, interpolate, staticFile, useCurrentFrame } from "remotion";
import { Sfx, clamp, deva, ease, glass, num, sanskrit, useSpring } from "../components/kit";
import { G } from "../theme";
import { RichLine, graphemes, toneColor, toneGlow, useCue } from "./core";
import { useV2 } from "./cine";
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
  groups: { n: number; at: Cue; tone?: Tone; label?: string; fill?: number; pulse?: Cue }[];
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
  const shown = w.groups.reduce((a, g, gi) => a + (f >= groupAt[gi] ? g.n : 0), 0);
  const pulseAt = w.groups.map((g) => (g.pulse !== undefined ? c(g.pulse) : 1e9));
  const anyPulse = pulseAt.some((a) => f >= a);
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
          const g0 = gi !== undefined ? w.groups[gi] : undefined;
          const k0 = gi !== undefined ? i - owner.indexOf(gi) : 0;
          const on = gi !== undefined && f >= groupAt[gi] && (!g0?.fill || f >= groupAt[gi] + (k0 / g0.n) * g0.fill);
          const tone = gi !== undefined ? w.groups[gi].tone ?? "gold" : "gold";
          const pop = gi !== undefined ? Math.sin(Math.PI * ease(f, groupAt[gi] + Math.min(i - (owner.indexOf(gi)), 30) * 0.3, groupAt[gi] + 12 + Math.min(i - owner.indexOf(gi), 30) * 0.3)) : 0;
          const col = on ? toneColor(tone) : "rgba(255,244,223,0.2)";
          const pulsing = gi !== undefined && f >= pulseAt[gi];
          const s = size * (1 + 0.8 * pop + (pulsing ? 0.25 + 0.2 * Math.sin((f - pulseAt[gi]) / 4 + i / 6) : 0));
          const dimmed = anyPulse && !pulsing;
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
                opacity: dimmed ? 0.3 : 1,
                boxShadow: on ? `0 0 ${size * (w.groups[gi].n === 1 ? 2.2 : pulsing ? 1.4 : 0.7)}px ${toneGlow(tone, 0.9)}` : undefined,
              }}
            />
          );
        })}
      </div>
      {w.groups.map((g, gi) => {
        if (g.n !== 1 || f < groupAt[gi] || groupAt[gi] < 0) return null;
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
  const v2 = useV2();
  const ats = w.items.map((it) => c(it.at));
  const { o, f } = useShow(w, ats[0]);
  const max = w.max ?? Math.max(...w.items.map((i) => i.value));
  const width = w.width ?? 900;
  return (
    <div style={{ position: "absolute", left: 540 - width / 2, top: w.top ?? 1000, width, display: "flex", flexDirection: "column", gap: 22, opacity: o, ...(v2 ? { background: "rgba(7,8,24,0.62)", border: `2.5px solid ${G.lineSoft}`, borderRadius: 30, padding: "26px 34px", boxSizing: "border-box" as const, boxShadow: "0 30px 60px -30px rgba(0,0,0,0.8)" } : {}) }}>
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
  const { o, f, p: show } = useShow(w, la);
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
    <div style={{ position: "absolute", left: 0, right: 0, top: w.top ?? 1000, display: "flex", justifyContent: "center", alignItems: "center", gap: 40, opacity: o * show }}>
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

/* ---------- date: a big date card (+ time and place lines that come in on cue) ---------- */
type DateW = Widget & { top?: number; at?: Cue; out?: Cue; day: string; month: string; year: string; lines?: { at: Cue; text: string; icon?: string }[] };
const DateCard: React.FC<{ w: DateW }> = ({ w }) => {
  const c = useCue();
  const { p, o, f, at } = useShow(w, -20);
  const parts = [w.day, w.month, w.year];
  return (
    <div style={{ position: "absolute", left: 84, right: 84, top: w.top ?? 300, display: "flex", flexDirection: "column", alignItems: "center", gap: 18, opacity: p * o }}>
      <div style={{ display: "flex", gap: 18 }}>
        {parts.map((t, i) => {
          const q = ease(f, at + i * 6, at + i * 6 + 12);
          return (
            <div key={i} style={{ background: "rgba(7,8,24,0.82)", border: `3px solid ${G.line}`, borderRadius: 22, padding: "10px 28px 4px", transform: `perspective(600px) rotateX(${(1 - q) * 80}deg)`, opacity: q, boxShadow: "0 20px 40px -20px rgba(0,0,0,0.8)" }}>
              <div style={{ ...(i === 1 ? deva(110, G.cream, 800) : num(124, G.gold)), textShadow: i === 1 ? undefined : "0 0 40px rgba(242,184,75,0.5)" }}>{t}</div>
            </div>
          );
        })}
      </div>
      {(w.lines ?? []).map((l, i) => {
        const a = c(l.at);
        const q = ease(f, a - 4, a + 8);
        return (
          <div key={i} style={{ ...deva(54, G.cream, 700), opacity: q, transform: `translateY(${(1 - q) * 20}px)`, textShadow: "0 4px 20px rgba(0,0,0,0.9)" }}>
            {l.icon ? `${l.icon} ` : ""}
            {l.text}
          </div>
        );
      })}
      {parts.map((_, i) => (
        <Sfx key={i} at={at + i * 6} name="tick" vol={0.4} />
      ))}
    </div>
  );
};
registerWidget("date", DateCard as React.FC<{ w: never }>);

/* ---------- calendar: tear-off pages that keep saying the same word ("कल") ---------- */
type CalW = Widget & { top?: number; at?: Cue; out?: Cue; word: string; sub?: string; start?: number; every?: number; size?: number };
const Calendar: React.FC<{ w: CalW }> = ({ w }) => {
  const { p, o, f, at } = useShow(w, -20);
  const every = w.every ?? 14;
  const n = Math.max(0, Math.floor((f - at) / every));
  const size = w.size ?? 300;
  const page = (k: number, flip: number) => (
    <div style={{ position: "absolute", inset: 0, transformOrigin: "50% 0%", transform: `perspective(900px) rotateX(${flip * 100}deg)`, opacity: 1 - flip * 0.8, background: "#FFF6E3", borderRadius: 20, boxShadow: "0 30px 60px -30px rgba(0,0,0,0.9)", overflow: "hidden" }}>
      <div style={{ height: size * 0.24, background: G.red, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={num(size * 0.14, G.white)}>{(w.start ?? 7) + k} NOV</div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginTop: size * 0.04 }}>
        <div style={deva(size * 0.36, G.ink, 800)}>{w.word}</div>
        {w.sub && <div style={deva(size * 0.12, "#7A5A2A", 700)}>{w.sub}</div>}
      </div>
    </div>
  );
  return (
    <div style={{ position: "absolute", left: 540 - size / 2, top: w.top ?? 640, width: size, height: size * 1.05, opacity: p * o, transform: `scale(${0.8 + 0.2 * p}) rotate(-3deg)` }}>
      {page(n + 1, 0)}
      {f >= at && page(n, ease(f, at + n * every, at + n * every + every * 0.7))}
      <div style={{ position: "absolute", left: size * 0.3, top: -14, width: 18, height: 30, borderRadius: 9, background: G.dim }} />
      <div style={{ position: "absolute", right: size * 0.3, top: -14, width: 18, height: 30, borderRadius: 9, background: G.dim }} />
      {Array.from({ length: (w.flips as number | undefined) ?? 6 }).map((_, k) => (
        <Sfx key={k} at={at + k * every} name="swish" vol={0.22} />
      ))}
    </div>
  );
};

/* ---------- timer: a ring with mm:ss that starts on cue ---------- */
type TimerW = Widget & { top?: number; at?: Cue; out?: Cue; go?: Cue; minutes: number; r?: number; label?: string; tone?: Tone };
const Timer: React.FC<{ w: TimerW }> = ({ w }) => {
  const c = useCue();
  const { p, o, f } = useShow(w, -20);
  const go = w.go !== undefined ? c(w.go) : 0;
  const r = w.r ?? 200;
  const secs = Math.max(0, w.minutes * 60 - Math.max(0, Math.floor((f - go) / 30)));
  const mm = String(Math.floor(secs / 60)).padStart(2, "0");
  const ss = String(secs % 60).padStart(2, "0");
  const prog = f >= go ? 0.02 + 0.06 * ease(f, go, go + 60) : 0;
  const col = toneColor(w.tone ?? "green");
  const C = 2 * Math.PI * (r - 16);
  return (
    <div style={{ position: "absolute", left: 540 - r, top: w.top ?? 640, width: 2 * r, height: 2 * r, opacity: p * o, transform: `scale(${0.85 + 0.15 * p})` }}>
      <div style={{ position: "absolute", inset: -r * 0.3, borderRadius: "50%", background: `radial-gradient(circle, ${toneGlow(w.tone ?? "green", 0.3)}, transparent 65%)` }} />
      <svg width={2 * r} height={2 * r} style={{ position: "absolute", left: 0, top: 0 }}>
        <circle cx={r} cy={r} r={r - 16} fill="rgba(7,8,24,0.8)" stroke="rgba(255,244,223,0.12)" strokeWidth={22} />
        <circle cx={r} cy={r} r={r - 16} fill="none" stroke={col} strokeWidth={22} strokeLinecap="round" strokeDasharray={C} strokeDashoffset={C * (1 - prog)} transform={`rotate(-90 ${r} ${r})`} style={{ filter: `drop-shadow(0 0 12px ${col})` }} />
      </svg>
      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
        <div style={num(r * 0.62, G.cream)}>
          {mm}:{ss}
        </div>
        {w.label && <div style={deva(r * 0.2, col, 800)}>{w.label}</div>}
      </div>
      <Sfx at={go - 2} name="ding" vol={0.45} />
    </div>
  );
};
registerWidget("calendar", Calendar as React.FC<{ w: never }>);
registerWidget("timer", Timer as React.FC<{ w: never }>);

/* ---------- scale: two pans; tilts as each side comes in, then levels ---------- */
type ScaleSide = { label: string; sub?: string; at: Cue; tone?: Tone };
type ScaleW = Widget & { top?: number; at?: Cue; out?: Cue; left: ScaleSide; right: ScaleSide; level?: Cue; size?: number };
const Scale: React.FC<{ w: ScaleW }> = ({ w }) => {
  const c = useCue();
  const la = c(w.left.at);
  const ra = c(w.right.at);
  const lv = w.level !== undefined ? c(w.level) : 1e9;
  const { p, o, f } = useShow(w, Math.min(la, ra) - 10);
  const tilt = -10 * ease(f, la - 2, la + 12) + 20 * ease(f, ra - 2, ra + 12) - 10 * ease(f, lv - 2, lv + 16, "inOut");
  const top = w.top ?? 860;
  const arm = 330;
  const size = w.size ?? 76;
  const rad = (tilt * Math.PI) / 180;
  const pan = (s: ScaleSide, dir: number, a: number) => {
    const x = 540 + dir * arm * Math.cos(rad);
    const y = top + 40 + dir * arm * Math.sin(rad);
    const q = ease(f, a - 4, a + 8);
    const col = toneColor(s.tone ?? "gold");
    return (
      <>
        <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0 }}>
          <line x1={x} y1={y} x2={x - 120} y2={y + 170} stroke={G.goldDeep} strokeWidth={3} />
          <line x1={x} y1={y} x2={x + 120} y2={y + 170} stroke={G.goldDeep} strokeWidth={3} />
          <path d={`M ${x - 150} ${y + 170} Q ${x} ${y + 250} ${x + 150} ${y + 170} Z`} fill={G.gold} opacity={0.95} />
        </svg>
        <div style={{ position: "absolute", left: x - 200, top: y + 30, width: 400, display: "flex", flexDirection: "column", alignItems: "center", opacity: q, transform: `translateY(${(1 - q) * -30}px)` }}>
          <div style={{ ...deva(size, col, 800), textShadow: `0 0 30px ${toneGlow(s.tone, 0.6)}` }}>{s.label}</div>
        </div>
        {s.sub && (
          <div style={{ position: "absolute", left: x - 220, top: y + 270, width: 440, textAlign: "center", ...deva(42, G.cream, 700), whiteSpace: "normal", opacity: q }}>{s.sub}</div>
        )}
        <Sfx at={a - 2} name="pop" vol={0.45} />
      </>
    );
  };
  return (
    <div style={{ position: "absolute", inset: 0, opacity: p * o }}>
      <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0 }}>
        <path d={`M 540 ${top + 40} L 500 ${top + 470} L 580 ${top + 470} Z`} fill={G.goldDeep} />
        <rect x={430} y={top + 466} width={220} height={22} rx={10} fill={G.goldDeep} />
        <g transform={`rotate(${tilt} 540 ${top + 40})`}>
          <rect x={540 - arm} y={top + 32} width={2 * arm} height={16} rx={8} fill={G.gold} style={{ filter: "drop-shadow(0 0 12px rgba(242,184,75,0.6))" }} />
        </g>
        <circle cx={540} cy={top + 40} r={22} fill={G.cream} />
      </svg>
      {pan(w.left, -1, la)}
      {pan(w.right, 1, ra)}
      {lv < 1e8 && <Sfx at={lv} name="check" vol={0.5} />}
    </div>
  );
};

/* ---------- typeline: a Sanskrit / Hindi line typed out letter by letter ---------- */
type TypeW = Widget & { top?: number; at?: Cue; out?: Cue; text: string; size?: number; label?: string; speed?: number; sanskrit?: boolean };
const TypeLine: React.FC<{ w: TypeW }> = ({ w }) => {
  const { p, o, f, at } = useShow(w, -20);
  const gs = graphemes(w.text);
  const n = Math.min(gs.length, Math.max(0, Math.floor((f - at) / (w.speed ?? 2.5))));
  const size = w.size ?? 96;
  return (
    <div style={{ position: "absolute", left: 60, right: 60, top: w.top ?? 760, display: "flex", flexDirection: "column", alignItems: "center", opacity: p * o }}>
      {w.label && <div style={{ ...deva(44, G.dim, 700), marginBottom: 10 }}>{w.label}</div>}
      <div style={{ position: "relative", padding: "18px 44px 10px", borderRadius: 28, border: `3px solid ${G.line}`, background: "rgba(7,8,24,0.72)", boxShadow: "0 0 70px rgba(242,184,75,0.25)" }}>
        <div style={{ ...(w.sanskrit === false ? deva(size, G.gold, 800) : sanskrit(size, G.gold)), visibility: "hidden" }}>{w.text}</div>
        <div style={{ ...(w.sanskrit === false ? deva(size, G.gold, 800) : sanskrit(size, G.gold)), position: "absolute", left: 44, top: 18, textShadow: "0 0 40px rgba(242,184,75,0.5)" }}>
          {gs.slice(0, n).join("")}
          {n < gs.length && Math.floor(f / 8) % 2 === 0 && <span style={{ display: "inline-block", width: 5, height: size * 0.9, background: G.gold, marginLeft: 6, verticalAlign: "middle" }} />}
        </div>
      </div>
      <Sfx at={Math.max(at, 0)} name="key" vol={0.35} />
    </div>
  );
};
registerWidget("scale", Scale as React.FC<{ w: never }>);
registerWidget("typeline", TypeLine as React.FC<{ w: never }>);

/* ---------- dial: a half-circle gauge, red (too little) · green (balanced) · red (too much) ---------- */
type DialW = Widget & { top?: number; at?: Cue; out?: Cue; r?: number; label?: string; lowText?: string; highText?: string; midText?: string; start?: number; moves: { at: Cue; v: number }[] };
const Dial: React.FC<{ w: DialW }> = ({ w }) => {
  const c = useCue();
  const { p, o, f } = useShow(w, -20);
  const r = w.r ?? 300;
  const cx = 540;
  const cy = (w.top ?? 700) + r;
  let v = w.start ?? 0;
  let swing = 0;
  for (const m of w.moves) {
    const a = c(m.at);
    const k = ease(f, a - 4, a + 14, "inOut");
    if (k > 0) {
      swing = f >= a - 4 && f < a + 20 ? Math.sin((f - a) / 2) * 3 * (1 - k) : 0;
      v = v + (m.v - v) * k;
    }
  }
  const ang = -90 + v * 78 + swing; // -90 = straight up
  const zone = Math.abs(v) < 0.33 ? "green" : "red";
  const arc = (a0: number, a1: number) => {
    const t0 = ((a0 - 90) * Math.PI) / 180, t1 = ((a1 - 90) * Math.PI) / 180;
    const R = r, ri = r - 60;
    return `M ${cx + R * Math.cos(t0)} ${cy + R * Math.sin(t0)} A ${R} ${R} 0 0 1 ${cx + R * Math.cos(t1)} ${cy + R * Math.sin(t1)} L ${cx + ri * Math.cos(t1)} ${cy + ri * Math.sin(t1)} A ${ri} ${ri} 0 0 0 ${cx + ri * Math.cos(t0)} ${cy + ri * Math.sin(t0)} Z`;
  };
  const rad = (ang * Math.PI) / 180;
  return (
    <div style={{ position: "absolute", inset: 0, opacity: p * o }}>
      <div style={{ position: "absolute", left: cx - r * 1.3, top: cy - r * 1.3, width: r * 2.6, height: r * 2.6, borderRadius: "50%", background: `radial-gradient(circle, ${zone === "green" ? "rgba(43,212,107,0.25)" : "rgba(255,60,70,0.25)"}, transparent 60%)` }} />
      <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0 }}>
        <path d={arc(-90, -28)} fill={G.red} opacity={0.9} />
        <path d={arc(-26, 26)} fill={G.green} opacity={0.95} />
        <path d={arc(28, 90)} fill={G.red} opacity={0.9} />
        <line x1={cx} y1={cy} x2={cx + (r - 20) * Math.cos(rad)} y2={cy + (r - 20) * Math.sin(rad)} stroke={G.cream} strokeWidth={12} strokeLinecap="round" style={{ filter: "drop-shadow(0 0 10px rgba(255,244,223,0.8))" }} />
        <circle cx={cx} cy={cy} r={26} fill={G.cream} />
      </svg>
      <div style={{ position: "absolute", left: cx - r - 60, top: cy + 20, width: 240, textAlign: "center", ...deva(40, G.red, 800) }}>{w.lowText ?? "बहुत कम"}</div>
      <div style={{ position: "absolute", left: cx + r - 180, top: cy + 20, width: 240, textAlign: "center", ...deva(40, G.red, 800) }}>{w.highText ?? "बहुत ज़्यादा"}</div>
      <div style={{ position: "absolute", left: cx - 150, top: cy - r - 70, width: 300, textAlign: "center", ...deva(42, G.green, 800) }}>{w.midText ?? "संतुलन"}</div>
      {w.label && <div style={{ position: "absolute", left: cx - 200, top: cy + 50, width: 400, textAlign: "center", ...deva(64, G.cream, 800) }}>{w.label}</div>}
      {w.moves.map((m, i) => (
        <Sfx key={i} at={c(m.at) - 3} name={Math.abs(m.v) < 0.33 ? "check" : "error"} vol={0.4} />
      ))}
    </div>
  );
};
registerWidget("dial", Dial as React.FC<{ w: never }>);

/* ---------- faces: round portraits with a label and a number ---------- */
type FacesW = Widget & { top?: number; at?: Cue; out?: Cue; size?: number; note?: string; items: { src: string; label: string; count?: string; tone?: Tone; at: Cue; hi?: Cue }[] };
const Faces: React.FC<{ w: FacesW }> = ({ w }) => {
  const c = useCue();
  const { o, f } = useShow(w, -20);
  const size = w.size ?? 160;
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top: w.top ?? 1290, display: "flex", flexDirection: "column", alignItems: "center", opacity: o }}>
      <div style={{ display: "flex", justifyContent: "center", gap: 34 }}>
        {w.items.map((it, i) => {
          const a = c(it.at);
          const on = ease(f, a - 4, a + 8);
          const hi = it.hi !== undefined ? ease(f, c(it.hi) - 4, c(it.hi) + 10) : 0;
          const col = toneColor(it.tone);
          return (
            <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", transform: `scale(${1 + 0.18 * hi})`, opacity: 0.35 + 0.65 * on }}>
              <div style={{ width: size, height: size, borderRadius: "50%", overflow: "hidden", border: `5px solid ${on > 0.5 ? col : "rgba(255,244,223,0.2)"}`, background: "#1B2150", boxShadow: on > 0.5 ? `0 0 ${30 + 30 * hi}px ${toneGlow(it.tone, 0.6)}` : undefined, filter: on > 0.5 ? undefined : "grayscale(1)" }}>
                <Img src={staticFile(it.src)} style={{ width: size, height: size, objectFit: "cover" }} />
              </div>
              <div style={{ ...deva(36, G.cream, 700), marginTop: 6 }}>{it.label}</div>
              {it.count && <div style={{ ...num(54, col), opacity: on }}>{it.count}</div>}
            </div>
          );
        })}
      </div>
      {w.note && <div style={{ ...deva(30, G.dim, 700), marginTop: 34 }}>{w.note}</div>}
    </div>
  );
};
registerWidget("faces", Faces as React.FC<{ w: never }>);

/* ---------- doors: three tall stone doors; each opens with red light on cue; all can close on cue ---------- */
type DoorsW = Widget & { top?: number; at?: Cue; out?: Cue; h?: number; items: { label: string; sub?: string; at: Cue }[]; close?: Cue; counter?: boolean };
const Doors: React.FC<{ w: DoorsW }> = ({ w }) => {
  const c = useCue();
  const { p, o, f } = useShow(w, -20);
  const n = w.items.length;
  const h = w.h ?? 460;
  const dw = 250;
  const gap = 40;
  const total = n * dw + (n - 1) * gap;
  const top = w.top ?? 700;
  const close = w.close !== undefined ? c(w.close) : 1e9;
  const shut = ease(f, close - 2, close + 14, "inOut");
  const opened = w.items.filter((it) => f >= c(it.at)).length;
  return (
    <div style={{ position: "absolute", left: 540 - total / 2, top, width: total, opacity: p * o }}>
      {w.counter !== false && opened > 0 && (
        <div style={{ position: "absolute", left: 0, right: 0, top: -84, display: "flex", justifyContent: "center", alignItems: "baseline", gap: 8 }}>
          <div style={num(70, shut > 0.5 ? G.green : G.red)}>{opened}</div>
          <div style={num(44, G.dim)}>/ {n}</div>
        </div>
      )}
      <div style={{ display: "flex", gap }}>
        {w.items.map((it, i) => {
          const a = c(it.at);
          const op = ease(f, a - 2, a + 14) * (1 - shut);
          const flick = 0.85 + 0.15 * Math.sin(f / 3 + i * 2);
          return (
            <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              <div style={{ position: "relative", width: dw, height: h, borderRadius: `${dw / 2}px ${dw / 2}px 10px 10px`, background: "linear-gradient(180deg, #2A2238, #120E1C)", border: `6px solid ${op > 0.3 ? G.red : "#3A3350"}`, boxShadow: op > 0 ? `0 0 ${60 * op}px rgba(255,60,70,${0.7 * op * flick}), inset 0 0 40px rgba(0,0,0,0.8)` : "inset 0 0 40px rgba(0,0,0,0.8)", overflow: "hidden" }}>
                <div style={{ position: "absolute", inset: 0, background: `radial-gradient(ellipse at 50% 70%, rgba(255,90,40,${0.95 * op * flick}), rgba(180,20,30,${0.7 * op}) 45%, transparent 80%)` }} />
                {/* two door leaves swing open */}
                <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: "50%", background: "linear-gradient(90deg, #3A3048, #241C30)", borderRight: "2px solid #120E1C", transformOrigin: "0% 50%", transform: `perspective(700px) rotateY(${-70 * op}deg)` }} />
                <div style={{ position: "absolute", right: 0, top: 0, bottom: 0, width: "50%", background: "linear-gradient(270deg, #3A3048, #241C30)", borderLeft: "2px solid #120E1C", transformOrigin: "100% 50%", transform: `perspective(700px) rotateY(${70 * op}deg)` }} />
                <div style={{ position: "absolute", left: 0, right: 0, top: 26, textAlign: "center", ...num(54, op > 0.3 ? G.white : G.dim) }}>{i + 1}</div>
                {shut > 0.5 && (
                  <div style={{ position: "absolute", left: dw / 2 - 40, top: h / 2 - 40, width: 80, height: 80, borderRadius: "50%", background: G.green, display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${ease(f, close + 6, close + 16)})` }}>
                    <svg width={50} height={50} viewBox="0 0 48 48">
                      <path d="M12 24 L21 33 L37 15" fill="none" stroke={G.ink} strokeWidth={6} strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                )}
              </div>
              <div style={{ ...deva(62, op > 0.3 ? G.red : shut > 0.5 ? G.cream : G.dim, 800), marginTop: 12, opacity: f >= a - 4 || shut > 0 ? 1 : 0.35 }}>{f >= a - 4 || shut > 0 ? it.label : "?"}</div>
              {it.sub && <div style={{ ...deva(36, G.dim, 700), opacity: f >= a ? 1 : 0 }}>{it.sub}</div>}
              <Sfx at={a - 2} name="bass" vol={0.45} />
            </div>
          );
        })}
      </div>
      {close < 1e8 && <Sfx at={close} name="stamp" vol={0.6} />}
    </div>
  );
};
registerWidget("doors", Doors as React.FC<{ w: never }>);

/* ---------- lamps: brass diya(s) with a living flame; with two lamps the flame can move across ---------- */
const Diya: React.FC<{ x: number; y: number; w: number; old?: boolean }> = ({ x, y, w, old }) => {
  const h = w * 0.42;
  const id = `dg${Math.round(x)}${old ? "o" : "n"}`;
  return (
    <svg width={w * 1.3} height={h * 1.6} style={{ position: "absolute", left: x - w * 0.65, top: y - h * 0.3, overflow: "visible", filter: old ? "grayscale(0.7) brightness(0.55)" : undefined }}>
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#FFE29A" />
          <stop offset="0.45" stopColor="#D9982C" />
          <stop offset="1" stopColor="#6E4210" />
        </linearGradient>
      </defs>
      <path d={`M ${w * 0.05} ${h * 0.35} Q ${w * 0.65} ${h * 1.45} ${w * 1.18} ${h * 0.35} Q ${w * 1.27} ${h * 0.22} ${w * 1.25} ${h * 0.08} Q ${w * 1.05} ${h * 0.3} ${w * 0.9} ${h * 0.32} Z`} fill={`url(#${id})`} />
      <ellipse cx={w * 0.55} cy={h * 0.36} rx={w * 0.5} ry={h * 0.13} fill="#3A2208" />
      <ellipse cx={w * 0.55} cy={h * 0.34} rx={w * 0.5} ry={h * 0.11} fill="none" stroke="#FFE7A8" strokeWidth={3} opacity={0.8} />
    </svg>
  );
};
const Flame: React.FC<{ x: number; y: number; s: number; f: number; o?: number }> = ({ x, y, s, f, o = 1 }) => {
  const fl = 1 + 0.08 * Math.sin(f / 2.1) + 0.05 * Math.sin(f / 3.7 + 1);
  const sway = Math.sin(f / 5) * 3;
  return (
    <div style={{ position: "absolute", left: x - s, top: y - s * 2.2, width: s * 2, height: s * 2.6, opacity: o }}>
      <div style={{ position: "absolute", left: -s * 2.5, top: -s * 1.6, width: s * 7, height: s * 7, borderRadius: "50%", background: "radial-gradient(circle, rgba(255,200,90,0.55), rgba(255,140,40,0.18) 40%, transparent 70%)" }} />
      <svg width={s * 2} height={s * 2.6} viewBox="0 0 40 52" style={{ position: "absolute", left: 0, top: 0, transformOrigin: "50% 100%", transform: `scaleY(${fl}) skewX(${sway}deg)`, filter: "drop-shadow(0 0 12px rgba(255,170,60,0.95))" }}>
        <defs>
          <radialGradient id="flm" cx="0.5" cy="0.75" r="0.6">
            <stop offset="0" stopColor="#FFFFFF" />
            <stop offset="0.35" stopColor="#FFE680" />
            <stop offset="0.7" stopColor="#FF9A2E" />
            <stop offset="1" stopColor="#E2471A" stopOpacity="0.2" />
          </radialGradient>
        </defs>
        <path d="M20 2 C 30 18, 36 30, 33 40 C 30 49, 10 49, 7 40 C 4 30, 12 18, 20 2 Z" fill="url(#flm)" />
      </svg>
    </div>
  );
};
type LampsW = Widget & { top?: number; at?: Cue; out?: Cue; two?: boolean; move?: Cue; size?: number };
const Lamps: React.FC<{ w: LampsW }> = ({ w }) => {
  const c = useCue();
  const { p, o, f } = useShow(w, -20);
  const top = w.top ?? 1150;
  const size = w.size ?? 260;
  if (!w.two) {
    return (
      <div style={{ position: "absolute", inset: 0, opacity: p * o }}>
        <Diya x={540} y={top} w={size} />
        <Flame x={540 + size * 0.02} y={top + 6} s={size * 0.13} f={f} />
      </div>
    );
  }
  const mv = w.move !== undefined ? c(w.move) : 1e9;
  const t = ease(f, mv, mv + 26, "inOut");
  const xL = 300, xR = 780;
  const fx = xL + (xR - xL) * t;
  const fy = top + 6 - Math.sin(Math.PI * t) * 180;
  return (
    <div style={{ position: "absolute", inset: 0, opacity: p * o }}>
      <Diya x={xL} y={top} w={size * 0.85} old />
      <Diya x={xR} y={top} w={size} />
      <Flame x={fx} y={fy} s={size * 0.13} f={f} />
      <Sfx at={mv} name="riser" vol={0.35} />
      <Sfx at={mv + 26} name="ding" vol={0.4} />
    </div>
  );
};
registerWidget("lamps", Lamps as React.FC<{ w: never }>);

/* ---------- imgcards: a row of picture cards that come in one by one ---------- */
type ImgCardsW = Widget & { top?: number; at?: Cue; out?: Cue; size?: number; items: { src: string; label: string; sub?: string; sa?: string; at: Cue; tone?: Tone; hi?: Cue; cover?: boolean }[] };
const ImgCards: React.FC<{ w: ImgCardsW }> = ({ w }) => {
  const c = useCue();
  const { o, f } = useShow(w, -20);
  const size = w.size ?? 220;
  const gap = 22;
  const n = w.items.length;
  const total = n * size + (n - 1) * gap;
  return (
    <div style={{ position: "absolute", left: 540 - total / 2, top: w.top ?? 760, width: total, display: "flex", gap, opacity: o }}>
      {w.items.map((it, i) => {
        const a = c(it.at);
        const q = ease(f, a - 4, a + 12);
        const hi = it.hi !== undefined ? ease(f, c(it.hi) - 4, c(it.hi) + 12) : 0;
        const col = toneColor(it.tone ?? "gold");
        return (
          <div key={i} style={{ width: size, display: "flex", flexDirection: "column", alignItems: "center", opacity: 0.25 + 0.75 * q, transform: `translateY(${(1 - q) * 50}px) scale(${(0.9 + 0.1 * q) * (1 + 0.12 * hi)})` }}>
            <div style={{ width: size, height: size * 1.3, borderRadius: 24, overflow: "hidden", border: `4px solid ${q > 0.5 ? col : "rgba(255,244,223,0.2)"}`, background: "#141833", boxShadow: q > 0.5 ? `0 0 ${30 + 40 * hi}px ${toneGlow(it.tone, 0.55 + 0.3 * hi)}` : undefined, position: "relative" }}>
              {q > 0 ? (
                <Img src={staticFile(it.src)} style={{ width: "100%", height: "100%", objectFit: it.cover === false ? "contain" : "cover", filter: q < 1 ? `blur(${(1 - q) * 8}px)` : undefined }} />
              ) : (
                <div style={{ ...num(110, "rgba(255,244,223,0.2)"), position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>?</div>
              )}
            </div>
            <div style={{ ...deva(46, q > 0.5 ? col : G.dim, 800), marginTop: 10 }}>{q > 0.5 ? it.label : "?"}</div>
            {it.sub && <div style={{ ...deva(30, G.dim, 700), opacity: q }}>{it.sub}</div>}
            {it.sa && <div style={{ ...sanskrit(30, G.gold), opacity: q, width: size + gap, textAlign: "center", lineHeight: 1.3, marginTop: 4 }}>{it.sa}</div>}
            <Sfx at={a - 3} name="pop" vol={0.45} />
          </div>
        );
      })}
    </div>
  );
};
registerWidget("imgcards", ImgCards as React.FC<{ w: never }>);

/* ---------- qmarks: question marks that multiply around a head, and can turn into one tick ---------- */
type QMarksW = Widget & { x?: number; y?: number; r?: number; at?: Cue; out?: Cue; steps: { at: Cue; n: number }[]; tick?: Cue; tone?: Tone; size?: number };
const QMarks: React.FC<{ w: QMarksW }> = ({ w }) => {
  const c = useCue();
  const { o, f } = useShow(w, -10);
  const x0 = w.x ?? 540;
  const y0 = w.y ?? 900;
  const R = w.r ?? 260;
  const size = w.size ?? 72;
  const steps = w.steps.map((s) => ({ a: c(s.at), n: s.n }));
  const N = Math.max(...steps.map((s) => s.n));
  const tk = w.tick !== undefined ? c(w.tick) : 1e9;
  const tq = ease(f, tk, tk + 14);
  const col = toneColor(w.tone ?? "gold");
  const green = toneColor("green");
  const marks: React.ReactNode[] = [];
  let prev = 0;
  for (const st of steps) {
    for (let i = prev; i < st.n; i++) {
      const a = st.a + (i - prev) * 1.2;
      const q = ease(f, a, a + 9);
      const ang = i * 2.39996 - Math.PI / 2;
      const rad = N <= 1 ? 0 : R * (0.32 + 0.68 * Math.sqrt((i + 0.5) / N));
      let x = x0 + Math.cos(ang) * rad;
      let y = y0 + Math.sin(ang) * rad * 0.8 + Math.sin(f / 18 + i * 1.7) * 7;
      const rot = (((i * 37) % 30) - 15) * (1 - (i === 0 ? tq : 0));
      let op = q;
      let s = (0.6 + 0.4 * q) * (i === 0 ? 1 : 0.62 + 0.38 * (((i * 53) % 10) / 10));
      if (i === 0) { x = x + (x0 - x) * tq; y = y + (y0 - y) * tq; s *= 1 + 0.35 * tq; } else op *= 1 - tq;
      const isTick = i === 0 && tq > 0.5;
      marks.push(
        <div key={i} style={{ position: "absolute", left: x, top: y, transform: `translate(-50%,-50%) rotate(${rot}deg) scale(${s * (isTick ? 0.6 + 0.4 * ease(f, tk + 7, tk + 16) : 1)})`, opacity: op, ...num(size, isTick ? green : col), textShadow: `0 0 26px ${isTick ? toneGlow("green", 0.8) : toneGlow(w.tone ?? "gold", 0.7)}` }}>
          {isTick ? "✓" : "?"}
        </div>,
      );
    }
    prev = st.n;
  }
  return (
    <div style={{ position: "absolute", inset: 0, opacity: o }}>
      {marks}
      {steps.map((st, k) => <Sfx key={k} at={st.a} name="pop" vol={0.45} />)}
      {w.tick !== undefined && <Sfx at={tk + 6} name="check" vol={0.6} />}
    </div>
  );
};
registerWidget("qmarks", QMarks as React.FC<{ w: never }>);

/* ---------- pie: a credit ring whose first slice shrinks as more slices arrive ---------- */
type PieW = Widget & { top?: number; r?: number; at?: Cue; out?: Cue; center?: string; items: { label: string; at: Cue; tone?: Tone }[] };
const Pie: React.FC<{ w: PieW }> = ({ w }) => {
  const c = useCue();
  const { o, p, f, at } = useShow(w, -10);
  const r = w.r ?? 230;
  const cx = 540;
  const cy = (w.top ?? 860) + r;
  const th = r * 0.36;
  const ws = w.items.map((it, i) => (i === 0 ? 1 : ease(f, c(it.at), c(it.at) + 14)));
  const tot = ws.reduce((a, b) => a + b, 0);
  let a0 = -Math.PI / 2;
  const arcs: React.ReactNode[] = [];
  const labels: React.ReactNode[] = [];
  const pt = (ang: number, rad: number) => [cx + Math.cos(ang) * rad, cy + Math.sin(ang) * rad];
  w.items.forEach((it, i) => {
    const sweep = (ws[i] / tot) * Math.PI * 2 * p;
    if (ws[i] <= 0.001) return;
    const a1 = a0 + sweep;
    const ro = r, ri = r - th;
    const big = sweep > Math.PI ? 1 : 0;
    const gap = 0.012;
    const s0 = a0 + gap, s1 = Math.max(s0 + 0.001, a1 - gap);
    const [x0, y0] = pt(s0, ro), [x1, y1] = pt(s1, ro), [x2, y2] = pt(s1, ri), [x3, y3] = pt(s0, ri);
    const d = sweep >= Math.PI * 2 - 0.02
      ? `M ${cx} ${cy - ro} A ${ro} ${ro} 0 1 1 ${cx - 0.01} ${cy - ro} L ${cx - 0.01} ${cy - ri} A ${ri} ${ri} 0 1 0 ${cx} ${cy - ri} Z`
      : `M ${x0} ${y0} A ${ro} ${ro} 0 ${big} 1 ${x1} ${y1} L ${x2} ${y2} A ${ri} ${ri} 0 ${big} 0 ${x3} ${y3} Z`;
    const col = toneColor(it.tone ?? "gold");
    arcs.push(<path key={i} d={d} fill={col} opacity={0.92} style={{ filter: `drop-shadow(0 0 18px ${toneGlow(it.tone ?? "gold", 0.5)})` }} />);
    const mid = (a0 + a1) / 2;
    const [lx, ly] = pt(mid, r + 34);
    const right = Math.cos(mid) >= 0;
    labels.push(
      <div key={i} style={{ position: "absolute", left: lx, top: ly, transform: `translate(${right ? "0" : "-100%"}, -50%)`, opacity: Math.min(1, ws[i] * 1.4) * p, textAlign: right ? "left" : "right", whiteSpace: "nowrap" }}>
        <div style={deva(52, col, 800)}>{it.label}</div>
      </div>,
    );
    a0 = a1;
  });
  return (
    <div style={{ position: "absolute", inset: 0, opacity: o }}>
      <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0 }}>{arcs}</svg>
      {labels}
      {w.center && <div style={{ position: "absolute", left: cx, top: cy, transform: "translate(-50%,-50%)", ...deva(46, G.cream, 800), opacity: p, textAlign: "center", width: (r - th) * 1.8 }}>{w.center}</div>}
      {w.items.slice(1).map((it, i) => <Sfx key={i} at={c(it.at)} name="pop" vol={0.4} />)}
      <Sfx at={at} name="whoosh" vol={0.3} />
    </div>
  );
};
registerWidget("pie", Pie as React.FC<{ w: never }>);

/* ---------- gates: a row of check-gates that light up; a message can be stopped at one ---------- */
type GatesW = Widget & { top?: number; at?: Cue; out?: Cue; counter?: boolean; items: { label: string; sub?: string; at: Cue }[]; msg?: { text: string; go: Cue; stopAt?: number } };
const Gates: React.FC<{ w: GatesW }> = ({ w }) => {
  const c = useCue();
  const { p, o, f } = useShow(w, -20);
  const n = w.items.length;
  const gw = 200;
  const gap = 34;
  const total = n * gw + (n - 1) * gap;
  const left = 540 - total / 2;
  const top = w.top ?? 820;
  const gh = 250;
  const ats = w.items.map((it) => c(it.at));
  const lit = ats.filter((a) => f >= a).length;
  // message
  let mx = 0, mq = 0, stopQ = 0, shake = 0;
  const stop = w.msg?.stopAt;
  if (w.msg) {
    const go = c(w.msg.go);
    mq = ease(f, go - 6, go + 4);
    const x0 = -560;
    const x1 = stop !== undefined ? left + stop * (gw + gap) - 6 : 1200;
    const travel = ease(f, go, go + 22, "inOut");
    mx = x0 + (x1 - x0) * travel;
    stopQ = stop !== undefined ? ease(f, go + 20, go + 26) : 0;
    if (stop !== undefined && f >= go + 20 && f < go + 40) shake = Math.sin((f - go) * 2.2) * (go + 40 - f) * 0.9;
  }
  return (
    <div style={{ position: "absolute", inset: 0, opacity: p * o }}>
      {w.counter !== false && lit > 0 && (
        <div style={{ position: "absolute", left: 0, right: 0, top: top - 96, display: "flex", justifyContent: "center", alignItems: "baseline", gap: 8 }}>
          <div style={num(72, G.green)}>{lit}</div>
          <div style={num(44, G.dim)}>/ {n}</div>
        </div>
      )}
      {w.items.map((it, i) => {
        const q = ease(f, ats[i] - 3, ats[i] + 10);
        const blocked = stop === i ? stopQ : 0;
        const col = blocked > 0.5 ? G.red : q > 0.5 ? G.green : "rgba(255,244,223,0.28)";
        const glow = blocked > 0.5 ? toneGlow("red", 0.7) : toneGlow("green", 0.6 * q);
        const x = left + i * (gw + gap);
        return (
          <div key={i} style={{ position: "absolute", left: x, top, width: gw, display: "flex", flexDirection: "column", alignItems: "center" }}>
            <div style={{ width: gw, height: gh, borderRadius: `${gw / 2}px ${gw / 2}px 18px 18px`, border: `7px solid ${col}`, boxShadow: q > 0.2 || blocked ? `0 0 ${30 + 30 * q}px ${glow}, inset 0 0 40px ${glow}` : undefined, background: "rgba(10,12,30,0.55)", display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${1 + 0.06 * Math.sin(Math.PI * q)})` }}>
              <div style={num(blocked > 0.5 || q > 0.5 ? 110 : 80, col)}>{blocked > 0.5 ? "✕" : q > 0.5 ? "✓" : i + 1}</div>
            </div>
            <div style={{ ...sanskrit(36, q > 0.5 ? G.gold : G.dim), marginTop: 14, whiteSpace: "nowrap", opacity: 0.35 + 0.65 * q }}>{it.label}</div>
            {it.sub && <div style={{ ...deva(34, G.cream, 700), opacity: q, textAlign: "center", width: gw + gap }}>{it.sub}</div>}
            <Sfx at={ats[i] - 2} name="check" vol={0.45} />
          </div>
        );
      })}
      {w.msg && mq > 0 && (
        <div style={{ position: "absolute", left: mx + shake, top: top - 120, opacity: mq, background: stopQ > 0.5 ? "rgba(120,20,30,0.92)" : "rgba(255,244,223,0.95)", color: stopQ > 0.5 ? "#fff" : "#1a1a2e", borderRadius: 26, padding: "14px 26px", ...deva(36, stopQ > 0.5 ? "#fff" : "#1a1a2e", 800), whiteSpace: "nowrap", boxShadow: stopQ > 0.5 ? `0 0 40px ${toneGlow("red", 0.7)}` : "0 10px 30px rgba(0,0,0,0.5)" }}>
          {w.msg.text}
        </div>
      )}
      {w.msg && stop !== undefined && <Sfx at={c(w.msg.go) + 20} name="error" vol={0.6} />}
    </div>
  );
};
registerWidget("gates", Gates as React.FC<{ w: never }>);
