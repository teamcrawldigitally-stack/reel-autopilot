import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { Person, ROHIT } from "../../components/Cartoon";
import { Doctor, PoseKey } from "../../components/Doctor";
import { Camera } from "../../components/fx";
import { CtaFlow, HookTitle, LINE, Place, makeMouth } from "../../components/format";
import { Card, Chip, Enter, SceneShell, Sfx, clamp } from "../../components/kit";
import { Clinic, MoneyRoom, Whiteboard } from "../../components/sets";
import { Stamp } from "../../components/widgets";
import { C, theme } from "../../theme";
import { Diya } from "../case16/scenes";
import { T, cue } from "./timeline";

const sceneMouth = makeMouth(T);
const TAG = "CASE #20";
const big = (size: number, color: string = LINE): React.CSSProperties => ({ fontFamily: theme.fonts.display, fontWeight: 700, fontSize: size, lineHeight: 1.05, color, whiteSpace: "nowrap" });
const body = (size: number, color: string = LINE): React.CSSProperties => ({ fontFamily: theme.fonts.body, fontWeight: 800, fontSize: size, color, whiteSpace: "nowrap" });

/** Black Friday tag. */
export const BfTag: React.FC<{ w?: number; rot?: number; date?: string }> = ({ w = 380, rot = -4, date = "27 NOV" }) => (
  <div style={{ width: w, background: "#121212", border: `6px solid ${LINE}`, borderRadius: 26, padding: "18px 20px 12px", boxSizing: "border-box", transform: `rotate(${rot}deg)`, boxShadow: `8px 8px 0 ${LINE}`, textAlign: "center" }}>
    <div style={body(w * 0.08, "#FFD54A")}>{date}</div>
    <div style={big(w * 0.15, C.white)}>BLACK</div>
    <div style={big(w * 0.15, C.white)}>FRIDAY</div>
  </div>
);

/** Diwali card. */
export const DiwaliCard: React.FC<{ w?: number; rot?: number; dim?: number }> = ({ w = 340, rot = 4, dim = 0 }) => (
  <div style={{ width: w, background: "#FFF3DE", border: `6px solid ${LINE}`, borderRadius: 26, padding: "18px 20px 14px", boxSizing: "border-box", transform: `rotate(${rot}deg)`, boxShadow: `8px 8px 0 ${LINE}`, textAlign: "center", opacity: 1 - 0.45 * dim, filter: `saturate(${1 - 0.6 * dim})` }}>
    <div style={{ display: "flex", justifyContent: "center" }}>
      <Diya w={w * 0.42} />
    </div>
    <div style={big(w * 0.16, "#C2410C")}>DIWALI</div>
  </div>
);

/** Rank row card. */
const Rank: React.FC<{ n: string; title: string; sub: string; win?: boolean; p?: number }> = ({ n, title, sub, win = false, p = 1 }) => (
  <div style={{ opacity: p, transform: `translateX(${(1 - p) * 60}px)` }}>
    <Card style={{ width: 820, padding: "16px 24px 12px", border: `6px solid ${LINE}`, boxShadow: `7px 7px 0 ${win ? C.green : LINE}`, display: "flex", alignItems: "center", gap: 22, boxSizing: "border-box", background: win ? "#E9FBEF" : C.white }}>
      <div style={{ width: 92, height: 92, borderRadius: 22, background: win ? C.green : C.lavenderSoft, border: `5px solid ${LINE}`, display: "flex", alignItems: "center", justifyContent: "center", ...big(48, win ? C.white : LINE), paddingTop: 6, boxSizing: "border-box" }}>{n}</div>
      <div>
        <div style={big(52)}>{title}</div>
        <div style={body(24, C.muted)}>{sub}</div>
      </div>
    </Card>
  </div>
);

/* ===== S1: hook ===== */
export const S1Hook: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const diwali = cue("s1", "diwali");
  const bf = cue("s1", "black friday");
  const win = interpolate(frame, [bf - 6, bf + 6], [0, 1], { ...clamp, easing: theme.ease.out });
  return (
    <SceneShell dur={dur} noExit>
      <Camera dur={dur} punches={[bf]} push={0.03}>
        <MoneyRoom />
        <HookTitle
          top={300}
          lines={[
            { text: "Saal ka sabse bada din?", at: -8, kind: "plain", size: 76, rot: -1 },
            { text: "Diwali nahi, Black Friday!", at: -6, kind: "violet", size: 70, rot: 2 },
          ]}
        />
        <div style={{ position: "absolute", left: 80, top: 720, zIndex: 6 }}>
          <DiwaliCard w={360} dim={interpolate(frame, [diwali + 4, diwali + 16], [0, 1], clamp)} />
        </div>
        <div style={{ position: "absolute", right: 70, top: 690, zIndex: 7, transform: `scale(${1 + 0.12 * win})`, transformOrigin: "center" }}>
          <BfTag w={400} />
        </div>
        <div style={{ position: "absolute", left: 830, top: 650, zIndex: 9 }}>
          <Stamp at={bf + 2} text="#1" size={70} rotate={10} color={C.green} />
        </div>
      </Camera>
      <Sfx at={1} name="whoosh" vol={0.4} />
      <Sfx at={diwali - 2} name="swish" vol={0.35} />
      <Sfx at={bf + 2} name="stamp" vol={0.45} />
    </SceneShell>
  );
};

/* ===== S2: GoKwik Wrapped 2025 ===== */
export const S2GoKwik: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const brands = cue("s2", "brands");
  const date = cue("s2", "atthaais november");
  const diwali = cue("s2", "diwali");
  return (
    <SceneShell dur={dur} noExit>
      <Camera dur={dur} punches={[date]} push={0.02}>
        <MoneyRoom />
        <Enter delay={0} from="down" style={{ position: "absolute", left: 0, right: 0, top: 300, display: "flex", justifyContent: "center", zIndex: 8 }}>
          <Card style={{ padding: "14px 28px 8px", border: `6px solid ${LINE}`, boxShadow: `6px 6px 0 ${LINE}`, ...big(46) }}>
            2025 · sabse zyada <span style={{ color: C.violet }}>order</span> wala din
          </Card>
        </Enter>
        <div style={{ position: "absolute", left: 130, top: 430, display: "flex", flexDirection: "column", gap: 22, zIndex: 6 }}>
          <Rank n="#1" title="Black Friday · 28 Nov" sub="D2C brands pe saal ka top day" win p={interpolate(frame, [date - 8, date + 2], [0, 1], clamp)} />
          <Rank n="↓" title="Diwali" sub="isse kam order" p={interpolate(frame, [diwali - 6, diwali + 4], [0, 1], clamp)} />
        </div>
        <div style={{ position: "absolute", left: 130, top: 800, zIndex: 6, opacity: interpolate(frame, [brands - 6, brands + 4], [0, 1], clamp) }}>
          <Chip size={24} bg={C.white} color={C.muted} border={LINE}>
            Source: GoKwik Wrapped 2025 · D2C brands
          </Chip>
        </div>
        <Place x={640} y={870} s={0.68} z={5}>
          <Person look={ROHIT} seed="r202" track={[{ at: -100, pose: "idle", mood: "neutral" }, { at: diwali, pose: "shrug", mood: "shock" }]} />
        </Place>
      </Camera>
      <Sfx at={date - 6} name="pop" vol={0.45} />
      <Sfx at={diwali - 4} name="pop" vol={0.35} />
    </SceneShell>
  );
};

/* ===== S3: Unicommerce +27% ===== */
export const S3Growth: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const uni = cue("s3", "unicommerce");
  const pct = cue("s3", "sattaais percent");
  const n = Math.round(interpolate(frame, [pct - 6, pct + 14], [0, 27], { ...clamp, easing: theme.ease.out }));
  const bar = (h: number, label: string, col: string, at: number) => (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
      <div style={{ width: 200, height: 420, display: "flex", alignItems: "flex-end" }}>
        <div style={{ width: "100%", height: h * interpolate(frame, [at - 6, at + 12], [0, 1], { ...clamp, easing: theme.ease.out }), background: col, border: `6px solid ${LINE}`, borderRadius: 18, boxSizing: "border-box" }} />
      </div>
      <div style={big(40)}>{label}</div>
    </div>
  );
  return (
    <SceneShell dur={dur} noExit>
      <Camera dur={dur} punches={[pct]} push={0.02}>
        <MoneyRoom />
        <Enter delay={0} from="down" style={{ position: "absolute", left: 0, right: 0, top: 300, display: "flex", justifyContent: "center", zIndex: 8 }}>
          <Card style={{ padding: "14px 28px 8px", border: `6px solid ${LINE}`, boxShadow: `6px 6px 0 ${LINE}`, ...big(46) }}>
            Black Friday <span style={{ color: C.violet }}>week</span> ke order
          </Card>
        </Enter>
        <div style={{ position: "absolute", left: 120, top: 430, display: "flex", gap: 60, alignItems: "flex-end", zIndex: 6 }}>
          {bar(300, "2024", C.lavenderSoft, uni)}
          {bar(381, "2025", C.green, pct)}
        </div>
        <div style={{ position: "absolute", left: 660, top: 520, zIndex: 7, opacity: interpolate(frame, [pct - 6, pct + 2], [0, 1], clamp) }}>
          <div style={big(150, C.green)}>+{n}%</div>
          <div style={body(30, C.muted)}>pichhle saal se zyada</div>
        </div>
        <div style={{ position: "absolute", left: 120, top: 1000, zIndex: 6, opacity: interpolate(frame, [uni - 6, uni + 4], [0, 1], clamp) }}>
          <Chip size={24} bg={C.white} color={C.muted} border={LINE}>
            Source: Unicommerce, Dec 2025
          </Chip>
        </div>
      </Camera>
      <Sfx at={uni - 4} name="pop" vol={0.35} />
      <Sfx at={pct - 4} name="ding" vol={0.45} />
    </SceneShell>
  );
};

/* ===== S4: 27 Nov could be your biggest day ===== */
export const S4YourDay: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const date = cue("s4", "sattaais november");
  const bada = cue("s4", "sabse bada");
  const taiyari = cue("s4", "taiyari");
  const ring = interpolate(frame, [bada - 4, bada + 14], [0, 1], { ...clamp, easing: theme.ease.out });
  return (
    <SceneShell dur={dur} noExit>
      <Camera dur={dur} punches={[bada]} push={0.02}>
        <MoneyRoom />
        <div style={{ position: "absolute", left: 90, top: 330, zIndex: 6, opacity: interpolate(frame, [date - 8, date], [0, 1], clamp), transform: `translateY(${interpolate(frame, [date - 8, date + 4], [40, 0], clamp)}px)` }}>
          <Card style={{ width: 460, padding: 0, border: `6px solid ${LINE}`, boxShadow: `8px 8px 0 ${LINE}`, overflow: "hidden", textAlign: "center" }}>
            <div style={{ background: C.red, borderBottom: `5px solid ${LINE}`, padding: "12px 0 6px", ...big(44, C.white) }}>NOVEMBER 2026</div>
            <div style={{ position: "relative", padding: "20px 0 16px" }}>
              <div style={big(190)}>27</div>
              <div style={body(24, C.muted)}>SHUKRAVAAR · BLACK FRIDAY</div>
              <svg width={300} height={230} viewBox="0 0 300 230" style={{ position: "absolute", left: 80, top: 0 }}>
                <ellipse cx={150} cy={110} rx={130} ry={95} fill="none" stroke={C.green} strokeWidth={9} strokeDasharray={760} strokeDashoffset={760 * (1 - ring)} strokeLinecap="round" />
              </svg>
            </div>
          </Card>
        </div>
        <Enter delay={taiyari - 6} from="none" cfg="snappy" style={{ position: "absolute", left: 90, top: 820, zIndex: 8 }}>
          <Chip size={40} bg={C.violet} color={C.white} border={LINE}>
            Taiyari abhi se
          </Chip>
        </Enter>
        <Place x={600} y={740} s={0.74} z={5}>
          <Person look={ROHIT} seed="r204" track={[{ at: -100, pose: "idle", mood: "happy" }, { at: bada, pose: "cheer", mood: "happy" }]} />
        </Place>
      </Camera>
      <Sfx at={date - 6} name="pop" vol={0.4} />
      <Sfx at={bada - 2} name="ding" vol={0.4} />
      <Sfx at={taiyari - 6} name="pop" vol={0.4} />
    </SceneShell>
  );
};

/* ===== S5: three steps ===== */
export const S5Fixes: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const a = cue("s5", "stock");
  const b = cue("s5", "offer");
  const c = cue("s5", "purane customers");
  const marks = [a, b, c];
  const poses: PoseKey[] = [
    { at: -100, pose: "one" },
    { at: b - 6, pose: "two" },
    { at: c - 6, pose: "three" },
  ];
  const fixes = ["Hero product ka stock check", "Offer aur ad abhi bana lo", "27 se pehle purane customers ki list"];
  return (
    <SceneShell dur={dur} noExit>
      <Camera dur={dur} push={0.02}>
        <Clinic />
        <Whiteboard style={{ left: 230, top: 300, width: 800, height: 640 }}>
          <div style={{ position: "absolute", left: 30, top: 24 }}>
            <Chip size={26} bg={C.green}>
              TAIYARI
            </Chip>
          </div>
          <div style={{ position: "absolute", left: 30, right: 30, top: 96, display: "flex", justifyContent: "center" }}>
            <div style={{ background: C.lavenderSoft, borderRadius: 14, padding: "10px 16px 6px", ...body(28, C.violetDeep) }}>Black Friday · 27 Nov ke liye</div>
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
const ListIcon: React.FC = () => (
  <svg width={92} height={92} viewBox="0 0 92 92">
    <rect x={8} y={8} width={76} height={76} rx={12} fill="#121212" stroke={LINE} strokeWidth={5} />
    {[0, 1, 2].map((r) => (
      <g key={r}>
        <path d={`M20 ${30 + r * 18} l5 5 l9 -10`} stroke={C.green} strokeWidth={5} fill="none" strokeLinecap="round" />
        <rect x={40} y={26 + r * 18} width={32 - r * 6} height={6} rx={3} fill={C.white} />
      </g>
    ))}
  </svg>
);

export const S6Cta: React.FC<{ dur: number }> = ({ dur }) => {
  const kw = cue("s6", "friday");
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
          keyword="FRIDAY"
          typeAt={kw - 8}
          giftAt={gift - 6}
          giftTitle="Black Friday Taiyari Checklist"
          giftSub="free · stock, offer, ad, list"
          giftIcon={<ListIcon />}
          nextAt={aaj}
          nextNum="#21"
          nextLabel="AAJ SHAAM 7 BAJE · AGLA CASE"
          next={
            <div style={{ fontFamily: theme.fonts.display, fontWeight: 700, fontSize: 52, lineHeight: 1.12, color: LINE, textAlign: "center" }}>
              Har mahine <span style={{ color: C.red }}>₹5,000</span>
              <br />
              kahan ja rahe hain?
            </div>
          }
          followAt={follow}
        />
        <Place x={250} y={1010} s={0.96} z={4}>
          <Doctor poses={poses} mouth={sceneMouth("s6")} brows={[kw, aaj]} caseTag={TAG} />
        </Place>
      </Camera>
      {Array.from({ length: 6 }).map((_, i) => (
        <Sfx key={i} at={kw - 8 + i * 2} name="key" vol={0.4} />
      ))}
      <Sfx at={gift - 10} name="pop" vol={0.5} />
      <Sfx at={aaj - 4} name="whoosh" vol={0.45} />
      <Sfx at={follow + 12} name="pop" vol={0.55} />
      <Sfx at={follow + 15} name="ding" vol={0.45} />
    </SceneShell>
  );
};
