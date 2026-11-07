// Story 09 (remake of EP 14) — "Pass or fail, stay the same": Gita 2.6 and 2.48. 2 new Veo clips + 1 reused.
import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame } from "remotion";
import { ease } from "../components/kit";
import { createTimeline, type Timing } from "../lib/timeline";
import timingJson from "../reels/story09/timing.json";
import { Dust, Finish, GOLD, Label, RED, SceneId, SeriesTag, TLCtx, Title, TopShade } from "./Story01";
import { Clip } from "./Story01V";

const timing = timingJson as unknown as Timing;
const TL = createTimeline(timing);
const V = (n: string) => `story09/clips/${n}.mp4`;
/** Clip sound levels (0 = muted). student and scale both carry soft background music (note peaks D5/C#5/A3, B4/G4), so both stay muted. */
const SND: Record<string, number> = { student: 0, scale: 0 };

const S1: React.FC = () => (
  <>
    <Clip src={V("student")} from={0} rate={0.9} zoom={[1.04, 1.1]} sound={SND.student} />
    <TopShade h={1000} a={0.7} />
    <Title lines={[{ t: "PASS OR FAIL," }, { t: "STAY THE SAME.", c: GOLD }]} at={0} out="कृष्ण-4" size={150} />
    <Title lines={[{ t: "KRISHNA CALLS" }, { t: "THIS YOGA.", c: GOLD }]} at="कृष्ण-2" size={150} />
  </>
);

const S2: React.FC = () => (
  <>
    <Clip src="story05/clips/arjunask.mp4" from={0} rate={0.9} zoom={[1.04, 1.1]} />
    <TopShade h={900} a={0.62} />
    <Title lines={[{ t: "BEFORE THE WAR," }, { t: "ARJUNA SAID…", c: GOLD }]} at={0} out="पता-4" size={140} />
    <Title lines={[{ t: "“WHO WILL WIN?" }, { t: "WE DON'T KNOW.”", c: RED }]} at="पता-2" size={140} />
    <Label mono="भगवद् गीता 2.6 · भावार्थ" at="जीतेंगे" x={70} y={1580} rot={-2} seed="a" />
  </>
);

const S3: React.FC = () => (
  <>
    <Clip src={V("scale")} from={0} rate={0.6} zoom={[1.02, 1.08]} sound={SND.scale} />
    <TopShade h={900} a={0.62} />
    <Title lines={[{ t: "KRISHNA" }, { t: "SAID…", c: GOLD }]} at={0} out="योग#2-4" size={170} />
    <Label title={"योगस्थः कुरु कर्माणि\nसङ्गं त्यक्त्वा धनञ्जय।"} refx="भगवद् गीता 2.48" at="योगस्थः" out="योग#2-6" x={50} y={1400} rot={-1.5} size={88} seed="b" />
    <Title lines={[{ t: "WORK, ROOTED" }, { t: "IN YOGA.", c: GOLD }]} at="योग#2-2" out="नतीजे-4" size={150} />
    <Title lines={[{ t: "DON'T CLING" }, { t: "TO RESULTS.", c: GOLD }]} at="नतीजे-2" size={150} />
    <Label sub="योग में टिककर काम करो, नतीजे से चिपको मत" at="योग#2" x={50} y={1500} rot={1.5} size={88} seed="c" />
  </>
);

const S4: React.FC = () => (
  <>
    <Clip src={V("scale")} from={5.2} rate={0.45} zoom={[1.08, 1.14]} sound={SND.scale} />
    <TopShade h={900} a={0.62} />
    <Label title="सिद्ध्यसिद्ध्योः समो भूत्वा" refx="भगवद् गीता 2.48" at={2} out="सफलता-6" x={50} y={1420} rot={-1.5} size={92} seed="d" />
    <Title lines={[{ t: "SUCCESS" }, { t: "OR FAILURE…", c: RED }]} at="सफलता-2" out="दोनों-4" size={160} />
    <Title lines={[{ t: "STAY" }, { t: "THE SAME.", c: GOLD }]} at="दोनों-2" size={190} />
    <Label sub="सफलता हो या असफलता, दोनों में एक जैसे रहो" at="सफलता" x={50} y={1500} rot={1.5} size={88} seed="e" />
  </>
);

const S5: React.FC = () => (
  <>
    <Clip src={V("scale")} from={1} rate={0.7} zoom={[1.04, 1.1]} sound={SND.scale} />
    <TopShade h={900} a={0.62} />
    <Label title="समत्वं योग उच्यते" refx="भगवद् गीता 2.48" at={2} x={50} y={1420} rot={-1.5} size={100} seed="f" />
    <Title lines={[{ t: "BALANCE" }, { t: "IS YOGA.", c: GOLD }]} at="यही-2" size={190} />
  </>
);

const S6: React.FC = () => (
  <>
    <Clip src={V("student")} from={4} rate={0.6} zoom={[1.06, 1.12]} sound={SND.student} />
    <TopShade h={1000} a={0.66} />
    <Title lines={[{ t: "BEFORE RESULTS," }, { t: "TELL YOURSELF:", c: GOLD }]} at={0} out="मेरा-4" size={140} />
    <Title lines={[{ t: "“MY JOB WAS" }, { t: "THE EFFORT.", c: GOLD }, { t: "DONE.”" }]} at="मेरा-2" out="बाकी-4" size={150} />
    <Title lines={[{ t: "THE REST" }, { t: "IS JUST", c: GOLD }, { t: "THE RESULT.", c: GOLD }]} at="बाकी-2" size={150} />
  </>
);

const S7: React.FC = () => (
  <>
    <Clip src={V("scale")} from={0} rate={0.6} dark={0.42} zoom={[1.04, 1.1]} />
    <TopShade h={1150} a={0.6} />
    <Dust n={18} />
    <Label title="SEND THIS" red="TO A FRIEND" sub="WHOSE RESULT IS COMING" at={2} x={60} y={330} rot={-2} size={96} seed="m" />
    <Label title="COMMENT" sub="आपको किस रिज़ल्ट का इंतज़ार है?" at="कमेंट" x={90} y={600} rot={1.5} size={84} seed="n" />
    <Label title="NEXT STORY ·" red="3 GATES OF HELL" sub="GITA 16.21" at="अगली" x={50} y={880} rot={-1.5} size={80} seed="o" />
    <Label title="FOLLOW" red="@GITA.SHLOK.SERIES" at="फॉलो" x={70} y={1110} rot={2} size={74} seed="p" />
  </>
);

const SCENES: Record<string, React.FC> = { s1: S1, s2: S2, s3: S3, s4: S4, s5: S5, s6: S6, s7: S7 };

const Fade: React.FC<{ lead: number; children: React.ReactNode }> = ({ lead, children }) => {
  const f = useCurrentFrame();
  return <AbsoluteFill style={{ opacity: lead > 0 ? ease(f, 0, lead) : 1 }}>{children}</AbsoluteFill>;
};

export const Story09: React.FC = () => (
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
      <SeriesTag n="09" />
      <Finish />
    </AbsoluteFill>
  </TLCtx.Provider>
);
export const STORY09_FRAMES = TL.totalFrames;

export const Story09Cover: React.FC = () => (
  <TLCtx.Provider value={TL}>
    <AbsoluteFill style={{ background: "#0b0805" }}>
      <SceneId.Provider value="s1">
        <Sequence from={-170} layout="none">
          <S1 />
        </Sequence>
      </SceneId.Provider>
      <SeriesTag n="09" />
      <Finish />
    </AbsoluteFill>
  </TLCtx.Provider>
);
