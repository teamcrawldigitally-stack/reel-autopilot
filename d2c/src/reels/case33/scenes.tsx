// CASE #33 GOOGLE — cartoon look (remade 7 Nov 2026 from the dark-blue version; same script and voice).
import React from "react";
import { useCurrentFrame } from "remotion";
import { Person, PRIYA, ROHIT } from "../../components/Cartoon";
import { Camera } from "../../components/fx";
import { HookTitle, LINE, Place, makeMouth } from "../../components/format";
import { Chip, SceneShell, Sfx } from "../../components/kit";
import { QMarks } from "../../components/props";
import { MoneyRoom } from "../../components/sets";
import { CtaScene, FixBoard, Panel, Pop, ToonPhone, Verdict, big, body, ramp } from "../../components/toon";
import { Stamp } from "../../components/widgets";
import { C } from "../../theme";
import { T, cue } from "./timeline";

const sceneMouth = makeMouth(T);
const TAG = "CASE #33";
const META = "#1877F2";
const GOOG = "#16A34A";

/** Channel tile: plain name on a colour block (no logos). */
export const Channel: React.FC<{ name: string; color: string; w?: number; sub?: string }> = ({ name, color, w = 330, sub }) => (
  <Panel style={{ width: w, padding: "22px 20px", display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }} bg={color}>
    <div style={big(w * 0.2, C.white)}>{name}</div>
    {sub && <div style={body(w * 0.075, C.white)}>{sub}</div>}
  </Panel>
);

/* ===== S1: hook ===== */
export const S1Hook: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useCurrentFrame();
  const meta = cue("s1", "meta");
  const google = cue("s1", "google");
  const galat = cue("s1", "galat");
  const aadha = cue("s1", "aadha");
  return (
    <SceneShell dur={dur} noExit>
      <Camera dur={dur} punches={[aadha]} push={0.03}>
        <MoneyRoom />
        <HookTitle
          top={300}
          lines={[
            { text: "₹10,000: Meta ya Google?", at: -8, kind: "plain", size: 76, rot: -1 },
            { text: "galat jagah = aadha bekaar", at: -6, kind: "red", size: 62, rot: 2 },
          ]}
        />
        <div style={{ position: "absolute", left: 70, top: 650, zIndex: 6, transform: `scale(${1 + 0.06 * Math.sin(Math.PI * ramp(f, meta - 2, meta + 8))})` }}>
          <Channel name="Meta" color={META} w={300} />
        </div>
        <div style={{ position: "absolute", left: 710, top: 650, zIndex: 6, transform: `scale(${1 + 0.06 * Math.sin(Math.PI * ramp(f, google - 2, google + 8))})` }}>
          <Channel name="Google" color={GOOG} w={300} />
        </div>
        <Place x={330} y={700} s={0.78} z={5}>
          <Person
            look={ROHIT}
            seed="r331"
            track={[
              { at: -100, pose: "hold", mood: "neutral" },
              { at: galat, pose: "shrug", mood: "shock" },
            ]}
          />
        </Place>
        <div style={{ position: "absolute", left: 360, top: 620, zIndex: 9 }}>
          <QMarks at={meta} />
        </div>
        <div style={{ position: "absolute", left: 600, top: 1080, zIndex: 9 }}>
          <Stamp at={aadha} text="₹5,000 BEKAAR" size={38} rotate={-6} color={C.red} />
        </div>
      </Camera>
      <Sfx at={1} name="whoosh" vol={0.4} />
      <Sfx at={meta - 2} name="pop" vol={0.3} />
      <Sfx at={google - 2} name="pop" vol={0.3} />
      <Sfx at={aadha} name="stamp" vol={0.45} />
    </SceneShell>
  );
};

/* ===== S2: on Google, people are already searching ===== */
export const S2Google: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useCurrentFrame();
  const dh = cue("s2", "dhoondh");
  const baal = cue("s2", "baal");
  const q = "baal girne ka serum";
  const n = Math.round(q.length * ramp(f, baal - 6, baal + 24));
  return (
    <SceneShell dur={dur} noExit>
      <Camera dur={dur} push={0.02}>
        <MoneyRoom />
        <div style={{ position: "absolute", left: 0, right: 0, top: 300, display: "flex", justifyContent: "center", zIndex: 8 }}>
          <Chip size={30} bg={GOOG} border={LINE}>
            GOOGLE · LOG DHOONDH RAHE HAIN
          </Chip>
        </div>
        <Pop at={dh - 6} style={{ position: "absolute", left: 120, top: 430, zIndex: 6 }}>
          <Panel style={{ width: 840, padding: "20px 28px", display: "flex", alignItems: "center", gap: 20 }}>
            <svg width={50} height={50} viewBox="0 0 46 46">
              <circle cx={19} cy={19} r={14} fill="none" stroke={LINE} strokeWidth={6} />
              <path d="M30 30 L42 42" stroke={LINE} strokeWidth={7} strokeLinecap="round" />
            </svg>
            <div style={big(56)}>
              {q.slice(0, n)}
              <span style={{ opacity: Math.floor(f / 8) % 2 ? 1 : 0, color: C.violet }}>|</span>
            </div>
          </Panel>
        </Pop>
        <Pop at={baal + 26} style={{ position: "absolute", left: 120, top: 600, zIndex: 6 }}>
          <Panel style={{ width: 840, padding: "16px 28px" }}>
            <div style={body(24, GOOG)}>Ad · rohitskin.in</div>
            <div style={big(44, META)}>Hair fall serum · COD available</div>
          </Panel>
        </Pop>
        <Place x={330} y={800} s={0.72} z={5}>
          <Person look={PRIYA} seed="p332" track={[{ at: -100, pose: "hold", mood: "neutral" }, { at: baal + 26, pose: "hold", mood: "happy" }]} />
        </Place>
      </Camera>
      <Sfx at={baal - 6} name="key" vol={0.3} />
      <Sfx at={baal + 26} name="ding" vol={0.35} />
    </SceneShell>
  );
};

/* ===== S3: on Meta, people are scrolling and don't know they need it yet ===== */
export const S3Meta: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useCurrentFrame();
  const scroll = cue("s3", "scroll");
  const pata = cue("s3", "pata");
  const y = (f * 9) % 300;
  return (
    <SceneShell dur={dur} noExit>
      <Camera dur={dur} push={0.02}>
        <MoneyRoom />
        <div style={{ position: "absolute", left: 0, right: 0, top: 300, display: "flex", justifyContent: "center", zIndex: 8 }}>
          <Chip size={30} bg={META} border={LINE}>
            META · LOG SCROLL KAR RAHE HAIN
          </Chip>
        </div>
        <div style={{ position: "absolute", left: 570, top: 400, zIndex: 6 }}>
          <ToonPhone w={410} h={740}>
            <div style={{ position: "absolute", left: 14, right: 14, top: 60 - y, display: "flex", flexDirection: "column", gap: 14 }}>
              {Array.from({ length: 7 }).map((_, i) => (
                <div key={i} style={{ height: 286, borderRadius: 18, background: ["#FFE1CC", "#E3F6EA", "#EFE5FF", "#FDE2EC"][i % 4], border: `4px solid ${LINE}` }} />
              ))}
            </div>
          </ToonPhone>
        </div>
        <Place x={60} y={720} s={0.82} z={5}>
          <Person look={PRIYA} seed="p333" track={[{ at: -100, pose: "hold", mood: "neutral" }, { at: scroll, pose: "hold", mood: "happy" }]} />
        </Place>
        <div style={{ position: "absolute", left: 340, top: 640, zIndex: 9 }}>
          <QMarks at={pata} />
        </div>
        <Pop at={pata} style={{ position: "absolute", left: 60, top: 420, zIndex: 9 }}>
          <Panel style={{ padding: "14px 22px", width: 440 }}>
            <div style={{ ...big(40), whiteSpace: "normal" }}>Abhi zaroorat ka pata bhi nahi</div>
          </Panel>
        </Pop>
      </Camera>
      <Sfx at={scroll - 4} name="swish" vol={0.35} />
      <Sfx at={pata} name="pop" vol={0.3} />
    </SceneShell>
  );
};

/* ===== S4: the real question — do people search for your product? ===== */
export const S4Question: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useCurrentFrame();
  const kaun = cue("s4", "kaun");
  const dh = cue("s4", "dhoondhte");
  return (
    <SceneShell dur={dur} noExit>
      <Camera dur={dur} punches={[dh]} push={0.02}>
        <MoneyRoom />
        <Pop at={kaun} style={{ position: "absolute", left: 120, top: 360, zIndex: 6 }}>
          <Panel style={{ width: 840, padding: "24px 30px", display: "flex", alignItems: "center", justifyContent: "space-between", opacity: 1 - 0.4 * ramp(f, dh - 20, dh) }}>
            <div style={{ ...big(58), textDecoration: f >= kaun + 16 ? "line-through" : "none", textDecorationColor: C.red, textDecorationThickness: 7 }}>Kaun better hai?</div>
            <Verdict ok={false} text="GALAT SAWAAL" size={26} />
          </Panel>
        </Pop>
        <Pop at={dh - 6} style={{ position: "absolute", left: 120, top: 560, zIndex: 6 }}>
          <Panel style={{ width: 840, padding: "26px 30px" }} bg="#E3F6EA">
            <div style={body(28, C.muted)}>ASLI SAWAAL</div>
            <div style={{ ...big(58), whiteSpace: "normal", lineHeight: 1.15 }}>Log aapka product dhoondhte hain ya nahi?</div>
          </Panel>
        </Pop>
        <Place x={330} y={860} s={0.68} z={5}>
          <Person look={ROHIT} seed="r334" track={[{ at: -100, pose: "shrug", mood: "neutral" }, { at: dh, pose: "cheer", mood: "happy" }]} />
        </Place>
      </Camera>
      <Sfx at={kaun - 4} name="pop" vol={0.3} />
      <Sfx at={kaun + 16} name="error" vol={0.3} />
      <Sfx at={dh - 6} name="ding" vol={0.4} />
    </SceneShell>
  );
};

/* ===== S5: fixes ===== */
export const S5Fixes: React.FC<{ dur: number }> = ({ dur }) => (
  <FixBoard
    dur={dur}
    tag={TAG}
    mouth={sceneMouth("s5")}
    marks={[cue("s5", "google"), cue("s5", "naya"), cue("s5", "brand")]}
    sub="kahan lagayein"
    fontSize={38}
    fixes={["Product search hota hai? Google", "Naya product ya problem? Meta", "Brand naam pe Google ad hamesha"]}
  />
);

/* ===== S6: CTA ===== */
const SplitIcon: React.FC = () => (
  <svg width={86} height={100} viewBox="0 0 86 100">
    <rect x={3} y={3} width={80} height={94} rx={12} fill={C.violet} stroke={C.navy} strokeWidth={5} />
    <path d="M43 80 V52 M43 52 L22 26 M43 52 L64 26" stroke={C.white} strokeWidth={7} fill="none" strokeLinecap="round" />
    <circle cx={22} cy={22} r={8} fill={META} />
    <circle cx={64} cy={22} r={8} fill={GOOG} />
  </svg>
);

export const S6Cta: React.FC<{ dur: number }> = ({ dur }) => (
  <CtaScene
    dur={dur}
    tag={TAG}
    mouth={sceneMouth("s6")}
    keyword="GOOGLE"
    typeAt={cue("s6", "google") - 8}
    giftAt={cue("s6", "checklist") - 8}
    giftTitle="Kahan Lagayein Checklist"
    giftSub="free · Meta ya Google, 5 sawaal"
    giftIcon={<SplitIcon />}
    nextAt={cue("s6", "kal")}
    nextNum="#34"
    nextLabel="KAL DOPAHAR 1 BAJE · AGLA CASE"
    next={
      <>
        <div style={big(52)}>Aapke naam pe</div>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{ ...big(58, C.white), background: C.red, borderRadius: 16, padding: "8px 20px 0" }}>competitor</div>
          <div style={big(52)}>ka ad kyun?</div>
        </div>
      </>
    }
    followAt={cue("s6", "follow")}
  />
);
