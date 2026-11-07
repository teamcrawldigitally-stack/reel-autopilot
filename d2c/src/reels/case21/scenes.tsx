// CASE #21 APPS — cartoon look (remade 7 Nov 2026 from the dark-blue version; same script and voice).
import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { Person, ROHIT } from "../../components/Cartoon";
import { Camera } from "../../components/fx";
import { HookTitle, LINE, Place, makeMouth } from "../../components/format";
import { Chip, Enter, SceneShell, Sfx, clamp, inr } from "../../components/kit";
import { MoneyRoom } from "../../components/sets";
import { CtaScene, FixBoard, Panel, Pop, ToonPhone, big, body, ramp } from "../../components/toon";
import { Stamp } from "../../components/widgets";
import { C } from "../../theme";
import { T, cue } from "./timeline";

const sceneMouth = makeMouth(T);
const TAG = "CASE #21";
const COLORS = ["#6D4AFD", "#F5A25D", "#20B2A0", "#E5484D", "#F5B400", "#3B82F6", "#EC4899"];
const NAMES = ["Review", "Popup", "Design", "Chat", "Upsell", "Email", "Quiz"];

/** App icon tile; `dead` = not opened in 30 days (grey + cobweb). */
const App: React.FC<{ i: number; s?: number; dead?: number; price?: boolean }> = ({ i, s = 110, dead = 0, price }) => (
  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
    <div style={{ position: "relative", width: s, height: s, borderRadius: s * 0.26, background: COLORS[i % 7], border: `5px solid ${LINE}`, display: "flex", alignItems: "center", justifyContent: "center", ...big(s * 0.46, C.white), paddingTop: s * 0.06, boxSizing: "border-box", filter: `grayscale(${dead})`, opacity: 1 - 0.35 * dead }}>
      {NAMES[i % 7][0]}
      {dead > 0.5 && (
        <svg width={s * 0.6} height={s * 0.6} viewBox="0 0 60 60" style={{ position: "absolute", right: -6, top: -6 }}>
          <path d="M60 0 L0 0 M60 0 L60 60 M60 0 L18 42 M60 0 L34 52 M60 0 L8 26 M48 0 Q44 12 60 14 M36 0 Q30 24 60 26 M22 0 Q18 36 60 40" stroke={LINE} strokeWidth={2.5} fill="none" />
        </svg>
      )}
    </div>
    {price && <div style={body(s * 0.24)}>₹700</div>}
  </div>
);

/* ===== S1: hook ===== */
export const S1Hook: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useCurrentFrame();
  const p5 = cue("s1", "paanch hazaar");
  const nahi = cue("s1", "nahi");
  return (
    <SceneShell dur={dur} noExit>
      <Camera dur={dur} punches={[p5, nahi]} push={0.03}>
        <MoneyRoom />
        <HookTitle
          top={300}
          lines={[
            { text: "₹5,000 har mahine", at: -8, kind: "plain", size: 86, rot: -1 },
            { text: "bina khule apps pe?", at: -6, kind: "red", size: 84, rot: 2 },
          ]}
        />
        <div style={{ position: "absolute", left: 90, top: 640, zIndex: 6 }}>
          <ToonPhone w={400} h={640}>
            <div style={{ position: "absolute", left: 30, right: 30, top: 80, display: "grid", gridTemplateColumns: "repeat(3, 1fr)", rowGap: 30, justifyItems: "center" }}>
              {Array.from({ length: 9 }).map((_, i) => (
                <App key={i} i={i} s={92} dead={[1, 4, 6, 7].includes(i) ? ramp(f, nahi - 6 + i, nahi + 4 + i) : 0} />
              ))}
            </div>
          </ToonPhone>
        </div>
        {f >= p5 - 4 && (
          <div style={{ position: "absolute", left: 470, top: 760, zIndex: 7 }}>
            {[0, 1, 2, 3].map((i) => {
              const t = ((f - p5 + i * 7) % 28) / 28;
              return <div key={i} style={{ position: "absolute", left: t * 160, top: -t * 120 + i * 30, opacity: 1 - t, ...big(56, C.green) }}>₹</div>;
            })}
          </div>
        )}
        <Place x={600} y={700} s={0.8} z={5}>
          <Person
            look={ROHIT}
            seed="r211"
            track={[
              { at: -100, pose: "idle", mood: "neutral" },
              { at: p5, pose: "shrug", mood: "shock" },
              { at: nahi, pose: "sad", mood: "sad" },
            ]}
          />
        </Place>
      </Camera>
      <Sfx at={1} name="whoosh" vol={0.4} />
      <Sfx at={p5 - 2} name="error" vol={0.3} />
      <Sfx at={nahi} name="pop" vol={0.3} />
    </SceneShell>
  );
};

/* ===== S2: Rohit's card statement ===== */
export const S2Statement: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useCurrentFrame();
  const card = cue("s2", "card statement");
  const rows = [
    { t: "Review app", at: cue("s2", "review") },
    { t: "Popup app", at: cue("s2", "popup") },
    { t: "Design tool", at: cue("s2", "design") },
  ];
  const chaar = cue("s2", "chaar");
  return (
    <SceneShell dur={dur} noExit>
      <Camera dur={dur} push={0.02}>
        <MoneyRoom />
        <Pop at={card} style={{ position: "absolute", left: 90, top: 330, zIndex: 6 }}>
          <Panel style={{ width: 600, padding: "24px 30px 28px", transform: "rotate(-2deg)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: `4px dashed ${LINE}`, paddingBottom: 12, marginBottom: 14 }}>
              <div style={big(40)}>Card Statement</div>
              <div style={body(24, C.muted)}>OCT</div>
            </div>
            {rows.map((r) => {
              const p = ramp(f, r.at - 6, r.at + 4);
              return (
                <div key={r.t} style={{ display: "flex", justifyContent: "space-between", opacity: p, transform: `translateX(${(1 - p) * 30}px)`, padding: "8px 0" }}>
                  <div style={big(44)}>{r.t}</div>
                  <div style={big(44, C.red)}>₹700</div>
                </div>
              );
            })}
            <div style={{ display: "flex", justifyContent: "space-between", opacity: ramp(f, chaar - 6, chaar + 4), padding: "8px 0" }}>
              <div style={big(44, C.violet)}>+ 4 aur</div>
              <div style={big(44, C.red)}>₹2,800</div>
            </div>
          </Panel>
        </Pop>
        <Place x={640} y={760} s={0.78} z={5}>
          <Person
            look={ROHIT}
            seed="r212"
            track={[
              { at: -100, pose: "hold", mood: "neutral" },
              { at: chaar, pose: "shrug", mood: "shock" },
            ]}
          />
        </Place>
      </Camera>
      {rows.map((r, i) => (
        <Sfx key={i} at={r.at - 4} name="tick" vol={0.3} />
      ))}
      <Sfx at={chaar - 4} name="pop" vol={0.35} />
    </SceneShell>
  );
};

/* ===== S3: 7 apps × ₹700 = ₹4,900 a month = ₹58,800 a year ===== */
export const S3Math: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useCurrentFrame();
  const saat = cue("s3", "saat");
  const month = cue("s3", "chaar hazaar nau sau");
  const year = cue("s3", "atthavan hazaar aath sau");
  const yv = interpolate(f, [year - 6, year + 14], [4900, 58800], { ...clamp, easing: (t) => 1 - Math.pow(1 - t, 3) });
  return (
    <SceneShell dur={dur} noExit>
      <Camera dur={dur} punches={[month, year]} push={0.02}>
        <MoneyRoom />
        <Enter delay={0} from="none" cfg="snappy" style={{ position: "absolute", left: 0, right: 0, top: 292, display: "flex", justifyContent: "center", zIndex: 8 }}>
          <Chip size={28} bg={C.violet} color={C.white} border={LINE}>
            MAAN LO · EXAMPLE
          </Chip>
        </Enter>
        <div style={{ position: "absolute", left: 60, right: 60, top: 400, display: "flex", justifyContent: "space-between", zIndex: 6 }}>
          {Array.from({ length: 7 }).map((_, i) => (
            <Pop key={i} at={saat + i * 3}>
              <App i={i} s={118} price />
            </Pop>
          ))}
        </div>
        <Pop at={month} style={{ position: "absolute", left: 90, top: 640, zIndex: 6 }}>
          <Panel style={{ width: 420, padding: "18px 26px" }}>
            <div style={body(28, C.muted)}>HAR MAHINE</div>
            <div style={big(84, C.red)}>₹4,900</div>
          </Panel>
        </Pop>
        <Pop at={year} style={{ position: "absolute", left: 90, top: 880, zIndex: 7 }}>
          <Panel style={{ width: 560, padding: "18px 26px", transform: "rotate(-2deg)" }} bg="#FFF1F1">
            <div style={body(30, C.muted)}>SAAL KA</div>
            <div style={big(118, C.red)}>₹{inr(yv)}</div>
          </Panel>
        </Pop>
        <Place x={690} y={760} s={0.72} z={5}>
          <Person
            look={ROHIT}
            seed="r213"
            track={[
              { at: -100, pose: "idle", mood: "neutral" },
              { at: month, pose: "shrug", mood: "sad" },
              { at: year, pose: "shrug", mood: "shock" },
            ]}
          />
        </Place>
      </Camera>
      <Sfx at={saat} name="tick" vol={0.3} />
      <Sfx at={month - 4} name="pop" vol={0.4} />
      <Sfx at={year - 4} name="error" vol={0.35} />
    </SceneShell>
  );
};

/* ===== S4: 3 of them not opened once in 30 days ===== */
export const S4Dead: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useCurrentFrame();
  const teen = cue("s4", "teen");
  const tees = cue("s4", "tees");
  const nahi = cue("s4", "nahi");
  const dead = [1, 4, 6];
  return (
    <SceneShell dur={dur} noExit>
      <Camera dur={dur} punches={[nahi]} push={0.02}>
        <MoneyRoom />
        <Pop at={tees} style={{ position: "absolute", left: 0, right: 0, top: 300, display: "flex", justifyContent: "center", zIndex: 8 }}>
          <Chip size={32} bg={LINE}>
            PICHLE 30 DIN · KITNI BAAR KHULA?
          </Chip>
        </Pop>
        <div style={{ position: "absolute", left: 60, right: 60, top: 430, display: "flex", justifyContent: "space-between", zIndex: 6 }}>
          {Array.from({ length: 7 }).map((_, i) => {
            const isDead = dead.includes(i);
            const d = isDead ? ramp(f, teen - 4 + dead.indexOf(i) * 4, teen + 6 + dead.indexOf(i) * 4) : 0;
            return (
              <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10, transform: `translateY(${isDead ? d * 20 : 0}px)` }}>
                <App i={i} s={118} dead={d} />
                {isDead && <div style={{ ...big(44, C.red), opacity: ramp(f, nahi - 6, nahi + 2) }}>0x</div>}
              </div>
            );
          })}
        </div>
        <div style={{ position: "absolute", left: 360, top: 700, zIndex: 9 }}>
          <Stamp at={nahi + 4} text="₹2,100 BEKAAR" size={60} rotate={-8} color={C.red} />
        </div>
        <Place x={330} y={820} s={0.7} z={5}>
          <Person
            look={ROHIT}
            seed="r214"
            track={[
              { at: -100, pose: "idle", mood: "neutral" },
              { at: nahi, pose: "sad", mood: "sad" },
            ]}
          />
        </Place>
      </Camera>
      <Sfx at={teen - 2} name="tick" vol={0.3} />
      <Sfx at={nahi + 4} name="stamp" vol={0.45} />
    </SceneShell>
  );
};

/* ===== S5: fixes ===== */
export const S5Fixes: React.FC<{ dur: number }> = ({ dur }) => (
  <FixBoard
    dur={dur}
    tag={TAG}
    mouth={sceneMouth("s5")}
    marks={[cue("s5", "card statement"), cue("s5", "tees"), cue("s5", "roz")]}
    sub="card statement kholo"
    fixes={["Har subscription likho", "30 din se nahi khula? Band", "Roz wale 2-3 apps: yearly plan"]}
  />
);

/* ===== S6: CTA ===== */
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

export const S6Cta: React.FC<{ dur: number }> = ({ dur }) => (
  <CtaScene
    dur={dur}
    tag={TAG}
    mouth={sceneMouth("s6")}
    keyword="APPS"
    typeAt={cue("s6", "apps") - 8}
    giftAt={cue("s6", "subscription") - 6}
    giftTitle="Subscription Audit Sheet"
    giftSub="free · 10 minute mein poora hisaab"
    giftIcon={<SheetIcon />}
    nextAt={cue("s6", "kal")}
    nextNum="#22"
    nextLabel="KAL DOPAHAR 1 BAJE · AGLA CASE"
    next={
      <>
        <div style={big(54)}>₹5 ka sample, aur</div>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{ ...big(60, C.white), background: C.green, borderRadius: 16, padding: "8px 20px 0" }}>₹500</div>
          <div style={big(54)}>ka agla order?</div>
        </div>
      </>
    }
    followAt={cue("s6", "follow")}
  />
);
