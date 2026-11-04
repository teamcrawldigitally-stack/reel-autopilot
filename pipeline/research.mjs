// Research + script step, using Claude Code with your Claude subscription (no API key).
//
// Runs `claude -p` (Claude Code's non-interactive mode). Claude searches the web for
// what's new/trending in the niche, picks ONE topic that hasn't been posted, and returns
// a scene-by-scene reel script as JSON (enforced with --json-schema).
//
// Auth: on your Mac, just be logged in to Claude Code. On GitHub Actions, set the
// CLAUDE_CODE_OAUTH_TOKEN secret (create it once with `claude setup-token`).
//
// CLI: node pipeline/research.mjs [out.json]
import { spawn } from "node:child_process";
import path from "node:path";
import { localDate, log, readJson, ROOT, sanitizeScript, writeJson } from "./lib.mjs";

const SCENE_SCHEMA = {
  type: "object",
  additionalProperties: false,
  required: ["type", "voiceover", "kicker", "headline", "highlight", "body", "statValue", "statPrefix", "statSuffix", "statLabel", "items"],
  properties: {
    type: { type: "string", enum: ["hook", "point", "stat", "list", "cta"] },
    voiceover: { type: "string", description: "Exactly what the narrator says during this scene." },
    kicker: { type: "string", description: "Tiny label above the headline, max 3 words, or empty." },
    headline: { type: "string", description: "On-screen text, max 7 words." },
    highlight: { type: "string", description: "1-2 words copied exactly from the headline to emphasise, or empty." },
    body: { type: "string", description: "Optional supporting line (max 12 words). For cta: the button text." },
    statValue: { type: "number", description: "stat scenes: the number. Otherwise 0." },
    statPrefix: { type: "string", description: "stat scenes: e.g. ₹ or $. Otherwise empty." },
    statSuffix: { type: "string", description: "stat scenes: e.g. %, x, Cr, M. Otherwise empty." },
    statLabel: { type: "string", description: "stat scenes: what the number means (max 8 words). Otherwise empty." },
    items: { type: "array", items: { type: "string" }, description: "list scenes: 3-4 short items (max 5 words each). Otherwise []." },
  },
};

const SCRIPT_SCHEMA = {
  type: "object",
  additionalProperties: false,
  required: ["topic", "title", "angle", "researchNotes", "caption", "hashtags", "sources", "factCheck", "scenes"],
  properties: {
    topic: { type: "string" },
    title: { type: "string", description: "Internal title for the reel." },
    angle: { type: "string", description: "Why this will stop the scroll for this audience." },
    researchNotes: { type: "string", description: "Key facts found, each with its source URL." },
    caption: { type: "string", description: "Instagram caption without hashtags: hook line, 2-4 short lines of value, a question or CTA." },
    hashtags: { type: "array", items: { type: "string" }, description: "3-5 relevant hashtags without #." },
    sources: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        required: ["title", "url"],
        properties: { title: { type: "string" }, url: { type: "string" } },
      },
    },
    factCheck: { type: "string", description: "Each factual claim in the script and which source supports it." },
    scenes: { type: "array", items: SCENE_SCHEMA },
  },
};

const languageRules = (language) => {
  switch (language) {
    case "hindi":
      return "Write the voiceover AND all on-screen text in Hindi (Devanagari script).";
    case "hinglish":
      return "Write the voiceover in natural spoken Hinglish: Hindi words in Devanagari script, English words in Latin script (this is what the Hindi voice pronounces best). Write on-screen text (kicker, headline, body, items, caption) in Roman-script Hinglish.";
    default:
      return "Write everything in simple, conversational English that an Indian audience relates to.";
  }
};

// Run `claude -p` and return its JSON result.
const runClaude = (prompt, model) =>
  new Promise((resolve, reject) => {
    const bin = process.env.CLAUDE_BIN || "claude";
    const args = [
      "-p", prompt,
      "--output-format", "json",
      "--json-schema", JSON.stringify(SCRIPT_SCHEMA),
      "--model", model,
      "--allowedTools", "WebSearch,WebFetch",
      "--permission-mode", "dontAsk", // anything other than web search/fetch is refused
      "--max-turns", "40",
    ];
    const env = { ...process.env };
    if (!env.CLAUDE_CODE_OAUTH_TOKEN) delete env.CLAUDE_CODE_OAUTH_TOKEN; // empty value from .env -> use normal login
    const p = spawn(bin, args, { cwd: ROOT, env, stdio: ["ignore", "pipe", "pipe"] });
    let out = "";
    let err = "";
    p.stdout.on("data", (d) => (out += d));
    p.stderr.on("data", (d) => (err += d));
    p.on("error", (e) =>
      reject(e.code === "ENOENT" ? new Error("Claude Code is not installed (npm install -g @anthropic-ai/claude-code)") : e),
    );
    p.on("close", (code) => {
      let res = null;
      try {
        res = JSON.parse(out);
      } catch {}
      if (code !== 0 || !res || res.is_error) {
        const why = res?.result || err.slice(-1500) || out.slice(-1500);
        return reject(new Error(`claude -p failed (exit ${code}): ${why}`));
      }
      if (!res.structured_output) return reject(new Error(`claude -p returned no structured output: ${String(res.result).slice(0, 500)}`));
      resolve(res);
    });
  });

export const researchAndWrite = async ({ config, history, outPath }) => {
  const model = config.research?.model ?? "sonnet";
  const maxSearches = config.research?.maxSearches ?? 6;
  const today = localDate(config.timezone);
  const recent = history
    .slice(-40)
    .map((h) => `- ${h.date}: ${h.topic}`)
    .join("\n");
  const { targetSeconds = 35, minScenes = 5, maxScenes = 7 } = config.reel ?? {};
  const maxWords = Math.round(targetSeconds * 3.3);
  const sites = config.research?.preferredSites?.length ? `\nPrefer these sources where relevant: ${config.research.preferredSites.join(", ")}` : "";

  const basePrompt = `You are the research lead and scriptwriter for an Instagram Reels channel. Today is ${today}.

CHANNEL
Name: ${config.account?.name ?? ""} (${config.account?.handle ?? ""})
Niche: ${config.niche}
Audience: ${config.audience}
Tone: ${config.tone ?? "confident, friendly, no fluff"}
Content pillars: ${(config.contentPillars ?? []).join("; ")}
Never cover: ${(config.avoidTopics ?? []).join("; ") || "nothing listed"}${sites}

ALREADY POSTED (do not repeat these topics or close variants)
${recent || "- nothing yet"}

STEP 1 – RESEARCH
Use web search (at most ${maxSearches} searches) to find what is new, trending or being asked about in this niche right now: news from the last 1-2 weeks, new features or launches, common questions, myths worth busting. Pick ONE topic that is timely or evergreen-useful, fits a ${targetSeconds}-second reel, and has a strong hook. Never invent facts, numbers or quotes.

STEP 2 – SCRIPT
The reel is rendered automatically as motion graphics with a voiceover and word-by-word captions.
- ${minScenes}-${maxScenes} scenes, about ${targetSeconds} seconds total, max ${maxWords} spoken words overall.
- Scene 1 is type "hook": a bold claim, question or surprising fact in under 2.5 seconds of speech. No greetings, no "hey guys".
- Middle scenes use "point", "stat" (only for a number a source states) and "list" (3-4 items).
- Last scene is type "cta": headline invites the action, body is the button text (e.g. "Follow for more", "Save this"), voiceover says it naturally.
- Each voiceover line is 1-2 short sentences a person would actually say. Spell numbers the way they should be spoken.
- On-screen text is NOT a copy of the voiceover: headline max 7 words, punchy; highlight is 1-2 words copied exactly from the headline.
- Use ONLY facts you found. If unsure, make it advice rather than a claim. Never invent statistics.
- ${languageRules(config.language)}
- caption: hook line + 2-4 short lines + a question to drive comments. No hashtags in the caption.
- researchNotes: the key facts with their source URLs. sources: the pages you relied on.

Do not create or edit any files. Return the result as the JSON object.`;

  let feedback = "";
  for (let attempt = 1; attempt <= 2; attempt++) {
    log(`research + script: claude -p (${model}), attempt ${attempt}`);
    const prompt = feedback
      ? `${basePrompt}\n\nYour previous attempt had these problems; fix them:\n${feedback}`
      : basePrompt;
    const res = await runClaude(prompt, model);
    const { script, problems } = sanitizeScript(res.structured_output, config);
    script.researchNotes = String(res.structured_output.researchNotes ?? "");
    script.date = today;
    script.model = model;
    if (!problems.length || attempt === 2) {
      if (problems.length) log(`script: shipping with minor issues: ${problems.join("; ")}`);
      if (outPath) writeJson(outPath, script);
      return script;
    }
    feedback = problems.map((p) => `- ${p}`).join("\n");
  }
  throw new Error("unreachable");
};

// CLI
if (import.meta.url === `file://${process.argv[1]}`) {
  try {
    process.loadEnvFile(path.join(ROOT, ".env"));
  } catch {}
  const config = readJson(path.join(ROOT, "config/channel.json"));
  const history = readJson(path.join(ROOT, "history/posted.json"), []);
  const out = process.argv[2] ?? path.join(ROOT, "runs/manual/script.json");
  const script = await researchAndWrite({ config, history, outPath: out });
  log(`wrote ${out}: ${script.title}`);
}
