// CASE #30 WORDS — cartoon look (remade 7 Nov 2026 from the dark-blue version; same script and voice).
import React from "react";
import { useCurrentFrame } from "remotion";
import { Person, PRIYA, ROHIT } from "../../components/Cartoon";
import { Camera } from "../../components/fx";
import { HookTitle, LINE, Place, makeMouth } from "../../components/format";
import { Chip, SceneShell, Sfx } from "../../components/kit";
import { QMarks, Stars } from "../../components/props";
import { MoneyRoom } from "../../components/sets";
import { CtaScene, FixBoard, Panel, Pop, Verdict, big, body, ramp } from "../../components/toon";
import { Stamp } from "../../components/widgets";
import { C } from "../../theme";
import { T, cue } from "./timeline";

const sceneMouth = makeMouth(T);
const TAG = "CASE #30";

/** Speech bubble with a tail pointing down-left or down-right. */
export const Say: React.FC<{ children: React.ReactNode; tail?: "left" | "right"; bg?: string; w?: number }> = ({ children, tail = "left", bg = C.white, w }) => (
  <div style={{ position: "relative", width: w, background: bg, border: `6px solid ${LINE}`, borderRadius: 28, padding: "18px 26px 12px", boxShadow: `6px 6px 0 ${LINE}`, ...big(46), whiteSpace: "normal", lineHeight: 1.1 }}>
    {children}
    <svg width={60} height={50} viewBox="0 0 60 50" style={{ position: "absolute", bottom: -44, [tail]: 40, overflow: "visible" }}>
      <path d={tail === "left" ? "M4 0 L14 44 L40 0" : "M56 0 L46 44 L20 0"} fill={bg} stroke={LINE} strokeWidth={6} strokeLinejoin="round" />
      <rect x={tail === "left" ? 8 : 22} y={-10} width={30} height={14} fill={bg} />
    </svg>
  </div>
);

/* ===== S1: hook ===== */
export const S1Hook: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useCurrentFrame();
  const prem = cue("s1", "premium quality");
  const baal = cue("s1", "baal");
  const kaun = cue("s1", "kaun");
  return (
    <SceneShell dur={dur} noExit>
      <Camera dur={dur} punches={[kaun]} push={0.03}>
        <MoneyRoom />
        <HookTitle
          top={300}
          lines={[
            { text: "Aap vs customer ke shabd,", at: -8, kind: "plain", size: 64, rot: -1 },
            { text: "kaun bechega?", at: -6, kind: "violet", size: 100, rot: 2 },
          ]}
        />
        <Pop at={prem - 2} style={{ position: "absolute", left: 60, top: 600, zIndex: 8 }}>
          <Say w={420}>"Premium quality"</Say>
        </Pop>
        <Pop at={baal - 2} style={{ position: "absolute", left: 560, top: 600, zIndex: 8 }}>
          <Say w={440} tail="right" bg="#E3F6EA">
            "Baal girna band hua!"
          </Say>
        </Pop>
        <Place x={60} y={800} s={0.7} z={5}>
          <Person look={ROHIT} seed="r301" track={[{ at: -100, pose: "megaphone", mood: "happy" }, { at: kaun, pose: "shrug", mood: "neutral" }]} />
        </Place>
        <Place x={650} y={800} s={0.7} z={5}>
          <Person look={PRIYA} seed="p301" track={[{ at: -100, pose: "idle", mood: "neutral" }, { at: baal, pose: "cheer", mood: "grin" }]} />
        </Place>
        <div style={{ position: "absolute", left: 470, top: 960, zIndex: 9, ...big(80, C.violet), opacity: ramp(f, kaun - 6, kaun + 2) }}>VS</div>
        <div style={{ position: "absolute", left: 500, top: 820, zIndex: 9 }}>
          <QMarks at={kaun} />
        </div>
      </Camera>
      <Sfx at={1} name="whoosh" vol={0.4} />
      <Sfx at={prem - 4} name="pop" vol={0.35} />
      <Sfx at={baal - 4} name="pop" vol={0.35} />
      <Sfx at={kaun - 2} name="ding" vol={0.35} />
    </SceneShell>
  );
};

/* ===== S2: Rohit's ad words ===== */
export const S2AdWords: React.FC<{ dur: number }> = ({ dur }) => {
  const words = [
    { t: "PREMIUM", at: cue("s2", "premium"), rot: -6, c: C.violet },
    { t: "NATURAL", at: cue("s2", "natural"), rot: 4, c: C.green },
    { t: "BEST QUALITY", at: cue("s2", "best"), rot: -3, c: "#F5A25D" },
  ];
  return (
    <SceneShell dur={dur} noExit>
      <Camera dur={dur} push={0.02}>
        <MoneyRoom />
        <div style={{ position: "absolute", left: 0, right: 0, top: 300, display: "flex", justifyContent: "center", zIndex: 8 }}>
          <Chip size={30} bg={C.white} color={LINE} border={LINE}>
            ROHIT KE AD MEIN
          </Chip>
        </div>
        <div style={{ position: "absolute", left: 80, top: 420, display: "flex", flexDirection: "column", gap: 34, zIndex: 6 }}>
          {words.map((w) => (
            <Pop key={w.t} at={w.at}>
              <div style={{ ...big(76, C.white), background: w.c, border: `6px solid ${LINE}`, borderRadius: 20, padding: "12px 30px 2px", boxShadow: `7px 7px 0 ${LINE}`, transform: `rotate(${w.rot}deg)`, display: "inline-block" }}>{w.t}</div>
            </Pop>
          ))}
        </div>
        <Place x={620} y={720} s={0.8} z={5}>
          <Person look={ROHIT} seed="r302" track={[{ at: -100, pose: "megaphone", mood: "shout" }]} />
        </Place>
      </Camera>
      {words.map((w, i) => (
        <Sfx key={i} at={w.at - 4} name="pop" vol={0.35} />
      ))}
    </SceneShell>
  );
};

/* ===== S3: Priya's review ===== */
export const S3Review: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useCurrentFrame();
  const review = cue("s3", "review");
  const teen = cue("s3", "teen");
  const kam = cue("s3", "baal");
  const hl = (a: number) => ({ background: `linear-gradient(transparent 55%, rgba(255,214,0,${0.85 * ramp(f, a - 2, a + 8)}) 55%)` });
  return (
    <SceneShell dur={dur} noExit>
      <Camera dur={dur} push={0.02}>
        <MoneyRoom />
        <div style={{ position: "absolute", left: 0, right: 0, top: 300, display: "flex", justifyContent: "center", zIndex: 8 }}>
          <Chip size={30} bg={C.green} border={LINE}>
            PRIYA KA REVIEW
          </Chip>
        </div>
        <Pop at={review} style={{ position: "absolute", left: 90, top: 410, zIndex: 6 }}>
          <Panel style={{ width: 900, padding: "26px 34px" }}>
            <Stars size={56} at={review} />
            <div style={{ ...big(62), whiteSpace: "normal", lineHeight: 1.2, marginTop: 14 }}>
              "<span style={hl(teen)}>Teen hafte mein</span> <span style={hl(kam)}>baal girna kam hua.</span>"
            </div>
            <div style={{ ...body(28, C.muted), marginTop: 12 }}>— Priya, verified buyer</div>
          </Panel>
        </Pop>
        <Place x={330} y={820} s={0.7} z={5}>
          <Person look={PRIYA} seed="p303" track={[{ at: -100, pose: "hold", mood: "happy" }, { at: kam, pose: "cheer", mood: "grin" }]} />
        </Place>
      </Camera>
      <Sfx at={review - 4} name="pop" vol={0.35} />
      <Sfx at={kam} name="ding" vol={0.35} />
    </SceneShell>
  );
};

/* ===== S4: customers search their problem, not your words ===== */
export const S4Search: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useCurrentFrame();
  const aapke = cue("s4", "aapke");
  const nahi = cue("s4", "nahi");
  const problem = cue("s4", "problem");
  const q1 = "premium serum";
  const q2 = "baal girna kaise roke";
  const n1 = Math.round(q1.length * ramp(f, aapke - 4, aapke + 14));
  const n2 = Math.round(q2.length * ramp(f, problem - 8, problem + 14));
  const Bar: React.FC<{ text: string; ok: boolean; show: number }> = ({ text, ok, show }) => (
    <Panel style={{ width: 760, padding: "18px 26px", display: "flex", alignItems: "center", gap: 18 }}>
      <svg width={46} height={46} viewBox="0 0 46 46">
        <circle cx={19} cy={19} r={14} fill="none" stroke={LINE} strokeWidth={6} />
        <path d="M30 30 L42 42" stroke={LINE} strokeWidth={7} strokeLinecap="round" />
      </svg>
      <div style={{ ...big(50), flex: 1, textDecoration: !ok && show > 0.5 ? "line-through" : "none", textDecorationColor: C.red, textDecorationThickness: 6 }}>{text}</div>
      <div style={{ opacity: show }}>
        <Verdict ok={ok} text={ok ? "SEARCH" : "KOI NAHI"} size={24} />
      </div>
    </Panel>
  );
  return (
    <SceneShell dur={dur} noExit>
      <Camera dur={dur} punches={[problem]} push={0.02}>
        <MoneyRoom />
        <div style={{ position: "absolute", left: 160, top: 360, zIndex: 6 }}>
          <Bar text={q1.slice(0, n1) || " "} ok={false} show={ramp(f, nahi - 4, nahi + 4)} />
        </div>
        <Pop at={problem - 8} style={{ position: "absolute", left: 160, top: 560, zIndex: 6 }}>
          <Bar text={q2.slice(0, n2) || " "} ok show={ramp(f, problem + 10, problem + 18)} />
        </Pop>
        <Place x={20} y={760} s={0.78} z={5}>
          <Person look={PRIYA} seed="p304" track={[{ at: -100, pose: "hold", mood: "neutral" }, { at: problem, pose: "hold", mood: "happy" }]} />
        </Place>
        <div style={{ position: "absolute", left: 600, top: 840, zIndex: 9 }}>
          <Stamp at={problem + 22} text="APNI PROBLEM" size={54} rotate={-6} color={C.green} />
        </div>
      </Camera>
      <Sfx at={aapke - 4} name="key" vol={0.3} />
      <Sfx at={nahi} name="error" vol={0.3} />
      <Sfx at={problem - 8} name="key" vol={0.3} />
      <Sfx at={problem + 22} name="stamp" vol={0.4} />
    </SceneShell>
  );
};

/* ===== S5: fixes ===== */
export const S5Fixes: React.FC<{ dur: number }> = ({ dur }) => (
  <FixBoard
    dur={dur}
    tag={TAG}
    mouth={sceneMouth("s5")}
    marks={[cue("s5", "reviews"), cue("s5", "pehli"), cue("s5", "wahi")]}
    sub="customer ke shabd use karo"
    fixes={["Reviews aur DMs se lines copy karo", "Ad ki pehli line mein result", "Wahi shabd product page pe"]}
  />
);

/* ===== S6: CTA ===== */
const SheetIcon: React.FC = () => (
  <svg width={86} height={100} viewBox="0 0 86 100">
    <rect x={3} y={3} width={80} height={94} rx={12} fill={C.violet} stroke={C.navy} strokeWidth={5} />
    <path d="M16 22 H70 M16 38 H70 M16 54 H70 M16 70 H52" stroke={C.white} strokeWidth={6} strokeLinecap="round" />
    <path d="M56 66 L62 74 L74 58" stroke="#2BD46B" strokeWidth={6} fill="none" strokeLinecap="round" />
  </svg>
);

export const S6Cta: React.FC<{ dur: number }> = ({ dur }) => (
  <CtaScene
    dur={dur}
    tag={TAG}
    mouth={sceneMouth("s6")}
    keyword="WORDS"
    typeAt={cue("s6", "words") - 8}
    giftAt={cue("s6", "sheet") - 8}
    giftTitle="Review se Ad Sheet"
    giftSub="free · review ki line → ad ki line"
    giftIcon={<SheetIcon />}
    nextAt={cue("s6", "aaj")}
    nextNum="#31"
    nextLabel="AAJ SHAAM 7 BAJE · AGLA CASE"
    next={
      <>
        <div style={big(52)}>Competitor ke saare ads,</div>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{ ...big(58, C.white), background: C.violet, borderRadius: 16, padding: "8px 20px 0" }}>free mein</div>
          <div style={big(52)}>kaise dekhein?</div>
        </div>
      </>
    }
    followAt={cue("s6", "follow")}
  />
);
