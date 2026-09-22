const { chromium } = require('playwright');
const fs = require('fs'), path = require('path');
const ROOT = path.dirname(__dirname);
const metas = JSON.parse(fs.readFileSync(path.join(ROOT, 'tools/meta.json'), 'utf8'));

(async () => {
  const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
  const p = await (await b.newContext({ viewport: { width: 1700, height: 1000 }, deviceScaleFactor: 2 })).newPage();
  await p.goto('file://' + path.join(ROOT, 'tools/scenes.html'));
  await p.waitForTimeout(400);
  for (const m of metas) {
    await p.evaluate(([pal, list]) => window.__render(pal, list), [m.sky, m.scenes]);
    await p.waitForTimeout(350);
    for (const [id] of m.scenes) {
      await p.locator('#' + id).screenshot({ path: path.join(ROOT, m.slug, 'images', id + '.png') });
    }
    console.log(m.slug, '→', m.scenes.length, 'kuvaa');
  }
  await b.close();
})();
