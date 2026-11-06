import "@fontsource/rozha-one/devanagari-400.css";
import "@fontsource/rozha-one/latin-400.css";
import "@fontsource/mukta/devanagari-600.css";
import "@fontsource/mukta/devanagari-700.css";
import "@fontsource/mukta/devanagari-800.css";
import "@fontsource/mukta/latin-600.css";
import "@fontsource/mukta/latin-700.css";
import "@fontsource/mukta/latin-800.css";
import "@fontsource/eczar/devanagari-800.css";
import "@fontsource/eczar/latin-800.css";
import "@fontsource/baloo-2/devanagari-700.css";
import "@fontsource/baloo-2/devanagari-800.css";
import "@fontsource/baloo-2/latin-700.css";
import "@fontsource/baloo-2/latin-800.css";
import { continueRender, delayRender } from "remotion";

const faces = ['400 100px "Rozha One"', '600 100px "Mukta"', '700 100px "Mukta"', '800 100px "Mukta"', '800 100px "Eczar"', '700 100px "Baloo 2"', '800 100px "Baloo 2"'];

if (typeof document !== "undefined") {
  const handle = delayRender("Loading Astro fonts");
  Promise.all(faces.map((f) => document.fonts.load(f, "राशिफल Astro 24x7")))
    .then(() => continueRender(handle))
    .catch(() => continueRender(handle));
}
