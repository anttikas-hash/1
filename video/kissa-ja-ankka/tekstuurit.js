// Kaikki tekstuurit piirretään koodilla canvasille, ei kuvatiedostoja.
// Sama siemen tuottaa aina saman kuvan, joten renderöinti on toistettava.
import * as THREE from 'three';

export function rng(seed) {
  return () => { seed |= 0; seed = seed + 0x6D2B79F5 | 0; let t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };
}

function canvas(w, h = w) {
  const c = document.createElement('canvas');
  c.width = w; c.height = h;
  return [c, c.getContext('2d')];
}

function tex(c, { srgb = true, repeat = null } = {}) {
  const t = new THREE.CanvasTexture(c);
  if (srgb) t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 8;
  if (repeat) { t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(repeat[0], repeat[1]); }
  return t;
}

// Karvat: tuhansia lyhyitä vetoja, suunta pystyyn (v-akseli)
function strands(g, w, h, r, n, colors, len, alpha, wide = 1.4) {
  g.lineCap = 'round';
  for (let i = 0; i < n; i++) {
    const x = r() * w, y = r() * h, l = len * (.5 + r());
    g.strokeStyle = colors[Math.floor(r() * colors.length)];
    g.globalAlpha = alpha * (.4 + r() * .6);
    g.lineWidth = wide * (.6 + r() * .8);
    g.beginPath(); g.moveTo(x, y); g.quadraticCurveTo(x + (r() - .5) * 4, y + l * .5, x + (r() - .5) * 6, y + l); g.stroke();
  }
  g.globalAlpha = 1;
}

// Turkki. SphereGeometryn UV:ssa etupuoli (+z) on kohdassa u = 0.25.
// cream = [[u, v, rx, ry], ...] vaaleat alueet (vatsa, kuono), stripes = raidat
export function furTexture({ seed = 1, base = '#E8893A', dark = '#A9501A', light = '#FFC98A', cream = [], stripes = true, size = 1024 } = {}) {
  const r = rng(seed);
  const [c, g] = canvas(size);
  g.fillStyle = base; g.fillRect(0, 0, size, size);
  // värivaihtelu
  for (let i = 0; i < 60; i++) {
    const x = r() * size, y = r() * size, rad = 60 + r() * 160;
    const gr = g.createRadialGradient(x, y, 0, x, y, rad);
    gr.addColorStop(0, r() < .5 ? light + '55' : dark + '33'); gr.addColorStop(1, base + '00');
    g.fillStyle = gr; g.fillRect(x - rad, y - rad, rad * 2, rad * 2);
  }
  if (stripes) { // tabby-raidat kiertävät vartaloa
    g.filter = 'blur(10px)';
    for (let i = 0; i < 9; i++) {
      const y0 = size * (.12 + i * .095);
      g.strokeStyle = dark; g.globalAlpha = .55; g.lineWidth = 22 + r() * 18;
      g.beginPath();
      for (let x = 0; x <= size; x += 16) {
        const y = y0 + Math.sin(x / size * Math.PI * 6 + i) * 14 + Math.sin(x / size * Math.PI * 2 * 7) * 6;
        x ? g.lineTo(x, y) : g.moveTo(x, y);
      }
      g.stroke();
    }
    g.filter = 'none'; g.globalAlpha = 1;
  }
  for (const [u, v, rx, ry] of cream) {
    g.save(); g.filter = 'blur(26px)'; g.fillStyle = '#FFF3E4';
    g.beginPath(); g.ellipse(u * size, v * size, rx * size, ry * size, 0, 0, Math.PI * 2); g.fill(); g.restore();
  }
  strands(g, size, size, r, 26000, [dark, light, base, '#FFE2B8'], 14, .35);
  return tex(c);
}

// Kohoumakartta turkille / höyhenille: pystysuuntaisia juovia
export function strandBump({ seed = 3, size = 512, n = 14000 } = {}) {
  const r = rng(seed);
  const [c, g] = canvas(size);
  g.fillStyle = '#808080'; g.fillRect(0, 0, size, size);
  strands(g, size, size, r, n, ['#FFFFFF', '#000000', '#B0B0B0', '#404040'], 10, .5, 1.2);
  return tex(c, { srgb: false });
}

// Karvakuorien läpinäkyvyys: satunnaiset pisteet, alphaTest karsii ohuemmaksi ulospäin
export function strandAlpha({ seed = 5, size = 256 } = {}) {
  const r = rng(seed);
  const [c, g] = canvas(size);
  const img = g.createImageData(size, size);
  for (let i = 0; i < size * size; i++) {
    const v = Math.pow(r(), 1.6) * 255;
    img.data[i * 4] = img.data[i * 4 + 1] = img.data[i * 4 + 2] = v; img.data[i * 4 + 3] = 255;
  }
  g.putImageData(img, 0, 0);
  const t = tex(c, { srgb: false, repeat: [28, 20] });
  t.magFilter = THREE.NearestFilter;
  return t;
}

export function featherTexture({ seed = 7, size = 1024 } = {}) {
  const r = rng(seed);
  const [c, g] = canvas(size);
  g.fillStyle = '#F4F5F8'; g.fillRect(0, 0, size, size);
  // suomukuvio: höyhenten reunat
  for (let row = 0; row < 40; row++) {
    for (let col = 0; col < 40; col++) {
      const x = col * 26 + (row % 2) * 13 + (r() - .5) * 4, y = row * 26 + (r() - .5) * 4;
      g.strokeStyle = `rgba(150,160,180,${.12 + r() * .12})`; g.lineWidth = 2;
      g.beginPath(); g.arc(x, y, 16, .15 * Math.PI, .85 * Math.PI); g.stroke();
    }
  }
  strands(g, size, size, r, 12000, ['#FFFFFF', '#DDE2EA', '#C7CEDA'], 10, .35, 1);
  return tex(c);
}

// Paistetun koiven kuori: kullanruskea, tummempia paahtumia ja rasvan kiiltoa
export function skinTexture({ seed = 11, size = 1024 } = {}) {
  const r = rng(seed);
  const [c, g] = canvas(size);
  const gr = g.createLinearGradient(0, 0, 0, size);
  gr.addColorStop(0, '#E7B066'); gr.addColorStop(.5, '#C8792E'); gr.addColorStop(1, '#A85A1E');
  g.fillStyle = gr; g.fillRect(0, 0, size, size);
  for (let i = 0; i < 260; i++) {
    const x = r() * size, y = r() * size, rad = 10 + r() * 70;
    const col = r() < .35 ? '#6B2E0C' : r() < .6 ? '#8F4414' : '#F2C47A';
    const rg = g.createRadialGradient(x, y, 0, x, y, rad);
    rg.addColorStop(0, col + (r() < .3 ? 'AA' : '66')); rg.addColorStop(1, col + '00');
    g.fillStyle = rg; g.fillRect(x - rad, y - rad, rad * 2, rad * 2);
  }
  // rapeat kuplat ja mausteet
  for (let i = 0; i < 2500; i++) {
    const x = r() * size, y = r() * size, rad = 1 + r() * 4;
    g.fillStyle = r() < .5 ? 'rgba(90,35,8,.5)' : 'rgba(255,215,140,.45)';
    g.beginPath(); g.arc(x, y, rad, 0, Math.PI * 2); g.fill();
  }
  for (let i = 0; i < 700; i++) { // mustapippuri
    g.fillStyle = 'rgba(30,15,5,.8)';
    g.beginPath(); g.arc(r() * size, r() * size, .8 + r() * 1.6, 0, Math.PI * 2); g.fill();
  }
  return tex(c);
}

export function skinBump({ seed = 12, size = 512 } = {}) {
  const r = rng(seed);
  const [c, g] = canvas(size);
  g.fillStyle = '#707070'; g.fillRect(0, 0, size, size);
  for (let i = 0; i < 1800; i++) {
    const x = r() * size, y = r() * size, rad = 2 + r() * 9;
    const rg = g.createRadialGradient(x, y, 0, x, y, rad);
    rg.addColorStop(0, `rgba(255,255,255,${.3 + r() * .5})`); rg.addColorStop(1, 'rgba(255,255,255,0)');
    g.fillStyle = rg; g.fillRect(x - rad, y - rad, rad * 2, rad * 2);
  }
  for (let i = 0; i < 120; i++) { // rypyt
    g.strokeStyle = 'rgba(0,0,0,.35)'; g.lineWidth = 1 + r() * 2;
    const x = r() * size, y = r() * size;
    g.beginPath(); g.moveTo(x, y); g.bezierCurveTo(x + r() * 40, y + r() * 20, x + r() * 60, y - r() * 20, x + 40 + r() * 60, y + (r() - .5) * 30); g.stroke();
  }
  return tex(c, { srgb: false });
}

// Lihan sisus haukkauksen kohdalla: vaalea, säikeinen
export function fleshTexture({ seed = 13, size = 512 } = {}) {
  const r = rng(seed);
  const [c, g] = canvas(size);
  g.fillStyle = '#EED3B4'; g.fillRect(0, 0, size, size);
  for (let i = 0; i < 900; i++) {
    g.strokeStyle = r() < .5 ? 'rgba(210,160,120,.5)' : 'rgba(255,240,225,.6)';
    g.lineWidth = 1 + r() * 3;
    const y = r() * size, x = r() * size;
    g.beginPath(); g.moveTo(x, y); g.quadraticCurveTo(x + 30, y + (r() - .5) * 10, x + 60 + r() * 60, y + (r() - .5) * 14); g.stroke();
  }
  for (let i = 0; i < 40; i++) {
    const x = r() * size, y = r() * size, rad = 10 + r() * 30;
    const rg = g.createRadialGradient(x, y, 0, x, y, rad);
    rg.addColorStop(0, 'rgba(230,170,150,.4)'); rg.addColorStop(1, 'rgba(230,170,150,0)');
    g.fillStyle = rg; g.fillRect(x - rad, y - rad, rad * 2, rad * 2);
  }
  return tex(c);
}

export function eyeTexture({ iris = ['#E6F0A8', '#A9C466', '#5B7730', '#26330F'], size = 512 } = {}) {
  const [c, g] = canvas(size, size / 2);
  const W = size, H = size / 2;
  g.fillStyle = '#F6F4EE'; g.fillRect(0, 0, W, H);
  const cx = W * .25, cy = H * .5, R = H * .34; // etupuolen keskellä
  const gr = g.createRadialGradient(cx, cy, 0, cx, cy, R);
  gr.addColorStop(0, iris[0]); gr.addColorStop(.45, iris[1]); gr.addColorStop(.85, iris[2]); gr.addColorStop(1, iris[3]);
  g.fillStyle = gr; g.beginPath(); g.ellipse(cx, cy, R * .5, R, 0, 0, Math.PI * 2); g.fill();
  g.strokeStyle = 'rgba(40,60,10,.35)'; g.lineWidth = 1.5;
  for (let a = 0; a < Math.PI * 2; a += .12) { g.beginPath(); g.moveTo(cx + Math.cos(a) * R * .1, cy + Math.sin(a) * R * .2); g.lineTo(cx + Math.cos(a) * R * .48, cy + Math.sin(a) * R * .96); g.stroke(); }
  g.fillStyle = '#060607'; g.beginPath(); g.ellipse(cx, cy, R * .12, R * .72, 0, 0, Math.PI * 2); g.fill();
  return tex(c);
}

export function woodTexture({ seed = 17, size = 512, base = '#7A4B2A', dark = '#4A2A14', light = '#A0703F' } = {}) {
  const r = rng(seed);
  const [c, g] = canvas(size);
  g.fillStyle = base; g.fillRect(0, 0, size, size);
  for (let i = 0; i < 140; i++) {
    g.strokeStyle = r() < .5 ? dark : light; g.globalAlpha = .15 + r() * .35; g.lineWidth = 1 + r() * 4;
    const x = r() * size;
    g.beginPath(); g.moveTo(x, 0);
    for (let y = 0; y <= size; y += 16) g.lineTo(x + Math.sin(y / 60 + i) * 6 + (r() - .5) * 2, y);
    g.stroke();
  }
  g.globalAlpha = 1;
  return tex(c);
}

export function tileTexture({ size = 1024 } = {}) {
  const r = rng(19);
  const [c, g] = canvas(size);
  g.fillStyle = '#CFC6B8'; g.fillRect(0, 0, size, size);
  const tw = 128, th = 64;
  for (let row = 0; row < size / th; row++) {
    for (let col = -1; col < size / tw + 1; col++) {
      const x = col * tw + (row % 2) * tw / 2, y = row * th;
      const v = 238 + Math.floor(r() * 12);
      const gr = g.createLinearGradient(x, y, x, y + th);
      gr.addColorStop(0, `rgb(${v},${v - 4},${v - 10})`); gr.addColorStop(1, `rgb(${v - 14},${v - 18},${v - 24})`);
      g.fillStyle = gr; g.beginPath(); g.roundRect(x + 3, y + 3, tw - 6, th - 6, 6); g.fill();
    }
  }
  return tex(c, { repeat: [3, 3] });
}

export function marbleTexture({ size = 1024 } = {}) {
  const r = rng(23);
  const [c, g] = canvas(size);
  g.fillStyle = '#F1EEE9'; g.fillRect(0, 0, size, size);
  g.filter = 'blur(1px)';
  for (let i = 0; i < 40; i++) {
    g.strokeStyle = `rgba(150,145,140,${.1 + r() * .25})`; g.lineWidth = .5 + r() * 2.5;
    let x = r() * size, y = r() * size; g.beginPath(); g.moveTo(x, y);
    for (let k = 0; k < 20; k++) { x += (r() - .3) * 60; y += (r() - .5) * 50; g.lineTo(x, y); }
    g.stroke();
  }
  g.filter = 'none';
  return tex(c, { repeat: [2, 1] });
}

export function asphaltTexture({ size = 1024 } = {}) {
  const r = rng(29);
  const [c, g] = canvas(size);
  g.fillStyle = '#4A4D53'; g.fillRect(0, 0, size, size);
  for (let i = 0; i < 60000; i++) {
    const v = 50 + Math.floor(r() * 90);
    g.fillStyle = `rgba(${v},${v},${v + 4},.5)`; g.fillRect(r() * size, r() * size, 1 + r() * 2, 1 + r() * 2);
  }
  // keskiviiva (katkoviiva) tekstuurin keskellä pituussuunnassa (u)
  g.fillStyle = '#E8E4D8';
  for (let x = 0; x < size; x += 256) g.fillRect(x + 40, size * .5 - 10, 150, 20);
  return tex(c, { repeat: [6, 1] });
}

export function grassTexture({ size = 1024 } = {}) {
  const r = rng(31);
  const [c, g] = canvas(size);
  g.fillStyle = '#4F8A33'; g.fillRect(0, 0, size, size);
  for (let i = 0; i < 80; i++) {
    const x = r() * size, y = r() * size, rad = 40 + r() * 120;
    const rg = g.createRadialGradient(x, y, 0, x, y, rad);
    rg.addColorStop(0, r() < .5 ? 'rgba(120,170,70,.35)' : 'rgba(40,80,25,.35)'); rg.addColorStop(1, 'rgba(0,0,0,0)');
    g.fillStyle = rg; g.fillRect(x - rad, y - rad, rad * 2, rad * 2);
  }
  strands(g, size, size, r, 40000, ['#6FA84A', '#3E7428', '#8CC060', '#2F5E1E'], 10, .6, 1.5);
  return tex(c, { repeat: [30, 30] });
}

export function leafTexture({ size = 512 } = {}) {
  const r = rng(37);
  const [c, g] = canvas(size);
  g.fillStyle = '#3F7A36'; g.fillRect(0, 0, size, size);
  for (let i = 0; i < 3000; i++) {
    g.fillStyle = ['#2E5F28', '#5A9A45', '#4B8A3C', '#77B25A'][Math.floor(r() * 4)];
    g.beginPath(); g.ellipse(r() * size, r() * size, 4 + r() * 6, 2 + r() * 3, r() * Math.PI, 0, Math.PI * 2); g.fill();
  }
  return tex(c, { repeat: [2, 2] });
}

// Pehmeä pilvi / höyry spritelle
export function puffTexture({ seed = 41, size = 256, color = '255,255,255' } = {}) {
  const r = rng(seed);
  const [c, g] = canvas(size);
  for (let i = 0; i < 26; i++) {
    const x = size * (.25 + r() * .5), y = size * (.3 + r() * .4), rad = size * (.12 + r() * .18);
    const rg = g.createRadialGradient(x, y, 0, x, y, rad);
    rg.addColorStop(0, `rgba(${color},.35)`); rg.addColorStop(1, `rgba(${color},0)`);
    g.fillStyle = rg; g.fillRect(0, 0, size, size);
  }
  return tex(c);
}
