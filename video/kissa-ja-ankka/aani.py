"""Kissa ja ankka: kertoja, äänitehosteet ja musiikki.

Käyttö: python3 aani.py ulos.wav [puhe.js]

- Kertoja tehdään edge-tts:llä (englanti, brittiläinen luontodokumenttiääni).
  Repliikit ja niiden alkuajat ovat alla listassa LINES.
- Äänitehosteet ja musiikki ovat aanet/-hakemistossa (CC0, Freesound; ks. aanet/LAHTEET.md).
- puhe.js kertoo animaatiolle sanojen ajoitukset tekstityksiä varten.
Kohtausten alkuajat luetaan ajat.js:stä, jota myös index.html käyttää.
"""
import asyncio
import hashlib
import json
import os
import re
import ssl
import subprocess
import sys
import wave
import numpy as np

HERE = os.path.dirname(os.path.abspath(__file__))
SR = 44100
A = {k: float(v) for k, v in re.findall(r'(\w+):\s*([\d.]+)', open(os.path.join(HERE, 'ajat.js')).read())}
DUR = A['end']
N = int(SR * DUR)

VOICE, RATE = 'en-GB-RyanNeural', '-5%'
LINES = [
    (0.4, "Deep in the meadow, two unlikely friends take their morning stroll."),
    (5.1, "The duck trusts him completely."),
    (7.6, "This... is a mistake."),
    (10.9, "Nature, as always, is brutal."),
    (14.2, "The hunter rides home, his prize secured."),
    (18.8, "A little butter. A pinch of salt."),
    (23.9, "Truly, a friendship to remember."),
]


# ---- Apufunktiot ----------------------------------------------------------
def decode(path):
    raw = subprocess.run(['ffmpeg', '-loglevel', 'error', '-i', path, '-f', 's16le', '-ac', '1', '-ar', str(SR), '-'],
                         capture_output=True, check=True).stdout
    return np.frombuffer(raw, dtype=np.int16).astype(float) / 32768


_cache = {}


def snd(name, start=0.0, dur=None):
    """Pätkä äänitiedostosta aanet/<name>.mp3, normalisoituna huippuun 1.0."""
    if name not in _cache:
        x = decode(os.path.join(HERE, 'aanet', name + '.mp3'))
        _cache[name] = x / (np.max(np.abs(x)) + 1e-9)
    x = _cache[name]
    a = int(start * SR)
    b = len(x) if dur is None else min(len(x), a + int(dur * SR))
    return x[a:b].copy()


def fades(x, fin=0.01, fout=0.05):
    n1, n2 = min(len(x), int(fin * SR)), min(len(x), int(fout * SR))
    if n1:
        x[:n1] *= np.linspace(0, 1, n1)
    if n2:
        x[-n2:] *= np.linspace(1, 0, n2)
    return x


def db(v):
    return 10 ** (v / 20)


def add(buf, t0, x, gain_db=0.0):
    i = int(t0 * SR)
    if i >= N or len(x) == 0:
        return
    if i < 0:
        x, i = x[-i:], 0
    j = min(N, i + len(x))
    buf[i:j] += x[:j - i] * db(gain_db)


def loop(name, length, start=0.0):
    x = snd(name, start)
    reps = int(np.ceil(length * SR / len(x))) + 1
    return np.tile(x, reps)[:int(length * SR)]


# ---- Kertoja --------------------------------------------------------------
async def tts(text, path_mp3, path_json):
    import edge_tts
    import edge_tts.communicate
    import edge_tts.voices
    ca = os.environ.get('SSL_CERT_FILE') or '/root/.ccr/ca-bundle.crt'
    if os.path.exists(ca):  # ympäristön välityspalvelin allekirjoittaa yhteydet omalla CA:llaan
        ctx = ssl.create_default_context(cafile=ca)
        edge_tts.communicate._SSL_CTX = ctx
        edge_tts.voices._SSL_CTX = ctx
    proxy = os.environ.get('HTTPS_PROXY') or os.environ.get('https_proxy')
    com = edge_tts.Communicate(text, VOICE, rate=RATE, boundary='WordBoundary', proxy=proxy)
    audio, words = bytearray(), []
    async for ch in com.stream():
        if ch['type'] == 'audio':
            audio += ch['data']
        elif ch['type'] == 'WordBoundary':
            words.append({'t': ch['offset'] / 1e7, 'd': ch['duration'] / 1e7, 'w': ch['text']})
    open(path_mp3, 'wb').write(audio)
    json.dump(words, open(path_json, 'w'))


def narration(text):
    key = hashlib.sha1(f'{VOICE}|{RATE}|{text}'.encode()).hexdigest()[:12]
    cache = os.path.join(HERE, 'puhe')
    mp3, js = os.path.join(cache, key + '.mp3'), os.path.join(cache, key + '.json')
    if not (os.path.exists(mp3) and os.path.exists(js) and os.path.getsize(mp3)):
        os.makedirs(cache, exist_ok=True)
        asyncio.run(tts(text, mp3, js))
    x = decode(mp3)
    words = json.load(open(js))
    nz = np.nonzero(np.abs(x) > .01)[0]
    lead = nz[0] / SR if len(nz) else 0.0
    x = x[nz[0]:nz[-1] + 1] if len(nz) else x
    return x / (np.max(np.abs(x)) + 1e-9), [{**w, 't': w['t'] - lead} for w in words]


voice = np.zeros(N)
spoken = []
try:
    for start, text in LINES:
        x, words = narration(text)
        add(voice, start, fades(x, .005, .03))
        dur = len(x) / SR
        shift = max(0.0, -words[0]['t']) if words else 0.0  # ensimmäinen sana ei ala ennen ääntä
        spoken.append({'start': start, 'dur': round(dur, 3), 'text': text,
                       'words': [{'t': round(start + w['t'] + shift, 3), 'w': w['w']} for w in words]})
        print(f'  {start:5.2f}–{start + dur:5.2f}  {text}')
except Exception as e:  # ei verkkoa tms.: video tehdään ilman kertojaa
    print('kertoja ohitettu:', e, file=sys.stderr)
    voice[:] = 0
    spoken = []

# ---- Musiikki: ukulele, katkeaa ennen iskua, palaa ajelussa ---------------
HIT = A['bonk'] + 2.8
music = np.zeros(N)
add(music, 0, fades(loop('ukulele', HIT - .2), .3, .25))
add(music, A['ride'], fades(loop('ukulele', DUR - A['ride']), .4, 1.2))
def ducking(depth_db):
    """Vahvistuskäyrä, joka laskee äänen kertojan puheen ajaksi."""
    g = np.ones(N)
    for s in spoken:
        a, b = int((s['start'] - .15) * SR), int((s['start'] + s['dur'] + .2) * SR)
        g[max(0, a):min(N, b)] = db(depth_db)
    k = int(.12 * SR)
    return np.convolve(g, np.ones(k) / k, mode='same')


music *= ducking(-9)

# ---- Äänitehosteet --------------------------------------------------------
sfx = np.zeros(N)
W, B, R, C = A['walk'], A['bonk'], A['ride'], A['cook']
# Niitty: linnut ja tuuli koko ulkojakson ajan
add(sfx, W, fades(loop('niitty', R - W + .5), .5, .8), -14)
# Askeleet ruohossa kävelyn aikana
for t0 in np.arange(W + .3, B - .3, 2.35):
    add(sfx, t0, fades(snd('askeleet', 0, min(2.35, B - t0)), .01, .1), -10)
add(sfx, W + 4.85, fades(snd('kvaak', .2, .7)), -8)
# Isku
add(sfx, B + 1.0, fades(snd('syva-suhahdus', .2, 1.4), .3, .5), -16)  # keppi nousee
add(sfx, HIT - .15, fades(snd('suhahdus', 0, .45)), -4)
add(sfx, HIT - .1, snd('isku2'), -2)
add(sfx, HIT, snd('isku'), 0)
add(sfx, HIT + .03, fades(snd('kvaak', .22, .18), .005, .06), -10)
add(sfx, HIT + .6, snd('kaatuminen'), -3)
# Ajelu: Vespa
add(sfx, R - .35, fades(snd('syva-suhahdus', .2, 1.0), .05, .3), -10)
add(sfx, R, fades(snd('vespa', .3, C - R + .2), .25, .35), -8)
# Keittiö: paistuminen, haukkaus, mässytys
add(sfx, C - .15, fades(snd('suhahdus', 0, .45)), -12)
add(sfx, C, fades(snd('sihina', 1.5, DUR - C), .3, .8), -9)
add(sfx, C + 4.9 - .35, snd('haukkaus'), -2)
add(sfx, C + 5.2, fades(snd('massytys', .4, DUR - C - 5.2), .05, .6), -8)

sfx *= ducking(-4)

# ---- Miksaus --------------------------------------------------------------
mix = voice * db(-2) + music * db(-12) + sfx
mix = np.tanh(mix * 1.1) / np.tanh(1.1)
mix *= .89 / (np.max(np.abs(mix)) + 1e-9)
pcm = (mix * 32767).astype(np.int16)

with wave.open(sys.argv[1] if len(sys.argv) > 1 else 'aani.wav', 'wb') as w:
    w.setnchannels(2)
    w.setsampwidth(2)
    w.setframerate(SR)
    w.writeframes(np.repeat(pcm[:, None], 2, axis=1).tobytes())

if len(sys.argv) > 2:
    with open(sys.argv[2], 'w') as f:
        f.write('window.PUHE = ' + json.dumps(spoken, ensure_ascii=False) + ';\n')
