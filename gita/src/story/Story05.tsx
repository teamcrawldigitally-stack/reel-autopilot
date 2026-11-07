// Story 05 (remake of EP 10) — "Doing nothing is a mistake too": 3.1 and 3.8.
import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame } from "remotion";
import { ease } from "../components/kit";
import { createTimeline, type Timing } from "../lib/timeline";
import timingJson from "../reels/story05/timing.json";
import { Dust, Finish, GOLD, Label, RED, SceneId, SeriesTag, TLCtx, Title, TopShade } from "./Story01";
import { Clip } from "./Story01V";

const timing = timingJson as unknown as Timing;
const TL = createTimeline(timing);
const V = (n: string) => `story05/clips/${n}.mp4`;

const S1: React.FC = () => (
  <>
    <Clip src={V("lazy")} from={0} zoom={[1.04, 1.1]} sound={1} />
    <TopShade h={1000} a={0.7} />
    <Title lines={[{ t: "“FROM TOMORROW," }, { t: "FOR SURE.”", c: GOLD }]} at={0} out="कृष्ण-4" size={140} />
    <Label mono="“कल से पक्का”" at="पक्का" out="कृष्ण-4" x={70} y={1560} rot={-3} seed="a" />
    <Title lines={[{ t: "DOING NOTHING" }, { t: "IS A MISTAKE", c: RED }, { t: "TOO.", c: RED }]} at="कृष्ण-2" size={140} />
  </>
);

const S2: React.FC = () => (
  <>
    <Clip src={V("arjunask")} from={0} zoom={[1.02, 1.08]} />
    <TopShade h={900} a={0.62} />
    <Title lines={[{ t: "ARJUNA" }, { t: "ASKED…", c: GOLD }]} at={0} out="तो-4" size={170} />
    <Title lines={[{ t: "“WHY PUSH ME" }, { t: "INTO THIS?”", c: GOLD }]} at="तो-2" size={150} />
    <Label sub="“अगर ज्ञान बड़ा है, तो मुझे इस भयानक काम में क्यों लगा रहे हो?”" refx="भगवद् गीता 3.1 · भावार्थ" at="अगर" x={50} y={1420} rot={1.5} size={90} seed="b" />
  </>
);

const S3: React.FC = () => (
  <>
    <Clip src={V("krishna")} from={0} rate={0.75} zoom={[1.02, 1.08]} />
    <TopShade h={900} a={0.62} />
    <Title lines={[{ t: "KRISHNA" }, { t: "SAID…", c: GOLD }]} at={0} out="जो-4" size={170} />
    <Label title="नियतं कुरु कर्म त्वं" sub="जो तुम्हारा काम है, वो करो" refx="भगवद् गीता 3.8" at="नियतं" x={50} y={1420} rot={-1.5} size={96} seed="c" />
    <Title lines={[{ t: "“DO" }, { t: "YOUR WORK.”", c: GOLD }]} at="जो-2" size={190} />
  </>
);

const S4: React.FC = () => (
  <>
    <Clip src={V("krishna")} from={4.1} rate={0.65} zoom={[1.08, 1.14]} />
    <TopShade h={900} a={0.62} />
    <Label title="कर्म ज्यायो ह्यकर्मणः" sub="काम करना, कुछ न करने से बेहतर है" refx="भगवद् गीता 3.8" at={2} x={50} y={1420} rot={1.5} size={96} seed="d" />
    <Title lines={[{ t: "ACTION" }, { t: "BEATS", c: GOLD }, { t: "INACTION.", c: RED }]} at="काम-2" size={170} />
  </>
);

const S5: React.FC = () => (
  <>
    <Clip src={V("farmer")} from={0} zoom={[1.02, 1.08]} sound={0.6} />
    <TopShade h={900} a={0.62} />
    <Title lines={[{ t: "WITHOUT WORK," }, { t: "EVEN THE BODY", c: GOLD }, { t: "CAN'T RUN." }]} at={0} size={130} />
    <Label mono="भगवद् गीता 3.8 · भावार्थ" at="शरीर" x={70} y={1600} rot={-2} seed="e" />
  </>
);

const S6: React.FC = () => (
  <>
    <Clip src={V("morning")} from={0} rate={0.9} zoom={[1.02, 1.08]} />
    <TopShade h={900} a={0.62} />
    <Title lines={[{ t: "10 MINUTES" }, { t: "A DAY.", c: GOLD }]} at={0} out="एक-4" size={180} />
    <Title lines={[{ t: "≈ 61 HOURS" }, { t: "A YEAR.", c: GOLD }]} at="एक-2" out="तो-4" size={180} />
    <Label mono="10 मिनट × 365 दिन ≈ 61 घंटे" at="इकसठ" out="तो-4" x={70} y={1580} rot={-2} seed="f" />
    <Title lines={[{ t: "TODAY," }, { t: "JUST 10 MINUTES.", c: GOLD }]} at="तो-2" out="पूरा-4" size={150} />
    <Title lines={[{ t: "DON'T FINISH." }, { t: "JUST START.", c: GOLD }]} at="पूरा-2" size={160} />
  </>
);

const S7: React.FC = () => (
  <>
    <Clip src={V("krishna")} from={0} rate={0.55} dark={0.42} zoom={[1.04, 1.1]} />
    <TopShade h={1150} a={0.6} />
    <Dust n={18} />
    <Label title="SEND THIS" red="TO A FRIEND" sub="WHO PUTS EVERYTHING OFF" at={2} x={60} y={330} rot={-2} size={96} seed="m" />
    <Label title="COMMENT" sub="आज कौन सा काम शुरू करोगे?" at="कमेंट" x={90} y={600} rot={1.5} size={84} seed="n" />
    <Label title="NEXT STORY ·" red="LIC'S MOTTO" sub="COMES FROM THE GITA" at="अगली" x={50} y={880} rot={-1.5} size={80} seed="o" />
    <Label title="FOLLOW" red="@GITA.SHLOK.SERIES" at="फॉलो" x={70} y={1110} rot={2} size={74} seed="p" />
  </>
);

const SCENES: Record<string, React.FC> = { s1: S1, s2: S2, s3: S3, s4: S4, s5: S5, s6: S6, s7: S7 };

const Fade: React.FC<{ lead: number; children: React.ReactNode }> = ({ lead, children }) => {
  const f = useCurrentFrame();
  return <AbsoluteFill style={{ opacity: lead > 0 ? ease(f, 0, lead) : 1 }}>{children}</AbsoluteFill>;
};

export const Story05: React.FC = () => (
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
      <SeriesTag n="05" />
      <Finish />
    </AbsoluteFill>
  </TLCtx.Provider>
);
export const STORY05_FRAMES = TL.totalFrames;

export const Story05Cover: React.FC = () => (
  <TLCtx.Provider value={TL}>
    <AbsoluteFill style={{ background: "#0b0805" }}>
      <SceneId.Provider value="s1">
        <Sequence from={-178} layout="none">
          <S1 />
        </Sequence>
      </SceneId.Provider>
      <SeriesTag n="05" />
      <Finish />
    </AbsoluteFill>
  </TLCtx.Provider>
);
