import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { Person, PRIYA } from "../../components/Cartoon";
import { Doctor, PoseKey } from "../../components/Doctor";
import { Camera } from "../../components/fx";
import { CtaFlow, HookTitle, LINE, Place, makeMouth } from "../../components/format";
import { Card, Chip, Enter, SceneShell, Sfx, clamp } from "../../components/kit";
import { Bottle } from "../../components/props";
import { Clinic, Doorstep, MoneyRoom, Whiteboard } from "../../components/sets";
import { Stamp } from "../../components/widgets";
import { C, theme } from "../../theme";
import { T, cue } from "./timeline";

const sceneMouth = makeMouth(T);
const TAG = "CASE #28";
const big = (size: number, color: string = LINE): React.CSSProperties => ({ fontFamily: theme.fonts.display, fontWeight: 700, fontSize: size, lineHeight: 1.05, color, whiteSpace: "nowrap" });
const body = (size: number, color: string = LINE): React.CSSProperties => ({ fontFamily: theme.fonts.body, fontWeight: 800, fontSize: size, color, whiteSpace: "nowrap" });
const TILE = ["#F5A25D", "#8E6BFF", "#20B2A0", "#F7A8C4", "#FFD54A", "#9FD3FF"];

/** Browser card with URL bar. */
export const Browser: React.FC<{ w?: number; url: string; children?: React.ReactNode }> = ({ w = 620, url, children }) => (
  <div style={{ width: w, background: C.white, border: `6px solid ${LINE}`, borderRadius: 24, boxShadow: `8px 8px 0 ${LINE}`, overflow: "hidden" }}>
    <div style={{ display: "flex", alignItems: "center", gap: 10, background: "#EEE9FA", padding: "12px 16px", borderBottom: `5px solid ${LINE}` }}>
      {[C.red, "#FFD54A", C.green].map((c) => (
        <div key={c} style={{ width: 16, height: 16, borderRadius: "50%", background: c, border: `3px solid ${LINE}` }} />
      ))}
      <div style={{ flex: 1, background: C.white, border: `3px solid ${LINE}`, borderRadius: 12, padding: "6px 12px 4px", ...body(22) }}>{url}</div>
    </div>
    <div style={{ padding: 18 }}>{children}</div>
  </div>
);

/** 40-product homepage grid (8 × 5); the serum hides at index 29. */
export const HomeGrid: React.FC<{ cols?: number; s?: number; hl?: number }> = ({ cols = 8, s = 62, hl = 0 }) => (
  <div style={{ display: "grid", gridTemplateColumns: `repeat(${cols}, ${s}px)`, gap: 8 }}>
    {Array.from({ length: 40 }).map((_, i) => (
      <div key={i} style={{ width: s, height: s, borderRadius: 10, background: TILE[i % 6], border: `3px solid ${i === 29 && hl ? C.red : LINE}`, opacity: hl && i !== 29 ? 1 - 0.5 * hl : 1, boxSizing: "border-box" }} />
    ))}
  </div>
);

const AdCard: React.FC<{ w?: number }> = ({ w = 360 }) => (
  <Card style={{ width: w, padding: "16px 16px 12px", border: `6px solid ${LINE}`, boxShadow: `7px 7px 0 ${LINE}`, display: "flex", flexDirection: "column", alignItems: "center", gap: 8, boxSizing: "border-box" }}>
    <div style={{ ...body(20, C.muted), alignSelf: "flex-start" }}>Sponsored · Rohit's Skin</div>
    <Bottle level={0.8} w={w * 0.34} />
    <div style={{ ...big(w * 0.092), whiteSpace: "nowrap" }}>Hair Serum ₹499</div>
    <div style={{ ...body(22, C.white), background: C.violet, borderRadius: 10, padding: "8px 18px" }}>Shop now</div>
  </Card>
);

/* ===== S1: hook ===== */
export const S1Hook: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const home = cue("s1", "homepage");
  const doob = cue("s1", "doob");
  return (
    <SceneShell dur={dur} noExit>
      <Camera dur={dur} punches={[home, doob]} push={0.03}>
        <MoneyRoom />
        <HookTitle
          top={300}
          lines={[
            { text: "Ad click → homepage?", at: -8, kind: "plain", size: 80, rot: -1 },
            { text: "aadha paisa doob gaya", at: -6, kind: "red", size: 80, rot: 2 },
          ]}
        />
        <div style={{ position: "absolute", left: 60, top: 640, zIndex: 6 }}>
          <AdCard w={330} />
        </div>
        <div style={{ position: "absolute", left: 420, top: 880, ...big(80, C.violet), zIndex: 7, opacity: interpolate(frame, [home - 10, home - 2], [0, 1], clamp) }}>→</div>
        <div style={{ position: "absolute", left: 520, top: 640, zIndex: 6, opacity: interpolate(frame, [home - 6, home + 4], [0, 1], clamp), transform: `scale(${interpolate(frame, [home - 6, home + 4], [0.85, 1], clamp)})` }}>
          <Browser w={480} url="rohitskin.in">
            <HomeGrid cols={6} s={62} />
          </Browser>
        </div>
      </Camera>
      <Sfx at={1} name="whoosh" vol={0.4} />
      <Sfx at={home - 6} name="swish" vol={0.4} />
      <Sfx at={doob - 2} name="error" vol={0.4} />
    </SceneShell>
  );
};

/* ===== S2: Priya taps the serum ad → 40-product homepage ===== */
export const S2Tap: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const tap = cue("s2", "tap");
  const forty = cue("s2", "chaalees");
  return (
    <SceneShell dur={dur} noExit>
      <Camera dur={dur} punches={[tap, forty]} push={0.02}>
        <Doorstep />
        <div style={{ position: "absolute", left: 480, top: 330, zIndex: 6, opacity: interpolate(frame, [forty - 10, forty - 2], [1, 0], clamp) }}>
          <AdCard w={380} />
        </div>
        <div style={{ position: "absolute", left: 380, top: 330, zIndex: 7, opacity: interpolate(frame, [forty - 8, forty + 2], [0, 1], clamp) }}>
          <Browser w={640} url="rohitskin.in">
            <HomeGrid cols={8} s={62} />
            <div style={{ ...big(40), marginTop: 12 }}>40 products 😵</div>
          </Browser>
        </div>
        <Place x={60} y={800} s={0.74} z={5}>
          <Person look={PRIYA} seed="p282" track={[{ at: -100, pose: "hold", mood: "happy" }, { at: forty, pose: "shrug", mood: "shock" }]} />
        </Place>
      </Camera>
      <Sfx at={tap - 2} name="pop" vol={0.45} />
      <Sfx at={forty - 6} name="whoosh" vol={0.4} />
    </SceneShell>
  );
};

/* ===== S3: searched, not found, back ===== */
export const S3Back: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const nahi = cue("s3", "nahi");
  const back = cue("s3", "back");
  const sx = interpolate(frame, [0, nahi], [0, 1], clamp);
  return (
    <SceneShell dur={dur} noExit>
      <Camera dur={dur} punches={[back]} push={0.02}>
        <MoneyRoom />
        <div style={{ position: "absolute", left: 220, top: 330, zIndex: 6 }}>
          <Browser w={640} url="rohitskin.in">
            <HomeGrid cols={8} s={62} hl={interpolate(frame, [nahi - 4, nahi + 6], [0, 1], clamp)} />
          </Browser>
        </div>
        <div style={{ position: "absolute", left: 260 + 480 * Math.abs(Math.sin(sx * Math.PI * 1.5)), top: 420 + 180 * sx, zIndex: 8, fontSize: 110 }}>🔍</div>
        <div style={{ position: "absolute", left: 640, top: 770, zIndex: 9 }}>
          <Stamp at={nahi} text="NAHI MILA" size={64} rotate={-6} />
        </div>
        <div style={{ position: "absolute", left: 100, top: 900, zIndex: 9, ...big(150, C.red), opacity: interpolate(frame, [back - 6, back + 2], [0, 1], clamp), transform: `translateX(${interpolate(frame, [back - 6, back + 6], [80, 0], clamp)}px)` }}>← BACK</div>
      </Camera>
      <Sfx at={nahi} name="stamp" vol={0.45} />
      <Sfx at={back - 4} name="swish" vol={0.45} />
    </SceneShell>
  );
};

/* ===== S4: the page must show what the ad showed ===== */
export const S4Match: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const wahi = cue("s4", "wahi");
  const bekaar = cue("s4", "bekaar");
  const poses: PoseKey[] = [
    { at: -100, pose: "explain" },
    { at: wahi - 4, pose: "point" },
    { at: bekaar - 4, pose: "stop" },
  ];
  return (
    <SceneShell dur={dur} noExit>
      <Camera dur={dur} punches={[wahi, bekaar]} push={0.02}>
        <Clinic />
        <div style={{ position: "absolute", left: 300, top: 330, display: "flex", alignItems: "center", gap: 20, zIndex: 6 }}>
          <AdCard w={300} />
          <div style={{ ...big(90, C.green), opacity: interpolate(frame, [wahi - 6, wahi + 2], [0, 1], clamp) }}>=</div>
          <div style={{ opacity: interpolate(frame, [wahi - 6, wahi + 2], [0, 1], clamp) }}>
            <Browser w={330} url="…/hair-serum">
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
                <Bottle level={0.8} w={90} />
                <div style={big(34)}>Hair Serum ₹499</div>
                <div style={{ ...body(20, C.white), background: C.green, borderRadius: 10, padding: "8px 14px" }}>ADD TO CART</div>
              </div>
            </Browser>
          </div>
        </div>
        <div style={{ position: "absolute", left: 360, top: 860, zIndex: 9 }}>
          <Stamp at={bekaar - 2} text="WARNA CLICK BEKAAR" size={50} rotate={-4} />
        </div>
        <Place x={-150} y={930} s={0.88} z={4}>
          <Doctor poses={poses} mouth={sceneMouth("s4")} brows={[wahi, bekaar]} caseTag={TAG} />
        </Place>
      </Camera>
      <Sfx at={wahi - 4} name="check" vol={0.4} />
      <Sfx at={bekaar - 2} name="stamp" vol={0.45} />
    </SceneShell>
  );
};

/* ===== S5: three fixes ===== */
export const S5Fixes: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const a = cue("s5", "seedha");
  const b = cue("s5", "upar");
  const c = cue("s5", "add to cart");
  const marks = [a, b, c];
  const poses: PoseKey[] = [
    { at: -100, pose: "one" },
    { at: b - 6, pose: "two" },
    { at: c - 6, pose: "three" },
  ];
  const fixes = ["Har ad seedha usi product ke page pe", "Upar wahi photo, wahi offer", "Add to Cart bina scroll kiye dikhe"];
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
            <div style={{ background: C.lavenderSoft, borderRadius: 14, padding: "10px 16px 6px", ...body(28, C.violetDeep) }}>Ad jo dikhaye, page wahi dikhaye</div>
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
const PageIcon: React.FC = () => (
  <svg width={92} height={92} viewBox="0 0 92 92">
    <rect x={8} y={8} width={76} height={76} rx={12} fill={C.white} stroke={LINE} strokeWidth={5} />
    <rect x={8} y={8} width={76} height={18} rx={8} fill={C.violet} stroke={LINE} strokeWidth={5} />
    <rect x={20} y={34} width={24} height={30} rx={5} fill="#F5A25D" stroke={LINE} strokeWidth={3} />
    <rect x={50} y={36} width={24} height={6} rx={3} fill={LINE} />
    <rect x={50} y={64} width={24} height={12} rx={4} fill={C.green} stroke={LINE} strokeWidth={2} />
  </svg>
);

export const S6Cta: React.FC<{ dur: number }> = ({ dur }) => {
  const kw = cue("s6", "page");
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
          keyword="PAGE"
          typeAt={kw - 8}
          giftAt={gift - 14}
          giftTitle="Ad se Page Checklist"
          giftSub="free · 8 cheezein jo milni chahiye"
          giftIcon={<PageIcon />}
          nextAt={aaj}
          nextNum="#29"
          nextLabel="AAJ SHAAM 7 BAJE · AGLA CASE"
          next={
            <div style={{ fontFamily: theme.fonts.display, fontWeight: 700, fontSize: 50, lineHeight: 1.12, color: LINE, textAlign: "center" }}>
              ₹50,000 ka shoot vs
              <br />
              <span style={{ color: C.green }}>₹0 ka phone video</span>. Kaun jeeta?
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
      <Sfx at={gift - 18} name="pop" vol={0.5} />
      <Sfx at={aaj - 4} name="whoosh" vol={0.45} />
      <Sfx at={follow + 12} name="pop" vol={0.55} />
      <Sfx at={follow + 15} name="ding" vol={0.45} />
    </SceneShell>
  );
};
