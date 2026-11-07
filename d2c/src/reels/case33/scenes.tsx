import React from "react";
import { useCurrentFrame } from "remotion";
import { BP, FigLabel, FixCard, HisaabCta, Hl, big, ease, glass, label } from "../../components/hisaab";
import { PhoneShell, Pill, SerumBottle } from "../../components/hisaabArt";
import { SceneShell, Sfx } from "../../components/kit";
import { C } from "../../theme";
import { cue } from "./timeline";

type SP = { dur: number };

const META = "#4F7BFF";
const GOOG = "#2BD46B";

/** Platform tile. */
export const Tile: React.FC<{ name: string; color: string; w?: number; sub?: string; p?: number }> = ({ name, color, w = 360, sub, p = 1 }) => (
  <div style={{ width: w, ...glass, borderRadius: 30, border: `3px solid ${color}`, padding: "26px 20px 20px", boxSizing: "border-box", textAlign: "center", opacity: p, transform: `scale(${0.9 + 0.1 * p})`, boxShadow: `0 0 50px ${color}33` }}>
    <div style={big(w * 0.2, color)}>{name}</div>
    {sub && <div style={{ ...label(w * 0.07, BP.dim), marginTop: 10 }}>{sub}</div>}
  </div>
);

/** Coin stack labelled ₹10,000. */
const Stack: React.FC<{ s?: number }> = ({ s = 1 }) => (
  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", transform: `scale(${s})` }}>
    {Array.from({ length: 6 }).map((_, i) => (
      <div key={i} style={{ width: 170, height: 34, borderRadius: "50%", background: "linear-gradient(180deg,#FFD978,#E0A93A)", border: "3px solid #8E6420", marginTop: i ? -18 : 0 }} />
    ))}
    <div style={{ ...big(76, "#FFD978"), marginTop: 16 }}>₹10,000</div>
  </div>
);

/** Typed search bar. */
const Search: React.FC<{ text: string; n: number; w?: number }> = ({ text, n, w = 912 }) => {
  const f = useCurrentFrame();
  const shown = text.slice(0, Math.max(0, Math.min(text.length, Math.floor(n))));
  return (
    <div style={{ width: w, ...glass, borderRadius: 999, padding: "22px 34px 16px", display: "flex", alignItems: "center", gap: 20, boxSizing: "border-box" }}>
      <svg width={44} height={44} viewBox="0 0 24 24">
        <circle cx={10} cy={10} r={6.5} stroke={BP.dim} strokeWidth={2.5} fill="none" />
        <line x1={15} y1={15} x2={21} y2={21} stroke={BP.dim} strokeWidth={2.5} strokeLinecap="round" />
      </svg>
      <div style={big(50)}>
        {shown}
        <span style={{ opacity: Math.floor(f / 8) % 2 === 0 ? 1 : 0, color: C.lavender }}>|</span>
      </div>
    </div>
  );
};

/** One search result row. */
const Result: React.FC<{ ad?: boolean; title: string; url: string; p?: number; hl?: boolean }> = ({ ad = false, title, url, p = 1, hl = false }) => (
  <div style={{ ...glass, borderRadius: 22, padding: "20px 28px 16px", border: `3px solid ${hl ? GOOG : BP.lineSoft}`, opacity: p, transform: `translateY(${(1 - p) * 30}px)` }}>
    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
      {ad && <div style={{ ...label(22, C.navy), background: "#FFD978", borderRadius: 8, padding: "4px 10px 1px" }}>AD</div>}
      <div style={label(24, BP.dim)}>{url}</div>
    </div>
    <div style={{ ...big(46, hl ? GOOG : BP.text), marginTop: 8 }}>{title}</div>
  </div>
);

/* s1 · hook (on screen from frame 0) */
export const S1Hook: React.FC<SP> = ({ dur }) => {
  const f = useCurrentFrame();
  const meta = cue("s1", "meta");
  const google = cue("s1", "google");
  const galat = cue("s1", "galat");
  return (
    <SceneShell dur={dur}>
      <div style={{ position: "absolute", left: 0, right: 0, top: 330, display: "flex", justifyContent: "center" }}>
        <Stack s={0.9} />
      </div>
      <svg width={1080} height={200} style={{ position: "absolute", left: 0, top: 590 }}>
        <path d="M540 10 Q400 60 270 170" stroke={META} strokeWidth={6} fill="none" strokeDasharray="14 12" opacity={0.5 + 0.5 * ease(f, meta - 6, meta + 2)} />
        <path d="M540 10 Q680 60 810 170" stroke={GOOG} strokeWidth={6} fill="none" strokeDasharray="14 12" opacity={0.5 + 0.5 * ease(f, google - 6, google + 2)} />
      </svg>
      <div style={{ position: "absolute", left: 84, top: 790 }}>
        <Tile name="Meta" color={META} w={400} p={0.6 + 0.4 * ease(f, meta - 6, meta + 2)} />
      </div>
      <div style={{ position: "absolute", right: 84, top: 790 }}>
        <Tile name="Google" color={GOOG} w={400} p={0.6 + 0.4 * ease(f, google - 6, google + 2)} />
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 1070, display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
        <div style={big(74)}>Galat jagah lagaya toh</div>
        <Pill size={96}>aadha bekaar</Pill>
      </div>
      <Sfx at={meta - 4} name="pop" vol={0.35} />
      <Sfx at={google - 4} name="pop" vol={0.35} />
      <Sfx at={galat - 4} name="swish" vol={0.35} />
    </SceneShell>
  );
};

/* s2 · Google: people are already searching */
export const S2Google: React.FC<SP> = ({ dur }) => {
  const f = useCurrentFrame();
  const dh = cue("s2", "dhoondh");
  const baal = cue("s2", "baal");
  const q = "baal girne ka serum";
  return (
    <SceneShell dur={dur}>
      <FigLabel n={1} text="GOOGLE · LOG DHOONDH RAHE HAIN" />
      <div style={{ position: "absolute", left: 84, top: 400, opacity: ease(f, 0, 10) }}>
        <Search text={q} n={(f - (baal - 6)) * 1.3} />
      </div>
      <div style={{ position: "absolute", left: 84, right: 84, top: 560, display: "flex", flexDirection: "column", gap: 20 }}>
        <Result ad title="Hair fall serum · Rohit's Skin" url="rohitskin.in" p={ease(f, baal + 14, baal + 24)} hl />
        <Result title="Baal girna kaise roke · 7 tips" url="blog.example.com" p={ease(f, baal + 18, baal + 28)} />
        <Result title="Best hair serum 2026" url="shop.example.com" p={ease(f, baal + 22, baal + 32)} />
      </div>
      <div style={{ position: "absolute", left: 84, top: 1150, ...label(30, GOOG), opacity: ease(f, dh - 4, dh + 6) }}>ZAROORAT PATA HAI → SEARCH KAR RAHE HAIN</div>
      <Sfx at={baal - 6} name="key" vol={0.3} />
      <Sfx at={baal + 14} name="pop" vol={0.4} />
    </SceneShell>
  );
};

/* s3 · Meta: people are scrolling, they don't know yet */
export const S3Meta: React.FC<SP> = ({ dur }) => {
  const f = useCurrentFrame();
  const scroll = cue("s3", "scroll");
  const pata = cue("s3", "pata");
  const y = -((f * 7) % 340);
  const feed = Array.from({ length: 6 });
  return (
    <SceneShell dur={dur}>
      <FigLabel n={2} text="META · LOG SCROLL KAR RAHE HAIN" />
      <div style={{ position: "absolute", left: 84, top: 390, opacity: ease(f, 0, 10) }}>
        <PhoneShell w={400}>
          <div style={{ position: "absolute", left: 18, right: 18, top: 50 + y, display: "flex", flexDirection: "column", gap: 20 }}>
            {feed.map((_, i) => (
              <div key={i} style={{ height: 320, borderRadius: 22, background: i % 3 === 1 ? "#2A1C55" : "rgba(223,200,253,0.10)", border: `2px solid ${i % 3 === 1 ? META : BP.lineSoft}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                {i % 3 === 1 ? <SerumBottle h={220} /> : <div style={label(20, BP.dim)}>{["REEL", "MEME", "DOST KI PHOTO", "REEL", "NEWS", "MEME"][i]}</div>}
              </div>
            ))}
          </div>
        </PhoneShell>
      </div>
      <div style={{ position: "absolute", left: 560, top: 470, display: "flex", flexDirection: "column", gap: 34 }}>
        <div style={{ opacity: ease(f, scroll - 6, scroll + 2) }}>
          <div style={label(28, BP.dim)}>KAR KYA RAHE HAIN</div>
          <div style={big(72, META)}>Scroll</div>
        </div>
        <div style={{ opacity: ease(f, pata - 6, pata + 2) }}>
          <div style={label(28, BP.dim)}>ZAROORAT PATA HAI?</div>
          <div style={big(72, BP.red)}>Abhi nahi</div>
        </div>
      </div>
      <Sfx at={scroll - 4} name="swish" vol={0.35} />
      <Sfx at={pata - 4} name="pop" vol={0.35} />
    </SceneShell>
  );
};

/* s4 · the real question */
export const S4Question: React.FC<SP> = ({ dur }) => {
  const f = useCurrentFrame();
  const sawaal2 = cue("s4", "sawaal", 2);
  const dh = cue("s4", "dhoondhte");
  return (
    <SceneShell dur={dur}>
      <FigLabel n={3} text="ASLI SAWAAL" />
      <div style={{ position: "absolute", left: 84, top: 420, ...label(30, BP.dim), opacity: ease(f, 0, 10) }}>KAUN BETTER HAI? ✕</div>
      <div style={{ position: "absolute", left: 84, right: 84, top: 500, ...glass, borderRadius: 30, padding: "30px 36px 24px", opacity: ease(f, sawaal2 - 8, sawaal2 + 2) }}>
        <div style={{ fontFamily: big(10).fontFamily, fontWeight: 700, fontSize: 66, lineHeight: 1.12, color: BP.text }}>
          Log aapka product <Hl>dhoondhte</Hl> hain?
        </div>
      </div>
      <div style={{ position: "absolute", left: 84, right: 84, top: 800, display: "flex", justifyContent: "space-between" }}>
        <div style={{ opacity: ease(f, dh + 6, dh + 16) }}>
          <div style={{ ...label(30, BP.dim), marginBottom: 14 }}>HAAN →</div>
          <Tile name="Google" color={GOOG} w={420} sub="DHOONDHNE WAALE" />
        </div>
        <div style={{ opacity: ease(f, dh + 14, dh + 24) }}>
          <div style={{ ...label(30, BP.dim), marginBottom: 14 }}>NAHI →</div>
          <Tile name="Meta" color={META} w={420} sub="NAYE LOG" />
        </div>
      </div>
      <Sfx at={sawaal2 - 6} name="pop" vol={0.4} />
      <Sfx at={dh + 6} name="pop" vol={0.35} />
      <Sfx at={dh + 14} name="pop" vol={0.35} />
    </SceneShell>
  );
};

/* s5 · fixes */
export const S5Fixes: React.FC<SP> = ({ dur }) => (
  <SceneShell dur={dur}>
    <FigLabel n={4} text="AISE BAANTO" />
    <div style={{ position: "absolute", left: 84, top: 390, display: "flex", flexDirection: "column", gap: 30 }}>
      <FixCard n={1} at={cue("s5", "search") - 8} title={<>Product type search hota hai? <Hl c={GOOG}>Google</Hl></>} sub="jaise 'hair fall serum'" />
      <FixCard n={2} at={cue("s5", "naya") - 8} title={<>Naya product, nayi problem? <Hl c={META}>Meta</Hl></>} sub="log abhi jaante nahi" />
      <FixCard n={3} at={cue("s5", "brand") - 8} title={<>Brand ke naam pe Google ad <Hl>hamesha</Hl></>} sub="sasta, aur naam bacha rehta hai" />
    </div>
    <Sfx at={cue("s5", "search") - 8} name="pop" vol={0.5} />
    <Sfx at={cue("s5", "naya") - 8} name="pop" vol={0.5} />
    <Sfx at={cue("s5", "brand") - 8} name="pop" vol={0.5} />
  </SceneShell>
);

const SplitIcon: React.FC = () => (
  <svg width={86} height={100} viewBox="0 0 86 100">
    <rect x={3} y={3} width={80} height={94} rx={12} fill={C.violet} stroke={C.navy} strokeWidth={5} />
    <path d="M43 80 V52 M43 52 L22 26 M43 52 L64 26" stroke={C.white} strokeWidth={7} fill="none" strokeLinecap="round" />
    <circle cx={22} cy={22} r={8} fill={META} />
    <circle cx={64} cy={22} r={8} fill={GOOG} />
  </svg>
);

/* s6 · CTA */
export const S6Cta: React.FC<SP> = ({ dur }) => (
  <SceneShell dur={dur} noExit>
    <HisaabCta
      keyword="GOOGLE"
      typeAt={cue("s6", "google") - 8}
      giftAt={cue("s6", "checklist") - 8}
      giftTitle="Kahan Lagayein Checklist"
      giftSub="free · Meta ya Google, 5 sawaal"
      giftIcon={<SplitIcon />}
      nextAt={cue("s6", "kal")}
      nextLabel="KAL DOPAHAR 1 BAJE · AGLA CASE"
      next={
        <>
          <div style={big(54, C.navy)}>Aapke naam pe</div>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{ ...big(60, C.white), background: C.red, borderRadius: 16, padding: "8px 20px 0" }}>competitor</div>
            <div style={big(54, C.navy)}>ka ad kyun?</div>
          </div>
        </>
      }
      followAt={cue("s6", "follow")}
    />
  </SceneShell>
);
