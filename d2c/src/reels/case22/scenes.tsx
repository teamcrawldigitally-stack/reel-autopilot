// CASE #22 SAMPLE — cartoon look (remade 7 Nov 2026 from the dark-blue version; same script and voice).
import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { Parcel, Person, PRIYA } from "../../components/Cartoon";
import { Camera } from "../../components/fx";
import { HookTitle, LINE, Place, makeMouth } from "../../components/format";
import { Chip, Enter, SceneShell, Sfx, clamp } from "../../components/kit";
import { Bottle } from "../../components/props";
import { Doorstep, MoneyRoom } from "../../components/sets";
import { CtaScene, FixBoard, Panel, Pop, big, body, ramp } from "../../components/toon";
import { Stamp } from "../../components/widgets";
import { C } from "../../theme";
import { T, cue } from "./timeline";

const sceneMouth = makeMouth(T);
const TAG = "CASE #22";

/** Small sample sachet. */
export const Sachet: React.FC<{ w?: number; rot?: number }> = ({ w = 150, rot = -8 }) => (
  <svg width={w} height={w * 1.3} viewBox="0 0 100 130" style={{ transform: `rotate(${rot}deg)`, overflow: "visible" }}>
    <path d="M6 10 L14 2 L22 10 L30 2 L38 10 L46 2 L54 10 L62 2 L70 10 L78 2 L86 10 L94 2 L94 124 L6 124 Z" fill="#FDE2EC" stroke={LINE} strokeWidth={5} strokeLinejoin="round" />
    <rect x={18} y={40} width={64} height={46} rx={8} fill={C.white} stroke={LINE} strokeWidth={4} />
    <text x={50} y={60} textAnchor="middle" fontFamily="Inter" fontWeight={900} fontSize={13} fill={LINE}>
      SERUM
    </text>
    <text x={50} y={78} textAnchor="middle" fontFamily="Inter" fontWeight={800} fontSize={11} fill={C.violet}>
      SAMPLE
    </text>
    <rect x={30} y={98} width={40} height={14} rx={4} fill={LINE} />
  </svg>
);

const PriceTag: React.FC<{ text: string; color: string }> = ({ text, color }) => <div style={{ ...big(56, C.white), background: color, border: `5px solid ${LINE}`, borderRadius: 16, padding: "8px 20px 0", boxShadow: `5px 5px 0 ${LINE}` }}>{text}</div>;

/* ===== S1: hook ===== */
export const S1Hook: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useCurrentFrame();
  const order = cue("s1", "order");
  return (
    <SceneShell dur={dur} noExit>
      <Camera dur={dur} punches={[order]} push={0.03}>
        <MoneyRoom />
        <HookTitle
          top={300}
          lines={[
            { text: "₹5 ka sample,", at: -8, kind: "plain", size: 90, rot: -1 },
            { text: "₹500 ka agla order", at: -6, kind: "green", size: 86, rot: 2 },
          ]}
        />
        <div style={{ position: "absolute", left: 80, top: 690, zIndex: 6, display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
          <Sachet w={170} />
          <PriceTag text="₹5" color={C.violet} />
        </div>
        <svg width={220} height={80} viewBox="0 0 220 80" style={{ position: "absolute", left: 290, top: 820, zIndex: 6 }}>
          <path d="M10 40 L180 40 M150 12 L190 40 L150 68" stroke={LINE} strokeWidth={12} fill="none" strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - ramp(f, 4, 30)} />
        </svg>
        <div style={{ position: "absolute", left: 520, top: 650, zIndex: 6, display: "flex", flexDirection: "column", alignItems: "center", gap: 14, transform: `scale(${0.85 + 0.15 * ramp(f, order - 10, order + 4)})` }}>
          <Bottle level={0.85} w={170} label="SERUM" />
          <PriceTag text="₹500" color={C.green} />
        </div>
        <Place x={720} y={760} s={0.72} z={5}>
          <Person
            look={PRIYA}
            seed="p221"
            track={[
              { at: -100, pose: "idle", mood: "happy" },
              { at: order, pose: "cheer", mood: "grin" },
            ]}
          />
        </Place>
      </Camera>
      <Sfx at={1} name="whoosh" vol={0.4} />
      <Sfx at={order - 4} name="ding" vol={0.4} />
    </SceneShell>
  );
};

/* ===== S2: Priya ordered face wash; a sachet of the new serum came inside ===== */
export const S2Parcel: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useCurrentFrame();
  const fw = cue("s2", "face wash");
  const sachet = cue("s2", "sachet");
  const naya = cue("s2", "naya");
  const up = ramp(f, sachet - 8, sachet + 8);
  return (
    <SceneShell dur={dur} noExit>
      <Camera dur={dur} punches={[sachet]} push={0.02}>
        <Doorstep />
        <Pop at={fw} style={{ position: "absolute", left: 0, right: 0, top: 300, display: "flex", justifyContent: "center", zIndex: 8 }}>
          <Chip size={32} bg={C.white} color={LINE} border={LINE}>
            ORDER · FACE WASH
          </Chip>
        </Pop>
        <div style={{ position: "absolute", left: 560, top: 860, zIndex: 6 }}>
          <Parcel w={320} tag="ORDER" />
        </div>
        <div style={{ position: "absolute", left: 640, top: 900 - up * 300, zIndex: 7, opacity: up, transform: `rotate(${(1 - up) * 30}deg)` }}>
          <Sachet w={170} rot={8} />
        </div>
        <Pop at={naya} style={{ position: "absolute", left: 0, right: 0, top: 400, display: "flex", justifyContent: "center", zIndex: 9 }}>
          <Chip size={30} bg={C.violet} border={LINE}>
            NAYA SERUM · FREE SAMPLE
          </Chip>
        </Pop>
        <Place x={90} y={760} s={0.8} z={5}>
          <Person
            look={PRIYA}
            seed="p222"
            track={[
              { at: -100, pose: "idle", mood: "neutral" },
              { at: fw, pose: "hold", mood: "happy" },
              { at: sachet, pose: "shrug", mood: "shock" },
              { at: naya + 6, pose: "hold", mood: "grin" },
            ]}
          />
        </Place>
      </Camera>
      <Sfx at={fw - 4} name="pop" vol={0.35} />
      <Sfx at={sachet - 6} name="swish" vol={0.4} />
      <Sfx at={naya - 4} name="ding" vol={0.35} />
    </SceneShell>
  );
};

/* ===== S3: she tried it; a month later, a full bottle for ₹500 ===== */
export const S3Order: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useCurrentFrame();
  const tryy = cue("s3", "try");
  const mahine = cue("s3", "mahine");
  const order = cue("s3", "order");
  const p500 = cue("s3", "paanch sau");
  return (
    <SceneShell dur={dur} noExit>
      <Camera dur={dur} punches={[p500]} push={0.02}>
        <MoneyRoom />
        <Pop at={tryy} style={{ position: "absolute", left: 90, top: 330, zIndex: 8 }}>
          <Chip size={30} bg={C.green} border={LINE}>
            TRY KIYA ✓
          </Chip>
        </Pop>
        <Pop at={mahine} style={{ position: "absolute", left: 520, top: 330, zIndex: 8 }}>
          <Chip size={30} bg={LINE}>
            1 MAHINA BAAD
          </Chip>
        </Pop>
        <Pop at={order} style={{ position: "absolute", left: 470, top: 470, zIndex: 6 }}>
          <Panel style={{ width: 500, padding: "22px 28px", display: "flex", alignItems: "center", gap: 24 }}>
            <Bottle level={0.9} w={120} label="SERUM" />
            <div>
              <div style={body(28, C.muted)}>NAYA ORDER</div>
              <div style={big(48)}>Poori bottle</div>
              <div style={{ ...big(96, C.green), opacity: ramp(f, p500 - 6, p500 + 2) }}>₹500</div>
            </div>
          </Panel>
        </Pop>
        <Place x={60} y={720} s={0.82} z={5}>
          <Person
            look={PRIYA}
            seed="p223"
            track={[
              { at: -100, pose: "hold", mood: "happy" },
              { at: order, pose: "cheer", mood: "grin" },
            ]}
          />
        </Place>
        {f >= tryy && f < mahine + 10 && (
          <div style={{ position: "absolute", left: 160, top: 760, zIndex: 9 }}>
            {[0, 1, 2].map((i) => (
              <div key={i} style={{ position: "absolute", left: i * 70, top: (i % 2) * 40, width: 34, height: 34, background: "#FFE27A", border: `4px solid ${LINE}`, borderRadius: 6, transform: `rotate(45deg) scale(${0.6 + 0.4 * Math.abs(Math.sin((f + i * 6) / 6))})` }} />
            ))}
          </div>
        )}
      </Camera>
      <Sfx at={tryy - 4} name="pop" vol={0.35} />
      <Sfx at={p500 - 4} name="ding" vol={0.45} />
    </SceneShell>
  );
};

/* ===== S4: 100 samples cost ₹500; if 5 buy a bottle, ₹2,500 in sales ===== */
export const S4Math: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useCurrentFrame();
  const sau = cue("s4", "sau");
  const kharcha = cue("s4", "kharcha");
  const paanch = cue("s4", "paanch", 2);
  const sale = cue("s4", "do hazaar paanch sau");
  const lit = Math.round(interpolate(f, [paanch - 2, paanch + 14], [0, 5], clamp));
  const greens = [12, 37, 58, 71, 94];
  return (
    <SceneShell dur={dur} noExit>
      <Camera dur={dur} punches={[sale]} push={0.02}>
        <MoneyRoom />
        <Enter delay={0} from="none" cfg="snappy" style={{ position: "absolute", left: 0, right: 0, top: 292, display: "flex", justifyContent: "center", zIndex: 8 }}>
          <Chip size={28} bg={C.violet} color={C.white} border={LINE}>
            MAAN LO · EXAMPLE
          </Chip>
        </Enter>
        <Pop at={sau} style={{ position: "absolute", left: 90, top: 390, zIndex: 6 }}>
          <Panel style={{ padding: 22 }}>
            <div style={{ ...body(26, C.muted), marginBottom: 12 }}>100 PARCEL · 100 SAMPLE</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(10, 46px)", rowGap: 8 }}>
              {Array.from({ length: 100 }).map((_, i) => {
                const on = greens.indexOf(i) >= 0 && greens.indexOf(i) < lit;
                return <div key={i} style={{ width: 34, height: 34, borderRadius: "50%", background: on ? C.green : C.lavenderSoft, border: `3px solid ${LINE}`, boxSizing: "border-box", transform: `scale(${on ? 1.2 : 1})` }} />;
              })}
            </div>
          </Panel>
        </Pop>
        <Pop at={kharcha} style={{ position: "absolute", left: 640, top: 400, zIndex: 7 }}>
          <Panel style={{ width: 360, padding: "16px 22px" }}>
            <div style={body(26, C.muted)}>KHARCHA</div>
            <div style={big(80, C.red)}>₹500</div>
          </Panel>
        </Pop>
        <Pop at={paanch} style={{ position: "absolute", left: 640, top: 620, zIndex: 7 }}>
          <Panel style={{ width: 360, padding: "16px 22px" }}>
            <div style={body(26, C.muted)}>5 LOG × ₹500</div>
            <div style={{ ...big(80, C.green), opacity: ramp(f, sale - 6, sale + 2) }}>₹2,500</div>
          </Panel>
        </Pop>
        <div style={{ position: "absolute", left: 650, top: 880, zIndex: 9 }}>
          <Stamp at={sale + 10} text="5x WAPAS" size={64} rotate={-8} color={C.green} />
        </div>
      </Camera>
      <Sfx at={sau - 4} name="pop" vol={0.35} />
      <Sfx at={kharcha - 4} name="tick" vol={0.3} />
      <Sfx at={paanch} name="tick" vol={0.3} />
      <Sfx at={sale - 4} name="ding" vol={0.45} />
      <Sfx at={sale + 10} name="stamp" vol={0.4} />
    </SceneShell>
  );
};

/* ===== S5: fixes ===== */
export const S5Fixes: React.FC<{ dur: number }> = ({ dur }) => (
  <FixBoard
    dur={dur}
    tag={TAG}
    mouth={sceneMouth("s5")}
    marks={[cue("s5", "sample"), cue("s5", "sachet"), cue("s5", "saat")]}
    sub="sample ka simple plan"
    fixes={["Woh sample do jo nahi khareeda", "Sachet pe QR ya link", "7 din baad WhatsApp: kaisa laga?"]}
  />
);

/* ===== S6: CTA ===== */
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

export const S6Cta: React.FC<{ dur: number }> = ({ dur }) => (
  <CtaScene
    dur={dur}
    tag={TAG}
    mouth={sceneMouth("s6")}
    keyword="SAMPLE"
    typeAt={cue("s6", "sample") - 8}
    giftAt={cue("s6", "plan") - 8}
    giftTitle="Sample Plan"
    giftSub="free · kya, kisko, kab bhejein"
    giftIcon={<PlanIcon />}
    nextAt={cue("s6", "aaj")}
    nextNum="#23"
    nextLabel="AAJ SHAAM 7 BAJE · AGLA CASE"
    next={
      <>
        <div style={big(54)}>₹0 ad budget mein</div>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div style={big(54)}>pehle</div>
          <div style={{ ...big(58, C.white), background: C.violet, borderRadius: 16, padding: "8px 20px 0" }}>100 order</div>
          <div style={big(54)}>kaise?</div>
        </div>
      </>
    }
    followAt={cue("s6", "follow")}
  />
);
