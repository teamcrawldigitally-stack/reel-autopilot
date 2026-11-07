// Story 08 (remake of EP 13) — "700 verses: who spoke how many". No new Veo clips: reuses clips from Stories 01–05 + a code-drawn verse bar.
import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame } from "remotion";
import { ease } from "../components/kit";
import { createTimeline, type Timing } from "../lib/timeline";
import timingJson from "../reels/story08/timing.json";
import { Dust, Finish, GOLD, INK, Label, RED, SceneId, SeriesTag, TLCtx, Title, TopShade, useQ } from "./Story01";
import { Clip } from "./Story01V";

const timing = timingJson as unknown as Timing;
const TL = createTimeline(timing);
const V = (p: string) => `${p}.mp4`;
type Cue = string | number;
const SEGS = [
  { k: "dh", name: "धृतराष्ट्र", n: 1, c: "#8c7b66" },
  { k: "sa", name: "संजय", n: 41, c: "#3f9a96" },
  { k: "ar", name: "अर्जुन", n: 84, c: "#d9a032" },
  { k: "kr", name: "कृष्ण", n: 574, c: "#3a6bd8" },
];
/** Paper card with the 700-verse bar; each speaker's share grows in at its cue ("pre" = already shown). */
const VerseBar: React.FC<{ show: Record<string, Cue | "pre"> }> = ({ show }) => {
  const f = useCurrentFrame();
  const q = useQ();
  const W = 860;
  const at = (k: string) => (show[k] === undefined ? undefined : show[k] === "pre" ? -40 : q(show[k] as Cue));
  let x = 0;
  return (
    <div style={{ position: "absolute", left: 60, top: 1300, width: 960, padding: "26px 50px 30px", background: "#efe3c8", borderRadius: 6, boxShadow: "0 14px 30px rgba(0,0,0,0.45)", transform: "rotate(-1deg)", opacity: ease(f, -8, 6) }}>
      <div style={{ fontFamily: "Mukta", fontWeight: 700, fontSize: 40, color: INK, marginBottom: 14 }}>700 श्लोक <span style={{ fontWeight: 500, fontSize: 30, color: "#7a6a52" }}>· आम गिनती</span></div>
      <div style={{ position: "relative", width: W, height: 64, background: "rgba(28,23,18,0.12)", borderRadius: 4, overflow: "hidden" }}>
        {SEGS.map((sg) => {
          const a = at(sg.k);
          const w = Math.max(8, (sg.n / 700) * W);
          const left = x;
          x += w;
          if (a === undefined) return null;
          const p = ease(f, a, a + 16);
          return <div key={sg.k} style={{ position: "absolute", left, top: 0, height: 64, width: w * p, background: sg.c }} />;
        })}
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 16 }}>
        {SEGS.map((sg) => {
          const a = at(sg.k);
          const p = a === undefined ? 0 : ease(f, a, a + 10);
          const n = a === undefined ? 0 : Math.round(sg.n * ease(f, a, a + 20));
          return (
            <div key={sg.k} style={{ opacity: 0.25 + 0.75 * p, fontFamily: "Mukta", fontWeight: 700, color: INK, fontSize: 30, textAlign: "center" }}>
              <div style={{ width: 22, height: 22, borderRadius: 11, background: sg.c, margin: "0 auto 4px" }} />
              {sg.name}
              <div style={{ fontFamily: "Anton, Oswald, sans-serif", fontSize: 54, lineHeight: 1, color: sg.c }}>{a === undefined ? "?" : n}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const S1: React.FC = () => (
  <>
    <Clip src={V("story03/clips/krishna")} from={0} zoom={[1.04, 1.1]} />
    <TopShade h={1000} a={0.7} />
    <Title lines={[{ t: "700 VERSES." }, { t: "WHO SPOKE", c: GOLD }, { t: "HOW MANY?", c: GOLD }]} at={0} size={150} />
    <Label mono="धृतराष्ट्र 1 · अर्जुन 84 · कृष्ण ?" at="धृतराष्ट्र" x={70} y={1580} rot={-2} seed="a" />
  </>
);

const S2: React.FC = () => (
  <>
    <Clip src={V("story01/clips/c1-battlefield")} from={0} zoom={[1.04, 1.1]} />
    <TopShade h={900} a={0.62} />
    <Title lines={[{ t: "KURUKSHETRA." }]} at={0} out="अठारह-4" size={170} />
    <Title lines={[{ t: "18 CHAPTERS." }, { t: "700 VERSES.", c: GOLD }]} at="अठारह-2" size={170} />
  </>
);

const S3: React.FC = () => (
  <>
    <Clip src={V("story02/clips/dhrit")} from={1} zoom={[1.04, 1.1]} />
    <TopShade h={900} a={0.62} />
    <Title lines={[{ t: "DHRITARASHTRA:" }, { t: "JUST 1.", c: GOLD }]} at={0} size={140} />
    <VerseBar show={{ dh: "एक" }} />
    <Label mono="सबसे पहला श्लोक · 1.1" at="पहला" x={90} y={1110} rot={-2} seed="b" />
  </>
);

const S4: React.FC = () => (
  <>
    <Clip src={V("story02/clips/sanjay")} from={0} out="अर्जुन-4" zoom={[1.04, 1.1]} />
    <Clip src={V("story05/clips/arjunask")} from={0} at="अर्जुन-4" zoom={[1.04, 1.1]} />
    <TopShade h={900} a={0.62} />
    <Title lines={[{ t: "SANJAYA ≈ 41." }]} at={0} out="अर्जुन-4" size={160} />
    <Title lines={[{ t: "ARJUNA: 84.", c: GOLD }]} at="अर्जुन-2" size={170} />
    <VerseBar show={{ dh: "pre", sa: "इकतालीस", ar: "चौरासी" }} />
  </>
);

const S5: React.FC = () => (
  <>
    <Clip src={V("story05/clips/krishna")} from={0} rate={0.85} zoom={[1.04, 1.1]} />
    <TopShade h={900} a={0.62} />
    <Title lines={[{ t: "KRISHNA ≈ 574.", c: GOLD }]} at={0} out="यानी-4" size={150} />
    <Title lines={[{ t: "8 OUT OF 10" }, { t: "VERSES.", c: GOLD }]} at="यानी-2" size={170} />
    <VerseBar show={{ dh: "pre", sa: "pre", ar: "pre", kr: "चौहत्तर-4" }} />
  </>
);

const S6: React.FC = () => (
  <>
    <Clip src={V("story05/clips/arjunask")} from={2} rate={0.75} zoom={[1.06, 1.12]} />
    <TopShade h={1000} a={0.66} />
    <Title lines={[{ t: "NO ARJUNA'S 84," }, { t: "NO ANSWERS.", c: RED }]} at={0} out="अच्छे-4" size={140} />
    <Title lines={[{ t: "GOOD ANSWERS" }, { t: "COME FROM", c: GOLD }, { t: "GOOD QUESTIONS.", c: GOLD }]} at="अच्छे-2" size={130} />
  </>
);

const S7: React.FC = () => (
  <>
    <Clip src={V("story01/clips/c1-battlefield")} from={1.5} rate={0.57} dark={0.42} zoom={[1.04, 1.1]} />
    <TopShade h={1150} a={0.6} />
    <Dust n={18} />
    <Label title="SEND THIS" red="TO A FRIEND" sub="WHO THINKS THEY READ THE WHOLE GITA" at={2} x={60} y={330} rot={-2} size={96} seed="m" />
    <Label title="COMMENT" sub="क्या आपको ये गिनती पता थी?" at="कमेंट" x={90} y={600} rot={1.5} size={84} seed="n" />
    <Label title="NEXT STORY ·" red="PASS OR FAIL" sub="STAY THE SAME · GITA 2.48" at="अगली" x={50} y={880} rot={-1.5} size={80} seed="o" />
    <Label title="FOLLOW" red="@GITA.SHLOK.SERIES" at="फॉलो" x={70} y={1110} rot={2} size={74} seed="p" />
  </>
);

const SCENES: Record<string, React.FC> = { s1: S1, s2: S2, s3: S3, s4: S4, s5: S5, s6: S6, s7: S7 };

const Fade: React.FC<{ lead: number; children: React.ReactNode }> = ({ lead, children }) => {
  const f = useCurrentFrame();
  return <AbsoluteFill style={{ opacity: lead > 0 ? ease(f, 0, lead) : 1 }}>{children}</AbsoluteFill>;
};

export const Story08: React.FC = () => (
  <TLCtx.Provider value={TL}>
    <AbsoluteFill style={{ background: "#0b0805" }}>
      {timing.scenes.map((s, i) => {
        const { from, dur } = TL.sceneFrames(s.id);
        const lead = i === 0 ? 0 : 6;
        const Scene = SCENES[s.id];
        return (
          <Sequence key={s.id} from={from - lead} durationInFrames={dur + lead + (i === timing.scenes.length - 1 ? 0 : 4)} name={s.id}>
            <Fade lead={lead}>
              <Sequence from={lead} layout="none">
                <SceneId.Provider value={s.id}>
                  <Scene />
                </SceneId.Provider>
              </Sequence>
            </Fade>
          </Sequence>
        );
      })}
      {timing.scenes.map((s) =>
        s.audio ? (
          <Sequence key={`a${s.id}`} from={TL.sceneFrames(s.id).from} durationInFrames={TL.sceneFrames(s.id).dur + 6} layout="none">
            <Audio src={staticFile(s.audio)} />
          </Sequence>
        ) : null,
      )}
      <SeriesTag n="08" />
      <Finish />
    </AbsoluteFill>
  </TLCtx.Provider>
);
export const STORY08_FRAMES = TL.totalFrames;

export const Story08Cover: React.FC = () => (
  <TLCtx.Provider value={TL}>
    <AbsoluteFill style={{ background: "#0b0805" }}>
      <SceneId.Provider value="s1">
        <Sequence from={-150} layout="none">
          <S1 />
        </Sequence>
      </SceneId.Provider>
      <SeriesTag n="08" />
      <Finish />
    </AbsoluteFill>
  </TLCtx.Provider>
);
