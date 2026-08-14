// POST { email } → si el correo está en la whitelist, n8n manda un CÓDIGO de
// 6 dígitos por Outlook. La respuesta incluye el "reto" firmado que el
// navegador canjeará en /api/canje junto con el código tecleado — el código
// mismo solo viaja por correo. Correos desconocidos reciben un reto de
// utilería: la respuesta no revela quién tiene acceso.
'use strict';
const { creaReto, retoFalso, codigoNuevo, emailsPermitidos } = require('./_auth');
const { permite, ip } = require('./_ratelimit');

const VIDA_CODIGO_MS = 15 * 60 * 1000; // 15 minutos

module.exports = async function (req, res) {
  res.setHeader('X-Robots-Tag', 'noindex');
  if (req.method !== 'POST') { res.statusCode = 405; return res.end('Method Not Allowed'); }

  let cuerpo = req.body;
  if (typeof cuerpo === 'string') { try { cuerpo = JSON.parse(cuerpo); } catch (e) { cuerpo = {}; } }
  const email = String((cuerpo && cuerpo.email) || '').trim().toLowerCase();

  res.setHeader('Content-Type', 'application/json; charset=utf-8');

  // 10 intentos por IP cada 10 min
  if (!permite('login:' + ip(req), 10, 10 * 60 * 1000)) {
    res.statusCode = 429; return res.end(JSON.stringify({ ok: false, error: 'calma' }));
  }

  const valido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  if (!valido) { res.statusCode = 400; return res.end(JSON.stringify({ ok: false })); }

  // 3 correos por dirección cada 15 min: si se pasa, respondemos como si nada
  // (no se spamea el buzón y no se revela la whitelist)
  const dentroDeLimite = permite('mail:' + email, 3, 15 * 60 * 1000);

  let reto = retoFalso(VIDA_CODIGO_MS);
  if (dentroDeLimite && emailsPermitidos().indexOf(email) !== -1) {
    const codigo = codigoNuevo();
    reto = creaReto(email, codigo, VIDA_CODIGO_MS);
    const r = await fetch(process.env.N8N_MAGICLINK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-magic-secret': process.env.N8N_MAGICLINK_SECRET || ''
      },
      body: JSON.stringify({ email: email, code: codigo })
    }).catch(function () { return null; });
    if (!r || !r.ok) { res.statusCode = 502; return res.end(JSON.stringify({ ok: false, error: 'correo' })); }
  }

  res.statusCode = 200;
  res.end(JSON.stringify({ ok: true, reto: reto }));
};
