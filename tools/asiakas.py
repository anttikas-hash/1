# -*- coding: utf-8 -*-
"""Tekee asiakaskohtaisen mallisivuston olemassa olevasta toimialamallista.

Kaytto:  python3 tools/asiakas.py siivous "Siivouspalvelu Kota"
         python3 tools/asiakas.py --alat          (listaa toimialat)

Vaihtaa vain yrityksen nimen: logon, otsikot ja yritys-sivun nimikentat.
Kaikki muu — puhelin, osoite, hinnat, aukioloajat, patevyydet, y-tunnus —
jaa keltaiseksi paikanvaraajaksi, ja mallihuomautus jaa ylalaitaan. Sivu ei
siis esita olevansa asiakkaan oikea sivusto vaan malli, johon on laitettu
hanen nimensa. Mitaan ei keksita.

Tulos menee kansioon asiakkaat/<nimi>/ eika koske toimialamalleihin.
"""
import io, os, re, shutil, sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from sites import SITES
import build as B

ROOT = B.ROOT
OUT = 'asiakkaat'


def slugify(nimi):
    s = nimi.lower()
    for a, b in [('ä', 'a'), ('ö', 'o'), ('å', 'a'), ('é', 'e')]:
        s = s.replace(a, b)
    s = re.sub(r'[^a-z0-9]+', '-', s).strip('-')
    return s or 'asiakas'


def jaa_nimi(nimi):
    """Logossa on kaksi rivia. Jaetaan nimi niille luontevasti.

    Yhtiomuoto (Oy, Ky, Tmi) ei ole oma rivinsa — se jaa edellisen perään,
    koska 'Oy' yksin isolla rivilla nayttaa virheelta.
    """
    osat = nimi.split()
    if len(osat) == 1:
        return osat[0], ''
    hanta = osat[1:]
    if len(hanta) > 1 and hanta[-1].lower().strip('.') in ('oy', 'ky', 'tmi', 'ay', 'oyj'):
        hanta = hanta[:-1] + [hanta[-1]]
    return osat[0], ' '.join(hanta)


def tee(ala, nimi):
    if ala not in SITES:
        sys.exit('Tuntematon toimiala: %s\nVaihtoehdot: %s'
                 % (ala, ', '.join(SITES)))

    slug = slugify(nimi)
    cfg = dict(SITES[ala])
    cfg['slug'] = os.path.join(OUT, slug)
    cfg['name'] = nimi
    cfg['yritys_nimi'] = nimi
    cfg['brand1'], cfg['brand2'] = jaa_nimi(nimi)

    avain = '__asiakas__'
    SITES[avain] = cfg
    try:
        B.build_site(avain)
    finally:
        del SITES[avain]

    # Kuvitukset ovat valmiina toimialamallissa; kopioidaan ne sellaisenaan.
    laheto = os.path.join(ROOT, SITES[ala]['slug'], 'images')
    kohde = os.path.join(ROOT, OUT, slug, 'images')
    if not os.path.isdir(laheto):
        sys.exit('Toimialan kuvia ei loydy: %s\n'
                 'Aja ensin build.py ja render.js.' % laheto)
    for f in os.listdir(laheto):
        shutil.copy(os.path.join(laheto, f), os.path.join(kohde, f))

    return slug


if __name__ == '__main__':
    if len(sys.argv) == 2 and sys.argv[1] in ('--alat', '-a'):
        for k, c in SITES.items():
            print('%-13s %s' % (k, c['name']))
        sys.exit(0)
    if len(sys.argv) != 3:
        sys.exit(__doc__)

    ala, nimi = sys.argv[1], sys.argv[2]
    slug = tee(ala, nimi)

    print('\nValmis: %s/%s/' % (OUT, slug))
    print('Malli:  %s' % SITES[ala]['name'])
    print('\nLinkki kun olet pushannut mainiin:')
    print('https://anttikas-hash.github.io/1/%s/%s/' % (OUT, slug))
    print('\n  git add %s/%s && git commit -m "Asiakasmalli: %s" && git push'
          % (OUT, slug, nimi))
