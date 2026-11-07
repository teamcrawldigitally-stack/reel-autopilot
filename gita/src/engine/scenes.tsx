import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { Enter, SceneShell, Sfx, clamp, deva, ease, glass, num, sanskrit, useSpring } from "../components/kit";
import { CutOut, GoldDust, Halo } from "../components/fx";
import { HANDLE } from "../components/sheet";
import { G, theme } from "../theme";
import { Pill, RowView, SaLine, graphemes, parseRich, rowObj, toneColor, toneGlow, useCue, useScene } from "./core";
import { PicView } from "./pics";
import { WidgetView } from "./widgets";
import type { Beat, BeatsScene, CtaScene, Pic, SourceScene } from "./types";

const moodColor = (m?: string) => (m === "red" ? G.red : m === "green" ? G.green : m === "blue" ? "#8FB4FF" : G.gold);

/* ================= beats: pictures + text blocks that change on cue words ================= */

const beatHeight = (b: Beat) => {
  let h = 0;
  if (b.pill) h += 80;
  for (const r of b.rows ?? []) h += (rowObj(r).size ?? 96) * 1.24;
  if (b.sa) h += (b.saSize ?? 70) * 1.5;
  if (b.sub) h += 66;
  return h + 24;
};

const BeatView: React.FC<{ b: Beat; at: number; out: number; top: number }> = ({ b, at, out, top }) => {
  const f = useCurrentFrame();
  const c = useCue();
  const p = useSpring(at <= 0 ? at - 30 : at - 4, "snappy");
  const o = 1 - ease(f, out - 7, out + 1, "in");
  const card = b.card;
  const cardAt = card?.at !== undefined ? c(card.at) : at + 6;
  const cp = useSpring(cardAt - 4, "smooth");
  const pillAt = b.pill?.at !== undefined ? c(b.pill.at) : at;
  const pp = useSpring(pillAt - 4, "bouncy");
  if (f < at - 6 || o <= 0) return null;
  // Sanskrit on top when the Hindi rows come in later (a translation); otherwise rows lead
  const rowsList = (b.rows ?? []).map(rowObj);
  const saFirst = b.saFirst ?? (rowsList.length > 0 && rowsList.every((r) => r.at !== undefined));
  return (
    <>
      <div
        style={{
          position: "absolute",
          left: 60,
          right: 60,
          top,
          display: "flex",
          flexDirection: "column",
          alignItems: b.align === "left" ? "flex-start" : "center",
          gap: 6,
          opacity: interpolate(p, [0, 0.4], [0, 1], clamp) * o,
          transform: `translateY(${(1 - p) * 40 - (1 - o) * 30}px)`,
        }}
      >
        {b.pill && (
          <div style={{ marginBottom: 8, opacity: interpolate(pp, [0, 0.4], [0, 1], clamp), transform: `scale(${interpolate(pp, [0, 1], [0.7, 1])}) rotate(-2deg)` }}>
            <Pill text={b.pill.text} tone={b.pill.tone} />
          </div>
        )}
        {saFirst && b.sa && <SaLine text={b.sa} size={b.saSize ?? 70} />}
        {(b.rows ?? []).map((r, i) => (
          <RowView key={i} row={r} size={96} align={b.align} />
        ))}
        {!saFirst && b.sa && <SaLine text={b.sa} size={b.saSize ?? 70} />}
        {b.sub && <div style={{ ...deva(48, G.cream, 700), textAlign: "center", textShadow: "0 4px 24px rgba(0,0,0,0.9)" }}>{b.sub}</div>}
      </div>
      {card && (
        <div
          style={{
            position: "absolute",
            left: 84,
            top: card.top ?? 1110,
            width: 912,
            ...glass,
            background: "rgba(7,8,24,0.8)",
            borderColor: card.tone ? toneGlow(card.tone, 0.7) : G.line,
            padding: "22px 36px 18px",
            boxSizing: "border-box",
            opacity: interpolate(cp, [0, 0.4], [0, 1], clamp) * o,
            transform: `translateY(${(1 - cp) * 40}px)`,
          }}
        >
          {card.label && <div style={deva(38, toneColor(card.tone ?? "gold"), 700)}>{card.label}</div>}
          <div style={{ ...deva(58, G.cream, 800), whiteSpace: "normal" }}>
            {parseRich(card.text).map((s, i) => (
              <span key={i} style={{ color: s.k === "g" ? G.gold : s.k === "R" || s.k === "r" ? G.red : s.k === "E" || s.k === "G" ? G.green : undefined }}>
                {s.t}
              </span>
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export const BeatsSceneView: React.FC<{ s: BeatsScene }> = ({ s }) => {
  const { dur } = useScene();
  const c = useCue();
  const ats = s.beats.map((b) => c(b.at));
  // a beat stays until the next beat that is not stacked on it
  const outs = s.beats.map((b, i) => {
    if (b.out !== undefined) return c(b.out);
    for (let j = i + 1; j < s.beats.length; j++) if (!s.beats[j].stack) return ats[j];
    return dur + 20;
  });
  const tops: number[] = [];
  s.beats.forEach((b, i) => {
    if (b.top !== undefined) tops.push(b.top);
    else if (b.stack && i > 0) tops.push(tops[i - 1] + beatHeight(s.beats[i - 1]));
    else tops.push(290);
  });
  const dust = s.dust === "none" ? null : <GoldDust n={30} seed={s.id} color={s.dust ? toneColor(s.dust) : moodColor(s.mood)} />;
  return (
    <SceneShell dur={dur}>
      {dust}
      {(s.pics ?? []).filter((p) => !p.front).map((p, i) => (
        <PicView key={i} pic={p} />
      ))}
      {(s.pics ?? []).map((p, i) => {
        const a = p.at !== undefined ? c(p.at) : -30;
        return a > 2 ? <Sfx key={`ps${i}`} at={a - 4} name="whoosh" vol={0.35} /> : null;
      })}
      {(s.widgets ?? []).filter((w) => !w.front).map((w, i) => (
        <WidgetView key={i} w={w} />
      ))}
      {(s.pics ?? []).filter((p) => p.front).map((p, i) => (
        <PicView key={`fp${i}`} pic={p} />
      ))}
      {(s.widgets ?? []).filter((w) => w.front).map((w, i) => (
        <WidgetView key={`f${i}`} w={w} />
      ))}
      {s.beats.map((b, i) => (
        <BeatView key={i} b={b} at={ats[i]} out={outs[i]} top={tops[i]} />
      ))}
      {s.beats.map((b, i) => (ats[i] > 2 && b.sfx !== null ? <Sfx key={`bs${i}`} at={ats[i] - 3} name={b.sfx ?? "pop"} vol={0.42} /> : null))}
      {(s.sfx ?? []).map((x, i) => (
        <Sfx key={`x${i}`} at={c(x.at)} name={x.name} vol={x.vol ?? 0.5} />
      ))}
    </SceneShell>
  );
};

/* ================= source: series + episode + the shloka on a palm leaf ================= */

const HL: React.FC<{ v: number; children: React.ReactNode }> = ({ v, children }) => (
  <span style={{ background: `rgba(255,154,60,${0.42 * v})`, borderRadius: 8, boxShadow: v > 0 ? `0 0 0 ${3 * v}px rgba(255,154,60,${0.42 * v})` : undefined }}>{children}</span>
);

export const SourceSceneView: React.FC<{ s: SourceScene }> = ({ s }) => {
  const f = useCurrentFrame();
  const { dur } = useScene();
  const c = useCue();
  const series = c("सीरीज़");
  const ep = c("एपिसोड");
  const adh = c(s.cardAt ?? "अध्याय");
  const shl = c(s.secondAt ?? "श्लोक#2");
  const epIn = useSpring(ep - 4, "bouncy");
  const epOut = ease(f, adh - 8, adh);
  const card = useSpring(adh - 4, "smooth");
  const n = s.shloka.length;
  const half = Math.ceil(n / 2);
  const revA = ease(f, adh + 6, adh + 18);
  const revB = ease(f, shl - 2, shl + 10);
  // highlighted words, in order
  let hlCount = 0;
  const hlStart = shl + 14;
  const lines = s.shloka.map((ln) =>
    parseRich(ln.replace(/\{([^:}]+)\}/g, "{g:$1}")).map((seg, i) => {
      if (seg.k !== "g") return <React.Fragment key={i}>{seg.t}</React.Fragment>;
      const k = hlCount++;
      return (
        <HL key={i} v={ease(f, hlStart + k * 5, hlStart + k * 5 + 6)}>
          {seg.t}
        </HL>
      );
    }),
  );
  const longest = Math.max(...s.shloka.map((l) => l.replace(/[{}]/g, "").length));
  const fs = s.fontSize ?? Math.min(54, Math.floor(830 / (longest * 0.5)));
  const noteAt = hlStart + hlCount * 5 + 8;
  return (
    <SceneShell dur={dur}>
      <Sfx at={series - 2} name="swish" vol={0.45} />
      <Sfx at={ep - 2} name="pop" vol={0.5} />
      <Sfx at={adh - 4} name="whoosh" vol={0.45} />
      <Sfx at={shl - 2} name="tick" vol={0.35} />
      {s.bg && (
        <div style={{ position: "absolute", inset: 0, opacity: 0.38, filter: "blur(1.5px)" }}>
          <PicView pic={{ ...s.bg, halo: false }} />
        </div>
      )}
      <GoldDust n={24} seed="src" />

      <Enter delay={series - 6} cfg="snappy" style={{ position: "absolute", left: 0, right: 0, top: 296, display: "flex", justifyContent: "center" }}>
        <div style={{ background: G.gold, borderRadius: 999, padding: "6px 34px 2px", boxShadow: "0 0 60px rgba(242,184,75,0.4)" }}>
          <div style={deva(52, G.ink, 800)}>गीता श्लोक सीरीज़</div>
        </div>
      </Enter>

      {epOut < 1 && (
        <div style={{ position: "absolute", left: 0, right: 0, top: 480, display: "flex", flexDirection: "column", alignItems: "center", opacity: interpolate(epIn, [0, 0.4], [0, 1], clamp) * (1 - epOut), transform: `scale(${interpolate(epIn, [0, 1], [0.7, 1]) - 0.1 * epOut})` }}>
          <div style={deva(70, G.cream, 700)}>एपिसोड</div>
          <div style={{ ...num(280, G.gold), textShadow: "0 0 80px rgba(242,184,75,0.5)" }}>{String(s.ep).padStart(2, "0")}</div>
        </div>
      )}

      <div style={{ position: "absolute", left: 84, top: 430, width: 912, opacity: interpolate(card, [0, 0.4], [0, 1], clamp), transform: `translateY(${interpolate(card, [0, 1], [80, 0])}px) rotate(${interpolate(card, [0, 1], [2, -0.6])}deg)` }}>
        <div style={{ position: "relative", borderRadius: 26, background: `linear-gradient(180deg, ${G.leaf} 0%, #DDB878 55%, ${G.leafDeep} 100%)`, boxShadow: "0 40px 80px -30px rgba(0,0,0,0.85), 0 0 80px rgba(242,184,75,0.25), inset 0 0 40px rgba(120,70,10,0.35)", padding: "30px 40px 34px", overflow: "hidden" }}>
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} style={{ position: "absolute", left: 0, right: 0, top: 36 + i * 44, height: 2, background: "rgba(90,52,10,0.10)" }} />
          ))}
          {[34, 878].map((x) => (
            <div key={x} style={{ position: "absolute", left: x - 12, top: "50%", marginTop: -12, width: 24, height: 24, borderRadius: "50%", background: G.ink, opacity: 0.75 }} />
          ))}
          <div style={{ position: "relative", display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
            <div style={deva(40, G.leafInk, 700)}>भगवद् गीता</div>
            <div style={{ display: "flex", alignItems: "baseline", gap: 10 }}>
              <div style={deva(40, G.leafInk, 700)}>अध्याय</div>
              <div style={num(42, G.leafInk)}>{s.chapter}</div>
              <div style={deva(40, G.leafInk, 700)}>· श्लोक</div>
              <div style={num(42, "#9A3B0E")}>{s.verse}</div>
            </div>
          </div>
          <div style={{ position: "relative", height: 2, background: "rgba(58,35,11,0.35)", marginBottom: 12 }} />
          {s.speaker && <div style={{ ...sanskrit(36, "#9A3B0E"), textAlign: "center", opacity: 0.3 + 0.7 * revA, marginBottom: 4 }}>{s.speaker}</div>}
          {lines.map((ln, i) => {
            const p = i < half ? revA : revB;
            return (
              <div key={i} style={{ ...sanskrit(fs, G.leafInk), textAlign: "center", opacity: 0.15 + 0.85 * p, transform: `translateY(${(1 - p) * 10}px)` }}>
                {ln}
              </div>
            );
          })}
        </div>
        {s.note && (
          <div style={{ marginTop: 26, display: "flex", justifyContent: "center", opacity: ease(f, noteAt, noteAt + 10) }}>
            <div style={{ display: "flex", alignItems: "center", gap: 14, background: "rgba(7,8,24,0.7)", borderRadius: 999, padding: "6px 26px 2px" }}>
              <div style={{ width: 22, height: 22, borderRadius: 6, background: "rgba(255,154,60,0.7)" }} />
              <div style={deva(44, G.cream, 700)}>{s.note}</div>
            </div>
          </div>
        )}
      </div>
    </SceneShell>
  );
};

/* ================= CTA: share → comment → next episode → follow ================= */

const SendGlyph: React.FC<{ size?: number; color?: string }> = ({ size = 70, color = G.ink }) => (
  <svg width={size} height={size} viewBox="0 0 24 24">
    <path d="M3 11.5 L21 3 L13.5 21 L11 13 Z" fill="none" stroke={color} strokeWidth={2.2} strokeLinejoin="round" />
    <path d="M11 13 L21 3" stroke={color} strokeWidth={2.2} strokeLinecap="round" />
  </svg>
);
const Check: React.FC<{ size?: number; draw?: number }> = ({ size = 46, draw = 1 }) => (
  <svg width={size} height={size} viewBox="0 0 48 48">
    <circle cx={24} cy={24} r={22} fill={G.green} />
    <path d="M14 25 L21 32 L35 17" fill="none" stroke={G.white} strokeWidth={5} strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - draw} />
  </svg>
);
const Cursor: React.FC = () => (
  <svg width={86} height={86} viewBox="0 0 24 24">
    <path d="M5 3 L19 12 L12.5 13.5 L16 20.5 L13.2 21.8 L9.8 14.8 L5 19 Z" fill={G.white} stroke={G.ink} strokeWidth={1.4} strokeLinejoin="round" />
  </svg>
);

const fitSize = (text: string, max: number, width: number) => Math.min(max, Math.floor(width / (text.length * 0.47)));

export const CtaSceneView: React.FC<{ s: CtaScene }> = ({ s }) => {
  const f = useCurrentFrame();
  const { dur } = useScene();
  const c = useCue();
  const bhejo = c("भेजो");
  const comment = c("कमेंट");
  const ep = c("एपिसोड");
  const miss = c("मिस");
  const follow = c("फॉलो");
  const typeAt = c(s.comment.typeAt ?? "कमेंट+24");
  const typedG = graphemes(s.comment.typed);
  const out = ease(f, ep - 8, ep, "in");
  const typed = Math.max(0, Math.min(typedG.length, Math.floor((f - typeAt) / 3)));
  const sent = useSpring(typeAt + typedG.length * 3 + 4, "bouncy");
  const btn = useSpring(follow - 10, "bouncy");
  const cursorIn = ease(f, follow - 4, follow + 10);
  const press = f >= follow + 12 && f < follow + 16 ? 0.94 : 1;
  const followed = f >= follow + 14;
  const sharePic: Pic | undefined = s.share.pic;
  const nextPic: Pic | undefined = s.next.pic;
  const noteAt = s.next.note ? c(s.next.note.at) : 0;
  const rowSize = Math.min(...s.next.rows.map((r) => fitSize(r, 84, 780)));
  return (
    <SceneShell dur={dur} noExit>
      <Sfx at={bhejo - 4} name="whoosh" vol={0.45} />
      <Sfx at={typeAt} name="key" vol={0.4} />
      <Sfx at={ep - 2} name="swish" vol={0.5} />
      <Sfx at={follow + 12} name="ding" vol={0.5} />
      <GoldDust n={30} seed="cta" />

      {f < ep + 2 && (
        <div style={{ position: "absolute", inset: 0, opacity: 1 - out, transform: `translateY(${-70 * out}px)` }}>
          {sharePic && <PicView pic={{ x: 540, bottom: 1480, ...sharePic, at: sharePic.at ?? Math.min(bhejo - 10, 2) }} />}
          <Enter delay={Math.min(bhejo - 8, 0)} from="right" dist={90} style={{ position: "absolute", left: 84, top: 300, width: 912 }}>
            <div style={{ ...glass, background: "rgba(7,8,24,0.75)", borderColor: G.line, padding: "26px 34px", display: "flex", alignItems: "center", gap: 30 }}>
              <div style={{ flex: "0 0 112px", height: 112, borderRadius: "50%", background: theme.grad.gold, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <SendGlyph size={62} />
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 2, minWidth: 0 }}>
                <div style={deva(74, G.cream)}>{s.share.title}</div>
                <div style={{ ...deva(fitSize(s.share.sub, 44, 700), G.dim, 700) }}>{s.share.sub}</div>
              </div>
            </div>
          </Enter>
          <Enter delay={comment - 8} from="left" dist={90} style={{ position: "absolute", left: 84, top: 560, width: 912 }}>
            <div style={{ ...deva(fitSize(s.comment.q, 42, 900), G.gold, 700), marginBottom: 12, textShadow: "0 4px 20px rgba(0,0,0,0.8)" }}>{s.comment.q}</div>
            <div style={{ background: G.white, borderRadius: 30, height: 130, padding: "0 30px", boxSizing: "border-box", display: "flex", alignItems: "center", gap: 22, boxShadow: "0 30px 60px -30px rgba(0,0,0,0.6)" }}>
              <div style={{ width: 66, height: 66, borderRadius: "50%", background: G.leaf, flex: "0 0 66px" }} />
              <div style={{ flex: 1, height: 78, borderRadius: 39, border: "3px solid rgba(7,8,24,0.15)", display: "flex", alignItems: "center", padding: "0 28px", overflow: "hidden" }}>
                {typed ? (
                  <div style={{ ...deva(50, G.ink), display: "flex", alignItems: "center" }}>
                    {typedG.slice(0, typed).join("")}
                    {typed < typedG.length && Math.floor(f / 8) % 2 === 0 && <span style={{ width: 4, height: 48, background: G.goldDeep, marginLeft: 4 }} />}
                  </div>
                ) : (
                  <div style={{ fontFamily: theme.fonts.label, fontWeight: 500, fontSize: 36, color: "rgba(7,8,24,0.45)" }}>Add a comment…</div>
                )}
              </div>
              <div style={{ transform: `scale(${1 + 0.25 * Math.sin(Math.PI * sent)}) rotate(${-20 * sent}deg)` }}>
                <SendGlyph size={58} color={typed === typedG.length ? G.goldDeep : "rgba(7,8,24,0.3)"} />
              </div>
            </div>
          </Enter>
        </div>
      )}

      {f >= ep - 4 && (
        <>
          <div style={{ position: "absolute", left: 84, right: 84, top: 290, display: "flex", flexDirection: "column", alignItems: "center", gap: 18 }}>
            <Enter delay={ep} cfg="snappy">
              <div style={{ display: "flex", alignItems: "center", gap: 14, background: G.gold, borderRadius: 999, padding: "6px 30px 2px" }}>
                <div style={deva(46, G.ink, 800)}>अगला एपिसोड</div>
                <div style={num(42, G.ink)}>· {s.next.ep}</div>
              </div>
            </Enter>
            <Enter delay={ep + 4}>
              <div style={{ background: G.cream, borderRadius: 30, border: `5px solid ${G.gold}`, boxShadow: `10px 10px 0 ${G.goldDeep}`, padding: "20px 50px 12px", display: "flex", flexDirection: "column", alignItems: "center" }}>
                {s.next.rows.map((r, i) => (
                  <div key={i} style={deva(rowSize, G.ink)}>
                    {r}
                  </div>
                ))}
              </div>
            </Enter>
          </div>
          {nextPic && (
            <>
              <Halo x={nextPic.x ?? 540} y={(nextPic.bottom ?? 1150) - nextPic.h * 0.5} r={nextPic.h * 0.62} color="rgba(242,184,75,0.28)" o={ease(f, ep + 4, ep + 16)} />
              <PicView pic={{ x: 540, bottom: 1150, ...nextPic, at: ep + 6, halo: false }} />
            </>
          )}
          {s.next.note && (
            <div style={{ position: "absolute", left: 0, right: 0, top: 1160, display: "flex", justifyContent: "center", opacity: ease(f, noteAt - 6, noteAt + 6), transform: `translateY(${(1 - ease(f, noteAt - 6, noteAt + 6)) * 16}px)` }}>
              <div style={deva(48, G.gold, 700)}>{s.next.note.text}</div>
            </div>
          )}
        </>
      )}

      {f >= miss - 8 && (
        <div style={{ position: "absolute", left: 0, right: 0, top: 1250, display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
          <div style={{ ...deva(44, G.cream, 700), opacity: ease(f, miss - 6, miss + 6) }}>गीता का अगला श्लोक मिस न हो</div>
          <div style={{ position: "relative", opacity: interpolate(btn, [0, 0.4], [0, 1], clamp), transform: `translateY(${interpolate(btn, [0, 1], [60, 0])}px) scale(${press})` }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 18,
                background: followed ? G.cream : theme.grad.gold,
                border: followed ? `4px solid ${G.gold}` : "4px solid transparent",
                borderRadius: 999,
                padding: "18px 44px 14px",
                boxShadow: followed ? undefined : "0 24px 60px -18px rgba(242,184,75,0.6)",
                fontFamily: theme.fonts.num,
                fontWeight: 700,
                fontSize: 46,
                color: G.ink,
              }}
            >
              {followed && <Check size={46} draw={ease(f, follow + 14, follow + 28)} />}
              {followed ? "Following" : "Follow"} {HANDLE}
            </div>
            <div style={{ position: "absolute", right: -30, top: 56, opacity: cursorIn, transform: `translate(${(1 - cursorIn) * 220}px, ${(1 - cursorIn) * 260}px) scale(${press})` }}>
              <Cursor />
            </div>
          </div>
        </div>
      )}
    </SceneShell>
  );
};
