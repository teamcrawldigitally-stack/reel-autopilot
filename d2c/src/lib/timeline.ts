export type Word = { d: string; sp: string; hl: boolean; p: string; s: number; e: number };
export type SceneTiming = { id: string; start: number; dur: number; audio: string | null; words: Word[] };
export type Timing = { fps: number; total: number; scenes: SceneTiming[] };

const norm = (x: string) => x.toLowerCase().replace(/[^a-z0-9₹%.+]/g, "");

/** Helpers bound to one reel's timing.json. */
export const createTimeline = (timing: Timing) => {
  const FPS = timing.fps;
  const scenes = timing.scenes;
  const totalFrames = Math.ceil(timing.total * FPS);

  const sceneById = (id: string) => {
    const s = scenes.find((x) => x.id === id);
    if (!s) throw new Error(`scene ${id} missing`);
    return s;
  };

  const sceneFrames = (id: string) => {
    const s = sceneById(id);
    const from = Math.round(s.start * FPS);
    const to = Math.round((s.start + s.dur) * FPS);
    return { from, dur: to - from };
  };

  const find = (id: string, key: string, nth: number) => {
    const s = sceneById(id);
    const k = norm(key);
    let count = 0;
    for (const w of s.words) {
      if (norm(w.sp) === k || norm(w.d) === k || norm(w.sp).startsWith(k)) {
        count++;
        if (count === nth) return w;
      }
    }
    throw new Error(`cue ${key}#${nth} not found in ${id}`);
  };

  /** Frame (relative to scene start) when the nth word matching `key` starts. */
  const cue = (id: string, key: string, nth = 1, offset = 0) => Math.round(find(id, key, nth).s * FPS) + offset;
  /** Frame (relative to scene start) when the nth matching word ends. */
  const cueEnd = (id: string, key: string, nth = 1) => Math.round(find(id, key, nth).e * FPS);

  return { FPS, scenes, totalFrames, sceneById, sceneFrames, cue, cueEnd };
};
