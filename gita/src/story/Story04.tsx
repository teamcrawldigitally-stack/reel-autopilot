// Story 04 (remake of EP 09) — "The atom bomb and the Gita": 11.32 and 11.33.
import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame } from "remotion";
import { ease } from "../components/kit";
import { createTimeline, type Timing } from "../lib/timeline";
import timingJson from "../reels/story04/timing.json";
import { Dust, Finish, GOLD, Label, RED, SceneId, SeriesTag, TLCtx, Title, TopShade } from "./Story01";
import { Clip } from "./Story01V";

const timing = timingJson as unknown as Timing;
const TL = createTimeline(timing);
const V = (n: string) => `story04/clips/${n}.mp4`;

const S1: React.FC = () => (
  <>
    <Clip src={V("fireball")} from={2} rate={0.9} zoom={[1.06, 1.14]} sound={0.8} />
    <TopShade h={1000} a={0.7} />
    <Title lines={[{ t: "THE MAN WHO" }, { t: "MADE THE BOMB…", c: RED }]} at={0} out="गीता-4" size={150} />
    <Title lines={[{ t: "REMEMBERED" }, { t: "THE GITA.", c: GOLD }]} at="गीता-2" size={170} />
  </>
);

const S2: React.FC = () => (
  <>
    <Clip src={V("fireball")} from={0} zoom={[1.02, 1.08]} sound={0.8} />
    <TopShade h={900} a={0.6} />
    <Title lines={[{ t: "JULY 16," }, { t: "1945.", c: GOLD }]} at={0} out="पहला-4" size={190} />
    <Label mono="अमेरिका · रेगिस्तान" at="रेगिस्तान" x={70} y={1560} rot={-2} seed="a" />
    <Title lines={[{ t: "THE FIRST" }, { t: "ATOMIC TEST.", c: RED }]} at="पहला-2" size={170} />
  </>
);

const S3: React.FC = () => (
  <>
    <Clip src={V("scientist")} from={0} zoom={[1.02, 1.08]} />
    <TopShade h={900} a={0.62} />
    <Title lines={[{ t: "THE LAB'S HEAD" }]} at={0} out="रॉबर्ट-4" size={150} />
    <Title lines={[{ t: "ROBERT" }, { t: "OPPENHEIMER", c: GOLD }]} at="रॉबर्ट-2" size={150} />
    <Label mono="लैब के हेड · आग का गोला देखते हुए" at="आग" x={60} y={1580} rot={-2} seed="b" />
  </>
);

const S4: React.FC = () => (
  <>
    <Clip src={V("scientist")} from={4.5} rate={0.6} zoom={[1.08, 1.16]} />
    <TopShade h={1100} a={0.7} />
    <Title lines={[{ t: "HE LATER SAID" }, { t: "A GITA LINE", c: GOLD }, { t: "CAME TO HIM." }]} at={0} out="अब-4" size={130} />
    <Title lines={[{ t: "“NOW I AM" }, { t: "BECOME DEATH,", c: RED }, { t: "THE DESTROYER" }, { t: "OF WORLDS.”", c: RED }]} at="अब-2" size={120} />
    <Label sub="“अब मैं मृत्यु बन गया हूँ, दुनिया का नाश करने वाला”" at="अब" x={50} y={1470} rot={1.5} size={88} seed="c" />
  </>
);

const S5: React.FC = () => (
  <>
    <Clip src={V("vishwaroop")} from={0} zoom={[1.02, 1.08]} out="काल#2-4" />
    <Clip src={V("timewheel")} from={0} at="काल#2-4" zoom={[1.02, 1.1]} />
    <TopShade h={900} a={0.62} />
    <Title lines={[{ t: "IN HIS COSMIC FORM," }, { t: "KRISHNA SAID…", c: GOLD }]} at={0} out="काल#2-6" size={120} />
    <Label title="कालोऽस्मि लोकक्षयकृत्प्रवृद्धो" refx="भगवद् गीता 11.32" at="कालोऽस्मि" out="काल#2-6" x={50} y={1400} rot={-1.5} size={84} seed="d" />
    <Title lines={[{ t: "KAAL" }, { t: "= DEATH", c: RED }]} at="काल#2-2" out="समय-4" size={190} />
    <Title lines={[{ t: "KAAL" }, { t: "= TIME", c: GOLD }]} at="समय-4" out="कृष्ण#2-4" size={190} />
    <Label title="काल" sub="मौत भी, और समय भी" at="काल#2" x={60} y={1450} rot={2} size={110} seed="e" />
    <Title lines={[{ t: "“I AM" }, { t: "TIME.”", c: GOLD }]} at="कृष्ण#2-2" size={210} />
  </>
);

const S6: React.FC = () => (
  <>
    <Clip src={V("arjunbow")} from={0} zoom={[1.02, 1.08]} />
    <TopShade h={900} a={0.62} />
    <Title lines={[{ t: "AND THE" }, { t: "VERY NEXT VERSE…", c: GOLD }]} at={0} out="जो-4" size={130} />
    <Label title="निमित्तमात्रं भव सव्यसाचिन्" sub="तुम बस निमित्त बनो" refx="भगवद् गीता 11.33" at="निमित्तमात्रं" x={50} y={1420} rot={-1.5} size={84} seed="f" />
    <Title lines={[{ t: "WHAT MUST HAPPEN" }, { t: "WILL HAPPEN.", c: RED }]} at="जो-2" out="तुम-4" size={120} />
    <Title lines={[{ t: "JUST BE" }, { t: "THE INSTRUMENT.", c: GOLD }]} at="तुम-2" size={140} />
  </>
);

const S7: React.FC = () => (
  <>
    <Clip src={V("vishwaroop")} from={1} rate={0.5} dark={0.42} zoom={[1.04, 1.1]} />
    <TopShade h={1150} a={0.6} />
    <Dust n={18} />
    <Label title="SEND THIS" red="TO A FRIEND" sub="WHO LOVES SCIENCE AND HISTORY" at={2} x={60} y={330} rot={-2} size={96} seed="m" />
    <Label title="COMMENT ·" red="DID YOU KNOW?" at="कमेंट" x={90} y={600} rot={1.5} size={78} seed="n" />
    <Label title="NEXT STORY ·" red="DOING NOTHING" sub="IS A MISTAKE TOO · GITA 3.8" at="अगली" x={50} y={820} rot={-1.5} size={80} seed="o" />
    <Label title="FOLLOW" red="@GITA.SHLOK.SERIES" at="फॉलो" x={70} y={1070} rot={2} size={74} seed="p" />
  </>
);

const SCENES: Record<string, React.FC> = { s1: S1, s2: S2, s3: S3, s4: S4, s5: S5, s6: S6, s7: S7 };

const Fade: React.FC<{ lead: number; children: React.ReactNode }> = ({ lead, children }) => {
  const f = useCurrentFrame();
  return <AbsoluteFill style={{ opacity: lead > 0 ? ease(f, 0, lead) : 1 }}>{children}</AbsoluteFill>;
};

export const Story04: React.FC = () => (
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
      <SeriesTag n="04" />
      <Finish />
    </AbsoluteFill>
  </TLCtx.Provider>
);
export const STORY04_FRAMES = TL.totalFrames;

export const Story04Cover: React.FC = () => (
  <TLCtx.Provider value={TL}>
    <AbsoluteFill style={{ background: "#0b0805" }}>
      <SceneId.Provider value="s1">
        <Sequence from={-165} layout="none">
          <S1 />
        </Sequence>
      </SceneId.Provider>
      <SeriesTag n="04" />
      <Finish />
    </AbsoluteFill>
  </TLCtx.Provider>
);
