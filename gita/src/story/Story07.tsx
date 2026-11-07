// Story 07 (remake of EP 12) — "The sleep rule": Gita 6.16–6.17. 3 Veo clips + 2 storybook pictures with code motion (credit saving).
import React from "react";
import { AbsoluteFill, Audio, Img, Sequence, interpolate, staticFile, useCurrentFrame } from "remotion";
import { clamp, ease } from "../components/kit";
import { createTimeline, type Timing } from "../lib/timeline";
import timingJson from "../reels/story07/timing.json";
import { Dust, Finish, GOLD, Label, RED, SceneId, SeriesTag, TLCtx, Title, TopShade } from "./Story01";
import { Clip } from "./Story01V";

const timing = timingJson as unknown as Timing;
const TL = createTimeline(timing);
const V = (n: string) => `story07/clips/${n}.mp4`;
/** Clip sound levels (0 = muted). Set after checking each clip has no speech or music. */
const SND: Record<string, number> = { phone: 1, meditate: 0, restful: 1 }; // meditate carries soft music (D-major notes), so it stays muted
const P = (n: string) => `img/story07/${n}.jpg`;

/** A split picture (left half / right half): the camera pans to the side being spoken about. `sides` = [frame, "l" | "r"][]. */
const PanSplit: React.FC<{ src: string; sides: [number, "l" | "r"][]; dur: number }> = ({ src, sides, dur }) => {
  const f = useCurrentFrame();
  const S = 1.5, TX = 210;
  let x = sides[0][1] === "l" ? TX : -TX;
  for (let i = 1; i < sides.length; i++) {
    const [at, side] = sides[i];
    const prev = sides[i - 1][1] === "l" ? TX : -TX;
    const next = side === "l" ? TX : -TX;
    if (f >= at) x = prev + (next - prev) * ease(f, at, at + 14);
  }
  const y = interpolate(f, [-8, dur], [20, -20], clamp);
  return (
    <AbsoluteFill style={{ overflow: "hidden", background: "#0b0805" }}>
      <Img src={staticFile(src)} style={{ position: "absolute", left: 0, top: 0, width: 1080, height: 1920, objectFit: "cover", transform: `translate(${x}px, ${y}px) scale(${S})` }} />
    </AbsoluteFill>
  );
};

const S1: React.FC = () => (
  <>
    <Clip src={V("phone")} from={0} zoom={[1.04, 1.1]} sound={SND.phone} />
    <TopShade h={1000} a={0.7} />
    <Title lines={[{ t: "PHONE" }, { t: "TILL 3 AM?", c: RED }]} at={0} out="गीता-4" size={180} />
    <Title lines={[{ t: "THE GITA HAS" }, { t: "A SLEEP RULE.", c: GOLD }]} at="गीता-2" size={150} />
  </>
);

const S2: React.FC = () => (
  <>
    <Clip src={V("meditate")} from={0} zoom={[1.02, 1.08]} sound={SND.meditate} />
    <TopShade h={900} a={0.62} />
    <Title lines={[{ t: "CHAPTER 6:" }, { t: "HOW TO MEDITATE.", c: GOLD }]} at={0} size={140} />
    <Label mono="अध्याय 6 · ध्यान योग" at="ध्यान" x={70} y={1580} rot={-2} seed="a" />
  </>
);

const S3: React.FC = () => (
  <>
    <PanSplit src={P("food")} dur={TL.sceneFrames("s3").dur} sides={[[0, "l"], [96, "r"], [156, "l"], [228, "r"]]} />
    <TopShade h={900} a={0.62} />
    <Dust n={14} />
    <Title lines={[{ t: "NO YOGA" }, { t: "FOR…", c: GOLD }]} at={0} out={150} size={170} />
    <Label title={"नात्यश्नतस्तु योगोऽस्ति\nन चैकान्तमनश्नतः।"} refx="भगवद् गीता 6.16" at={4} out={150} x={50} y={1400} rot={-1.5} size={86} seed="b" />
    <Title lines={[{ t: "TOO MUCH" }, { t: "FOOD…", c: RED }]} at={154} out={224} size={180} />
    <Title lines={[{ t: "OR NO FOOD" }, { t: "AT ALL.", c: RED }]} at={226} size={170} />
    <Label sub="बहुत ज़्यादा खाने वाले का योग नहीं होता, न बिल्कुल न खाने वाले का" at={160} x={50} y={1460} rot={1.5} size={88} seed="c" />
  </>
);

const S4: React.FC = () => (
  <>
    <PanSplit src={P("sleep")} dur={TL.sceneFrames("s4").dur} sides={[[0, "l"], [82, "r"], [147, "l"], [194, "r"]]} />
    <TopShade h={900} a={0.62} />
    <Title lines={[{ t: "NOR FOR…" }]} at={0} out={141} size={180} />
    <Label title={"न चातिस्वप्नशीलस्य\nजाग्रतो नैव चार्जुन।"} refx="भगवद् गीता 6.16" at={6} out={141} x={50} y={1400} rot={-1.5} size={86} seed="d" />
    <Title lines={[{ t: "TOO MUCH" }, { t: "SLEEP…", c: RED }]} at={145} out={190} size={180} />
    <Title lines={[{ t: "OR TOO LITTLE." }]} at={192} size={160} />
    <Label sub="न बहुत सोने वाले का, न बहुत जागने वाले का" at={150} x={50} y={1500} rot={1.5} size={88} seed="e" />
  </>
);

const S5: React.FC = () => (
  <>
    <Clip src={V("meditate")} from={3} rate={0.45} zoom={[1.08, 1.16]} sound={SND.meditate} />
    <TopShade h={900} a={0.62} />
    <Label title={"युक्तस्वप्नावबोधस्य\nयोगो भवति दुःखहा॥"} refx="भगवद् गीता 6.17" at="युक्तस्वप्नावबोधस्य" out="जिसका-6" x={50} y={1400} rot={-1.5} size={90} seed="f" />
    <Title lines={[{ t: "BALANCED" }, { t: "SLEEP & WAKING…", c: GOLD }]} at="जिसका-2" out="उसका-4" size={140} />
    <Title lines={[{ t: "THAT YOGA" }, { t: "ENDS SORROW.", c: GOLD }]} at="उसका-2" size={160} />
    <Label sub="जिसका सोना और जागना संतुलन में है, उसका योग दुख मिटा देता है" at="जिसका" x={50} y={1460} rot={1.5} size={86} seed="g" />
  </>
);

const S6: React.FC = () => (
  <>
    <Clip src={V("restful")} from={0} zoom={[1.02, 1.08]} sound={SND.restful} />
    <TopShade h={1000} a={0.66} />
    <Title lines={[{ t: "TONIGHT:" }, { t: "PHONE AWAY", c: GOLD }, { t: "FROM THE BED." }]} at={0} out="बस-4" size={140} />
    <Title lines={[{ t: "JUST ONE NIGHT." }, { t: "FEEL THE", c: GOLD }, { t: "DIFFERENCE.", c: GOLD }]} at="बस-2" size={140} />
  </>
);

const S7: React.FC = () => (
  <>
    <Clip src={V("meditate")} from={0} rate={0.53} dark={0.42} zoom={[1.04, 1.1]} />
    <TopShade h={1150} a={0.6} />
    <Dust n={18} />
    <Label title="SEND THIS" red="TO A FRIEND" sub="WHO WATCHES REELS ALL NIGHT" at={2} x={60} y={330} rot={-2} size={96} seed="m" />
    <Label title="COMMENT" sub="कल रात आप कितने बजे सोए?" at="कमेंट" x={90} y={600} rot={1.5} size={84} seed="n" />
    <Label title="NEXT STORY ·" red="700 VERSES" sub="WHO SPOKE HOW MANY?" at="अगली" x={50} y={880} rot={-1.5} size={80} seed="o" />
    <Label title="FOLLOW" red="@GITA.SHLOK.SERIES" at="फॉलो" x={70} y={1110} rot={2} size={74} seed="p" />
  </>
);

const SCENES: Record<string, React.FC> = { s1: S1, s2: S2, s3: S3, s4: S4, s5: S5, s6: S6, s7: S7 };

const Fade: React.FC<{ lead: number; children: React.ReactNode }> = ({ lead, children }) => {
  const f = useCurrentFrame();
  return <AbsoluteFill style={{ opacity: lead > 0 ? ease(f, 0, lead) : 1 }}>{children}</AbsoluteFill>;
};

export const Story07: React.FC = () => (
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
      <SeriesTag n="07" />
      <Finish />
    </AbsoluteFill>
  </TLCtx.Provider>
);
export const STORY07_FRAMES = TL.totalFrames;

export const Story07Cover: React.FC = () => (
  <TLCtx.Provider value={TL}>
    <AbsoluteFill style={{ background: "#0b0805" }}>
      <SceneId.Provider value="s1">
        <Sequence from={-125} layout="none">
          <S1 />
        </Sequence>
      </SceneId.Provider>
      <SeriesTag n="07" />
      <Finish />
    </AbsoluteFill>
  </TLCtx.Provider>
);
