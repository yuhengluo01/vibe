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
def stamp(at, g=.16):
    add(hit(.45), at, g); add(tone(392, .2, .05), at, g * .5)
for i in range(4): add(blip(900 + i * 80, 1300 + i * 80, .06), .3 + i * .15, .06)
add(hit(1.2), 1.1, .3); ch(1.1, 1568, .4); ch(2.2, 880, .2)
add(whoosh(1.4), bar(4) - .2, .25); ch(bar(4) + 1, 659.25, .2); ch(bar(5), 784, .15); ch(bar(5) + .7, 784, .15)
for i in range(8): stamp(bar(6) + i * .22 + .05, .11)
ch(bar(7), 1318.5, .3); ch(bar(7) + .3, 784, .2); ch(bar(8), 659.25, .18)
ch(bar(9), 1568, .45); ch(bar(9) + .2, 1318.5, .3)
for i in range(4): add(blip(500, 300, .08), bar(10) + i * .22, .1)
for i in range(4): add(whoosh(.35), bar(11) + .45 + i * .55, .2); ch(bar(11) + .9 + i * .55, [880, 987.8, 1046.5, 1318.5][i], .25)
ch(bar(14), 1568, .45)
ch(bar(15), 784, .2); ch(bar(16), 880, .22); ch(bar(17) + .2, 659.25, .18); ch(bar(18), 1568, .45)
for i in range(4): stamp(bar(19) + .9 + i * .7, .13); ch(bar(19) + 1.0 + i * .7, [880, 987.8, 1046.5, 1174.7][i], .15)
ch(bar(22), 1568, .45)
ch(bar(23), 1318.5, .35); ch(bar(24), 1046.5, .25); stamp(bar(25) + .45); stamp(bar(26) + .45)
ch(bar(27), 1568, .4); ch(bar(28) + .6, 880, .2)
for i in range(3): add(whoosh(.5), bar(32 + i) - .2, .18); stamp(bar(32 + i) + .15, .13)
ch(bar(35), 1568, .45); ch(bar(36), 659.25, .2)
add(tone(196, 2.5, .8, harm=(1, 1.19, 1.5)), bar(37), .35)
ch(bar(39), 880, .2); ch(bar(39) + .6, 659.25, .15)
for i in range(4): ch(bar(41) + i * .6, [1046.5, 880, 784, 659.25][i], .15)
ch(bar(43) + .6, 1318.5, .3)
ch(bar(45), 1568, .45); add(hit(1.2), bar(45), .25)
for i in range(4): stamp(bar(45) + .95 + i * .55, .13)
ch(bar(48) + .6, 659.25, .45); ch(bar(49), 880, .35); ch(bar(50), 1318.5, .3); stamp(bar(51) + .1, .12)

mix *= 0.89 / np.max(np.abs(mix))
np.save("sfx.npy", mix); print("sfx ok", N / SR)
