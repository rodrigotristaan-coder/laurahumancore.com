// GET ?t=<token> → valida el enlace mágico y deja la cookie de sesión (30 días).
'use strict';
const { leeToken, emailsPermitidos, cookieSesion } = require('./_auth');
const { permite, ip } = require('./_ratelimit');

module.exports = function (req, res) {
  res.setHeader('X-Robots-Tag', 'noindex');
  if (!permite('verify:' + ip(req), 30, 10 * 60 * 1000)) {
    res.statusCode = 429; return res.end('Demasiados intentos. Espera unos minutos.');
  }
  const url = new URL(req.url, 'https://laurahumancore.com');
  const email = leeToken(url.searchParams.get('t') || '');

  if (!email || emailsPermitidos().indexOf(email) === -1) {
    res.statusCode = 302;
    res.setHeader('Location', '/acceso?e=1');
    return res.end();
  }

  res.statusCode = 302;
  res.setHeader('Set-Cookie', cookieSesion(email));
  res.setHeader('Location', '/panel');
  res.end();
};
