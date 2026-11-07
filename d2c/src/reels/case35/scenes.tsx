import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { Person, PRIYA, ROHIT } from "../../components/Cartoon";
import { Doctor, PoseKey } from "../../components/Doctor";
import { Camera } from "../../components/fx";
import { CtaFlow, HookTitle, LINE, Place, makeMouth } from "../../components/format";
import { Card, Chip, SceneShell, Sfx, clamp } from "../../components/kit";
import { Clinic, Doorstep, MoneyRoom, Stage, Whiteboard } from "../../components/sets";
import { Stamp } from "../../components/widgets";
import { C, theme } from "../../theme";
import { T, cue } from "./timeline";

const sceneMouth = makeMouth(T);
const TAG = "CASE #35";
const big = (size: number, color: string = LINE): React.CSSProperties => ({ fontFamily: theme.fonts.display, fontWeight: 700, fontSize: size, lineHeight: 1.05, color, whiteSpace: "nowrap" });
const body = (size: number, color: string = LINE): React.CSSProperties => ({ fontFamily: theme.fonts.body, fontWeight: 800, fontSize: size, color, whiteSpace: "nowrap" });

/** Speech bubble. */
const Bubble: React.FC<{ children: React.ReactNode; p?: number; color?: string; tail?: "left" | "right" }> = ({ children, p = 1, color = C.white, tail = "left" }) => (
  <div style={{ position: "relative", opacity: p, transform: `scale(${0.8 + 0.2 * p})`, transformOrigin: tail === "left" ? "left bottom" : "right bottom" }}>
    <div style={{ background: color, border: `6px solid ${LINE}`, borderRadius: 28, padding: "16px 26px 10px", boxShadow: `6px 6px 0 ${LINE}`, ...big(48) }}>{children}</div>
    <div style={{ position: "absolute", bottom: -22, [tail]: 40, width: 0, height: 0, borderLeft: "18px solid transparent", borderRight: "18px solid transparent", borderTop: `24px solid ${LINE}` }} />
  </div>
);

/** Review card with five stars. */
export const ReviewCard: React.FC<{ w?: number; p?: number }> = ({ w = 640, p = 1 }) => (
  <div style={{ width: w, opacity: p, transform: `translateY(${(1 - p) * 40}px)` }}>
    <Card style={{ padding: "20px 26px 16px", border: `6px solid ${LINE}`, boxShadow: `8px 8px 0 ${C.green}`, boxSizing: "border-box" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        <div style={{ width: 70, height: 70, borderRadius: "50%", background: "#C98B60", border: `4px solid ${LINE}`, display: "flex", alignItems: "center", justifyContent: "center", ...big(34, C.white), paddingTop: 4, boxSizing: "border-box" }}>P</div>
        <div>
          <div style={big(38)}>Priya</div>
          <div style={{ display: "flex", gap: 4 }}>
            {Array.from({ length: 5 }).map((_, i) => (
              <svg key={i} width={30} height={30} viewBox="0 0 24 24">
                <path d="M12 2 L15 9 L22 9.5 L16.5 14 L18.5 21 L12 17 L5.5 21 L7.5 14 L2 9.5 L9 9 Z" fill="#FFC94A" stroke={LINE} strokeWidth={1.5} />
              </svg>
            ))}
          </div>
        </div>
        <div style={{ marginLeft: "auto", ...body(20, C.green) }}>VERIFIED</div>
      </div>
      <div style={{ fontFamily: theme.fonts.display, fontWeight: 700, fontSize: w * 0.075, lineHeight: 1.15, color: LINE, marginTop: 14 }}>
        "3 hafte mein <span style={{ background: "#D8F5E1", borderRadius: 10, padding: "0 8px" }}>farak dikha</span>"
      </div>
    </Card>
  </div>
);

/* ===== S1: hook ===== */
export const S1Hook: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const cust = cue("s1", "customer");
  return (
    <SceneShell dur={dur} noExit>
      <Camera dur={dur} punches={[cust]} push={0.03}>
        <MoneyRoom />
        <HookTitle
          top={300}
          lines={[
            { text: "Aap bol rahe ho 'best',", at: -8, kind: "plain", size: 76, rot: -1 },
            { text: "customer chup kyun?", at: -6, kind: "red", size: 84, rot: 2 },
          ]}
        />
        <div style={{ position: "absolute", left: 300, top: 640, zIndex: 8 }}>
          <Bubble>BEST product!</Bubble>
        </div>
        <Place x={60} y={780} s={0.74} z={6}>
          <Person look={ROHIT} seed="r351" track={[{ at: -100, pose: "megaphone", mood: "shout" }]} />
        </Place>
        <div style={{ position: "absolute", left: 830, top: 760, zIndex: 8, opacity: interpolate(frame, [cust - 8, cust], [0.3, 1], clamp) }}>
          <Bubble tail="right">...</Bubble>
        </div>
        <Place x={700} y={860} s={0.66} z={5}>
          <Person look={PRIYA} seed="p351" track={[{ at: -100, pose: "idle", mood: "neutral" }]} />
        </Place>
      </Camera>
      <Sfx at={1} name="whoosh" vol={0.4} />
      <Sfx at={cust - 4} name="pop" vol={0.35} />
    </SceneShell>
  );
};

/* ===== S2: Rohit on camera; people scroll away ===== */
export const S2Brand: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const hum = cue("s2", "humara");
  const scroll = cue("s2", "scroll");
  const aage = cue("s2", "aage");
  return (
    <SceneShell dur={dur} noExit>
      <Camera dur={dur} punches={[aage]} push={0.02}>
        <Stage />
        <div style={{ position: "absolute", left: 340, top: 400, zIndex: 8 }}>
          <Bubble p={interpolate(frame, [hum - 6, hum + 4], [0, 1], clamp)}>Humara serum BEST hai!</Bubble>
        </div>
        <Place x={120} y={720} s={0.78} z={6}>
          <Person look={ROHIT} seed="r352" track={[{ at: -100, pose: "megaphone", mood: "shout" }, { at: aage, pose: "shrug", mood: "sad" }]} />
        </Place>
        <div style={{ position: "absolute", left: 700, top: 640, zIndex: 7, opacity: interpolate(frame, [scroll - 6, scroll + 2], [0, 1], clamp) }}>
          <svg width={180} height={300} viewBox="0 0 60 100">
            {[0, 1, 2].map((i) => (
              <path key={i} d={`M30 ${80 - i * 26} L14 ${96 - i * 26} M30 ${80 - i * 26} L46 ${96 - i * 26}`} stroke={C.white} strokeWidth={6} strokeLinecap="round" opacity={interpolate((frame - scroll) / 6 - i, [0, 1], [0.2, 1], clamp)} />
            ))}
          </svg>
          <div style={{ ...big(44, C.white), textAlign: "center" }}>SCROLL</div>
        </div>
        <div style={{ position: "absolute", left: 640, top: 1040, zIndex: 9 }}>
          <Stamp at={aage} text="AAGE NIKAL GAYE" size={48} rotate={-6} />
        </div>
      </Camera>
      <Sfx at={hum - 4} name="pop" vol={0.4} />
      <Sfx at={scroll - 4} name="swish" vol={0.4} />
      <Sfx at={aage} name="stamp" vol={0.4} />
    </SceneShell>
  );
};

/* ===== S3: Priya's review on screen; people stop ===== */
export const S3Review: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const rev = cue("s3", "review");
  const ruk = cue("s3", "ruk");
  return (
    <SceneShell dur={dur} noExit>
      <Camera dur={dur} punches={[ruk]} push={0.02}>
        <Doorstep />
        <div style={{ position: "absolute", left: 200, top: 340, zIndex: 7 }}>
          <ReviewCard w={760} p={interpolate(frame, [rev - 8, rev + 4], [0, 1], { ...clamp, easing: theme.ease.out })} />
        </div>
        <Place x={120} y={800} s={0.74} z={5}>
          <Person look={PRIYA} seed="p353" track={[{ at: -100, pose: "hold", mood: "happy" }]} />
        </Place>
        <div style={{ position: "absolute", left: 700, top: 900, zIndex: 9 }}>
          <Stamp at={ruk} text="LOG RUK GAYE" size={56} rotate={-6} color={C.green} />
        </div>
      </Camera>
      <Sfx at={rev - 6} name="pop" vol={0.4} />
      <Sfx at={ruk} name="stamp" vol={0.45} />
    </SceneShell>
  );
};

/* ===== S4: brand talk sounds like an ad; customer talk sounds true ===== */
export const S4Why: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const brand = cue("s4", "brand");
  const sach = cue("s4", "sach");
  const poses: PoseKey[] = [
    { at: -100, pose: "explain" },
    { at: brand, pose: "stop" },
    { at: sach - 4, pose: "thumbs" },
  ];
  const row = (t: string, tag: string, col: string, at: number) => (
    <div style={{ opacity: interpolate(frame, [at - 8, at], [0, 1], clamp), transform: `translateX(${interpolate(frame, [at - 8, at], [60, 0], clamp)}px)` }}>
      <Card style={{ width: 720, padding: "16px 22px 12px", border: `6px solid ${LINE}`, boxShadow: `6px 6px 0 ${LINE}`, display: "flex", alignItems: "center", gap: 14, boxSizing: "border-box" }}>
        <span style={big(42)}>{t}</span>
        <span style={{ marginLeft: "auto", ...big(30, C.white), background: col, border: `4px solid ${LINE}`, borderRadius: 14, padding: "8px 14px 2px" }}>{tag}</span>
      </Card>
    </div>
  );
  return (
    <SceneShell dur={dur} noExit>
      <Camera dur={dur} punches={[sach]} push={0.02}>
        <Clinic />
        <div style={{ position: "absolute", left: 310, top: 380, display: "flex", flexDirection: "column", gap: 26, zIndex: 6 }}>
          {row("Brand ki baat", "AD LAGTI HAI", C.red, brand + 4)}
          {row("Customer ki baat", "SACH LAGTI HAI", C.green, sach)}
        </div>
        <Place x={-140} y={930} s={0.9} z={4}>
          <Doctor poses={poses} mouth={sceneMouth("s4")} brows={[brand, sach]} caseTag={TAG} />
        </Place>
      </Camera>
      <Sfx at={brand - 2} name="pop" vol={0.4} />
      <Sfx at={sach - 4} name="ding" vol={0.4} />
    </SceneShell>
  );
};

/* ===== S5: three steps ===== */
export const S5Fixes: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const a = cue("s5", "teen second");
  const b = cue("s5", "number");
  const c = cue("s5", "comments");
  const marks = [a, b, c];
  const poses: PoseKey[] = [
    { at: -100, pose: "one" },
    { at: b - 6, pose: "two" },
    { at: c - 6, pose: "three" },
  ];
  const fixes = ["Pehle 3 sec mein review ya customer video", "Kitne khush customers, number dikhao", "Achhe comments ko ad bana do"];
  return (
    <SceneShell dur={dur} noExit>
      <Camera dur={dur} push={0.02}>
        <Clinic />
        <Whiteboard style={{ left: 230, top: 300, width: 800, height: 640 }}>
          <div style={{ position: "absolute", left: 30, top: 24 }}>
            <Chip size={26} bg={C.green}>
              ILAAJ
            </Chip>
          </div>
          <div style={{ position: "absolute", left: 30, right: 30, top: 96, display: "flex", justifyContent: "center" }}>
            <div style={{ background: C.lavenderSoft, borderRadius: 14, padding: "10px 16px 6px", ...body(28, C.violetDeep) }}>Customer ko bolne do</div>
          </div>
          <div style={{ position: "absolute", left: 40, right: 30, top: 190, display: "flex", flexDirection: "column", gap: 30 }}>
            {fixes.map((t, i) => {
              const p = interpolate(frame, [marks[i] - 6, marks[i] + 4], [0, 1], { ...clamp, easing: theme.ease.out });
              return (
                <div key={t} style={{ display: "flex", alignItems: "center", gap: 18, opacity: p, transform: `translateX(${(1 - p) * 60}px)` }}>
                  <div style={{ width: 64, height: 64, borderRadius: 16, background: C.green, border: `5px solid ${LINE}`, display: "flex", alignItems: "center", justifyContent: "center", ...big(40, C.white), paddingTop: 4, boxSizing: "border-box", flexShrink: 0 }}>✓</div>
                  <div style={{ fontFamily: theme.fonts.display, fontWeight: 700, fontSize: 40, lineHeight: 1.1, color: LINE }}>{t}</div>
                </div>
              );
            })}
          </div>
        </Whiteboard>
        <Place x={-120} y={930} s={0.92} z={4}>
          <Doctor poses={poses} mouth={sceneMouth("s5")} brows={marks} caseTag={TAG} />
        </Place>
      </Camera>
      <Sfx at={1} name="whoosh" vol={0.4} />
      {marks.map((m, i) => (
        <Sfx key={i} at={m - 5} name="check" vol={0.4} />
      ))}
    </SceneShell>
  );
};

/* ===== S6: CTA ===== */
const ProofIcon: React.FC = () => (
  <svg width={92} height={92} viewBox="0 0 92 92">
    <rect x={8} y={8} width={76} height={76} rx={12} fill={C.white} stroke={LINE} strokeWidth={5} />
    <path d="M46 20 L53 36 L70 37 L57 48 L61 65 L46 56 L31 65 L35 48 L22 37 L39 36 Z" fill="#FFC94A" stroke={LINE} strokeWidth={4} strokeLinejoin="round" />
  </svg>
);

export const S6Cta: React.FC<{ dur: number }> = ({ dur }) => {
  const kw = cue("s6", "proof");
  const gift = cue("s6", "formats");
  const kal = cue("s6", "kal");
  const follow = cue("s6", "follow");
  const poses: PoseKey[] = [
    { at: -100, pose: "point" },
    { at: kal - 2, pose: "explain" },
    { at: follow - 4, pose: "thumbs" },
  ];
  return (
    <SceneShell dur={dur} noExit>
      <Camera dur={dur} punches={[kw + 4]} push={0.02}>
        <Clinic plus={false} />
        <CtaFlow
          keyword="PROOF"
          typeAt={kw - 8}
          giftAt={gift - 6}
          giftTitle="5 Proof Ad Formats"
          giftSub="free · review, video, comment se ad"
          giftIcon={<ProofIcon />}
          nextAt={kal}
          nextNum="#36"
          nextLabel="KAL DOPAHAR 1 BAJE · AGLA CASE"
          next={
            <div style={{ fontFamily: theme.fonts.display, fontWeight: 700, fontSize: 52, lineHeight: 1.12, color: LINE, textAlign: "center" }}>
              Ek customer ki
              <br />
              <span style={{ color: C.green }}>asli keemat</span> kitni?
            </div>
          }
          followAt={follow}
        />
        <Place x={250} y={1010} s={0.96} z={4}>
          <Doctor poses={poses} mouth={sceneMouth("s6")} brows={[kw, kal]} caseTag={TAG} />
        </Place>
      </Camera>
      {Array.from({ length: 5 }).map((_, i) => (
        <Sfx key={i} at={kw - 8 + i * 2} name="key" vol={0.4} />
      ))}
      <Sfx at={gift - 10} name="pop" vol={0.5} />
      <Sfx at={kal - 4} name="whoosh" vol={0.45} />
      <Sfx at={follow + 12} name="pop" vol={0.55} />
      <Sfx at={follow + 15} name="ding" vol={0.45} />
    </SceneShell>
  );
};
