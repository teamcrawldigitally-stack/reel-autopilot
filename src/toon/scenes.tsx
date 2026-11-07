// Scenes for the 2D character reel (Reel 3: बुध की बोली).
import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { Burst, findWordFrame, Headline, Pop, sticker, W } from "../astro/parts";
import { astro, rgba } from "../astro/theme";
import { Character, FRIEND, mouthAt, NARRATOR, Pose } from "./Character";

const C = astro.colors;
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

export type ToonScene = {
  visual: "talk" | "pointUp" | "budh" | "elongation" | "ego" | "listen" | "tip" | "ask" | "cta";
  voiceover: string;
  headline?: string;
  accent?: string;
  misWord?: string;
  planetWord?: string;
  reasonWord?: string;
  name?: string;
  nameWord?: string;
  items?: { text: string; word: string; icon?: IconName }[];
  stat?: string;
  statWord?: string;
  withWord?: string;
  nextWord?: string;
  meWord?: string;
  baatWord?: string;
  closeWord?: string;
  astWord?: string;
  heavyWord?: string;
  noWord?: string;
  listenWord?: string;
  keyword?: string;
  teaserTag?: string;
  teaserWord?: string;
  teaser?: string;
  button?: string;
  // generic "tip" scene
  counter?: string;
  counterOf?: string;
  emblem?: "budhRetro" | "budhMargi" | "paper" | "phone" | "chat" | "clock" | "sun" | "koota" | "stat" | "grid";
  // 12 rashi tiles (4 x 3) for the "grid" emblem; a tile lights up when its word is spoken
  grid?: { name: string; sub?: string; word?: string }[];
  highlight?: number[];
  struck?: boolean;
  emblemWord?: string;
  chips?: { text: string; word: string; icon?: IconName }[];
  bubble?: string;
  bubbleWord?: string;
  pose?: Pose;
  poseWord?: string;
  typed?: string;
  // "ask" scene (Q&A format, 7 Nov): नेहा asks on screen (no voice), गुरुजी answers in the voice
  question?: string;
  askerName?: string;
  answerName?: string;
  startMs: number;
  endMs: number;
};

export type TP = { scene: ToonScene; words: W[]; mouth: number[]; start: number };

const useAt = (p: TP, word: string | undefined, fallback: number) => {
  const { fps } = useVideoConfig();
  return findWordFrame(p.words, p.scene.startMs, word, fallback, fps);
};
const useMouth = (p: TP) => {
  const frame = useCurrentFrame();
  return mouthAt(p.mouth, p.start + frame);
};

const Abs: React.FC<{ x: number; y: number; children: React.ReactNode; style?: React.CSSProperties }> = ({ x, y, children, style }) => (
  <div style={{ position: "absolute", left: x, top: y, ...style }}>{children}</div>
);

const Center: React.FC<{ y: number; children: React.ReactNode }> = ({ y, children }) => (
  <div style={{ position: "absolute", left: 60, right: 60, top: y, display: "flex", justifyContent: "center" }}>{children}</div>
);

// A pose timeline: [[frame, pose], ...] -> current + previous pose for the blend.
const usePose = (steps: [number, Pose][]) => {
  const frame = useCurrentFrame();
  let cur: [number, Pose] = steps[0];
  let prev: Pose = steps[0][1];
  for (let i = 0; i < steps.length; i++) {
    if (frame >= steps[i][0]) {
      prev = i > 0 ? steps[i - 1][1] : steps[0][1];
      cur = steps[i];
    }
  }
  return { pose: cur[1], poseAt: cur[0], prevPose: prev };
};

const Bubble: React.FC<{ children: React.ReactNode; tail?: "left" | "right"; dark?: boolean; style?: React.CSSProperties }> = ({ children, tail = "left", dark, style }) => (
  <div style={{ position: "relative", display: "inline-flex", alignItems: "center", gap: 14, padding: "14px 34px 20px", borderRadius: 34, background: dark ? C.ink : C.white, ...sticker(dark ? C.orange : C.ink, 7), fontFamily: astro.fonts.body, fontWeight: 800, fontSize: 60, color: dark ? C.white : C.ink, whiteSpace: "nowrap", ...style }}>
    {children}
    <svg width="54" height="40" viewBox="0 0 54 40" style={{ position: "absolute", bottom: -36, [tail === "left" ? "left" : "right"]: 60 }} aria-hidden="true">
      <path d={tail === "left" ? "M 4 0 L 18 36 L 44 0" : "M 50 0 L 36 36 L 10 0"} fill={dark ? C.ink : C.white} stroke={C.ink} strokeWidth="5" strokeLinejoin="round" />
      <rect x="0" y="-6" width="54" height="9" fill={dark ? C.ink : C.white} />
    </svg>
  </div>
);

const Tick: React.FC<{ size: number; color?: string }> = ({ size, color = "#2F9E44" }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" aria-hidden="true">
    <circle cx="24" cy="24" r="21" fill={color} stroke={C.ink} strokeWidth="4" />
    <path d="M 14 25 L 21 32 L 35 17" fill="none" stroke="#fff" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const Cross: React.FC<{ size: number }> = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" aria-hidden="true">
    <circle cx="24" cy="24" r="21" fill="#E03131" stroke={C.ink} strokeWidth="4" />
    <path d="M 16 16 L 32 32 M 32 16 L 16 32" stroke="#fff" strokeWidth="6" strokeLinecap="round" />
  </svg>
);

// Mercury: small grey-green rocky planet with craters.
export const Budh: React.FC<{ size: number; mystery?: number }> = ({ size, mystery = 0 }) => (
  <svg width={size} height={size} viewBox="-110 -110 220 220" aria-hidden="true" style={{ overflow: "visible" }}>
    <circle r="100" cx="10" cy="10" fill={C.ink} />
    <circle r="100" fill="#8FB3A0" stroke={C.ink} strokeWidth="7" />
    <path d="M 40 -88 A 100 100 0 0 1 40 88 A 120 120 0 0 0 40 -88 Z" fill="#6E9483" />
    {[
      [-34, -30, 20],
      [24, 30, 14],
      [-10, 52, 10],
      [44, -40, 9],
      [-52, 24, 8],
    ].map(([x, y, r], i) => (
      <circle key={i} cx={x} cy={y} r={r} fill="#79A08D" stroke={C.ink} strokeWidth="4" />
    ))}
    <circle r="100" fill={C.ink} opacity={mystery} />
    {mystery > 0.05 ? (
      <text y="38" textAnchor="middle" fontFamily="Rozha One, serif" fontSize="120" fill={C.orange} opacity={mystery}>
        ?
      </text>
    ) : null}
  </svg>
);

export const SunDisc: React.FC<{ size: number; glow?: number; label?: string; labelIn?: number }> = ({ size, glow = 0, label, labelIn = 0 }) => {
  const frame = useCurrentFrame();
  return (
    <svg width={size} height={size} viewBox="-150 -150 300 300" aria-hidden="true" style={{ overflow: "visible" }}>
      <circle r={120 + glow * 40} fill={C.orange} opacity={0.18 + glow * 0.2} />
      <g transform={`rotate(${frame * 0.8})`}>
        {Array.from({ length: 12 }).map((_, i) => (
          <path key={i} d="M -14 -104 L 0 -140 L 14 -104 Z" fill="#FFC53D" stroke={C.ink} strokeWidth="5" strokeLinejoin="round" transform={`rotate(${i * 30})`} />
        ))}
      </g>
      <circle r="100" cx="8" cy="8" fill={C.ink} />
      <circle r="100" fill="#FFB020" stroke={C.ink} strokeWidth="7" />
      <circle r="78" fill="#FFC53D" />
      {label ? (
        <text y="34" textAnchor="middle" fontFamily="Rozha One, serif" fontSize="104" fill={C.ink} opacity={labelIn} transform={`scale(${0.6 + 0.4 * labelIn})`}>
          {label}
        </text>
      ) : null}
    </svg>
  );
};

const IconCard: React.FC<{ text: string; icon: React.ReactNode; at: number; hero?: boolean }> = ({ text, icon, at, hero }) => (
  <Pop at={at} from={0.3} rotate={hero ? -2 : 2}>
    <div style={{ display: "flex", alignItems: "center", gap: 20, width: 400, boxSizing: "border-box", padding: "16px 26px", borderRadius: 28, background: hero ? C.orange : C.white, ...sticker(C.ink, 7) }}>
      <div style={{ width: 84, height: 84, borderRadius: 22, background: hero ? C.white : C.orangeSoft, border: `4px solid ${C.ink}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{icon}</div>
      <span style={{ fontFamily: astro.fonts.body, fontWeight: 800, fontSize: 60, color: hero ? C.white : C.ink }}>{text}</span>
    </div>
  </Pop>
);

const SpeechIcon = () => (
  <svg width="56" height="56" viewBox="0 0 48 48" aria-hidden="true">
    <path d="M 6 10 H 42 V 32 H 22 L 12 41 V 32 H 6 Z" fill={C.orange} stroke={C.ink} strokeWidth="4" strokeLinejoin="round" />
    <circle cx="16" cy="21" r="3" fill={C.ink} />
    <circle cx="24" cy="21" r="3" fill={C.ink} />
    <circle cx="32" cy="21" r="3" fill={C.ink} />
  </svg>
);
const BulbIcon = () => (
  <svg width="56" height="56" viewBox="0 0 48 48" aria-hidden="true">
    <path d="M 24 5 C 14 5 9 13 11 21 C 12 26 17 29 17 34 H 31 C 31 29 36 26 37 21 C 39 13 34 5 24 5 Z" fill="#FFC53D" stroke={C.ink} strokeWidth="4" strokeLinejoin="round" />
    <rect x="17" y="36" width="14" height="7" rx="2" fill={C.ink} />
  </svg>
);
const CoinIcon = () => (
  <svg width="56" height="56" viewBox="0 0 48 48" aria-hidden="true">
    <ellipse cx="24" cy="34" rx="16" ry="6" fill="#FFC53D" stroke={C.ink} strokeWidth="4" />
    <path d="M 8 26 V 34 M 40 26 V 34" stroke={C.ink} strokeWidth="4" />
    <ellipse cx="24" cy="26" rx="16" ry="6" fill="#FFD866" stroke={C.ink} strokeWidth="4" />
    <ellipse cx="24" cy="16" rx="16" ry="6" fill="#FFC53D" stroke={C.ink} strokeWidth="4" />
    <text x="24" y="20" textAnchor="middle" fontFamily="Mukta" fontWeight={800} fontSize="11" fill={C.ink}>₹</text>
  </svg>
);

// ---------- 1. hook: you say it right, they hear it wrong ----------

export const TalkScene: React.FC<TP> = (p) => {
  const frame = useCurrentFrame();
  const misAt = useAt(p, p.scene.misWord, 50);
  const m = useMouth(p);
  const angry = interpolate(frame, [misAt, misAt + 6], [0, 1], clamp);
  const shake = frame >= misAt && frame < misAt + 12 ? Math.sin((frame - misAt) * 2.4) * 8 * (1 - (frame - misAt) / 12) : 0;
  return (
    <>
      <Center y={300}>
        <Headline text={`${p.scene.headline} ${p.scene.accent}`} highlight={p.scene.accent} size={124} delay={-14} />
      </Center>
      <Abs x={70} y={620}>
        <Pop at={-2} from={0.4}>
          <Bubble>
            बात सही <Tick size={56} />
          </Bubble>
        </Pop>
      </Abs>
      <Abs x={600} y={650}>
        <Pop at={8} from={0.3}>
          <div style={{ transform: `translateX(${shake}px)` }}>
            <Bubble tail="right" dark={frame >= misAt}>
              {frame >= misAt ? (
                <>
                  गलत समझा <Cross size={56} />
                </>
              ) : (
                "?!"
              )}
            </Bubble>
          </div>
        </Pop>
      </Abs>
      <Abs x={10} y={820}>
        <Character width={440} pose="explain" poseAt={0} prevPose="explain" mouth={m} brows={0.4} />
      </Abs>
      <Abs x={630} y={840} style={{ transform: `translateX(${shake}px)` }}>
        <Character width={420} look={FRIEND} pose={frame >= misAt ? "shrug" : "idle"} poseAt={misAt} prevPose="idle" brows={-angry} mood={frame >= misAt ? "flat" : "o"} lookX={-0.6} seed={2} />
      </Abs>
    </>
  );
};

// ---------- 2. one planet, one reason ----------

export const PointUpScene: React.FC<TP> = (p) => {
  const frame = useCurrentFrame();
  const m = useMouth(p);
  const planetAt = useAt(p, p.scene.planetWord, 24);
  const reasonAt = useAt(p, p.scene.reasonWord, 80);
  const pose = usePose([
    [0, "idle"],
    [planetAt - 6, "point"],
  ]);
  const pulse = 1 + Math.sin(frame / 6) * 0.03;
  return (
    <>
      <Center y={300}>
        <Headline text={p.scene.headline ?? ""} highlight="एक वजह" size={118} delay={0} />
      </Center>
      <Abs x={560} y={520}>
        <Pop at={planetAt - 4} from={0.2}>
          <div style={{ transform: `scale(${pulse})` }}>
            <Budh size={360} mystery={1} />
          </div>
        </Pop>
      </Abs>
      <Abs x={430} y={930}>
        <Pop at={reasonAt} from={0.3} rotate={-4}>
          <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "10px 30px 14px", borderRadius: 22, background: C.white, ...sticker(C.ink, 7), fontFamily: astro.fonts.body, fontWeight: 800, fontSize: 50, color: C.ink }}>
            <svg width="54" height="54" viewBox="0 0 48 48" aria-hidden="true">
              <circle cx="20" cy="20" r="13" fill={C.orangeSoft} stroke={C.ink} strokeWidth="5" />
              <path d="M 30 30 L 42 42" stroke={C.ink} strokeWidth="7" strokeLinecap="round" />
            </svg>
            + एक छोटी सी वजह
          </div>
        </Pop>
      </Abs>
      <Abs x={0} y={820}>
        <Character width={440} {...pose} mouth={m} brows={0.6} lookX={0.6} />
      </Abs>
    </>
  );
};

// ---------- 3. this is Budh: speech, intellect, trade ----------

export const BudhScene: React.FC<TP> = (p) => {
  const frame = useCurrentFrame();
  const m = useMouth(p);
  const nameAt = useAt(p, p.scene.nameWord, 14);
  const items = p.scene.items ?? [];
  const at = items.map((it, i) => useAt(p, it.word, 50 + i * 20)); // eslint-disable-line react-hooks/rules-of-hooks
  const reveal = interpolate(frame, [nameAt - 2, nameAt + 10], [1, 0], clamp);
  const defaults: IconName[] = ["speech", "bulb", "coin"];
  const icons = items.map((it, i) => <Icon key={i} name={it.icon ?? defaults[i] ?? "bulb"} />);
  const pose = usePose([
    [0, "point"],
    [at[0] - 4, "explain"],
  ]);
  return (
    <>
      <Abs x={90} y={300}>
        <div style={{ position: "relative", transform: `rotate(${frame * 0.3}deg)` }}>
          <Budh size={340} mystery={reveal} />
        </div>
        <Burst at={nameAt} x={170} y={170} radius={230} count={10} />
      </Abs>
      <Abs x={480} y={340}>
        <Pop at={nameAt} from={0.3} rotate={-3}>
          <div style={{ fontFamily: astro.fonts.display, fontSize: 200, lineHeight: 1, color: C.orange, WebkitTextStroke: `6px ${C.ink}`, paintOrder: "stroke fill", textShadow: `8px 9px 0 ${C.ink}` }}>{p.scene.name}</div>
          <div style={{ fontFamily: astro.fonts.body, fontWeight: 800, fontSize: 42, color: C.inkSoft, marginTop: 6 }}>Mercury</div>
        </Pop>
      </Abs>
      {items.map((it, i) => (
        <Abs key={i} x={590} y={700 + i * 170}>
          <IconCard text={it.text} icon={icons[i]} at={at[i]} hero={i === 0} />
        </Abs>
      ))}
      <Abs x={-10} y={860}>
        <Character width={440} {...pose} mouth={m} brows={0.3} lookX={0.5} />
      </Abs>
    </>
  );
};

// ---------- 4. never more than 28° from the Sun ----------

export const ElongationScene: React.FC<TP> = (p) => {
  const frame = useCurrentFrame();
  const m = useMouth(p);
  const statAt = useAt(p, p.scene.statWord, 10);
  const withAt = useAt(p, p.scene.withWord, 140);
  const nextAt = useAt(p, p.scene.nextWord, 190);
  const boxW = 176;
  const gap = 16;
  const x0 = (1080 - (boxW * 5 + gap * 4)) / 2;
  const cx = (i: number) => x0 + i * (boxW + gap) + boxW / 2;
  // Mercury wanders between the neighbours of the Sun's sign, never further.
  let mx = cx(2) + Math.sin(frame / 14) * (boxW + gap) * 0.95;
  if (frame >= withAt) mx = cx(2) + (mx - cx(2)) * interpolate(frame, [withAt, withAt + 10], [1, 0], clamp);
  if (frame >= nextAt) mx = cx(2) + (cx(3) - cx(2)) * interpolate(frame, [nextAt, nextAt + 12], [0, 1], { ...clamp, easing: astro.ease.out });
  const labels = ["", "पिछली राशि", "सूर्य की राशि", "अगली राशि", ""];
  return (
    <>
      <Center y={290}>
        <Pop at={statAt} from={0.4}>
          <div style={{ display: "flex", alignItems: "baseline", gap: 20 }}>
            <span style={{ fontFamily: astro.fonts.display, fontSize: 210, lineHeight: 1, color: C.orange, WebkitTextStroke: `6px ${C.ink}`, paintOrder: "stroke fill", textShadow: `8px 9px 0 ${C.ink}` }}>{p.scene.stat}</span>
            <span style={{ fontFamily: astro.fonts.body, fontWeight: 800, fontSize: 56, color: C.ink, maxWidth: 380, lineHeight: 1.15 }}>से ज़्यादा दूर नहीं</span>
          </div>
        </Pop>
      </Center>
      {labels.map((l, i) => {
        const far = i === 0 || i === 4;
        const sunBox = i === 2;
        return (
          <Abs key={i} x={x0 + i * (boxW + gap)} y={650}>
            <Pop at={4 + i * 3} from={0.5}>
              <div style={{ width: boxW, height: 210, boxSizing: "border-box", borderRadius: 22, background: sunBox ? C.orangeSoft : far ? rgba(C.ink, 0.06) : C.white, ...sticker(C.ink, far ? 0 : 6), opacity: far ? 0.55 : 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "flex-end", padding: "0 6px 14px" }}>
                {far ? <Cross size={64} /> : null}
                <span style={{ fontFamily: astro.fonts.body, fontWeight: 800, fontSize: 32, color: C.ink, textAlign: "center", lineHeight: 1.1, marginTop: far ? 12 : 0 }}>{far ? "कभी नहीं" : l}</span>
              </div>
            </Pop>
          </Abs>
        );
      })}
      <Abs x={cx(2) - 75} y={560}>
        <SunDisc size={150} />
      </Abs>
      <Abs x={mx - 40} y={frame >= withAt && frame < nextAt ? 740 : 740 + Math.sin(frame / 5) * 6}>
        <Budh size={80} />
      </Abs>
      <Abs x={20} y={890}>
        <Character width={420} pose="both" poseAt={0} prevPose="both" mouth={m} brows={0.3} lookX={0.4} />
      </Abs>
    </>
  );
};

// ---------- 5. Sun = "मैं", Budh = "बात" ----------

export const EgoScene: React.FC<TP> = (p) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const m = useMouth(p);
  const meAt = useAt(p, p.scene.meWord, 6);
  const baatAt = useAt(p, p.scene.baatWord, 40);
  const closeAt = useAt(p, p.scene.closeWord, 120);
  const astAt = useAt(p, p.scene.astWord, 160);
  const heavyAt = useAt(p, p.scene.heavyWord, 260);
  const meIn = spring({ frame: frame - meAt, fps, config: astro.spring.bouncy });
  const move = interpolate(frame, [closeAt - 4, closeAt + 16], [0, 1], { ...clamp, easing: astro.ease.inOut });
  const ast = interpolate(frame, [astAt, astAt + 10], [0, 1], clamp);
  const heavy = spring({ frame: frame - heavyAt, fps, config: astro.spring.bouncy });
  const bx = 780 - move * 300;
  return (
    <>
      <Abs x={60} y={300}>
        <SunDisc size={420} glow={ast} label="मैं" labelIn={Math.min(1, meIn)} />
      </Abs>
      <Abs x={bx} y={410} style={{ opacity: 1 - ast * 0.55 }}>
        <Pop at={baatAt - 6} from={0.3}>
          <Budh size={190} />
        </Pop>
        <Pop at={baatAt} from={0.3}>
          <div style={{ marginTop: 10, textAlign: "center", fontFamily: astro.fonts.display, fontSize: 84, color: C.ink }}>बात</div>
        </Pop>
      </Abs>
      <Abs x={640} y={300}>
        <Pop at={astAt} from={0.3} rotate={6}>
          <div style={{ padding: "6px 28px 12px", borderRadius: 999, background: C.ink, color: C.white, ...sticker(C.orange, 6), fontFamily: astro.fonts.body, fontWeight: 800, fontSize: 52 }}>अस्त</div>
        </Pop>
      </Abs>
      <Abs x={420} y={820}>
        <div style={{ opacity: Math.min(1, heavy * 2), transform: `scale(${0.4 + 0.6 * Math.min(1.1, heavy)})`, transformOrigin: "left bottom" }}>
          <Bubble>
            <span style={{ fontFamily: astro.fonts.display, fontSize: 120, lineHeight: 1, color: C.orange }}>मैं</span>
            <span style={{ fontSize: 34, color: C.inkSoft }}>बात</span>
          </Bubble>
        </div>
      </Abs>
      <Abs x={0} y={890}>
        <Character width={420} pose={frame >= heavyAt ? "shrug" : "explain"} poseAt={frame >= heavyAt ? heavyAt : 0} prevPose="explain" mouth={m} brows={frame >= heavyAt ? 0.8 : 0.2} lookX={0.5} />
      </Abs>
    </>
  );
};

// ---------- 6. listen first, then speak ----------

export const ListenScene: React.FC<TP> = (p) => {
  const frame = useCurrentFrame();
  const m = useMouth(p);
  const noAt = useAt(p, p.scene.noWord, 20);
  const earAt = useAt(p, "सामने", 90);
  const listenAt = useAt(p, p.scene.listenWord, 140);
  const strike = interpolate(frame, [noAt + 8, noAt + 20], [0, 1], { ...clamp, easing: astro.ease.out });
  const tagOut = interpolate(frame, [listenAt, listenAt + 8], [1, 0], clamp);
  const pose = usePose([
    [0, "explain"],
    [earAt, "ear"],
    [listenAt + 30, "explain"],
  ]);
  const waves = frame >= earAt && frame < listenAt + 30;
  return (
    <>
      <Abs x={560} y={330} style={{ opacity: tagOut }}>
        <Pop at={noAt - 4} from={0.3} rotate={8}>
          <div style={{ position: "relative", padding: "14px 36px 20px", borderRadius: 20, background: C.white, ...sticker(C.ink, 7), fontFamily: astro.fonts.body, fontWeight: 800, fontSize: 58, color: C.ink }}>
            ₹₹₹ महँगा उपाय
            <div style={{ position: "absolute", left: 20, right: 20, top: "50%", height: 10, background: "#E03131", transform: `scaleX(${strike}) rotate(-6deg)`, transformOrigin: "left" }} />
          </div>
        </Pop>
      </Abs>
      <Center y={300}>
        <div style={{ opacity: 1 - tagOut }}>
          <Headline text={`${p.scene.headline} ${p.scene.accent}`} highlight={p.scene.accent} size={124} delay={listenAt} />
        </div>
      </Center>
      <Abs x={420} y={620}>
        <div style={{ display: "flex", gap: 24, opacity: 1 - tagOut }}>
          {["1 · सुनिए", "2 · बोलिए"].map((t, i) => (
            <Pop key={i} at={listenAt + 10 + i * 8} from={0.3}>
              <div style={{ padding: "10px 30px 14px", borderRadius: 999, background: i === 0 ? C.orange : C.white, color: i === 0 ? C.white : C.ink, ...sticker(C.ink, 6), fontFamily: astro.fonts.body, fontWeight: 800, fontSize: 48 }}>{t}</div>
            </Pop>
          ))}
        </div>
      </Abs>
      {waves ? (
        <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }} aria-hidden="true">
          {[0, 1, 2].map((i) => {
            const ph = ((frame - earAt) / 18 + i / 3) % 1;
            return <path key={i} d={`M ${400 + ph * 140} ${1040 - 60 - ph * 50} Q ${440 + ph * 160} 1040 ${400 + ph * 140} ${1040 + 60 + ph * 50}`} fill="none" stroke={C.orange} strokeWidth="9" strokeLinecap="round" opacity={1 - ph} />;
          })}
        </svg>
      ) : null}
      <Abs x={30} y={880}>
        <Character width={430} {...pose} mouth={m} brows={0.4} lookX={0.3} />
      </Abs>
    </>
  );
};

// ---------- 7. CTA ----------

export const ToonCta: React.FC<TP> = (p) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const m = useMouth(p);
  const kwAt = useAt(p, p.scene.keyword, 60);
  const teaserAt = useAt(p, p.scene.teaserWord, 100);
  const followAt = useAt(p, "फॉलो", 180);
  const f = spring({ frame: frame - followAt, fps, config: astro.spring.bouncy });
  const target = [...(p.scene.typed ?? "बुध")];
  const typedN = Math.max(0, Math.min(target.length, Math.floor((frame - kwAt) / 3)));
  const kw = target.slice(0, typedN).join("");
  const pose = usePose([
    [0, "wave"],
    [30, "explain"],
    [followAt - 6, "point"],
  ]);
  return (
    <>
      <Center y={290}>
        <Headline text={p.scene.headline ?? ""} highlight={p.scene.accent ?? "एक घर में?"} size={116} delay={0} maxWidth={900} />
      </Center>
      <Abs x={110} y={590}>
        <Pop at={kwAt - 8} from={0.5}>
          <div style={{ width: 860, boxSizing: "border-box", padding: "20px 30px", borderRadius: 28, background: C.white, ...sticker(C.ink, 8), display: "flex", alignItems: "center", gap: 22 }}>
            <span style={{ fontFamily: astro.fonts.body, fontWeight: 800, fontSize: 48, color: C.inkSoft }}>कमेंट:</span>
            <span style={{ fontFamily: astro.fonts.display, fontSize: 80, lineHeight: 1, color: C.orange }}>{kw}</span>
            <span style={{ width: 6, height: 60, background: C.ink, opacity: Math.floor(frame / 8) % 2 ? 0 : 1 }} />
          </div>
        </Pop>
      </Abs>
      <Abs x={110} y={760}>
        <Pop at={teaserAt} from={0.5}>
          <div style={{ width: 860, boxSizing: "border-box", padding: "26px 32px", borderRadius: 28, background: C.ink, display: "flex", alignItems: "center", gap: 22, boxShadow: `10px 10px 0 ${C.orange}` }}>
            <div style={{ padding: "4px 24px 8px", borderRadius: 999, background: C.orange, color: C.white, fontFamily: astro.fonts.body, fontWeight: 800, fontSize: 44, flexShrink: 0 }}>{p.scene.teaserTag}</div>
            <div style={{ fontFamily: astro.fonts.body, fontWeight: 700, fontSize: 46, lineHeight: 1.25, color: C.white }}>{p.scene.teaser}</div>
          </div>
        </Pop>
      </Abs>
      <Abs x={110} y={1000}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 16, padding: "18px 50px 22px", borderRadius: 999, background: C.orange, color: C.white, ...sticker(C.ink, 8), fontFamily: astro.fonts.body, fontWeight: 800, fontSize: 58, opacity: Math.min(1, f * 2), transform: `scale(${0.5 + 0.5 * Math.min(1.05, f)})` }}>
          + {p.scene.button}
        </div>
      </Abs>
      <Abs x={640} y={960}>
        <Character width={400} {...pose} mouth={m} brows={0.5} lookX={-0.5} flip />
      </Abs>
    </>
  );
};

// ---------- generic icons ----------

export type IconName = "speech" | "bulb" | "coin" | "paper" | "phone" | "chat" | "clock" | "bill" | "shield" | "pause" | "tick" | "cross" | "heart";

const PaperIcon = () => (
  <svg width="56" height="56" viewBox="0 0 48 48" aria-hidden="true">
    <path d="M 10 4 H 30 L 38 12 V 44 H 10 Z" fill="#fff" stroke={C.ink} strokeWidth="4" strokeLinejoin="round" />
    <path d="M 16 18 H 32 M 16 25 H 32 M 16 32 H 26" stroke={C.ink} strokeWidth="3.5" strokeLinecap="round" />
    <path d="M 30 4 V 12 H 38" fill="none" stroke={C.ink} strokeWidth="4" strokeLinejoin="round" />
  </svg>
);
const PhoneIcon = () => (
  <svg width="56" height="56" viewBox="0 0 48 48" aria-hidden="true">
    <rect x="13" y="4" width="22" height="40" rx="5" fill={C.orangeSoft} stroke={C.ink} strokeWidth="4" />
    <rect x="17" y="10" width="14" height="24" rx="2" fill="#fff" stroke={C.ink} strokeWidth="2.5" />
    <circle cx="24" cy="39" r="2.5" fill={C.ink} />
  </svg>
);
const ChatIcon = () => (
  <svg width="56" height="56" viewBox="0 0 48 48" aria-hidden="true">
    <path d="M 5 8 H 43 V 32 H 20 L 10 41 V 32 H 5 Z" fill="#E03131" stroke={C.ink} strokeWidth="4" strokeLinejoin="round" />
    <text x="24" y="27" textAnchor="middle" fontFamily="Mukta" fontWeight={800} fontSize="17" fill="#fff">!#@</text>
  </svg>
);
const ClockIcon = () => (
  <svg width="56" height="56" viewBox="0 0 48 48" aria-hidden="true">
    <circle cx="24" cy="25" r="18" fill="#fff" stroke={C.ink} strokeWidth="4" />
    <path d="M 24 14 V 25 L 31 30" fill="none" stroke={C.ink} strokeWidth="4" strokeLinecap="round" />
  </svg>
);
const BillIcon = () => (
  <svg width="56" height="56" viewBox="0 0 48 48" aria-hidden="true">
    <path d="M 11 4 H 37 V 44 L 32 40 L 27 44 L 22 40 L 17 44 L 11 40 Z" fill="#fff" stroke={C.ink} strokeWidth="4" strokeLinejoin="round" />
    <text x="24" y="28" textAnchor="middle" fontFamily="Mukta" fontWeight={800} fontSize="18" fill={C.ink}>₹</text>
  </svg>
);
const ShieldIcon = () => (
  <svg width="56" height="56" viewBox="0 0 48 48" aria-hidden="true">
    <path d="M 24 4 L 40 10 V 22 C 40 33 33 40 24 44 C 15 40 8 33 8 22 V 10 Z" fill="#2F9E44" stroke={C.ink} strokeWidth="4" strokeLinejoin="round" />
    <path d="M 16 24 L 22 30 L 33 18" fill="none" stroke="#fff" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
const PauseIcon = () => (
  <svg width="56" height="56" viewBox="0 0 48 48" aria-hidden="true">
    <circle cx="24" cy="24" r="20" fill={C.orange} stroke={C.ink} strokeWidth="4" />
    <rect x="16" y="14" width="6" height="20" rx="2" fill="#fff" />
    <rect x="26" y="14" width="6" height="20" rx="2" fill="#fff" />
  </svg>
);

const HeartIcon = () => (
  <svg width="56" height="56" viewBox="0 0 48 48" aria-hidden="true">
    <path d="M 24 42 C 10 32 4 24 6 16 C 8 9 17 7 24 15 C 31 7 40 9 42 16 C 44 24 38 32 24 42 Z" fill="#E03131" stroke={C.ink} strokeWidth="4" strokeLinejoin="round" />
  </svg>
);

export const Icon: React.FC<{ name: IconName }> = ({ name }) => {
  switch (name) {
    case "speech": return <SpeechIcon />;
    case "coin": return <CoinIcon />;
    case "paper": return <PaperIcon />;
    case "phone": return <PhoneIcon />;
    case "chat": return <ChatIcon />;
    case "clock": return <ClockIcon />;
    case "bill": return <BillIcon />;
    case "shield": return <ShieldIcon />;
    case "pause": return <PauseIcon />;
    case "tick": return <Tick size={56} />;
    case "cross": return <Cross size={56} />;
    case "heart": return <HeartIcon />;
    default: return <BulbIcon />;
  }
};

// Big hero illustration for a tip, scaled from the 48-unit icons, or Budh moving along the sky:
// backwards (vakri, red arrow) or forwards (margi, green arrow).
const BudhPath: React.FC<{ p: number; retro: boolean; size: number }> = ({ p, retro, size }) => {
  const frame = useCurrentFrame();
  const col = retro ? "#E03131" : "#2F9E44";
  const R = 190;
  // planet angle on the sky arc: 180deg = left, 0deg = right. Vakri drifts right -> left, margi left -> right.
  const cyc = ((frame % 150) / 150);
  const t = retro ? 1 - cyc : cyc;
  const ang = Math.PI * (1 - (0.12 + t * 0.76));
  const px = Math.cos(ang) * R;
  const py = -Math.sin(ang) * R;
  const ticks = Array.from({ length: 13 }).map((_, i) => Math.PI * (i / 12));
  return (
    <svg width={size} height={size * 0.72} viewBox="-250 -250 500 360" aria-hidden="true" style={{ overflow: "visible" }}>
      <path d={`M ${-R} 0 A ${R} ${R} 0 0 1 ${R} 0`} fill="none" stroke={C.ink} strokeWidth="6" strokeDasharray="3 14" strokeLinecap="round" />
      {ticks.map((a, i) => (
        <line key={i} x1={Math.cos(a) * (R - 14)} y1={-Math.sin(a) * (R - 14)} x2={Math.cos(a) * (R + 14)} y2={-Math.sin(a) * (R + 14)} stroke={C.ink} strokeWidth="4" strokeLinecap="round" opacity={0.5} />
      ))}
      {/* direction arrow inside the arc */}
      <g opacity={p}>
        <path d={retro ? "M 110 -40 A 120 120 0 0 0 -110 -40" : "M -110 -40 A 120 120 0 0 1 110 -40"} fill="none" stroke={col} strokeWidth="16" strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - p} />
        <polygon points={retro ? "-138,-36 -96,-70 -90,-18" : "138,-36 96,-70 90,-18"} fill={col} stroke={C.ink} strokeWidth="4" strokeLinejoin="round" opacity={p > 0.9 ? 1 : 0} />
      </g>
      <g transform={`translate(${px - 62} ${py - 62}) scale(0.56)`}>
        <Budh size={220} />
      </g>
      <line x1={-230} y1={0} x2={230} y2={0} stroke={C.ink} strokeWidth="7" strokeLinecap="round" />
      <g transform="translate(0 62)">
        <rect x={-130} y={-36} width={260} height={72} rx={36} fill={col} stroke={C.ink} strokeWidth="5" />
        <text y="16" textAnchor="middle" fontFamily="Mukta" fontWeight={800} fontSize="46" fill="#fff">{retro ? "← वक्री" : "मार्गी →"}</text>
      </g>
    </svg>
  );
};

// Ashtakoot guna milan: 8 parts worth 1..8 points, total 36. `highlight` lists part indexes to light up.
const KOOTA = ["वर्ण", "वश्य", "तारा", "योनि", "मैत्री", "गण", "भकूट", "नाड़ी"];
const KootaBars: React.FC<{ p: number; highlight: number[] }> = ({ p, highlight }) => {
  const frame = useCurrentFrame();
  const W = 600;
  const bw = 56;
  const gap = (W - 56 - bw * 8) / 7;
  return (
    <div style={{ position: "relative", width: W, height: 470, borderRadius: 40, background: C.white, ...sticker(C.ink, 10), boxSizing: "border-box" }}>
      {KOOTA.map((k, i) => {
        const on = interpolate(p, [i / 10, i / 10 + 0.3], [0, 1], clamp);
        const hot = highlight.includes(i);
        const bob = hot ? Math.sin(frame / 7) * 4 : 0;
        const h = (i + 1) * 36 * on;
        return (
          <div key={i} style={{ position: "absolute", left: 28 + i * (bw + gap), bottom: 70, width: bw, height: h, borderRadius: "12px 12px 0 0", background: hot ? C.orange : highlight.length ? "#E9DCCB" : C.orangeSoft, border: `4px solid ${C.ink}`, boxSizing: "border-box", transform: `translateY(${bob}px)` }}>
            <div style={{ position: "absolute", top: -48, left: -10, width: bw + 20, textAlign: "center", fontFamily: astro.fonts.display, fontSize: 38, color: hot ? C.orangeDeep : C.ink, opacity: on }}>{i + 1}</div>
          </div>
        );
      })}
      {KOOTA.map((k, i) => (
        <div key={i} style={{ position: "absolute", left: 28 + i * (bw + gap) - 14, bottom: 22, width: bw + 28, textAlign: "center", fontFamily: astro.fonts.body, fontWeight: 800, fontSize: 23, color: highlight.includes(i) ? C.orangeDeep : C.inkSoft }}>{k}</div>
      ))}
      <div style={{ position: "absolute", left: 24, top: 18, fontFamily: astro.fonts.body, fontWeight: 800, fontSize: 30, color: C.inkSoft }}>8 हिस्से = 36 गुण</div>
    </div>
  );
};

const StatCard: React.FC<{ text: string; struck?: boolean; p: number }> = ({ text, struck, p }) => (
  <div style={{ position: "relative", padding: "20px 54px 34px", borderRadius: 44, background: C.white, ...sticker(C.ink, 12), fontFamily: astro.fonts.display, fontSize: [...text].length > 4 ? 120 : 190, whiteSpace: "nowrap", lineHeight: 1, color: C.orange, WebkitTextStroke: `5px ${C.ink}`, paintOrder: "stroke fill" }}>
    {text}
    {struck ? <div style={{ position: "absolute", left: 24, right: 24, top: "52%", height: 16, borderRadius: 8, background: "#E03131", border: `3px solid ${C.ink}`, transform: `rotate(-12deg) scaleX(${p})`, transformOrigin: "left" }} /> : null}
  </div>
);

// 4 x 3 board of the 12 rashis. Tiles pop in one by one; a tile with a cue word turns orange when spoken.
const RashiGrid: React.FC<{ cells: NonNullable<ToonScene["grid"]>; hotAt: number[]; p: number }> = ({ cells, hotAt, p }) => {
  const frame = useCurrentFrame();
  const tw = 222;
  const th = 150;
  const gap = 14;
  return (
    <div style={{ position: "relative", width: tw * 4 + gap * 3 + 40, height: th * 3 + gap * 2 + 40, borderRadius: 40, background: C.white, ...sticker(C.ink, 10), boxSizing: "border-box", padding: 20 }}>
      {cells.slice(0, 12).map((c, i) => {
        const on = interpolate(p, [i / 16, i / 16 + 0.25], [0, 1], clamp);
        const hot = hotAt[i] >= 0 && frame >= hotAt[i];
        const pop = hot ? interpolate(frame - hotAt[i], [0, 4, 10], [1, 1.12, 1], clamp) : 1;
        return (
          <div key={i} style={{ position: "absolute", left: 20 + (i % 4) * (tw + gap), top: 20 + Math.floor(i / 4) * (th + gap), width: tw, height: th, borderRadius: 22, background: hot ? C.orange : C.orangeSoft, border: `4px solid ${C.ink}`, boxSizing: "border-box", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", opacity: on, transform: `scale(${(0.7 + 0.3 * on) * pop})` }}>
            <div style={{ fontFamily: astro.fonts.display, fontSize: 46, lineHeight: 1.05, color: hot ? C.white : C.ink }}>{c.name}</div>
            {c.sub ? <div style={{ fontFamily: astro.fonts.body, fontWeight: 800, fontSize: 32, lineHeight: 1.1, color: hot ? C.white : C.orangeDeep, marginTop: 2 }}>{c.sub}</div> : null}
          </div>
        );
      })}
    </div>
  );
};

const HeroCard: React.FC<{ kind: NonNullable<ToonScene["emblem"]>; p: number; scene?: ToonScene; strikeP?: number }> = ({ kind, p, scene, strikeP = 0 }) => {
  const frame = useCurrentFrame();
  if (kind === "koota") return <KootaBars p={p} highlight={scene?.highlight ?? []} />;
  if (kind === "stat") return <StatCard text={scene?.stat ?? ""} struck={scene?.struck} p={strikeP} />;
  if (kind === "budhRetro" || kind === "budhMargi") return <BudhPath p={p} retro={kind === "budhRetro"} size={600} />;
  if (kind === "sun") return <SunDisc size={360} glow={0.4} />;
  const icon: IconName = kind === "paper" ? "paper" : kind === "phone" ? "phone" : kind === "chat" ? "chat" : "clock";
  const wob = Math.sin(frame / 9) * 3;
  return (
    <div style={{ width: 360, height: 360, borderRadius: 60, background: C.white, ...sticker(C.ink, 12), display: "flex", alignItems: "center", justifyContent: "center", transform: `rotate(${wob}deg)` }}>
      <div style={{ transform: "scale(5)" }}>
        <Icon name={icon} />
      </div>
    </div>
  );
};

// ---------- Q&A hook: नेहा's question on screen from frame 0, गुरुजी answers (only his voice) ----------

const NameTag: React.FC<{ text: string; color: string }> = ({ text, color }) => (
  <div style={{ display: "inline-flex", padding: "6px 26px 10px", borderRadius: 999, background: color, color: C.white, ...sticker(C.ink, 5), fontFamily: astro.fonts.body, fontWeight: 800, fontSize: 44 }}>{text}</div>
);

export const AskScene: React.FC<TP> = (p) => {
  const frame = useCurrentFrame();
  const m = useMouth(p);
  const sc = p.scene;
  const chips = sc.chips ?? [];
  const chipAt = chips.map((c, i) => useAt(p, c.word, 90 + i * 20)); // eslint-disable-line react-hooks/rules-of-hooks
  const answerAt = chipAt[0] ?? 90;
  const nod = frame < answerAt ? Math.sin(frame / 6) * 3 : 0;
  return (
    <>
      {/* the question, as नेहा's speech bubble, fully on screen from frame 0 */}
      <div style={{ position: "absolute", left: 46, right: 46, top: 240 }}>
        <div style={{ position: "relative", padding: "26px 40px 36px", borderRadius: 40, background: C.white, ...sticker(C.ink, 7) }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 8 }}>
            <div style={{ width: 56, height: 56, borderRadius: 28, background: "#1C7C7D", border: `5px solid ${C.ink}`, display: "flex", alignItems: "center", justifyContent: "center", color: C.white, fontFamily: astro.fonts.display, fontSize: 38, lineHeight: 1, paddingTop: 4, boxSizing: "border-box" }}>?</div>
            <span style={{ fontFamily: astro.fonts.body, fontWeight: 800, fontSize: 42, color: "#1C7C7D" }}>{sc.askerName ?? "नेहा"} का सवाल</span>
          </div>
          <div style={{ fontFamily: astro.fonts.body, fontWeight: 800, fontSize: 70, lineHeight: 1.3, color: C.ink }}>{sc.question}</div>
          <svg width="70" height="52" viewBox="0 0 70 52" style={{ position: "absolute", bottom: -46, right: 190 }} aria-hidden="true">
            <path d="M 66 0 L 46 46 L 12 0" fill={C.white} stroke={C.ink} strokeWidth="6" strokeLinejoin="round" />
            <rect x="0" y="-8" width="70" height="11" fill={C.white} />
          </svg>
        </div>
      </div>
      {chips.map((ch, i) => (
        <div key={i} style={{ position: "absolute", left: 0, right: 0, top: 700 + i * 118, display: "flex", justifyContent: "center" }}>
          <Pop at={chipAt[i]} from={0.3} rotate={i % 2 ? 2 : -2}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 16, padding: "10px 34px 14px", borderRadius: 999, background: i === 0 ? C.orange : C.white, color: i === 0 ? C.white : C.ink, ...sticker(C.ink, 6), fontFamily: astro.fonts.body, fontWeight: 800, fontSize: 60 }}>
              {ch.icon ? <Icon name={ch.icon} /> : null}
              {ch.text}
            </div>
          </Pop>
        </div>
      ))}
      {/* गुरुजी (answers, left) and नेहा (asks, right) */}
      <Abs x={-10} y={880}>
        <Character width={440} pose={frame < answerAt ? "idle" : "explain"} poseAt={answerAt} prevPose="idle" mouth={frame < answerAt - 2 ? 0 : m} brows={0.3} lookX={0.6} />
      </Abs>
      <Abs x={610} y={880} style={{ transform: `translateY(${nod}px)` }}>
        <Character width={420} look={FRIEND} pose={frame < answerAt ? "shrug" : "idle"} poseAt={frame < answerAt ? 0 : answerAt} prevPose="shrug" mouth={frame < answerAt - 2 ? m : 0} mood="smile" brows={frame < answerAt ? 0.8 : 0.3} lookX={-0.6} seed={2} />
      </Abs>
      <Abs x={70} y={1330}>
        <Pop at={-2} from={0.5}><NameTag text={sc.answerName ?? "गुरुजी"} color={C.orange} /></Pop>
      </Abs>
      <Abs x={760} y={1330}>
        <Pop at={-2} from={0.5}><NameTag text={sc.askerName ?? "नेहा"} color="#1C7C7D" /></Pop>
      </Abs>
    </>
  );
};

export const TipScene: React.FC<TP> = (p) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const m = useMouth(p);
  const sc = p.scene;
  const emAt = useAt(p, sc.emblemWord, 6);
  const chips = sc.chips ?? [];
  const chipAt = chips.map((c, i) => useAt(p, c.word, 60 + i * 20)); // eslint-disable-line react-hooks/rules-of-hooks
  const bubbleAt = useAt(p, sc.bubbleWord, 110);
  const poseAt = useAt(p, sc.poseWord, 9999);
  const strikeAt = useAt(p, sc.statWord, 9999);
  const gridHot = (sc.grid ?? []).map((g) => (g.word ? useAt(p, g.word, -1) : -1)); // eslint-disable-line react-hooks/rules-of-hooks
  const isGrid = sc.emblem === "grid";
  const pose = usePose([
    [0, "explain"],
    [Math.max(4, emAt - 6), "point"],
    [Math.min(poseAt, (chipAt[0] ?? 9999) - 4), sc.pose ?? "explain"],
  ]);
  const draw = interpolate(frame, [emAt, emAt + 40], [0, 1], { ...clamp, easing: astro.ease.inOut });
  const c = spring({ frame: frame + 4, fps, config: astro.spring.bouncy });
  const headY = sc.counter ? 420 : 300;
  return (
    <>
      {sc.counter ? (
        <Abs x={70} y={270}>
          <div style={{ display: "flex", alignItems: "center", gap: 14, transform: `scale(${0.5 + 0.5 * Math.min(1, c)}) rotate(-6deg)`, opacity: Math.min(1, c * 2) }}>
            <div style={{ width: 128, height: 128, borderRadius: 64, background: C.orange, ...sticker(C.ink, 7), display: "flex", alignItems: "center", justifyContent: "center", fontFamily: astro.fonts.display, fontSize: 92, lineHeight: 1, color: C.white, paddingTop: 10, boxSizing: "border-box" }}>{sc.counter}</div>
            <span style={{ fontFamily: astro.fonts.display, fontSize: 56, color: C.inkSoft }}>/ {sc.counterOf ?? "3"}</span>
          </div>
        </Abs>
      ) : null}
      <Center y={headY}>
        <Headline text={`${sc.headline ?? ""}${sc.accent ? " " + sc.accent : ""}`} highlight={sc.accent} size={sc.counter ? 104 : 118} delay={0} maxWidth={940} />
      </Center>
      {isGrid ? (
        <Abs x={56} y={sc.counter ? 560 : 500}>
          <Pop at={emAt - 4} from={0.5} rotate={0}>
            <RashiGrid cells={sc.grid ?? []} hotAt={gridHot} p={draw} />
          </Pop>
        </Abs>
      ) : null}
      <Abs x={isGrid ? 3000 : sc.emblem?.startsWith("budh") ? 430 : sc.emblem === "koota" ? 440 : sc.emblem === "stat" ? 520 : 620} y={sc.emblem?.startsWith("budh") ? 600 : sc.emblem === "koota" ? (sc.counter ? 600 : 560) : sc.bubble ? 760 : 700}>
        <Pop at={emAt - 4} from={0.3} rotate={sc.emblem?.startsWith("budh") || sc.emblem === "koota" ? 0 : 4}>
          {sc.emblem ? <HeroCard kind={sc.emblem} p={draw} scene={sc} strikeP={interpolate(frame, [strikeAt, strikeAt + 8], [0, 1], clamp)} /> : null}
        </Pop>
        {sc.emblem ? <Burst at={emAt} x={200} y={180} radius={230} count={8} /> : null}
      </Abs>
      {chips.map((ch, i) => (
        <div key={i} style={{ position: "absolute", right: 46, top: (isGrid ? 1100 : chips.length > 2 ? 1010 : 1080) + i * (chips.length > 2 ? 112 : 130), display: "flex", justifyContent: "flex-end" }}>
          <Pop at={chipAt[i]} from={0.3} rotate={i % 2 ? 2 : -2}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 16, padding: "10px 30px 14px", borderRadius: 999, background: i === chips.length - 1 ? C.orange : C.white, color: i === chips.length - 1 ? C.white : C.ink, ...sticker(C.ink, 6), fontFamily: astro.fonts.body, fontWeight: 800, fontSize: 50 }}>
              {ch.icon ? <Icon name={ch.icon} /> : null}
              {ch.text}
            </div>
          </Pop>
        </div>
      ))}
      {sc.bubble ? (
        <Abs x={60} y={610}>
          <Pop at={bubbleAt} from={0.4} rotate={-3}>
            <Bubble dark style={{ fontSize: 52 }}>{sc.bubble}</Bubble>
          </Pop>
        </Abs>
      ) : null}
      <Abs x={isGrid ? -60 : 0} y={isGrid ? 1180 : 860}>
        <Character width={isGrid ? 380 : 440} {...pose} mouth={m} brows={0.4} lookX={0.5} />
      </Abs>
    </>
  );
};
