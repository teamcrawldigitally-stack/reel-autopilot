import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { Person, ROHIT } from "../../components/Cartoon";
import { Doctor, PoseKey } from "../../components/Doctor";
import { Camera } from "../../components/fx";
import { CtaFlow, HookTitle, LINE, Place, makeMouth } from "../../components/format";
import { Card, Chip, Enter, SceneShell, Sfx, clamp, inr } from "../../components/kit";
import { Clinic, MoneyRoom, Whiteboard } from "../../components/sets";
import { Stamp } from "../../components/widgets";
import { C, theme } from "../../theme";
import { T, cue } from "./timeline";

const sceneMouth = makeMouth(T);
const TAG = "CASE #32";
const big = (size: number, color: string = LINE): React.CSSProperties => ({ fontFamily: theme.fonts.display, fontWeight: 700, fontSize: size, lineHeight: 1.05, color, whiteSpace: "nowrap" });
const body = (size: number, color: string = LINE): React.CSSProperties => ({ fontFamily: theme.fonts.body, fontWeight: 800, fontSize: size, color, whiteSpace: "nowrap" });

/** Rohit's best ad as a card; `tired` 0..1 droops it. */
export const AdCard: React.FC<{ w?: number; tired?: number }> = ({ w = 360, tired = 0 }) => {
  const frame = useCurrentFrame();
  const eyeH = 12 - 9 * tired;
  return (
    <div style={{ width: w, background: C.white, border: `6px solid ${LINE}`, borderRadius: 24, boxShadow: `8px 8px 0 ${LINE}`, overflow: "hidden", transform: `rotate(${tired * -4}deg) translateY(${tired * 14}px)` }}>
      <div style={{ height: w * 0.78, background: tired > 0.5 ? "#E8E2F2" : "#C9E8FF", borderBottom: `5px solid ${LINE}`, position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <svg width={w * 0.62} height={w * 0.62} viewBox="0 0 100 100">
          <rect x={30} y={8} width={40} height={84} rx={12} fill={C.white} stroke={LINE} strokeWidth={5} />
          <rect x={42} y={0} width={16} height={12} rx={3} fill={LINE} />
          <ellipse cx={42} cy={44} rx={5} ry={eyeH / 2} fill={LINE} />
          <ellipse cx={58} cy={44} rx={5} ry={eyeH / 2} fill={LINE} />
          <path d={tired > 0.5 ? "M40 66 Q50 58 60 66" : "M40 60 Q50 70 60 60"} stroke={LINE} strokeWidth={4} fill="none" strokeLinecap="round" />
        </svg>
        {tired > 0.4 && (
          <div style={{ position: "absolute", right: w * 0.1, top: w * 0.08, ...big(w * 0.13, C.violet), opacity: tired, transform: `translateY(${Math.sin(frame / 10) * 6}px)` }}>z z</div>
        )}
      </div>
      <div style={{ padding: "10px 16px 8px", ...big(w * 0.1) }}>Rohit ka best ad</div>
    </div>
  );
};

/** Cost-per-order tag. */
const CostTag: React.FC<{ label: string; value: number; color: string; p?: number }> = ({ label, value, color, p = 1 }) => (
  <div style={{ opacity: p, transform: `scale(${0.85 + 0.15 * p})` }}>
    <Card style={{ padding: "16px 26px 8px", border: `6px solid ${LINE}`, boxShadow: `7px 7px 0 ${LINE}`, textAlign: "center" }}>
      <div style={body(26, C.muted)}>{label}</div>
      <div style={big(96, color)}>₹{inr(value)}</div>
      <div style={body(24, C.muted)}>har order</div>
    </Card>
  </div>
);

/* ===== S1: hook ===== */
export const S1Hook: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const ab = cue("s1", "chhe sau");
  const thak = cue("s1", "thak");
  return (
    <SceneShell dur={dur} noExit>
      <Camera dur={dur} punches={[thak]} push={0.03}>
        <MoneyRoom />
        <HookTitle
          top={300}
          lines={[
            { text: "₹200 se ₹600 per order,", at: -8, kind: "plain", size: 74, rot: -1 },
            { text: "ad thak gaya?", at: -6, kind: "red", size: 108, rot: 2 },
          ]}
        />
        <div style={{ position: "absolute", left: 80, top: 700, zIndex: 6 }}>
          <AdCard w={380} tired={interpolate(frame, [thak - 8, thak + 6], [0, 1], clamp)} />
        </div>
        <div style={{ position: "absolute", left: 540, top: 720, display: "flex", flexDirection: "column", gap: 26, zIndex: 6 }}>
          <CostTag label="PICHLE MAHINE" value={200} color={C.green} />
          <CostTag label="AB" value={600} color={C.red} p={interpolate(frame, [ab - 8, ab], [0.25, 1], clamp)} />
        </div>
      </Camera>
      <Sfx at={1} name="whoosh" vol={0.4} />
      <Sfx at={ab - 4} name="error" vol={0.4} />
      <Sfx at={thak - 4} name="swish" vol={0.35} />
    </SceneShell>
  );
};

/* ===== S2: month 1, ₹200 an order ===== */
export const S2Month1: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const best = cue("s2", "best");
  const sau = cue("s2", "do sau");
  const har = cue("s2", "har");
  return (
    <SceneShell dur={dur} noExit>
      <Camera dur={dur} punches={[sau]} push={0.02}>
        <MoneyRoom />
        <Enter delay={0} from="none" cfg="snappy" style={{ position: "absolute", left: 0, right: 0, top: 292, display: "flex", justifyContent: "center", zIndex: 8 }}>
          <Chip size={28} bg={C.violet} color={C.white} border={LINE}>
            MAAN LO · EXAMPLE
          </Chip>
        </Enter>
        <div style={{ position: "absolute", left: 90, top: 400, zIndex: 6, opacity: interpolate(frame, [best - 8, best], [0, 1], clamp) }}>
          <AdCard w={400} />
        </div>
        <div style={{ position: "absolute", left: 600, top: 440, zIndex: 6 }}>
          <div style={{ ...body(30, C.muted), marginBottom: 10 }}>MAHINA 1</div>
          <CostTag label="ORDER KA KHARCHA" value={200} color={C.green} p={interpolate(frame, [har - 6, har + 2], [0, 1], clamp)} />
        </div>
        <Place x={560} y={820} s={0.7} z={5}>
          <Person look={ROHIT} seed="r322" track={[{ at: -100, pose: "idle", mood: "neutral" }, { at: sau, pose: "cheer", mood: "happy" }]} />
        </Place>
      </Camera>
      <Sfx at={best - 6} name="pop" vol={0.4} />
      <Sfx at={sau - 4} name="ding" vol={0.4} />
    </SceneShell>
  );
};

/* ===== S3: same ad, same budget, ₹600 an order ===== */
export const S3Month2: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const wahiAd = cue("s3", "wahi");
  const budget = cue("s3", "budget");
  const sau = cue("s3", "chhe sau");
  const har = cue("s3", "har");
  return (
    <SceneShell dur={dur} noExit>
      <Camera dur={dur} punches={[sau]} push={0.02}>
        <MoneyRoom />
        <div style={{ position: "absolute", left: 90, top: 330, display: "flex", gap: 18, zIndex: 8 }}>
          <div style={{ opacity: interpolate(frame, [wahiAd - 6, wahiAd], [0, 1], clamp) }}>
            <Chip size={30} bg={C.white} color={LINE} border={LINE}>
              Wahi ad
            </Chip>
          </div>
          <div style={{ opacity: interpolate(frame, [budget - 6, budget], [0, 1], clamp) }}>
            <Chip size={30} bg={C.white} color={LINE} border={LINE}>
              Wahi budget
            </Chip>
          </div>
        </div>
        <div style={{ position: "absolute", left: 90, top: 440, zIndex: 6 }}>
          <AdCard w={400} tired={interpolate(frame, [sau - 6, sau + 10], [0, 1], clamp)} />
        </div>
        <div style={{ position: "absolute", left: 600, top: 440, zIndex: 6 }}>
          <div style={{ ...body(30, C.muted), marginBottom: 10 }}>MAHINA 2</div>
          <CostTag label="ORDER KA KHARCHA" value={600} color={C.red} p={interpolate(frame, [har - 6, har + 2], [0, 1], clamp)} />
        </div>
        <div style={{ position: "absolute", left: 790, top: 820, zIndex: 9 }}>
          <Stamp at={sau + 6} text="3 GUNA" size={60} rotate={-8} />
        </div>
        <Place x={560} y={860} s={0.7} z={5}>
          <Person look={ROHIT} seed="r323" track={[{ at: -100, pose: "idle", mood: "neutral" }, { at: sau, pose: "sad", mood: "shock" }]} />
        </Place>
      </Camera>
      <Sfx at={wahiAd - 4} name="pop" vol={0.35} />
      <Sfx at={sau - 4} name="error" vol={0.4} />
      <Sfx at={sau + 6} name="stamp" vol={0.4} />
    </SceneShell>
  );
};

/** One viewer with a views counter. */
const Viewer: React.FC<{ n: number }> = ({ n }) => (
  <Card style={{ padding: "14px 22px 10px", border: `6px solid ${LINE}`, boxShadow: `6px 6px 0 ${LINE}`, display: "flex", alignItems: "center", gap: 18 }}>
    <svg width={110} height={132} viewBox="0 0 30 36">
      <circle cx={15} cy={9} r={7.5} fill={C.violet} />
      <path d="M2 36 Q2 19 15 19 Q28 19 28 36 Z" fill={C.violet} />
    </svg>
    <div>
      <div style={body(30, C.muted)}>EK INSAAN NE DEKHA</div>
      <div style={big(110, n >= 6 ? C.red : LINE)}>{n} baar</div>
    </div>
  </Card>
);

/* ===== S4: the same people saw it again and again ===== */
export const S4Seen: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const baar = cue("s4", "baar");
  const purana = cue("s4", "purana");
  const n = Math.round(interpolate(frame, [baar - 6, purana - 4], [1, 8], clamp));
  const poses: PoseKey[] = [
    { at: -100, pose: "explain" },
    { at: baar - 4, pose: "point" },
    { at: purana, pose: "stop" },
  ];
  return (
    <SceneShell dur={dur} noExit>
      <Camera dur={dur} punches={[purana]} push={0.02}>
        <Clinic />
        <div style={{ position: "absolute", left: 340, top: 380, display: "flex", flexDirection: "column", gap: 34, zIndex: 6 }}>
          <Viewer n={n} />
          <div style={{ opacity: interpolate(frame, [purana - 8, purana], [0, 1], clamp), transform: `translateX(${interpolate(frame, [purana - 8, purana], [50, 0], clamp)}px)` }}>
            <Chip size={44} bg={C.red} color={C.white} border={LINE}>
              Ad purana ho gaya
            </Chip>
          </div>
        </div>
        <Place x={-140} y={930} s={0.9} z={4}>
          <Doctor poses={poses} mouth={sceneMouth("s4")} brows={[baar, purana]} caseTag={TAG} />
        </Place>
      </Camera>
      {[0, 1, 2, 3].map((i) => (
        <Sfx key={i} at={baar - 4 + i * 8} name="tick" vol={0.3} />
      ))}
      <Sfx at={purana - 4} name="error" vol={0.35} />
    </SceneShell>
  );
};

/* ===== S5: three steps ===== */
export const S5Fixes: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const a = cue("s5", "dekho");
  const b = cue("s5", "idea");
  const c = cue("s5", "do teen");
  const marks = [a, b, c];
  const poses: PoseKey[] = [
    { at: -100, pose: "one" },
    { at: b - 6, pose: "two" },
    { at: c - 6, pose: "three" },
  ];
  const fixes = ["Dekho: ek insaan ne kitni baar dekha", "Wahi idea, nayi shuruaat", "Har 2 hafte 2-3 naye ad ready"];
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
            <div style={{ background: C.lavenderSoft, borderRadius: 14, padding: "10px 16px 6px", ...body(28, C.violetDeep) }}>Ad ko fresh rakho · frequency dekho</div>
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
const FreshIcon: React.FC = () => (
  <svg width={92} height={92} viewBox="0 0 92 92">
    <rect x={8} y={8} width={76} height={76} rx={12} fill={C.white} stroke={LINE} strokeWidth={5} />
    <path d="M46 20 L52 38 L70 40 L56 52 L60 70 L46 60 L32 70 L36 52 L22 40 L40 38 Z" fill={C.green} stroke={LINE} strokeWidth={4} strokeLinejoin="round" />
  </svg>
);

export const S6Cta: React.FC<{ dur: number }> = ({ dur }) => {
  const kw = cue("s6", "fresh");
  const gift = cue("s6", "checklist");
  const aaj = cue("s6", "aaj");
  const follow = cue("s6", "follow");
  const poses: PoseKey[] = [
    { at: -100, pose: "point" },
    { at: aaj - 2, pose: "explain" },
    { at: follow - 4, pose: "thumbs" },
  ];
  return (
    <SceneShell dur={dur} noExit>
      <Camera dur={dur} punches={[kw + 4]} push={0.02}>
        <Clinic plus={false} />
        <CtaFlow
          keyword="FRESH"
          typeAt={kw - 8}
          giftAt={gift - 6}
          giftTitle="Naye Ad ki Checklist"
          giftSub="free · kab badlein, kya badlein"
          giftIcon={<FreshIcon />}
          nextAt={aaj}
          nextNum="#33"
          nextLabel="AAJ SHAAM 7 BAJE · AGLA CASE"
          next={
            <div style={{ fontFamily: theme.fonts.display, fontWeight: 700, fontSize: 52, lineHeight: 1.12, color: LINE, textAlign: "center" }}>
              ₹10,000 <span style={{ color: C.violet }}>Meta</span> pe lagayein
              <br />
              ya <span style={{ color: C.green }}>Google</span> pe?
            </div>
          }
          followAt={follow}
        />
        <Place x={250} y={1010} s={0.96} z={4}>
          <Doctor poses={poses} mouth={sceneMouth("s6")} brows={[kw, aaj]} caseTag={TAG} />
        </Place>
      </Camera>
      {Array.from({ length: 5 }).map((_, i) => (
        <Sfx key={i} at={kw - 8 + i * 2} name="key" vol={0.4} />
      ))}
      <Sfx at={gift - 10} name="pop" vol={0.5} />
      <Sfx at={aaj - 4} name="whoosh" vol={0.45} />
      <Sfx at={follow + 12} name="pop" vol={0.55} />
      <Sfx at={follow + 15} name="ding" vol={0.45} />
    </SceneShell>
  );
};
