// CASE #17 PHOTO — cartoon look (remade 7 Nov 2026 from the dark-blue version; same script and voice).
import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { Person, PRIYA, ROHIT } from "../../components/Cartoon";
import { Camera } from "../../components/fx";
import { HookTitle, LINE, Place, makeMouth } from "../../components/format";
import { PhotoCard } from "../../components/hisaabArt";
import { Chip, Enter, SceneShell, Sfx, clamp } from "../../components/kit";
import { MoneyRoom } from "../../components/sets";
import { CtaScene, FixBoard, Panel, Pop, ToonPhone, Verdict, big, body, ramp } from "../../components/toon";
import { Stamp } from "../../components/widgets";
import { C } from "../../theme";
import { T, cue } from "./timeline";

const sceneMouth = makeMouth(T);
const TAG = "CASE #17";

/** Photo in a thick cartoon frame. */
const Photo: React.FC<{ kind: "plain" | "hand"; w: number; title?: string; rot?: number }> = ({ kind, w, title, rot = 0 }) => (
  <div style={{ border: `6px solid ${LINE}`, borderRadius: 30, boxShadow: `8px 8px 0 ${LINE}`, overflow: "hidden", transform: `rotate(${rot}deg)`, width: w + 8, background: C.white }}>
    <PhotoCard kind={kind} w={w + 8} title={title} />
  </div>
);

/** Feed post inside the phone: header + photo. */
const Post: React.FC<{ kind: "plain" | "hand"; w: number }> = ({ kind, w }) => (
  <div style={{ width: w }}>
    <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 16px" }}>
      <div style={{ width: 46, height: 46, borderRadius: "50%", background: "#F5B400", border: `3px solid ${LINE}`, display: "flex", alignItems: "center", justifyContent: "center", ...big(22), paddingTop: 2, boxSizing: "border-box" }}>R</div>
      <div style={body(24)}>rohitskin</div>
    </div>
    <PhotoCard kind={kind} w={w} />
  </div>
);

/* ===== S1: hook ===== */
export const S1Hook: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useCurrentFrame();
  const fayda = cue("s1", "fayda");
  return (
    <SceneShell dur={dur} noExit>
      <Camera dur={dur} punches={[fayda]} push={0.03}>
        <MoneyRoom />
        <HookTitle
          top={300}
          lines={[
            { text: "Photo mein product hai,", at: -8, kind: "plain", size: 76, rot: -1 },
            { text: "fayda kahan?", at: -6, kind: "red", size: 104, rot: 2 },
          ]}
        />
        <div style={{ position: "absolute", left: 110, top: 640, zIndex: 6 }}>
          <Photo kind="plain" w={360} title="PRODUCT PHOTO" rot={-3} />
        </div>
        <div style={{ position: "absolute", left: 90, top: 1150, display: "flex", gap: 16, zIndex: 8 }}>
          <Verdict ok text="PRODUCT" size={30} />
          <div style={{ opacity: ramp(f, fayda - 6, fayda + 2), transform: `scale(${0.7 + 0.3 * ramp(f, fayda - 6, fayda + 4)})` }}>
            <Verdict ok={false} text="FAYDA" size={30} />
          </div>
        </div>
        <Place x={580} y={700} s={0.8} z={5}>
          <Person
            look={ROHIT}
            seed="r171"
            track={[
              { at: -100, pose: "idle", mood: "happy" },
              { at: fayda - 2, pose: "shrug", mood: "shock" },
            ]}
          />
        </Place>
      </Camera>
      <Sfx at={1} name="whoosh" vol={0.4} />
      <Sfx at={fayda - 3} name="error" vol={0.4} />
    </SceneShell>
  );
};

/* ===== S2: plain photo in the feed, Priya scrolls past ===== */
export const S2Plain: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useCurrentFrame();
  const wb = cue("s2", "white background");
  const scroll = cue("s2", "scroll");
  const up = ramp(f, scroll - 4, scroll + 14);
  return (
    <SceneShell dur={dur} noExit>
      <Camera dur={dur} punches={[scroll]} push={0.02}>
        <MoneyRoom />
        <div style={{ position: "absolute", left: 570, top: 410, zIndex: 6 }}>
          <ToonPhone w={420} h={780}>
            <div style={{ position: "absolute", left: 0, right: 0, top: 50 - up * 640 }}>
              <Post kind="plain" w={391} />
              <div style={{ padding: 16, display: "flex", flexDirection: "column", gap: 12 }}>
                <div style={{ height: 300, borderRadius: 18, background: "#EDE8F7" }} />
                <div style={{ height: 300, borderRadius: 18, background: "#EDE8F7" }} />
              </div>
            </div>
          </ToonPhone>
        </div>
        <Pop at={wb} style={{ position: "absolute", left: 0, right: 0, top: 300, display: "flex", justifyContent: "center", zIndex: 8 }}>
          <Chip size={30} bg={C.white} color={LINE} border={LINE}>
            WHITE BACKGROUND · EK BOTTLE
          </Chip>
        </Pop>
        <Pop at={scroll} style={{ position: "absolute", left: 420, top: 600, zIndex: 9 }}>
          <div style={{ ...big(56, C.white), background: C.red, border: `6px solid ${LINE}`, borderRadius: 999, padding: "10px 28px 2px", boxShadow: `6px 6px 0 ${LINE}`, transform: "rotate(-6deg)" }}>SCROLL ↑</div>
        </Pop>
        <Place x={40} y={700} s={0.82} z={5}>
          <Person
            look={PRIYA}
            seed="p172"
            track={[
              { at: -100, pose: "hold", mood: "neutral" },
              { at: scroll, pose: "hold", mood: "sad" },
            ]}
          />
        </Place>
      </Camera>
      <Sfx at={wb - 4} name="pop" vol={0.35} />
      <Sfx at={scroll - 2} name="swish" vol={0.45} />
    </SceneShell>
  );
};

/* ===== S3: same serum in Priya's hand, glowing skin — she stops ===== */
export const S3Hand: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useCurrentFrame();
  const haath = cue("s3", "haath");
  const ruk = cue("s3", "ruk");
  const inn = ramp(f, -10, 10);
  return (
    <SceneShell dur={dur} noExit>
      <Camera dur={dur} punches={[ruk]} push={0.02}>
        <MoneyRoom />
        <div style={{ position: "absolute", left: 570, top: 410, zIndex: 6 }}>
          <ToonPhone w={420} h={780}>
            <div style={{ position: "absolute", left: 0, right: 0, top: 50 + (1 - inn) * 700 }}>
              <Post kind="hand" w={391} />
              <div style={{ display: "flex", gap: 14, padding: "14px 18px", alignItems: "center" }}>
                <svg width={48} height={44} viewBox="0 0 48 44">
                  <path d="M24 42 L4 22 Q-4 10 8 4 Q18 0 24 10 Q30 0 40 4 Q52 10 44 22 Z" fill={f >= ruk ? C.red : "none"} stroke={LINE} strokeWidth={4} />
                </svg>
                <div style={body(24, LINE)}>{f >= ruk ? "Priya ne like kiya" : ""}</div>
              </div>
            </div>
          </ToonPhone>
        </div>
        <Pop at={haath} style={{ position: "absolute", left: 0, right: 0, top: 300, display: "flex", justifyContent: "center", zIndex: 8 }}>
          <Chip size={30} bg={C.green} border={LINE}>
            HAATH MEIN · CHAMAKTI SKIN
          </Chip>
        </Pop>
        <div style={{ position: "absolute", left: 300, top: 560, zIndex: 9 }}>
          <Stamp at={ruk} text="RUK GAYI!" size={60} rotate={-8} color={C.green} />
        </div>
        <Place x={40} y={700} s={0.82} z={5}>
          <Person
            look={PRIYA}
            seed="p173"
            track={[
              { at: -100, pose: "hold", mood: "neutral" },
              { at: haath, pose: "hold", mood: "happy" },
              { at: ruk, pose: "cheer", mood: "grin" },
            ]}
          />
        </Place>
      </Camera>
      <Sfx at={2} name="swish" vol={0.35} />
      <Sfx at={ruk} name="stamp" vol={0.45} />
    </SceneShell>
  );
};

/* ===== S4: people buy the result; 100 viewers → 2 clicks vs 5 clicks ===== */
export const S4Result: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useCurrentFrame();
  const bottle = cue("s4", "bottle");
  const result = cue("s4", "result");
  const sau = cue("s4", "sau");
  const doo = cue("s4", "do");
  const paanch = cue("s4", "paanch");
  const cards = [
    { kind: "plain" as const, n: "2", at: doo, c: LINE, label: "Plain photo" },
    { kind: "hand" as const, n: "5", at: paanch, c: C.green, label: "Haath wali" },
  ];
  return (
    <SceneShell dur={dur} noExit>
      <Camera dur={dur} punches={[result, paanch]} push={0.02}>
        <MoneyRoom />
        <div style={{ position: "absolute", left: 0, right: 0, top: 300, display: "flex", justifyContent: "center", gap: 20, zIndex: 8 }}>
          <Pop at={bottle}>
            <Verdict ok={false} text="BOTTLE" />
          </Pop>
          <Pop at={result}>
            <Verdict ok text="RESULT" />
          </Pop>
        </div>
        <Enter delay={sau - 6} from="none" cfg="snappy" style={{ position: "absolute", left: 0, right: 0, top: 390, display: "flex", justifyContent: "center", zIndex: 8 }}>
          <Chip size={28} bg={C.violet} color={C.white} border={LINE}>
            MAAN LO · 100 LOG DEKHEIN
          </Chip>
        </Enter>
        {cards.map((c, i) => (
          <Pop key={c.label} at={i === 0 ? sau + 10 : sau + 18} style={{ position: "absolute", left: 90 + i * 470, top: 490, zIndex: 6 }}>
            <Panel style={{ width: 430, padding: 20, display: "flex", flexDirection: "column", alignItems: "center", gap: 10, transform: `rotate(${i === 0 ? -2 : 2}deg)` }}>
              <div style={{ borderRadius: 20, overflow: "hidden", border: `4px solid ${LINE}` }}>
                <PhotoCard kind={c.kind} w={300} />
              </div>
              <div style={body(30, C.muted)}>{c.label.toUpperCase()}</div>
              <div style={{ display: "flex", alignItems: "baseline", gap: 12, opacity: ramp(f, c.at - 6, c.at + 2), transform: `scale(${0.6 + 0.4 * ramp(f, c.at - 6, c.at + 6)})` }}>
                <div style={big(120, c.c)}>{c.n}</div>
                <div style={big(52, c.c)}>click</div>
              </div>
            </Panel>
          </Pop>
        ))}
        <div style={{ position: "absolute", left: 640, top: 1200, zIndex: 9 }}>
          <Stamp at={paanch + 8} text="2.5x" size={70} rotate={-8} color={C.green} />
        </div>
      </Camera>
      <Sfx at={bottle - 4} name="error" vol={0.3} />
      <Sfx at={result - 4} name="ding" vol={0.4} />
      <Sfx at={doo - 4} name="tick" vol={0.35} />
      <Sfx at={paanch - 4} name="ding" vol={0.45} />
      <Sfx at={paanch + 8} name="stamp" vol={0.4} />
    </SceneShell>
  );
};

/* ===== S5: three photos to keep ===== */
export const S5Fixes: React.FC<{ dur: number }> = ({ dur }) => (
  <FixBoard
    dur={dur}
    tag={TAG}
    mouth={sceneMouth("s5")}
    marks={[cue("s5", "use"), cue("s5", "pehle"), cue("s5", "haath")]}
    sub="teen photo zaroor rakho"
    fixes={["Use karte hue", "Pehle aur baad ka fark", "Haath mein pakda hua, size dikhe"]}
  />
);

/* ===== S6: CTA ===== */
const ListIcon: React.FC = () => (
  <svg width={86} height={100} viewBox="0 0 86 100">
    <rect x={3} y={3} width={80} height={94} rx={12} fill={C.violet} stroke={C.navy} strokeWidth={5} />
    {[0, 1, 2, 3].map((i) => (
      <g key={i}>
        <rect x={14} y={18 + i * 19} width={12} height={12} rx={3} fill={i < 2 ? "#2BD46B" : C.lavender} />
        <rect x={32} y={21 + i * 19} width={40} height={6} rx={3} fill={C.white} />
      </g>
    ))}
  </svg>
);

export const S6Cta: React.FC<{ dur: number }> = ({ dur }) => (
  <CtaScene
    dur={dur}
    tag={TAG}
    mouth={sceneMouth("s6")}
    keyword="PHOTO"
    typeAt={cue("s6", "photo") - 8}
    giftAt={cue("s6", "das") - 6}
    giftTitle="10 Photo Ideas ki List"
    giftSub="free · phone se shoot ho jaayein"
    giftIcon={<ListIcon />}
    nextAt={cue("s6", "kal")}
    nextNum="#18"
    nextLabel="KAL DOPAHAR 1 BAJE · AGLA CASE"
    next={
      <>
        <div style={big(52)}>Log brand se nahi,</div>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{ ...big(58, C.white), background: C.violet, borderRadius: 16, padding: "8px 20px 0" }}>INSAAN</div>
          <div style={big(52)}>se kyun khareedte?</div>
        </div>
      </>
    }
    followAt={cue("s6", "follow")}
  />
);

void interpolate;
void clamp;
