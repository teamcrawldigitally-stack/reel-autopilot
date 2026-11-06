import React from "react";
import { AbsoluteFill, Audio, Sequence, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { Swipes } from "./fx";
import { BP, BlueprintBg, BpTopBar, DarkFinish, big, ease, label } from "./hisaab";
import { clamp } from "./kit";
import { C, theme } from "../theme";

/* Reusable drawings and the reel wrapper for hisaab reels (dark blueprint sheet). */

/** The whole hisaab reel: sheet, scenes with their voice, swipes, top bar, finish. */
export const HisaabReel: React.FC<{
  tag: string;
  ids: string[];
  map: Record<string, React.FC<{ dur: number }>>;
  frames: (id: string) => { from: number; dur: number };
  audio: (id: string) => string | null | undefined;
}> = ({ tag, ids, map, frames, audio }) => {
  const cuts = ids.slice(1).map((id) => frames(id).from);
  return (
    <AbsoluteFill style={{ background: C.navy }}>
      <BlueprintBg sheet={tag.replace("CASE ", "")} />
      {ids.map((id) => {
        const { from, dur } = frames(id);
        const Comp = map[id];
        const a = audio(id);
        return (
          <Sequence key={id} from={from} durationInFrames={dur} name={id}>
            <Comp dur={dur} />
            {a && <Audio src={staticFile(a)} />}
          </Sequence>
        );
      })}
      <Swipes at={cuts} />
      <BpTopBar tag={tag} />
      <DarkFinish />
    </AbsoluteFill>
  );
};

/** Amber dropper serum bottle with a white label. */
export const SerumBottle: React.FC<{ h?: number; label?: string }> = ({ h = 300, label: lb = "SERUM" }) => (
  <svg width={h * 0.42} height={h} viewBox="0 0 84 200" style={{ overflow: "visible" }}>
    <rect x={30} y={0} width={24} height={20} rx={6} fill="#1A1033" />
    <rect x={26} y={18} width={32} height={34} rx={6} fill="#2A1C55" />
    <path d="M14 66 Q14 52 28 52 L56 52 Q70 52 70 66 L70 186 Q70 198 58 198 L26 198 Q14 198 14 186 Z" fill="#C9781F" />
    <path d="M20 70 Q20 60 30 60 L34 60 L34 190 L28 190 Q20 190 20 182 Z" fill="#E9A24A" opacity={0.55} />
    <rect x={18} y={104} width={48} height={58} rx={6} fill="#FFFDF7" />
    <text x={42} y={130} textAnchor="middle" fontFamily={theme.fonts.body} fontWeight={900} fontSize={11} fill={C.navy}>
      {lb}
    </text>
    <rect x={26} y={140} width={32} height={4} rx={2} fill={C.violet} />
    <rect x={30} y={149} width={24} height={4} rx={2} fill="#D7CFF3" />
  </svg>
);

/** A product photo card: plain (white background, one bottle) or in-hand with glowing skin. */
export const PhotoCard: React.FC<{ kind: "plain" | "hand" | "use" | "before" | "after"; w?: number; title?: string }> = ({ kind, w = 420, title }) => {
  const f = useCurrentFrame();
  const h = w * 1.18;
  const tw = Math.sin(f / 9);
  return (
    <div style={{ width: w, height: h, borderRadius: 26, overflow: "hidden", position: "relative", background: kind === "plain" ? "#FFFFFF" : "linear-gradient(160deg,#FCE3D2 0%,#F4C9B0 55%,#E7B79B 100%)", border: `4px solid ${C.lavender}`, boxShadow: "0 30px 60px -20px rgba(0,0,0,0.6)" }}>
      {kind === "plain" && (
        <div style={{ position: "absolute", left: 0, right: 0, top: h * 0.16, display: "flex", justifyContent: "center" }}>
          <SerumBottle h={h * 0.66} />
        </div>
      )}
      {(kind === "hand" || kind === "use" || kind === "after" || kind === "before") && (
        <>
          {/* cheek + jaw */}
          <svg width={w} height={h} viewBox="0 0 420 496" style={{ position: "absolute", inset: 0 }}>
            <path d="M250 -10 Q420 40 430 250 Q420 420 300 500 L430 500 L430 -10 Z" fill={kind === "before" ? "#B57C57" : "#C98A60"} />
            <path d="M300 60 Q380 120 390 230" stroke={kind === "before" ? "#9A6644" : "#E4A57B"} strokeWidth={10} fill="none" strokeLinecap="round" opacity={0.7} />
            {kind === "before" &&
              [0, 1, 2, 3, 4].map((i) => <circle key={i} cx={320 + (i % 3) * 22} cy={170 + i * 22} r={6} fill="#8E5536" opacity={0.8} />)}
          </svg>
          {kind !== "before" &&
            [0, 1, 2].map((i) => (
              <div key={i} style={{ position: "absolute", left: w * (0.66 + i * 0.09), top: h * (0.2 + i * 0.16), width: 30, height: 30, transform: `scale(${0.7 + 0.35 * Math.abs(Math.sin(f / 8 + i))}) rotate(45deg)`, background: "#FFF6D8", borderRadius: 4, boxShadow: "0 0 18px #FFE9A8" }} />
            ))}
          {kind !== "before" && (
            <div style={{ position: "absolute", left: w * 0.08, top: h * 0.2 + tw * 2, transform: "rotate(-12deg)" }}>
              <SerumBottle h={h * 0.55} />
            </div>
          )}
          {kind !== "before" && (
            <svg width={w * 0.5} height={h * 0.42} viewBox="0 0 200 170" style={{ position: "absolute", left: w * 0.02, top: h * 0.55 }}>
              <path d="M10 170 L20 70 Q24 40 52 40 L120 36 Q150 34 152 56 Q154 76 128 78 L98 80 Q140 84 150 104 Q156 124 126 124 L60 128 Z" fill="#B87A50" stroke="#8E5536" strokeWidth={4} />
              <path d="M98 80 Q120 92 128 104" stroke="#8E5536" strokeWidth={4} fill="none" />
            </svg>
          )}
        </>
      )}
      {title && (
        <div style={{ position: "absolute", left: 16, bottom: 16, ...label(20, C.navy), background: "rgba(255,255,255,0.9)", borderRadius: 10, padding: "8px 12px 6px" }}>{title}</div>
      )}
    </div>
  );
};

/** Little person glyph. */
export const Dude: React.FC<{ s?: number; color?: string; o?: number }> = ({ s = 30, color = "rgba(223,200,253,0.35)", o = 1 }) => (
  <svg width={s} height={s * 1.2} viewBox="0 0 30 36" style={{ opacity: o }}>
    <circle cx={15} cy={9} r={7.5} fill={color} />
    <path d="M2 36 Q2 19 15 19 Q28 19 28 36 Z" fill={color} />
  </svg>
);

/** cols × rows people; the first `lit` light up (green) one by one from `litAt`. */
export const PeopleGrid: React.FC<{ cols?: number; rows?: number; s?: number; gap?: number; lit?: number; litAt?: number; litColor?: string; inAt?: number }> = ({
  cols = 10,
  rows = 10,
  s = 30,
  gap = 8,
  lit = 0,
  litAt = 0,
  litColor = BP.green,
  inAt = 0,
}) => {
  const f = useCurrentFrame();
  const n = cols * rows;
  // spread the lit ones across the grid so they read as "a few out of 100"
  const litIdx = Array.from({ length: lit }, (_, i) => Math.floor(((i + 0.5) * n) / Math.max(lit, 1)) + ((i * 7) % cols) - Math.floor(cols / 2));
  return (
    <div style={{ display: "grid", gridTemplateColumns: `repeat(${cols}, ${s}px)`, gap }}>
      {Array.from({ length: n }).map((_, i) => {
        const p = ease(f, inAt + i * 0.25, inAt + i * 0.25 + 6);
        const k = litIdx.indexOf(Math.min(n - 1, Math.max(0, i)));
        const on = k >= 0 && f >= litAt + k * 5;
        const pop = on ? 1 + 0.35 * Math.sin(Math.PI * ease(f, litAt + k * 5, litAt + k * 5 + 8)) : 1;
        return (
          <div key={i} style={{ opacity: p, transform: `scale(${(0.6 + 0.4 * p) * pop})`, filter: on ? `drop-shadow(0 0 10px ${litColor})` : undefined }}>
            <Dude s={s} color={on ? litColor : "rgba(223,200,253,0.32)"} />
          </div>
        );
      })}
    </div>
  );
};

/** Rubber-stamp word that slams in at `at`. */
export const Stamp: React.FC<{ text: string; at: number; color?: string; size?: number; rot?: number; style?: React.CSSProperties }> = ({ text, at, color = BP.red, size = 110, rot = -8, style }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  if (f < at) return null;
  const p = spring({ frame: f - at, fps, config: theme.spring.slam });
  return (
    <div
      style={{
        position: "absolute",
        transform: `translate(-50%, -50%) rotate(${rot}deg) scale(${interpolate(p, [0, 1], [2.3, 1])})`,
        opacity: interpolate(p, [0, 0.3], [0, 1], clamp),
        border: `${Math.round(size / 13)}px solid ${color}`,
        borderRadius: 22,
        padding: `${size * 0.1}px ${size * 0.32}px 0`,
        background: "rgba(13,2,56,0.82)",
        ...big(size, color),
        letterSpacing: "0.04em",
        boxShadow: `0 0 70px ${color}55`,
        zIndex: 5,
        ...style,
      }}
    >
      {text}
    </div>
  );
};

/** Dark phone shell; children fill the screen. */
export const PhoneShell: React.FC<{ w?: number; children?: React.ReactNode; screen?: string }> = ({ w = 460, children, screen = "#0E0638" }) => (
  <div style={{ width: w, height: w * 1.9, borderRadius: w * 0.14, background: "#06021C", border: `4px solid ${BP.lineSoft}`, padding: w * 0.035, boxSizing: "border-box", boxShadow: "0 40px 80px -30px rgba(0,0,0,0.8)" }}>
    <div style={{ position: "relative", width: "100%", height: "100%", borderRadius: w * 0.11, overflow: "hidden", background: screen }}>
      <div style={{ position: "absolute", top: 10, left: "50%", transform: "translateX(-50%)", width: w * 0.28, height: w * 0.06, borderRadius: 99, background: "#06021C", zIndex: 3 }} />
      {children}
    </div>
  </div>
);

/** Big headline line with one highlighted chunk (pill). */
export const HookLines: React.FC<{ lines: React.ReactNode[]; top: number; size?: number }> = ({ lines, top, size = 82 }) => (
  <div style={{ position: "absolute", left: 0, right: 0, top, display: "flex", flexDirection: "column", alignItems: "center", gap: 18 }}>
    {lines.map((l, i) => (
      <div key={i} style={{ display: "flex", alignItems: "center", gap: 20, ...big(size) }}>
        {l}
      </div>
    ))}
  </div>
);

export const Pill: React.FC<{ children: React.ReactNode; bg?: string; color?: string; size?: number; rot?: number }> = ({ children, bg = C.red, color = C.white, size = 90, rot = -2 }) => (
  <span style={{ display: "inline-block", ...big(size, color), background: bg, borderRadius: 22, padding: `${size * 0.12}px ${size * 0.3}px 0`, transform: `rotate(${rot}deg)` }}>{children}</span>
);

/** Labelled big counter block. */
export const Counter: React.FC<{ name: string; value: string; color?: string; size?: number; p?: number; align?: "left" | "center" }> = ({ name, value, color = BP.text, size = 96, p = 1, align = "left" }) => (
  <div style={{ display: "flex", flexDirection: "column", alignItems: align === "center" ? "center" : "flex-start", opacity: p, transform: `translateY(${(1 - p) * 30}px)` }}>
    <div style={label(26, BP.dim)}>{name}</div>
    <div style={big(size, color)}>{value}</div>
  </div>
);
