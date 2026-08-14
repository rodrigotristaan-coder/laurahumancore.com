// Límite de peticiones en memoria, por instancia de función. Vercel (Fluid
// Compute) reutiliza instancias, así que aguanta el caso real de abuso simple;
// un ataque distribuido entre instancias lo diluye, pero el peor caso de estos
// endpoints sigue siendo un correo de más, no una intrusión.
'use strict';
const ventanas = new Map();

function permite(clave, max, ventanaMs) {
  const ahora = Date.now();
  if (ventanas.size > 5000) {
    for (const par of ventanas) { if (ahora - par[1].inicio > ventanaMs) ventanas.delete(par[0]); }
  }
  let v = ventanas.get(clave);
  if (!v || ahora - v.inicio > ventanaMs) { v = { inicio: ahora, n: 0 }; ventanas.set(clave, v); }
  v.n += 1;
  return v.n <= max;
}

function ip(req) {
  return String(req.headers['x-forwarded-for'] || '').split(',')[0].trim() || 'sin-ip';
}

module.exports = { permite, ip };
