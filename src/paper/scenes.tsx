// Scene layouts for the Paper look (Reel 2: साढ़े साती का सच).
import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { findWordFrame, W } from "../astro/parts";
import { Crescent, DottedLine, Dumbbell, Key, Saturn, Sun } from "./ink";
import { paper, rgba } from "./theme";

const C = paper.colors;
const F = paper.fonts;
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

export type PaperScene = {
  visual: "hook" | "loop" | "cycle" | "orbit" | "trainer" | "reveal" | "dhaiya" | "cta";
  voiceover: string;
  kicker?: string;
  headline?: string;
  accent?: string;
  label?: string;
  labelWord?: string;
  questionWord?: string;
  unitWord?: string;
  steps?: { label: string; word: string }[];
  totalWord?: string;
  stat?: string;
  statSuffix?: string;
  statWord?: string;
  lifeWord?: string;
  trainerWord?: string;
  keys?: { text: string; word: string }[];
  rows?: { name: string; latin: string; phase: string; word: string }[];
  items?: { name: string; latin: string; word: string }[];
  body?: string;
  teaserTag?: string;
  teaserWord?: string;
  teaser?: string;
  button?: string;
  startMs: number;
  endMs: number;
};

type P = { scene: PaperScene; words: W[] };

const useAt = (scene: PaperScene, words: W[], word: string | undefined, fallback: number) => {
  const { fps } = useVideoConfig();
  return findWordFrame(words, scene.startMs, word, fallback, fps);
};

// Calm editorial entrance: fade + small rise, no bounce.
const up = (frame: number, at: number, dist = 34, dur = 14): React.CSSProperties => {
  const p = interpolate(frame, [at, at + dur], [0, 1], { ...clamp, easing: paper.ease.out });
  return { opacity: p, transform: `translateY(${(1 - p) * dist}px)` };
};
const prog = (frame: number, at: number, dur = 18) => interpolate(frame, [at, at + dur], [0, 1], { ...clamp, easing: paper.ease.out });

const Stage: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div style={{ position: "relative", width: 1080, height: paper.layout.contentHeight }}>{children}</div>
);

const Abs: React.FC<{ x: number; y: number; w?: number; children: React.ReactNode; style?: React.CSSProperties; center?: boolean }> = ({ x, y, w, children, style, center }) => (
  <div style={{ position: "absolute", left: center ? 0 : x, top: y, width: center ? 1080 : w, display: center ? "flex" : undefined, justifyContent: center ? "center" : undefined, ...style }}>{children}</div>
);

const Small: React.FC<{ children: React.ReactNode; color?: string; size?: number; style?: React.CSSProperties }> = ({ children, color = C.inkSoft, size = 24, style }) => (
  <span style={{ fontFamily: F.head, fontWeight: 700, fontSize: size, letterSpacing: size * 0.22, textTransform: "uppercase", color, ...style }}>{children}</span>
);

const Head: React.FC<{ text: string; size?: number; color?: string; style?: React.CSSProperties }> = ({ text, size = 96, color = C.ink, style }) => (
  <div style={{ fontFamily: F.head, fontWeight: 800, fontSize: size, lineHeight: 1.12, color, textAlign: "center", ...style }}>{text}</div>
);

// Big accent disc + horizon line, the signature composition of this look.
const Disc: React.FC<{ cx: number; cy: number; r: number; p: number; line?: number; lineY?: number }> = ({ cx, cy, r, p, line = 1, lineY }) => (
  <>
    <div style={{ position: "absolute", left: cx - r, top: cy - r, width: r * 2, height: r * 2, borderRadius: r, background: C.accent, transform: `scale(${0.6 + 0.4 * p})`, opacity: p }} />
    <div style={{ position: "absolute", left: 540 - 410, top: lineY ?? cy + r * 0.55, width: 820 * line, height: 12, background: C.ink, transformOrigin: "left" }} />
  </>
);

// Rashi card: engraved double border.
const Tile: React.FC<{ w: number; h: number; top?: string; name: string; sub?: string; hot?: boolean; children?: React.ReactNode; dim?: boolean }> = ({ w, h, top, name, sub, hot, children, dim }) => (
  <div
    style={{
      position: "relative",
      width: w,
      height: h,
      boxSizing: "border-box",
      background: hot ? C.ink : rgba(C.white, 0.35),
      border: `4px solid ${C.ink}`,
      outline: `1.5px solid ${C.ink}`,
      outlineOffset: -14,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      gap: 6,
      opacity: dim ? 0.35 : 1,
    }}
  >
    {top ? <Small color={hot ? C.accentSoft : C.inkSoft} size={20}>{top}</Small> : null}
    {children}
    <div style={{ fontFamily: F.head, fontWeight: 800, fontSize: w > 230 ? 52 : 42, lineHeight: 1.1, color: hot ? C.white : C.ink, textAlign: "center" }}>{name}</div>
    {sub ? <Small color={hot ? C.accentSoft : C.accent} size={20}>{sub}</Small> : null}
  </div>
);

// ---------- 1. hook ----------

export const HookScene: React.FC<P> = ({ scene, words }) => {
  const frame = useCurrentFrame();
  const qAt = useAt(scene, words, scene.questionWord, 70);
  const disc = prog(frame + 10, 0, 22);
  const planet = interpolate(frame, [-14, 22], [0, 1], { ...clamp, easing: paper.ease.inOut });
  const float = Math.sin(frame / 20) * 6;
  return (
    <Stage>
      <Abs x={0} y={0} center style={up(frame + 12, 0)}>
        <Small color={C.accent} size={28}>{scene.kicker}</Small>
      </Abs>
      <Abs x={0} y={50} center style={up(frame + 10, 0)}>
        <Head text={scene.headline ?? ""} size={104} />
      </Abs>
      <Abs x={0} y={168} center style={up(frame + 6, 0)}>
        <Head text={scene.accent ?? ""} size={150} color={C.accent} />
      </Abs>
      <Disc cx={540} cy={575} r={210} p={disc} lineY={690} line={prog(frame + 8, 0, 20)} />
      <Abs x={0} y={395 + float} center>
        <Saturn id="hook-sat" width={640} draw={planet} />
      </Abs>
      {[0, 1, 2].map((i) => {
        const at = qAt + i * 4;
        const s = up(frame, at, 40, 12);
        return (
          <Abs key={i} x={170 + i * 260} y={815} w={220} style={s}>
            <Tile w={220} h={180} top={`No. 0${i + 1}`} name="?" sub="राशि" />
          </Abs>
        );
      })}
    </Stage>
  );
};

// ---------- 2. open loop: names at the end ----------

export const LoopScene: React.FC<P> = ({ scene, words }) => {
  const frame = useCurrentFrame();
  const labelAt = useAt(scene, words, scene.labelWord, 50);
  const u = prog(frame, labelAt + 4, 16);
  return (
    <Stage>
      <Abs x={0} y={30} center style={up(frame, 0)}>
        <Head text={scene.headline ?? ""} size={120} />
      </Abs>
      {[0, 1, 2].map((i) => (
        <Abs key={i} x={150 + i * 270} y={250} w={240} style={{ ...up(frame, 6 + i * 4, 50), rotate: `${(i - 1) * 4 + Math.sin(frame / 14 + i) * 1.2}deg` }}>
          <div style={{ width: 240, height: 330, boxSizing: "border-box", border: `4px solid ${C.ink}`, background: `repeating-linear-gradient(45deg, ${rgba(C.ink, 0.85)} 0 3px, transparent 3px 11px), ${C.paper}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div style={{ width: 110, height: 110, borderRadius: 55, background: C.accent, border: `4px solid ${C.ink}`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: F.head, fontWeight: 800, fontSize: 70, color: C.white }}>?</div>
          </div>
        </Abs>
      ))}
      <Abs x={0} y={650} center style={up(frame, labelAt, 30)}>
        <div style={{ position: "relative", display: "inline-block" }}>
          <Head text={scene.label ?? ""} size={92} color={C.accent} />
          <div style={{ position: "absolute", left: 0, bottom: -6, height: 10, width: `${u * 100}%`, background: C.ink }} />
        </div>
      </Abs>
      <Abs x={0} y={800} center style={up(frame, labelAt + 10, 20)}>
        <Small size={26}>पहले समझ · फिर नाम</Small>
      </Abs>
    </Stage>
  );
};

// ---------- 3. the 7½-year cycle ----------

export const CycleScene: React.FC<P> = ({ scene, words }) => {
  const frame = useCurrentFrame();
  const steps = scene.steps ?? [];
  const unitAt = useAt(scene, words, scene.unitWord, 20);
  const stepAt = steps.map((s, i) => useAt(scene, words, s.word, 90 + i * 40)); // eslint-disable-line react-hooks/rules-of-hooks
  const totalAt = useAt(scene, words, scene.totalWord, 280);
  const tileW = 270;
  const gap = 30;
  const x0 = 540 - (tileW * 3 + gap * 2) / 2;
  const centers = [0, 1, 2].map((i) => x0 + i * (tileW + gap) + tileW / 2);
  // Saturn glides from tile to tile as each is named.
  let satX = centers[0] - 360;
  let active = -1;
  stepAt.forEach((at, i) => {
    const p = interpolate(frame, [at - 4, at + 12], [0, 1], { ...clamp, easing: paper.ease.inOut });
    if (p > 0) {
      satX = (i === 0 ? centers[0] - 360 : centers[i - 1]) + (centers[i] - (i === 0 ? centers[0] - 360 : centers[i - 1])) * p;
      if (p > 0.5) active = i;
    }
  });
  const enter = prog(frame, 0, 18);
  const brace = prog(frame, totalAt, 20);
  return (
    <Stage>
      <Abs x={0} y={0} center style={up(frame, 0)}>
        <Head text="शनि · एक राशि में" size={84} />
      </Abs>
      <Abs x={0} y={100} center style={up(frame, unitAt)}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 18 }}>
          <span style={{ fontFamily: F.display, fontSize: 150, lineHeight: 1, color: C.accent }}>2½</span>
          <span style={{ fontFamily: F.head, fontWeight: 800, fontSize: 84, color: C.ink }}>साल</span>
        </div>
      </Abs>
      {/* Saturn moving along */}
      <div style={{ position: "absolute", left: satX - 120, top: 300, opacity: enter }}>
        <Saturn id="cyc-sat" width={240} draw={1} />
      </div>
      <svg width={1080} height={980} style={{ position: "absolute", inset: 0, overflow: "visible" }} aria-hidden="true">
        {active >= 0 ? <DottedLine x1={satX} y1={420} x2={centers[active]} y2={470} p={1} /> : null}
      </svg>
      {[0, 1, 2].map((i) => {
        const on = active === i;
        const passed = active > i;
        return (
          <Abs key={i} x={x0 + i * (tileW + gap)} y={480} w={tileW} style={up(frame, 6 + i * 3, 40)}>
            <Tile w={tileW} h={300} top={`चरण ${i + 1}`} name={steps[i]?.label ?? ""} sub="2½ साल" hot={on}>
              {i === 1 ? <Crescent id={`cyc-moon-${i}`} size={74} /> : null}
            </Tile>
            <div style={{ height: 14, marginTop: 18, background: rgba(C.ink, 0.12), position: "relative" }}>
              <div style={{ position: "absolute", inset: 0, width: on || passed ? "100%" : "0%", background: C.accent }} />
            </div>
            {passed ? <div style={{ position: "absolute", right: -6, top: -6, width: 26, height: 26, background: C.accent }} /> : null}
          </Abs>
        );
      })}
      {/* bracket over all three */}
      <svg width={1080} height={980} style={{ position: "absolute", inset: 0 }} aria-hidden="true">
        <path d={`M ${x0} 850 V 880 H ${x0 + tileW * 3 + gap * 2} V 850`} fill="none" stroke={C.ink} strokeWidth="6" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - brace} />
      </svg>
      <Abs x={0} y={892} center style={up(frame, totalAt + 6, 20)}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 16 }}>
          <span style={{ fontFamily: F.display, fontSize: 84, lineHeight: 1, color: C.accent }}>7½ साल</span>
          <span style={{ fontFamily: F.head, fontWeight: 800, fontSize: 60, color: C.ink }}>= साढ़े साती</span>
        </div>
      </Abs>
    </Stage>
  );
};

// ---------- 4. every ~30 years ----------

export const OrbitScene: React.FC<P> = ({ scene, words }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const statAt = useAt(scene, words, scene.statWord, 20);
  const lifeAt = useAt(scene, words, scene.lifeWord, 80);
  const a = interpolate(frame, [0, durationInFrames], [-0.6, Math.PI * 2 - 0.6]);
  const rx = 330;
  const ry = 110;
  const sx = 540 + Math.cos(a) * rx;
  const sy = 420 + Math.sin(a) * ry;
  const behind = Math.sin(a) < 0;
  const bars = [25, 55, 85];
  return (
    <Stage>
      <Abs x={0} y={0} center style={up(frame, statAt)}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 22 }}>
          <span style={{ fontFamily: F.head, fontWeight: 800, fontSize: 70, color: C.ink }}>हर</span>
          <span style={{ fontFamily: F.display, fontSize: 210, lineHeight: 1, color: C.accent }}>{scene.stat}</span>
          <span style={{ fontFamily: F.head, fontWeight: 800, fontSize: 110, color: C.ink }}>{scene.statSuffix}</span>
        </div>
      </Abs>
      <svg width={1080} height={980} style={{ position: "absolute", inset: 0 }} aria-hidden="true">
        <ellipse cx={540} cy={420} rx={rx} ry={ry} fill="none" stroke={C.ink} strokeWidth="3" strokeDasharray="4 12" />
      </svg>
      {behind ? <div style={{ position: "absolute", left: sx - 70, top: sy - 46 }}><Saturn id="orb-sat-b" width={140} /></div> : null}
      <Abs x={0} y={340} center>
        <Sun id="orb-sun" size={170} />
      </Abs>
      {!behind ? <div style={{ position: "absolute", left: sx - 70, top: sy - 46 }}><Saturn id="orb-sat-f" width={140} /></div> : null}
      <Abs x={0} y={575} center style={up(frame, 8, 20)}>
        <Small size={24}>शनि का एक चक्कर ≈ 29½ साल</Small>
      </Abs>
      {/* a lifetime, 0 to 90 years */}
      <div style={{ position: "absolute", left: 120, top: 700, width: 840, ...up(frame, lifeAt - 6, 20) }}>
        <div style={{ height: 8, background: C.ink }} />
        {[0, 30, 60, 90].map((y) => (
          <div key={y} style={{ position: "absolute", left: (y / 90) * 840 - 40, top: 22, width: 80, textAlign: "center", fontFamily: F.head, fontWeight: 800, fontSize: 34, color: C.inkSoft }}>{y}</div>
        ))}
        {bars.map((b, i) => {
          const p = prog(frame, lifeAt + i * 8, 12);
          return (
            <div key={b} style={{ position: "absolute", left: (b / 90) * 840, top: -26, width: (7.5 / 90) * 840 * p, height: 60, background: i === 2 ? rgba(C.accent, 0.45) : C.accent, border: p > 0 ? `3px solid ${C.ink}` : "none" }} />
          );
        })}
        <div style={{ position: "absolute", left: 0, top: 80, width: 840, textAlign: "center", ...up(frame, lifeAt + 20, 16) }}>
          <span style={{ fontFamily: F.head, fontWeight: 800, fontSize: 56, color: C.ink }}>ज़िंदगी में </span>
          <span style={{ fontFamily: F.head, fontWeight: 800, fontSize: 56, color: C.accent }}>2 या 3 बार</span>
        </div>
      </div>
    </Stage>
  );
};

// ---------- 5. Saturn as a trainer ----------

export const TrainerScene: React.FC<P> = ({ scene, words }) => {
  const frame = useCurrentFrame();
  const trainerAt = useAt(scene, words, scene.trainerWord, 60);
  const keys = scene.keys ?? [];
  const keyAt = keys.map((k, i) => useAt(scene, words, k.word, 180 + i * 20)); // eslint-disable-line react-hooks/rules-of-hooks
  const kunjiAt = useAt(scene, words, "कुंजी", 300);
  const dumb = interpolate(frame, [trainerAt - 4, trainerAt + 26], [0, 1], { ...clamp, easing: paper.ease.inOut });
  const lift = frame > trainerAt + 26 ? Math.sin((frame - trainerAt - 26) / 10) * 14 : 0;
  const nodes = [
    { x: 200, y: 640 },
    { x: 540, y: 760 },
    { x: 880, y: 640 },
  ];
  return (
    <Stage>
      <Abs x={0} y={0} center style={up(frame, 0)}>
        <Head text={scene.headline ?? ""} size={110} />
      </Abs>
      <Abs x={0} y={130} center style={up(frame, trainerAt)}>
        <Head text={scene.accent ?? ""} size={150} color={C.accent} />
      </Abs>
      <Disc cx={540} cy={470} r={150} p={prog(frame, trainerAt + 2, 20)} lineY={555} line={prog(frame, trainerAt + 6, 18)} />
      <Abs x={0} y={330 - lift} center>
        <Dumbbell id="tr-db" width={520} draw={dumb} />
      </Abs>
      <svg width={1080} height={980} style={{ position: "absolute", inset: 0 }} aria-hidden="true">
        {keyAt.slice(1).map((at, i) => (
          <DottedLine key={i} x1={nodes[i].x} y1={nodes[i].y} x2={nodes[i + 1].x} y2={nodes[i + 1].y} p={prog(frame, at, 14)} />
        ))}
      </svg>
      {keys.map((k, i) => (
        <div key={i} style={{ position: "absolute", left: nodes[i].x - 150, top: nodes[i].y - 40, width: 300, textAlign: "center", ...up(frame, keyAt[i], 30, 12) }}>
          <div style={{ display: "inline-block", padding: "6px 30px 12px", background: i === 1 ? C.ink : C.paper, border: `4px solid ${C.ink}`, fontFamily: F.head, fontWeight: 800, fontSize: 56, color: i === 1 ? C.white : C.ink }}>{k.text}</div>
        </div>
      ))}
      <Abs x={0} y={860} center style={up(frame, kunjiAt, 30)}>
        <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
          <Key id="tr-key" width={200} />
          <span style={{ fontFamily: F.head, fontWeight: 800, fontSize: 54, color: C.ink }}>इस समय की कुंजी</span>
        </div>
      </Abs>
    </Stage>
  );
};

// ---------- 6. who has it now ----------

export const RevealScene: React.FC<P> = ({ scene, words }) => {
  const frame = useCurrentFrame();
  const rows = scene.rows ?? [];
  const rowAt = rows.map((r, i) => useAt(scene, words, r.word, 30 + i * 70)); // eslint-disable-line react-hooks/rules-of-hooks
  return (
    <Stage>
      <Abs x={0} y={0} center style={up(frame, 0)}>
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div style={{ width: 22, height: 22, background: C.accent }} />
          <Head text={scene.headline ?? ""} size={84} />
        </div>
      </Abs>
      {rows.map((r, i) => {
        const at = rowAt[i];
        const on = frame >= at;
        const bar = prog(frame, at + 6, 16);
        return (
          <div key={i} style={{ position: "absolute", left: 90, top: 150 + i * 270, width: 900, height: 240, ...up(frame, at, 40, 14) }}>
            <div style={{ position: "absolute", left: 0, top: 0, width: 900, height: 5, background: C.ink }} />
            <div style={{ position: "absolute", left: 0, top: 26, fontFamily: F.display, fontSize: 64, color: on ? C.accent : C.inkSoft, lineHeight: 1 }}>0{i + 1}</div>
            <div style={{ position: "absolute", left: 120, top: 6, fontFamily: F.head, fontWeight: 800, fontSize: 120, lineHeight: 1.1, color: C.ink }}>{r.name}</div>
            <div style={{ position: "absolute", right: 0, top: 30 }}>
              <Small size={24}>{r.latin}</Small>
            </div>
            <div style={{ position: "absolute", right: 0, top: 78, fontFamily: F.head, fontWeight: 800, fontSize: 44, color: C.accent, textAlign: "right" }}>{r.phase}</div>
            {/* which third of the 7½ years */}
            <div style={{ position: "absolute", left: 120, top: 172, width: 780, display: "flex", gap: 10 }}>
              {[0, 1, 2].map((k) => (
                <div key={k} style={{ flex: 1, height: 22, border: `3px solid ${C.ink}`, background: k === i ? C.accent : "transparent", transform: k === i ? `scaleX(${bar})` : undefined, transformOrigin: "left" }} />
              ))}
            </div>
          </div>
        );
      })}
    </Stage>
  );
};

// ---------- 7. dhaiya ----------

export const DhaiyaScene: React.FC<P> = ({ scene, words }) => {
  const frame = useCurrentFrame();
  const items = scene.items ?? [];
  const itemAt = items.map((it, i) => useAt(scene, words, it.word, 20 + i * 14)); // eslint-disable-line react-hooks/rules-of-hooks
  return (
    <Stage>
      <Abs x={0} y={20} center style={up(frame, 0)}>
        <Small color={C.accent} size={28}>और</Small>
      </Abs>
      <Abs x={0} y={70} center style={up(frame, 2)}>
        <Head text={scene.headline ?? ""} size={120} />
      </Abs>
      <Abs x={0} y={250} center style={up(frame, 6)}>
        <Saturn id="dh-sat" width={300} />
      </Abs>
      {items.map((it, i) => (
        <Abs key={i} x={150 + i * 420} y={520} w={360} style={up(frame, itemAt[i], 50, 12)}>
          <Tile w={360} h={300} top={it.latin} name={it.name} sub="ढैय्या · 2½ साल" hot={i === 0} />
        </Abs>
      ))}
    </Stage>
  );
};

// ---------- 8. CTA ----------

const RASHI = ["मेष", "वृषभ", "मिथुन", "कर्क", "सिंह", "कन्या", "तुला", "वृश्चिक", "धनु", "मकर", "कुंभ", "मीन"];

export const PaperCta: React.FC<P> = ({ scene, words }) => {
  const frame = useCurrentFrame();
  const teaserAt = useAt(scene, words, scene.teaserWord, 90);
  const followAt = useAt(scene, words, "फॉलो", 190);
  const name = RASHI[Math.floor(Math.max(0, frame - 10) / 14) % 12];
  const cursor = Math.floor(frame / 8) % 2 === 0;
  return (
    <Stage>
      <Abs x={0} y={0} center style={up(frame, 0)}>
        <Head text={scene.headline ?? ""} size={140} />
      </Abs>
      <Abs x={0} y={190} center style={up(frame, 6)}>
        <Small size={28} color={C.accent}>{scene.body}</Small>
      </Abs>
      <div style={{ position: "absolute", left: 140, top: 260, width: 800, ...up(frame, 10, 30) }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 20, padding: "0 0 14px", borderBottom: `6px solid ${C.ink}` }}>
          <span style={{ fontFamily: F.head, fontWeight: 700, fontSize: 52, color: C.inkSoft }}>मेरी राशि:</span>
          <span style={{ fontFamily: F.head, fontWeight: 800, fontSize: 70, color: C.accent }}>{name}</span>
          <span style={{ width: 6, height: 62, background: C.ink, opacity: cursor ? 1 : 0, alignSelf: "center" }} />
        </div>
      </div>
      <div style={{ position: "absolute", left: 100, top: 470, width: 880, ...up(frame, teaserAt, 40) }}>
        <div style={{ background: C.ink, padding: "34px 40px", display: "flex", alignItems: "center", gap: 30 }}>
          <div style={{ padding: "4px 26px 10px", background: C.accent, fontFamily: F.head, fontWeight: 800, fontSize: 50, color: C.white, flexShrink: 0 }}>{scene.teaserTag}</div>
          <div style={{ fontFamily: F.head, fontWeight: 700, fontSize: 48, lineHeight: 1.3, color: C.white }}>{scene.teaser}</div>
        </div>
      </div>
      <Abs x={0} y={760} center style={up(frame, followAt, 30)}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 20, padding: "16px 56px 22px", border: `6px solid ${C.ink}`, background: C.paper, boxShadow: `10px 10px 0 ${C.accent}`, fontFamily: F.head, fontWeight: 800, fontSize: 62, color: C.ink }}>
          <div style={{ width: 24, height: 24, background: C.accent }} />
          {scene.button}
        </div>
      </Abs>
    </Stage>
  );
};
