// Astro 24x7 "Paper" reel: editorial old-paper page with a black header bar, ink engravings,
// one orange accent, quiet sentence subtitles and a barcode footer.
import React, { useMemo } from "react";
import { Audio } from "@remotion/media";
import type { TikTokPage } from "@remotion/captions";
import { AbsoluteFill, interpolate, Sequence, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import "../astro/fonts";
import { findWordFrame, W } from "../astro/parts";
import { Barcode } from "./ink";
import { CycleScene, DhaiyaScene, HookScene, LoopScene, OrbitScene, PaperCta, PaperScene, RevealScene, TrainerScene } from "./scenes";
import { paper, rgba } from "./theme";

const C = paper.colors;
const F = paper.fonts;
const L = paper.layout;
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

export type PaperReelProps = {
  audio: string | null;
  music: string | null;
  musicVolume: number;
  sfx: boolean;
  captions: boolean;
  header: { title: string; latin1: string; latin2: string; issue: string };
  scenes: PaperScene[];
  words: W[];
  durationMs: number;
};

const NOISE = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='3' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 0.35 0 0 0 0 0.28 0 0 0 0 0.2 0 0 0 0.9 0'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)'/%3E%3C/svg%3E")`;
const FIBRE = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='600' height='600'%3E%3Cfilter id='f'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.012 0.09' numOctaves='2' seed='5'/%3E%3CfeColorMatrix values='0 0 0 0 0.45 0 0 0 0 0.37 0 0 0 0 0.27 0 0 0 1.4 -0.55'/%3E%3C/filter%3E%3Crect width='600' height='600' filter='url(%23f)'/%3E%3C/svg%3E")`;

const PaperBg: React.FC = () => (
  <AbsoluteFill style={{ background: `radial-gradient(ellipse at 50% 40%, ${C.paper} 40%, ${C.paperDeep} 100%)` }}>
    <AbsoluteFill style={{ backgroundImage: FIBRE, backgroundSize: "600px", opacity: 0.16, mixBlendMode: "multiply" }} />
    <AbsoluteFill style={{ backgroundImage: NOISE, backgroundSize: "300px", opacity: 0.18, mixBlendMode: "multiply" }} />
  </AbsoluteFill>
);

const Grain: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill
      style={{
        pointerEvents: "none",
        backgroundImage: NOISE,
        backgroundSize: "300px",
        backgroundPosition: `${(frame * 37) % 300}px ${(frame * 53) % 300}px`,
        opacity: 0.08,
        mixBlendMode: "multiply",
      }}
    />
  );
};

const Header: React.FC<{ h: PaperReelProps["header"] }> = ({ h }) => (
  <>
    <div style={{ position: "absolute", top: L.headerTop - 44, left: 0, width: 1080, textAlign: "center", fontFamily: F.head, fontWeight: 800, fontSize: 28, color: C.ink, letterSpacing: 1 }}>
      एस्ट्रो 24x7
    </div>
    <div style={{ position: "absolute", top: L.headerTop - 36, left: L.side, width: 16, height: 16, background: C.accent }} />
    <div style={{ position: "absolute", top: L.headerTop - 36, right: L.side, width: 16, height: 16, background: C.accent }} />
    <div style={{ position: "absolute", top: L.headerTop, left: 0, width: 1080, height: L.headerH, background: C.ink, display: "flex", alignItems: "center", justifyContent: "space-between", padding: `0 ${L.side}px`, boxSizing: "border-box" }}>
      <span style={{ fontFamily: F.head, fontWeight: 800, fontSize: 78, color: C.white, lineHeight: 1 }}>{h.title}</span>
      <div style={{ textAlign: "right", fontFamily: F.head, fontWeight: 700, fontSize: 21, letterSpacing: 5, color: rgba(C.white, 0.8), lineHeight: 1.5 }}>
        <div>{h.latin1}</div>
        <div>{h.latin2}</div>
      </div>
    </div>
    <div style={{ position: "absolute", top: L.headerTop + L.headerH, left: 0, width: 1080, height: 5, background: C.accent }} />
  </>
);

const Footer: React.FC<{ h: PaperReelProps["header"]; total: number }> = ({ h, total }) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [0, total], [0, 1], clamp);
  return (
    <div style={{ position: "absolute", top: L.footerTop, left: L.side, right: L.side, display: "flex", alignItems: "flex-end", justifyContent: "space-between" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        <div style={{ width: 18, height: 18, background: C.accent }} />
        <div style={{ width: 240, height: 4, background: rgba(C.ink, 0.18) }}>
          <div style={{ width: `${p * 100}%`, height: "100%", background: C.ink }} />
        </div>
      </div>
      <div style={{ display: "flex", alignItems: "flex-end", gap: 14 }}>
        <div style={{ textAlign: "right", fontFamily: F.head, fontWeight: 700, fontSize: 19, letterSpacing: 2, color: C.inkSoft, lineHeight: 1.3 }}>
          <div>{h.title} · एस्ट्रो 24x7</div>
          <div>{h.latin2} · {h.latin1}</div>
        </div>
        <Barcode width={120} height={44} />
        <span style={{ fontFamily: F.display, fontSize: 52, lineHeight: 0.8, color: C.ink }}>{h.issue}</span>
      </div>
    </div>
  );
};

const SceneSwitch: React.FC<{ scene: PaperScene; words: W[] }> = ({ scene, words }) => {
  const p = { scene, words };
  switch (scene.visual) {
    case "hook":
      return <HookScene {...p} />;
    case "loop":
      return <LoopScene {...p} />;
    case "cycle":
      return <CycleScene {...p} />;
    case "orbit":
      return <OrbitScene {...p} />;
    case "trainer":
      return <TrainerScene {...p} />;
    case "reveal":
      return <RevealScene {...p} />;
    case "dhaiya":
      return <DhaiyaScene {...p} />;
    default:
      return <PaperCta {...p} />;
  }
};

// Page-turn style change: old page slides up and fades, new one settles in from below.
const Page: React.FC<{ children: React.ReactNode; first: boolean }> = ({ children, first }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const tin = first ? 1 : interpolate(frame, [0, 10], [0, 1], { ...clamp, easing: paper.ease.out });
  const tout = interpolate(frame, [durationInFrames - 7, durationInFrames - 1], [0, 1], { ...clamp, easing: paper.ease.in });
  const drift = interpolate(frame, [0, durationInFrames], [0, -14]);
  return (
    <div style={{ position: "absolute", top: L.contentTop, left: 0, width: 1080, height: L.contentHeight, opacity: Math.min(tin, 1 - tout), transform: `translateY(${(1 - tin) * 60 - tout * 60 + drift}px)` }}>
      {children}
    </div>
  );
};

// Quiet sentence subtitles, the spoken word in the accent colour.
const Subtitles: React.FC<{ words: W[]; sceneEnds: number[] }> = ({ words, sceneEnds }) => {
  const { fps } = useVideoConfig();
  const pages = useMemo(() => {
    const lastInScene = new Set(
      sceneEnds.map((end) => {
        let idx = -1;
        words.forEach((w, i) => {
          if (w.startMs < end) idx = i;
        });
        return idx;
      }),
    );
    // Phrase-aware pages: break at punctuation, at a scene end, or after ~6 words.
    const out: TikTokPage[] = [];
    let cur: W[] = [];
    const flush = () => {
      if (!cur.length) return;
      out.push({
        text: cur.map((w) => w.text).join(" "),
        startMs: cur[0].startMs,
        durationMs: cur[cur.length - 1].endMs - cur[0].startMs,
        tokens: cur.map((w, k) => ({ text: (k ? " " : "") + w.text, fromMs: w.startMs, toMs: w.endMs })),
      });
      cur = [];
    };
    words.forEach((w, i) => {
      cur.push(w);
      const chars = cur.reduce((n, x) => n + x.text.length + 1, 0);
      if (lastInScene.has(i) || /[,।?!;:]$/.test(w.text) || cur.length >= 6 || chars > 34) flush();
    });
    flush();
    return out;
  }, [words, sceneEnds]);
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      {pages.map((page, i) => {
        const next = pages[i + 1];
        const from = Math.round((page.startMs / 1000) * fps);
        const lastEnd = page.tokens[page.tokens.length - 1]?.toMs ?? page.startMs + 1500;
        const endMs = Math.min(next ? next.startMs : Infinity, lastEnd + 400);
        const dur = Math.round((endMs / 1000) * fps) - from;
        if (dur <= 0) return null;
        return (
          <Sequence key={i} from={from} durationInFrames={dur} layout="none">
            <SubPage page={page} />
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};

const SubPage: React.FC<{ page: TikTokPage }> = ({ page }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const nowMs = page.startMs + (frame / fps) * 1000;
  const o = interpolate(frame, [0, 5], [0, 1], clamp);
  return (
    <div style={{ position: "absolute", top: L.captionTop, left: 110, right: 110, textAlign: "center", opacity: o }}>
      <span style={{ whiteSpace: "pre-wrap", fontFamily: F.head, fontWeight: 700, fontSize: 50, lineHeight: 1.35, color: C.ink }}>
        {page.tokens.map((tok, i) => {
          const active = tok.fromMs <= nowMs && tok.toMs > nowMs;
          return (
            <span key={i} style={{ color: active ? C.accent : C.ink }}>
              {tok.text}
            </span>
          );
        })}
      </span>
    </div>
  );
};

const Sfx: React.FC<{ at: number; src: string; volume: number; len?: number }> = ({ at, src, volume, len = 1 }) => {
  const { fps } = useVideoConfig();
  return (
    <Sequence from={Math.max(0, at)} durationInFrames={Math.round(fps * len)} layout="none">
      <Audio src={staticFile(src)} volume={volume} />
    </Sequence>
  );
};

export const PaperReel: React.FC<PaperReelProps> = (props) => {
  const { fps, durationInFrames } = useVideoConfig();
  const toFrame = (ms: number) => Math.round((ms / 1000) * fps);
  const starts = props.scenes.map((s, i) => (i === 0 ? 0 : toFrame(s.startMs)));
  const cue = (s: PaperScene, w?: string) => (w ? findWordFrame(props.words, s.startMs, w, -1, fps) : -1);
  const pops: number[] = [];
  props.scenes.forEach((s, i) => {
    const list = [
      cue(s, s.questionWord),
      cue(s, s.labelWord),
      ...(s.steps ?? []).map((x) => cue(s, x.word)),
      cue(s, s.totalWord),
      cue(s, s.statWord),
      cue(s, s.trainerWord),
      ...(s.keys ?? []).map((x) => cue(s, x.word)),
      ...(s.rows ?? []).map((x) => cue(s, x.word)),
      ...(s.items ?? []).map((x) => cue(s, x.word)),
      cue(s, s.teaserWord),
    ];
    list.filter((f) => f >= 0).forEach((f) => pops.push(starts[i] + f));
  });
  return (
    <AbsoluteFill style={{ backgroundColor: C.paper }}>
      <PaperBg />
      {props.scenes.map((scene, i) => {
        const from = starts[i];
        const to = starts[i + 1] ?? durationInFrames;
        return (
          <Sequence key={i} from={from} durationInFrames={Math.max(1, to - from)} premountFor={fps}>
            <Page first={i === 0}>
              <SceneSwitch scene={scene} words={props.words} />
            </Page>
          </Sequence>
        );
      })}
      <Header h={props.header} />
      <Footer h={props.header} total={durationInFrames} />
      {props.captions && props.words.length ? <Subtitles words={props.words} sceneEnds={props.scenes.map((s) => s.endMs)} /> : null}
      <Grain />
      <AbsoluteFill style={{ pointerEvents: "none", background: `radial-gradient(ellipse at center, transparent 62%, ${rgba("#3A2A14", 0.16)} 100%)` }} />

      {props.audio ? <Audio src={staticFile(props.audio)} /> : null}
      {props.music ? (
        <Audio src={staticFile(props.music)} volume={(f) => props.musicVolume * interpolate(f, [0, 6, durationInFrames - 50, durationInFrames - 1], [0.5, 1, 1, 0], clamp)} />
      ) : null}
      {props.sfx ? (
        <>
          {starts.slice(1).map((f, i) => (
            <Sfx key={`w${i}`} at={f - 4} src="sfx/whoosh.wav" volume={0.14} len={0.6} />
          ))}
          {pops.map((f, i) => (
            <Sfx key={`p${i}`} at={f} src="sfx/pop.wav" volume={0.16} len={0.4} />
          ))}
        </>
      ) : null}
    </AbsoluteFill>
  );
};
