// Story 03 (remake of EP 08) — "Like winter and summer": Gita 2.14, Krishna to a weeping Arjuna.
import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame } from "remotion";
import { ease } from "../components/kit";
import { createTimeline, type Timing } from "../lib/timeline";
import timingJson from "../reels/story03/timing.json";
import { Dust, Finish, GOLD, Label, RED, SceneId, SeriesTag, TLCtx, Title, TopShade } from "./Story01";
import { Clip } from "./Story01V";

const timing = timingJson as unknown as Timing;
const TL = createTimeline(timing);
const V = (n: string) => `story03/clips/${n}.mp4`;
const ICE = "#a9dcff";

const S1: React.FC = () => (
  <>
    <Clip src={V("arjun")} from={2.5} rate={0.85} zoom={[1.08, 1.14]} />
    <TopShade h={1000} a={0.72} />
    <Title lines={[{ t: "WHEN DO" }, { t: "BAD TIMES END?", c: RED }]} at={0} out="कृष्ण-4" size={150} />
    <Title lines={[{ t: "KRISHNA" }, { t: "ANSWERED", c: GOLD }, { t: "ON A BATTLEFIELD." }]} at="कृष्ण-2" size={140} />
    <Label mono="कुरुक्षेत्र · युद्ध का मैदान" at="मैदान" x={70} y={1560} rot={-2.5} seed="a" />
  </>
);

const S2: React.FC = () => (
  <>
    <Clip src={V("arjun")} from={0} zoom={[1.02, 1.08]} />
    <TopShade h={820} a={0.6} />
    <Dust n={16} />
    <Title lines={[{ t: "ARJUNA" }, { t: "IN TEARS.", c: GOLD }]} at={0} out="अपनों-4" size={170} />
    <Title lines={[{ t: "BROKEN" }, { t: "FROM INSIDE.", c: RED }]} at="अपनों-2" size={170} />
    <Label mono="अर्जुन · आँखों में आँसू" at="आँसू" x={60} y={1560} rot={-2} seed="b" />
  </>
);

const S3: React.FC = () => (
  <>
    <Clip src={V("krishna")} from={0} zoom={[1.02, 1.08]} out="सुख-4" />
    <Clip src={V("seasons")} from={0} at="सुख-4" zoom={[1.02, 1.06]} />
    <TopShade h={900} a={0.62} />
    <Title lines={[{ t: "THEN KRISHNA" }, { t: "SPOKE.", c: GOLD }]} at={0} out="सुख-6" size={150} />
    <Label title={"मात्रास्पर्शास्तु कौन्तेय\nशीतोष्णसुखदुःखदाः।"} refx="भगवद् गीता 2.14" at="मात्रास्पर्शास्तु" out="सुख-6" x={50} y={1330} rot={-1.5} size={86} seed="c" />
    <Title lines={[{ t: "JOY AND PAIN," }, { t: "LIKE WINTER", c: ICE }, { t: "AND SUMMER.", c: GOLD }]} at="सुख-2" size={130} />
    <Label sub="सुख और दुख = सर्दी और गर्मी" at="सर्दी" x={60} y={1560} rot={1.5} size={92} seed="d" />
  </>
);

const S4: React.FC = () => (
  <>
    <Clip src={V("seasons")} from={2.9} rate={0.65} zoom={[1.06, 1.12]} />
    <TopShade h={900} a={0.62} />
    <Label title="आगमापायिनोऽनित्याः" sub="आते हैं, और चले जाते हैं" at={2} out="तांस्तितिक्षस्व-4" x={50} y={1380} rot={-2} size={96} seed="e" />
    <Title lines={[{ t: "THEY COME." }, { t: "THEY GO.", c: GOLD }]} at="ये-2" out="तांस्तितिक्षस्व-4" size={180} />
    <Label title="तांस्तितिक्षस्व भारत" sub="इन्हें सहन करो" at="तांस्तितिक्षस्व" x={50} y={1400} rot={1.5} size={96} seed="f" />
    <Title lines={[{ t: "ENDURE" }, { t: "THEM.", c: GOLD }]} at="इन्हें-2" size={190} />
  </>
);

const S5: React.FC = () => (
  <>
    <Clip src={V("winter")} from={0} zoom={[1.02, 1.08]} />
    <TopShade h={900} a={0.6} />
    <Title lines={[{ t: "NOBODY FIGHTS" }, { t: "WINTER.", c: ICE }]} at={0} out="बस-4" size={150} />
    <Title lines={[{ t: "YOU WRAP UP" }, { t: "AND WAIT", c: GOLD }, { t: "FOR SPRING.", c: GOLD }]} at="बस-2" size={140} />
  </>
);

const S6: React.FC = () => (
  <>
    <Clip src={V("diary")} from={0} zoom={[1.02, 1.08]} />
    <TopShade h={900} a={0.62} />
    <Title lines={[{ t: "WRITE TODAY'S PAIN" }, { t: "WITH A DATE.", c: GOLD }]} at={0} out="तीन-4" size={130} />
    <Label mono="तारीख · आज का दुख" at="तारीख" out="तीन-4" x={70} y={1560} rot={-2} seed="g" />
    <Title lines={[{ t: "READ IT" }, { t: "IN 3 MONTHS.", c: GOLD }]} at="तीन-2" out="ज़्यादातर-4" size={170} />
    <Title lines={[{ t: "MOSTLY," }, { t: "JUST WEATHER.", c: ICE }]} at="ज़्यादातर-2" size={170} />
  </>
);

const S7: React.FC = () => (
  <>
    <Clip src={V("krishna")} from={1.5} rate={0.45} dark={0.4} zoom={[1.04, 1.1]} />
    <TopShade h={1150} a={0.6} />
    <Dust n={18} />
    <Label title="SEND THIS" red="TO A FRIEND" sub="GOING THROUGH BAD TIMES" at={2} x={60} y={330} rot={-2} size={96} seed="m" />
    <Label title="COMMENT" sub="“ये वक्त भी बीत जाएगा”" at="कमेंट" x={90} y={600} rot={1.5} size={84} seed="n" />
    <Label title="NEXT STORY ·" red="THE ATOM BOMB" sub="AND THE GITA" at="अगली" x={50} y={880} rot={-1.5} size={80} seed="o" />
    <Label title="FOLLOW" red="@GITA.SHLOK.SERIES" at="फॉलो" x={70} y={1110} rot={2} size={74} seed="p" />
  </>
);

const SCENES: Record<string, React.FC> = { s1: S1, s2: S2, s3: S3, s4: S4, s5: S5, s6: S6, s7: S7 };

const Fade: React.FC<{ lead: number; children: React.ReactNode }> = ({ lead, children }) => {
  const f = useCurrentFrame();
  return <AbsoluteFill style={{ opacity: lead > 0 ? ease(f, 0, lead) : 1 }}>{children}</AbsoluteFill>;
};

export const Story03: React.FC = () => (
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
      <SeriesTag n="03" />
      <Finish />
    </AbsoluteFill>
  </TLCtx.Provider>
);
export const STORY03_FRAMES = TL.totalFrames;

export const Story03Cover: React.FC = () => (
  <TLCtx.Provider value={TL}>
    <AbsoluteFill style={{ background: "#0b0805" }}>
      <SceneId.Provider value="s1">
        <Sequence from={-70} layout="none">
          <S1 />
        </Sequence>
      </SceneId.Provider>
      <SeriesTag n="03" />
      <Finish />
    </AbsoluteFill>
  </TLCtx.Provider>
);
