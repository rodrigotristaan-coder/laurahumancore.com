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
├── assets/
│   ├── logo-white.png   logo blanco (para fondos oscuros)
│   ├── logo-gold.png    logo dorado (hero, marcas de agua, favicon)
│   ├── logo-navy.png    logo azul marino (OG image / fondos claros)
│   └── laura-portrait.png  retrato de Laura (sección Authority)
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
- **Formulario** (`#cotiza`) — validación básica con `novalidate`; nota de
  respuesta en `#cform-note`. **No envía a backend todavía** (ver pendientes).
- Respeta `prefers-reduced-motion`.

---

## Pendientes / cosas a configurar antes de producción

1. **Contacto real:** el CTA "Agenda tu diagnóstico" abre `mailto:hola@laudelapena.com`.
   Cambia esa dirección por la real o por un enlace de agenda (Calendly, etc.).
   Busca `mailto:` en `index.html`.
2. **Envío del formulario `#cotiza`:** hoy solo valida en el front, no envía a
   ningún lado. Conectar a un endpoint (Formspree, Vercel serverless function,
   email service, etc.).
3. **SEO / dominio:** actualizar `<link rel="canonical">`, `og:image` y las metas
   Open Graph con el dominio final. Hoy apuntan a `https://human-core.vercel.app/`.
4. **Favicon / OG:** usa `logo-gold.png` (favicon) y `logo-navy.png` (OG). Revisar
   si se quiere una OG image dedicada (1200×630).

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
