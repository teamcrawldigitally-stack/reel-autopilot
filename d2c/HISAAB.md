# Hisaab reels: script, voice and video

Akshay's standing rule (7 Nov 2026): every reel made from now on in this account uses this look and this voice setup.
The template reel is **CASE #15 "ROAS 3, phir bhi loss?"** (`src/reels/case15/`, queued as `queue/d2cfounders/12-case15-roas.mp4`).
Cartoon reels (Rohit / Priya / D2C Doctor) are no longer made. The ones already in the queue still post as they are.

## 1. Script

- **Shape:** one question answered "by the numbers".
  1. Hook: the claim, with a surprising number.
  2. "Humne hisaab lagaya."
  3. Setup numbers.
  4. Break them apart.
  5. The twist (the cost nobody counts).
  6. The rule.
  7. 3 fixes, then the CTA.
- **One measured object for the whole reel**, e.g. a coin tower (1 coin = ₹100), a bar, a meter, a calendar strip or a parcel scale. Every scene adds to it, cuts it or measures it.
- **Length:** 35–50 s, never 59 s or more. At pace 1.25 that is about 90–110 Roman words: 6–7 scenes, each with 2–4 short lines (10 words or fewer per line, one idea per line).
- **Hook:**
  - It is the first spoken line, e.g. "ROAS 3 hai, phir bhi paisa doob raha hai?".
  - The claim is on screen from frame 0. There is no fade-in on the hook text.
- **Numbers:**
  - Use worked "maan lo" example numbers that add up exactly, and say in the caption that they are examples.
  - Real statistics: open the source page and re-check them before making the voice, and put the source in the caption.
- **Language:** simple Hinglish.
- **CTA (one only):** "Comment karo KEYWORD," → "<what arrives> free DM mein." → teaser for the next reel as a full question, with its real slot ("Kal dopahar, …?" / "Aaj shaam, …?") → "Follow karo."
- **Reference pages:** for topic ideas only. Never copy their script, characters or layout.
- **Lines in `script.json`:**
  - `roman` is for timing cues. `*` marks a key word, and `display|spoken_words` uses `_` for spaces.
  - `voice` is all Devanagari.

## 2. Voiceover (Sarvam)

**Settings:** `mcp__remote-devices__sarvam__sarvam_tools_tts_speak`
- model `bulbul:v4-flash`
- speaker `aditya_hi_conversational`
- **pace 1.25** (changed from 1.05 on 6 Nov because Akshay found it too slow)
- target_language_code `hi-IN`
- speech_sample_rate 44100

**Rules for the voice text:**
- Make one call per line.
- Write the voice text all in Devanagari:
  - English words go in Hindi script (ऐड, सेल, कैलकुलेटर).
  - Acronyms are spelled letter by letter (आर ओ ए एस).
  - Numbers are written as words (दस हज़ार, तीन पॉइंट तीन).
- **No colons, semicolons or dashes in the voice text.** Sarvam pauses for about 2 s on them.
  - Write "पैकिंग और डिलीवरी पाँच हज़ार चार सौ।", not "पैकिंग और डिलीवरी: …".
  - Use a comma only where a short breath is wanted.

**Getting the files into the project:**
1. The files are saved on Akshay's Mac as `/Users/akshayshukla/Movies/Astro24x7/sarvam-tts-<hash>.wav`.
2. Copy them over with `mcp__remote-devices__device_stage_files`. They arrive in `/mnt/user-data/uploads/Astro24x7/`.
3. Copy each one to `public/<id>/vo/lines/<scene>_<n>.wav`, where n starts at 0 (s1_0, s1_1, …).

**Timing:**
- Set `"timing": {"gap": 0.06, "tail": 0.12, "endHold": 0.8}` in `script.json`.
- Run `node scripts/timing.mjs <id>`. It prints each scene's length and the total.
- If the total is over 50 s, cut words. Do not raise the pace above 1.3.

## 3. Look

**The kit** is `src/components/hisaab.tsx`. It contains:

| Piece | What it does |
|---|---|
| `BlueprintBg sheet="#NN"` | Dark navy sheet, drifting blueprint grid, ruler, corner marks |
| `BpTopBar tag` | Progress bar, case pill, logo |
| `DarkFinish` | Grade, grain and vignette (top layer) |
| `FigLabel n text` | "FIG. n · TITLE" at y 290 on every body scene |
| `big(size, color)`, `label(size, color)` | Display numbers / small-caps labels |
| `Coin`, `TW`, `coinXY`, `yAt`, `rowTop`, `TowerFrame`, `SaleLine` | Coin tower, 10 coins per ₹1,000 row |
| `DimLine`, `DimLabel` | Blueprint measurement brackets with a label |
| `glass`, `useCount`, `Hl` | Card style, count-up, highlight pill |
| `FixCard` | Numbered fix card. Stack 3 in a column, gap 30, from y 390 |
| `HisaabCta` | Comment box with keyword typed → DM card → teaser card (label = real slot) → Follow |

**Rules:**
- No cartoon characters and no karaoke subtitles.
- Few words on screen: one headline per beat, small letter-spaced labels, big numbers (80–230 px) that count up and land on the frame where the number is spoken.
- Colour:
  - Use the brand violets for neutral things.
  - **Green = money in / good, red = money out / loss.** Use no other colours.
  - Only one glowing "hero" element per frame.
- Safe area:
  - Content sits between y 290 and 1500, x 84–996.
  - The top bar is at y 168.
  - Instagram's buttons cover the area below y 1550.
- Motion:
  - Tie every entrance to `cue(scene, word)`.
  - Stagger groups of items (coins 0.07–0.16 frames apart).
  - The twist lands with a stamp or shake on its cue word.
  - Use `Swipes` between scenes.
- Sound: soft SFX only (pop, tick, stamp, error, check, ding, whoosh, swish, bass, key) at volume 0.35–0.8, with the Jailer bed underneath.
- **Scene pattern (CASE #15):**

  | Scene | Content |
  |---|---|
  | s1 | Hook (dashboard, stamp on the twist word, "har ₹ ka hisaab" scan) |
  | s2 | Setup numbers filling the object |
  | s3 | Break apart with `DimLine`s |
  | s4 | Twist (overflow above the line, red −₹ number) |
  | s5 | The rule (meter or formula) |
  | s6 | 3 `FixCard`s |
  | s7 | `HisaabCta` |

- **Cover:**
  - Use the same sheet.
  - Show the claim huge: green number + "phir bhi" + red pill word, plus a mini version of the measured object.
  - Keep everything inside the 3:4 crop (y 240–1680).

## 4. Build → check → render

1. Copy `src/reels/case15/` to `src/reels/<id>/`. Change `script.json`, the scenes, the CTA props and the cover. Register `<Comp>` and `<Comp>Cover` in `src/Root.tsx`.
2. Run `npx tsc --noEmit -p .`.
3. Run `node scripts/stills.mjs <Comp> <f1> <f2> …` for 10–12 frames, at the moments with the most on screen in every scene.
4. Make a contact sheet with PIL and **look at it**. Fix overlaps, clipped text, labels showing "₹0" before their count, and anything outside the safe area. Check again.
5. Render:
   ```
   npx remotion render src/index.ts <Comp> out/<id>_tmp.mp4 --codec h264 --crf 18 --x264-preset veryfast --audio-codec aac --audio-bitrate 256k --browser-executable=$(ls -d /opt/pw-browsers/chromium_headless_shell-*/chrome-headless-shell-linux64)/chrome-headless-shell --concurrency=2 --log=error
   ```
6. Add the music: `bash scripts/mix_music.sh out/<id>_tmp.mp4 public/music/jailer-bed.wav 0 out/<id>_mix.mp4`.
7. Encode for Instagram:
   ```
   ffmpeg -i out/<id>_mix.mp4 -vf "scale=in_range=pc:out_range=tv,format=yuv420p" -c:v libx264 -profile:v high -level 4.1 -preset veryfast -crf 18 -maxrate 12M -bufsize 24M -g 60 -keyint_min 60 -sc_threshold 0 -r 30 -color_range tv -c:a aac -b:a 128k -ar 48000 -ac 2 -movflags +faststart ../queue/d2cfounders/<NN-slug>.mp4
   ```
8. Final check:
   - The length is 35–50 s.
   - Loudness is about −14 LUFS (`ffmpeg -i x.mp4 -af ebur128 -f null -`).
   - Pull about 5 frames from the finished file and look at them.
9. Render the cover still:
   ```
   npx remotion still src/index.ts <Comp>Cover out/<id>-cover.png --frame 0
   ```

## 5. Queue and report

**Manifest item** in `queue/d2cfounders/manifest.json`, in calendar order. Fields:
- `id`, `title`, `video`, `caption`
- `audioName`: "D2C Founders · <title>"
- `thumbOffsetMs`: about 1500
- `look`: "hisaab"
- `type`, `hook`, `keyword`, `pinnedComment`

**Caption:**
1. First line: the CASE tag and the hook.
2. The numbers, and "(Example numbers…)" if they are examples.
3. 3 ✅ fixes.
4. "👇 Comment karo KEYWORD, … free DM mein."
5. A blank line.
6. 5 hashtags.

Do not add the free-report or WhatsApp lines. The posting step adds the English footer from `captionCta`.

**Finish up:**
- Commit with the reel source and voice clips, rebase on origin/main, and push.
- Set the calendar row's Status to "Queued".
- Send Akshay the mp4, the cover and the hook.

## Other pages

The script, voice and look rules above apply to every page. The page's palette and logo change:
- **D2C Founders:** navy #12044B, violet #6D4AFD → #3618B4, lavender #DFC8FD.
- **Astro 24x7:** its own orange + white with a little black.

Green and red stay for good/bad and money in/out. Each page has its own Remotion project (Astro 24x7 is in the repo root). Port `hisaab.tsx` into it, with that page's colours and logo, before its first hisaab reel.
