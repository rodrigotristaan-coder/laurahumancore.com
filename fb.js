/* ============================================================================
   fb.js — "Señalar y anotar" · herramienta interna de feedback visual
   ----------------------------------------------------------------------------
   Para qué: en vez de describirle a Claude "el cuadro azul de la diapo 6",
   le das clic al elemento y esto te copia el SELECTOR exacto + el texto actual
   + tu nota, listo para pegar en el chat.

   Cómo se enciende: agrega ?fb=1 a cualquier URL del sitio.
     https://laurahumancore.com/?fb=1
     https://laurahumancore.com/presentaciones/propuesta-integra?fb=1

   Reglas que respeta:
   · Sin dependencias, sin build, un solo archivo (como todo este repo).
   · Nada de terceros: mismo origen, así que NO toca la CSP.
   · No se carga para visitantes normales: el loader de cada página solo lo
     inyecta si viene ?fb=1.
   · La UI vive en un shadow DOM para que el CSS del sitio no se le meta
     (y para que ella no le ensucie estilos al sitio).

   Modos:
     SEÑALAR  → clic en un elemento = nota con su selector.
     TEXTO    → clic en un elemento = lo editas ahí mismo; guarda "antes → después".
     CONGELAR → pausa animaciones, transiciones y videos (para cachar un estado).

   API para depurar desde la consola: window.__fb
   ========================================================================== */
(function () {
  'use strict';
  if (window.__fb) return;                       /* ya estaba cargado */

  var NAVY = '#002060', DEEP = '#001233', GOLD = '#c2a36b', CREMA = '#f7f3ec';
  var LLAVE = 'fb:' + location.pathname;         /* las notas se guardan por página */

  /* ---------------------------------------------------------------- estado */
  var notas = [];
  try { notas = JSON.parse(localStorage.getItem(LLAVE) || '[]'); } catch (e) { notas = []; }
  var modo = null;                               /* null | 'señalar' | 'texto' */
  var congelado = false;
  var editando = null;                           /* elemento en edición de texto */
  var textoPrevio = '';

  function guarda() {
    try { localStorage.setItem(LLAVE, JSON.stringify(notas)); } catch (e) {}
    pinta();
  }

  /* ------------------------------------------------- selector de un elemento
     Corto y estable: si hay id, se usa. Si no, se arma la ruta con etiqueta +
     hasta dos clases, ignorando las que pone el JS al animar (.in, .act), y al
     final se RECORTA por la izquierda hasta el trozo más corto que siga
     apuntando a un solo elemento (`.lado.hc .pero` en vez de la ruta completa). */
  /* La unicidad se mide DENTRO de la diapositiva o sección, no en toda la página:
     el deck repite `.fila .c .v` en varias diapos, pero como la nota ya dice
     "Diapo 08", basta con que el selector sea único ahí adentro. */
  function ambito(el) {
    return (el.closest && el.closest('.slide, section[id], header[id]')) || document;
  }
  function unico(sel, el) {
    try { var l = ambito(el).querySelectorAll(sel); return l.length === 1 && l[0] === el; }
    catch (e) { return false; }
  }
  function selectorDe(el) {
    if (!el || el.nodeType !== 1) return '';
    if (el.id) return '#' + el.id;
    /* dos rutas: la "simple" (bonita) y la "precisa" (con :nth-of-type en cada
       nivel, para cuando hay hermanos idénticos: filas de precio, tarjetas…) */
    var simple = [], preciso = [], cur = el, saltos = 0;
    while (cur && cur.nodeType === 1 && saltos < 4) {
      if (cur.id) { simple.unshift('#' + cur.id); preciso.unshift('#' + cur.id); break; }
      var clases = (cur.getAttribute('class') || '').trim().split(/\s+/)
        .filter(function (c) { return c && c !== 'in' && c !== 'act'; }).slice(0, 2);
      var base = cur.tagName.toLowerCase() + (clases.length ? '.' + clases.join('.') : '');
      var padre = cur.parentElement, nth = '';
      if (padre) {
        var iguales = Array.prototype.filter.call(padre.children, function (h) {
          return h.tagName === cur.tagName;
        });
        if (iguales.length > 1) nth = ':nth-of-type(' + (iguales.indexOf(cur) + 1) + ')';
      }
      simple.unshift(base + (clases.length ? '' : nth));
      preciso.unshift(base + nth);
      cur = cur.parentElement; saltos++;
    }
    /* del más corto al más largo, primero la bonita: gana el primero que apunte
       a un solo elemento dentro de su diapositiva/sección */
    var amb = ambito(el);
    var prefijo = (amb && amb.id) ? '#' + amb.id + ' ' : '';   /* para pegarlo tal cual en devtools */
    for (var v = 0; v < 2; v++) {
      var arr = v === 0 ? simple : preciso;
      for (var i = arr.length - 1; i >= 0; i--) {
        var cand = arr.slice(i).join(' ');
        if (unico(cand, el)) return prefijo + cand;
      }
    }
    return prefijo + preciso.join(' > ');
  }

  /* --------------------------------------------- en qué diapo / sección va */
  function contextoDe(el) {
    if (!el.closest) return '';
    var d = el.closest('.slide');
    if (d) {
      var num = d.querySelector('.num');
      return 'Diapo ' + (num ? num.textContent.trim() : '?') +
             (d.getAttribute('data-t') ? ' · ' + d.getAttribute('data-t') : '');
    }
    var s = el.closest('section[id], header[id], .sec[id]');
    if (s) return 'Sección #' + s.id;
    return '';
  }

  function textoDe(el) {
    return (el.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 160);
  }

  /* ------------------------------------------------------------------ UI */
  var host = document.createElement('div');
  host.id = 'fb-host';
  host.style.cssText = 'all:initial;position:fixed;z-index:2147483647;inset:auto 0 0 auto;';
  document.body.appendChild(host);
  var raiz = host.attachShadow ? host.attachShadow({ mode: 'open' }) : host;

  var css = document.createElement('style');
  css.textContent = [
    ':host,*{box-sizing:border-box;}',
    '.panel{position:fixed;right:18px;bottom:18px;width:330px;max-width:calc(100vw - 24px);',
    '  background:' + DEEP + ';color:rgba(255,255,255,.9);border-radius:22px;overflow:hidden;',
    '  box-shadow:0 18px 50px rgba(0,0,0,.35);font-family:system-ui,-apple-system,Segoe UI,Roboto,sans-serif;font-size:13px;line-height:1.45;}',
    '.top{display:flex;align-items:center;gap:8px;padding:13px 15px;background:' + NAVY + ';}',
    '.top b{font-size:12px;letter-spacing:.13em;text-transform:uppercase;color:' + GOLD + ';font-weight:700;}',
    '.cnt{margin-left:auto;background:' + GOLD + ';color:' + DEEP + ';border-radius:999px;padding:2px 9px;font-weight:700;font-size:11px;}',
    '.min{background:transparent;border:0;color:rgba(255,255,255,.6);cursor:pointer;font-size:16px;line-height:1;padding:0 2px;}',
    '.body{padding:12px 15px 15px;}',
    '.btns{display:flex;flex-wrap:wrap;gap:7px;}',
    'button.b{font:inherit;font-size:11.5px;letter-spacing:.06em;text-transform:uppercase;font-weight:700;',
    '  border-radius:999px;padding:8px 13px;border:1px solid rgba(255,255,255,.28);background:transparent;color:#fff;cursor:pointer;}',
    'button.b:hover{background:rgba(255,255,255,.12);}',
    'button.b.on{background:' + GOLD + ';border-color:' + GOLD + ';color:' + DEEP + ';}',
    'button.b.oro{background:' + GOLD + ';border-color:' + GOLD + ';color:' + DEEP + ';}',
    '.ayuda{margin:10px 0 0;color:rgba(255,255,255,.55);font-size:11.5px;}',
    '.lista{margin:12px 0 0;max-height:38vh;overflow:auto;display:grid;gap:8px;}',
    '.n{background:rgba(255,255,255,.08);border-radius:14px;padding:9px 11px;position:relative;}',
    '.n .ctx{color:' + GOLD + ';font-size:10.5px;letter-spacing:.1em;text-transform:uppercase;font-weight:700;}',
    '.n .sel{font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:11px;color:rgba(255,255,255,.72);word-break:break-all;margin:3px 0;}',
    '.n .txt{color:rgba(255,255,255,.92);}',
    '.n .x{position:absolute;top:6px;right:8px;background:transparent;border:0;color:rgba(255,255,255,.45);cursor:pointer;font-size:14px;}',
    '.caja{position:fixed;z-index:2147483646;width:320px;max-width:calc(100vw - 24px);background:' + DEEP + ';border:1px solid ' + GOLD + ';',
    '  border-radius:18px;padding:13px;box-shadow:0 14px 40px rgba(0,0,0,.4);font-family:system-ui,sans-serif;font-size:13px;color:#fff;}',
    '.caja .ctx{color:' + GOLD + ';font-size:10.5px;letter-spacing:.1em;text-transform:uppercase;font-weight:700;}',
    '.caja .sel{font-family:ui-monospace,Menlo,monospace;font-size:11px;color:rgba(255,255,255,.7);word-break:break-all;margin:4px 0 8px;}',
    '.caja textarea{width:100%;height:74px;resize:vertical;border-radius:12px;border:1px solid rgba(255,255,255,.25);',
    '  background:rgba(255,255,255,.07);color:#fff;padding:8px 10px;font:inherit;}',
    '.caja .fila{display:flex;gap:7px;margin-top:9px;}',
    '.marca{position:fixed;pointer-events:none;z-index:2147483645;border:2px solid ' + GOLD + ';border-radius:8px;',
    '  background:rgba(194,163,107,.14);transition:all .06s linear;display:none;}',
    '.tip{position:fixed;pointer-events:none;z-index:2147483645;background:' + DEEP + ';color:' + GOLD + ';',
    '  font-family:ui-monospace,Menlo,monospace;font-size:11px;padding:3px 7px;border-radius:7px;display:none;max-width:60vw;',
    '  overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}',
    '.mini{position:fixed;right:18px;bottom:18px;background:' + GOLD + ';color:' + DEEP + ';border:0;border-radius:999px;',
    '  padding:11px 16px;font:700 12px/1 system-ui;letter-spacing:.1em;text-transform:uppercase;cursor:pointer;box-shadow:0 10px 30px rgba(0,0,0,.3);}'
  ].join('\n');
  raiz.appendChild(css);

  var marca = document.createElement('div'); marca.className = 'marca'; raiz.appendChild(marca);
  var tip = document.createElement('div'); tip.className = 'tip'; raiz.appendChild(tip);
  var panel = document.createElement('div'); panel.className = 'panel'; raiz.appendChild(panel);
  var mini = document.createElement('button'); mini.className = 'mini'; mini.textContent = 'Notas';
  mini.style.display = 'none'; raiz.appendChild(mini);
  var caja = null;

  mini.addEventListener('click', function () {
    panel.style.display = ''; mini.style.display = 'none';
  });

  function pinta() {
    panel.innerHTML = '';
    var top = document.createElement('div'); top.className = 'top';
    top.innerHTML = '<b>Señalar y anotar</b><span class="cnt">' + notas.length + '</span>';
    var cerrar = document.createElement('button'); cerrar.className = 'min'; cerrar.textContent = '–';
    cerrar.title = 'Minimizar';
    cerrar.addEventListener('click', function () { panel.style.display = 'none'; mini.style.display = ''; });
    top.appendChild(cerrar);
    panel.appendChild(top);

    var body = document.createElement('div'); body.className = 'body';
    var btns = document.createElement('div'); btns.className = 'btns';

    btns.appendChild(boton('Señalar', modo === 'señalar', function () { setModo(modo === 'señalar' ? null : 'señalar'); }));
    btns.appendChild(boton('Texto', modo === 'texto', function () { setModo(modo === 'texto' ? null : 'texto'); }));
    btns.appendChild(boton('Congelar', congelado, congelar));
    body.appendChild(btns);

    var btns2 = document.createElement('div'); btns2.className = 'btns'; btns2.style.marginTop = '7px';
    var bc = boton('Copiar todo', false, copiar); bc.classList.add('oro'); btns2.appendChild(bc);
    btns2.appendChild(boton('Limpiar', false, function () {
      if (notas.length && confirm('¿Borrar las ' + notas.length + ' notas de esta página?')) { notas = []; guarda(); }
    }));
    body.appendChild(btns2);

    var ayuda = document.createElement('p'); ayuda.className = 'ayuda';
    ayuda.textContent = modo === 'señalar' ? 'Dale clic a cualquier elemento. Esc para salir.'
      : modo === 'texto' ? 'Clic en un texto para editarlo ahí mismo. Esc para salir.'
      : 'Elige un modo y empieza a marcar.';
    body.appendChild(ayuda);

    var lista = document.createElement('div'); lista.className = 'lista';
    notas.forEach(function (n, i) {
      var d = document.createElement('div'); d.className = 'n';
      var html = '';
      if (n.ctx) html += '<div class="ctx">' + esc(n.ctx) + '</div>';
      html += '<div class="sel">' + esc(n.sel) + '</div>';
      if (n.tipo === 'texto') html += '<div class="txt">“' + esc(n.antes) + '”<br>→ “' + esc(n.despues) + '”</div>';
      else html += '<div class="txt">' + esc(n.nota || '(sin nota)') + '</div>';
      d.innerHTML = html;
      var x = document.createElement('button'); x.className = 'x'; x.textContent = '×'; x.title = 'Borrar';
      x.addEventListener('click', function () { notas.splice(i, 1); guarda(); });
      d.appendChild(x);
      lista.appendChild(d);
    });
    body.appendChild(lista);
    panel.appendChild(body);
  }

  function boton(txt, activo, fn) {
    var b = document.createElement('button');
    b.className = 'b' + (activo ? ' on' : ''); b.textContent = txt;
    b.addEventListener('click', fn);
    return b;
  }
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
    });
  }

  /* --------------------------------------------------------------- modos */
  function setModo(m) {
    modo = m;
    if (m !== 'texto' && editando) cierraEdicion();
    marca.style.display = 'none'; tip.style.display = 'none';
    document.documentElement.style.cursor = m ? 'crosshair' : '';
    pinta();
  }

  function propio(ev) {                            /* ¿el evento nació en mi UI? */
    var p = ev.composedPath ? ev.composedPath() : [];
    return p.indexOf(host) !== -1 || (caja && p.indexOf(caja) !== -1);
  }

  var pendiente = false, ultimo = null;
  document.addEventListener('mousemove', function (ev) {
    if (!modo || propio(ev)) return;
    ultimo = ev.target;
    if (pendiente) return;
    pendiente = true;
    requestAnimationFrame(function () {
      pendiente = false;
      if (!ultimo || !ultimo.getBoundingClientRect) return;
      var r = ultimo.getBoundingClientRect();
      marca.style.display = 'block';
      marca.style.left = r.left + 'px'; marca.style.top = r.top + 'px';
      marca.style.width = r.width + 'px'; marca.style.height = r.height + 'px';
      tip.style.display = 'block';
      tip.textContent = selectorDe(ultimo);
      tip.style.left = r.left + 'px';
      tip.style.top = (r.top > 26 ? r.top - 22 : r.bottom + 6) + 'px';
    });
  }, true);

  document.addEventListener('click', function (ev) {
    if (!modo || propio(ev)) return;
    ev.preventDefault(); ev.stopPropagation();
    if (modo === 'señalar') abreCaja(ev.target);
    else abreEdicion(ev.target);
  }, true);

  document.addEventListener('keydown', function (ev) {
    if (ev.key === 'Escape') { if (caja) cierraCaja(); setModo(null); return; }
    /* mientras se escribe, que las flechas no naveguen el deck */
    var t = ev.target;
    if (editando || (t && (t.tagName === 'TEXTAREA' || t.tagName === 'INPUT' || t.isContentEditable))) ev.stopPropagation();
  }, true);

  /* ------------------------------------------------------ nota con selector */
  function abreCaja(el) {
    cierraCaja();
    var sel = selectorDe(el), ctx = contextoDe(el), txt = textoDe(el);
    caja = document.createElement('div'); caja.className = 'caja';
    caja.innerHTML = (ctx ? '<div class="ctx">' + esc(ctx) + '</div>' : '') +
      '<div class="sel">' + esc(sel) + '</div>' +
      (txt ? '<div style="color:rgba(255,255,255,.6);font-size:11.5px;margin-bottom:7px">“' + esc(txt.slice(0, 90)) + '”</div>' : '');
    var ta = document.createElement('textarea'); ta.placeholder = 'Qué le cambio…';
    caja.appendChild(ta);
    var fila = document.createElement('div'); fila.className = 'fila';
    var ok = boton('Guardar', false, function () {
      notas.push({ tipo: 'nota', ctx: ctx, sel: sel, texto: txt, nota: ta.value.trim() });
      guarda(); cierraCaja();
    });
    ok.classList.add('oro');
    fila.appendChild(ok);
    fila.appendChild(boton('Cancelar', false, cierraCaja));
    caja.appendChild(fila);
    raiz.appendChild(caja);
    var r = el.getBoundingClientRect();
    caja.style.left = Math.min(Math.max(8, r.left), window.innerWidth - 330) + 'px';
    caja.style.top = Math.min(Math.max(8, r.bottom + 8), window.innerHeight - 220) + 'px';
    ta.focus();
  }
  function cierraCaja() { if (caja && caja.parentNode) caja.parentNode.removeChild(caja); caja = null; }

  /* --------------------------------------------------- edición de texto vivo */
  function abreEdicion(el) {
    if (editando) cierraEdicion();
    editando = el; textoPrevio = el.textContent;
    el.setAttribute('contenteditable', 'true');
    el.focus();
    el.addEventListener('blur', cierraEdicion, { once: true });
  }
  function cierraEdicion() {
    if (!editando) return;
    var el = editando; editando = null;
    el.removeAttribute('contenteditable');
    var antes = textoPrevio.trim().replace(/\s+/g, ' ');
    var despues = el.textContent.trim().replace(/\s+/g, ' ');
    if (antes !== despues) {
      notas.push({ tipo: 'texto', ctx: contextoDe(el), sel: selectorDe(el), antes: antes, despues: despues });
      guarda();
    }
  }

  /* ------------------------------------------------------------- congelar */
  var estiloFreeze = null;
  function congelar() {
    congelado = !congelado;
    if (congelado) {
      estiloFreeze = document.createElement('style');
      estiloFreeze.textContent = '*,*::before,*::after{animation-play-state:paused !important;' +
        'transition:none !important;}';
      document.head.appendChild(estiloFreeze);
      document.querySelectorAll('video').forEach(function (v) { try { v.pause(); } catch (e) {} });
    } else if (estiloFreeze) {
      estiloFreeze.remove(); estiloFreeze = null;
      document.querySelectorAll('video').forEach(function (v) { try { v.play(); } catch (e) {} });
    }
    pinta();
  }

  /* --------------------------------------------------- markdown para pegar */
  function markdown() {
    if (!notas.length) return '';
    var f = new Date();
    var dd = f.getDate() + '-' + ['ene','feb','mar','abr','may','jun','jul','ago','sep','oct','nov','dic'][f.getMonth()] +
             ' ' + String(f.getHours()).padStart(2, '0') + ':' + String(f.getMinutes()).padStart(2, '0');
    var out = ['## Notas — ' + location.pathname + '  _(' + dd + ')_', ''];
    notas.forEach(function (n, i) {
      var cab = '**' + (i + 1) + '.' + (n.ctx ? ' ' + n.ctx : '') + '** — `' + n.sel + '`';
      out.push(cab);
      if (n.tipo === 'texto') out.push('   - Texto: "' + n.antes + '" → **"' + n.despues + '"**');
      else {
        if (n.texto) out.push('   - Dice: "' + n.texto + '"');
        out.push('   - Cambio: ' + (n.nota || '(pendiente de escribir)'));
      }
      out.push('');
    });
    return out.join('\n');
  }

  function copiar() {
    var md = markdown();
    if (!md) { alert('No hay notas todavía.'); return; }
    function ok() { var b = panel.querySelector('.oro'); if (b) { var t = b.textContent; b.textContent = '¡Copiado!'; setTimeout(function () { b.textContent = t; }, 1400); } }
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(md).then(ok, function () { fallback(md, ok); });
    } else fallback(md, ok);
  }
  function fallback(md, ok) {
    var ta = document.createElement('textarea');
    ta.value = md; ta.style.cssText = 'position:fixed;opacity:0;';
    document.body.appendChild(ta); ta.select();
    try { document.execCommand('copy'); ok(); } catch (e) { prompt('Copia esto:', md); }
    ta.remove();
  }

  /* ------------------------------------------------------- API / arranque */
  window.__fb = {
    notas: function () { return notas; },
    markdown: markdown,
    modo: setModo,
    anota: function (el, nota) {           /* para probar sin mouse */
      notas.push({ tipo: 'nota', ctx: contextoDe(el), sel: selectorDe(el), texto: textoDe(el), nota: nota });
      guarda();
    },
    selector: selectorDe,
    limpia: function () { notas = []; guarda(); }
  };

  pinta();
})();
