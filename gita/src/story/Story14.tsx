// Story 14 (remake of EP 19) — "Where to find Krishna": Gita 10.17–10.41. 1 new Veo clip + 2 Flow pictures with code motion + 3 reused clips.
import React from "react";
import { AbsoluteFill, Audio, Img, Sequence, interpolate, staticFile, useCurrentFrame } from "remotion";
import { ease } from "../components/kit";
import { createTimeline, type Timing } from "../lib/timeline";
import timingJson from "../reels/story14/timing.json";
import { Dust, Finish, GOLD, Label, RED, SceneId, SeriesTag, TLCtx, Title, TopShade, useQ } from "./Story01";
import { Clip } from "./Story01V";

const timing = timingJson as unknown as Timing;
const TL = createTimeline(timing);
const V = (n: string) => `story14/clips/${n}.mp4`;
/** Clip sound levels (0 = muted). reflect: carries music (12/15 note windows), muted. */
const SND: Record<string, number> = { reflect: 0 };

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

/** Picture tour: the camera glides between focus points of one tall picture as each one is named. */
const Tour: React.FC<{ src: string; s: number; stops: { at: string | number; x: number; y: number }[] }> = ({ src, s, stops }) => {
  const f = useCurrentFrame();
  const q = useQ();
  const mx = 540 * (s - 1), my = 960 * (s - 1);
  const pos = (p: { x: number; y: number }) => ({
    x: Math.max(-mx, Math.min(mx, -s * (p.x - 540))),
    y: Math.max(-my, Math.min(my, -s * (p.y - 960))),
  });
  let cur = pos(stops[0]);
  for (let i = 1; i < stops.length; i++) {
    const a = typeof stops[i].at === "number" ? (stops[i].at as number) : q(stops[i].at as string) - 8;
    const t = ease(f, a, a + 20);
    const nx = pos(stops[i]);
    cur = { x: cur.x + (nx.x - cur.x) * t, y: cur.y + (nx.y - cur.y) * t };
  }
  const drift = 1 + 0.03 * Math.min(1, f / 180);
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <Img src={staticFile(src)} style={{ position: "absolute", left: 0, top: 0, width: 1080, height: 1920, objectFit: "cover", transform: `translate(${cur.x}px, ${cur.y}px) scale(${s * drift})` }} />
    </AbsoluteFill>
  );
};

const S1: React.FC = () => (
  <>
    <Clip src="story05/clips/arjunask.mp4" from={0} rate={0.9} zoom={[1.04, 1.1]} />
    <TopShade h={1000} a={0.7} />
    <Title lines={[{ t: "ARJUNA ASKED:" }, { t: "“WHERE DO I", c: GOLD }, { t: "FIND YOU?”", c: GOLD }]} at={0} out="कृष्ण-4" size={150} />
    <Title lines={[{ t: "KRISHNA'S LIST" }, { t: "HAD A SURPRISE:" }, { t: "ARJUNA HIMSELF.", c: GOLD }]} at="कृष्ण-2" size={140} />
  </>
);

const S2: React.FC = () => (
  <>
    <Clip src="story03/clips/krishna.mp4" from={0} rate={0.9} zoom={[1.04, 1.1]} />
    <TopShade h={900} a={0.62} />
    <Title lines={[{ t: "CHAPTER 10:" }, { t: "KRISHNA'S", c: GOLD }, { t: "GLORIES.", c: GOLD }]} at={0} size={160} />
    <Label mono="भगवद् गीता · अध्याय 10 · विभूतियोग" at="अध्याय" x={60} y={1640} rot={-2} seed="a" />
  </>
);

const S3: React.FC = () => (
  <>
    <Clip src="story05/clips/arjunask.mp4" from={4} rate={0.9} zoom={[1.1, 1.16]} />
    <TopShade h={900} a={0.62} />
    <Title lines={[{ t: "“IN WHICH FORMS" }, { t: "SHOULD I", c: GOLD }, { t: "REMEMBER YOU?”", c: GOLD }]} at={0} size={140} />
    <Label mono="भगवद् गीता 10.17 · भावार्थ" at="अर्जुन" x={70} y={1640} rot={-2} seed="b" />
  </>
);

const S4: React.FC = () => (
  <>
    <Tour src="img/story14/tour.jpg" s={1.45} stops={[{ at: 0, x: 540, y: 300 }, { at: "नदियों", x: 500, y: 1000 }, { at: "शस्त्र", x: 820, y: 1550 }]} />
    <TopShade h={900} a={0.6} />
    <Title lines={[{ t: "KRISHNA" }, { t: "LISTS…", c: GOLD }]} at={0} out="पहाड़ों-4" size={170} />
    <Title lines={[{ t: "AMONG MOUNTAINS," }, { t: "THE HIMALAYA.", c: GOLD }]} at="पहाड़ों-2" out="नदियों-4" size={130} />
    <Title lines={[{ t: "AMONG RIVERS," }, { t: "THE GANGA.", c: GOLD }]} at="नदियों-2" out="शस्त्र-4" size={140} />
    <Title lines={[{ t: "AMONG WARRIORS," }, { t: "RAMA.", c: GOLD }]} at="शस्त्र-2" size={140} />
    <Label mono="भगवद् गीता 10.25 · 10.31" at="पहाड़ों" x={70} y={1680} rot={-2} seed="c" />
  </>
);

const S5: React.FC = () => (
  <>
    <Clip src={V("reflect")} from={0} rate={0.88} zoom={[1.04, 1.1]} sound={SND.reflect} />
    <TopShade h={900} a={0.62} />
    <Title lines={[{ t: "AND THEN…" }]} at={0} out="पाण्डवानां-4" size={170} />
    <Label title="पाण्डवानां धनञ्जयः" refx="भगवद् गीता 10.37" at="पाण्डवानां" out="पांडवों-6" x={60} y={330} rot={-1.5} size={100} seed="d" />
    <Title lines={[{ t: "“AMONG THE" }, { t: "PANDAVAS,", c: GOLD }, { t: "I AM ARJUNA.”", c: GOLD }]} at="पांडवों-2" out="जिसे-4" size={140} />
    <Title lines={[{ t: "WHAT HE SOUGHT" }, { t: "OUTSIDE" }, { t: "WAS ALSO", c: GOLD }, { t: "WITHIN.", c: GOLD }]} at="जिसे-2" size={140} />
  </>
);

const S6: React.FC = () => (
  <>
    <KenBurns src="img/story14/sparks.jpg" dur={TL.sceneFrames("s6").dur + 10} s={[1.06, 1.2]} y={[60, -80]} origin="50% 75%" />
    <TopShade h={1000} a={0.66} />
    <Title lines={[{ t: "WHEREVER YOU SEE" }, { t: "SOMETHING", c: GOLD }, { t: "SPECIAL…", c: GOLD }]} at={0} out="वो-4" size={130} />
    <Title lines={[{ t: "…IT'S A SPARK" }, { t: "OF KRISHNA'S", c: GOLD }, { t: "SPLENDOUR.", c: GOLD }]} at="वो-2" out="वो#2-4" size={140} />
    <Title lines={[{ t: "THAT SPARK" }, { t: "IS IN YOU", c: GOLD }, { t: "TOO." }]} at="वो#2-2" size={170} />
    <Label mono="भगवद् गीता 10.41 · भावार्थ" at="जहाँ" x={70} y={1680} rot={-2} seed="e" />
  </>
);

const S7: React.FC = () => (
  <>
    <Clip src={V("reflect")} from={0} rate={0.5} dark={0.42} zoom={[1.04, 1.1]} />
    <TopShade h={1150} a={0.6} />
    <Dust n={18} />
    <Label title="SEND THIS" red="TO A FRIEND" sub="WHO SEEKS GOD ONLY OUTSIDE" at={2} x={60} y={330} rot={-2} size={96} seed="m" />
    <Label title="COMMENT" sub="आपको भगवान सबसे ज़्यादा कहाँ दिखते हैं?" at="कमेंट" x={70} y={600} rot={1.5} size={80} seed="n" />
    <Label title="NEXT STORY ·" red="DOUBTING EVERYTHING?" sub="GITA 4.40" at="अगली" x={50} y={880} rot={-1.5} size={80} seed="o" />
    <Label title="FOLLOW" red="@GITA.SHLOK.SERIES" at="फॉलो" x={70} y={1110} rot={2} size={74} seed="p" />
  </>
);

const SCENES: Record<string, React.FC> = { s1: S1, s2: S2, s3: S3, s4: S4, s5: S5, s6: S6, s7: S7 };

const Fade: React.FC<{ lead: number; children: React.ReactNode }> = ({ lead, children }) => {
  const f = useCurrentFrame();
  return <AbsoluteFill style={{ opacity: lead > 0 ? ease(f, 0, lead) : 1 }}>{children}</AbsoluteFill>;
};

export const Story14: React.FC = () => (
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
      <SeriesTag n="14" />
      <Finish />
    </AbsoluteFill>
  </TLCtx.Provider>
);
export const STORY14_FRAMES = TL.totalFrames;

export const Story14Cover: React.FC = () => (
  <TLCtx.Provider value={TL}>
    <AbsoluteFill style={{ background: "#0b0805" }}>
      <SceneId.Provider value="s1">
        <Sequence from={-100} layout="none">
          <S1 />
        </Sequence>
      </SceneId.Provider>
      <SeriesTag n="14" />
      <Finish />
    </AbsoluteFill>
  </TLCtx.Provider>
);
