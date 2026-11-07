import React from "react";
import { useCurrentFrame } from "remotion";
import { BP, FigLabel, FixCard, HisaabCta, Hl, big, ease, glass, label } from "../../components/hisaab";
import { Pill, SerumBottle, Stamp } from "../../components/hisaabArt";
import { SceneShell, Sfx } from "../../components/kit";
import { C } from "../../theme";
import { cue } from "./timeline";

type SP = { dur: number };

/** Speech card: who + what they say. */
export const SayCard: React.FC<{ who: string; text: React.ReactNode; color?: string; w?: number; dim?: boolean }> = ({ who, text, color = BP.text, w = 440, dim = false }) => (
  <div style={{ width: w, ...glass, borderRadius: 28, padding: "24px 28px 20px", boxSizing: "border-box", border: `3px solid ${dim ? BP.lineSoft : color}`, opacity: dim ? 0.55 : 1 }}>
    <div style={label(26, BP.dim)}>{who}</div>
    <div style={{ fontFamily: big(10).fontFamily, fontWeight: 700, fontSize: 54, lineHeight: 1.12, color, marginTop: 10 }}>{text}</div>
  </div>
);

/** Five stars. */
const Stars: React.FC<{ s?: number }> = ({ s = 40 }) => (
  <div style={{ display: "flex", gap: 6 }}>
    {Array.from({ length: 5 }).map((_, i) => (
      <svg key={i} width={s} height={s} viewBox="0 0 24 24">
        <path d="M12 2 L15 9 L22 9.5 L16.5 14 L18.5 21 L12 17 L5.5 21 L7.5 14 L2 9.5 L9 9 Z" fill="#FFC94A" />
      </svg>
    ))}
  </div>
);

/** Dark search bar with typed text. */
const Search: React.FC<{ text: string; n: number; w?: number; color?: string; mark?: "x" | "ok" | null }> = ({ text, n, w = 912, color = BP.text, mark = null }) => {
  const f = useCurrentFrame();
  const shown = text.slice(0, Math.max(0, Math.min(text.length, Math.floor(n))));
  const caret = Math.floor(f / 8) % 2 === 0 && n < text.length + 2;
  return (
    <div style={{ width: w, ...glass, borderRadius: 999, padding: "22px 34px 16px", display: "flex", alignItems: "center", gap: 20, boxSizing: "border-box", border: `3px solid ${mark === "x" ? BP.red : mark === "ok" ? BP.green : BP.lineSoft}` }}>
      <svg width={44} height={44} viewBox="0 0 24 24">
        <circle cx={10} cy={10} r={6.5} stroke={BP.dim} strokeWidth={2.5} fill="none" />
        <line x1={15} y1={15} x2={21} y2={21} stroke={BP.dim} strokeWidth={2.5} strokeLinecap="round" />
      </svg>
      <div style={{ ...big(50, color), flex: 1 }}>
        {shown}
        <span style={{ opacity: caret ? 1 : 0, color: C.lavender }}>|</span>
      </div>
      {mark && <div style={big(54, mark === "x" ? BP.red : BP.green)}>{mark === "x" ? "✕" : "✓"}</div>}
    </div>
  );
};

/* s1 · hook (on screen from frame 0) */
export const S1Hook: React.FC<SP> = ({ dur }) => {
  const f = useCurrentFrame();
  const cust = cue("s1", "customer");
  const kaun = cue("s1", "kaun");
  return (
    <SceneShell dur={dur}>
      <div style={{ position: "absolute", left: 84, top: 330 }}>
        <SayCard who="AAPKA AD" text={<>"Premium quality"</>} w={600} dim={f >= cust} />
      </div>
      <div style={{ position: "absolute", right: 84, top: 600, opacity: 0.6 + 0.4 * ease(f, cust - 8, cust + 2), transform: `scale(${0.96 + 0.04 * ease(f, cust - 8, cust + 4)})`, transformOrigin: "right center" }}>
        <SayCard who="CUSTOMER" text={<>"Baal girna <span style={{ color: BP.green }}>band hua</span>"</>} w={640} color={BP.text} />
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 1060, display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
        <div style={big(74)}>Aap vs customer ke shabd,</div>
        <Pill size={96}>kaun bechega?</Pill>
      </div>
      <Sfx at={cust - 6} name="pop" vol={0.4} />
      <Sfx at={kaun - 4} name="swish" vol={0.35} />
    </SceneShell>
  );
};

/* s2 · Rohit's ad words: premium, natural, best quality */
export const S2Ad: React.FC<SP> = ({ dur }) => {
  const f = useCurrentFrame();
  const words: [string, number][] = [
    ["PREMIUM", cue("s2", "premium")],
    ["NATURAL", cue("s2", "natural")],
    ["BEST QUALITY", cue("s2", "best")],
  ];
  return (
    <SceneShell dur={dur}>
      <FigLabel n={1} text="ROHIT KA AD" />
      <div style={{ position: "absolute", left: 84, top: 420, width: 400, height: 640, ...glass, borderRadius: 30, display: "flex", alignItems: "center", justifyContent: "center", opacity: ease(f, 0, 12) }}>
        <SerumBottle h={420} />
      </div>
      <div style={{ position: "absolute", left: 530, top: 460, display: "flex", flexDirection: "column", gap: 34 }}>
        {words.map(([w, at]) => (
          <div key={w} style={{ opacity: ease(f, at - 6, at + 2), transform: `translateX(${(1 - ease(f, at - 6, at + 4)) * 50}px) rotate(-2deg)` }}>
            <Pill size={64} bg={C.violet} rot={-2}>
              {w}
            </Pill>
          </div>
        ))}
      </div>
      <div style={{ position: "absolute", left: 530, top: 900, ...label(28, BP.dim), opacity: ease(f, words[2][1] + 6, words[2][1] + 16) }}>SAB BRAND YAHI BOLTE HAIN</div>
      {words.map(([w, at]) => (
        <Sfx key={w} at={at - 4} name="pop" vol={0.4} />
      ))}
    </SceneShell>
  );
};

/* s3 · Priya's review: hair fall reduced in 3 weeks */
export const S3Review: React.FC<SP> = ({ dur }) => {
  const f = useCurrentFrame();
  const rev = cue("s3", "review");
  const baal = cue("s3", "baal");
  const hl = ease(f, baal - 4, baal + 10);
  return (
    <SceneShell dur={dur}>
      <FigLabel n={2} text="PRIYA KA REVIEW" />
      <div style={{ position: "absolute", left: 84, right: 84, top: 440, ...glass, borderRadius: 30, padding: "34px 40px 30px", opacity: ease(f, rev - 8, rev + 2), transform: `translateY(${(1 - ease(f, rev - 8, rev + 4)) * 50}px)` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div style={{ width: 80, height: 80, borderRadius: "50%", background: "#C98A60", display: "flex", alignItems: "center", justifyContent: "center", ...big(40, C.white) }}>P</div>
          <div>
            <div style={big(44)}>Priya S.</div>
            <Stars s={36} />
          </div>
          <div style={{ marginLeft: "auto", ...label(24, BP.green) }}>VERIFIED BUYER</div>
        </div>
        <div style={{ fontFamily: big(10).fontFamily, fontWeight: 700, fontSize: 62, lineHeight: 1.18, color: BP.text, marginTop: 30 }}>
          "3 hafte mein{" "}
          <span style={{ background: `rgba(43,212,107,${0.9 * hl})`, color: hl > 0.5 ? C.navy : BP.text, borderRadius: 12, padding: "0 10px" }}>baal girna kam hua</span>
          "
        </div>
      </div>
      <div style={{ position: "absolute", left: 84, top: 1000, ...label(28, BP.dim), opacity: ease(f, baal + 10, baal + 20) }}>YEH HAI ASLI AD COPY</div>
      <Sfx at={rev - 6} name="pop" vol={0.4} />
      <Sfx at={baal - 2} name="ding" vol={0.4} />
    </SceneShell>
  );
};

/* s4 · customers search their problem, not your words */
export const S4Search: React.FC<SP> = ({ dur }) => {
  const f = useCurrentFrame();
  const shabd = cue("s4", "shabd");
  const apni = cue("s4", "apni");
  const a = "premium quality serum";
  const b = "baal girna kaise roke";
  return (
    <SceneShell dur={dur}>
      <FigLabel n={3} text="CUSTOMER KYA SEARCH KARTA HAI?" />
      <div style={{ position: "absolute", left: 84, top: 420, opacity: ease(f, shabd - 10, shabd - 2) }}>
        <div style={{ ...label(26, BP.dim), marginBottom: 14 }}>AAPKE SHABD</div>
        <Search text={a} n={(f - (shabd - 10)) * 1.4} color={BP.dim} mark={f > shabd + 20 ? "x" : null} />
      </div>
      <div style={{ position: "absolute", left: 84, top: 720, opacity: ease(f, apni - 8, apni) }}>
        <div style={{ ...label(26, BP.dim), marginBottom: 14 }}>CUSTOMER KE SHABD</div>
        <Search text={b} n={(f - (apni - 4)) * 1.2} mark={f > apni + 30 ? "ok" : null} />
      </div>
      <Stamp text="APNI PROBLEM" at={apni + 18} color={BP.green} size={70} rot={-6} style={{ left: 540, top: 1080 }} />
      <Sfx at={shabd - 8} name="key" vol={0.3} />
      <Sfx at={apni - 4} name="key" vol={0.3} />
      <Sfx at={apni + 18} name="stamp" vol={0.4} />
    </SceneShell>
  );
};

/* s5 · fixes */
export const S5Fixes: React.FC<SP> = ({ dur }) => (
  <SceneShell dur={dur}>
    <FigLabel n={4} text="CUSTOMER KE SHABD USE KARO" />
    <div style={{ position: "absolute", left: 84, top: 390, display: "flex", flexDirection: "column", gap: 30 }}>
      <FixCard n={1} at={cue("s5", "reviews") - 8} title={<>Reviews aur DMs se <Hl>exact lines</Hl> copy</>} sub="unke shabd, unki bhasha" />
      <FixCard n={2} at={cue("s5", "pehli") - 10} title={<>Ad ki pehli line mein <Hl c={BP.green}>result</Hl></>} sub="'3 hafte mein baal girna kam'" />
      <FixCard n={3} at={cue("s5", "wahi") - 10} title={<>Wahi shabd <Hl>product page</Hl> pe bhi</>} sub="ad aur page ek jaisa bole" />
    </div>
    <Sfx at={cue("s5", "reviews") - 8} name="pop" vol={0.5} />
    <Sfx at={cue("s5", "pehli") - 10} name="pop" vol={0.5} />
    <Sfx at={cue("s5", "wahi") - 10} name="pop" vol={0.5} />
  </SceneShell>
);

const SheetIcon: React.FC = () => (
  <svg width={86} height={100} viewBox="0 0 86 100">
    <rect x={3} y={3} width={80} height={94} rx={12} fill={C.violet} stroke={C.navy} strokeWidth={5} />
    <path d="M16 22 H70 M16 38 H70 M16 54 H70 M16 70 H52" stroke={C.white} strokeWidth={6} strokeLinecap="round" />
    <path d="M56 66 L62 74 L74 58" stroke="#2BD46B" strokeWidth={6} fill="none" strokeLinecap="round" />
  </svg>
);

/* s6 · CTA */
export const S6Cta: React.FC<SP> = ({ dur }) => (
  <SceneShell dur={dur} noExit>
    <HisaabCta
      keyword="WORDS"
      typeAt={cue("s6", "words") - 8}
      giftAt={cue("s6", "sheet") - 8}
      giftTitle="Review se Ad Sheet"
      giftSub="free · review ki line → ad ki line"
      giftIcon={<SheetIcon />}
      nextAt={cue("s6", "aaj")}
      nextLabel="AAJ SHAAM 7 BAJE · AGLA CASE"
      next={
        <>
          <div style={big(54, C.navy)}>Competitor ke saare ads,</div>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{ ...big(60, C.white), background: C.violet, borderRadius: 16, padding: "8px 20px 0" }}>free mein</div>
            <div style={big(54, C.navy)}>kaise dekhein?</div>
          </div>
        </>
      }
      followAt={cue("s6", "follow")}
    />
  </SceneShell>
);
