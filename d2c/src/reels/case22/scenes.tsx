import React from "react";
import { useCurrentFrame } from "remotion";
import { BP, FigLabel, FixCard, HisaabCta, Hl, big, ease, glass, label, useCount } from "../../components/hisaab";
import { Pill, SerumBottle, Stamp } from "../../components/hisaabArt";
import { SceneShell, Sfx, inr } from "../../components/kit";
import { C } from "../../theme";
import { cue } from "./timeline";

type SP = { dur: number };

/** Small foil sachet ("try me"). */
export const Sachet: React.FC<{ w?: number; rot?: number }> = ({ w = 160, rot = -8 }) => (
  <div style={{ width: w, height: w * 1.25, borderRadius: w * 0.08, background: "linear-gradient(160deg,#F7EBD9,#E3C9A4)", border: `3px solid ${C.lavender}`, transform: `rotate(${rot}deg)`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: w * 0.04, boxShadow: "0 20px 40px -20px rgba(0,0,0,0.7)", position: "relative" }}>
    <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: w * 0.1, background: "repeating-linear-gradient(90deg,#CDB08A 0 6px,transparent 6px 12px)" }} />
    <div style={{ width: w * 0.36, height: w * 0.36, borderRadius: "50%", background: "#C9781F" }} />
    <div style={label(w * 0.1, C.navy)}>NAYA SERUM</div>
    <div style={label(w * 0.085, C.violet)}>TRY ME</div>
  </div>
);

/** Face-wash tube. */
const Tube: React.FC<{ h?: number }> = ({ h = 280 }) => (
  <svg width={h * 0.4} height={h} viewBox="0 0 80 200">
    <rect x={22} y={170} width={36} height={28} rx={6} fill={C.violetDeep} />
    <path d="M8 10 H72 L60 172 H20 Z" fill="#EAF6FF" stroke={C.lavender} strokeWidth={3} />
    <rect x={8} y={4} width={64} height={10} rx={3} fill="#C9D6E6" />
    <text x={40} y={90} textAnchor="middle" fontFamily="Inter" fontWeight={900} fontSize={11} fill={C.navy}>FACE</text>
    <text x={40} y={104} textAnchor="middle" fontFamily="Inter" fontWeight={900} fontSize={11} fill={C.navy}>WASH</text>
  </svg>
);

/** Open parcel box with optional items. */
const Box: React.FC<{ w?: number; children?: React.ReactNode }> = ({ w = 520, children }) => (
  <div style={{ position: "relative", width: w, height: w * 0.62 }}>
    <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: w * 0.42, background: "#C79A62", borderRadius: 12, border: `4px solid #8E6A3E` }} />
    <div style={{ position: "absolute", left: -w * 0.06, bottom: w * 0.38, width: w * 0.5, height: w * 0.1, background: "#B58750", transform: "rotate(-14deg)", borderRadius: 8 }} />
    <div style={{ position: "absolute", right: -w * 0.06, bottom: w * 0.38, width: w * 0.5, height: w * 0.1, background: "#B58750", transform: "rotate(14deg)", borderRadius: 8 }} />
    <div style={{ position: "absolute", left: 0, right: 0, bottom: w * 0.2, display: "flex", justifyContent: "center", alignItems: "flex-end", gap: w * 0.06 }}>{children}</div>
  </div>
);

/** Little parcel glyph for the 100-parcel grid. */
const MiniParcel: React.FC<{ s?: number; color?: string }> = ({ s = 44, color = "rgba(223,200,253,0.32)" }) => (
  <svg width={s} height={s} viewBox="0 0 40 40">
    <rect x={4} y={10} width={32} height={26} rx={4} fill={color} />
    <rect x={18} y={10} width={4} height={26} fill="rgba(13,2,56,0.35)" />
    <path d="M4 14 L12 4 H28 L36 14 Z" fill={color} opacity={0.8} />
  </svg>
);

/* s1 · hook (on screen from frame 0) */
export const S1Hook: React.FC<SP> = ({ dur }) => {
  const f = useCurrentFrame();
  const order = cue("s1", "order");
  return (
    <SceneShell dur={dur}>
      <div style={{ position: "absolute", left: 0, right: 0, top: 360, display: "flex", justifyContent: "center", alignItems: "center", gap: 50 }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
          <Sachet w={190} />
          <div style={big(110)}>₹5</div>
        </div>
        <div style={{ ...big(110, BP.dim), opacity: 0.4 + 0.6 * ease(f, order - 10, order) }}>→</div>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16, opacity: 0.35 + 0.65 * ease(f, order - 8, order + 4) }}>
          <SerumBottle h={240} />
          <div style={big(110, BP.green)}>₹500</div>
        </div>
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 960, display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
        <div style={big(78)}>₹5 ka sample,</div>
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <Pill size={84} bg={BP.green} color={C.navy}>₹500</Pill>
          <div style={big(78)}>ka agla order</div>
        </div>
      </div>
      <Sfx at={order - 6} name="ding" vol={0.4} />
    </SceneShell>
  );
};

/* s2 · Priya's face-wash parcel had a sachet too */
export const S2Parcel: React.FC<SP> = ({ dur }) => {
  const f = useCurrentFrame();
  const fw = cue("s2", "face wash");
  const sachet = cue("s2", "sachet");
  const pop = ease(f, sachet - 8, sachet + 6);
  return (
    <SceneShell dur={dur}>
      <FigLabel n={1} text="PRIYA KA PARCEL" />
      <div style={{ position: "absolute", left: 0, right: 0, top: 520, display: "flex", justifyContent: "center", opacity: ease(f, 0, 12) }}>
        <Box w={600}>
          <div style={{ opacity: ease(f, fw - 6, fw + 4), transform: `translateY(${(1 - ease(f, fw - 6, fw + 4)) * 60}px)` }}>
            <Tube h={300} />
          </div>
          <div style={{ opacity: pop, transform: `translateY(${(1 - pop) * 80}px) scale(${0.7 + 0.3 * pop})` }}>
            <Sachet w={150} rot={10} />
          </div>
        </Box>
      </div>
      <div style={{ position: "absolute", left: 84, top: 400, display: "flex", gap: 16 }}>
        <div style={{ ...glass, borderRadius: 16, padding: "10px 18px 6px", ...label(26, BP.text), opacity: ease(f, fw - 6, fw + 4) }}>ORDER · FACE WASH</div>
        <div style={{ ...glass, borderRadius: 16, padding: "10px 18px 6px", ...label(26, BP.green), border: `2.5px solid ${BP.green}`, opacity: pop }}>+ FREE SACHET</div>
      </div>
      <Sfx at={fw - 6} name="whoosh" vol={0.35} />
      <Sfx at={sachet - 8} name="pop" vol={0.45} />
    </SceneShell>
  );
};

/* s3 · try → a month later → ₹500 bottle */
export const S3Month: React.FC<SP> = ({ dur }) => {
  const f = useCurrentFrame();
  const tr = cue("s3", "try");
  const mah = cue("s3", "mahine");
  const sau = cue("s3", "paanch sau");
  const line = ease(f, mah - 4, mah + 30, "inOut");
  return (
    <SceneShell dur={dur}>
      <FigLabel n={2} text="EK MAHINE BAAD" />
      <div style={{ position: "absolute", left: 120, right: 120, top: 760, height: 6, background: BP.lineSoft, borderRadius: 3 }}>
        <div style={{ width: `${line * 100}%`, height: "100%", background: BP.green, borderRadius: 3 }} />
      </div>
      <div style={{ position: "absolute", left: 80, top: 420, display: "flex", flexDirection: "column", alignItems: "center", gap: 18, opacity: ease(f, tr - 8, tr + 2) }}>
        <Sachet w={170} rot={-6} />
        <div style={label(26, BP.dim)}>DIN 1 · TRY KIYA</div>
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 790, display: "flex", justifyContent: "center", ...label(28, BP.dim), opacity: line }}>+ 30 DIN</div>
      <div style={{ position: "absolute", right: 80, top: 380, display: "flex", flexDirection: "column", alignItems: "center", gap: 10, opacity: ease(f, sau - 14, sau - 2) }}>
        <SerumBottle h={300} />
        <div style={label(26, BP.dim)}>POORI BOTTLE · ORDER</div>
        <div style={big(110, BP.green)}>₹500</div>
      </div>
      <Sfx at={tr - 6} name="pop" vol={0.4} />
      <Sfx at={sau - 6} name="ding" vol={0.45} />
    </SceneShell>
  );
};

/* s4 · 100 parcels × ₹5 = ₹500 cost → 5 buyers × ₹500 = ₹2,500 */
export const S4Math: React.FC<SP> = ({ dur }) => {
  const f = useCurrentFrame();
  const sau = cue("s4", "sau");
  const kharcha = cue("s4", "kharcha");
  const five = cue("s4", "paanch");
  const sale = cue("s4", "do hazaar paanch sau");
  const cost = useCount(500, kharcha - 2, kharcha + 14);
  const rev = useCount(2500, sale - 6, sale + 12);
  const lit = [12, 37, 55, 71, 94];
  return (
    <SceneShell dur={dur}>
      <FigLabel n={3} text="MAAN LO · 100 PARCEL" />
      <div style={{ position: "absolute", left: 84, top: 380, display: "grid", gridTemplateColumns: "repeat(10, 64px)", gap: 8 }}>
        {Array.from({ length: 100 }).map((_, i) => {
          const p = ease(f, sau - 4 + i * 0.25, sau + 2 + i * 0.25);
          const k = lit.indexOf(i);
          const on = k >= 0 && f >= five + k * 5;
          return (
            <div key={i} style={{ opacity: p, transform: `scale(${(0.6 + 0.4 * p) * (on ? 1.15 : 1)})`, filter: on ? `drop-shadow(0 0 10px ${BP.green})` : undefined }}>
              <MiniParcel s={64} color={on ? BP.green : undefined} />
            </div>
          );
        })}
      </div>
      <div style={{ position: "absolute", left: 84, right: 84, top: 1130, display: "flex", justifyContent: "space-between" }}>
        <div style={{ opacity: ease(f, kharcha - 6, kharcha + 2) }}>
          <div style={label(26, BP.dim)}>100 × ₹5 · KHARCHA</div>
          <div style={big(100, BP.red)}>₹{inr(cost)}</div>
        </div>
        <div style={{ textAlign: "right", opacity: ease(f, sale - 10, sale - 2) }}>
          <div style={label(26, BP.dim)}>5 × ₹500 · SALE</div>
          <div style={big(100, BP.green)}>₹{inr(rev)}</div>
        </div>
      </div>
      <Sfx at={kharcha - 2} name="tick" vol={0.35} />
      {lit.map((_, k) => (
        <Sfx key={k} at={five + k * 5} name="pop" vol={0.3} />
      ))}
      <Sfx at={sale} name="ding" vol={0.45} />
    </SceneShell>
  );
};

/* s5 · fixes */
export const S5Fixes: React.FC<SP> = ({ dur }) => (
  <SceneShell dur={dur}>
    <FigLabel n={4} text="SAMPLE AISE DO" />
    <div style={{ position: "absolute", left: 84, top: 390, display: "flex", flexDirection: "column", gap: 30 }}>
      <FixCard n={1} at={cue("s5", "sample") - 8} title={<>Woh do jo customer ne <Hl>nahi khareeda</Hl></>} sub="face wash ke saath serum" />
      <FixCard n={2} at={cue("s5", "sachet") - 10} title={<>Sachet pe <Hl>QR ya link</Hl></>} sub="seedha product page pe" />
      <FixCard n={3} at={cue("s5", "saat") - 10} title={<>7 din baad <Hl c={BP.green}>WhatsApp</Hl>: kaisa laga?</>} sub="jawab aaye toh offer bhejo" />
    </div>
    <Sfx at={cue("s5", "sample") - 8} name="pop" vol={0.5} />
    <Sfx at={cue("s5", "sachet") - 10} name="pop" vol={0.5} />
    <Sfx at={cue("s5", "saat") - 10} name="pop" vol={0.5} />
  </SceneShell>
);

const PlanIcon: React.FC = () => (
  <svg width={86} height={100} viewBox="0 0 86 100">
    <rect x={3} y={3} width={80} height={94} rx={12} fill={C.violet} stroke={C.navy} strokeWidth={5} />
    <rect x={16} y={16} width={30} height={38} rx={4} fill="#E3C9A4" />
    <circle cx={31} cy={34} r={8} fill="#C9781F" />
    {[0, 1, 2].map((r) => (
      <rect key={r} x={16} y={62 + r * 9} width={54 - r * 10} height={5} rx={2} fill={C.white} />
    ))}
  </svg>
);

/* s6 · CTA */
export const S6Cta: React.FC<SP> = ({ dur }) => (
  <SceneShell dur={dur} noExit>
    <HisaabCta
      keyword="SAMPLE"
      typeAt={cue("s6", "sample") - 8}
      giftAt={cue("s6", "plan") - 8}
      giftTitle="Sample Plan"
      giftSub="free · kya, kisko, kab bhejein"
      giftIcon={<PlanIcon />}
      nextAt={cue("s6", "aaj")}
      nextLabel="AAJ SHAAM 7 BAJE · AGLA CASE"
      next={
        <>
          <div style={big(54, C.navy)}>₹0 ad budget mein</div>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div style={big(54, C.navy)}>pehle</div>
            <div style={{ ...big(60, C.white), background: C.violet, borderRadius: 16, padding: "8px 20px 0" }}>100 order</div>
            <div style={big(54, C.navy)}>kaise?</div>
          </div>
        </>
      }
      followAt={cue("s6", "follow")}
    />
  </SceneShell>
);
