# Videoputki

Pystyvideo (1080×1920). Jos kohteen hakemistossa on `aani.py`, se syntetisoi musiikin ja ääniefektit ja ne liitetään videoon; äänetön versio tallentuu nimellä `*-mykka.mp4` CapCutia varten.

1. `<nimi>/index.html`: SVG-animaatio ja `window.render(t)`, joka piirtää ruudun ajan `t` (sekuntia) mukaan. Sama `t` tuottaa aina saman ruudun. `window.DURATION` kertoo pituuden.
2. `render.js` kaappaa ruudut Playwrightilla ja kokoaa ne ffmpegillä.

```
apt-get update -qq && apt-get install -y ffmpeg && pip install numpy
NODE_PATH=/opt/node22/lib/node_modules node render.js kissa-ja-ankka     # tai: npm install playwright
```

Tulos: `kissa-ja-ankka/kissa-ja-ankka.mp4`. Ruudut (`frames/`) ja mp4 eivät ole repossa.

Uusi video: kopioi `kissa-ja-ankka/` uudella nimellä ja muuta kohtaukset.
Selaimessa voi esikatsella avaamalla `index.html` ja ajamalla konsolissa `render(4)`.

Puhe: `aani.py` tekee repliikit edge-tts:llä (`pip install edge-tts`), oletuksena suomeksi.
Englanninkielinen versio: `KIELI=en node render.js kissa-ja-ankka`. Repliikit ja ajoitukset
ovat `aani.py`:n `LINES`-listassa; animaatio lukee niistä suun liikkeet ja tekstitykset.

## 3D-versio (kissa-ja-ankka)

Kuva renderöidään three.js:llä (WebGL) selaimessa: `kohtaus.js` rakentaa mallit, valot ja kamerat,
`tekstuurit.js` piirtää turkin, höyhenet, lihan ym. tekstuurit koodilla. Riippuvuudet:

```
cd video && npm install          # three, three-bvh-csg (haukattu koipi), three-mesh-bvh
node render.js kissa-ja-ankka --peek 2 9.9 20   # yksittäiset ruudut frames/peek_*.png
```

Konttissa ei ole näytönohjainta, joten WebGL ajetaan ohjelmallisesti (SwiftShader) ja
koko video kestää renderöidä kauan.
