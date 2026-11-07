// Story 17 (remake of EP 22) — "I did it all": Gita 3.27. 1 new Veo clip + 3 Flow pictures with code motion + 1 reused clip.
import React from "react";
import { AbsoluteFill, Audio, Img, Sequence, interpolate, staticFile, useCurrentFrame } from "remotion";
import { ease } from "../components/kit";
import { createTimeline, type Timing } from "../lib/timeline";
import timingJson from "../reels/story17/timing.json";
import { Dust, Finish, GOLD, Label, RED, SceneId, SeriesTag, TLCtx, Title, TopShade, useQ } from "./Story01";
import { Clip } from "./Story01V";

const timing = timingJson as unknown as Timing;
const TL = createTimeline(timing);
const V = (n: string) => `story17/clips/${n}.mp4`;
/** Clip sound levels (0 = muted). podium: soft applause and creak, no speech or music. */
const SND: Record<string, number> = { podium: 0.5 };

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
    <Clip src={V("podium")} from={0} rate={0.9} zoom={[1.04, 1.1]} sound={SND.podium} />
    <TopShade h={1000} a={0.7} />
    <Title lines={[{ t: "“I DID" }, { t: "IT ALL.”", c: GOLD }]} at={0} out="यही-4" size={190} />
    <Title lines={[{ t: "THE GITA" }, { t: "CALLS IT" }, { t: "EGO.", c: RED }]} at="यही-2" size={170} />
  </>
);

const S2: React.FC = () => (
  <>
    <Clip src="story03/clips/arjun.mp4" from={0} rate={0.9} zoom={[1.04, 1.1]} />
    <TopShade h={900} a={0.62} />
    <Title lines={[{ t: "CHAPTER 3:" }, { t: "WHO REALLY", c: GOLD }, { t: "DOES THE WORK?" }]} at={0} size={150} />
    <Label mono="भगवद् गीता · अध्याय 3 · कर्मयोग" at="अध्याय" x={60} y={1640} rot={-2} seed="a" />
  </>
);

const S3: React.FC = () => (
  <>
    <KenBurns src="img/story17/loom.jpg" dur={TL.sceneFrames("s3").dur + 10} s={[1.14, 1.2]} y={[200, -200]} />
    <TopShade h={900} a={0.6} />
    <Title lines={[{ t: "KRISHNA" }, { t: "SAYS…", c: GOLD }]} at={0} out="सारे-4" size={170} />
    <Label title={"प्रकृतेः क्रियमाणानि\nगुणैः कर्माणि सर्वशः।"} refx="भगवद् गीता 3.27" at={2} out="सारे-6" x={50} y={1400} rot={-1.5} size={92} seed="b" />
    <Title lines={[{ t: "ALL ACTIONS" }, { t: "ARE DONE BY" }, { t: "NATURE'S FORCES.", c: GOLD }]} at="सारे-2" size={130} />
  </>
);

const S4: React.FC = () => (
  <>
    <Clip src={V("podium")} from={2.5} rate={0.7} zoom={[1.08, 1.14]} sound={SND.podium} />
    <TopShade h={900} a={0.62} />
    <Label title={"अहङ्कारविमूढात्मा\nकर्ताहमिति मन्यते।"} refx="भगवद् गीता 3.27" at={2} out="पर-6" x={50} y={1400} rot={-1.5} size={92} seed="c" />
    <Title lines={[{ t: "BUT THE EGO-" }, { t: "BLINDED ONE", c: GOLD }, { t: "THINKS…" }]} at="पर-2" out="ये-4" size={140} />
    <Title lines={[{ t: "“I DID" }, { t: "IT ALL.”", c: RED }]} at="ये-2" size={190} />
  </>
);

const S5: React.FC = () => (
  <>
    <KenBurns src="img/story17/promo.jpg" dur={TL.sceneFrames("s5").dur + 10} s={[1.04, 1.1]} y={[0, -30]} />
    <TopShade h={700} a={0.5} />
    <Title lines={[{ t: "SAY YOU GOT" }, { t: "A PROMOTION.", c: GOLD }]} at={0} out="उसमें-4" size={150} />
    <Label title="सही वक्त" at="वक्त" x={60} y={330} rot={-2} size={78} seed="d" />
    <Label title="बॉस का भरोसा" at="बॉस" x={30} y={800} rot={2} size={78} seed="e" />
    <Label title="टीम का काम" at="टीम" x={620} y={920} rot={-2} size={78} seed="f" />
    <Label title="आपकी मेहनत" at="मेहनत" x={300} y={1320} rot={1.5} size={84} seed="g" />
    <Label sub="सब जुड़ा है" at="सब" x={330} y={1700} rot={-1} size={90} seed="h" />
  </>
);

const S6: React.FC = () => (
  <>
    <KenBurns src="img/story17/thanks.jpg" dur={TL.sceneFrames("s6").dur + 10} s={[1.06, 1.14]} y={[-30, 40]} origin="50% 70%" />
    <TopShade h={1000} a={0.66} />
    <Title lines={[{ t: "NEXT WIN:" }, { t: "THANK ONE", c: GOLD }, { t: "PERSON", c: GOLD }, { t: "BY NAME." }]} at={0} size={140} />
  </>
);

const S7: React.FC = () => (
  <>
    <Clip src={V("podium")} from={0} rate={0.5} dark={0.42} zoom={[1.04, 1.1]} />
    <TopShade h={1150} a={0.6} />
    <Dust n={18} />
    <Label title="SEND THIS" red="TO A FRIEND" sub="WHO TAKES ALL THE CREDIT" at={2} x={60} y={330} rot={-2} size={96} seed="m" />
    <Label title="COMMENT" sub="आपकी पिछली जीत में किसका हाथ था?" at="कमेंट" x={70} y={600} rot={1.5} size={80} seed="n" />
    <Label title="NEXT STORY ·" red="ONE IN A THOUSAND" sub="GITA 7.3" at="अगली" x={50} y={880} rot={-1.5} size={80} seed="o" />
    <Label title="FOLLOW" red="@GITA.SHLOK.SERIES" at="फॉलो" x={70} y={1110} rot={2} size={74} seed="p" />
  </>
);

const SCENES: Record<string, React.FC> = { s1: S1, s2: S2, s3: S3, s4: S4, s5: S5, s6: S6, s7: S7 };

const Fade: React.FC<{ lead: number; children: React.ReactNode }> = ({ lead, children }) => {
  const f = useCurrentFrame();
  return <AbsoluteFill style={{ opacity: lead > 0 ? ease(f, 0, lead) : 1 }}>{children}</AbsoluteFill>;
};

export const Story17: React.FC = () => (
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
      <SeriesTag n="17" />
      <Finish />
    </AbsoluteFill>
  </TLCtx.Provider>
);
export const STORY17_FRAMES = TL.totalFrames;

export const Story17Cover: React.FC = () => (
  <TLCtx.Provider value={TL}>
    <AbsoluteFill style={{ background: "#0b0805" }}>
      <SceneId.Provider value="s1">
        <Sequence from={-100} layout="none">
          <S1 />
        </Sequence>
      </SceneId.Provider>
      <SeriesTag n="17" />
      <Finish />
    </AbsoluteFill>
  </TLCtx.Provider>
);
