# HUMAN-CORE System — Landing (contexto para Claude Code)

Landing **estática** (HTML + CSS inline, sin build, sin dependencias) de
**Laura de la Peña — HUMAN-CORE System**. EN VIVO en `laurahumancore.com`
(Vercel, push a `main` = deploy en ~15 s).

> Todo el sitio vive en un solo archivo: `index.html` (~950 líneas, CSS en un
> `<style>` dentro del `<head>` y un `<script>` al final para nav / reveals /
> acordeón / formulario). No hay framework. Edítalo directo.

---

## Estructura de archivos

```
laurahumancore.com/
├── index.html        ← TODO el sitio (HTML + CSS + JS inline)
├── presentaciones/   ← decks HTML (noindex, sin enlaces desde el sitio)
│   ├── presentacion-ventas.html          HC Deck v1 — 16 slides, fotos estáticas, énfasis de venta (autocontenida)
│   ├── presentacion-ventas-v2.html       HC Deck v2 (v2.3) — video-loop emocional por slide; los mp4 van en media/ por URL relativa
│   ├── presentacion-ventas-v2-fotos.html HC Deck v2-fotos (v2.3) — mismo look sin video, fotogramas WebP en base64 (autocontenida ~2.8 MB)
│   ├── propuesta-integra.html            deck PRIVADO de 10 diapos para Integra Engineering /
│   │                                     Roberto Alarcón (noindex, precio visible, lenguaje "mate
│   │                                     sólido"). Reveals en CASCADA por diapositiva — ver abajo.
│   ├── media/                            16 clips mp4 (Mixkit Free License) del deck v2
│   └── design-system.html                design system de decks v2.3 + web v2 (al día 5-ago)
├── assets/           (imágenes optimizadas WebP al tamaño de uso)
│   ├── logo-white.webp       logo blanco (nav)
│   ├── logo-navy-sm.webp     logo navy chico (footer)
│   ├── logo-navy.png         logo navy grande — SOLO para og:image (no borrar)
│   ├── laura-portrait{,-360}.webp  retrato circular de Laura (sección #laura)
│   ├── bg-team.webp          FONDO: siluetas de equipo (1600px, velo navy encima)
│   ├── bg-playa.webp         FONDO: playa nocturna (1600px, velo navy encima)
│   ├── logos/                21 logos de clientes recortados del muro (cinta)
│   ├── sistemas/             fotos de los 3 sistemas + fondo del problema
│   └── favicon.png
│       (17-ago: se borraron los 6 assets sin uso — logo-gold{,-sm,-mask}.webp,
│        clientes.webp, sistemas/bg-impacto.webp y sistemas/sys-cultura.webp;
│        están en el historial de git si alguna vez hacen falta)
├── vercel.json       ← static, cache de assets + headers de seguridad (CSP ENFORCED)
├── robots.txt · sitemap.xml
└── README.md         ← deploy (Vercel / GitHub)
```

---

## Design tokens (`:root` de `index.html`)

| Token | Valor | Uso |
|---|---|---|
| `--navy` / `--dark` | `#002060` | Azul marino de marca |
| `--navy-deep` / `--dark-deep` | `#001233` | Navy profundo |
| `--gold` | `#c2a36b` | Dorado — SOLO funcional (CTA, cifras, acentos) |
| `--gold-deep` | `#a8854c` | Dorado oscuro |
| `--cream` | `#f7f3ec` | Fondo del body (canal entre paneles) |
| `--line-navy` | `rgba(255,255,255,.14)` | Bordes sobre navy |
| `--r-xl/lg/md/sm/pill` | 44/30/22/14/999px | Radios — todo burbuja |

**Tipografías**: Cormorant Garamond (títulos, SIN itálicas) · Mulish (cuerpo) ·
Archivo (labels uppercase). **Reglas duras de marca:** sin itálicas, dorado solo
funcional, todo burbuja/píldora, nada rectángulo.

---

## Lenguaje visual v2 (2026-07-30, notas de Laura) — SUSTITUYE a la v1.3

La v1.3 (todo panel navy translúcido) quedó archivada. Ahora:

- **Los paneles ALTERNAN**: blanco / navy iluminado / navy. Clases `.sec.on-white`,
  `.sec.on-blue`, `.sec.on-dark`. Siguen siendo burbujas redondeadas sobre el
  crema (gaps de 12px, 8px en móvil).
- **⚠️ El azul vivo se RETIRÓ (14-ago, nota de Rodrigo)**: `--blue` ahora es el
  navy `#002060` y `--blue-bright` un navy iluminado `#0b3179`. `.on-blue` y
  `v-blue` quedaron como gradientes/velos navy (las clases conservan su nombre).
  No reintroduzcas `#1552c9`. El dorado sigue siendo funcional (CTA, medallas, acentos).
- **Énfasis por titular**: la palabra que carga el mensaje va en `.hl` (navy
  sobre claro, dorado sobre oscuro). Nunca itálicas.
- **Fotos de fondo** en problema, método, reconocimientos y contacto:
  `<div class="bg-photo ph-team|ph-playa|ph-problema v-soft|v-heavy|v-blue">`.
  `v-blue` es el velo azul (no navy) para las secciones `on-blue`.
- **Assets nuevos**: `assets/logos/*.webp` (21 marcas recortadas del muro,
  132px de alto) y `assets/sistemas/*.webp` (fotos 1600×900 sacadas del base64
  del deck v2-fotos).

## Secciones (en orden)

1. **Nav** — píldora flotante. Debajo de 600px queda solo el logo + el CTA.
2. **Hero** — centrado, fondo playa, typewriter en el H1. **Siempre 2 renglones**.
3. **Cinta de logos** — marquee infinito a color; en móvil son DOS, la de abajo en reversa.
4. **Fundadora** (`#fundadora`) — retrato, bio y línea de tiempo.
5. **El problema** (`#problema`) — navy + foto, 3 cards.
6. **Los 3 sistemas** (`#sistemas`) — BLANCO, una tarjeta con foto por sistema (ya no es acordeón).
7. **Cómo funciona** (`#metodo`) — 2 fases con temario y habilidades.
8. **Reconocimientos** (`#reconocimientos`) — premios + medios.
9. **Qué incluye** (`#incluye`) — lo que se entrega. **SIN precio.**
10. **CTA diagnóstico** (`#diagnostico`) — banda azul al cotizador.
11. **Contacto** (`#contacto`) — formulario `#cotiza`.
12. **Footer**.

⚠️ **Testimonios**: la sección existe pero está **comentada** en el HTML, esperando
citas reales. No se publican reseñas inventadas. Las instrucciones para reactivarla
están dentro del propio comentario.

⚠️ **NINGUNA página muestra precio** (30-jul). Ni la landing ni el cotizador, ni en
pantalla ni en el código fuente. La tarifa vive **solo** en el nodo `Mapear campos`
del workflow n8n `9bNX3HWo7B4mMi0d`, que arma el bloque ESTIMADO para Laura a partir
del campo `sistemas`. Si sube el precio, se cambia ahí y en ningún otro lado.

## Trampas de layout ya resueltas — no las reintroduzcas

- `.hero` es `display:flex`; su `.wrap` necesita `width:100%`. Sin eso, el
  `margin:0 auto` del wrap lo re-centra al cambiar la palabra del typewriter y
  arrastra todo el bloque de lado.
- El H1 del hero usa `clamp(34px,6.6vw,86px)`: con 42px de mínimo, "Falla la
  comunicación" se parte y el hero se va a 3 renglones en móvil.
- No reserves por JS el ancho de la palabra del typewriter: con el hero centrado
  deja un hueco visible junto a las palabras cortas.

## Comportamiento (JS inline al final)

- Progress bar, nav "scrolled", reveals con IntersectionObserver (red de
  seguridad a 4 s), typewriter del hero y cinta de logos armada por JS desde el
  array `LOGOS` (se duplica el set para que el loop no tenga costura).
  El acordeón de los 3 sistemas desapareció con la v2: ahora son tarjetas.
- **Formulario** (`#cotiza`): honeypot (`website`) → POST a
  `https://n8n.satorimkt.com/webhook/lead-humancore` (n8n → Excel + Telegram +
  Outlook). Si falla, cae a `mailto:contacto@laurahumancore.com` pre-llenado.
  En éxito dispara GA4 `generate_lead`. ⚠️ NO cambiar los `name` de los campos.
  **Selector de lada** (5-ago, array `LADAS`, 21 países, `+52` por defecto): el
  campo Teléfono es un `.telrow` con el `<select name="lada">` pegado al input.
  Va en un `<div class="field">` y no en un `<label>`: con dos controles dentro,
  el label se asocia al primero y hacer clic en "Teléfono" enfocaba la lada.
  Si no escriben teléfono, la lada viaja vacía para no dejar un "+52" suelto en Excel.
- Respeta `prefers-reduced-motion`.
- ⚠️ **Los reveals de `index.html` traen una red de seguridad GLOBAL de 4 s** (`hc-safety`): a los
  ~4.7 s de cargar revela toda la página, así que las secciones a las que se llega después aparecen
  **sin animación**. En `presentaciones/propuesta-integra.html` esto ya se corrigió (17-ago) con
  **cascada por sección**: cada bloque revela sus `[data-reveal]` en orden de DOM con retraso puesto
  por JS, disparado por IntersectionObserver + arranque al cargar + respaldo en `scroll` + un
  `setInterval` que se apaga solo; y la clase `.js` (la que esconde) se agrega **al final** de armar
  la maquinaria, para que un error deje todo visible en vez de en blanco. Falta portarlo aquí.

## Discovery (repo aparte)

`discovery.laurahumancore.com` — formulario tipo cotizador que recomienda cuál de los
3 sistemas le toca al prospecto. **Vive en `~/discovery-laurahumancore`** (proyecto
Vercel propio `discovery-laurahumancore`), no en este repo. Manda el lead al **mismo
webhook n8n** (`lead-humancore`) con `origen: discovery.laurahumancore.com`.

⚠️ **Ni el discovery ni la landing muestran precio** (28-jul el discovery, 30-jul la
landing): el prospecto ve alcance y duración, y el estimado viaja solo dentro del lead
que le llega a Laura, que es quien cierra la venta. La tarifa vive en **un solo lugar**,
el nodo `Mapear campos` de n8n; no hay `.price-card` ni constantes `PAGO`/`CONTINUIDAD`
que actualizar. Ver su `README.md`.

## Correo público

**contacto@laurahumancore.com** (reenvío Namecheap → Gmail de Laura, $0;
MX + SPF verificados). Es el correo visible en la web y en el deck.

---

## Presentaciones (`presentaciones/`)

Servidas sin `.html` y con `noindex`: `…/presentaciones/presentacion-ventas`
(v1), `…/presentacion-ventas-v2` (v2 con video), `…/presentacion-ventas-v2-fotos`
(v2 sin video, autocontenida) y `/design-system`. v1 y v2-fotos son
autocontenidas (imágenes en base64, las de fondo UNA sola vez como custom
properties en `:root`); la v2 carga sus mp4 de `presentaciones/media/` por URL
relativa (la experiencia completa es el link del dominio). Copy al día = v2.3
(2 pagos de $46,500 sin total, "Entregable" en fases, "2 meses aprox.").
Imprimir → PDF 16:9 una por página (los media queries móviles son
`@media screen and` para no colarse al PDF; `print-color-adjust:exact` para
que los fondos sobrevivan; la v2 oculta los videos e imprime la foto).

---

## Estado (al 2026-08-05)

- **GA4** `G-LKP371EQ8Q` en vivo (+ evento `generate_lead`).
- **SEO**: robots.txt + sitemap.xml; canonical/OG al dominio real.
- **Headers** en `vercel.json`: HSTS, Permissions-Policy, etc. **CSP ENFORCED**
  desde el 5-ago. Se auditó por red lo que carga el sitio: solo
  `googletagmanager`, `google-analytics`, `fonts.googleapis`, `fonts.gstatic`
  y propio. Todo lo demás (imágenes, base64, mp4 de los decks) es `'self'`/`data:`.
  Si algún día se suma un tercero (Meta Pixel, Calendly, un iframe), **hay que
  agregarlo al header o la página lo bloquea de verdad, ya no solo lo reporta.**

## Pendientes

1. **Meta Pixel**: BLOQUEADO (sin acceso a Meta). Al desbloquear: snippet antes de
   `</head>` **y** sumar `connect.facebook.net` a `script-src` y `www.facebook.com`
   a `img-src` en la CSP, que ya está enforced.
2. **Google Search Console**: alta del dominio + enviar sitemap.

---

## Convenciones para editar

- Un solo archivo: edita `index.html` directo. CSS ordenado por sección.
- Usa SIEMPRE los tokens de `:root` (no hardcodees hex nuevos).
- Mantén `data-screen-label`, `data-reveal`, `data-logo` y los `name` del formulario.
- Nada de itálicas ni dorado decorativo ("AI slop"). Todo burbuja.
