// Data format for one Gita Shlok Series episode: src/reels/epNN/script.json.
// The same file feeds scripts/timing.mjs (scene ids + voice lines) and the engine (look).
//
// Cue = when something happens, relative to its scene:
//   "शब्द"        the first spoken word that starts with this (Devanagari, as in the voice line)
//   "शब्द#2"      the 2nd match;  "शब्द+6" / "शब्द-6"  shift by frames;  "शब्द#2-4" both
//   "start" (=0), "end" (scene length), or a plain number of frames
//
// Rich text (rows): plain Devanagari with marks
//   {g:..} gold   {s:..} saffron   {c:..} cream   {d:..} dim   {r:..} red pill   {G:..} green pill
//   {n:..} big gold number   {x:..} struck out in red (at the row's "strike" cue)   {R:..} red text   {E:..} green text

export type Cue = string | number;
export type Tone = "gold" | "red" | "green" | "saffron" | "cream" | "blue";

export type Row = string | { t: string; size?: number; at?: Cue; strike?: Cue; color?: string; weight?: number };

export type Pic = {
  src: string; // "img/x-cut.png"
  h: number; // display height
  x?: number; // centre x (540)
  bottom?: number; // y of the bottom edge (1540)
  at?: Cue; // enter (default: before the scene, already there)
  out?: Cue; // leave
  from?: "up" | "down" | "left" | "right" | "none";
  glow?: Tone | "none";
  halo?: boolean; // soft light behind (default true)
  dim?: number; // 0..1 darker
  blur?: number;
  flip?: boolean;
  full?: boolean; // a picture with its own background (no cut-out): shown with soft faded edges
  front?: boolean;
  fx?: { type: "shake" | "redflash" | "glitch" | "gray" | "zoom"; at: Cue; to?: Cue }[];
};

export type Beat = {
  at: Cue;
  out?: Cue; // default: the next beat's "at"
  stack?: boolean; // keep the previous beat on screen (this one goes below it)
  top?: number; // y of the text block (default 290)
  rows?: Row[];
  sa?: string; // Sanskrit line (gold, Tiro)
  saSize?: number;
  sub?: string; // smaller cream line under the rows
  card?: { label?: string; text: string; at?: Cue; top?: number; tone?: Tone };
  pill?: { text: string; tone?: Tone; at?: Cue }; // small pill above the rows
  align?: "center" | "left";
  sfx?: string | null;
};

export type Widget = { type: string; [k: string]: unknown };

export type BeatsScene = {
  id: string;
  kind: "beats";
  lines: { voice: string }[];
  pics?: Pic[];
  beats: Beat[];
  widgets?: Widget[];
  dust?: Tone | "none";
  mood?: "gold" | "red" | "green" | "blue";
  sfx?: { at: Cue; name: string; vol?: number }[];
  swipe?: boolean; // swipe into this scene (default true)
};

export type SourceScene = {
  id: string;
  kind: "source";
  lines: { voice: string }[];
  ep: number;
  ref: string; // "1.1" or "2.62–63"
  chapter: string; // "1"
  verse: string; // "1"
  speaker?: string; // "धृतराष्ट्र उवाच"
  shloka: string[]; // half-verse lines; {..} = highlighted words
  note?: string; // pill under the card
  bg?: Pic; // dim picture behind the card
  fontSize?: number;
  swipe?: boolean;
};

export type CtaScene = {
  id: string;
  kind: "cta";
  lines: { voice: string }[];
  share: { title: string; sub: string; pic?: Pic };
  comment: { q: string; typed: string; typeAt?: Cue };
  next: { ep: string; rows: string[]; pic?: Pic; note?: { at: Cue; text: string } };
  swipe?: boolean;
};

export type Scene = BeatsScene | SourceScene | CtaScene;

export type Episode = {
  id: string;
  ep: number;
  tag: string; // "#07"
  shlok: string; // "1.1"
  title: string;
  voice: Record<string, unknown>;
  timing: Record<string, number>;
  music?: { file: string; start?: number; vol?: number };
  cover: { pic: Pic; rows: Row[]; pill?: { text: string; tone?: Tone }; mood?: "gold" | "red" | "green" | "blue" };
  pictures?: Record<string, string>; // the Gemini prompts used
  scenes: Scene[];
};
