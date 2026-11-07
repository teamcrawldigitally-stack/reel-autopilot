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
import { T, cue } from "./timeline";

const sceneMouth = makeMouth(T);
const TAG = "CASE #37";
const big = (size: number, color: string = LINE): React.CSSProperties => ({ fontFamily: theme.fonts.display, fontWeight: 700, fontSize: size, lineHeight: 1.05, color, whiteSpace: "nowrap" });
const body = (size: number, color: string = LINE): React.CSSProperties => ({ fontFamily: theme.fonts.body, fontWeight: 800, fontSize: size, color, whiteSpace: "nowrap" });
const WA = "#25D366";

/** 8-day strip from the list day to the sale day; `fill` 0..1 lights days left to right. */
export const DayStrip: React.FC<{ w?: number; fill?: number }> = ({ w = 920, fill = 1 }) => {
  const days = [20, 21, 22, 23, 24, 25, 26, 27];
  const s = (w - 7 * 12) / 8;
  return (
    <div style={{ display: "flex", gap: 12 }}>
      {days.map((d, i) => {
        const on = fill * 8 > i;
        const first = i === 0;
        const last = i === 7;
        const bg = last ? "#121212" : first ? C.green : on ? C.lavenderSoft : C.white;
        return (
          <div key={d} style={{ width: s, height: s * 1.35, background: bg, border: `5px solid ${LINE}`, borderRadius: 16, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", boxShadow: `4px 4px 0 ${LINE}`, boxSizing: "border-box" }}>
            <div style={big(s * 0.42, last ? C.white : LINE)}>{d}</div>
            <div style={body(s * 0.16, last ? "#FFD54A" : first ? LINE : C.muted)}>{last ? "SALE" : first ? "LIST" : "NOV"}</div>
          </div>
        );
      })}
    </div>
  );
};

/** WhatsApp-style chat card. */
const Chat: React.FC<{ w?: number; sent: number; yes: number }> = ({ w = 620, sent, yes }) => (
  <Card style={{ width: w, padding: 0, border: `6px solid ${LINE}`, boxShadow: `8px 8px 0 ${LINE}`, overflow: "hidden" }}>
    <div style={{ background: "#075E54", padding: "14px 20px 10px", ...big(32, C.white) }}>Rohit's Skin · Customers</div>
    <div style={{ background: "#ECE5DD", padding: 20, display: "flex", flexDirection: "column", gap: 14, minHeight: 360 }}>
      <div style={{ alignSelf: "flex-end", maxWidth: w * 0.8, background: "#DCF8C6", border: `3px solid ${LINE}`, borderRadius: 18, padding: "12px 16px 8px", opacity: sent, transform: `translateY(${(1 - sent) * 30}px)`, fontFamily: theme.fonts.display, fontWeight: 700, fontSize: 40, lineHeight: 1.2, color: LINE }}>
        Black Friday early access chahiye? Reply karo <span style={{ color: "#128C7E" }}>YES</span>
      </div>
      {["YES", "YES", "Yes please!"].map((t, i) => {
        const p = interpolate(yes * 3 - i, [0, 1], [0, 1], clamp);
        return (
          <div key={i} style={{ alignSelf: "flex-start", background: C.white, border: `3px solid ${LINE}`, borderRadius: 18, padding: "8px 16px 4px", opacity: p, transform: `translateX(${(1 - p) * -30}px)`, ...big(30) }}>
            {t}
          </div>
        );
      })}
    </div>
  </Card>
);

/* ===== S1: hook ===== */
export const S1Hook: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const saat = cue("s1", "saat");
  const jeeti = cue("s1", "jeeti");
  return (
    <SceneShell dur={dur} noExit>
      <Camera dur={dur} punches={[jeeti]} push={0.03}>
        <MoneyRoom />
        <HookTitle
          top={300}
          lines={[
            { text: "Black Friday ki sale,", at: -8, kind: "plain", size: 80, rot: -1 },
            { text: "7 din pehle jeeto", at: -6, kind: "green", size: 100, rot: 2 },
          ]}
        />
        <div style={{ position: "absolute", left: 80, top: 720, zIndex: 6 }}>
          <DayStrip w={920} fill={interpolate(frame, [saat - 4, saat + 20], [0.15, 1], clamp)} />
        </div>
        <div style={{ position: "absolute", left: 160, top: 640, zIndex: 9 }}>
          <Stamp at={jeeti} text="YAHAN JEETO" size={46} rotate={-8} color={C.green} />
        </div>
      </Camera>
      <Sfx at={1} name="whoosh" vol={0.4} />
      <Sfx at={saat - 4} name="tick" vol={0.35} />
      <Sfx at={jeeti} name="stamp" vol={0.45} />
    </SceneShell>
  );
};

/* ===== S2: WhatsApp message, replies YES ===== */
export const S2WhatsApp: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const wa = cue("s2", "whatsapp");
  const yes = cue("s2", "yes");
  return (
    <SceneShell dur={dur} noExit>
      <Camera dur={dur} punches={[yes]} push={0.02}>
        <MoneyRoom />
        <Enter delay={0} from="none" cfg="snappy" style={{ position: "absolute", left: 0, right: 0, top: 292, display: "flex", justifyContent: "center", zIndex: 8 }}>
          <Chip size={28} bg={WA} color={LINE} border={LINE}>
            SALE SE 7 DIN PEHLE
          </Chip>
        </Enter>
        <div style={{ position: "absolute", left: 360, top: 380, zIndex: 6 }}>
          <Chat w={640} sent={interpolate(frame, [wa - 6, wa + 4], [0, 1], clamp)} yes={interpolate(frame, [yes, yes + 24], [0, 1], clamp)} />
        </div>
        <Place x={-30} y={800} s={0.72} z={5}>
          <Person look={ROHIT} seed="r372" track={[{ at: -100, pose: "hold", mood: "neutral" }, { at: yes + 6, pose: "cheer", mood: "happy" }]} />
        </Place>
      </Camera>
      <Sfx at={wa - 4} name="pop" vol={0.4} />
      {[0, 8, 16].map((d) => (
        <Sfx key={d} at={yes + d} name="pop" vol={0.3} />
      ))}
    </SceneShell>
  );
};

/* ===== S3: 300 said yes, link one day early ===== */
export const S3Early: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const tin = cue("s3", "teen sau");
  const link = cue("s3", "link");
  const ek = cue("s3", "ek");
  const n = Math.round(interpolate(frame, [tin - 4, tin + 16], [0, 300], { ...clamp, easing: theme.ease.out }));
  return (
    <SceneShell dur={dur} noExit>
      <Camera dur={dur} punches={[ek]} push={0.02}>
        <MoneyRoom />
        <Enter delay={0} from="none" cfg="snappy" style={{ position: "absolute", left: 0, right: 0, top: 292, display: "flex", justifyContent: "center", zIndex: 8 }}>
          <Chip size={28} bg={C.violet} color={C.white} border={LINE}>
            MAAN LO · EXAMPLE
          </Chip>
        </Enter>
        <div style={{ position: "absolute", left: 90, top: 400, zIndex: 6, opacity: interpolate(frame, [tin - 8, tin], [0, 1], clamp) }}>
          <Card style={{ width: 420, padding: "18px 26px 12px", border: `6px solid ${LINE}`, boxShadow: `7px 7px 0 ${LINE}`, textAlign: "center", boxSizing: "border-box" }}>
            <div style={body(28, C.muted)}>EARLY ACCESS LIST</div>
            <div style={big(130, C.green)}>{n}</div>
            <div style={big(40)}>log ne YES bola</div>
          </Card>
        </div>
        <div style={{ position: "absolute", left: 560, top: 440, zIndex: 6, opacity: interpolate(frame, [link - 8, link], [0, 1], clamp), transform: `translateX(${interpolate(frame, [link - 8, link + 4], [60, 0], clamp)}px)` }}>
          <Card style={{ width: 430, padding: "16px 22px 12px", border: `6px solid ${LINE}`, boxShadow: `7px 7px 0 ${LINE}`, boxSizing: "border-box" }}>
            <div style={body(26, C.muted)}>26 NOV · SIRF LIST KO</div>
            <div style={{ ...big(44, C.violet), marginTop: 6 }}>Sale ka link</div>
            <div style={{ marginTop: 12, display: "inline-block", background: "#121212", borderRadius: 12, padding: "8px 14px 4px", ...big(32, "#FFD54A") }}>1 din pehle</div>
          </Card>
        </div>
        <div style={{ position: "absolute", left: 90, top: 800, zIndex: 6, opacity: interpolate(frame, [ek - 4, ek + 6], [0, 1], clamp) }}>
          <DayStrip w={900} fill={0} />
        </div>
      </Camera>
      <Sfx at={tin - 4} name="tick" vol={0.35} />
      <Sfx at={link - 6} name="pop" vol={0.4} />
      <Sfx at={ek - 2} name="ding" vol={0.4} />
    </SceneShell>
  );
};

/* ===== S4: 60 orders on day one, no ads ===== */
export const S4Result: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const saath = cue("s4", "saath");
  const bina = cue("s4", "bina ad");
  const naye = cue("s4", "naye");
  const n = Math.round(interpolate(frame, [saath - 4, saath + 16], [0, 60], { ...clamp, easing: theme.ease.out }));
  return (
    <SceneShell dur={dur} noExit>
      <Camera dur={dur} punches={[saath]} push={0.02}>
        <MoneyRoom />
        <div style={{ position: "absolute", left: 90, top: 330, zIndex: 6, opacity: interpolate(frame, [saath - 8, saath], [0, 1], clamp) }}>
          <Card style={{ width: 600, padding: "18px 26px 12px", border: `6px solid ${LINE}`, boxShadow: `7px 7px 0 ${C.green}`, boxSizing: "border-box" }}>
            <div style={body(28, C.muted)}>PEHLA DIN · LIST SE</div>
            <div style={big(124, C.green)}>{n} order</div>
          </Card>
        </div>
        <div style={{ position: "absolute", left: 90, top: 640, display: "flex", flexDirection: "column", gap: 18, zIndex: 7 }}>
          <div style={{ opacity: interpolate(frame, [bina - 6, bina + 2], [0, 1], clamp) }}>
            <Chip size={40} bg={C.white} color={LINE} border={LINE}>
              Ad kharcha · ₹0
            </Chip>
          </div>
          <div style={{ opacity: interpolate(frame, [naye - 6, naye + 2], [0, 1], clamp) }}>
            <Chip size={40} bg={C.violet} color={C.white} border={LINE}>
              Ad ka paisa sirf naye logon pe
            </Chip>
          </div>
        </div>
        <Place x={720} y={800} s={0.68} z={5}>
          <Person look={ROHIT} seed="r374" track={[{ at: -100, pose: "idle", mood: "happy" }, { at: saath, pose: "cheer", mood: "happy" }]} />
        </Place>
      </Camera>
      <Sfx at={saath - 4} name="ding" vol={0.45} />
      <Sfx at={bina - 4} name="pop" vol={0.4} />
      <Sfx at={naye - 4} name="pop" vol={0.4} />
    </SceneShell>
  );
};

/* ===== S5: three steps ===== */
export const S5Fixes: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const a = cue("s5", "early access");
  const b = cue("s5", "purane customers");
  const c = cue("s5", "chaubees");
  const marks = [a, b, c];
  const poses: PoseKey[] = [
    { at: -100, pose: "one" },
    { at: b - 6, pose: "two" },
    { at: c - 6, pose: "three" },
  ];
  const fixes = ["Sale se pehle early access list", "Purane customers ko sabse pehle", "List walon ko 24 ghante pehle sale"];
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
            <div style={{ background: C.lavenderSoft, borderRadius: 14, padding: "10px 16px 6px", ...body(28, C.violetDeep) }}>Black Friday · 7 din pehle se</div>
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
const MsgIcon: React.FC = () => (
  <svg width={92} height={92} viewBox="0 0 92 92">
    <rect x={8} y={8} width={76} height={76} rx={12} fill={WA} stroke={LINE} strokeWidth={5} />
    <path d="M24 30 H68 V58 H40 L28 68 V58 H24 Z" fill={C.white} stroke={LINE} strokeWidth={4} strokeLinejoin="round" />
  </svg>
);

export const S6Cta: React.FC<{ dur: number }> = ({ dur }) => {
  const kw = cue("s6", "list");
  const gift = cue("s6", "templates");
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
          keyword="LIST"
          typeAt={kw - 8}
          giftAt={gift - 6}
          giftTitle="Early Access Message Templates"
          giftSub="free · WhatsApp pe copy-paste karo"
          giftIcon={<MsgIcon />}
          nextAt={kal}
          nextNum="#38"
          nextLabel="KAL DOPAHAR 1 BAJE · AGLA CASE"
          next={
            <div style={{ fontFamily: theme.fonts.display, fontWeight: 700, fontSize: 52, lineHeight: 1.12, color: LINE, textAlign: "center" }}>
              Black Friday ke customer ko
              <br />
              <span style={{ color: C.green }}>dobara</span> kaise bechein?
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
      <Sfx at={gift - 10} name="pop" vol={0.5} />
      <Sfx at={kal - 4} name="whoosh" vol={0.45} />
      <Sfx at={follow + 12} name="pop" vol={0.55} />
      <Sfx at={follow + 15} name="ding" vol={0.45} />
    </SceneShell>
  );
};
