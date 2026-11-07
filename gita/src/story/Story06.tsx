// Story 06 (remake of EP 11) — "LIC's motto": Gita 9.22, योगक्षेमं वहाम्यहम्.
import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame } from "remotion";
import { ease } from "../components/kit";
import { createTimeline, type Timing } from "../lib/timeline";
import timingJson from "../reels/story06/timing.json";
import { Dust, Finish, GOLD, Label, RED, SceneId, SeriesTag, TLCtx, Title, TopShade } from "./Story01";
import { Clip } from "./Story01V";

const timing = timingJson as unknown as Timing;
const TL = createTimeline(timing);
const V = (n: string) => `story06/clips/${n}.mp4`;

const S1: React.FC = () => (
  <>
    <Clip src={V("shelter")} from={3.5} zoom={[1.06, 1.12]} sound={0.25} />
    <TopShade h={1000} a={0.7} />
    <Title lines={[{ t: "REMEMBER" }, { t: "LIC'S MOTTO?", c: GOLD }]} at={0} out="उस-4" size={160} />
    <Title lines={[{ t: "IT'S FROM" }, { t: "THE GITA.", c: GOLD }]} at="उस-2" size={180} />
    <Label mono="एल आई सी का वाक्य · गीता 9.22" at="वाक्य" x={70} y={1580} rot={-2.5} seed="a" />
  </>
);

const S2: React.FC = () => (
  <>
    <Clip src={V("secret")} from={0} zoom={[1.02, 1.08]} />
    <TopShade h={900} a={0.62} />
    <Title lines={[{ t: "CHAPTER 9." }]} at={0} out="सबसे-4" size={190} />
    <Title lines={[{ t: "THE MOST" }, { t: "SECRET TEACHING.", c: GOLD }]} at="सबसे-2" size={140} />
    <Label mono="अध्याय 9 · सबसे गुप्त बात" at="गुप्त" x={70} y={1580} rot={-2} seed="b" />
  </>
);

const S3: React.FC = () => (
  <>
    <Clip src={V("prayer")} from={0} zoom={[1.02, 1.08]} />
    <TopShade h={900} a={0.62} />
    <Title lines={[{ t: "KRISHNA" }, { t: "SAID…", c: GOLD }]} at={0} out="जो-4" size={170} />
    <Label title={"अनन्याश्चिन्तयन्तो मां\nये जनाः पर्युपासते।"} refx="भगवद् गीता 9.22" at="अनन्याश्चिन्तयन्तो" out="जो-6" x={50} y={1380} rot={-1.5} size={86} seed="c" />
    <Title lines={[{ t: "“THOSE WHO" }, { t: "THINK ONLY", c: GOLD }, { t: "OF ME…”", c: GOLD }]} at="जो-2" size={150} />
    <Label sub="जो लोग मन लगाकर, बस मुझे याद करते हैं" at="जो" x={50} y={1520} rot={1.5} size={92} seed="d" />
  </>
);

const S4: React.FC = () => (
  <>
    <Clip src={V("blessing")} from={0} zoom={[1.02, 1.08]} />
    <TopShade h={900} a={0.62} />
    <Label title={"तेषां नित्याभियुक्तानां\nयोगक्षेमं वहाम्यहम्॥"} refx="भगवद् गीता 9.22" at="तेषां" out="उनके-6" x={50} y={1380} rot={-1.5} size={86} seed="e" />
    <Title lines={[{ t: "LIC'S LINE" }, { t: "IS RIGHT HERE.", c: GOLD }]} at="योगक्षेमं-2" out="उनके-4" size={150} />
    <Title lines={[{ t: "“I CARRY" }, { t: "THEIR LOAD.”", c: GOLD }]} at="उनके-2" size={180} />
    <Label sub="उनके योग और क्षेम का भार, मैं उठाता हूँ" at="उनके" x={50} y={1520} rot={1.5} size={92} seed="f" />
  </>
);

const S5: React.FC = () => (
  <>
    <Clip src={V("yogakshema")} from={0} zoom={[1.02, 1.06]} />
    <TopShade h={900} a={0.62} />
    <Title lines={[{ t: "YOGA =" }, { t: "GETTING WHAT", c: GOLD }, { t: "YOU DON'T HAVE.", c: GOLD }]} at={0} out="क्षेम-4" size={130} />
    <Label mono="योग · जो नहीं है उसे पाना" at="योग" x={60} y={1480} rot={-2} seed="g" />
    <Title lines={[{ t: "KSHEMA =" }, { t: "PROTECTING", c: GOLD }, { t: "WHAT YOU HAVE.", c: GOLD }]} at="क्षेम-2" size={130} />
    <Label mono="क्षेम · जो है उसकी रक्षा" at="क्षेम" x={380} y={1620} rot={2} seed="h" />
  </>
);

const S6: React.FC = () => (
  <>
    <Clip src={V("shelter")} from={0} rate={0.95} zoom={[1.02, 1.08]} sound={0.25} />
    <TopShade h={1000} a={0.66} />
    <Title lines={[{ t: "INSURANCE" }, { t: "DOES THE SAME.", c: GOLD }]} at={0} out="आज-4" size={160} />
    <Title lines={[{ t: "TODAY, THANK" }, { t: "3 THINGS", c: GOLD }, { t: "YOU ALREADY HAVE." }]} at="आज-2" size={130} />
  </>
);

const S7: React.FC = () => (
  <>
    <Clip src={V("blessing")} from={0} rate={0.55} dark={0.42} zoom={[1.04, 1.1]} />
    <TopShade h={1150} a={0.6} />
    <Dust n={18} />
    <Label title="SEND THIS" red="TO A FRIEND" sub="WHO HAS AN LIC POLICY" at={2} x={60} y={330} rot={-2} size={96} seed="m" />
    <Label title="COMMENT ·" red="DID YOU KNOW?" at="कमेंट" x={90} y={600} rot={1.5} size={78} seed="n" />
    <Label title="NEXT STORY ·" red="THE SLEEP RULE" sub="IN THE GITA" at="अगली" x={50} y={820} rot={-1.5} size={80} seed="o" />
    <Label title="FOLLOW" red="@GITA.SHLOK.SERIES" at="फॉलो" x={70} y={1070} rot={2} size={74} seed="p" />
  </>
);

const SCENES: Record<string, React.FC> = { s1: S1, s2: S2, s3: S3, s4: S4, s5: S5, s6: S6, s7: S7 };

const Fade: React.FC<{ lead: number; children: React.ReactNode }> = ({ lead, children }) => {
  const f = useCurrentFrame();
  return <AbsoluteFill style={{ opacity: lead > 0 ? ease(f, 0, lead) : 1 }}>{children}</AbsoluteFill>;
};

export const Story06: React.FC = () => (
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
      <SeriesTag n="06" />
      <Finish />
    </AbsoluteFill>
  </TLCtx.Provider>
);
export const STORY06_FRAMES = TL.totalFrames;

export const Story06Cover: React.FC = () => (
  <TLCtx.Provider value={TL}>
    <AbsoluteFill style={{ background: "#0b0805" }}>
      <SceneId.Provider value="s1">
        <Sequence from={-112} layout="none">
          <S1 />
        </Sequence>
      </SceneId.Provider>
      <SeriesTag n="06" />
      <Finish />
    </AbsoluteFill>
  </TLCtx.Provider>
);
