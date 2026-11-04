import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { AdKind, AdTile } from "../../../components/AdTile";
import { PersonIcon } from "../../../components/icons";
import { Card, Chip, Enter, Headline, SceneShell, Sfx, clamp, useRamp, useSpring } from "../../../components/kit";
import { C, theme } from "../../../theme";
import { cue } from "../timeline";

const COLW = 440;
const TOP = 400;

const Pill: React.FC<{ text: string; bg: string; delay: number }> = ({ text, bg, delay }) => {
  const p = useSpring(delay, "slam");
  return (
    <div
      style={{
        opacity: interpolate(p, [0, 0.3], [0, 1], clamp),
        transform: `scale(${interpolate(p, [0, 1], [1.8, 1])}) rotate(-3deg)`,
        background: bg,
        color: C.white,
        fontFamily: theme.fonts.display,
        fontWeight: 700,
        fontSize: 50,
        lineHeight: 1,
        padding: "18px 30px 10px",
        borderRadius: 20,
      }}
    >
      {text}
    </div>
  );
};

const Math2: React.FC<{ a: string; b: string; color: string; delay: number }> = ({ a, b, color, delay }) => (
  <Enter delay={delay} cfg="snappy">
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
      <div style={{ fontFamily: theme.fonts.body, fontWeight: 700, fontSize: 38, color: C.navySoft }}>{a}</div>
      <div style={{ fontFamily: theme.fonts.display, fontWeight: 700, fontSize: 72, letterSpacing: "-0.02em", color, lineHeight: 1.1 }}>{b}</div>
    </div>
  </Enter>
);

const KINDS: { k: AdKind; label: string }[] = [
  { k: "problem", label: "Problem" },
  { k: "review", label: "Review" },
  { k: "use", label: "Use" },
  { k: "compare", label: "Comparison" },
];

export const S6Math: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const kitne = cue("s6", "kitne");
  const maan = cue("s6", "maan");
  const ten = cue("s6", "10");
  const twenty = cue("s6", "₹20,000");
  const ekhi = cue("s6", "ek", 2);
  const four = cue("s6", "4");
  const eight = cue("s6", "₹8,000");
  const baatein = cue("s6", "baatein");
  const buyers = cue("s6", "4", 3);

  const outA = useRamp(maan - 6, maan + 4, "in");

  return (
    <SceneShell dur={dur}>
      {/* Beat A: the real question */}
      {frame < maan + 6 && (
        <div style={{ position: "absolute", inset: 0, opacity: 1 - outA, transform: `translateY(${-60 * outA}px)` }}>
          <div style={{ position: "absolute", left: theme.layout.padX, right: theme.layout.padX, top: 330, display: "flex", flexDirection: "column", alignItems: "center", gap: 30 }}>
            <Enter delay={0} cfg="snappy">
              <Chip bg={C.red} size={34}>
                ASLI SAWAAL
              </Chip>
            </Enter>
            <Headline text="Creative = targeting" delay={4} size={132} hl={["="]} />
          </div>
          <Enter delay={kitne - 4} style={{ position: "absolute", left: theme.layout.padX, top: 800 }}>
            <Card style={{ width: 912, boxSizing: "border-box", padding: "40px 40px", display: "flex", alignItems: "center", gap: 28 }}>
              <div
                style={{
                  width: 110,
                  height: 110,
                  flex: "0 0 110px",
                  borderRadius: 28,
                  background: theme.grad.violet,
                  color: C.white,
                  fontFamily: theme.fonts.display,
                  fontWeight: 700,
                  fontSize: 80,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  paddingTop: 10,
                  boxSizing: "border-box",
                }}
              >
                ?
              </div>
              <div style={{ fontFamily: theme.fonts.display, fontWeight: 700, fontSize: 54, lineHeight: 1.15, color: C.navy }}>
                Aapke paas kitne <span style={{ background: C.lavender, borderRadius: 12, padding: "0 10px" }}>alag</span> ads hain?
              </div>
            </Card>
          </Enter>
        </div>
      )}

      {/* Beat B: the math */}
      {frame >= maan - 2 && (
        <>
          <Enter delay={maan} cfg="snappy" style={{ position: "absolute", left: 0, right: 0, top: 316, display: "flex", justifyContent: "center" }}>
            <Chip size={28} bg={C.lavenderSoft} color={C.violetDeep}>
              EXAMPLE · ₹2,000 PER AD
            </Chip>
          </Enter>

          {/* Column A */}
          <Enter delay={maan + 2} style={{ position: "absolute", left: theme.layout.padX, top: TOP }}>
            <Card style={{ width: COLW, height: 830, boxSizing: "border-box", padding: "26px 20px", display: "flex", flexDirection: "column", alignItems: "center", gap: 18 }}>
              <div style={{ fontFamily: theme.fonts.display, fontWeight: 700, fontSize: 40, color: C.navy }}>10 version</div>
              <div style={{ position: "relative", width: 360, height: 390 }}>
                {Array.from({ length: 10 }).map((_, i) => {
                  const p = spring({ frame: frame - ten - i * 2, fps, config: theme.spring.snappy });
                  return (
                    <div
                      key={i}
                      style={{
                        position: "absolute",
                        left: 70 + i * 9,
                        top: 40 + i * 6,
                        opacity: interpolate(p, [0, 0.4], [0, 1], clamp),
                        transform: `translateY(${interpolate(p, [0, 1], [-60, 0])}px) rotate(${(i - 5) * 1.6}deg)`,
                      }}
                    >
                      <AdTile w={180} tint={C.lavender} />
                    </div>
                  );
                })}
              </div>
              <Math2 a="10 × ₹2,000" b="₹20,000" color={C.red} delay={twenty - 4} />
              <div style={{ marginTop: "auto" }}>
                <Pill text="1 baat" bg={C.red} delay={ekhi} />
              </div>
            </Card>
          </Enter>

          {/* Column B */}
          {frame >= four - 4 && (
            <Enter delay={four} from="right" style={{ position: "absolute", left: 1080 - theme.layout.padX - COLW, top: TOP }}>
              <Card style={{ width: COLW, height: 830, boxSizing: "border-box", padding: "26px 20px", display: "flex", flexDirection: "column", alignItems: "center", gap: 18 }}>
                <div style={{ fontFamily: theme.fonts.display, fontWeight: 700, fontSize: 40, color: C.navy }}>4 alag angle</div>
                <div style={{ display: "grid", gridTemplateColumns: "150px 150px", gap: 14, height: 390, alignContent: "center" }}>
                  {KINDS.map((k, i) => {
                    const p = spring({ frame: frame - four - 3 - i * 3, fps, config: theme.spring.bouncy });
                    return (
                      <div key={i} style={{ opacity: interpolate(p, [0, 0.4], [0, 1], clamp), transform: `scale(${interpolate(p, [0, 1], [0.4, 1])})` }}>
                        <AdTile w={150} kind={k.k} label={k.label} />
                      </div>
                    );
                  })}
                </div>
                <Math2 a="4 × ₹2,000" b="₹8,000" color={C.green} delay={eight - 4} />
                <div style={{ marginTop: "auto", display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
                  <Pill text="4 baatein" bg={C.green} delay={baatein} />
                </div>
              </Card>
            </Enter>
          )}
          {/* 4 types of buyers */}
          {frame >= buyers - 4 && (
            <div style={{ position: "absolute", left: 1080 - theme.layout.padX - COLW, width: COLW, top: 1250, display: "flex", justifyContent: "center", gap: 10 }}>
              {[0, 1, 2, 3].map((i) => {
                const p = spring({ frame: frame - buyers - i * 3, fps, config: theme.spring.bouncy });
                return (
                  <div key={i} style={{ opacity: interpolate(p, [0, 0.4], [0, 1], clamp), transform: `scale(${interpolate(p, [0, 1], [0.3, 1])})` }}>
                    <PersonIcon size={62} bg={[C.lavender, "#C9F0DA", "#FFD9C2", "#CFE0FF"][i]} />
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}

      <Sfx at={2} name="whoosh" vol={0.4} />
      <Sfx at={kitne - 6} name="pop" vol={0.45} />
      <Sfx at={maan - 4} name="whoosh" vol={0.5} />
      {Array.from({ length: 5 }).map((_, i) => (
        <Sfx key={i} at={ten + i * 4} name="key" vol={0.45} />
      ))}
      <Sfx at={ekhi - 2} name="error" vol={0.4} />
      <Sfx at={four - 3} name="swish" vol={0.45} />
      {[0, 1, 2, 3].map((i) => (
        <Sfx key={`b${i}`} at={four + i * 3} name="pop" vol={0.4} />
      ))}
      <Sfx at={baatein - 2} name="ding" vol={0.45} />
      {[0, 1, 2, 3].map((i) => (
        <Sfx key={`p${i}`} at={buyers + i * 3} name="pop" vol={0.3} />
      ))}
    </SceneShell>
  );
};
