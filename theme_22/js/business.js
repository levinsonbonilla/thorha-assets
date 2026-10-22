// theme_22 (Business): comportamiento mínimo de la plantilla original, sin sus dependencias (tiny-slider/glightbox/wow).
(function () {
  var nav = document.querySelector('.navbar-area');
  var top = document.querySelector('.scroll-top');
  function onScroll() {
    var y = window.scrollY || document.documentElement.scrollTop;
    if (nav) { nav.classList.toggle('sticky', y > 20); }
    if (top) { top.style.display = y > 300 ? 'flex' : 'none'; }
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
  if (top) { top.addEventListener('click', function (e) { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }); }
  var toggler = document.querySelector('.navbar-nine .navbar-toggler');
  if (toggler) { toggler.addEventListener('click', function () { toggler.classList.toggle('active'); }); }
  var side = document.querySelector('.sidebar-left');
  var overlay = document.querySelector('.overlay-left');
  var openBtn = document.querySelector('.navbar-nine .menu-bar');
  function close() { if (side) { side.classList.remove('open'); } if (overlay) { overlay.classList.remove('open'); } }
  if (openBtn) { openBtn.addEventListener('click', function (e) { e.preventDefault(); side.classList.add('open'); overlay.classList.add('open'); }); }
  if (overlay) { overlay.addEventListener('click', close); }
  var closeBtn = document.querySelector('.sidebar-close .close');
  if (closeBtn) { closeBtn.addEventListener('click', function (e) { e.preventDefault(); close(); }); }
})();
