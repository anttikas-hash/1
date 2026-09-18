// Progressiivinen parannus: mobiilivalikko, osioiden esiintulo, headerin korostus
// ja tarjouspyyntölomakkeen kenttäkohtainen validointi.
// Sivu toimii ja on täysin luettava myös ilman tätä tiedostoa.

(function () {
  var toggle = document.getElementById('menu-toggle');
  var nav = document.getElementById('mobile-nav');
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var isOpen = nav.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });
  }

  var header = document.querySelector('.site-header');
  if (header) {
    var setElevation = function () {
      header.classList.toggle('is-scrolled', window.scrollY > 8);
    };
    setElevation();
    window.addEventListener('scroll', setElevation, { passive: true });
  }

  var reveals = [].slice.call(document.querySelectorAll('.reveal'));
  if (reveals.length) {
    // Sijaintiin perustuva tarkistus: toisin kuin leikkaustarkkailu, tämä ei ohita
    // osioita nopeassa vierityksessä eikä sivulle keskelle saavuttaessa.
    var pending = reveals;
    var ticking = false;

    var show = function () {
      ticking = false;
      var limit = window.innerHeight * 0.94;
      var still = [];
      for (var i = 0; i < pending.length; i++) {
        var el = pending[i];
        // Dokumenttisuhteinen mitta: offsetTop olisi suhteessa asemoituun vanhempaan.
        if (el.getBoundingClientRect().top < limit) {
          el.classList.add('is-visible');
        } else {
          still.push(el);
        }
      }
      pending = still;
      if (!pending.length) {
        window.removeEventListener('scroll', queue);
        window.removeEventListener('resize', queue);
      }
    };

    var queue = function () {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(show);
    };

    show();
    window.addEventListener('scroll', queue, { passive: true });
    window.addEventListener('resize', queue);
    window.addEventListener('load', queue);
    window.addEventListener('beforeprint', function () {
      reveals.forEach(function (el) { el.classList.add('is-visible'); });
    });
  }

  var form = document.querySelector('form[data-validate]');
  if (!form) return;

  var messages = {
    nimi: 'Kirjoita nimesi, jotta tiedämme kenelle vastaamme.',
    puhelin: 'Anna puhelinnumero, josta tavoitamme sinut.',
    sahkoposti: 'Anna sähköpostiosoite muodossa nimi@esimerkki.fi.',
    viesti: 'Kerro lyhyesti millainen kohde on ja mitä tarvitaan.'
  };

  var fieldOf = function (input) {
    return input.closest('.form-field');
  };

  var showError = function (input) {
    var field = fieldOf(input);
    if (!field) return;
    var box = field.querySelector('.field-error');
    if (box) {
      box.querySelector('.field-error-text').textContent =
        messages[input.id] || 'Täytä tämä kenttä.';
    }
    field.classList.add('has-error');
    input.setAttribute('aria-invalid', 'true');
  };

  var clearError = function (input) {
    var field = fieldOf(input);
    if (!field) return;
    field.classList.remove('has-error');
    input.removeAttribute('aria-invalid');
  };

  var inputs = form.querySelectorAll('input[required], textarea[required]');

  inputs.forEach(function (input) {
    input.addEventListener('input', function () {
      if (input.checkValidity()) clearError(input);
    });
    input.addEventListener('blur', function () {
      if (input.value !== '' && !input.checkValidity()) showError(input);
    });
  });

  form.addEventListener('submit', function (event) {
    var firstInvalid = null;

    inputs.forEach(function (input) {
      if (input.checkValidity()) {
        clearError(input);
      } else {
        showError(input);
        if (!firstInvalid) firstInvalid = input;
      }
    });

    if (firstInvalid) {
      event.preventDefault();
      firstInvalid.focus();
    }
  });
})();

/* Kartta ladataan vasta kun kayttaja pyytaa sita. */
(function () {
  var box = document.querySelector('.map-ask');
  if (!box) return;
  var go = box.querySelector('.map-go');
  if (!go) return;

  go.addEventListener('click', function () {
    var src = box.getAttribute('data-map');
    if (!src) return;
    var f = document.createElement('iframe');
    f.src = src;
    f.title = 'Kartta: Kairakatu 12, 26100 Rauma';
    f.setAttribute('referrerpolicy', 'no-referrer-when-downgrade');
    f.setAttribute('loading', 'lazy');
    box.parentNode.replaceChild(f, box);
    f.focus();
  });
})();
