# D2C Founders reels (@d2cfounders)

Remotion project for the D2C Founders page.

**Read [HISAAB.md](HISAAB.md) first (script, voice, look, build, queue).** From 7 Nov 2026 the page tests two looks side by side, one of each per day: **hisaab** (template `src/reels/case15/`, kit `src/components/hisaab.tsx`) and the **2D cartoon** (Rohit, Priya, D2C Doctor; template `src/reels/case14/`). HISAAB.md §0b says which look each CASE gets.
Separate from the Astro project in the repo root (own package.json).

- One folder per reel in `src/reels/<id>/`: `script.json` (Roman captions + Devanagari voice lines), `timing.json`, `scenes.tsx`, `Reel.tsx`, `Cover.tsx`.
- Shared pieces in `src/components/`: `Cartoon.tsx` (cast + props), `Doctor.tsx`, `sets.tsx`, `props.tsx`, `format.tsx` (HookTitle, CtaFlow), `kit.tsx`, `fx.tsx`, `widgets.tsx`, `overlay.tsx`.
- Voice: Sarvam `bulbul:v4-flash`, speaker `aditya_hi_conversational`, pace 1.25 (no colons in voice text), one clip per line in `public/<id>/vo/lines/<scene>_<n>.wav`.
- Build: `npm install`, then `node scripts/timing.mjs <id>` → `npx remotion render src/index.ts <Comp> out/x.mp4 --codec h264 --crf 18` → `scripts/mix_music.sh out/x.mp4 public/music/jailer-bed.wav 0 final.mp4`.
- Finished reels go to `../queue/d2cfounders/` (Instagram format: yuv420p, AAC 48 kHz 128k) and `../queue/d2cfounders/manifest.json`; `.github/workflows/post-queue-d2c.yml` posts them.
