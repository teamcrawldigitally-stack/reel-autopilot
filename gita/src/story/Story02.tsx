// Story 02 (remake of EP 07) — "The first verse": Gita 1.1, spoken by Dhritarashtra.
// Same look as Story 01: Google Flow (Veo) clips made from our storybook pictures, big English titles,
// torn-paper labels with the verse written exactly as it is spoken.
import React from "react";
import { AbsoluteFill, Audio, Img, Sequence, interpolate, staticFile, useCurrentFrame } from "remotion";
import { Sfx, clamp, ease } from "../components/kit";
import { createTimeline, type Timing } from "../lib/timeline";
import timingJson from "../reels/story02/timing.json";
import { Dust, Finish, Paint, GOLD, Label, RED, SceneId, SeriesTag, TLCtx, Title, TopShade, useQ } from "./Story01";
import { Clip } from "./Story01V";

const timing = timingJson as unknown as Timing;
const TL = createTimeline(timing);
type Cue = string | number;
const V = (n: string) => `story02/clips/${n}.mp4`;
const P = (n: string) => `img/story02/${n}.jpg`;

/** The armies picture splits down the middle: Kauravas drift left, Pandavas right, a fire seam opens between. */
const Split: React.FC<{ src: string; at: Cue; dur: number }> = ({ src, at, dur }) => {
  const f = useCurrentFrame();
  const q = useQ();
  const a = q(at);
  const p = ease(f, a, a + 16);
  const gap = 84 * p;
  const s = interpolate(f, [-8, dur], [1.1, 1.2], clamp);
  const shake = f >= a && f < a + 12 ? Math.sin(f * 2.4) * 9 * (1 - (f - a) / 12) : 0;
  const img = (side: "l" | "r") => (
    <AbsoluteFill style={{ clipPath: side === "l" ? "inset(0 50% 0 0)" : "inset(0 0 0 50%)", transform: `translateX(${(side === "l" ? -1 : 1) * gap / 2 + shake}px)` }}>
      <Img src={staticFile(src)} style={{ width: 1080, height: 1920, objectFit: "cover", transform: `scale(${s})`, filter: side === "l" ? `brightness(${1 - 0.25 * p}) saturate(${1 - 0.2 * p})` : undefined }} />
    </AbsoluteFill>
  );
  const flick = 0.85 + 0.15 * Math.sin(f / 2.3);
  return (
    <AbsoluteFill style={{ background: "#120804", overflow: "hidden" }}>
      {img("l")}
      {img("r")}
      <div style={{ position: "absolute", top: 0, bottom: 0, left: 540 - gap / 2 - 30, width: gap + 60, opacity: p * flick, background: "linear-gradient(90deg, rgba(255,90,20,0), rgba(255,110,30,0.85) 30%, rgba(255,226,150,1) 50%, rgba(255,110,30,0.85) 70%, rgba(255,90,20,0))", filter: "blur(6px)" }} />
      <div style={{ position: "absolute", top: 0, bottom: 0, left: 540 - 220, width: 440, opacity: p * 0.45 * flick, background: "radial-gradient(ellipse 50% 60% at 50% 60%, rgba(255,120,40,0.8), rgba(255,120,40,0))", mixBlendMode: "screen" }} />
      <Sfx at={a} name="bass" vol={0.5} />
    </AbsoluteFill>
  );
};

const S1: React.FC = () => (
  <>
    <Clip src={V("dhrit")} from={4.6} rate={0.8} zoom={[1.04, 1.1]} />
    <TopShade h={1050} a={0.78} />
    <Title lines={[{ t: "THE FIRST VERSE" }, { t: "WASN'T", c: RED }, { t: "KRISHNA'S.", c: RED }]} at={0} size={150} />
    <Label mono="गीता · ७०० श्लोक" at="सात" x={70} y={1560} rot={-3} seed="a" />
  </>
);

const S2: React.FC = () => (
  <>
    <Clip src={V("palace")} from={0} zoom={[1.02, 1.08]} />
    <Clip src={V("sanjay")} from={0.3} at="पास-4" zoom={[1.02, 1.1]} />
    <TopShade h={820} a={0.6} />
    <Dust n={18} />
    <Title lines={[{ t: "HASTINAPUR." }, { t: "THE PALACE.", c: GOLD }]} at={0} out="अंधे-4" size={160} />
    <Title lines={[{ t: "THE BLIND KING" }, { t: "WAITS.", c: GOLD }]} at="अंधे-2" out="पास-6" size={150} />
    <Label mono="धृतराष्ट्र · अंधे राजा" at="धृतराष्ट्र" out="पास-6" x={60} y={1560} rot={-2.5} seed="b" />
    <Title lines={[{ t: "SANJAYA" }, { t: "SEES IT ALL.", c: GOLD }]} at="संजय-2" size={160} />
    <Label title="दिव्य दृष्टि" sub="व्यास जी ने दी" at="दिव्य" x={60} y={1500} rot={-2} size={90} seed="c" />
  </>
);

const S3: React.FC = () => (
  <>
    <Clip src={V("dhrit")} from={0} zoom={[1.02, 1.08]} out="संजय-4" />
    <Clip src={V("armies")} from={0} at="संजय-4" zoom={[1.04, 1.1]} />
    <TopShade h={820} a={0.6} />
    <Title lines={[{ t: "THE BLIND KING" }, { t: "ASKED…", c: GOLD }]} at={0} out="संजय-6" size={150} />
    <Label
      title={"धर्मक्षेत्रे कुरुक्षेत्रे\nसमवेता युयुत्सवः।\nमामकाः पाण्डवाश्चैव\nकिमकुर्वत सञ्जय॥"}
      refx="भगवद् गीता 1.1 · धृतराष्ट्र उवाच"
      at="धर्मक्षेत्रे" out="संजय-6" x={50} y={1120} rot={-1.5} size={80} seed="d"
    />
    <Title lines={[{ t: "“WHAT DID" }, { t: "THEY DO?”", c: GOLD }]} at="संजय-2" size={170} />
    <Label sub="“संजय, कुरुक्षेत्र में मेरे बेटों और पांडु के बेटों ने क्या किया?”" at="कुरुक्षेत्र#2" x={50} y={1460} rot={1.5} size={92} seed="e" />
  </>
);

const S4: React.FC = () => (
  <>
    <Split src={P("armies")} at="अलग-4" dur={TL.sceneFrames("s4").dur} />
    <TopShade h={760} a={0.6} />
    <Dust n={20} color="255,190,120" />
    <Title lines={[{ t: "“MINE.”", c: GOLD }]} at="मामकाः-2" out="अपने-4" size={190} />
    <Title lines={[{ t: "“NOT MINE.”", c: RED }]} at="पांडु-2" out="अपने-4" size={190} top={450} />
    <Label title="मामकाः" sub="मेरे बेटे" at="मामकाः" out="अपने-4" x={50} y={1240} rot={-3} size={96} seed="f" />
    <Label title="पांडु के बेटे" red="अलग" at="पांडु" out="अपने-4" x={470} y={1480} rot={2} size={80} seed="g" />
    <Title lines={[{ t: "HIS OWN NEPHEWS," }, { t: "NOT “HIS”.", c: RED }]} at="अपने-2" size={140} />
  </>
);

const S5: React.FC = () => (
  <>
    <Clip src={V("armies")} from={3.9} rate={0.85} out="घर-4" zoom={[1.06, 1.14]} />
    <Clip src={V("family")} from={0} at="घर-4" zoom={[1.02, 1.08]} />
    <TopShade h={900} a={0.62} />
    <Title lines={[{ t: "MINE", c: GOLD }, { t: "VS YOURS.", c: RED }]} at={0} out="पूरे-4" size={180} />
    <Title lines={[{ t: "THE ROOT" }, { t: "OF THE WAR.", c: RED }]} at="पूरे-2" out="घर-6" size={170} />
    <Title lines={[{ t: "“MY PEOPLE”" }, { t: "VS “OTHERS”?" }, { t: "STOP IT THERE.", c: GOLD }]} at="घर-2" size={130} />
  </>
);

const S6: React.FC = () => (
  <>
    <Clip src={V("palace")} from={0} rate={0.58} dark={0.38} zoom={[1.04, 1.1]} />
    <TopShade h={1150} a={0.6} />
    <Dust n={18} />
    <Label title="SEND THIS" red="TO A FRIEND" sub="WHO READS THE GITA DAILY" at={2} x={60} y={330} rot={-2} size={96} seed="m" />
    <Label title="COMMENT ·" red="DID YOU KNOW?" at="कमेंट" x={90} y={600} rot={1.5} size={78} seed="n" />
    <Label title="NEXT ·" red="BAD TIMES" sub="WHEN DO THEY END? · GITA 2.14" at="अगले" x={50} y={820} rot={-1.5} size={84} seed="o" />
    <Label title="FOLLOW" red="@GITA.SHLOK.SERIES" at="फॉलो" x={70} y={1070} rot={2} size={74} seed="p" />
  </>
);

const SCENES: Record<string, React.FC> = { s1: S1, s2: S2, s3: S3, s4: S4, s5: S5, s6: S6 };

const Fade: React.FC<{ lead: number; children: React.ReactNode }> = ({ lead, children }) => {
  const f = useCurrentFrame();
  return <AbsoluteFill style={{ opacity: lead > 0 ? ease(f, 0, lead) : 1 }}>{children}</AbsoluteFill>;
};

export const Story02: React.FC = () => (
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
      <SeriesTag n="02" />
      <Finish />
    </AbsoluteFill>
  </TLCtx.Provider>
);
export const STORY02_FRAMES = TL.totalFrames;

/** Cover: the hook frame with the full title on screen. */
export const Story02Cover: React.FC = () => (
  <TLCtx.Provider value={TL}>
    <AbsoluteFill style={{ background: "#0b0805" }}>
      <SceneId.Provider value="s1">
        <Sequence from={-110} layout="none">
          <S1 />
        </Sequence>
      </SceneId.Provider>
      <SeriesTag n="02" />
      <Finish />
    </AbsoluteFill>
  </TLCtx.Provider>
);
