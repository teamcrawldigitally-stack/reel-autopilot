import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { Coin, Parcel, Person, ROHIT } from "../../components/Cartoon";
import { Doctor, PoseKey } from "../../components/Doctor";
import { Camera } from "../../components/fx";
import { CtaFlow, HookTitle, LINE, Place, makeMouth } from "../../components/format";
import { Card, Chip, Enter, SceneShell, Sfx, clamp, inr } from "../../components/kit";
import { Bottle } from "../../components/props";
import { Clinic, MoneyRoom, Whiteboard } from "../../components/sets";
import { Stamp } from "../../components/widgets";
import { C, theme } from "../../theme";
import { T, cue } from "./timeline";

const sceneMouth = makeMouth(T);
const TAG = "CASE #24";
const big = (size: number, color: string = LINE): React.CSSProperties => ({ fontFamily: theme.fonts.display, fontWeight: 700, fontSize: size, lineHeight: 1.05, color, whiteSpace: "nowrap" });
const body = (size: number, color: string = LINE): React.CSSProperties => ({ fontFamily: theme.fonts.body, fontWeight: 800, fontSize: size, color, whiteSpace: "nowrap" });
const COLORS = ["#F5A25D", "#8E6BFF", "#20B2A0", "#F7A8C4", "#FFD54A"];

/** Two-plank shelf with 20 products; the hero (index 3) glows from `heroAt`. */
export const Shelf20: React.FC<{ heroAt?: number; w?: number; dim?: number }> = ({ heroAt = 1e9, w = 940, dim = 0 }) => {
  const f = useCurrentFrame();
  const glow = interpolate(f, [heroAt - 4, heroAt + 8], [0, 1], clamp);
  return (
    <div style={{ width: w, display: "flex", flexDirection: "column", gap: 10 }}>
      {[0, 1].map((r) => (
        <div key={r}>
          <div style={{ display: "flex", justifyContent: "space-around", alignItems: "flex-end", height: 190 }}>
            {Array.from({ length: 10 }).map((_, i) => {
              const idx = r * 10 + i;
              const hero = idx === 3;
              return (
                <div key={i} style={{ opacity: hero ? 1 : 1 - 0.55 * dim, transform: `scale(${hero ? 1 + 0.25 * glow : 1})`, transformOrigin: "50% 100%", filter: hero && glow > 0 ? `drop-shadow(0 0 ${18 * glow}px #FFD54A)` : undefined }}>
                  <Bottle level={0.8} w={hero ? 92 : 76} color={hero ? "#F5A25D" : COLORS[idx % 5]} label={hero ? "HERO" : ""} />
                </div>
              );
            })}
          </div>
          <div style={{ height: 22, background: "#B5834F", border: `5px solid ${LINE}`, borderRadius: 8 }} />
        </div>
      ))}
    </div>
  );
};

/* ===== S1: hook ===== */
export const S1Hook: React.FC<{ dur: number }> = ({ dur }) => {
  const sirf = cue("s1", "sirf");
  return (
    <SceneShell dur={dur} noExit>
      <Camera dur={dur} punches={[sirf]} push={0.03}>
        <MoneyRoom />
        <HookTitle
          top={300}
          lines={[
            { text: "20 product launch kiye,", at: -8, kind: "plain", size: 82, rot: -1 },
            { text: "bik raha sirf 1?", at: -6, kind: "red", size: 100, rot: 2 },
          ]}
        />
        <div style={{ position: "absolute", left: 70, top: 700, zIndex: 6 }}>
          <Enter delay={0} from="down">
            <Shelf20 heroAt={sirf} dim={interpolate(useCurrentFrame(), [sirf, sirf + 10], [0, 1], clamp)} />
          </Enter>
        </div>
      </Camera>
      <Sfx at={1} name="whoosh" vol={0.4} />
      <Sfx at={sirf - 2} name="ding" vol={0.45} />
    </SceneShell>
  );
};

/* ===== S2: 70% of sales from one serum ===== */
export const S2Seventy: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const shelf = cue("s2", "shelf");
  const s70 = cue("s2", "sattar percent");
  const grow = interpolate(frame, [s70 - 4, s70 + 16], [0, 1], { ...clamp, easing: theme.ease.out });
  return (
    <SceneShell dur={dur} noExit>
      <Camera dur={dur} punches={[s70]} push={0.02}>
        <MoneyRoom />
        <div style={{ position: "absolute", left: 70, top: 330, zIndex: 6 }}>
          <Enter delay={shelf - 10} from="down">
            <Shelf20 heroAt={s70} dim={grow} />
          </Enter>
        </div>
        <div style={{ position: "absolute", left: 70, top: 780, zIndex: 7, opacity: interpolate(frame, [s70 - 8, s70], [0, 1], clamp) }}>
          <Card style={{ width: 940, padding: "18px 24px 20px", border: `6px solid ${LINE}`, boxShadow: `8px 8px 0 ${LINE}`, boxSizing: "border-box" }}>
            <div style={{ ...body(28, C.muted), marginBottom: 12 }}>KUL SALE KA HISSA</div>
            <div style={{ height: 80, borderRadius: 18, border: `5px solid ${LINE}`, overflow: "hidden", display: "flex", background: "#E9E4F5" }}>
              <div style={{ width: `${70 * grow}%`, background: C.green, display: "flex", alignItems: "center", paddingLeft: 18, boxSizing: "border-box", ...big(44, C.white), borderRight: `5px solid ${LINE}` }}>{grow > 0.6 ? "1 serum · 70%" : ""}</div>
              <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", ...body(26, C.muted) }}>{grow > 0.6 ? "19 · 30%" : ""}</div>
            </div>
          </Card>
        </div>
      </Camera>
      <Sfx at={shelf - 10} name="whoosh" vol={0.35} />
      <Sfx at={s70 - 2} name="ding" vol={0.45} />
    </SceneShell>
  );
};

/* ===== S3: the other 19 sit in the godown and still take ad money ===== */
export const S3Godown: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const nineteen = cue("s3", "unnees");
  const ad = cue("s3", "ad");
  return (
    <SceneShell dur={dur} noExit>
      <Camera dur={dur} punches={[ad]} push={0.02}>
        <MoneyRoom />
        <div style={{ position: "absolute", left: 0, right: 0, top: 300, display: "flex", justifyContent: "center", zIndex: 7 }}>
          <Enter delay={0} from="down">
            <Card style={{ padding: "12px 28px 6px", border: `6px solid ${LINE}`, boxShadow: `6px 6px 0 ${LINE}`, ...big(54) }}>🏚️ GODOWN · 19 product</Card>
          </Enter>
        </div>
        <div style={{ position: "absolute", left: 90, top: 460, width: 900, display: "flex", flexWrap: "wrap", gap: 12, zIndex: 5 }}>
          {Array.from({ length: 19 }).map((_, i) => {
            const p = interpolate(frame, [nineteen - 6 + i * 1.5, nineteen + i * 1.5], [0, 1], clamp);
            return (
              <div key={i} style={{ opacity: p, transform: `translateY(${(1 - p) * -50}px)` }}>
                <Parcel w={112} />
              </div>
            );
          })}
        </div>
        {Array.from({ length: 8 }).map((_, i) => {
          const t = frame - ad - i * 4;
          if (t < 0 || t > 30) return null;
          const x = 160 + ((i * 113) % 760);
          return (
            <div key={i} style={{ position: "absolute", left: x, top: 300 + t * 14, zIndex: 8, opacity: interpolate(t, [0, 4, 24, 30], [0, 1, 1, 0]) }}>
              <Coin size={56} />
            </div>
          );
        })}
        <div style={{ position: "absolute", left: 600, top: 1020, zIndex: 9 }}>
          <Stamp at={ad + 14} text="AD PAISA BHI" size={56} rotate={-6} />
        </div>
      </Camera>
      <Sfx at={nineteen - 6} name="whoosh" vol={0.35} />
      <Sfx at={ad} name="tick" vol={0.35} />
      <Sfx at={ad + 14} name="stamp" vol={0.45} />
    </SceneShell>
  );
};

/* ===== S4: ₹20,000 split equally, hero gets only ₹1,000 ===== */
export const S4Split: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const budget = cue("s4", "bees hazaar");
  const each = cue("s4", "ek hazaar");
  const bikta = cue("s4", "bikta");
  const only = cue("s4", "ek hazaar", 2);
  const amt = interpolate(frame, [budget - 6, budget + 10], [0, 20000], { ...clamp, easing: theme.ease.out });
  return (
    <SceneShell dur={dur} noExit>
      <Camera dur={dur} punches={[budget, only]} push={0.02}>
        <MoneyRoom />
        <Enter delay={0} from="none" cfg="snappy" style={{ position: "absolute", left: 0, right: 0, top: 292, display: "flex", justifyContent: "center", zIndex: 8 }}>
          <Chip size={28} bg={C.violet} color={C.white} border={LINE}>
            MAAN LO · EXAMPLE
          </Chip>
        </Enter>
        <Enter delay={budget - 10} from="down" style={{ position: "absolute", left: 0, right: 0, top: 370, display: "flex", justifyContent: "center", zIndex: 6 }}>
          <Card style={{ padding: "14px 34px 8px", border: `6px solid ${LINE}`, boxShadow: `7px 7px 0 ${LINE}`, display: "flex", alignItems: "baseline", gap: 18 }}>
            <span style={body(30, C.muted)}>AD BUDGET</span>
            <span style={{ ...big(84), fontVariantNumeric: "tabular-nums" }}>₹{inr(amt)}</span>
          </Card>
        </Enter>
        <div style={{ position: "absolute", left: 70, top: 560, width: 940, display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 12, zIndex: 6 }}>
          {Array.from({ length: 20 }).map((_, i) => {
            const p = interpolate(frame, [each - 6 + i, each + i], [0, 1], clamp);
            const hero = i === 3;
            const hl = hero && frame >= bikta - 2;
            return (
              <div key={i} style={{ opacity: p, transform: `scale(${hl ? 1.12 : 1})`, background: hl ? "#FFF3C4" : C.white, border: `5px solid ${hl ? C.red : LINE}`, borderRadius: 14, padding: "8px 4px 4px", textAlign: "center", boxShadow: `4px 4px 0 ${LINE}` }}>
                <div style={body(20, hl ? C.red : C.muted)}>{hero ? "HERO" : `#${i + 1}`}</div>
                <div style={big(36, hl ? C.red : LINE)}>₹1,000</div>
              </div>
            );
          })}
        </div>
        <div style={{ position: "absolute", left: 560, top: 1040, zIndex: 9 }}>
          <Stamp at={only} text="SIRF ₹1,000?" size={60} rotate={-6} />
        </div>
        <Place x={60} y={880} s={0.66} z={5}>
          <Person look={ROHIT} seed="r244" track={[{ at: -100, pose: "idle", mood: "neutral" }, { at: only - 2, pose: "shrug", mood: "shock" }]} />
        </Place>
      </Camera>
      <Sfx at={budget - 6} name="tick" vol={0.35} />
      <Sfx at={each - 6} name="swish" vol={0.35} />
      <Sfx at={only} name="stamp" vol={0.5} />
    </SceneShell>
  );
};

/* ===== S5: find the hero, back it ===== */
export const S5Fixes: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const hero = cue("s5", "hero");
  const a = cue("s5", "zyada");
  const b = cue("s5", "homepage");
  const c = cue("s5", "naye");
  const marks = [a, b, c];
  const poses: PoseKey[] = [
    { at: -100, pose: "explain" },
    { at: a - 6, pose: "one" },
    { at: b - 6, pose: "two" },
    { at: c - 6, pose: "three" },
  ];
  const fixes = ["Zyada ad paisa usi pe", "Homepage pe sabse upar wahi", "Naye product usi ke saath combo"];
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
          <div style={{ position: "absolute", left: 30, right: 30, top: 96, display: "flex", justifyContent: "center", opacity: interpolate(frame, [hero - 8, hero], [0, 1], clamp) }}>
            <div style={{ background: "#FFF3C4", border: `4px solid ${LINE}`, borderRadius: 14, padding: "10px 16px 6px", ...body(28, LINE) }}>3 mahine ke order → HERO pakdo</div>
          </div>
          <div style={{ position: "absolute", left: 40, right: 30, top: 200, display: "flex", flexDirection: "column", gap: 30 }}>
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
          <Doctor poses={poses} mouth={sceneMouth("s5")} brows={[hero, ...marks]} caseTag={TAG} />
        </Place>
      </Camera>
      <Sfx at={1} name="whoosh" vol={0.4} />
      <Sfx at={hero - 6} name="ding" vol={0.4} />
      {marks.map((m, i) => (
        <Sfx key={i} at={m - 5} name="check" vol={0.4} />
      ))}
    </SceneShell>
  );
};

/* ===== S6: CTA ===== */
const FinderIcon: React.FC = () => (
  <svg width={92} height={92} viewBox="0 0 92 92">
    <rect x={8} y={8} width={76} height={76} rx={12} fill={C.white} stroke={LINE} strokeWidth={5} />
    {[0, 1, 2, 3].map((i) => (
      <rect key={i} x={18 + i * 16} y={70 - [18, 46, 26, 14][i]} width={11} height={[18, 46, 26, 14][i]} fill={i === 1 ? "#F5B400" : C.lavender} stroke={LINE} strokeWidth={2} />
    ))}
  </svg>
);

export const S6Cta: React.FC<{ dur: number }> = ({ dur }) => {
  const kw = cue("s6", "hero");
  const gift = cue("s6", "finder");
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
          keyword="HERO"
          typeAt={kw - 8}
          giftAt={gift - 12}
          giftTitle="Hero Product Finder Sheet"
          giftSub="free · 3 mahine ke order daalo"
          giftIcon={<FinderIcon />}
          nextAt={aaj}
          nextNum="#25"
          nextLabel="AAJ SHAAM 7 BAJE · AGLA CASE"
          next={
            <div style={{ fontFamily: theme.fonts.display, fontWeight: 700, fontSize: 52, lineHeight: 1.12, color: LINE, textAlign: "center" }}>
              Aapka ad pehle <span style={{ color: C.red }}>3 second</span>
              <br />
              mein skip kyun?
            </div>
          }
          followAt={follow}
        />
        <Place x={250} y={1010} s={0.96} z={4}>
          <Doctor poses={poses} mouth={sceneMouth("s6")} brows={[kw, aaj]} caseTag={TAG} />
        </Place>
      </Camera>
      {Array.from({ length: 4 }).map((_, i) => (
        <Sfx key={i} at={kw - 8 + i * 2} name="key" vol={0.4} />
      ))}
      <Sfx at={gift - 16} name="pop" vol={0.5} />
      <Sfx at={aaj - 4} name="whoosh" vol={0.45} />
      <Sfx at={follow + 12} name="pop" vol={0.55} />
      <Sfx at={follow + 15} name="ding" vol={0.45} />
    </SceneShell>
  );
};
