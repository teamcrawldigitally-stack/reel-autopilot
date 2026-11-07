// Story 11 (remake of EP 16) — "Kids copy you, not your words": Gita 3.21. 2 new Veo clips + 1 Flow picture with code motion + 2 reused clips.
import React from "react";
import { AbsoluteFill, Audio, Img, Sequence, interpolate, staticFile, useCurrentFrame } from "remotion";
import { ease } from "../components/kit";
import { createTimeline, type Timing } from "../lib/timeline";
import timingJson from "../reels/story11/timing.json";
import { Dust, Finish, GOLD, Label, RED, SceneId, SeriesTag, TLCtx, Title, TopShade } from "./Story01";
import { Clip } from "./Story01V";
import { StorySound, buildDuck } from "./sound";

const timing = timingJson as unknown as Timing;
const TL = createTimeline(timing);
const DUCK = buildDuck(timing as never);
const V = (n: string) => `story11/clips/${n}.mp4`;
/** Clip sound levels (0 = muted). phone: quiet room tone and clock, no music or speech. play: STT heard a voice ("हाँ"), so it stays muted. */
const SND: Record<string, number> = { phone: 1, play: 0 };

/** Footsteps picture: slow push-in that drifts down the path toward father and son. */
const Footsteps: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useCurrentFrame();
  const t = ease(f, 0, dur);
  const s = interpolate(t, [0, 1], [1.08, 1.24]);
  const y = interpolate(t, [0, 1], [60, -120]);
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <Img src={staticFile("img/story11/footsteps.jpg")} style={{ position: "absolute", left: 0, top: 0, width: 1080, height: 1920, objectFit: "cover", transform: `translateY(${y}px) scale(${s})`, transformOrigin: "50% 60%" }} />
    </AbsoluteFill>
  );
};

const S1: React.FC = () => (
  <>
    <Clip src={V("phone")} from={0} rate={0.9} zoom={[1.04, 1.1]} sound={SND.phone} />
    <TopShade h={1000} a={0.7} />
    <Title lines={[{ t: "TELLING KIDS" }, { t: "TO DROP THE PHONE,", c: GOLD }]} at={0} out="खुद-4" size={130} />
    <Title lines={[{ t: "WHILE ON" }, { t: "YOUR PHONE?", c: RED }]} at="खुद-2" out="गीता-4" size={160} />
    <Title lines={[{ t: "THE GITA SAYS:" }, { t: "IT NEVER WORKS.", c: RED }]} at="गीता-2" size={140} />
  </>
);

const S2: React.FC = () => (
  <>
    <Clip src="story03/clips/arjun.mp4" from={0} rate={0.9} zoom={[1.04, 1.1]} />
    <TopShade h={900} a={0.62} />
    <Title lines={[{ t: "CHAPTER 3:" }, { t: "WHY ACTION", c: GOLD }, { t: "MATTERS.", c: GOLD }]} at={0} size={150} />
    <Label mono="भगवद् गीता · अध्याय 3 · कर्मयोग" at="अध्याय" x={70} y={1640} rot={-2} seed="a" />
  </>
);

const S3: React.FC = () => (
  <>
    <Clip src="story03/clips/krishna.mp4" from={0} rate={0.9} zoom={[1.04, 1.1]} />
    <TopShade h={900} a={0.62} />
    <Title lines={[{ t: "KRISHNA" }, { t: "SAYS…", c: GOLD }]} at={0} out="बड़ा-4" size={170} />
    <Label title={"यद्यदाचरति श्रेष्ठः\nतत्तदेवेतरो जनः।"} refx="भगवद् गीता 3.21" at="यद्यदाचरति" out="बड़ा-6" x={50} y={1400} rot={-1.5} size={92} seed="b" />
    <Title lines={[{ t: "WHAT THE" }, { t: "GREAT DO,", c: GOLD }, { t: "OTHERS DO TOO." }]} at="बड़ा-2" size={150} />
    <Label sub="बड़ा जो करता है, बाकी लोग वही करते हैं" at="बड़ा" x={50} y={1560} rot={1.5} size={86} seed="c" />
  </>
);

const S4: React.FC = () => (
  <>
    <Footsteps dur={TL.sceneFrames("s4").dur + 10} />
    <TopShade h={900} a={0.6} />
    <Label title={"स यत्प्रमाणं कुरुते\nलोकस्तदनुवर्तते।"} refx="भगवद् गीता 3.21" at={2} out="वो-6" x={50} y={330} rot={-1.5} size={92} seed="d" />
    <Title lines={[{ t: "THE EXAMPLE" }, { t: "THEY SET,", c: GOLD }, { t: "THE WORLD" }, { t: "FOLLOWS.", c: GOLD }]} at="वो-2" size={140} />
    <Label sub="वो जो मिसाल बनाता है, दुनिया उसी के पीछे चलती है" at="वो" x={50} y={1650} rot={1.5} size={84} seed="e" />
  </>
);

const S5: React.FC = () => (
  <>
    <Clip src={V("phone")} from={1} rate={0.75} zoom={[1.08, 1.14]} sound={SND.phone} />
    <TopShade h={1000} a={0.66} />
    <Title lines={[{ t: "10 TIMES A DAY:" }, { t: "“PUT THE", c: GOLD }, { t: "PHONE DOWN!”", c: GOLD }]} at={0} out="पर-4" size={140} />
    <Title lines={[{ t: "BUT HE SEES YOU" }, { t: "ON IT", c: RED }, { t: "100 TIMES.", c: RED }]} at="पर-2" out="जीत-4" size={140} />
    <Title lines={[{ t: "WHO" }, { t: "WINS?", c: GOLD }]} at="जीत-2" size={210} />
  </>
);

const S6: React.FC = () => (
  <>
    <Clip src={V("play")} from={0} rate={0.9} zoom={[1.04, 1.1]} sound={SND.play} />
    <TopShade h={1000} a={0.66} />
    <Title lines={[{ t: "TODAY: 30 MIN," }, { t: "NO PHONE", c: GOLD }, { t: "IN FRONT OF KIDS." }]} at={0} out="बोलने-4" size={130} />
    <Title lines={[{ t: "IT WORKS" }, { t: "BETTER THAN", c: GOLD }, { t: "WORDS.", c: GOLD }]} at="बोलने-2" size={160} />
  </>
);

const S7: React.FC = () => (
  <>
    <Clip src={V("play")} from={0} rate={0.45} dark={0.42} zoom={[1.04, 1.1]} />
    <TopShade h={1150} a={0.6} />
    <Dust n={18} />
    <Label title="SEND THIS" red="TO PARENTS" sub="WORRIED ABOUT KIDS' PHONES" at={2} x={60} y={330} rot={-2} size={96} seed="m" />
    <Label title="COMMENT" sub="आपके घर में सबसे ज़्यादा फ़ोन कौन चलाता है?" at="कमेंट" x={70} y={600} rot={1.5} size={78} seed="n" />
    <Label title="NEXT STORY ·" red="WHY CUT A TREE?" sub="GITA 15.3" at="अगली" x={50} y={880} rot={-1.5} size={80} seed="o" />
    <Label title="FOLLOW" red="@GITA.SHLOK.SERIES" at="फॉलो" x={70} y={1110} rot={2} size={74} seed="p" />
  </>
);

const SCENES: Record<string, React.FC> = { s1: S1, s2: S2, s3: S3, s4: S4, s5: S5, s6: S6, s7: S7 };

const Fade: React.FC<{ lead: number; children: React.ReactNode }> = ({ lead, children }) => {
  const f = useCurrentFrame();
  return <AbsoluteFill style={{ opacity: lead > 0 ? ease(f, 0, lead) : 1 }}>{children}</AbsoluteFill>;
};

export const Story11: React.FC = () => (
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
      {/* A few sounds under a quiet music bed (render_mix.sh). */}
      <StorySound TL={TL} duck={DUCK} beds={[{ src: "sfx/battlefield.mp3", scenes: ["s2"], vol: 0.22 }, { src: "sfx/fields.mp3", scenes: ["s4"], vol: 0.25 }, { src: "sfx/fields.mp3", scenes: ["s6"], vol: 0.22 }]} hits={[{ src: "sfx/boom.mp3", at: 0, vol: 0.3 }]} />
      <SeriesTag n="11" />
      <Finish />
    </AbsoluteFill>
  </TLCtx.Provider>
);
export const STORY11_FRAMES = TL.totalFrames;

export const Story11Cover: React.FC = () => (
  <TLCtx.Provider value={TL}>
    <AbsoluteFill style={{ background: "#0b0805" }}>
      <SceneId.Provider value="s1">
        <Sequence from={-80} layout="none">
          <S1 />
        </Sequence>
      </SceneId.Provider>
      <SeriesTag n="11" />
      <Finish />
    </AbsoluteFill>
  </TLCtx.Provider>
);
