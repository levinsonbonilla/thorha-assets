// Medidor de fuerza y confirmación de contraseña de las pantallas de acceso con estilo de plantilla (sin jQuery/Parsley).
// El servidor sigue validando; esto solo da el aviso antes de enviar. Puntaje mínimo 3 (zxcvbn), igual que el formulario clásico.
(function () {
  document.querySelectorAll('[data-auth-form]').forEach(function (form) {
    var pass = form.querySelector('[data-auth-password]');
    var confirm = form.querySelector('[data-auth-confirm]');
    var bar = form.querySelector('[data-auth-strength]');
    var text = form.querySelector('[data-auth-strength-text]');
    if (!pass || !confirm || !bar || !text) { return; }
    var levels = [];
    try { levels = JSON.parse(text.dataset.levels || '[]'); } catch (e) { levels = []; }
    var colors = ['#c0392b', '#d35400', '#b7791f', '#2e7d32', '#1b7a5a'];

    function check() {
      var value = pass.value;
      var score = value && window.zxcvbn ? window.zxcvbn(value).score : -1;
      bar.hidden = value === '';
      if (score >= 0) {
        bar.firstElementChild.style.width = (score + 1) * 20 + '%';
        bar.firstElementChild.style.background = colors[score];
        text.textContent = levels[score] || '';
      } else {
        text.textContent = '';
      }
      pass.setCustomValidity(value && score >= 0 && score < 3 ? text.dataset.msgWeak : '');
      confirm.setCustomValidity(confirm.value && confirm.value !== value ? text.dataset.msgMismatch : '');
    }
    pass.addEventListener('input', check);
    confirm.addEventListener('input', check);
  });
}());

// Cambio de pantalla (login <-> registro <-> recuperación): el formulario sale deslizándose y la siguiente página entra igual (auth.css).
(function () {
  var panel = document.querySelector('.auth-panel');
  if (!panel || window.matchMedia('(prefers-reduced-motion: reduce)').matches) { return; }
  panel.querySelectorAll('a[href]:not([href^="#"]):not([target])').forEach(function (a) {
    a.addEventListener('click', function (e) {
      if (e.ctrlKey || e.metaKey || e.shiftKey || e.button !== 0 || a.origin !== window.location.origin) { return; }
      e.preventDefault();
      panel.classList.add('is-leaving');
      setTimeout(function () { window.location.href = a.href; }, 350);
    });
  });
}());
