import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { Burst, Confetti, Note, Person, PRIYA, ROHIT } from "../../components/Cartoon";
import { Doctor, PoseKey, Shout } from "../../components/Doctor";
import { Camera } from "../../components/fx";
import { CtaFlow, HookTitle, LINE, Place, makeMouth } from "../../components/format";
import { Card, Chip, Enter, SceneShell, Sfx, clamp, inr, useSpring } from "../../components/kit";
import { Bottle, FlyTag, NameTag, Phone } from "../../components/props";
import { Clinic, Desk, MoneyRoom, OfficeWall, Stage, Whiteboard } from "../../components/sets";
import { Stamp } from "../../components/widgets";
import { C, theme } from "../../theme";
import { T, cue } from "./timeline";

const sceneMouth = makeMouth(T);
const TAG = "CASE #07";
const big = (size: number, color: string = LINE): React.CSSProperties => ({ fontFamily: theme.fonts.display, fontWeight: 700, fontSize: size, lineHeight: 1.05, color, whiteSpace: "nowrap" });

/** Creator profile card (invented creator). */
const CreatorCard: React.FC<{ w?: number; paid?: boolean }> = ({ w = 440, paid }) => (
  <div style={{ width: w, background: C.white, border: `6px solid ${LINE}`, borderRadius: 30, boxShadow: `8px 8px 0 ${LINE}`, padding: 22, boxSizing: "border-box", display: "flex", flexDirection: "column", gap: 12 }}>
    <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
      <div style={{ width: 86, height: 86, borderRadius: "50%", background: "linear-gradient(135deg,#F5B400,#E5484D,#6D4AFD)", padding: 6, boxSizing: "border-box" }}>
        <div style={{ width: "100%", height: "100%", borderRadius: "50%", background: C.lavenderSoft, border: `4px solid ${C.white}`, display: "flex", alignItems: "center", justifyContent: "center", ...big(34, C.violet) }}>★</div>
      </div>
      <div>
        <div style={big(34)}>@style.creator</div>
        <div style={{ fontFamily: theme.fonts.body, fontWeight: 700, fontSize: 24, color: C.muted }}>3.2 lakh followers</div>
      </div>
    </div>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: C.lavenderSoft, borderRadius: 16, padding: "12px 16px" }}>
      <div style={{ fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 26, color: LINE }}>Collab fee</div>
      <div style={big(40, paid ? C.red : LINE)}>₹50,000</div>
    </div>
  </div>
);

/* ===== S1: ₹50,000 to an influencer, 3 orders ===== */
export const S1Hook: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const fee = cue("s1", "₹50,000");
  const three = cue("s1", "3");
  const per = cue("s1", "₹16,667");
  const orders = Math.round(interpolate(frame, [three - 10, three + 4], [0, 3], clamp));
  const perP = useSpring(per - 2, "bouncy");
  return (
    <SceneShell dur={dur} noExit>
      <Camera dur={dur} punches={[3, three, per]} push={0.03}>
        <OfficeWall />
        <Place x={0} y={660} s={1.0} z={4}>
          <Person
            look={ROHIT}
            seed="r71"
            track={[
              { at: -100, pose: "cheer", mood: "grin" },
              { at: three - 2, pose: "shrug", mood: "shock" },
              { at: per + 6, pose: "sad", mood: "sad" },
            ]}
          />
        </Place>
        <div style={{ position: "absolute", inset: 0, zIndex: 5 }}>
          <Desk burn={false} />
        </div>
        <Place x={540} y={640} z={6}>
          <div style={{ transform: "rotate(2deg)" }}>
            <CreatorCard w={470} paid={frame >= fee} />
          </div>
          <div style={{ position: "absolute", right: -10, top: -30 }}>
            <Stamp at={fee + 4} text="PAID" size={54} rotate={12} color={C.green} />
          </div>
          <Card style={{ marginTop: 26, width: 470, padding: "16px 22px", border: `6px solid ${LINE}`, boxShadow: `8px 8px 0 ${LINE}`, display: "flex", alignItems: "center", justifyContent: "space-between", boxSizing: "border-box" }}>
            <div style={{ fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 30, color: LINE }}>Orders aaye</div>
            <div style={{ ...big(84, frame >= three ? C.red : LINE), fontVariantNumeric: "tabular-nums" }}>{orders}</div>
          </Card>
        </Place>
        {[0, 1, 2, 3, 4].map((i) => (
          <FlyTag key={i} at={fee - 6 + i * 3} len={20} from={[330, 960]} to={[760, 760]} arc={120}>
            <Note w={110} rot={-10 + i * 6} />
          </FlyTag>
        ))}
        {frame >= per - 4 && (
          <div style={{ position: "absolute", left: 530, top: 1120, transform: `scale(${perP}) rotate(-4deg)`, zIndex: 9, background: C.red, color: C.white, border: `6px solid ${LINE}`, borderRadius: 22, boxShadow: `6px 6px 0 ${LINE}`, padding: "14px 22px 4px", textAlign: "center" }}>
            <div style={big(64, C.white)}>₹16,667</div>
            <div style={{ fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 26, letterSpacing: "0.08em" }}>PER ORDER!</div>
          </div>
        )}
        <HookTitle
          top={276}
          lines={[
            { text: "Influencer ko ₹50,000 diye,", at: 0, size: 60 },
            { text: "aaye sirf 3 ORDER?", at: 14, kind: "red", size: 92 },
          ]}
        />
      </Camera>
      <Sfx at={0} name="whoosh" vol={0.45} />
      <Sfx at={14} name="stamp" vol={0.6} />
      <Sfx at={fee - 4} name="swish" vol={0.4} />
      <Sfx at={fee + 4} name="stamp" vol={0.5} />
      {[0, 1, 2].map((i) => (
        <Sfx key={i} at={three - 10 + i * 5} name="tick" vol={0.35} />
      ))}
      <Sfx at={per - 2} name="error" vol={0.35} />
    </SceneShell>
  );
};

/* ===== S2: not the creator's fault, the math's ===== */
export const S2Fault: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const galti = cue("s2", "galti");
  const nahi = cue("s2", "nahi");
  const hisaab = cue("s2", "hisaab");
  const strike = interpolate(frame, [nahi - 4, nahi + 6], [0, 1], clamp);
  const ring = useSpring(hisaab - 2, "bouncy");
  const poses: PoseKey[] = [
    { at: -100, pose: "stop" },
    { at: hisaab - 4, pose: "point" },
  ];
  return (
    <SceneShell dur={dur} noExit>
      <Camera dur={dur} punches={[hisaab]} push={0.02}>
        <Clinic />
        <Whiteboard style={{ left: 250, top: 300, width: 780, height: 640 }}>
          <div style={{ position: "absolute", left: 0, right: 0, top: 40, textAlign: "center", ...big(64) }}>Galti kiski?</div>
          <Enter delay={galti} from="left" style={{ position: "absolute", left: 90, top: 190 }}>
            <div style={{ position: "relative", ...big(76, C.muted) }}>
              Influencer
              <div style={{ position: "absolute", left: -10, top: "48%", height: 12, width: `${strike * 105}%`, background: C.red, borderRadius: 6, transform: "rotate(-4deg)" }} />
            </div>
          </Enter>
          <Enter delay={hisaab - 6} from="right" style={{ position: "absolute", left: 160, top: 360 }}>
            <div style={{ position: "relative", padding: "10px 40px 0" }}>
              <div style={big(110, C.violet)}>HISAAB</div>
              <svg width={520} height={190} viewBox="0 0 520 190" style={{ position: "absolute", left: -10, top: -20, overflow: "visible" }}>
                <ellipse cx={260} cy={95} rx={250} ry={85} fill="none" stroke={C.red} strokeWidth={9} strokeDasharray={1100} strokeDashoffset={1100 * (1 - ring)} transform="rotate(-3 260 95)" />
              </svg>
            </div>
          </Enter>
        </Whiteboard>
        <Place x={-120} y={930} s={0.92} z={4}>
          <Doctor poses={poses} mouth={sceneMouth("s2")} brows={[galti, hisaab]} caseTag={TAG} />
        </Place>
        <NameTag at={4} name="D2C DOCTOR" role="FIX BATAYEGA" style={{ left: 560, top: 1110, zIndex: 9 }} />
      </Camera>
      <Sfx at={1} name="whoosh" vol={0.45} />
      <Sfx at={nahi - 2} name="swish" vol={0.4} />
      <Sfx at={hisaab - 2} name="ding" vol={0.45} />
    </SceneShell>
  );
};

/* ===== S3: ₹999 product, ₹450 left = max per order ===== */
export const S3Math: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const price = cue("s3", "₹999");
  const kharche = cue("s3", "kharche");
  const left = cue("s3", "₹450");
  const split = interpolate(frame, [kharche - 4, kharche + 14], [0, 1], { ...clamp, easing: theme.ease.out });
  const leftP = useSpring(left - 2, "bouncy");
  const W = 860;
  const cost = Math.round((549 / 999) * W);
  return (
    <SceneShell dur={dur} noExit>
      <Camera dur={dur} punches={[left]} push={0.02}>
        <MoneyRoom />
        <Enter delay={2} from="down" style={{ position: "absolute", left: 0, right: 0, top: 292, display: "flex", justifyContent: "center", zIndex: 4 }}>
          <Chip size={26} bg={C.white} color={LINE} border={LINE}>
            MAAN LO · EXAMPLE
          </Chip>
        </Enter>
        <Enter delay={price - 6} style={{ position: "absolute", left: 0, right: 0, top: 380, display: "flex", justifyContent: "center", alignItems: "center", gap: 30 }}>
          <div style={{ background: C.lavenderSoft, border: `6px solid ${LINE}`, borderRadius: 28, padding: "18px 30px" }}>
            <Bottle level={0.85} w={110} color="#F5A25D" label="SERUM" />
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <div style={{ fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 30, color: C.muted, letterSpacing: "0.06em" }}>PRODUCT PRICE</div>
            <div style={big(120)}>₹999</div>
          </div>
        </Enter>
        {/* price bar that splits into costs + what's left */}
        <div style={{ position: "absolute", left: 110, top: 720, width: W, zIndex: 4, opacity: interpolate(frame, [price, price + 8], [0, 1], clamp) }}>
          <div style={{ position: "relative", height: 130, display: "flex", border: `6px solid ${LINE}`, borderRadius: 26, overflow: "hidden", boxShadow: `8px 8px 0 ${LINE}`, background: C.violet }}>
            <div style={{ width: cost * split + (1 - split) * W, background: split > 0.02 ? "#B9B3CC" : C.violet, display: "flex", alignItems: "center", justifyContent: "center", ...big(40, LINE) }}>
              {split > 0.6 && "Kharche ₹549"}
            </div>
            <div style={{ flex: 1, background: C.green, display: "flex", alignItems: "center", justifyContent: "center", borderLeft: split > 0.02 ? `6px solid ${LINE}` : undefined, ...big(46, C.white) }}>
              {split > 0.9 && "₹450"}
            </div>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 14, fontFamily: theme.fonts.body, fontWeight: 700, fontSize: 24, color: C.muted, opacity: split }}>
            <span>maal + packing + shipping + returns</span>
            <span style={{ color: C.green }}>bacha</span>
          </div>
        </div>
        {frame >= left - 4 && (
          <div style={{ position: "absolute", left: 0, right: 0, top: 960, display: "flex", justifyContent: "center", zIndex: 6 }}>
            <div style={{ transform: `scale(${leftP}) rotate(-2deg)`, background: C.white, border: `6px solid ${C.green}`, borderRadius: 26, boxShadow: `8px 8px 0 ${LINE}`, padding: "18px 30px 10px", textAlign: "center" }}>
              <div style={{ fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 28, color: LINE, letterSpacing: "0.06em" }}>EK ORDER PE MAX KHARCHA</div>
              <div style={big(96, C.green)}>₹450</div>
            </div>
          </div>
        )}
        <Place x={700} y={1150} s={0.55} z={7}>
          <Person
            look={ROHIT}
            seed="r73"
            flip
            track={[
              { at: -100, pose: "idle", mood: "neutral" },
              { at: left, pose: "hold", mood: "happy" },
            ]}
          />
        </Place>
      </Camera>
      <Sfx at={2} name="whoosh" vol={0.4} />
      <Sfx at={price - 4} name="pop" vol={0.45} />
      <Sfx at={kharche - 2} name="swish" vol={0.4} />
      <Sfx at={left - 2} name="ding" vol={0.5} />
    </SceneShell>
  );
};

/* ===== S4: need ~112 orders, got 3 ===== */
export const S4BreakEven: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const need = cue("s4", "112");
  const three = cue("s4", "3");
  const fill = Math.round(interpolate(frame, [4, need + 10], [0, 112], { ...clamp, easing: theme.ease.out }));
  const lit = frame >= three - 6;
  const cols = 14;
  return (
    <SceneShell dur={dur} noExit>
      <Camera dur={dur} punches={[need, three]} push={0.02}>
        <Stage />
        <Enter delay={0} from="down" style={{ position: "absolute", left: 0, right: 0, top: 296, display: "flex", justifyContent: "center", zIndex: 4 }}>
          <Card style={{ padding: "18px 30px 8px", border: `6px solid ${LINE}`, boxShadow: `8px 8px 0 ${LINE}`, display: "flex", alignItems: "center", gap: 18 }}>
            <div style={big(62)}>₹50,000 ÷ ₹450</div>
            <div style={big(62, C.violet)}>=</div>
            <div style={big(62, C.violet)}>~112</div>
          </Card>
        </Enter>
        <div style={{ position: "absolute", left: 85, top: 470, width: 910, display: "grid", gridTemplateColumns: `repeat(${cols}, 1fr)`, gap: 10, zIndex: 4 }}>
          {Array.from({ length: 112 }).map((_, i) => {
            const on = i < fill;
            const green = lit && i < 3;
            return (
              <div
                key={i}
                style={{
                  height: 54,
                  borderRadius: 10,
                  border: `4px solid ${on ? LINE : "rgba(255,255,255,0.2)"}`,
                  background: green ? C.green : on ? (lit ? "rgba(223,200,253,0.35)" : "#D8B98A") : "transparent",
                  transform: green ? `scale(${1.15})` : undefined,
                }}
              />
            );
          })}
        </div>
        <div style={{ position: "absolute", left: 0, right: 0, top: 1000, textAlign: "center", zIndex: 5 }}>
          <div style={{ ...big(44, C.white), opacity: interpolate(frame, [need - 6, need + 4], [0, 1], clamp) }}>
            Fee wapas laane ko chahiye <span style={{ color: "#FFD24D", fontVariantNumeric: "tabular-nums" }}>{fill}</span> orders
          </div>
        </div>
        <div style={{ position: "absolute", left: 360, top: 1090, zIndex: 8 }}>
          <Stamp at={three - 2} text="AAYE SIRF 3" size={72} rotate={-8} />
        </div>
      </Camera>
      <Sfx at={2} name="riser" vol={0.25} />
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <Sfx key={i} at={6 + i * 8} name="tick" vol={0.25} />
      ))}
      <Sfx at={need} name="ding" vol={0.4} />
      <Sfx at={three - 2} name="stamp" vol={0.65} />
    </SceneShell>
  );
};

/* ===== S5: Doctor's 3 fixes ===== */
const Avatar: React.FC<{ size: number; hue: number; on?: boolean }> = ({ size, hue, on = true }) => (
  <div style={{ width: size, height: size, borderRadius: "50%", background: `hsl(${hue} 70% 72%)`, border: `4px solid ${LINE}`, display: "flex", alignItems: "flex-end", justifyContent: "center", overflow: "hidden", opacity: on ? 1 : 0.15 }}>
    <div style={{ width: size * 0.5, height: size * 0.5, borderRadius: "50%", background: "#C98B60", marginBottom: -size * 0.1, border: `3px solid ${LINE}` }} />
  </div>
);

export const S5Fixes: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const teen = cue("s5", "teen");
  const ek = cue("s5", "ek");
  const ten = cue("s5", "10");
  const code = cue("s5", "har");
  const vid = cue("s5", "jo");
  const ad = cue("s5", "apne");
  const marks = [ek, code, vid];
  const step = frame >= vid - 4 ? 3 : frame >= code - 4 ? 2 : frame >= ek - 4 ? 1 : 0;
  const vis = (s: number) => {
    const ins = marks[s - 1] - 4;
    const outs = s < 3 ? marks[s] - 6 : 1e9;
    return Math.min(interpolate(frame, [ins, ins + 10], [0, 1], clamp), interpolate(frame, [outs, outs + 8], [1, 0], clamp));
  };
  const intro = interpolate(frame, [ek - 8, ek - 2], [1, 0], clamp);
  const nSmall = Math.min(10, Math.max(0, Math.floor(interpolate(frame, [ten - 4, ten + 26], [0, 10.99], clamp))));
  const adP = useSpring(ad - 2, "bouncy");
  const poses: PoseKey[] = [
    { at: -100, pose: "explain" },
    { at: ek - 4, pose: "one" },
    { at: code - 4, pose: "two" },
    { at: vid - 4, pose: "three" },
  ];
  const title = (t: React.ReactNode) => <div style={{ fontFamily: theme.fonts.display, fontWeight: 700, fontSize: 46, lineHeight: 1.12, color: LINE, textAlign: "center", whiteSpace: "nowrap" }}>{t}</div>;
  const codes = ["NEHA10", "AMAN10", "RIYA10"];
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
              <div style={big(130, C.violet)}>3 step</div>
            </Enter>
          </div>
          {/* 1: 10 small creators instead of one big */}
          <div style={{ position: "absolute", inset: "100px 30px 20px", opacity: vis(1), display: "flex", flexDirection: "column", alignItems: "center", gap: 22 }}>
            {title(<>1 bada nahi,<br /><span style={{ color: C.violet }}>10 chhote creators</span></>)}
            <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
              <div style={{ position: "relative", display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
                <Avatar size={120} hue={20} />
                <div style={big(32, C.red)}>1 × ₹50,000</div>
                <div style={{ position: "absolute", left: -10, right: -10, top: 54, height: 10, background: C.red, borderRadius: 5, transform: "rotate(-20deg)", opacity: frame >= ten ? 1 : 0 }} />
              </div>
              <div style={big(56, C.violet)}>→</div>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 8 }}>
                  {Array.from({ length: 10 }).map((_, i) => (
                    <Avatar key={i} size={58} hue={(i * 36 + 200) % 360} on={i < nSmall} />
                  ))}
                </div>
                <div style={big(32, C.green)}>10 × ₹5,000</div>
              </div>
            </div>
          </div>
          {/* 2: separate code per creator */}
          <div style={{ position: "absolute", inset: "100px 30px 20px", opacity: vis(2), display: "flex", flexDirection: "column", alignItems: "center", gap: 20 }}>
            {title(<>Har creator ka<br /><span style={{ color: C.violet }}>alag code ya link</span></>)}
            <div style={{ display: "flex", flexDirection: "column", gap: 12, width: 560 }}>
              {codes.map((c, i) => (
                <Enter key={c} delay={code + 4 + i * 6} from="right" dist={60}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: C.lavenderSoft, borderRadius: 18, padding: "10px 18px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                      <Avatar size={52} hue={(i * 90 + 200) % 360} />
                      <div style={{ fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 30, letterSpacing: "0.08em", color: LINE, background: "#FFE27A", border: `3px dashed ${LINE}`, borderRadius: 10, padding: "4px 12px" }}>{c}</div>
                    </div>
                    <div style={big(34, i === 0 ? C.green : LINE)}>{[24, 6, 2][i]} orders</div>
                  </div>
                </Enter>
              ))}
            </div>
          </div>
          {/* 3: reuse the video that worked in your own ads */}
          <div style={{ position: "absolute", inset: "100px 30px 20px", opacity: vis(3), display: "flex", flexDirection: "column", alignItems: "center", gap: 18 }}>
            {title(<>Jo video chala,<br /><span style={{ color: C.violet }}>apne ad mein chalao</span></>)}
            <div style={{ display: "flex", alignItems: "center", gap: 26 }}>
              <div style={{ width: 200, height: 330, borderRadius: 26, background: "linear-gradient(180deg,#BFD8FF,#EADCFF)", border: `6px solid ${LINE}`, display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
                <Bottle level={0.8} w={70} color="#F5A25D" />
                <div style={{ position: "absolute", bottom: 14, left: 14, fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 22, color: LINE }}>▶ 4.1L views</div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 14, alignItems: "flex-start" }}>
                <Enter delay={vid + 10} from="left" dist={40}>
                  <Chip size={26} bg={C.green}>
                    ✓ PERMISSION
                  </Chip>
                </Enter>
                <div style={{ transform: `scale(${adP})`, transformOrigin: "0 50%", background: C.violet, color: C.white, border: `5px solid ${LINE}`, borderRadius: 18, padding: "12px 20px 4px", ...big(44, C.white) }}>
                  Sponsored AD
                </div>
              </div>
            </div>
          </div>
        </Whiteboard>
        <Place x={-120} y={930} s={0.92} z={4}>
          <Doctor poses={poses} mouth={sceneMouth("s5")} brows={[teen, ek, code, vid]} caseTag={TAG} />
        </Place>
      </Camera>
      <Sfx at={1} name="whoosh" vol={0.4} />
      <Sfx at={teen - 2} name="pop" vol={0.5} />
      {marks.map((a, i) => (
        <Sfx key={i} at={a - 5} name="swish" vol={0.4} />
      ))}
      {[0, 1, 2, 3, 4].map((i) => (
        <Sfx key={`a${i}`} at={ten - 4 + i * 6} name="tick" vol={0.25} />
      ))}
      {[0, 1, 2].map((i) => (
        <Sfx key={`c${i}`} at={code + 4 + i * 6} name="pop" vol={0.3} />
      ))}
      <Sfx at={ad - 2} name="ding" vol={0.45} />
    </SceneShell>
  );
};

/* ===== S6: CTA ===== */
const CalcIcon: React.FC = () => (
  <svg width={92} height={92} viewBox="0 0 92 92">
    <rect x={14} y={6} width={64} height={80} rx={12} fill={C.violet} stroke={LINE} strokeWidth={5} />
    <rect x={22} y={14} width={48} height={20} rx={4} fill={C.white} />
    {[0, 1, 2].map((r) =>
      [0, 1, 2].map((c) => <rect key={`${r}${c}`} x={22 + c * 17} y={42 + r * 14} width={12} height={9} rx={2} fill={C.lavender} />),
    )}
  </svg>
);

export const S6Cta: React.FC<{ dur: number }> = ({ dur }) => {
  const collab = cue("s6", "collab");
  const calc = cue("s6", "calculator");
  const aaj = cue("s6", "aaj");
  const loss = cue("s6", "loss");
  const follow = cue("s6", "follow");
  const poses: PoseKey[] = [
    { at: -100, pose: "point" },
    { at: aaj - 2, pose: "explain" },
    { at: follow - 4, pose: "thumbs" },
  ];
  return (
    <SceneShell dur={dur} noExit>
      <Camera dur={dur} punches={[collab + 4]} push={0.02}>
        <Clinic plus={false} />
        <CtaFlow
          keyword="COLLAB"
          typeAt={collab - 10}
          giftAt={calc - 10}
          giftTitle="Influencer Calculator + Brief"
          giftSub="free · fee dene se pehle hisaab"
          giftIcon={<CalcIcon />}
          nextAt={aaj}
          nextNum="#09"
          nextLabel="AAJ SHAAM 7 BAJE · CASE #09"
          next={
            <>
              <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
                <div style={big(66)}>₹300</div>
                <div style={big(56, C.violet)}>→</div>
                <div style={big(66, C.green)}>₹599</div>
              </div>
              <div style={{ fontFamily: theme.fonts.display, fontWeight: 700, fontSize: 50, lineHeight: 1.12, color: LINE, textAlign: "center" }}>
                Double price pe becha,
                <br />
                phir bhi <span style={{ color: C.red }}>LOSS kyun?</span>
              </div>
            </>
          }
          followAt={follow}
        />
        <Place x={250} y={1010} s={0.96} z={4}>
          <Doctor poses={poses} mouth={sceneMouth("s6")} brows={[collab, aaj]} caseTag={TAG} />
        </Place>
      </Camera>
      {Array.from({ length: 6 }).map((_, i) => (
        <Sfx key={i} at={collab - 10 + i * 2} name="key" vol={0.4} />
      ))}
      <Sfx at={calc - 14} name="pop" vol={0.5} />
      <Sfx at={aaj - 4} name="whoosh" vol={0.45} />
      <Sfx at={loss - 2} name="error" vol={0.3} />
      <Sfx at={follow + 12} name="pop" vol={0.55} />
      <Sfx at={follow + 15} name="ding" vol={0.45} />
    </SceneShell>
  );
};

export { Burst, Confetti, inr, Phone, PRIYA, Shout };
