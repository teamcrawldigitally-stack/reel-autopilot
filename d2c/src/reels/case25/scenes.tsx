import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { BP, FigLabel, FixCard, HisaabCta, Hl, big, ease, glass, label } from "../../components/hisaab";
import { Face, Pill, SerumBottle, Stamp } from "../../components/hisaabArt";
import { SceneShell, Sfx, clamp } from "../../components/kit";
import { C, theme } from "../../theme";
import { cue } from "./timeline";

type SP = { dur: number };

/** 0–3 second ruler with labelled segments and a playhead (0..3 s). */
export const Ruler3: React.FC<{ segs: [string, string][]; head: number; cut?: number; zone?: number; w?: number }> = ({ segs, head, cut, zone = 0, w = 912 }) => {
  const px = w / 3;
  return (
    <div style={{ position: "relative", width: w, height: 230 }}>
      {zone > 0 && <div style={{ position: "absolute", left: 0, top: 30, width: w * zone, height: 110, background: "rgba(255,90,95,0.14)", border: `3px dashed ${BP.red}`, borderRadius: 14, boxSizing: "border-box" }} />}
      <div style={{ position: "absolute", left: 0, right: 0, top: 40, height: 90, display: "flex", gap: 6 }}>
        {segs.map(([t, col], i) => (
          <div key={i} style={{ flex: 1, borderRadius: 14, background: col, display: "flex", alignItems: "center", justifyContent: "center", ...label(26, C.white) }}>
            {t}
          </div>
        ))}
      </div>
      {[0, 1, 2, 3].map((s) => (
        <div key={s} style={{ position: "absolute", left: s * px - (s === 3 ? 3 : 0), top: 140, width: 3, height: 24, background: BP.line }}>
          <div style={{ position: "absolute", top: 30, left: -20, width: 40, textAlign: "center", ...label(24, BP.dim) }}>{s}s</div>
        </div>
      ))}
      <div style={{ position: "absolute", left: Math.min(3, head) * px - 3, top: 10, width: 6, height: 150, background: C.white, borderRadius: 3, boxShadow: "0 0 18px rgba(255,255,255,0.8)" }} />
      {cut !== undefined && (
        <div style={{ position: "absolute", left: cut * px - 4, top: 0, width: 8, height: 170, background: BP.red, borderRadius: 4 }}>
          <div style={{ position: "absolute", top: -50, left: -70, width: 140, textAlign: "center", ...label(26, BP.red) }}>SKIP ⏭</div>
        </div>
      )}
    </div>
  );
};

const AdPhone: React.FC<{ kind: "logo" | "hook"; w?: number; talk?: number }> = ({ kind, w = 400, talk = 0 }) => (
  <div style={{ width: w, height: w * 1.6, borderRadius: w * 0.12, border: `4px solid ${BP.lineSoft}`, overflow: "hidden", background: kind === "logo" ? "#FFFFFF" : "linear-gradient(160deg,#FCE3D2,#E7B79B)", position: "relative", boxShadow: "0 40px 80px -30px rgba(0,0,0,0.8)" }}>
    {kind === "logo" ? (
      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 18 }}>
        <div style={{ width: w * 0.36, height: w * 0.36, borderRadius: "50%", background: C.violet, display: "flex", alignItems: "center", justifyContent: "center", ...big(w * 0.2, C.white), paddingTop: 8, boxSizing: "border-box" }}>R</div>
        <div style={label(w * 0.06, C.navy)}>ROHIT'S SKIN</div>
        <div style={label(w * 0.05, C.muted)}>♪ ♫ ♪</div>
      </div>
    ) : (
      <>
        <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, display: "flex", justifyContent: "center" }}>
          <Face kind="customer" w={w * 0.9} talk={talk} />
        </div>
        <div style={{ position: "absolute", left: 16, right: 16, top: 30, ...big(w * 0.09, C.navy), whiteSpace: "normal", textAlign: "center", background: "rgba(255,255,255,0.92)", borderRadius: 14, padding: "12px 10px 6px" }}>Baal itne girte hain?</div>
      </>
    )}
  </div>
);

/* s1 · hook (on screen from frame 0) */
export const S1Hook: React.FC<SP> = ({ dur }) => {
  const f = useCurrentFrame();
  const skip = cue("s1", "skip");
  const ring = interpolate(f, [0, skip], [0, 1], clamp);
  return (
    <SceneShell dur={dur}>
      <div style={{ position: "absolute", left: 0, right: 0, top: 360, display: "flex", justifyContent: "center" }}>
        <svg width={420} height={420} viewBox="0 0 420 420">
          <circle cx={210} cy={210} r={180} stroke="rgba(223,200,253,0.15)" strokeWidth={30} fill="none" />
          <circle cx={210} cy={210} r={180} stroke={BP.red} strokeWidth={30} fill="none" strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - ring} transform="rotate(-90 210 210)" />
          <text x={210} y={250} textAnchor="middle" fontFamily={theme.fonts.display} fontWeight={700} fontSize={150} fill={BP.text}>
            {Math.min(3, 0.5 + ring * 2.5).toFixed(0)}s
          </text>
        </svg>
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 860, display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
        <div style={big(80)}>Pehle 3 second mein</div>
        <Pill size={96}>SKIP ⏭</Pill>
      </div>
      <Sfx at={skip - 3} name="swish" vol={0.45} />
    </SceneShell>
  );
};

/* s2 · logo → music → product; Priya gone by ~1.5 s */
export const S2Old: React.FC<SP> = ({ dur }) => {
  const f = useCurrentFrame();
  const logo = cue("s2", "logo");
  const prod = cue("s2", "product");
  const aage = cue("s2", "aage");
  const head = interpolate(f, [logo - 4, prod + 6], [0, 2.6], clamp);
  return (
    <SceneShell dur={dur}>
      <FigLabel n={1} text="ROHIT KA AD · PEHLE 3 SEC" />
      <div style={{ position: "absolute", left: 0, right: 0, top: 380, display: "flex", justifyContent: "center", opacity: ease(f, 0, 10) }}>
        <AdPhone kind="logo" w={360} />
      </div>
      <div style={{ position: "absolute", left: 84, top: 1020 }}>
        <Ruler3 segs={[["LOGO", "#5B3BE0"], ["MUSIC", "#7C5CF0"], ["PRODUCT", "#A98DFF"]]} head={head} cut={f >= aage - 4 ? 1.5 : undefined} />
      </div>
      <div style={{ position: "absolute", left: 600, top: 420, opacity: ease(f, aage - 6, aage + 4) }}>
        <div style={label(26, BP.red)}>PRIYA</div>
        <div style={big(64, BP.red)}>aage ↑</div>
      </div>
      <Sfx at={aage - 4} name="error" vol={0.4} />
    </SceneShell>
  );
};

/* s3 · the decision happens in the first 3 seconds */
export const S3Zone: React.FC<SP> = ({ dur }) => {
  const f = useCurrentFrame();
  const faisla = cue("s3", "faisla");
  const feed = interpolate(f, [0, dur], [0, 1]);
  return (
    <SceneShell dur={dur}>
      <FigLabel n={2} text="FEED MEIN FAISLA" />
      <div style={{ position: "absolute", left: 84, top: 380, width: 912, height: 520, overflow: "hidden", borderRadius: 30, ...glass }}>
        {Array.from({ length: 9 }).map((_, i) => (
          <div key={i} style={{ position: "absolute", left: 30, right: 30, top: 30 + i * 180 - feed * 900, height: 150, borderRadius: 20, background: "rgba(223,200,253,0.08)", display: "flex", alignItems: "center", gap: 20, padding: "0 20px", filter: "blur(1.5px)" }}>
            <div style={{ width: 110, height: 110, borderRadius: 16, background: ["#5B3BE0", "#20B2A0", "#F5A25D"][i % 3] }} />
            <div style={{ flex: 1, height: 18, borderRadius: 9, background: "rgba(223,200,253,0.2)" }} />
          </div>
        ))}
      </div>
      <div style={{ position: "absolute", left: 84, top: 980 }}>
        <Ruler3 segs={[["", "rgba(223,200,253,0.15)"], ["", "rgba(223,200,253,0.15)"], ["", "rgba(223,200,253,0.15)"]]} head={interpolate(f, [faisla, faisla + 40], [0, 3], clamp)} zone={ease(f, faisla - 4, faisla + 8)} />
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 1240, display: "flex", justifyContent: "center", opacity: ease(f, faisla - 4, faisla + 8) }}>
        <div style={big(64, BP.red)}>Faisla yahin · 3 sec</div>
      </div>
      <Sfx at={faisla - 4} name="tick" vol={0.4} />
    </SceneShell>
  );
};

/* s4 · same ad, new opening: a question at second 0 → she stops */
export const S4New: React.FC<SP> = ({ dur }) => {
  const f = useCurrentFrame();
  const baal = cue("s4", "baal");
  const ruk = cue("s4", "ruk");
  const head = interpolate(f, [baal - 2, ruk + 10], [0, 3], clamp);
  return (
    <SceneShell dur={dur}>
      <FigLabel n={3} text="WAHI AD · NAYI SHURUAAT" />
      <div style={{ position: "absolute", left: 0, right: 0, top: 380, display: "flex", justifyContent: "center", opacity: ease(f, 0, 10) }}>
        <AdPhone kind="hook" w={360} talk={baal <= f && f <= baal + 30 ? Math.abs(Math.sin(f / 2.2)) * 0.9 : 0} />
      </div>
      <div style={{ position: "absolute", left: 84, top: 1020 }}>
        <Ruler3 segs={[["PROBLEM", BP.green], ["CHEHRA", "#20B2A0"], ["PRODUCT", "#7C5CF0"]]} head={head} />
      </div>
      <div style={{ position: "absolute", left: 540, top: 1330 }}>
        <Stamp text="RUKI ✓" at={ruk - 2} color={BP.green} size={80} rot={-6} />
      </div>
      <div style={{ position: "absolute", left: 120, top: 600 }}>
        <SerumBottle h={200} />
      </div>
      <Sfx at={baal - 4} name="pop" vol={0.4} />
      <Sfx at={ruk - 2} name="stamp" vol={0.5} />
    </SceneShell>
  );
};

/* s5 · fixes */
export const S5Fixes: React.FC<SP> = ({ dur }) => (
  <SceneShell dur={dur}>
    <FigLabel n={4} text="PEHLE 3 SECOND AISE" />
    <div style={{ position: "absolute", left: 84, top: 390, display: "flex", flexDirection: "column", gap: 30 }}>
      <FixCard n={1} at={cue("s5", "problem") - 8} title={<><Hl>Problem ya result</Hl> se shuru</>} sub="logo aakhir mein" />
      <FixCard n={2} at={cue("s5", "frame") - 10} title={<>Pehle frame mein <Hl>haath ya chehra</Hl></>} sub="insaan dikhe toh nazar rukti hai" />
      <FixCard n={3} at={cue("s5", "screen") - 10} title={<>Main baat <Hl c={BP.green}>screen pe likho</Hl></>} sub="kai log aawaz band karke dekhte hain" />
    </div>
    <Sfx at={cue("s5", "problem") - 8} name="pop" vol={0.5} />
    <Sfx at={cue("s5", "frame") - 10} name="pop" vol={0.5} />
    <Sfx at={cue("s5", "screen") - 10} name="pop" vol={0.5} />
  </SceneShell>
);

const LinesIcon: React.FC = () => (
  <svg width={86} height={100} viewBox="0 0 86 100">
    <rect x={3} y={3} width={80} height={94} rx={12} fill={C.violet} stroke={C.navy} strokeWidth={5} />
    <text x={43} y={40} textAnchor="middle" fontFamily="Inter" fontWeight={900} fontSize={22} fill={C.white}>
      20
    </text>
    {[0, 1, 2].map((r) => (
      <rect key={r} x={16} y={54 + r * 12} width={54 - r * 8} height={6} rx={3} fill={C.lavender} />
    ))}
  </svg>
);

/* s6 · CTA */
export const S6Cta: React.FC<SP> = ({ dur }) => (
  <SceneShell dur={dur} noExit>
    <HisaabCta
      keyword="AD3"
      typeAt={cue("s6", "ad three") - 8}
      giftAt={cue("s6", "bees") - 6}
      giftTitle="Ads ki 20 Opening Lines"
      giftSub="free · copy-paste, Hinglish mein"
      giftIcon={<LinesIcon />}
      nextAt={cue("s6", "kal")}
      nextLabel="KAL DOPAHAR 1 BAJE · AGLA CASE"
      next={
        <>
          <div style={big(52, C.navy)}>Website 3 second late khuli,</div>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{ ...big(58, C.white), background: C.red, borderRadius: 16, padding: "8px 20px 0" }}>kitne log</div>
            <div style={big(52, C.navy)}>gaye?</div>
          </div>
        </>
      }
      followAt={cue("s6", "follow")}
    />
  </SceneShell>
);
