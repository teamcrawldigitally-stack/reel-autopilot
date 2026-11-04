"""Synthesize a soft SFX kit as 16-bit WAVs (no downloads).
Soft version (5 Nov): everything low-passed, shorter tails, no square-wave buzz."""
import numpy as np, wave, os

SR = 44100
OUT = os.path.join(os.path.dirname(__file__), "..", "public", "sfx")
rng = np.random.default_rng(7)


def lowpass(x, cutoff):
    cutoff = np.broadcast_to(cutoff, x.shape)
    y = np.zeros_like(x); prev = 0.0
    for i in range(len(x)):
        a = 1 - np.exp(-2 * np.pi * cutoff[i] / SR)
        prev = prev + a * (x[i] - prev)
        y[i] = prev
    return y


def save(name, x, gain=0.5, soften=4500):
    x = np.asarray(x, dtype=np.float64)
    if soften:
        x = lowpass(x, soften)
    peak = np.max(np.abs(x)) or 1.0
    x = x / peak * gain
    n = min(len(x) // 10, 600)
    if n > 0:
        x[:n // 4] *= np.linspace(0, 1, n // 4)
        x[-n:] *= np.linspace(1, 0, n)
    with wave.open(os.path.join(OUT, name), "wb") as w:
        w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR)
        w.writeframes((x * 32767).astype(np.int16).tobytes())


def t(sec):
    return np.arange(int(SR * sec)) / SR


def tone(f, tt):
    return np.sin(2 * np.pi * np.cumsum(np.broadcast_to(f, tt.shape)) / SR)


# whoosh: airy, darker, smooth bell envelope
tt = t(0.45)
sweep = 250 + 2200 * np.sin(np.pi * tt / tt[-1]) ** 2
save("whoosh.wav", lowpass(rng.standard_normal(len(tt)), sweep) * np.sin(np.pi * tt / tt[-1]) ** 2.2, 0.35, 3000)

# swish: short soft air
tt = t(0.25)
sweep = 200 + 1500 * np.sin(np.pi * tt / tt[-1]) ** 2
save("swish.wav", lowpass(rng.standard_normal(len(tt)), sweep) * np.sin(np.pi * tt / tt[-1]) ** 2.5, 0.28, 2500)

# pop: soft bubble
tt = t(0.12)
save("pop.wav", tone(520 * np.exp(-tt * 18) + 260, tt) * np.exp(-tt * 34), 0.32, 3000)

# stamp: soft paper thud (low body + a little paper texture)
tt = t(0.32)
thud = tone(95 * np.exp(-tt * 10) + 50, tt) * np.exp(-tt * 12)
paper = lowpass(rng.standard_normal(len(tt)), 1400) * np.exp(-tt * 45)
save("stamp.wav", thud + paper * 0.5, 0.55, 2200)

# tick: soft wooden tick
tt = t(0.04)
save("tick.wav", tone(1300, tt) * np.exp(-tt * 160), 0.18, 3500)

# key: soft keyboard tap
tt = t(0.045)
k = lowpass(rng.standard_normal(len(tt)), 2200) * np.exp(-tt * 130) + 0.5 * tone(900, tt) * np.exp(-tt * 150)
save("key.wav", k, 0.2, 3000)

# ding: soft marimba-like two notes
tt = t(0.6)
d = (tone(784, tt) + 0.35 * tone(1568, tt)) * np.exp(-tt * 7)
d2 = np.concatenate([np.zeros(int(SR * 0.09)), (tone(1047, tt) + 0.3 * tone(2094, tt)) * np.exp(-tt * 8)])[: len(tt)]
save("ding.wav", d + 0.8 * d2, 0.28, 4000)

# check: gentle rising blip
tt = t(0.14)
save("check.wav", tone(600 + 500 * (tt / tt[-1]), tt) * np.exp(-tt * 18), 0.24, 3500)

# error: soft descending "boop boop" (no buzz)
tt = t(0.11)
b1 = tone(392, tt) * np.exp(-tt * 22)
b2 = tone(311, tt) * np.exp(-tt * 22)
save("error.wav", np.concatenate([b1, np.zeros(int(SR * 0.03)), b2]), 0.24, 2500)

# riser: soft airy swell
tt = t(0.9)
r = lowpass(rng.standard_normal(len(tt)), 300 + 2500 * tt) * 0.7 + 0.3 * tone(220 + 440 * (tt / tt[-1]) ** 2, tt)
save("riser.wav", r * (tt / tt[-1]) ** 2.5, 0.25, 3000)

# bass: warm soft sub hit
tt = t(0.55)
save("bass.wav", tone(62 * np.exp(-tt * 3) + 40, tt) * np.exp(-tt * 6), 0.5, 800)

print(sorted(os.listdir(OUT)))
