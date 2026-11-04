import React from "react";
import { Audio } from "@remotion/media";
import { AbsoluteFill, interpolate, Sequence, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import "./fonts";
import { AstroCaptions } from "./AstroCaptions";
import { AstroBg, AstroFinish, findWordFrame, W } from "./parts";
import { AstroScene, ClockScene, CrowdScene, CtaScene, KundliScene, MoonScene, PointScene, QuestionScene, TwinsScene } from "./scenes";
import { astro, rgba } from "./theme";

const C = astro.colors;
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

export type AstroReelProps = {
  audio: string | null;
  music: string | null;
  musicVolume: number;
  sfx: boolean;
  captions: boolean;
  scenes: AstroScene[];
  words: W[];
  durationMs: number;
};

const SceneSwitch: React.FC<{ scene: AstroScene; words: W[] }> = ({ scene, words }) => {
  const p = { scene, words };
  switch (scene.visual) {
    case "crowd":
      return <CrowdScene {...p} />;
    case "question":
      return <QuestionScene {...p} />;
    case "moon":
      return <MoonScene {...p} />;
    case "kundli":
      return <KundliScene {...p} />;
    case "clock":
      return <ClockScene {...p} />;
    case "twins":
      return <TwinsScene {...p} />;
    case "cta":
      return <CtaScene {...p} />;
    default:
      return <PointScene {...p} />;
  }
};

type Punch = { at: number; strong?: boolean };
type Move = "zoom" | "whipLeft" | "whipRight" | "rise";
const MOVES: Move[] = ["zoom", "whipLeft", "zoom", "rise", "whipRight", "zoom", "rise"];

const ENTER = 9;
const EXIT = 7;

// Camera for one scene: transition in/out, slow push-in, and punch-zooms (+ shake) on key words.
const Shell: React.FC<{ children: React.ReactNode; index: number; punches: Punch[] }> = ({ children, index, punches }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const move = MOVES[index % MOVES.length];
  const first = index === 0;
  const tin = first ? 1 : interpolate(frame, [0, ENTER], [0, 1], { ...clamp, easing: astro.ease.out });
  const tout = interpolate(frame, [durationInFrames - EXIT, durationInFrames - 1], [0, 1], { ...clamp, easing: astro.ease.in });

  let scale = 1 + 0.045 * (frame / Math.max(1, durationInFrames)); // slow push-in
  let x = 0;
  let y = 0;
  let rot = 0;
  for (const p of punches) {
    const t = frame - p.at;
    if (t < 0 || t > 40) continue;
    const e = Math.exp(-t / (p.strong ? 5 : 4));
    scale += (p.strong ? 0.09 : 0.05) * e;
    if (p.strong) {
      x += 16 * Math.exp(-t / 3.5) * Math.sin(t * 2.3);
      rot += 1.4 * Math.exp(-t / 3.5) * Math.sin(t * 1.7);
    }
  }
  let blur = 0;
  let opacity = 1;
  if (move === "zoom") {
    scale *= interpolate(tin, [0, 1], [1.35, 1]) * interpolate(tout, [0, 1], [1, 1.3]);
  } else if (move === "whipLeft" || move === "whipRight") {
    const dir = move === "whipLeft" ? 1 : -1;
    x += dir * (interpolate(tin, [0, 1], [700, 0]) + interpolate(tout, [0, 1], [0, -700]));
  } else {
    y += interpolate(tin, [0, 1], [520, 0]) + interpolate(tout, [0, 1], [0, -520]);
  }
  blur = (1 - tin) * 18 + tout * 16;
  opacity = Math.min(first ? 1 : interpolate(tin, [0, 0.35], [0, 1], clamp), interpolate(tout, [0.6, 1], [1, 0], clamp));

  return (
    <AbsoluteFill
      style={{
        opacity,
        transform: `translate(${x}px, ${y}px) scale(${scale}) rotate(${rot}deg)`,
        filter: blur > 0.3 ? `blur(${blur}px)` : undefined,
      }}
    >
      <div
        style={{
          position: "absolute",
          top: astro.layout.contentTop,
          left: astro.layout.side - 20,
          right: astro.layout.side - 20,
          height: astro.layout.contentHeight,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {children}
      </div>
    </AbsoluteFill>
  );
};

// Quick light flash on every cut.
export const CutFlash: React.FC = () => {
  const frame = useCurrentFrame();
  const o = interpolate(frame, [0, 6], [0.55, 0], clamp);
  return <AbsoluteFill style={{ background: `radial-gradient(circle at 50% 45%, #FFFFFF, ${rgba(C.orangeSoft, 0.9)})`, opacity: o, pointerEvents: "none" }} />;
};

export const BrandBar: React.FC<{ starts: number[]; total: number }> = ({ starts, total }) => {
  const frame = useCurrentFrame();
  return (
    <div style={{ position: "absolute", top: 180, left: astro.layout.side, right: astro.layout.side, display: "flex", alignItems: "center", gap: 26 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
        <span style={{ fontFamily: astro.fonts.display, fontSize: 48, color: C.ink, lineHeight: 1 }}>Astro</span>
        <span style={{ padding: "4px 14px 2px", borderRadius: 12, background: C.orange, border: `3px solid ${C.ink}`, color: C.white, fontFamily: astro.fonts.body, fontWeight: 800, fontSize: 30, lineHeight: 1.2 }}>24X7</span>
      </div>
      <div style={{ flex: 1, display: "flex", gap: 8 }}>
        {starts.map((s, i) => {
          const e = starts[i + 1] ?? total;
          const fill = interpolate(frame, [s, e], [0, 1], clamp);
          return (
            <div key={i} style={{ flex: 1, height: 9, borderRadius: 5, background: rgba(C.ink, 0.12), overflow: "hidden" }}>
              <div style={{ width: `${fill * 100}%`, height: "100%", background: C.orange }} />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export const Sfx: React.FC<{ at: number; src: string; volume: number; len?: number }> = ({ at, src, volume, len = 1 }) => {
  const { fps } = useVideoConfig();
  return (
    <Sequence from={Math.max(0, at)} durationInFrames={Math.round(fps * len)} layout="none">
      <Audio src={staticFile(src)} volume={volume} />
    </Sequence>
  );
};

export const AstroReel: React.FC<AstroReelProps> = (props) => {
  const { fps, durationInFrames } = useVideoConfig();
  const toFrame = (ms: number) => Math.round((ms / 1000) * fps);
  const starts = props.scenes.map((s, i) => (i === 0 ? 0 : toFrame(s.startMs)));
  const rel = (s: AstroScene, w?: string) => (w ? findWordFrame(props.words, s.startMs, w, -1, fps) : -1);

  // Key moments per scene (frames relative to the scene start) -> camera punches + sounds.
  const beats = props.scenes.map((s) => {
    const pills = (s.pills ?? []).map((p) => rel(s, p.word));
    return {
      stamp: rel(s, s.stampWord),
      you: rel(s, s.youWord),
      same: rel(s, s.sameWord),
      badge: rel(s, s.badge?.word),
      link: rel(s, s.linkWord),
      pills,
      lagna: rel(s, s.lagnaWord),
      reveal: rel(s, s.revealWord),
      shift: rel(s, s.shiftWord),
      follow: s.visual === "cta" ? rel(s, "फॉलो") : -1,
    };
  });
  const punchesFor = (i: number): Punch[] => {
    const b = beats[i];
    const out: Punch[] = [];
    const add = (at: number, strong = false) => at >= 0 && !out.some((p) => Math.abs(p.at - at) < 4) && out.push({ at, strong });
    add(b.stamp, true);
    add(b.shift, true);
    add(b.reveal, true);
    add(b.lagna);
    add(b.you);
    add(b.same);
    add(b.badge);
    add(b.link);
    b.pills.forEach((p) => add(p));
    add(b.follow);
    return out.sort((a, c) => a.at - c.at);
  };

  const abs = (i: number, f: number) => (f >= 0 ? starts[i] + f : -1);

  return (
    <AbsoluteFill style={{ backgroundColor: C.bg }}>
      <AstroBg />
      {props.scenes.map((scene, i) => {
        const from = starts[i];
        const to = starts[i + 1] ?? durationInFrames;
        return (
          <Sequence key={i} from={from} durationInFrames={Math.max(1, to - from)} premountFor={fps}>
            <Shell index={i} punches={punchesFor(i)}>
              <SceneSwitch scene={scene} words={props.words} />
            </Shell>
            {i > 0 ? <CutFlash /> : null}
          </Sequence>
        );
      })}
      <BrandBar starts={starts} total={durationInFrames} />
      {props.captions && props.words.length ? <AstroCaptions words={props.words} sceneEnds={props.scenes.map((s) => s.endMs)} /> : null}
      <AstroFinish />

      {props.audio ? <Audio src={staticFile(props.audio)} /> : null}
      {props.music ? (
        <Audio
          src={staticFile(props.music)}
          volume={(f) =>
            props.musicVolume *
            interpolate(f, [0, 6, durationInFrames - 50, durationInFrames - 1], [0.4, 1, 1, 0], clamp)
          }
        />
      ) : null}
      {props.sfx ? (
        <>
          <Sfx at={0} src="sfx/hit.wav" volume={0.55} />
          <Sfx at={0} src="sfx/whoosh.wav" volume={0.22} len={0.6} />
          {starts.slice(1).map((f, i) => (
            <Sfx key={`w${i}`} at={f - 5} src="sfx/whoosh.wav" volume={0.26} len={0.6} />
          ))}
          {beats.map((b, i) => (
            <React.Fragment key={`b${i}`}>
              {b.stamp >= 0 ? <Sfx at={abs(i, b.stamp)} src="sfx/hit.wav" volume={0.6} /> : null}
              {b.shift >= 0 ? <Sfx at={abs(i, b.shift) - 36} src="sfx/riser.wav" volume={0.22} len={1.3} /> : null}
              {b.shift >= 0 ? <Sfx at={abs(i, b.shift)} src="sfx/hit.wav" volume={0.45} /> : null}
              {b.shift >= 0 ? <Sfx at={abs(i, b.shift)} src="sfx/sparkle.wav" volume={0.3} /> : null}
              {b.reveal >= 0 ? <Sfx at={abs(i, b.reveal)} src="sfx/hit.wav" volume={0.4} /> : null}
              {b.lagna >= 0 ? <Sfx at={abs(i, b.lagna)} src="sfx/sparkle.wav" volume={0.3} /> : null}
              {b.same >= 0 ? <Sfx at={abs(i, b.same)} src="sfx/sparkle.wav" volume={0.25} /> : null}
              {[b.you, b.badge, b.link, ...b.pills, b.follow].filter((f) => f >= 0).map((f, k) => (
                <Sfx key={k} at={abs(i, f)} src="sfx/pop.wav" volume={0.28} len={0.4} />
              ))}
            </React.Fragment>
          ))}
        </>
      ) : null}
    </AbsoluteFill>
  );
};
