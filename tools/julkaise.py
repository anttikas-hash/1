# -*- coding: utf-8 -*-
"""Tekee mallisivustosta julkaisukelpoisen version asiakkaan omaan osoitteeseen.

Kaytto:
    python3 tools/julkaise.py asiakkaat/kampaamo-vilo
    python3 tools/julkaise.py asiakkaat/kampaamo-vilo --lomake https://formspree.io/f/xxxxxxx

Mallisivustoissa on kolme suojausta, jotka estavat niita paatymasta
hakukoneisiin oikeiden yritysten nimilla: keltainen mallipalkki, sivujen
noindex-merkinta ja robots.txt joka kieltaa kaiken. Asiakkaan omalla
sivustolla ne olisivat virhe — han maksaa sivusta jota ei loyda mistaan.
Tama skripti poistaa ne.

Skripti EI julkaise mitaan itse. Se kirjoittaa kansion julkaisu/<nimi>/,
jonka sisallon viet asiakkaan omaan repoon.

Ennen kuin se kirjoittaa mitaan, se tarkistaa ettei sivuille jaanyt yhtaan
keltaista paikanvaraajaa. Jos jai, se kertoo mika ja missa, eika tee mitaan.
"""
import io, os, re, shutil, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = 'julkaisu'

ROBOTS = """User-agent: *
Allow: /
"""


def paikanvaraajat(polku):
    """Keltaiset tbd-kentat, jotka pitaa tayttaa ennen julkaisua."""
    loydot = []
    for tiedosto in sorted(os.listdir(polku)):
        if not tiedosto.endswith('.html'):
            continue
        teksti = io.open(os.path.join(polku, tiedosto), encoding='utf-8').read()
        for m in re.finditer(r'<span class="tbd">(.*?)</span>', teksti, re.S):
            loydot.append((tiedosto, re.sub(r'\s+', ' ', m.group(1)).strip()))
    return loydot


def siivoa(teksti, lomake=None):
    # 1. Mallipalkki pois.
    teksti = re.sub(r'<div class="demo-bar".*?</div>\n?', '', teksti, flags=re.S)
    # 2. noindex pois — tama on koko julkaisun tarkoitus.
    teksti = re.sub(r'\s*<meta name="robots" content="noindex[^"]*">', '', teksti)
    # 3. Lomake vastaanottajalle, jos osoite annettiin.
    if lomake:
        teksti = teksti.replace(
            '<form method="post"',
            '<form action="%s" method="post"' % lomake, 1)
        teksti = re.sub(
            r'<p class="form-note">.*?</p>\n?', '', teksti, flags=re.S)
    return teksti


def julkaise(lahde_suht, lomake=None, pakota=False):
    lahde = os.path.join(ROOT, lahde_suht)
    if not os.path.isdir(lahde):
        sys.exit('Kansiota ei ole: %s' % lahde)

    jaljella = paikanvaraajat(lahde)
    if jaljella and not pakota:
        print('Julkaisu keskeytetty: sivuilla on %d tayttamatonta kohtaa.\n'
              % len(jaljella))
        for tiedosto, teksti in jaljella:
            print('  %-20s %s' % (tiedosto, teksti))
        print('\nTayta nama sites.py:hyn ja aja build.py uudelleen.')
        print('Jos julkaiset silti, lisaa --pakota.')
        sys.exit(1)

    nimi = os.path.basename(lahde.rstrip('/'))
    kohde = os.path.join(ROOT, OUT, nimi)
    if os.path.isdir(kohde):
        shutil.rmtree(kohde)
    shutil.copytree(lahde, kohde)

    for tiedosto in os.listdir(kohde):
        if not tiedosto.endswith('.html'):
            continue
        polku = os.path.join(kohde, tiedosto)
        teksti = io.open(polku, encoding='utf-8').read()
        io.open(polku, 'w', encoding='utf-8').write(siivoa(teksti, lomake))

    io.open(os.path.join(kohde, 'robots.txt'), 'w', encoding='utf-8').write(ROBOTS)

    return kohde, jaljella


if __name__ == '__main__':
    # --lomake ottaa arvon, joten sita ei voi suodattaa pelkan --alun
    # perusteella: muuten osoite paatyisi polkujen joukkoon.
    args, lomake, pakota = [], None, False
    jono = sys.argv[1:]
    while jono:
        a = jono.pop(0)
        if a == '--lomake':
            if not jono:
                sys.exit('--lomake tarvitsee osoitteen.')
            lomake = jono.pop(0)
        elif a == '--pakota':
            pakota = True
        elif a.startswith('--'):
            sys.exit('Tuntematon valitsin: %s' % a)
        else:
            args.append(a)
    if len(args) != 1:
        sys.exit(__doc__)

    kohde, jaljella = julkaise(args[0], lomake, pakota)

    print('Valmis: %s/' % os.path.relpath(kohde, ROOT))
    print('  - mallipalkki poistettu')
    print('  - noindex poistettu, sivu nakyy hakukoneille')
    print('  - robots.txt sallii indeksoinnin')
    if lomake:
        print('  - lomake ohjattu: %s' % lomake)
    else:
        print('  - HUOM: lomakkeen vastaanottajaa ei annettu, lomake ei laheta '
              'viestia.\n    Aja uudelleen --lomake <osoite>.')
    if jaljella:
        print('  - VAROITUS: %d tayttamatonta kohtaa julkaistiin --pakota-'
              'valitsimella.' % len(jaljella))
    print('\nSeuraavaksi: kopioi kansion sisalto asiakkaan omaan repoon,')
    print('laita Pages paalle ja osoita verkkotunnus siihen.')
