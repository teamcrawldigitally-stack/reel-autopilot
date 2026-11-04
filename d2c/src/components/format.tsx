import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { C, theme } from "../theme";
import { Card, Chip, Enter, clamp } from "./kit";
import { CommentBox, DmCard, FollowButton } from "./widgets";

/* =========================================================
   Standard pieces of the cartoon reel format (from CASE #04 on):
   - HookTitle: the claim on screen from frame 0 (muted viewers read it).
   - CtaFlow: one clear ask (1 comment keyword -> 2 what arrives in DM),
     then a full-sentence teaser card for tomorrow's case, then Follow.
   ========================================================= */

export const LINE = C.navy;

/** Absolutely placed, scaled from its top-left corner. */
export const Place: React.FC<{ x: number; y: number; s?: number; children: React.ReactNode; z?: number; style?: React.CSSProperties }> = ({ x, y, s = 1, children, z, style }) => (
  <div style={{ position: "absolute", left: x, top: y, transform: `scale(${s})`, transformOrigin: "0 0", zIndex: z, ...style }}>{children}</div>
);

type Timeline = {
  FPS: number;
  scenes: { start: number; dur: number }[];
  sceneFrames: (id: string) => { from: number; dur: number };
};

/** Voice loudness per frame for the Doctor's mouth, bound to one reel's timeline. */
export const makeMouth = (T: Timeline) => {
  const at = (frame: number) => {
    for (const s of T.scenes) {
      const from = Math.round(s.start * T.FPS);
      const to = Math.round((s.start + s.dur) * T.FPS);
      if (frame >= from && frame < to) {
        const m = (s as unknown as { mouth?: number[] }).mouth;
        return m ? m[frame - from] ?? 0 : 0;
      }
    }
    return 0;
  };
  return (id: string) => (f: number) => at(f + T.sceneFrames(id).from);
};

export type HookLine = { text: React.ReactNode; at: number; kind?: "plain" | "red" | "green" | "violet"; size?: number; rot?: number };

/** Hook headline stack. Plain lines rise in; coloured lines slam in as blocks. */
export const HookTitle: React.FC<{ lines: HookLine[]; top: number; gap?: number }> = ({ lines, top, gap = 14 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <div style={{ position: "absolute", left: 40, right: 40, top, display: "flex", flexDirection: "column", alignItems: "center", gap, zIndex: 12 }}>
      {lines.map((l, i) => {
        const kind = l.kind ?? "plain";
        const size = l.size ?? (kind === "plain" ? 64 : 120);
        if (frame < l.at - 1) return <div key={i} style={{ height: 0 }} />;
        if (kind === "plain") {
          const p = spring({ frame: frame - l.at, fps, config: theme.spring.snappy });
          return (
            <div key={i} style={{ opacity: interpolate(p, [0, 0.5], [0, 1], clamp), transform: `translateY(${(1 - p) * 30}px)`, fontFamily: theme.fonts.display, fontWeight: 700, fontSize: size, lineHeight: 1.05, color: LINE, textAlign: "center", WebkitTextStroke: `10px ${C.white}`, paintOrder: "stroke" }}>
              {l.text}
            </div>
          );
        }
        const p = spring({ frame: frame - l.at, fps, config: theme.spring.slam });
        const bg = kind === "red" ? C.red : kind === "green" ? C.green : C.violet;
        return (
          <div
            key={i}
            style={{
              opacity: interpolate(p, [0, 0.3], [0, 1], clamp),
              transform: `scale(${interpolate(p, [0, 1], [2.2, 1])}) rotate(${l.rot ?? -3}deg)`,
              background: bg,
              color: C.white,
              fontFamily: theme.fonts.display,
              fontWeight: 700,
              fontSize: size,
              lineHeight: 1,
              padding: `${size * 0.16}px ${size * 0.3}px ${size * 0.02}px`,
              borderRadius: size * 0.2,
              border: `7px solid ${LINE}`,
              boxShadow: `8px 8px 0 ${LINE}`,
              whiteSpace: "nowrap",
            }}
          >
            {l.text}
          </div>
        );
      })}
    </div>
  );
};

/** "1 Comment karo" style step label. */
export const StepLabel: React.FC<{ n: number; text: string; at: number; style?: React.CSSProperties }> = ({ n, text, at, style }) => (
  <Enter delay={at} from="left" dist={60} style={{ display: "flex", alignItems: "center", gap: 16, ...style }}>
    <div style={{ width: 62, height: 62, borderRadius: "50%", background: C.violet, border: `5px solid ${LINE}`, color: C.white, fontFamily: theme.fonts.display, fontWeight: 700, fontSize: 36, display: "flex", alignItems: "center", justifyContent: "center", paddingTop: 4, boxSizing: "border-box" }}>{n}</div>
    <div style={{ fontFamily: theme.fonts.display, fontWeight: 700, fontSize: 50, color: LINE, WebkitTextStroke: `8px ${C.white}`, paintOrder: "stroke" }}>{text}</div>
  </Enter>
);

/** Standard ending: comment keyword -> what they get in DM -> tomorrow's case -> follow. */
export const CtaFlow: React.FC<{
  keyword: string;
  typeAt: number;
  giftAt: number;
  giftTitle: string;
  giftSub: string;
  giftIcon?: React.ReactNode;
  nextAt: number;
  nextNum: string;
  next: React.ReactNode;
  followAt: number;
}> = ({ keyword, typeAt, giftAt, giftTitle, giftSub, giftIcon, nextAt, nextNum, next, followAt }) => {
  const frame = useCurrentFrame();
  const outA = interpolate(frame, [nextAt - 6, nextAt + 2], [0, 1], { ...clamp, easing: theme.ease.in });
  return (
    <>
      {frame < nextAt + 4 && (
        <div style={{ position: "absolute", inset: 0, opacity: 1 - outA, transform: `translateY(${-60 * outA}px)` }}>
          <StepLabel n={1} text="Comment karo" at={0} style={{ position: "absolute", left: 84, top: 290 }} />
          <Enter delay={2} style={{ position: "absolute", left: 84, top: 375 }}>
            <CommentBox word={keyword} typeStart={typeAt} />
          </Enter>
          <StepLabel n={2} text="DM mein milega" at={giftAt - 8} style={{ position: "absolute", left: 84, top: 550 }} />
          <Enter delay={giftAt - 4} from="right" dist={120} style={{ position: "absolute", left: 84, top: 635 }}>
            <DmCard title={giftTitle} sub={giftSub} icon={giftIcon} />
          </Enter>
        </div>
      )}
      {frame >= nextAt - 2 && (
        <div style={{ position: "absolute", left: 84, right: 84, top: 300, display: "flex", flexDirection: "column", alignItems: "center", gap: 18 }}>
          <Enter delay={nextAt} cfg="snappy">
            <Chip size={34} bg={C.navy}>
              KAL KA CASE {nextNum}
            </Chip>
          </Enter>
          <Enter delay={nextAt + 4}>
            <Card style={{ padding: "30px 40px 26px", display: "flex", flexDirection: "column", alignItems: "center", gap: 14, border: `5px solid ${LINE}`, boxShadow: `8px 8px 0 ${LINE}` }}>{next}</Card>
          </Enter>
        </div>
      )}
      {frame >= followAt - 10 && (
        <div style={{ position: "absolute", left: 0, right: 0, top: 860, zIndex: 6 }}>
          <FollowButton at={followAt} />
        </div>
      )}
    </>
  );
};
