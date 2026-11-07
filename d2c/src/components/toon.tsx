// Shared pieces for cartoon-look reels (used by the hisaab → cartoon remakes, 7 Nov 2026).
import React from "react";
import { AbsoluteFill, Audio, interpolate, Sequence, staticFile, useCurrentFrame } from "remotion";
import { Doctor, PoseKey } from "./Doctor";
import { Camera, Swipes } from "./fx";
import { CtaFlow, LINE, Place } from "./format";
import { Chip, Grade, Grain, Logo, SceneShell, Sfx, Vignette, clamp } from "./kit";
import { Captions, TopBar } from "./overlay";
import { Clinic, Whiteboard } from "./sets";
import { SceneTiming } from "../lib/timeline";
import { C, theme } from "../theme";

export const big = (size: number, color: string = LINE): React.CSSProperties => ({ fontFamily: theme.fonts.display, fontWeight: 700, fontSize: size, lineHeight: 1.05, color, whiteSpace: "nowrap" });
export const body = (size: number, color: string = LINE): React.CSSProperties => ({ fontFamily: theme.fonts.body, fontWeight: 800, fontSize: size, color, whiteSpace: "nowrap" });
export const ramp = (f: number, a: number, b: number) => interpolate(f, [a, b], [0, 1], { ...clamp, easing: theme.ease.out });

type TL = {
  scenes: SceneTiming[];
  sceneFrames: (id: string) => { from: number; dur: number };
  sceneById: (id: string) => SceneTiming;
};

/** Full cartoon reel: scenes + voice, karaoke captions, swipes, top bar, finish. */
export const CartoonReel: React.FC<{ tag: string; ids: string[]; map: Record<string, React.FC<{ dur: number }>>; T: TL; captionTop?: number }> = ({ tag, ids, map, T, captionTop = 1440 }) => {
  const cuts = ids.slice(1).map((id) => T.sceneFrames(id).from);
  return (
    <AbsoluteFill style={{ background: C.paper }}>
      {ids.map((id) => {
        const { from, dur } = T.sceneFrames(id);
        const Comp = map[id];
        const t = T.sceneById(id);
        return (
          <Sequence key={id} from={from} durationInFrames={dur} name={id}>
            <Comp dur={dur} />
            {t.audio && <Audio src={staticFile(t.audio)} />}
          </Sequence>
        );
      })}
      <Captions scenes={T.scenes} karaoke top={captionTop} />
      <Swipes at={cuts} />
      <TopBar tag={tag} />
      <Grade />
      <Grain />
      <Vignette />
    </AbsoluteFill>
  );
};

/** Thick-outline card used across the cartoon reels. */
export const Panel: React.FC<{ style?: React.CSSProperties; children?: React.ReactNode; bg?: string }> = ({ style, children, bg = C.white }) => (
  <div style={{ background: bg, border: `6px solid ${LINE}`, borderRadius: 26, boxShadow: `8px 8px 0 ${LINE}`, boxSizing: "border-box", ...style }}>{children}</div>
);

/** Rises in at `at` (fade + lift + scale). */
export const Pop: React.FC<{ at: number; children: React.ReactNode; style?: React.CSSProperties; dist?: number }> = ({ at, children, style, dist = 40 }) => {
  const f = useCurrentFrame();
  const p = ramp(f, at - 8, at + 4);
  return <div style={{ opacity: p, transform: `translateY(${(1 - p) * dist}px) scale(${0.92 + 0.08 * p})`, ...style }}>{children}</div>;
};

/** Doctor at the whiteboard with three fixes ticked on cue. */
export const FixBoard: React.FC<{
  dur: number;
  marks: number[];
  fixes: React.ReactNode[];
  title?: string;
  sub?: React.ReactNode;
  mouth: (f: number) => number;
  tag: string;
  fontSize?: number;
}> = ({ dur, marks, fixes, title = "ILAAJ", sub, mouth, tag, fontSize = 40 }) => {
  const frame = useCurrentFrame();
  const poses: PoseKey[] = [
    { at: -100, pose: "one" },
    { at: marks[1] - 6, pose: "two" },
    { at: marks[2] - 6, pose: "three" },
  ];
  return (
    <SceneShell dur={dur} noExit>
      <Camera dur={dur} push={0.02}>
        <Clinic />
        <Whiteboard style={{ left: 230, top: 300, width: 800, height: 640 }}>
          <div style={{ position: "absolute", left: 30, top: 24 }}>
            <Chip size={26} bg={C.green}>
              {title}
            </Chip>
          </div>
          {sub && (
            <div style={{ position: "absolute", left: 30, right: 30, top: 96, display: "flex", justifyContent: "center" }}>
              <div style={{ background: C.lavenderSoft, borderRadius: 14, padding: "10px 16px 6px", ...body(28, C.violetDeep) }}>{sub}</div>
            </div>
          )}
          <div style={{ position: "absolute", left: 40, right: 30, top: sub ? 190 : 120, display: "flex", flexDirection: "column", gap: 30 }}>
            {fixes.map((t, i) => {
              const p = ramp(frame, marks[i] - 6, marks[i] + 4);
              return (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 18, opacity: p, transform: `translateX(${(1 - p) * 60}px)` }}>
                  <div style={{ width: 64, height: 64, borderRadius: 16, background: C.green, border: `5px solid ${LINE}`, display: "flex", alignItems: "center", justifyContent: "center", ...big(40, C.white), paddingTop: 4, boxSizing: "border-box", flexShrink: 0 }}>✓</div>
                  <div style={{ fontFamily: theme.fonts.display, fontWeight: 700, fontSize, lineHeight: 1.1, color: LINE }}>{t}</div>
                </div>
              );
            })}
          </div>
        </Whiteboard>
        <Place x={-120} y={930} s={0.92} z={4}>
          <Doctor poses={poses} mouth={mouth} brows={marks} caseTag={tag} />
        </Place>
      </Camera>
      <Sfx at={1} name="whoosh" vol={0.4} />
      {marks.map((m, i) => (
        <Sfx key={i} at={m - 5} name="check" vol={0.4} />
      ))}
    </SceneShell>
  );
};

/** Standard ending scene: Doctor + comment keyword → DM gift → next case → follow. */
export const CtaScene: React.FC<{
  dur: number;
  keyword: string;
  typeAt: number;
  giftAt: number;
  giftTitle: string;
  giftSub: string;
  giftIcon?: React.ReactNode;
  nextAt: number;
  nextNum: string;
  nextLabel: string;
  next: React.ReactNode;
  followAt: number;
  mouth: (f: number) => number;
  tag: string;
}> = ({ dur, keyword, typeAt, giftAt, giftTitle, giftSub, giftIcon, nextAt, nextNum, nextLabel, next, followAt, mouth, tag }) => {
  const poses: PoseKey[] = [
    { at: -100, pose: "point" },
    { at: nextAt - 2, pose: "explain" },
    { at: followAt - 4, pose: "thumbs" },
  ];
  return (
    <SceneShell dur={dur} noExit>
      <Camera dur={dur} punches={[typeAt + 12]} push={0.02}>
        <Clinic plus={false} />
        <CtaFlow keyword={keyword} typeAt={typeAt} giftAt={giftAt} giftTitle={giftTitle} giftSub={giftSub} giftIcon={giftIcon} nextAt={nextAt} nextNum={nextNum} nextLabel={nextLabel} next={next} followAt={followAt} />
        <Place x={250} y={1010} s={0.96} z={4}>
          <Doctor poses={poses} mouth={mouth} brows={[typeAt + 8, nextAt]} caseTag={tag} />
        </Place>
      </Camera>
      {Array.from({ length: Math.min(8, keyword.length) }).map((_, i) => (
        <Sfx key={i} at={typeAt + i * 2} name="key" vol={0.4} />
      ))}
      <Sfx at={giftAt - 10} name="pop" vol={0.5} />
      <Sfx at={nextAt - 4} name="whoosh" vol={0.45} />
      <Sfx at={followAt + 12} name="pop" vol={0.55} />
      <Sfx at={followAt + 15} name="ding" vol={0.45} />
    </SceneShell>
  );
};

/** Horizontal stacked bar; each segment grows in at its cue. */
export type Seg = { label: string; amount: string; frac: number; color: string; at: number };
export const StackBar: React.FC<{ segs: Seg[]; w: number; h?: number; total?: string }> = ({ segs, w, h = 120, total }) => {
  const f = useCurrentFrame();
  return (
    <div style={{ width: w }}>
      {total && <div style={{ ...body(30, C.muted), marginBottom: 10 }}>{total}</div>}
      <div style={{ display: "flex", width: w, height: h, border: `6px solid ${LINE}`, borderRadius: 20, overflow: "hidden", background: C.white, boxShadow: `8px 8px 0 ${LINE}` }}>
        {segs.map((s, i) => {
          const p = ramp(f, s.at - 6, s.at + 8);
          return <div key={i} style={{ width: `${s.frac * 100 * p}%`, height: "100%", background: s.color, borderRight: p > 0.05 && i < segs.length - 1 ? `5px solid ${LINE}` : undefined, boxSizing: "border-box" }} />;
        })}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 14, marginTop: 26 }}>
        {segs.map((s, i) => {
          const p = ramp(f, s.at - 6, s.at + 4);
          return (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 18, opacity: p, transform: `translateX(${(1 - p) * 40}px)` }}>
              <div style={{ width: 40, height: 40, borderRadius: 10, background: s.color, border: `5px solid ${LINE}`, flexShrink: 0 }} />
              <div style={{ ...big(44), flex: 1 }}>{s.label}</div>
              <div style={big(52, s.color === C.white ? LINE : LINE)}>{s.amount}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

/** Half-circle meter 0..max with a red zone below `line`, needle at `value`. */
export const Gauge: React.FC<{ value: number; line: number; max?: number; w?: number; lineLabel?: string; p?: number }> = ({ value, line, max = 5, w = 620, lineLabel, p = 1 }) => {
  const r = 250;
  const ang = (v: number) => Math.PI - (v / max) * Math.PI;
  const pt = (v: number, rr: number) => [300 + Math.cos(ang(v)) * rr, 300 - Math.sin(ang(v)) * rr];
  const arc = (a: number, b: number) => {
    const [x1, y1] = pt(a, r);
    const [x2, y2] = pt(b, r);
    return `M${x1} ${y1} A${r} ${r} 0 0 1 ${x2} ${y2}`;
  };
  const needle = pt(value * p, r - 50);
  const [lx, ly] = pt(line, r + 46);
  return (
    <svg width={w} height={w * 0.62} viewBox="0 0 600 372" style={{ overflow: "visible" }}>
      <path d={arc(0, line)} stroke={C.red} strokeWidth={56} fill="none" />
      <path d={arc(line, max)} stroke={C.green} strokeWidth={56} fill="none" />
      <path d={`M${300 - r - 28} 300 A${r + 28} ${r + 28} 0 0 1 ${300 + r + 28} 300`} stroke={LINE} strokeWidth={6} fill="none" />
      <path d={`M${300 - r + 28} 300 A${r - 28} ${r - 28} 0 0 1 ${300 + r - 28} 300`} stroke={LINE} strokeWidth={6} fill="none" />
      {(() => {
        const [a1, b1] = pt(line, r - 34);
        const [a2, b2] = pt(line, r + 34);
        return <line x1={a1} y1={b1} x2={a2} y2={b2} stroke={LINE} strokeWidth={10} />;
      })()}
      {lineLabel && (
        <text x={lx} y={ly} textAnchor="middle" fontFamily="Poppins" fontWeight={700} fontSize={34} fill={LINE}>
          {lineLabel}
        </text>
      )}
      <line x1={300} y1={300} x2={needle[0]} y2={needle[1]} stroke={LINE} strokeWidth={14} strokeLinecap="round" />
      <circle cx={300} cy={300} r={26} fill={LINE} />
      {[0, max].map((v) => {
        const [x, y] = pt(v, r);
        return (
          <text key={v} x={x} y={y + 64} textAnchor="middle" fontFamily="Poppins" fontWeight={700} fontSize={34} fill={C.muted}>
            {v}
          </text>
        );
      })}
    </svg>
  );
};

/** Cover inside the 3:4 grid crop (y 240–1680): tag + logo, two title boxes, a visual below. */
export const ToonCover: React.FC<{ tag: string; line1: React.ReactNode; line2: React.ReactNode; color?: string; size1?: number; size2?: number; set?: React.ReactNode; children?: React.ReactNode }> = ({ tag, line1, line2, color = C.red, size1 = 86, size2 = 96, set, children }) => (
  <AbsoluteFill style={{ background: C.paper }}>
    {set}
    <div style={{ position: "absolute", top: 290, left: 84, right: 84, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 14, background: C.white, border: `3px solid ${LINE}`, borderRadius: 999, padding: "12px 24px 12px 20px", fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 32, letterSpacing: "0.1em", color: LINE, boxShadow: `5px 5px 0 ${LINE}` }}>
        <div style={{ width: 18, height: 18, borderRadius: "50%", background: C.red }} />
        {tag}
      </div>
      <div style={{ background: C.white, borderRadius: 18, padding: "8px 12px" }}>
        <Logo width={180} />
      </div>
    </div>
    <div style={{ position: "absolute", top: 430, left: 40, right: 40, display: "flex", flexDirection: "column", alignItems: "center", gap: 22 }}>
      <div style={{ ...big(size1), lineHeight: 1, background: C.white, border: `8px solid ${LINE}`, borderRadius: 30, padding: "22px 36px 4px", boxShadow: `10px 10px 0 ${LINE}`, transform: "rotate(-2deg)" }}>{line1}</div>
      <div style={{ ...big(size2, C.white), lineHeight: 1, background: color, border: `8px solid ${LINE}`, borderRadius: 30, padding: "22px 36px 4px", boxShadow: `10px 10px 0 ${LINE}`, transform: "rotate(2deg)" }}>{line2}</div>
    </div>
    {children}
    <Grade />
    <Grain />
    <Vignette />
  </AbsoluteFill>
);

/** Cartoon phone: thick navy bezel, white screen; children fill the screen (position absolute inside). */
export const ToonPhone: React.FC<{ w?: number; h?: number; children?: React.ReactNode; style?: React.CSSProperties; screen?: string }> = ({ w = 420, h = 760, children, style, screen = C.white }) => (
  <div style={{ position: "relative", width: w, height: h, background: LINE, borderRadius: w * 0.13, padding: w * 0.035, boxSizing: "border-box", boxShadow: `10px 12px 0 rgba(18,4,75,0.18)`, ...style }}>
    <div style={{ position: "relative", width: "100%", height: "100%", borderRadius: w * 0.1, overflow: "hidden", background: screen }}>
      {children}
      <div style={{ position: "absolute", left: "50%", top: w * 0.03, width: w * 0.28, height: w * 0.06, marginLeft: -w * 0.14, borderRadius: 99, background: LINE }} />
    </div>
  </div>
);

/** Round tick / cross chip. */
export const Verdict: React.FC<{ ok: boolean; text: string; size?: number }> = ({ ok, text, size = 34 }) => (
  <Chip size={size} bg={ok ? C.green : C.red} border={LINE}>
    {text} {ok ? "✓" : "✗"}
  </Chip>
);
