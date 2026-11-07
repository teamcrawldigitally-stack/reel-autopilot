import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { BP, FigLabel, FixCard, HisaabCta, Hl, big, ease, label, useCount } from "../../components/hisaab";
import { Dude, PhoneShell, Pill, Stamp } from "../../components/hisaabArt";
import { SceneShell, Sfx, clamp } from "../../components/kit";
import { C } from "../../theme";
import { cue } from "./timeline";

type SP = { dur: number };

const Spinner: React.FC<{ s?: number }> = ({ s = 120 }) => {
  const f = useCurrentFrame();
  return (
    <svg width={s} height={s} viewBox="0 0 100 100" style={{ transform: `rotate(${f * 12}deg)` }}>
      <circle cx={50} cy={50} r={38} stroke="rgba(223,200,253,0.18)" strokeWidth={12} fill="none" />
      <circle cx={50} cy={50} r={38} stroke={C.lavender} strokeWidth={12} fill="none" strokeLinecap="round" strokeDasharray="70 200" />
    </svg>
  );
};

/** Loading website inside a phone. */
const LoadingPhone: React.FC<{ w?: number; secs?: number }> = ({ w = 400, secs }) => (
  <PhoneShell w={w}>
    <div style={{ position: "absolute", left: 20, right: 20, top: 60, height: 40, borderRadius: 20, background: "rgba(223,200,253,0.12)", display: "flex", alignItems: "center", padding: "0 16px", ...label(18, BP.dim) }}>rohitskin.in/serum</div>
    <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 20 }}>
      <Spinner s={w * 0.3} />
      {secs !== undefined && <div style={big(w * 0.2, secs >= 3 ? BP.red : BP.text)}>{secs}s</div>}
    </div>
  </PhoneShell>
);

/* s1 · hook (on screen from frame 0) */
export const S1Hook: React.FC<SP> = ({ dur }) => {
  const f = useCurrentFrame();
  const aadhe = cue("s1", "aadhe");
  return (
    <SceneShell dur={dur}>
      <div style={{ position: "absolute", left: 84, top: 340 }}>
        <LoadingPhone w={360} />
      </div>
      <div style={{ position: "absolute", left: 520, top: 380, display: "grid", gridTemplateColumns: "repeat(5, 70px)", gap: 14 }}>
        {Array.from({ length: 20 }).map((_, i) => {
          const leave = i % 2 === 0 && i < 20;
          const p = leave ? ease(f, aadhe - 4 + i, aadhe + 8 + i) : 0;
          return (
            <div key={i} style={{ opacity: 1 - 0.75 * p, transform: `translateX(${p * 80}px)` }}>
              <Dude s={60} color={p > 0.2 ? BP.red : "rgba(223,200,253,0.45)"} />
            </div>
          );
        })}
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 1080, display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
        <div style={big(80)}>Website 3 second late,</div>
        <Pill size={92}>aadhe log gaye?</Pill>
      </div>
      <Sfx at={aadhe - 4} name="swish" vol={0.4} />
    </SceneShell>
  );
};

/* s2 · tap → spinner → 1, 2, 3 */
export const S2Spin: React.FC<SP> = ({ dur }) => {
  const f = useCurrentFrame();
  const ticks = [cue("s2", "ek"), cue("s2", "do"), cue("s2", "teen")];
  const secs = ticks.filter((t) => f >= t - 2).length;
  return (
    <SceneShell dur={dur}>
      <FigLabel n={1} text="PRIYA NE AD PE TAP KIYA" />
      <div style={{ position: "absolute", left: 0, right: 0, top: 380, display: "flex", justifyContent: "center", opacity: ease(f, 0, 10) }}>
        <LoadingPhone w={420} secs={secs > 0 ? secs : undefined} />
      </div>
      {ticks.map((t, i) => (
        <Sfx key={i} at={t - 2} name="tick" vol={0.45} />
      ))}
    </SceneShell>
  );
};

/* s3 · back → ad money spent, no order */
export const S3Back: React.FC<SP> = ({ dur }) => {
  const f = useCurrentFrame();
  const back = cue("s3", "back");
  const paisa = cue("s3", "paisa");
  const order = cue("s3", "order");
  return (
    <SceneShell dur={dur}>
      <FigLabel n={2} text="BACK ←" />
      <div style={{ position: "absolute", left: 84, top: 380 }}>
        <LoadingPhone w={360} secs={3} />
      </div>
      <div style={{ position: "absolute", left: 140, top: 520, ...big(220, BP.red), opacity: ease(f, back - 6, back + 2), transform: `translateX(${(1 - ease(f, back - 6, back + 4)) * 60}px)`, textShadow: "0 0 40px rgba(255,90,95,0.6)" }}>←</div>
      <div style={{ position: "absolute", left: 540, top: 440, display: "flex", flexDirection: "column", gap: 44 }}>
        <div style={{ opacity: ease(f, paisa - 6, paisa + 4) }}>
          <div style={label(26, BP.dim)}>AD KA PAISA</div>
          <div style={big(96, BP.red)}>KATA</div>
        </div>
        <div style={{ opacity: ease(f, order - 6, order + 4) }}>
          <div style={label(26, BP.dim)}>ORDER</div>
          <div style={big(130, BP.red)}>0</div>
        </div>
      </div>
      <Sfx at={back - 4} name="swish" vol={0.45} />
      <Sfx at={order - 2} name="error" vol={0.4} />
    </SceneShell>
  );
};

/* s4 · Google: 53% leave if > 3 s */
export const S4Stat: React.FC<SP> = ({ dur }) => {
  const f = useCurrentFrame();
  const google = cue("s4", "google");
  const aadhe = cue("s4", "aadhe");
  const n = useCount(53, aadhe - 4, aadhe + 24);
  return (
    <SceneShell dur={dur}>
      <FigLabel n={3} text="100 MEIN SE KITNE GAYE?" />
      <div style={{ position: "absolute", left: 84, top: 380, display: "grid", gridTemplateColumns: "repeat(10, 46px)", columnGap: 42, rowGap: 14, opacity: ease(f, google - 6, google + 8) }}>
        {Array.from({ length: 100 }).map((_, i) => {
          const order = (i * 37) % 100;
          const gone = order < 53;
          const p = gone ? ease(f, aadhe - 4 + order * 0.5, aadhe + 4 + order * 0.5) : 0;
          return (
            <div key={i} style={{ opacity: 1 - 0.7 * p, transform: `translateY(${p * 14}px)` }}>
              <Dude s={46} color={p > 0.3 ? BP.red : "rgba(223,200,253,0.45)"} />
            </div>
          );
        })}
      </div>
      <div style={{ position: "absolute", left: 84, right: 84, top: 1200, display: "flex", justifyContent: "space-between", alignItems: "flex-end", opacity: ease(f, aadhe - 6, aadhe + 2) }}>
        <div>
          <div style={label(26, BP.dim)}>3 SEC SE ZYADA · CHALE GAYE</div>
          <div style={big(130, BP.red)}>{Math.round(n)}%</div>
        </div>
        <div style={{ textAlign: "right", ...label(20, BP.dim), lineHeight: 1.5 }}>
          SOURCE: GOOGLE / DOUBLECLICK
          <br />
          "THE NEED FOR MOBILE SPEED", 2016
        </div>
      </div>
      <Sfx at={google - 6} name="whoosh" vol={0.35} />
      <Sfx at={aadhe - 4} name="swish" vol={0.4} />
    </SceneShell>
  );
};

/* s5 · fixes */
export const S5Fixes: React.FC<SP> = ({ dur }) => (
  <SceneShell dur={dur}>
    <FigLabel n={4} text="WEBSITE TEZ KARO" />
    <div style={{ position: "absolute", left: 84, top: 390, display: "flex", flexDirection: "column", gap: 30 }}>
      <FixCard n={1} at={cue("s5", "photos") - 10} title={<>Product photos <Hl>chhoti</Hl> karo</>} sub="compress karo · WebP" />
      <FixCard n={2} at={cue("s5", "apps") - 10} title={<>Faltu <Hl>apps aur popups</Hl> hatao</>} sub="har app page dheema karta hai" />
      <FixCard n={3} at={cue("s5", "mobile") - 10} title={<>Mobile data pe <Hl c={BP.green}>khud kholke</Hl> dekho</>} sub="wifi pe nahi, 4G pe" />
    </div>
    <Sfx at={cue("s5", "photos") - 10} name="pop" vol={0.5} />
    <Sfx at={cue("s5", "apps") - 10} name="pop" vol={0.5} />
    <Sfx at={cue("s5", "mobile") - 10} name="pop" vol={0.5} />
  </SceneShell>
);

const SpeedIcon: React.FC = () => (
  <svg width={86} height={100} viewBox="0 0 86 100">
    <rect x={3} y={3} width={80} height={94} rx={12} fill={C.violet} stroke={C.navy} strokeWidth={5} />
    <path d="M18 66 A26 26 0 0 1 68 66" stroke={C.white} strokeWidth={7} fill="none" strokeLinecap="round" />
    <line x1={43} y1={66} x2={60} y2={46} stroke="#2BD46B" strokeWidth={6} strokeLinecap="round" />
    <circle cx={43} cy={66} r={5} fill={C.white} />
  </svg>
);

/* s6 · CTA */
export const S6Cta: React.FC<SP> = ({ dur }) => (
  <SceneShell dur={dur} noExit>
    <HisaabCta
      keyword="SPEED"
      typeAt={cue("s6", "speed") - 8}
      giftAt={cue("s6", "website") - 6}
      giftTitle="Website Speed Checklist"
      giftSub="free · 10 cheezein, 30 minute mein"
      giftIcon={<SpeedIcon />}
      nextAt={cue("s6", "aaj")}
      nextLabel="AAJ SHAAM 7 BAJE · AGLA CASE"
      next={
        <>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{ ...big(58, C.white), background: C.violet, borderRadius: 16, padding: "8px 20px 0" }}>990 log</div>
            <div style={big(50, C.navy)}>bina khareede gaye,</div>
          </div>
          <div style={big(50, C.navy)}>unhe wapas kaise laayein?</div>
        </>
      }
      followAt={cue("s6", "follow")}
    />
  </SceneShell>
);
