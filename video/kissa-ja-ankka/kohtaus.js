// Kissa ja ankka 3D: kaikki mallit rakennetaan primitiiveistä ja koodilla piirretyistä tekstuureista.
// window.render(t) asettaa koko kohtauksen ajan t mukaan; sama t tuottaa aina saman ruudun.
import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { Sky } from 'three/addons/objects/Sky.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { BokehPass } from 'three/addons/postprocessing/BokehPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
import { Brush, Evaluator, SUBTRACTION } from 'three-bvh-csg';
import * as T from './tekstuurit.js';

const A = window.AJAT;
const W = 1080, H = 1920;
const clamp = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x));
const seg = (t, a, b) => clamp((t - a) / (b - a));
const easeOut = x => 1 - Math.pow(1 - x, 3);
const easeIn = x => x * x * x;
const easeInOut = x => x < .5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
const lerp = (a, b, x) => a + (b - a) * x;
const wrap = (x, w) => ((x % w) + w) % w;
const V = (x, y, z) => new THREE.Vector3(x, y, z);
const DEG = Math.PI / 180;

// ---- Renderöijä -------------------------------------------------------
const renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true });
renderer.setPixelRatio(1);
renderer.setSize(W, H);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFShadowMap;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.0;
document.getElementById('gl').appendChild(renderer.domElement);

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(30, W / H, .05, 400);
const pmrem = new THREE.PMREMGenerator(renderer);

// ---- Materiaalit ------------------------------------------------------
const furBump = T.strandBump();
const strandAlpha = T.strandAlpha();
function furMat(map, { sheen = '#FFD8A8' } = {}) {
  return new THREE.MeshPhysicalMaterial({ map, bumpMap: furBump, bumpScale: 2.5, roughness: .9, sheen: .35, sheenRoughness: .5, sheenColor: new THREE.Color(sheen) });
}
const M = {
  body: furMat(T.furTexture({ seed: 1, cream: [[.25, .64, .12, .24]] })),
  head: furMat(T.furTexture({ seed: 2, cream: [[.25, .66, .08, .13]] })),
  limb: furMat(T.furTexture({ seed: 3 })),
  cream: furMat(T.furTexture({ seed: 4, base: '#FFF1DF', dark: '#E8CFAE', light: '#FFFFFF', stripes: false }), { sheen: '#FFFFFF' }),
  pink: new THREE.MeshPhysicalMaterial({ color: '#E99AA2', roughness: .45, clearcoat: .4 }),
  nose: new THREE.MeshPhysicalMaterial({ color: '#E47F92', roughness: .3, clearcoat: .8, clearcoatRoughness: .2 }),
  eye: new THREE.MeshPhysicalMaterial({ map: T.eyeTexture(), roughness: .12, clearcoat: 1, clearcoatRoughness: .05 }),
  mouth: new THREE.MeshStandardMaterial({ color: '#3A0E14', roughness: .6 }),
  tongue: new THREE.MeshPhysicalMaterial({ color: '#E0707E', roughness: .35, clearcoat: .6 }),
  teeth: new THREE.MeshPhysicalMaterial({ color: '#FBF7EE', roughness: .25, clearcoat: .7 }),
  whisker: new THREE.MeshStandardMaterial({ color: '#FFFFFF', roughness: .4 }),
  line: new THREE.MeshStandardMaterial({ color: '#3A1A0E', roughness: .6 }),
  metal: new THREE.MeshStandardMaterial({ color: '#E4E7EC', metalness: 1, roughness: .16 }),
  chrome: new THREE.MeshStandardMaterial({ color: '#F2F4F7', metalness: 1, roughness: .08 }),
  darkMetal: new THREE.MeshStandardMaterial({ color: '#2B2E34', metalness: .7, roughness: .35 }),
  wood: new THREE.MeshStandardMaterial({ map: T.woodTexture(), roughness: .72 }),
  cloth: new THREE.MeshPhysicalMaterial({ color: '#FAFAFA', roughness: .92, sheen: .6, sheenColor: new THREE.Color('#FFFFFF') }),
  glass: new THREE.MeshPhysicalMaterial({ color: '#0C1428', roughness: .04, metalness: .2, clearcoat: 1 }),
  frame: new THREE.MeshStandardMaterial({ color: '#111114', roughness: .35 }),
  feather: new THREE.MeshPhysicalMaterial({ map: T.featherTexture(), bumpMap: furBump, bumpScale: 1.2, roughness: .8, sheen: .6, sheenColor: new THREE.Color('#FFFFFF') }),
  beak: new THREE.MeshPhysicalMaterial({ color: '#F0902E', roughness: .35, clearcoat: .7, clearcoatRoughness: .2 }),
  beakDark: new THREE.MeshPhysicalMaterial({ color: '#C8671E', roughness: .4, clearcoat: .5 }),
  bead: new THREE.MeshPhysicalMaterial({ color: '#08080A', roughness: .05, clearcoat: 1 }),
  skin: new THREE.MeshPhysicalMaterial({ map: T.skinTexture(), bumpMap: T.skinBump(), bumpScale: 4, roughness: .42, clearcoat: .85, clearcoatRoughness: .22, sheen: .3, sheenColor: new THREE.Color('#FFD28A') }),
  flesh: new THREE.MeshPhysicalMaterial({ map: T.fleshTexture(), bumpMap: T.fleshTexture(), bumpScale: 2, roughness: .6, clearcoat: .3 }),
  bone: new THREE.MeshPhysicalMaterial({ color: '#F1E6CF', roughness: .55, clearcoat: .2 }),
  paint: new THREE.MeshPhysicalMaterial({ color: '#1C6F96', roughness: .25, metalness: .1, clearcoat: 1, clearcoatRoughness: .05 }),
  tire: new THREE.MeshStandardMaterial({ color: '#17181B', roughness: .85 }),
  leather: new THREE.MeshPhysicalMaterial({ color: '#1D1B1A', roughness: .45, clearcoat: .4 }),
  lamp: new THREE.MeshStandardMaterial({ color: '#FFF6D8', emissive: '#FFF1C0', emissiveIntensity: 1.2, roughness: .1 }),
  oil: new THREE.MeshPhysicalMaterial({ color: '#E2A73C', roughness: .08, clearcoat: 1, transparent: true, opacity: .92 }),
  butter: new THREE.MeshPhysicalMaterial({ color: '#FFE38A', roughness: .3, clearcoat: .6 }),
  pan: new THREE.MeshStandardMaterial({ color: '#23252A', metalness: .6, roughness: .32 }),
  panOut: new THREE.MeshStandardMaterial({ color: '#9AA1AB', metalness: 1, roughness: .28 }),
};

function mesh(geo, mat, { cast = true, receive = false } = {}) {
  const m = new THREE.Mesh(geo, mat);
  m.castShadow = cast; m.receiveShadow = receive;
  return m;
}
const SPH = new THREE.SphereGeometry(1, 72, 48);
function ell(rx, ry, rz, mat, pos = [0, 0, 0], opts) {
  const m = mesh(SPH, mat, opts);
  m.scale.set(rx, ry, rz); m.position.set(...pos);
  return m;
}
function tube(points, r, mat, seg = 32) {
  return mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(points), seg, r, 10, false), mat);
}
function cyl(r, h, mat, pos = [0, 0, 0], seg = 24) {
  const m = mesh(new THREE.CylinderGeometry(r, r, h, seg), mat);
  m.position.set(...pos);
  return m;
}

// Karvakuoret: saman muodon suurennettuja kopioita, joista alphaTest jättää vain karvat
const SHELLS = 7;
function furry(m, len = .035, R = null) {
  const base = m.material;
  R = R || Math.min(m.scale.x, m.scale.y, m.scale.z);
  for (let i = 1; i <= SHELLS; i++) {
    const h = i / SHELLS;
    const mat = base.clone();
    mat.alphaMap = strandAlpha; mat.alphaTest = .25 + .7 * h; mat.bumpMap = null;
    mat.color = new THREE.Color().setScalar(.72 + .38 * h);
    const s = mesh(m.geometry, mat, { cast: false });
    const k = 1 + len * h / R;
    s.scale.setScalar(k);
    m.add(s);
  }
  return m;
}

// ---- Kissa -------------------------------------------------------------
function buildCat() {
  const cat = new THREE.Group();
  const P = {};
  cat.add(furry(ell(.46, .52, .40, M.body, [0, .62, 0])));
  P.feet = [-1, 1].map(s => { const f = furry(ell(.15, .11, .21, M.limb, [s * .19, .1, .08]), .025); cat.add(f); return f; });
  // häntä
  P.tail = new THREE.Group(); P.tail.position.set(0, .32, -.32); cat.add(P.tail);
  const tailM = tube([V(0, 0, 0), V(-.15, .02, -.22), V(-.34, .3, -.3), V(-.36, .66, -.2), V(-.28, .82, -.1)], .065, M.limb);
  P.tail.add(tailM);
  // kaulaketju
  const chain = new THREE.Group(); chain.position.set(0, 1.0, .03); chain.rotation.x = .32; cat.add(chain);
  const linkG = new THREE.TorusGeometry(.042, .014, 10, 24);
  for (let i = 0; i < 30; i++) {
    const a = i / 30 * Math.PI * 2;
    const l = mesh(linkG, M.metal);
    l.position.set(Math.sin(a) * .35, 0, Math.cos(a) * .32);
    l.rotation.order = 'YXZ'; l.rotation.y = a; if (i % 2) l.rotation.x = Math.PI / 2;
    l.scale.x = 1.35;
    chain.add(l);
  }
  const pend = mesh(new THREE.TorusGeometry(.06, .02, 12, 32), M.metal); pend.position.set(0, -.09, .34); chain.add(pend);

  // pää
  P.head = new THREE.Group(); P.head.position.set(0, 1.05, .02); cat.add(P.head);
  const hc = new THREE.Group(); hc.position.y = .27; P.head.add(hc); P.hc = hc;
  hc.add(furry(ell(.43, .35, .37, M.head)));
  [-1, 1].forEach(s => hc.add(furry(ell(.15, .12, .13, M.head, [s * .3, -.08, .12]), .03))); // posket
  [-1, 1].forEach(s => {
    const ear = new THREE.Group(); ear.position.set(s * .25, .26, -.03); ear.rotation.z = -s * .38; hc.add(ear);
    const outer = mesh(new THREE.ConeGeometry(.15, .32, 32), M.head); outer.scale.z = .55; outer.position.y = .12; ear.add(furry(outer, .02, .1));
    const inner = mesh(new THREE.ConeGeometry(.1, .24, 24), M.pink); inner.scale.z = .3; inner.position.set(0, .1, .045); ear.add(inner);
  });
  P.eyes = []; P.lids = [];
  [-1, 1].forEach(s => {
    const eg = new THREE.Group(); eg.position.set(s * .155, .05, .29); hc.add(eg);
    const eye = mesh(new THREE.SphereGeometry(.1, 48, 32), M.eye); eg.add(eye); P.eyes.push(eye);
    const lid = mesh(new THREE.SphereGeometry(.108, 40, 20, 0, Math.PI * 2, 0, Math.PI * .42), M.head); eg.add(lid); P.lids.push(lid);
    const low = mesh(new THREE.SphereGeometry(.106, 40, 12, 0, Math.PI * 2, Math.PI * .8, Math.PI * .2), M.head); eg.add(low);
  });
  [-1, 1].forEach(s => hc.add(furry(ell(.105, .085, .09, M.cream, [s * .068, -.1, .31]), .02)));
  hc.add(furry(ell(.075, .055, .07, M.cream, [0, -.17, .29]), .015));
  hc.add(ell(.045, .03, .032, M.nose, [0, -.04, .40]));
  P.smile = tube([V(-.07, -.11, .39), V(-.035, -.135, .405), V(0, -.105, .41), V(.035, -.135, .405), V(.07, -.11, .39)], .006, M.line);
  hc.add(P.smile);
  P.grin = new THREE.Group(); hc.add(P.grin);
  P.grin.add(ell(.08, .055, .04, M.mouth, [0, -.15, .37]));
  P.grin.add(ell(.05, .02, .03, M.tongue, [0, -.19, .385]));
  [-1, 1].forEach(s => { const f = mesh(new THREE.ConeGeometry(.012, .04, 12), M.teeth); f.rotation.x = Math.PI; f.position.set(s * .045, -.12, .395); P.grin.add(f); });
  [-1, 1].forEach(s => [-.03, 0, .03].forEach((dy, i) => hc.add(tube([V(s * .1, -.1 + dy * .5, .37), V(s * .28, -.08 + dy * 1.2, .38 - i * .02), V(s * .52, -.1 + dy * 3, .3)], .0028, M.whisker, 16))));
  // aurinkolasit
  P.shades = new THREE.Group(); hc.add(P.shades);
  [-1, 1].forEach(s => {
    const g = mesh(new RoundedBoxGeometry(.2, .13, .03, 4, .04), M.glass); g.position.set(s * .13, .05, .41); g.rotation.y = s * .18; P.shades.add(g);
    P.shades.add(tube([V(s * .23, .07, .39), V(s * .38, .08, .25), V(s * .42, .08, .05)], .008, M.frame, 12));
  });
  P.shades.add(tube([V(-.04, .08, .43), V(0, .09, .44), V(.04, .08, .43)], .008, M.frame, 8));
  // kokin hattu
  P.hat = new THREE.Group(); P.hat.position.set(0, .3, -.02); hc.add(P.hat);
  P.hat.add(cyl(.3, .2, M.cloth, [0, .02, 0], 48));
  [[-.18, .24, 0, .2], [.18, .24, 0, .2], [0, .28, .12, .2], [0, .28, -.12, .2], [0, .38, 0, .22]].forEach(([x, y, z, r]) => P.hat.add(ell(r, r * .9, r, M.cloth, [x, y, z])));

  // kädet: nivel olkapäässä, käsi roikkuu -y-suuntaan
  P.arms = [-1, 1].map(s => {
    const arm = new THREE.Group(); arm.position.set(s * .43, .93, .05); cat.add(arm);
    const up = mesh(new THREE.CapsuleGeometry(.1, .3, 8, 24), M.limb); up.position.y = -.2; arm.add(furry(up, .025, .1));
    arm.add(furry(ell(.12, .11, .12, M.limb, [0, -.46, 0]), .02));
    const hand = new THREE.Group(); hand.position.y = -.47; arm.add(hand);
    arm.userData.hand = hand;
    return arm;
  });
  // keppi oikeassa kädessä
  P.stick = new THREE.Group(); P.arms[1].userData.hand.add(P.stick);
  const st = cyl(.028, 1.62, M.wood, [0, 0, 0], 20); P.stick.add(st);
  P.stickMesh = st;
  cat.traverse(o => { if (o.isMesh) o.castShadow = o.castShadow && !o.material.alphaMap; });
  cat.userData = P;
  return cat;
}

// ---- Ankka -------------------------------------------------------------
function buildDuck() {
  const duck = new THREE.Group();      // sijainti ja suunta
  const roll = new THREE.Group(); duck.add(roll); // kaatuminen kylkiasentoon
  const P = { roll };
  const body = new THREE.Group(); roll.add(body); P.body = body;
  body.add(furry(ell(.24, .2, .34, M.feather, [0, .32, 0]), .02));
  const tail = mesh(new THREE.ConeGeometry(.11, .2, 24), M.feather); tail.position.set(0, .42, -.36); tail.rotation.x = -2.1; tail.scale.x = .7; body.add(tail);
  [-1, 1].forEach(s => { const w = ell(.07, .14, .25, M.feather, [s * .2, .36, -.04]); w.rotation.x = -.2; body.add(furry(w, .015)); });
  const neck = mesh(new THREE.CapsuleGeometry(.09, .18, 8, 24), M.feather); neck.position.set(0, .54, .2); body.add(furry(neck, .015, .09));
  P.head = new THREE.Group(); P.head.position.set(0, .62, .2); body.add(P.head);
  P.head.add(furry(ell(.14, .14, .15, M.feather, [0, .08, .02]), .015));
  P.head.add(ell(.07, .026, .1, M.beak, [0, .055, .17]));
  P.head.add(ell(.06, .02, .085, M.beakDark, [0, .028, .15]));
  P.eyes = []; P.lids = [];
  [-1, 1].forEach(s => {
    const e = ell(.026, .026, .026, M.bead, [s * .112, .11, .08]); P.head.add(e); P.eyes.push(e);
    const lid = mesh(new THREE.SphereGeometry(.03, 24, 12, 0, Math.PI * 2, 0, Math.PI * .55), M.feather);
    lid.position.set(s * .112, .11, .08); lid.rotation.z = -s * 1.3; lid.visible = false; P.head.add(lid); P.lids.push(lid);
  });
  P.feet = [-1, 1].map(s => {
    const leg = new THREE.Group(); leg.position.set(s * .08, .2, .02); roll.add(leg);
    leg.add(cyl(.02, .2, M.beak, [0, -.1, 0], 12));
    leg.add(ell(.06, .012, .09, M.beak, [0, -.19, .05]));
    return leg;
  });
  duck.userData = P;
  duck.traverse(o => { if (o.isMesh && o.material.alphaMap) o.castShadow = false; });
  return duck;
}

// ---- Koipi (ja haukattu versio CSG:llä) -------------------------------
function buildDrumstick() {
  const r = T.rng(99);
  const pts = [[0, -.32], [.045, -.312], [.08, -.285], [.098, -.245], [.106, -.2], [.1, -.15], [.084, -.1], [.058, -.062], [.032, -.035], [.02, -.02]].map(([x, y]) => new THREE.Vector2(x, y));
  const geo = new THREE.LatheGeometry(pts, 64);
  // epäsäännöllinen muoto: pieni kohina säteeseen
  const p = geo.attributes.position, nb = [];
  for (let i = 0; i < 12; i++) nb.push([r() * 6.28, 2 + r() * 5, (r() - .5) * .018]);
  for (let i = 0; i < p.count; i++) {
    const x = p.getX(i), y = p.getY(i), z = p.getZ(i), a = Math.atan2(z, x);
    let k = 1; for (const [ph, f, amp] of nb) k += amp * Math.sin(a * f + ph + y * 20) / .08;
    k = 1 + (k - 1) * clamp((-y - .03) / .05);
    p.setXYZ(i, x * k, y, z * k * .92);
  }
  geo.computeVertexNormals();
  const g = new THREE.Group();
  const whole = mesh(geo, M.skin); g.add(whole);
  // haukkaus: pallo leikataan pois, jolloin sisältä näkyy liha
  const ev = new Evaluator(); ev.useGroups = true;
  const a = new Brush(geo, M.skin);
  const b = new Brush(new THREE.SphereGeometry(.075, 32, 24), M.flesh); b.position.set(.07, -.25, .03); b.updateMatrixWorld();
  const bitten = ev.evaluate(a, b, SUBTRACTION);
  bitten.castShadow = true; bitten.visible = false; g.add(bitten);
  const bone = new THREE.Group(); g.add(bone);
  bone.add(cyl(.018, .1, M.bone, [0, .01, 0], 16));
  [-1, 1].forEach(s => bone.add(ell(.025, .022, .022, M.bone, [s * .016, .065, 0])));
  g.userData = { whole, bitten };
  return g;
}

// ---- Moottoripyörä ------------------------------------------------------
function buildBike() {
  const bike = new THREE.Group(), P = {};
  P.wheels = [-.78, .78].map(x => {
    const w = new THREE.Group(); w.position.set(x, .34, 0); bike.add(w);
    w.add(mesh(new THREE.TorusGeometry(.29, .06, 20, 64), M.tire));
    w.add(mesh(new THREE.TorusGeometry(.23, .016, 12, 48), M.chrome));
    const spin = new THREE.Group(); w.add(spin); w.userData.spin = spin;
    for (let i = 0; i < 10; i++) { const s = cyl(.005, .44, M.chrome, [0, 0, 0], 6); s.rotation.z = i / 10 * Math.PI; spin.add(s); }
    const hub = cyl(.05, .12, M.chrome, [0, 0, 0]); hub.rotation.x = Math.PI / 2; w.add(hub);
    return w;
  });
  const rear = ell(.62, .3, .3, M.paint, [-.42, .74, 0]); bike.add(rear);
  const floor = mesh(new RoundedBoxGeometry(.8, .1, .36, 4, .04), M.paint); floor.position.set(.02, .5, 0); bike.add(floor);
  const shield = ell(.13, .5, .3, M.paint, [.55, .86, 0]); shield.rotation.z = -.25; bike.add(shield);
  const fender = mesh(new THREE.TorusGeometry(.36, .05, 12, 32, Math.PI * .8), M.paint); fender.position.set(.78, .34, 0); fender.rotation.z = Math.PI * .15; bike.add(fender);
  const seat = mesh(new RoundedBoxGeometry(.78, .12, .38, 5, .05), M.leather); seat.position.set(-.38, 1.06, 0); bike.add(seat);
  bike.add(tube([V(.55, .9, 0), V(.52, 1.25, 0), V(.48, 1.46, 0)], .03, M.chrome, 12));
  const bar = cyl(.018, .8, M.chrome, [.48, 1.46, 0]); bar.rotation.x = Math.PI / 2; bike.add(bar);
  [-1, 1].forEach(s => { const gpp = cyl(.028, .14, M.leather, [.48, 1.46, s * .38]); gpp.rotation.x = Math.PI / 2; bike.add(gpp); });
  [-1, 1].forEach(s => { bike.add(tube([V(.48, 1.46, s * .3), V(.44, 1.62, s * .34), V(.42, 1.72, s * .36)], .007, M.chrome, 8)); bike.add(ell(.05, .035, .015, M.chrome, [.42, 1.74, s * .36])); });
  const lamp = ell(.09, .09, .06, M.lamp, [.66, 1.3, 0]); lamp.rotation.y = Math.PI / 2; bike.add(lamp);
  const lampRim = mesh(new THREE.TorusGeometry(.09, .015, 10, 32), M.chrome); lampRim.position.set(.69, 1.3, 0); lampRim.rotation.y = Math.PI / 2; bike.add(lampRim);
  const ex = cyl(.04, .6, M.chrome, [-.62, .42, .2]); ex.rotation.z = Math.PI / 2 - .15; bike.add(ex);
  // kori ankalle: ohuita metallilankoja
  const basket = new THREE.Group(); basket.position.set(.9, 1.17, 0); bike.add(basket);
  const bw = .46, bh = .3, bd = .46;
  for (let i = 0; i <= 6; i++) {
    const x = -bw / 2 + i * bw / 6;
    [-1, 1].forEach(s => { const c = cyl(.005, bh, M.chrome, [x, 0, s * bd / 2], 6); basket.add(c); });
    const zc = -bd / 2 + i * bd / 6;
    [-1, 1].forEach(s => { const c = cyl(.005, bh, M.chrome, [s * bw / 2, 0, zc], 6); basket.add(c); });
  }
  [-bh / 2, 0, bh / 2].forEach(y => {
    [-1, 1].forEach(s => { const c = cyl(.006, bw, M.chrome, [0, y, s * bd / 2], 6); c.rotation.z = Math.PI / 2; basket.add(c); });
    [-1, 1].forEach(s => { const c = cyl(.006, bd, M.chrome, [s * bw / 2, y, 0], 6); c.rotation.x = Math.PI / 2; basket.add(c); });
  });
  const bb = mesh(new THREE.BoxGeometry(bw, .01, bd), M.darkMetal); bb.position.y = -bh / 2; basket.add(bb);
  P.basket = basket;
  bike.userData = P;
  return bike;
}

// ---- Ympäristöt --------------------------------------------------------
const puff = T.puffTexture();
function sprite(tex, size, opacity = 1, color = '#ffffff') {
  const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex, transparent: true, opacity, depthWrite: false, color }));
  s.scale.set(size, size, 1);
  return s;
}

function buildSky(elev = 32, azim = 200) {
  const sky = new Sky(); sky.scale.setScalar(300);
  const u = sky.material.uniforms;
  u.turbidity.value = 3; u.rayleigh.value = 1.2; u.mieCoefficient.value = .004; u.mieDirectionalG.value = .8;
  const sun = new THREE.Vector3().setFromSphericalCoords(1, (90 - elev) * DEG, azim * DEG);
  u.sunPosition.value.copy(sun);
  return { sky, sun };
}

function buildMeadow() {
  const g = new THREE.Group();
  const ground = mesh(new THREE.PlaneGeometry(300, 300), new THREE.MeshStandardMaterial({ map: T.grassTexture(), roughness: .95 }), { cast: false, receive: true });
  ground.rotation.x = -Math.PI / 2; g.add(ground);
  // ruohonkorret
  const blade = new THREE.PlaneGeometry(.025, .12, 1, 4);
  blade.translate(0, .06, 0);
  const bp = blade.attributes.position;
  for (let i = 0; i < bp.count; i++) { const y = bp.getY(i); bp.setX(i, bp.getX(i) * (1 - y / .13)); bp.setZ(i, y * y * 1.2); }
  blade.computeVertexNormals();
  const n = 26000, r = T.rng(5);
  const grass = new THREE.InstancedMesh(blade, new THREE.MeshStandardMaterial({ roughness: .8, side: THREE.DoubleSide }), n);
  const m4 = new THREE.Matrix4(), q = new THREE.Quaternion(), c = new THREE.Color();
  for (let i = 0; i < n; i++) {
    const x = -4.5 + r() * 9, z = -5 + r() * 6.2, s = .6 + r() * .8;
    q.setFromEuler(new THREE.Euler((r() - .5) * .3, r() * Math.PI * 2, (r() - .5) * .3));
    m4.compose(V(x, 0, z), q, V(s, s * (.7 + r() * .8), s)); grass.setMatrixAt(i, m4);
    c.setHSL(.24 + r() * .06, .5 + r() * .2, .14 + r() * .12); grass.setColorAt(i, c);
  }
  grass.receiveShadow = true; g.add(grass);
  // kukat
  for (let i = 0; i < 60; i++) {
    const f = ell(.025, .008, .025, new THREE.MeshStandardMaterial({ color: r() < .6 ? '#FFFFFF' : '#FFE066', roughness: .6 }), [-4 + r() * 9, .12 + r() * .06, -5 + r() * 7.5]);
    f.castShadow = false; g.add(f);
  }
  // puut taustalla
  const leaf = new THREE.MeshStandardMaterial({ map: T.leafTexture(), roughness: .9 });
  const bark = new THREE.MeshStandardMaterial({ map: T.woodTexture({ seed: 3, base: '#5A4030', dark: '#3A281C', light: '#7A5A40' }), roughness: .9 });
  for (let i = 0; i < 26; i++) {
    const x = -34 + i * 2.8 + r() * 1.5, z = -38 - r() * 16, s = 1.1 + r() * 1.1;
    const tree = new THREE.Group(); tree.position.set(x, 0, z); tree.scale.setScalar(s);
    tree.add(cyl(.12, 1.6, bark, [0, .8, 0], 10));
    for (let k = 0; k < 6; k++) tree.add(ell(.7 + r() * .4, .6 + r() * .3, .7 + r() * .3, leaf, [(r() - .5) * 1, 1.9 + r() * .9, (r() - .5) * .8]));
    g.add(tree);
  }
  const hills = new THREE.MeshStandardMaterial({ color: '#6E9A5E', roughness: 1 });
  for (let i = 0; i < 5; i++) g.add(ell(30 + r() * 20, 6 + r() * 5, 12, hills, [-60 + i * 30, -2, -70 - r() * 20], { cast: false }));
  // pilvet
  for (let i = 0; i < 9; i++) {
    const cl = new THREE.Group(); cl.position.set(-50 + i * 13 + r() * 6, 22 + r() * 12, -110);
    for (let k = 0; k < 6; k++) { const s = sprite(puff, 14 + r() * 10, .9); s.position.set((r() - .5) * 14, (r() - .5) * 4, 0); cl.add(s); }
    g.add(cl);
  }
  return g;
}

function buildRoad() {
  const g = new THREE.Group();
  const asphalt = T.asphaltTexture();
  const road = mesh(new THREE.PlaneGeometry(60, 5), new THREE.MeshStandardMaterial({ map: asphalt, roughness: .9 }), { cast: false, receive: true });
  road.rotation.x = -Math.PI / 2; g.add(road);
  const grassT = T.grassTexture();
  const side = [-1, 1].map(s => {
    const p = mesh(new THREE.PlaneGeometry(60, 60), new THREE.MeshStandardMaterial({ map: grassT, roughness: .95 }), { cast: false, receive: true });
    p.rotation.x = -Math.PI / 2; p.position.set(0, -.01, s * 32.5); g.add(p); return p;
  });
  const leaf = new THREE.MeshStandardMaterial({ map: T.leafTexture(), roughness: .9 });
  const bark = new THREE.MeshStandardMaterial({ color: '#5A4030', roughness: .9 });
  const r = T.rng(8), trees = [];
  for (let i = 0; i < 16; i++) {
    const t = new THREE.Group(); const s = 1.4 + r() * 1.2; t.scale.setScalar(s);
    t.add(cyl(.12, 1.6, bark, [0, .8, 0], 10));
    for (let k = 0; k < 5; k++) t.add(ell(.7 + r() * .4, .6 + r() * .3, .7, leaf, [(r() - .5), 1.9 + r() * .8, (r() - .5) * .8]));
    t.userData = { x0: i * 3.2, z: -5 - (i % 3) * 3 - r() * 2 };
    g.add(t); trees.push(t);
  }
  const rail = new THREE.Group(); g.add(rail);
  const railBar = mesh(new THREE.BoxGeometry(60, .12, .04), M.panOut); railBar.position.set(0, .55, -2.8); rail.add(railBar);
  const posts = [];
  for (let i = 0; i < 24; i++) { const p = mesh(new THREE.BoxGeometry(.08, .6, .08), M.darkMetal); p.position.set(0, .3, -2.82); g.add(p); posts.push(p); }
  g.userData = { asphalt, grassT, trees, posts };
  return g;
}

function buildKitchen() {
  const g = new THREE.Group();
  const wall = mesh(new THREE.PlaneGeometry(12, 6), new THREE.MeshStandardMaterial({ map: T.tileTexture(), roughness: .35 }), { cast: false, receive: true });
  wall.position.set(0, 2, -1.3); g.add(wall);
  // ikkuna, josta tulee valo
  const win = mesh(new THREE.PlaneGeometry(1.3, 1.1), new THREE.MeshBasicMaterial({ color: '#FFF8E6' }), { cast: false }); win.position.set(-1.1, 2.1, -1.28); g.add(win);
  const wf = new THREE.MeshStandardMaterial({ color: '#F6F4EF', roughness: .5 });
  [[0, .58, 1.42, .08], [0, -.58, 1.42, .08], [-.68, 0, .08, 1.24], [.68, 0, .08, 1.24], [0, 0, .05, 1.1], [0, 0, 1.3, .05]].forEach(([x, y, w, h]) => {
    const b = mesh(new THREE.BoxGeometry(w, h, .06), wf); b.position.set(-1.1 + x, 2.1 + y, -1.26); g.add(b);
  });
  // hylly ja purkit
  const shelf = mesh(new THREE.BoxGeometry(1.6, .05, .3), M.wood); shelf.position.set(1.3, 2.3, -1.12); g.add(shelf);
  const jar = new THREE.MeshPhysicalMaterial({ color: '#D9E6EA', roughness: .1, transmission: .0, transparent: true, opacity: .55, clearcoat: 1 });
  [[.8, .22, '#C9853A'], [1.15, .3, '#E8D6A0'], [1.5, .18, '#8A5A30'], [1.85, .26, '#D0C8B0']].forEach(([x, h, c]) => {
    g.add(cyl(.08, h * .8, new THREE.MeshStandardMaterial({ color: c, roughness: .8 }), [x, 2.33 + h * .4, -1.1]));
    g.add(cyl(.09, h, jar, [x, 2.33 + h / 2, -1.1]));
  });
  [[.9, .5], [1.2, .6], [1.5, .45]].forEach(([x, l]) => {
    g.add(cyl(.01, l, M.panOut, [x, 2.2 - l / 2, -1.15], 8));
    g.add(ell(.07, .09, .02, M.panOut, [x, 2.2 - l, -1.15]));
  });
  // työtaso ja kaapit
  const cab = new THREE.MeshStandardMaterial({ map: T.woodTexture({ seed: 9, base: '#6E4424', dark: '#3E220E', light: '#8E5E36' }), roughness: .6 });
  const counter = mesh(new THREE.BoxGeometry(8, .95, .7), cab, { receive: true }); counter.position.set(0, .475, .15); g.add(counter);
  for (let i = -3; i <= 3; i++) {
    const d = mesh(new RoundedBoxGeometry(.9, .7, .03, 3, .01), cab); d.position.set(i * .98, .45, .51); g.add(d);
    const hdl = cyl(.012, .12, M.chrome, [i * .98 + .36, .65, .535], 10); g.add(hdl);
  }
  const top = mesh(new THREE.BoxGeometry(8, .05, .76), new THREE.MeshPhysicalMaterial({ map: T.marbleTexture(), roughness: .2, clearcoat: .6 }), { receive: true });
  top.position.set(0, .975, .15); g.add(top);
  // liesi
  const stove = mesh(new RoundedBoxGeometry(.8, .03, .6, 3, .01), new THREE.MeshPhysicalMaterial({ color: '#0E0F12', roughness: .1, clearcoat: 1 }), { receive: true });
  stove.position.set(.85, 1.012, .12); g.add(stove);
  const flames = new THREE.Group(); flames.position.set(.85, 1.03, .12); g.add(flames);
  const flameMat = new THREE.MeshBasicMaterial({ color: '#3F8CFF', transparent: true, opacity: .8, blending: THREE.AdditiveBlending, depthWrite: false });
  for (let i = 0; i < 16; i++) {
    const a = i / 16 * Math.PI * 2, f = mesh(new THREE.ConeGeometry(.012, .05, 8), flameMat, { cast: false });
    f.position.set(Math.cos(a) * .11, .02, Math.sin(a) * .11); flames.add(f);
  }
  // pannu
  const pan = new THREE.Group(); pan.position.set(.85, 1.05, .12); g.add(pan);
  const prof = [[0, 0], [.2, 0], [.225, .01], [.24, .06], [.245, .065]].map(([x, y]) => new THREE.Vector2(x, y));
  const panG = new THREE.LatheGeometry(prof, 64);
  pan.add(mesh(panG, M.pan));
  const outer = mesh(panG, M.panOut); outer.scale.set(1.02, 1.02, 1.02); outer.position.y = -.004; pan.add(outer);
  const handle = mesh(new RoundedBoxGeometry(.36, .03, .05, 3, .012), M.darkMetal); handle.position.set(.4, .06, .12); handle.rotation.y = -.35; handle.rotation.z = .12; pan.add(handle);
  const oil = mesh(new THREE.CircleGeometry(.205, 64), M.oil, { cast: false, receive: true }); oil.rotation.x = -Math.PI / 2; oil.position.y = .012; pan.add(oil);
  const butter = mesh(new RoundedBoxGeometry(.07, .03, .05, 3, .01), M.butter); butter.position.set(-.08, .02, .05); butter.rotation.y = .5; pan.add(butter);
  const bubbles = [];
  for (let i = 0; i < 18; i++) { const b = ell(.01, .006, .01, new THREE.MeshPhysicalMaterial({ color: '#FFF2C0', roughness: .05, clearcoat: 1, transparent: true, opacity: .8 }), [0, .016, 0], { cast: false }); pan.add(b); bubbles.push(b); }
  const steamT = T.puffTexture({ seed: 44 });
  const steam = [];
  for (let i = 0; i < 10; i++) { const s = sprite(steamT, .4, .3); g.add(s); steam.push(s); }
  g.userData = { flames, pan, butter, bubbles, steam };
  return g;
}

// ---- Kokoaminen --------------------------------------------------------
const cat = buildCat(), duck = buildDuck(), bike = buildBike(), drum = buildDrumstick();
const CP = cat.userData, DP = duck.userData;
const meadow = buildMeadow(), road = buildRoad(), kitchen = buildKitchen();
scene.add(cat, duck, meadow, road, kitchen);
bike.visible = false; scene.add(bike);
const { sky, sun } = buildSky();
scene.add(sky);
const skyScene = new THREE.Scene(); const sky2 = buildSky(); skyScene.add(sky2.sky);
const envOut = pmrem.fromScene(skyScene).texture;
const envIn = pmrem.fromScene(new RoomEnvironment(), .04).texture;

const hemi = new THREE.HemisphereLight('#CFE6FF', '#5A7A3A', .9); scene.add(hemi);
const key = new THREE.DirectionalLight('#FFF1DC', 3.2);
key.castShadow = true; key.shadow.mapSize.set(2048, 2048); key.shadow.bias = -.0004; key.shadow.normalBias = .02;
const sc = key.shadow.camera; sc.left = -4; sc.right = 4; sc.top = 4; sc.bottom = -4; sc.near = .5; sc.far = 40;
scene.add(key, key.target);
const fill = new THREE.DirectionalLight('#FFE2C4', .6); scene.add(fill);

// Sulat ja pöly iskussa
const featherTex = T.puffTexture({ seed: 50 });
const feathers = [];
for (let i = 0; i < 12; i++) {
  const f = ell(.012, .004, .04, M.feather, [0, 0, 0]); f.visible = false; scene.add(f); feathers.push(f);
}
const dustT = T.puffTexture({ seed: 60, color: '205,190,150' });
const dust = [];
for (let i = 0; i < 8; i++) { const s = sprite(dustT, .5, .0); s.visible = false; scene.add(s); dust.push(s); }

// Jälkikäsittely: syväterävyys
const composer = new EffectComposer(renderer);
composer.addPass(new RenderPass(scene, camera));
const bokeh = new BokehPass(scene, camera, { focus: 7, aperture: .0025, maxblur: .006 });
composer.addPass(bokeh);
composer.addPass(new OutputPass());

// ---- Asennot ----------------------------------------------------------
// Käsivarsi kulmana (0 = alas, -90 = ulospäin sivulle, -180 = ylös) kuten 2D-versiossa
function armAngle(arm, a, fwd = 0) {
  const side = Math.sign(arm.position.x);
  arm.rotation.set(fwd, 0, -a * DEG * side);
}
// Käsivarsi osoittamaan maailman pistettä kohti
const _v = new THREE.Vector3(), _q = new THREE.Quaternion(), _m = new THREE.Matrix4();
function pointArm(arm, target) {
  arm.parent.updateMatrixWorld(true);
  const sh = arm.getWorldPosition(new THREE.Vector3());
  const dirW = target.clone().sub(sh).normalize();
  _q.copy(arm.parent.getWorldQuaternion(new THREE.Quaternion())).invert();
  const dirL = dirW.applyQuaternion(_q);
  arm.quaternion.setFromUnitVectors(V(0, -1, 0), dirL);
}
function catFace({ eyes = 'open', mouth = 'smile', look = 0, shades = false, hat = false, blinkT = 0 }) {
  // luomet: 0 auki, 1 kiinni
  let close = eyes === 'happy' ? .78 : 0;
  const b = wrap(blinkT, 3.3); if (eyes === 'open' && b < .14) close = Math.sin(b / .14 * Math.PI);
  CP.lids.forEach(l => { l.rotation.x = lerp(-.62, 1.35, close); });
  CP.eyes.forEach(e => { e.rotation.y = look * .45; e.visible = true; });
  CP.smile.visible = mouth === 'smile'; CP.grin.visible = mouth === 'grin';
  CP.shades.visible = shades; CP.hat.visible = hat;
}
function catWalk(ph, amp) {
  const s = Math.sin(ph * Math.PI * 2);
  CP.feet[0].position.set(-.19, .1 + Math.max(0, s) * amp, .08 + s * .08);
  CP.feet[1].position.set(.19, .1 + Math.max(0, -s) * amp, .08 - s * .08);
}
function catReset() {
  if (cat.parent !== scene) scene.add(cat);
  cat.position.set(0, 0, 0); cat.rotation.set(0, 0, 0); cat.scale.setScalar(1);
  CP.feet.forEach(f => f.visible = true);
  catWalk(0, 0);
  CP.head.rotation.set(0, 0, 0);
  CP.tail.rotation.set(0, 0, 0);
  CP.stick.visible = false; CP.stick.position.set(0, 0, 0);
  if (drum.parent) drum.parent.remove(drum);
  CP.arms.forEach(a => a.rotation.set(0, 0, 0));
}
function duckReset() {
  duck.visible = true; duck.position.set(0, 0, 0); duck.rotation.set(0, Math.PI / 2, 0); duck.scale.setScalar(1);
  DP.roll.rotation.set(0, 0, 0); DP.roll.position.set(0, 0, 0); DP.roll.scale.setScalar(1);
  DP.head.rotation.set(0, 0, 0);
  DP.eyes.forEach(e => e.visible = true); DP.lids.forEach(l => l.visible = false);
  DP.feet.forEach(f => { f.position.y = .2; f.visible = true; });
  if (duck.parent !== scene) scene.add(duck);
}
function duckKO(ko) { DP.eyes.forEach(e => e.visible = !ko); DP.lids.forEach(l => l.visible = ko); }
function tail(t) { CP.tail.rotation.set(Math.sin(t * 1.3) * .08, Math.sin(t * 2.1) * .35, Math.sin(t * 1.7) * .12); }

function setCamera(pos, look, focus, fov = 30) {
  camera.position.copy(pos); camera.fov = fov; camera.updateProjectionMatrix(); camera.lookAt(look);
  bokeh.uniforms.focus.value = focus;
}
function outdoor(sunDir) {
  scene.environment = envOut; scene.environmentIntensity = .6; scene.background = null;
  scene.fog = new THREE.Fog('#BFD9EC', 25, 140);
  sky.visible = true; hemi.intensity = .55; hemi.color.set('#CFE6FF'); hemi.groundColor.set('#5A7A3A');
  key.color.set('#FFF1DC'); key.intensity = 2.8;
  key.position.copy(sunDir.clone().multiplyScalar(15)); key.target.position.set(0, 0, 0);
  fill.intensity = .5; fill.position.set(-4, 2, 6);
  renderer.toneMappingExposure = .92;
}

// Iskukohta lasketaan kissan asennosta: ankan pää asetetaan kohtaan, johon keppi osuu
const HIT_A = -80, SLIDE = .36;
const CAT_BONK = V(-.55, 0, 0), CAT_YAW = .38;
function duckSpot() {
  catReset(); cat.position.copy(CAT_BONK); cat.rotation.y = CAT_YAW;
  CP.stick.visible = true; CP.stick.position.y = -(.24 + SLIDE);
  armAngle(CP.arms[1], HIT_A);
  cat.updateMatrixWorld(true);
  // kepin kohta 0.5 m kämmenen ohi; ankan pään keskipiste 0.1 m sen alapuolelle
  const hit = CP.arms[1].userData.hand.localToWorld(V(0, -.5, 0));
  const forward = V(Math.cos(CAT_YAW), 0, -Math.sin(CAT_YAW));
  const headOff = .22; // pään keskipiste ankan origosta eteenpäin
  return hit.clone().add(V(0, -.1, 0)).sub(forward.clone().multiplyScalar(headOff)).setY(0);
}
const DUCK_POS = duckSpot();
const DUCK_YAW = Math.PI / 2 + CAT_YAW;
const DUCK_REL = DUCK_POS.clone().sub(CAT_BONK);

// ---- Kohtaukset -------------------------------------------------------
function sceneWalk(u) {
  const D = A.bonk - A.walk;
  outdoor(sun);
  meadow.visible = true; road.visible = false; kitchen.visible = false; bike.visible = false;
  catReset(); duckReset();
  const x = lerp(-1.3, CAT_BONK.x, u / D);
  const ph = (u - .35) / .8;
  cat.position.set(x, Math.abs(Math.sin(ph * Math.PI * 2)) * .018, 0); cat.rotation.y = CAT_YAW;
  cat.rotation.z = Math.sin(ph * Math.PI * 2) * .025;
  catWalk(ph, .07); tail(u);
  CP.stick.visible = true; CP.stick.position.y = -.24;
  armAngle(CP.arms[1], -8 + Math.sin(ph * Math.PI * 2) * 3, -.1);
  armAngle(CP.arms[0], -6, Math.sin(ph * Math.PI * 2) * .35);
  const look = easeInOut(seg(u, D - 1.4, D - .8));
  CP.head.rotation.set(Math.sin(ph * Math.PI * 4) * .02, look * .35, look * -.05);
  catFace({ look, blinkT: u });
  duck.position.set(x + DUCK_REL.x, 0, DUCK_REL.z); duck.rotation.y = DUCK_YAW;
  DP.roll.rotation.z = Math.sin(u * Math.PI * 4) * .07;
  DP.roll.position.y = Math.abs(Math.sin(u * Math.PI * 4)) * .02;
  DP.feet.forEach((f, i) => f.position.y = .2 + Math.max(0, Math.sin(u * Math.PI * 4 + i * Math.PI)) * .04);
  DP.head.rotation.x = Math.sin(u * 9) * .08;
  hideFx();
  const cx = x + .62;
  setCamera(V(cx - .1, 1.3, 8.6), V(cx, .9, 0), 8.6);
}

function sceneBonk(u) {
  const HIT = 2.8;
  outdoor(sun);
  meadow.visible = true; road.visible = false; kitchen.visible = false; bike.visible = false;
  catReset(); duckReset();
  cat.position.copy(CAT_BONK); cat.rotation.y = CAT_YAW;
  tail(u * .7);
  CP.stick.visible = true;
  CP.stick.position.y = -(.24 + SLIDE) * easeInOut(seg(u, .5, 1.1)) - .24 * (1 - easeInOut(seg(u, .5, 1.1)));
  const raise = easeInOut(seg(u, 1.0, 2.4)), hit = easeIn(seg(u, HIT - .2, HIT));
  let a = u < HIT - .2 ? lerp(-8, -205, raise) : lerp(-205, HIT_A, hit);
  if (u > HIT) a += Math.sin((u - HIT) * 30) * 3 * (1 - seg(u, HIT, HIT + .5));
  armAngle(CP.arms[1], a, -.1 * (1 - raise));
  armAngle(CP.arms[0], lerp(-6, -40, raise) * (1 - seg(u, 3.0, 3.6)), -.2 * raise);
  cat.rotation.z = u < HIT - .2 ? raise * .06 : lerp(.06, -.05, hit) * (1 - seg(u, HIT + .3, HIT + 1));
  const impact = u >= HIT;
  CP.head.rotation.set(0, .35, impact ? -.04 : -.05 - raise * .05);
  catFace({ look: 1, eyes: u > 3.6 ? 'happy' : 'open', mouth: u > 3.6 ? 'grin' : 'smile', blinkT: u + 7 });

  // ankka kääntää päänsä, saa iskun ja kaatuu kyljelleen
  duck.position.copy(DUCK_POS); duck.rotation.y = DUCK_YAW;
  const turn = easeInOut(seg(u, 1.5, 1.8));
  DP.head.rotation.set(impact ? .3 : -.15 * turn, turn * 2.3, 0);
  const sq = impact ? 1 - .2 * Math.sin(seg(u, HIT, HIT + .25) * Math.PI) : 1;
  const fall = easeOut(seg(u, HIT + .3, HIT + .65));
  const bounce = fall >= 1 ? Math.abs(Math.sin(seg(u, HIT + .65, HIT + .95) * Math.PI)) * .05 * (1 - seg(u, HIT + .65, HIT + .95)) : 0;
  DP.roll.scale.set(1 / Math.sqrt(sq), sq, 1 / Math.sqrt(sq));
  DP.roll.rotation.z = fall * 1.45;
  DP.roll.position.set(-fall * .02, fall * .16 + bounce, 0);
  duckKO(impact);

  // sulat pöllähtävät iskussa, pöly kaatuessa
  const k = u - HIT, head = DP.head.getWorldPosition(new THREE.Vector3());
  const r = T.rng(77);
  feathers.forEach((f, i) => {
    const ang = r() * Math.PI * 2, up = .6 + r() * 1.2, sp = .5 + r() * .9;
    f.visible = impact && k < 4;
    if (!f.visible) return;
    const kk = Math.min(k, .45);
    f.position.set(DUCK_POS.x + .2 + Math.cos(ang) * sp * kk * 2 + Math.sin(k * 3 + i) * .08 * k,
      .9 + up * kk * 2 - Math.max(0, k - .35) * .22,
      DUCK_POS.z + Math.sin(ang) * sp * kk * 1.5);
    f.position.y = Math.max(.03, f.position.y);
    f.rotation.set(r() * 6 + k * (2 + r() * 3), r() * 6 + k * 2, r() * 6);
  });
  const dk = u - (HIT + .62);
  dust.forEach((d, i) => {
    d.visible = dk > 0 && dk < 1.4;
    const s = easeOut(seg(dk, 0, 1.2));
    d.position.set(DUCK_POS.x - .1 + (i - 3.5) * .09 * (1 + s * 2), .08 + s * .18 * ((i % 3) + .5), DUCK_POS.z + .1 + (i % 2) * .15);
    d.scale.setScalar(.25 + s * .5); d.material.opacity = .55 * (1 - s);
  });
  const shake = impact ? .05 * Math.exp(-(u - HIT) * 7) : 0;
  const z = lerp(8.2, 7.4, easeInOut(seg(u, 0, 2.6)));
  setCamera(V(-.05 + Math.sin(u * 83) * shake, 1.25 + Math.cos(u * 97) * shake, z), V(.05, .88, 0), z);
  return impact ? .35 * (1 - seg(u, HIT, HIT + .12)) : 0;
}
function hideFx() { feathers.forEach(f => f.visible = false); dust.forEach(d => d.visible = false); }

function sceneRide(u) {
  outdoor(V(-.6, .7, .5).normalize());
  meadow.visible = false; road.visible = true; kitchen.visible = false; bike.visible = true;
  hideFx();
  const R = road.userData, speed = 9;
  const off = u * speed;
  R.asphalt.offset.x = off / 10; R.grassT.offset.x = off / 2;
  R.trees.forEach(t => { t.position.set(wrap(t.userData.x0 - off, 51.2) - 22, 0, t.userData.z); });
  R.posts.forEach((p, i) => p.position.x = wrap(i * 2.5 - off, 60) - 30);
  const enter = easeOut(seg(u, 0, .9));
  const jump = u > 2.4 && u < 2.9 ? Math.sin(seg(u, 2.4, 2.9) * Math.PI) : 0;
  bike.position.set(lerp(-4, 0, enter), jump * .35 + Math.sin(u * 22) * .008, .6);
  bike.rotation.set(0, 0, jump * .1 + Math.sin(u * 3) * .006);
  bike.userData.wheels.forEach(w => w.userData.spin.rotation.z = -off / .35);
  // kissa satulassa, katse kameraan päin
  catReset(); bike.add(cat);
  cat.position.set(-.35, .98, 0); cat.rotation.y = .9;
  CP.feet.forEach(f => f.visible = false);
  tail(u * 3);
  CP.head.rotation.set(Math.sin(u * 22) * .015, -.35, Math.sin(u * 2) * .04);
  catFace({ shades: true, mouth: 'grin', blinkT: u });
  bike.updateMatrixWorld(true);
  pointArm(CP.arms[1], bike.localToWorld(V(.46, 1.46, .38)));
  pointArm(CP.arms[0], bike.localToWorld(V(.46, 1.46, -.38)));
  // ankka korissa tajuttomana
  duckReset(); bike.userData.basket.add(duck);
  duck.position.set(0, -.12, 0); duck.rotation.set(0, Math.PI / 2 - .3, 0); duck.scale.setScalar(.85);
  DP.feet.forEach(f => f.visible = false);
  duckKO(true);
  DP.head.rotation.set(.9 + Math.sin(u * 11) * .15 + jump * .4, .5, Math.sin(u * 7) * .2);
  const bx = bike.position.x;
  setCamera(V(bx + 2.6 + Math.sin(u * 37) * .01, 1.9, 8.2), V(bx + .1, 1.15, .6), 8);
}

function sceneCook(u) {
  const LIFT = 4.2, BITE = 4.9;
  scene.environment = envIn; scene.environmentIntensity = .5; scene.fog = null;
  scene.background = new THREE.Color('#E8DCC8');
  sky.visible = false; meadow.visible = false; road.visible = false; kitchen.visible = true; bike.visible = false;
  hemi.color.set('#FFF3E0'); hemi.groundColor.set('#6E5238'); hemi.intensity = .7;
  key.color.set('#FFE9C8'); key.intensity = 3.0; key.position.set(-4, 5, 4); key.target.position.set(.3, 1, 0);
  fill.intensity = .8; fill.position.set(4, 2, 3);
  renderer.toneMappingExposure = 1.05;
  hideFx();
  duck.visible = false;
  catReset();
  cat.position.set(0, .42, -.5); cat.rotation.y = -.08;
  CP.feet.forEach(f => f.visible = false);
  tail(u);
  const lift = easeInOut(seg(u, LIFT, LIFT + .6));
  const chew = u > BITE + .1 ? Math.abs(Math.sin((u - BITE) * 11)) : 0;
  const eyes = u < LIFT ? 'happy' : u < BITE + .2 ? 'open' : u < 7.2 ? 'happy' : 'open';
  catFace({ hat: true, eyes, mouth: u > BITE && chew < .5 ? 'smile' : 'grin', look: u > 7.2 ? 0 : .3, blinkT: u });
  CP.head.rotation.set(-.08 + lift * .12 + chew * .04, .12 * (1 - lift) + Math.sin(u * 1.3) * .05, Math.sin(u * 1.7) * .04);
  CP.grin.scale.y = u > BITE ? .6 + chew * .6 : 1;
  cat.updateMatrixWorld(true);
  armAngle(CP.arms[0], -20, -.9);
  // oikea käsi: koipi pannussa, sitten suuhun
  const K = kitchen.userData;
  const panPt = K.pan.localToWorld(V(-.02, .06 + Math.sin(u * 6) * .02, .02));
  const mouth = CP.hc.localToWorld(V(.05, -.14, .42));
  const target = panPt.clone().lerp(mouth, lift);
  pointArm(CP.arms[1], target);
  CP.arms[1].userData.hand.add(drum);
  drum.position.set(0, -.01, 0); drum.rotation.set(0, lift * 1.2, 0);
  drum.userData.whole.visible = u < BITE; drum.userData.bitten.visible = u >= BITE;
  // liekit, kuplat, voi, höyry
  K.flames.children.forEach((f, i) => { f.scale.y = .8 + Math.sin(u * 30 + i * 1.7) * .25; });
  K.butter.scale.set(1, clamp(1 - u / 6, .25, 1), 1);
  const r = T.rng(5);
  K.bubbles.forEach((b, i) => {
    const ph = wrap(u * 1.7 + r(), 1), a = r() * 6.28, rr = .05 + r() * .14;
    b.position.set(Math.cos(a) * rr, .015, Math.sin(a) * rr); b.scale.setScalar(.004 + ph * .01); b.material.opacity = .8 * (1 - ph);
  });
  K.steam.forEach((s, i) => {
    const ph = wrap(u * .35 + i / K.steam.length, 1);
    s.position.set(.85 + Math.sin(i * 2.3 + u) * .12, 1.1 + ph * .9, .12 + Math.cos(i * 1.7) * .08);
    s.scale.setScalar(.25 + ph * .5); s.material.opacity = .22 * Math.sin(ph * Math.PI);
  });
  const D = A.end - A.cook;
  const k = easeInOut(u / D);
  setCamera(V(lerp(.35, .3, k), lerp(1.8, 1.75, k), lerp(5.2, 4.5, k)), V(lerp(.4, .3, k), lerp(1.45, 1.5, k), 0), lerp(5.5, 4.9, k));
}

window.render = function (t) {
  let flash = 0;
  if (t < A.bonk) sceneWalk(t - A.walk);
  else if (t < A.ride) flash = sceneBonk(t - A.bonk);
  else if (t < A.cook) sceneRide(t - A.ride);
  else sceneCook(t - A.cook);
  composer.render();
  window.overlay(t, flash);
};
window.READY = true;
