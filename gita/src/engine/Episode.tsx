import React from "react";
import { AbsoluteFill, Audio, Img, Sequence, staticFile } from "remotion";
import { deva, num } from "../components/kit";
import { Finish, HANDLE, SeriesBar, SheetBg, Swipes } from "../components/sheet";
import { createTimeline, Timing } from "../lib/timeline";
import { G } from "../theme";
import { RowView, SceneCtx, toneColor, toneGlow } from "./core";
import { BeatsSceneView, CtaSceneView, SourceSceneView } from "./scenes";
import type { Episode, Scene } from "./types";
import { Atmos, Backdrop, CineFinish, Leaks, LightRays, Mood, StyleCtx } from "./cine";

const SceneView: React.FC<{ s: Scene }> = ({ s }) => {
  if (s.kind === "source") return <SourceSceneView s={s} />;
  if (s.kind === "cta") return <CtaSceneView s={s} />;
  return <BeatsSceneView s={s} />;
};

const LEAD = 10; // v2: next scene's backdrop fades in over the last frames of the previous one

export const EpisodeReel: React.FC<{ ep: Episode; timing: Timing }> = ({ ep, timing }) => {
  const T = createTimeline(timing);
  const v2 = ep.style === "v2";
  const cuts = ep.scenes
    .slice(1)
    .filter((s) => s.swipe !== false)
    .map((s) => T.sceneFrames(s.id).from);
  if (!v2) {
    return (
      <AbsoluteFill style={{ background: G.ink }}>
        <SheetBg tag={`GITA SHLOK SERIES · EP ${String(ep.ep).padStart(2, "0")} · BHAGAVAD GITA ${ep.shlok}`} />
        {ep.scenes.map((s) => {
          const { from, dur } = T.sceneFrames(s.id);
          const t = T.sceneById(s.id);
          return (
            <Sequence key={s.id} from={from} durationInFrames={dur} name={s.id}>
              <SceneCtx.Provider value={{ id: s.id, T, dur }}>
                <SceneView s={s} />
              </SceneCtx.Provider>
              {t.audio && <Audio src={staticFile(t.audio)} />}
            </Sequence>
          );
        })}
        <Swipes at={cuts} />
        <SeriesBar ep={ep.tag} />
        <Finish />
      </AbsoluteFill>
    );
  }
  return (
    <StyleCtx.Provider value={{ v2: true }}>
      <AbsoluteFill style={{ background: G.ink }}>
        {ep.scenes.map((s, i) => {
          const { from, dur } = T.sceneFrames(s.id);
          const lead = i === 0 ? 0 : LEAD;
          const backdrop = (s as { backdrop?: string }).backdrop ?? ep.backdrop;
          const mood = (s as { mood?: Mood }).mood ?? ep.mood;
          return (
            <Sequence key={s.id} from={from - lead} durationInFrames={dur + lead} name={s.id}>
              {backdrop && <Backdrop src={backdrop} dur={dur} lead={lead} mood={mood} seed={s.id} />}
              <LightRays mood={mood} />
              <Atmos mood={mood} seed={s.id} embers={mood === "red" ? 40 : 22} />
              <Sequence from={lead} durationInFrames={dur} layout="none">
                <SceneCtx.Provider value={{ id: s.id, T, dur }}>
                  <SceneView s={s} />
                </SceneCtx.Provider>
              </Sequence>
            </Sequence>
          );
        })}
        {ep.scenes.map((s) => {
          const { from, dur } = T.sceneFrames(s.id);
          const t = T.sceneById(s.id);
          return t.audio ? (
            <Sequence key={`a${s.id}`} from={from} durationInFrames={dur} layout="none">
              <Audio src={staticFile(t.audio)} />
            </Sequence>
          ) : null;
        })}
        <Leaks at={cuts} />
        <SeriesBar ep={ep.tag} />
        <CineFinish />
      </AbsoluteFill>
    </StyleCtx.Provider>
  );
};

/** Cover: everything inside the 3:4 grid crop (y 240–1680). */
export const EpisodeCover: React.FC<{ ep: Episode; timing: Timing }> = ({ ep, timing }) => {
  const T = createTimeline(timing);
  const cv = ep.cover;
  const mood = cv.mood ?? "gold";
  const pic = cv.pic;
  return (
    <AbsoluteFill style={{ background: G.ink }}>
      <SceneCtx.Provider value={{ id: ep.scenes[0].id, T, dur: 300 }}>
        {ep.style === "v2" && (cv.backdrop ?? ep.backdrop) ? (
          <>
            <Backdrop src={(cv.backdrop ?? ep.backdrop) as string} dur={300} lead={0} mood={(cv.mood ?? ep.mood) as Mood} seed="cover" />
            <LightRays mood={(cv.mood ?? ep.mood) as Mood} />
          </>
        ) : (
          <SheetBg />
        )}
        <div style={{ position: "absolute", left: 540 - 500, top: 1580 - pic.h * 0.62 - 500, width: 1000, height: 1000, borderRadius: "50%", background: `radial-gradient(circle, ${toneGlow(mood, 0.42)}, transparent 66%)` }} />
        <div style={{ position: "absolute", left: pic.x ?? 540, top: (pic.bottom ?? 1640) - pic.h, height: pic.h, transform: `translateX(-50%)${pic.flip ? " scaleX(-1)" : ""}` }}>
          <Img
            src={staticFile(pic.src)}
            style={{
              height: pic.h,
              width: "auto",
              display: "block",
              filter: pic.full ? undefined : `drop-shadow(0 0 50px ${toneGlow(mood, 0.6)})`,
              WebkitMaskImage: pic.full ? "radial-gradient(ellipse 50% 50% at 50% 50%, black 68%, transparent 100%)" : undefined,
              maskImage: pic.full ? "radial-gradient(ellipse 50% 50% at 50% 50%, black 68%, transparent 100%)" : undefined,
            }}
          />
        </div>
        <div style={{ position: "absolute", left: 0, right: 0, top: 1330, height: 400, background: `linear-gradient(180deg, transparent, ${G.ink} 70%)` }} />

        <div style={{ position: "absolute", top: 280, left: 84, right: 84, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, background: G.gold, borderRadius: 999, padding: "6px 28px 2px" }}>
            <div style={deva(44, G.ink, 800)}>गीता श्लोक सीरीज़</div>
            <div style={num(40, G.ink)}>· EP {String(ep.ep).padStart(2, "0")}</div>
          </div>
          <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
            <div style={deva(40, G.cream, 700)}>गीता</div>
            <div style={num(40, G.gold)}>{ep.shlok}</div>
          </div>
        </div>
        <div style={{ position: "absolute", top: 390, left: 40, right: 40, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
          {cv.rows.map((r, i) => (
            <RowView key={i} row={r} size={124} />
          ))}
        </div>
        {cv.pill && (
          <div style={{ position: "absolute", top: 1390, left: 0, right: 0, display: "flex", justifyContent: "center" }}>
            <div style={{ ...deva(96, cv.pill.tone === "red" || !cv.pill.tone ? G.white : G.ink), background: toneColor(cv.pill.tone ?? "red"), borderRadius: 26, padding: "4px 38px 0", transform: "rotate(-3deg)", boxShadow: `0 0 80px ${toneGlow(cv.pill.tone ?? "red", 0.5)}` }}>{cv.pill.text}</div>
          </div>
        )}
        <div style={{ position: "absolute", left: 0, right: 0, top: 1560, textAlign: "center", fontFamily: "Inter", fontWeight: 800, fontSize: 26, letterSpacing: "0.12em", color: G.dim }}>{HANDLE.toUpperCase()}</div>
        {ep.style === "v2" ? <CineFinish /> : <Finish />}
      </SceneCtx.Provider>
    </AbsoluteFill>
  );
};
