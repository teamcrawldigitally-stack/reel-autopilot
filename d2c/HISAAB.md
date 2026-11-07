# Hisaab reels: script, voice and video

Akshay's rules (7 Nov 2026):
- The script, voice and checking rules here apply to every reel in this account.
- **Look: character (2D cartoon) reels only** (Akshay, 7 Nov: "going forward make character reel only, its good"). Use section 6 for every reel. **The dark blue hisaab look is retired** (Akshay, 7 Nov: "the dark blue theme is not good"). All 10 hisaab reels (#15, #17, #18, #21, #22, #25, #26, #29, #30, #33) were remade in the cartoon look with the same script and voice before they posted. Sections 3 onward are kept only for the script, voice and number rules.
- **No other look for now.** On 7 Nov four new styles were tested on CASE #26 (phone screen, notebook doodle, bold yellow pop, comic book). Akshay liked none: "the previous was good". Stay with the light cartoon look.
- **Every reel must give real value.** No one-sided negative claims. Example: the first CASE #20 said a 30% sale leaves zero profit. Akshay rejected it: in a sale, orders go up and AOV goes up too. Show how to do the thing well, with numbers that work, and end with fixes the viewer can use the same day.

Hisaab references:
- Template reel: D2C CASE #15 "ROAS 3, phir bhi loss?" (repo `d2c/src/reels/case15/`).
- Kit: `d2c/src/components/hisaab.tsx`.
- The same guide lives in the repo as `d2c/HISAAB.md`. If the two differ, use the newer one.

## 0. Setup

- **Repo:** `teamcrawldigitally-stack/reel-autopilot`.
  - Attach it with add_repo (push access).
  - Clone it to `/home/claude/reel-autopilot`.
  - Run `npm install` in `d2c/`.
  - The GitHub REST API works as `env -u GH_TOKEN gh api …`. GraphQL is blocked.
- **Voice:** needs Akshay's Mac, through the linked-computer Sarvam tools. If the Mac can't be reached, stop before the voice step and say so.
- **D2C content calendar** (Claude Docs): https://claude.ai/artifact/WL3M4uHLXLoUQ57Nn2SeDd
  - Calendar tab: one row per reel. Its Status dropdown goes Approved → Queued → Posted.
  - Scripts tab: the approved scripts.
- **Akshay's standing rules:**
  - Under 59 s; best is 35–50 s.
  - Soft SFX only.
  - Hooks and CTAs clear and strong.
  - Show him the hook of every reel.
  - Reference pages are for topic ideas only. Never copy their script, characters or layout.
  - A reel counts as approved unless he asks for changes, so queue it without waiting.
  - Write to him in simple English or Hinglish.

## 0b. Which look (D2C test) · ENDED 7 Nov

The test below is over. Akshay picked the character (cartoon) look. Kept for history only.

- **Pick by the CASE number.** If the number divided by 4 leaves 1 or 2 → hisaab. If it leaves 3 or 0 → cartoon.
  - This gives one reel of each look every day, and the two looks swap time slots every day.
  - For example: Wed 11 has #16 cartoon at 12:57 and #17 hisaab at 6:57. Thu 12 has #18 hisaab at 12:57 and #19 cartoon at 6:57.
  - CASE #15 (ROAS) is hisaab: it was the first test.
- **Keep everything else the same for both looks**, so only the look differs: same voice settings, length, hook, CTA and caption rules.
- **Set the manifest `look`** to `"hisaab"` or `"cartoon"`. The nightly stats (`state/d2cfounders-stats.json`) record it for every post.
- **After about 10 posts of each look**, compare likes, comments and follower change by look. Tell Akshay which one is winning. He decides what to keep.

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
- **Length:** 35–50 s. At pace 1.15 that is about 85–100 Roman words: 6–7 scenes, each with 2–4 short lines (10 words or fewer per line, one idea per line).
- **Hook:**
  - It is the first spoken line, e.g. "ROAS 3 hai, phir bhi paisa doob raha hai?".
  - The claim is on screen from frame 0. There is no fade-in on the hook text.
- **Numbers:**
  - Use worked "maan lo" example numbers that add up exactly, and say in the caption that they are examples.
  - Real statistics: open the source page and re-check them before making the voice, and put the source in the caption.
- **Language:** simple Hinglish.
- **CTA (one only):** "Comment karo KEYWORD," → "<what arrives> free DM mein." → teaser for the next reel as a full question, with its real slot ("Kal dopahar, …?" / "Aaj shaam, …?") → "Follow karo."
- **Lines in `script.json`:**
  - `roman` is for timing cues. `*` marks a key word, and `display|spoken_words` uses `_` for spaces.
  - `voice` is all Devanagari.

## 2. Voiceover (Sarvam)

**Settings:** `mcp__remote-devices__sarvam__sarvam_tools_tts_speak`
- model `bulbul:v4-flash`
- speaker `aditya_hi_conversational`
- **pace 1.15** (1.05 was too slow, 1.25 a little fast; 1.15 sounds natural)
- target_language_code `hi-IN`
- speech_sample_rate 44100

**Rules for the voice text:**
- **One clip per scene** (s1_0 … s5_0): the whole scene is read in one go, so it flows like natural speech. The CTA scene has 3 clips: s6_0 (comment + gift), s6_1 (teaser), s6_2 (the shared "फ़ॉलो करो।" clip `24ed4fa6`).
- Calls can run in parallel batches of about 7.
- Write the voice text all in Devanagari:
  - English words go in Hindi script (ऐड, सेल, कैलकुलेटर).
  - Acronyms are spelled letter by letter (आर ओ ए एस).
  - Numbers are written as words (दस हज़ार, तीन पॉइंट तीन).
- **No colons, semicolons or dashes in the voice text.** Sarvam pauses for about 2 s on them.
  - Write "पैकिंग और डिलीवरी पाँच हज़ार चार सौ।", not "पैकिंग और डिलीवरी: …".
  - Use a comma only where a short breath is wanted.

**Getting the files into the project:**
1. The files are saved on the Mac as `/Users/akshayshukla/Movies/Astro24x7/sarvam-tts-<hash>.wav`.
2. Copy them over with `mcp__remote-devices__device_stage_files`. They arrive in `/mnt/user-data/uploads/Astro24x7/`.
3. Copy each one to `public/<id>/vo/lines/<scene>_<n>.wav`, where n starts at 0 (s1_0, s1_1, …).

**Timing:**
- Set `"timing": {"gap": 0.1, "tail": 0.18, "endHold": 0.9}` in `script.json`.
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
- Few words on screen: one headline per beat, small letter-spaced labels, big numbers (80–230 px) that count up and land on the frame where the number is spoken. Never show a "₹0" placeholder.
- Colour:
  - Use the brand colours for neutral things.
  - **Green = money in / good, red = money out / loss.** Use no other colours.
  - Only one glowing "hero" element per frame.
  - No emoji on screen.
- Safe area:
  - Content sits between y 290 and 1500, x 84–996.
  - The top bar is at y 168.
  - Instagram's buttons cover the area below y 1550.
- Motion:
  - Tie every entrance to `cue(scene, word)`.
  - Stagger groups of items (coins 0.07–0.16 frames apart).
  - The twist lands with a stamp or shake on its cue word.
  - Use `Swipes` between scenes.
- Sound: soft SFX only (pop, tick, stamp, error, check, ding, whoosh, swish, bass, key) at volume 0.35–0.8, with the Jailer bed underneath. Never use "Paint The Town Red".
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

## 4. Build → check → render (inside `d2c/`)

1. Copy `src/reels/case15/` to `src/reels/<id>/`. Change `script.json`, the scenes, the CTA props and the cover. Register `<Comp>` and `<Comp>Cover` in `src/Root.tsx`.
2. Run `npx tsc --noEmit -p .`.
3. Run `node scripts/stills.mjs <Comp> <f1> <f2> …` for 10–12 frames, at the moments with the most on screen in every scene.
4. Make a contact sheet with PIL and **look at it**. Fix overlaps, clipped text, labels showing "₹0" and anything outside the safe area. Check again.
5. Render:
   ```
   npx remotion render src/index.ts <Comp> out/<id>_tmp.mp4 --codec h264 --crf 18 --x264-preset veryfast --audio-codec aac --audio-bitrate 256k --browser-executable=$(ls -d /opt/pw-browsers/chromium_headless_shell-*/chrome-headless-shell-linux64)/chrome-headless-shell --concurrency=2 --log=error
   ```
   This takes several minutes, so run it in the background.
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

**Manifest item** in `queue/d2cfounders/manifest.json`, in calendar order. Never move posted items. Fields:
- `id`, `title`, `video`, `caption`
- `audioName`: "D2C Founders · <title>"
- `thumbOffsetMs`: about 1500
- `look`: "hisaab" or "cartoon" (whichever look was used)
- `type`, `hook`, `keyword`, `pinnedComment`

**Caption:**
1. First line: the CASE tag and the hook.
2. The numbers, and "(Example numbers…)" if they are examples.
3. 3 ✅ fixes.
4. "👇 Comment karo KEYWORD, … free DM mein."
5. A blank line.
6. 5 hashtags (#D2CIndia #D2CFounders + 3 topical).

Do not add the free-report or WhatsApp lines. The posting step adds the English footer from `captionCta`.

**Finish up:**
- Commit (user.name reel-autopilot) with the reel source and voice clips.
- Run `git fetch origin main && git rebase origin/main`, then push.
- Set the calendar row's Status to "Queued".
- Send Akshay the mp4 and the cover (SendUserFile) and the hook.
- Posting reels or changing the posting workflows needs his explicit OK. Queueing a finished reel does not.

## 6. Cartoon look (the only look)

**References:**
- Template reels: `d2c/src/reels/case37/`, `case38/`, or any remake (`case15/`, `case26/`).
- `d2c/src/components/toon.tsx` (added 7 Nov) saves most of the work: `CartoonReel` (whole reel wrapper), `FixBoard` (Doctor + whiteboard fixes scene), `CtaScene` (Doctor + CtaFlow), `ToonCover`, `Panel`, `Pop`, `StackBar`, `Gauge`, `ToonPhone`, `Verdict`, `Folk`, `ToonSpinner`, `Stopwatch`.
- Kit in `d2c/src/components/`:
  - `Cartoon.tsx`: Rohit and Priya, plus props.
  - `Doctor.tsx`: the D2C Doctor.
  - `sets.tsx`: Dispatch/PackTable, OfficeWall/Desk, Doorstep, MoneyRoom, Stage, Clinic/Whiteboard.
  - `props.tsx`: Scale, Phone/Bubble, Coupon, Calendar, Bottle, Bell, Stars, QMarks, FlyTag, NameTag, Jar, Parcel, Piggy, Truck, Burst, Confetti.
  - `format.tsx`: HookTitle, CtaFlow (with `nextLabel`), Place, makeMouth.
  - Also `kit`, `fx`, `widgets` and `overlay`.

**Cast:**
- **Rohit** is the founder (mustard hoodie).
- **Priya** is the customer (teal top).
- The **D2C Doctor** walks in and explains the fixes.
- Use the same cast every time, so viewers recognise the page.

**Hook:**
- The claim is on screen from frame 0 with `HookTitle`: at most 2 title lines, the first at `at: -8`.
- Use a clean backdrop (for example `MoneyRoom`).
- Show one visual at a time, swapping on cue words instead of stacking them.

**Other rules:**
- Karaoke `Captions` at top 1440, `Swipes` between scenes, `TopBar` tag, `Grade`/`Grain`/`Vignette`.
- The CTA uses `CtaFlow`:
  1. ① "Comment karo" + the keyword.
  2. ② "DM mein milega" + what arrives.
  3. The next-reel card, with `nextLabel` = the real slot.
  4. Follow.
- Script length, voice (pace 1.15, one clip per scene, no colons), checks, render, mix, encode and queue are exactly as in sections 1, 2, 4 and 5. Set manifest `look` = `"cartoon"`.

## Other pages

The script, voice and checking rules apply to every page. Astro 24x7 keeps testing its own looks in its own chat. When a page uses the hisaab look, change its palette and logo:
- **D2C Founders:** navy #12044B, violet #6D4AFD → #3618B4, lavender #DFC8FD.
- **Astro 24x7:** its own orange + white with a little black, and its own logo.
- **A new page:** use its logo colours.

Green and red stay for good/bad and money in/out. Each page has its own Remotion project (Astro 24x7 is in the repo root). Port `hisaab.tsx` into it, with that page's colours and logo, and show Akshay the first reel before making more.