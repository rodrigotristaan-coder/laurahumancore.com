# HUMAN-CORE System — Landing

Sitio estático (HTML + CSS, sin build) de la landing de **Laura de la Peña — HUMAN-CORE System**.

## Estructura

```
human-core-site/
├── index.html        ← la landing completa (HTML + CSS inline)
├── assets/           ← logos e imágenes
│   ├── logo-white.png
│   ├── logo-gold.png
│   ├── logo-navy.png
│   └── laura-portrait.png
├── vercel.json       ← config de Vercel (cache de assets + headers)
└── README.md
```

No hay paso de build ni dependencias. Las fuentes (Cormorant Garamond, Mulish, Archivo) se cargan desde Google Fonts.

---

## Deploy en Vercel

### Opción A — desde la interfaz web (lo más fácil)

1. Sube esta carpeta a un repositorio de GitHub (ver abajo).
2. Entra a [vercel.com](https://vercel.com) → **Add New… → Project**.
3. Importa el repositorio.
4. En **Framework Preset** elige **Other** (es estático).
5. Deja **Build Command** y **Output Directory** vacíos.
6. Haz clic en **Deploy**. Listo.

### Opción B — desde la terminal (Vercel CLI)

```bash
npm i -g vercel        # instalar la CLI una sola vez
cd human-core-site
vercel                 # primer deploy (preview)
vercel --prod          # deploy a producción
```

---

## Subir a GitHub

Desde dentro de la carpeta `human-core-site/`:

```bash
git init
git add .
git commit -m "HUMAN-CORE landing — sitio estático"
git branch -M main
git remote add origin https://github.com/TU-USUARIO/human-core-site.git
git push -u origin main
```

(Crea primero el repositorio vacío en GitHub y reemplaza la URL del `remote`.)

---

## Notas

- **Contacto:** el botón "Agenda tu diagnóstico" abre un correo a `hola@laudelapena.com`.
  Cambia esa dirección en `index.html` (busca `mailto:`) por la real, o reemplázala
  por el enlace a tu agenda (Calendly, etc.).
- **SEO / redes:** edita la `<meta name="description">` y las etiquetas Open Graph
  en el `<head>` de `index.html`. Actualiza también `<link rel="canonical">` con tu
  dominio final.
- **Dominio:** una vez desplegado puedes conectar tu dominio propio desde
  *Vercel → Project → Settings → Domains*.
