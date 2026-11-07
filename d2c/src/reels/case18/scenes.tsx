// CASE #18 FACE — cartoon look (remade 7 Nov 2026 from the dark-blue version; same script and voice).
import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { Look, Person, PoseAt, ROHIT } from "../../components/Cartoon";
import { Camera } from "../../components/fx";
import { HookTitle, LINE, Place, makeMouth } from "../../components/format";
import { SerumBottle } from "../../components/hisaabArt";
import { Chip, SceneShell, Sfx } from "../../components/kit";
import { QMarks } from "../../components/props";
import { MoneyRoom, OfficeWall } from "../../components/sets";
import { CtaScene, FixBoard, Panel, Pop, ToonPhone, Verdict, big, body, ramp } from "../../components/toon";
import { Stamp } from "../../components/widgets";
import { C } from "../../theme";
import { T, cue } from "./timeline";

const sceneMouth = makeMouth(T);
const TAG = "CASE #18";

/** Brand logo tile. */
export const LogoTile: React.FC<{ w?: number }> = ({ w = 300 }) => (
  <Panel style={{ width: w, height: w, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: w * 0.04 }}>
    <div style={{ width: w * 0.44, height: w * 0.44, borderRadius: "50%", background: C.violet, border: `5px solid ${LINE}`, display: "flex", alignItems: "center", justifyContent: "center", ...big(w * 0.24, C.white), paddingTop: w * 0.03, boxSizing: "border-box" }}>R</div>
    <div style={body(w * 0.08)}>ROHIT'S SKIN</div>
  </Panel>
);

/** Head-and-shoulders crop of a character in a rounded frame. */
export const Head: React.FC<{ look: Look; track: PoseAt[]; seed: string; w?: number; bg?: string; round?: boolean }> = ({ look, track, seed, w = 300, bg = "#FFE7A8", round }) => (
  <div style={{ width: w, height: w, borderRadius: round ? "50%" : w * 0.12, overflow: "hidden", background: bg, border: `6px solid ${LINE}`, position: "relative", boxSizing: "border-box" }}>
    <div style={{ position: "absolute", left: w * 0.03, top: -w * 0.02, transform: `scale(${w / 450})`, transformOrigin: "0 0" }}>
      <Person look={look} track={track} seed={seed} />
    </div>
  </div>
);

/* ===== S1: hook ===== */
export const S1Hook: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useCurrentFrame();
  const logo = cue("s1", "logo");
  const insaan = cue("s1", "insaan");
  const chehra = cue("s1", "chehra");
  return (
    <SceneShell dur={dur} noExit>
      <Camera dur={dur} punches={[insaan, chehra]} push={0.03}>
        <MoneyRoom />
        <HookTitle
          top={300}
          lines={[
            { text: "Log logo se nahi,", at: -8, kind: "plain", size: 84, rot: -1 },
            { text: "insaan se khareedte", at: -6, kind: "violet", size: 84, rot: 2 },
          ]}
        />
        <div style={{ position: "absolute", left: 100, top: 690, zIndex: 6, transform: "rotate(-3deg)", opacity: 1 - 0.4 * ramp(f, insaan - 4, insaan + 8) }}>
          <LogoTile w={330} />
        </div>
        <div style={{ position: "absolute", left: 150, top: 1060, zIndex: 8, opacity: ramp(f, logo - 4, logo + 4) }}>
          <Verdict ok={false} text="LOGO" />
        </div>
        <Place x={580} y={680} s={0.82} z={5}>
          <Person
            look={ROHIT}
            seed="r181"
            track={[
              { at: -100, pose: "idle", mood: "neutral" },
              { at: insaan - 2, pose: "wave", mood: "grin" },
              { at: chehra, pose: "shrug", mood: "happy" },
            ]}
          />
        </Place>
        <div style={{ position: "absolute", left: 620, top: 640, zIndex: 8, opacity: ramp(f, insaan - 4, insaan + 4) }}>
          <Verdict ok text="INSAAN" />
        </div>
        <div style={{ position: "absolute", left: 870, top: 700, zIndex: 9 }}>
          <QMarks at={chehra} />
        </div>
      </Camera>
      <Sfx at={1} name="whoosh" vol={0.4} />
      <Sfx at={logo - 2} name="error" vol={0.3} />
      <Sfx at={insaan - 2} name="ding" vol={0.4} />
      <Sfx at={chehra} name="pop" vol={0.35} />
    </SceneShell>
  );
};

/* ===== S2: 60 posts, all product photos, 3 likes each ===== */
export const S2Page: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useCurrentFrame();
  const saath = cue("s2", "saath");
  const sab = cue("s2", "sab");
  const teen = cue("s2", "teen");
  const scroll = ramp(f, sab - 4, sab + 40) * 220;
  return (
    <SceneShell dur={dur} noExit>
      <Camera dur={dur} punches={[teen]} push={0.02}>
        <MoneyRoom />
        <div style={{ position: "absolute", left: 540, top: 330, zIndex: 6 }}>
          <ToonPhone w={440} h={820}>
            <div style={{ position: "absolute", left: 0, right: 0, top: 46, padding: "10px 20px", display: "flex", alignItems: "center", gap: 14, background: C.white, zIndex: 2 }}>
              <div style={{ width: 70, height: 70, borderRadius: "50%", background: C.violet, border: `4px solid ${LINE}`, display: "flex", alignItems: "center", justifyContent: "center", ...big(34, C.white), paddingTop: 4, boxSizing: "border-box" }}>R</div>
              <div>
                <div style={body(26)}>rohitskin</div>
                <div style={{ ...body(24, C.muted), opacity: ramp(f, saath - 6, saath + 2) }}>60 posts</div>
              </div>
            </div>
            <div style={{ position: "absolute", left: 6, right: 6, top: 150 - scroll, display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 6 }}>
              {Array.from({ length: 18 }).map((_, i) => (
                <div key={i} style={{ position: "relative", height: 130, background: "#F6F3FC", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: 6 }}>
                  <SerumBottle h={96} />
                  <div style={{ position: "absolute", right: 6, bottom: 6, background: C.white, border: `3px solid ${LINE}`, borderRadius: 999, padding: "2px 10px", ...body(20, C.red), opacity: ramp(f, teen - 6 + (i % 6), teen + 2 + (i % 6)) }}>♥ 3</div>
                </div>
              ))}
            </div>
          </ToonPhone>
        </div>
        <Pop at={sab} style={{ position: "absolute", left: 70, top: 330, zIndex: 8 }}>
          <Chip size={30} bg={C.white} color={LINE} border={LINE}>
            SAB PRODUCT PHOTOS
          </Chip>
        </Pop>
        <div style={{ position: "absolute", left: 120, top: 520, zIndex: 9 }}>
          <Stamp at={teen + 6} text="3 LIKE" size={70} rotate={-8} color={C.red} />
        </div>
        <Place x={40} y={720} s={0.8} z={5}>
          <Person
            look={ROHIT}
            seed="r182"
            track={[
              { at: -100, pose: "hold", mood: "neutral" },
              { at: teen, pose: "sad", mood: "sad" },
            ]}
          />
        </Place>
      </Camera>
      <Sfx at={saath - 4} name="tick" vol={0.3} />
      <Sfx at={teen + 6} name="stamp" vol={0.4} />
    </SceneShell>
  );
};

/* ===== S3: a 20-second founder video → 15 DMs that night ===== */
export const S3Video: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useCurrentFrame();
  const video = cue("s3", "video");
  const maine = cue("s3", "maine");
  const p15 = cue("s3", "pandrah");
  const prog = ramp(f, video, video + 120);
  const dms = Math.round(interpolate(f, [p15 - 8, p15 + 10], [1, 15], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }));
  return (
    <SceneShell dur={dur} noExit>
      <Camera dur={dur} punches={[p15]} push={0.02}>
        <OfficeWall />
        <div style={{ position: "absolute", left: 500, top: 330, zIndex: 6 }}>
          <ToonPhone w={480} h={820} screen="#FFE7A8">
            <div style={{ position: "absolute", left: 40, top: 90, transform: "scale(0.9)", transformOrigin: "0 0" }}>
              <Person look={ROHIT} seed="r183v" track={[{ at: -100, pose: "wave", mood: "happy" }]} />
            </div>
            <div style={{ position: "absolute", left: 20, right: 20, bottom: 30, height: 12, borderRadius: 6, background: "rgba(18,4,75,0.2)" }}>
              <div style={{ width: `${prog * 100}%`, height: "100%", borderRadius: 6, background: C.red }} />
            </div>
            <div style={{ position: "absolute", left: 20, top: 70, ...body(26, C.white), background: LINE, borderRadius: 10, padding: "4px 12px" }}>0:20</div>
          </ToonPhone>
        </div>
        <Pop at={maine} style={{ position: "absolute", left: 60, top: 330, zIndex: 9 }}>
          <Panel style={{ padding: "18px 26px", maxWidth: 440 }}>
            <div style={{ ...big(44), whiteSpace: "normal" }}>"Maine yeh serum kyun banaya"</div>
          </Panel>
        </Pop>
        <Pop at={p15} style={{ position: "absolute", left: 80, top: 720, zIndex: 9 }}>
          <Panel style={{ padding: "18px 28px", display: "flex", alignItems: "center", gap: 20 }}>
            <svg width={80} height={80} viewBox="0 0 80 80">
              <path d="M10 18 Q10 8 20 8 H60 Q70 8 70 18 V48 Q70 58 60 58 H32 L16 72 L18 58 Q10 58 10 48 Z" fill={C.violet} stroke={LINE} strokeWidth={5} strokeLinejoin="round" />
            </svg>
            <div>
              <div style={big(96, C.green)}>{dms} DM</div>
              <div style={body(26, C.muted)}>USI RAAT</div>
            </div>
          </Panel>
        </Pop>
        <Pop at={video} style={{ position: "absolute", left: 80, top: 1000, zIndex: 8 }}>
          <Chip size={30} bg={C.red} border={LINE}>
            ● 20 SEC FOUNDER VIDEO
          </Chip>
        </Pop>
      </Camera>
      <Sfx at={video - 4} name="pop" vol={0.35} />
      {Array.from({ length: 5 }).map((_, i) => (
        <Sfx key={i} at={p15 + i * 4} name="ding" vol={0.3} />
      ))}
    </SceneShell>
  );
};

/* ===== S4: trust goes to a person, not a logo ===== */
export const S4Trust: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useCurrentFrame();
  const logo = cue("s4", "logo");
  const insaan = cue("s4", "insaan");
  const tilt = 9 * ramp(f, insaan - 6, insaan + 10) - 9 * (1 - ramp(f, logo - 6, logo + 6)) * 0;
  return (
    <SceneShell dur={dur} noExit>
      <Camera dur={dur} punches={[insaan]} push={0.02}>
        <MoneyRoom />
        <div style={{ position: "absolute", left: 0, right: 0, top: 300, display: "flex", justifyContent: "center", zIndex: 8 }}>
          <Chip size={34} bg={LINE}>
            BHAROSA KISPE?
          </Chip>
        </div>
        <div style={{ position: "absolute", left: 90, top: 470, display: "flex", gap: 60, zIndex: 6 }}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 20, transform: `translateY(${-tilt * 6}px) scale(${1 - 0.1 * ramp(f, insaan - 6, insaan + 8)})`, opacity: 1 - 0.35 * ramp(f, insaan - 6, insaan + 8) }}>
            <LogoTile w={390} />
            <Pop at={logo + 6}>
              <Verdict ok={false} text="BHAROSA NAHI" />
            </Pop>
          </div>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 20, transform: `translateY(${tilt * 6}px) scale(${1 + 0.06 * ramp(f, insaan - 6, insaan + 8)})` }}>
            <Head look={ROHIT} seed="r184" w={390} track={[{ at: -100, pose: "idle", mood: "neutral" }, { at: insaan, pose: "idle", mood: "grin" }]} />
            <Pop at={insaan}>
              <Verdict ok text="BHAROSA" />
            </Pop>
          </div>
        </div>
      </Camera>
      <Sfx at={logo + 2} name="error" vol={0.3} />
      <Sfx at={insaan - 2} name="ding" vol={0.45} />
    </SceneShell>
  );
};

/* ===== S5: fixes ===== */
export const S5Fixes: React.FC<{ dur: number }> = ({ dur }) => (
  <FixBoard
    dur={dur}
    tag={TAG}
    mouth={sceneMouth("s5")}
    marks={[cue("s5", "hafte"), cue("s5", "kaise"), cue("s5", "galti"), cue("s5", "comments")]}
    sub="sab phone pe shoot karo"
    fontSize={36}
    fixes={["Hafte mein 1 founder video", "Product kaise banta hai", "Ek galti jo sudhari", "Comments ka jawab khud do"]}
  />
);

/* ===== S6: CTA ===== */
const CamIcon: React.FC = () => (
  <svg width={86} height={100} viewBox="0 0 86 100">
    <rect x={3} y={3} width={80} height={94} rx={12} fill={C.violet} stroke={C.navy} strokeWidth={5} />
    <rect x={14} y={30} width={44} height={36} rx={6} fill={C.white} />
    <path d="M58 40 L74 30 L74 66 L58 56 Z" fill={C.lavender} />
    <circle cx={30} cy={80} r={5} fill="#2BD46B" />
    <text x={48} y={84} fontFamily="Inter" fontWeight={900} fontSize={13} fill={C.white}>
      15
    </text>
  </svg>
);

export const S6Cta: React.FC<{ dur: number }> = ({ dur }) => (
  <CtaScene
    dur={dur}
    tag={TAG}
    mouth={sceneMouth("s6")}
    keyword="FACE"
    typeAt={cue("s6", "face") - 8}
    giftAt={cue("s6", "phone") - 6}
    giftTitle="15 Founder Video Ideas"
    giftSub="free · sab phone pe shoot ho jaayein"
    giftIcon={<CamIcon />}
    nextAt={cue("s6", "aaj")}
    nextNum="#19"
    nextLabel="AAJ SHAAM 7 BAJE · AGLA CASE"
    next={
      <>
        <div style={big(52)}>Shaadi season mein</div>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div style={big(52)}>aapka product</div>
          <div style={{ ...big(56, C.white), background: C.violet, borderRadius: 16, padding: "8px 20px 0" }}>kahan fit?</div>
        </div>
      </>
    }
    followAt={cue("s6", "follow")}
  />
);
