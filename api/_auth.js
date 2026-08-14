// Utilería compartida del acceso por magic link. Los archivos con guion bajo
// NO se publican como endpoints; solo los importan login/verify/panel/salir.
// Secretos y whitelist viven en variables de entorno de Vercel, nunca aquí.
'use strict';
const crypto = require('crypto');

const SECRET = process.env.MAGIC_SECRET || '';

function b64url(buf) {
  return Buffer.from(buf).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}
function fromB64url(str) {
  try { return Buffer.from(str.replace(/-/g, '+').replace(/_/g, '/'), 'base64').toString('utf8'); }
  catch (e) { return ''; }
}
function firma(payload) {
  return crypto.createHmac('sha256', SECRET).update(payload).digest('hex');
}
function igual(a, b) {
  const A = Buffer.from(String(a)), B = Buffer.from(String(b));
  return A.length === B.length && crypto.timingSafeEqual(A, B);
}

// token = base64url(email) . expiraMs . hmac(email|expira)
function creaToken(email, vidaMs) {
  const exp = Date.now() + vidaMs;
  const e = b64url(email);
  return e + '.' + exp + '.' + firma(email + '|' + exp);
}
function leeToken(token) {
  if (!SECRET || typeof token !== 'string') return null;
  const partes = token.split('.');
  if (partes.length !== 3) return null;
  const email = fromB64url(partes[0]);
  const exp = parseInt(partes[1], 10);
  if (!email || !exp || Date.now() > exp) return null;
  if (!igual(partes[2], firma(email + '|' + exp))) return null;
  return email;
}

function emailsPermitidos() {
  return (process.env.ALLOWED_EMAILS || '')
    .split(',').map(function (s) { return s.trim().toLowerCase(); }).filter(Boolean);
}

function leeCookieSesion(req) {
  const jar = req.headers.cookie || '';
  const m = jar.match(/(?:^|;\s*)hc_sesion=([^;]+)/);
  return m ? leeToken(decodeURIComponent(m[1])) : null;
}

const DIAS_SESION = 30;
function cookieSesion(email) {
  const token = creaToken(email, DIAS_SESION * 24 * 60 * 60 * 1000);
  return 'hc_sesion=' + encodeURIComponent(token) +
    '; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=' + (DIAS_SESION * 24 * 60 * 60);
}
const COOKIE_FUERA = 'hc_sesion=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0';

module.exports = { creaToken, leeToken, emailsPermitidos, leeCookieSesion, cookieSesion, COOKIE_FUERA };
