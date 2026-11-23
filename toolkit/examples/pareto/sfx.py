import numpy as np
SR = 44100; SCALE = 1.0; BAR = 2.1258; D = 52 * BAR + 0.5; N = int(SR * D)
rng = np.random.default_rng(11)
mix = np.zeros(N)

def add(sig, at, gain=1.0):  # `at` in design seconds
    i = int(at * SCALE * SR); j = min(N, i + len(sig))
    if j > i: mix[i:j] += sig[: j - i] * gain

def env(n, a, d):
    x = np.arange(n) / SR
    return np.minimum(1, x / max(a, 1e-4)) * np.exp(-x / d)

def lp(x, k):
    y = np.empty_like(x); s = 0.0
    for i, v in enumerate(x):
        s += k * (v - s); y[i] = s
    return y

def tone(f, dur, decay, harm=(1, 2.01, 3.02)):
    n = int(dur * SR); x = np.arange(n) / SR
    return sum(np.sin(2 * np.pi * f * h * x) / (i + 1) ** 1.5 for i, h in enumerate(harm)) * env(n, .003, decay)

def hit(dur=1.6):
    n = int(dur * SR); x = np.arange(n) / SR
    boom = np.sin(2 * np.pi * np.cumsum(35 + 70 * np.exp(-x * 12)) / SR) * np.exp(-x * 2.2)
    return boom + lp(rng.standard_normal(n), 0.08) * np.exp(-x * 6) * .8

def whoosh(dur=.75):
    n = int(dur * SR); x = np.arange(n) / n; nz = rng.standard_normal(n); y = np.empty(n); s = 0.0
    for i in range(n):
        s += (0.01 + 0.25 * x[i] ** 2) * (nz[i] - s); y[i] = s
    return y * x ** 2 * 2.2

def creak(dur=.7, f0=150, f1=95):  # door swinging
    n = int(dur * SR); x = np.arange(n) / SR
    f = np.linspace(f0, f1, n)
    s = np.sin(2 * np.pi * np.cumsum(f) / SR) * (0.6 + 0.4 * np.sign(np.sin(2 * np.pi * 28 * x)))
    s = lp(s, .2) + lp(rng.standard_normal(n), .05) * .5
    return s * np.minimum(1, x / .05) * np.clip((dur - x) / .2, 0, 1)

def blip(f0, f1, dur=.18):
    n = int(dur * SR); x = np.arange(n) / SR
    return np.sin(2 * np.pi * np.cumsum(np.linspace(f0, f1, n)) / SR) * env(n, .002, dur / 3)

bar = lambda b: (b - 1) * BAR
H = hit()
def ch(at, f=1318.5, g=.3, d=.6): add(tone(f, 2.0, d), at, g)
for b in (4, 6, 15, 19, 23, 31, 37): add(H, bar(b), .8)
add(hit(2.5), bar(9), 1.2); add(hit(2.5), bar(45), 1.2)
for b in (10, 18, 22): add(H, bar(b), .7)
for b in (4, 15, 19, 23, 31, 37): add(whoosh(), bar(b) - .75, .65)
add(whoosh(1.9), bar(9) - 1.9, .95); add(whoosh(1.9), bar(45) - 1.9, .95)
ch(2.0, 880, .3)
for i in range(10): add(blip(900 + i * 60, 1300 + i * 60, .06), .8 + i * .08, .06)
ch(bar(4), 659.25, .2); ch(bar(5), 784, .2)
add(whoosh(.8), bar(5) + .5, .2); ch(bar(6) + .3, 1046.5, .3); ch(bar(7), 659.25, .2); ch(bar(7) + .9, 880, .3)
ch(bar(9), 1568, .45); ch(bar(9) + .2, 1318.5, .3); ch(bar(10), 880, .25)
for k in range(64): add(tone(1400 + (k % 8) * 90, .03, .008), bar(10) + k * (bar(13) - bar(10)) / 64, .035)
add(whoosh(1.0), bar(13) + .3, .25); ch(bar(14), 1568, .45)
ch(bar(15) + .4, 784, .2); ch(bar(16) + .4, 659.25, .2); ch(bar(17), 659.25, .18); ch(bar(18), 1568, .45)
for k in range(30): add(tone(523 + (k % 4) * 30, .05, .02), bar(19) + .5 + k * (bar(21) - bar(19) - .5) / 30, .05)
add(whoosh(.8), bar(21) + .1, .2); ch(bar(21) + .9, 1046.5, .3); ch(bar(22), 1568, .45)
ch(bar(23), 1318.5, .35); add(whoosh(1.2), bar(23) + .5, .15); ch(bar(24) + .6, 784, .2)
for i in range(3): ch(bar(25) + .6 + i * .4, [1046.5, 880, 784][i], .18)
ch(bar(27), 1568, .4); ch(bar(28) + .6, 880, .2); ch(bar(29) + .6, 1046.5, .25)
for i, tt in enumerate([bar(32), bar(33), bar(34), bar(34) + 1]): add(whoosh(.5), tt - .2, .18); ch(tt + .2, [880, 784, 659.25, 880][i], .2)
ch(bar(35), 1568, .45); ch(bar(36), 659.25, .2)
add(tone(196, 2.5, .8, harm=(1, 1.19, 1.5)), bar(37), .35)
ch(bar(39), 880, .2)
for i in range(3): ch(bar(39) + .6 + i * 1.1, [1046.5, 880, 784][i], .18)
ch(bar(42) + .4, 987.8, .2); ch(bar(43) + .2, 1318.5, .3)
ch(bar(45), 1568, .45); ch(bar(45) + .2, 1318.5, .3); ch(bar(46), 880, .22); ch(bar(47), 1046.5, .22)
ch(bar(48) + .6, 659.25, .45); ch(bar(49), 880, .35); ch(bar(50), 1318.5, .3)

mix *= 0.89 / np.max(np.abs(mix))
np.save("sfx.npy", mix); print("sfx ok", N / SR)
