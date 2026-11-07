// Story 10 (remake of EP 15) — "Three gates of hell": Gita 16.21. 1 new Veo clip (gates) + 2 Flow pictures with code motion + 2 reused clips.
// Test reel with NO music bed: only movie-style sound design (fire, battlefield wind, dawn fields, rain, whooshes, booms, flares).
import React from "react";
import { AbsoluteFill, Audio, Img, Sequence, interpolate, staticFile, useCurrentFrame } from "remotion";
import { ease } from "../components/kit";
import { createTimeline, type Timing } from "../lib/timeline";
import timingJson from "../reels/story10/timing.json";
import { Dust, Finish, GOLD, Label, RED, SceneId, SeriesTag, TLCtx, Title, TopShade, useQ } from "./Story01";
import { Clip } from "./Story01V";
import { Bed, Hit, buildDuck } from "./sound";

const timing = timingJson as unknown as Timing;
const TL = createTimeline(timing);
const V = (n: string) => `story10/clips/${n}.mp4`;
const P = (n: string) => `img/story10/${n}.jpg`;
/** Clip sound levels (0 = muted). Set after checking each clip has no speech or music. */
const SND: Record<string, number> = { gates: 0 };
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const DUCK = buildDuck(timing as never);
/** Global frame of a spoken word. */
const G = (id: string, key: string, nth = 1, off = 0) => TL.sceneFrames(id).from + TL.cue(id, key, nth, off);
const at = (id: string) => TL.sceneFrames(id).from;

/** Sound design: ambience beds (ducked under the voice) and one-shot hits. No music. */
const Sound: React.FC = () => {
  const T = TL.totalFrames;
  return (
    <>
      {/* Mixed with a quiet music bed (render_mix.sh): beds at ~70%, no whooshes on cuts, softer hits. */}
      <Bed src="sfx/fire-gates.mp3" duck={DUCK} total={T} levels={[[0, 0.22], [at("s2") - 5, 0.22], [at("s2") + 8, 0], [at("s3") - 7, 0], [at("s3") + 6, 0.22], [at("s4"), 0.22], [at("s4") + 10, 0.18], [at("s5"), 0.18], [at("s5") + 50, 0.08], [at("s5") + 100, 0], [T, 0]]} />
      <Bed src="sfx/battlefield.mp3" duck={DUCK} total={T} levels={[[at("s2") - 7, 0], [at("s2") + 8, 0.28], [at("s3") - 7, 0.28], [at("s3") + 7, 0]]} />
      <Bed src="sfx/fields.mp3" duck={DUCK} depth={0.3} total={T} levels={[[at("s5") + 28, 0], [at("s5") + 108, 0.45], [at("s6") - 2, 0.45], [at("s6") + 9, 0]]} />
      <Bed src="sfx/storm.mp3" duck={DUCK} total={T} levels={[[at("s6") - 7, 0], [at("s6") + 6, 0.24], [at("s7") - 6, 0.24], [at("s7") + 6, 0]]} />
      <Hit src="sfx/boom.mp3" at={0} vol={0.38} />
      <Hit src="sfx/boom.mp3" at={G("s3", "नरक", 2, -4)} vol={0.28} />
      <Hit src="sfx/flare.mp3" at={G("s4", "काम", 2, -5)} vol={0.28} dur={60} />
      <Hit src="sfx/flare.mp3" at={G("s4", "क्रोध", 2, -5)} vol={0.28} dur={60} />
      <Hit src="sfx/flare.mp3" at={G("s4", "लोभ", 2, -5)} vol={0.28} dur={60} />
    </>
  );
};

/** The three doorways of the gates picture, in 1080×1920 frame coordinates. */
const DOORS: [number, number][] = [
  [183, 1310],
  [524, 1240],
  [947, 1310],
];

/** Gates picture with a slow push-in; each doorway flares up when its name is spoken. */
const GatesStill: React.FC<{ dur: number; flare: string[] }> = ({ dur, flare }) => {
  const f = useCurrentFrame();
  const q = useQ();
  const s = interpolate(f, [0, dur], [1.04, 1.16], clamp);
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <AbsoluteFill style={{ transform: `scale(${s})`, transformOrigin: "50% 66%" }}>
        <Img src={staticFile(P("gates"))} style={{ width: 1080, height: 1920, objectFit: "cover" }} />
        {DOORS.map(([x, y], i) => {
          const a = q(flare[i]);
          const on = ease(f, a - 4, a + 10);
          const pulse = 0.85 + 0.15 * Math.sin((f - a) / 5);
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                left: x - 260,
                top: y - 420,
                width: 520,
                height: 840,
                borderRadius: "50%",
                background: "radial-gradient(closest-side, rgba(255,170,60,0.85), rgba(255,90,20,0.45) 45%, rgba(255,60,0,0) 100%)",
                mixBlendMode: "screen",
                opacity: on * pulse,
              }}
            />
          );
        })}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/** Walk-away picture: slow drift from the burning gates below up to the dawn above. */
const WalkAway: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useCurrentFrame();
  const t = ease(f, 0, dur);
  const y = interpolate(t, [0, 1], [-230, 200]);
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <Img src={staticFile(P("walkaway"))} style={{ position: "absolute", left: 0, top: 0, width: 1080, height: 1920, objectFit: "cover", transform: `translateY(${y}px) scale(1.26)` }} />
    </AbsoluteFill>
  );
};

const S1: React.FC = () => (
  <>
    <Clip src={V("gates")} from={0} rate={0.9} zoom={[1.04, 1.1]} sound={SND.gates} />
    <TopShade h={1000} a={0.7} />
    <Title lines={[{ t: "3 GATES" }, { t: "OF HELL.", c: RED }]} at={0} out="गीता-4" size={180} />
    <Title lines={[{ t: "THE GITA" }, { t: "NAMES ALL 3.", c: GOLD }]} at="गीता-2" size={150} />
  </>
);

const S2: React.FC = () => (
  <>
    <Clip src="story05/clips/krishna.mp4" from={0} rate={0.9} zoom={[1.04, 1.1]} />
    <TopShade h={900} a={0.62} />
    <Title lines={[{ t: "IN CHAPTER 16," }, { t: "KRISHNA SHOWS", c: GOLD }]} at={0} out="दैवी-4" size={140} />
    <Title lines={[{ t: "2 NATURES:" }, { t: "DIVINE", c: GOLD }, { t: "& DEMONIC", c: RED }]} at="दैवी-2" size={150} />
    <Label mono="भगवद् गीता · अध्याय 16" at="अध्याय" x={70} y={1640} rot={-2} seed="a" />
  </>
);

const S3: React.FC = () => (
  <>
    <Clip src={V("gates")} from={1.5} rate={0.75} zoom={[1.08, 1.14]} sound={SND.gates} />
    <TopShade h={900} a={0.62} />
    <Title lines={[{ t: "KRISHNA" }, { t: "SAYS…", c: GOLD }]} at={0} out="नरक#2-4" size={170} />
    <Label title={"त्रिविधं नरकस्येदं\nद्वारं नाशनमात्मनः।"} refx="भगवद् गीता 16.21" at="त्रिविधं" out="नरक#2-6" x={50} y={1400} rot={-1.5} size={92} seed="b" />
    <Title lines={[{ t: "3 GATES" }, { t: "TO HELL…", c: RED }]} at="नरक#2-2" out="जो-4" size={170} />
    <Title lines={[{ t: "THAT DESTROY" }, { t: "YOU FROM", c: GOLD }, { t: "WITHIN.", c: GOLD }]} at="जो-2" size={150} />
    <Label sub="नरक के तीन दरवाज़े, जो इंसान को अंदर से खत्म करते हैं" at="नरक#2" x={50} y={1560} rot={1.5} size={86} seed="c" />
  </>
);

const S4: React.FC = () => (
  <>
    <GatesStill dur={TL.sceneFrames("s4").dur} flare={["काम#2", "क्रोध#2", "लोभ#2"]} />
    <TopShade h={900} a={0.66} />
    <Label title="कामः क्रोधस्तथा लोभः" refx="भगवद् गीता 16.21" at={2} out="काम#2-6" x={50} y={420} rot={-1.5} size={96} seed="d" />
    <Title lines={[{ t: "1. DESIRE", c: RED }]} at="काम#2-2" top={230} size={140} />
    <Title lines={[{ t: "2. ANGER", c: RED }]} at="क्रोध#2-2" top={400} size={140} />
    <Title lines={[{ t: "3. GREED", c: RED }]} at="लोभ#2-2" top={570} size={140} />
    <Label sub="काम = बेकाबू चाहत" at="काम#2" out="क्रोध#2-4" x={240} y={1700} rot={1.5} size={84} seed="e" />
    <Label sub="क्रोध = गुस्सा" at="क्रोध#2" out="लोभ#2-4" x={290} y={1700} rot={-1.5} size={84} seed="f" />
    <Label sub="लोभ = लालच" at="लोभ#2" x={300} y={1700} rot={1.5} size={84} seed="g" />
  </>
);

const S5: React.FC = () => (
  <>
    <WalkAway dur={TL.sceneFrames("s5").dur + 10} />
    <TopShade h={900} a={0.66} />
    <Label title="तस्मादेतत्त्रयं त्यजेत्" refx="भगवद् गीता 16.21" at={2} out="इसलिए-6" x={50} y={420} rot={-1.5} size={96} seed="h" />
    <Title lines={[{ t: "SO," }, { t: "LET ALL 3", c: GOLD }, { t: "GO.", c: GOLD }]} at="इसलिए-2" size={170} />
    <Label sub="इसलिए, इन तीनों को छोड़ो" at="इसलिए" x={160} y={1660} rot={1.5} size={86} seed="i" />
  </>
);

const S6: React.FC = () => (
  <>
    <Clip src="story03/clips/diary.mp4" from={0} zoom={[1.02, 1.08]} />
    <TopShade h={1000} a={0.66} />
    <Title lines={[{ t: "TONIGHT," }, { t: "BEFORE SLEEP,", c: GOLD }, { t: "ASK YOURSELF:" }]} at={0} out="आज#2-4" size={140} />
    <Title lines={[{ t: "WHICH GATE" }, { t: "WAS OPEN", c: RED }, { t: "TODAY?", c: RED }]} at="आज#2-2" size={160} />
  </>
);

const S7: React.FC = () => (
  <>
    <Clip src={V("gates")} from={0} rate={0.52} dark={0.42} zoom={[1.04, 1.1]} />
    <TopShade h={1150} a={0.6} />
    <Dust n={18} color="255,170,110" />
    <Label title="SEND THIS" red="TO A FRIEND" sub="WHO NEEDS THIS REMINDER" at={2} x={60} y={330} rot={-2} size={96} seed="m" />
    <Label title="COMMENT" sub="आपके लिए कौन सा दरवाज़ा सबसे मुश्किल है?" at="कमेंट" x={70} y={600} rot={1.5} size={78} seed="n" />
    <Label title="NEXT STORY ·" red="WHY KIDS DON'T LISTEN" sub="बच्चे आपकी बात क्यों नहीं मानते?" at="अगली" x={50} y={880} rot={-1.5} size={76} seed="o" />
    <Label title="FOLLOW" red="@GITA.SHLOK.SERIES" at="फॉलो" x={70} y={1130} rot={2} size={74} seed="p" />
  </>
);

const SCENES: Record<string, React.FC> = { s1: S1, s2: S2, s3: S3, s4: S4, s5: S5, s6: S6, s7: S7 };

const Fade: React.FC<{ lead: number; children: React.ReactNode }> = ({ lead, children }) => {
  const f = useCurrentFrame();
  return <AbsoluteFill style={{ opacity: lead > 0 ? ease(f, 0, lead) : 1 }}>{children}</AbsoluteFill>;
};

export const Story10: React.FC = () => (
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
      <Sound />
      <SeriesTag n="10" />
      <Finish />
    </AbsoluteFill>
  </TLCtx.Provider>
);
export const STORY10_FRAMES = TL.totalFrames;

export const Story10Cover: React.FC = () => (
  <TLCtx.Provider value={TL}>
    <AbsoluteFill style={{ background: "#0b0805" }}>
      <SceneId.Provider value="s1">
        <Sequence from={-32} layout="none">
          <S1 />
        </Sequence>
      </SceneId.Provider>
      <SeriesTag n="10" />
      <Finish />
    </AbsoluteFill>
  </TLCtx.Provider>
);
