// Kaappaa animaation ruudut ja kokoaa niistä videon.
// Käyttö: node render.js <hakemisto> [fps]
// Hakemistossa on oltava index.html, jossa on window.render(t) ja window.DURATION.
const { chromium } = require('playwright');
const { execFileSync } = require('child_process');
const fs = require('fs'), path = require('path');

const dir = path.resolve(process.argv[2] || 'kissa-ja-ankka');
const fps = Number(process.argv[3] || 24);
const frames = path.join(dir, 'frames');
const out = path.join(dir, path.basename(dir) + '.mp4');

(async () => {
  fs.rmSync(frames, { recursive: true, force: true });
  fs.mkdirSync(frames);
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
  const page = await browser.newPage({ viewport: { width: 1080, height: 1920 } });
  await page.goto('file://' + path.join(dir, 'index.html'));
  const duration = await page.evaluate(() => window.DURATION);
  const n = Math.round(duration * fps);
  for (let i = 0; i < n; i++) {
    await page.evaluate(t => window.render(t), i / fps);
    await page.screenshot({ path: path.join(frames, String(i + 1).padStart(4, '0') + '.png') });
    if (i % fps === 0) process.stdout.write(`\r${i}/${n}`);
  }
  await browser.close();
  console.log(`\r${n} ruutua`);
  execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-framerate', String(fps),
    '-i', path.join(frames, '%04d.png'), '-c:v', 'libx264', '-pix_fmt', 'yuv420p',
    '-crf', '20', '-movflags', '+faststart', out], { stdio: 'inherit' });
  // Jos hakemistossa on aani.py, se tekee ääniraidan ja video saa äänen.
  // Äänetön versio jää talteen nimellä *-mykka.mp4 CapCut-editointia varten.
  const sound = path.join(dir, 'aani.py');
  if (fs.existsSync(sound)) {
    const wav = path.join(frames, 'aani.wav'), mute = out.replace(/\.mp4$/, '-mykka.mp4');
    execFileSync('python3', [sound, wav], { stdio: 'inherit' });
    fs.renameSync(out, mute);
    execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-i', mute, '-i', wav,
      '-c:v', 'copy', '-c:a', 'aac', '-b:a', '192k', '-shortest', '-movflags', '+faststart', out], { stdio: 'inherit' });
  }
  console.log('valmis:', out);
})();
