import type { Palette } from "./theme";

export type SceneType = "hook" | "point" | "stat" | "list" | "cta";

export type Scene = {
  type: SceneType;
  kicker: string; // small label above the headline ("" = none)
  headline: string; // on-screen text, short
  highlight: string; // one word/phrase from the headline to emphasise ("" = none)
  body: string; // supporting line ("" = none)
  statValue: number; // stat scenes only
  statPrefix: string; // e.g. "₹" ("" = none)
  statSuffix: string; // e.g. "%", "x", "M"
  statLabel: string;
  items: string[]; // list scenes only
  startMs: number; // filled in by the voiceover step
  endMs: number;
};

export type Word = { text: string; startMs: number; endMs: number };

export type ReelProps = {
  brand: { name: string; handle: string; colors: Partial<Palette> };
  audio: string | null; // path inside public/
  music: string | null; // optional background bed inside public/
  musicVolume: number;
  sfx: boolean;
  captions: boolean;
  scenes: Scene[];
  words: Word[];
  durationMs: number;
};
