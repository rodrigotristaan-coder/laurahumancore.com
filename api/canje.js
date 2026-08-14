// POST { reto, codigo } → valida el código de 6 dígitos contra el reto firmado
// y deja la cookie de sesión (30 días). El navegador nunca sale de /acceso:
// al recibir ok redirige él mismo a /panel.
'use strict';
const { verificaReto, emailsPermitidos, cookieSesion } = require('./_auth');
const { permite, ip } = require('./_ratelimit');

module.exports = function (req, res) {
  res.setHeader('X-Robots-Tag', 'noindex');
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  if (req.method !== 'POST') { res.statusCode = 405; return res.end(JSON.stringify({ ok: false })); }

  // 8 canjes por IP cada 10 min: 6 dígitos aguantan de sobra ese ritmo de adivinanza
  if (!permite('canje:' + ip(req), 8, 10 * 60 * 1000)) {
    res.statusCode = 429; return res.end(JSON.stringify({ ok: false, error: 'calma' }));
  }

  let cuerpo = req.body;
  if (typeof cuerpo === 'string') { try { cuerpo = JSON.parse(cuerpo); } catch (e) { cuerpo = {}; } }
  const reto = String((cuerpo && cuerpo.reto) || '');
  const codigo = String((cuerpo && cuerpo.codigo) || '').replace(/\D/g, '');

  const email = codigo.length === 6 ? verificaReto(reto, codigo) : null;
  if (!email || emailsPermitidos().indexOf(email) === -1) {
    res.statusCode = 401; return res.end(JSON.stringify({ ok: false }));
  }

  res.statusCode = 200;
  res.setHeader('Set-Cookie', cookieSesion(email));
  res.end(JSON.stringify({ ok: true }));
};
