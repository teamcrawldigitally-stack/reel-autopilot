import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { C, theme } from "../theme";
import { CheckIcon, CursorIcon, PdfIcon, SendIcon } from "./icons";
import { Card, Chip, Logo, clamp, useFloat, useSpring } from "./kit";

/** ON/OFF toggle. `offAt` = frame it flips off (or -1 to stay on). */
export const Toggle: React.FC<{ offAt: number; w?: number; label?: string; style?: React.CSSProperties }> = ({ offAt, w = 300, label, style }) => {
  const frame = useCurrentFrame();
  const h = w / 2;
  const p = offAt < 0 ? 0 : interpolate(frame, [offAt, offAt + 7], [0, 1], { ...clamp, easing: theme.ease.out });
  const knob = h - 20;
  const on = p < 0.5;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: w * 0.12, ...style }}>
      {label && (
        <div style={{ fontFamily: theme.fonts.display, fontWeight: 700, fontSize: w * 0.42, lineHeight: 1, color: C.navy, letterSpacing: "-0.02em" }}>{label}</div>
      )}
      <div
        style={{
          position: "relative",
          width: w,
          height: h,
          borderRadius: h,
          background: on ? theme.grad.violet : "#D9D3EC",
          boxShadow: on ? `0 16px 40px -14px ${C.glow}, inset 0 -6px 0 rgba(0,0,0,0.12)` : "inset 0 6px 12px rgba(18,4,75,0.15)",
          transition: "none",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: "50%",
            transform: "translateY(-50%)",
            left: on ? h * 0.32 : undefined,
            right: on ? undefined : h * 0.32,
            fontFamily: theme.fonts.body,
            fontWeight: 800,
            fontSize: h * 0.3,
            letterSpacing: "0.08em",
            color: on ? "rgba(255,255,255,0.9)" : C.muted,
          }}
        >
          {on ? "ON" : "OFF"}
        </div>
        <div
          style={{
            position: "absolute",
            top: 10,
            left: interpolate(p, [0, 1], [w - knob - 10, 10]),
            width: knob,
            height: knob,
            borderRadius: "50%",
            background: C.white,
            boxShadow: "0 8px 18px rgba(18,4,75,0.3)",
          }}
        />
      </div>
    </div>
  );
};

/** Rubber stamp that slams in at `at`. */
export const Stamp: React.FC<{ at: number; text: string; color?: string; size?: number; rotate?: number; style?: React.CSSProperties }> = ({
  at,
  text,
  color = C.red,
  size = 140,
  rotate = -9,
  style,
}) => {
  const s = useSpring(at, "slam");
  return (
    <div
      style={{
        opacity: interpolate(s, [0, 0.25], [0, 1], clamp),
        transform: `scale(${interpolate(s, [0, 1], [2.6, 1])}) rotate(${rotate}deg)`,
        fontFamily: theme.fonts.display,
        fontWeight: 700,
        fontSize: size,
        lineHeight: 1,
        letterSpacing: "0.04em",
        color,
        border: `${size * 0.08}px solid ${color}`,
        borderRadius: size * 0.2,
        padding: `${size * 0.18}px ${size * 0.28}px ${size * 0.05}px`,
        background: "rgba(255,255,255,0.9)",
        boxShadow: `0 20px 50px -20px ${color}99`,
        ...style,
      }}
    >
      {text}
    </div>
  );
};

/** Comment box that types `word`, then the send icon spins. */
export const CommentBox: React.FC<{ word: string; typeStart: number }> = ({ word, typeStart }) => {
  const frame = useCurrentFrame();
  const typed = Math.max(0, Math.min(word.length, Math.floor((frame - typeStart) / 2)));
  const caret = Math.floor(frame / 8) % 2 === 0;
  const sent = useSpring(typeStart + word.length * 2 + 4, "bouncy");
  return (
    <Card style={{ width: 912, height: 140, boxSizing: "border-box", padding: "0 30px", display: "flex", alignItems: "center", gap: 22 }}>
      <div style={{ width: 70, height: 70, borderRadius: "50%", background: C.lavender, flex: "0 0 70px" }} />
      <div
        style={{
          flex: 1,
          height: 82,
          borderRadius: 41,
          border: `3px solid rgba(18,4,75,0.15)`,
          display: "flex",
          alignItems: "center",
          padding: "0 28px",
          fontFamily: theme.fonts.body,
          fontWeight: 800,
          fontSize: 46,
          letterSpacing: "0.04em",
          color: typed ? C.navy : C.muted,
        }}
      >
        {typed ? word.slice(0, typed) : <span style={{ fontWeight: 500, fontSize: 36, letterSpacing: 0 }}>Add a comment…</span>}
        {typed > 0 && typed < word.length && caret && <span style={{ width: 4, height: 50, background: C.violet, marginLeft: 4 }} />}
      </div>
      <div style={{ transform: `scale(${1 + 0.25 * Math.sin(Math.PI * sent)}) rotate(${-20 * sent}deg)` }}>
        <SendIcon size={60} color={typed === word.length ? C.violet : C.lavender} />
      </div>
    </Card>
  );
};

/** DM from the page with a PDF attachment. */
export const DmCard: React.FC<{ title: string; sub?: string; icon?: React.ReactNode }> = ({ title, sub = "free · 1-page PDF", icon }) => {
  const fl = useFloat(5, 4);
  return (
    <Card style={{ width: 912, boxSizing: "border-box", padding: "30px 32px", display: "flex", flexDirection: "column", gap: 22 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <div style={{ width: 70, height: 70, borderRadius: "50%", background: C.white, border: `3px solid ${C.lavender}`, display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
          <Logo width={58} />
        </div>
        <div style={{ fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 34, color: C.navy }}>d2cfounders</div>
        <Chip size={22} bg={C.lavenderSoft} color={C.violetDeep} style={{ marginLeft: "auto" }}>
          DM
        </Chip>
      </div>
      <div
        style={{
          alignSelf: "flex-start",
          background: C.paperDeep,
          borderRadius: "34px 34px 34px 10px",
          padding: "26px 30px",
          display: "flex",
          alignItems: "center",
          gap: 24,
          transform: `translateY(${fl}px)`,
        }}
      >
        {icon ?? <PdfIcon size={86} />}
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <div style={{ fontFamily: theme.fonts.display, fontWeight: 700, fontSize: 46, lineHeight: 1.1, color: C.navy }}>{title}</div>
          <div style={{ fontFamily: theme.fonts.body, fontWeight: 700, fontSize: 30, color: C.green }}>{sub}</div>
        </div>
      </div>
    </Card>
  );
};

/** Follow button that gets tapped by a cursor and turns into "Following". */
export const FollowButton: React.FC<{ at: number }> = ({ at }) => {
  const frame = useCurrentFrame();
  const btn = useSpring(at - 8, "bouncy");
  const cursorIn = interpolate(frame, [at - 4, at + 10], [0, 1], { ...clamp, easing: theme.ease.out });
  const press = frame >= at + 12 && frame < at + 16 ? 0.94 : 1;
  const followed = frame >= at + 14;
  const tick = interpolate(frame, [at + 14, at + 28], [0, 1], clamp);
  return (
    <div
      style={{
        position: "relative",
        display: "flex",
        justifyContent: "center",
        opacity: interpolate(btn, [0, 0.4], [0, 1], clamp),
        transform: `translateY(${interpolate(btn, [0, 1], [60, 0])}px) scale(${press})`,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 20,
          background: followed ? C.white : theme.grad.violet,
          color: followed ? C.navy : C.white,
          border: followed ? `4px solid ${C.navy}` : "4px solid transparent",
          fontFamily: theme.fonts.display,
          fontWeight: 700,
          fontSize: 54,
          padding: "26px 52px 18px",
          borderRadius: 999,
          boxShadow: followed ? "0 18px 40px -20px rgba(18,4,75,0.4)" : `0 24px 60px -18px ${C.glow}`,
        }}
      >
        {followed && <CheckIcon size={52} draw={tick} />}
        {followed ? "Following" : "Follow"} @d2cfounders
      </div>
      <div
        style={{
          position: "absolute",
          left: 800,
          top: 66,
          opacity: cursorIn,
          transform: `translate(${(1 - cursorIn) * 220}px, ${(1 - cursorIn) * 260}px) scale(${press})`,
        }}
      >
        <CursorIcon size={86} />
      </div>
    </div>
  );
};
