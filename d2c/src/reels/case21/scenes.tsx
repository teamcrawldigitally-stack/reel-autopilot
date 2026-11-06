import React from "react";
import { useCurrentFrame } from "remotion";
import { BP, FigLabel, FixCard, HisaabCta, Hl, big, ease, glass, label, useCount } from "../../components/hisaab";
import { Pill, Stamp } from "../../components/hisaabArt";
import { SceneShell, Sfx, inr } from "../../components/kit";
import { C } from "../../theme";
import { cue } from "./timeline";

type SP = { dur: number };

const APPS: [string, string, string, boolean][] = [
  ["★", "Review app", "#6D4AFD", false],
  ["◱", "Popup app", "#8E6BFF", true],
  ["✎", "Design tool", "#3618B4", false],
  ["✉", "Email app", "#5B3BE0", true],
  ["⌁", "Chat widget", "#7C5CF0", false],
  ["▤", "Upsell app", "#4B2FD0", true],
  ["◎", "Analytics", "#A98DFF", false],
];

/** App icon tile; `dead` greys it out with a red "0 BAAR" badge. */
export const AppTile: React.FC<{ i: number; s?: number; dead?: number }> = ({ i, s = 120, dead = 0 }) => {
  const [g, , col] = APPS[i];
  return (
    <div style={{ position: "relative", width: s, height: s, borderRadius: s * 0.24, background: col, display: "flex", alignItems: "center", justifyContent: "center", ...big(s * 0.5, C.white), filter: dead ? `grayscale(${dead}) brightness(${1 - 0.45 * dead})` : undefined, boxShadow: "0 18px 30px -16px rgba(0,0,0,0.7)" }}>
      {g}
      {dead > 0.5 && <div style={{ position: "absolute", right: -14, top: -14, ...label(s * 0.15, C.white), letterSpacing: "0.04em", background: BP.red, borderRadius: 10, padding: "6px 8px 4px" }}>0 BAAR</div>}
    </div>
  );
};

/* s1 · hook (on screen from frame 0) */
export const S1Hook: React.FC<SP> = ({ dur }) => {
  const f = useCurrentFrame();
  const khol = cue("s1", "kholte");
  return (
    <SceneShell dur={dur}>
      <div style={{ position: "absolute", left: 0, right: 0, top: 340, display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
        <div style={label(30, BP.dim)}>HAR MAHINE</div>
        <div style={{ ...big(200, BP.red), textShadow: "0 0 60px rgba(255,90,95,0.35)" }}>₹5,000</div>
        <div style={{ ...big(76), marginTop: 10 }}>un apps pe jo</div>
        <Pill size={84}>khulte hi nahi?</Pill>
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 860, display: "flex", justifyContent: "center", flexWrap: "wrap", gap: 26, padding: "0 120px" }}>
        {APPS.map((a, i) => (
          <AppTile key={i} i={i} s={130} dead={a[3] ? ease(f, khol - 4 + i, khol + 8 + i) : 0} />
        ))}
      </div>
      <Sfx at={khol - 2} name="error" vol={0.4} />
    </SceneShell>
  );
};

/* s2 · Rohit's card statement */
export const S2Statement: React.FC<SP> = ({ dur }) => {
  const f = useCurrentFrame();
  const rows: [number, number][] = [
    [0, cue("s2", "review")],
    [1, cue("s2", "popup")],
    [2, cue("s2", "design")],
  ];
  const more = cue("s2", "chaar");
  return (
    <SceneShell dur={dur}>
      <FigLabel n={1} text="ROHIT KA CARD STATEMENT" />
      <div style={{ position: "absolute", left: 84, right: 84, top: 380, ...glass, padding: "28px 34px", display: "flex", flexDirection: "column", gap: 20 }}>
        <div style={{ display: "flex", justifyContent: "space-between", ...label(24, BP.dim) }}>
          <span>OCTOBER · SUBSCRIPTIONS</span>
          <span>AMOUNT</span>
        </div>
        {rows.map(([i, at]) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 22, opacity: ease(f, at - 8, at + 2), transform: `translateX(${(1 - ease(f, at - 8, at + 2)) * 50}px)` }}>
            <AppTile i={i} s={84} />
            <div style={big(54)}>{APPS[i][1]}</div>
            <div style={{ marginLeft: "auto", ...big(54, BP.red) }}>−₹700</div>
          </div>
        ))}
        <div style={{ display: "flex", alignItems: "center", gap: 14, opacity: ease(f, more - 8, more + 2) }}>
          {[3, 4, 5, 6].map((i) => (
            <AppTile key={i} i={i} s={70} />
          ))}
          <div style={{ marginLeft: 12, ...big(54) }}>+ 4 aur</div>
          <div style={{ marginLeft: "auto", ...big(54, BP.red) }}>−₹2,800</div>
        </div>
      </div>
      {rows.map(([i, at]) => (
        <Sfx key={i} at={at - 6} name="tick" vol={0.35} />
      ))}
      <Sfx at={more - 6} name="tick" vol={0.35} />
    </SceneShell>
  );
};

/* s3 · 7 × ₹700 = ₹4,900 a month → ₹58,800 a year */
export const S3Math: React.FC<SP> = ({ dur }) => {
  const f = useCurrentFrame();
  const saat = cue("s3", "saat");
  const month = cue("s3", "chaar hazaar nau sau");
  const year = cue("s3", "atthavan hazaar aath sau");
  const m = useCount(4900, saat, month + 4);
  const y = useCount(58800, year - 8, year + 12);
  return (
    <SceneShell dur={dur}>
      <FigLabel n={2} text="MAAN LO · HISAAB" />
      <div style={{ position: "absolute", left: 84, top: 400, display: "flex", flexDirection: "column-reverse", gap: 8 }}>
        {APPS.map((_, i) => {
          const p = ease(f, saat + i * 4, saat + i * 4 + 8);
          return (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 14, opacity: p, transform: `translateY(${(1 - p) * -40}px)` }}>
              <div style={{ width: 320, height: 64, borderRadius: 12, background: APPS[i][2], display: "flex", alignItems: "center", padding: "0 18px", boxSizing: "border-box", justifyContent: "space-between" }}>
                <span style={label(22, C.white)}>{APPS[i][1]}</span>
                <span style={big(34, C.white)}>₹700</span>
              </div>
            </div>
          );
        })}
      </div>
      <div style={{ position: "absolute", left: 480, top: 420, display: "flex", flexDirection: "column", gap: 40 }}>
        <div style={{ opacity: ease(f, saat - 4, saat + 6) }}>
          <div style={label(26, BP.dim)}>HAR MAHINE</div>
          <div style={big(110, BP.red)}>₹{inr(m)}</div>
        </div>
        <div style={{ opacity: ease(f, year - 10, year) }}>
          <div style={label(26, BP.dim)}>× 12 = SAAL KA</div>
          <div style={{ ...big(110, BP.red), textShadow: "0 0 50px rgba(255,90,95,0.4)" }}>₹{inr(y)}</div>
        </div>
      </div>
      {[0, 4, 8, 12, 16, 20, 24].map((d) => (
        <Sfx key={d} at={saat + d} name="tick" vol={0.3} />
      ))}
      <Sfx at={year - 6} name="bass" vol={0.45} />
    </SceneShell>
  );
};

/* s4 · 3 of them not opened in 30 days */
export const S4Dead: React.FC<SP> = ({ dur }) => {
  const f = useCurrentFrame();
  const teen = cue("s4", "teen");
  const ek = cue("s4", "ek");
  const waste = useCount(2100, ek, ek + 16);
  return (
    <SceneShell dur={dur}>
      <FigLabel n={3} text="PICHLE 30 DIN MEIN KHULE?" />
      <div style={{ position: "absolute", left: 0, right: 0, top: 420, display: "flex", justifyContent: "center", flexWrap: "wrap", gap: 30, padding: "0 110px" }}>
        {APPS.map((a, i) => (
          <AppTile key={i} i={i} s={150} dead={a[3] ? ease(f, teen - 4 + i * 2, teen + 8 + i * 2) : 0} />
        ))}
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 920, display: "flex", flexDirection: "column", alignItems: "center", opacity: ease(f, ek - 6, ek + 4) }}>
        <div style={label(26, BP.dim)}>3 APPS × ₹700 · BEKAAR HAR MAHINE</div>
        <div style={big(120, BP.red)}>₹{inr(waste)}</div>
      </div>
      <div style={{ position: "absolute", left: 540, top: 1230 }}>
        <Stamp text="0 BAAR KHULE" at={ek + 8} size={72} rot={-5} />
      </div>
      <Sfx at={teen - 2} name="error" vol={0.4} />
      <Sfx at={ek + 8} name="stamp" vol={0.5} />
    </SceneShell>
  );
};

/* s5 · fixes */
export const S5Fixes: React.FC<SP> = ({ dur }) => (
  <SceneShell dur={dur}>
    <FigLabel n={4} text="AAJ HI KARO" />
    <div style={{ position: "absolute", left: 84, top: 390, display: "flex", flexDirection: "column", gap: 30 }}>
      <FixCard n={1} at={cue("s5", "card statement") - 8} title={<>Card statement kholo, <Hl>har subscription</Hl> likho</>} sub="naam · kitne ka · kab khula" />
      <FixCard n={2} at={cue("s5", "band") - 10} title={<>30 din se nahi khula? <Hl c={BP.red}>Band</Hl></>} sub="trial wale bhi check karo" />
      <FixCard n={3} at={cue("s5", "yearly") - 10} title={<>Roz wale 2-3 apps ka <Hl c={BP.green}>yearly plan</Hl></>} sub="aksar 2 mahine free milte hain" />
    </div>
    <Sfx at={cue("s5", "card statement") - 8} name="pop" vol={0.5} />
    <Sfx at={cue("s5", "band") - 10} name="pop" vol={0.5} />
    <Sfx at={cue("s5", "yearly") - 10} name="pop" vol={0.5} />
  </SceneShell>
);

const SheetIcon: React.FC = () => (
  <svg width={86} height={100} viewBox="0 0 86 100">
    <rect x={3} y={3} width={80} height={94} rx={12} fill={C.violet} stroke={C.navy} strokeWidth={5} />
    {[0, 1, 2, 3].map((r) => (
      <g key={r}>
        <rect x={14} y={18 + r * 19} width={34} height={12} rx={3} fill={C.white} />
        <rect x={52} y={18 + r * 19} width={20} height={12} rx={3} fill={r === 1 ? "#FF5A5F" : C.lavender} />
      </g>
    ))}
  </svg>
);

/* s6 · CTA */
export const S6Cta: React.FC<SP> = ({ dur }) => (
  <SceneShell dur={dur} noExit>
    <HisaabCta
      keyword="APPS"
      typeAt={cue("s6", "apps") - 8}
      giftAt={cue("s6", "subscription") - 6}
      giftTitle="Subscription Audit Sheet"
      giftSub="free · 10 minute mein poora hisaab"
      giftIcon={<SheetIcon />}
      nextAt={cue("s6", "kal")}
      nextLabel="KAL DOPAHAR 1 BAJE · AGLA CASE"
      next={
        <>
          <div style={big(54, C.navy)}>₹5 ka sample, aur</div>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{ ...big(60, C.white), background: "#16A34A", borderRadius: 16, padding: "8px 20px 0" }}>₹500</div>
            <div style={big(54, C.navy)}>ka agla order?</div>
          </div>
        </>
      }
      followAt={cue("s6", "follow")}
    />
  </SceneShell>
);
