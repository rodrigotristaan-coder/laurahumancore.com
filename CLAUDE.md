# HUMAN-CORE System — Landing (contexto para Claude Code)

Landing **estática** (HTML + CSS inline, sin build, sin dependencias) de
**Laura de la Peña — HUMAN-CORE System**. Lista para deploy en Vercel.

> Todo el sitio vive en un solo archivo: `index.html` (~815 líneas, CSS en un
> `<style>` dentro del `<head>` y un pequeño `<script>` al final para reveal /
> progress bar / validación del formulario). No hay framework. Edítalo directo.

---

## Estructura de archivos

```
human-core-site/
├── index.html        ← TODO el sitio (HTML + CSS + JS inline)
├── assets/   (imágenes optimizadas: WebP redimensionado a su tamaño de uso)
│   ├── logo-white.webp     logo blanco (nav/footer, ~220px)
│   ├── logo-gold.webp      logo dorado — anillo decorativo del hero (~700px, opacity .14)
│   ├── logo-gold-sm.webp   logo dorado chico (~200px) para el manifiesto (se muestra a 84px)
│   ├── logo-navy.png       logo azul marino — SOLO para OG image (PNG por compat. WhatsApp/FB)
│   ├── laura-portrait.webp retrato de Laura (sección Authority, ~760px retina)
│   └── favicon.png         favicon 96px (recorte de logo-gold)
├── vercel.json       ← static, cache de assets + headers de seguridad
├── README.md         ← instrucciones de deploy (Vercel / GitHub)
└── CLAUDE.md         ← este archivo
```

---

## Design tokens (definidos en `:root` dentro de `index.html`)

| Token | Valor | Uso |
|---|---|---|
| `--navy` | `#002060` | Azul marino principal (marca) |
| `--navy-deep` | `#001233` | Fondos oscuros profundos |
| `--navy-soft` | `#1b3a78` | Azul intermedio |
| `--gold` | `#c2a36b` | Dorado de marca (acentos, hairline, CTA) |
| `--gold-deep` | `#a8854c` | Dorado oscuro (degradados, hover) |
| `--cream` | `#f7f3ec` | Fondo crema (body) |
| `--cream-card` | `#fcfaf5` | Fondo de tarjetas claras |
| `--ink` | `#111a30` | Texto de títulos |
| `--body-solid` | `#414961` | Texto de cuerpo |
| `--taupe` | `#857c6c` | Texto secundario / labels |
| `--line` | `#e6dfd1` | Bordes en fondo claro |

**Tipografías** (Google Fonts):
- `--font-display`: **Cormorant Garamond** (serif) → títulos H1–H4
- `--font-body`: **Mulish** (sans) → cuerpo, 18px base, line-height 1.7
- `--font-label`: **Archivo** (sans) → labels, kickers, botones (uppercase + letter-spacing)

Acento de marca: hairline dorado fijo de 3px en el borde superior de la página
(`body::after`).

---

## Secciones (en orden, con `data-screen-label`)

1. **Nav** — barra superior fija, logo + anclas + CTA.
2. **Hero** — logo dorado en anillo, titular, subtítulo, CTA. `data-screen-label="Hero"`
3. **Strip** — banda con 3 claims (metodologías patentadas, etc.).
4. **El problema** (`#problema`, watermark `01`) — planteamiento del dolor.
5. **Manifiesto** (`.on-dark`) — bloque oscuro con declaración de marca.
6. **Ecosistema** (`#ecosistema`, watermark `02`) — qué es HUMAN-CORE.
7. **Los 3 sistemas** (`#sistemas`, `.on-dark`, watermark `03`) — los 3 pilares/sistemas.
8. **Laura de la Peña** (`#laura`) — autoridad/bio, usa `laura-portrait.png`.
9. **Contacto** (`#contacto`, `.on-dark`, watermark `05`) — copy + formulario
   `#cotiza` "Solicita tu cotización".

> Las secciones `.on-dark` invierten la paleta (fondo navy, texto claro, acentos
> dorados). Las marcas de agua (`.watermark`) son números grandes decorativos.

---

## Comportamiento (JS inline al final del `index.html`)

- **Progress bar** (`#progress`) — barra de progreso de scroll arriba.
- **Reveal on scroll** — elementos con `data-reveal` aparecen con
  `IntersectionObserver`; soportan delay via `style="--d:.12s"`.
- **Formulario** (`#cotiza`) — validación básica + honeypot (`website`). **Envía a
  un webhook de n8n** (`https://n8n.satorimkt.com/webhook/lead-humancore`) que escribe
  en Excel y avisa por Telegram (grupo `@LauraDlp_Bot`) + Outlook. Si el webhook falla,
  cae a un `mailto:lauracoaching369@gmail.com` pre-llenado. En éxito dispara el evento
  GA4 `generate_lead`. Nota de respuesta en `#cform-note`.
- Respeta `prefers-reduced-motion`.

---

## Estado (al 2026-06-15)

- **EN VIVO** en `laurahumancore.com` (+ `www` redirige al apex) con SSL. Canonical/OG ya apuntan al dominio real.
- **Formulario conectado** a n8n (Excel + Telegram + Outlook); ver "Comportamiento".
- **Analytics:** GA4 `G-LKP371EQ8Q` en vivo (pageviews + evento `generate_lead` en el submit). `robots.txt` + `sitemap.xml` presentes. Headers de seguridad en `vercel.json` (HSTS + CSP en Report-Only).

## Pendientes

1. **Meta Pixel:** BLOQUEADO — Rodrigo sin acceso a Meta de momento. Al desbloquear: agregar el snippet del Pixel antes de `</head>`.
2. **Google Search Console:** dar de alta el dominio y enviar el `sitemap.xml`.
3. **CSP:** está en `Content-Security-Policy-Report-Only`; validar en consola del navegador (sin violaciones) y promover a `Content-Security-Policy` (enforced).
4. **Favicon / OG:** revisar si se quiere una OG image dedicada (1200×630).

---

## Deploy

Sitio estático, sin build. En Vercel: Framework Preset = **Other**, Build Command
y Output Directory **vacíos**. O por CLI: `vercel` (preview) / `vercel --prod`.
Ver `README.md` para los pasos completos (incluye subir a GitHub).

---

## Convenciones para editar

- Un solo archivo: edita `index.html` directo. CSS en el `<style>` del `<head>`,
  ordenado por sección con comentarios `<!-- =============== X =============== -->`.
- Usa SIEMPRE los tokens de `:root` (no hardcodees hex nuevos).
- Mantén los `data-screen-label`, `data-reveal` y `data-logo` al reestructurar.
- Tipografía mínima legible; respeta la jerarquía Cormorant (display) / Mulish
  (cuerpo) / Archivo (labels).
- Las imágenes con `data-logo` se intercambian por JS según el fondo — no quitar
  ese atributo.
