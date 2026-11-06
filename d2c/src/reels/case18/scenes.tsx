import React from "react";
import { useCurrentFrame } from "remotion";
import { CheckIcon, CrossIcon } from "../../components/icons";
import { BP, FigLabel, FixCard, HisaabCta, Hl, big, ease, glass, label, useCount } from "../../components/hisaab";
import { Face, Pill, SerumBottle, Stamp, useTalk } from "../../components/hisaabArt";
import { SceneShell, Sfx } from "../../components/kit";
import { C } from "../../theme";
import { cue } from "./timeline";

type SP = { dur: number };

/** Generic brand-logo tile. */
const LogoTile: React.FC<{ w?: number }> = ({ w = 300 }) => (
  <div style={{ width: w, height: w, borderRadius: w * 0.16, background: "linear-gradient(150deg,#FFFFFF,#E9E2FA)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: w * 0.03, boxShadow: "0 30px 60px -24px rgba(0,0,0,0.7)" }}>
    <div style={{ width: w * 0.42, height: w * 0.42, borderRadius: "50%", background: C.violet, display: "flex", alignItems: "center", justifyContent: "center", ...big(w * 0.24, C.white), paddingTop: w * 0.03, boxSizing: "border-box" }}>R</div>
    <div style={label(w * 0.075, C.navy)}>ROHIT'S SKIN</div>
  </div>
);

const FaceTile: React.FC<{ w?: number; talk?: number }> = ({ w = 300, talk = 0 }) => (
  <div style={{ width: w, height: w, borderRadius: w * 0.16, background: "linear-gradient(160deg,#FCE3D2,#E7B79B)", display: "flex", alignItems: "flex-end", justifyContent: "center", overflow: "hidden", boxShadow: "0 30px 60px -24px rgba(0,0,0,0.7)" }}>
    <Face kind="founder" w={w * 0.82} talk={talk} />
  </div>
);

/* s1 · hook (on screen from frame 0) */
export const S1Hook: React.FC<SP> = ({ dur }) => {
  const f = useCurrentFrame();
  const insaan = cue("s1", "insaan");
  const chehra = cue("s1", "chehra");
  return (
    <SceneShell dur={dur}>
      <div style={{ position: "absolute", left: 0, right: 0, top: 330, display: "flex", justifyContent: "center", gap: 60 }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 18 }}>
          <LogoTile w={340} />
          <CrossIcon size={64} />
        </div>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 18, opacity: 0.35 + 0.65 * ease(f, insaan - 6, insaan + 4) }}>
          <FaceTile w={340} talk={useTalk(insaan, insaan + 25)} />
          <div style={{ opacity: ease(f, insaan - 2, insaan + 6) }}>
            <CheckIcon size={64} draw={ease(f, insaan, insaan + 10)} />
          </div>
        </div>
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 860, display: "flex", flexDirection: "column", alignItems: "center", gap: 18 }}>
        <div style={big(80)}>Log logo se nahi,</div>
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <Pill size={86} bg={BP.green} color={C.navy}>INSAAN</Pill>
          <div style={big(80)}>se khareedte</div>
        </div>
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 1150, display: "flex", justifyContent: "center", opacity: ease(f, chehra - 6, chehra + 4), transform: `scale(${0.8 + 0.2 * ease(f, chehra - 6, chehra + 4)})` }}>
        <div style={{ ...glass, padding: "18px 34px 10px", ...big(64, BP.red) }}>Aapka chehra kahan hai?</div>
      </div>
      <Sfx at={insaan - 3} name="check" vol={0.45} />
      <Sfx at={chehra - 4} name="pop" vol={0.45} />
    </SceneShell>
  );
};

/* s2 · Rohit's page: 60 posts, all product photos, 3 likes each */
export const S2Page: React.FC<SP> = ({ dur }) => {
  const f = useCurrentFrame();
  const saath = cue("s2", "saath");
  const teen = cue("s2", "teen");
  const posts = useCount(60, saath - 10, saath + 14);
  return (
    <SceneShell dur={dur}>
      <FigLabel n={1} text="ROHIT KA PAGE" />
      <div style={{ position: "absolute", left: 84, top: 380, display: "grid", gridTemplateColumns: "repeat(10, 80px)", gap: 3 }}>
        {Array.from({ length: 60 }).map((_, i) => {
          const at = saath - 10 + i * 0.4;
          const p = ease(f, at, at + 6);
          const heart = f >= teen + (i % 10) * 0.6;
          return (
            <div key={i} style={{ position: "relative", width: 80, height: 80, background: "#FFFFFF", borderRadius: 6, display: "flex", justifyContent: "center", alignItems: "center", opacity: p, transform: `scale(${0.6 + 0.4 * p})` }}>
              <SerumBottle h={62} label="" />
              {heart && <div style={{ position: "absolute", right: 3, bottom: 2, ...label(14, BP.red), letterSpacing: 0 }}>♥3</div>}
            </div>
          );
        })}
      </div>
      <div style={{ position: "absolute", left: 84, right: 84, top: 940, display: "flex", justifyContent: "space-between" }}>
        <div>
          <div style={label(26, BP.dim)}>POSTS · SAB PRODUCT PHOTOS</div>
          <div style={big(130)}>{Math.round(posts)}</div>
        </div>
        <div style={{ textAlign: "right", opacity: ease(f, teen - 6, teen + 4) }}>
          <div style={label(26, BP.dim)}>LIKE HAR POST PE</div>
          <div style={big(130, BP.red)}>♥ 3</div>
        </div>
      </div>
      {[0, 5, 10, 15].map((d) => (
        <Sfx key={d} at={saath - 10 + d} name="tick" vol={0.3} />
      ))}
      <Sfx at={teen - 2} name="error" vol={0.35} />
    </SceneShell>
  );
};

/* s3 · one 20-second founder video → 15 DMs */
export const S3Video: React.FC<SP> = ({ dur }) => {
  const f = useCurrentFrame();
  const bees = cue("s3", "bees");
  const maine = cue("s3", "maine");
  const pandrah = cue("s3", "pandrah");
  const dms = useCount(15, pandrah - 6, pandrah + 18);
  const t = Math.min(20, Math.max(0, Math.floor((f - bees) / 4)));
  return (
    <SceneShell dur={dur}>
      <FigLabel n={2} text="EK FOUNDER VIDEO" />
      <div style={{ position: "absolute", left: 84, top: 380, width: 470, height: 760, borderRadius: 40, overflow: "hidden", background: "linear-gradient(160deg,#FCE3D2,#E7B79B)", border: `4px solid ${BP.lineSoft}`, opacity: ease(f, bees - 8, bees + 4) }}>
        <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, display: "flex", justifyContent: "center" }}>
          <Face kind="founder" w={430} talk={useTalk(maine - 2, maine + 30)} />
        </div>
        <div style={{ position: "absolute", left: 20, top: 20, ...label(24, C.white), background: "rgba(0,0,0,0.55)", borderRadius: 10, padding: "8px 12px 6px" }}>▶ 0:{String(t).padStart(2, "0")} / 0:20</div>
        <div style={{ position: "absolute", left: 20, right: 20, bottom: 30, ...big(34, C.navy), whiteSpace: "normal", textAlign: "center", background: "rgba(255,255,255,0.92)", borderRadius: 14, padding: "12px 14px 6px", opacity: ease(f, maine - 4, maine + 6) }}>
          "Maine yeh serum kyun banaya"
        </div>
      </div>
      <div style={{ position: "absolute", left: 600, top: 400, display: "flex", flexDirection: "column", gap: 12 }}>
        {Array.from({ length: 6 }).map((_, i) => {
          const p = ease(f, pandrah - 6 + i * 3, pandrah + i * 3);
          return (
            <div key={i} style={{ opacity: p, transform: `translateX(${(1 - p) * 60}px)`, ...glass, borderRadius: 18, padding: "12px 16px 8px", display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 34, height: 34, borderRadius: "50%", background: [C.violet, BP.green, C.lavender][i % 3] }} />
              <div style={label(20, BP.text)}>{["Price kya hai?", "Kahan milega?", "Order karna hai", "Oily skin pe?", "COD hai?", "Link bhejo"][i]}</div>
            </div>
          );
        })}
      </div>
      <div style={{ position: "absolute", left: 600, top: 1000, opacity: ease(f, pandrah - 6, pandrah + 4) }}>
        <div style={label(26, BP.dim)}>USI RAAT</div>
        <div style={big(120, BP.green)}>{Math.round(dms)} DM</div>
      </div>
      <Sfx at={bees - 6} name="whoosh" vol={0.4} />
      {[0, 4, 8, 12].map((d) => (
        <Sfx key={d} at={pandrah - 4 + d} name="pop" vol={0.35} />
      ))}
    </SceneShell>
  );
};

/* s4 · trust meter: logo vs a person */
export const S4Trust: React.FC<SP> = ({ dur }) => {
  const f = useCurrentFrame();
  const logo = cue("s4", "logo");
  const insaan = cue("s4", "insaan");
  const bar = (name: string, v: number, word: string, color: string, at: number, top: number) => {
    const p = ease(f, at, at + 18);
    return (
      <div style={{ position: "absolute", left: 84, right: 84, top, opacity: ease(f, at - 6, at + 2) }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
          <div style={big(64)}>{name}</div>
          <div style={big(64, color)}>{word}</div>
        </div>
        <div style={{ marginTop: 14, height: 46, borderRadius: 23, background: "rgba(223,200,253,0.12)", overflow: "hidden" }}>
          <div style={{ width: `${v * p}%`, height: "100%", borderRadius: 23, background: color }} />
        </div>
      </div>
    );
  };
  return (
    <SceneShell dur={dur}>
      <FigLabel n={3} text="BHAROSA METER" />
      {bar("Logo pe", 14, "kam", BP.red, logo, 430)}
      {bar("Insaan pe", 88, "zyada", BP.green, insaan, 700)}
      <div style={{ position: "absolute", left: 540, top: 1180 }}>
        <Stamp text="CHEHRA DIKHAO" at={insaan + 20} color={BP.green} size={70} rot={-5} />
      </div>
      <Sfx at={logo} name="error" vol={0.35} />
      <Sfx at={insaan} name="ding" vol={0.4} />
      <Sfx at={insaan + 18} name="stamp" vol={0.5} />
    </SceneShell>
  );
};

/* s5 · weekly founder video: 3 things to show */
export const S5Fixes: React.FC<SP> = ({ dur }) => {
  const f = useCurrentFrame();
  const head = cue("s5", "founder");
  return (
    <SceneShell dur={dur}>
      <FigLabel n={4} text="HAFTE MEIN 1 FOUNDER VIDEO" />
      <div style={{ position: "absolute", left: 84, top: 380, opacity: ease(f, head - 8, head + 4) }}>
        <Hl c={BP.green}>
          <span style={big(56, C.navy)}>1 video / hafta · phone se</span>
        </Hl>
      </div>
      <div style={{ position: "absolute", left: 84, top: 500, display: "flex", flexDirection: "column", gap: 30 }}>
        <FixCard n={1} at={cue("s5", "kaise") - 12} title={<>Product <Hl>kaise banta</Hl> hai, dikhao</>} sub="factory, packing, ingredients" />
        <FixCard n={2} at={cue("s5", "galti") - 10} title={<>Ek <Hl>galti</Hl> jo sudhari, batao</>} sub="sach bolo, bharosa badhta hai" />
        <FixCard n={3} at={cue("s5", "comments") - 10} title={<>Comments ka jawab <Hl c={BP.green}>khud</Hl> do</>} sub="founder ka naam, founder ki awaaz" />
      </div>
      <Sfx at={cue("s5", "kaise") - 12} name="pop" vol={0.5} />
      <Sfx at={cue("s5", "galti") - 10} name="pop" vol={0.5} />
      <Sfx at={cue("s5", "comments") - 10} name="pop" vol={0.5} />
    </SceneShell>
  );
};

const CamIcon: React.FC = () => (
  <svg width={86} height={100} viewBox="0 0 86 100">
    <rect x={3} y={3} width={80} height={94} rx={12} fill={C.violet} stroke={C.navy} strokeWidth={5} />
    <rect x={14} y={30} width={44} height={36} rx={6} fill={C.white} />
    <path d="M58 40 L74 30 L74 66 L58 56 Z" fill={C.lavender} />
    <circle cx={30} cy={80} r={5} fill="#2BD46B" />
    <text x={48} y={84} fontFamily="Inter" fontWeight={900} fontSize={13} fill={C.white}>15</text>
  </svg>
);

/* s6 · CTA */
export const S6Cta: React.FC<SP> = ({ dur }) => (
  <SceneShell dur={dur} noExit>
    <HisaabCta
      keyword="FACE"
      typeAt={cue("s6", "face") - 8}
      giftAt={cue("s6", "phone") - 6}
      giftTitle="15 Founder Video Ideas"
      giftSub="free · sab phone pe shoot ho jaayein"
      giftIcon={<CamIcon />}
      nextAt={cue("s6", "aaj")}
      nextLabel="AAJ SHAAM 7 BAJE · AGLA CASE"
      next={
        <>
          <div style={big(52, C.navy)}>Shaadi season mein</div>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div style={big(52, C.navy)}>aapka product</div>
            <div style={{ ...big(58, C.white), background: C.violet, borderRadius: 16, padding: "8px 20px 0" }}>kahan fit?</div>
          </div>
        </>
      }
      followAt={cue("s6", "follow")}
    />
  </SceneShell>
);
