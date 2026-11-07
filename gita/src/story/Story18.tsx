// Story 18 (remake of EP 23) — "One in a thousand": Gita 7.3. 1 new Veo clip + 1 Flow picture + code-drawn dots and counter + 1 reused clip.
import React from "react";
import { AbsoluteFill, Audio, Img, Sequence, interpolate, staticFile, useCurrentFrame } from "remotion";
import { ease } from "../components/kit";
import { createTimeline, type Timing } from "../lib/timeline";
import timingJson from "../reels/story18/timing.json";
import { Dust, Finish, GOLD, Label, RED, SceneId, SeriesTag, TLCtx, Title, TopShade, useQ } from "./Story01";
import { Clip } from "./Story01V";
import { StorySound, buildDuck } from "./sound";

const timing = timingJson as unknown as Timing;
const TL = createTimeline(timing);
const DUCK = buildDuck(timing as never);
const V = (n: string) => `story18/clips/${n}.mp4`;
/** Clip sound levels (0 = muted). Set after checking each clip has no speech or music. */
const SND: Record<string, number> = { crowd: 0.5 };

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

/** 1,000 dots (40 × 25) that fade in; at `pick` one dot turns gold and grows while the rest dim. */
const Dots: React.FC<{ pick: string; y?: number }> = ({ pick, y = 560 }) => {
  const f = useCurrentFrame();
  const q = useQ();
  const p = q(pick) - 2;
  const on = ease(f, p, p + 12);
  const ONE = 512;
  return (
    <AbsoluteFill>
      {Array.from({ length: 1000 }, (_, i) => {
        const cx = 120 + (i % 40) * 21.5;
        const cy = y + Math.floor(i / 40) * 30;
        const appear = ease(f, (i % 97) * 0.35, (i % 97) * 0.35 + 8);
        const one = i === ONE;
        const r = one ? 7 + 16 * on : 7;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: cx - r,
              top: cy - r,
              width: r * 2,
              height: r * 2,
              borderRadius: "50%",
              background: one ? `rgba(255,${200 - 10 * on},${120 - 60 * on},1)` : "rgba(240,230,210,0.85)",
              opacity: appear * (one ? 1 : 1 - 0.75 * on),
              boxShadow: one ? `0 0 ${40 * on}px ${14 * on}px rgba(255,190,80,${0.8 * on})` : undefined,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

/** Count-up number in big Anton type. */
const Count: React.FC<{ at: string; to: number; y: number; prefix?: string; color?: string; size?: number; dur?: number }> = ({ at, to, y, prefix = "", color = "#fff", size = 150, dur = 24 }) => {
  const f = useCurrentFrame();
  const q = useQ();
  const a = q(at) - 2;
  if (f < a) return null;
  const v = Math.round(to * ease(f, a, a + dur));
  const txt = prefix + v.toLocaleString("en-IN");
  const pop = 0.85 + 0.15 * ease(f, a, a + 8);
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top: y, textAlign: "center", fontFamily: "Anton, sans-serif", fontSize: size, color, letterSpacing: 2, textShadow: "0 6px 24px rgba(0,0,0,0.8)", transform: `scale(${pop})` }}>
      {txt}
    </div>
  );
};

const Dim: React.FC<{ a: number }> = ({ a }) => <AbsoluteFill style={{ background: `rgba(10,8,6,${a})` }} />;

const S1: React.FC = () => (
  <>
    <Clip src={V("crowd")} from={0} rate={0.9} zoom={[1.04, 1.1]} sound={SND.crowd} />
    <TopShade h={1000} a={0.7} />
    <Title lines={[{ t: "ONE IN" }, { t: "A THOUSAND.", c: GOLD }]} at={0} out="गीता-4" size={180} />
    <Title lines={[{ t: "THIS GITA" }, { t: "NUMBER IS", c: GOLD }, { t: "FOR YOU." }]} at="गीता-2" size={160} />
  </>
);

const S2: React.FC = () => (
  <>
    <Clip src="story05/clips/krishna.mp4" from={0} rate={0.9} zoom={[1.04, 1.1]} />
    <TopShade h={900} a={0.62} />
    <Title lines={[{ t: "CHAPTER 7:" }, { t: "HOW FEW", c: GOLD }, { t: "TRULY KNOW HIM." }]} at={0} size={150} />
    <Label mono="भगवद् गीता · अध्याय 7" at="अध्याय" x={70} y={1640} rot={-2} seed="a" />
  </>
);

const S3: React.FC = () => (
  <>
    <KenBurns src="img/story18/crowd.jpg" dur={TL.sceneFrames("s3").dur + 10} s={[1.1, 1.16]} y={[0, -40]} />
    <Dim a={0.72} />
    <Dots pick="कोई" />
    <TopShade h={500} a={0.5} />
    <Title lines={[{ t: "1,000 PEOPLE…" }]} at={0} out="हज़ारों-4" size={150} top={240} />
    <Label title={"मनुष्याणां सहस्रेषु\nकश्चिद्यतति सिद्धये।"} refx="भगवद् गीता 7.3" at={2} out="हज़ारों-6" x={50} y={1400} rot={-1.5} size={92} seed="b" />
    <Title lines={[{ t: "ONE TRULY" }, { t: "TRIES.", c: GOLD }]} at="हज़ारों-2" size={160} top={200} />
    <Label sub="हज़ारों में कोई एक, सच में कोशिश करता है" at="कोई" x={60} y={1420} rot={1.5} size={84} seed="c" />
  </>
);

const S4: React.FC = () => (
  <>
    <KenBurns src="img/story18/climb.jpg" dur={TL.sceneFrames("s4").dur + 10} s={[1.06, 1.18]} y={[-120, 120]} origin="50% 25%" />
    <TopShade h={900} a={0.6} />
    <Label title={"यततामपि सिद्धानां\nकश्चिन्मां वेत्ति तत्त्वतः।"} refx="भगवद् गीता 7.3" at={2} out="और-6" x={50} y={1400} rot={-1.5} size={92} seed="d" />
    <Title lines={[{ t: "AND OF THOSE" }, { t: "WHO TRY," }, { t: "ONE TRULY", c: GOLD }, { t: "KNOWS ME.", c: GOLD }]} at="और-2" size={130} />
  </>
);

const S5: React.FC = () => (
  <>
    <KenBurns src="img/story18/crowd.jpg" dur={TL.sceneFrames("s5").dur + 10} s={[1.16, 1.24]} y={[0, 40]} />
    <Dim a={0.78} />
    <Title lines={[{ t: "SAY 1,000" }, { t: "EACH TIME…", c: GOLD }]} at={0} out="तो-4" size={150} />
    <Count at="तो" to={1000} y={520} />
    <Count at="गुणा" to={1000} y={720} prefix="X " />
    <Count at="यानी" to={1000000} y={960} prefix="= " color="#f2b544" size={170} dur={30} />
    <Label title="दस लाख में एक" at="एक" x={240} y={1300} rot={-1.5} size={100} seed="e" />
  </>
);

const S6: React.FC = () => (
  <>
    <Clip src={V("crowd")} from={2} rate={0.75} zoom={[1.08, 1.14]} sound={SND.crowd} />
    <TopShade h={1000} a={0.66} />
    <Title lines={[{ t: "THE CROWD" }, { t: "DOESN'T TRY.", c: RED }]} at={0} out="इसलिए-4" size={160} />
    <Title lines={[{ t: "IF YOU TRY," }, { t: "YOU'RE ALREADY", c: GOLD }, { t: "1 IN 1,000." }]} at="इसलिए-2" out="आज-4" size={140} />
    <Title lines={[{ t: "BE THAT ONE" }, { t: "TODAY.", c: GOLD }]} at="आज-2" size={170} />
  </>
);

const S7: React.FC = () => (
  <>
    <Clip src={V("crowd")} from={0} rate={0.45} dark={0.42} zoom={[1.04, 1.1]} />
    <TopShade h={1150} a={0.6} />
    <Dust n={18} />
    <Label title="SEND THIS" red="TO A FRIEND" sub="WHO'S ABOUT TO GIVE UP" at={2} x={60} y={330} rot={-2} size={96} seed="m" />
    <Label title="COMMENT" sub="लिखो: मैं वो एक हूँ" at="कमेंट" x={70} y={600} rot={1.5} size={86} seed="n" />
    <Label title="NEXT STORY ·" red="4 CHECKS BEFORE YOU SPEAK" sub="GITA 17.15" at="अगली" x={40} y={880} rot={-1.5} size={74} seed="o" />
    <Label title="FOLLOW" red="@GITA.SHLOK.SERIES" at="फॉलो" x={70} y={1110} rot={2} size={74} seed="p" />
  </>
);

const SCENES: Record<string, React.FC> = { s1: S1, s2: S2, s3: S3, s4: S4, s5: S5, s6: S6, s7: S7 };

const Fade: React.FC<{ lead: number; children: React.ReactNode }> = ({ lead, children }) => {
  const f = useCurrentFrame();
  return <AbsoluteFill style={{ opacity: lead > 0 ? ease(f, 0, lead) : 1 }}>{children}</AbsoluteFill>;
};

export const Story18: React.FC = () => (
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
      <StorySound TL={TL} duck={DUCK} beds={[{ src: "sfx/battlefield.mp3", scenes: ["s2"], vol: 0.2 }, { src: "sfx/fields.mp3", scenes: ["s4"], vol: 0.28 }]} hits={[{ src: "sfx/boom.mp3", at: 0, vol: 0.3 }, { src: "sfx/flare.mp3", at: TL.sceneFrames("s5").from + TL.cue("s5", "यानी", 1, 0), vol: 0.24, dur: 60 }]} />
      <SeriesTag n="18" />
      <Finish />
    </AbsoluteFill>
  </TLCtx.Provider>
);
export const STORY18_FRAMES = TL.totalFrames;

export const Story18Cover: React.FC = () => (
  <TLCtx.Provider value={TL}>
    <AbsoluteFill style={{ background: "#0b0805" }}>
      <SceneId.Provider value="s1">
        <Sequence from={-60} layout="none">
          <S1 />
        </Sequence>
      </SceneId.Provider>
      <SeriesTag n="18" />
      <Finish />
    </AbsoluteFill>
  </TLCtx.Provider>
);
