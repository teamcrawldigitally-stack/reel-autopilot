// Fonts ship inside node_modules (no network needed at render time).
import "@fontsource/bricolage-grotesque/600.css";
import "@fontsource/bricolage-grotesque/700.css";
import "@fontsource/bricolage-grotesque/800.css";
import "@fontsource/inter/400.css";
import "@fontsource/inter/500.css";
import "@fontsource/inter/600.css";
import "@fontsource/noto-sans-devanagari/devanagari-500.css";
import "@fontsource/noto-sans-devanagari/devanagari-700.css";
import "@fontsource/noto-sans-devanagari/devanagari-800.css";
import { continueRender, delayRender } from "remotion";

const faces = [
  '600 100px "Bricolage Grotesque"',
  '700 100px "Bricolage Grotesque"',
  '800 100px "Bricolage Grotesque"',
  "400 100px Inter",
  "500 100px Inter",
  "600 100px Inter",
  '500 100px "Noto Sans Devanagari"',
  '700 100px "Noto Sans Devanagari"',
  '800 100px "Noto Sans Devanagari"',
];

if (typeof document !== "undefined") {
  const handle = delayRender("Loading fonts");
  Promise.all(faces.map((f) => document.fonts.load(f, "Aaअ")))
    .then(() => continueRender(handle))
    .catch(() => continueRender(handle));
}
