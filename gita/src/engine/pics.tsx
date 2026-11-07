import React from "react";
import { Img, interpolate, staticFile, useCurrentFrame } from "remotion";
import { clamp, ease } from "../components/kit";
import { CutOut, Glitch, Halo } from "../components/fx";
import { G } from "../theme";
import { toneGlow, useCue } from "./core";
import { useV2 } from "./cine";
import type { Pic } from "./types";

/** One picture of a scene: a cut-out (default) or a full picture with soft edges. */
export const PicView: React.FC<{ pic: Pic }> = ({ pic }) => {
  const f = useCurrentFrame();
  const c = useCue();
  const x = pic.x ?? 540;
  const bottom = pic.bottom ?? 1540;
  const at = pic.at !== undefined ? c(pic.at) : -30;
  const out = pic.out !== undefined ? c(pic.out) : undefined;
  const v2 = useV2();
  const glowTone = pic.glow ?? "gold";
  const glow = glowTone === "none" ? "rgba(0,0,0,0)" : toneGlow(glowTone, 0.45);

  // effects
  let tx = 0;
  let scale = 1;
  let filter = "";
  let glitch = 0;
  let rot = 0;
  let flash = 0;
  for (const e of pic.fx ?? []) {
    const a = c(e.at);
    const b = e.to !== undefined ? c(e.to) : a + 16;
    if (e.type === "shake" && f >= a && f < b) tx += Math.sin(f * 2.4) * (b - f) * 1.6;
    if (e.type === "redflash") flash = Math.max(flash, interpolate(f, [a, a + 3, a + 16], [0, 0.28, 0], clamp));
    if (e.type === "glitch" && f >= a && f < b) glitch = Math.max(glitch, 0.55 + 0.45 * Math.abs(Math.sin(f / 2.3)));
    if (e.type === "gray") filter += ` grayscale(${ease(f, a, b)})`;
    if (e.type === "zoom") scale *= 1 + 0.12 * ease(f, a, b, "inOut");
    if (e.type === "flip") rot += 180 * (1 - ease(f, a, b, "inOut"));
    if (e.type === "rotate") rot += (e.deg ?? 30) * ease(f, a, b, "inOut");
  }
  if (pic.dim) filter += ` brightness(${1 - pic.dim})`;
  if (pic.blur) filter += ` blur(${pic.blur}px)`;

  const pIn = ease(f, at, at + 14);
  const pOut = out !== undefined ? 1 - ease(f, out, out + 8, "in") : 1;

  let body: React.ReactNode;
  if (pic.full) {
    const d = (1 - pIn) * 50;
    body = (
      <div style={{ position: "absolute", left: x, top: bottom - pic.h, height: pic.h, transform: `translateX(-50%) translateY(${d}px) scale(${1 + 0.05 * interpolate(f, [at, at + 300], [0, 1], clamp)})`, transformOrigin: "50% 60%", opacity: pIn * pOut }}>
        <Img
          src={staticFile(pic.src)}
          style={{
            height: pic.h,
            width: "auto",
            display: "block",
            filter,
            transform: pic.flip ? "scaleX(-1)" : undefined,
            WebkitMaskImage: "radial-gradient(ellipse 50% 50% at 50% 50%, black 68%, transparent 100%)",
            maskImage: "radial-gradient(ellipse 50% 50% at 50% 50%, black 68%, transparent 100%)",
          }}
        />
      </div>
    );
  } else {
    body = (
      <>
        {pic.halo !== false && glowTone !== "none" && <Halo x={x} y={bottom - pic.h * 0.5} r={pic.h * 0.46} color={toneGlow(glowTone, 0.3)} o={pIn * pOut} />}
        {v2 && <div style={{ position: "absolute", left: x - pic.h * 0.38, top: bottom - 34, width: pic.h * 0.76, height: 64, borderRadius: "50%", background: "radial-gradient(ellipse, rgba(0,0,0,0.75), rgba(0,0,0,0) 70%)", opacity: pIn * pOut, filter: "blur(6px)" }} />}
        <div style={{ position: "absolute", inset: 0, transform: pic.flip ? `translateX(${2 * x}px) scaleX(-1)` : undefined }}>
          <CutOut src={pic.src} x={x} bottom={bottom} h={pic.h} at={at} out={out} glow={glow} filter={filter} from={pic.from ?? (at <= 0 ? "none" : "up")} />
        </div>
      </>
    );
  }

  const enter = v2 && at > 0 ? ease(f, at - 2, at + 16) : 1;
  if (v2 && enter < 1) scale *= 0.86 + 0.14 * enter;
  return (
    <div style={{ position: "absolute", inset: 0, transform: `translateX(${tx}px) scale(${scale})`, transformOrigin: `${x}px ${bottom}px`, filter: enter < 1 ? `blur(${(1 - enter) * 10}px)` : undefined }}>
      <div style={{ position: "absolute", inset: 0, transform: rot ? `rotate(${rot}deg)` : undefined, transformOrigin: pic.pivot ? `${pic.pivot[0]}px ${pic.pivot[1]}px` : `${x}px ${bottom - pic.h / 2}px` }}>
      {glitch > 0 ? <Glitch amount={glitch}>{body}</Glitch> : body}
      </div>
      {flash > 0 && <div style={{ position: "absolute", inset: 0, background: G.red, opacity: flash, mixBlendMode: "screen" }} />}
    </div>
  );
};
