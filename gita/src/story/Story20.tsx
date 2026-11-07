// Story 20 (new, EP 25) — "Your real enemy": Gita 3.36–3.39 (desire and anger). 2 new Veo clips + 2 Flow pictures with code motion + 1 reused clip.
import React from "react";
import { AbsoluteFill, Audio, Img, Sequence, interpolate, staticFile, useCurrentFrame } from "remotion";
import { ease } from "../components/kit";
import { createTimeline, type Timing } from "../lib/timeline";
import timingJson from "../reels/story20/timing.json";
import { Dust, Finish, GOLD, Label, RED, SceneId, SeriesTag, TLCtx, Title, TopShade } from "./Story01";
import { Clip } from "./Story01V";
import { StorySound, buildDuck } from "./sound";

const timing = timingJson as unknown as Timing;
const TL = createTimeline(timing);
const DUCK = buildDuck(timing as never);
const V = (n: string) => `story20/clips/${n}.mp4`;
/** Clip sound levels (0 = muted). shadow: wind and fire crackle, no speech or music (checked). smoke: the sound check found music, so it stays muted. */
const SND: Record<string, number> = { shadow: 0.35, smoke: 0 };

/** A Flow picture with a slow camera move (scale and vertical drift over the scene). */
const KenBurns: React.FC<{ src: string; dur: number; s: [number, number]; y: [number, number]; origin?: string }> = ({ src, dur, s, y, origin = "50% 50%" }) => {
  const f = useCurrentFrame();
  const t = ease(f, 0, dur);
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <Img src={staticFile(src)} style={{ position: "absolute", left: 0, top: 0, width: 1080, height: 1920, objectFit: "cover", transform: `translateY(${interpolate(t, [0, 1], y)}px) scale(${interpolate(t, [0, 1], s)})`, transformOrigin: origin }} />
    </AbsoluteFill>
  );
};


const BottomShade: React.FC = () => <AbsoluteFill style={{ background: "linear-gradient(to top, rgba(10,8,6,0.78) 0%, rgba(10,8,6,0) 26%)" }} />;

const S1: React.FC = () => (
  <>
    <Clip src={V("shadow")} from={0} rate={0.9} zoom={[1.04, 1.1]} sound={SND.shadow} />
    <TopShade h={1000} a={0.7} />
    <Title lines={[{ t: "YOUR REAL ENEMY" }, { t: "IS NOT", c: GOLD }, { t: "OUTSIDE.", c: RED }]} at={0} out="गीता-4" size={150} />
    <Title lines={[{ t: "THE GITA" }, { t: "NAMES IT.", c: GOLD }]} at="गीता-2" size={180} />
  </>
);

const S2: React.FC = () => (
  <>
    <Clip src="story05/clips/arjunask.mp4" from={0} rate={0.9} zoom={[1.04, 1.1]} />
    <TopShade h={900} a={0.62} />
    <Title lines={[{ t: "CHAPTER 3:" }, { t: "ARJUNA ASKS", c: GOLD }, { t: "WHY?" }]} at={0} size={150} />
    <Label sub="न चाहते हुए भी गलत काम क्यों?" at="चाहते" x={60} y={1380} rot={-1.5} size={84} seed="a" />
    <Label mono="भगवद् गीता · अध्याय 3" at="अध्याय" x={70} y={1640} rot={-2} seed="a2" />
  </>
);

const S3: React.FC = () => (
  <>
    <KenBurns src="img/story20/twins.jpg" dur={TL.sceneFrames("s3").dur + 10} s={[1.06, 1.16]} y={[40, -40]} />
    <TopShade h={900} a={0.6} />
    <BottomShade />
    <Label title={"काम एष क्रोध एष,\nरजोगुणसमुद्भवः।"} refx="भगवद् गीता 3.37" at={2} out="कृष्ण-6" x={50} y={1400} rot={-1.5} size={92} seed="b" />
    <Title lines={[{ t: "DESIRE.", c: GOLD }, { t: "ANGER.", c: RED }]} at="कृष्ण-2" size={190} />
    <Label title="काम" sub="इच्छा" at="इच्छा" x={70} y={1060} rot={-2} size={96} seed="c" />
    <Label title="क्रोध" sub="गुस्सा" at="गुस्सा" x={680} y={1100} rot={2} size={96} seed="d" />
    <Label mono="रजोगुण से पैदा" at="रजोगुण#2" x={250} y={1640} rot={-1} seed="e" />
  </>
);

const S4: React.FC = () => (
  <>
    <KenBurns src="img/story20/hunger.jpg" dur={TL.sceneFrames("s4").dur + 10} s={[1.08, 1.2]} y={[60, -60]} origin="50% 60%" />
    <TopShade h={1000} a={0.8} />
    <BottomShade />
    <Label title={"महाशनो महापाप्मा,\nविद्ध्येनमिह वैरिणम्।"} refx="भगवद् गीता 3.37" at={2} out="ये-6" x={50} y={1400} rot={-1.5} size={92} seed="f" />
    <Title lines={[{ t: "IT NEVER" }, { t: "GETS FULL.", c: RED }]} at="ये-2" out="इसी-4" size={170} />
    <Title lines={[{ t: "KNOW IT AS" }, { t: "YOUR ENEMY.", c: RED }]} at="इसी-2" size={160} />
    <Label sub="ये कभी भरता नहीं" at="कभी" out="इसी-6" x={70} y={1420} rot={1.5} size={84} seed="g" />
  </>
);

const S5: React.FC = () => (
  <>
    <Clip src={V("smoke")} from={0} rate={1.2} zoom={[1.04, 1.1]} sound={SND.smoke} />
    <TopShade h={1000} a={0.66} />
    <Title lines={[{ t: "SMOKE HIDES" }, { t: "THE FIRE.", c: GOLD }]} at={0} out="वैसे-4" size={160} />
    <Title lines={[{ t: "DESIRE HIDES" }, { t: "YOUR SENSE.", c: RED }]} at="वैसे-2" size={150} />
    <Label mono="भगवद् गीता 3.38–39" at={6} x={70} y={1640} rot={-2} seed="h" />
  </>
);

const S6: React.FC = () => (
  <>
    <Clip src={V("shadow")} from={3} rate={0.65} zoom={[1.08, 1.14]} sound={SND.shadow} />
    <TopShade h={1000} a={0.66} />
    <BottomShade />
    <Title lines={[{ t: "WHEN IT RISES," }, { t: "NAME IT.", c: GOLD }]} at={0} size={160} />
    <Label title="ये काम है" at="काम" x={70} y={1380} rot={-2} size={96} seed="i" />
    <Label title="या ये क्रोध है" at="क्रोध" x={160} y={1560} rot={1.5} size={96} seed="j" />
  </>
);

const S7: React.FC = () => (
  <>
    <Clip src={V("shadow")} from={0} rate={0.45} dark={0.42} zoom={[1.04, 1.1]} />
    <TopShade h={1150} a={0.6} />
    <Dust n={18} />
    <Label title="SEND THIS" red="TO A FRIEND" sub="WHO FIGHTS HIS OWN ANGER" at={2} x={60} y={330} rot={-2} size={96} seed="m" />
    <Label title="COMMENT" sub="आपका बड़ा दुश्मन: काम या क्रोध?" at="कमेंट" x={70} y={600} rot={1.5} size={86} seed="n" />
    <Label title="NEXT STORY ·" red="YADA YADA" sub="THE FULL MEANING · GITA 4.7–8" at="अगली" x={40} y={880} rot={-1.5} size={74} seed="o" />
    <Label title="FOLLOW" red="@GITA.SHLOK.SERIES" at="फॉलो" x={70} y={1110} rot={2} size={74} seed="p" />
  </>
);

const SCENES: Record<string, React.FC> = { s1: S1, s2: S2, s3: S3, s4: S4, s5: S5, s6: S6, s7: S7 };

const Fade: React.FC<{ lead: number; children: React.ReactNode }> = ({ lead, children }) => {
  const f = useCurrentFrame();
  return <AbsoluteFill style={{ opacity: lead > 0 ? ease(f, 0, lead) : 1 }}>{children}</AbsoluteFill>;
};

export const Story20: React.FC = () => (
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
      <StorySound TL={TL} duck={DUCK} beds={[{ src: "sfx/battlefield.mp3", scenes: ["s2"], vol: 0.2 }, { src: "sfx/fire-gates.mp3", scenes: ["s4", "s5"], vol: 0.18 }]} hits={[{ src: "sfx/boom.mp3", at: 0, vol: 0.3 }, { src: "sfx/flare.mp3", at: TL.sceneFrames("s3").from + TL.cue("s3", "कृष्ण", 1, 0), vol: 0.2, dur: 60 }]} />
      <SeriesTag n="20" />
      <Finish />
    </AbsoluteFill>
  </TLCtx.Provider>
);
export const STORY20_FRAMES = TL.totalFrames;

export const Story20Cover: React.FC = () => (
  <TLCtx.Provider value={TL}>
    <AbsoluteFill style={{ background: "#0b0805" }}>
      <SceneId.Provider value="s1">
        <Sequence from={-60} layout="none">
          <S1 />
        </Sequence>
      </SceneId.Provider>
      <SeriesTag n="20" />
      <Finish />
    </AbsoluteFill>
  </TLCtx.Provider>
);
