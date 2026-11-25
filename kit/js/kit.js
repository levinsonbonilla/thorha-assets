/*
 * Motor «kit»: movimiento al hacer scroll. Marca con data-kit-reveal las piezas que deben aparecer (secciones, títulos, tarjetas) y las
 * muestra con IntersectionObserver; el CSS de cada receta (kit--motion-*) decide CÓMO aparecen. Sin JS o con «reducir movimiento» se ve todo.
 */
(function () {
  var root = document.documentElement;
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Encabezado: sombra al desplazarse.
  var onScroll = function () { document.body.classList.toggle('is-scrolled', window.scrollY > 8); };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Carruseles: Bootstrap solo marca el indicador activo dentro de `.carousel-indicators`; las portadas con contador propio
  // (`.kit-hero__count` de «full», miniaturas, etc.) se quedaban en «01» aunque la diapositiva cambiara. Se sincroniza cualquier
  // [data-bs-slide-to] del carrusel con la diapositiva que entra (va antes del corte de «reducir movimiento»: no es animación).
  document.addEventListener('slid.bs.carousel', function (e) {
    var carousel = e.target;
    carousel.querySelectorAll('[data-bs-slide-to]').forEach(function (btn) {
      var on = parseInt(btn.getAttribute('data-bs-slide-to'), 10) === e.to;
      btn.classList.toggle('active', on);
      if (on) { btn.setAttribute('aria-current', 'true'); } else { btn.removeAttribute('aria-current'); }
    });
  });

  if (reduce || !('IntersectionObserver' in window)) { return; }

  var targets = document.querySelectorAll(
    '.kit-section__head, .hs-head, .landing-head, .service-card, .kit-product, .kit-cat, .hs-trust__item, .hs-review, .hs-about > .container > *, .hs-contact > .container > *, .kit-appt-band .container > *, .kit-gym-band .container > *'
  );
  if (!targets.length) { return; }

  root.classList.add('kit-js');
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); }
    });
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });

  targets.forEach(function (el, i) {
    el.setAttribute('data-kit-reveal', '');
    // Escalonado dentro de una misma fila/lista (0..5), para que las tarjetas entren una tras otra.
    var siblings = el.parentElement ? Array.prototype.indexOf.call(el.parentElement.children, el) : 0;
    el.style.setProperty('--kit-i', Math.min(siblings, 5));
    io.observe(el);
  });
})();

/* Capa de menú de pantalla completa (encabezado «minimal»): abre/cierra con los botones [data-kit-menu-toggle] y con Escape. */
(function () {
  var overlay = document.getElementById('kitOverlay');
  if (!overlay) { return; }
  var toggles = document.querySelectorAll('[data-kit-menu-toggle]');
  function set(open) {
    overlay.classList.toggle('is-open', open);
    overlay.setAttribute('aria-hidden', open ? 'false' : 'true');
    document.body.style.overflow = open ? 'hidden' : '';
    toggles.forEach(function (b) { b.setAttribute('aria-expanded', open ? 'true' : 'false'); });
  }
  toggles.forEach(function (b) { b.addEventListener('click', function () { set(!overlay.classList.contains('is-open')); }); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') { set(false); } });
  overlay.addEventListener('click', function (e) { if (e.target.closest('a')) { set(false); } });
})();
