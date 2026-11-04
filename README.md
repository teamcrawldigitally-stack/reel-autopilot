# Reel Autopilot

Every day, on its own:

1. **Research** – Claude searches the web for what's new or trending in your niche and picks one topic you haven't posted before.
2. **Script** – Claude writes a 30–40s reel: hook → points / stat / checklist → call to action, plus the Instagram caption and hashtags. It may only use facts it found, and it lists its sources.
3. **Voiceover** – each scene is spoken by a free Microsoft neural voice, with word-level timings.
4. **Video** – Remotion renders a 1080×1920 motion-graphics reel in code: animated headlines, counters, checklists, word-by-word captions synced to the voice, whoosh/hit sound effects.
5. **Check** – the file is checked (size, length, audio) before anything is posted.
6. **Post** – published as a Reel through Instagram's official API, then logged so the topic isn't repeated.

**No paid API keys.** Everything it uses is free or already yours:

| Part | What it uses | Cost |
|---|---|---|
| Research + script | Claude Code, logged in with your existing Claude Pro/Max plan | Counts toward your plan's normal usage limits, no extra bill |
| Voice | Microsoft Edge neural voices via `edge-tts` | Free, no key |
| Video | Remotion | Free for individuals and teams of up to 3 people |
| Posting | Instagram's official Graph API | Free (a token from Meta's developer site, not a purchase) |
| Daily schedule | GitHub Actions | Free (about 10 minutes a day) |

It runs on **GitHub Actions** every day at ~7 PM IST, so no computer needs to be on.

```
pipeline/run-daily.mjs   the daily run (all steps above)
pipeline/research.mjs    step 1–2 (Claude Code + web search, your subscription)
pipeline/voiceover.py    step 3
src/                     the Remotion reel template (scenes, captions, theme)
pipeline/publish.mjs     step 6 (Instagram Graph API)
config/channel.json      your niche, voice, colors, posting settings
history/posted.json      everything already posted (auto-updated)
```

---

## 1. Fill in `config/channel.json`

| Field | What to put |
|---|---|
| `account.name`, `account.handle` | Shown on the video (handle chip + end card) |
| `niche`, `audience`, `tone` | Be specific. This drives what Claude researches and how it writes |
| `contentPillars`, `avoidTopics` | Kinds of reels you want / never want |
| `language` | `english`, `hinglish` or `hindi` |
| `colors` | Your brand colors. `primary` is the single hero color (highlights, counter, CTA button) |
| `voice.edgeVoice` | Free voice. English (India): `en-IN-PrabhatNeural` (male), `en-IN-NeerjaNeural` (female). Hindi/Hinglish: `hi-IN-MadhurNeural` (male), `hi-IN-SwaraNeural` (female) |
| `voice.rate` | Speed, e.g. `+8%` |
| `reel.targetSeconds` | Reel length target (30–40 works well) |
| `reel.music` | Optional background music file placed in `public/` (e.g. `"music/bed.mp3"`). Use only music you have rights to. Trending Instagram audio can't be added through the API |
| `posting.aiLabel` | Adds Instagram's "AI info" label. Left on because the voice is synthetic; Meta asks for realistic AI audio to be labeled |
| `posting.fixedHashtags` | Hashtags added to every post |
| `posting.enabled` | `false` = render every day but don't post (good for the first week) |
| `research.model` | `sonnet` (default, lighter on your usage limits) or `opus` |
| `research.preferredSites` | Optional list of sites to favour when researching |

## 2. Connect your accounts (all free)

**Claude** – uses your Claude Pro or Max subscription through Claude Code, no API key.
- On your Mac: install Claude Code (`npm install -g @anthropic-ai/claude-code`), run `claude` once and log in.
- For GitHub: on your Mac run `claude setup-token`, log in, and copy the token it prints. That's `CLAUDE_CODE_OAUTH_TOKEN`. It's tied to your plan; if it ever stops working, run the command again and replace the secret.

**Instagram** – free (needs a Professional account: Creator or Business, connected to a Facebook Page):

1. Go to developers.facebook.com → **Create app** → use case that includes the **Instagram API with Facebook Login** (business type).
2. In Business Settings (business.facebook.com) → **System users** → add a system user (Admin), give it access to your app, your Facebook Page and the Instagram account.
3. **Generate token** for that system user with these permissions: `instagram_basic`, `instagram_content_publish`, `pages_show_list`, `pages_read_engagement`, `business_management`. Choose "Never" for expiry. This is `IG_ACCESS_TOKEN`.
4. Find your Instagram account ID: open Graph API Explorer with that token and run
   `GET /me/accounts?fields=name,instagram_business_account` – the `instagram_business_account.id` is `IG_USER_ID`.

For your **own** accounts (people/system users with a role on the app) the app can usually stay in development mode; App Review is for apps that other people log into.

## 3. Put it on GitHub (runs daily in the cloud)

1. Create a **private** repo and push this folder to it.
2. Repo → Settings → Secrets and variables → Actions → add `CLAUDE_CODE_OAUTH_TOKEN`, `IG_USER_ID`, `IG_ACCESS_TOKEN`.
3. Actions tab → **Daily reel** → **Run workflow** → tick "Render only, don't post" for a first test. When it finishes, download the artifact to watch the reel, read `caption.txt` and `script.json` (with sources).
4. Happy with it? Nothing else to do: it runs every day at the time in `.github/workflows/daily-reel.yml` (`17 13 * * *` = 6:47 PM IST start, live by ~7 PM). Change the cron to change the time (cron is in UTC = IST − 5:30).

If a run fails, GitHub emails you, nothing is posted, and the run files are kept for 14 days. It never posts twice on the same day.

## Run it on your Mac instead

```bash
npm install
pip3 install -r requirements.txt     # needs Python 3 and ffmpeg (brew install ffmpeg)
cp .env.example .env                 # fill in the Instagram ID + token
claude                               # once: log in to Claude Code with your Claude account
npm run dry-run                      # full run, no posting – check runs/<date>/reel.mp4
npm run daily                        # full run + post
```

To schedule it on the Mac (it must be awake at that time):

1. Run `claude setup-token` and put the token in `.env` as `CLAUDE_CODE_OAUTH_TOKEN` (scheduled jobs can't always read your normal Claude login).
2. `crontab -e` and add:

```
PATH=/opt/homebrew/bin:/usr/local/bin:/usr/bin:/bin
47 18 * * * cd ~/reel-autopilot && node pipeline/run-daily.mjs >> runs/cron.log 2>&1
```

## Handy commands

```bash
npm run sample                                     # render samples/sample-script.json, no research, no posting
node pipeline/run-daily.mjs --dry-run --tts espeak # robotic offline voice for testing (Linux, needs: pip install espeakng-loader)
node pipeline/research.mjs runs/test/script.json   # only research + script
npm run studio                                     # open the template in Remotion Studio to tweak the design (previews the sample reel)
node pipeline/publish.mjs runs/<id>/reel.mp4 "caption"  # post a reel you rendered earlier
```

## Changing the look

- Colors: `config/channel.json → colors`.
- Fonts, easing, layout safe zones: `src/theme.ts`.
- Scene designs: `src/scenes/Scenes.tsx` (`hook`, `point`, `stat`, `list`, `cta`).
- Captions: `src/components/Captions.tsx`.

## Licensing notes

- **Remotion** is free for individuals and companies of up to 3 people. If this runs for a company with 4+ people, it needs a Remotion company license (remotion.dev/license).
- The free voices come from Microsoft Edge's online text-to-speech through the open-source `edge-tts` library. It's unofficial and could change; if it ever breaks, the pipeline fails safely (nothing is posted) and GitHub emails you.

## Posting queue (live now)

`.github/workflows/post-queue.yml` posts 2 ready-made reels a day from `queue/astro24x7/` (12:47 PM and 6:47 PM IST, `perDay` in the manifest), each followed 3 hours later (3:47 PM, 9:47 PM) by a **trial copy** (shown to non-followers first, shared to followers automatically if it performs well; `trialCopy` in the manifest, `"enabled": false` turns it off).

- **Order and captions:** `queue/astro24x7/manifest.json`. Add new reels at the end.
- **What went out:** `state/astro24x7-posted.json` (updated by the job).
- **Pause:** set `"paused": true` in the manifest, or disable the workflow under Actions.
- **Test without posting:** Actions → Post queued reels → Run workflow → mode `test`.
- **Post the next one right now:** same, mode `post-now` (kind `normal` or `trial`).
- **Secrets:** `IG_ACCESS_TOKEN` (from the Meta App Dashboard → Instagram API → Generate token; the Unified-login system-user token never expires). Optional `TOKEN_KEY` (any long random sentence), only needed for 60-day Instagram Login tokens, which the job renews and stores encrypted in `state/`.
- The video is uploaded straight to Instagram (resumable upload). Backup if that is refused: a temporary Cloudflare quick-tunnel link that Instagram fetches, closed when the job ends.
