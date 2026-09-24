# Videoputki

Äänetön pystyvideo (1080×1920). Ääni, tekstitys ja musiikki lisätään CapCutissa.

1. `<nimi>/index.html`: SVG-animaatio ja `window.render(t)`, joka piirtää ruudun ajan `t` (sekuntia) mukaan. Sama `t` tuottaa aina saman ruudun. `window.DURATION` kertoo pituuden.
2. `render.js` kaappaa ruudut Playwrightilla ja kokoaa ne ffmpegillä.

```
apt-get update -qq && apt-get install -y ffmpeg
NODE_PATH=/opt/node22/lib/node_modules node render.js kissa-ja-ankka     # tai: npm install playwright
```

Tulos: `kissa-ja-ankka/kissa-ja-ankka.mp4`. Ruudut (`frames/`) ja mp4 eivät ole repossa.

Uusi video: kopioi `kissa-ja-ankka/` uudella nimellä ja muuta kohtaukset.
Selaimessa voi esikatsella avaamalla `index.html` ja ajamalla konsolissa `render(4)`.
