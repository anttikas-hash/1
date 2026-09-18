# -*- coding: utf-8 -*-
"""Yhden sävyn paletin generaattori + WCAG-tarkistus.

Tuottaa saman 12 tokenin asteikon kuin talosaaro/rrpoy, mutta mistä
tahansa sävykulmasta. Jokainen paletti tarkistetaan ennen käyttöä:
jos yksikin pari alittaa rajan, generointi kaatuu.
"""
import colorsys

def hsl(h, s, l):
    r, g, b = colorsys.hls_to_rgb(h / 360.0, l, s)
    return '#%02X%02X%02X' % (round(r * 255), round(g * 255), round(b * 255))

def _lin(c):
    c /= 255.0
    return c / 12.92 if c <= 0.03928 else ((c + 0.055) / 1.055) ** 2.4

def lum(hexs):
    h = hexs.lstrip('#')
    r, g, b = (int(h[i:i + 2], 16) for i in (0, 2, 4))
    return 0.2126 * _lin(r) + 0.7152 * _lin(g) + 0.0722 * _lin(b)

def contrast(a, b):
    la, lb = lum(a), lum(b)
    hi, lo = max(la, lb), min(la, lb)
    return (hi + 0.05) / (lo + 0.05)

def _solve(hue, s_mul, start, against, need, lighter, margin=0.12):
    """Hakee kirkkauden, jolla väri yltää vaadittuun kontrastiin taustaa
    vasten. Sävykulma ja kylläisyys pysyvät — vain kirkkaus liikkuu, joten
    paletti pysyy yhden sävyn asteikkona. Ilman tätä jokainen uusi sävy
    pitäisi virittää käsin."""
    step = 0.004 if lighter else -0.004
    l = start
    for _ in range(250):
        c = hsl(hue, s_mul, max(0.0, min(1.0, l)))
        if contrast(c, against) >= need + margin:
            return c
        l += step
        if not (0.0 <= l <= 1.0):
            break
    raise SystemExit('Sävylle %s ei löydy kirkkautta, joka yltää %.1f:een' % (hue, need))


def build(hue, sat=0.50, dark_sat=None):
    """Sävykulma -> 14 tokenia yhden sävyn asteikkona.

    Pinnat ovat kiinteitä; niiden päälle tulevat värit ratkaistaan
    kontrastivaatimuksesta käsin, jotta mikä tahansa sävy kelpaa.

    dark_sat erottaa tummien pintojen kylläisyyden korostusväreistä.
    Lämpimillä sävyillä kylläinen tumma pinta muuttuu ruskeaksi mudaksi,
    joten pinta haalistetaan ja kylläisyys jätetään korostuksiin."""
    ds = sat if dark_sat is None else dark_sat
    dark1  = hsl(hue, ds * 0.82, 0.14)
    dark2  = hsl(hue, ds * 0.78, 0.19)
    light1 = hsl(hue, sat * 0.62, 0.968)
    light2 = hsl(hue, sat * 0.58, 0.930)
    return {
        'dark-1':  dark1,
        'dark-2':  dark2,
        'light-1': light1,
        'light-2': light2,
        # vaalealla pinnalla: tummennetaan kunnes riittää
        'accent':        _solve(hue, sat * 0.84, 0.34, light2, 4.5, lighter=False),
        'accent-dark':   _solve(hue, sat * 0.90, 0.24, light1, 7.0, lighter=False),
        'muted':         _solve(hue, sat * 0.82, 0.28, light2, 4.5, lighter=False),
        'accent-rust':   _solve(hue, sat * 0.82, 0.28, light2, 4.5, lighter=False),
        # tummalla pinnalla: vaalennetaan kunnes riittää
        'accent-light':  _solve(hue, sat * 0.76, 0.62, dark2, 4.5, lighter=True),
        'muted-on-dark': _solve(hue, sat * 0.66, 0.72, dark2, 4.5, lighter=True),
        'accent-brass':  _solve(hue, sat * 0.72, 0.42, dark1, 3.0, lighter=True),
        'accent-ember':  _solve(hue, sat * 0.78, 0.36, dark1, 3.0, lighter=True),
        'line-light':    hsl(hue, sat * 0.62, 0.855),
        'white':         '#FFFFFF',
    }

# (nimi, edusta, tausta, vähimmäisvaatimus)
CHECKS = [
    ('leipäteksti tummalla',      'light-1',       'dark-1',  4.5),
    ('leipäteksti dark-2:lla',    'light-1',       'dark-2',  4.5),
    ('haalea tummalla',           'muted-on-dark', 'dark-1',  4.5),
    ('haalea dark-2:lla',         'muted-on-dark', 'dark-2',  4.5),
    ('otsikko vaalealla',         'dark-1',        'light-1', 4.5),
    ('otsikko light-2:lla',       'dark-1',        'light-2', 4.5),
    ('haalea vaalealla',          'muted',         'light-1', 4.5),
    ('haalea light-2:lla',        'muted',         'light-2', 4.5),
    ('korostus vaalealla',        'accent',        'light-1', 4.5),
    ('korostus light-2:lla',      'accent',        'light-2', 4.5),
    ('tumma korostus vaalealla',  'accent-dark',   'light-1', 4.5),
    ('valkoinen korostuksella',   'white',         'accent',  4.5),
    ('valkoinen tummalla kor.',   'white',         'accent-dark', 4.5),
    ('vaalea korostus tummalla',  'accent-light',  'dark-1',  4.5),
    ('vaalea korostus dark-2',    'accent-light',  'dark-2',  4.5),
    ('messinki tummalla',         'accent-brass',  'dark-1',  3.0),
    ('hiillos tummalla',          'accent-ember',  'dark-1',  3.0),
]

def verify(pal, label=''):
    fails = []
    worst = (99, '')
    for name, fg, bg, need in CHECKS:
        v = contrast(pal[fg], pal[bg])
        if v < need:
            fails.append('%s: %.2f < %.1f' % (name, v, need))
        if v < worst[0]:
            worst = (v, name)
    if fails:
        raise SystemExit('PALETTI HYLÄTTY %s:\n  ' % label + '\n  '.join(fails))
    return worst

if __name__ == '__main__':
    for label, hue, sat in [('vihreä (talosaari)', 155, 0.42),
                            ('meripihka (sähkö)', 32, 0.55),
                            ('terrakotta (maalaus)', 12, 0.48),
                            ('oliivi (piha)', 78, 0.46),
                            ('sininen (rrpoy)', 212, 0.48),
                            ('violetti', 285, 0.40),
                            ('syaani', 190, 0.50)]:
        p = build(hue, sat)
        w = verify(p, label)
        print('%-22s heikoin %.2f (%s)' % (label, w[0], w[1]))
