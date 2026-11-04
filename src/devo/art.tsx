// Code-drawn hero art for the Devotional look (no image files needed).
// Each piece is drawn in a 1080x1920 frame, centred around (540, 720).
import React from "react";
import { interpolate, useCurrentFrame } from "remotion";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const CX = 540;
const CY = 720;

export type ArtKind = "eclipse" | "comet" | "venus" | "saturn" | "sun" | "moon" | "kalash" | "book" | "phone" | "vault" | "hourglass" | "siblings";

// image key in the script -> code art
export const ART_FOR: Record<string, ArtKind> = {
  rahu: "eclipse",
  ketu: "comet",
  shukra: "venus",
  shani: "saturn",
  surya: "sun",
  chandra: "moon",
  amrit: "kalash",
  book: "book",
  midnight: "phone",
  longing: "vault",
  lifechange: "hourglass",
  siblings: "siblings",
};

const Svg: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{ position: "absolute", inset: 0, overflow: "visible" }} aria-hidden="true">
    {children}
  </svg>
);

const Glow: React.FC<{ id: string; sd?: number }> = ({ id, sd = 18 }) => (
  <filter id={id} x="-60%" y="-60%" width="220%" height="220%">
    <feGaussianBlur stdDeviation={sd} result="b" />
    <feMerge>
      <feMergeNode in="b" />
      <feMergeNode in="SourceGraphic" />
    </feMerge>
  </filter>
);

const Blur: React.FC<{ id: string; sd: number }> = ({ id, sd }) => (
  <filter id={id} x="-80%" y="-80%" width="260%" height="260%">
    <feGaussianBlur stdDeviation={sd} />
  </filter>
);

// Surface noise for planets.
const Noise: React.FC<{ id: string; freq?: number; seed?: number; alpha?: number }> = ({ id, freq = 0.012, seed = 2, alpha = 0.5 }) => (
  <filter id={id} x="0" y="0" width="100%" height="100%">
    <feTurbulence type="fractalNoise" baseFrequency={freq} numOctaves="4" seed={seed} />
    <feColorMatrix values={`0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 ${alpha * 2.2} ${-alpha * 0.8}`} />
    <feComposite in2="SourceGraphic" operator="in" />
  </filter>
);

const Ring: React.FC<{ r: number; color?: string; id: string }> = ({ r, color = "#D7262E", id }) => {
  const frame = useCurrentFrame();
  const flick = 0.82 + 0.18 * Math.sin(frame / 5) * Math.sin(frame / 13);
  return (
    <>
      <defs>
        <Glow id={`${id}-ring`} sd={14} />
      </defs>
      <circle cx={CX} cy={CY} r={r * 1.14} fill="none" stroke="rgba(255,255,255,0.16)" strokeWidth="3" />
      <circle cx={CX} cy={CY} r={r} fill="none" stroke={color} strokeWidth="9" filter={`url(#${id}-ring)`} opacity={flick} />
    </>
  );
};

// A lit sphere with surface texture, rim light and shadow side.
const Sphere: React.FC<{ id: string; r: number; c1: string; c2: string; c3: string; glow: string; noiseSeed?: number; noiseFreq?: number; spin?: number }> = ({ id, r, c1, c2, c3, glow, noiseSeed = 3, noiseFreq = 0.012, spin = 0 }) => (
  <>
    <defs>
      <radialGradient id={`${id}-g`} cx="38%" cy="34%" r="75%">
        <stop offset="0" stopColor={c1} />
        <stop offset="0.55" stopColor={c2} />
        <stop offset="1" stopColor={c3} />
      </radialGradient>
      <radialGradient id={`${id}-halo`} cx="50%" cy="50%" r="50%">
        <stop offset="0.55" stopColor={glow} stopOpacity="0.5" />
        <stop offset="1" stopColor={glow} stopOpacity="0" />
      </radialGradient>
      <radialGradient id={`${id}-shade`} cx="30%" cy="28%" r="90%">
        <stop offset="0.55" stopColor="#000" stopOpacity="0" />
        <stop offset="1" stopColor="#000" stopOpacity="0.75" />
      </radialGradient>
      <clipPath id={`${id}-clip`}>
        <circle cx={CX} cy={CY} r={r} />
      </clipPath>
      <Noise id={`${id}-n`} seed={noiseSeed} freq={noiseFreq} />
    </defs>
    <circle cx={CX} cy={CY} r={r * 1.9} fill={`url(#${id}-halo)`} />
    <circle cx={CX} cy={CY} r={r} fill={`url(#${id}-g)`} />
    <g clipPath={`url(#${id}-clip)`}>
      <rect x={CX - r * 2} y={CY - r} width={r * 4} height={r * 2} fill={c2} filter={`url(#${id}-n)`} opacity="0.55" transform={`translate(${(spin % (r * 2)) - r} 0)`} />
    </g>
    <circle cx={CX} cy={CY} r={r} fill={`url(#${id}-shade)`} />
    <circle cx={CX} cy={CY} r={r} fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth="3" />
  </>
);

// ---------- the pieces ----------

const Eclipse: React.FC = () => {
  const frame = useCurrentFrame();
  const rays = Array.from({ length: 28 });
  return (
    <Svg>
      <defs>
        <radialGradient id="ec-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0.42" stopColor="#FFB347" stopOpacity="0.95" />
          <stop offset="0.6" stopColor="#E8590C" stopOpacity="0.55" />
          <stop offset="1" stopColor="#8E0F16" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="ec-ray" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#FFF1C1" stopOpacity="0" />
          <stop offset="0.6" stopColor="#FFB347" stopOpacity="0.9" />
          <stop offset="1" stopColor="#FFF1C1" />
        </linearGradient>
        <Blur id="ec-b" sd={10} />
        <Glow id="ec-rim" sd={12} />
        <filter id="ec-smoke" x="-50%" y="-50%" width="200%" height="200%">
          <feTurbulence type="fractalNoise" baseFrequency="0.008" numOctaves="3" seed={Math.floor(frame / 3) % 50} result="t" />
          <feDisplacementMap in="SourceGraphic" in2="t" scale="60" />
          <feGaussianBlur stdDeviation="6" />
        </filter>
      </defs>
      <circle cx={CX} cy={CY} r={440 + Math.sin(frame / 15) * 14} fill="url(#ec-glow)" />
      <g transform={`rotate(${frame * 0.35} ${CX} ${CY})`} filter="url(#ec-b)">
        {rays.map((_, i) => {
          const len = 120 + 70 * (0.5 + 0.5 * Math.sin(frame / 9 + i * 1.7));
          return <path key={i} d={`M ${CX - 14} ${CY - 236} L ${CX} ${CY - 236 - len} L ${CX + 14} ${CY - 236} Z`} fill="url(#ec-ray)" transform={`rotate(${(i * 360) / rays.length} ${CX} ${CY})`} />;
        })}
      </g>
      <circle cx={CX} cy={CY} r={236} fill="none" stroke="#FFE7A0" strokeWidth="8" filter="url(#ec-rim)" />
      <circle cx={CX + 150} cy={CY - 182} r={20 + Math.sin(frame / 6) * 4} fill="#FFFFFF" filter="url(#ec-rim)" />
      <circle cx={CX} cy={CY} r={230} fill="#050203" />
      {/* smoke drifting across the black disc */}
      <g opacity="0.55" filter="url(#ec-smoke)">
        <ellipse cx={CX - 60} cy={CY + 40} rx={180} ry={60} fill="#3a2a30" />
        <ellipse cx={CX + 90} cy={CY - 70} rx={120} ry={40} fill="#2a1e24" />
      </g>
    </Svg>
  );
};

const Comet: React.FC = () => {
  const frame = useCurrentFrame();
  const parts = Array.from({ length: 70 });
  const hx = 700 + Math.sin(frame / 40) * 20;
  const hy = 560 + Math.cos(frame / 40) * 14;
  return (
    <Svg>
      <defs>
        <radialGradient id="co-head" cx="50%" cy="50%" r="50%">
          <stop offset="0" stopColor="#FFFFFF" />
          <stop offset="0.35" stopColor="#FFE0B0" />
          <stop offset="1" stopColor="#FF7A1A" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="co-tail" x1="1" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#FFD9A0" stopOpacity="0.9" />
          <stop offset="1" stopColor="#D7262E" stopOpacity="0" />
        </linearGradient>
        <Blur id="co-b" sd={16} />
        <Blur id="co-b2" sd={3} />
      </defs>
      <path d={`M ${hx} ${hy - 40} Q ${hx - 240} ${hy + 120} ${hx - 560} ${hy + 520} L ${hx - 420} ${hy + 560} Q ${hx - 180} ${hy + 180} ${hx + 30} ${hy + 30} Z`} fill="url(#co-tail)" filter="url(#co-b)" />
      {parts.map((_, i) => {
        const t = ((i * 37) % 100) / 100;
        const drift = ((frame * 2 + i * 13) % 120) / 120;
        const x = hx - (t * 500 + drift * 60) + Math.sin(i) * 30 * t;
        const y = hy + t * 480 + drift * 50 + Math.cos(i * 2) * 40 * t;
        return <circle key={i} cx={x} cy={y} r={2 + (1 - t) * 5} fill="#FFE7C0" opacity={(1 - t) * (1 - drift) * 0.9} filter="url(#co-b2)" />;
      })}
      <circle cx={hx} cy={hy} r={150} fill="url(#co-head)" />
      <circle cx={hx} cy={hy} r={34} fill="#FFFFFF" />
    </Svg>
  );
};

const Venus: React.FC = () => {
  const frame = useCurrentFrame();
  const s = 1 + 0.15 * Math.sin(frame / 10);
  return (
    <Svg>
      <Ring r={300} id="ve" />
      <Sphere id="ve" r={200} c1="#FFFBF2" c2="#F1D2BC" c3="#8C5E52" glow="#FFB4C8" noiseSeed={8} noiseFreq={0.006} spin={frame * 0.6} />
      <g transform={`translate(${CX - 170} ${CY - 170}) rotate(${frame * 0.8}) scale(${s})`}>
        <path d="M0,-70 C6,-6 6,-6 70,0 C6,6 6,6 0,70 C-6,6 -6,6 -70,0 C-6,-6 -6,-6 0,-70 Z" fill="#FFFFFF" />
      </g>
    </Svg>
  );
};

const SaturnArt: React.FC = () => {
  const frame = useCurrentFrame();
  const ring = (front: boolean) => (
    <g transform={`rotate(-14 ${CX} ${CY})`} clipPath={`url(#sa-${front ? "front" : "back"})`}>
      {[300, 285, 268, 245, 226].map((rx, i) => (
        <ellipse key={i} cx={CX} cy={CY} rx={rx} ry={rx * 0.24} fill="none" stroke={i % 2 ? "#BFA77A" : "#E6D3A8"} strokeWidth={i === 2 ? 14 : 6} opacity={0.9} />
      ))}
    </g>
  );
  return (
    <Svg>
      <defs>
        <clipPath id="sa-back">
          <rect x="0" y="0" width="1080" height={CY} transform={`rotate(-14 ${CX} ${CY})`} />
        </clipPath>
        <clipPath id="sa-front">
          <rect x="0" y={CY} width="1080" height="1920" transform={`rotate(-14 ${CX} ${CY})`} />
        </clipPath>
      </defs>
      <Ring r={330} id="sa" color="#D7262E" />
      {ring(false)}
      <Sphere id="sa" r={165} c1="#C9D6EE" c2="#5B6E92" c3="#141B2E" glow="#6C8CFF" noiseSeed={5} noiseFreq={0.004} spin={frame * 0.4} />
      {ring(true)}
    </Svg>
  );
};

const SunArt: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <Svg>
      <defs>
        <Blur id="su-b" sd={14} />
      </defs>
      <Ring r={320} id="su" />
      <g transform={`rotate(${frame * 0.5} ${CX} ${CY})`} filter="url(#su-b)">
        {Array.from({ length: 20 }).map((_, i) => {
          const len = 70 + 40 * (0.5 + 0.5 * Math.sin(frame / 8 + i));
          return <path key={i} d={`M ${CX - 18} ${CY - 214} L ${CX} ${CY - 214 - len} L ${CX + 18} ${CY - 214} Z`} fill="#FFC53D" transform={`rotate(${i * 18} ${CX} ${CY})`} />;
        })}
      </g>
      <Sphere id="su" r={215} c1="#FFF8D2" c2="#FFB020" c3="#D9480F" glow="#FF9F1A" noiseSeed={11} noiseFreq={0.03} spin={frame * 0.8} />
    </Svg>
  );
};

const MoonArt: React.FC = () => {
  const frame = useCurrentFrame();
  const craters: [number, number, number][] = [
    [-70, -40, 38],
    [60, 50, 28],
    [-20, 90, 22],
    [80, -80, 18],
    [-110, 50, 16],
    [20, -10, 14],
  ];
  return (
    <Svg>
      <Ring r={300} id="mo" color="#D7262E" />
      <Sphere id="mo" r={205} c1="#FBF8EF" c2="#C8C1B0" c3="#4E4A44" glow="#DCE6FF" noiseSeed={21} noiseFreq={0.02} spin={frame * 0.3} />
      {craters.map(([x, y, r], i) => (
        <g key={i}>
          <circle cx={CX + x} cy={CY + y} r={r} fill="rgba(80,74,66,0.35)" />
          <circle cx={CX + x + r * 0.15} cy={CY + y + r * 0.15} r={r * 0.82} fill="rgba(255,255,255,0.12)" />
        </g>
      ))}
    </Svg>
  );
};

const Kalash: React.FC = () => {
  const frame = useCurrentFrame();
  const drops = Array.from({ length: 16 });
  return (
    <Svg>
      <defs>
        <linearGradient id="ka-gold" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#7A4A0E" />
          <stop offset="0.35" stopColor="#F4C46A" />
          <stop offset="0.55" stopColor="#FFF0B8" />
          <stop offset="0.75" stopColor="#D99A2B" />
          <stop offset="1" stopColor="#6B3E08" />
        </linearGradient>
        <radialGradient id="ka-light" cx="50%" cy="50%" r="50%">
          <stop offset="0" stopColor="#FFE9A0" stopOpacity="0.95" />
          <stop offset="1" stopColor="#FF9F1A" stopOpacity="0" />
        </radialGradient>
        <Blur id="ka-b" sd={8} />
      </defs>
      <circle cx={CX} cy={CY - 230} r={300 + Math.sin(frame / 12) * 16} fill="url(#ka-light)" />
      <g transform={`rotate(${frame * 0.3} ${CX} ${CY - 230})`} opacity="0.5">
        {Array.from({ length: 14 }).map((_, i) => (
          <rect key={i} x={CX - 4} y={CY - 640} width="8" height="260" fill="#FFE7A0" transform={`rotate(${i * 25.7} ${CX} ${CY - 230})`} filter="url(#ka-b)" />
        ))}
      </g>
      {/* pot */}
      <path d={`M ${CX - 90} ${CY - 220} Q ${CX - 120} ${CY - 170} ${CX - 230} ${CY - 60} Q ${CX - 300} ${CY + 60} ${CX - 230} ${CY + 170} Q ${CX - 150} ${CY + 250} ${CX} ${CY + 255} Q ${CX + 150} ${CY + 250} ${CX + 230} ${CY + 170} Q ${CX + 300} ${CY + 60} ${CX + 230} ${CY - 60} Q ${CX + 120} ${CY - 170} ${CX + 90} ${CY - 220} Z`} fill="url(#ka-gold)" stroke="#5A3306" strokeWidth="6" />
      <rect x={CX - 130} y={CY - 260} width="260" height="46" rx="20" fill="url(#ka-gold)" stroke="#5A3306" strokeWidth="6" />
      {[CY - 40, CY + 60].map((y, i) => (
        <path key={i} d={`M ${CX - 262} ${y} Q ${CX} ${y + 40} ${CX + 262} ${y}`} fill="none" stroke="#FFF0B8" strokeWidth="6" opacity="0.8" />
      ))}
      {Array.from({ length: 9 }).map((_, i) => (
        <circle key={i} cx={CX - 200 + i * 50} cy={CY + 12 + Math.sin(i) * 6} r="9" fill="#D7262E" stroke="#FFF0B8" strokeWidth="3" />
      ))}
      {/* nectar overflowing */}
      <ellipse cx={CX} cy={CY - 262} rx="118" ry="24" fill="#FFE9A0" />
      {drops.map((_, i) => {
        const t = ((frame * 1.6 + i * 23) % 100) / 100;
        const side = i % 2 ? 1 : -1;
        const x = CX + side * (60 + (i % 4) * 22) + side * t * 40;
        const y = CY - 262 + t * 220;
        return <ellipse key={i} cx={x} cy={y} rx="9" ry="14" fill="#FFE07A" opacity={1 - t} filter="url(#ka-b)" />;
      })}
    </Svg>
  );
};

const Book: React.FC = () => {
  const frame = useCurrentFrame();
  const flip = (frame % 60) / 60;
  const pageX = Math.cos(flip * Math.PI);
  const motes = Array.from({ length: 24 });
  return (
    <Svg>
      <defs>
        <radialGradient id="bk-light" cx="50%" cy="50%" r="50%">
          <stop offset="0" stopColor="#FFE9A0" stopOpacity="0.9" />
          <stop offset="1" stopColor="#FF9F1A" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="bk-page" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#E9D6A8" />
          <stop offset="1" stopColor="#FFF6DA" />
        </linearGradient>
        <Blur id="bk-b" sd={4} />
      </defs>
      <circle cx={CX} cy={CY - 40} r={360 + Math.sin(frame / 14) * 16} fill="url(#bk-light)" />
      {/* cover */}
      <path d={`M ${CX} ${CY + 150} L ${CX - 380} ${CY + 110} L ${CX - 380} ${CY - 150} L ${CX} ${CY - 110} L ${CX + 380} ${CY - 150} L ${CX + 380} ${CY + 110} Z`} fill="#5A1A12" stroke="#E0A82E" strokeWidth="6" />
      {/* pages */}
      <path d={`M ${CX} ${CY + 130} Q ${CX - 180} ${CY + 80} ${CX - 350} ${CY + 100} L ${CX - 350} ${CY - 150} Q ${CX - 180} ${CY - 170} ${CX} ${CY - 110} Z`} fill="url(#bk-page)" />
      <path d={`M ${CX} ${CY + 130} Q ${CX + 180} ${CY + 80} ${CX + 350} ${CY + 100} L ${CX + 350} ${CY - 150} Q ${CX + 180} ${CY - 170} ${CX} ${CY - 110} Z`} fill="url(#bk-page)" />
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <g key={i} opacity="0.35">
          <line x1={CX - 320} y1={CY - 110 + i * 34} x2={CX - 50} y2={CY - 90 + i * 34} stroke="#7A4A1E" strokeWidth="5" strokeDasharray="22 10" />
          <line x1={CX + 50} y1={CY - 90 + i * 34} x2={CX + 320} y2={CY - 110 + i * 34} stroke="#7A4A1E" strokeWidth="5" strokeDasharray="18 12" />
        </g>
      ))}
      {/* a page turning */}
      <path d={`M ${CX} ${CY + 130} Q ${CX + 180 * pageX} ${CY + 60 - Math.abs(pageX) * -20} ${CX + 350 * pageX} ${CY + 90} L ${CX + 350 * pageX} ${CY - 160} Q ${CX + 180 * pageX} ${CY - 190} ${CX} ${CY - 110} Z`} fill="#FFF3CF" opacity={0.85} />
      {motes.map((_, i) => {
        const t = ((frame * 1.2 + i * 29) % 140) / 140;
        return <circle key={i} cx={CX - 200 + ((i * 53) % 400) + Math.sin(t * 6 + i) * 20} cy={CY - 120 - t * 420} r={3 + (i % 3)} fill="#FFE7A0" opacity={(1 - t) * 0.9} filter="url(#bk-b)" />;
      })}
    </Svg>
  );
};

const Phone: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <Svg>
      <defs>
        <radialGradient id="ph-light" cx="50%" cy="50%" r="50%">
          <stop offset="0" stopColor="#6C8CFF" stopOpacity="0.65" />
          <stop offset="1" stopColor="#6C8CFF" stopOpacity="0" />
        </radialGradient>
        <Glow id="ph-g" sd={10} />
      </defs>
      <circle cx={CX} cy={CY} r={420} fill="url(#ph-light)" />
      {/* crescent moon */}
      <path d={`M ${CX + 300} ${CY - 330} A 70 70 0 1 0 ${CX + 360} ${CY - 220} A 56 56 0 1 1 ${CX + 300} ${CY - 330} Z`} fill="#F1E4C6" filter="url(#ph-g)" />
      <g transform={`rotate(${Math.sin(frame / 20) * 3} ${CX} ${CY})`}>
        <rect x={CX - 170} y={CY - 320} width="340" height="640" rx="48" fill="#141419" stroke="#3A3A44" strokeWidth="8" />
        <rect x={CX - 150} y={CY - 290} width="300" height="580" rx="30" fill="#1E3A8A" />
        <rect x={CX - 150} y={CY - 290} width="300" height="580" rx="30" fill="url(#ph-light)" opacity="0.6" />
        <text x={CX} y={CY - 150} textAnchor="middle" fontFamily="Mukta" fontWeight={800} fontSize="96" fill="#FFFFFF">
          2:47
        </text>
        <text x={CX} y={CY - 96} textAnchor="middle" fontFamily="Mukta" fontWeight={700} fontSize="34" fill="rgba(255,255,255,0.8)">
          AM
        </text>
        {[0, 1, 2].map((i) => {
          const at = 12 + i * 18;
          const o = interpolate(frame % 90, [at, at + 6], [0, 1], clamp);
          return (
            <g key={i} opacity={o} transform={`translate(0 ${(1 - o) * 20})`}>
              <rect x={CX - 130} y={CY - 30 + i * 96} width="260" height="76" rx="20" fill="rgba(255,255,255,0.92)" />
              <rect x={CX - 118} y={CY - 18 + i * 96} width="52" height="52" rx="14" fill={["#FFC53D", "#FF6B6B", "#7C5CFF"][i]} />
              <circle cx={CX - 92} cy={CY + 8 + i * 96} r="10" fill="#fff" opacity="0.9" />
              <rect x={CX - 50} y={CY - 6 + i * 96} width={140 - i * 20} height="12" rx="6" fill="#9AA3B5" />
              <rect x={CX - 50} y={CY + 16 + i * 96} width={100 - i * 10} height="10" rx="5" fill="#C9CFDA" />
            </g>
          );
        })}
      </g>
    </Svg>
  );
};

const Vault: React.FC = () => {
  const frame = useCurrentFrame();
  const sparkle = 0.7 + 0.3 * Math.sin(frame / 5);
  return (
    <Svg>
      <defs>
        <linearGradient id="va-spot" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#FFF1C1" stopOpacity="0.55" />
          <stop offset="1" stopColor="#FFF1C1" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="va-gem" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#E0F7FF" />
          <stop offset="0.5" stopColor="#7FD3FF" />
          <stop offset="1" stopColor="#2B6CB0" />
        </linearGradient>
        <Glow id="va-g" sd={16} />
      </defs>
      <path d={`M ${CX - 60} 260 L ${CX + 60} 260 L ${CX + 300} ${CY + 200} L ${CX - 300} ${CY + 200} Z`} fill="url(#va-spot)" />
      {/* pedestal */}
      <rect x={CX - 170} y={CY + 140} width="340" height="60" rx="8" fill="#2a1a12" stroke="#E0A82E" strokeWidth="5" />
      {/* gem */}
      <g filter="url(#va-g)" opacity={sparkle} transform={`translate(0 ${Math.sin(frame / 18) * 8})`}>
        <path d={`M ${CX - 110} ${CY - 20} L ${CX - 60} ${CY - 90} L ${CX + 60} ${CY - 90} L ${CX + 110} ${CY - 20} L ${CX} ${CY + 120} Z`} fill="url(#va-gem)" stroke="#FFFFFF" strokeWidth="4" />
        <path d={`M ${CX - 110} ${CY - 20} L ${CX + 110} ${CY - 20} M ${CX - 60} ${CY - 90} L ${CX - 30} ${CY - 20} L ${CX} ${CY + 120} L ${CX + 30} ${CY - 20} L ${CX + 60} ${CY - 90}`} fill="none" stroke="#FFFFFF" strokeWidth="3" opacity="0.7" />
      </g>
      {/* glass case */}
      <rect x={CX - 230} y={CY - 300} width="460" height="440" rx="10" fill="rgba(200,230,255,0.06)" stroke="rgba(255,255,255,0.55)" strokeWidth="5" />
      <path d={`M ${CX - 200} ${CY - 270} L ${CX - 120} ${CY - 270} L ${CX - 200} ${CY - 150} Z`} fill="rgba(255,255,255,0.18)" />
      {/* padlock */}
      <g transform={`translate(${CX} ${CY + 90})`}>
        <path d="M -30 -10 V -40 A 30 30 0 0 1 30 -40 V -10" fill="none" stroke="#E0A82E" strokeWidth="10" />
        <rect x="-46" y="-12" width="92" height="74" rx="12" fill="#E0A82E" stroke="#6B3E08" strokeWidth="4" />
        <circle cx="0" cy="22" r="10" fill="#6B3E08" />
      </g>
    </Svg>
  );
};

const Hourglass: React.FC = () => {
  const frame = useCurrentFrame();
  const cycle = frame % 54;
  const rot = cycle > 40 ? interpolate(cycle, [40, 50], [0, 180], clamp) : 0;
  const sand = interpolate(cycle, [0, 40], [1, 0], clamp);
  return (
    <Svg>
      <defs>
        <radialGradient id="hg-light" cx="50%" cy="50%" r="50%">
          <stop offset="0" stopColor="#FFB347" stopOpacity="0.55" />
          <stop offset="1" stopColor="#D7262E" stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx={CX} cy={CY} r={420} fill="url(#hg-light)" />
      <Ring r={330} id="hg" />
      <g transform={`rotate(${rot} ${CX} ${CY})`}>
        <rect x={CX - 170} y={CY - 290} width="340" height="30" rx="10" fill="#C08A3E" stroke="#6B3E08" strokeWidth="4" />
        <rect x={CX - 170} y={CY + 260} width="340" height="30" rx="10" fill="#C08A3E" stroke="#6B3E08" strokeWidth="4" />
        <path d={`M ${CX - 140} ${CY - 260} C ${CX - 140} ${CY - 80} ${CX - 20} ${CY - 40} ${CX - 20} ${CY} C ${CX - 20} ${CY + 40} ${CX - 140} ${CY + 80} ${CX - 140} ${CY + 260} H ${CX + 140} C ${CX + 140} ${CY + 80} ${CX + 20} ${CY + 40} ${CX + 20} ${CY} C ${CX + 20} ${CY - 40} ${CX + 140} ${CY - 80} ${CX + 140} ${CY - 260} Z`} fill="rgba(255,255,255,0.1)" stroke="rgba(255,255,255,0.8)" strokeWidth="6" />
        <path d={`M ${CX - 120 * sand} ${CY - 60 - 160 * sand} H ${CX + 120 * sand} L ${CX} ${CY - 10} Z`} fill="#F4C46A" />
        <path d={`M ${CX - 130} ${CY + 250} Q ${CX} ${CY + 250 - 190 * (1 - sand)} ${CX + 130} ${CY + 250} Z`} fill="#F4C46A" />
        {sand > 0.02 ? <rect x={CX - 3} y={CY - 10} width="6" height="250" fill="#F4C46A" /> : null}
      </g>
    </Svg>
  );
};

const Siblings: React.FC = () => {
  const frame = useCurrentFrame();
  const person = (x: number, color: string, badge: string, delay: number, girl = false) => {
    const b = interpolate(frame, [delay, delay + 10], [0, 1], clamp);
    return (
      <g>
        {girl ? <circle cx={x} cy={CY - 250} r="46" fill="#140C0D" stroke={color} strokeWidth="6" /> : null}
        <circle cx={x} cy={CY - 140} r="95" fill="#140C0D" stroke={color} strokeWidth="6" />
        <path d={`M ${x - 190} ${CY + 260} C ${x - 190} ${CY + 40} ${x - 110} ${CY - 30} ${x} ${CY - 30} C ${x + 110} ${CY - 30} ${x + 190} ${CY + 40} ${x + 190} ${CY + 260} Z`} fill="#140C0D" stroke={color} strokeWidth="6" />
        <g opacity={b} transform={`translate(${x} ${CY - 380}) scale(${0.5 + 0.5 * b})`}>
          <circle r="58" fill={color} stroke="#fff" strokeWidth="5" />
          <text y="20" textAnchor="middle" fontFamily="Mukta" fontWeight={800} fontSize="56" fill="#fff">
            {badge}
          </text>
        </g>
      </g>
    );
  };
  return (
    <Svg>
      <defs>
        <radialGradient id="sb-light" cx="50%" cy="50%" r="50%">
          <stop offset="0" stopColor="#D7262E" stopOpacity="0.45" />
          <stop offset="1" stopColor="#D7262E" stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx={CX} cy={CY} r={460} fill="url(#sb-light)" />
      {person(CX - 210, "#F4C46A", "चं", 4)}
      {person(CX + 210, "#D7262E", "गु", 14, true)}
    </Svg>
  );
};

export const CodeArt: React.FC<{ kind: ArtKind }> = ({ kind }) => {
  switch (kind) {
    case "eclipse":
      return <Eclipse />;
    case "comet":
      return <Comet />;
    case "venus":
      return <Venus />;
    case "saturn":
      return <SaturnArt />;
    case "sun":
      return <SunArt />;
    case "moon":
      return <MoonArt />;
    case "kalash":
      return <Kalash />;
    case "book":
      return <Book />;
    case "phone":
      return <Phone />;
    case "vault":
      return <Vault />;
    case "hourglass":
      return <Hourglass />;
    default:
      return <Siblings />;
  }
};
