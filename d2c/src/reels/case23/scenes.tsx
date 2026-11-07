import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { Confetti, Parcel, Person, ROHIT } from "../../components/Cartoon";
import { Doctor, PoseKey } from "../../components/Doctor";
import { Camera } from "../../components/fx";
import { CtaFlow, HookTitle, LINE, Place, makeMouth } from "../../components/format";
import { Card, Chip, Enter, SceneShell, Sfx, clamp } from "../../components/kit";
import { Bubble, NameTag, Phone } from "../../components/props";
import { Clinic, MoneyRoom, OfficeWall, Whiteboard } from "../../components/sets";
import { Stamp } from "../../components/widgets";
import { C, theme } from "../../theme";
import { T, cue } from "./timeline";

const sceneMouth = makeMouth(T);
const TAG = "CASE #23";
const big = (size: number, color: string = LINE): React.CSSProperties => ({ fontFamily: theme.fonts.display, fontWeight: 700, fontSize: size, lineHeight: 1.05, color, whiteSpace: "nowrap" });
const body = (size: number, color: string = LINE): React.CSSProperties => ({ fontFamily: theme.fonts.body, fontWeight: 800, fontSize: size, color, whiteSpace: "nowrap" });

/** Order bar 0→100 in three coloured parts that fill at their cues. */
export const OrderBar: React.FC<{ a?: number; b?: number; c?: number; w?: number }> = ({ a = 1e9, b = 1e9, c = 1e9, w = 940 }) => {
  const f = useCurrentFrame();
  const seg = (at: number) => interpolate(f, [at - 4, at + 14], [0, 1], { ...clamp, easing: theme.ease.out });
  const parts: [number, string, number][] = [
    [30, C.green, seg(a)],
    [40, C.violet, seg(b)],
    [30, "#F5B400", seg(c)],
  ];
  const total = Math.round(parts.reduce((s, [n, , p]) => s + n * p, 0));
  return (
    <Card style={{ width: w, padding: "18px 24px 20px", border: `6px solid ${LINE}`, boxShadow: `8px 8px 0 ${LINE}`, boxSizing: "border-box" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 12 }}>
        <span style={body(28, C.muted)}>📦 ORDER COUNTER</span>
        <span style={{ ...big(64, total >= 100 ? C.green : LINE), fontVariantNumeric: "tabular-nums" }}>{total} / 100</span>
      </div>
      <div style={{ height: 60, borderRadius: 30, border: `5px solid ${LINE}`, background: "#F1ECFB", overflow: "hidden", display: "flex" }}>
        {parts.map(([n, col, p], i) => (
          <div key={i} style={{ width: `${n * p}%`, height: "100%", background: col, borderRight: p > 0.98 && i < 2 ? `4px solid ${LINE}` : undefined, boxSizing: "border-box" }} />
        ))}
      </div>
    </Card>
  );
};

/* ===== S1: hook ===== */
export const S1Hook: React.FC<{ dur: number }> = ({ dur }) => {
  const zero = cue("s1", "zero");
  const kaise = cue("s1", "kaise");
  return (
    <SceneShell dur={dur} noExit>
      <Camera dur={dur} punches={[zero, kaise]} push={0.03}>
        <MoneyRoom />
        <HookTitle
          top={300}
          lines={[
            { text: "Ad budget ₹0,", at: -8, kind: "plain", size: 92, rot: -1 },
            { text: "phir bhi 100 order?", at: -6, kind: "green", size: 88, rot: 2 },
          ]}
        />
        <div style={{ position: "absolute", left: 70, top: 640, zIndex: 6 }}>
          <Enter delay={2} from="down">
            <OrderBar w={940} />
          </Enter>
        </div>
        <Place x={330} y={860} s={0.68} z={5}>
          <Person look={ROHIT} seed="r231" track={[{ at: -100, pose: "shrug", mood: "neutral" }, { at: kaise - 2, pose: "shrug", mood: "shock" }]} />
        </Place>
      </Camera>
      <Sfx at={1} name="whoosh" vol={0.4} />
      <Sfx at={kaise - 2} name="pop" vol={0.45} />
    </SceneShell>
  );
};

/* ===== S2: new brand, ad budget 0, orders 0 ===== */
export const S2Zero: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const naya = cue("s2", "naya");
  const z1 = cue("s2", "zero");
  const z2 = cue("s2", "zero", 2);
  const card = (t: string, at: number) => (
    <div style={{ opacity: interpolate(frame, [at - 8, at], [0, 1], clamp), transform: `scale(${interpolate(frame, [at - 8, at], [0.8, 1], clamp)})` }}>
      <Card style={{ width: 420, padding: "14px 22px 8px", border: `6px solid ${LINE}`, boxShadow: `7px 7px 0 ${LINE}`, textAlign: "center", boxSizing: "border-box" }}>
        <div style={body(28, C.muted)}>{t}</div>
        <div style={big(110, C.red)}>0</div>
      </Card>
    </div>
  );
  return (
    <SceneShell dur={dur} noExit>
      <Camera dur={dur} punches={[z2]} push={0.02}>
        <OfficeWall />
        <div style={{ position: "absolute", left: 80, right: 80, top: 330, display: "flex", justifyContent: "space-between", zIndex: 6 }}>
          {card("AD BUDGET (₹)", z1)}
          {card("ORDERS", z2)}
        </div>
        <NameTag at={naya - 2} name="Rohit" role="NAYA BRAND" style={{ left: 120, top: 720, zIndex: 8 }} />
        <Place x={300} y={780} s={0.78} z={5}>
          <Person look={ROHIT} seed="r232" track={[{ at: -100, pose: "cheer", mood: "grin" }, { at: z2, pose: "shrug", mood: "neutral" }]} />
        </Place>
      </Camera>
      <Sfx at={naya - 2} name="pop" vol={0.4} />
      <Sfx at={z1 - 6} name="tick" vol={0.35} />
      <Sfx at={z2 - 6} name="tick" vol={0.35} />
    </SceneShell>
  );
};

/* ===== S3: first 30 from contacts + WhatsApp status ===== */
export const S3First30: React.FC<{ dur: number }> = ({ dur }) => {
  const tees = cue("s3", "tees");
  const wa = cue("s3", "whatsapp");
  return (
    <SceneShell dur={dur} noExit>
      <Camera dur={dur} punches={[tees]} push={0.02}>
        <MoneyRoom />
        <Enter delay={0} from="none" cfg="snappy" style={{ position: "absolute", left: 0, right: 0, top: 292, display: "flex", justifyContent: "center", zIndex: 8 }}>
          <Chip size={28} bg={C.violet} color={C.white} border={LINE}>
            MAAN LO · EXAMPLE
          </Chip>
        </Enter>
        <div style={{ position: "absolute", left: 70, top: 380, zIndex: 6 }}>
          <OrderBar a={tees} w={940} />
        </div>
        <div style={{ position: "absolute", left: 120, top: 640, zIndex: 6 }}>
          <Enter delay={wa - 10} from="left">
            <Phone w={330} h={560} title="WhatsApp Status">
              <Bubble at={wa - 4}>Naya serum launch! 🎉</Bubble>
              <Bubble at={wa + 4} me>Mujhe bhi bhejo!</Bubble>
              <Bubble at={wa + 12} me>2 chahiye</Bubble>
            </Phone>
          </Enter>
        </div>
        <div style={{ position: "absolute", left: 520, top: 700, zIndex: 7 }}>
          <Enter delay={tees - 4} from="right">
            <Card style={{ padding: "14px 22px 8px", border: `6px solid ${LINE}`, boxShadow: `7px 7px 0 ${LINE}`, textAlign: "center" }}>
              <div style={big(110, C.green)}>+30</div>
              <div style={body(26)}>contacts + status</div>
            </Card>
          </Enter>
        </div>
      </Camera>
      <Sfx at={tees - 4} name="ding" vol={0.4} />
      <Sfx at={wa - 4} name="pop" vol={0.35} />
    </SceneShell>
  );
};

/* ===== S4: +40 from 5 small creators, +30 from one marketplace ===== */
export const S4Rest: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const forty = cue("s4", "chaalees");
  const five = cue("s4", "paanch");
  const tees = cue("s4", "tees");
  const mk = cue("s4", "marketplace");
  const box = (t: string, sub: string, n: string, col: string, at: number) => (
    <div style={{ opacity: interpolate(frame, [at - 8, at], [0, 1], clamp), transform: `translateY(${interpolate(frame, [at - 8, at], [40, 0], clamp)}px)` }}>
      <Card style={{ width: 440, padding: "14px 20px 10px", border: `6px solid ${LINE}`, boxShadow: `7px 7px 0 ${LINE}`, boxSizing: "border-box" }}>
        <div style={big(84, col)}>{n}</div>
        <div style={big(40)}>{t}</div>
        <div style={body(24, C.muted)}>{sub}</div>
      </Card>
    </div>
  );
  return (
    <SceneShell dur={dur} noExit>
      <Camera dur={dur} punches={[forty, tees]} push={0.02}>
        <MoneyRoom />
        <div style={{ position: "absolute", left: 70, top: 320, zIndex: 6 }}>
          <OrderBar a={-100} b={forty} c={tees} w={940} />
        </div>
        <div style={{ position: "absolute", left: 70, right: 70, top: 560, display: "flex", justifyContent: "space-between", zIndex: 6 }}>
          {box("5 chhote creators", "product bheja, paise nahi", "+40", C.violet, forty)}
          {box("1 marketplace", "listing se", "+30", "#C98A00", tees)}
        </div>
        <div style={{ position: "absolute", left: 90, top: 880, display: "flex", gap: 14, zIndex: 5 }}>
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} style={{ opacity: interpolate(frame, [five + i * 3, five + i * 3 + 6], [0, 1], clamp), transform: `translateY(${interpolate(frame, [five + i * 3, five + i * 3 + 6], [-60, 0], clamp)}px)` }}>
              <Parcel w={96} ribbon />
            </div>
          ))}
        </div>
        <div style={{ position: "absolute", left: 640, top: 1000, zIndex: 9 }}>
          <Stamp at={mk + 10} text="100 ✓" size={80} rotate={-8} color={C.green} />
        </div>
        <Confetti at={mk + 10} x={540} y={700} />
      </Camera>
      <Sfx at={forty - 4} name="pop" vol={0.4} />
      <Sfx at={tees - 4} name="pop" vol={0.4} />
      <Sfx at={mk + 10} name="ding" vol={0.5} />
    </SceneShell>
  );
};

/* ===== S5: Doctor's three steps ===== */
export const S5Fixes: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const a = cue("s5", "aapko");
  const b = cue("s5", "paanch");
  const c = cue("s5", "marketplace");
  const marks = [a, b, c];
  const poses: PoseKey[] = [
    { at: -100, pose: "one" },
    { at: b - 6, pose: "two" },
    { at: c - 6, pose: "three" },
  ];
  const fixes = ["Pehle unse becho jo aapko jaante hain", "1 bade ki jagah 5 chhote creators", "1 marketplace listing, bharose ke liye"];
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
            <div style={{ background: C.lavenderSoft, borderRadius: 14, padding: "10px 16px 6px", ...body(28, C.violetDeep) }}>₹0 ad budget · pehle 100 order</div>
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
    <rect x={10} y={8} width={72} height={78} rx={10} fill={C.white} stroke={LINE} strokeWidth={5} />
    {[0, 1, 2, 3].map((i) => (
      <g key={i}>
        <rect x={20} y={20 + i * 16} width={11} height={11} rx={3} fill={i < 2 ? C.green : C.lavender} stroke={LINE} strokeWidth={2} />
        <rect x={38} y={23 + i * 16} width={34} height={6} rx={3} fill={C.violet} />
      </g>
    ))}
  </svg>
);

export const S6Cta: React.FC<{ dur: number }> = ({ dur }) => {
  const kw = cue("s6", "start");
  const gift = cue("s6", "sau");
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
          keyword="START"
          typeAt={kw - 8}
          giftAt={gift - 10}
          giftTitle="Pehle 100 order ki checklist"
          giftSub="free · ₹0 ad budget wale steps"
          giftIcon={<ListIcon />}
          nextAt={kal}
          nextNum="#24"
          nextLabel="KAL DOPAHAR 1 BAJE · AGLA CASE"
          next={
            <div style={{ fontFamily: theme.fonts.display, fontWeight: 700, fontSize: 54, lineHeight: 1.12, color: LINE, textAlign: "center" }}>
              20 product, bik raha
              <br />
              <span style={{ color: C.red }}>sirf 1</span>. Kyun?
            </div>
          }
          followAt={follow}
        />
        <Place x={250} y={1010} s={0.96} z={4}>
          <Doctor poses={poses} mouth={sceneMouth("s6")} brows={[kw, kal]} caseTag={TAG} />
        </Place>
      </Camera>
      {Array.from({ length: 4 }).map((_, i) => (
        <Sfx key={i} at={kw - 8 + i * 2} name="key" vol={0.4} />
      ))}
      <Sfx at={gift - 14} name="pop" vol={0.5} />
      <Sfx at={kal - 4} name="whoosh" vol={0.45} />
      <Sfx at={follow + 12} name="pop" vol={0.55} />
      <Sfx at={follow + 15} name="ding" vol={0.45} />
    </SceneShell>
  );
};
