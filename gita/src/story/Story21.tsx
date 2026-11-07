// Story 21 (new, EP 26) — "Yada yada hi dharmasya: the full meaning": Gita 4.7–4.8. 1 new Veo clip + 4 Flow pictures with code motion + 1 reused clip.
import React from "react";
import { AbsoluteFill, Audio, Img, Sequence, interpolate, staticFile, useCurrentFrame } from "remotion";
import { ease } from "../components/kit";
import { createTimeline, type Timing } from "../lib/timeline";
import timingJson from "../reels/story21/timing.json";
import { Dust, Finish, GOLD, Label, RED, Rays, SceneId, SeriesTag, TLCtx, Title, TopShade, useQ } from "./Story01";
import { Clip } from "./Story01V";
import { StorySound, buildDuck } from "./sound";

const timing = timingJson as unknown as Timing;
const TL = createTimeline(timing);
const DUCK = buildDuck(timing as never);
const V = (n: string) => `story21/clips/${n}.mp4`;
/** Clip sound levels (0 = muted). descent: the sound check found music (6/15 chord windows), so it stays muted; the rain comes from the storm bed. */
const SND: Record<string, number> = { descent: 0 };

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

/** Fades its children in from a cue (used to change pictures inside one scene). */
const FadeAt: React.FC<{ at: string; children: React.ReactNode }> = ({ at, children }) => {
  const f = useCurrentFrame();
  const q = useQ();
  const a = q(at) - 8;
  return (
    <AbsoluteFill style={{ opacity: ease(f, a, a + 12) }}>
      <Sequence from={a} layout="none">
        {children}
      </Sequence>
    </AbsoluteFill>
  );
};

const S1: React.FC = () => (
  <>
    <Clip src={V("descent")} from={0} rate={0.9} zoom={[1.04, 1.1]} sound={SND.descent} />
    <TopShade h={1000} a={0.7} />
    <Title lines={[{ t: "YADA YADA" }, { t: "HI DHARMASYA…", c: GOLD }]} at={0} out="पर-4" size={160} />
    <Title lines={[{ t: "EVERYONE'S HEARD IT." }, { t: "BUT THE FULL" }, { t: "MEANING?", c: GOLD }]} at="पर-2" size={130} />
  </>
);

const S2: React.FC = () => (
  <>
    <Clip src="story05/clips/krishna.mp4" from={0} rate={0.9} zoom={[1.04, 1.1]} />
    <TopShade h={900} a={0.62} />
    <Title lines={[{ t: "CHAPTER 4:" }, { t: "A PROMISE.", c: GOLD }]} at={0} size={170} />
    <Label mono="भगवद् गीता · अध्याय 4" at="अध्याय" x={70} y={1640} rot={-2} seed="a" />
  </>
);

const S3: React.FC = () => (
  <>
    <KenBurns src="img/story21/lamp.jpg" dur={TL.sceneFrames("s3").dur + 10} s={[1.06, 1.18]} y={[20, -30]} origin="50% 60%" />
    <TopShade h={900} a={0.6} />
    <BottomShade />
    <Label title={"यदा यदा हि धर्मस्य,\nग्लानिर्भवति भारत।"} refx="भगवद् गीता 4.7" at={2} out="हे-6" x={50} y={1400} rot={-1.5} size={92} seed="b" />
    <Title lines={[{ t: "WHENEVER" }, { t: "DHARMA", c: GOLD }, { t: "GROWS WEAK…" }]} at="हे-2" size={150} />
    <Label sub="जब जब धर्म कमज़ोर पड़ता है" at="जब" x={60} y={1440} rot={1.5} size={84} seed="c" />
  </>
);

const S4: React.FC = () => (
  <>
    <Clip src={V("descent")} from={1.5} rate={0.75} zoom={[1.06, 1.12]} sound={SND.descent} />
    <TopShade h={1000} a={0.62} />
    <BottomShade />
    <Label title={"अभ्युत्थानमधर्मस्य,\nतदात्मानं सृजाम्यहम्।"} refx="भगवद् गीता 4.7" at={2} out="और-6" x={50} y={1400} rot={-1.5} size={92} seed="d" />
    <Title lines={[{ t: "AND WRONG" }, { t: "RISES…", c: RED }]} at="और-2" out="तब-4" size={170} />
    <Title lines={[{ t: "I SHOW" }, { t: "MYSELF.", c: GOLD }]} at="तब-2" size={180} />
  </>
);

const S5: React.FC = () => {
  const q = useQ();
  const b = q("धर्मसंस्थापनार्थाय") - 8;
  return (
    <>
      <KenBurns src="img/story21/protect.jpg" dur={b + 20} s={[1.06, 1.16]} y={[-20, 40]} origin="50% 60%" />
      <FadeAt at="धर्मसंस्थापनार्थाय">
        <KenBurns src="img/story21/ages.jpg" dur={TL.sceneFrames("s5").dur - b + 10} s={[1.35, 1.35]} y={[-336, 336]} />
      </FadeAt>
      <TopShade h={900} a={0.6} />
      <BottomShade />
      <Label title={"परित्राणाय साधूनां,\nविनाशाय च दुष्कृताम्।"} refx="भगवद् गीता 4.8" at={2} out="अच्छों-6" x={50} y={1400} rot={-1.5} size={92} seed="e" />
      <Title lines={[{ t: "TO PROTECT" }, { t: "THE GOOD,", c: GOLD }, { t: "END THE WICKED." }]} at="अच्छों-2" out="धर्मसंस्थापनार्थाय-6" size={140} />
      <Label title={"धर्मसंस्थापनार्थाय,\nसम्भवामि युगे युगे।"} refx="भगवद् गीता 4.8" at="धर्मसंस्थापनार्थाय" out="धर्म#2-6" x={50} y={1400} rot={1.5} size={92} seed="f" />
      <Title lines={[{ t: "TO RESTORE DHARMA," }, { t: "AGE AFTER AGE.", c: GOLD }]} at="धर्म#2-2" size={140} />
    </>
  );
};

const S6: React.FC = () => (
  <>
    <KenBurns src="img/story21/onelamp.jpg" dur={TL.sceneFrames("s6").dur + 10} s={[1.06, 1.16]} y={[-30, 40]} origin="50% 65%" />
    <Rays />
    <TopShade h={1000} a={0.62} />
    <BottomShade />
    <Title lines={[{ t: "A PROMISE," }, { t: "NOT AN EXCUSE.", c: GOLD }]} at={0} out="आज-4" size={150} />
    <Title lines={[{ t: "TODAY: DO ONE" }, { t: "RIGHT THING.", c: GOLD }]} at="आज-2" size={150} />
    <Label sub="अपने हिस्से का एक सही काम" at="हिस्से" x={60} y={1420} rot={-1.5} size={84} seed="g" />
  </>
);

const S7: React.FC = () => (
  <>
    <Clip src={V("descent")} from={0} rate={0.45} dark={0.42} zoom={[1.04, 1.1]} />
    <TopShade h={1150} a={0.6} />
    <Dust n={18} />
    <Label title="SEND THIS" red="TO A FRIEND" sub="WHOSE FAITH IS SHAKING" at={2} x={60} y={330} rot={-2} size={96} seed="m" />
    <Label title="COMMENT" sub="लिखो: युगे युगे" at="कमेंट" x={70} y={600} rot={1.5} size={86} seed="n" />
    <Label title="NEXT STORY ·" red="ONE MORE SHLOKA" sub="GITA SHLOK SERIES" at="अगली" x={40} y={880} rot={-1.5} size={74} seed="o" />
    <Label title="FOLLOW" red="@GITA.SHLOK.SERIES" at="फॉलो" x={70} y={1110} rot={2} size={74} seed="p" />
  </>
);

const SCENES: Record<string, React.FC> = { s1: S1, s2: S2, s3: S3, s4: S4, s5: S5, s6: S6, s7: S7 };

const Fade: React.FC<{ lead: number; children: React.ReactNode }> = ({ lead, children }) => {
  const f = useCurrentFrame();
  return <AbsoluteFill style={{ opacity: lead > 0 ? ease(f, 0, lead) : 1 }}>{children}</AbsoluteFill>;
};

export const Story21: React.FC = () => (
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
      <StorySound TL={TL} duck={DUCK} beds={[{ src: "sfx/storm.mp3", scenes: ["s1"], vol: 0.2 }, { src: "sfx/battlefield.mp3", scenes: ["s2"], vol: 0.2 }, { src: "sfx/storm.mp3", scenes: ["s3"], vol: 0.2 }]} hits={[{ src: "sfx/boom.mp3", at: 0, vol: 0.3 }, { src: "sfx/flare.mp3", at: TL.sceneFrames("s4").from + TL.cue("s4", "तब", 1, -4), vol: 0.24, dur: 60 }, { src: "sfx/flare.mp3", at: TL.sceneFrames("s5").from + TL.cue("s5", "धर्मसंस्थापनार्थाय", 1, -6), vol: 0.2, dur: 60 }]} />
      <SeriesTag n="21" />
      <Finish />
    </AbsoluteFill>
  </TLCtx.Provider>
);
export const STORY21_FRAMES = TL.totalFrames;

export const Story21Cover: React.FC = () => (
  <TLCtx.Provider value={TL}>
    <AbsoluteFill style={{ background: "#0b0805" }}>
      <SceneId.Provider value="s1">
        <Sequence from={-60} layout="none">
          <S1 />
        </Sequence>
      </SceneId.Provider>
      <SeriesTag n="21" />
      <Finish />
    </AbsoluteFill>
  </TLCtx.Provider>
);
