# -*- coding: utf-8 -*-
"""Kuvitukset PNG -> progressiivinen JPEG.

render.js kirjoittaa PNG:t. Sivut kayttavat JPG:ta, koska se on
pienempi eika kuvituksissa ole labinakyvyytta. PNG:t poistetaan,
jottei repoon jaa kahta kopiota samasta kuvasta.
"""
import io, os, sys
from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SIZES = {'hero': (1600, 1125), 'band': (1920, 672)}

def pack(d):
    n = 0
    for f in sorted(os.listdir(d)):
        if not f.endswith('.png'):
            continue
        src = os.path.join(d, f)
        im = Image.open(src).convert('RGB')
        base = f[:-4]
        if base.endswith('-hero'):
            box = SIZES['hero']
        elif base.endswith('-band'):
            box = SIZES['band']
        else:
            box = (1000, 760)
        im = im.resize(box, Image.LANCZOS)
        im.save(os.path.join(d, base + '.jpg'), 'JPEG',
                quality=82, optimize=True, progressive=True)
        os.remove(src)
        n += 1
    return n

total = 0
for slug in sorted(os.listdir(ROOT)):
    d = os.path.join(ROOT, slug, 'images')
    if os.path.isdir(d):
        c = pack(d)
        if c:
            print('%-14s %d kuvaa' % (slug, c))
            total += c
print('yhteensa', total)
