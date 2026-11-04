import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { Burst, Coin, Confetti, Note, Parcel, Person, PRIYA, ROHIT } from "../../components/Cartoon";
import { Doctor, PoseKey } from "../../components/Doctor";
import { Camera } from "../../components/fx";
import { CtaFlow, HookTitle, LINE, Place, makeMouth } from "../../components/format";
import { Card, Chip, Enter, SceneShell, Sfx, clamp, useSpring } from "../../components/kit";
import { Bell, Bottle, Bubble, Calendar, Coupon, FlyTag, NameTag, Phone, QMarks, Scale, Stars } from "../../components/props";
import { Clinic, Dispatch, Doorstep, MoneyRoom, PackTable, Whiteboard } from "../../components/sets";
import { Stamp } from "../../components/widgets";
import { C, theme } from "../../theme";
import { T, cue } from "./timeline";

const sceneMouth = makeMouth(T);
const TAG = "CASE #04";

const money = (n: number) => `${n < 0 ? "−" : "+"}₹${Math.abs(Math.round(n))}`;

/* ===== S1: hook — ₹150 loss on every new customer, still in profit ===== */
export const S1Hook: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const phir = cue("s1", "phir");
  const rohit = cue("s1", "rohit");
  const profit = cue("s1", "profit");
  const kaise = cue("s1", "kaise");
  const starts = [0, 30, 60, 90, 120, 150];
  return (
    <SceneShell dur={dur} noExit>
      <Camera dur={dur} punches={[4, kaise]} push={0.035}>
        <Dispatch />
        {/* parcels leaving, each dropping a −₹150 */}
        {starts.map((s0, i) => {
          const p = interpolate(frame, [s0, s0 + 46], [0, 1], { ...clamp, easing: theme.ease.inOut });
          const x = 430 + p * 720;
          const tagT = frame - (s0 + 14);
          return (
            <React.Fragment key={i}>
              {p > 0 && p < 1 && (
                <div style={{ position: "absolute", left: x, top: 1072, zIndex: 3 }}>
                  <Parcel w={150} />
                </div>
              )}
              {tagT >= 0 && tagT < 44 && (
                <div style={{ position: "absolute", left: 430 + interpolate(s0 + 14, [s0, s0 + 46], [0, 720], clamp) + 10, top: 1010 - tagT * 5, opacity: interpolate(tagT, [0, 4, 32, 44], [0, 1, 1, 0], clamp), transform: `scale(${interpolate(tagT, [0, 6], [0.6, 1], clamp)})`, zIndex: 9, fontFamily: theme.fonts.display, fontWeight: 700, fontSize: 66, color: C.red, WebkitTextStroke: `9px ${C.white}`, paintOrder: "stroke" }}>
                  −₹150
                </div>
              )}
            </React.Fragment>
          );
        })}
        <Place x={-10} y={660} s={1.05} z={4}>
          <Person
            look={ROHIT}
            seed="h1"
            track={[
              { at: -100, pose: "wave", mood: "grin" },
              { at: profit - 2, pose: "cheer", mood: "grin" },
              { at: kaise - 2, pose: "shrug", mood: "happy" },
            ]}
          />
        </Place>
        <div style={{ position: "absolute", inset: 0, zIndex: 5 }}>
          <PackTable />
        </div>
        <div style={{ position: "absolute", left: 300, top: 640, zIndex: 13 }}>
          <QMarks at={kaise} />
        </div>
        <NameTag at={rohit - 2} name="ROHIT" role="FOUNDER" style={{ left: 60, top: 1250, zIndex: 13 }} />
        <HookTitle
          top={276}
          lines={[
            { text: "Har naye customer pe", at: 0, size: 62 },
            { text: "₹150 LOSS", at: 3, kind: "red", size: 132 },
            {
              text: (
                <span>
                  phir bhi <span style={{ background: C.green, color: C.white, borderRadius: 18, padding: "4px 18px 0", border: `5px solid ${LINE}`, WebkitTextStroke: "0px transparent", display: "inline-block", transform: "rotate(-2deg)" }}>PROFIT?</span>
                </span>
              ),
              at: phir - 2,
              size: 70,
            },
          ]}
        />
      </Camera>
      <Sfx at={0} name="whoosh" vol={0.45} />
      <Sfx at={2} name="stamp" vol={0.8} />
      {starts.map((s0, i) => (
        <Sfx key={i} at={s0 + 12} name="tick" vol={0.3} />
      ))}
      <Sfx at={phir - 3} name="pop" vol={0.55} />
      <Sfx at={profit} name="ding" vol={0.45} />
      <Sfx at={kaise - 2} name="bass" vol={0.6} />
    </SceneShell>
  );
};

/* ===== S2: first order on a scale — ad ₹400 vs ₹250 earned ===== */
const NotePile: React.FC<{ n: number; at: number; coins?: number }> = ({ n, at, coins = 0 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <div style={{ position: "relative", width: 240, height: 75 + (n - 1) * 13 }}>
      {Array.from({ length: n }).map((_, i) => {
        const p = spring({ frame: frame - at - i * 3, fps, config: theme.spring.snappy });
        if (frame < at + i * 3 - 1) return null;
        return (
          <div key={i} style={{ position: "absolute", left: 40 + (i % 2) * 8, bottom: i * 13, transform: `translateY(${(1 - p) * -260}px)`, opacity: interpolate(p, [0, 0.3], [0, 1], clamp) }}>
            <Note w={150} rot={i % 2 ? 3 : -3} />
          </div>
        );
      })}
      {Array.from({ length: coins }).map((_, i) => {
        const p = spring({ frame: frame - at - (n + i) * 3, fps, config: theme.spring.snappy });
        if (frame < at + (n + i) * 3 - 1) return null;
        return (
          <div key={`c${i}`} style={{ position: "absolute", left: 160 + i * 12, bottom: n * 13 + 30 + i * 12, transform: `translateY(${(1 - p) * -260}px)` }}>
            <Coin size={54} />
          </div>
        );
      })}
    </div>
  );
};

const PanLabel: React.FC<{ at: number; chip: string; amount: string; color: string }> = ({ at, chip, amount, color }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame: frame - at, fps, config: theme.spring.bouncy });
  if (frame < at - 1) return null;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4, transform: `scale(${p})`, marginBottom: 6 }}>
      <Chip size={24} bg={color}>
        {chip}
      </Chip>
      <div style={{ fontFamily: theme.fonts.display, fontWeight: 700, fontSize: 84, lineHeight: 1.05, color, WebkitTextStroke: `8px ${C.white}`, paintOrder: "stroke" }}>{amount}</div>
    </div>
  );
};

export const S2Scale: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const ad = cue("s2", "ad");
  const r400 = cue("s2", "₹400");
  const order = cue("s2", "order");
  const r250 = cue("s2", "₹250");
  const pehla = cue("s2", "pehla");
  const minus = cue("s2", "minus");
  const swing = { damping: 7, stiffness: 80, mass: 1 };
  const tilt = 17 * spring({ frame: frame - r400 - 4, fps, config: swing }) - 10 * spring({ frame: frame - r250 - 4, fps, config: swing });
  const board = useSpring(pehla - 4, "slam");
  return (
    <SceneShell dur={dur} noExit>
      <Camera dur={dur} punches={[pehla]} push={0.025}>
        <MoneyRoom />
        <div style={{ position: "absolute", left: 0, right: 0, top: 286, display: "flex", justifyContent: "center" }}>
          <Chip size={26} bg={C.lavenderSoft} color={C.violetDeep}>
            EXAMPLE · EK NAYA CUSTOMER
          </Chip>
        </div>
        <div style={{ position: "absolute", left: 90, top: 452 }}>
          <Scale
            tilt={tilt}
            left={
              <>
                <PanLabel at={ad - 2} chip="AD KHARCHA" amount="₹400" color={C.violet} />
                <NotePile n={4} at={r400 - 4} />
              </>
            }
            right={
              <>
                <PanLabel at={order - 2} chip="ORDER SE BACHAT" amount="₹250" color={C.green} />
                <NotePile n={2} coins={2} at={r250 - 4} />
              </>
            }
          />
        </div>
        {frame >= pehla - 5 && (
          <div style={{ position: "absolute", left: 0, right: 0, top: 360, display: "flex", justifyContent: "center", zIndex: 8 }}>
            <div style={{ transform: `scale(${interpolate(board, [0, 1], [1.8, 1])}) rotate(-2deg)`, opacity: interpolate(board, [0, 0.3], [0, 1], clamp), display: "flex", alignItems: "center", gap: 22, background: C.white, border: `7px solid ${LINE}`, boxShadow: `8px 8px 0 ${LINE}`, borderRadius: 26, padding: "16px 30px 8px" }}>
              <div style={{ fontFamily: theme.fonts.display, fontWeight: 700, fontSize: 52, color: LINE }}>Pehla order:</div>
              <div style={{ fontFamily: theme.fonts.display, fontWeight: 700, fontSize: 84, color: C.red }}>−₹150</div>
            </div>
          </div>
        )}
        <Place x={-30} y={1118} s={0.6} z={10}>
          <Person
            look={ROHIT}
            seed="h2"
            track={[
              { at: -100, pose: "idle", mood: "neutral" },
              { at: minus - 4, pose: "idle", mood: "happy" },
            ]}
          />
        </Place>
        <Burst at={minus} text="Chalega!" color={C.violet} size={44} rot={-5} style={{ left: 210, top: 1110, zIndex: 11 }} />
      </Camera>
      <Sfx at={ad - 4} name="pop" vol={0.45} />
      <Sfx at={r400 - 2} name="swish" vol={0.4} />
      <Sfx at={r400 + 6} name="bass" vol={0.45} />
      <Sfx at={order - 4} name="pop" vol={0.45} />
      <Sfx at={r250 - 2} name="swish" vol={0.4} />
      <Sfx at={pehla - 4} name="stamp" vol={0.6} />
      <Sfx at={minus} name="pop" vol={0.45} />
    </SceneShell>
  );
};

/* ===== Running total board used in S3/S4 ===== */
const BOARD = { x: 60, y: 278, w: 960 };
const slotCenter = (i: number): [number, number] => [BOARD.x + 30 + 88 + i * 190, BOARD.y + 128];

type Slot = { v?: number; at?: number; missed?: number };
const Hisaab: React.FC<{ slots: Slot[]; total: number; totalPulse?: number; stamp?: React.ReactNode }> = ({ slots, total, totalPulse = -100, stamp }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pulse = spring({ frame: frame - totalPulse, fps, config: theme.spring.bouncy });
  const pk = frame >= totalPulse && frame < totalPulse + 20 ? 1 + 0.12 * Math.sin(Math.PI * Math.min(1, (frame - totalPulse) / 12)) : 1;
  const tc = total < 0 ? C.red : C.green;
  return (
    <div style={{ position: "absolute", left: BOARD.x, top: BOARD.y, width: BOARD.w, height: 210, background: C.white, border: `7px solid ${LINE}`, borderRadius: 28, boxShadow: `8px 8px 0 ${LINE}`, boxSizing: "border-box", zIndex: 8 }}>
      <div style={{ position: "absolute", left: 30, top: -24 }}>
        <Chip size={24} bg={C.violet} border={LINE}>
          PRIYA KA HISAAB
        </Chip>
      </div>
      {slots.map((s, i) => {
        const shown = s.at === undefined || frame >= s.at;
        const missed = s.missed !== undefined && frame >= s.missed;
        const p = s.at === undefined ? 1 : spring({ frame: frame - s.at, fps, config: theme.spring.bouncy });
        const v = s.v ?? 0;
        return (
          <div key={i} style={{ position: "absolute", left: 30 + i * 190, top: 42, width: 176, height: 140, borderRadius: 18, border: `4px ${shown || missed ? "solid" : "dashed"} ${shown && !missed ? (v < 0 ? C.red : C.green) : "rgba(18,4,75,0.25)"}`, background: missed ? "#EEEAF5" : shown ? (v < 0 ? C.redSoft : C.greenSoft) : "transparent", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 2, boxSizing: "border-box" }}>
            <div style={{ fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 20, letterSpacing: "0.08em", color: C.muted }}>ORDER {i + 1}</div>
            <div style={{ fontFamily: theme.fonts.display, fontWeight: 700, fontSize: 50, lineHeight: 1.1, color: missed ? C.muted : v < 0 ? C.red : C.green, transform: `scale(${missed ? 1 : shown ? p : 0})` }}>{missed ? "✗" : shown ? money(v) : ""}</div>
          </div>
        );
      })}
      <div style={{ position: "absolute", right: 28, top: 30, width: 300, display: "flex", flexDirection: "column", alignItems: "center" }}>
        <div style={{ fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 24, letterSpacing: "0.12em", color: C.muted }}>TOTAL</div>
        <div style={{ fontFamily: theme.fonts.display, fontWeight: 700, fontSize: 86, lineHeight: 1.1, color: tc, fontVariantNumeric: "tabular-nums", whiteSpace: "nowrap", transform: `scale(${pk * (0.9 + 0.1 * pulse)})` }}>{money(total)}</div>
      </div>
      {stamp}
    </div>
  );
};

const Hearts: React.FC<{ at: number; x: number; y: number }> = ({ at, x, y }) => {
  const frame = useCurrentFrame();
  return (
    <>
      {[0, 1, 2].map((i) => {
        const t = frame - at - i * 6;
        if (t < 0 || t > 40) return null;
        return (
          <svg key={i} width={70} height={64} viewBox="0 0 70 64" style={{ position: "absolute", left: x + (i - 1) * 80 + Math.sin(t / 5 + i) * 8, top: y - t * 4, opacity: interpolate(t, [0, 4, 30, 40], [0, 1, 1, 0], clamp), transform: `scale(${interpolate(t, [0, 8], [0.4, 1], clamp)})`, zIndex: 9 }}>
            <path d="M35 60 C10 42 2 30 2 18 C2 8 10 2 19 2 C27 2 32 7 35 12 C38 7 43 2 51 2 C60 2 68 8 68 18 C68 30 60 42 35 60 Z" fill={C.red} stroke={LINE} strokeWidth={5} />
          </svg>
        );
      })}
    </>
  );
};

/* ===== S3: Priya comes back — month 2 and 3 ===== */
export const S3Repeat: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const priya = cue("s3", "priya");
  const pasand = cue("s3", "pasand");
  const agle = cue("s3", "agle");
  const wa = cue("s3", "whatsapp");
  const wapas = cue("s3", "wapas");
  const aayi = cue("s3", "aayi");
  const bina = cue("s3", "bina");
  const r250 = cue("s3", "₹250");
  const teesre = cue("s3", "teesre");
  const total = cue("s3", "total");
  const r350 = cue("s3", "₹350");
  const land2 = r250 + 18;
  const land3 = total + 18;
  const tot = -150 + 250 * interpolate(frame, [land2, land2 + 16], [0, 1], { ...clamp, easing: theme.ease.out }) + 250 * interpolate(frame, [land3, land3 + 16], [0, 1], { ...clamp, easing: theme.ease.out });
  const month = frame >= teesre - 2 ? 3 : frame >= agle - 2 ? 2 : 1;
  const since = frame - (month === 3 ? teesre - 2 : month === 2 ? agle - 2 : -100);
  const drop = month === 1 ? -100 : month === 2 ? aayi - 2 : teesre + 6;
  const dp = spring({ frame: frame - drop, fps, config: theme.spring.bouncy });
  const phoneIn = spring({ frame: frame - (wa - 8), fps, config: theme.spring.smooth });
  const phoneOut = interpolate(frame, [teesre - 10, teesre], [0, 1], clamp);
  const peek = useSpring(total - 6, "bouncy");
  const parcelFrom: [number, number] = [560, 960];
  return (
    <SceneShell dur={dur} noExit>
      <Camera dur={dur} punches={[land2, r350]} push={0.025}>
        <Doorstep />
        <div style={{ position: "absolute", left: 48, top: 540 }}>
          <Calendar month={month} since={since} w={176} />
        </div>
        <Place x={330} y={560} s={0.95} z={4}>
          <Person
            look={PRIYA}
            seed="p3"
            track={[
              { at: -100, pose: "hold", mood: "happy" },
              { at: pasand, pose: "hold", mood: "grin" },
            ]}
            prop={
              <g transform={`translate(110 ${360 - (1 - dp) * 380})`}>
                <foreignObject x={0} y={0} width={240} height={220}>
                  <Parcel w={200} />
                </foreignObject>
              </g>
            }
          />
        </Place>
        <Hearts at={pasand} x={500} y={560} />
        <NameTag at={priya - 2} name="PRIYA" role="CUSTOMER" color="#178A7C" style={{ left: 40, top: 800, zIndex: 9 }} />
        {frame >= wa - 9 && phoneOut < 1 && (
          <div style={{ position: "absolute", left: 752, top: 560, zIndex: 7, opacity: 1 - phoneOut, transform: `translateX(${(1 - phoneIn) * 420}px) rotate(${3 * phoneIn}deg)` }}>
            <Phone w={290} h={470}>
              <Bubble at={wa - 2} size={22}>
                Priya ji, refill chahiye?
              </Bubble>
              <Bubble at={wapas} me size={22}>
                Haan, bhejo!
              </Bubble>
              <Bubble at={aayi + 2} size={22}>
                <span style={{ color: C.green }}>Order #2 confirmed</span>
              </Bubble>
            </Phone>
          </div>
        )}
        {frame >= bina - 4 && frame < teesre - 4 && (
          <Enter delay={bina - 2} from="none" scaleFrom={0.5} cfg="snappy" style={{ position: "absolute", left: 742, top: 1052, zIndex: 9 }}>
            <Chip size={30} bg={C.green} border={LINE}>
              AD KHARCHA ₹0
            </Chip>
          </Enter>
        )}
        <Hisaab slots={[{ v: -150 }, { v: 250, at: land2 }, { v: 250, at: land3 }]} total={tot} totalPulse={frame >= land3 ? land3 : land2} />
        <FlyTag at={r250} len={18} from={parcelFrom} to={slotCenter(1)} arc={220}>
          <div style={{ fontFamily: theme.fonts.display, fontWeight: 700, fontSize: 72, color: C.green, WebkitTextStroke: `9px ${C.white}`, paintOrder: "stroke" }}>+₹250</div>
        </FlyTag>
        <FlyTag at={total} len={18} from={parcelFrom} to={slotCenter(2)} arc={220}>
          <div style={{ fontFamily: theme.fonts.display, fontWeight: 700, fontSize: 72, color: C.green, WebkitTextStroke: `9px ${C.white}`, paintOrder: "stroke" }}>+₹250</div>
        </FlyTag>
        <Burst at={r350 + 2} text="₹350 PROFIT!" color={C.green} size={70} rot={-5} style={{ left: 250, top: 516, zIndex: 10 }} />
        <Confetti at={r350 + 2} x={540} y={560} />
        <div style={{ position: "absolute", left: -30, top: 1010, transform: `translateX(${(1 - peek) * -380}px) rotate(6deg) scale(0.66)`, transformOrigin: "0 0", zIndex: 6 }}>
          <Person look={ROHIT} seed="r3" track={[{ at: -100, pose: "cheer", mood: "grin" }]} />
        </div>
      </Camera>
      <Sfx at={priya - 3} name="pop" vol={0.4} />
      <Sfx at={pasand} name="ding" vol={0.35} />
      <Sfx at={agle - 3} name="swish" vol={0.4} />
      <Sfx at={wa - 8} name="whoosh" vol={0.35} />
      <Sfx at={wa - 2} name="pop" vol={0.4} />
      <Sfx at={wapas} name="pop" vol={0.4} />
      <Sfx at={aayi - 2} name="swish" vol={0.4} />
      <Sfx at={land2} name="check" vol={0.5} />
      <Sfx at={teesre - 3} name="swish" vol={0.4} />
      <Sfx at={land3} name="check" vol={0.5} />
      <Sfx at={r350} name="ding" vol={0.55} />
    </SceneShell>
  );
};

/* ===== S4: what if she never came back — then the rule ===== */
export const S4Rule: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const agar = cue("s4", "agar");
  const nahi = cue("s4", "nahi");
  const toh = cue("s4", "toh");
  const loss = cue("s4", "loss");
  const rule = cue("s4", "loss", 2);
  const wapas2 = cue("s4", "wapas", 2);
  const back = interpolate(frame, [agar + 6, nahi + 10], [0, 1], { ...clamp, easing: theme.ease.inOut });
  const tot = 350 - 500 * back;
  const walk = interpolate(frame, [agar + 10, toh + 6], [0, 1], { ...clamp, easing: theme.ease.in });
  const rohitIn = useSpring(toh - 8, "smooth");
  const dim = interpolate(frame, [rule - 8, rule + 2], [0, 0.62], clamp);
  const card = useSpring(rule - 6, "slam");
  const pill = useSpring(wapas2 - 3, "bouncy");
  return (
    <SceneShell dur={dur} noExit>
      <Camera dur={dur} punches={[loss, rule]} push={0.02}>
        <div style={{ position: "absolute", inset: 0, filter: "saturate(0.45) brightness(0.97)" }}>
          <Doorstep />
        </div>
        <Enter delay={agar - 2} from="down" style={{ position: "absolute", left: 0, right: 0, top: 520, display: "flex", justifyContent: "center", zIndex: 9 }}>
          <Chip size={34} bg={LINE}>
            AGAR WAPAS NAHI AAYI?
          </Chip>
        </Enter>
        <Place x={330 + walk * 820} y={620} s={0.95} z={4}>
          <Person look={PRIYA} seed="p4" flip track={[{ at: -100, pose: "wave", mood: "neutral" }]} />
        </Place>
        <div style={{ position: "absolute", left: 40, top: 640, transform: `translateX(${(1 - rohitIn) * -500}px)`, zIndex: 5 }}>
          <Place x={0} y={0} s={0.95}>
            <Person look={ROHIT} seed="r4" track={[{ at: -100, pose: "sad", mood: "sad" }]} />
          </Place>
        </div>
        <Hisaab
          slots={[{ v: -150 }, { v: 250, missed: agar + 14 }, { v: 250, missed: agar + 20 }]}
          total={tot}
          totalPulse={nahi + 10}
          stamp={
            <div style={{ position: "absolute", right: 40, top: 40, zIndex: 3 }}>
              <Stamp at={loss - 2} text="SIRF LOSS" size={74} rotate={-10} />
            </div>
          }
        />
        <AbsoluteFill style={{ background: LINE, opacity: dim, zIndex: 14 }} />
        {frame >= rule - 7 && (
          <div style={{ position: "absolute", left: 60, right: 60, top: 610, display: "flex", justifyContent: "center", zIndex: 15 }}>
            <div style={{ transform: `scale(${interpolate(card, [0, 1], [1.6, 1])})`, opacity: interpolate(card, [0, 0.3], [0, 1], clamp) }}>
              <Card style={{ padding: "34px 44px 30px", display: "flex", flexDirection: "column", alignItems: "center", gap: 10, border: `7px solid ${LINE}`, boxShadow: `10px 10px 0 ${C.violet}` }}>
                <Chip size={30} bg={C.violet}>
                  RULE
                </Chip>
                <div style={{ fontFamily: theme.fonts.display, fontWeight: 700, fontSize: 80, lineHeight: 1.1, color: LINE, textAlign: "center", marginTop: 10 }}>
                  Pehle order ka <span style={{ color: C.red }}>loss</span>
                  <br />
                  tabhi sahi, jab customer
                </div>
                <div style={{ transform: `scale(${pill}) rotate(-3deg)`, background: C.green, color: C.white, fontFamily: theme.fonts.display, fontWeight: 700, fontSize: 96, lineHeight: 1, padding: "20px 34px 4px", borderRadius: 24, border: `7px solid ${LINE}`, marginTop: 8 }}>WAPAS AAYE</div>
              </Card>
            </div>
          </div>
        )}
      </Camera>
      <Sfx at={agar - 4} name="whoosh" vol={0.4} />
      {[0, 1, 2, 3, 4].map((i) => (
        <Sfx key={i} at={agar + 8 + i * 5} name="tick" vol={0.3} />
      ))}
      <Sfx at={agar + 14} name="error" vol={0.3} />
      <Sfx at={loss - 3} name="stamp" vol={0.7} />
      <Sfx at={rule - 8} name="swish" vol={0.45} />
      <Sfx at={rule - 4} name="bass" vol={0.6} />
      <Sfx at={wapas2 - 2} name="ding" vol={0.5} />
    </SceneShell>
  );
};

/* ===== S5: Doctor's 3 ways to bring customers back ===== */
export const S5Fixes: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const teen = cue("s5", "teen");
  const deliv = cue("s5", "delivery");
  const wa = cue("s5", "whatsapp");
  const thank = cue("s5", "thank");
  const parcel = cue("s5", "parcel");
  const coupon = cue("s5", "coupon");
  const product = cue("s5", "product");
  const reminder = cue("s5", "reminder");
  const marks = [deliv, parcel, product];
  const step = frame >= product - 4 ? 3 : frame >= parcel - 4 ? 2 : frame >= deliv - 4 ? 1 : 0;
  const vis = (s: number) => {
    const ins = marks[s - 1] - 4;
    const outs = s < 3 ? marks[s] - 6 : 1e9;
    return Math.min(interpolate(frame, [ins, ins + 10], [0, 1], clamp), interpolate(frame, [outs, outs + 8], [1, 0], clamp));
  };
  const rise = useSpring(coupon - 12, "bouncy");
  const level = interpolate(frame, [product, reminder - 6], [0.95, 0.12], { ...clamp, easing: theme.ease.inOut });
  const note = useSpring(reminder - 4, "bouncy");
  const intro = interpolate(frame, [deliv - 8, deliv - 2], [1, 0], clamp);
  const poses: PoseKey[] = [
    { at: -100, pose: "explain" },
    { at: deliv - 4, pose: "one" },
    { at: parcel - 4, pose: "two" },
    { at: product - 4, pose: "three" },
  ];
  const title = (t: React.ReactNode) => <div style={{ fontFamily: theme.fonts.display, fontWeight: 700, fontSize: 52, lineHeight: 1.08, color: LINE, textAlign: "center" }}>{t}</div>;
  return (
    <SceneShell dur={dur} noExit>
      <Camera dur={dur} push={0.02}>
        <Clinic />
        <Whiteboard style={{ left: 250, top: 300, width: 780, height: 700 }}>
          <div style={{ position: "absolute", left: 30, top: 24, display: "flex", gap: 12, alignItems: "center" }}>
            <Chip size={26} bg={C.green}>
              WAPAS LAAO
            </Chip>
            {[1, 2, 3].map((n) => (
              <div key={n} style={{ width: 44, height: 44, borderRadius: "50%", background: step >= n ? C.violet : C.lavenderSoft, color: step >= n ? C.white : C.violetDeep, fontFamily: theme.fonts.display, fontWeight: 700, fontSize: 26, display: "flex", alignItems: "center", justifyContent: "center", paddingTop: 3, boxSizing: "border-box" }}>
                {n}
              </div>
            ))}
          </div>
          {/* intro */}
          <div style={{ position: "absolute", inset: "110px 30px 30px", opacity: intro, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 20 }}>
            <Enter delay={teen - 6}>{title(<>Customer ko wapas<br />laane ke</>)}</Enter>
            <Enter delay={teen - 2} from="none" scaleFrom={0.4} cfg="bouncy">
              <div style={{ fontFamily: theme.fonts.display, fontWeight: 700, fontSize: 124, lineHeight: 1, color: C.violet, whiteSpace: "nowrap" }}>3 tareeke</div>
            </Enter>
          </div>
          {/* 1: WhatsApp thank you after delivery */}
          <div style={{ position: "absolute", inset: "96px 30px 20px", opacity: vis(1), display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
            {title(<>Delivery ke baad<br />WhatsApp pe thank you</>)}
            <div style={{ display: "flex", alignItems: "center", gap: 26 }}>
              <Phone w={330} h={430}>
                <Bubble at={wa - 2} size={23}>
                  Thank you, Priya! Aise lagao: 2 drops, raat ko.
                </Bubble>
                <Bubble at={thank + 8} me size={23}>
                  Wow, thanks!
                </Bubble>
              </Phone>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
                <Parcel w={210} />
                <Chip size={24} bg={C.green}>
                  DELIVERED ✓
                </Chip>
              </div>
            </div>
          </div>
          {/* 2: coupon inside the parcel */}
          <div style={{ position: "absolute", inset: "96px 30px 20px", opacity: vis(2), display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
            {title(<>Parcel mein agle order ka coupon</>)}
            <div style={{ position: "relative", width: 560, height: 470 }}>
              <div style={{ position: "absolute", left: 90, top: 10 + (1 - rise) * 200, transform: `rotate(${-6 + rise * 4}deg)`, opacity: interpolate(rise, [0, 0.2], [0, 1], clamp) }}>
                <Coupon w={400} />
              </div>
              <div style={{ position: "absolute", left: 140, top: 200 }}>
                <Parcel w={290} />
              </div>
            </div>
          </div>
          {/* 3: reminder before it runs out */}
          <div style={{ position: "absolute", inset: "96px 30px 20px", opacity: vis(3), display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
            {title(<>Khatam hone se pehle reminder</>)}
            <div style={{ position: "relative", width: 700, height: 470 }}>
              <div style={{ position: "absolute", left: 40, top: 40 }}>
                <Bottle level={level} w={210} />
              </div>
              <div style={{ position: "absolute", left: 280, top: 60, transform: `translateX(${(1 - note) * 300}px)`, opacity: interpolate(note, [0, 0.3], [0, 1], clamp) }}>
                <div style={{ width: 410, background: C.white, border: `5px solid ${LINE}`, borderRadius: 26, boxShadow: `6px 6px 0 ${LINE}`, padding: "18px 20px", display: "flex", gap: 14, boxSizing: "border-box" }}>
                  <Bell at={reminder} size={76} />
                  <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                    <div style={{ fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 22, color: C.muted, letterSpacing: "0.06em" }}>DIN 25 · REMINDER</div>
                    <div style={{ fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 30, lineHeight: 1.2, color: LINE }}>Serum khatam hone wala hai? Refill karo</div>
                  </div>
                </div>
              </div>
              <div style={{ position: "absolute", left: 270, top: 300, opacity: interpolate(frame, [product + 6, product + 14], [0, 1], clamp) }}>
                <Chip size={26} bg={C.red}>
                  {level < 0.3 ? "KHATAM HONE WALA" : "ROZ ISTEMAAL"}
                </Chip>
              </div>
            </div>
          </div>
        </Whiteboard>
        <Place x={-120} y={930} s={0.92} z={4}>
          <Doctor poses={poses} mouth={sceneMouth("s5")} brows={[teen, deliv, parcel, product]} caseTag={TAG} />
        </Place>
      </Camera>
      <Sfx at={1} name="whoosh" vol={0.4} />
      <Sfx at={teen - 2} name="pop" vol={0.5} />
      {marks.map((a, i) => (
        <Sfx key={i} at={a - 5} name="swish" vol={0.4} />
      ))}
      <Sfx at={wa - 2} name="pop" vol={0.4} />
      <Sfx at={thank + 8} name="pop" vol={0.4} />
      <Sfx at={coupon - 12} name="riser" vol={0.25} />
      <Sfx at={coupon} name="ding" vol={0.4} />
      <Sfx at={reminder - 2} name="ding" vol={0.45} />
    </SceneShell>
  );
};

/* ===== S6: CTA — comment REPEAT, get 5 messages; tomorrow's case; follow ===== */
const ChatIcon: React.FC = () => (
  <svg width={92} height={92} viewBox="0 0 92 92">
    <path d="M46 6 C24 6 6 22 6 42 C6 52 10 61 17 67 L12 86 L32 76 C36 77 41 78 46 78 C68 78 86 62 86 42 C86 22 68 6 46 6 Z" fill="#25C26A" stroke={LINE} strokeWidth={5} strokeLinejoin="round" />
    <text x={46} y={56} textAnchor="middle" fontFamily="Poppins" fontWeight="700" fontSize="34" fill={C.white}>
      5
    </text>
  </svg>
);

export const S6Cta: React.FC<{ dur: number }> = ({ dur }) => {
  const repeat = cue("s6", "repeat");
  const paanch = cue("s6", "paanch");
  const kal = cue("s6", "kal");
  const star = cue("s6", "5-star");
  const sale = cue("s6", "sale");
  const follow = cue("s6", "follow");
  const poses: PoseKey[] = [
    { at: -100, pose: "point" },
    { at: kal - 2, pose: "explain" },
    { at: follow - 4, pose: "thumbs" },
  ];
  return (
    <SceneShell dur={dur} noExit>
      <Camera dur={dur} punches={[repeat + 4]} push={0.02}>
        <Clinic plus={false} />
        <CtaFlow
          keyword="REPEAT"
          typeAt={repeat - 10}
          giftAt={paanch}
          giftTitle="5 WhatsApp Messages"
          giftSub="free · copy-paste ready"
          giftIcon={<ChatIcon />}
          nextAt={kal}
          nextNum="#05"
          next={
            <>
              <Stars at={star - 4} size={78} />
              <div style={{ fontFamily: theme.fonts.display, fontWeight: 700, fontSize: 62, lineHeight: 1.12, color: LINE, textAlign: "center" }}>
                5-star rating hai,
                <br />
                phir bhi <span style={{ color: C.red }}>sale kam</span> kyun?
              </div>
              <EnterArrow at={sale} />
            </>
          }
          followAt={follow}
        />
        <Place x={250} y={1010} s={0.96} z={4}>
          <Doctor poses={poses} mouth={sceneMouth("s6")} brows={[repeat, kal]} caseTag={TAG} />
        </Place>
      </Camera>
      {Array.from({ length: 6 }).map((_, i) => (
        <Sfx key={i} at={repeat - 10 + i * 2} name="key" vol={0.4} />
      ))}
      <Sfx at={paanch - 6} name="pop" vol={0.5} />
      <Sfx at={kal - 4} name="whoosh" vol={0.45} />
      <Sfx at={star - 2} name="ding" vol={0.35} />
      <Sfx at={follow + 12} name="pop" vol={0.55} />
      <Sfx at={follow + 15} name="ding" vol={0.45} />
    </SceneShell>
  );
};

/** Small red "sales down" chart that draws at `at`. */
const EnterArrow: React.FC<{ at: number }> = ({ at }) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [at - 2, at + 14], [0, 1], { ...clamp, easing: theme.ease.out });
  return (
    <svg width={300} height={90} viewBox="0 0 300 90" style={{ opacity: p > 0 ? 1 : 0 }}>
      <path d="M10 20 L90 34 L160 28 L230 60 L280 78" fill="none" stroke={C.red} strokeWidth={10} strokeLinecap="round" strokeLinejoin="round" strokeDasharray={320} strokeDashoffset={320 * (1 - p)} />
      <path d="M262 62 L284 80 L256 86" fill="none" stroke={C.red} strokeWidth={10} strokeLinecap="round" strokeLinejoin="round" opacity={p > 0.95 ? 1 : 0} />
    </svg>
  );
};
