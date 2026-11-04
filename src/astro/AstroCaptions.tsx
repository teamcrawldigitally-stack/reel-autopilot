// Word-synced Hindi captions: black text with a white halo, spoken word in orange.
import React, { useMemo } from "react";
import { createTikTokStyleCaptions, type Caption, type TikTokPage } from "@remotion/captions";
import { AbsoluteFill, interpolate, Sequence, spring, useCurrentFrame, useVideoConfig } from "remotion";
import type { W } from "./parts";
import { astro } from "./theme";

const C = astro.colors;
const SWITCH_MS = 1000;

const Page: React.FC<{ page: TikTokPage }> = ({ page }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const nowMs = page.startMs + (frame / fps) * 1000;
  const enter = spring({ frame, fps, config: astro.spring.bouncy });
  const halo = [
    "0 0 2px #fff", "4px 4px 0 #fff", "-4px 4px 0 #fff", "4px -4px 0 #fff", "-4px -4px 0 #fff",
    "0 5px 0 #fff", "0 -5px 0 #fff", "5px 0 0 #fff", "-5px 0 0 #fff", "0 12px 28px rgba(122,51,0,0.28)",
  ].join(", ");
  return (
    <div
      style={{
        position: "absolute",
        top: astro.layout.captionTop,
        left: astro.layout.side,
        right: astro.layout.side,
        display: "flex",
        justifyContent: "center",
        opacity: interpolate(enter, [0, 0.4], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
        transform: `translateY(${interpolate(enter, [0, 1], [30, 0])}px) scale(${interpolate(enter, [0, 1], [0.85, 1])})`,
      }}
    >
      <div style={{ whiteSpace: "pre-wrap", textAlign: "center", fontFamily: astro.fonts.body, fontWeight: 800, fontSize: 80, lineHeight: 1.3, color: C.ink, textShadow: halo }}>
        {page.tokens.map((tok, i) => {
          const active = tok.fromMs <= nowMs && tok.toMs > nowMs;
          const lead = tok.text.match(/^\s*/)?.[0] ?? "";
          const since = Math.max(0, nowMs - tok.fromMs);
          const pop = active ? 1 + 0.1 * Math.exp(-since / 90) : 1;
          return (
            <React.Fragment key={`${tok.fromMs}-${i}`}>
              {lead}
              <span
                style={{
                  display: "inline-block",
                  whiteSpace: "pre",
                  padding: "0 12px 4px",
                  margin: "0 -12px",
                  borderRadius: 16,
                  color: active ? C.white : C.ink,
                  background: active ? C.orange : "transparent",
                  border: active ? `4px solid ${C.ink}` : "4px solid transparent",
                  boxShadow: active ? `5px 5px 0 ${C.ink}` : undefined,
                  textShadow: active ? "none" : undefined,
                  transform: `scale(${pop}) rotate(${active ? -2 : 0}deg)`,
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

export const AstroCaptions: React.FC<{ words: W[]; sceneEnds: number[] }> = ({ words, sceneEnds }) => {
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
    const captions: Caption[] = words.map((w, i) => ({
      text: (i === 0 ? "" : " ") + w.text,
      startMs: w.startMs,
      endMs: w.endMs,
      timestampMs: w.startMs,
      confidence: null,
      pageBreakAfter: lastInScene.has(i) || /[।?!]$/.test(w.text),
    }));
    const raw = createTikTokStyleCaptions({ captions, combineTokensWithinMilliseconds: SWITCH_MS }).pages;
    const merged: TikTokPage[] = [];
    for (const p of raw) {
      const prev = merged[merged.length - 1];
      const prevLast = prev?.tokens[prev.tokens.length - 1];
      if (prev && p.tokens.length === 1 && prev.tokens.length <= 4 && prevLast && !/[।?!:]\s*$/.test(prevLast.text) && p.startMs - prevLast.toMs < 400) {
        const t0 = p.tokens[0];
        prev.tokens = [...prev.tokens, { ...t0, text: /^\s/.test(t0.text) ? t0.text : " " + t0.text }];
        prev.text += /^\s/.test(p.text) ? p.text : " " + p.text;
        prev.durationMs = p.startMs + p.durationMs - prev.startMs;
      } else {
        merged.push({ ...p, tokens: [...p.tokens] });
      }
    }
    return merged.map((p) => ({ ...p, tokens: p.tokens.map((tk, i) => (i === 0 ? { ...tk, text: tk.text.trimStart() } : tk)) }));
  }, [words, sceneEnds]);

  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      {pages.map((page, i) => {
        const next = pages[i + 1];
        const from = Math.round((page.startMs / 1000) * fps);
        const lastEnd = page.tokens[page.tokens.length - 1]?.toMs ?? page.startMs + SWITCH_MS;
        const endMs = Math.min(next ? next.startMs : Infinity, lastEnd + 350);
        const dur = Math.round((endMs / 1000) * fps) - from;
        if (dur <= 0) return null;
        return (
          <Sequence key={i} from={from} durationInFrames={dur} layout="none">
            <Page page={page} />
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};
