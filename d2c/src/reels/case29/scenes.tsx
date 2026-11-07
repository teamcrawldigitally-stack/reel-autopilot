// CASE #29 UGC — cartoon look (remade 7 Nov 2026 from the dark-blue version; same script and voice).
import React from "react";
import { useCurrentFrame } from "remotion";
import { Person, PRIYA, ROHIT } from "../../components/Cartoon";
import { Camera } from "../../components/fx";
import { HookTitle, LINE, Place, makeMouth } from "../../components/format";
import { Chip, Enter, SceneShell, Sfx } from "../../components/kit";
import { MoneyRoom } from "../../components/sets";
import { CtaScene, FixBoard, Panel, Pop, ToonPhone, big, body, ramp } from "../../components/toon";
import { Stamp } from "../../components/widgets";
import { C } from "../../theme";
import { Head } from "../case18/scenes";
import { T, cue } from "./timeline";

const sceneMouth = makeMouth(T);
const TAG = "CASE #29";

/** Studio cinema camera on a tripod. */
export const StudioCam: React.FC<{ w?: number }> = ({ w = 260 }) => (
  <svg width={w} height={w * 1.15} viewBox="0 0 200 230" style={{ overflow: "visible" }}>
    <circle cx={60} cy={34} r={28} fill={C.white} stroke={LINE} strokeWidth={6} />
    <circle cx={122} cy={34} r={28} fill={C.white} stroke={LINE} strokeWidth={6} />
    <rect x={24} y={60} width={130} height={80} rx={12} fill="#3B3168" stroke={LINE} strokeWidth={6} />
    <path d="M154 80 L190 66 L190 134 L154 120 Z" fill="#6E6894" stroke={LINE} strokeWidth={6} strokeLinejoin="round" />
    <circle cx={50} cy={100} r={9} fill={C.red} />
    <path d="M90 140 L50 226 M90 140 L130 226 M90 140 L90 226" stroke={LINE} strokeWidth={7} strokeLinecap="round" />
  </svg>
);

/** Softbox light. */
const Softbox: React.FC<{ flip?: boolean; on: number }> = ({ flip, on }) => (
  <svg width={190} height={420} viewBox="0 0 190 420" style={{ transform: flip ? "scaleX(-1)" : undefined, overflow: "visible" }}>
    <path d="M20 20 L170 50 L170 190 L20 220 Z" fill={on > 0.5 ? "#FFF6CF" : C.white} stroke={LINE} strokeWidth={6} strokeLinejoin="round" />
    {on > 0.5 && <path d="M170 60 L260 20 M170 120 L270 120 M170 180 L260 220" stroke="#F5B400" strokeWidth={8} strokeLinecap="round" opacity={on} />}
    <path d="M95 210 L95 410 M95 410 L50 418 M95 410 L140 418" stroke={LINE} strokeWidth={7} strokeLinecap="round" />
  </svg>
);

const Price: React.FC<{ t: string; c: string; size?: number }> = ({ t, c, size = 56 }) => <div style={{ ...big(size, C.white), background: c, border: `5px solid ${LINE}`, borderRadius: 16, padding: "8px 20px 0", boxShadow: `5px 5px 0 ${LINE}` }}>{t}</div>;

/* ===== S1: hook ===== */
export const S1Hook: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useCurrentFrame();
  const haar = cue("s1", "haar");
  const phone = cue("s1", "phone");
  const lose = ramp(f, haar - 4, haar + 6);
  return (
    <SceneShell dur={dur} noExit>
      <Camera dur={dur} punches={[haar, phone]} push={0.03}>
        <MoneyRoom />
        <HookTitle
          top={300}
          lines={[
            { text: "₹50,000 ka shoot haara,", at: -8, kind: "plain", size: 78, rot: -1 },
            { text: "₹0 ke phone video se?", at: -6, kind: "red", size: 80, rot: 2 },
          ]}
        />
        <div style={{ position: "absolute", left: 70, top: 640, zIndex: 6, filter: `grayscale(${lose * 0.8})` }}>
          <Panel style={{ width: 430, padding: "26px 20px", display: "flex", flexDirection: "column", alignItems: "center", gap: 18 }}>
            <StudioCam w={230} />
            <Price t="₹50,000" c={C.violet} />
          </Panel>
        </div>
        <div style={{ position: "absolute", left: 130, top: 840, zIndex: 9 }}>
          <Stamp at={haar} text="HAARA" size={74} rotate={-12} color={C.red} />
        </div>
        <Pop at={phone - 6} style={{ position: "absolute", left: 640, top: 640, zIndex: 8 }}>
          <Price t="₹0 PHONE" c={C.green} size={48} />
        </Pop>
        <Place x={590} y={720} s={0.8} z={5}>
          <Person
            look={PRIYA}
            seed="p291"
            track={[
              { at: -100, pose: "hold", mood: "happy" },
              { at: phone, pose: "cheer", mood: "grin" },
            ]}
          />
        </Place>
      </Camera>
      <Sfx at={1} name="whoosh" vol={0.4} />
      <Sfx at={haar} name="stamp" vol={0.45} />
      <Sfx at={phone - 4} name="ding" vol={0.4} />
    </SceneShell>
  );
};

/* ===== S2: Rohit's studio shoot ===== */
export const S2Studio: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useCurrentFrame();
  const studio = cue("s2", "studio");
  const lights = cue("s2", "lights");
  const model = cue("s2", "model");
  const price = cue("s2", "pachaas hazaar");
  const on = ramp(f, lights - 4, lights + 2);
  return (
    <SceneShell dur={dur} noExit>
      <Camera dur={dur} punches={[price]} push={0.02}>
        <MoneyRoom />
        <Pop at={studio} style={{ position: "absolute", left: 0, right: 0, top: 300, display: "flex", justifyContent: "center", zIndex: 8 }}>
          <Chip size={32} bg={C.white} color={LINE} border={LINE}>
            ROHIT KA STUDIO SHOOT
          </Chip>
        </Pop>
        <div style={{ position: "absolute", left: 20, top: 640, zIndex: 4 }}>
          <Softbox on={on} />
        </div>
        <div style={{ position: "absolute", left: 870, top: 640, zIndex: 4 }}>
          <Softbox on={on} flip />
        </div>
        <div style={{ position: "absolute", left: 240, top: 780, zIndex: 6 }}>
          <StudioCam w={240} />
        </div>
        <Place x={500} y={720} s={0.8} z={5}>
          <Person
            look={ROHIT}
            seed="r292"
            track={[
              { at: -100, pose: "idle", mood: "happy" },
              { at: studio, pose: "megaphone", mood: "shout" },
              { at: price, pose: "shrug", mood: "neutral" },
            ]}
          />
        </Place>
        <div style={{ position: "absolute", left: 0, right: 0, top: 420, display: "flex", justifyContent: "center", gap: 18, zIndex: 8 }}>
          <Pop at={lights}>
            <Chip size={30} bg="#F5B400" color={LINE} border={LINE}>
              LIGHTS
            </Chip>
          </Pop>
          <Pop at={model}>
            <Chip size={30} bg={C.violet} border={LINE}>
              MODEL
            </Chip>
          </Pop>
          <Pop at={price}>
            <Chip size={30} bg={C.red} border={LINE}>
              ₹50,000
            </Chip>
          </Pop>
        </div>
      </Camera>
      <Sfx at={lights - 2} name="pop" vol={0.35} />
      <Sfx at={model - 2} name="pop" vol={0.35} />
      <Sfx at={price - 2} name="ding" vol={0.4} />
    </SceneShell>
  );
};

/* ===== S3: Priya's 15-second phone video ===== */
export const S3Phone: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useCurrentFrame();
  const phone = cue("s3", "phone");
  const p15 = cue("s3", "pandrah");
  const hafte = cue("s3", "do");
  const rec = 0.5 + 0.5 * Math.abs(Math.sin(f / 8));
  return (
    <SceneShell dur={dur} noExit>
      <Camera dur={dur} punches={[hafte]} push={0.02}>
        <MoneyRoom />
        <div style={{ position: "absolute", left: 570, top: 360, zIndex: 6 }}>
          <ToonPhone w={420} h={760} screen="#FFE7A8">
            <div style={{ position: "absolute", left: 18, top: 120 }}>
              <Head look={PRIYA} seed="p293h" w={350} track={[{ at: -100, pose: "wave", mood: "grin" }]} />
            </div>
            <div style={{ position: "absolute", left: 20, top: 66, display: "flex", alignItems: "center", gap: 10, ...body(26, C.white), background: LINE, borderRadius: 10, padding: "4px 12px" }}>
              <div style={{ width: 14, height: 14, borderRadius: "50%", background: C.red, opacity: rec }} />
              0:15
            </div>
            <div style={{ position: "absolute", left: 24, right: 24, bottom: 60, ...big(36), textAlign: "center", whiteSpace: "normal", background: C.white, border: `4px solid ${LINE}`, borderRadius: 14, padding: "8px 10px 4px" }}>"Sach mein kaam karta hai!"</div>
          </ToonPhone>
        </div>
        <Pop at={phone} style={{ position: "absolute", left: 90, top: 330, zIndex: 8 }}>
          <Chip size={30} bg={C.green} border={LINE}>
            PHONE · {f >= p15 - 4 ? "15 SEC" : "VIDEO"}
          </Chip>
        </Pop>
        <Pop at={hafte} style={{ position: "absolute", left: 90, top: 430, zIndex: 8 }}>
          <Chip size={30} bg={LINE}>
            2 HAFTE BAAD...
          </Chip>
        </Pop>
        <Place x={60} y={720} s={0.82} z={5}>
          <Person
            look={PRIYA}
            seed="p293"
            track={[
              { at: -100, pose: "hold", mood: "happy" },
              { at: p15, pose: "hold", mood: "grin" },
            ]}
          />
        </Place>
      </Camera>
      <Sfx at={phone - 4} name="pop" vol={0.35} />
      <Sfx at={hafte - 4} name="whoosh" vol={0.35} />
    </SceneShell>
  );
};

/* ===== S4: same budget — 8 orders vs 20 orders ===== */
export const S4Result: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useCurrentFrame();
  const ek = cue("s4", "ek");
  const maan = cue("s4", "maan");
  const aath = cue("s4", "aath");
  const bees = cue("s4", "bees");
  const bars = [
    { label: "STUDIO AD", n: 8, at: aath, c: C.violet },
    { label: "PHONE VIDEO", n: 20, at: bees, c: C.green },
  ];
  return (
    <SceneShell dur={dur} noExit>
      <Camera dur={dur} punches={[bees]} push={0.02}>
        <MoneyRoom />
        <Pop at={ek} style={{ position: "absolute", left: 0, right: 0, top: 300, display: "flex", justifyContent: "center", zIndex: 8 }}>
          <Chip size={32} bg={LINE}>
            DONO ADS · EK HI BUDGET
          </Chip>
        </Pop>
        <Enter delay={maan - 6} from="none" cfg="snappy" style={{ position: "absolute", left: 0, right: 0, top: 390, display: "flex", justifyContent: "center", zIndex: 8 }}>
          <Chip size={28} bg={C.violet} color={C.white} border={LINE}>
            MAAN LO · EXAMPLE
          </Chip>
        </Enter>
        <div style={{ position: "absolute", left: 120, top: 490, display: "flex", alignItems: "flex-end", gap: 120, height: 600, zIndex: 6 }}>
          {bars.map((b) => {
            const p = ramp(f, b.at - 8, b.at + 8);
            return (
              <div key={b.label} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
                <div style={{ ...big(100, b.c), opacity: p }}>{b.n}</div>
                <div style={{ width: 260, height: 20 * b.n * p, background: b.c, border: `6px solid ${LINE}`, borderRadius: 18, boxShadow: `6px 6px 0 ${LINE}` }} />
                <div style={body(30)}>{b.label}</div>
              </div>
            );
          })}
        </div>
        <div style={{ position: "absolute", left: 470, top: 540, zIndex: 9 }}>
          <Stamp at={bees + 10} text="2.5x ORDER" size={58} rotate={-8} color={C.green} />
        </div>
      </Camera>
      <Sfx at={aath - 4} name="tick" vol={0.35} />
      <Sfx at={bees - 4} name="ding" vol={0.45} />
      <Sfx at={bees + 10} name="stamp" vol={0.4} />
    </SceneShell>
  );
};

/* ===== S5: fixes ===== */
export const S5Fixes: React.FC<{ dur: number }> = ({ dur }) => (
  <FixBoard
    dur={dur}
    tag={TAG}
    mouth={sceneMouth("s5")}
    marks={[cue("s5", "paanch"), cue("s5", "pehli"), cue("s5", "dono")]}
    sub="phone video = dost ki salah"
    fontSize={38}
    fixes={["5 khush customers se 15 sec video", "Pehli line mein problem", "Dono ads ek budget pe test"]}
  />
);

/* ===== S6: CTA ===== */
const BriefIcon: React.FC = () => (
  <svg width={86} height={100} viewBox="0 0 86 100">
    <rect x={3} y={3} width={80} height={94} rx={12} fill={C.violet} stroke={C.navy} strokeWidth={5} />
    <rect x={18} y={16} width={30} height={46} rx={6} fill={C.navy} />
    <circle cx={33} cy={36} r={8} fill="#C98A60" />
    <circle cx={60} cy={26} r={6} fill={C.red} />
    {[0, 1, 2].map((r) => (
      <rect key={r} x={16} y={70 + r * 8} width={54 - r * 12} height={5} rx={2} fill={C.white} />
    ))}
  </svg>
);

export const S6Cta: React.FC<{ dur: number }> = ({ dur }) => (
  <CtaScene
    dur={dur}
    tag={TAG}
    mouth={sceneMouth("s6")}
    keyword="UGC"
    typeAt={cue("s6", "u g c") - 8}
    giftAt={cue("s6", "brief") - 8}
    giftTitle="Customer Video Brief"
    giftSub="free · kya bolein, kaise shoot karein"
    giftIcon={<BriefIcon />}
    nextAt={cue("s6", "kal")}
    nextNum="#30"
    nextLabel="KAL DOPAHAR 1 BAJE · AGLA CASE"
    next={
      <>
        <div style={{ ...big(56, C.white), background: C.violet, borderRadius: 16, padding: "8px 20px 0" }}>Premium quality</div>
        <div style={big(52)}>kyun nahi bikta?</div>
      </>
    }
    followAt={cue("s6", "follow")}
  />
);
