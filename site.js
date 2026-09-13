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

  var reveals = document.querySelectorAll('.reveal');
  if (reveals.length && 'IntersectionObserver' in window) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });

    reveals.forEach(function (el) {
      observer.observe(el);
    });

    // Varmistus: jos esiintuloa ei jostain syystä laukaista, sisältö näytetään joka tapauksessa.
    var revealAll = function () {
      reveals.forEach(function (el) {
        el.classList.add('is-visible');
      });
    };
    window.setTimeout(revealAll, 4000);
    window.addEventListener('beforeprint', revealAll);
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
