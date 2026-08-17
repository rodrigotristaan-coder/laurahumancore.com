// Panel privado de Laura: /panel (rewrite en vercel.json). Solo con sesión.
// Los links viven en DATOS: para sumar una cotización o presentación nueva,
// agrega una entrada ahí y push.
'use strict';
const { leeCookieSesion } = require('./_auth');

const DATOS = [
  {
    titulo: 'Tu sitio',
    items: [
      { n: 'laurahumancore.com', d: 'Tu página pública. Cada visita puede pedir el diagnóstico desde el formulario o el cotizador.', u: 'https://laurahumancore.com' },
      { n: 'Cotizador de diagnóstico', d: 'El prospecto marca lo que le pasa y la página le recomienda cuál de tus 3 sistemas le toca. No muestra precios: el estimado te llega solo a ti dentro del lead.', u: 'https://discovery.laurahumancore.com' }
    ]
  },
  {
    titulo: 'Presentaciones de venta',
    items: [
      { n: 'HC Deck v2 · con video', d: 'La versión completa: 16 diapositivas con video de fondo. Preséntala desde este link.', u: 'https://laurahumancore.com/presentaciones/presentacion-ventas-v2' },
      { n: 'HC Deck v2 · fotos', d: 'La misma presentación sin video. Funciona también como archivo suelto para mandar por correo.', u: 'https://laurahumancore.com/presentaciones/presentacion-ventas-v2-fotos' },
      { n: 'HC Deck v1 · clásica', d: 'La primera versión, con fotos estáticas.', u: 'https://laurahumancore.com/presentaciones/presentacion-ventas' }
    ]
  },
  {
    titulo: 'Cotizaciones activas',
    items: [
      { n: 'Roberto Alarcón · Integra Engineering', d: 'Programa gerencial para mandos medios (3 meses) para sus 5 gerentes: 9 diapositivas con tu CV, el reto, el método de 3 fases y la tarifa por número de gerentes. Link exclusivo, no aparece en buscadores.', u: 'https://laurahumancore.com/presentaciones/propuesta-integra' }
    ]
  },
  {
    titulo: 'Tu correo y tus leads',
    items: [
      { n: 'contacto@laurahumancore.com', d: 'Tu correo público. Todo lo que llega ahí se reenvía a tu Gmail.', u: 'mailto:contacto@laurahumancore.com' },
      { n: '¿Cómo te llegan los leads?', d: 'Cada formulario enviado (del sitio o del cotizador) te llega al instante por tres vías: aviso a tu correo, mensaje al grupo de Telegram “Laura Human Core Leads” y una fila nueva en tu Excel de leads en OneDrive.' }
    ]
  },
  {
    titulo: 'Soporte',
    items: [
      { n: 'Satori Agency', d: '¿Necesitas cambiar algo del sitio, una cotización nueva o tienes un problema? Escríbenos.', u: 'mailto:hola@satorimkt.com' }
    ]
  }
];

function html() {
  const secciones = DATOS.map(function (s) {
    const items = s.items.map(function (it) {
      const enlace = it.u
        ? '<a class="lnk" href="' + it.u + '" target="_blank" rel="noopener">' +
          (it.u.indexOf('mailto:') === 0 ? it.u.replace('mailto:', '') : 'Abrir →') + '</a>'
        : '';
      return '<div class="item"><div class="tx"><h3>' + it.n + '</h3><p>' + it.d + '</p></div>' + enlace + '</div>';
    }).join('');
    return '<section class="bloque"><h2>' + s.titulo + '</h2>' + items + '</section>';
  }).join('');

  return '<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8" />' +
    '<meta name="viewport" content="width=device-width, initial-scale=1.0" />' +
    '<meta name="robots" content="noindex" /><title>Tu panel — HUMAN-CORE System</title>' +
    '<link rel="icon" type="image/png" href="/assets/favicon.png" />' +
    '<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@600;700&family=Mulish:wght@400;600;700&family=Archivo:wght@600;700&display=swap" />' +
    '<style>' +
    ':root{--navy:#002060;--navy-deep:#001233;--gold:#c2a36b;--gold-deep:#a8854c;--cream:#f7f3ec;--ink:#111a30;--body:#414961;--taupe:#857c6c;--line:#e6dfd1;--r-lg:30px;--r-md:22px;--r-pill:999px;}' +
    '*{box-sizing:border-box;min-width:0}body{margin:0;background:var(--cream);font-family:Mulish,system-ui,sans-serif;color:var(--body);font-size:17px;line-height:1.6;-webkit-font-smoothing:antialiased}' +
    'h1,h2,h3{font-family:"Cormorant Garamond",Georgia,serif;color:var(--ink);margin:0;font-style:normal;font-weight:700}' +
    '.top{background:var(--navy);border-radius:0 0 var(--r-lg) var(--r-lg);padding:34px 0 46px}' +
    '.wrap{max-width:880px;margin:0 auto;padding:0 24px}' +
    '.top .fila{display:flex;align-items:center;justify-content:space-between;gap:16px}' +
    '.marca{display:flex;align-items:center;gap:12px;color:#fff}.marca img{width:36px;display:block}' +
    '.marca span{font-family:Archivo,sans-serif;font-size:10px;letter-spacing:.2em;text-transform:uppercase;font-weight:600;color:rgba(255,255,255,.7)}' +
    '.salir{font-family:Archivo,sans-serif;font-size:10.5px;letter-spacing:.14em;text-transform:uppercase;font-weight:700;color:#fff;text-decoration:none;border:1px solid rgba(255,255,255,.35);border-radius:var(--r-pill);padding:9px 18px}' +
    '.salir:hover{background:rgba(255,255,255,.12)}' +
    '.top h1{color:#fff;font-size:clamp(34px,6vw,52px);margin:26px 0 6px}.top h1 b{color:var(--gold);font-weight:700}' +
    '.top p{color:rgba(255,255,255,.75);margin:0;max-width:52ch}' +
    '.bloque{background:#fff;border:1px solid var(--line);border-radius:var(--r-lg);padding:30px 30px 12px;margin:18px 0}' +
    '.bloque h2{font-size:26px;margin:0 0 14px}' +
    '.item{display:flex;align-items:center;justify-content:space-between;gap:18px;padding:16px 0;border-top:1px solid var(--line)}' +
    '.item h3{font-size:19px;margin:0 0 3px}.item p{margin:0;font-size:14.5px;color:var(--taupe)}' +
    '.lnk{flex-shrink:0;font-family:Archivo,sans-serif;font-size:10.5px;letter-spacing:.12em;text-transform:uppercase;font-weight:700;color:#fff;background:var(--navy);border-radius:var(--r-pill);padding:11px 20px;text-decoration:none;white-space:nowrap}' +
    '.lnk:hover{background:#0b3179}' +
    '.pie{text-align:center;font-size:12.5px;color:var(--taupe);padding:26px 0 40px}' +
    '@media (max-width:640px){.item{flex-direction:column;align-items:flex-start}.bloque{padding:24px 20px 8px}}' +
    '</style></head><body>' +
    '<header class="top"><div class="wrap"><div class="fila">' +
    '<div class="marca"><img src="/assets/logo-white.webp" alt="" /><span>HUMAN-CORE System</span></div>' +
    '<a class="salir" href="/salir">Cerrar sesión</a></div>' +
    '<h1>Hola, <b>Laura</b></h1><p>Aquí vive todo lo tuyo: tu sitio, tus presentaciones, tus cotizaciones y cómo te llegan los leads.</p>' +
    '</div></header>' +
    '<main class="wrap">' + secciones + '</main>' +
    '<p class="pie">Panel privado · solo tú puedes ver esta página · laurahumancore.com</p>' +
    '</body></html>';
}

module.exports = function (req, res) {
  res.setHeader('X-Robots-Tag', 'noindex');
  res.setHeader('Cache-Control', 'private, no-store');
  if (!leeCookieSesion(req)) {
    res.statusCode = 302;
    res.setHeader('Location', '/acceso');
    return res.end();
  }
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.end(html());
};
