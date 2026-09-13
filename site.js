// Progressiivinen parannus: mobiilivalikko ja osioiden esiintulo.
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

  var reveals = document.querySelectorAll('.reveal');
  if (!reveals.length || !('IntersectionObserver' in window)) return;

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
  function revealAll() {
    reveals.forEach(function (el) {
      el.classList.add('is-visible');
    });
  }
  window.setTimeout(revealAll, 4000);
  window.addEventListener('beforeprint', revealAll);
})();
