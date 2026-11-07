// Story 16 (remake of EP 21) — "What God really wants": Gita 9.26. 1 new Veo clip + 3 Flow pictures with code motion + 1 reused clip.
import React from "react";
import { AbsoluteFill, Audio, Img, Sequence, interpolate, staticFile, useCurrentFrame } from "remotion";
import { ease } from "../components/kit";
import { createTimeline, type Timing } from "../lib/timeline";
import timingJson from "../reels/story16/timing.json";
import { Dust, Finish, GOLD, Label, RED, SceneId, SeriesTag, TLCtx, Title, TopShade, useQ } from "./Story01";
import { Clip } from "./Story01V";
import { StorySound, buildDuck } from "./sound";

const timing = timingJson as unknown as Timing;
const TL = createTimeline(timing);
const DUCK = buildDuck(timing as never);
const V = (n: string) => `story16/clips/${n}.mp4`;
/** Clip sound levels (0 = muted). offer: carries music (9/15 note windows), muted. */
const SND: Record<string, number> = { offer: 0 };

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

/** The four offerings on the banana leaf, in 1080×1920 frame coordinates. */
const ITEMS: { at: string; y: number; name: string }[] = [
  { at: "पत्ता", y: 400, name: "पत्ता" },
  { at: "फूल", y: 780, name: "फूल" },
  { at: "फल", y: 1180, name: "फल" },
  { at: "पानी", y: 1580, name: "पानी" },
];

/** Flat lay with a soft spotlight that moves to each offering as it is named, plus a ₹0 tag for each. */
const Offerings: React.FC = () => {
  const f = useCurrentFrame();
  const q = useQ();
  let y = 960, on = 0;
  ITEMS.forEach((it, i) => {
    const a = q(it.at) - 4;
    const t = ease(f, a, a + 10);
    if (i === 0) { y = it.y; on = t; } else { y = y + (it.y - y) * t; }
  });
  const s = interpolate(f, [0, 200], [1.04, 1.1], { extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <Img src={staticFile("img/story16/flatlay.jpg")} style={{ width: 1080, height: 1920, objectFit: "cover", transform: `scale(${s})` }} />
      <AbsoluteFill style={{ background: `radial-gradient(circle at 575px ${y}px, rgba(0,0,0,0) 0px, rgba(0,0,0,0) 190px, rgba(0,0,0,0.55) 330px)`, opacity: on }} />
    </AbsoluteFill>
  );
};

const S1: React.FC = () => (
  <>
    <Clip src={V("offer")} from={0} rate={0.9} zoom={[1.04, 1.1]} sound={SND.offer} />
    <TopShade h={1000} a={0.7} />
    <Title lines={[{ t: "WHAT DOES GOD" }, { t: "REALLY WANT?", c: GOLD }]} at={0} out="गीता-4" size={150} />
    <Title lines={[{ t: "4 THINGS." }, { t: "ALL FREE.", c: GOLD }]} at="गीता-2" size={190} />
  </>
);

const S2: React.FC = () => (
  <>
    <Clip src="story05/clips/krishna.mp4" from={0} rate={0.9} zoom={[1.04, 1.1]} />
    <TopShade h={900} a={0.62} />
    <Title lines={[{ t: "CHAPTER 9:" }, { t: "THE EASIEST", c: GOLD }, { t: "WAY TO GOD." }]} at={0} size={150} />
    <Label mono="भगवद् गीता · अध्याय 9" at="अध्याय" x={70} y={1640} rot={-2} seed="a" />
  </>
);

const S3: React.FC = () => (
  <>
    <Offerings />
    <Label title="पत्रं पुष्पं फलं तोयं" refx="भगवद् गीता 9.26" at={2} out="एक-6" x={60} y={150} rot={-1.5} size={96} seed="b" />
    {ITEMS.map((it, i) => (
      <Label key={it.at} title={it.name} red="₹0" at={it.at} x={i % 2 ? 90 : 700} y={it.y - 70} rot={i % 2 ? -2 : 2} size={78} seed={`t${i}`} />
    ))}
  </>
);

const S4: React.FC = () => (
  <>
    <Clip src={V("offer")} from={2} rate={0.7} zoom={[1.08, 1.14]} sound={SND.offer} />
    <TopShade h={900} a={0.62} />
    <Title lines={[{ t: "KRISHNA" }, { t: "SAYS…", c: GOLD }]} at={0} out="जो-4" size={170} />
    <Label title="यो मे भक्त्या प्रयच्छति" refx="भगवद् गीता 9.26" at={2} out="जो-6" x={50} y={1420} rot={-1.5} size={96} seed="c" />
    <Title lines={[{ t: "WHATEVER IS" }, { t: "GIVEN WITH LOVE,", c: GOLD }, { t: "I ACCEPT." }]} at="जो-2" size={140} />
  </>
);

const S5: React.FC = () => (
  <>
    <KenBurns src="img/story16/gold.jpg" dur={TL.sceneFrames("s5").dur + 10} s={[1.06, 1.18]} y={[-40, 60]} origin="70% 70%" />
    <TopShade h={900} a={0.62} />
    <Title lines={[{ t: "NOT THE PRICE." }, { t: "THE FEELING.", c: GOLD }]} at={0} out="शब्द-4" size={150} />
    <Title lines={[{ t: "THE KEY WORD:" }, { t: "WITH LOVE.", c: GOLD }]} at="शब्द-2" size={160} />
    <Label title="भक्त्या = प्यार से" at="भक्त्या" x={160} y={1640} rot={1.5} size={88} seed="d" />
  </>
);

const S6: React.FC = () => (
  <>
    <KenBurns src="img/story16/puja.jpg" dur={TL.sceneFrames("s6").dur + 10} s={[1.06, 1.18]} y={[-40, 60]} origin="50% 70%" />
    <TopShade h={1000} a={0.66} />
    <Title lines={[{ t: "TODAY, WHATEVER" }, { t: "YOU OFFER…", c: GOLD }]} at={0} out="बस-4" size={140} />
    <Title lines={[{ t: "KEEP YOUR MIND" }, { t: "THERE,", c: GOLD }, { t: "NOT ON YOUR PHONE." }]} at="बस-2" size={130} />
  </>
);

const S7: React.FC = () => (
  <>
    <Clip src={V("offer")} from={0} rate={0.45} dark={0.42} zoom={[1.04, 1.1]} />
    <TopShade h={1150} a={0.6} />
    <Dust n={18} />
    <Label title="SEND THIS" red="TO A FRIEND" sub="WHO THINKS PUJA COSTS A LOT" at={2} x={60} y={330} rot={-2} size={96} seed="m" />
    <Label title="COMMENT" sub="आप भगवान को सबसे पहले क्या चढ़ाते हो?" at="कमेंट" x={70} y={600} rot={1.5} size={80} seed="n" />
    <Label title="NEXT STORY ·" red="“I DID IT ALL”?" sub="GITA 3.27" at="अगली" x={50} y={880} rot={-1.5} size={80} seed="o" />
    <Label title="FOLLOW" red="@GITA.SHLOK.SERIES" at="फॉलो" x={70} y={1110} rot={2} size={74} seed="p" />
  </>
);

const SCENES: Record<string, React.FC> = { s1: S1, s2: S2, s3: S3, s4: S4, s5: S5, s6: S6, s7: S7 };

const Fade: React.FC<{ lead: number; children: React.ReactNode }> = ({ lead, children }) => {
  const f = useCurrentFrame();
  return <AbsoluteFill style={{ opacity: lead > 0 ? ease(f, 0, lead) : 1 }}>{children}</AbsoluteFill>;
};

export const Story16: React.FC = () => (
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
      <StorySound TL={TL} duck={DUCK} beds={[{ src: "sfx/battlefield.mp3", scenes: ["s2"], vol: 0.2 }, { src: "sfx/fields.mp3", scenes: ["s3", "s4"], vol: 0.22 }, { src: "sfx/fields.mp3", scenes: ["s6"], vol: 0.2 }]} hits={[{ src: "sfx/boom.mp3", at: 0, vol: 0.25 }, { src: "sfx/flare.mp3", at: TL.sceneFrames("s5").from, vol: 0.22, dur: 60 }]} />
      <SeriesTag n="16" />
      <Finish />
    </AbsoluteFill>
  </TLCtx.Provider>
);
export const STORY16_FRAMES = TL.totalFrames;

export const Story16Cover: React.FC = () => (
  <TLCtx.Provider value={TL}>
    <AbsoluteFill style={{ background: "#0b0805" }}>
      <SceneId.Provider value="s1">
        <Sequence from={-95} layout="none">
          <S1 />
        </Sequence>
      </SceneId.Provider>
      <SeriesTag n="16" />
      <Finish />
    </AbsoluteFill>
  </TLCtx.Provider>
);
