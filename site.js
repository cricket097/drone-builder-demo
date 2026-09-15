/* Страница для магазинов: запуск демо-конструктора и подпись под корзиной. */
(function () {
  /* Скриншоты кабинета: клик — крупно поверх страницы, Esc или клик по фону — закрыть */
  var lb = document.getElementById('lightbox'), lbImg = document.getElementById('lightbox-img');
  var lastFocus = null;
  function openLb(src, alt) { lbImg.src = src; lbImg.alt = alt || ''; lb.hidden = false; document.body.style.overflow = 'hidden'; document.getElementById('lightbox-close').focus(); }
  function closeLb() { lb.hidden = true; lbImg.src = ''; document.body.style.overflow = ''; if (lastFocus) lastFocus.focus(); }
  document.querySelectorAll('.shots .zoom').forEach(function (a) {
    a.addEventListener('click', function (e) { e.preventDefault(); lastFocus = a; openLb(a.getAttribute('href'), a.querySelector('img').alt); });
  });
  lb.addEventListener('click', function (e) { if (e.target !== lbImg) closeLb(); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !lb.hidden) closeLb(); });

  var status = document.getElementById('engine-status');
  var fill = document.getElementById('engine-fill');
  var stage = document.getElementById('engine-stage');
  var timeEl = document.getElementById('engine-time');
  var cartNote = document.getElementById('cart-note');
  var cartSummary = document.getElementById('cart-summary');

  window.addEventListener('dronebuilder:add-to-cart', function (e) {
    var d = e.detail || {};
    var count = (d.items || []).reduce(function (s, i) { return s + (i.qty || 1); }, 0);
    var total = typeof d.total === 'number' ? d.total.toLocaleString('ru-RU') + ' ' + (d.currency || '₽') : '';
    cartSummary.textContent = count + ' позиций' + (total ? ' на ' + total : '');
    cartNote.hidden = false;
    cartNote.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  });

  if (!window.DroneBuilderStatic) {
    status.className = 'engine-status error';
    stage.textContent = 'Демо не загрузилось. Обновите страницу.';
    timeEl.textContent = '';
    return;
  }

  var inst = window.DroneBuilderStatic.init({
    container: '#drone-builder',
    catalogUrl: 'data/demo_catalog.json',
    wheelUrl: 'engine/drone_engine-0.1.0-py3-none-any.whl',
    tenantName: 'Demo FPV Shop',
    theme: { primaryColor: '#025aff', secondaryColor: '#242b39', font: '"Manrope", "Gilroy", system-ui, sans-serif' },
    onProgress: function (s, pct) {
      if (typeof pct === 'number') fill.style.width = pct + '%';
      if (pct === 100) {
        status.className = 'engine-status ready';
        stage.textContent = 'Готово — можно собирать';
        timeEl.textContent = '';
      } else {
        stage.textContent = 'Загружаем каталог и правила проверки…';
      }
    },
  });
  inst.client.ensureEngine().catch(function () {
    status.className = 'engine-status error';
    stage.textContent = 'Демо не загрузилось. Обновите страницу.';
    timeEl.textContent = '';
  });
  window.__dronebuilder = inst;
})();
