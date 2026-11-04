import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile } from "remotion";
import { Doctor, PoseKey, Shout } from "../../components/Doctor";
import { Particles, Swipes } from "../../components/fx";
import { Bg, Grade, Grain, Vignette } from "../../components/kit";
import { Captions, TopBar } from "../../components/overlay";
import { C } from "../../theme";
import { S1Hook, S2Conv, S3Math, S4Roads, S5Page, S6Cta } from "./scenes";
import script from "./script.json";
import { FPS, cue, sceneById, sceneFrames, scenes } from "./timeline";

const MAP: Record<string, React.FC<{ dur: number }>> = { s1: S1Hook, s2: S2Conv, s3: S3Math, s4: S4Roads, s5: S5Page, s6: S6Cta };

const g = (id: string, key: string, nth = 1, off = 0) => sceneFrames(id).from + cue(id, key, nth) + off;
const start = (id: string, off = 0) => sceneFrames(id).from + off;

const POSES: PoseKey[] = [
  { at: 0, pose: "explain" },
  { at: g("s1", "pehle", 1, -4), pose: "stop" },
  { at: start("s2", 2), pose: "point" },
  { at: g("s2", "double", 1, -4), pose: "two" },
  { at: g("s2", "orders", 1, -4), pose: "point" },
  { at: start("s3", 2), pose: "explain" },
  { at: g("s3", "sau", 1, -2), pose: "one" },
  { at: g("s3", "₹1,000", 1, -2), pose: "explain" },
  { at: g("s3", "do", 1, -4), pose: "two" },
  { at: g("s3", "₹500", 1, -4), pose: "thumbs" },
  { at: start("s4", 2), pose: "point" },
  { at: g("s4", "page", 1, -4), pose: "thumbs" },
  { at: g("s5", "ek", 1, -4), pose: "one" },
  { at: g("s5", "do", 1, -4), pose: "two" },
  { at: g("s5", "teen", 1, -4), pose: "three" },
  { at: start("s6", 2), pose: "point" },
  { at: g("s6", "kal", 1, -2), pose: "explain" },
  { at: g("s6", "follow", 1, -4), pose: "thumbs" },
];

const BROWS = [g("s1", "pehle"), g("s2", "orders"), g("s3", "₹1,000"), g("s3", "₹500"), g("s4", "page"), g("s6", "audit"), g("s6", "bill")];

const mouthAt = (frame: number) => {
  for (const s of scenes) {
    const from = Math.round(s.start * FPS);
    const to = Math.round((s.start + s.dur) * FPS);
    if (frame >= from && frame < to) {
      const m = (s as unknown as { mouth?: number[] }).mouth;
      return m ? m[frame - from] ?? 0 : 0;
    }
  }
  return 0;
};

export const Case02Reel: React.FC = () => {
  const cuts = script.scenes.slice(1).map((s) => sceneFrames(s.id).from);
  return (
    <AbsoluteFill style={{ background: C.paper }}>
      <Bg />
      <Particles seed="case02" />
      {script.scenes.map((s) => {
        const { from, dur } = sceneFrames(s.id);
        const Comp = MAP[s.id];
        const t = sceneById(s.id);
        return (
          <Sequence key={s.id} from={from} durationInFrames={dur} name={s.id}>
            <Comp dur={dur} />
            {t.audio && <Audio src={staticFile(t.audio)} />}
          </Sequence>
        );
      })}
      {/* the host */}
      <div style={{ position: "absolute", left: 250, top: 1010, transform: "scale(0.96)", transformOrigin: "0 0" }}>
        <Doctor poses={POSES} mouth={mouthAt} brows={BROWS} caseTag={script.tag} />
      </div>
      <Shout at={g("s1", "pehle")} text="RUKO!" color={C.red} />
      <Shout at={g("s3", "₹500", 1, 4)} text="Aadha kharcha!" color={C.green} hold={46} />
      <Shout at={g("s4", "page", 1, 2)} text="Sasta raasta" color={C.green} />
      <Shout at={g("s6", "audit")} text="AUDIT likho" color={C.violet} hold={50} />
      <Captions scenes={scenes} karaoke top={1004} />
      <Swipes at={cuts} />
      <TopBar tag={script.tag} />
      <Grade />
      <Grain />
      <Vignette />
    </AbsoluteFill>
  );
};
