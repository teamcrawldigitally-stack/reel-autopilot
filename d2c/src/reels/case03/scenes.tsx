import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { Burst, Coin, Confetti, Jar, Note, Parcel, Person, Piggy, PRIYA, ROHIT, Truck } from "../../components/Cartoon";
import { Doctor, PoseKey, Shout } from "../../components/Doctor";
import { Camera } from "../../components/fx";
import { CursorIcon } from "../../components/icons";
import { Card, Chip, Enter, SceneShell, Sfx, clamp, useSpring } from "../../components/kit";
import { CommentBox, DmCard, FollowButton, Stamp } from "../../components/widgets";
import { C, theme } from "../../theme";
import { Clinic, Desk, Doorstep, MoneyRoom, OfficeWall, Stage, Whiteboard } from "./sets";
import { FPS, cue, sceneFrames, scenes } from "./timeline";

const mouthAt = (frame: number) => {
  for (const s of scenes) {
    const from = Math.round(s.start * FPS);
    const to = Math.round((s.start + s.dur) * FPS);
    if (frame >= from && frame < to) {
      const m = (s as unknown as { mouth?: number[] }).mouth;
      return m ? m[frame - from] ?? 0 : 0;
    }
  }
  return 0;
};
const sceneMouth = (id: string) => (f: number) => mouthAt(f + sceneFrames(id).from);

const Place: React.FC<{ x: number; y: number; s?: number; children: React.ReactNode; z?: number }> = ({ x, y, s = 1, children, z }) => (
  <div style={{ position: "absolute", left: x, top: y, transform: `scale(${s})`, transformOrigin: "0 0", zIndex: z }}>{children}</div>
);

/* ===== S1: founder shouting for customers, Doctor stops him ===== */
export const S1Office: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const ruko = cue("s1", "ruko");
  const bill = cue("s1", "bill");
  const docIn = interpolate(frame, [ruko - 8, ruko + 4], [1, 0], { ...clamp, easing: theme.ease.out });
  const poses: PoseKey[] = [
    { at: -100, pose: "stop" },
    { at: bill - 6, pose: "point" },
  ];
  return (
    <SceneShell dur={dur} noExit>
      <Camera dur={dur} punches={[ruko]} push={0.03}>
        <OfficeWall />
        <Place x={60} y={430} s={1.22}>
          <Person
            look={ROHIT}
            seed="r1"
            track={[
              { at: -100, pose: "megaphone", mood: "shout" },
              { at: ruko, pose: "shrug", mood: "shock" },
            ]}
          />
        </Place>
        <Desk />
        <Burst at={2} text="AUR CUSTOMERS!" color={C.violet} size={60} style={{ left: 420, top: 300, opacity: frame < ruko ? 1 : 0, zIndex: 7 }} />
        <Place x={560 + docIn * 560} y={760} s={1.0} z={5}>
          <Doctor poses={poses} mouth={sceneMouth("s1")} brows={[ruko, bill]} caseTag="CASE #03" />
        </Place>
        <div style={{ position: "absolute", left: 0, right: 70, top: 470, display: "flex", justifyContent: "flex-end", zIndex: 6 }}>
          <Stamp at={ruko} text="RUKO" size={150} rotate={-8} />
        </div>
        <Burst at={bill - 2} text="BILL BADHAO ↑" color={C.green} size={56} rot={4} style={{ left: 420, top: 680, zIndex: 7 }} />
      </Camera>
      <Sfx at={0} name="whoosh" vol={0.5} />
      <Sfx at={ruko - 9} name="swish" vol={0.5} />
      <Sfx at={ruko - 2} name="stamp" vol={0.9} />
      <Sfx at={bill - 3} name="pop" vol={0.6} />
    </SceneShell>
  );
};

/* ===== S2: same customer, same ad cost, 4x profit? ===== */
export const S2Door: React.FC<{ dur: number }> = ({ dur }) => {
  const cust = cue("s2", "customer");
  const ad = cue("s2", "ad");
  const x4 = cue("s2", "4x");
  const peek = useSpring(x4 - 4, "bouncy");
  return (
    <SceneShell dur={dur} noExit>
      <Camera dur={dur} punches={[x4]} push={0.03}>
        <Doorstep />
        <Place x={330} y={520}>
          <Person
            look={PRIYA}
            seed="p2"
            track={[{ at: -100, pose: "hold", mood: "happy" }]}
            prop={
              <g transform="translate(110 360)">
                <foreignObject x={0} y={0} width={220} height={200}>
                  <Parcel w={200} />
                </foreignObject>
              </g>
            }
          />
        </Place>
        <Enter delay={cust - 2} from="left" style={{ position: "absolute", left: 70, top: 380 }}>
          <Card style={{ padding: "16px 26px", display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{ fontFamily: theme.fonts.display, fontWeight: 700, fontSize: 44, color: C.navy }}>Wahi customer</div>
            <div style={{ fontFamily: theme.fonts.display, fontWeight: 700, fontSize: 48, color: C.violet }}>→</div>
          </Card>
        </Enter>
        <Enter delay={ad - 2} from="right" style={{ position: "absolute", right: 60, top: 520 }}>
          <Card style={{ padding: "16px 26px" }}>
            <div style={{ fontFamily: theme.fonts.display, fontWeight: 700, fontSize: 42, color: C.navy }}>Wahi ad kharcha</div>
          </Card>
        </Enter>
        <Burst at={x4} text="4× PROFIT?" color={C.green} size={96} rot={-5} style={{ left: 190, top: 680, zIndex: 5 }} />
        <div style={{ position: "absolute", left: -20, top: 940, transform: `translateX(${(1 - peek) * -360}px) rotate(8deg) scale(0.74)`, transformOrigin: "0 0", zIndex: 6 }}>
          <Person look={ROHIT} seed="r2" track={[{ at: -100, pose: "shrug", mood: "shock" }]} />
        </div>
      </Camera>
      <Sfx at={cust - 4} name="swish" vol={0.45} />
      <Sfx at={ad - 4} name="swish" vol={0.45} />
      <Sfx at={x4 - 2} name="bass" vol={0.7} />
      <Sfx at={x4} name="ding" vol={0.5} />
    </SceneShell>
  );
};

/* ===== S3: the money table ===== */
const STACK: [number, number] = [610, 470];
const JARS: [number, number][] = [
  [190, 820],
  [540, 820],
  [890, 820],
];

const FlyNotes: React.FC<{ at: number; to: [number, number]; n: number; len?: number }> = ({ at, to, n, len = 18 }) => {
  const frame = useCurrentFrame();
  return (
    <>
      {Array.from({ length: n }).map((_, i) => {
        const t0 = at + i * 3;
        const p = interpolate(frame, [t0, t0 + len], [0, 1], { ...clamp, easing: theme.ease.inOut });
        if (p <= 0 || p >= 1) return null;
        const x = STACK[0] + (to[0] - STACK[0]) * p;
        const y = STACK[1] + (to[1] - STACK[1]) * p - Math.sin(Math.PI * p) * 220;
        return (
          <div key={i} style={{ position: "absolute", left: x - 60, top: y - 30, zIndex: 8 }}>
            <Note w={120} rot={p * 540} />
          </div>
        );
      })}
    </>
  );
};

export const S3Money: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const r600 = cue("s3", "₹600");
  const aadha = cue("s3", "aadha");
  const r300 = cue("s3", "₹300");
  const r250 = cue("s3", "₹250");
  const r50 = cue("s3", "₹50");
  const ab = cue("s3", "ab");
  const combo = cue("s3", "combo");
  const r900 = cue("s3", "₹900");
  const r450 = cue("s3", "₹450");
  const r250b = cue("s3", "₹250", 2);
  const r200 = cue("s3", "₹200");
  const second = frame >= ab;
  const ramp = (a: number, b: number) => interpolate(frame, [a, b], [0, 1], clamp);
  // stack amount
  let stack = 0;
  if (!second) {
    stack = frame < r600 - 2 ? 0 : 600 - 300 * ramp(aadha, aadha + 24) - 250 * ramp(r250 - 2, r250 + 20) - 50 * ramp(r50 - 2, r50 + 14);
  } else {
    stack = frame < r900 - 2 ? 0 : 900 - 450 * ramp(r450 - 4, r450 + 22) - 250 * ramp(r250b - 2, r250b + 20) - 200 * ramp(r200 - 2, r200 + 16);
  }
  const draining = second && frame < ab + 10;
  const drain = draining ? interpolate(frame, [ab, ab + 10], [1, 0], clamp) : 1;
  const jarA = draining ? 300 : second ? 450 * ramp(r450 + 2, r450 + 26) : 300 * ramp(aadha + 6, aadha + 30);
  const jarB = draining ? 250 : second ? 250 * ramp(r250b + 4, r250b + 24) : 250 * ramp(r250 + 4, r250 + 24);
  const jarC = draining ? 50 : second ? 200 * ramp(r200 + 4, r200 + 20) : 50 * ramp(r50 + 4, r50 + 18);
  const notes = Math.max(0, Math.round(stack / 100));
  const stackPop = useSpring(second ? r900 - 2 : r600 - 2, "bouncy");
  const combo2 = useSpring(combo - 2, "bouncy");
  const fmt = (n: number) => `₹${Math.round(n)}`;
  return (
    <SceneShell dur={dur} noExit>
      <Camera dur={dur} punches={[r50, r200]} push={0.02}>
        <MoneyRoom />
        <div style={{ position: "absolute", left: 0, right: 0, top: 300, display: "flex", justifyContent: "center" }}>
          <Chip size={24} bg={C.lavenderSoft} color={C.violetDeep}>
            EXAMPLE · 1 ORDER
          </Chip>
        </div>
        {/* parcel(s) */}
        <Place x={70} y={380}>
          <Parcel w={210} tag={second && frame >= r900 - 2 ? "₹900" : "₹600"} />
        </Place>
        <div style={{ position: "absolute", left: 210, top: 470, transform: `scale(${combo2})`, transformOrigin: "0 100%" }}>
          <Parcel w={170} color="#E9C99A" ribbon />
        </div>
        {/* cash stack */}
        <div style={{ position: "absolute", left: STACK[0] - 90, top: STACK[1] - 40, transform: `scale(${stackPop})`, transformOrigin: "50% 100%" }}>
          <div style={{ position: "absolute", left: 0, top: -120, width: 300, textAlign: "center", fontFamily: theme.fonts.display, fontWeight: 700, fontSize: 92, color: C.navy, fontVariantNumeric: "tabular-nums" }}>
            {stack > 0.5 ? fmt(stack) : ""}
          </div>
          {Array.from({ length: notes }).map((_, i) => (
            <div key={i} style={{ position: "absolute", left: 30 + (i % 2) * 8, top: 120 - i * 14 }}>
              <Note w={220} rot={i % 2 ? 3 : -2} />
            </div>
          ))}
        </div>
        {/* jars */}
        <div style={{ position: "absolute", left: 40, right: 40, top: 700, display: "flex", justifyContent: "space-between", opacity: 1 }}>
          <Jar level={(jarA / 500) * drain} color="#8A80AD" label="Product + Shipping" amount={jarA > 1 && drain > 0.5 ? fmt(jarA) : ""} w={290} />
          <Jar level={(jarB / 500) * drain} color={C.violet} label="Ads" amount={jarB > 1 && drain > 0.5 ? fmt(jarB) : ""} w={290} />
          <Jar level={(jarC / 400) * drain} color={C.green} label="Aapka profit" amount={jarC > 1 && drain > 0.5 ? fmt(jarC) : ""} w={290} />
        </div>
        {frame >= r250b && frame < r200 + 30 && (
          <Enter delay={r250b} from="none" scaleFrom={0.5} style={{ position: "absolute", left: 380, top: 628, zIndex: 9 }}>
            <Chip size={24} bg={C.navy}>
              SAME · CUSTOMER EK HI
            </Chip>
          </Enter>
        )}
        <FlyNotes at={aadha} to={JARS[0]} n={3} />
        <FlyNotes at={r250 - 2} to={JARS[1]} n={3} />
        <FlyNotes at={r50 - 2} to={JARS[2]} n={1} />
        <FlyNotes at={r450 - 4} to={JARS[0]} n={4} />
        <FlyNotes at={r250b - 2} to={JARS[1]} n={3} />
        <FlyNotes at={r200 - 2} to={JARS[2]} n={2} />
        {/* founder reacting */}
        <Place x={-40} y={1150} s={0.7} z={10}>
          <Person
            look={ROHIT}
            seed="r3"
            track={[
              { at: -100, pose: "idle", mood: "neutral" },
              { at: r50 + 4, pose: "sad", mood: "sad" },
              { at: ab, pose: "idle", mood: "neutral" },
              { at: combo, pose: "idle", mood: "happy" },
              { at: r200 + 4, pose: "cheer", mood: "grin" },
            ]}
          />
        </Place>
        <Burst at={r50 + 6} text="Sirf ₹50" color={C.red} size={44} rot={-4} style={{ left: 230, top: 1180, zIndex: 11, opacity: frame < ab ? 1 : 0 }} />
        <Burst at={r200 + 6} text="₹200!" color={C.green} size={56} rot={4} style={{ left: 250, top: 1180, zIndex: 11 }} />
      </Camera>
      <Sfx at={r600 - 4} name="pop" vol={0.5} />
      {[aadha, r250 - 2, r50 - 2, r450 - 4, r250b - 2, r200 - 2].map((a, i) => (
        <Sfx key={i} at={a} name="swish" vol={0.4} />
      ))}
      <Sfx at={r50 + 4} name="error" vol={0.4} />
      <Sfx at={combo - 3} name="pop" vol={0.5} />
      <Sfx at={r900 - 3} name="pop" vol={0.5} />
      <Sfx at={r200 + 4} name="ding" vol={0.5} />
    </SceneShell>
  );
};

/* ===== S4: 100 orders → ₹5,000 vs ₹20,000 ===== */
export const S4Piggy: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const r5k = cue("s4", "₹5,000");
  const r20k = cue("s4", "₹20,000");
  const x4 = cue("s4", "4x");
  const small = useSpring(r5k - 4, "bouncy");
  const big = spring({ frame: frame - r20k + 2, fps, config: theme.spring.bouncy });
  const grow = interpolate(frame, [r20k, r20k + 30], [1, 1.45], { ...clamp, easing: theme.ease.out });
  return (
    <SceneShell dur={dur} noExit>
      <Camera dur={dur} punches={[x4]} push={0.03}>
        <Stage />
        <div style={{ position: "absolute", left: 0, right: 0, top: 300, display: "flex", justifyContent: "center" }}>
          <Chip size={34} bg={C.white} color={C.navy}>
            100 ORDERS
          </Chip>
        </div>
        <div style={{ position: "absolute", left: 70, top: 640, width: 360, display: "flex", flexDirection: "column", alignItems: "center", gap: 10, transform: `scale(${small})` }}>
          <div style={{ fontFamily: theme.fonts.display, fontWeight: 700, fontSize: 76, color: C.white }}>₹5,000</div>
          <div style={{ fontFamily: theme.fonts.body, fontWeight: 700, fontSize: 28, color: C.lavender }}>100 × ₹50</div>
          <Piggy w={260} color="#C9BDE8" />
        </div>
        <div style={{ position: "absolute", left: 500, top: 520, width: 480, display: "flex", flexDirection: "column", alignItems: "center", gap: 10, transform: `scale(${big})`, transformOrigin: "50% 100%" }}>
          <div style={{ fontFamily: theme.fonts.display, fontWeight: 700, fontSize: 96, color: "#7CF0A8" }}>₹20,000</div>
          <div style={{ fontFamily: theme.fonts.body, fontWeight: 700, fontSize: 30, color: C.lavender }}>100 × ₹200</div>
          <div style={{ transform: `scale(${grow})`, transformOrigin: "50% 0%" }}>
            <Piggy w={300} />
          </div>
        </div>
        {Array.from({ length: 10 }).map((_, i) => {
          const t = frame - r20k - i * 3;
          if (t < 0 || t > 26) return null;
          return (
            <div key={i} style={{ position: "absolute", left: 700 + Math.sin(i * 1.7) * 90, top: 280 + t * 22, transform: `rotate(${t * 12}deg)` }}>
              <Coin size={58} />
            </div>
          );
        })}
        <Burst at={x4} text="4×" color={C.green} size={140} rot={-8} style={{ left: 400, top: 900, zIndex: 6 }} />
        <Confetti at={x4} x={540} y={600} />
        <Place x={330} y={1060} s={0.68} z={5}>
          <Person look={ROHIT} seed="r4" track={[{ at: -100, pose: "cheer", mood: "grin" }]} />
        </Place>
      </Camera>
      <Sfx at={r5k - 4} name="pop" vol={0.5} />
      <Sfx at={r20k - 2} name="riser" vol={0.4} />
      {[0, 1, 2, 3, 4].map((i) => (
        <Sfx key={i} at={r20k + i * 4} name="tick" vol={0.35} />
      ))}
      <Sfx at={x4 - 2} name="bass" vol={0.8} />
      <Sfx at={x4} name="ding" vol={0.55} />
    </SceneShell>
  );
};

/* ===== S5: three fixes on the Doctor's whiteboard ===== */
export const S5Fixes: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const combo = cue("s5", "combo");
  const free = cue("s5", "free shipping");
  const avg = cue("s5", "average");
  const aur = cue("s5", "aur");
  const isse = cue("s5", "isse");
  const step = frame >= aur - 4 ? 3 : frame >= free - 4 ? 2 : frame >= combo - 4 ? 1 : 0;
  const vis = (s: number) => {
    const ins = [combo, free, aur][s - 1] - 4;
    const outs = s < 3 ? [free, aur][s - 1] - 6 : 1e9;
    const a = interpolate(frame, [ins, ins + 10], [0, 1], clamp);
    const b = interpolate(frame, [outs, outs + 8], [1, 0], clamp);
    return Math.min(a, b);
  };
  const truck = interpolate(frame, [free + 4, avg + 30], [0, 0.85], { ...clamp, easing: theme.ease.inOut });
  const tap = frame >= isse + 8;
  const total = tap ? 1198 : 799;
  const poses: PoseKey[] = [
    { at: -100, pose: "explain" },
    { at: combo - 4, pose: "one" },
    { at: free - 4, pose: "two" },
    { at: aur - 4, pose: "three" },
  ];
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
          {/* 1: combo */}
          <div style={{ position: "absolute", inset: "100px 30px 30px", opacity: vis(1), display: "flex", flexDirection: "column", alignItems: "center", gap: 18 }}>
            <div style={{ fontFamily: theme.fonts.display, fontWeight: 700, fontSize: 60, color: C.navy }}>Combo banao</div>
            <div style={{ display: "flex", alignItems: "flex-end" }}>
              <Parcel w={200} ribbon />
              <div style={{ marginLeft: -40 }}>
                <Parcel w={170} color="#E9C99A" ribbon />
              </div>
            </div>
            <Burst at={combo + 10} text="2 lo, ₹100 bachao" color={C.red} size={46} rot={-3} style={{ position: "relative" }} />
          </div>
          {/* 2: free shipping limit */}
          <div style={{ position: "absolute", inset: "100px 30px 30px", opacity: vis(2), display: "flex", flexDirection: "column", alignItems: "center", gap: 26 }}>
            <div style={{ fontFamily: theme.fonts.display, fontWeight: 700, fontSize: 54, color: C.navy, textAlign: "center", lineHeight: 1.1 }}>Free shipping limit</div>
            <div style={{ position: "relative", width: 640, height: 150 }}>
              <div style={{ position: "absolute", left: 0, right: 0, top: 96, height: 34, borderRadius: 17, background: C.lavenderSoft, border: `4px solid ${C.navy}` }} />
              <div style={{ position: "absolute", left: 4, top: 100, height: 26, width: `${(0.06 + truck) * 98}%`, borderRadius: 13, background: theme.grad.violet }} />
              <div style={{ position: "absolute", left: `${(0.06 + truck) * 100 - 18}%`, top: 0 }}>
                <Truck w={150} />
              </div>
              <div style={{ position: "absolute", right: -10, top: -6, background: C.green, color: C.white, fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 24, padding: "6px 12px", borderRadius: 10 }}>₹999 FREE</div>
            </div>
            <div style={{ display: "flex", gap: 16, alignItems: "center", opacity: interpolate(frame, [avg - 4, avg + 6], [0, 1], clamp) }}>
              <Chip size={28} bg={C.navy}>
                AVG ORDER ₹850
              </Chip>
              <div style={{ fontFamily: theme.fonts.display, fontWeight: 700, fontSize: 40, color: C.navy }}>→</div>
              <Chip size={28} bg={C.green}>
                LIMIT ₹999
              </Chip>
            </div>
          </div>
          {/* 3: suggest an add-on in cart */}
          <div style={{ position: "absolute", inset: "100px 40px 30px", opacity: vis(3), display: "flex", flexDirection: "column", gap: 18 }}>
            <div style={{ fontFamily: theme.fonts.display, fontWeight: 700, fontSize: 52, color: C.navy }}>Cart mein: isse saath lo</div>
            <Card style={{ padding: "18px 24px", display: "flex", justifyContent: "space-between", fontFamily: theme.fonts.body, fontWeight: 700, fontSize: 32, color: C.navy }}>
              <span>Vitamin C Serum</span>
              <span>₹799</span>
            </Card>
            <div style={{ position: "relative", background: C.lavenderSoft, border: `4px dashed ${C.violet}`, borderRadius: 22, padding: "18px 24px", display: "flex", alignItems: "center", gap: 18 }}>
              <div style={{ fontFamily: theme.fonts.body, fontWeight: 800, fontSize: 30, color: C.violetDeep, flex: 1 }}>+ Toner, saath mein ₹399</div>
              <div style={{ background: tap ? C.green : C.violet, color: C.white, fontFamily: theme.fonts.display, fontWeight: 700, fontSize: 30, padding: "12px 22px 6px", borderRadius: 14 }}>{tap ? "ADDED ✓" : "ADD"}</div>
              <div style={{ position: "absolute", right: 30, top: 50, opacity: interpolate(frame, [isse - 6, isse + 4], [0, 1], clamp), transform: `scale(${frame >= isse + 6 && frame < isse + 10 ? 0.9 : 1})` }}>
                <CursorIcon size={80} />
              </div>
            </div>
            <div style={{ alignSelf: "flex-end", fontFamily: theme.fonts.display, fontWeight: 700, fontSize: 48, color: tap ? C.green : C.navy }}>Bill: ₹{total.toLocaleString("en-IN")}</div>
          </div>
        </Whiteboard>
        <Place x={-120} y={930} s={0.92} z={4}>
          <Doctor poses={poses} mouth={sceneMouth("s5")} brows={[combo, free, aur]} caseTag="CASE #03" />
        </Place>
      </Camera>
      <Sfx at={1} name="whoosh" vol={0.45} />
      {[combo, free, aur].map((a, i) => (
        <Sfx key={i} at={a - 5} name="swish" vol={0.45} />
      ))}
      <Sfx at={combo + 8} name="pop" vol={0.5} />
      <Sfx at={free + 6} name="riser" vol={0.3} />
      <Sfx at={isse + 7} name="check" vol={0.55} />
    </SceneShell>
  );
};

/* ===== S6: CTA ===== */
export const S6Cta: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const combo = cue("s6", "combo");
  const calc = cue("s6", "calculator");
  const kal = cue("s6", "kal");
  const follow = cue("s6", "follow");
  const outA = interpolate(frame, [kal - 6, kal + 2], [0, 1], { ...clamp, easing: theme.ease.in });
  const poses: PoseKey[] = [
    { at: -100, pose: "point" },
    { at: kal - 2, pose: "explain" },
    { at: follow - 4, pose: "thumbs" },
  ];
  return (
    <SceneShell dur={dur} noExit>
      <Camera dur={dur} punches={[combo]} push={0.02}>
        <Clinic />
        {frame < kal + 4 && (
          <div style={{ position: "absolute", inset: 0, opacity: 1 - outA, transform: `translateY(${-60 * outA}px)` }}>
            <Enter delay={0} style={{ position: "absolute", left: 84, top: 330 }}>
              <CommentBox word="COMBO" typeStart={combo - 10} />
            </Enter>
            <Enter delay={calc - 6} from="right" dist={120} style={{ position: "absolute", left: 84, top: 510 }}>
              <DmCard
                title="Combo Ideas + Calculator"
                sub="free · Google Sheet"
                icon={
                  <svg width={86} height={100} viewBox="0 0 86 100">
                    <rect x={6} y={6} width={74} height={88} rx={10} fill={C.white} stroke={C.navy} strokeWidth={5} />
                    <rect x={6} y={6} width={74} height={22} rx={8} fill={C.green} />
                    {[40, 56, 72].map((y) => (
                      <path key={y} d={`M16 ${y} H70`} stroke={C.lavender} strokeWidth={6} />
                    ))}
                    <path d="M40 34 V86" stroke={C.lavender} strokeWidth={4} />
                  </svg>
                }
              />
            </Enter>
          </div>
        )}
        {frame >= kal - 2 && (
          <>
            <div style={{ position: "absolute", left: 84, right: 84, top: 330, display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
              <Enter delay={kal} cfg="snappy">
                <Chip size={34} bg={C.navy}>
                  KAL KA CASE
                </Chip>
              </Enter>
              <Enter delay={kal + 4}>
                <Card style={{ padding: "26px 36px", textAlign: "center" }}>
                  <div style={{ fontFamily: theme.fonts.display, fontWeight: 700, fontSize: 64, lineHeight: 1.1, color: C.navy }}>
                    Pehle order pe <span style={{ color: C.red }}>loss</span>,
                    <br />
                    phir bhi smart?
                  </div>
                </Card>
              </Enter>
            </div>
            <div style={{ opacity: interpolate(frame, [follow - 14, follow - 6], [1, 0], clamp) }}>
              <Place x={720} y={640} s={0.5} z={3}>
                <Person look={ROHIT} seed="r6" track={[{ at: -100, pose: "shrug", mood: "shock" }]} />
              </Place>
            </div>
          </>
        )}
        {frame >= follow - 10 && (
          <div style={{ position: "absolute", left: 0, right: 0, top: 860, zIndex: 6 }}>
            <FollowButton at={follow} />
          </div>
        )}
        <Place x={250} y={1010} s={0.96} z={4}>
          <Doctor poses={poses} mouth={sceneMouth("s6")} brows={[combo, kal]} caseTag="CASE #03" />
        </Place>
      </Camera>
      {Array.from({ length: 5 }).map((_, i) => (
        <Sfx key={i} at={combo - 10 + i * 2} name="key" vol={0.4} />
      ))}
      <Sfx at={calc - 6} name="pop" vol={0.5} />
      <Sfx at={kal - 4} name="whoosh" vol={0.45} />
      <Sfx at={follow + 12} name="pop" vol={0.6} />
      <Sfx at={follow + 15} name="ding" vol={0.45} />
    </SceneShell>
  );
};

export { Shout, AbsoluteFill };
