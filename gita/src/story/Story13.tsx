// Story 13 (remake of EP 18) — "The one who left": Gita 2.20 and 2.22. 2 new Veo clips + 2 Flow pictures with code motion + 1 reused clip.
import React from "react";
import { AbsoluteFill, Audio, Img, Sequence, interpolate, staticFile, useCurrentFrame } from "remotion";
import { ease } from "../components/kit";
import { createTimeline, type Timing } from "../lib/timeline";
import timingJson from "../reels/story13/timing.json";
import { Dust, Finish, GOLD, Label, RED, SceneId, SeriesTag, TLCtx, Title, TopShade, useQ } from "./Story01";
import { Clip } from "./Story01V";
import { StorySound, buildDuck } from "./sound";

const timing = timingJson as unknown as Timing;
const TL = createTimeline(timing);
const DUCK = buildDuck(timing as never);
const V = (n: string) => `story13/clips/${n}.mp4`;
/** Clip sound levels (0 = muted). diya: borderline tonal (4/15 note windows), kept muted to be safe. clothes: soft room tone and cloth rustle, no speech or music. */
const SND: Record<string, number> = { diya: 0, clothes: 0.5 };

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

const S1: React.FC = () => (
  <>
    <Clip src={V("diya")} from={0} rate={0.9} zoom={[1.04, 1.1]} sound={SND.diya} />
    <TopShade h={1000} a={0.7} />
    <Title lines={[{ t: "THE ONE" }, { t: "WHO LEFT…", c: GOLD }, { t: "ARE THEY GONE?" }]} at={0} out="गीता-4" size={150} />
    <Title lines={[{ t: "THE GITA" }, { t: "SAYS: NO.", c: GOLD }]} at="गीता-2" size={170} />
  </>
);

const S2: React.FC = () => (
  <>
    <Clip src="story03/clips/arjun.mp4" from={0} rate={0.9} zoom={[1.04, 1.1]} />
    <TopShade h={900} a={0.62} />
    <Title lines={[{ t: "BEFORE THE WAR," }, { t: "ARJUNA WEPT", c: GOLD }, { t: "FOR HIS OWN." }]} at={0} size={140} />
    <Label mono="भगवद् गीता 2.1 · भावार्थ" at="अर्जुन" x={70} y={1640} rot={-2} seed="a" />
  </>
);

const S3: React.FC = () => (
  <>
    <KenBurns src="img/story13/flame.jpg" dur={TL.sceneFrames("s3").dur + 10} s={[1.06, 1.2]} y={[40, -40]} />
    <TopShade h={900} a={0.62} />
    <Label title="न जायते म्रियते वा कदाचित्" refx="भगवद् गीता 2.20" at={2} out="आत्मा-6" x={50} y={1400} rot={-1.5} size={92} seed="b" />
    <Title lines={[{ t: "THE SOUL" }, { t: "IS NEVER BORN,", c: GOLD }, { t: "NEVER DIES." }]} at="आत्मा-2" size={140} />
    <Label sub="आत्मा न कभी जन्म लेती है, न कभी मरती है" at="आत्मा" x={50} y={1580} rot={1.5} size={86} seed="c" />
  </>
);

const S4: React.FC = () => (
  <>
    <Clip src={V("diya")} from={2.5} rate={0.65} zoom={[1.08, 1.14]} sound={SND.diya} />
    <TopShade h={900} a={0.62} />
    <Label title="अजो नित्यः शाश्वतोऽयं पुराणः" refx="भगवद् गीता 2.20" at={2} out="वो-6" x={40} y={1400} rot={-1.5} size={86} seed="d" />
    <Title lines={[{ t: "UNBORN." }, { t: "ETERNAL.", c: GOLD }]} at="वो-2" out="शरीर-4" size={180} />
    <Title lines={[{ t: "THE BODY ENDS." }, { t: "THE SOUL", c: GOLD }, { t: "DOESN'T.", c: GOLD }]} at="शरीर-2" size={150} />
  </>
);

const S5: React.FC = () => (
  <>
    <Clip src={V("clothes")} from={0} rate={0.9} zoom={[1.04, 1.1]} sound={SND.clothes} />
    <TopShade h={900} a={0.62} />
    <Title lines={[{ t: "TWO VERSES" }, { t: "LATER…", c: GOLD }]} at={0} out="जैसे-4" size={170} />
    <Title lines={[{ t: "LIKE TRADING" }, { t: "OLD CLOTHES", c: GOLD }, { t: "FOR NEW ONES." }]} at="जैसे-2" size={140} />
    <Label mono="भगवद् गीता 2.22 · भावार्थ" at="जैसे" x={70} y={1640} rot={-2} seed="e" />
  </>
);

const S6: React.FC = () => (
  <>
    <KenBurns src="img/story13/habit.jpg" dur={TL.sceneFrames("s6").dur + 10} s={[1.06, 1.18]} y={[-40, 60]} origin="50% 70%" />
    <TopShade h={1000} a={0.66} />
    <Title lines={[{ t: "TODAY, ADOPT" }, { t: "ONE GOOD HABIT", c: GOLD }, { t: "OF THE ONE" }, { t: "YOU LOST." }]} at={0} out="वो-4" size={130} />
    <Title lines={[{ t: "THEY'LL" }, { t: "LIVE ON", c: GOLD }, { t: "IN YOU.", c: GOLD }]} at="वो-2" size={170} />
  </>
);

const S7: React.FC = () => (
  <>
    <Clip src={V("diya")} from={0} rate={0.55} dark={0.42} zoom={[1.04, 1.1]} />
    <TopShade h={1150} a={0.6} />
    <Dust n={18} />
    <Label title="SEND THIS" red="TO SOMEONE" sub="WHO RECENTLY LOST A LOVED ONE" at={2} x={60} y={330} rot={-2} size={96} seed="m" />
    <Label title="COMMENT" sub="उनका नाम लिखो, जिन्हें आप याद करते हो" at="कमेंट" x={70} y={600} rot={1.5} size={80} seed="n" />
    <Label title="NEXT STORY ·" red="WHERE TO FIND KRISHNA?" sub="GITA 10" at="अगली" x={50} y={880} rot={-1.5} size={78} seed="o" />
    <Label title="FOLLOW" red="@GITA.SHLOK.SERIES" at="फॉलो" x={70} y={1110} rot={2} size={74} seed="p" />
  </>
);

const SCENES: Record<string, React.FC> = { s1: S1, s2: S2, s3: S3, s4: S4, s5: S5, s6: S6, s7: S7 };

const Fade: React.FC<{ lead: number; children: React.ReactNode }> = ({ lead, children }) => {
  const f = useCurrentFrame();
  return <AbsoluteFill style={{ opacity: lead > 0 ? ease(f, 0, lead) : 1 }}>{children}</AbsoluteFill>;
};

export const Story13: React.FC = () => (
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
      <StorySound TL={TL} duck={DUCK} beds={[{ src: "sfx/storm.mp3", scenes: ["s1"], vol: 0.18 }, { src: "sfx/battlefield.mp3", scenes: ["s2"], vol: 0.2 }, { src: "sfx/storm.mp3", scenes: ["s3", "s4"], vol: 0.18 }, { src: "sfx/fields.mp3", scenes: ["s6"], vol: 0.2 }]} hits={[{ src: "sfx/boom.mp3", at: 0, vol: 0.25 }]} />
      <SeriesTag n="13" />
      <Finish />
    </AbsoluteFill>
  </TLCtx.Provider>
);
export const STORY13_FRAMES = TL.totalFrames;

export const Story13Cover: React.FC = () => (
  <TLCtx.Provider value={TL}>
    <AbsoluteFill style={{ background: "#0b0805" }}>
      <SceneId.Provider value="s1">
        <Sequence from={-100} layout="none">
          <S1 />
        </Sequence>
      </SceneId.Provider>
      <SeriesTag n="13" />
      <Finish />
    </AbsoluteFill>
  </TLCtx.Provider>
);
