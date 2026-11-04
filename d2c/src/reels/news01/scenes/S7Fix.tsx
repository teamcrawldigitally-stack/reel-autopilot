import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { CheckIcon } from "../../../components/icons";
import { Card, Chip, Enter, Headline, SceneShell, Sfx, clamp } from "../../../components/kit";
import { C, theme } from "../../../theme";
import { cue } from "../timeline";

const Row: React.FC<{ delay: number; n: number; title: string; sub?: React.ReactNode; top: number }> = ({ delay, n, title, sub, top }) => {
  const frame = useCurrentFrame();
  const draw = interpolate(frame, [delay + 6, delay + 22], [0, 1], clamp);
  return (
    <Enter delay={delay} from="left" dist={80} style={{ position: "absolute", left: theme.layout.padX, top }}>
      <Card style={{ width: 912, minHeight: 168, boxSizing: "border-box", padding: "26px 30px", display: "flex", alignItems: "center", gap: 26 }}>
        <div style={{ position: "relative", flex: "0 0 76px" }}>
          <CheckIcon size={76} draw={draw} />
          <div
            style={{
              position: "absolute",
              left: -10,
              top: -12,
              width: 34,
              height: 34,
              borderRadius: "50%",
              background: C.navy,
              color: C.white,
              fontFamily: theme.fonts.body,
              fontWeight: 800,
              fontSize: 20,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              border: `3px solid ${C.white}`,
            }}
          >
            {n}
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <div style={{ fontFamily: theme.fonts.display, fontWeight: 700, fontSize: 48, lineHeight: 1.1, color: C.navy }}>{title}</div>
          {sub}
        </div>
      </Card>
    </Enter>
  );
};

const Tags: React.FC<{ cues: number[]; words: string[] }> = ({ cues, words }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
      {words.map((w, i) => {
        const p = spring({ frame: frame - cues[i], fps, config: theme.spring.bouncy });
        return (
          <div
            key={w}
            style={{
              opacity: interpolate(p, [0, 0.4], [0, 1], clamp),
              transform: `scale(${interpolate(p, [0, 1], [0.4, 1])})`,
              background: C.lavender,
              color: C.navy,
              fontFamily: theme.fonts.body,
              fontWeight: 700,
              fontSize: 28,
              padding: "8px 16px",
              borderRadius: 12,
            }}
          >
            {w}
          </div>
        );
      })}
    </div>
  );
};

export const S7Fix: React.FC<{ dur: number }> = ({ dur }) => {
  const har1 = cue("s7", "har", 1);
  const har2 = cue("s7", "har", 2);
  const targeting = cue("s7", "targeting");
  const tagCues = ["problem", "review", "use", "comparison"].map((k) => cue("s7", k));

  return (
    <SceneShell dur={dur}>
      <div style={{ position: "absolute", left: theme.layout.padX, right: theme.layout.padX, top: 300, display: "flex", flexDirection: "column", alignItems: "center", gap: 24 }}>
        <Enter delay={0} cfg="snappy">
          <Chip bg={C.green} size={34}>
            ILAAJ
          </Chip>
        </Enter>
        <Headline text="Teen kaam" delay={3} size={128} hl={["Teen"]} />
      </div>
      <Row delay={har1 - 3} n={1} top={600} title="Har creative mein alag baat" sub={<Tags cues={tagCues} words={["problem", "review", "use", "comparison"]} />} />
      <Row delay={har2 - 3} n={2} top={830} title="Har hafte 2–3 naye angle" />
      <Row
        delay={targeting - 4}
        n={3}
        top={1022}
        title="Targeting itni tight nahi"
        sub={<div style={{ fontFamily: theme.fonts.body, fontWeight: 600, fontSize: 32, color: C.muted }}>ki system ke haath bandh jaayein</div>}
      />
      <Sfx at={1} name="whoosh" vol={0.4} />
      {[har1, har2, targeting].map((c, i) => (
        <React.Fragment key={i}>
          <Sfx at={c - 4} name="swish" vol={0.4} />
          <Sfx at={c + 6} name="check" vol={0.45} />
        </React.Fragment>
      ))}
      {tagCues.map((c, i) => (
        <Sfx key={`t${i}`} at={c - 1} name="pop" vol={0.3} />
      ))}
    </SceneShell>
  );
};
