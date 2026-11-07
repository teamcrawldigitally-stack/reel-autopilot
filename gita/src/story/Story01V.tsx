// Story 01 — "Google video" version: the same voice, titles and verse labels as Story01,
// but every scene is a moving Veo clip (made in Gemini from our storybook pictures).
import React from "react";
import { AbsoluteFill, Audio, OffthreadVideo, Sequence, interpolate, staticFile, useCurrentFrame } from "remotion";
import { clamp, ease } from "../components/kit";
import { S5 as P5, S6 as P6, S7 as P7, S8 as P8, Cut, Dust, Finish, GOLD, LEAD, Label, RED, Rays, SceneId, SeriesTag, TL, Title, TopShade, timing, useQ } from "./Story01";

type Cue = string | number;
const C = (n: string) => `story01/clips/${n}.mp4`;

/** One Veo clip, full screen, muted. `from` = seconds into the clip, `at`/`out` = cues in the scene. */
const Clip: React.FC<{ src: string; from?: number; rate?: number; at?: Cue; out?: Cue; dark?: number; zoom?: [number, number]; blur?: number }> = ({ src, from = 0, rate = 1, at, out, dark = 0, zoom = [1.06, 1.12], blur = 0 }) => {
  const f = useCurrentFrame();
  const q = useQ();
  const a = at !== undefined ? q(at) : -LEAD;
  const o = out !== undefined ? q(out) : undefined;
  const op = (a <= -LEAD ? 1 : ease(f, a, a + 8)) * (o !== undefined ? 1 - ease(f, o, o + 8) : 1);
  const s = interpolate(f, [a, a + 240], zoom, clamp);
  return (
    <Sequence from={a} layout="none">
      <AbsoluteFill style={{ opacity: op, overflow: "hidden" }}>
        <OffthreadVideo src={staticFile(src)} muted trimBefore={Math.round(from * 30)} playbackRate={rate} style={{ width: 1080, height: 1920, objectFit: "cover", transform: `scale(${s})`, filter: blur ? `blur(${blur}px)` : undefined }} />
        {dark > 0 && <AbsoluteFill style={{ background: `rgba(10,8,6,${dark})` }} />}
      </AbsoluteFill>
    </Sequence>
  );
};

const S1: React.FC = () => (
  <>
    <Clip src={C("c3-bowslip")} from={1.7} />
    <TopShade h={820} a={0.55} />
    <Title lines={[{ t: "HE DROPPED" }, { t: "HIS BOW.", c: GOLD }]} at={0} size={170} />
    <Label mono="ARJUN · THE GREATEST ARCHER" at="धनुर्धर" x={90} y={1180} rot={-3} />
  </>
);

const S2: React.FC = () => (
  <>
    <Clip src={C("c1-battlefield")} from={0} />
    <TopShade h={700} a={0.35} />
    <Title lines={[{ t: "KURUKSHETRA" }]} at={0} out="अर्जुन-6" size={170} top={260} />
    <Label title="TWO ARMIES." sub="ONE FAMILY ON BOTH SIDES" at="सेनाएँ" out="अर्जुन-6" x={80} y={470} rot={-2} size={84} seed="a" />
    <Title lines={[{ t: "“TAKE ME TO" }, { t: "THE MIDDLE.”", c: GOLD }]} at="अर्जुन-2" size={140} top={260} />
    <Label title="SENAYOR UBHAYOR MADHYE" sub="“PLACE MY CHARIOT BETWEEN BOTH ARMIES”" refx="BHAGAVAD GITA 1.21" at="बीच" x={60} y={1480} rot={1.5} size={64} seed="b" />
  </>
);

const S3: React.FC = () => (
  <>
    <Clip src={C("c2-bhishma")} from={2.2} />
    <TopShade h={820} a={0.6} />
    <Title lines={[{ t: "AND ACROSS" }, { t: "THE FIELD…" }]} at={0} out="भाई-4" size={150} />
    <Title lines={[{ t: "HIS OWN" }, { t: "FAMILY.", c: RED }]} at="भाई-2" size={170} />
    <Label mono="BHISHMA · GRANDFATHER" at="भीष्म" x={40} y={1420} rot={-3} seed="c" />
    <Label mono="DRONA · HIS TEACHER" at="द्रोण" x={560} y={1500} rot={2.5} seed="d" />
    <Label mono="BHAGAVAD GITA 1.26" at="दोस्त" x={330} y={1740} rot={-1} size={70} dark seed="e" />
  </>
);

const S4: React.FC = () => (
  <>
    <Clip src={C("c4-shake")} from={2.0} />
    <Clip src={C("c3-bowslip")} from={4.6} at="गाण्डीव-4" />
    <Cut src="img/story/s-gandiva-cut.png" x={330} bottom={1560} h={700} at="गाण्डीव-4" from="right" fall={{ at: "फिसलने", len: 24, deg: 34, dy: 520 }} zoom={0} glow="rgba(255,200,90,0.7)" />
    <TopShade h={820} a={0.6} />
    <Title lines={[{ t: "HIS BODY" }, { t: "TREMBLED.", c: RED }]} at={0} out="गाण्डीव-6" size={170} />
    <Title lines={[{ t: "AND THE BOW" }, { t: "SLIPPED.", c: GOLD }]} at="गाण्डीव-2" size={160} />
    <Label title="GANDIVA" sub="ARJUN'S DIVINE BOW" refx="BHAGAVAD GITA 1.29–30" at="गाण्डीव+2" x={70} y={1500} rot={-2.5} size={86} seed="f" />
  </>
);

// Gemini's daily video limit ran out after 4 clips, so these scenes use the moving storybook pictures for now.
const S5: React.FC = () => <P5 dur={TL.sceneFrames("s5").dur} />;
const Appear: React.FC<{ at: Cue; children: React.ReactNode }> = ({ at, children }) => {
  const f = useCurrentFrame();
  const q = useQ();
  const a = q(at);
  return <AbsoluteFill style={{ opacity: ease(f, a, a + 8) }}>{children}</AbsoluteFill>;
};
const S6: React.FC = () => (
  <>
    <Clip src={C("c3-bowslip")} from={7.4} />
    <TopShade h={820} a={0.55} />
    <Title lines={[{ t: "THEN KRISHNA" }, { t: "SPOKE.", c: GOLD }]} at={0} out="क्लैब्यं-2" size={150} />
    <Appear at="क्लैब्यं-6">
      <P6 dur={TL.sceneFrames("s6").dur} />
    </Appear>
  </>
);
const S7: React.FC = () => <P7 dur={TL.sceneFrames("s7").dur} />;
const S8: React.FC = () => <P8 dur={TL.sceneFrames("s8").dur} />;

const S9: React.FC = () => (
  <>
    <Clip src={C("c1-battlefield")} from={1.5} rate={0.72} dark={0.35} />
    <TopShade h={1100} a={0.6} />
    <Label title="SEND THIS" red="TO A FRIEND" sub="WHO IS LOSING HOPE TODAY" at={2} x={60} y={330} rot={-2} size={96} seed="m" />
    <Label title="COMMENT ·" red="DID YOU KNOW?" at="कमेंट" x={90} y={600} rot={1.5} size={78} seed="n" />
    <Label title="NEXT STORY ·" red="VISHWAROOP" sub="KRISHNA'S COSMIC FORM" at="अगली" x={50} y={820} rot={-1.5} size={80} seed="o" />
    <Label title="FOLLOW" red="@GITA.SHLOK.SERIES" at="फॉलो" x={70} y={1070} rot={2} size={74} seed="p" />
  </>
);

const SCENES: Record<string, React.FC> = { s1: S1, s2: S2, s3: S3, s4: S4, s5: S5, s6: S6, s7: S7, s8: S8, s9: S9 };

const Fade: React.FC<{ lead: number; children: React.ReactNode }> = ({ lead, children }) => {
  const f = useCurrentFrame();
  const o = lead > 0 ? ease(f, 0, lead) : 1;
  return <AbsoluteFill style={{ opacity: o }}>{children}</AbsoluteFill>;
};

export const Story01V: React.FC = () => (
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
    <SeriesTag />
    <Finish />
  </AbsoluteFill>
);
export const STORY01V_FRAMES = TL.totalFrames;
