import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { Camera } from "../../components/fx";
import { CheckIcon, CrossIcon, CursorIcon } from "../../components/icons";
import { Card, Chip, Enter, Headline, SceneShell, Sfx, clamp, useFloat, useRamp, useSpring } from "../../components/kit";
import { CommentBox, DmCard, FollowButton, Stamp } from "../../components/widgets";
import { C, theme } from "../../theme";
import { cue } from "./timeline";

const PX = theme.layout.padX;

/* ---------- small pieces ---------- */

const Person: React.FC<{ color: string; size?: number }> = ({ color, size = 34 }) => (
  <svg width={size} height={size * 1.15} viewBox="0 0 34 39">
    <circle cx={17} cy={10} r={8} fill={color} />
    <path d="M3 38 Q4 21 17 21 Q30 21 31 38 Z" fill={color} />
  </svg>
);

const Bag: React.FC<{ size?: number; color?: string }> = ({ size = 46, color = C.green }) => (
  <svg width={size} height={size} viewBox="0 0 46 46">
    <path d="M8 16 H38 L35 42 H11 Z" fill={color} stroke={C.navy} strokeWidth={3} strokeLinejoin="round" />
    <path d="M16 18 V12 Q16 5 23 5 Q30 5 30 12 V18" fill="none" stroke={C.navy} strokeWidth={3} strokeLinecap="round" />
  </svg>
);

const Pop: React.FC<{ at: number; children: React.ReactNode; style?: React.CSSProperties }> = ({ at, children, style }) => {
  const p = useSpring(at, "bouncy");
  return (
    <div style={{ opacity: interpolate(p, [0, 0.3], [0, 1], clamp), transform: `scale(${interpolate(p, [0, 1], [0.3, 1])})`, ...style }}>{children}</div>
  );
};

/* ---------- S1: budget 2x? RUKO ---------- */
export const S1Hook: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const dbl = cue("s1", "double");
  const pehle = cue("s1", "pehle");
  const number = cue("s1", "number");
  const cur = interpolate(frame, [0, pehle - 2], [0, 1], { ...clamp, easing: theme.ease.out });
  const recoil = interpolate(frame, [pehle, pehle + 8], [0, 1], { ...clamp, easing: theme.ease.out });
  const press = frame > pehle - 10 && frame < pehle - 4 ? 0.97 : 1;
  return (
    <SceneShell dur={dur} noExit>
      <Camera dur={dur} punches={[pehle]}>
        <div style={{ position: "absolute", left: 0, right: 0, top: 320, display: "flex", justifyContent: "center" }}>
          <Chip size={34} bg={C.navy}>
            AD BUDGET
          </Chip>
        </div>
        <div style={{ position: "absolute", left: 0, right: 0, top: 430, display: "flex", justifyContent: "center" }}>
          <div
            style={{
              transform: `scale(${press})`,
              background: theme.grad.violet,
              color: C.white,
              fontFamily: theme.fonts.display,
              fontWeight: 700,
              fontSize: 120,
              padding: "40px 80px 26px",
              borderRadius: 48,
              boxShadow: `0 34px 70px -24px ${C.glow}, inset 0 -12px 0 rgba(0,0,0,0.2)`,
              filter: frame >= pehle ? "saturate(0.6)" : undefined,
            }}
          >
            BUDGET 2x
          </div>
        </div>
        <Pop at={dbl} style={{ position: "absolute", left: 0, right: 0, top: 660, display: "flex", justifyContent: "center" }}>
          <div style={{ fontFamily: theme.fonts.display, fontWeight: 700, fontSize: 58, color: C.navy }}>
            ₹10,000 <span style={{ color: C.muted }}>→</span> <span style={{ color: C.red }}>₹20,000</span>
          </div>
        </Pop>
        <div style={{ position: "absolute", left: 640 + (1 - cur) * 300 + recoil * 80, top: 560 + (1 - cur) * 300 + recoil * 60 }}>
          <CursorIcon size={110} />
        </div>
        <div style={{ position: "absolute", left: 0, right: 0, top: 420, display: "flex", justifyContent: "center" }}>
          <Stamp at={pehle} text="RUKO" size={150} rotate={-10} />
        </div>
        <Pop at={number - 4} style={{ position: "absolute", left: 0, right: 0, top: 790, display: "flex", justifyContent: "center" }}>
          <Card style={{ padding: "22px 40px", display: "flex", alignItems: "center", gap: 20 }}>
            <div style={{ width: 70, height: 70, borderRadius: 20, background: C.lavender, color: C.violetDeep, fontFamily: theme.fonts.display, fontWeight: 700, fontSize: 50, display: "flex", alignItems: "center", justifyContent: "center", paddingTop: 6, boxSizing: "border-box" }}>?</div>
            <div style={{ fontFamily: theme.fonts.display, fontWeight: 700, fontSize: 48, color: C.navy }}>Pehle yeh 1 number</div>
          </Card>
        </Pop>
      </Camera>
      <Sfx at={0} name="bass" vol={0.6} />
      <Sfx at={dbl - 2} name="pop" vol={0.5} />
      <Sfx at={pehle - 2} name="stamp" vol={0.9} />
      <Sfx at={number - 6} name="swish" vol={0.5} />
    </SceneShell>
  );
};

/* ---------- S2: conversion rate ---------- */
export const S2Conv: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const dbl = cue("s2", "double");
  const bina = cue("s2", "bina");
  const orders = cue("s2", "orders");
  const mark = interpolate(frame, [6, 22], [0, 1], { ...clamp, easing: theme.ease.out });
  const strike = interpolate(frame, [bina + 10, bina + 22], [0, 1], { ...clamp, easing: theme.ease.out });
  const Pill: React.FC<{ text: string; bg: string; at: number }> = ({ text, bg, at }) => (
    <Pop at={at}>
      <div style={{ background: bg, color: C.white, fontFamily: theme.fonts.display, fontWeight: 700, fontSize: 48, padding: "20px 30px 12px", borderRadius: 24, boxShadow: "0 16px 30px -16px rgba(18,4,75,0.5)" }}>{text}</div>
    </Pop>
  );
  return (
    <SceneShell dur={dur} noExit>
      <Camera dur={dur} punches={[orders]}>
        <div style={{ position: "absolute", left: PX, right: PX, top: 330, display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
          <div style={{ position: "relative" }}>
            <div style={{ position: "absolute", left: -20, right: -20, top: 34, bottom: 6, background: C.lavender, borderRadius: 24, transform: `scaleX(${mark}) rotate(-1.5deg)`, transformOrigin: "left center" }} />
            <Headline text="Conversion rate" delay={0} size={118} />
          </div>
          <Enter delay={16} cfg="snappy">
            <div style={{ fontFamily: theme.fonts.body, fontWeight: 600, fontSize: 40, color: C.muted }}>100 visitors mein se kitne khareedte hain</div>
          </Enter>
        </div>
        <div style={{ position: "absolute", left: 0, right: 0, top: 640, display: "flex", justifyContent: "center", alignItems: "center", gap: 22 }}>
          <Pill text="Conversion ×2" bg={C.violet} at={dbl - 2} />
          <Pop at={dbl + 6}>
            <div style={{ fontFamily: theme.fonts.display, fontWeight: 700, fontSize: 64, color: C.navy }}>→</div>
          </Pop>
          <Pill text="Orders ×2" bg={C.green} at={orders - 2} />
        </div>
        <Pop at={bina} style={{ position: "absolute", left: 0, right: 0, top: 800, display: "flex", justifyContent: "center" }}>
          <div style={{ position: "relative", display: "flex", alignItems: "center", gap: 18, fontFamily: theme.fonts.display, fontWeight: 700, fontSize: 46, color: C.navy, background: C.white, border: "3px solid rgba(18,4,75,0.12)", borderRadius: 22, padding: "16px 28px 10px" }}>
            Budget ×2
            <div style={{ position: "absolute", left: 18, top: "48%", height: 8, width: `${strike * 230}px`, background: C.red, borderRadius: 4 }} />
            <span style={{ fontFamily: theme.fonts.body, fontSize: 30, color: C.red, opacity: strike }}>zaroori nahi</span>
          </div>
        </Pop>
      </Camera>
      <Sfx at={2} name="swish" vol={0.5} />
      <Sfx at={dbl - 3} name="pop" vol={0.5} />
      <Sfx at={bina + 10} name="error" vol={0.4} />
      <Sfx at={orders - 3} name="ding" vol={0.45} />
    </SceneShell>
  );
};

/* ---------- S3: the funnel math ---------- */
export const S3Math: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const ten = cue("s3", "₹10,000");
  const k1 = cue("s3", "1,000");
  const sau = cue("s3", "sau");
  const ek = cue("s3", "ek", 2);
  const o10 = cue("s3", "10");
  const r1000 = cue("s3", "₹1,000");
  const doC = cue("s3", "do");
  const o20 = cue("s3", "20");
  const r500 = cue("s3", "₹500");
  const two = frame >= doC + 2;
  const flip = useSpring(doC + 2, "slam");
  const res2 = useSpring(r500 - 2, "slam");
  const bags = frame >= o20 ? 20 : frame >= o10 ? 10 : 0;
  return (
    <SceneShell dur={dur} noExit>
      <Camera dur={dur} punches={[r1000, r500]} push={0.02}>
        <div style={{ position: "absolute", left: PX, right: PX, top: 296, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Pop at={ten - 2}>
            <Chip size={36} style={{ background: theme.grad.violet }}>
              ₹10,000 ADS
            </Chip>
          </Pop>
          <Pop at={k1 - 4}>
            <div style={{ fontFamily: theme.fonts.display, fontWeight: 700, fontSize: 46, color: C.muted }}>→</div>
          </Pop>
          <Pop at={k1}>
            <Chip size={36} bg={C.navy}>
              1,000 LOG AAYE
            </Chip>
          </Pop>
          <Pop at={ten + 6}>
            <Chip size={20} bg={C.lavenderSoft} color={C.violetDeep}>
              EXAMPLE
            </Chip>
          </Pop>
        </div>
        {/* 100 people, 1 icon = 10 people */}
        <div style={{ position: "absolute", left: PX, top: 392 }}>
          <Card style={{ width: 912, height: 262, boxSizing: "border-box", padding: "12px 28px", position: "relative" }}>
            <div style={{ position: "absolute", right: 26, top: 12, fontFamily: theme.fonts.body, fontWeight: 700, fontSize: 22, color: C.muted, opacity: frame >= k1 ? 1 : 0 }}>1 icon = 10 log</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(20, 40px)", rowGap: 4, marginTop: 26 }}>
              {Array.from({ length: 100 }).map((_, i) => {
                const p = spring({ frame: frame - k1 - (i % 20) * 0.6 - Math.floor(i / 20) * 2, fps, config: theme.spring.snappy });
                const buyer = i === 47 ? frame >= ek : i === 52 ? two : false;
                const bp = buyer ? spring({ frame: frame - (i === 47 ? ek : doC + 2), fps, config: theme.spring.bouncy }) : 0;
                return (
                  <div key={i} style={{ position: "relative", opacity: p, transform: `scale(${p * (buyer ? 1.25 : 1) * (1 + 0.5 * Math.sin(Math.PI * Math.min(1, bp)))})`, zIndex: buyer ? 2 : 1 }}>
                    {buyer && <div style={{ position: "absolute", left: -6, top: -6, width: 46, height: 50, borderRadius: 14, background: "rgba(22,163,74,0.18)", boxShadow: "0 0 18px rgba(22,163,74,0.6)" }} />}
                    <div style={{ position: "relative" }}>
                      <Person color={buyer ? C.green : "#CFC4F3"} size={34} />
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>
        {/* rate */}
        <Pop at={sau} style={{ position: "absolute", left: 0, right: 0, top: 668, display: "flex", justifyContent: "center", alignItems: "center", gap: 18 }}>
          <div style={{ fontFamily: theme.fonts.display, fontWeight: 700, fontSize: 44, color: C.navy }}>100 mein se</div>
          <div
            style={{
              background: two ? C.green : C.navy,
              color: C.white,
              fontFamily: theme.fonts.display,
              fontWeight: 700,
              fontSize: 54,
              padding: "10px 24px 2px",
              borderRadius: 18,
              transform: two ? `scale(${interpolate(flip, [0, 1], [1.5, 1])})` : undefined,
            }}
          >
            {two ? "2" : "1"}
          </div>
          <div style={{ fontFamily: theme.fonts.display, fontWeight: 700, fontSize: 44, color: C.navy }}>
            = {two ? "2%" : "1%"}
          </div>
        </Pop>
        {/* orders */}
        <div style={{ position: "absolute", left: PX, top: 760, width: 912, display: "flex", alignItems: "center", gap: 14, height: 64 }}>
          {bags > 0 && (
            <div style={{ fontFamily: theme.fonts.display, fontWeight: 700, fontSize: 44, color: C.green, width: 236, flex: "0 0 236px", whiteSpace: "nowrap" }}>{bags} orders</div>
          )}
          <div style={{ display: "flex", gap: 1, width: 662 }}>
            {Array.from({ length: bags }).map((_, i) => {
              const start = i < 10 ? o10 + i * 1.5 : o20 + (i - 10) * 1.5;
              const p = spring({ frame: frame - start, fps, config: theme.spring.bouncy });
              return (
                <div key={i} style={{ transform: `scale(${p}) translateY(${(1 - p) * -30}px)` }}>
                  <Bag size={32} />
                </div>
              );
            })}
          </div>
        </div>
        {/* result */}
        <Pop at={r1000 - 2} style={{ position: "absolute", left: 0, right: 0, top: 850, display: "flex", justifyContent: "center", alignItems: "center", gap: 26 }}>
          <div style={{ position: "relative", fontFamily: theme.fonts.display, fontWeight: 700, fontSize: 60, color: C.red, background: C.redSoft, borderRadius: 20, padding: "12px 26px 4px", opacity: frame >= r500 ? 0.55 : 1 }}>
            ₹1,000 / order
            {frame >= r500 && <div style={{ position: "absolute", left: 14, right: 14, top: "48%", height: 7, background: C.red, borderRadius: 4, transform: `scaleX(${res2})`, transformOrigin: "left" }} />}
          </div>
          {frame >= r500 - 2 && (
            <div
              style={{
                fontFamily: theme.fonts.display,
                fontWeight: 700,
                fontSize: 68,
                color: C.white,
                background: C.green,
                borderRadius: 20,
                padding: "12px 26px 4px",
                transform: `scale(${interpolate(res2, [0, 1], [1.6, 1])}) rotate(-2deg)`,
                opacity: interpolate(res2, [0, 0.3], [0, 1], clamp),
              }}
            >
              ₹500
            </div>
          )}
        </Pop>
      </Camera>
      <Sfx at={ten - 3} name="pop" vol={0.5} />
      <Sfx at={k1 - 2} name="whoosh" vol={0.4} />
      {[0, 1, 2, 3, 4].map((i) => (
        <Sfx key={i} at={k1 + i * 5} name="tick" vol={0.3} />
      ))}
      <Sfx at={ek} name="check" vol={0.5} />
      {[0, 1, 2, 3].map((i) => (
        <Sfx key={`b${i}`} at={o10 + i * 4} name="pop" vol={0.3} />
      ))}
      <Sfx at={r1000 - 3} name="stamp" vol={0.5} />
      <Sfx at={doC + 1} name="pop" vol={0.5} />
      {[0, 1, 2, 3].map((i) => (
        <Sfx key={`c${i}`} at={o20 + i * 4} name="pop" vol={0.3} />
      ))}
      <Sfx at={r500 - 3} name="ding" vol={0.5} />
    </SceneShell>
  );
};

/* ---------- S4: two roads ---------- */
export const S4Roads: React.FC<{ dur: number }> = ({ dur }) => {
  const r20 = cue("s4", "₹20,000");
  const page = cue("s4", "page");
  const Road: React.FC<{ title: string; amount: string; good: boolean; at: number; left: number }> = ({ title, amount, good, at, left }) => (
    <Enter delay={at - 4} from={good ? "right" : "left"} dist={80} style={{ position: "absolute", left, top: 400 }}>
      <Card glow={good ? 0.6 : 0} style={{ width: 436, height: 500, boxSizing: "border-box", padding: "30px 26px", display: "flex", flexDirection: "column", alignItems: "center", gap: 18 }}>
        <div style={{ fontFamily: theme.fonts.display, fontWeight: 700, fontSize: 44, color: C.navy, textAlign: "center", lineHeight: 1.1 }}>{title}</div>
        <div style={{ fontFamily: theme.fonts.display, fontWeight: 700, fontSize: 96, color: good ? C.green : C.red, lineHeight: 1 }}>{amount}</div>
        <div style={{ fontFamily: theme.fonts.body, fontWeight: 700, fontSize: 30, color: C.muted }}>20 orders ke liye</div>
        <div style={{ marginTop: "auto" }}>{good ? <CheckIcon size={90} /> : <CrossIcon size={90} />}</div>
      </Card>
    </Enter>
  );
  return (
    <SceneShell dur={dur} noExit>
      <Camera dur={dur} punches={[page]}>
        <div style={{ position: "absolute", left: 0, right: 0, top: 310, display: "flex", justifyContent: "center" }}>
          <Enter delay={0} cfg="snappy">
            <Chip size={34} bg={C.navy}>
              20 ORDERS KE 2 RAASTE
            </Chip>
          </Enter>
        </div>
        <Road title="Budget double" amount="₹20,000" good={false} at={r20} left={PX} />
        <Road title="Page sudhaaro" amount="₹10,000" good at={page} left={1080 - PX - 436} />
      </Camera>
      <Sfx at={r20 - 5} name="swish" vol={0.45} />
      <Sfx at={r20 + 4} name="error" vol={0.35} />
      <Sfx at={page - 5} name="swish" vol={0.45} />
      <Sfx at={page + 4} name="ding" vol={0.45} />
    </SceneShell>
  );
};

/* ---------- S5: the product page fix ---------- */
const Glow: React.FC<{ on: number; children: React.ReactNode; style?: React.CSSProperties }> = ({ on, children, style }) => (
  <div style={{ position: "relative", borderRadius: 14, boxShadow: on > 0 ? `0 0 0 ${5 * on}px rgba(109,74,253,${0.9 * on}), 0 0 ${40 * on}px rgba(109,74,253,${0.5 * on})` : undefined, ...style }}>{children}</div>
);

export const S5Page: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const ek = cue("s5", "ek");
  const photo = cue("s5", "photo");
  const price = cue("s5", "price");
  const rating = cue("s5", "rating");
  const add = cue("s5", "add");
  const doC = cue("s5", "do");
  const video = cue("s5", "video");
  const teen = cue("s5", "teen");
  const reviews = cue("s5", "reviews");
  const g = (at: number, len = 30) => interpolate(frame, [at - 2, at + 4, at + len, at + len + 10], [0, 1, 1, 0.25], clamp);
  const fold = interpolate(frame, [ek, ek + 10], [0, 1], clamp);
  const vid = useSpring(video - 4, "bouncy");
  const rev = useSpring(reviews - 8, "bouncy");
  const items = [
    { at: ek, text: "Bina scroll: photo, price, rating, add to cart" },
    { at: doC, text: "Product use hote hue video" },
    { at: teen, text: "Price ke paas photo reviews" },
  ];
  const fl = useFloat(3, 3);
  return (
    <SceneShell dur={dur} noExit>
      <Camera dur={dur} push={0.02}>
        {/* phone */}
        <Enter delay={0} from="left" dist={80} style={{ position: "absolute", left: PX, top: 300 }}>
          <div style={{ width: 380, height: 670, borderRadius: 56, border: `12px solid ${C.navy}`, background: C.white, overflow: "hidden", position: "relative", boxShadow: "0 30px 60px -26px rgba(18,4,75,0.5)", transform: `translateY(${fl}px)` }}>
            <div style={{ height: 40, background: C.navy }} />
            <div style={{ padding: 16, display: "flex", flexDirection: "column", gap: 12 }}>
              <Glow on={g(photo)}>
                <div style={{ height: 250, borderRadius: 14, background: "linear-gradient(135deg, #EFE5FF, #DFC8FD)", position: "relative", overflow: "hidden" }}>
                  <div style={{ position: "absolute", left: 110, top: 40, width: 120, height: 170, borderRadius: 22, background: C.violet }} />
                  <div style={{ position: "absolute", left: 140, top: 18, width: 60, height: 34, borderRadius: 8, background: C.navy }} />
                  {vid > 0.01 && (
                    <div style={{ position: "absolute", inset: 0, background: "rgba(18,4,75,0.35)", display: "flex", alignItems: "center", justifyContent: "center", opacity: vid }}>
                      <svg width={90} height={90} viewBox="0 0 90 90" style={{ transform: `scale(${vid})` }}>
                        <circle cx={45} cy={45} r={42} fill={C.white} />
                        <path d="M36 28 L64 45 L36 62 Z" fill={C.violet} />
                      </svg>
                      <div style={{ position: "absolute", left: 12, top: 12, background: C.red, color: C.white, fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 18, padding: "4px 10px", borderRadius: 8 }}>VIDEO</div>
                    </div>
                  )}
                </div>
              </Glow>
              <div style={{ fontFamily: theme.fonts.display, fontWeight: 700, fontSize: 26, color: C.navy }}>Vitamin C Face Serum</div>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <Glow on={g(price)} style={{ padding: "2px 8px" }}>
                  <div style={{ fontFamily: theme.fonts.display, fontWeight: 700, fontSize: 34, color: C.navy }}>₹799</div>
                </Glow>
                <Glow on={g(rating)} style={{ padding: "2px 8px" }}>
                  <div style={{ fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 22, color: "#E89B00" }}>★★★★☆ 4.3</div>
                </Glow>
              </div>
              {/* photo reviews next to price */}
              <div style={{ display: "flex", gap: 8, height: 54, opacity: rev, transform: `scale(${interpolate(rev, [0, 1], [0.6, 1])})`, transformOrigin: "left center" }}>
                {["#FFD9C2", "#C9F0DA", "#CFE0FF", "#F7C9DE"].map((c, i) => (
                  <div key={i} style={{ width: 54, height: 54, borderRadius: 10, background: c, border: `3px solid ${C.white}`, boxShadow: "0 4px 10px rgba(18,4,75,0.2)", position: "relative" }}>
                    <div style={{ position: "absolute", left: 16, top: 10, width: 20, height: 20, borderRadius: "50%", background: "rgba(18,4,75,0.25)" }} />
                  </div>
                ))}
                <div style={{ fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 18, color: C.violetDeep, alignSelf: "center" }}>212 photo reviews</div>
              </div>
              <Glow on={g(add)}>
                <div style={{ height: 64, borderRadius: 14, background: theme.grad.violet, color: C.white, fontFamily: theme.fonts.display, fontWeight: 700, fontSize: 28, display: "flex", alignItems: "center", justifyContent: "center", paddingTop: 4 }}>
                  ADD TO CART
                </div>
              </Glow>
            </div>
            {/* fold line */}
            <div style={{ position: "absolute", left: 0, right: 0, top: 590, borderTop: `4px dashed ${C.red}`, opacity: fold }}>
              <div style={{ position: "absolute", right: 10, top: -32, background: C.red, color: C.white, fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 16, padding: "4px 10px", borderRadius: 8 }}>SCROLL SE PEHLE</div>
            </div>
          </div>
        </Enter>
        {/* checklist */}
        <div style={{ position: "absolute", left: 494, top: 300, width: 502, display: "flex", flexDirection: "column", gap: 18 }}>
          <Enter delay={0} cfg="snappy">
            <Chip size={34} bg={C.green}>
              ILAAJ
            </Chip>
          </Enter>
          {items.map((it, i) => {
            const draw = interpolate(frame, [it.at + 4, it.at + 18], [0, 1], clamp);
            const active = frame >= it.at && (i === 2 || frame < items[i + 1].at);
            return (
              <Enter key={i} delay={it.at - 4} from="right" dist={60}>
                <div style={{ display: "flex", gap: 16, alignItems: "flex-start", background: active ? C.lavender : C.white, border: `3px solid ${active ? C.violet : "rgba(18,4,75,0.08)"}`, borderRadius: 22, padding: "18px 18px", boxShadow: "0 12px 26px -18px rgba(18,4,75,0.4)" }}>
                  <div style={{ flex: "0 0 52px" }}>
                    <CheckIcon size={52} draw={draw} />
                  </div>
                  <div style={{ fontFamily: theme.fonts.display, fontWeight: 700, fontSize: 36, lineHeight: 1.15, color: C.navy }}>
                    {i + 1}. {it.text}
                  </div>
                </div>
              </Enter>
            );
          })}
        </div>
      </Camera>
      <Sfx at={1} name="whoosh" vol={0.4} />
      {[photo, price, rating, add].map((a, i) => (
        <Sfx key={i} at={a} name="tick" vol={0.4} />
      ))}
      {items.map((it, i) => (
        <Sfx key={`c${i}`} at={it.at + 6} name="check" vol={0.45} />
      ))}
      <Sfx at={video - 4} name="pop" vol={0.45} />
      <Sfx at={reviews - 8} name="pop" vol={0.45} />
    </SceneShell>
  );
};

/* ---------- S6: CTA ---------- */
export const S6Cta: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const audit = cue("s6", "audit");
  const free = cue("s6", "free");
  const kal = cue("s6", "kal");
  const bill = cue("s6", "bill");
  const follow = cue("s6", "follow");
  const outA = useRamp(kal - 6, kal + 2, "in");
  const grow = interpolate(frame, [bill - 4, bill + 20], [0, 1], { ...clamp, easing: theme.ease.out });
  return (
    <SceneShell dur={dur} noExit>
      <Camera dur={dur} punches={[audit]} push={0.02}>
        {frame < kal + 4 && (
          <div style={{ position: "absolute", inset: 0, opacity: 1 - outA, transform: `translateY(${-60 * outA}px)` }}>
            <Enter delay={0} style={{ position: "absolute", left: PX, top: 310 }}>
              <CommentBox word="AUDIT" typeStart={audit - 10} />
            </Enter>
            <Enter delay={free - 6} from="right" dist={120} style={{ position: "absolute", left: PX, top: 490 }}>
              <DmCard
                title="Free Product Page Check"
                sub="3 fixes · DM mein"
                icon={
                  <svg width={86} height={100} viewBox="0 0 86 100">
                    <rect x={14} y={4} width={58} height={92} rx={12} fill={C.white} stroke={C.navy} strokeWidth={5} />
                    <rect x={22} y={16} width={42} height={30} rx={5} fill={C.lavender} />
                    <path d="M26 64 L36 74 L58 52" fill="none" stroke={C.green} strokeWidth={7} strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                }
              />
            </Enter>
          </div>
        )}
        {frame >= kal - 2 && (
          <>
            <div style={{ position: "absolute", left: PX, right: PX, top: 310, display: "flex", flexDirection: "column", alignItems: "center", gap: 18 }}>
              <Enter delay={kal} cfg="snappy">
                <Chip size={34} bg={C.navy}>
                  KAL KA CASE
                </Chip>
              </Enter>
              <Headline text="Naya customer nahi, bada bill" delay={kal + 4} size={78} hl={["bada"]} />
            </div>
            <Enter delay={kal + 8} style={{ position: "absolute", left: 0, right: 0, top: 560, display: "flex", justifyContent: "center" }}>
              <div style={{ width: 380, background: C.white, borderRadius: 18, border: "3px solid rgba(18,4,75,0.1)", boxShadow: "0 20px 40px -20px rgba(18,4,75,0.4)", padding: "20px 26px", fontFamily: theme.fonts.body, fontWeight: 700, fontSize: 26, color: C.navy, display: "flex", flexDirection: "column", gap: 10 }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span>Serum</span>
                  <span>₹799</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", opacity: grow, color: C.violetDeep }}>
                  <span>+ Toner (combo)</span>
                  <span>₹399</span>
                </div>
                <div style={{ borderTop: "3px dashed rgba(18,4,75,0.2)", paddingTop: 10, display: "flex", justifyContent: "space-between", fontFamily: theme.fonts.display, fontSize: 36 }}>
                  <span>Bill</span>
                  <span style={{ color: frame >= bill ? C.green : C.navy }}>₹{Math.round(799 + 399 * grow).toLocaleString("en-IN")}</span>
                </div>
              </div>
            </Enter>
          </>
        )}
        {frame >= follow - 10 && (
          <div style={{ position: "absolute", left: 0, right: 0, top: 840 }}>
            <FollowButton at={follow} />
          </div>
        )}
      </Camera>
      {Array.from({ length: 5 }).map((_, i) => (
        <Sfx key={i} at={audit - 10 + i * 2} name="key" vol={0.4} />
      ))}
      <Sfx at={free - 6} name="pop" vol={0.5} />
      <Sfx at={kal - 4} name="whoosh" vol={0.45} />
      <Sfx at={bill} name="ding" vol={0.4} />
      <Sfx at={follow + 12} name="pop" vol={0.6} />
      <Sfx at={follow + 15} name="ding" vol={0.45} />
    </SceneShell>
  );
};
