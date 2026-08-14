// Cierra la sesión del panel y regresa al sitio.
'use strict';
const { COOKIE_FUERA } = require('./_auth');

module.exports = function (req, res) {
  res.statusCode = 302;
  res.setHeader('Set-Cookie', COOKIE_FUERA);
  res.setHeader('Location', '/');
  res.end();
};
