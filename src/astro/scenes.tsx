// The scene layouts an Astro 24x7 reel can use. Each one is a small explainer graphic.
import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { Body, Burst, Chip, DownArrow, Headline, Kundli, Moon, Person, Planet, Pop, Rise, sticker, useWordFrame, W } from "./parts";
import { astro, rgba } from "./theme";

const C = astro.colors;
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

export type AstroScene = {
  visual: "crowd" | "question" | "moon" | "kundli" | "clock" | "twins" | "cta" | "point";
  voiceover: string;
  kicker?: string;
  headline?: string;
  highlight?: string;
  body?: string;
  statValue?: number;
  statSuffix?: string;
  youLabel?: string;
  youWord?: string;
  sameWord?: string;
  stamp?: string;
  stampWord?: string;
  badge?: { text: string; word?: string };
  linkWord?: string;
  pills?: { text: string; word?: string }[];
  lagnaLabel?: string;
  lagnaWord?: string;
  compare?: { label: string; value: string; weight: number }[];
  revealWord?: string;
  labels?: string[];
  times?: string[];
  shiftWord?: string;
  commentPrefix?: string;
  commentWords?: string[];
  teaserTag?: string;
  teaser?: string;
  button?: string;
  startMs: number;
  endMs: number;
};

type P = { scene: AstroScene; words: W[] };

const Column: React.FC<{ children: React.ReactNode; gap?: number }> = ({ children, gap = 34 }) => (
  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap, width: "100%" }}>{children}</div>
);

// Big number in the sticker style: orange fill, black outline, hard black shadow.
const bigNumber = (size: number): React.CSSProperties => ({
  fontFamily: astro.fonts.display,
  fontSize: size,
  lineHeight: 1,
  color: C.orange,
  WebkitTextStroke: `${Math.round(size * 0.03)}px ${C.ink}`,
  paintOrder: "stroke fill",
  textShadow: `${Math.round(size * 0.035)}px ${Math.round(size * 0.04)}px 0 ${C.ink}`,
  fontVariantNumeric: "tabular-nums",
});

// ---------- crowd: "12 करोड़ लोग / एक ही राशिफल?" (the hook: full frame from frame 0) ----------

export const CrowdScene: React.FC<P> = ({ scene, words }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const youAt = useWordFrame(words, scene.startMs, scene.youWord, 45);
  const sameAt = useWordFrame(words, scene.startMs, scene.sameWord, 75);
  const slam = spring({ frame: frame + 2, fps, config: { damping: 11, stiffness: 210, mass: 0.6 } });
  const cols = 9;
  const rows = 4;
  const cell = 84;
  const gx = 18;
  const gy = 16;
  const you = { r: 1, c: 4 };
  const youIn = spring({ frame: frame - youAt, fps, config: astro.spring.bouncy });
  const after = interpolate(frame, [sameAt, sameAt + 6], [0, 1], clamp);
  const isSame = (r: number, c: number) => !(r === you.r && c === you.c) && (r * 5 + c * 3) % 7 === 2;
  const ring = frame >= youAt ? ((frame - youAt) % 30) / 30 : 0;
  return (
    <Column gap={22}>
      {scene.kicker ? <Chip text={scene.kicker} delay={-5} /> : null}
      <div
        style={{
          display: "flex",
          alignItems: "baseline",
          gap: 24,
          transform: `scale(${interpolate(slam, [0, 1], [1.45, 1])}) rotate(${interpolate(slam, [0, 1], [-7, 0])}deg)`,
        }}
      >
        <span style={bigNumber(250)}>{scene.statValue}</span>
        <span style={{ fontFamily: astro.fonts.display, fontSize: 118, lineHeight: 1, color: C.ink }}>{scene.statSuffix}</span>
      </div>
      {scene.headline ? <Headline text={scene.headline} highlight={scene.highlight} size={112} delay={6} /> : null}
      <div style={{ position: "relative", display: "grid", gridTemplateColumns: `repeat(${cols}, ${cell}px)`, gap: `${gy}px ${gx}px`, marginTop: 14 }}>
        {Array.from({ length: cols * rows }).map((_, i) => {
          const r = Math.floor(i / cols);
          const c = i % cols;
          const isYou = r === you.r && c === you.c;
          const same = isSame(r, c);
          const dist = Math.abs(r - 1.5) + Math.abs(c - 4);
          const s = spring({ frame: frame + 12 - dist * 1.5, fps, config: astro.spring.snappy });
          const sameP = same ? spring({ frame: frame - sameAt - (i % 6), fps, config: astro.spring.bouncy }) : 0;
          const color = isYou ? C.ink : same && frame >= sameAt ? C.orange : "#FDB27C";
          const opacity = isYou || same ? 1 : 1 - after * 0.55;
          const scale = isYou ? 1 + 0.22 * youIn : 1 + 0.18 * Math.sin(Math.PI * Math.min(1, sameP));
          return (
            <div key={i} style={{ opacity: s * opacity, transform: `translateY(${interpolate(s, [0, 1], [26, 0])}px) scale(${scale})` }}>
              <Person size={cell} color={color} outline={isYou || (same && frame >= sameAt)} />
            </div>
          );
        })}
        {/* pulsing ring + label on "you" */}
        <div
          style={{
            position: "absolute",
            left: you.c * (cell + gx) + cell / 2 - 80,
            top: you.r * (cell * 1.25 + gy) + (cell * 1.25) / 2 - 80,
            width: 160,
            height: 160,
            borderRadius: 80,
            border: `6px solid ${C.orange}`,
            opacity: youIn > 0.05 ? (1 - ring) * 0.9 : 0,
            transform: `scale(${0.6 + ring * 0.8})`,
          }}
        />
        {scene.youLabel ? (
          <div
            style={{
              position: "absolute",
              left: you.c * (cell + gx) + cell / 2,
              top: you.r * (cell * 1.25 + gy) - 96,
              opacity: youIn,
              transform: `translateX(-50%) translateY(${interpolate(youIn, [0, 1], [24, 0])}px) scale(${interpolate(youIn, [0, 1], [0.5, 1])})`,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <div style={{ padding: "4px 26px 8px", borderRadius: 16, background: C.ink, color: C.white, fontFamily: astro.fonts.body, fontWeight: 800, fontSize: 44, boxShadow: `5px 5px 0 ${C.orange}` }}>
              {scene.youLabel}
            </div>
            <svg width="28" height="16" viewBox="0 0 28 16" aria-hidden="true">
              <path d="M0 0 L14 16 L28 0 Z" fill={C.ink} />
            </svg>
          </div>
        ) : null}
      </div>
    </Column>
  );
};

// ---------- question + stamp ----------

const DayCard: React.FC = () => (
  <div style={{ width: 168, height: 204, borderRadius: 24, background: C.white, ...sticker(C.ink, 7), overflow: "hidden", display: "flex", flexDirection: "column", alignItems: "center", boxSizing: "border-box" }}>
    <div style={{ width: "100%", height: 56, background: C.orange, borderBottom: `4px solid ${C.ink}`, color: C.white, fontFamily: astro.fonts.body, fontWeight: 800, fontSize: 36, display: "flex", alignItems: "center", justifyContent: "center" }}>
      आज
    </div>
    <svg width="104" height="104" viewBox="0 0 96 96" style={{ marginTop: 12 }} aria-hidden="true">
      <circle cx="48" cy="48" r="20" fill={C.orange} stroke={C.ink} strokeWidth="4" />
      {Array.from({ length: 8 }).map((_, i) => (
        <line key={i} x1="48" y1="10" x2="48" y2="20" stroke={C.ink} strokeWidth="6" strokeLinecap="round" transform={`rotate(${i * 45} 48 48)`} />
      ))}
    </svg>
  </div>
);

const QMark: React.FC<{ at: number; gone: number; x: number; y: number; size: number; tilt: number }> = ({ at, gone, x, y, size, tilt }) => {
  const frame = useCurrentFrame();
  const out = interpolate(frame, [gone, gone + 5], [1, 0], clamp);
  return (
    <div style={{ position: "absolute", left: x, top: y, transform: `scale(${out}) rotate(${tilt + Math.sin(frame / 7 + x) * 8}deg)` }}>
      <Pop at={at} from={0.2}>
        <span style={{ ...bigNumber(size), display: "block" }}>?</span>
      </Pop>
    </div>
  );
};

export const QuestionScene: React.FC<P> = ({ scene, words }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const stampAt = useWordFrame(words, scene.startMs, scene.stampWord, 50);
  const s = spring({ frame: frame - stampAt, fps, config: { damping: 9, stiffness: 230, mass: 0.7 } });
  const dim = interpolate(frame, [stampAt, stampAt + 6], [1, 0.35], clamp);
  const settled = frame >= stampAt;
  const bounce = Math.abs(Math.sin(frame / 8)) * 14;
  return (
    <Column gap={70}>
      {scene.headline ? <Headline text={scene.headline} highlight={scene.highlight} size={148} delay={0} /> : null}
      <div style={{ position: "relative", display: "flex", gap: 18, marginTop: 30 }}>
        {Array.from({ length: 5 }).map((_, i) => (
          <Rise key={i} delay={4 + i * 3} y={60} style={{ opacity: dim }}>
            <div style={{ transform: `translateY(${settled ? 0 : Math.sin((frame + i * 7) / 8) * 10}px)` }}>
              <DayCard />
            </div>
          </Rise>
        ))}
        <QMark at={8} gone={stampAt} x={-40} y={-190} size={170} tilt={-14} />
        <QMark at={13} gone={stampAt} x={780} y={-200} size={190} tilt={12} />
        <QMark at={18} gone={stampAt} x={400} y={200} size={130} tilt={-6} />
        {scene.stamp ? (
          <div style={{ position: "absolute", inset: -40, display: "flex", alignItems: "center", justifyContent: "center", pointerEvents: "none" }}>
            <div
              style={{
                padding: "0px 70px 18px",
                border: `14px solid ${C.ink}`,
                borderRadius: 34,
                background: C.orange,
                fontFamily: astro.fonts.display,
                fontSize: 220,
                lineHeight: 1.1,
                color: C.white,
                opacity: interpolate(s, [0, 0.2], [0, 1], clamp),
                transform: `rotate(-9deg) scale(${interpolate(s, [0, 1], [2.4, 1])})`,
                boxShadow: `14px 14px 0 ${C.ink}`,
              }}
            >
              {scene.stamp}
            </div>
          </div>
        ) : null}
      </div>
      {scene.body ? (
        <Pop at={stampAt + 14} from={0.4}>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div style={{ padding: "8px 32px 12px", borderRadius: 999, background: C.ink, color: C.white, ...sticker(C.orange, 6), fontFamily: astro.fonts.body, fontWeight: 800, fontSize: 50 }}>
              {scene.body}
            </div>
            <div style={{ transform: `translateY(${bounce}px)` }}>
              <DownArrow color={C.orange} size={70} />
            </div>
          </div>
        </Pop>
      ) : null}
    </Column>
  );
};

// ---------- moon / newspaper rashifal ----------

const Newspaper: React.FC = () => (
  <div style={{ width: 320, height: 390, borderRadius: 20, background: C.white, ...sticker(C.ink, 10), padding: "28px 30px", boxSizing: "border-box", display: "flex", flexDirection: "column", gap: 18 }}>
    <div style={{ fontFamily: astro.fonts.display, fontSize: 60, color: C.ink, lineHeight: 1.05 }}>राशिफल</div>
    <div style={{ height: 7, background: C.ink, borderRadius: 4 }} />
    {[0.95, 0.8, 0.9, 0.7, 0.85, 0.6].map((w, i) => (
      <div key={i} style={{ height: 16, width: `${w * 100}%`, background: rgba(C.inkSoft, 0.25), borderRadius: 8 }} />
    ))}
  </div>
);

export const MoonScene: React.FC<P> = ({ scene, words }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const badgeAt = useWordFrame(words, scene.startMs, scene.badge?.word, 40);
  const linkAt = useWordFrame(words, scene.startMs, scene.linkWord, 80);
  const link = interpolate(frame, [linkAt - 2, linkAt + 12], [0, 1], { ...clamp, easing: astro.ease.out });
  const boost = spring({ frame: frame - linkAt, fps, config: astro.spring.bouncy });
  const float = Math.sin(frame / 22) * 10;
  return (
    <Column gap={26}>
      {scene.kicker ? <Chip text={scene.kicker} /> : null}
      <div style={{ position: "relative", width: 940, height: 600 }}>
        <Rise delay={2} y={60} style={{ position: "absolute", right: -10, top: 0 }}>
          <div style={{ transform: `translateY(${float}px) scale(${1 + 0.08 * Math.sin(Math.PI * Math.min(1, boost))})` }}>
            <Moon size={560} glowBoost={frame >= linkAt ? 1 : 0} />
          </div>
        </Rise>
        <Rise delay={6} y={80} style={{ position: "absolute", left: 20, top: 170 }}>
          <div style={{ transform: `rotate(${-8 + Math.sin(frame / 18) * 1.5}deg)` }}>
            <Newspaper />
          </div>
        </Rise>
        {/* paper -> moon arrow */}
        <svg width="940" height="600" style={{ position: "absolute", inset: 0, overflow: "visible" }} aria-hidden="true">
          <path d="M 330 250 C 400 120, 470 110, 560 190" fill="none" stroke={C.ink} strokeWidth="9" strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - link} />
          <path d="M 528 160 L 566 196 L 516 206" fill="none" stroke={C.ink} strokeWidth="9" strokeLinecap="round" strokeLinejoin="round" opacity={link > 0.92 ? 1 : 0} />
        </svg>
        {scene.badge ? (
          <Pop at={badgeAt} from={0.2} rotate={7} style={{ position: "absolute", left: 210, top: 120 }}>
            <div style={{ padding: "8px 28px 12px", borderRadius: 18, background: C.orange, ...sticker(C.ink, 6), color: C.white, fontFamily: astro.fonts.body, fontWeight: 800, fontSize: 46 }}>
              {scene.badge.text}
            </div>
          </Pop>
        ) : null}
      </div>
      {scene.headline ? <Headline text={scene.headline} highlight={scene.highlight} size={118} delay={10} /> : null}
      {scene.body ? <Body text={scene.body} delay={Math.max(24, linkAt - 16)} /> : null}
    </Column>
  );
};

// ---------- kundli: 12 houses, 9 planets, lagna ----------

const PLANETS: Planet[] = [
  { name: "रा", house: 3 },
  { name: "चं", house: 4 },
  { name: "सू", house: 5 },
  { name: "बु", house: 6, dy: -100 },
  { name: "शु", house: 7 },
  { name: "के", house: 9 },
  { name: "मं", house: 10 },
  { name: "गु", house: 11 },
  { name: "श", house: 12 },
];

const Pill: React.FC<{ text: string; at: number; hero?: boolean }> = ({ text, at, hero }) => (
  <Pop at={at} from={0.3} rotate={hero ? -3 : 0}>
    <div
      style={{
        padding: "10px 36px 14px",
        borderRadius: 999,
        background: hero ? C.orange : C.white,
        color: hero ? C.white : C.ink,
        ...sticker(C.ink, 6),
        fontFamily: astro.fonts.body,
        fontWeight: 800,
        fontSize: 52,
      }}
    >
      {text}
    </div>
  </Pop>
);

export const KundliScene: React.FC<P> = ({ scene, words }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pills = scene.pills ?? [];
  const pillAt = pills.map((p, i) => useWordFrame(words, scene.startMs, p.word, 20 + i * 30)); // eslint-disable-line react-hooks/rules-of-hooks
  const lagnaAt = useWordFrame(words, scene.startMs, scene.lagnaWord, 120);
  const draw = interpolate(frame, [0, 24], [0, 1], { ...clamp, easing: astro.ease.inOut });
  const numbersIn = interpolate(frame, [pillAt[0] ?? 20, (pillAt[0] ?? 20) + 14], [0, 12], clamp);
  const planetsIn = interpolate(frame, [pillAt[1] ?? 50, (pillAt[1] ?? 50) + 14], [0, 9], clamp);
  const lagnaFill = spring({ frame: frame - lagnaAt, fps, config: astro.spring.smooth });
  const size = 690;
  const k = size / 640;
  return (
    <Column gap={26}>
      {scene.kicker ? <Chip text={scene.kicker} /> : null}
      <div style={{ position: "relative", transform: `scale(${1 + 0.035 * lagnaFill}) rotate(${interpolate(draw, [0, 1], [-4, 0])}deg)` }}>
        <Kundli size={size} draw={draw} numbersIn={numbersIn} lagna={1} lagnaFill={lagnaFill} lagnaLabel={scene.lagnaLabel} planets={PLANETS} planetsIn={planetsIn} />
        <Burst at={lagnaAt} x={(300 + 12) * k} y={(150 + 12) * k} radius={200} />
      </div>
      <div style={{ display: "flex", gap: 22 }}>
        {pills.map((p, i) => (
          <Pill key={i} text={p.text} at={pillAt[i]} hero={i === pills.length - 1} />
        ))}
      </div>
      {scene.body ? <Body text={scene.body} delay={lagnaAt + 10} /> : null}
    </Column>
  );
};

// ---------- clock: how fast the lagna changes ----------

const Wheel: React.FC<{ size: number; frame: number }> = ({ size, frame }) => {
  const fast = frame * 5;
  const slow = -30 + frame * 0.12;
  return (
    <svg width={size} height={size} viewBox="-232 -232 470 470" aria-hidden="true">
      <circle r="212" cx="12" cy="12" fill={C.ink} />
      <circle r="212" fill={C.white} stroke={C.ink} strokeWidth="8" />
      <circle r="150" fill="none" stroke={rgba(C.ink, 0.2)} strokeWidth="3" />
      {Array.from({ length: 12 }).map((_, i) => (
        <line key={i} x1="0" y1="-150" x2="0" y2="-212" stroke={C.ink} strokeWidth="4" transform={`rotate(${i * 30})`} />
      ))}
      {Array.from({ length: 12 }).map((_, i) => (
        <text key={`t${i}`} x="0" y="-168" textAnchor="middle" fontFamily="Mukta, sans-serif" fontWeight={800} fontSize="26" fill={C.inkSoft} transform={`rotate(${i * 30 + 15}) rotate(${-(i * 30 + 15)} 0 -177)`}>
          {i + 1}
        </text>
      ))}
      <g transform={`rotate(${slow})`}>
        <line x1="0" y1="0" x2="0" y2="-120" stroke={rgba(C.inkSoft, 0.7)} strokeWidth="10" strokeLinecap="round" />
        <circle cx="0" cy="-130" r="24" fill="#FFE7CC" stroke={C.ink} strokeWidth="5" />
      </g>
      {/* motion trail behind the fast hand */}
      {Array.from({ length: 6 }).map((_, j) => (
        <line key={`g${j}`} x1="0" y1="0" x2="0" y2="-185" stroke={C.orange} strokeWidth="12" strokeLinecap="round" opacity={0.18 * (1 - j / 6)} transform={`rotate(${fast - (j + 1) * 7})`} />
      ))}
      <g transform={`rotate(${fast})`}>
        <line x1="0" y1="0" x2="0" y2="-185" stroke={C.orange} strokeWidth="13" strokeLinecap="round" />
        <circle cx="0" cy="-185" r="16" fill={C.orange} stroke={C.ink} strokeWidth="4" />
      </g>
      <circle r="20" fill={C.ink} />
    </svg>
  );
};

export const ClockScene: React.FC<P> = ({ scene, words }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const revealAt = useWordFrame(words, scene.startMs, scene.revealWord, 70);
  const s = spring({ frame: frame - revealAt, fps, config: astro.spring.bouncy });
  const rows = scene.compare ?? [];
  return (
    <Column gap={26}>
      <Rise delay={0} y={60}>
        <div style={{ transform: `rotate(${interpolate(frame, [0, 12], [-25, 0], clamp)}deg)` }}>
          <Wheel size={470} frame={frame} />
        </div>
      </Rise>
      <div style={{ position: "relative", display: "flex", alignItems: "baseline", gap: 22, fontFamily: astro.fonts.display, opacity: interpolate(s, [0, 0.3], [0, 1], clamp), transform: `scale(${interpolate(s, [0, 1], [0.5, 1])})` }}>
        <span style={{ fontSize: 70, color: C.ink }}>हर</span>
        <span style={bigNumber(210)}>{scene.statValue}</span>
        <span style={{ fontSize: 116, lineHeight: 1, color: C.ink }}>{scene.statSuffix}</span>
        <Burst at={revealAt} x={250} y={80} radius={260} count={10} />
      </div>
      {scene.headline ? <Headline text={scene.headline} size={84} delay={revealAt + 4} color={C.inkSoft} /> : null}
      <div style={{ width: 900, display: "flex", flexDirection: "column", gap: 22 }}>
        {rows.map((r, i) => {
          const at = i === 0 ? 6 : revealAt;
          const g = interpolate(frame, [at, at + 20], [0, 1], { ...clamp, easing: astro.ease.out });
          const last = i === rows.length - 1;
          return (
            <Rise key={i} delay={at} y={20}>
              <div style={{ display: "flex", justifyContent: "space-between", fontFamily: astro.fonts.body, fontWeight: 800, fontSize: 46, color: C.ink, marginBottom: 8 }}>
                <span>{r.label}</span>
                <span style={{ color: last ? C.orangeDeep : C.inkSoft }}>{r.value}</span>
              </div>
              <div style={{ height: 28, borderRadius: 14, background: C.white, border: `4px solid ${C.ink}`, overflow: "hidden" }}>
                <div style={{ width: `${Math.max(4, r.weight * 100) * g}%`, height: "100%", background: last ? C.orange : C.orangeSoft }} />
              </div>
            </Rise>
          );
        })}
      </div>
    </Column>
  );
};

// ---------- twins: same day, different lagna ----------

const NotEqual: React.FC<{ on: number }> = ({ on }) => (
  <svg width="110" height="110" viewBox="0 0 110 110" aria-hidden="true">
    <g stroke={on > 0.5 ? C.orange : C.ink} strokeWidth="14" strokeLinecap="round">
      <line x1="16" y1="40" x2="94" y2="40" />
      <line x1="16" y1="72" x2="94" y2="72" />
    </g>
    <line x1="74" y1="10" x2="36" y2="100" stroke={C.ink} strokeWidth="14" strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - on} />
  </svg>
);

export const TwinsScene: React.FC<P> = ({ scene, words }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const shiftAt = useWordFrame(words, scene.startMs, scene.shiftWord, 90);
  const draw = interpolate(frame, [2, 24], [0, 1], { ...clamp, easing: astro.ease.inOut });
  const firstFill = spring({ frame: frame - 22, fps, config: astro.spring.smooth });
  const shifted = frame >= shiftAt;
  const flash = spring({ frame: frame - shiftAt, fps, config: astro.spring.bouncy });
  const neq = interpolate(frame, [shiftAt, shiftAt + 8], [0, 1], { ...clamp, easing: astro.ease.out });
  const base = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
  const moved = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 1];
  const labels = scene.labels ?? ["", ""];
  const times = scene.times ?? [];
  const k = 400 / 640;
  return (
    <Column gap={34}>
      {scene.kicker ? <Chip text={scene.kicker} dark /> : null}
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        {[0, 1].map((i) => (
          <React.Fragment key={i}>
            {i === 1 ? (
              <Pop at={10} from={0.3}>
                <div style={{ transform: `scale(${1 + 0.35 * Math.sin(Math.PI * Math.min(1, neq))})` }}>
                  <NotEqual on={neq} />
                </div>
              </Pop>
            ) : null}
            <Rise delay={i * 5} y={60}>
              <div style={{ position: "relative", display: "flex", flexDirection: "column", alignItems: "center", gap: 12, transform: i === 1 && shifted ? `scale(${1 + 0.07 * Math.sin(Math.PI * Math.min(1, flash))}) rotate(${4 * Math.sin(Math.PI * Math.min(1, flash))}deg)` : undefined }}>
                <Kundli size={400} draw={draw} numbersIn={12} numbers={i === 1 && shifted ? moved : base} lagna={1} lagnaFill={i === 1 && shifted ? flash : firstFill} />
                {i === 1 ? <Burst at={shiftAt} x={(300 + 12) * k} y={(150 + 12) * k} radius={170} /> : null}
                <div style={{ fontFamily: astro.fonts.body, fontWeight: 800, fontSize: 46, color: C.ink, lineHeight: 1.1 }}>{labels[i]}</div>
                {times[i] ? (
                  <div style={{ padding: "2px 22px 6px", borderRadius: 14, background: i === 1 ? C.orange : C.white, color: i === 1 ? C.white : C.ink, ...sticker(C.ink, 5), fontFamily: astro.fonts.body, fontWeight: 800, fontSize: 40 }}>
                    {times[i]}
                  </div>
                ) : null}
              </div>
            </Rise>
          </React.Fragment>
        ))}
      </div>
      {scene.headline ? <Headline text={scene.headline} highlight={scene.highlight} size={112} delay={12} /> : null}
    </Column>
  );
};

// ---------- CTA ----------

const segment = (s: string): string[] => {
  const Seg = (Intl as unknown as { Segmenter?: new (l: string, o: { granularity: string }) => { segment: (x: string) => Iterable<{ segment: string }> } }).Segmenter;
  return Seg ? Array.from(new Seg("hi", { granularity: "grapheme" }).segment(s), (x) => x.segment) : Array.from(s);
};

const CommentBox: React.FC<{ prefix: string; options: string[]; at: number }> = ({ prefix, options, at }) => {
  const frame = useCurrentFrame();
  const t = Math.max(0, frame - at - 6);
  const per = 34;
  const word = options.length ? options[Math.floor(t / per) % options.length] : "";
  const g = segment(word);
  const local = t % per;
  const shown = g.slice(0, Math.min(g.length, Math.floor(local / 3) + 1)).join("");
  const cursor = Math.floor(frame / 8) % 2 === 0;
  const heart = 1 + 0.12 * Math.max(0, Math.sin(frame / 6));
  return (
    <Pop at={at} from={0.5}>
      <div style={{ width: 860, boxSizing: "border-box", padding: "22px 30px", borderRadius: 30, background: C.white, ...sticker(C.ink, 8), display: "flex", alignItems: "center", gap: 24 }}>
        <div style={{ width: 86, height: 86, borderRadius: 43, background: C.orangeSoft, border: `4px solid ${C.ink}`, display: "flex", alignItems: "flex-end", justifyContent: "center", overflow: "hidden", flexShrink: 0 }}>
          <Person size={62} color={C.orange} />
        </div>
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 8 }}>
          <div style={{ width: 170, height: 16, borderRadius: 8, background: rgba(C.inkSoft, 0.25) }} />
          <div style={{ fontFamily: astro.fonts.body, fontWeight: 800, fontSize: 52, color: C.ink, lineHeight: 1.15, whiteSpace: "nowrap" }}>
            {prefix} <span style={{ color: C.orangeDeep }}>{shown}</span>
            <span style={{ display: "inline-block", width: 5, height: 50, marginLeft: 4, background: C.ink, verticalAlign: "middle", opacity: cursor ? 1 : 0 }} />
          </div>
        </div>
        <svg width="56" height="56" viewBox="0 0 24 24" style={{ transform: `scale(${heart})`, flexShrink: 0 }} aria-hidden="true">
          <path d="M12 21 C 5 15, 2 12, 2 8 A 5 5 0 0 1 12 6 A 5 5 0 0 1 22 8 C 22 12, 19 15, 12 21 Z" fill={C.orange} stroke={C.ink} strokeWidth="1.6" strokeLinejoin="round" />
        </svg>
      </div>
    </Pop>
  );
};

export const CtaScene: React.FC<P> = ({ scene, words }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const teaserAt = useWordFrame(words, scene.startMs, scene.teaserTag, 80);
  const followAt = useWordFrame(words, scene.startMs, "फॉलो", 140);
  const bounce = Math.abs(Math.sin(frame / 8)) * 16;
  const f = spring({ frame: frame - followAt, fps, config: astro.spring.bouncy });
  const tapAt = followAt + 12;
  const press = frame >= tapAt ? 1 - 0.08 * Math.max(0, 1 - (frame - tapAt) / 6) : 1;
  const ripple = interpolate(frame, [tapAt, tapAt + 18], [0, 1], clamp);
  const breathe = 1 + Math.sin(frame / 12) * 0.025;
  return (
    <Column gap={32}>
      {scene.headline ? <Headline text={scene.headline} highlight={scene.highlight} size={140} delay={0} maxWidth={820} /> : null}
      {scene.body ? (
        <Rise delay={12} y={20}>
          <div style={{ display: "flex", alignItems: "center", gap: 18, fontFamily: astro.fonts.body, fontWeight: 800, fontSize: 60, color: C.ink }}>
            {scene.body}
            <div style={{ transform: `translateY(${bounce}px)` }}>
              <DownArrow color={C.orange} size={66} />
            </div>
          </div>
        </Rise>
      ) : null}
      {scene.commentPrefix ? <CommentBox prefix={scene.commentPrefix} options={scene.commentWords ?? []} at={16} /> : null}
      {scene.teaser ? (
        <Rise delay={teaserAt} y={60}>
          <div style={{ width: 860, boxSizing: "border-box", padding: "30px 36px", borderRadius: 30, background: C.ink, display: "flex", alignItems: "center", gap: 24, boxShadow: `10px 10px 0 ${C.orange}` }}>
            <div style={{ padding: "4px 26px 8px", borderRadius: 999, background: C.orange, color: C.white, fontFamily: astro.fonts.body, fontWeight: 800, fontSize: 46, flexShrink: 0 }}>
              {scene.teaserTag}
            </div>
            <div style={{ fontFamily: astro.fonts.body, fontWeight: 700, fontSize: 50, lineHeight: 1.3, color: C.white }}>{scene.teaser}</div>
          </div>
        </Rise>
      ) : null}
      {scene.button ? (
        <div style={{ position: "relative" }}>
          <div
            style={{
              position: "absolute",
              left: "50%",
              top: "50%",
              width: 520,
              height: 520,
              marginLeft: -260,
              marginTop: -260,
              borderRadius: 260,
              border: `8px solid ${C.orange}`,
              opacity: ripple > 0 ? 1 - ripple : 0,
              transform: `scale(${0.3 + ripple})`,
            }}
          />
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 18,
              padding: "20px 60px 24px",
              borderRadius: 999,
              background: C.orange,
              color: C.white,
              ...sticker(C.ink, 8),
              fontFamily: astro.fonts.body,
              fontWeight: 800,
              fontSize: 62,
              opacity: interpolate(f, [0, 0.3], [0, 1], clamp),
              transform: `scale(${interpolate(f, [0, 1], [0.5, 1]) * breathe * press})`,
            }}
          >
            <svg width="46" height="46" viewBox="0 0 44 44" aria-hidden="true">
              <path d="M22 8 V36 M8 22 H36" stroke={C.white} strokeWidth="7" strokeLinecap="round" />
            </svg>
            {scene.button}
          </div>
        </div>
      ) : null}
    </Column>
  );
};

// ---------- fallback: plain headline + body ----------

export const PointScene: React.FC<P> = ({ scene }) => (
  <Column gap={34}>
    {scene.kicker ? <Chip text={scene.kicker} /> : null}
    {scene.headline ? <Headline text={scene.headline} highlight={scene.highlight} size={130} delay={4} /> : null}
    {scene.body ? <Body text={scene.body} delay={24} /> : null}
  </Column>
);
