// CASE #26 SPEED — cartoon look (remade 7 Nov 2026 from the dark-blue version; same script and voice).
import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { Person, PRIYA, ROHIT } from "../../components/Cartoon";
import { Camera } from "../../components/fx";
import { HookTitle, LINE, Place, makeMouth } from "../../components/format";
import { SerumBottle } from "../../components/hisaabArt";
import { Chip, SceneShell, Sfx, clamp } from "../../components/kit";
import { MoneyRoom } from "../../components/sets";
import { CtaScene, FixBoard, Folk, Panel, Pop, ToonPhone, ToonSpinner, big, body, ramp } from "../../components/toon";
import { Stamp } from "../../components/widgets";
import { C } from "../../theme";
import { T, cue } from "./timeline";

const sceneMouth = makeMouth(T);
const TAG = "CASE #26";

/** Loading page inside the phone. */
const Loading: React.FC<{ secs?: number; url?: string }> = ({ secs, url = "rohitskin.in" }) => (
  <div style={{ position: "absolute", inset: 0 }}>
    <div style={{ position: "absolute", left: 20, right: 20, top: 60, height: 50, borderRadius: 16, background: "#F1ECFB", display: "flex", alignItems: "center", justifyContent: "center", ...body(22, C.muted) }}>{url}</div>
    <div style={{ position: "absolute", left: 0, right: 0, top: 170, display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      <ToonSpinner s={150} color={secs !== undefined && secs >= 3 ? C.red : LINE} />
      {secs !== undefined && <div style={{ ...big(110, secs >= 3 ? C.red : LINE), fontVariantNumeric: "tabular-nums" }}>{secs.toFixed(1)}s</div>}
    </div>
    <div style={{ position: "absolute", left: 24, right: 24, bottom: 40, display: "flex", flexDirection: "column", gap: 14, opacity: 0.6 }}>
      <div style={{ height: 26, width: "80%", borderRadius: 10, background: "#ECE6F8" }} />
      <div style={{ height: 26, width: "55%", borderRadius: 10, background: "#ECE6F8" }} />
    </div>
  </div>
);

/* ===== S1: hook ===== */
export const S1Hook: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useCurrentFrame();
  const khuli = cue("s1", "khuli") + 9;
  const aadhe = cue("s1", "aadhe");
  const secs = Math.min(3, (f / khuli) * 3);
  return (
    <SceneShell dur={dur} noExit>
      <Camera dur={dur} punches={[aadhe]} push={0.03}>
        <MoneyRoom />
        <HookTitle
          top={300}
          lines={[
            { text: "Website 3 sec late?", at: -8, kind: "plain", size: 86, rot: -1 },
            { text: "aadhe log gaye!", at: -6, kind: "red", size: 100, rot: 2 },
          ]}
        />
        <div style={{ position: "absolute", left: 80, top: 640, zIndex: 6 }}>
          <ToonPhone w={390} h={680}>
            <Loading secs={secs} />
          </ToonPhone>
        </div>
        <div style={{ position: "absolute", left: 540, top: 700, display: "grid", gridTemplateColumns: "repeat(5, 92px)", rowGap: 22, zIndex: 6 }}>
          {Array.from({ length: 10 }).map((_, i) => {
            const go = i % 2 === 1 ? ramp(f, aadhe - 4 + i, aadhe + 10 + i) : 0;
            return (
              <div key={i} style={{ transform: `translate(${go * 120}px, ${-go * 40}px)`, opacity: 1 - go }}>
                <Folk s={70} color={go > 0.05 ? C.red : C.lavender} />
              </div>
            );
          })}
        </div>
        <Pop at={aadhe + 6} style={{ position: "absolute", left: 560, top: 1040, zIndex: 8 }}>
          <Chip size={34} bg={C.red} border={LINE}>
            10 MEIN SE 5 GAYE
          </Chip>
        </Pop>
      </Camera>
      <Sfx at={1} name="whoosh" vol={0.4} />
      <Sfx at={khuli - 2} name="error" vol={0.3} />
      <Sfx at={aadhe - 4} name="swish" vol={0.45} />
    </SceneShell>
  );
};

/* ===== S2: Priya taps the ad; spinner; 1, 2, 3 ===== */
export const S2Spin: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useCurrentFrame();
  const tap = cue("s2", "tap");
  const spin = cue("s2", "spinner");
  const counts = [cue("s2", "ek"), cue("s2", "do"), cue("s2", "teen")];
  const swap = ramp(f, spin - 8, spin + 2);
  const cur = counts.reduce((a, c, i) => (f >= c - 2 ? i : a), -1);
  const rip = ramp(f, tap, tap + 14);
  return (
    <SceneShell dur={dur} noExit>
      <Camera dur={dur} punches={counts} push={0.02}>
        <MoneyRoom />
        <div style={{ position: "absolute", left: 560, top: 330, zIndex: 6 }}>
          <ToonPhone w={430} h={760}>
            <div style={{ position: "absolute", inset: 0, opacity: 1 - swap }}>
              <div style={{ position: "absolute", left: 0, right: 0, top: 60, display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
                <div style={body(22, C.muted)}>Sponsored · rohitskin</div>
                <div style={{ width: 360, height: 360, borderRadius: 20, background: "#FFE1CC", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <SerumBottle h={300} label="GLOW" />
                </div>
                <div style={{ position: "relative", ...big(44, C.white), background: f >= tap && f < tap + 8 ? C.violetDeep : C.violet, border: `5px solid ${LINE}`, borderRadius: 18, padding: "10px 40px 2px" }}>
                  Shop Now
                  {f >= tap && <div style={{ position: "absolute", left: "50%", top: "50%", width: 160, height: 160, margin: "-80px 0 0 -80px", borderRadius: "50%", border: `6px solid ${LINE}`, transform: `scale(${0.3 + rip})`, opacity: 1 - rip }} />}
                </div>
              </div>
            </div>
            {f >= spin - 8 && (
              <div style={{ position: "absolute", inset: 0, opacity: swap }}>
                <Loading url="rohitskin.in/serum" />
              </div>
            )}
          </ToonPhone>
        </div>
        {cur >= 0 && (
          <div style={{ position: "absolute", left: 590, top: 1110, display: "flex", gap: 24, zIndex: 8 }}>
            {[1, 2, 3].map((k, i) => {
              const p = ramp(f, counts[i] - 6, counts[i] + 2);
              return (
                <div key={k} style={{ width: 110, height: 110, borderRadius: "50%", background: i <= cur ? (i === 2 ? C.red : LINE) : C.white, border: `5px solid ${LINE}`, display: "flex", alignItems: "center", justifyContent: "center", ...big(66, i <= cur ? C.white : C.lavender), paddingTop: 6, boxSizing: "border-box", transform: `scale(${i <= cur ? 0.7 + 0.3 * p : 0.8})` }}>
                  {k}
                </div>
              );
            })}
          </div>
        )}
        <Place x={60} y={720} s={0.82} z={5}>
          <Person
            look={PRIYA}
            seed="p262"
            track={[
              { at: -100, pose: "hold", mood: "happy" },
              { at: tap, pose: "hold", mood: "grin" },
              { at: spin + 10, pose: "hold", mood: "neutral" },
              { at: counts[1], pose: "hold", mood: "sad" },
              { at: counts[2], pose: "shrug", mood: "shout" },
            ]}
          />
        </Place>
      </Camera>
      <Sfx at={tap - 1} name="pop" vol={0.4} />
      <Sfx at={spin - 8} name="swish" vol={0.3} />
      {counts.map((c, i) => (
        <Sfx key={i} at={c - 2} name="tick" vol={0.4} />
      ))}
    </SceneShell>
  );
};

/* ===== S3: she pressed back; ad money spent, no order ===== */
export const S3Back: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useCurrentFrame();
  const back = cue("s3", "back");
  const paisa = cue("s3", "paisa");
  const order = cue("s3", "order");
  return (
    <SceneShell dur={dur} noExit>
      <Camera dur={dur} punches={[back, order]} push={0.02}>
        <MoneyRoom />
        <Pop at={back} style={{ position: "absolute", left: 120, top: 330, zIndex: 8 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
            <div style={{ width: 120, height: 120, borderRadius: "50%", background: C.white, border: `6px solid ${LINE}`, boxShadow: `6px 6px 0 ${LINE}`, display: "flex", alignItems: "center", justifyContent: "center", ...big(80), paddingBottom: 6, boxSizing: "border-box" }}>←</div>
            <div style={big(64)}>BACK</div>
          </div>
        </Pop>
        <Pop at={paisa} style={{ position: "absolute", left: 520, top: 470, zIndex: 6 }}>
          <Panel style={{ width: 460, padding: "18px 26px" }}>
            <div style={body(28, C.muted)}>AD KA PAISA</div>
            <div style={big(76, C.red)}>KAT GAYA</div>
          </Panel>
        </Pop>
        <Pop at={order} style={{ position: "absolute", left: 520, top: 720, zIndex: 6 }}>
          <Panel style={{ width: 460, padding: "18px 26px" }}>
            <div style={body(28, C.muted)}>ORDER</div>
            <div style={big(96, LINE)}>0</div>
          </Panel>
        </Pop>
        <Place x={60} y={720} s={0.82} z={5}>
          <Person
            look={PRIYA}
            seed="p263"
            track={[
              { at: -100, pose: "shrug", mood: "shout" },
              { at: back + 4, pose: "wave", mood: "neutral" },
            ]}
          />
        </Place>
        <div style={{ position: "absolute", left: 600, top: 1000, zIndex: 9 }}>
          <Stamp at={order + 8} text="NO SALE" size={64} rotate={-8} color={C.red} />
        </div>
      </Camera>
      <Sfx at={back - 2} name="swish" vol={0.4} />
      <Sfx at={paisa - 4} name="error" vol={0.3} />
      <Sfx at={order + 8} name="stamp" vol={0.4} />
    </SceneShell>
  );
};

/* ===== S4: Google mobile data — over 3 seconds, more than half leave ===== */
export const S4Stat: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useCurrentFrame();
  const google = cue("s4", "google");
  const sec = cue("s4", "teen second");
  const aadhe = cue("s4", "aadhe");
  const lit = Math.round(interpolate(f, [aadhe - 4, aadhe + 24], [0, 53], clamp));
  return (
    <SceneShell dur={dur} noExit>
      <Camera dur={dur} punches={[aadhe]} push={0.02}>
        <MoneyRoom />
        <Pop at={google} style={{ position: "absolute", left: 0, right: 0, top: 300, display: "flex", justifyContent: "center", zIndex: 8 }}>
          <Chip size={30} bg={C.white} color={LINE} border={LINE}>
            GOOGLE · MOBILE SITE DATA
          </Chip>
        </Pop>
        <Pop at={sec} style={{ position: "absolute", left: 90, top: 400, zIndex: 6 }}>
          <Panel style={{ padding: 22 }}>
            <div style={{ ...body(26, C.muted), marginBottom: 12 }}>PAGE 3 SEC+ · 100 VISITORS</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(10, 52px)", rowGap: 8 }}>
              {Array.from({ length: 100 }).map((_, i) => {
                const on = i < lit;
                return <div key={i} style={{ width: 40, height: 40, borderRadius: "50%", background: on ? C.red : C.lavenderSoft, border: `3px solid ${LINE}`, boxSizing: "border-box" }} />;
              })}
            </div>
          </Panel>
        </Pop>
        <Pop at={aadhe} style={{ position: "absolute", left: 680, top: 470, zIndex: 7 }}>
          <Panel style={{ padding: "16px 26px", transform: "rotate(3deg)" }} bg="#FFF1F1">
            <div style={big(120, C.red)}>{lit}%</div>
            <div style={big(40)}>chale gaye</div>
          </Panel>
        </Pop>
        <Pop at={aadhe + 20} style={{ position: "absolute", left: 90, top: 985, zIndex: 7 }}>
          <div style={{ ...body(24, LINE), background: "rgba(255,255,255,0.85)", borderRadius: 10, padding: "6px 12px" }}>Source: Google/DoubleClick, mobile speed study (2016)</div>
        </Pop>
      </Camera>
      <Sfx at={google - 2} name="pop" vol={0.3} />
      <Sfx at={aadhe - 4} name="tick" vol={0.35} />
      <Sfx at={aadhe + 20} name="ding" vol={0.35} />
    </SceneShell>
  );
};

/* ===== S5: fixes ===== */
export const S5Fixes: React.FC<{ dur: number }> = ({ dur }) => (
  <FixBoard
    dur={dur}
    tag={TAG}
    mouth={sceneMouth("s5")}
    marks={[cue("s5", "product"), cue("s5", "apps"), cue("s5", "mobile")]}
    sub="website tez karo"
    fixes={["Product photos chhoti karo", "Bekaar apps aur popups hatao", "Mobile data pe khud kholke dekho"]}
  />
);

/* ===== S6: CTA ===== */
const SpeedIcon: React.FC = () => (
  <svg width={86} height={100} viewBox="0 0 86 100">
    <rect x={3} y={3} width={80} height={94} rx={12} fill={C.violet} stroke={C.navy} strokeWidth={5} />
    <path d="M18 66 A26 26 0 0 1 68 66" stroke={C.white} strokeWidth={7} fill="none" strokeLinecap="round" />
    <line x1={43} y1={66} x2={60} y2={46} stroke="#2BD46B" strokeWidth={6} strokeLinecap="round" />
    <circle cx={43} cy={66} r={5} fill={C.white} />
  </svg>
);

export const S6Cta: React.FC<{ dur: number }> = ({ dur }) => (
  <CtaScene
    dur={dur}
    tag={TAG}
    mouth={sceneMouth("s6")}
    keyword="SPEED"
    typeAt={cue("s6", "speed") - 8}
    giftAt={cue("s6", "website") - 6}
    giftTitle="Website Speed Checklist"
    giftSub="free · 10 cheezein, 30 minute mein"
    giftIcon={<SpeedIcon />}
    nextAt={cue("s6", "aaj")}
    nextNum="#27"
    nextLabel="AAJ SHAAM 7 BAJE · AGLA CASE"
    next={
      <>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{ ...big(56, C.white), background: C.violet, borderRadius: 16, padding: "8px 20px 0" }}>990 log</div>
          <div style={big(48)}>bina khareede gaye,</div>
        </div>
        <div style={big(48)}>unhe wapas kaise laayein?</div>
      </>
    }
    followAt={cue("s6", "follow")}
  />
);

void ROHIT;
