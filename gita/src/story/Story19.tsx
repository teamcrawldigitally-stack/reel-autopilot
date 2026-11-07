// Story 19 (remake of EP 24) — "Four checks before you speak": Gita 17.15. 1 new Veo clip + 3 Flow pictures with code motion + a code-drawn check row + 1 reused clip.
import React from "react";
import { AbsoluteFill, Audio, Img, Sequence, interpolate, staticFile, useCurrentFrame } from "remotion";
import { ease } from "../components/kit";
import { createTimeline, type Timing } from "../lib/timeline";
import timingJson from "../reels/story19/timing.json";
import { Dust, Finish, GOLD, Label, RED, Rays, SceneId, SeriesTag, TLCtx, Title, TopShade, useQ } from "./Story01";
import { Clip } from "./Story01V";
import { StorySound, buildDuck } from "./sound";

const timing = timingJson as unknown as Timing;
const TL = createTimeline(timing);
const DUCK = buildDuck(timing as never);
const V = (n: string) => `story19/clips/${n}.mp4`;
/** Clip sound levels (0 = muted). Set after checking each clip has no speech or music. */
// phone: the sound check found music (14/15 chord windows), so it stays muted.
const SND: Record<string, number> = { phone: 0 };
type Cue = string | number;

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

/** The four checks of 17.15 as a row of chips near the bottom; each chip lights gold (with a tick) at its cue. */
const CHECKS = ["अनुद्वेगकरं", "सत्यं", "प्रियं", "हितं"];
const Checks: React.FC<{ show?: Cue; lit: (Cue | null)[]; y?: number }> = ({ show = 0, lit, y = 1700 }) => {
  const f = useCurrentFrame();
  const q = useQ();
  const s = q(show);
  const op = ease(f, s, s + 10);
  return (
    <div style={{ position: "absolute", left: 40, right: 40, top: y, display: "flex", gap: 14, opacity: op, transform: `translateY(${(1 - op) * 30}px)` }}>
      {CHECKS.map((w, i) => {
        const a = lit[i] === null || lit[i] === undefined ? null : q(lit[i] as Cue);
        const p = a === null ? 0 : ease(f, a, a + 8);
        const pop = 1 + 0.14 * Math.sin(Math.PI * (a === null ? 0 : ease(f, a, a + 12)));
        return (
          <div key={w} style={{ flex: i === 0 ? 1.5 : 1, height: 96, borderRadius: 18, display: "flex", alignItems: "center", justifyContent: "center", gap: 10, transform: `scale(${pop})`, background: `rgba(242,184,75,${0.14 + 0.86 * p})`, border: `3px solid rgba(242,184,75,${0.5 + 0.5 * p})`, boxShadow: p > 0 ? `0 0 ${30 * p}px rgba(242,184,75,0.55)` : "none" }}>
            <span style={{ fontFamily: "Anton, sans-serif", fontSize: 40, color: p > 0.5 ? "#1c1712" : "rgba(246,236,214,0.75)" }}>{p > 0.5 ? "✓" : i + 1}</span>
            <span style={{ fontFamily: "Mukta", fontWeight: 800, fontSize: 40, color: p > 0.5 ? "#1c1712" : "rgba(246,236,214,0.85)", whiteSpace: "nowrap" }}>{w}</span>
          </div>
        );
      })}
    </div>
  );
};

const BottomShade: React.FC = () => <AbsoluteFill style={{ background: "linear-gradient(to top, rgba(10,8,6,0.78) 0%, rgba(10,8,6,0) 22%)" }} />;

/* Gate centres in the four-gates picture (1080×1920), bottom to top. */
const GATES = [{ x: 360, y: 1640 }, { x: 400, y: 1060 }, { x: 780, y: 570 }, { x: 456, y: 170 }];

const S1: React.FC = () => (
  <>
    <Clip src={V("phone")} from={0} rate={0.9} zoom={[1.04, 1.1]} sound={SND.phone} />
    <TopShade h={1000} a={0.7} />
    <Title lines={[{ t: "4 CHECKS", c: GOLD }, { t: "BEFORE YOU" }, { t: "SPEAK." }]} at={0} out="ये-4" size={170} />
    <Title lines={[{ t: "THE GITA'S" }, { t: "FILTER.", c: GOLD }]} at="ये-2" size={180} />
  </>
);

const S2: React.FC = () => (
  <>
    <Clip src="story05/clips/krishna.mp4" from={0} rate={0.9} zoom={[1.04, 1.1]} />
    <TopShade h={900} a={0.62} />
    <Title lines={[{ t: "CHAPTER 17:" }, { t: "THE DISCIPLINE", c: GOLD }, { t: "OF SPEECH." }]} at={0} size={140} />
    <Label mono="भगवद् गीता · अध्याय 17" at="अध्याय" x={70} y={1640} rot={-2} seed="a" />
  </>
);

const S3: React.FC = () => (
  <>
    <KenBurns src="img/story19/arrows.jpg" dur={TL.sceneFrames("s3").dur + 10} s={[1.06, 1.16]} y={[30, -40]} />
    <TopShade h={900} a={0.62} />
    <BottomShade />
    <Label title="अनुद्वेगकरं वाक्यं" refx="भगवद् गीता 17.15" at={2} out="पहला-6" x={50} y={1400} rot={-1.5} size={96} seed="b" />
    <Title lines={[{ t: "CHECK 1:", c: GOLD }, { t: "DOES IT HURT" }, { t: "FOR NO REASON?", c: RED }]} at="पहला-2" size={130} />
    <Label sub="किसी को बेवजह परेशान न करे" at="किसी" x={60} y={1440} rot={1.5} size={80} seed="c" />
    <Checks show={2} lit={["पहला", null, null, null]} />
  </>
);

const S4: React.FC = () => (
  <>
    <Tour src="img/story19/gates.jpg" s={1.4} stops={[{ at: 0, ...GATES[1] }, { at: "तीसरा", ...GATES[2] }, { at: "चौथा", ...GATES[3] }]} />
    {/* The gates sit in the upper half here, so the titles go low over a bottom shade. */}
    <AbsoluteFill style={{ background: "linear-gradient(to top, rgba(10,8,6,0.88) 0%, rgba(10,8,6,0.6) 40%, rgba(10,8,6,0) 58%)" }} />
    <Title lines={[{ t: "CHECK 2:", c: GOLD }, { t: "IS IT TRUE?" }]} at={0} out="तीसरा-4" size={140} top={1060} />
    <Title lines={[{ t: "CHECK 3:", c: GOLD }, { t: "IS IT KIND?" }]} at="तीसरा-2" out="चौथा-4" size={140} top={1060} />
    <Title lines={[{ t: "CHECK 4:", c: GOLD }, { t: "DOES IT HELP?" }]} at="चौथा-2" size={140} top={1060} />
    <Label title="सत्यं" sub="बात सच हो" at="सत्यं" out="तीसरा-6" x={70} y={1400} rot={-2} size={84} seed="d" />
    <Label title="प्रियं" sub="सुनने में अच्छी हो" at="प्रियं" out="चौथा-6" x={90} y={1400} rot={1.5} size={84} seed="e" />
    <Label title="हितं" sub="सामने वाले के भले की हो" at="हितं" x={60} y={1400} rot={-1.5} size={84} seed="f" />
    <Checks show={-30} lit={[-30, "सत्यं", "प्रियं", "हितं"]} />
  </>
);

const S5: React.FC = () => (
  <>
    <KenBurns src="img/story19/sage.jpg" dur={TL.sceneFrames("s5").dur + 10} s={[1.04, 1.14]} y={[-30, 40]} origin="50% 55%" />
    <Rays />
    <TopShade h={900} a={0.6} />
    <Label title="वाङ्मयं तप उच्यते॥" refx="भगवद् गीता 17.15" at={2} x={50} y={1440} rot={-1.5} size={96} seed="g" />
    <Title lines={[{ t: "KRISHNA CALLS IT" }, { t: "TAPAS", c: GOLD }, { t: "OF SPEECH." }]} at="कृष्ण-2" size={140} />
  </>
);

const S6: React.FC = () => (
  <>
    <Clip src={V("phone")} from={3} rate={0.8} zoom={[1.08, 1.14]} sound={SND.phone} />
    <TopShade h={1000} a={0.66} />
    <BottomShade />
    <Title lines={[{ t: "NEXT ANGRY" }, { t: "MESSAGE?", c: RED }]} at={0} out="गिनो-4" size={170} />
    <Title lines={[{ t: "COUNT:", c: GOLD }, { t: "HOW MANY OF" }, { t: "THE 4 PASS?" }]} at="गिनो-2" size={150} />
    <Checks show="इन" lit={[null, null, null, null]} />
  </>
);

const S7: React.FC = () => (
  <>
    <Clip src={V("phone")} from={0} rate={0.45} dark={0.42} zoom={[1.04, 1.1]} />
    <TopShade h={1150} a={0.6} />
    <Dust n={18} />
    <Label title="SEND THIS" red="TO A FRIEND" sub="WHO SPEAKS WITHOUT THINKING" at={2} x={60} y={330} rot={-2} size={96} seed="m" />
    <Label title="COMMENT" sub="चारों में सबसे मुश्किल कौन सा?" at="कमेंट" x={70} y={600} rot={1.5} size={86} seed="n" />
    <Label title="NEXT STORY ·" red="YOUR REAL ENEMY" sub="GITA 3.37" at="अगली" x={40} y={880} rot={-1.5} size={74} seed="o" />
    <Label title="FOLLOW" red="@GITA.SHLOK.SERIES" at="फॉलो" x={70} y={1110} rot={2} size={74} seed="p" />
  </>
);

const SCENES: Record<string, React.FC> = { s1: S1, s2: S2, s3: S3, s4: S4, s5: S5, s6: S6, s7: S7 };

const Fade: React.FC<{ lead: number; children: React.ReactNode }> = ({ lead, children }) => {
  const f = useCurrentFrame();
  return <AbsoluteFill style={{ opacity: lead > 0 ? ease(f, 0, lead) : 1 }}>{children}</AbsoluteFill>;
};

export const Story19: React.FC = () => (
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
      <StorySound TL={TL} duck={DUCK} beds={[{ src: "sfx/battlefield.mp3", scenes: ["s2"], vol: 0.2 }, { src: "sfx/storm.mp3", scenes: ["s3"], vol: 0.16 }, { src: "sfx/fields.mp3", scenes: ["s4"], vol: 0.24 }, { src: "sfx/fields.mp3", scenes: ["s5"], vol: 0.2 }]} hits={[{ src: "sfx/boom.mp3", at: 0, vol: 0.28 }]} />
      <SeriesTag n="19" />
      <Finish />
    </AbsoluteFill>
  </TLCtx.Provider>
);
export const STORY19_FRAMES = TL.totalFrames;

export const Story19Cover: React.FC = () => (
  <TLCtx.Provider value={TL}>
    <AbsoluteFill style={{ background: "#0b0805" }}>
      <SceneId.Provider value="s1">
        <Sequence from={-60} layout="none">
          <S1 />
        </Sequence>
      </SceneId.Provider>
      <SeriesTag n="19" />
      <Finish />
    </AbsoluteFill>
  </TLCtx.Provider>
);
