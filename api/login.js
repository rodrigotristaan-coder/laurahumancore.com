// POST { email } → si el correo está en la whitelist, n8n le manda el enlace
// mágico por Outlook. La respuesta es igual para correos desconocidos: no se
// revela quién tiene acceso.
'use strict';
const { creaToken, emailsPermitidos } = require('./_auth');

const VIDA_ENLACE_MS = 15 * 60 * 1000; // 15 minutos

module.exports = async function (req, res) {
  res.setHeader('X-Robots-Tag', 'noindex');
  if (req.method !== 'POST') { res.statusCode = 405; return res.end('Method Not Allowed'); }

  let cuerpo = req.body;
  if (typeof cuerpo === 'string') { try { cuerpo = JSON.parse(cuerpo); } catch (e) { cuerpo = {}; } }
  const email = String((cuerpo && cuerpo.email) || '').trim().toLowerCase();

  res.setHeader('Content-Type', 'application/json; charset=utf-8');

  const valido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  if (!valido) { res.statusCode = 400; return res.end(JSON.stringify({ ok: false })); }

  if (emailsPermitidos().indexOf(email) !== -1) {
    const link = 'https://laurahumancore.com/api/verify?t=' + creaToken(email, VIDA_ENLACE_MS);
    const r = await fetch(process.env.N8N_MAGICLINK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-magic-secret': process.env.N8N_MAGICLINK_SECRET || ''
      },
      body: JSON.stringify({ email: email, link: link })
    }).catch(function () { return null; });
    if (!r || !r.ok) { res.statusCode = 502; return res.end(JSON.stringify({ ok: false, error: 'correo' })); }
  }

  // misma respuesta esté o no en la lista
  res.statusCode = 200;
  res.end(JSON.stringify({ ok: true }));
};
