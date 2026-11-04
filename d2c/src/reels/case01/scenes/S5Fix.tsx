import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { Camera } from "../../../components/fx";
import { CheckIcon } from "../../../components/icons";
import { Card, Chip, Enter, Headline, SceneShell, Sfx, clamp, useFloat } from "../../../components/kit";
import { C, theme } from "../../../theme";
import { cue } from "../timeline";

const W = 912;
const H = 470;

const useP = (at: number, cfg: keyof typeof theme.spring = "snappy") => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({ frame: frame - at, fps, config: theme.spring[cfg] });
};

const Bubble: React.FC<{ at: number; side: "l" | "r"; children: React.ReactNode }> = ({ at, side, children }) => {
  const p = useP(at, "bouncy");
  return (
    <div
      style={{
        alignSelf: side === "l" ? "flex-start" : "flex-end",
        maxWidth: 640,
        background: side === "l" ? C.white : "#D8F5E1",
        border: side === "l" ? "2px solid rgba(18,4,75,0.08)" : "none",
        borderRadius: side === "l" ? "26px 26px 26px 8px" : "26px 26px 8px 26px",
        padding: "16px 24px",
        fontFamily: theme.fonts.body,
        fontWeight: 600,
        fontSize: 32,
        lineHeight: 1.3,
        color: C.navy,
        opacity: interpolate(p, [0, 0.4], [0, 1], clamp),
        transform: `translateY(${(1 - p) * 30}px) scale(${interpolate(p, [0, 1], [0.8, 1])})`,
        transformOrigin: side === "l" ? "left bottom" : "right bottom",
        boxShadow: "0 8px 18px -12px rgba(18,4,75,0.35)",
      }}
    >
      {children}
    </div>
  );
};

const ChatIllo: React.FC<{ f0: number }> = ({ f0 }) => {
  const frame = useCurrentFrame();
  const typing = frame >= f0 + 30 && frame < f0 + 44;
  return (
    <div style={{ width: W, height: H, display: "flex", flexDirection: "column" }}>
      <div style={{ height: 92, background: C.green, display: "flex", alignItems: "center", gap: 18, padding: "0 28px", borderRadius: "30px 30px 0 0" }}>
        <div style={{ width: 58, height: 58, borderRadius: "50%", background: C.white, color: C.green, fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 24, display: "flex", alignItems: "center", justifyContent: "center" }}>YB</div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 30, color: C.white }}>Your Brand</div>
          <div style={{ fontFamily: theme.fonts.body, fontWeight: 500, fontSize: 22, color: "rgba(255,255,255,0.85)" }}>online</div>
        </div>
        <Chip size={20} bg="rgba(255,255,255,0.2)" style={{ marginLeft: "auto" }}>
          WHATSAPP
        </Chip>
      </div>
      <div style={{ flex: 1, background: "#F3EEE6", padding: "22px 26px", display: "flex", flexDirection: "column", gap: 14, borderRadius: "0 0 30px 30px" }}>
        <Bubble at={f0 + 4} side="l">
          Hi Priya! Aapka serum khatam hone wala hoga.
        </Bubble>
        <Bubble at={f0 + 16} side="l">
          Doosre order pe <b style={{ color: C.violetDeep }}>10% off</b> · code <b>BACK10</b>
        </Bubble>
        {typing ? (
          <div style={{ alignSelf: "flex-end", display: "flex", gap: 8, background: "#D8F5E1", borderRadius: 22, padding: "16px 20px" }}>
            {[0, 1, 2].map((i) => (
              <div key={i} style={{ width: 12, height: 12, borderRadius: "50%", background: C.green, opacity: 0.35 + 0.65 * Math.abs(Math.sin((frame + i * 4) / 4)) }} />
            ))}
          </div>
        ) : (
          frame >= f0 + 44 && (
            <Bubble at={f0 + 44} side="r">
              Haan, bhejo! <span style={{ color: "#3BA0F5", fontWeight: 800 }}>✓✓</span>
            </Bubble>
          )
        )}
      </div>
    </div>
  );
};

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const POSTS: Record<number, string> = { 0: "Reel", 2: "Post", 4: "Reel", 6: "Story" };

const CalendarIllo: React.FC<{ f0: number }> = ({ f0 }) => (
  <div style={{ width: W, height: H, boxSizing: "border-box", padding: "26px 30px", display: "flex", flexDirection: "column", gap: 18 }}>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <div style={{ fontFamily: theme.fonts.display, fontWeight: 700, fontSize: 40, color: C.navy }}>Is hafte</div>
      <Chip size={24} bg={C.greenSoft} color={C.green}>
        ORGANIC · ₹0 ADS
      </Chip>
    </div>
    <div style={{ flex: 1, display: "flex", gap: 10 }}>
      {DAYS.map((d, i) => (
        <div key={d} style={{ flex: 1, display: "flex", flexDirection: "column", gap: 10 }}>
          <div style={{ textAlign: "center", fontFamily: theme.fonts.body, fontWeight: 700, fontSize: 24, color: C.muted }}>{d}</div>
          <div style={{ flex: 1, borderRadius: 16, background: "#F5F1FF", border: "2px dashed rgba(109,74,253,0.18)", position: "relative", overflow: "hidden" }}>
            {POSTS[i] && <PostTile at={f0 + 4 + Object.keys(POSTS).indexOf(String(i)) * 6} label={POSTS[i]} />}
          </div>
        </div>
      ))}
    </div>
  </div>
);

const PostTile: React.FC<{ at: number; label: string }> = ({ at, label }) => {
  const p = useP(at, "bouncy");
  return (
    <div
      style={{
        position: "absolute",
        inset: 8,
        borderRadius: 12,
        background: theme.grad.violet,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 10,
        opacity: interpolate(p, [0, 0.4], [0, 1], clamp),
        transform: `translateY(${(1 - p) * -120}px)`,
      }}
    >
      <svg width={44} height={44} viewBox="0 0 44 44">
        <circle cx="22" cy="22" r="21" fill="rgba(255,255,255,0.25)" />
        <path d="M17 13 L32 22 L17 31 Z" fill={C.white} />
      </svg>
      <div style={{ fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 22, color: C.white }}>{label}</div>
    </div>
  );
};

const ParcelIllo: React.FC<{ f0: number }> = ({ f0 }) => {
  const frame = useCurrentFrame();
  const flap = interpolate(frame, [f0 + 2, f0 + 12], [0, 1], { ...clamp, easing: theme.ease.out });
  const rise = useP(f0 + 10, "smooth");
  const fl = useFloat(4, 5);
  return (
    <div style={{ width: W, height: H, position: "relative", overflow: "hidden" }}>
      {/* back of box */}
      <div style={{ position: "absolute", left: 246, top: 300, width: 420, height: 40, background: "#B79CF0", borderRadius: 6 }} />
      {/* card */}
      <div
        style={{
          position: "absolute",
          left: 236,
          top: 300,
          width: 440,
          height: 270,
          borderRadius: 22,
          background: C.white,
          border: `3px solid ${C.lavender}`,
          boxShadow: "0 20px 40px -18px rgba(18,4,75,0.45)",
          transform: `translateY(${interpolate(rise, [0, 1], [140, -270]) + fl}px) rotate(${interpolate(rise, [0, 1], [0, -3])}deg)`,
          padding: "26px 30px",
          boxSizing: "border-box",
          display: "flex",
          flexDirection: "column",
          gap: 10,
        }}
      >
        <div style={{ fontFamily: theme.fonts.display, fontWeight: 700, fontSize: 38, color: C.navy }}>Thank you, Priya!</div>
        <div style={{ fontFamily: theme.fonts.body, fontWeight: 700, fontSize: 28, color: C.violetDeep }}>Agla order: 10% off</div>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 4 }}>
          <div style={{ border: `3px dashed ${C.violet}`, borderRadius: 12, padding: "6px 16px", fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 28, color: C.violet, letterSpacing: "0.08em" }}>BACK10</div>
          <div style={{ fontFamily: theme.fonts.body, fontWeight: 700, fontSize: 22, color: C.muted }}>— Your Brand</div>
        </div>
      </div>
      {/* front of box */}
      <div style={{ position: "absolute", left: 246, top: 320, width: 420, height: 200, background: "#CDB6F7", borderRadius: "0 0 16px 16px" }}>
        <div style={{ position: "absolute", left: 180, top: 0, width: 60, height: 200, background: C.violet, opacity: 0.85 }} />
        <div style={{ position: "absolute", left: 30, bottom: 26, fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 22, color: C.navy, opacity: 0.6 }}>FRAGILE · YOUR BRAND</div>
      </div>
      {/* flaps */}
      <div style={{ position: "absolute", left: 246, top: 320, width: 210, height: 90, background: "#BFA3F4", transformOrigin: "0% 0%", transform: `perspective(600px) rotateX(${-160 * flap}deg)`, borderRadius: 8 }} />
      <div style={{ position: "absolute", left: 456, top: 320, width: 210, height: 90, background: "#B497F2", transformOrigin: "100% 0%", transform: `perspective(600px) rotateX(${-160 * flap}deg)`, borderRadius: 8 }} />
    </div>
  );
};

const STEPS = ["WhatsApp pe doosri baar bulao", "Har hafte organic content", "Har parcel mein card"];

export const S5Fix: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const teen = cue("s5", "teen");
  const st = [cue("s5", "purane"), cue("s5", "har"), cue("s5", "aur")];
  const step = frame >= st[2] - 4 ? 2 : frame >= st[1] - 4 ? 1 : frame >= st[0] - 4 ? 0 : -1;
  const illos = [ChatIllo, CalendarIllo, ParcelIllo];

  return (
    <SceneShell dur={dur} noExit>
      <Camera dur={dur} punches={[teen]} push={0.02}>
        <div style={{ position: "absolute", left: theme.layout.padX, right: theme.layout.padX, top: 300, display: "flex", flexDirection: "column", alignItems: "center", gap: 18 }}>
          <Enter delay={0} cfg="snappy">
            <Chip size={34} bg={C.green}>
              ILAAJ
            </Chip>
          </Enter>
          <Headline text="Teen kaam" delay={teen - 6} size={112} hl={["Teen"]} />
        </div>
        {/* illustration stage */}
        <Enter delay={st[0] - 6} style={{ position: "absolute", left: theme.layout.padX, top: 500 }}>
          <Card style={{ width: W, height: H, position: "relative", overflow: "hidden" }}>
            {illos.map((Illo, i) => {
              const inP = interpolate(frame, [st[i] - 4, st[i] + 8], [0, 1], { ...clamp, easing: theme.ease.out });
              const outP = i < 2 ? interpolate(frame, [st[i + 1] - 6, st[i + 1] + 4], [0, 1], { ...clamp, easing: theme.ease.in }) : 0;
              if (inP <= 0 || outP >= 1) return null;
              return (
                <div key={i} style={{ position: "absolute", inset: 0, opacity: inP * (1 - outP), transform: `translateX(${(1 - inP) * 160 - outP * 160}px)` }}>
                  <Illo f0={st[i]} />
                </div>
              );
            })}
          </Card>
        </Enter>
        {/* step rows */}
        {STEPS.map((t, i) => {
          const draw = interpolate(frame, [st[i] + 4, st[i] + 18], [0, 1], clamp);
          const active = step === i;
          return (
            <Enter key={i} delay={st[i] - 4} from="left" dist={60} style={{ position: "absolute", left: theme.layout.padX, top: 1000 + i * 84 }}>
              <div
                style={{
                  width: W,
                  height: 72,
                  boxSizing: "border-box",
                  borderRadius: 20,
                  background: active ? C.lavender : C.white,
                  border: `2px solid ${active ? C.violet : "rgba(18,4,75,0.08)"}`,
                  display: "flex",
                  alignItems: "center",
                  gap: 18,
                  padding: "0 20px",
                  boxShadow: "0 10px 24px -18px rgba(18,4,75,0.4)",
                }}
              >
                <CheckIcon size={44} draw={draw} />
                <div style={{ fontFamily: theme.fonts.display, fontWeight: 700, fontSize: 36, color: C.navy }}>
                  {i + 1}. {t}
                </div>
              </div>
            </Enter>
          );
        })}
      </Camera>
      <Sfx at={teen - 4} name="whoosh" vol={0.4} />
      {st.map((s, i) => (
        <React.Fragment key={i}>
          <Sfx at={s - 6} name="swish" vol={0.4} />
          <Sfx at={s + 6} name="check" vol={0.4} />
        </React.Fragment>
      ))}
      <Sfx at={st[0] + 4} name="pop" vol={0.35} />
      <Sfx at={st[0] + 16} name="pop" vol={0.35} />
      <Sfx at={st[0] + 44} name="pop" vol={0.35} />
      <Sfx at={st[2] + 10} name="ding" vol={0.35} />
    </SceneShell>
  );
};
