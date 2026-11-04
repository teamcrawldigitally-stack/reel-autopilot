import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { Burst, Confetti, Parcel, Person, PRIYA, ROHIT } from "../../components/Cartoon";
import { Doctor, PoseKey } from "../../components/Doctor";
import { Camera } from "../../components/fx";
import { CtaFlow, HookTitle, LINE, Place, makeMouth } from "../../components/format";
import { Card, Chip, Enter, SceneShell, Sfx, clamp, useSpring } from "../../components/kit";
import { Bottle, Bubble, Calendar, NameTag, Phone, QMarks, Stars } from "../../components/props";
import { Clinic, Desk, MoneyRoom, OfficeWall, Stage, Whiteboard } from "../../components/sets";
import { Stamp } from "../../components/widgets";
import { C, theme } from "../../theme";
import { T, cue } from "./timeline";

const sceneMouth = makeMouth(T);
const TAG = "CASE #05";

/** Small row of n filled stars (rest empty). */
const MiniStars: React.FC<{ n: number; size?: number; of?: number }> = ({ n, size = 34, of = 5 }) => (
  <div style={{ display: "flex", gap: 3 }}>
    {Array.from({ length: of }).map((_, i) => (
      <svg key={i} width={size} height={size} viewBox="0 0 100 100">
        <path d="M50 6 L62 36 L94 38 L69 58 L78 90 L50 72 L22 90 L31 58 L6 38 L38 36 Z" fill={i < n ? "#F5B400" : "#E4DEF2"} stroke={LINE} strokeWidth={7} strokeLinejoin="round" />
      </svg>
    ))}
  </div>
);

/** Product page card: picture, name, rating, reviews, price. */
const ProductPage: React.FC<{ rating: string; stars: number; reviews: string; w?: number; children?: React.ReactNode; level?: number; color?: string }> = ({ rating, stars, reviews, w = 420, children, level = 0.8, color }) => (
  <div style={{ position: "relative", width: w, background: C.white, border: `6px solid ${LINE}`, borderRadius: 30, boxShadow: `8px 8px 0 ${LINE}`, padding: 22, boxSizing: "border-box", display: "flex", flexDirection: "column", gap: 10 }}>
    <div style={{ height: w * 0.52, background: C.lavenderSoft, borderRadius: 18, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <Bottle level={level} w={w * 0.22} color={color} />
    </div>
    <div style={{ fontFamily: theme.fonts.display, fontWeight: 700, fontSize: w * 0.075, color: LINE }}>Glow Serum · ₹799</div>
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <MiniStars n={stars} size={w * 0.07} />
      <div style={{ fontFamily: theme.fonts.display, fontWeight: 700, fontSize: w * 0.075, color: LINE }}>{rating}</div>
      <div style={{ fontFamily: theme.fonts.body, fontWeight: 700, fontSize: w * 0.05, color: C.muted }}>({reviews})</div>
    </div>
    {children}
  </div>
);

/* ===== S1: perfect 5.0, low sales ===== */
export const S1Hook: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const kam = cue("s1", "kam");
  const five = cue("s1", "5.0");
  const problem = cue("s1", "problem");
  const down = interpolate(frame, [kam - 4, kam + 20], [0, 1], { ...clamp, easing: theme.ease.out });
  return (
    <SceneShell dur={dur} noExit>
      <Camera dur={dur} punches={[3, five]} push={0.03}>
        <OfficeWall />
        <Place x={-30} y={640} s={1.05} z={4}>
          <Person
            look={ROHIT}
            seed="r51"
            track={[
              { at: -100, pose: "cheer", mood: "grin" },
              { at: kam - 2, pose: "shrug", mood: "shock" },
              { at: problem, pose: "sad", mood: "sad" },
            ]}
          />
        </Place>
        <div style={{ position: "absolute", inset: 0, zIndex: 5 }}>
          <Desk burn={false} />
        </div>
        <Place x={560} y={600} z={6}>
          <div style={{ transform: `rotate(${3 - down * 2}deg)` }}>
            <ProductPage rating="5.0" stars={5} reviews="12 reviews" w={430}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: down > 0.05 ? C.redSoft : C.greenSoft, borderRadius: 14, padding: "10px 14px" }}>
                <div style={{ fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 24, color: LINE }}>Is hafte ki sale</div>
                <svg width={120} height={44} viewBox="0 0 120 44">
                  <path d={`M4 ${10 + down * 4} L40 ${12 + down * 10} L76 ${8 + down * 22} L116 ${6 + down * 34}`} fill="none" stroke={down > 0.05 ? C.red : C.green} strokeWidth={6} strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </ProductPage>
          </div>
          <div style={{ position: "absolute", left: 60, top: 300, zIndex: 3 }}>
            <Stamp at={five - 2} text="PROBLEM?" size={70} rotate={-12} />
          </div>
        </Place>
        <HookTitle
          top={276}
          lines={[
            { text: "Perfect 5-star rating,", at: 0, size: 62 },
            { text: "★★★★★ 5.0", at: 3, kind: "green", size: 104 },
            { text: "phir bhi KAM SALE?", at: 24, kind: "red", size: 78, rot: 2 },
          ]}
        />
      </Camera>
      <Sfx at={0} name="whoosh" vol={0.45} />
      <Sfx at={2} name="ding" vol={0.4} />
      <Sfx at={22} name="stamp" vol={0.6} />
      <Sfx at={five - 3} name="stamp" vol={0.7} />
      <Sfx at={problem} name="error" vol={0.3} />
    </SceneShell>
  );
};

/* ===== S2: the research curve ===== */
const CX = (r: number) => 70 + ((r - 1) / 4) * 760;
const CY = (v: number) => 470 - v * 400;
const CURVE: [number, number][] = [
  [1, 0.08],
  [2, 0.18],
  [3, 0.42],
  [3.5, 0.6],
  [4.0, 0.84],
  [4.35, 0.94],
  [4.7, 0.86],
  [5.0, 0.58],
];
const curvePath = (pts: [number, number][]) => {
  let d = `M${CX(pts[0][0])} ${CY(pts[0][1])}`;
  for (let i = 1; i < pts.length; i++) {
    const [x0, y0] = [CX(pts[i - 1][0]), CY(pts[i - 1][1])];
    const [x1, y1] = [CX(pts[i][0]), CY(pts[i][1])];
    const mx = (x0 + x1) / 2;
    d += ` C${mx} ${y0} ${mx} ${y1} ${x1} ${y1}`;
  }
  return d;
};

export const S2Research: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const uni = cue("s2", "northwestern");
  const band = cue("s2", "4.0–4.7");
  const five = cue("s2", "5");
  const girne = cue("s2", "girne");
  const draw = interpolate(frame, [uni + 20, band + 30], [0, 1], { ...clamp, easing: theme.ease.inOut });
  const bandP = useSpring(band - 2, "smooth");
  const dip = interpolate(frame, [five - 4, girne + 10], [0, 1], { ...clamp, easing: theme.ease.inOut });
  const main = curvePath(CURVE.slice(0, 7));
  const tail = curvePath(CURVE.slice(6));
  return (
    <SceneShell dur={dur} noExit>
      <Camera dur={dur} punches={[girne]} push={0.02}>
        <Stage />
        <Enter delay={uni - 4} from="down" style={{ position: "absolute", left: 0, right: 0, top: 292, display: "flex", justifyContent: "center", zIndex: 4 }}>
          <Chip size={24} bg={C.white} color={LINE} border={LINE}>
            NORTHWESTERN UNIVERSITY · SPIEGEL RESEARCH
          </Chip>
        </Enter>
        <Enter delay={uni + 6} style={{ position: "absolute", left: 60, top: 370 }}>
          <Card style={{ width: 960, height: 690, border: `6px solid ${LINE}`, boxShadow: `8px 8px 0 ${LINE}`, position: "relative" }}>
            <div style={{ position: "absolute", left: 40, top: 24, fontFamily: theme.fonts.display, fontWeight: 700, fontSize: 40, color: LINE }}>Khareedne ka chance</div>
            <svg width={900} height={560} viewBox="0 0 900 560" style={{ position: "absolute", left: 30, top: 90, overflow: "visible" }}>
              <rect x={CX(4.0)} y={40} width={(CX(4.7) - CX(4.0)) * bandP} height={430} rx={14} fill={C.greenSoft} stroke={C.green} strokeWidth={4} strokeDasharray="10 8" opacity={bandP} />
              <line x1={CX(1)} y1={470} x2={CX(5)} y2={470} stroke={LINE} strokeWidth={5} />
              {[1, 2, 3, 4, 5].map((r) => (
                <g key={r}>
                  <line x1={CX(r)} y1={470} x2={CX(r)} y2={484} stroke={LINE} strokeWidth={4} />
                  <text x={CX(r)} y={520} textAnchor="middle" fontFamily="Poppins" fontWeight="700" fontSize="30" fill={LINE}>
                    {r}★
                  </text>
                </g>
              ))}
              <path d={main} fill="none" stroke={C.violet} strokeWidth={12} strokeLinecap="round" strokeDasharray={1400} strokeDashoffset={1400 * (1 - draw)} />
              <path d={tail} fill="none" stroke={C.red} strokeWidth={12} strokeLinecap="round" strokeDasharray={300} strokeDashoffset={300 * (1 - dip)} />
              {dip > 0.95 && <path d={`M${CX(5) - 26} ${CY(0.58) - 4} L${CX(5)} ${CY(0.58) + 22} L${CX(5) + 22} ${CY(0.58) - 10}`} fill="none" stroke={C.red} strokeWidth={10} strokeLinecap="round" strokeLinejoin="round" />}
            </svg>
            <div style={{ position: "absolute", left: CX(4.0) + 30, top: 70, width: CX(4.7) - CX(4.0), textAlign: "center", opacity: bandP, transform: `scale(${0.8 + 0.2 * bandP})` }}>
              <div style={{ display: "inline-block", background: C.green, color: C.white, fontFamily: theme.fonts.display, fontWeight: 700, fontSize: 34, borderRadius: 12, padding: "6px 12px 0", whiteSpace: "nowrap" }}>4.0–4.7</div>
            </div>
            <div style={{ position: "absolute", right: 40, bottom: 22, fontFamily: theme.fonts.body, fontWeight: 600, fontSize: 20, color: C.muted }}>Andaza graph · Spiegel Research Center, 2017</div>
          </Card>
        </Enter>
        <Burst at={girne} text="5.0 pe giravat" color={C.red} size={44} rot={4} style={{ left: 600, top: 1090, zIndex: 8 }} />
        <Place x={-20} y={1100} s={0.6} z={7}>
          <Person
            look={ROHIT}
            seed="r52"
            track={[
              { at: -100, pose: "idle", mood: "neutral" },
              { at: girne - 2, pose: "shrug", mood: "shock" },
            ]}
          />
        </Place>
      </Camera>
      <Sfx at={uni - 4} name="whoosh" vol={0.4} />
      <Sfx at={uni + 20} name="riser" vol={0.25} />
      <Sfx at={band - 2} name="ding" vol={0.4} />
      <Sfx at={girne - 2} name="bass" vol={0.6} />
    </SceneShell>
  );
};

/* ===== S3: why — "itna perfect? fake toh nahi?" ===== */
export const S3Why: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const perfect = cue("s3", "perfect");
  const fake = cue("s3", "fake");
  const pick = fake + 22;
  const bubble = spring({ frame: frame - (perfect - 6), fps, config: theme.spring.bouncy });
  const chose = useSpring(pick, "bouncy");
  return (
    <SceneShell dur={dur} noExit>
      <Camera dur={dur} punches={[fake]} push={0.025}>
        <MoneyRoom />
        <Place x={40} y={620} s={0.95} z={4}>
          <Person
            look={PRIYA}
            seed="p53"
            track={[
              { at: -100, pose: "idle", mood: "neutral" },
              { at: perfect, pose: "shrug", mood: "neutral" },
              { at: fake, pose: "shrug", mood: "shock" },
              { at: pick, pose: "cheer", mood: "happy" },
            ]}
          />
        </Place>
        <NameTag at={2} name="PRIYA" role="CUSTOMER" color="#178A7C" style={{ left: 50, top: 1240, zIndex: 9 }} />
        {frame >= perfect - 7 && (
          <div style={{ position: "absolute", left: 40, top: 300, transform: `scale(${bubble})`, transformOrigin: "30% 100%", zIndex: 8 }}>
            <div style={{ background: C.white, border: `6px solid ${LINE}`, borderRadius: 60, padding: "26px 36px 16px", boxShadow: `6px 6px 0 ${LINE}`, fontFamily: theme.fonts.display, fontWeight: 700, fontSize: 52, lineHeight: 1.15, color: LINE }}>
              Itna perfect?
              <br />
              <span style={{ color: frame >= fake - 2 ? C.red : C.muted }}>Fake toh nahi?</span>
            </div>
            <div style={{ position: "absolute", left: 110, bottom: -40, width: 34, height: 34, borderRadius: "50%", background: C.white, border: `5px solid ${LINE}` }} />
            <div style={{ position: "absolute", left: 150, bottom: -78, width: 22, height: 22, borderRadius: "50%", background: C.white, border: `5px solid ${LINE}` }} />
          </div>
        )}
        <Enter delay={4} from="right" style={{ position: "absolute", left: 520, top: 560, zIndex: 5 }}>
          <div style={{ position: "relative", opacity: chose > 0.5 ? 0.55 : 1 }}>
            <ProductPage rating="5.0" stars={5} reviews="12" w={500}>
              <div style={{ fontFamily: theme.fonts.body, fontWeight: 700, fontSize: 24, color: C.muted }}>"Best!!" · "Best!!" · "Best!!"</div>
            </ProductPage>
            <div style={{ position: "absolute", right: -10, top: 30 }}>
              <Stamp at={fake - 1} text="FAKE?" size={60} rotate={10} />
            </div>
          </div>
        </Enter>
        <Enter delay={pick - 8} from="down" style={{ position: "absolute", left: 470, top: 1095, zIndex: 6 }}>
          <div style={{ position: "relative", transform: `scale(${0.9 + 0.1 * chose})`, transformOrigin: "50% 50%" }}>
            <div style={{ background: C.white, border: `6px solid ${C.green}`, borderRadius: 26, boxShadow: `8px 8px 0 ${LINE}`, padding: "16px 22px", width: 560, boxSizing: "border-box", display: "flex", flexDirection: "column", gap: 8 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <MiniStars n={4} size={36} />
                <div style={{ fontFamily: theme.fonts.display, fontWeight: 700, fontSize: 40, color: LINE }}>4.6</div>
                <div style={{ fontFamily: theme.fonts.body, fontWeight: 700, fontSize: 26, color: C.muted }}>(230 reviews)</div>
              </div>
              <div style={{ fontFamily: theme.fonts.body, fontWeight: 700, fontSize: 24, color: LINE }}>★★★ "Delivery late, par product badhiya"</div>
            </div>
            <div style={{ position: "absolute", right: -18, top: -26, background: C.green, color: C.white, border: `5px solid ${LINE}`, borderRadius: 999, fontFamily: theme.fonts.display, fontWeight: 700, fontSize: 30, padding: "8px 18px 2px", transform: `scale(${chose})` }}>Isse lenge</div>
          </div>
        </Enter>
      </Camera>
      <Sfx at={perfect - 6} name="pop" vol={0.45} />
      <Sfx at={fake - 2} name="stamp" vol={0.6} />
      <Sfx at={pick} name="check" vol={0.5} />
    </SceneShell>
  );
};

/* ===== S4: 0 reviews vs 5 reviews = +270% ===== */
export const S4Count: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const reviews = cue("s4", "reviews");
  const zero = cue("s4", "zero");
  const pct = cue("s4", "270%");
  const count = Math.round(270 * interpolate(frame, [pct - 4, pct + 22], [0, 1], { ...clamp, easing: theme.ease.out }));
  const big = useSpring(pct - 6, "bouncy");
  const quotes = ["Badhiya!", "Glow aaya", "2nd order", "Paisa vasool", "Smell achhi"];
  return (
    <SceneShell dur={dur} noExit>
      <Camera dur={dur} punches={[pct]} push={0.02}>
        <Stage />
        <div style={{ position: "absolute", left: 0, right: 0, top: 296, display: "flex", justifyContent: "center", gap: 18 }}>
          <Chip size={28} bg={C.white} color={LINE} border={LINE}>
            0 REVIEWS
          </Chip>
          <Chip size={28} bg={C.navy}>
            vs
          </Chip>
          <Chip size={28} bg={C.green} border={LINE}>
            5 REVIEWS
          </Chip>
        </div>
        {/* left: no reviews */}
        <Enter delay={zero - 6} from="left" style={{ position: "absolute", left: 80, top: 580, width: 380, display: "flex", flexDirection: "column", alignItems: "center", gap: 12, zIndex: 3 }}>
          <div style={{ filter: "grayscale(0.85)", opacity: 0.85 }}>
            <Bottle level={0.9} w={128} />
          </div>
          <div style={{ fontFamily: theme.fonts.display, fontWeight: 700, fontSize: 40, color: C.lavender }}>0 reviews</div>
          <MiniStars n={0} size={44} />
        </Enter>
        {/* right: 5 reviews with quotes popping */}
        <Enter delay={2} from="right" style={{ position: "absolute", left: 600, top: 580, width: 400, display: "flex", flexDirection: "column", alignItems: "center", gap: 12, zIndex: 3 }}>
          <Bottle level={0.9} w={128} color="#F5A25D" />
          <div style={{ fontFamily: theme.fonts.display, fontWeight: 700, fontSize: 40, color: C.white }}>5 reviews</div>
          <MiniStars n={5} size={44} />
        </Enter>
        {quotes.map((q, i) => {
          const at = reviews - 4 + i * 5;
          const p = spring({ frame: frame - at, fps: 30, config: theme.spring.bouncy });
          if (frame < at - 1) return null;
          const pos: [number, number][] = [
            [575, 380],
            [815, 392],
            [600, 450],
            [835, 465],
            [705, 520],
          ];
          return (
            <div key={i} style={{ position: "absolute", left: pos[i][0], top: pos[i][1], transform: `scale(${p}) rotate(${(i % 2 ? 4 : -4)}deg)`, background: C.white, border: `4px solid ${LINE}`, borderRadius: 18, padding: "6px 14px 4px", fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 26, color: LINE, whiteSpace: "nowrap", zIndex: 5 }}>
              <span style={{ color: "#F5B400" }}>★</span> {q}
            </div>
          );
        })}
        {frame >= pct - 8 && (
          <div style={{ position: "absolute", left: 0, right: 0, top: 985, display: "flex", flexDirection: "column", alignItems: "center", gap: 4, transform: `scale(${big})`, zIndex: 6 }}>
            <div style={{ fontFamily: theme.fonts.display, fontWeight: 700, fontSize: 150, lineHeight: 1, color: "#7CF0A8", WebkitTextStroke: `8px ${LINE}`, paintOrder: "stroke", fontVariantNumeric: "tabular-nums" }}>+{count}%</div>
            <div style={{ fontFamily: theme.fonts.display, fontWeight: 700, fontSize: 38, color: C.white }}>khareedne ka chance</div>
            <div style={{ fontFamily: theme.fonts.body, fontWeight: 600, fontSize: 20, color: C.lavender }}>Spiegel Research Center, Northwestern University</div>
          </div>
        )}
        <Confetti at={pct + 16} x={540} y={1040} n={28} />
      </Camera>
      <Sfx at={2} name="whoosh" vol={0.4} />
      {quotes.map((_, i) => (
        <Sfx key={i} at={reviews - 4 + i * 5} name="pop" vol={0.3} />
      ))}
      <Sfx at={pct - 4} name="riser" vol={0.3} />
      {[0, 1, 2, 3, 4].map((i) => (
        <Sfx key={`t${i}`} at={pct + i * 4} name="tick" vol={0.3} />
      ))}
      <Sfx at={pct + 16} name="ding" vol={0.5} />
    </SceneShell>
  );
};

/* ===== S5: Doctor's 3 fixes ===== */
export const S5Fixes: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const teen = cue("s5", "teen");
  const three = cue("s5", "3-star");
  const jawab = cue("s5", "jawab");
  const har = cue("s5", "har");
  const five = cue("s5", "5");
  const deliv = cue("s5", "delivery");
  const photo = cue("s5", "photo");
  const marks = [three, har, deliv];
  const step = frame >= deliv - 4 ? 3 : frame >= har - 4 ? 2 : frame >= three - 4 ? 1 : 0;
  const vis = (s: number) => {
    const ins = marks[s - 1] - 4;
    const outs = s < 3 ? marks[s] - 6 : 1e9;
    return Math.min(interpolate(frame, [ins, ins + 10], [0, 1], clamp), interpolate(frame, [outs, outs + 8], [1, 0], clamp));
  };
  const intro = interpolate(frame, [three - 8, three - 2], [1, 0], clamp);
  const reviewsN = Math.min(5, Math.max(0, Math.floor(interpolate(frame, [five - 6, five + 24], [0, 5.99], clamp))));
  const poses: PoseKey[] = [
    { at: -100, pose: "explain" },
    { at: three - 4, pose: "one" },
    { at: har - 4, pose: "two" },
    { at: deliv - 4, pose: "three" },
  ];
  const title = (t: React.ReactNode) => <div style={{ fontFamily: theme.fonts.display, fontWeight: 700, fontSize: 46, lineHeight: 1.12, color: LINE, textAlign: "center", whiteSpace: "nowrap" }}>{t}</div>;
  return (
    <SceneShell dur={dur} noExit>
      <Camera dur={dur} push={0.02}>
        <Clinic />
        <Whiteboard style={{ left: 250, top: 300, width: 780, height: 700 }}>
          <div style={{ position: "absolute", left: 30, top: 24, display: "flex", gap: 12, alignItems: "center" }}>
            <Chip size={26} bg={C.green}>
              ILAAJ
            </Chip>
            {[1, 2, 3].map((n) => (
              <div key={n} style={{ width: 44, height: 44, borderRadius: "50%", background: step >= n ? C.violet : C.lavenderSoft, color: step >= n ? C.white : C.violetDeep, fontFamily: theme.fonts.display, fontWeight: 700, fontSize: 26, display: "flex", alignItems: "center", justifyContent: "center", paddingTop: 3, boxSizing: "border-box" }}>
                {n}
              </div>
            ))}
          </div>
          <div style={{ position: "absolute", inset: "110px 30px 30px", opacity: intro, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Enter delay={teen - 4} from="none" scaleFrom={0.4} cfg="bouncy">
              <div style={{ fontFamily: theme.fonts.display, fontWeight: 700, fontSize: 130, color: C.violet, whiteSpace: "nowrap" }}>3 kaam</div>
            </Enter>
          </div>
          {/* 1: reply to 3-star reviews */}
          <div style={{ position: "absolute", inset: "100px 30px 20px", opacity: vis(1), display: "flex", flexDirection: "column", alignItems: "center", gap: 20 }}>
            {title(<>3-star review mat chhupao,<br /><span style={{ color: C.violet }}>achha jawab do</span></>)}
            <div style={{ width: 640, background: C.lavenderSoft, borderRadius: 22, padding: "18px 22px", boxSizing: "border-box", display: "flex", flexDirection: "column", gap: 8 }}>
              <MiniStars n={3} size={34} />
              <div style={{ fontFamily: theme.fonts.body, fontWeight: 700, fontSize: 28, color: LINE }}>"Delivery 2 din late thi."</div>
            </div>
            <div style={{ width: 600, alignSelf: "flex-end", marginRight: 20, background: C.white, border: `4px solid ${C.violet}`, borderRadius: "22px 22px 6px 22px", padding: "16px 20px", boxSizing: "border-box", fontFamily: theme.fonts.body, fontWeight: 700, fontSize: 26, lineHeight: 1.25, color: LINE, opacity: interpolate(frame, [jawab - 4, jawab + 4], [0, 1], clamp), transform: `translateY(${interpolate(frame, [jawab - 4, jawab + 6], [20, 0], clamp)}px)` }}>
              <span style={{ color: C.violet }}>Brand:</span> Sorry Priya ji! Agli baar 1 din pehle bhejenge. Shukriya feedback ke liye.
            </div>
          </div>
          {/* 2: first 5 reviews */}
          <div style={{ position: "absolute", inset: "100px 30px 20px", opacity: vis(2), display: "flex", flexDirection: "column", alignItems: "center", gap: 18 }}>
            {title(<>Har product pe<br /><span style={{ color: C.violet }}>pehle 5 reviews</span></>)}
            <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
              {[0, 1, 2].map((i) => (
                <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, background: C.lavenderSoft, borderRadius: 20, padding: "14px 16px" }}>
                  <Bottle level={0.85} w={90} color={["#F5A25D", "#8FD3B6", "#C9A6F5"][i]} label={["SERUM", "TONER", "CREAM"][i]} />
                  <div style={{ fontFamily: theme.fonts.display, fontWeight: 700, fontSize: 30, color: reviewsN >= 5 ? C.green : LINE, fontVariantNumeric: "tabular-nums" }}>{reviewsN}/5</div>
                </div>
              ))}
            </div>
          </div>
          {/* 3: WhatsApp on day 4 */}
          <div style={{ position: "absolute", inset: "96px 30px 20px", opacity: vis(3), display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
            {title(<>Delivery ke 4 din baad,<br /><span style={{ color: C.violet }}>WhatsApp pe maango</span></>)}
            <div style={{ display: "flex", gap: 22, alignItems: "flex-start" }}>
              <Calendar month={4} since={frame - deliv} label="DIN" w={150} />
              <Phone w={330} h={400} title="Glow Store">
                <Bubble at={deliv + 10} size={25}>
                  Priya ji, serum kaisa laga? Ek photo ke saath review dengi?
                </Bubble>
                {frame >= photo && (
                  <Bubble at={photo} me size={25}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <div style={{ width: 54, height: 54, borderRadius: 10, background: C.lavenderSoft, display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <Bottle level={0.5} w={26} />
                      </div>
                      ★★★★★
                    </div>
                  </Bubble>
                )}
              </Phone>
            </div>
            <div style={{ fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 22, color: C.red, letterSpacing: "0.04em" }}>FAKE REVIEW? KABHI NAHI.</div>
          </div>
        </Whiteboard>
        <Place x={-120} y={930} s={0.92} z={4}>
          <Doctor poses={poses} mouth={sceneMouth("s5")} brows={[teen, three, har, deliv]} caseTag={TAG} />
        </Place>
      </Camera>
      <Sfx at={1} name="whoosh" vol={0.4} />
      <Sfx at={teen - 2} name="pop" vol={0.5} />
      {marks.map((a, i) => (
        <Sfx key={i} at={a - 5} name="swish" vol={0.4} />
      ))}
      <Sfx at={jawab - 4} name="pop" vol={0.4} />
      {[0, 1, 2, 3, 4].map((i) => (
        <Sfx key={`r${i}`} at={five - 6 + i * 6} name="tick" vol={0.3} />
      ))}
      <Sfx at={deliv + 10} name="pop" vol={0.4} />
      <Sfx at={photo} name="ding" vol={0.4} />
    </SceneShell>
  );
};

/* ===== S6: CTA ===== */
const ChatIcon: React.FC = () => (
  <svg width={92} height={92} viewBox="0 0 92 92">
    <path d="M46 6 C24 6 6 22 6 42 C6 52 10 61 17 67 L12 86 L32 76 C36 77 41 78 46 78 C68 78 86 62 86 42 C86 22 68 6 46 6 Z" fill="#25C26A" stroke={LINE} strokeWidth={5} strokeLinejoin="round" />
    <path d="M30 40 L42 30 L46 40 L58 30" fill="none" stroke={C.white} strokeWidth={0} />
    <text x={46} y={54} textAnchor="middle" fontFamily="Poppins" fontWeight="700" fontSize="30" fill={C.white}>
      ★
    </text>
  </svg>
);

export const S6Cta: React.FC<{ dur: number }> = ({ dur }) => {
  const review = cue("s6", "review");
  const messages = cue("s6", "messages");
  const kal = cue("s6", "kal");
  const three = cue("s6", "3");
  const follow = cue("s6", "follow");
  const poses: PoseKey[] = [
    { at: -100, pose: "point" },
    { at: kal - 2, pose: "explain" },
    { at: follow - 4, pose: "thumbs" },
  ];
  return (
    <SceneShell dur={dur} noExit>
      <Camera dur={dur} punches={[review + 4]} push={0.02}>
        <Clinic plus={false} />
        <CtaFlow
          keyword="REVIEW"
          typeAt={review - 10}
          giftAt={messages - 14}
          giftTitle="Review Request Messages"
          giftSub="free · WhatsApp pe copy-paste"
          giftIcon={<ChatIcon />}
          nextAt={kal}
          nextNum=""
          next={
            <>
              <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
                <div style={{ fontFamily: theme.fonts.display, fontWeight: 700, fontSize: 70, color: LINE }}>₹50,000</div>
                <div style={{ fontFamily: theme.fonts.display, fontWeight: 700, fontSize: 60, color: C.violet }}>→</div>
                <Enter delay={three - 4} from="none" scaleFrom={0.3} cfg="bouncy">
                  <div style={{ fontFamily: theme.fonts.display, fontWeight: 700, fontSize: 70, color: C.red }}>3 order</div>
                </Enter>
              </div>
              <div style={{ fontFamily: theme.fonts.display, fontWeight: 700, fontSize: 52, lineHeight: 1.12, color: LINE, textAlign: "center" }}>
                Influencer ko ₹50,000 diye,
                <br />
                aaye sirf <span style={{ color: C.red }}>3 order</span>?
              </div>
            </>
          }
          followAt={follow}
        />
        <Place x={250} y={1010} s={0.96} z={4}>
          <Doctor poses={poses} mouth={sceneMouth("s6")} brows={[review, kal]} caseTag={TAG} />
        </Place>
      </Camera>
      {Array.from({ length: 6 }).map((_, i) => (
        <Sfx key={i} at={review - 10 + i * 2} name="key" vol={0.4} />
      ))}
      <Sfx at={messages - 18} name="pop" vol={0.5} />
      <Sfx at={kal - 4} name="whoosh" vol={0.45} />
      <Sfx at={three - 2} name="error" vol={0.3} />
      <Sfx at={follow + 12} name="pop" vol={0.55} />
      <Sfx at={follow + 15} name="ding" vol={0.45} />
    </SceneShell>
  );
};

export { AbsoluteFill, Parcel, QMarks, Stars };
