"""Kissa ja ankka: musiikki ja ääniefektit syntetisoituna, ei ulkoisia äänitiedostoja.

Käyttö: python3 aani.py ulos.wav
Ajat vastaavat index.html:n kohtauksia (sekunteina).
"""
import sys
import wave
import numpy as np

SR = 44100
DUR = 12.0
N = int(SR * DUR)
rng = np.random.default_rng(7)
music = np.zeros(N)
sfx = np.zeros(N)


def tt(d):
    return np.arange(int(d * SR)) / SR


def add(buf, start, sig, gain=1.0):
    i = int(start * SR)
    if i >= N:
        return
    j = min(N, i + len(sig))
    buf[i:j] += sig[:j - i] * gain


def midi(m):
    return 440.0 * 2 ** ((m - 69) / 12)


def phase(freq, d):
    f = np.broadcast_to(np.asarray(freq, dtype=float), (int(d * SR),))
    return np.cumsum(f) / SR


def sine(freq, d):
    return np.sin(2 * np.pi * phase(freq, d))


def saw(freq, d):
    return 2 * (phase(freq, d) % 1.0) - 1


def noise(d):
    return rng.standard_normal(int(d * SR))


def band(x, lo, hi):
    X = np.fft.rfft(x)
    f = np.fft.rfftfreq(len(x), 1 / SR)
    X[(f < lo) | (f > hi)] = 0
    return np.fft.irfft(X, len(x))


def decay(d, k):
    e = np.exp(-tt(d) * k)
    a = min(len(e), int(0.004 * SR))
    e[:a] *= np.linspace(0, 1, a)
    return e


def mixsig(*sigs):
    out = np.zeros(max(len(x) for x in sigs))
    for x in sigs:
        out[:len(x)] += x
    return out


def bell(d):
    return np.sin(np.pi * np.linspace(0, 1, int(d * SR)))


# ---- Musiikki: 120 bpm, C-duuri ------------------------------------------
BEAT = 0.5
CHORDS = [(48, [60, 64, 67]), (43, [59, 62, 67]), (45, [60, 64, 69]),
          (41, [60, 65, 69]), (48, [60, 64, 67]), (43, [59, 62, 67])]
MELODY = [
    [72, None, 76, 79, 76, None, 72, 74],
    [74, None, 79, None, 74, 71, 74, None],
    [76, None, 72, None, 69, 72, 76, None],
    [77, 76, 74, 72, 74, None, 72, None],
    [72, 76, 79, 84, 79, 76, 72, None],
    [74, 79, 83, 79, 74, 71, 67, None],
]


def pluck(m, d, k):
    f = midi(m)
    return (sine(f, d) + .35 * sine(2 * f, d) + .12 * sine(3 * f, d)) * decay(d, k)


for bar, ((root, triad), mel) in enumerate(zip(CHORDS, MELODY)):
    t0 = bar * 4 * BEAT
    for b in range(4):
        tb = t0 + b * BEAT
        bass = root + (7 if b == 2 else 0)
        add(music, tb, pluck(bass, .45, 6), .55)
        stab = sum(saw(midi(m), .18) for m in triad) / 3
        add(music, tb + BEAT / 2, band(stab, 200, 3000) * decay(.18, 14), .22)
        if b in (0, 2):  # potku
            f = 45 + 80 * np.exp(-tt(.14) * 30)
            add(music, tb, sine(f, .14) * decay(.14, 18), .8)
        else:  # taputus
            add(music, tb, band(noise(.12), 900, 5000) * decay(.12, 30), .35)
        add(music, tb + BEAT / 2, band(noise(.05), 6000, 14000) * decay(.05, 60), .18)
    for i, m in enumerate(mel):
        if m is not None:
            add(music, t0 + i * BEAT / 2, pluck(m, .3, 9), .3)

# Musiikki katkeaa juuri ennen iskua ja palaa mopon käynnistyessä
g = np.ones(N)
t = np.arange(N) / SR
g[(t >= 3.72) & (t < 5.45)] = 0
fade = (t >= 3.62) & (t < 3.72)
g[fade] = 1 - (t[fade] - 3.62) / .1
rise = (t >= 5.45) & (t < 5.6)
g[rise] = (t[rise] - 5.45) / .15
music *= g


# ---- Ääniefektit ----------------------------------------------------------
def step(t0, gain=.35):
    add(sfx, t0, sine(85, .09) * decay(.09, 45) + band(noise(.09), 60, 600) * decay(.09, 60) * .5, gain)


def quack(t0, pitch=1.0, gain=.5):
    d = .2
    f = 480 * pitch * (1 - .3 * tt(d) / d) * (1 + .03 * np.sin(2 * np.pi * 30 * tt(d)))
    q = band(saw(f, d), 600, 3200) * (1 - np.exp(-tt(d) * 80)) * np.exp(-tt(d) * 9)
    add(sfx, t0, q, gain)


def whoosh(t0, d, gain=.35, lo=400, hi=3500):
    add(sfx, t0, band(noise(d), lo, hi) * bell(d) ** 2, gain)


def thud(t0, gain=.6):
    add(sfx, t0, mixsig(sine(65, .25) * decay(.25, 16), band(noise(.2), 40, 400) * decay(.2, 30) * .6), gain)


# 1) Kävely: kissan askeleet ja ankan kvaakkeet
for k in range(1, 12):
    step(k * .25, .3)
for k in range(15):
    add(sfx, .1 + k * .2, band(noise(.03), 1500, 5000) * decay(.03, 90), .08)  # ankan tassut
quack(0.7)
quack(1.55, 1.12)
quack(2.45, .95, .4)

# 2) Isku: kepin nosto, sujahdus, BONK, tähdet, kaatuminen
whoosh(3.15, .55, .2, 300, 1500)
whoosh(3.84, .18, .6, 800, 6000)
bonk = mixsig(sine(90 + 360 * np.exp(-tt(.45) * 14), .45) * decay(.45, 9),
              (sine(640, .2) + .6 * sine(1010, .2)) * decay(.2, 35) * .6,
              band(noise(.03), 1000, 6000) * decay(.03, 120) * .8)
add(sfx, 4.0, bonk, 1.0)
quack(4.02, 1.5, .45)
for rep in range(2):
    for i, m in enumerate([96, 100, 103, 108, 103]):
        add(sfx, 4.15 + rep * .5 + i * .09, sine(midi(m), .35) * decay(.35, 10), .12)
d = .45
add(sfx, 4.22, sine(1400 - 1050 * tt(d) / d + 40 * np.sin(2 * np.pi * 7 * tt(d)), d) * bell(d), .22)
thud(4.65, .7)

# 3) Moottoripyörä: käynnistys, kiihdytys, tööt, hyppy ja alastulo
d = 3.0
te = tt(d)
f = 58 + 30 * (1 - np.exp(-te * 3)) + 6 * np.sin(2 * np.pi * .7 * te)
jump = (te > 1.6) & (te < 2.1)
f[jump] += 35 * np.sin(np.pi * (te[jump] - 1.6) / .5)
eng = (saw(f, d) + .5 * saw(2 * f, d)) * (.65 + .35 * np.sin(2 * np.pi * phase(f / 2, d)))
eng = band(eng, 40, 1600) + band(noise(d), 100, 900) * .15
env = np.minimum(1, te / .12) * np.minimum(1, (d - te) / .15)
add(sfx, 5.5, eng * env, .32)
for tb in (6.35, 6.55):
    add(sfx, tb, band(np.sign(sine(440, .13)) + np.sign(sine(554, .13)), 200, 4000) * bell(.13) ** .3, .12)
whoosh(7.05, .5, .3)
thud(7.6, .5)
add(sfx, 7.62, sine(180 + 30 * np.sin(2 * np.pi * 18 * tt(.4)), .4) * decay(.4, 9), .25)  # jousi

# 4) Keittiö: siirtymä, paistuminen, kehräys, haukkaus ja mässytys
whoosh(8.35, .3, .3)
d = 3.5
siz = band(noise(d), 2500, 11000) * (.5 + .5 * np.abs(np.sin(2 * np.pi * 1.3 * tt(d))))
for _ in range(60):
    add(siz, rng.uniform(0, d - .02), band(noise(.012), 2000, 9000) * 4)
env = np.minimum(1, tt(d) / .15)
add(sfx, 8.5, siz * env, .13)
d = 1.9
purr = band(noise(d), 80, 450) * (.5 + .5 * np.sin(2 * np.pi * 24 * tt(d))) * bell(d) ** .4
add(sfx, 8.6, purr, .45)
whoosh(10.45, .35, .25, 500, 3000)  # koipi nousee suulle
for i in range(3):
    add(sfx, 11.23 + i * .045, band(noise(.035), 700, 7000) * decay(.035, 70), .7)
add(sfx, 11.3, (sine(1318, .8) + .5 * sine(1976, .8)) * decay(.8, 5), .22)
for k in range(4):
    tc = 8.5 + 2.7 + np.pi / 28 + k * np.pi / 14 + .03
    if tc < DUR:
        add(sfx, tc, band(noise(.08), 150, 1400) * decay(.08, 35), .4)

# ---- Miksaus --------------------------------------------------------------
mixed = np.tanh(1.2 * (music * .42 + sfx))
mixed /= np.max(np.abs(mixed)) / .89
fade_out = np.minimum(1, (DUR - np.arange(N) / SR) / .15)
mixed *= fade_out
pcm = (mixed * 32767).astype(np.int16)
stereo = np.repeat(pcm[:, None], 2, axis=1)

with wave.open(sys.argv[1] if len(sys.argv) > 1 else 'aani.wav', 'wb') as w:
    w.setnchannels(2)
    w.setsampwidth(2)
    w.setframerate(SR)
    w.writeframes(stereo.tobytes())
