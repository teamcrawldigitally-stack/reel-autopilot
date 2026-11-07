// Story 12 (remake of EP 17) — "The upside-down tree": Gita 15.1 and 15.3. 2 new Veo clips + 2 Flow pictures with code motion + 1 reused clip.
import React from "react";
import { AbsoluteFill, Audio, Img, Sequence, interpolate, staticFile, useCurrentFrame } from "remotion";
import { ease } from "../components/kit";
import { createTimeline, type Timing } from "../lib/timeline";
import timingJson from "../reels/story12/timing.json";
import { Dust, Finish, GOLD, Label, RED, SceneId, SeriesTag, TLCtx, Title, TopShade, useQ } from "./Story01";
import { Clip } from "./Story01V";
import { StorySound, buildDuck } from "./sound";

const timing = timingJson as unknown as Timing;
const TL = createTimeline(timing);
const DUCK = buildDuck(timing as never);
const V = (n: string) => `story12/clips/${n}.mp4`;
/** Clip sound levels (0 = muted). tree: carries music, muted. axe: swing whoosh and chop, no speech or music. */
const SND: Record<string, number> = { tree: 0, axe: 0.6 };

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

/** White flash when the axe lands. */
const Flash: React.FC<{ at: string }> = ({ at }) => {
  const f = useCurrentFrame();
  const q = useQ();
  const a = q(at);
  const o = f < a ? 0 : Math.max(0, 1 - (f - a) / 10);
  return <AbsoluteFill style={{ background: "#fff8e6", opacity: o * 0.75, pointerEvents: "none" }} />;
};

const S1: React.FC = () => (
  <>
    <Clip src={V("tree")} from={0} rate={0.9} zoom={[1.04, 1.1]} sound={SND.tree} />
    <TopShade h={1000} a={0.7} />
    <Title lines={[{ t: "THE GITA" }, { t: "HAS A TREE…", c: GOLD }]} at={0} out="जिसे-4" size={160} />
    <Title lines={[{ t: "KRISHNA SAYS:" }, { t: "CUT IT DOWN.", c: RED }]} at="जिसे-2" size={150} />
  </>
);

const S2: React.FC = () => (
  <>
    <Clip src="story01/clips/c1-battlefield.mp4" from={0} rate={0.9} zoom={[1.04, 1.1]} />
    <TopShade h={900} a={0.62} />
    <Title lines={[{ t: "CHAPTER 15:" }, { t: "A STRANGE", c: GOLD }, { t: "TREE.", c: GOLD }]} at={0} size={160} />
    <Label mono="भगवद् गीता · अध्याय 15" at="अध्याय" x={70} y={1640} rot={-2} seed="a" />
  </>
);

const S3: React.FC = () => (
  <>
    <Clip src={V("tree")} from={2} rate={0.7} zoom={[1.08, 1.14]} sound={SND.tree} />
    <TopShade h={900} a={0.62} />
    <Label title="ऊर्ध्वमूलमधःशाखम्" refx="भगवद् गीता 15.1" at={2} out="ऐसा-6" x={50} y={1400} rot={-1.5} size={100} seed="b" />
    <Title lines={[{ t: "ROOTS ABOVE,", c: GOLD }, { t: "BRANCHES" }, { t: "BELOW." }]} at="ऐसा-2" size={160} />
    <Label sub="पीपल का पेड़: जड़ें ऊपर, शाखाएँ नीचे" at="पीपल" x={70} y={1560} rot={1.5} size={86} seed="c" />
  </>
);

const S4: React.FC = () => (
  <>
    <KenBurns src="img/story12/tree.jpg" dur={TL.sceneFrames("s4").dur + 10} s={[1.12, 1.26]} y={[160, -160]} />
    <TopShade h={900} a={0.62} />
    <Label title="छन्दांसि यस्य पर्णानि" refx="भगवद् गीता 15.1" at={2} out="वेद-6" x={50} y={1400} rot={-1.5} size={96} seed="d" />
    <Title lines={[{ t: "ITS LEAVES:" }, { t: "THE VEDAS.", c: GOLD }]} at="वेद-2" out="ये-4" size={160} />
    <Title lines={[{ t: "THIS TREE" }, { t: "IS THE WORLD.", c: GOLD }]} at="ये-2" size={150} />
    <Label sub="जिसमें हम सब उलझे हैं" at="जिसमें" x={200} y={1600} rot={1.5} size={86} seed="e" />
  </>
);

const S5: React.FC = () => (
  <>
    <Clip src={V("axe")} from={0} rate={0.9} zoom={[1.04, 1.1]} sound={SND.axe} />
    <TopShade h={900} a={0.62} />
    <Title lines={[{ t: "AND IN" }, { t: "VERSE 3…", c: GOLD }]} at={0} out="असङ्गशस्त्रेण-4" size={170} />
    <Label title="असङ्गशस्त्रेण दृढेन छित्त्वा" refx="भगवद् गीता 15.3" at="असङ्गशस्त्रेण" out="इसे-6" x={40} y={1400} rot={-1.5} size={84} seed="f" />
    <Title lines={[{ t: "CUT IT WITH" }, { t: "THE STRONG AXE", c: GOLD }, { t: "OF DETACHMENT." }]} at="इसे-2" size={130} />
    <Label sub="लगाव ना रखने की मज़बूत कुल्हाड़ी" at="इसे" x={110} y={1600} rot={1.5} size={86} seed="g" />
    <Flash at="छित्त्वा" />
  </>
);

const S6: React.FC = () => (
  <>
    <KenBurns src="img/story12/puppet.jpg" dur={TL.sceneFrames("s6").dur + 10} s={[1.06, 1.2]} y={[-60, 80]} origin="50% 70%" />
    <TopShade h={1000} a={0.66} />
    <Title lines={[{ t: "CUTTING" }, { t: "≠ RUNNING", c: GOLD }, { t: "AWAY.", c: GOLD }]} at={0} out="सब-4" size={160} />
    <Title lines={[{ t: "DO EVERYTHING," }, { t: "BUT DON'T CLING…", c: GOLD }]} at="सब-2" out="कि-4" size={130} />
    <Title lines={[{ t: "…TILL IT PULLS" }, { t: "YOUR STRINGS.", c: RED }]} at="कि-2" size={140} />
  </>
);

const S7: React.FC = () => (
  <>
    <Clip src={V("tree")} from={0} rate={0.5} dark={0.42} zoom={[1.04, 1.1]} />
    <TopShade h={1150} a={0.6} />
    <Dust n={18} />
    <Label title="SEND THIS" red="TO A FRIEND" sub="WHO LOVES THE GITA'S DEEP IDEAS" at={2} x={60} y={330} rot={-2} size={96} seed="m" />
    <Label title="COMMENT" sub="आपको किस चीज़ से सबसे ज़्यादा लगाव है?" at="कमेंट" x={70} y={600} rot={1.5} size={80} seed="n" />
    <Label title="NEXT STORY ·" red="ARE THEY REALLY GONE?" sub="GITA 2.20" at="अगली" x={50} y={880} rot={-1.5} size={80} seed="o" />
    <Label title="FOLLOW" red="@GITA.SHLOK.SERIES" at="फॉलो" x={70} y={1110} rot={2} size={74} seed="p" />
  </>
);

const SCENES: Record<string, React.FC> = { s1: S1, s2: S2, s3: S3, s4: S4, s5: S5, s6: S6, s7: S7 };

const Fade: React.FC<{ lead: number; children: React.ReactNode }> = ({ lead, children }) => {
  const f = useCurrentFrame();
  return <AbsoluteFill style={{ opacity: lead > 0 ? ease(f, 0, lead) : 1 }}>{children}</AbsoluteFill>;
};

export const Story12: React.FC = () => (
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
      <StorySound TL={TL} duck={DUCK} beds={[{ src: "sfx/battlefield.mp3", scenes: ["s2"], vol: 0.22 }, { src: "sfx/fields.mp3", scenes: ["s3", "s4"], vol: 0.25 }, { src: "sfx/fields.mp3", scenes: ["s6"], vol: 0.2 }]} hits={[{ src: "sfx/boom.mp3", at: 0, vol: 0.3 }]} />
      <SeriesTag n="12" />
      <Finish />
    </AbsoluteFill>
  </TLCtx.Provider>
);
export const STORY12_FRAMES = TL.totalFrames;

export const Story12Cover: React.FC = () => (
  <TLCtx.Provider value={TL}>
    <AbsoluteFill style={{ background: "#0b0805" }}>
      <SceneId.Provider value="s1">
        <Sequence from={-90} layout="none">
          <S1 />
        </Sequence>
      </SceneId.Provider>
      <SeriesTag n="12" />
      <Finish />
    </AbsoluteFill>
  </TLCtx.Provider>
);
