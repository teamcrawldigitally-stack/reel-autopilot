#!/usr/bin/env python3
"""Voiceover step: speaks each scene's `voiceover` line, stitches the clips into
one track and records word-level timings for the captions.

Providers
  edge        free Microsoft neural voices (default, needs internet)
  elevenlabs  paid, best Hindi/Hinglish quality (needs ELEVENLABS_API_KEY)
  espeak      robotic offline voice, only for testing the pipeline without internet

Usage
  python3 pipeline/voiceover.py --script runs/2026-11-04/script.json \
      --config config/channel.json --out-dir public/run [--provider edge]

Writes <out-dir>/vo.wav and <out-dir>/timeline.json:
  {"durationMs":..., "scenes":[{"startMs","endMs"}], "words":[{"text","startMs","endMs"}]}
"""
import argparse
import asyncio
import base64
import json
import os
import re
import subprocess
import sys
import tempfile
import time
import urllib.request
import wave


# ---------- helpers ----------

def run(cmd):
    res = subprocess.run(cmd, capture_output=True, text=True)
    if res.returncode != 0:
        raise RuntimeError(f"{' '.join(cmd[:3])}... failed:\n{res.stderr[-1500:]}")
    return res


def to_wav(src, dst):
    run(["ffmpeg", "-y", "-v", "error", "-i", src, "-ar", "48000", "-ac", "1", "-c:a", "pcm_s16le", dst])


def wav_ms(path):
    with wave.open(path, "rb") as w:
        return w.getnframes() * 1000.0 / w.getframerate()


def norm(s):
    return re.sub(r"[^\w]+", "", s.lower(), flags=re.UNICODE)


def align_to_script(words, text):
    """TTS word events drop punctuation and sometimes skip short words.
    Map them back onto the original tokens so captions show the exact script."""
    tokens = text.split()
    ptr, unmatched = 0, []
    for wi, w in enumerate(words):
        target = norm(w["text"])
        found = None
        for j in range(ptr, min(ptr + 5, len(tokens))):
            nt = norm(tokens[j])
            if target and (nt == target or (len(target) >= 3 and nt.startswith(target))):
                found = j
                break
        if found is None:
            unmatched.append(wi)
            continue
        skipped = tokens[ptr:found]
        if skipped and unmatched:
            words[unmatched[0]]["text"] = " ".join(skipped)
            for k in unmatched[1:]:
                words[k]["text"] = ""
            w["text"] = tokens[found]
        elif skipped:
            w["text"] = " ".join(skipped + [tokens[found]])
        else:
            w["text"] = tokens[found]
        unmatched = []
        ptr = found + 1
    if ptr < len(tokens) and words:
        tail = " ".join(tokens[ptr:])
        if unmatched:
            words[unmatched[0]]["text"] = tail
            for k in unmatched[1:]:
                words[k]["text"] = ""
        else:
            words[-1]["text"] += " " + tail
    return [w for w in words if w["text"]]


def retry(fn, tries=3, wait=4):
    last = None
    for i in range(tries):
        try:
            return fn()
        except Exception as e:  # noqa: BLE001
            last = e
            print(f"  attempt {i + 1} failed: {e}", file=sys.stderr)
            time.sleep(wait * (i + 1))
    raise last


# ---------- providers: each returns (audio_path, [words with ms relative to clip start]) ----------

def synth_edge(text, voice_cfg, workdir, idx):
    import edge_tts

    out = os.path.join(workdir, f"s{idx}.mp3")

    async def go():
        comm = edge_tts.Communicate(
            text,
            voice_cfg.get("edgeVoice", "en-IN-PrabhatNeural"),
            rate=voice_cfg.get("rate", "+8%"),
            pitch=voice_cfg.get("pitch", "+0Hz"),
            boundary="WordBoundary",
        )
        words = []
        with open(out, "wb") as f:
            async for chunk in comm.stream():
                if chunk["type"] == "audio":
                    f.write(chunk["data"])
                elif chunk["type"] == "WordBoundary":
                    start = chunk["offset"] / 10000.0
                    words.append({"text": chunk["text"], "startMs": start,
                                  "endMs": start + chunk["duration"] / 10000.0})
        if not words or os.path.getsize(out) == 0:
            raise RuntimeError("edge-tts returned no audio")
        return words

    words = retry(lambda: asyncio.run(go()))
    return out, words


def synth_elevenlabs(text, voice_cfg, workdir, idx):
    key = os.environ.get("ELEVENLABS_API_KEY")
    if not key:
        raise RuntimeError("ELEVENLABS_API_KEY is not set")
    voice_id = voice_cfg.get("elevenlabsVoiceId")
    if not voice_id:
        raise RuntimeError("voice.elevenlabsVoiceId is missing in config/channel.json")
    url = f"https://api.elevenlabs.io/v1/text-to-speech/{voice_id}/with-timestamps?output_format=mp3_44100_128"
    body = json.dumps({
        "text": text,
        "model_id": voice_cfg.get("elevenlabsModel", "eleven_multilingual_v2"),
        "voice_settings": {"stability": 0.45, "similarity_boost": 0.8, "style": 0.25},
    }).encode()

    def call():
        req = urllib.request.Request(url, data=body, method="POST",
                                     headers={"xi-api-key": key, "Content-Type": "application/json"})
        with urllib.request.urlopen(req, timeout=120) as r:
            return json.loads(r.read())

    data = retry(call)
    out = os.path.join(workdir, f"s{idx}.mp3")
    with open(out, "wb") as f:
        f.write(base64.b64decode(data["audio_base64"]))
    al = data.get("alignment") or data.get("normalized_alignment")
    words, cur = [], None
    for ch, s, e in zip(al["characters"], al["character_start_times_seconds"], al["character_end_times_seconds"]):
        if ch.isspace():
            if cur:
                words.append(cur)
            cur = None
            continue
        if cur is None:
            cur = {"text": ch, "startMs": s * 1000, "endMs": e * 1000}
        else:
            cur["text"] += ch
            cur["endMs"] = e * 1000
    if cur:
        words.append(cur)
    return out, words


def synth_espeak(text, voice_cfg, workdir, idx):
    """Offline test voice via the espeakng-loader wheel (pip install espeakng-loader)."""
    import ctypes
    import espeakng_loader

    lib = getattr(synth_espeak, "_lib", None)
    if lib is None:
        lib = ctypes.CDLL(espeakng_loader.get_library_path())

        class Event(ctypes.Structure):
            _fields_ = [("type", ctypes.c_int), ("unique_identifier", ctypes.c_uint),
                        ("text_position", ctypes.c_int), ("length", ctypes.c_int),
                        ("audio_position", ctypes.c_int), ("sample", ctypes.c_int),
                        ("user_data", ctypes.c_void_p), ("id", ctypes.c_char * 8)]

        synth_espeak.Event = Event
        synth_espeak.CB = ctypes.CFUNCTYPE(ctypes.c_int, ctypes.POINTER(ctypes.c_short), ctypes.c_int,
                                           ctypes.POINTER(Event))
        data_dir = os.path.dirname(espeakng_loader.get_data_path())
        rate = lib.espeak_Initialize(2, 0, data_dir.encode(), 0x8000)  # AUDIO_OUTPUT_SYNCHRONOUS
        if rate <= 0:
            raise RuntimeError("espeak init failed")
        synth_espeak.rate = rate
        lib.espeak_SetVoiceByName(voice_cfg.get("espeakVoice", "en-us").encode())
        lib.espeak_SetParameter(1, 175, 0)  # words per minute
        synth_espeak._lib = lib

    samples, events = [], []

    def cb(wav, n, ev):
        if wav and n > 0:
            samples.extend(wav[:n])
        i = 0
        while ev[i].type != 0:
            if ev[i].type == 1:  # WORD
                events.append((ev[i].text_position, ev[i].length, ev[i].audio_position))
            i += 1
        return 0

    cbf = synth_espeak.CB(cb)
    lib.espeak_SetSynthCallback(cbf)
    buf = text.encode("utf-8")
    lib.espeak_Synth(buf, len(buf) + 1, 0, 1, 0, 1, None, None)  # POS_CHARACTER, espeakCHARS_UTF8
    lib.espeak_Synchronize()

    out = os.path.join(workdir, f"s{idx}.wav")
    with wave.open(out, "wb") as w:
        w.setnchannels(1)
        w.setsampwidth(2)
        w.setframerate(synth_espeak.rate)
        w.writeframes(b"".join(int(s).to_bytes(2, "little", signed=True) for s in samples))
    total_ms = len(samples) * 1000.0 / synth_espeak.rate
    words = []
    for k, (pos, length, ms) in enumerate(events):
        word = text[pos - 1: pos - 1 + length] if length > 0 else ""
        end = events[k + 1][2] if k + 1 < len(events) else total_ms
        if word.strip():
            words.append({"text": word.strip(), "startMs": float(ms), "endMs": float(end)})
    return out, words


def _kokoro():
    k = getattr(_kokoro, "_k", None)
    if k is None:
        from kokoro_onnx import Kokoro
        root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
        model = os.path.join(root, "models", "kokoro-v1.0.onnx")
        voices = os.path.join(root, "models", "voices-v1.0.bin")
        if not (os.path.exists(model) and os.path.exists(voices)):
            raise RuntimeError("Kokoro model files missing: run `npm run models` first")
        k = _kokoro._k = Kokoro(model, voices)
    return k


def _kokoro_phonemes(k, text, lang):
    ph = k.tokenizer.phonemize(text, lang=lang)
    if lang.startswith("hi"):
        # espeak writes the Hindi flap (ड़/ढ़) as "r." — map it to the real phoneme.
        ph = ph.replace("r.h", "ɽʰ").replace("r.", "ɽ")
    return ph


def _ph_len(ph):
    return max(1, len(re.sub(r"[ˈˌ\s.,!?:;—-]", "", ph)))


def synth_kokoro(text, voice_cfg, workdir, idx):
    """Free offline neural voice (Kokoro-82M, Apache-2.0). Synthesises clause by clause so
    every clause boundary is exact; words inside a clause are timed by phoneme length."""
    k = _kokoro()
    lang = voice_cfg.get("kokoroLang", "hi")
    voice = voice_cfg.get("kokoroVoice", "hm_omega")
    speed = float(voice_cfg.get("kokoroSpeed", 1.1))
    rate = 24000
    clauses = [c.strip() for c in re.findall(r"[^,।?!:;]+[,।?!:;]?", text) if c.strip()]
    pieces, words, cursor = [], [], 0.0
    import numpy as np
    for ci, clause in enumerate(clauses):
        ph = _kokoro_phonemes(k, clause, lang)
        audio, rate = k.create(ph, voice=voice, speed=speed, lang=lang, is_phonemes=True)
        dur = len(audio) * 1000.0 / rate
        toks = clause.split()
        lens = [_ph_len(_kokoro_phonemes(k, t, lang)) for t in toks]
        total = float(sum(lens))
        lead, tail = 30.0, 60.0
        span = max(dur - lead - tail, dur * 0.8)
        t = cursor + lead
        for tok, n in zip(toks, lens):
            d = span * n / total
            words.append({"text": tok, "startMs": t, "endMs": t + d})
            t += d
        pieces.append(audio)
        cursor += dur
        if ci < len(clauses) - 1:
            end = clause[-1]
            gap = 0.30 if end in "।?!" else 0.14 if end in ",:;" else 0.06
            pieces.append(np.zeros(int(rate * gap), dtype=np.float32))
            cursor += gap * 1000
    out = os.path.join(workdir, f"s{idx}.wav")
    import soundfile as sf
    sf.write(out, np.concatenate(pieces), rate)
    return out, words


def synth_sarvam(text, voice_cfg, workdir, idx):
    """Sarvam AI Bulbul (Indian voices). Needs SARVAM_API_KEY. One request per sentence so
    sentence boundaries are exact; words inside a sentence are timed by letter count."""
    import io
    import numpy as np
    import soundfile as sf

    key = os.environ.get("SARVAM_API_KEY")
    if not key:
        raise RuntimeError("SARVAM_API_KEY is not set")
    if voice_cfg.get("sarvamPerScene", True):
        # One request per scene (natural flow, same as the reels made from chat); words are
        # timed from the audio itself.
        body = json.dumps({
            "text": text,
            "target_language_code": voice_cfg.get("sarvamLang", "hi-IN"),
            "speaker": voice_cfg.get("sarvamSpeaker", "shubh"),
            "model": voice_cfg.get("sarvamModel", "bulbul:v3"),
            "pace": float(voice_cfg.get("sarvamPace", 1.0)),
            "speech_sample_rate": 44100,
        }).encode()

        def call_scene():
            req = urllib.request.Request("https://api.sarvam.ai/text-to-speech", data=body, method="POST",
                                         headers={"api-subscription-key": key, "Content-Type": "application/json"})
            with urllib.request.urlopen(req, timeout=120) as r:
                return json.loads(r.read())

        data = retry(call_scene)
        audio, sr = sf.read(io.BytesIO(base64.b64decode(data["audios"][0])), dtype="float32")
        if audio.ndim > 1:
            audio = audio.mean(axis=1)
        audio, words = align_words_energy(audio, sr, text)
        out = os.path.join(workdir, f"s{idx}.wav")
        sf.write(out, audio, sr)
        return out, words

    sentences = [s.strip() for s in re.findall(r"[^।?!]+[।?!]?", text) if s.strip()]
    rate = 24000
    pieces, words, cursor = [], [], 0.0
    for si, sentence in enumerate(sentences):
        body = json.dumps({
            "text": sentence,
            "target_language_code": voice_cfg.get("sarvamLang", "hi-IN"),
            "speaker": voice_cfg.get("sarvamSpeaker", "shubh"),
            "model": voice_cfg.get("sarvamModel", "bulbul:v3"),
            "pace": float(voice_cfg.get("sarvamPace", 1.0)),
            "temperature": float(voice_cfg.get("sarvamTemperature", 0.6)),
            "speech_sample_rate": rate,
            "output_audio_codec": "wav",
        }).encode()

        def call():
            req = urllib.request.Request("https://api.sarvam.ai/text-to-speech", data=body, method="POST",
                                         headers={"api-subscription-key": key, "Content-Type": "application/json"})
            with urllib.request.urlopen(req, timeout=120) as r:
                return json.loads(r.read())

        data = retry(call)
        audio, sr = sf.read(io.BytesIO(base64.b64decode(data["audios"][0])), dtype="float32")
        if audio.ndim > 1:
            audio = audio.mean(axis=1)
        if sr != rate:
            raise RuntimeError(f"unexpected sample rate {sr}")
        # trim leading/trailing silence so the timings line up with the speech
        loud = np.where(np.abs(audio) > 0.01)[0]
        if len(loud):
            audio = audio[max(0, loud[0] - int(rate * 0.04)): loud[-1] + int(rate * 0.06)]
        dur = len(audio) * 1000.0 / rate
        toks = sentence.split()
        lens = [max(1, len(re.sub(r"[^\w]", "", t))) for t in toks]
        total = float(sum(lens))
        t = cursor + 40.0
        span = max(dur - 100.0, dur * 0.8)
        for tok, n in zip(toks, lens):
            d = span * n / total
            words.append({"text": tok, "startMs": t, "endMs": t + d})
            t += d
        pieces.append(audio)
        cursor += dur
        if si < len(sentences) - 1:
            pieces.append(np.zeros(int(rate * 0.25), dtype=np.float32))
            cursor += 250
    out = os.path.join(workdir, f"s{idx}.wav")
    sf.write(out, np.concatenate(pieces), rate)
    return out, words


# ---------- ready-made clips (e.g. made with the Sarvam connector in Claude) ----------

_DEV_LONG = set("ाीूेैोौॉ")
_DEV_SHORT = set("िुृॅ")


def word_weight(tok):
    """Rough spoken length of a Hindi/English word, counted from its letters."""
    w = 0.6
    for ch in tok:
        o = ord(ch)
        if 0x0915 <= o <= 0x0939 or 0x0958 <= o <= 0x095F or 0x0904 <= o <= 0x0914:
            w += 1.0
        elif ch in _DEV_LONG:
            w += 0.7
        elif ch in _DEV_SHORT:
            w += 0.4
        elif ch in "ंँः":
            w += 0.3
        elif ch == "्":
            w -= 0.6
        elif ch.isalnum():
            w += 0.5
    return max(0.8, w)


def align_words_energy(audio, rate, text):
    """Times every word of `text` inside a single spoken clip.
    1) find the pauses in the audio, 2) match clause ends (, । ? : ...) to the pauses that best fit
    their expected position, 3) spread each clause's words over its speech by letter weight,
    skipping silences inside the clause. Returns (trimmed_audio, words in ms)."""
    import numpy as np

    hop = int(rate * 0.01)
    n = len(audio) // hop
    frames = audio[: n * hop].reshape(n, hop)
    db = 20 * np.log10(np.sqrt((frames ** 2).mean(axis=1)) + 1e-9)
    speech_level = np.percentile(db, 90)
    thr = speech_level - 30
    voiced = db > thr
    idx = np.where(voiced)[0]
    first, last = int(idx[0]), int(idx[-1]) + 1
    # trim: keep 40 ms before the first sound and 90 ms after the last
    a0 = max(0, first - 4)
    a1 = min(n, last + 9)
    audio = audio[a0 * hop: a1 * hop]
    voiced = voiced[a0:a1]
    first, last = first - a0, last - a0

    # pauses (>= 70 ms of silence) between first and last sound
    gaps, run_start = [], None
    for i in range(first, last):
        if not voiced[i]:
            run_start = i if run_start is None else run_start
        elif run_start is not None:
            if i - run_start >= 7:
                gaps.append((run_start, i))
            run_start = None

    def speech_before(f):
        return float(voiced[first:f].sum())

    total_speech = speech_before(last)
    clauses = [c.strip() for c in re.findall(r"[^,।?!:;]+[,।?!:;]?", text) if c.strip()]
    cw = [sum(word_weight(t) for t in c.split()) for c in clauses]
    total_w = float(sum(cw))
    exp = np.cumsum(cw)[:-1] / total_w  # expected position of each clause end (share of speech)
    strength = [1.6 if c[-1] in "।?!" else 1.0 if c[-1] in ",:;" else 0.3 for c in clauses[:-1]]
    gfrac = [speech_before(g0) / total_speech for g0, _ in gaps]
    glen = [(g1 - g0) / 100.0 for g0, g1 in gaps]  # seconds

    # DP: boundary b -> gap g (monotonic) or no gap. Cost favours close position + long pause.
    B, G = len(exp), len(gaps)
    INF = 1e9
    best = {}

    def solve(b, g):
        if b == B:
            return (sum(0.6 * max(0, l - 0.12) for l in glen[g:]), [])
        key = (b, g)
        if key in best:
            return best[key]
        # option 1: this clause end has no audible pause
        c_skip, path = solve(b + 1, g)
        res = (c_skip + 0.35 * strength[b], [None] + path)
        for k in range(g, G):
            pen_skipped = sum(0.6 * max(0, l - 0.12) for l in glen[g:k])
            cost = abs(gfrac[k] - exp[b]) * 4.0 - min(glen[k], 0.5) * strength[b] + pen_skipped
            c_rest, path = solve(b + 1, k + 1)
            if cost + c_rest < res[0]:
                res = (cost + c_rest, [k] + path)
        best[key] = res
        return res

    _, choice = solve(0, 0)

    # clause spans in frames
    spans, start = [], first
    for b, k in enumerate(choice):
        if k is None:
            # place proportionally inside the speech
            target = exp[b] * total_speech
            f = first
            acc = 0.0
            while f < last and acc < target:
                acc += voiced[f]
                f += 1
            spans.append((start, f))
            start = f
        else:
            spans.append((start, gaps[k][0]))
            start = gaps[k][1]
    spans.append((start, last))

    # Long pauses inside a clause (>= 150 ms) are almost always between two words: split the
    # clause there, at the word boundary whose expected position is closest.
    sub = []
    for clause, (s0, s1) in zip(clauses, spans):
        toks = clause.split()
        ws = [word_weight(t) for t in toks]
        tw = float(sum(ws))
        cumw = np.cumsum(ws)[:-1] / tw
        seg_sp = float(voiced[s0:s1].sum()) or 1.0
        anchors = {}  # word boundary index -> (gap start, gap end)
        long_gaps = sorted([(g0, g1) for g0, g1 in gaps if s0 < g0 and g1 < s1 and g1 - g0 >= 15],
                           key=lambda g: g[0] - g[1])
        for g0, g1 in long_gaps:
            p = float(voiced[s0:g0].sum()) / seg_sp
            lo = max([j for j in anchors if anchors[j][0] < g0], default=-1)
            hi = min([j for j in anchors if anchors[j][0] > g0], default=len(toks) - 1)
            cands = [j for j in range(lo + 1, hi) if j < len(cumw) and j not in anchors]
            if cands:
                j = min(cands, key=lambda j: abs(cumw[j] - p))
                if abs(cumw[j] - p) < 0.25:
                    anchors[j] = (g0, g1)
        start_tok, start_f = 0, s0
        for j in sorted(anchors):
            sub.append((toks[start_tok: j + 1], start_f, anchors[j][0]))
            start_tok, start_f = j + 1, anchors[j][1]
        sub.append((toks[start_tok:], start_f, s1))

    words = []
    for toks, s0, s1 in sub:
        ws = [word_weight(t) for t in toks]
        tw = float(sum(ws))
        seg_voiced = voiced[s0:s1]
        sp = float(seg_voiced.sum()) or float(s1 - s0) or 1.0
        cum = np.concatenate([[0], np.cumsum(seg_voiced if seg_voiced.sum() else np.ones(s1 - s0))])
        # internal pauses inside this clause: good places for word boundaries
        internal = [(g0, g1) for g0, g1 in gaps if s0 < g0 and g1 < s1]

        def frame_at(share):
            target = share * sp
            j = int(np.searchsorted(cum, target))
            return s0 + min(j, s1 - s0)

        acc = 0.0
        bounds = [s0]
        for wgt in ws[:-1]:
            acc += wgt
            f = frame_at(acc / tw)
            for g0, g1 in internal:  # snap to a pause if one is close by
                if abs(f - g0) <= 12 or abs(f - g1) <= 12 or g0 <= f <= g1:
                    f = g1
                    break
            bounds.append(max(f, bounds[-1] + 3))
        bounds.append(s1)
        for ti, tok in enumerate(toks):
            b0, b1 = bounds[ti], bounds[ti + 1]
            # a word ends where its sound ends, not where the following pause ends
            end = b1
            for g0, g1 in internal:
                if g0 < b1 <= g1 + 1 and g0 > b0:
                    end = g0
            words.append({"text": tok, "startMs": b0 * 10.0, "endMs": max(b0 + 3, end) * 10.0})
    return audio, words


def synth_clips(text, voice_cfg, workdir, idx):
    """Uses one ready-made clip per scene (01.wav, 02.wav, ...) from voice.clipsDir and times
    the words from the audio itself."""
    import soundfile as sf
    path = os.path.join(voice_cfg["clipsDir"], f"{idx + 1:02d}.wav")
    audio, rate = sf.read(path, dtype="float32")
    if audio.ndim > 1:
        audio = audio.mean(axis=1)
    audio, words = align_words_energy(audio, rate, text)
    out = os.path.join(workdir, f"s{idx}.wav")
    sf.write(out, audio, rate)
    return out, words


PROVIDERS = {"edge": synth_edge, "elevenlabs": synth_elevenlabs, "espeak": synth_espeak, "kokoro": synth_kokoro,
             "sarvam": synth_sarvam, "clips": synth_clips}


# ---------- main ----------

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--script", required=True)
    ap.add_argument("--config", default="config/channel.json")
    ap.add_argument("--out-dir", required=True)
    ap.add_argument("--provider", default=None)
    ap.add_argument("--clips-dir", default=None, help="folder with ready-made scene clips 01.wav, 02.wav ...")
    args = ap.parse_args()

    script = json.load(open(args.script, encoding="utf-8"))
    config = json.load(open(args.config, encoding="utf-8"))
    voice_cfg = config.get("voice", {})
    provider = args.provider or voice_cfg.get("provider", "edge")
    if args.clips_dir:
        provider = "clips"
        voice_cfg["clipsDir"] = args.clips_dir
    gap_ms = float(voice_cfg.get("gapMs", 220))
    os.makedirs(args.out_dir, exist_ok=True)
    try:
        build(script, voice_cfg, provider, gap_ms, args.out_dir)
    except Exception as e:  # noqa: BLE001
        # If the free voice is down and ElevenLabs is configured, redo the whole track there
        # (never mix two voices in one reel).
        if provider == "edge" and os.environ.get("ELEVENLABS_API_KEY") and voice_cfg.get("elevenlabsVoiceId"):
            print(f"  edge-tts failed ({e}); redoing the voiceover with ElevenLabs", file=sys.stderr)
            build(script, voice_cfg, "elevenlabs", gap_ms, args.out_dir)
        else:
            raise


def mouth_track(path, fps=30):
    """Loudness of the voice per video frame (0..1), used to move a character's mouth."""
    import numpy as np
    with wave.open(path, "rb") as w:
        rate = w.getframerate()
        a = np.frombuffer(w.readframes(w.getnframes()), dtype=np.int16).astype(np.float32) / 32768
    hop = rate // fps
    n = len(a) // hop
    rms = np.sqrt((a[: n * hop].reshape(n, hop) ** 2).mean(axis=1))
    db = 20 * np.log10(rms + 1e-6)
    v = np.clip((db + 42) / 26, 0, 1)
    return [round(float(x), 2) for x in v]


def build(script, voice_cfg, provider, gap_ms, out_dir):
    synth = PROVIDERS[provider]
    with tempfile.TemporaryDirectory() as work:
        clips, scene_times, all_words = [], [], []
        cursor = 0.0
        for i, scene in enumerate(script["scenes"]):
            text = re.sub(r"\s+", " ", scene["voiceover"]).strip()
            print(f"  [{provider}] scene {i + 1}/{len(script['scenes'])}: {text[:60]}")
            audio, words = synth(text, voice_cfg, work, i)
            wav = os.path.join(work, f"c{i}.wav")
            to_wav(audio, wav)
            dur = wav_ms(wav)
            words = align_to_script(words, text)
            for w in words:
                all_words.append({"text": w["text"], "startMs": round(cursor + w["startMs"]),
                                  "endMs": round(cursor + min(w["endMs"], dur))})
            scene_times.append({"startMs": round(cursor), "endMs": round(cursor + dur)})
            clips.append(wav)
            cursor += dur + gap_ms

        raw = os.path.join(work, "raw.wav")
        with wave.open(raw, "wb") as out:
            out.setnchannels(1)
            out.setsampwidth(2)
            out.setframerate(48000)
            silence = b"\x00\x00" * int(48000 * gap_ms / 1000)
            for k, c in enumerate(clips):
                with wave.open(c, "rb") as w:
                    out.writeframes(w.readframes(w.getnframes()))
                if k < len(clips) - 1:
                    out.writeframes(silence)

        final = os.path.join(out_dir, "vo.wav")
        # Loudness-normalise for mobile speakers (target -15 LUFS, peaks under -2 dB to leave room for SFX).
        run(["ffmpeg", "-y", "-v", "error", "-i", raw, "-af", "loudnorm=I=-15:TP=-2:LRA=11",
             "-ar", "48000", "-ac", "1", "-c:a", "pcm_s16le", final])

    timeline = {"durationMs": round(cursor - gap_ms), "scenes": scene_times, "words": all_words,
                "mouth": mouth_track(os.path.join(out_dir, "vo.wav"))}
    with open(os.path.join(out_dir, "timeline.json"), "w", encoding="utf-8") as f:
        json.dump(timeline, f, ensure_ascii=False, indent=2)
    print(f"  voiceover: {timeline['durationMs'] / 1000:.1f}s, {len(all_words)} words")


if __name__ == "__main__":
    main()
