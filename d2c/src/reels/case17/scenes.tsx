import React from "react";
import { useCurrentFrame } from "remotion";
import { CheckIcon, CrossIcon } from "../../components/icons";
import { BP, FigLabel, FixCard, HisaabCta, Hl, big, ease, label, useCount } from "../../components/hisaab";
import { Counter, PeopleGrid, PhoneShell, PhotoCard, Pill, Stamp } from "../../components/hisaabArt";
import { SceneShell, Sfx } from "../../components/kit";
import { C } from "../../theme";
import { cue } from "./timeline";

type SP = { dur: number };

const Tag: React.FC<{ ok: boolean; text: string; p: number }> = ({ ok, text, p }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 12, opacity: p, transform: `scale(${0.7 + 0.3 * p})`, border: `3px solid ${ok ? BP.green : BP.red}`, background: ok ? "rgba(43,212,107,0.12)" : "rgba(255,90,95,0.12)", borderRadius: 999, padding: "8px 22px 6px 10px" }}>
    {ok ? <CheckIcon size={40} /> : <CrossIcon size={40} />}
    <div style={label(28, BP.text)}>{text}</div>
  </div>
);

/* s1 · hook: photo shows the product, not the benefit (on screen from frame 0) */
export const S1Hook: React.FC<SP> = ({ dur }) => {
  const f = useCurrentFrame();
  const fayda = cue("s1", "fayda");
  return (
    <SceneShell dur={dur}>
      <div style={{ position: "absolute", left: 0, right: 0, top: 300, display: "flex", justifyContent: "center", transform: `scale(${1.03 - 0.03 * ease(f, 0, 12)})` }}>
        <PhotoCard kind="plain" w={430} title="PRODUCT PHOTO" />
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 860, display: "flex", justifyContent: "center", gap: 18 }}>
        <Tag ok text="PRODUCT" p={1} />
        <Tag ok={false} text="FAYDA" p={ease(f, fayda - 4, fayda + 6)} />
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 980, display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
        <div style={big(80)}>Photo mein product hai,</div>
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <Pill size={88}>FAYDA</Pill>
          <div style={big(80)}>kahan?</div>
        </div>
      </div>
      <Sfx at={fayda - 3} name="error" vol={0.45} />
    </SceneShell>
  );
};

/* s2 · plain photo in the feed → Priya scrolls past */
export const S2Plain: React.FC<SP> = ({ dur }) => {
  const f = useCurrentFrame();
  const wb = cue("s2", "white background");
  const scroll = cue("s2", "scroll");
  const up = ease(f, scroll, scroll + 12, "in");
  return (
    <SceneShell dur={dur}>
      <FigLabel n={1} text="PLAIN PHOTO" />
      <div style={{ position: "absolute", left: 84, top: 370 }}>
        <PhoneShell w={430}>
          <div style={{ position: "absolute", left: 0, right: 0, top: 70 - up * 760, display: "flex", flexDirection: "column", alignItems: "center", gap: 24, filter: up > 0 && up < 1 ? `blur(${6 * Math.sin(Math.PI * up)}px)` : undefined }}>
            <PhotoCard kind="plain" w={360} />
            <div style={{ width: 360, height: 300, borderRadius: 24, background: "rgba(223,200,253,0.08)" }} />
            <div style={{ width: 360, height: 300, borderRadius: 24, background: "rgba(223,200,253,0.08)" }} />
          </div>
        </PhoneShell>
      </div>
      <div style={{ position: "absolute", left: 590, top: 470, display: "flex", flexDirection: "column", gap: 26 }}>
        <div style={{ opacity: ease(f, wb - 4, wb + 8) }}>
          <div style={label(24, BP.dim)}>BACKGROUND</div>
          <div style={big(58)}>White</div>
        </div>
        <div style={{ opacity: ease(f, wb + 20, wb + 32) }}>
          <div style={label(24, BP.dim)}>SAAMAN</div>
          <div style={big(58)}>1 bottle</div>
        </div>
        <div style={{ opacity: ease(f, scroll - 2, scroll + 8), marginTop: 30 }}>
          <div style={label(24, BP.red)}>PRIYA</div>
          <div style={big(70, BP.red)}>SCROLL ↑</div>
        </div>
      </div>
      <Sfx at={scroll - 2} name="whoosh" vol={0.5} />
    </SceneShell>
  );
};

/* s3 · same serum in hand with glowing skin → she stops */
export const S3Hand: React.FC<SP> = ({ dur }) => {
  const f = useCurrentFrame();
  const haath = cue("s3", "haath");
  const ruk = cue("s3", "ruk");
  const inP = ease(f, 0, 14);
  return (
    <SceneShell dur={dur}>
      <FigLabel n={2} text="HAATH MEIN PHOTO" />
      <div style={{ position: "absolute", left: 84, top: 370 }}>
        <PhoneShell w={430}>
          <div style={{ position: "absolute", left: 0, right: 0, top: 70 + (1 - inP) * 500, display: "flex", justifyContent: "center" }}>
            <PhotoCard kind="hand" w={360} />
          </div>
        </PhoneShell>
      </div>
      <div style={{ position: "absolute", left: 590, top: 470, display: "flex", flexDirection: "column", gap: 26 }}>
        <div style={{ opacity: ease(f, haath - 4, haath + 8) }}>
          <div style={label(24, BP.dim)}>KAHAN</div>
          <div style={big(58)}>Priya ke haath</div>
        </div>
        <div style={{ opacity: ease(f, haath + 26, haath + 38) }}>
          <div style={label(24, BP.dim)}>DIKHTA HAI</div>
          <div style={big(58, BP.green)}>Chamakti skin</div>
        </div>
      </div>
      <div style={{ position: "absolute", left: 300, top: 1000 }}>
        <Stamp text="RUKI ✓" at={ruk - 3} color={BP.green} size={100} rot={-6} />
      </div>
      <Sfx at={ruk - 4} name="stamp" vol={0.6} />
    </SceneShell>
  );
};

/* s4 · bottle ✗ result ✓ → 100 viewers: 2 clicks vs 5 clicks */
export const S4Clicks: React.FC<SP> = ({ dur }) => {
  const f = useCurrentFrame();
  const bottle = cue("s4", "bottle");
  const result = cue("s4", "result");
  const sau = cue("s4", "sau");
  const plain = cue("s4", "plain");
  const haath = cue("s4", "haath");
  const left = useCount(2, plain + 4, cue("s4", "do") + 4);
  const right = useCount(5, haath + 4, cue("s4", "paanch") + 2);
  return (
    <SceneShell dur={dur}>
      <FigLabel n={3} text="100 LOG, KITNE CLICK?" />
      <div style={{ position: "absolute", left: 0, right: 0, top: 360, display: "flex", justifyContent: "center", alignItems: "center", gap: 26 }}>
        <div style={{ position: "relative", opacity: ease(f, bottle - 4, bottle + 6) }}>
          <div style={big(64, BP.dim)}>BOTTLE</div>
          <div style={{ position: "absolute", left: -8, right: -8, top: "48%", height: 6, background: BP.red, borderRadius: 3, transform: `scaleX(${ease(f, bottle + 8, bottle + 16)})`, transformOrigin: "left" }} />
        </div>
        <div style={{ ...big(56, BP.dim), opacity: ease(f, result - 6, result) }}>→</div>
        <div style={{ opacity: ease(f, result - 4, result + 6), transform: `scale(${0.8 + 0.2 * ease(f, result - 4, result + 6)})` }}>
          <Hl c={BP.green}>
            <span style={big(64, C.navy)}>RESULT</span>
          </Hl>
        </div>
      </div>
      {[0, 1].map((k) => (
        <div key={k} style={{ position: "absolute", left: k === 0 ? 84 : 624, top: 520, display: "flex", flexDirection: "column", alignItems: "center", gap: 18, opacity: ease(f, sau - 6 + k * 4, sau + 6 + k * 4) }}>
          <div style={label(26, k ? BP.green : BP.dim)}>{k ? "HAATH WALI PHOTO" : "PLAIN PHOTO"}</div>
          <PeopleGrid s={30} gap={8} lit={k ? 5 : 2} litAt={k ? haath + 4 : plain + 4} inAt={sau - 6 + k * 4} />
          <Counter name="CLICK" value={String(Math.round(k ? right : left))} color={k ? BP.green : BP.text} size={110} align="center" p={ease(f, (k ? haath : plain) - 2, (k ? haath : plain) + 8)} />
        </div>
      ))}
      <Sfx at={plain + 4} name="tick" vol={0.35} />
      <Sfx at={haath + 4} name="tick" vol={0.35} />
      <Sfx at={haath + 24} name="ding" vol={0.4} />
    </SceneShell>
  );
};

/* s5 · three photos to keep */
export const S5Fixes: React.FC<SP> = ({ dur }) => (
  <SceneShell dur={dur}>
    <FigLabel n={4} text="YEH 3 PHOTO ZAROOR" />
    <div style={{ position: "absolute", left: 84, top: 390, display: "flex", flexDirection: "column", gap: 30 }}>
      <FixCard n={1} at={cue("s5", "use") - 8} title={<><Hl>Use</Hl> karte hue</>} sub="haath mein, chehre pe, routine mein" />
      <FixCard n={2} at={cue("s5", "pehle") - 8} title={<><Hl>Pehle aur baad</Hl> ka fark</>} sub="same light, same angle" />
      <FixCard n={3} at={cue("s5", "haath", 1) - 8} title={<>Haath mein, taaki <Hl c={BP.green}>size</Hl> dikhe</>} sub="bottle kitni badi hai, ek nazar mein" />
    </div>
    <Sfx at={cue("s5", "use") - 8} name="pop" vol={0.5} />
    <Sfx at={cue("s5", "pehle") - 8} name="pop" vol={0.5} />
    <Sfx at={cue("s5", "haath", 1) - 8} name="pop" vol={0.5} />
  </SceneShell>
);

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

/* s6 · CTA */
export const S6Cta: React.FC<SP> = ({ dur }) => (
  <SceneShell dur={dur} noExit>
    <HisaabCta
      keyword="PHOTO"
      typeAt={cue("s6", "photo") - 8}
      giftAt={cue("s6", "das") - 6}
      giftTitle="10 Photo Ideas ki List"
      giftSub="free · phone se shoot ho jaayein"
      giftIcon={<ListIcon />}
      nextAt={cue("s6", "kal")}
      nextLabel="KAL DOPAHAR 1 BAJE · AGLA CASE"
      next={
        <>
          <div style={big(52, C.navy)}>Log brand se nahi,</div>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{ ...big(60, C.white), background: C.violet, borderRadius: 16, padding: "8px 20px 0" }}>INSAAN</div>
            <div style={big(52, C.navy)}>se kyun khareedte?</div>
          </div>
        </>
      }
      followAt={cue("s6", "follow")}
    />
  </SceneShell>
);
