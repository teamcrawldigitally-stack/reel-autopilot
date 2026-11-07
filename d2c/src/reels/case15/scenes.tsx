// CASE #15 ROAS — cartoon look (remade 7 Nov 2026 from the dark-blue version; same script and voice).
import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { Bottle } from "../../components/props";
import { Parcel, Person, ROHIT, Truck } from "../../components/Cartoon";
import { Camera } from "../../components/fx";
import { HookTitle, LINE, Place, makeMouth } from "../../components/format";
import { Chip, Enter, SceneShell, Sfx, clamp, inr } from "../../components/kit";
import { MoneyRoom } from "../../components/sets";
import { CtaScene, FixBoard, Gauge, Panel, Pop, StackBar, big, body, ramp } from "../../components/toon";
import { Stamp } from "../../components/widgets";
import { C } from "../../theme";
import { T, cue } from "./timeline";

const sceneMouth = makeMouth(T);
const TAG = "CASE #15";
const ORANGE = "#F5A25D";

const count = (f: number, to: number, a: number, len = 12) => inr(interpolate(f, [a, a + len], [0, to], { ...clamp, easing: (t) => 1 - Math.pow(1 - t, 3) }));

/* ===== S1: hook ===== */
export const S1Hook: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useCurrentFrame();
  const teen = cue("s1", "teen");
  const doob = cue("s1", "doob");
  const hisaab = cue("s1", "hisaab");
  const level = interpolate(f, [doob - 6, doob + 30], [0.85, 0.1], { ...clamp, easing: (t) => t * t });
  return (
    <SceneShell dur={dur} noExit>
      <Camera dur={dur} punches={[doob]} push={0.03}>
        <MoneyRoom />
        <HookTitle
          top={300}
          lines={[
            { text: "ROAS 3 hai,", at: -8, kind: "plain", size: 88, rot: -1 },
            { text: "phir bhi loss?", at: -6, kind: "red", size: 104, rot: 2 },
          ]}
        />
        <div style={{ position: "absolute", left: 480, top: 650, zIndex: 6, transform: `rotate(3deg) scale(${1 + 0.06 * Math.sin(Math.PI * ramp(f, teen - 2, teen + 8))})` }}>
          <Panel style={{ width: 500, padding: "20px 26px 18px" }}>
            <div style={body(28, C.muted)}>AD DASHBOARD</div>
            <div style={{ display: "flex", alignItems: "baseline", gap: 18, marginTop: 4 }}>
              <div style={big(64)}>ROAS</div>
              <div style={big(110, C.green)}>3.0</div>
            </div>
            <Chip size={26} bg={C.green}>
              BADHIYA!
            </Chip>
          </Panel>
        </div>
        <div style={{ position: "absolute", left: 640, top: 940, zIndex: 5 }}>
          <svg width={260} height={300} viewBox="0 0 250 288">
            <rect x={52} y={6} width={146} height={28} rx={8} fill="#B9B3CC" stroke={LINE} strokeWidth={5} />
            <path d="M40 40 H210 Q236 40 236 70 V258 Q236 282 210 282 H40 Q14 282 14 258 V70 Q14 40 40 40 Z" fill="rgba(255,255,255,0.75)" stroke={LINE} strokeWidth={6} />
            <clipPath id="c15jar">
              <path d="M40 44 H210 Q232 44 232 70 V258 Q232 278 210 278 H40 Q18 278 18 258 V70 Q18 44 40 44 Z" />
            </clipPath>
            <g clipPath="url(#c15jar)">
              <rect x={0} y={282 - 236 * level} width={250} height={240} fill={C.green} opacity={0.85} />
            </g>
            <text x={125} y={190} textAnchor="middle" fontFamily="Poppins" fontWeight={700} fontSize={72} fill={LINE}>
              ₹
            </text>
          </svg>
          {f >= doob - 4 && (
            <div style={{ position: "absolute", left: 90, top: 300, width: 80, height: 120, opacity: 1 - ramp(f, doob + 26, doob + 34) }}>
              {[0, 1, 2].map((i) => {
                const y = ((f - doob + i * 9) * 9) % 120;
                return <div key={i} style={{ position: "absolute", left: 20 + i * 14, top: y, width: 16, height: 26, borderRadius: 8, background: C.green, border: `3px solid ${LINE}` }} />;
              })}
            </div>
          )}
        </div>
        <Place x={60} y={690} s={0.86} z={5}>
          <Person
            look={ROHIT}
            seed="r151"
            track={[
              { at: -100, pose: "hold", mood: "happy" },
              { at: teen, pose: "cheer", mood: "grin" },
              { at: doob - 4, pose: "shrug", mood: "shock" },
            ]}
          />
        </Place>
        <div style={{ position: "absolute", left: 470, top: 1250, zIndex: 9 }}>
          <Stamp at={hisaab} text="HAR ₹ KA HISAAB" size={46} rotate={-6} color={C.violet} />
        </div>
      </Camera>
      <Sfx at={1} name="whoosh" vol={0.4} />
      <Sfx at={teen} name="ding" vol={0.35} />
      <Sfx at={doob - 4} name="error" vol={0.35} />
      <Sfx at={hisaab} name="stamp" vol={0.45} />
    </SceneShell>
  );
};

/* ===== S2: ₹10,000 on ads, ₹30,000 sale ===== */
export const S2AdSale: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useCurrentFrame();
  const ad = cue("s2", "das hazaar");
  const sale = cue("s2", "tees hazaar");
  return (
    <SceneShell dur={dur} noExit>
      <Camera dur={dur} punches={[sale]} push={0.02}>
        <MoneyRoom />
        <Enter delay={0} from="none" cfg="snappy" style={{ position: "absolute", left: 0, right: 0, top: 292, display: "flex", justifyContent: "center", zIndex: 8 }}>
          <Chip size={28} bg={C.violet} color={C.white} border={LINE}>
            MAAN LO · EXAMPLE
          </Chip>
        </Enter>
        <Pop at={ad} style={{ position: "absolute", left: 70, top: 420, zIndex: 6 }}>
          <Panel style={{ width: 430, padding: "22px 26px", transform: "rotate(-2deg)" }}>
            <div style={body(30, C.muted)}>AD PE LAGAYE</div>
            <div style={big(92, C.red)}>₹{count(f, 10000, ad - 8)}</div>
          </Panel>
        </Pop>
        <Pop at={sale} style={{ position: "absolute", left: 580, top: 420, zIndex: 6 }}>
          <Panel style={{ width: 430, padding: "22px 26px", transform: "rotate(2deg)" }}>
            <div style={body(30, C.muted)}>SALE AAYI</div>
            <div style={big(92, C.green)}>₹{count(f, 30000, sale - 8)}</div>
          </Panel>
        </Pop>
        <Pop at={sale + 8} style={{ position: "absolute", left: 455, top: 700, zIndex: 7 }}>
          <div style={{ ...big(70, C.white), background: C.green, border: `6px solid ${LINE}`, borderRadius: 999, padding: "10px 34px 0", boxShadow: `6px 6px 0 ${LINE}` }}>3x</div>
        </Pop>
        <Place x={330} y={790} s={0.78} z={5}>
          <Person
            look={ROHIT}
            seed="r152"
            track={[
              { at: -100, pose: "idle", mood: "neutral" },
              { at: ad, pose: "hold", mood: "neutral" },
              { at: sale, pose: "cheer", mood: "grin" },
            ]}
          />
        </Place>
      </Camera>
      <Sfx at={ad - 4} name="pop" vol={0.4} />
      <Sfx at={sale - 4} name="ding" vol={0.45} />
    </SceneShell>
  );
};

/* ===== S3: where the ₹30,000 goes ===== */
export const S3Break: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useCurrentFrame();
  const maal = cue("s3", "maal");
  const pack = cue("s3", "packing");
  const ret = cue("s3", "returns");
  return (
    <SceneShell dur={dur} noExit>
      <Camera dur={dur} punches={[maal, pack, ret]} push={0.02}>
        <MoneyRoom />
        <Enter delay={0} from="none" cfg="snappy" style={{ position: "absolute", left: 0, right: 0, top: 292, display: "flex", justifyContent: "center", zIndex: 8 }}>
          <Chip size={30} bg={LINE} color={C.white}>
            ₹30,000 KA HISAAB
          </Chip>
        </Enter>
        <div style={{ position: "absolute", left: 90, top: 400, zIndex: 6 }}>
          <StackBar
            w={900}
            segs={[
              { label: "Maal", amount: "₹12,000", frac: 0.4, color: C.violet, at: maal },
              { label: "Packing + delivery", amount: "₹5,400", frac: 0.18, color: ORANGE, at: pack },
              { label: "Returns + charges", amount: "₹3,600", frac: 0.12, color: C.red, at: ret },
            ]}
          />
        </div>
        <Pop at={maal} style={{ position: "absolute", left: 120, top: 900, zIndex: 6 }}>
          <Bottle level={0.8} w={130} label="MAAL" />
        </Pop>
        <Pop at={pack} style={{ position: "absolute", left: 300, top: 960, zIndex: 6 }}>
          <Parcel w={190} tag="COD" />
        </Pop>
        <Pop at={pack + 10} style={{ position: "absolute", left: 360, top: 1150, zIndex: 6 }}>
          <Truck w={220} />
        </Pop>
        <Pop at={ret} style={{ position: "absolute", left: 70, top: 1140, zIndex: 7 }}>
          <Chip size={30} bg={C.red} border={LINE}>
            ↩ RETURN
          </Chip>
        </Pop>
        <Place x={720} y={860} s={0.64} z={5}>
          <Person
            look={ROHIT}
            seed="r153"
            track={[
              { at: -100, pose: "idle", mood: "neutral" },
              { at: pack, pose: "shrug", mood: "sad" },
              { at: ret, pose: "sad", mood: "shock" },
            ]}
          />
        </Place>
      </Camera>
      <Sfx at={maal - 4} name="pop" vol={0.4} />
      <Sfx at={pack - 4} name="pop" vol={0.4} />
      <Sfx at={ret - 4} name="pop" vol={0.4} />
    </SceneShell>
  );
};

/* ===== S4: ₹30,000 − ₹21,000 − ₹10,000 = −₹1,000 ===== */
export const S4Overflow: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useCurrentFrame();
  const k = cue("s4", "ikkees hazaar");
  const ad = cue("s4", "das hazaar");
  const minus = cue("s4", "minus ek hazaar");
  const rows = [
    { l: "Sale", v: "+₹30,000", c: C.green, at: -8 },
    { l: "Kharcha", v: "−₹21,000", c: LINE, at: k },
    { l: "Ad", v: "−₹10,000", c: LINE, at: ad },
  ];
  return (
    <SceneShell dur={dur} noExit>
      <Camera dur={dur} punches={[minus]} push={0.02}>
        <MoneyRoom />
        <div style={{ position: "absolute", left: 110, top: 320, zIndex: 6 }}>
          <Panel style={{ width: 860, padding: "26px 40px 30px" }}>
            {rows.map((r) => {
              const p = ramp(f, r.at - 6, r.at + 4);
              return (
                <div key={r.l} style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", opacity: p, transform: `translateX(${(1 - p) * 40}px)`, padding: "6px 0" }}>
                  <div style={big(56)}>{r.l}</div>
                  <div style={big(76, r.c)}>{r.v}</div>
                </div>
              );
            })}
            <div style={{ height: 8, background: LINE, borderRadius: 4, margin: "16px 0 12px", transform: `scaleX(${ramp(f, minus - 10, minus)})`, transformOrigin: "left" }} />
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", opacity: ramp(f, minus - 4, minus + 4) }}>
              <div style={big(56)}>Haath mein</div>
              <div style={big(100, C.red)}>−₹1,000</div>
            </div>
          </Panel>
        </div>
        <div style={{ position: "absolute", left: 600, top: 920, zIndex: 9 }}>
          <Stamp at={minus + 6} text="LOSS" size={84} rotate={-10} color={C.red} />
        </div>
        <Place x={90} y={860} s={0.66} z={5}>
          <Person
            look={ROHIT}
            seed="r154"
            track={[
              { at: -100, pose: "idle", mood: "neutral" },
              { at: ad, pose: "shrug", mood: "sad" },
              { at: minus, pose: "sad", mood: "shock" },
            ]}
          />
        </Place>
      </Camera>
      <Sfx at={k - 4} name="tick" vol={0.35} />
      <Sfx at={ad - 4} name="tick" vol={0.35} />
      <Sfx at={minus - 2} name="error" vol={0.4} />
      <Sfx at={minus + 6} name="stamp" vol={0.45} />
    </SceneShell>
  );
};

/* ===== S5: ROAS counts sale, not cost; break-even here is 3.3 ===== */
export const S5Meter: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useCurrentFrame();
  const sale = cue("s5", "sale");
  const kharcha = cue("s5", "kharcha");
  const product = cue("s5", "product");
  const tt = cue("s5", "teen point teen");
  return (
    <SceneShell dur={dur} noExit>
      <Camera dur={dur} punches={[tt]} push={0.02}>
        <MoneyRoom />
        <div style={{ position: "absolute", left: 0, right: 0, top: 300, display: "flex", justifyContent: "center", gap: 24, zIndex: 8 }}>
          <Pop at={sale}>
            <Chip size={34} bg={C.green} border={LINE}>
              SALE ✓
            </Chip>
          </Pop>
          <Pop at={kharcha}>
            <Chip size={34} bg={C.red} border={LINE}>
              KHARCHA ✗
            </Chip>
          </Pop>
        </div>
        <Pop at={product} style={{ position: "absolute", left: 250, top: 520, zIndex: 6 }}>
          <Panel style={{ padding: "70px 30px 10px" }}>
            <Gauge value={3} line={3.3} w={680} p={ramp(f, product - 4, product + 24)} lineLabel={f >= tt - 4 ? "3.3" : undefined} />
          </Panel>
        </Pop>
        <Pop at={product + 16} style={{ position: "absolute", left: 470, top: 1030, zIndex: 7 }}>
          <Chip size={30} bg={LINE}>
            ABHI · 3.0 = LOSS
          </Chip>
        </Pop>
        <div style={{ position: "absolute", left: 600, top: 380, zIndex: 9 }}>
          <Stamp at={tt} text="3.3 CHAHIYE" size={58} rotate={-6} color={C.green} />
        </div>
        <Place x={-20} y={890} s={0.6} z={5}>
          <Person
            look={ROHIT}
            seed="r155"
            track={[
              { at: -100, pose: "shrug", mood: "neutral" },
              { at: tt, pose: "cheer", mood: "happy" },
            ]}
          />
        </Place>
      </Camera>
      <Sfx at={sale - 4} name="pop" vol={0.4} />
      <Sfx at={kharcha - 4} name="error" vol={0.3} />
      <Sfx at={product} name="tick" vol={0.35} />
      <Sfx at={tt} name="stamp" vol={0.45} />
    </SceneShell>
  );
};

/* ===== S6: three fixes ===== */
export const S6Fixes: React.FC<{ dur: number }> = ({ dur }) => (
  <FixBoard
    dur={dur}
    tag={TAG}
    mouth={sceneMouth("s6")}
    marks={[cue("s6", "poora"), cue("s6", "break even"), cue("s6", "ad")]}
    sub="maal + packing + delivery + returns"
    fixes={["Har product ka poora kharcha likho", "Break-even ROAS nikaalo", "Ad sirf usse upar badhao"]}
  />
);

/* ===== S7: CTA ===== */
const CalcIcon: React.FC = () => (
  <svg width={86} height={100} viewBox="0 0 86 100">
    <rect x={3} y={3} width={80} height={94} rx={14} fill={C.violet} stroke={C.navy} strokeWidth={5} />
    <rect x={14} y={14} width={58} height={22} rx={5} fill={C.lavender} />
    {[0, 1, 2].map((r) => [0, 1, 2].map((c) => <rect key={`${r}${c}`} x={14 + c * 21} y={46 + r * 16} width={15} height={10} rx={3} fill={r === 2 && c === 2 ? "#2BD46B" : C.white} />))}
  </svg>
);

const FallChart: React.FC<{ p: number }> = ({ p }) => (
  <svg width={300} height={110} viewBox="0 0 300 120">
    <path d="M10,20 L80,30 L130,26 L180,70 L230,84 L290,108" fill="none" stroke={C.red} strokeWidth={9} strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - p} />
  </svg>
);

export const S7Cta: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useCurrentFrame();
  const kal = cue("s7", "kal");
  return (
    <CtaScene
      dur={dur}
      tag={TAG}
      mouth={sceneMouth("s7")}
      keyword="ROAS"
      typeAt={cue("s7", "aar o e es") - 8}
      giftAt={cue("s7", "break even") - 6}
      giftTitle="Break-even ROAS Calculator"
      giftSub="free · Google Sheet · 2 minute"
      giftIcon={<CalcIcon />}
      nextAt={kal}
      nextNum="#16"
      nextLabel="KAL DOPAHAR 1 BAJE · AGLA CASE"
      next={
        <>
          <div style={big(54)}>Diwali ke baad</div>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{ ...big(60, C.white), background: C.red, borderRadius: 16, padding: "8px 20px 0" }}>SALE</div>
            <div style={big(54)}>kyun girti hai?</div>
          </div>
          <FallChart p={ramp(f, kal + 10, kal + 34)} />
        </>
      }
      followAt={cue("s7", "follow")}
    />
  );
};
