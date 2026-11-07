import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { Parcel, Person, PRIYA } from "../../components/Cartoon";
import { Doctor, PoseKey } from "../../components/Doctor";
import { Camera } from "../../components/fx";
import { CtaFlow, HookTitle, LINE, Place, makeMouth } from "../../components/format";
import { Card, Chip, Enter, SceneShell, Sfx, clamp } from "../../components/kit";
import { Clinic, Doorstep, MoneyRoom, Whiteboard } from "../../components/sets";
import { Stamp } from "../../components/widgets";
import { C, theme } from "../../theme";
import { T, cue } from "./timeline";

const sceneMouth = makeMouth(T);
const TAG = "CASE #38";
const big = (size: number, color: string = LINE): React.CSSProperties => ({ fontFamily: theme.fonts.display, fontWeight: 700, fontSize: size, lineHeight: 1.05, color, whiteSpace: "nowrap" });
const body = (size: number, color: string = LINE): React.CSSProperties => ({ fontFamily: theme.fonts.body, fontWeight: 800, fontSize: size, color, whiteSpace: "nowrap" });

/** Thank-you card with the next-order coupon. */
export const Coupon: React.FC<{ w?: number; rot?: number; p?: number }> = ({ w = 520, rot = -3, p = 1 }) => (
  <div style={{ width: w, background: "#FFF8E6", border: `6px solid ${LINE}`, borderRadius: 24, boxShadow: `8px 8px 0 ${LINE}`, transform: `rotate(${rot}deg) scale(${0.85 + 0.15 * p})`, opacity: p, overflow: "hidden" }}>
    <div style={{ background: C.violet, borderBottom: `5px dashed ${LINE}`, padding: "12px 20px 8px", ...big(w * 0.065, C.white) }}>Thank you, Priya!</div>
    <div style={{ padding: "16px 22px 14px" }}>
      <div style={body(w * 0.05, C.muted)}>DOOSRA ORDER · AGLE 30 DIN MEIN</div>
      <div style={{ display: "flex", alignItems: "baseline", gap: 16, marginTop: 6 }}>
        <div style={big(w * 0.2, C.red)}>10% OFF</div>
      </div>
      <div style={{ display: "inline-block", marginTop: 8, border: `3px dashed ${LINE}`, borderRadius: 10, padding: "6px 14px 2px", ...big(w * 0.06, C.violetDeep) }}>CODE · DOBARA10</div>
    </div>
  </div>
);

/** 100-dot grid, first `lit` dots green. */
const Dots: React.FC<{ lit: number; w?: number }> = ({ lit, w = 560 }) => {
  const s = w / 10;
  const greens = new Set(Array.from({ length: 25 }, (_, i) => (i * 37 + 11) % 100));
  const order = Array.from(greens);
  return (
    <div style={{ display: "grid", gridTemplateColumns: `repeat(10, ${s}px)`, rowGap: 10 }}>
      {Array.from({ length: 100 }).map((_, i) => {
        const k = order.indexOf(i);
        const on = k >= 0 && k < lit;
        return <div key={i} style={{ width: s * 0.7, height: s * 0.7, borderRadius: "50%", background: on ? C.green : C.lavenderSoft, border: `3px solid ${LINE}`, boxSizing: "border-box", transform: `scale(${on ? 1.12 : 1})` }} />;
      })}
    </div>
  );
};

/* ===== S1: hook ===== */
export const S1Hook: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const asli = cue("s1", "asli");
  return (
    <SceneShell dur={dur} noExit>
      <Camera dur={dur} punches={[asli]} push={0.03}>
        <MoneyRoom />
        <HookTitle
          top={300}
          lines={[
            { text: "100 naye customer aaye,", at: -8, kind: "plain", size: 76, rot: -1 },
            { text: "kamaai 2nd order mein", at: -6, kind: "green", size: 72, rot: 2 },
          ]}
        />
        <div style={{ position: "absolute", left: 90, top: 760, zIndex: 6 }}>
          <Parcel w={340} tag="SALE" />
        </div>
        <div style={{ position: "absolute", left: 500, top: 700, zIndex: 7, transform: `translateY(${interpolate(frame, [asli - 8, asli + 6], [60, 0], clamp)}px)` }}>
          <Coupon w={490} rot={6} p={interpolate(frame, [0, 10], [0.6, 1], clamp)} />
        </div>
      </Camera>
      <Sfx at={1} name="whoosh" vol={0.4} />
      <Sfx at={asli - 4} name="pop" vol={0.45} />
    </SceneShell>
  );
};

/* ===== S2: Priya's first Black Friday order ===== */
export const S2First: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const bf = cue("s2", "black friday");
  const pehli = cue("s2", "pehli baar");
  return (
    <SceneShell dur={dur} noExit>
      <Camera dur={dur} punches={[pehli]} push={0.02}>
        <Doorstep />
        <Enter delay={bf - 6} from="down" style={{ position: "absolute", left: 0, right: 0, top: 300, display: "flex", justifyContent: "center", zIndex: 8 }}>
          <Chip size={34} bg="#121212" color="#FFD54A" border={LINE}>
            BLACK FRIDAY · PEHLA ORDER
          </Chip>
        </Enter>
        <div style={{ position: "absolute", left: 600, top: 760, zIndex: 6, opacity: interpolate(frame, [pehli - 8, pehli], [0, 1], clamp), transform: `translateY(${interpolate(frame, [pehli - 8, pehli + 4], [40, 0], clamp)}px)` }}>
          <Parcel w={300} tag="ORDER" />
        </div>
        <Place x={180} y={780} s={0.78} z={5}>
          <Person look={PRIYA} seed="p382" track={[{ at: -100, pose: "idle", mood: "neutral" }, { at: pehli, pose: "hold", mood: "happy" }]} />
        </Place>
      </Camera>
      <Sfx at={bf - 6} name="pop" vol={0.4} />
      <Sfx at={pehli - 4} name="ding" vol={0.4} />
    </SceneShell>
  );
};

/* ===== S3: the card inside: second order in 30 days, 10% off ===== */
export const S3Card: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const card = cue("s3", "card");
  const tees = cue("s3", "tees");
  const off = cue("s3", "das percent off");
  return (
    <SceneShell dur={dur} noExit>
      <Camera dur={dur} punches={[off]} push={0.02}>
        <Doorstep />
        <div style={{ position: "absolute", left: 110, top: 380, zIndex: 6 }}>
          <Coupon w={860} rot={-2} p={interpolate(frame, [card - 8, card + 4], [0, 1], { ...clamp, easing: theme.ease.out })} />
        </div>
        <div style={{ position: "absolute", left: 640, top: 860, zIndex: 9 }}>
          <Stamp at={tees} text="30 DIN" size={60} rotate={-8} color={C.violet} />
        </div>
      </Camera>
      <Sfx at={card - 6} name="whoosh" vol={0.4} />
      <Sfx at={tees} name="stamp" vol={0.4} />
      <Sfx at={off - 4} name="pop" vol={0.4} />
    </SceneShell>
  );
};

/* ===== S4: 25 of 100 came back ===== */
export const S4Back: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const p25 = cue("s4", "pacchees");
  const bina = cue("s4", "bina");
  const lit = Math.round(interpolate(frame, [p25 - 2, p25 + 20], [0, 25], clamp));
  return (
    <SceneShell dur={dur} noExit>
      <Camera dur={dur} punches={[bina]} push={0.02}>
        <MoneyRoom />
        <Enter delay={0} from="none" cfg="snappy" style={{ position: "absolute", left: 0, right: 0, top: 292, display: "flex", justifyContent: "center", zIndex: 8 }}>
          <Chip size={28} bg={C.violet} color={C.white} border={LINE}>
            MAAN LO · EXAMPLE
          </Chip>
        </Enter>
        <div style={{ position: "absolute", left: 90, top: 390, zIndex: 6 }}>
          <Card style={{ padding: 22, border: `6px solid ${LINE}`, boxShadow: `8px 8px 0 ${LINE}` }}>
            <div style={{ ...body(26, C.muted), marginBottom: 14 }}>100 BLACK FRIDAY CUSTOMERS</div>
            <Dots lit={lit} w={520} />
          </Card>
        </div>
        <div style={{ position: "absolute", left: 700, top: 420, zIndex: 7, opacity: interpolate(frame, [p25 - 6, p25 + 2], [0, 1], clamp) }}>
          <div style={big(130, C.green)}>+{lit}</div>
          <div style={big(44)}>order extra</div>
        </div>
        <div style={{ position: "absolute", left: 700, top: 700, zIndex: 7, opacity: interpolate(frame, [bina - 6, bina + 2], [0, 1], clamp) }}>
          <Chip size={34} bg={C.white} color={LINE} border={LINE}>
            Naya ad · ₹0
          </Chip>
        </div>
      </Camera>
      <Sfx at={p25 - 2} name="tick" vol={0.35} />
      <Sfx at={bina - 4} name="ding" vol={0.4} />
    </SceneShell>
  );
};

/* ===== S5: three steps ===== */
export const S5Fixes: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const a = cue("s5", "coupon");
  const b = cue("s5", "whatsapp");
  const c = cue("s5", "pacchisve");
  const marks = [a, b, c];
  const poses: PoseKey[] = [
    { at: -100, pose: "one" },
    { at: b - 6, pose: "two" },
    { at: c - 6, pose: "three" },
  ];
  const fixes = ["Sale ke parcel mein 30 din ka coupon", "7 din baad WhatsApp: kaisa laga?", "25ve din yaad dilao"];
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
            <div style={{ background: C.lavenderSoft, borderRadius: 14, padding: "10px 16px 6px", ...body(28, C.violetDeep) }}>Sale ke baad · 30 din ka plan</div>
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
const CalIcon: React.FC = () => (
  <svg width={92} height={92} viewBox="0 0 92 92">
    <rect x={8} y={14} width={76} height={70} rx={12} fill={C.white} stroke={LINE} strokeWidth={5} />
    <rect x={8} y={14} width={76} height={20} rx={10} fill={C.violet} stroke={LINE} strokeWidth={5} />
    <text x={46} y={72} textAnchor="middle" fontFamily="Inter" fontWeight={900} fontSize={30} fill={LINE}>30</text>
  </svg>
);

export const S6Cta: React.FC<{ dur: number }> = ({ dur }) => {
  const kw = cue("s6", "dobara");
  const gift = cue("s6", "plan");
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
          keyword="DOBARA"
          typeAt={kw - 8}
          giftAt={gift - 6}
          giftTitle="Sale ke baad ka 30 din plan"
          giftSub="free · coupon, WhatsApp, reminder"
          giftIcon={<CalIcon />}
          nextAt={aaj}
          nextNum="#39"
          nextLabel="AAJ SHAAM 7 BAJE · AGLA CASE"
          next={
            <div style={{ fontFamily: theme.fonts.display, fontWeight: 700, fontSize: 52, lineHeight: 1.12, color: LINE, textAlign: "center" }}>
              <span style={{ color: C.violet }}>December</span> ka plan,
              <br />
              aapke paas hai?
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
