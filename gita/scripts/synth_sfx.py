"""Synthesizes the shared sound effects (whoosh-air, boom, flare) into public/sfx/ as 44.1 kHz stereo wav.
The reels use mp3 copies: ffmpeg -i X.wav -c:a libmp3lame -b:a 192k X.mp3"""
import numpy as np, wave, os
SR = 44100
OUT = os.path.join(os.path.dirname(__file__), "..", "public", "sfx")
rng = np.random.default_rng(7)

def save(name, L, R=None, peak=0.7):
    R = L if R is None else R
    m = max(np.abs(L).max(), np.abs(R).max()) + 1e-9
    st = np.stack([L, R], 1) * (peak / m)
    with wave.open(os.path.join(OUT, name), "wb") as w:
        w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR)
        w.writeframes((np.clip(st, -1, 1) * 32767).astype(np.int16).tobytes())

def sweep_filter(x, centers, width_oct):
    """Time-varying band-pass: STFT, gaussian band around centers[frame] (Hz), overlap-add."""
    N, H = 2048, 512
    win = np.hanning(N)
    out = np.zeros(len(x) + N); norm = np.zeros(len(x) + N)
    fr = np.fft.rfftfreq(N, 1 / SR)
    nfr = (len(x) - N) // H + 1
    for k in range(nfr):
        i = k * H
        c = centers[min(len(centers) - 1, int(k * len(centers) / nfr))]
        g = np.exp(-0.5 * (np.log2((fr + 1) / c) / width_oct) ** 2)
        y = np.fft.irfft(np.fft.rfft(x[i:i + N] * win) * g)
        out[i:i + N] += y * win; norm[i:i + N] += win ** 2
    return (out / np.maximum(norm, 1e-6))[: len(x)]

def lowpass_sweep(x, cut):
    N, H = 2048, 512
    win = np.hanning(N); fr = np.fft.rfftfreq(N, 1 / SR)
    out = np.zeros(len(x) + N); norm = np.zeros(len(x) + N)
    nfr = (len(x) - N) // H + 1
    for k in range(nfr):
        i = k * H; c = cut[min(len(cut) - 1, int(k * len(cut) / nfr))]
        g = 1 / (1 + (fr / c) ** 4)
        y = np.fft.irfft(np.fft.rfft(x[i:i + N] * win) * g)
        out[i:i + N] += y * win; norm[i:i + N] += win ** 2
    return (out / np.maximum(norm, 1e-6))[: len(x)]

def pink(n):
    w = rng.standard_normal(n); F = np.fft.rfft(w); f = np.fft.rfftfreq(n); f[0] = f[1]
    return np.fft.irfft(F / np.sqrt(f), n)

# whoosh: 1.1 s band-passed noise sweeping up then down, panned left to right
n = int(1.1 * SR); t = np.arange(n) / SR
cent = np.concatenate([np.geomspace(250, 2600, 60), np.geomspace(2600, 700, 40)])
x = sweep_filter(pink(n + 4096), cent, 0.6)[:n]
env = np.sin(np.pi * np.clip(t / 1.1, 0, 1)) ** 2 * np.exp(-((t - 0.62) / 0.35) ** 2)
x *= env
pan = np.clip(t / 1.1, 0, 1)
save("whoosh-air.wav", x * np.cos(pan * np.pi / 2) * 1.2, x * np.sin(pan * np.pi / 2) * 1.2, 0.6)

# boom: sub drop 70 -> 32 Hz with a short noise punch and a long rumble tail
n = int(3.0 * SR); t = np.arange(n) / SR
f = 32 + 38 * np.exp(-t / 0.35)
sub = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t / 0.9) * (1 - np.exp(-t / 0.004))
punch = lowpass_sweep(rng.standard_normal(n + 4096), np.geomspace(1800, 120, 40))[:n] * np.exp(-t / 0.09)
tail = lowpass_sweep(pink(n + 4096), [90])[:n] * np.exp(-t / 1.1) * 0.6
b = sub + 0.35 * punch / (np.abs(punch).max() + 1e-9) + tail / (np.abs(tail).max() + 1e-9) * 0.4
save("boom.wav", b, b, 0.85)

# flare: fire whoosh (low-pass sweep up then down) with crackles
n = int(1.8 * SR); t = np.arange(n) / SR
cut = np.concatenate([np.geomspace(180, 3200, 25), np.geomspace(3200, 400, 75)])
x = lowpass_sweep(pink(n + 4096), cut)[:n]
x *= (1 - np.exp(-t / 0.12)) * np.exp(-np.maximum(0, t - 0.35) / 0.55)
cr = np.zeros(n)
for _ in range(70):
    i = rng.integers(int(0.1 * SR), n - 2000); L = rng.integers(60, 400)
    cr[i:i + L] += rng.standard_normal(L) * np.exp(-np.arange(L) / (L / 4)) * rng.uniform(0.3, 1)
cr *= np.exp(-t / 0.9)
x = x / (np.abs(x).max() + 1e-9) + 0.35 * cr / (np.abs(cr).max() + 1e-9)
save("flare.wav", x, np.roll(x, 300), 0.7)
print("ok")
