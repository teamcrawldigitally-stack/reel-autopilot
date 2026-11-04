// Word-synced captions from the voiceover's word timings (2–3 words per page,
// active word in the accent color). Sits in the lower-middle safe zone.
import React, { useMemo } from "react";
import { createTikTokStyleCaptions, type Caption, type TikTokPage } from "@remotion/captions";
import { AbsoluteFill, interpolate, Sequence, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { useTheme } from "../theme";
import type { Scene, Word } from "../types";

const SWITCH_MS = 900;

const CaptionPage: React.FC<{ page: TikTokPage }> = ({ page }) => {
  const t = useTheme();
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const nowMs = page.startMs + (frame / fps) * 1000;
  const enter = spring({ frame, fps, config: t.spring.snappy });
  const stroke = "rgba(0,0,0,0.9)";
  const shadow = [
    `0 4px 0 ${stroke}`,
    `0 -2px 0 ${stroke}`,
    `3px 0 0 ${stroke}`,
    `-3px 0 0 ${stroke}`,
    `3px 3px 0 ${stroke}`,
    `-3px 3px 0 ${stroke}`,
    `0 10px 30px rgba(0,0,0,0.55)`,
  ].join(", ");
  return (
    <div
      style={{
        position: "absolute",
        top: t.layout.captionTop,
        left: t.layout.side,
        right: t.layout.side,
        display: "flex",
        justifyContent: "center",
        opacity: interpolate(enter, [0, 0.6], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
        transform: `translateY(${interpolate(enter, [0, 1], [26, 0])}px) scale(${interpolate(enter, [0, 1], [0.92, 1])})`,
      }}
    >
      <div
        style={{
          whiteSpace: "pre-wrap",
          textAlign: "center",
          fontFamily: t.fonts.display,
          fontWeight: 800,
          fontSize: 76,
          lineHeight: 1.1,
          letterSpacing: "-0.02em",
          color: t.colors.text,
          textShadow: shadow,
        }}
      >
        {page.tokens.map((tok, i) => {
          const active = tok.fromMs <= nowMs && tok.toMs > nowMs;
          const startedFrames = ((nowMs - tok.fromMs) / 1000) * fps;
          const pop = active ? spring({ frame: startedFrames, fps, config: t.spring.bouncy }) : 1;
          const lead = tok.text.match(/^\s*/)?.[0] ?? "";
          return (
            <React.Fragment key={`${tok.fromMs}-${i}`}>
              {lead}
              <span
                style={{
                  display: "inline-block",
                  whiteSpace: "pre",
                  color: active ? t.colors.accent : t.colors.text,
                  transform: active ? `translateY(${interpolate(pop, [0, 1], [-10, 0])}px)` : undefined,
                }}
              >
                {tok.text.slice(lead.length)}
              </span>
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

export const Captions: React.FC<{ words: Word[]; scenes: Scene[] }> = ({ words, scenes }) => {
  const { fps } = useVideoConfig();
  const pages = useMemo(() => {
    const sceneEnds = new Set(
      scenes.map((s) => {
        // last word that starts inside this scene
        let idx = -1;
        words.forEach((w, i) => {
          if (w.startMs >= s.startMs && w.startMs < s.endMs) idx = i;
        });
        return idx;
      }),
    );
    const captions: Caption[] = words.map((w, i) => ({
      text: (i === 0 ? "" : " ") + w.text,
      startMs: w.startMs,
      endMs: w.endMs,
      timestampMs: w.startMs,
      confidence: null,
      pageBreakAfter: sceneEnds.has(i) || /[.!?।]$/.test(w.text),
    }));
    const raw = createTikTokStyleCaptions({ captions, combineTokensWithinMilliseconds: SWITCH_MS }).pages;
    // Fold one-word leftovers ("seconds.") back into the previous page of the same sentence.
    const merged: TikTokPage[] = [];
    for (const p of raw) {
      const prev = merged[merged.length - 1];
      const prevLast = prev?.tokens[prev.tokens.length - 1];
      if (
        prev &&
        p.tokens.length === 1 &&
        prev.tokens.length <= 4 &&
        prevLast &&
        !/[.!?।:]\s*$/.test(prevLast.text) &&
        p.startMs - prevLast.toMs < 400
      ) {
        const t0 = p.tokens[0];
        const spaced = /^\s/.test(t0.text) ? t0.text : " " + t0.text;
        prev.tokens = [...prev.tokens, { ...t0, text: spaced }];
        prev.text += /^\s/.test(p.text) ? p.text : " " + p.text;
        prev.durationMs = p.startMs + p.durationMs - prev.startMs;
      } else {
        merged.push({ ...p, tokens: [...p.tokens] });
      }
    }
    return merged.map((p) => ({
      ...p,
      tokens: p.tokens.map((tk, i) => (i === 0 ? { ...tk, text: tk.text.trimStart() } : tk)),
    }));
  }, [words, scenes]);

  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      {pages.map((page, i) => {
        const next = pages[i + 1];
        const from = Math.round((page.startMs / 1000) * fps);
        const lastTokenEnd = page.tokens[page.tokens.length - 1]?.toMs ?? page.startMs + SWITCH_MS;
        const endMs = Math.min(next ? next.startMs : Infinity, lastTokenEnd + 350);
        const dur = Math.round((endMs / 1000) * fps) - from;
        if (dur <= 0) return null;
        return (
          <Sequence key={i} from={from} durationInFrames={dur} layout="none">
            <CaptionPage page={page} />
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};
