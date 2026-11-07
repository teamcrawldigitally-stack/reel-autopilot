import timing from "./timing.json";
import { createTimeline, Timing } from "../../lib/timeline";

export const T = createTimeline(timing as Timing);
export const { FPS, scenes, totalFrames, sceneById, sceneFrames, cue, cueEnd } = T;
