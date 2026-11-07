"""Flags Veo clip audio that carries music. Usage: python3 scripts/sound_check.py clip.mp4 [...]
Music shows up as several half-second windows whose 3 strongest pitches all sit on equal-tempered notes.
Rule of thumb: chord-windows above about 4 of 15 means music, so keep that clip muted. Speech still needs an STT check."""
import sys, subprocess, numpy as np
NOTES = np.array([27.5 * 2 ** (k / 12) for k in range(88)])
cents = lambda f: np.min(np.abs(1200 * np.log2(f / NOTES)))
for path in sys.argv[1:]:
    raw = subprocess.run(["ffmpeg", "-v", "error", "-i", path, "-ac", "1", "-ar", "16000", "-f", "s16le", "-"], capture_output=True).stdout
    x = np.frombuffer(raw, dtype=np.int16).astype(float) / 32768
    if len(x) == 0:
        print(f"{path}: no audio"); continue
    chord = n = 0; tons = []
    for i in range(0, len(x) - 8000, 8000):
        s = x[i:i + 8000] * np.hanning(8000); F = np.abs(np.fft.rfft(s)); fr = np.fft.rfftfreq(8000, 1 / 16000)
        m = (fr > 150) & (fr < 3000); Fm = F[m]; frm = fr[m]; t = Fm.max() / np.median(Fm); tons.append(t); n += 1
        pk = []
        for j in np.argsort(Fm)[::-1]:
            if all(abs(frm[j] - p) > 12 for p in pk): pk.append(frm[j])
            if len(pk) == 3: break
        if t > 40 and all(cents(p) < 20 for p in pk): chord += 1
    rms = np.sqrt(np.mean(x ** 2))
    verdict = "MUSIC - keep muted" if chord > 4 else ("near silent" if rms < 0.004 else "ambience/sfx (check speech with STT)")
    print(f"{path}: rms {rms:.3f}  tonality {np.median(tons):.0f}  chord-windows {chord}/{n}  -> {verdict}")
