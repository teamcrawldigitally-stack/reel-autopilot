// CASE #25 AD3 — cartoon look (remade 7 Nov 2026 from the dark-blue version; same script and voice).
import React from "react";
import { useCurrentFrame } from "remotion";
import { Person, PRIYA, ROHIT } from "../../components/Cartoon";
import { Camera } from "../../components/fx";
import { HookTitle, LINE, Place, makeMouth } from "../../components/format";
import { Chip, SceneShell, Sfx } from "../../components/kit";
import { QMarks } from "../../components/props";
import { MoneyRoom } from "../../components/sets";
import { CtaScene, FixBoard, Panel, Pop, Stopwatch, ToonPhone, big, body, ramp } from "../../components/toon";
import { Stamp } from "../../components/widgets";
import { C } from "../../theme";
import { T, cue } from "./timeline";

const sceneMouth = makeMouth(T);
const TAG = "CASE #25";

/** Old ad opening: big logo card. */
const LogoFrame: React.FC<{ w: number }> = ({ w }) => (
  <div style={{ width: w, height: w * 1.2, background: "#F3EEFF", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 12 }}>
    <div style={{ width: w * 0.42, height: w * 0.42, borderRadius: "50%", background: C.violet, border: `5px solid ${LINE}`, display: "flex", alignItems: "center", justifyContent: "center", ...big(w * 0.22, C.white), paddingTop: w * 0.03, boxSizing: "border-box" }}>R</div>
    <div style={body(w * 0.07)}>ROHIT'S HAIR</div>
  </div>
);

/** New ad opening: the problem, written big, with a comb full of hair. */
const ProblemFrame: React.FC<{ w: number }> = ({ w }) => (
  <div style={{ width: w, height: w * 1.2, background: "#FFF1E3", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16 }}>
    <div style={{ ...big(w * 0.12), textAlign: "center", whiteSpace: "normal", lineHeight: 1.1, padding: "0 20px" }}>Baal itne girte hain?</div>
    <svg width={w * 0.6} height={w * 0.3} viewBox="0 0 200 100">
      <rect x={10} y={20} width={180} height={30} rx={10} fill="#F5A25D" stroke={LINE} strokeWidth={5} />
      {Array.from({ length: 14 }).map((_, i) => (
        <rect key={i} x={20 + i * 12} y={48} width={6} height={34} rx={2} fill="#F5A25D" stroke={LINE} strokeWidth={2.5} />
      ))}
      {[30, 60, 95, 130, 160].map((x, i) => (
        <path key={i} d={`M${x} 46 q10 20 -4 40 q-10 14 6 24`} stroke="#2A1A24" strokeWidth={3} fill="none" />
      ))}
    </svg>
  </div>
);

/* ===== S1: hook ===== */
export const S1Hook: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useCurrentFrame();
  const sec = cue("s1", "teen second");
  const skip = cue("s1", "skip");
  const kyun = cue("s1", "kyun");
  const up = ramp(f, skip - 4, skip + 12);
  return (
    <SceneShell dur={dur} noExit>
      <Camera dur={dur} punches={[skip]} push={0.03}>
        <MoneyRoom />
        <HookTitle
          top={300}
          lines={[
            { text: "Pehle 3 second mein", at: -8, kind: "plain", size: 82, rot: -1 },
            { text: "SKIP!", at: -6, kind: "red", size: 120, rot: 3 },
          ]}
        />
        <div style={{ position: "absolute", left: 90, top: 640, zIndex: 6 }}>
          <ToonPhone w={400} h={720}>
            <div style={{ position: "absolute", left: 0, right: 0, top: 50 - up * 700 }}>
              <LogoFrame w={372} />
              <div style={{ height: 600, background: "#EDE8F7" }} />
            </div>
            <div style={{ position: "absolute", left: 16, right: 16, top: 56, height: 10, borderRadius: 5, background: "rgba(18,4,75,0.15)" }}>
              <div style={{ width: `${Math.min(1, f / skip) * 100}%`, height: "100%", borderRadius: 5, background: C.red }} />
            </div>
          </ToonPhone>
        </div>
        <Pop at={sec} style={{ position: "absolute", left: 110, top: 1240, zIndex: 8 }}>
          <Chip size={30} bg={LINE}>
            0:03 · SKIP
          </Chip>
        </Pop>
        <Place x={560} y={700} s={0.8} z={5}>
          <Person
            look={PRIYA}
            seed="p251"
            track={[
              { at: -100, pose: "hold", mood: "neutral" },
              { at: skip, pose: "hold", mood: "sad" },
              { at: kyun, pose: "shrug", mood: "neutral" },
            ]}
          />
        </Place>
        <div style={{ position: "absolute", left: 880, top: 680, zIndex: 9 }}>
          <QMarks at={kyun} />
        </div>
      </Camera>
      <Sfx at={1} name="whoosh" vol={0.4} />
      <Sfx at={skip - 4} name="swish" vol={0.45} />
      <Sfx at={kyun} name="pop" vol={0.3} />
    </SceneShell>
  );
};

/* ===== S2: Rohit's ad opens with logo, then music, then product — Priya is gone ===== */
export const S2Old: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useCurrentFrame();
  const logo = cue("s2", "logo");
  const music = cue("s2", "music");
  const product = cue("s2", "product");
  const aage = cue("s2", "aage");
  const frames = [
    { t: "LOGO", at: logo, sec: "0–2s" },
    { t: "♪ MUSIC", at: music, sec: "2–4s" },
    { t: "PRODUCT", at: product, sec: "4s+" },
  ];
  return (
    <SceneShell dur={dur} noExit>
      <Camera dur={dur} punches={[aage]} push={0.02}>
        <MoneyRoom />
        <div style={{ position: "absolute", left: 0, right: 0, top: 300, display: "flex", justifyContent: "center", zIndex: 8 }}>
          <Chip size={30} bg={C.white} color={LINE} border={LINE}>
            ROHIT KA PURANA AD
          </Chip>
        </div>
        <div style={{ position: "absolute", left: 60, right: 60, top: 400, display: "flex", justifyContent: "space-between", zIndex: 6 }}>
          {frames.map((x, i) => (
            <Pop key={x.t} at={x.at}>
              <Panel style={{ width: 290, height: 300, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 14, transform: `rotate(${(i - 1) * 2}deg)` }} bg={i === 2 ? "#FFF1E3" : C.white}>
                <div style={big(i === 1 ? 50 : 46, i === 0 ? C.violet : LINE)}>{x.t}</div>
                <div style={body(26, C.muted)}>{x.sec}</div>
              </Panel>
            </Pop>
          ))}
        </div>
        <Pop at={aage} style={{ position: "absolute", left: 560, top: 780, zIndex: 9 }}>
          <div style={{ ...big(54, C.white), background: C.red, border: `6px solid ${LINE}`, borderRadius: 999, padding: "10px 28px 2px", boxShadow: `6px 6px 0 ${LINE}`, transform: "rotate(-6deg)" }}>PRIYA GAYI ↑</div>
        </Pop>
        <Place x={120} y={760} s={0.8} z={5}>
          <Person
            look={PRIYA}
            seed="p252"
            track={[
              { at: -100, pose: "hold", mood: "neutral" },
              { at: music, pose: "hold", mood: "sad" },
              { at: aage, pose: "wave", mood: "neutral" },
            ]}
          />
        </Place>
      </Camera>
      {frames.map((x, i) => (
        <Sfx key={i} at={x.at - 4} name="tick" vol={0.3} />
      ))}
      <Sfx at={aage - 4} name="swish" vol={0.45} />
    </SceneShell>
  );
};

/* ===== S3: people don't stop in the feed; the call is made in 3 seconds ===== */
export const S3Decide: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useCurrentFrame();
  const ruk = cue("s3", "ruk");
  const faisla = cue("s3", "faisla");
  const sec = cue("s3", "teen second");
  const p = ramp(f, faisla - 4, sec + 16);
  return (
    <SceneShell dur={dur} noExit>
      <Camera dur={dur} punches={[sec]} push={0.02}>
        <MoneyRoom />
        <Pop at={ruk} style={{ position: "absolute", left: 0, right: 0, top: 300, display: "flex", justifyContent: "center", zIndex: 8 }}>
          <Chip size={32} bg={LINE}>
            FEED MEIN LOG RUKTE NAHI
          </Chip>
        </Pop>
        <Pop at={faisla} style={{ position: "absolute", left: 520, top: 420, zIndex: 6 }}>
          <Stopwatch p={p} s={420} label={`${(p * 3).toFixed(1)}s`} />
        </Pop>
        <Pop at={sec} style={{ position: "absolute", left: 540, top: 920, zIndex: 7 }}>
          <Panel style={{ padding: "14px 26px" }}>
            <div style={big(54)}>Faisla = 3 sec</div>
          </Panel>
        </Pop>
        <Place x={60} y={720} s={0.82} z={5}>
          <Person
            look={PRIYA}
            seed="p253"
            track={[
              { at: -100, pose: "hold", mood: "neutral" },
              { at: faisla, pose: "hold", mood: "neutral" },
            ]}
          />
        </Place>
      </Camera>
      <Sfx at={faisla - 4} name="tick" vol={0.3} />
      <Sfx at={sec + 14} name="ding" vol={0.35} />
    </SceneShell>
  );
};

/* ===== S4: same ad, new opening — Priya stops ===== */
export const S4New: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useCurrentFrame();
  const nayi = cue("s4", "nayi");
  const baal = cue("s4", "baal");
  const ruk = cue("s4", "ruk");
  const inn = ramp(f, nayi - 6, nayi + 10);
  return (
    <SceneShell dur={dur} noExit>
      <Camera dur={dur} punches={[ruk]} push={0.02}>
        <MoneyRoom />
        <Pop at={nayi} style={{ position: "absolute", left: 0, right: 0, top: 300, display: "flex", justifyContent: "center", zIndex: 8 }}>
          <Chip size={32} bg={C.green} border={LINE}>
            WAHI AD · NAYI SHURUAAT
          </Chip>
        </Pop>
        <div style={{ position: "absolute", left: 560, top: 400, zIndex: 6 }}>
          <ToonPhone w={420} h={740}>
            <div style={{ position: "absolute", left: 0, right: 0, top: 50 + (1 - inn) * 700 }}>
              <div style={{ transform: `scale(${1 + 0.04 * Math.sin(Math.PI * ramp(f, baal - 2, baal + 10))})` }}>
                <ProblemFrame w={391} />
              </div>
            </div>
          </ToonPhone>
        </div>
        <div style={{ position: "absolute", left: 120, top: 500, zIndex: 9 }}>
          <Stamp at={ruk} text="RUK GAYI!" size={64} rotate={-8} color={C.green} />
        </div>
        <Place x={40} y={720} s={0.82} z={5}>
          <Person
            look={PRIYA}
            seed="p254"
            track={[
              { at: -100, pose: "hold", mood: "neutral" },
              { at: baal, pose: "hold", mood: "shock" },
              { at: ruk, pose: "cheer", mood: "grin" },
            ]}
          />
        </Place>
      </Camera>
      <Sfx at={nayi - 4} name="swish" vol={0.35} />
      <Sfx at={ruk} name="stamp" vol={0.45} />
    </SceneShell>
  );
};

/* ===== S5: fixes ===== */
export const S5Fixes: React.FC<{ dur: number }> = ({ dur }) => (
  <FixBoard
    dur={dur}
    tag={TAG}
    mouth={sceneMouth("s5")}
    marks={[cue("s5", "problem"), cue("s5", "haath"), cue("s5", "main")]}
    sub="pehle 3 second ka plan"
    fixes={["Problem ya result se shuru karo", "Pehle frame mein haath ya chehra", "Main baat screen pe likho"]}
  />
);

/* ===== S6: CTA ===== */
const LinesIcon: React.FC = () => (
  <svg width={86} height={100} viewBox="0 0 86 100">
    <rect x={3} y={3} width={80} height={94} rx={12} fill={C.violet} stroke={C.navy} strokeWidth={5} />
    <text x={43} y={40} textAnchor="middle" fontFamily="Inter" fontWeight={900} fontSize={22} fill={C.white}>
      20
    </text>
    {[0, 1, 2].map((r) => (
      <rect key={r} x={16} y={54 + r * 12} width={54 - r * 8} height={6} rx={3} fill={C.lavender} />
    ))}
  </svg>
);

export const S6Cta: React.FC<{ dur: number }> = ({ dur }) => (
  <CtaScene
    dur={dur}
    tag={TAG}
    mouth={sceneMouth("s6")}
    keyword="AD3"
    typeAt={cue("s6", "ad three") - 8}
    giftAt={cue("s6", "bees") - 6}
    giftTitle="Ads ki 20 Opening Lines"
    giftSub="free · copy-paste, Hinglish mein"
    giftIcon={<LinesIcon />}
    nextAt={cue("s6", "kal")}
    nextNum="#26"
    nextLabel="KAL DOPAHAR 1 BAJE · AGLA CASE"
    next={
      <>
        <div style={big(50)}>Website 3 second late khuli,</div>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{ ...big(56, C.white), background: C.red, borderRadius: 16, padding: "8px 20px 0" }}>kitne log</div>
          <div style={big(50)}>gaye?</div>
        </div>
      </>
    }
    followAt={cue("s6", "follow")}
  />
);

void ROHIT;
