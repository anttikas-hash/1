// Koko sivuston tarkistus: jokainen HTML-sivu, ei vain mallisivustot.
const { chromium } = require('playwright');
const fs = require('fs'), path = require('path');
const { PNG } = require('pngjs');
const ROOT = '/home/user/1';
const SKIP = ['tools/scenes.html', 'talosaaro/index.html'];

function walk(d, acc) {
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    if (e.name === 'node_modules' || e.name === '.git' || e.name === 'fonts' || e.name === 'images') continue;
    const p = path.join(d, e.name);
    if (e.isDirectory()) walk(p, acc);
    else if (e.name.endsWith('.html')) acc.push(path.relative(ROOT, p));
  }
  return acc;
}
const PAGES = walk(ROOT, []).filter(p => !SKIP.includes(p)).sort();

function lin(c){c/=255;return c<=0.03928?c/12.92:Math.pow((c+0.055)/1.055,2.4);}
function L(r,g,b){return 0.2126*lin(r)+0.7152*lin(g)+0.0722*lin(b);}
function parse(s){const m=String(s).match(/rgba?\(([\d.]+),\s*([\d.]+),\s*([\d.]+)(?:,\s*([\d.]+))?\)/);
 return m?[+m[1],+m[2],+m[3],m[4]===undefined?1:+m[4]]:null;}

(async () => {
  const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
  const issues = [];
  const note = (s) => issues.push(s);
  const manual = [];

  // 1. Rakenne suoraan tiedostosta
  for (const p of PAGES) {
    const s = fs.readFileSync(path.join(ROOT, p), 'utf8');
    if (!/^\s*<!DOCTYPE html>/i.test(s)) note(`${p}: puuttuu <!DOCTYPE html>`);
    if (!/<html[^>]+lang="fi"/i.test(s)) note(`${p}: puuttuu lang="fi"`);
    if (!/<meta charset="UTF-8"/i.test(s)) note(`${p}: puuttuu charset`);
    if (!/name="viewport"/i.test(s)) note(`${p}: puuttuu viewport`);
    if (!/<title>[^<]{3,}<\/title>/i.test(s)) note(`${p}: puuttuu title`);
    if (!/name="description"/i.test(s) && !/soittolista|sopimus|toimitus/.test(p)) note(`${p}: puuttuu description`);
    // vain ladattavat resurssit ovat ongelma; tavallinen ulkoinen linkki ei lataa mitaan
    const abs = s.match(/(?:src="|<link[^>]+href=")(https?:)?\/\/[^"]+"/g) || [];
    abs.forEach(a => note(`${p}: ulkoinen resurssi ${a}`));
  }

  for (const p of PAGES) {
    const ctx = await b.newContext({ viewport: { width: 1440, height: 900 } });
    const page = await ctx.newPage();
    const errs = [], ext = [];
    page.on('pageerror', e => errs.push(e.message));
    page.on('console', m => { if (m.type() === 'error') errs.push(m.text()); });
    page.on('request', r => { if (!r.url().startsWith('file://') && !r.url().startsWith('data:')) ext.push(r.url()); });

    for (const w of [320, 390, 768, 1024, 1440, 1920]) {
      await page.setViewportSize({ width: w, height: 900 });
      await page.goto('file://' + path.join(ROOT, p));
      await page.evaluate(() => {
        const st = document.createElement('style');
        st.textContent = '*,*::before,*::after{transition:none!important;animation:none!important}.reveal{opacity:1!important;transform:none!important}';
        document.head.appendChild(st);
        document.querySelectorAll('.reveal').forEach(e => e.classList.add('is-visible'));
        document.querySelectorAll('details').forEach(d => d.open = true);
        document.querySelectorAll('img[loading="lazy"]').forEach(i => i.loading = 'eager');
        window.scrollTo(0, document.body.scrollHeight);
      });
      await page.waitForTimeout(300);
      await page.evaluate(() => window.scrollTo(0, 0));
      const ov = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
      if (ov > 0) note(`${p} @${w}px: vaakaylivuoto ${ov}px`);
    }

    // 1440px: kuvat, otsikot, linkit, kontrasti
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('file://' + path.join(ROOT, p));
    await page.evaluate(() => {
      const st = document.createElement('style');
      st.textContent = '*,*::before,*::after{transition:none!important;animation:none!important}.reveal{opacity:1!important;transform:none!important}';
      document.head.appendChild(st);
      document.querySelectorAll('.reveal').forEach(e => e.classList.add('is-visible'));
      document.querySelectorAll('details').forEach(d => d.open = true);
      document.querySelectorAll('img[loading="lazy"]').forEach(i => i.loading = 'eager');
    });
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(400);

    const bad = await page.evaluate(() => [...document.images].filter(i => !i.complete || i.naturalWidth === 0).map(i => i.getAttribute('src')));
    bad.forEach(s => note(`${p}: kuva ei latautunut ${s}`));
    const noAlt = await page.evaluate(() => [...document.images].filter(i => !i.hasAttribute('alt')).length);
    if (noAlt) note(`${p}: ${noAlt} kuvaa ilman alt-tekstiä`);
    const h1 = await page.evaluate(() => document.querySelectorAll('h1').length);
    if (h1 !== 1) note(`${p}: h1-otsikoita ${h1}`);

    // sisäiset linkit osoittavat olemassa olevaan tiedostoon
    const hrefs = await page.evaluate(() => [...document.querySelectorAll('a[href]')].map(a => a.getAttribute('href')));
    for (const h of new Set(hrefs)) {
      if (!h || /^(https?:|mailto:|tel:|#|data:)/.test(h)) continue;
      let t = h.split('#')[0]; if (!t) continue;
      let f = path.resolve(path.dirname(path.join(ROOT, p)), t);
      if (t.endsWith('/')) f = path.join(f, 'index.html');
      if (!fs.existsSync(f)) note(`${p}: rikkinäinen linkki ${h}`);
    }

    const suspects = [];
    const res = await page.evaluate(() => { const out = []; let seq = 0;
      document.querySelectorAll('*').forEach(el => {
        const t = [...el.childNodes].filter(x => x.nodeType === 3 && x.textContent.trim()).map(x => x.textContent.trim()).join(' ');
        if (!t) return; const cs = getComputedStyle(el);
        if (cs.visibility === 'hidden' || cs.display === 'none' || +cs.opacity === 0) return;
        const pr = (str) => { const m = String(str).match(/rgba?\(([\d.]+),\s*([\d.]+),\s*([\d.]+)(?:,\s*([\d.]+))?\)/);
          return m ? [+m[1], +m[2], +m[3], m[4] === undefined ? 1 : +m[4]] : null; };
        let bg = null, e = el, op = 1, q = el, grad = false;
        while (q) { op *= +getComputedStyle(q).opacity; q = q.parentElement; }
        while (e) { const st2 = getComputedStyle(e);
          const c = st2.backgroundColor, a = pr(c);
          const opaque = c && !c.startsWith('rgba(0, 0, 0, 0)') && a && a[3] > 0.85;
          // Ensimmainen maalattu tausta ratkaisee. Jos se on liukuvari,
          // yhta taustavaria ei ole, eika laskenta pade -> kasin tarkistettava.
          if (st2.backgroundImage && st2.backgroundImage !== 'none') {
            // Liukuvarilla ei ole yhta taustavaria: otetaan kaikki varipysakit,
            // niin kontrasti voidaan laskea huonoimman kohdan mukaan.
            const all = st2.backgroundImage.match(/rgba?\([^)]*\)/g) || [];
            // Lapinakyvat pysakit vain savyttavat alla olevaa: ne eivat maaraa taustaa.
            const stops = all.filter(s => { const a = pr(s); return a && a[3] > 0.85; });
            if (stops.length) { grad = stops; break; }
            if (!all.length) { grad = true; break; }   // kuvatausta: kasin
            // pelkkia lapinakyvia pysakkeja -> jatketaan ylospain
          }
          if (opaque) { bg = c; break; }
          e = e.parentElement; }
        const id = 'vk' + (seq++); el.setAttribute('data-vk', id);
        out.push({ id: id, t: t.slice(0, 34), fg: cs.color, bg: bg || 'rgb(255,255,255)', fs: parseFloat(cs.fontSize), fw: cs.fontWeight, op: op, grad: grad });
      }); return out; });
    for (const r of res) { const f = parse(r.fg); if (!f) continue;
      // Liukuvarin paalla jokainen varipysakki on tarkistettava erikseen.
      const bgs = Array.isArray(r.grad) ? r.grad : [r.bg];
      if (r.grad === true) { manual.push(`${p}: kuvatausta "${r.t}" — tarkistettava kasin`); continue; }
      const need = (r.fs >= 24 || (r.fs >= 18.66 && +r.fw >= 700)) ? 3 : 4.5;
      let worst = Infinity;
      for (const bs of bgs) { const g = parse(bs); if (!g) continue;
        const a = f[3] * r.op;                     // myos peritty opacity mukaan
        const mix = [0, 1, 2].map(i => f[i] * a + g[i] * (1 - a));
        const cr = (Math.max(L(...mix), L(g[0], g[1], g[2])) + 0.05) / (Math.min(L(...mix), L(g[0], g[1], g[2])) + 0.05);
        if (cr < worst) worst = cr; }
      if (worst !== Infinity && worst < need - 0.02) suspects.push({ id: r.id, t: r.t, fg: r.fg, op: r.op, need: need, calc: worst });
    }
    // Liukuvarin paalla laskenta kayttaa aarilaitaa. Mitataan todellinen
    // taustavari ruudulta: piilotetaan teksti ja luetaan pikselit sen alta.
    for (const s of suspects) {
      const box = await page.evaluate((id) => {
        const el = document.querySelector(`[data-vk="${id}"]`);
        if (!el) return null;
        const r = el.getBoundingClientRect();
        if (r.width < 2 || r.height < 2) return null;
        el.style.visibility = 'hidden';
        // Koko sivun kuvasta leikataan: koordinaatit dokumentin mukaan.
        return { x: Math.round(r.x + window.scrollX), y: Math.round(r.y + window.scrollY),
                 width: Math.round(r.width), height: Math.round(r.height) };
      }, s.id);
      if (!box) { note(`${p}: kontrasti ${s.calc.toFixed(2)}<${s.need} "${s.t}"`); continue; }
      let buf;
      try { buf = await page.screenshot({ clip: box, fullPage: true }); }
      catch (e) { note(`${p}: kontrasti ${s.calc.toFixed(2)}<${s.need} "${s.t}"`); continue; }
      await page.evaluate((id) => { const el = document.querySelector(`[data-vk="${id}"]`); if (el) el.style.visibility = ''; }, s.id);
      const png = PNG.sync.read(buf);
      let worst = Infinity;
      const f = parse(s.fg), a = f[3] * s.op;
      for (let i = 0; i < png.data.length; i += 4) {
        const g = [png.data[i], png.data[i + 1], png.data[i + 2]];
        const mix = [0, 1, 2].map(k => f[k] * a + g[k] * (1 - a));
        const cr = (Math.max(L(...mix), L(g[0], g[1], g[2])) + 0.05) / (Math.min(L(...mix), L(g[0], g[1], g[2])) + 0.05);
        if (cr < worst) worst = cr;
      }
      if (worst < s.need - 0.02) note(`${p}: kontrasti ${worst.toFixed(2)}<${s.need} "${s.t}" (mitattu ruudulta)`);
    }
    if (ext.length) note(`${p}: ULKOINEN PYYNTÖ ${[...new Set(ext)].slice(0,3).join(' ')}`);
    if (errs.length) note(`${p}: JS-virhe ${errs.slice(0, 2).join(' | ')}`);
    await ctx.close();

    // kosketuskohteet 390px
    const mc = await b.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
    const mp = await mc.newPage();
    await mp.goto('file://' + path.join(ROOT, p));
    await mp.evaluate(() => { document.querySelectorAll('details').forEach(d => d.open = true);
      document.querySelectorAll('.reveal').forEach(e => e.classList.add('is-visible')); });
    await mp.evaluate(() => document.fonts.ready); await mp.waitForTimeout(300);
    const small = await mp.evaluate(() => [...document.querySelectorAll('a,button,input,select,textarea,summary')]
      .filter(el => { const r = el.getBoundingClientRect();
        if (!(r.width || r.height)) return false;
        if (el.tagName === 'A' && ['P', 'LI', 'SUMMARY'].includes(el.parentElement.tagName)
          && el.parentElement.textContent.trim().length > el.textContent.trim().length + 12) return false;
        return r.height < 44 || r.width < 44; })
      .map(el => `${el.tagName} "${(el.textContent || '').trim().slice(0, 20)}"`));
    small.forEach(s => note(`${p} @390px: kosketuskohde alle 44px ${s}`));
    await mc.close();
    process.stdout.write('.');
  }

  console.log(`\n\nsivuja tarkistettu: ${PAGES.length}`);
  if (manual.length) console.log(`laskennan ulkopuolella (liukuvarit, tarkistettu kasin): ${manual.length}`);
  console.log(issues.length ? issues.join('\n') : 'EI LÖYDÖKSIÄ');
  await b.close();
  process.exit(issues.length ? 1 : 0);
})();
