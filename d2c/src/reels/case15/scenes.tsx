import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { CheckIcon, CrossIcon } from "../../components/icons";
import { Enter, SceneShell, Sfx, clamp, inr, useSpring } from "../../components/kit";
import { CommentBox, DmCard, FollowButton } from "../../components/widgets";
import { C, theme } from "../../theme";
import { BP, Coin, DimLabel, DimLine, FigLabel, SaleLine, TW, Tint, TowerFrame, big, coinXY, ease, label, rowTop, yAt } from "./blueprint";
import { cue } from "./timeline";

type SP = { dur: number };

/* segment map for the ₹30,000 tower (index = coin, 1 coin = ₹100) */
const SEG = { maal: [0, 120], pack: [120, 174], ret: [174, 210], bacha: [210, 300] } as const;
const AD = { x: 660, y: 680 };
const adCoin = (j: number) => ({ x: AD.x + (j % 10) * TW.p + 2, y: AD.y + Math.floor(j / 10) * TW.p + 2 });

const glass: React.CSSProperties = {
  background: "rgba(223,200,253,0.06)",
  border: `2.5px solid ${BP.lineSoft}`,
  borderRadius: 30,
  boxShadow: "0 30px 60px -30px rgba(0,0,0,0.6)",
};

/** Count-up that lands on `to` between frames a and b. */
const useCount = (to: number, a: number, b: number) => {
  const f = useCurrentFrame();
  return interpolate(f, [a, b], [0, to], { ...clamp, easing: theme.ease.out });
};

/* ================= S1 · hook ================= */

const Spark: React.FC<{ p: number }> = ({ p }) => {
  const pts = [
    [0, 150],
    [70, 128],
    [140, 136],
    [210, 96],
    [280, 104],
    [350, 58],
    [420, 22],
  ];
  const d = pts.map(([x, y], i) => `${i ? "L" : "M"}${x},${y}`).join(" ");
  return (
    <svg width={440} height={170} viewBox="-10 0 440 170" style={{ overflow: "visible" }}>
      <path d={`${d} L420,170 L0,170 Z`} fill="rgba(43,212,107,0.14)" opacity={p} />
      <path d={d} fill="none" stroke={BP.green} strokeWidth={8} strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - p} />
      <circle cx={420} cy={22} r={13} fill={BP.green} opacity={p} />
    </svg>
  );
};

export const S1Hook: React.FC<SP> = ({ dur }) => {
  const f = useCurrentFrame();
  const doob = cue("s1", "doob");
  const humne = cue("s1", "humne");
  const settle = ease(f, 0, 12);
  const stamp = useSpring(doob - 2, "slam");
  const shake = f >= doob && f < doob + 10 ? Math.sin(f * 2.6) * (10 - (f - doob)) * 1.4 : 0;
  const scan = ease(f, humne - 2, humne + 22, "inOut");
  const dim = ease(f, humne, humne + 16);
  return (
    <SceneShell dur={dur}>
      <Sfx at={doob - 3} name="stamp" vol={0.8} />
      <Sfx at={doob + 2} name="error" vol={0.5} />
      <Sfx at={humne - 2} name="swish" vol={0.5} />

      {/* dashboard */}
      <div style={{ position: "absolute", left: 84, top: 330, width: 912, height: 430, ...glass, transform: `translateX(${shake}px) scale(${1.03 - 0.03 * settle})`, overflow: "hidden" }}>
        <div style={{ position: "absolute", left: 40, top: 34, display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{ width: 16, height: 16, borderRadius: "50%", background: BP.green }} />
          <div style={label(26, BP.dim)}>ADS DASHBOARD · IS HAFTE</div>
        </div>
        <div style={{ position: "absolute", left: 40, top: 110, ...label(34, BP.text) }}>ROAS</div>
        <div style={{ position: "absolute", left: 30, top: 150, ...big(230, BP.green), textShadow: "0 0 60px rgba(43,212,107,0.35)" }}>3.0</div>
        <div style={{ position: "absolute", right: 40, top: 150 }}>
          <Spark p={ease(f, 0, 26)} />
        </div>
        <div style={{ position: "absolute", left: 40, bottom: 34, ...label(26, BP.green) }}>▲ DASHBOARD HARA</div>
      </div>

      {/* LOSS stamp */}
      {f >= doob - 3 && (
        <div
          style={{
            position: "absolute",
            left: 700,
            top: 470,
            transform: `translate(-50%, -50%) rotate(-9deg) scale(${interpolate(stamp, [0, 1], [2.4, 1])})`,
            opacity: interpolate(stamp, [0, 0.3], [0, 1], clamp),
            border: `10px solid ${BP.red}`,
            borderRadius: 26,
            padding: "14px 44px 2px",
            background: "rgba(13,2,56,0.82)",
            ...big(120, BP.red),
            letterSpacing: "0.04em",
            boxShadow: "0 0 80px rgba(255,90,95,0.35)",
          }}
        >
          LOSS
        </div>
      )}

      {/* hook line, on screen from frame 0 */}
      <div style={{ position: "absolute", left: 0, right: 0, top: 830, display: "flex", flexDirection: "column", alignItems: "center", gap: 20 }}>
        <div style={big(86)}>ROAS 3, phir bhi</div>
        <div style={{ display: "flex", alignItems: "center", gap: 22 }}>
          <div style={big(86)}>paisa</div>
          <div style={{ ...big(96, C.white), background: C.red, borderRadius: 22, padding: "12px 28px 2px", transform: `rotate(-2deg) scale(${1 + 0.08 * Math.sin(Math.PI * ease(f, doob, doob + 10))})` }}>DOOB</div>
          <div style={big(86)}>raha?</div>
        </div>
      </div>

      {/* sinking coins */}
      {f >= doob &&
        Array.from({ length: 9 }).map((_, i) => {
          const t = f - doob - i * 3;
          if (t < 0) return null;
          const y = 1080 + t * t * 0.5;
          return <Coin key={i} x={200 + i * 80 + Math.sin(i * 2.1) * 20} y={y} tint="red" o={interpolate(t, [0, 4, 26, 34], [0, 1, 1, 0], clamp)} s={1.4} />;
        })}

      {/* scan + "har rupaye ka hisaab" */}
      {f >= humne - 2 && f < humne + 24 && (
        <div style={{ position: "absolute", left: 0, right: 0, top: 300 + scan * 1100, height: 4, background: C.lavender, boxShadow: `0 0 40px 10px rgba(223,200,253,0.45)`, opacity: 1 - scan * 0.6 }} />
      )}
      <div style={{ position: "absolute", left: 84, top: 1250, width: 912, opacity: dim }}>
        <div style={{ position: "relative", height: 30 }}>
          <div style={{ position: "absolute", left: 0, top: 14, width: 912 * dim, height: 3, background: BP.line }} />
          <div style={{ position: "absolute", left: 0, top: 2, width: 3, height: 27, background: BP.line }} />
          <div style={{ position: "absolute", left: 909, top: 2, width: 3, height: 27, background: BP.line, opacity: dim }} />
        </div>
        <div style={{ ...label(34, BP.text), textAlign: "center", marginTop: 18, transform: `translateY(${(1 - dim) * 20}px)` }}>HAR ₹ KA HISAAB ↓</div>
      </div>
    </SceneShell>
  );
};

/* ================= S2 · ad vs sale ================= */

export const S2AdSale: React.FC<SP> = ({ dur }) => {
  const f = useCurrentFrame();
  const das = cue("s2", "das hazaar");
  const sale = cue("s2", "sale");
  const tees = cue("s2", "tees hazaar");
  const fillA = sale - 4;
  const adIn = ease(f, das - 6, das + 8);
  const saleIn = ease(f, sale - 4, sale + 8);
  const adVal = useCount(10000, das - 4, das + 14);
  const saleVal = useCount(30000, fillA, fillA + 30);
  const roas = useSpring(tees + 2, "bouncy");
  return (
    <SceneShell dur={dur}>
      <FigLabel n={1} text="AD vs SALE" />
      <TowerFrame o={ease(f, 0, 12)} />
      {Array.from({ length: 300 }).map((_, i) => {
        const at = fillA + i * 0.1;
        const p = ease(f, at, at + 6);
        if (p <= 0) return null;
        const { x, y } = coinXY(i);
        return <Coin key={i} x={x} y={y - (1 - p) * 26} tint="green" o={p} s={0.6 + 0.4 * p} />;
      })}
      <SaleLine p={ease(f, fillA + 30, fillA + 44)} tag={false} />

      {/* ad */}
      <div style={{ position: "absolute", left: AD.x, top: 500, opacity: adIn, transform: `translateX(${(1 - adIn) * 60}px)` }}>
        <div style={label(26, BP.dim)}>AD PE LAGAYE</div>
        <div style={big(80)}>₹{inr(adVal)}</div>
      </div>
      {Array.from({ length: 100 }).map((_, j) => {
        const at = das - 4 + j * 0.16;
        const p = ease(f, at, at + 6);
        if (p <= 0) return null;
        const { x, y } = adCoin(j);
        return <Coin key={j} x={x} y={y - (1 - p) * 20} tint="ad" o={p} s={0.6 + 0.4 * p} />;
      })}

      {/* sale */}
      <div style={{ position: "absolute", left: AD.x, top: 1010, opacity: saleIn, transform: `translateX(${(1 - saleIn) * 60}px)` }}>
        <div style={label(26, BP.dim)}>SALE AAYI</div>
        <div style={big(96, BP.green)}>₹{inr(saleVal)}</div>
      </div>
      <div
        style={{
          position: "absolute",
          left: AD.x,
          top: 1180,
          display: "flex",
          alignItems: "center",
          gap: 14,
          opacity: interpolate(roas, [0, 0.4], [0, 1], clamp),
          transform: `scale(${interpolate(roas, [0, 1], [0.6, 1])})`,
          transformOrigin: "left center",
          background: "rgba(43,212,107,0.14)",
          border: `3px solid ${BP.green}`,
          borderRadius: 18,
          padding: "12px 20px 6px",
        }}
      >
        <CheckIcon size={44} draw={ease(f, tees + 6, tees + 16)} />
        <div style={big(54, BP.green)}>ROAS 3.0</div>
      </div>

      <Sfx at={das - 6} name="pop" vol={0.5} />
      {[0, 6, 12, 18, 24, 30].map((d) => (
        <Sfx key={d} at={fillA + d} name="tick" vol={0.35} />
      ))}
      <Sfx at={tees} name="check" vol={0.55} />
    </SceneShell>
  );
};

/* ================= tower state shared by S3/S4 ================= */

const tintOf = (i: number): Tint => (i < SEG.maal[1] ? "maal" : i < SEG.pack[1] ? "pack" : i < SEG.ret[1] ? "ret" : "green");

/* ================= S3 · break the ₹30,000 ================= */

export const S3Break: React.FC<SP> = ({ dur }) => {
  const f = useCurrentFrame();
  const todo = cue("s3", "todo");
  const maal = cue("s3", "maal");
  const n1 = cue("s3", "baarah hazaar");
  const pack = cue("s3", "packing");
  const n2 = cue("s3", "paanch hazaar chaar sau");
  const ret = cue("s3", "returns");
  const n3 = cue("s3", "teen hazaar chhe sau");
  const starts: Record<string, number> = { maal: maal - 4, pack: pack - 4, ret: ret - 4 };
  const shake = f >= todo && f < todo + 12 ? Math.sin(f * 2.2) * (12 - (f - todo)) * 1.1 : 0;
  // count while the label is read out, landing as the number is spoken
  const v1 = useCount(12000, starts.maal + 6, n1 + 6);
  const v2 = useCount(5400, starts.pack + 6, n2 + 6);
  const v3 = useCount(3600, starts.ret + 6, n3 + 6);
  const seg = (k: "maal" | "pack" | "ret") => ease(f, starts[k], starts[k] + 16);
  return (
    <SceneShell dur={dur}>
      <FigLabel n={2} text="₹30,000 KAHAN GAYA?" />
      <TowerFrame />
      <SaleLine p={1} />
      <div style={{ position: "absolute", inset: 0, transform: `translateX(${shake}px)` }}>
        {Array.from({ length: 300 }).map((_, i) => {
          const k = tintOf(i);
          if (k === "green") return <Coin key={i} {...coinXY(i)} tint="green" />;
          const [a] = SEG[k as "maal" | "pack" | "ret"];
          const at = starts[k] + (i - a) * 0.14;
          const on = f >= at;
          const pop = 1 + 0.3 * Math.sin(Math.PI * ease(f, at, at + 7));
          return <Coin key={i} {...coinXY(i)} tint={on ? k : "green"} s={on ? pop : 1} />;
        })}
      </div>

      <DimLine x={440} y1={yAt(0) - 3} y2={yAt(12) + 3} p={seg("maal")} />
      <DimLabel y={(yAt(0) + yAt(12)) / 2} name="MAAL (product cost)" value={`₹${inr(v1)}`} p={seg("maal")} />
      <DimLine x={440} y1={yAt(12) - 3} y2={yAt(17.4) + 3} p={seg("pack")} />
      <DimLabel y={(yAt(12) + yAt(17.4)) / 2} name="PACKING + DELIVERY" value={`₹${inr(v2)}`} p={seg("pack")} size={56} />
      <DimLine x={440} y1={yAt(17.4) - 3} y2={yAt(21) + 3} p={seg("ret")} />
      <DimLabel y={(yAt(17.4) + yAt(21)) / 2} name="RETURNS + CHARGES" value={`₹${inr(v3)}`} p={seg("ret")} size={56} />

      <Sfx at={todo - 2} name="swish" vol={0.55} />
      <Sfx at={starts.maal} name="pop" vol={0.45} />
      <Sfx at={starts.pack} name="pop" vol={0.45} />
      <Sfx at={starts.ret} name="pop" vol={0.45} />
      <Sfx at={n1} name="key" vol={0.4} />
      <Sfx at={n2} name="key" vol={0.4} />
      <Sfx at={n3} name="key" vol={0.4} />
    </SceneShell>
  );
};

/* ================= S4 · add the ad → overflow ================= */

export const S4Overflow: React.FC<SP> = ({ dur }) => {
  const f = useCurrentFrame();
  const ik = cue("s4", "ikkees hazaar");
  const upar = cue("s4", "upar");
  const das = cue("s4", "das hazaar");
  const minus = cue("s4", "minus ek hazaar");
  const old = 1 - ease(f, ik - 8, ik + 2);
  const kh = ease(f, ik - 2, ik + 14);
  const khVal = useCount(21000, ik - 2, ik + 16);
  const bachaOut = ease(f, das - 4, das + 6);
  const bacha = ease(f, ik + 4, ik + 18) * (1 - bachaOut);
  const slideIn = ease(f, upar - 2, upar + 14);
  const fly = ease(f, das, das + 14, "inOut");
  const landed = f >= das + 14;
  const squash = landed ? 1 - 0.06 * Math.sin(Math.PI * ease(f, das + 14, das + 22)) : 1;
  const adDim = ease(f, das + 16, das + 30);
  const loss = useSpring(minus - 2, "slam");
  const red = f >= minus - 2;
  const pulse = f >= das + 18 ? 0.5 + 0.5 * Math.sin((f - das) / 3) : 0;

  // ad block position: right side → on top of the 21 cost rows (rows 21–30)
  const bx = interpolate(fly, [0, 1], [AD.x, TW.x0]) + (1 - slideIn) * 520;
  const by = interpolate(fly, [0, 1], [AD.y, rowTop(30)]) - Math.sin(Math.PI * fly) * 120;

  return (
    <SceneShell dur={dur}>
      <FigLabel n={3} text="ASLI HISAAB" />
      <TowerFrame />
      <SaleLine p={1} />

      {/* cost rows (0–209) */}
      {Array.from({ length: 210 }).map((_, i) => {
        const at = ik - 6 + i * 0.05;
        const on = f >= at;
        return <Coin key={i} {...coinXY(i)} tint={on ? "cost" : tintOf(i)} s={on ? 1 + 0.2 * Math.sin(Math.PI * ease(f, at, at + 6)) : 1} />;
      })}
      {/* bacha rows (210–299) get eaten by the ad */}
      {Array.from({ length: 90 }).map((_, k) => {
        const i = 210 + k;
        const at = das - 4 + (89 - k) * 0.08;
        const p = ease(f, at, at + 6, "in");
        if (p >= 1) return null;
        return <Coin key={i} {...coinXY(i)} tint="green" s={1 - p} o={1 - p} />;
      })}

      {/* old 3 labels fade, replaced by one KHARCHA bracket */}
      {old > 0 && (
        <div style={{ opacity: old }}>
          <DimLine x={440} y1={yAt(0) - 3} y2={yAt(12) + 3} p={1} />
          <DimLabel y={(yAt(0) + yAt(12)) / 2} name="MAAL (product cost)" value="₹12,000" p={1} />
          <DimLine x={440} y1={yAt(12) - 3} y2={yAt(17.4) + 3} p={1} />
          <DimLabel y={(yAt(12) + yAt(17.4)) / 2} name="PACKING + DELIVERY" value="₹5,400" p={1} size={56} />
          <DimLine x={440} y1={yAt(17.4) - 3} y2={yAt(21) + 3} p={1} />
          <DimLabel y={(yAt(17.4) + yAt(21)) / 2} name="RETURNS + CHARGES" value="₹3,600" p={1} size={56} />
        </div>
      )}
      <DimLine x={440} y1={yAt(0)} y2={yAt(21)} p={kh} />
      <DimLabel y={(yAt(0) + yAt(21)) / 2 + 60} name="KHARCHA" value={`₹${inr(khVal)}`} p={kh} size={84} />
      <DimLine x={440} y1={yAt(21) - 3} y2={yAt(30) + 3} p={bacha} color={BP.green} />
      <DimLabel y={(yAt(21) + yAt(30)) / 2} name="BACHA" value="₹9,000" p={bacha} color={BP.green} />

      {/* ad block */}
      {f >= upar - 2 && (
        <div style={{ position: "absolute", left: 0, top: 0, transform: `translate(${bx - AD.x}px, ${by - AD.y}px)` }}>
          <div style={{ position: "absolute", left: AD.x, top: AD.y, width: 300, height: 300, transform: `scaleY(${squash})`, transformOrigin: "50% 100%" }}>
            {Array.from({ length: 100 }).map((_, j) => {
              const top = j < 10;
              const { x, y } = adCoin(j);
              return <Coin key={j} x={x - AD.x} y={y - AD.y} tint={top && red ? "red" : "ad"} glow={top ? (red ? 1 : pulse * 0.7) : 0} />;
            })}
          </div>
          <div
            style={{
              position: "absolute",
              left: AD.x + 150,
              top: AD.y + 150,
              transform: `translate(-50%, -50%) rotate(-4deg)`,
              opacity: 1 - adDim,
              background: C.navy,
              border: `3px solid ${C.lavender}`,
              borderRadius: 16,
              padding: "10px 20px 4px",
              ...big(54, C.white),
            }}
          >
            AD ₹10,000
          </div>
        </div>
      )}
      <DimLine x={440} y1={yAt(21) - 3} y2={yAt(31)} p={adDim} />
      <DimLabel y={(yAt(21) + yAt(30)) / 2 + 40} name="+ AD KA KHARCHA" value="₹10,000" p={adDim} />

      {/* loss callout */}
      <div style={{ position: "absolute", left: TW.x0 + 300, top: rowTop(30) + 14, width: 80 * Math.min(1, loss), height: 4, background: BP.red, transform: "rotate(-28deg)", transformOrigin: "0 50%" }} />
      <div
        style={{
          position: "absolute",
          left: 498,
          top: 336,
          opacity: interpolate(loss, [0, 0.3], [0, 1], clamp),
          transform: `scale(${interpolate(loss, [0, 1], [1.5, 1])})`,
          transformOrigin: "left center",
          display: "flex",
          flexDirection: "column",
          gap: 0,
        }}
      >
        <div style={label(26, BP.red)}>HAATH MEIN</div>
        <div style={{ ...big(108, BP.red), textShadow: "0 0 50px rgba(255,90,95,0.45)" }}>−₹1,000</div>
      </div>

      <Sfx at={upar - 4} name="whoosh" vol={0.5} />
      <Sfx at={das + 12} name="stamp" vol={0.75} />
      <Sfx at={das + 13} name="bass" vol={0.6} />
      <Sfx at={minus - 4} name="error" vol={0.6} />
    </SceneShell>
  );
};

/* ================= S5 · break-even meter ================= */

const CX = 540;
const CY = 470;
const R = 360;
const ang = (v: number) => Math.PI - (v / 5) * Math.PI;
const pt = (v: number, r = R) => [CX + r * Math.cos(ang(v)), CY - r * Math.sin(ang(v))];
const arc = (a: number, b: number, r = R) => {
  const [x1, y1] = pt(a, r);
  const [x2, y2] = pt(b, r);
  return `M${x1},${y1} A${r},${r} 0 0 1 ${x2},${y2}`;
};

export const S5Meter: React.FC<SP> = ({ dur }) => {
  const f = useCurrentFrame();
  const sale = cue("s5", "sale");
  const kh = cue("s5", "kharcha");
  const prod = cue("s5", "product");
  const bina = cue("s5", "bina");
  const tp = cue("s5", "teen point teen");
  const card = ease(f, 0, 14);
  const saleOk = useSpring(sale - 2, "bouncy");
  const khIn = useSpring(kh - 2, "bouncy");
  const g = ease(f, prod - 10, prod + 6);
  const needleV = interpolate(f, [prod, prod + 26], [0, 3.0], { ...clamp, easing: theme.ease.out }) + (f > prod + 26 ? Math.sin(f / 4) * 0.03 : 0);
  const zones = ease(f, bina - 4, bina + 14);
  const be = useSpring(bina + 4, "snappy");
  const eq = ease(f, bina + 22, bina + 36);
  const hit = 1 + 0.12 * Math.sin(Math.PI * ease(f, tp - 2, tp + 10));
  const [nx, ny] = pt(needleV, R - 50);
  const [bx1, by1] = pt(10 / 3, R - 40);
  const [bx2, by2] = pt(10 / 3, R + 46);
  const [lx, ly] = pt(10 / 3, R + 134);
  return (
    <SceneShell dur={dur}>
      <FigLabel n={4} text="ROAS KYA GINTA HAI" />
      <div style={{ position: "absolute", left: 84, top: 360, width: 912, padding: "34px 0 30px", ...glass, opacity: card, transform: `translateY(${(1 - card) * 30}px)`, display: "flex", flexDirection: "column", alignItems: "center", gap: 24 }}>
        <div style={big(78)}>
          ROAS = <span style={{ color: BP.green }}>SALE</span> ÷ AD
        </div>
        <div style={{ display: "flex", gap: 22 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, opacity: interpolate(saleOk, [0, 0.4], [0, 1], clamp), transform: `scale(${interpolate(saleOk, [0, 1], [0.6, 1])})`, border: `3px solid ${BP.green}`, borderRadius: 999, padding: "10px 24px 8px 12px", background: "rgba(43,212,107,0.12)" }}>
            <CheckIcon size={42} draw={ease(f, sale + 2, sale + 12)} />
            <div style={label(26, BP.text)}>SALE ginta hai</div>
          </div>
          <div style={{ position: "relative", display: "flex", alignItems: "center", gap: 12, opacity: interpolate(khIn, [0, 0.4], [0, 1], clamp), transform: `scale(${interpolate(khIn, [0, 1], [0.6, 1])})`, border: `3px solid ${BP.red}`, borderRadius: 999, padding: "10px 24px 8px 12px", background: "rgba(255,90,95,0.12)" }}>
            <CrossIcon size={42} draw={ease(f, kh + 2, kh + 12)} />
            <div style={label(26, BP.text)}>KHARCHA nahi ginta</div>
          </div>
        </div>
      </div>

      {/* gauge */}
      <svg width={1080} height={640} viewBox="0 0 1080 640" style={{ position: "absolute", left: 0, top: 700, opacity: g, overflow: "visible" }}>
        <path d={arc(0, 5)} stroke="rgba(223,200,253,0.13)" strokeWidth={56} fill="none" />
        <path d={arc(0, 10 / 3)} stroke={BP.red} strokeWidth={56} fill="none" opacity={0.85 * zones} />
        <path d={arc(10 / 3, 5)} stroke={BP.green} strokeWidth={56} fill="none" opacity={0.85 * zones} />
        {Array.from({ length: 11 }).map((_, i) => {
          const v = i / 2;
          const [x1, y1] = pt(v, R - 44);
          const [x2, y2] = pt(v, R - (i % 2 ? 60 : 76));
          return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={BP.dim} strokeWidth={i % 2 ? 3 : 5} />;
        })}
        {[0, 1, 2, 3, 4, 5].map((v) => {
          const [x, y] = pt(v, R - 112);
          return (
            <text key={v} x={x} y={y + 14} textAnchor="middle" fontFamily={theme.fonts.display} fontWeight={700} fontSize={38} fill={BP.dim}>
              {v}
            </text>
          );
        })}
        <line x1={bx1} y1={by1} x2={bx2} y2={by2} stroke={C.white} strokeWidth={8} strokeLinecap="round" opacity={be} />
        <g opacity={be} transform={`translate(${lx},${ly}) scale(${0.7 + 0.3 * be * hit})`}>
          <text x={0} y={-6} textAnchor="middle" fontFamily={theme.fonts.body} fontWeight={800} fontSize={24} letterSpacing="0.12em" fill={BP.dim}>
            BREAK-EVEN
          </text>
          <text x={0} y={46} textAnchor="middle" fontFamily={theme.fonts.display} fontWeight={700} fontSize={58} fill={BP.green}>
            3.3
          </text>
        </g>
        <line x1={CX} y1={CY} x2={nx} y2={ny} stroke={C.white} strokeWidth={12} strokeLinecap="round" />
        <circle cx={CX} cy={CY} r={26} fill={C.white} />
        <circle cx={CX} cy={CY} r={11} fill={C.navy} />
      </svg>
      <div style={{ position: "absolute", left: 0, right: 0, top: 1196, display: "flex", justifyContent: "center", opacity: g }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 16 }}>
          <div style={label(28, BP.dim)}>AAPKA ROAS</div>
          <div style={big(72, needleV < 3.3 && zones > 0.5 ? BP.red : BP.text)}>{needleV.toFixed(1)}</div>
        </div>
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 1300, display: "flex", flexDirection: "column", alignItems: "center", gap: 8, opacity: eq, transform: `translateY(${(1 - eq) * 24}px)` }}>
        <div style={label(24, BP.dim)}>BINA LOSS KE CHAHIYE</div>
        <div style={big(50)}>
          30,000 ÷ (30,000 − 21,000) = <span style={{ color: BP.green, display: "inline-block", transform: `scale(${hit})` }}>3.3</span>
        </div>
      </div>

      <Sfx at={sale - 2} name="check" vol={0.45} />
      <Sfx at={kh} name="error" vol={0.4} />
      {[0, 5, 10, 15, 20].map((d) => (
        <Sfx key={d} at={prod + d} name="tick" vol={0.35} />
      ))}
      <Sfx at={bina + 2} name="ding" vol={0.45} />
      <Sfx at={tp - 2} name="pop" vol={0.5} />
    </SceneShell>
  );
};

/* ================= S6 · three fixes ================= */

const Fix: React.FC<{ n: number; at: number; title: React.ReactNode; sub: React.ReactNode }> = ({ n, at, title, sub }) => (
  <Enter delay={at} from="right" dist={90} style={{ width: 912 }}>
    <div style={{ ...glass, padding: "30px 34px 28px", display: "flex", alignItems: "center", gap: 30 }}>
      <div style={{ flex: "0 0 92px", height: 92, borderRadius: "50%", background: theme.grad.violet, border: `3px solid ${C.lavender}`, display: "flex", alignItems: "center", justifyContent: "center", ...big(54, C.white), paddingTop: 6, boxSizing: "border-box" }}>{n}</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <div style={{ ...big(48), whiteSpace: "normal", lineHeight: 1.25 }}>{title}</div>
        <div style={label(24, BP.dim)}>{sub}</div>
      </div>
    </div>
  </Enter>
);

const Hl: React.FC<{ children: React.ReactNode; c?: string }> = ({ children, c = C.lavender }) => (
  <span style={{ display: "inline-block", whiteSpace: "nowrap", background: c, color: C.navy, borderRadius: 12, padding: "4px 14px 0" }}>{children}</span>
);

export const S6Fixes: React.FC<SP> = ({ dur }) => {
  const a = cue("s6", "poora", 1, -10);
  const b = cue("s6", "break even", 1, -10);
  const c = cue("s6", "ad", 1, -10);
  return (
    <SceneShell dur={dur}>
      <FigLabel n={5} text="AB KYA KAREIN" />
      <div style={{ position: "absolute", left: 84, top: 390, display: "flex", flexDirection: "column", gap: 30 }}>
        <Fix n={1} at={a} title={<>Har product ka <Hl>poora kharcha</Hl> likho</>} sub="maal + packing + delivery + returns" />
        <Fix n={2} at={b} title={<>Uska <Hl>break-even ROAS</Hl> nikaalo</>} sub="sale ÷ (sale − kharcha)" />
        <Fix n={3} at={c} title={<>Ad sirf <Hl c={BP.green}>usse upar</Hl> badhao</>} sub="3.0 pe ruko · 3.3+ pe scale" />
      </div>
      <Sfx at={a} name="pop" vol={0.5} />
      <Sfx at={b} name="pop" vol={0.5} />
      <Sfx at={c} name="pop" vol={0.5} />
    </SceneShell>
  );
};

/* ================= S7 · CTA ================= */

const Step: React.FC<{ n: number; text: string; at: number; top: number }> = ({ n, text, at, top }) => (
  <Enter delay={at} from="left" dist={60} style={{ position: "absolute", left: 84, top, display: "flex", alignItems: "center", gap: 16 }}>
    <div style={{ width: 62, height: 62, borderRadius: "50%", background: theme.grad.violet, border: `3px solid ${C.lavender}`, display: "flex", alignItems: "center", justifyContent: "center", ...big(34, C.white), paddingTop: 4, boxSizing: "border-box" }}>{n}</div>
    <div style={big(50)}>{text}</div>
  </Enter>
);

const CalcIcon: React.FC = () => (
  <svg width={86} height={100} viewBox="0 0 86 100">
    <rect x={3} y={3} width={80} height={94} rx={14} fill={C.violet} stroke={C.navy} strokeWidth={5} />
    <rect x={14} y={14} width={58} height={22} rx={5} fill={C.lavender} />
    {[0, 1, 2].map((r) =>
      [0, 1, 2].map((c) => <rect key={`${r}${c}`} x={14 + c * 21} y={46 + r * 16} width={15} height={10} rx={3} fill={r === 2 && c === 2 ? "#2BD46B" : C.white} />),
    )}
  </svg>
);

const FallChart: React.FC<{ p: number }> = ({ p }) => (
  <svg width={300} height={120} viewBox="0 0 300 120">
    <path d="M10,20 L80,30 L130,26 L180,70 L230,84 L290,108" fill="none" stroke={C.red} strokeWidth={9} strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - p} />
  </svg>
);

export const S7Cta: React.FC<SP> = ({ dur }) => {
  const f = useCurrentFrame();
  const kw = cue("s7", "aar o e es");
  const calc = cue("s7", "break even");
  const kal = cue("s7", "kal");
  const follow = cue("s7", "follow");
  const out = ease(f, kal - 6, kal + 2, "in");
  return (
    <SceneShell dur={dur} noExit>
      {f < kal + 4 && (
        <div style={{ position: "absolute", inset: 0, opacity: 1 - out, transform: `translateY(${-60 * out}px)` }}>
          <Step n={1} text="Comment karo" at={0} top={300} />
          <Enter delay={2} style={{ position: "absolute", left: 84, top: 385 }}>
            <CommentBox word="ROAS" typeStart={kw - 8} />
          </Enter>
          <Step n={2} text="DM mein milega" at={calc - 10} top={570} />
          <Enter delay={calc - 6} from="right" dist={120} style={{ position: "absolute", left: 84, top: 655 }}>
            <DmCard title="Break-even ROAS Calculator" sub="free · Google Sheet · 2 minute" icon={<CalcIcon />} />
          </Enter>
        </div>
      )}
      {f >= kal - 2 && (
        <div style={{ position: "absolute", left: 84, right: 84, top: 300, display: "flex", flexDirection: "column", alignItems: "center", gap: 18 }}>
          <Enter delay={kal} cfg="snappy">
            <div style={{ ...label(32, C.navy), background: C.lavender, borderRadius: 999, padding: "14px 28px 12px", letterSpacing: "0.08em" }}>KAL DOPAHAR 1 BAJE · AGLA CASE</div>
          </Enter>
          <Enter delay={kal + 4}>
            <div style={{ background: C.white, borderRadius: 30, border: `5px solid ${C.lavender}`, boxShadow: `10px 10px 0 ${C.violet}`, padding: "30px 44px 24px", display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
              <div style={big(56, C.navy)}>Diwali ke baad</div>
              <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                <div style={{ ...big(64, C.white), background: C.red, borderRadius: 16, padding: "8px 20px 0" }}>SALE</div>
                <div style={big(56, C.navy)}>kyun girti hai?</div>
              </div>
              <FallChart p={ease(f, kal + 10, kal + 34)} />
            </div>
          </Enter>
        </div>
      )}
      {f >= follow - 10 && (
        <div style={{ position: "absolute", left: 0, right: 0, top: 880, zIndex: 6 }}>
          <FollowButton at={follow} />
        </div>
      )}
      <Sfx at={kw - 8} name="key" vol={0.4} />
      <Sfx at={calc - 6} name="pop" vol={0.5} />
      <Sfx at={kal - 2} name="whoosh" vol={0.5} />
      <Sfx at={follow + 12} name="ding" vol={0.5} />
    </SceneShell>
  );
};
