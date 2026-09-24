// Kaappaa animaation ruudut ja kokoaa niistä videon.
// Käyttö: node render.js <hakemisto> [fps]
//         node render.js <hakemisto> --peek 2.5 9.8 ...   (vain yksittäiset ruudut frames/-hakemistoon)
// Hakemistossa on oltava index.html, jossa on window.render(t) ja window.DURATION.
// Sivu avataan paikallisen HTTP-palvelimen kautta (repon juuresta), jotta ES-moduulit latautuvat.
const { chromium } = require('playwright');
const { execFileSync } = require('child_process');
const fs = require('fs'), path = require('path'), http = require('http');

const args = process.argv.slice(2);
const dir = path.resolve(args[0] || 'kissa-ja-ankka');
const peekAt = args[1] === '--peek' ? args.slice(2).map(Number) : null;
const fps = peekAt ? 24 : Number(args[1] || 24);
const frames = path.join(dir, 'frames');
const out = path.join(dir, path.basename(dir) + '.mp4');
const ROOT = path.resolve(__dirname, '..');
const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.woff2': 'font/woff2', '.json': 'application/json' };

function serve() {
  return new Promise(res => {
    const srv = http.createServer((q, s) => {
      const f = path.join(ROOT, decodeURIComponent(q.url.split('?')[0]));
      if (!f.startsWith(ROOT)) { s.writeHead(403); return s.end(); }
      fs.readFile(f, (e, d) => {
        if (e) { s.writeHead(404); return s.end(); }
        s.writeHead(200, { 'Content-Type': TYPES[path.extname(f)] || 'application/octet-stream' });
        s.end(d);
      });
    }).listen(0, '127.0.0.1', () => res(srv));
  });
}

(async () => {
  if (!peekAt) fs.rmSync(frames, { recursive: true, force: true });
  fs.mkdirSync(frames, { recursive: true });
  // Jos hakemistossa on aani.py, se tekee ääniraidan ja puhe.js:n (tekstitysten ajoitus)
  // ennen kaappausta. Äänetön versio jää talteen nimellä *-mykka.mp4 CapCutia varten.
  const sound = path.join(dir, 'aani.py'), wav = path.join(frames, 'aani.wav');
  const hasSound = fs.existsSync(sound) && !peekAt;
  if (hasSound) execFileSync('python3', [sound, wav, path.join(dir, 'puhe.js')], { stdio: 'inherit' });

  const srv = await serve();
  const browser = await chromium.launch({
    executablePath: '/opt/pw-browsers/chromium',
    // ohjelmallinen WebGL (SwiftShader), koska konttissa ei ole näytönohjainta
    args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'],
  });
  const page = await browser.newPage({ viewport: { width: 1080, height: 1920 } });
  page.on('pageerror', e => console.error('sivuvirhe:', e.message));
  const url = `http://127.0.0.1:${srv.address().port}/${path.relative(ROOT, dir)}/index.html`;
  await page.goto(url);
  await page.waitForFunction(() => window.READY !== false, null, { timeout: 180000 });
  await page.evaluate(() => document.fonts.ready);

  const shot = async (t, file) => {
    await page.evaluate(t => window.render(t), t);
    await page.screenshot({ path: file });
  };
  if (peekAt) {
    for (const t of peekAt) await shot(t, path.join(frames, `peek_${t}.png`));
  } else {
    const n = Math.round(await page.evaluate(() => window.DURATION) * fps);
    const t0 = Date.now();
    for (let i = 0; i < n; i++) {
      await shot(i / fps, path.join(frames, String(i + 1).padStart(4, '0') + '.png'));
      if (i % fps === 0) console.log(`${i}/${n}  (${((Date.now() - t0) / 1000 / (i + 1)).toFixed(1)} s/ruutu)`);
    }
    console.log(`${n} ruutua`);
  }
  await browser.close();
  srv.close();
  if (peekAt) return;

  execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-framerate', String(fps),
    '-i', path.join(frames, '%04d.png'), '-c:v', 'libx264', '-pix_fmt', 'yuv420p',
    '-crf', '20', '-movflags', '+faststart', out], { stdio: 'inherit' });
  if (hasSound) {
    const mute = out.replace(/\.mp4$/, '-mykka.mp4');
    fs.renameSync(out, mute);
    execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-i', mute, '-i', wav,
      '-c:v', 'copy', '-c:a', 'aac', '-b:a', '192k', '-shortest', '-movflags', '+faststart', out], { stdio: 'inherit' });
  }
  console.log('valmis:', out);
})();
