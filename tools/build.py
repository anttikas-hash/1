# -*- coding: utf-8 -*-
"""Rakentaa mallisivuston asetuksista: HTML, CSS-paletti, fontit, kuvat.

Käyttö:  python3 tools/build.py            (rakentaa kaikki)
         python3 tools/build.py sahko      (yhden)
"""
import io, os, re, shutil, sys, json
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from palette import build as build_palette, verify
from sites import SITES

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
BASE = os.path.join(ROOT, 'talosaari')      # tyyli-, fontti- ja skriptipohja

NAV = [('index.html', 'Etusivu'), ('palvelut.html', 'Palvelut'),
       ('yritys.html', 'Yritys'), ('yhteystiedot.html', 'Yhteystiedot')]

def tbd(t):
    return '<span class="tbd">%s</span>' % t

def mark(pal, gid):
    return ('<svg class="brand-mark" viewBox="0 0 48 48" aria-hidden="true">'
      '<defs><linearGradient id="%s" x1="0" y1="0" x2="1" y2="1">'
      '<stop offset="0%%" stop-color="%s"/><stop offset="48%%" stop-color="%s"/>'
      '<stop offset="100%%" stop-color="%s"/></linearGradient></defs>'
      '<rect x="1.6" y="1.6" width="44.8" height="44.8" rx="9" fill="%s"/>'
      '<rect x="1.6" y="1.6" width="44.8" height="44.8" rx="9" fill="none" stroke="url(#%s)" stroke-width="2.6"/>'
      '<path d="M9 25.5 24 12.5l15 13" fill="none" stroke="url(#%s)" stroke-width="4.6" '
      'stroke-linecap="round" stroke-linejoin="round"/>'
      '<path d="M14.5 26v11.5h19V26" fill="none" stroke="url(#%s)" stroke-width="3.6" stroke-linejoin="round"/>'
      '<rect x="21" y="29.5" width="6" height="8" rx="1.2" fill="%s"/></svg>'
      % (gid, pal['accent-light'], pal['accent'], pal['accent-dark'],
         pal['dark-1'], gid, gid, gid, pal['light-1']))

ICON = {
 'phone': '<path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.2a2 2 0 0 1 2.1-.5c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2z"/>',
 'mail': '<rect x="2" y="4" width="20" height="16" rx="2"/><path d="m2 7 10 6 10-6"/>',
 'doc': '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/><path d="M8 13h8M8 17h5"/>',
 'pin': '<path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0z"/><circle cx="12" cy="10" r="3"/>',
 'check': '<path d="M9 11l3 3 8-8"/><path d="M20 12v7a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h9"/>',
 'star': '<path d="M12 2 2 8l10 6 10-6z"/><path d="M2 16l10 6 10-6"/>',
 'cal': '<rect x="3" y="4" width="18" height="17" rx="2"/><path d="M8 2v4M16 2v4M3 10h18"/>',
}
def ic(k, cls=''):
    c = ' class="%s"' % cls if cls else ''
    return ('<svg%s viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" '
            'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">%s</svg>' % (c, ICON[k]))

DEMO = ('<div class="demo-bar" role="note"><strong>Mallisivusto.</strong> Tämä on esimerkki '
        'siitä, miltä sivusto voi näyttää. Nimi, kuvat ja yhteystiedot vaihdetaan '
        'yrityksen omiin — mitään tietoa ei ole keksitty.</div>')

def head(cfg, title, desc, canonical):
    return ('<!DOCTYPE html>\n<html lang="fi" class="no-js">\n<head>\n'
      '<meta charset="UTF-8">\n'
      '<meta name="viewport" content="width=device-width, initial-scale=1.0">\n'
      '<title>%s</title>\n<meta name="description" content="%s">\n'
      '<meta name="robots" content="noindex">\n'
      '<link rel="canonical" href="%s">\n'
      '<link rel="icon" href="favicon.svg" type="image/svg+xml">\n'
      '<link rel="stylesheet" href="styles.css">\n'
      "<script>var r=document.documentElement;r.classList.remove('no-js');r.classList.add('js');</script>\n"
      '</head>\n<body>\n\n<a class="skip-link" href="#main">Siirry sisältöön</a>\n%s\n'
      % (title, desc, canonical, DEMO))

def header(cfg, pal, cur):
    items = '\n'.join('        <li><a href="%s"%s>%s</a></li>'
                      % (h, ' aria-current="page"' if h == cur else '', l) for h, l in NAV)
    brand = ('<span class="brand-text"><span class="brand-line-1">%s</span>'
             '<span class="brand-line-2">%s</span></span>' % (cfg['brand1'], cfg['brand2']))
    return ('''
<header class="site-header">
  <div class="header-inner">
    <a class="brand" href="index.html">%s%s</a>
    <nav class="main-nav" aria-label="Päävalikko">
      <ul>
%s
      </ul>
    </nav>
    <div class="header-actions">
      <a class="btn btn-primary" href="yhteystiedot.html">Pyydä tarjous</a>
      <button class="menu-toggle" type="button" aria-expanded="false" aria-controls="mobile-nav" id="menu-toggle">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
          <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>
        </svg>
        <span class="sr-only">Avaa valikko</span>
      </button>
    </div>
  </div>
  <nav class="mobile-nav" id="mobile-nav" aria-label="Mobiilivalikko">
    <ul>
%s
    </ul>
  </nav>
</header>
''' % (mark(pal, 'hm'), brand, items, items))

def footer(cfg, pal):
    brand = ('<span class="brand-text"><span class="brand-line-1">%s</span>'
             '<span class="brand-line-2">%s</span></span>' % (cfg['brand1'], cfg['brand2']))
    sitemap = '\n'.join('          <li><a href="%s">%s</a></li>' % (h, l) for h, l in NAV)
    svc = '\n'.join('          <li><a href="palvelut.html">%s</a></li>' % s[0] for s in cfg['services'])
    return ('''
<footer class="site-footer">
  <div class="container">
    <div class="footer-grid">
      <div class="footer-col">
        <span class="footer-brand">%s%s</span>
        <address>%s<br>%s</address>
      </div>
      <div class="footer-col">
        <h3>Yhteystiedot</h3>
        <ul class="footer-contact">
          <li>%s<span>%s</span></li>
          <li>%s<span>%s</span></li>
        </ul>
      </div>
      <div class="footer-col">
        <h3>Palvelut</h3>
        <ul>
%s
        </ul>
      </div>
      <div class="footer-col">
        <h3>Sivukartta</h3>
        <ul>
%s
        </ul>
      </div>
    </div>
    <div class="footer-bottom">
      Mallisivusto · %s · Sisältö vaihdetaan yrityksen omiin tietoihin
    </div>
  </div>
</footer>

<div class="mobile-cta">
  <a class="btn btn-primary" href="yhteystiedot.html">Pyydä tarjous</a>
</div>

<script src="site.js" defer></script>

</body>
</html>
''' % (mark(pal, 'fm'), brand, tbd('katuosoite'), tbd('postinumero ja kaupunki'),
       ic('phone'), tbd('puhelinnumero'), ic('mail'), tbd('sähköposti'),
       svc, sitemap, cfg['name']))

def crumb(label):
    return ('<nav class="breadcrumb" aria-label="Murupolku">\n        <ol>\n'
            '          <li><a href="index.html">Etusivu</a></li>\n'
            '          <li class="sep" aria-hidden="true">/</li>\n'
            '          <li aria-current="page">%s</li>\n        </ol>\n      </nav>' % label)

def cta(cfg):
    return ('''
  <section class="on-dark built-surface arcs">
    <div class="container cta-strip reveal">
      <span class="eyebrow">YHTEYDENOTTO</span>
      <h2>Kerro mitä tarvitset</h2>
      <p style="margin-top:16px;max-width:56ch;">Soita tai lähetä tarjouspyyntö. Käydään kohde läpi ja katsotaan, miten se kannattaa tehdä.</p>
      <div class="action-stack" style="margin-top:28px;">
        <a class="action action-primary" href="yhteystiedot.html">
          <span>Pyydä tarjous lomakkeella</span>%s
        </a>
        <span class="action"><span>Puhelin: %s</span>%s</span>
        <span class="action"><span>%s</span>%s</span>
      </div>
    </div>
  </section>
''' % (ic('doc'), tbd('puhelinnumero'), ic('phone'), tbd('sähköpostiosoite'), ic('mail')))


# ---------------------------------------------------------------- SIVUT

def page_index(cfg, pal):
    s = head(cfg, '%s | %s' % (cfg['title'], cfg['name']), cfg['desc'], 'index.html')
    s += header(cfg, pal, 'index.html')
    facts = '\n'.join('''          <div class="fact">
            %s
            <div class="fact-value">%s</div>
            <p class="fact-label">%s</p>
          </div>''' % (ic(k, 'fact-icon'), v, lbl)
        for (v, lbl), k in zip(cfg['facts'], ['check', 'star', 'cal']))

    cards = []
    for i, (name, scene, body, bullets) in enumerate(cfg['services']):
        cards.append('''          <a class="card reveal%s" href="palvelut.html">
            <div class="card-media"><img src="images/%s.jpg" width="1000" height="760" alt="Kuvitus: %s." loading="lazy" decoding="async"></div>
            <h3>%s</h3>
            <p>%s</p>
            <span class="card-link">Lue lisää →</span>
          </a>''' % (' reveal-delay-%d' % i if i else '', scene, name.lower(), name,
                     body.split('.')[0] + '.'))

    cust = '\n'.join('''            <li>
              <h3>%s</h3>
              <p>%s</p>
            </li>''' % (a, b) for a, b in cfg['customers'])

    prom = '\n'.join('''          <div class="card reveal%s">
            <h3>%s</h3>
            <p>%s</p>
          </div>''' % (' reveal-delay-%d' % i if i else '', a, b)
        for i, (a, b) in enumerate(cfg['promises']))

    s += '''
<main id="main">

  <section class="hero-split">
    <div class="container">
      <div class="hero-grid">

        <div class="reveal">
          <span class="chip">%s %s</span>
          <h1>%s</h1>
          <div class="accent-bar"></div>
          <p class="hero-support">%s</p>

          <div class="action-stack" style="margin-top:30px;">
            <a class="action action-primary" href="yhteystiedot.html">
              <span>Pyydä tarjous</span>%s
            </a>
            <a class="action" href="palvelut.html">
              <span>Katso mitä teemme</span>%s
            </a>
          </div>
        </div>

        <div class="hero-figure reveal reveal-delay-1">
          <div class="media media-4-3">
            <img src="images/%s.jpg" width="1600" height="1125" alt="Kuvitus alan työstä." fetchpriority="high" decoding="async">
          </div>
        </div>

      </div>
    </div>
  </section>

  <section class="canvas">
    <div class="container">

      <div class="block">
        <div class="facts reveal">
%s
        </div>
      </div>

      <div class="block">
        <div class="section-head reveal">
          <span class="section-index">01</span>
          <span class="eyebrow">PALVELUT</span>
          <h2>Mitä teemme</h2>
        </div>
        <div class="grid grid-4">
%s
        </div>
      </div>

      <div class="block">
        <div class="panel-dark reveal">
          <span class="section-index">02</span>
          <span class="eyebrow">ASIAKKAAT</span>
          <h2>Kenelle teemme</h2>
          <ul class="plain-list" style="margin-top:32px;">
%s
          </ul>
        </div>
      </div>

      <div class="block">
        <div class="section-head reveal">
          <span class="section-index">03</span>
          <span class="eyebrow">NÄIN SE ETENEE</span>
          <h2>Neljä vaihetta</h2>
        </div>
        <div class="steps">
          <div class="step reveal">
            <div class="step-number">01</div>
            <h3>Yhteydenotto</h3>
            <p>Kerrot mitä tarvitset. Vastaamme kysymyksiin ja arvioimme, onko kohde meille sopiva.</p>
          </div>
          <div class="step reveal reveal-delay-1">
            <div class="step-number">02</div>
            <h3>Katselmus ja tarjous</h3>
            <p>Käymme kohteessa ja katsotaan lähtötilanne. Saat kirjallisen tarjouksen, jossa työn laajuus on eritelty.</p>
          </div>
          <div class="step reveal reveal-delay-2">
            <div class="step-number">03</div>
            <h3>Sopimus ja aikataulu</h3>
            <p>Sovitaan työn sisältö, aikataulu ja maksuerät kirjallisesti ennen kuin työt alkavat.</p>
          </div>
          <div class="step reveal reveal-delay-3">
            <div class="step-number">04</div>
            <h3>Työ ja luovutus</h3>
            <p>Työ tehdään sovitussa laajuudessa. Lopuksi käydään kohde yhdessä läpi ja kirjataan huomiot.</p>
          </div>
        </div>
      </div>

      <div class="block">
        <div class="section-head reveal">
          <span class="section-index">04</span>
          <span class="eyebrow">MIKSI ME</span>
          <h2>Kolme asiaa, jotka lupaamme</h2>
        </div>
        <div class="grid grid-4" style="grid-template-columns:repeat(auto-fit,minmax(260px,1fr));">
%s
        </div>
      </div>

    </div>
  </section>

  <section class="image-band">
    <img src="images/%s.jpg" width="1920" height="672" alt="Kuvitus alan työstä." loading="lazy" decoding="async">
    <div class="band-text">
      <div class="container">
        <p>%s</p>
      </div>
    </div>
  </section>
%s
</main>
''' % (ic('check'), cfg['name'], cfg['h1'], cfg['lede'], ic('doc'), ic('doc'),
       cfg['hero'], facts, '\n'.join(cards), cust, prom,
       cfg['band'], cfg['band_text'], cta(cfg))
    return s + footer(cfg, pal)


def page_palvelut(cfg, pal):
    s = head(cfg, 'Palvelut — %s' % cfg['name'],
             'Palvelut: ' + ', '.join(x[0].lower() for x in cfg['services']) + '.',
             'palvelut.html')
    s += header(cfg, pal, 'palvelut.html')
    s += '''
<main id="main">
  <section class="on-dark page-header">
    <div class="container reveal">
      %s
      <span class="eyebrow">PALVELUT</span>
      <h1>Mitä teemme</h1>
      <p class="lede">Neljä palvelukokonaisuutta. Kaikki voidaan tehdä joko erillisenä työnä tai osana suurempaa kokonaisuutta.</p>
    </div>
  </section>

  <section class="canvas">
    <div class="container">
''' % crumb('Palvelut')
    for i, (name, scene, body, bullets) in enumerate(cfg['services'], 1):
        s += '''
      <div class="block">
        <div class="split-5-7 reveal">
          <div>
            <span class="section-index">%02d</span>
            <span class="eyebrow">PALVELU</span>
            <h2>%s</h2>
            <div class="media media-4-3" style="margin-top:22px;"><img src="images/%s.jpg" width="1000" height="760" alt="Kuvitus: %s." loading="lazy" decoding="async"></div>
          </div>
          <div>
            <p>%s</p>
            <ul class="spec-list">
%s
            </ul>
          </div>
        </div>
      </div>
''' % (i, name, scene, name.lower(), body,
       '\n'.join('              <li>%s</li>' % b for b in bullets))

    s += '''
      <div class="block">
        <div class="section-head reveal">
          <span class="eyebrow">USEIN KYSYTTYÄ</span>
          <h2>Kysymyksiä</h2>
        </div>
        <div class="faq reveal">
%s
        </div>
      </div>

    </div>
  </section>
%s
</main>
''' % ('\n'.join('''          <details>
            <summary>%s</summary>
            <p>%s</p>
          </details>''' % (q, a) for q, a in cfg['faq']), cta(cfg))
    return s + footer(cfg, pal)


def page_yritys(cfg, pal):
    s = head(cfg, 'Yritys — %s' % cfg['name'], 'Tietoa yrityksestä.', 'yritys.html')
    s += header(cfg, pal, 'yritys.html')
    s += '''
<main id="main">
  <section class="on-dark page-header">
    <div class="container reveal">
      %s
      <span class="eyebrow">YRITYS</span>
      <h1>Yritys</h1>
      <p class="lede">%s</p>
    </div>
  </section>

  <section class="canvas">
    <div class="container">

      <div class="block">
        <div class="split-5-7 reveal">
          <div>
            <span class="eyebrow">KEITÄ OLEMME</span>
            <h2>Lyhyesti</h2>
          </div>
          <div>
            <p>%s %s Yritys on perustettu vuonna %s ja toimialueena on %s.</p>
            <p>Toimintatapa on yksinkertainen: kohde katsotaan ennen tarjousta, tarjous annetaan kirjallisena, ja aikataulu kirjataan sopimukseen. Jos jokin muuttuu kesken työn, siitä kerrotaan silloin kun se tapahtuu.</p>
          </div>
        </div>
      </div>

      <div class="block">
        <div class="section-head reveal">
          <span class="eyebrow">TIEDOT</span>
          <h2>Yritystiedot</h2>
        </div>
        <div class="grid grid-4 reveal" style="grid-template-columns:repeat(auto-fit,minmax(260px,1fr));">
          <div class="card">
            <h3>Nimi ja tunnus</h3>
            <p>%s<br>Y-tunnus %s</p>
          </div>
          <div class="card">
            <h3>Toimialue</h3>
            <p>%s</p>
          </div>
          <div class="card">
            <h3>Rekisterit</h3>
            <p>%s</p>
          </div>
        </div>
      </div>

      <div class="block">
        <div class="panel-dark reveal">
          <span class="eyebrow">TOIMINTATAPA</span>
          <h2>Miten teemme työtä</h2>
          <ul class="plain-list" style="margin-top:32px;">
            <li>
              <h3>Kohde katsotaan ennen tarjousta</h3>
              <p>Emme anna hintaa puhelimessa näkemättä kohdetta. Se on ainoa tapa antaa hinta, joka pitää.</p>
            </li>
            <li>
              <h3>Tarjous on kirjallinen ja eritelty</h3>
              <p>Tarjouksesta näkee mitä hintaan kuuluu ja mitä ei. Epäselvä tarjous johtaa riitaan.</p>
            </li>
            <li>
              <h3>Muutokset kirjataan</h3>
              <p>Jos työn aikana löytyy jotain, mitä ei voinut etukäteen nähdä, siitä sovitaan erikseen ennen kuin sitä tehdään.</p>
            </li>
            <li>
              <h3>Työ luovutetaan yhdessä</h3>
              <p>Lopuksi käydään työ läpi yhdessä ja kirjataan huomiot. Puutteet korjataan ennen kuin työ katsotaan valmiiksi.</p>
            </li>
          </ul>
        </div>
      </div>

    </div>
  </section>
%s
</main>
''' % (crumb('Yritys'), cfg['lede'], tbd('Yrityksen nimi'), cfg['about'],
       tbd('vuosi'), tbd('toimialue'), tbd('yrityksen nimi'), tbd('y-tunnus'),
       tbd('kunnat, joissa työskentelette'),
       tbd('ennakkoperintärekisteri, alv-rekisteri ym. — vain ne, jotka pitävät paikkansa'),
       cta(cfg))
    return s + footer(cfg, pal)


ERRSVG = ('<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" '
  'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'
  '<path d="M12 9v4M12 17h.01"/><path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z"/>'
  '</svg><span class="field-error-text"></span>')

def page_yhteystiedot(cfg, pal):
    def fe(i):
        return '<p class="field-error" id="%s-error" role="alert">%s</p>' % (i, ERRSVG)
    s = head(cfg, 'Yhteystiedot — %s' % cfg['name'], 'Pyydä tarjous.', 'yhteystiedot.html')
    s += header(cfg, pal, 'yhteystiedot.html')
    s += '''
<main id="main">
  <section class="on-dark page-header">
    <div class="container reveal">
      %s
      <span class="eyebrow">YHTEYSTIEDOT</span>
      <h1>Pyydä tarjous</h1>
      <p class="lede">Kerro lyhyesti millainen kohde on ja mitä tarvitset. Vastaamme ja sovitaan katselmus.</p>
    </div>
  </section>

  <section class="canvas">
    <div class="container">
      <div class="block">
        <div class="split-5-7">
          <div class="reveal">
            <span class="eyebrow">SUORAT YHTEYSTIEDOT</span>
            <h2>Ota yhteyttä</h2>
            <ul class="contact-blocks" style="margin-top:28px;">
              <li>%s<div><strong>Puhelin</strong><br>%s</div></li>
              <li>%s<div><strong>Sähköposti</strong><br>%s</div></li>
              <li>%s<div><strong>Osoite</strong><br>%s</div></li>
            </ul>
          </div>

          <div class="reveal reveal-delay-1">
            <form method="post" style="margin-top:24px;" data-validate novalidate>
              <p class="form-legend">Tähdellä <span class="required-mark">*</span> merkityt kentät ovat pakollisia.</p>
              <div class="form-field">
                <label for="nimi">Nimi <span class="required-mark">*</span></label>
                <input type="text" id="nimi" name="nimi" autocomplete="name" aria-describedby="nimi-error" required>
                %s
              </div>
              <div class="form-field">
                <label for="puhelin">Puhelin <span class="required-mark">*</span></label>
                <input type="tel" id="puhelin" name="puhelin" autocomplete="tel" aria-describedby="puhelin-error" required>
                %s
              </div>
              <div class="form-field">
                <label for="sahkoposti">Sähköposti <span class="required-mark">*</span></label>
                <input type="email" id="sahkoposti" name="sahkoposti" autocomplete="email" aria-describedby="sahkoposti-error" required>
                %s
              </div>
              <div class="form-field">
                <label for="tyyppi">Mitä tarvitset?</label>
                <select id="tyyppi" name="tyyppi">
                  <option value="">Valitse…</option>
%s
                  <option>Muu</option>
                </select>
              </div>
              <div class="form-field">
                <label for="viesti">Kerro kohteesta <span class="required-mark">*</span></label>
                <textarea id="viesti" name="viesti" rows="6" aria-describedby="viesti-error" required></textarea>
                %s
              </div>
              <button class="btn btn-primary" type="submit">Lähetä tarjouspyyntö</button>
              <p class="form-note">Lomakkeen vastaanottava osoite %s. Lomake toimii myös ilman JavaScriptiä.</p>
            </form>
          </div>
        </div>
      </div>
    </div>
  </section>
</main>
''' % (crumb('Yhteystiedot'),
       ic('phone', 'contact-ic'), tbd('puhelinnumero'),
       ic('mail', 'contact-ic'), tbd('sähköpostiosoite'),
       ic('pin', 'contact-ic'), tbd('katuosoite, postinumero ja kaupunki'),
       fe('nimi'), fe('puhelin'), fe('sahkoposti'),
       '\n'.join('                  <option>%s</option>' % x[0] for x in cfg['services']),
       fe('viesti'), tbd('kytketään ennen julkaisua'))
    return s + footer(cfg, pal)


# ------------------------------------------------------------- KOKOAMINEN

TOKEN_ORDER = ['dark-1', 'dark-2', 'light-1', 'light-2', 'accent', 'accent-dark',
               'accent-light', 'accent-brass', 'accent-rust', 'accent-ember',
               'muted', 'muted-on-dark', 'line-light', 'white']

def write_css(cfg, pal, out):
    """Pohjatyyli talosaaresta, sävy käännettynä.

    Tokenien vaihto ei riitä: pohjatyylissä on myös kovakoodattuja värejä
    gradienteissa ja varjoissa. Siksi jokainen väri luetaan, ja jos sen
    sävykulma on lähellä pohjan vihreää, se käännetään uuteen sävyyn.
    Neutraalit harmaat ja keltainen huomioväri jäävät koskematta."""
    import colorsys
    css = io.open(os.path.join(BASE, 'styles.css'), encoding='utf-8').read()

    BASE_HUE = 155.0          # talosaaren vihreä
    KEEP = {'#FFF4CE', '#5A4300', '#E0C36B', '#3D2E00', '#B08900', '#9B2C2C', '#FFB4B4'}

    def rot(r, g, b):
        h, l, sa = colorsys.rgb_to_hls(r / 255.0, g / 255.0, b / 255.0)
        if sa < 0.06:                       # neutraali harmaa
            return None
        d = abs(((h * 360.0) - BASE_HUE + 180.0) % 360.0 - 180.0)
        if d > 45.0:                        # eri sävy (esim. varoituskeltainen)
            return None
        nh = ((cfg['hue'] + (h * 360.0 - BASE_HUE)) % 360.0) / 360.0
        nr, ng, nb = colorsys.hls_to_rgb(nh, l, sa)
        return round(nr * 255), round(ng * 255), round(nb * 255)

    def hex_sub(m):
        v = m.group(0).upper()
        if v in KEEP:
            return m.group(0)
        r, g, b = (int(v[i:i + 2], 16) for i in (1, 3, 5))
        out = rot(r, g, b)
        return m.group(0) if out is None else '#%02X%02X%02X' % out

    def rgb_sub(m):
        r, g, b = int(m.group(2)), int(m.group(3)), int(m.group(4))
        out = rot(r, g, b)
        if out is None:
            return m.group(0)
        return '%s(%d, %d, %d%s' % (m.group(1), out[0], out[1], out[2], m.group(5))

    css = re.sub(r'#[0-9A-Fa-f]{6}\b', hex_sub, css)
    css = re.sub(r'(rgba?)\(\s*(\d+),\s*(\d+),\s*(\d+)(\s*[,)])', rgb_sub, css)

    # tokenit tarkalleen generaattorin arvoihin (kierto on likiarvo)
    for t in TOKEN_ORDER:
        css = re.sub(r'(--%s:\s*)[^;]+;' % re.escape(t), r'\g<1>%s;' % pal[t], css, count=1)

    css = css.replace('Rakennus Talosaari Oy — jaettu tyylitiedosto',
                      '%s — mallisivuston tyylitiedosto' % cfg['name'])
    css += """

/* ---------- Mallisivuston tunniste ---------- */

.demo-bar {
  position: relative;
  z-index: 70;
  background: #FFF4CE;
  color: #5A4300;
  font-size: 14px;
  line-height: 1.5;
  padding: 10px 24px;
  text-align: center;
  border-bottom: 1px solid #E0C36B;
}
.demo-bar strong { color: #3D2E00; }
"""
    io.open(out, 'w', encoding='utf-8').write(css)

def write_favicon(pal, out):
    io.open(out, 'w', encoding='utf-8').write(
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">\n'
      '<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">\n'
      '<stop offset="0%%" stop-color="%s"/><stop offset="48%%" stop-color="%s"/>'
      '<stop offset="100%%" stop-color="%s"/>\n</linearGradient></defs>\n'
      '<rect x="1.6" y="1.6" width="44.8" height="44.8" rx="9" fill="%s"/>\n'
      '<rect x="1.6" y="1.6" width="44.8" height="44.8" rx="9" fill="none" stroke="url(#g)" stroke-width="2.6"/>\n'
      '<path d="M9 25.5 24 12.5l15 13" fill="none" stroke="url(#g)" stroke-width="4.6" stroke-linecap="round" stroke-linejoin="round"/>\n'
      '<path d="M14.5 26v11.5h19V26" fill="none" stroke="url(#g)" stroke-width="3.6" stroke-linejoin="round"/>\n'
      '<rect x="21" y="29.5" width="6" height="8" rx="1.2" fill="%s"/>\n</svg>\n'
      % (pal['accent-light'], pal['accent'], pal['accent-dark'], pal['dark-1'], pal['light-1']))

def scene_list(cfg):
    out = [(cfg['hero'], 1280, 900), (cfg['band'], 1600, 560)]
    for _, scene, _, _ in cfg['services']:
        out.append((scene, 1000, 760))
    return out

def build_site(key):
    cfg = SITES[key]
    pal = build_palette(cfg['hue'], cfg['sat'], cfg.get('dark_sat'))
    worst = verify(pal, cfg['name'])
    d = os.path.join(ROOT, cfg['slug'])
    os.makedirs(os.path.join(d, 'images'), exist_ok=True)

    if os.path.isdir(os.path.join(d, 'fonts')):
        shutil.rmtree(os.path.join(d, 'fonts'))
    shutil.copytree(os.path.join(BASE, 'fonts'), os.path.join(d, 'fonts'))
    shutil.copy(os.path.join(BASE, 'site.js'), os.path.join(d, 'site.js'))

    write_css(cfg, pal, os.path.join(d, 'styles.css'))
    write_favicon(pal, os.path.join(d, 'favicon.svg'))

    for fn, name in [(page_index, 'index.html'), (page_palvelut, 'palvelut.html'),
                     (page_yritys, 'yritys.html'), (page_yhteystiedot, 'yhteystiedot.html')]:
        io.open(os.path.join(d, name), 'w', encoding='utf-8').write(fn(cfg, pal))

    meta = dict(slug=cfg['slug'], name=cfg['name'], hue=cfg['hue'],
                palette=pal, scenes=scene_list(cfg),
                sky=dict(sky1=pal['dark-2'], sky2=pal['dark-1'], sky3=pal['dark-1'],
                         a=pal['accent'], ad=pal['accent-dark'], ab=pal['accent-brass'],
                         al=pal['accent-light'], d2=pal['dark-2'], gnd=pal['dark-1']))
    return meta, worst

if __name__ == '__main__':
    keys = sys.argv[1:] or list(SITES)
    metas = []
    for k in keys:
        m, w = build_site(k)
        metas.append(m)
        print('%-9s %-24s sävy %3d  heikoin kontrasti %.2f (%s)'
              % (k, m['name'], m['hue'], w[0], w[1]))
    io.open(os.path.join(ROOT, 'tools', 'meta.json'), 'w', encoding='utf-8').write(
        json.dumps(metas, ensure_ascii=False, indent=1))
    print('\nmeta.json kirjoitettu — kuvat generoidaan siitä')
