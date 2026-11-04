// Render several stills with one bundle + one browser.
// usage: node scripts/stills.mjs <comp> <frame> [frame...]
import { bundle } from "@remotion/bundler";
import { openBrowser, renderStill, selectComposition } from "@remotion/renderer";
import path from "node:path";
import fs from "node:fs";

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const [comp, ...frames] = process.argv.slice(2);
const exe = "/opt/pw-browsers/chromium_headless_shell-1243/chrome-headless-shell-linux64/chrome-headless-shell";
const serveUrl = await bundle({ entryPoint: path.join(root, "src/index.ts"), publicDir: path.join(root, "public") });
const browser = await openBrowser("chrome", { browserExecutable: exe });
const composition = await selectComposition({ serveUrl, id: comp, puppeteerInstance: browser });
fs.mkdirSync(path.join(root, "out/check"), { recursive: true });
for (const f of frames) {
  const output = path.join(root, `out/check/${comp}_${f}.png`);
  await renderStill({ serveUrl, composition, frame: Number(f), output, puppeteerInstance: browser, overwrite: true });
  console.log(output);
}
await browser.close({ silent: true });
