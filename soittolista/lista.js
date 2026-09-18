(function () {
  'use strict';

  var KEY = 'soittolista.v1';

  // Sivuston tila ratkaisee prioriteetin: yritys jolla ei ole sivustoa
  // lainkaan on lammin liidi, yritys jolla on toimiva sivusto on kylma.
  var WEB = {
    none:    { rank: 1, label: 'Ei sivustoa',    cls: 'web-none' },
    broken:  { rank: 2, label: 'Sivusto rikki',  cls: 'web-broken' },
    old:     { rank: 3, label: 'Vanha sivusto',  cls: 'web-old' },
    unknown: { rank: 4, label: 'Tarkistamatta',  cls: 'web-unknown' },
    ok:      { rank: 5, label: 'Sivusto kunnossa', cls: 'web-ok' }
  };

  var STATUS = {
    new:      'Soittamatta',
    noanswer: 'Ei vastannut',
    talked:   'Puhuttu',
    sent:     'Linkki lähetetty',
    callback: 'Soita uudelleen',
    yes:      'Kiinnostunut',
    no:       'Ei kiinnosta'
  };

  var STATUS_RANK = { callback: 0, sent: 1, talked: 2, new: 3, noanswer: 4, yes: 5, no: 6 };

  // Hakukoneella vahvistetut raumalaiset yritykset. Puhelinnumerot
  // puuttuvat tarkoituksella — ne haetaan Fonectasta, koska vaara
  // numero puhelussa on pahempi virhe kuin tyhja kentta.
  var SEED = [
    ['Rakennusliike Koskialho Oy', 'Rakennusliike'],
    ['Rakennus Jope Oy', 'Rakennusliike'],
    ['RS-Rakennus Oy', 'Rakennusliike'],
    ['Lännen Rakennus & Saneeraus Oy', 'Rakennusliike'],
    ['Rakennuspalvelu Mäkelä', 'Rakennusliike'],
    ['Veljet Mäkilä Oy', 'Rakennusliike'],
    ['Rakennus Lappi Oy', 'Rakennusliike'],
    ['RHA-Saneeraus', 'Rakennusliike'],
    ['Rakennus & Saneeraus R. Vainio', 'Rakennusliike'],
    ['Rakennus & Saneeraus M. Lomppi', 'Rakennusliike'],
    ['Rakennus Talosaari Oy', 'Rakennusliike'],
    ['LVT-Putki Oy', 'LVI / putki'],
    ['Putkimies Rauma', 'LVI / putki'],
    ['Jussin LVI-Asennus Oy', 'LVI / putki'],
    ['Eurajoen Kiinteistöpalvelu Oy', 'Kiinteistöhuolto'],
    ['Rauman Rauta- ja Putkirakenne Oy', 'LVI / putki'],
  ];

  var rows = [];
  var filter = 'all';

  var $ = function (s) { return document.querySelector(s); };
  var list = $('#lista');
  var say = $('#say');

  function load() {
    try {
      var raw = localStorage.getItem(KEY);
      rows = raw ? JSON.parse(raw) : [];
      if (!Array.isArray(rows)) rows = [];
    } catch (e) {
      // Yksityinen selausikkuna tai estetyt evasteet: tyokalu toimii
      // silti, mutta tiedot katoavat sivun sulkeutuessa.
      rows = [];
      tell('Selain ei salli tallennusta — lista katoaa kun suljet sivun.');
    }
  }

  function save() {
    try {
      localStorage.setItem(KEY, JSON.stringify(rows));
    } catch (e) {
      tell('Tallennus ei onnistunut. Kopioi lista talteen.');
    }
  }

  var timer;
  function tell(msg) {
    say.textContent = msg;
    clearTimeout(timer);
    timer = setTimeout(function () { say.textContent = ''; }, 4000);
  }

  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  // Puhelinnumero linkiksi: valilyonnit pois, kotimainen 0-alku
  // kansainvaliseen muotoon, jotta linkki toimii myos ulkomailta.
  function telHref(p) {
    var d = String(p || '').replace(/[^\d+]/g, '');
    if (!d) return '';
    if (d.charAt(0) === '0') d = '+358' + d.slice(1);
    return 'tel:' + d;
  }

  function sorted() {
    return rows.slice().sort(function (a, b) {
      var sa = STATUS_RANK[a.status] != null ? STATUS_RANK[a.status] : 3;
      var sb = STATUS_RANK[b.status] != null ? STATUS_RANK[b.status] : 3;
      if (sa !== sb) return sa - sb;
      var wa = (WEB[a.web] || WEB.unknown).rank;
      var wb = (WEB[b.web] || WEB.unknown).rank;
      if (wa !== wb) return wa - wb;
      return a.name.localeCompare(b.name, 'fi');
    });
  }

  function keep(r) {
    if (filter === 'todo') return r.status === 'new' || r.status === 'noanswer';
    if (filter === 'follow') return r.status === 'callback' || r.status === 'sent';
    if (filter === 'yes') return r.status === 'yes';
    return true;
  }

  function counts() {
    var sent = 0, yes = 0, todo = 0;
    rows.forEach(function (r) {
      if (r.status === 'new' || r.status === 'noanswer') todo++;
      if (r.status === 'sent' || r.status === 'yes') sent++;
      if (r.status === 'yes') yes++;
    });
    $('#n-total').textContent = rows.length;
    $('#n-todo').textContent = todo;
    $('#n-sent').textContent = sent;
    $('#n-yes').textContent = yes;
  }

  function statusOptions(cur) {
    var out = '';
    for (var k in STATUS) {
      out += '<option value="' + k + '"' + (k === cur ? ' selected' : '') + '>' + STATUS[k] + '</option>';
    }
    return out;
  }

  function webOptions(cur) {
    var out = '';
    for (var k in WEB) {
      out += '<option value="' + k + '"' + (k === cur ? ' selected' : '') + '>' + WEB[k].label + '</option>';
    }
    return out;
  }

  function render() {
    counts();
    var shown = sorted().filter(keep);

    if (!rows.length) {
      list.innerHTML = '<div class="empty"><p><b>Lista on tyhjä.</b></p>' +
        '<p>Avaa fonecta.fi, hae toimiala ja paikkakunta, ja lisää yritykset tähän. ' +
        'Tavoite on 50 riviä.</p></div>';
      return;
    }
    if (!shown.length) {
      list.innerHTML = '<div class="empty"><p>Ei osumia tällä suodattimella.</p></div>';
      return;
    }

    list.innerHTML = shown.map(function (r) {
      var w = WEB[r.web] || WEB.unknown;
      var href = telHref(r.phone);
      return '<article class="item" data-web="' + esc(r.web) + '" data-status="' + esc(r.status) + '" data-id="' + esc(r.id) + '">' +
        '<div class="head">' +
          '<span class="name">' + esc(r.name) + '</span>' +
          (r.trade ? '<span class="trade">' + esc(r.trade) + '</span>' : '') +
        '</div>' +
        '<div class="tags"><span class="tag ' + w.cls + '">' + w.label + '</span>' +
          '<span class="tag">' + (STATUS[r.status] || STATUS.new) + '</span></div>' +
        (href
          ? '<a class="tel" href="' + href + '">' + esc(r.phone) + '</a>'
          : '<span class="nophone">Numero puuttuu</span>') +
        (r.note ? '<p class="note">' + esc(r.note) + '</p>' : '') +
        '<div class="set">' +
          '<label class="sr-only" for="s-' + esc(r.id) + '">Tila</label>' +
          '<select id="s-' + esc(r.id) + '" data-act="status">' + statusOptions(r.status) + '</select>' +
          '<label class="sr-only" for="w-' + esc(r.id) + '">Sivuston tila</label>' +
          '<select id="w-' + esc(r.id) + '" data-act="web">' + webOptions(r.web) + '</select>' +
          '<button class="kill" type="button" data-act="del">Poista</button>' +
        '</div>' +
      '</article>';
    }).join('');
  }

  function find(id) {
    for (var i = 0; i < rows.length; i++) if (rows[i].id === id) return rows[i];
    return null;
  }

  // ---- tapahtumat ----

  list.addEventListener('change', function (e) {
    var el = e.target;
    var act = el.getAttribute('data-act');
    if (!act) return;
    var item = el.closest('.item');
    var r = find(item.getAttribute('data-id'));
    if (!r) return;
    r[act] = el.value;
    save();
    render();
  });

  list.addEventListener('click', function (e) {
    if (e.target.getAttribute('data-act') !== 'del') return;
    var item = e.target.closest('.item');
    var r = find(item.getAttribute('data-id'));
    if (!r) return;
    if (!confirm('Poistetaanko ' + r.name + ' listalta?')) return;
    rows = rows.filter(function (x) { return x.id !== r.id; });
    save();
    render();
    tell('Poistettu.');
  });

  var form = $('#add');
  var toggle = $('#toggle-add');

  function openForm(on) {
    form.hidden = !on;
    toggle.setAttribute('aria-expanded', on ? 'true' : 'false');
    if (on) $('#f-name').focus();
  }

  toggle.addEventListener('click', function () { openForm(form.hidden); });
  $('#cancel-add').addEventListener('click', function () { openForm(false); toggle.focus(); });

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var name = $('#f-name').value.trim();
    if (!name) { $('#f-name').focus(); return; }
    rows.push({
      id: String(Date.now()) + String(Math.floor(Math.random() * 1000)),
      name: name,
      phone: $('#f-phone').value.trim(),
      trade: $('#f-trade').value.trim(),
      web: $('#f-web').value,
      note: $('#f-note').value.trim(),
      status: 'new'
    });
    save();
    render();
    form.reset();
    $('#f-web').value = 'unknown';
    $('#f-name').focus();
    tell(name + ' lisättiin. Yhteensä ' + rows.length + '.');
  });

  Array.prototype.forEach.call(document.querySelectorAll('.chip'), function (c) {
    c.addEventListener('click', function () {
      filter = c.getAttribute('data-filter');
      Array.prototype.forEach.call(document.querySelectorAll('.chip'), function (x) {
        x.classList.toggle('is-on', x === c);
      });
      render();
    });
  });

  $('#export').addEventListener('click', function () {
    if (!rows.length) { tell('Lista on tyhjä.'); return; }
    var txt = sorted().map(function (r) {
      var w = WEB[r.web] || WEB.unknown;
      return [r.name, r.phone || '-', r.trade || '-', w.label, STATUS[r.status] || '', r.note || '']
        .join('\t');
    }).join('\n');
    var head = ['Nimi', 'Puhelin', 'Toimiala', 'Sivusto', 'Tila', 'Muistiinpano'].join('\t');
    var all = head + '\n' + txt;

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(all).then(
        function () { tell('Lista kopioitu. Liitä se taulukkoon.'); },
        function () { fallback(all); }
      );
    } else {
      fallback(all);
    }
  });

  function fallback(text) {
    // Leikepoyta ei ole kaytettavissa esim. ilman HTTPS-yhteytta.
    var ta = document.createElement('textarea');
    ta.value = text;
    ta.setAttribute('readonly', '');
    ta.style.position = 'fixed';
    ta.style.left = '-9999px';
    document.body.appendChild(ta);
    ta.select();
    try { document.execCommand('copy'); tell('Lista kopioitu.'); }
    catch (e) { tell('Kopiointi ei onnistunut tässä selaimessa.'); }
    document.body.removeChild(ta);
  }

  var seedBtn = $('#seed');
  if (seedBtn) {
    seedBtn.addEventListener('click', function () {
      var have = {};
      rows.forEach(function (r) { have[r.name.toLowerCase()] = true; });
      var added = 0;
      SEED.forEach(function (s) {
        if (have[s[0].toLowerCase()]) return;
        rows.push({
          id: String(Date.now()) + String(Math.floor(Math.random() * 100000)),
          name: s[0], phone: '', trade: s[1],
          web: 'unknown', note: '', status: 'new'
        });
        added++;
      });
      save();
      render();
      tell(added
        ? added + ' yritystä lisätty. Hae numerot Fonectasta.'
        : 'Nämä ovat jo listalla.');
    });
  }

  $('#wipe').addEventListener('click', function () {
    if (!rows.length) return;
    if (!confirm('Tyhjennetäänkö koko lista? Tätä ei voi perua.')) return;
    rows = [];
    save();
    render();
    tell('Lista tyhjennetty.');
  });

  load();
  render();
})();
