// Story 15 (remake of EP 20) — "Doubting everything": Gita 4.40. 1 new Veo clip + 2 Flow pictures with code motion + 2 reused clips.
import React from "react";
import { AbsoluteFill, Audio, Img, Sequence, interpolate, staticFile, useCurrentFrame } from "remotion";
import { ease } from "../components/kit";
import { createTimeline, type Timing } from "../lib/timeline";
import timingJson from "../reels/story15/timing.json";
import { Dust, Finish, GOLD, Label, RED, SceneId, SeriesTag, TLCtx, Title, TopShade, useQ } from "./Story01";
import { Clip } from "./Story01V";

const timing = timingJson as unknown as Timing;
const TL = createTimeline(timing);
const V = (n: string) => `story15/clips/${n}.mp4`;
/** Clip sound levels (0 = muted). cross: a soft melody (D-B-A-G) runs under the wind, so it stays muted. */
const SND: Record<string, number> = { cross: 0 };

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
    <Clip src={V("cross")} from={0} rate={0.9} zoom={[1.04, 1.1]} sound={SND.cross} />
    <TopShade h={1000} a={0.7} />
    <Title lines={[{ t: "DOUBT" }, { t: "EVERYTHING?", c: RED }]} at={0} out="गीता-4" size={180} />
    <Title lines={[{ t: "THE GITA SAYS:" }, { t: "THE DOUBTER", c: GOLD }, { t: "IS DESTROYED." }]} at="गीता-2" size={140} />
    <Label title="संशयात्मा विनश्यति" refx="भगवद् गीता 4.40" at="संशयात्मा" x={80} y={1560} rot={-1.5} size={92} seed="a" />
  </>
);

const S2: React.FC = () => (
  <>
    <Clip src="story03/clips/krishna.mp4" from={0} rate={0.9} zoom={[1.04, 1.1]} />
    <TopShade h={900} a={0.62} />
    <Title lines={[{ t: "END OF CHAPTER 4:" }, { t: "KNOWLEDGE", c: GOLD }, { t: "& FAITH.", c: GOLD }]} at={0} size={150} />
    <Label mono="भगवद् गीता 4.39 – 4.40" at="अध्याय" x={70} y={1640} rot={-2} seed="b" />
  </>
);

const S3: React.FC = () => (
  <>
    <Clip src={V("cross")} from={0} rate={0.6} zoom={[1.08, 1.16]} sound={SND.cross} />
    <TopShade h={900} a={0.62} />
    <Title lines={[{ t: "KRISHNA" }, { t: "SAYS…", c: GOLD }]} at={0} out="जो-4" size={170} />
    <Label title={"अज्ञश्चाश्रद्दधानश्च\nसंशयात्मा विनश्यति।"} refx="भगवद् गीता 4.40" at={2} out="जो-6" x={50} y={1400} rot={-1.5} size={92} seed="c" />
    <Title lines={[{ t: "NO KNOWLEDGE," }, { t: "NO FAITH,", c: GOLD }, { t: "DOUBTING ALL…" }]} at="जो-2" out="वो-4" size={140} />
    <Title lines={[{ t: "…DESTROYS" }, { t: "ITSELF.", c: RED }]} at="वो-2" size={180} />
    <Label sub="न जानता है, न भरोसा करता है, हर चीज़ पर शक करता है" at="जो" x={50} y={1560} rot={1.5} size={80} seed="d" />
  </>
);

const S4: React.FC = () => (
  <>
    <KenBurns src="img/story15/doors.jpg" dur={TL.sceneFrames("s4").dur + 10} s={[1.06, 1.2]} y={[40, -60]} origin="50% 70%" />
    <TopShade h={900} a={0.62} />
    <Label title={"नायं लोकोऽस्ति न परो\nन सुखं संशयात्मनः।"} refx="भगवद् गीता 4.40" at={2} out="शक-6" x={50} y={320} rot={-1.5} size={92} seed="e" />
    <Title lines={[{ t: "FOR THE DOUBTER:" }, { t: "NOT THIS WORLD,", c: GOLD }, { t: "NOT THE NEXT,", c: GOLD }, { t: "NO PEACE.", c: RED }]} at="शक-2" size={120} />
  </>
);

const S5: React.FC = () => (
  <>
    <Clip src="story05/clips/arjunask.mp4" from={0} rate={0.9} zoom={[1.04, 1.1]} />
    <TopShade h={1000} a={0.66} />
    <Title lines={[{ t: "ASKING QUESTIONS" }, { t: "IS FINE.", c: GOLD }, { t: "ARJUNA ASKED TOO." }]} at={0} out="गलत#2-4" size={130} />
    <Title lines={[{ t: "STAYING STUCK" }, { t: "AFTER THE ANSWER", c: RED }, { t: "IS THE PROBLEM." }]} at="गलत#2-2" size={130} />
    <Label mono="भगवद् गीता 2.7 · 3.1 · 6.37 · 10.17" at="अर्जुन" x={50} y={1660} rot={-2} seed="f" />
  </>
);

const S6: React.FC = () => (
  <>
    <KenBurns src="img/story15/decide.jpg" dur={TL.sceneFrames("s6").dur + 10} s={[1.06, 1.18]} y={[-40, 60]} origin="50% 70%" />
    <TopShade h={1000} a={0.66} />
    <Title lines={[{ t: "THAT DECISION" }, { t: "YOU'VE DELAYED", c: GOLD }, { t: "FOR WEEKS…" }]} at={0} out="जानकारी-4" size={140} />
    <Title lines={[{ t: "GET THE FACTS." }, { t: "DECIDE", c: GOLD }, { t: "TODAY.", c: GOLD }]} at="जानकारी-2" size={160} />
  </>
);

const S7: React.FC = () => (
  <>
    <Clip src={V("cross")} from={0} rate={0.45} dark={0.42} zoom={[1.04, 1.1]} />
    <TopShade h={1150} a={0.6} />
    <Dust n={18} />
    <Label title="SEND THIS" red="TO A FRIEND" sub="WHO DOUBTS EVERYTHING" at={2} x={60} y={330} rot={-2} size={96} seed="m" />
    <Label title="COMMENT" sub="आप किस फ़ैसले पर अटके हो?" at="कमेंट" x={70} y={600} rot={1.5} size={84} seed="n" />
    <Label title="NEXT STORY ·" red="WHAT GOD REALLY WANTS" sub="GITA 9.26" at="अगली" x={50} y={880} rot={-1.5} size={80} seed="o" />
    <Label title="FOLLOW" red="@GITA.SHLOK.SERIES" at="फॉलो" x={70} y={1110} rot={2} size={74} seed="p" />
  </>
);

const SCENES: Record<string, React.FC> = { s1: S1, s2: S2, s3: S3, s4: S4, s5: S5, s6: S6, s7: S7 };

const Fade: React.FC<{ lead: number; children: React.ReactNode }> = ({ lead, children }) => {
  const f = useCurrentFrame();
  return <AbsoluteFill style={{ opacity: lead > 0 ? ease(f, 0, lead) : 1 }}>{children}</AbsoluteFill>;
};

export const Story15: React.FC = () => (
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
      <SeriesTag n="15" />
      <Finish />
    </AbsoluteFill>
  </TLCtx.Provider>
);
export const STORY15_FRAMES = TL.totalFrames;

export const Story15Cover: React.FC = () => (
  <TLCtx.Provider value={TL}>
    <AbsoluteFill style={{ background: "#0b0805" }}>
      <SceneId.Provider value="s1">
        <Sequence from={-95} layout="none">
          <S1 />
        </Sequence>
      </SceneId.Provider>
      <SeriesTag n="15" />
      <Finish />
    </AbsoluteFill>
  </TLCtx.Provider>
);
