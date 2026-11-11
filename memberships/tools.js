// Calculadoras fitness del gimnasio. Las fórmulas son funciones puras (window.GymTools) para poder probarlas; abajo se conectan a la página.
// Son estimaciones orientativas: no reemplazan el consejo de un profesional de la salud.
(function () {
  'use strict';

  var round = function (n, d) { var f = Math.pow(10, d || 0); return Math.round(n * f) / f; };

  var T = {
    // Índice de masa corporal (kg/m²).
    bmi: function (kg, cm) { return round(kg / Math.pow(cm / 100, 2), 1); },
    // OMS: <18.5 bajo peso, <25 normal, <30 sobrepeso, >=30 obesidad.
    bmiCategory: function (bmi) { return bmi < 18.5 ? 'under' : bmi < 25 ? 'normal' : bmi < 30 ? 'over' : 'obese'; },
    // Tasa metabólica basal, Mifflin-St Jeor.
    bmr: function (sex, kg, cm, age) { return Math.round(10 * kg + 6.25 * cm - 5 * age + (sex === 'male' ? 5 : -161)); },
    tdee: function (bmr, factor) { return Math.round(bmr * factor); },
    // Reparto de calorías en macronutrientes (4 kcal/g carbohidrato y proteína, 9 kcal/g grasa).
    macros: function (kcal, goal) {
      var split = { balanced: [0.40, 0.30, 0.30], lose: [0.35, 0.40, 0.25], gain: [0.50, 0.25, 0.25] }[goal] || [0.40, 0.30, 0.30];
      return { carbs: round(kcal * split[0] / 4, 0), protein: round(kcal * split[1] / 4, 0), fat: round(kcal * split[2] / 9, 0) };
    },
    // Peso ideal, fórmula de Devine (estatura en pulgadas sobre 5 pies).
    idealWeight: function (sex, cm) { var over = Math.max(0, cm / 2.54 - 60); return round((sex === 'male' ? 50 : 45.5) + 2.3 * over, 1); },
    // % de grasa, método de la Marina de EE. UU. (medidas en cm).
    bodyFat: function (sex, cm, neck, waist, hip) {
      var v = sex === 'male'
        ? 495 / (1.0324 - 0.19077 * Math.log10(waist - neck) + 0.15456 * Math.log10(cm)) - 450
        : 495 / (1.29579 - 0.35004 * Math.log10(waist + hip - neck) + 0.22100 * Math.log10(cm)) - 450;
      return round(v, 1);
    },
    // Agua diaria: 35 ml por kg + 500 ml por hora de ejercicio.
    water: function (kg, exerciseMinutes) { return Math.round(kg * 35 + (exerciseMinutes || 0) / 60 * 500); },
    hrMax: function (age) { return 220 - age; },
    // Zonas por % de la frecuencia máxima: 50-60, 60-70, 70-80, 80-90, 90-100.
    hrZones: function (age) {
      var max = 220 - age;
      return [[50, 60], [60, 70], [70, 80], [80, 90], [90, 100]].map(function (z) { return [Math.round(max * z[0] / 100), Math.round(max * z[1] / 100)]; });
    },
    // 1RM estimado: promedio de Epley y Brzycki (fiable hasta ~10-12 repeticiones).
    oneRepMax: function (kg, reps) {
      if (reps <= 1) { return round(kg, 1); }
      var epley = kg * (1 + reps / 30);
      var brzycki = reps < 37 ? kg * 36 / (37 - reps) : epley;
      return round((epley + brzycki) / 2, 1);
    },
    // Discos por lado para llegar al peso objetivo con una barra, con el juego estándar de discos (kg). Voraz; `rest` es lo que no se logra cubrir.
    plates: function (target, bar, available) {
      available = available || [25, 20, 15, 10, 5, 2.5, 1.25];
      var perSide = (target - bar) / 2, used = [];
      if (perSide <= 0) { return { plates: used, rest: 0 }; }
      available.forEach(function (p) { while (perSide + 1e-9 >= p) { used.push(p); perSide = round(perSide - p, 2); } });
      return { plates: used, rest: round(perSide * 2, 2) };
    }
  };
  window.GymTools = T;

  // ---- conexión con la página ----
  var $ = function (id) { return document.getElementById(id); };
  var out = function (name, value) { document.querySelectorAll('[data-out="' + name + '"]').forEach(function (el) { el.textContent = value; }); };
  var num = function (id) { var v = parseFloat($(id) && $(id).value); return isFinite(v) ? v : null; };
  var val = function (id) { return $(id) ? $(id).value : ''; };
  var i18n = window.GYM_TOOLS_I18N || {};
  var ready = function () { return Array.prototype.every.call(arguments, function (v) { return v !== null && v > 0; }); };

  function bind(ids, fn) {
    ids.forEach(function (id) { var el = $(id); if (el) { el.addEventListener('input', fn); el.addEventListener('change', fn); } });
    fn();
  }

  bind(['bmi-weight', 'bmi-height'], function () {
    var kg = num('bmi-weight'), cm = num('bmi-height');
    if (!ready(kg, cm)) { out('bmi', '—'); out('bmi-category', ''); return; }
    var bmi = T.bmi(kg, cm);
    out('bmi', bmi.toFixed(1)); out('bmi-category', (i18n.bmi || {})[T.bmiCategory(bmi)] || '');
  });

  bind(['tdee-sex', 'tdee-age', 'tdee-weight', 'tdee-height', 'tdee-activity'], function () {
    var age = num('tdee-age'), kg = num('tdee-weight'), cm = num('tdee-height');
    if (!ready(age, kg, cm)) { out('bmr', '—'); out('tdee', '—'); return; }
    var bmr = T.bmr(val('tdee-sex'), kg, cm, age);
    out('bmr', bmr); out('tdee', T.tdee(bmr, parseFloat(val('tdee-activity'))));
  });

  bind(['macros-kcal', 'macros-goal'], function () {
    var kcal = num('macros-kcal');
    if (!ready(kcal)) { out('macros-carbs', '—'); out('macros-protein', '—'); out('macros-fat', '—'); return; }
    var m = T.macros(kcal, val('macros-goal'));
    out('macros-carbs', m.carbs); out('macros-protein', m.protein); out('macros-fat', m.fat);
  });

  bind(['ideal-sex', 'ideal-height'], function () {
    var cm = num('ideal-height');
    out('ideal', ready(cm) ? T.idealWeight(val('ideal-sex'), cm).toFixed(1) : '—');
  });

  bind(['fat-sex', 'fat-height', 'fat-neck', 'fat-waist', 'fat-hip'], function () {
    var female = val('fat-sex') === 'female', cm = num('fat-height'), neck = num('fat-neck'), waist = num('fat-waist'), hip = num('fat-hip');
    if ($('fat-hip-wrap')) { $('fat-hip-wrap').hidden = !female; }
    var ok = ready(cm, neck, waist) && (female ? ready(hip) : waist > neck) && (female ? waist + hip > neck : true);
    out('fat', ok ? T.bodyFat(female ? 'female' : 'male', cm, neck, waist, hip).toFixed(1) : '—');
  });

  bind(['water-weight', 'water-minutes'], function () {
    var kg = num('water-weight');
    if (!ready(kg)) { out('water', '—'); out('water-liters', ''); return; }
    var ml = T.water(kg, num('water-minutes') || 0);
    out('water', ml); out('water-liters', '(' + (ml / 1000).toFixed(1) + ' L)');
  });

  bind(['hr-age'], function () {
    var age = num('hr-age');
    var zonesEl = document.querySelector('[data-out="hr-zones"]');
    if (!ready(age) || age > 110) { out('hr-max', '—'); if (zonesEl) { zonesEl.innerHTML = ''; } return; }
    out('hr-max', T.hrMax(age));
    if (zonesEl) {
      zonesEl.innerHTML = '';
      T.hrZones(age).forEach(function (z, i) {
        var li = document.createElement('li');
        li.textContent = ((i18n.zones || [])[i] || ('Z' + (i + 1))) + ': ' + z[0] + '–' + z[1] + ' bpm';
        zonesEl.appendChild(li);
      });
    }
  });

  bind(['rm-weight', 'rm-reps'], function () {
    var kg = num('rm-weight'), reps = num('rm-reps');
    out('rm', ready(kg, reps) && reps <= 12 ? T.oneRepMax(kg, reps).toFixed(1) : '—');
  });

  bind(['plates-target', 'plates-bar'], function () {
    var target = num('plates-target'), bar = num('plates-bar');
    if (!ready(target) || bar === null || target <= bar) { out('plates', '—'); return; }
    var r = T.plates(target, bar);
    out('plates', r.plates.length ? r.plates.join(' + ') + (r.rest ? ' (+' + r.rest + ' kg sin cubrir)' : '') : '—');
  });

  // Temporizador por intervalos (trabajo / descanso × rondas).
  var timer = null;
  function stopTimer() { if (timer) { clearInterval(timer); timer = null; } }
  function startTimer() {
    stopTimer();
    var work = Math.max(1, Math.round(num('timer-work') || 30)), rest = Math.max(0, Math.round(num('timer-rest') || 0)), rounds = Math.max(1, Math.round(num('timer-rounds') || 1));
    var round_ = 1, phase = 'work', left = work, tr = i18n.timer || {};
    var fmt = function (s) { return ('0' + Math.floor(s / 60)).slice(-2) + ':' + ('0' + (s % 60)).slice(-2); };
    var paint = function () { out('timer-phase', tr[phase] || phase); out('timer-clock', fmt(left)); out('timer-round', (tr.round || '') + ' ' + round_ + '/' + rounds); };
    paint();
    timer = setInterval(function () {
      left -= 1;
      if (left <= 0) {
        if (phase === 'work' && rest > 0) { phase = 'rest'; left = rest; }
        else if (round_ >= rounds) { stopTimer(); out('timer-phase', tr.done || ''); out('timer-clock', '00:00'); return; }
        else { round_ += 1; phase = 'work'; left = work; }
      }
      paint();
    }, 1000);
  }
  if ($('timer-start')) { $('timer-start').addEventListener('click', startTimer); }
  if ($('timer-stop')) { $('timer-stop').addEventListener('click', function () { stopTimer(); out('timer-phase', '—'); out('timer-clock', '00:00'); out('timer-round', ''); }); }
}());
