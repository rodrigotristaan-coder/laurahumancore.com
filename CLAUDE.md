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
│   ├── media/                            16 clips mp4 (Mixkit Free License) del deck v2
│   └── design-system.html                design system de los decks (documenta v1.2; pendiente alinear a v1.3/v2)
├── assets/           (imágenes optimizadas WebP al tamaño de uso)
│   ├── logo-white.webp       logo blanco (nav)
│   ├── logo-gold-mask.webp   SILUETA del logo en canal alfa — se pinta con CSS mask + --gold (hero)
│   ├── logo-navy-sm.webp     logo navy chico (footer)
│   ├── logo-navy.png         logo navy grande — SOLO para og:image (no borrar)
│   ├── laura-portrait{,-360}.webp  retrato circular de Laura (sección #laura)
│   ├── clientes.webp         muro de logos de clientes (sección #clientes)
│   ├── bg-team.webp          FONDO: siluetas de equipo (1600px, velo navy encima)
│   ├── bg-playa.webp         FONDO: playa nocturna (1600px, velo navy encima)
│   ├── logo-gold.webp        (ya sin uso en el sitio; se re-usó en decks)
│   ├── logo-gold-sm.webp     (sin uso — candidato a limpieza)
│   └── favicon.png
├── vercel.json       ← static, cache de assets + headers de seguridad (CSP en Report-Only)
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

## Lenguaje visual v1.3 (2026-07-10, homologado con el HC Deck)

- **Todas las secciones son paneles navy redondeados** flotando sobre el crema
  (gaps de 12px, 8px en móvil). Ya no hay secciones claras.
- **Cada sección lleva foto de fondo**: `<div class="bg-photo ph-team|ph-playa v-grad|v-soft|v-heavy [pos-r]">`
  — la foto va como background y el velo navy como `::after`. Velos: `v-grad`
  (statement, foto visible a la derecha), `v-soft` (.87), `v-heavy` (.93, para
  secciones con mucho contenido).
- Componentes con variante `.on-dark`: cards, dots, badges, fases, tags, win.
- El muro de `#clientes` queda en tarjeta BLANCA sobre panel navy (contraste máximo).
- Hero: la marca-anillo usa `mask:url(assets/logo-gold-mask.webp)` pintada con
  `--gold` (la máscara lee el CANAL ALFA, no luminancia). ⚠️ En los decks el
  logo va como bitmap: las máscaras CSS se rasterizan como rectángulo al
  imprimir a PDF.

## Secciones (en orden, con `data-screen-label`)

1. **Nav** — píldora flotante con blur.
2. **Hero** — `#` (header), fondo playa. H1 "Tu gente no falla…", chips de datos.
3. **El problema** (`#problema`) — 3 cards + caja dorada "No necesitas más cursos".
4. **Los 3 sistemas** (`#sistemas`) — ACORDEÓN (uno abierto a la vez, el 01 por defecto).
5. **Laura** (`#laura`) — retrato circular con anillos + badges.
6. **Clientes** (`#clientes`) — muro de logos blanco.
7. **Cómo funciona** (`#metodo`) — 2 fases con entregables.
8. **Inversión** (`#inversion`) — price-card **2 pagos de $46,500** (SIN mostrar total, decisión 12-jul) + continuidad $57,690. Duración: "aprox. 2 meses".
9. **Contacto** (`#contacto`) — formulario `#cotiza`.
10. **Footer** — sobre crema.

---

## Comportamiento (JS inline al final)

- Progress bar, nav "scrolled", reveals con IntersectionObserver (red de
  seguridad a 4 s), acordeón con truco `grid-template-rows: 0fr→1fr`.
- **Formulario** (`#cotiza`): honeypot (`website`) → POST a
  `https://n8n.satorimkt.com/webhook/lead-humancore` (n8n → Excel + Telegram +
  Outlook). Si falla, cae a `mailto:contacto@laurahumancore.com` pre-llenado.
  En éxito dispara GA4 `generate_lead`. ⚠️ NO cambiar los `name` de los campos.
- Respeta `prefers-reduced-motion`.

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

## Estado (al 2026-07-12)

- **GA4** `G-LKP371EQ8Q` en vivo (+ evento `generate_lead`).
- **SEO**: robots.txt + sitemap.xml; canonical/OG al dominio real.
- **Headers** en `vercel.json`: HSTS, Permissions-Policy, etc. **CSP en Report-Only.**

## Pendientes

1. **Meta Pixel**: BLOQUEADO (sin acceso a Meta). Al desbloquear: snippet antes de `</head>`.
2. **Google Search Console**: alta del dominio + enviar sitemap.
3. **CSP**: validar en consola y promover a enforced — ojo: la máscara del hero
   Y los `background-image` de `.bg-photo` caen bajo `img-src`.
4. **design-system.html**: documenta la v1.2 (paneles claros); alinear a la
   regla v1.3 (todo navy + foto de fondo).

---

## Convenciones para editar

- Un solo archivo: edita `index.html` directo. CSS ordenado por sección.
- Usa SIEMPRE los tokens de `:root` (no hardcodees hex nuevos).
- Mantén `data-screen-label`, `data-reveal`, `data-logo` y los `name` del formulario.
- Nada de itálicas ni dorado decorativo ("AI slop"). Todo burbuja.
