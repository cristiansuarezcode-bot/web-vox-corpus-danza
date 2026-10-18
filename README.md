# Vox Corpus Danza

Sitio web oficial de Vox Corpus Danza, construido con Next.js y publicado como sitio estático en GitHub Pages.

## Desarrollo local

Requiere Node.js 22 o superior.

```bash
npm install
npm run dev
```

## Compilación para GitHub Pages

```bash
npm ci
npm run build:pages
```

La exportación estática se genera en `out/`. Cada cambio enviado a la rama `main` activa el flujo de publicación definido en `.github/workflows/deploy-pages.yml`.

## Rutas públicas

- `/`: sitio principal.
- `/app`: descarga inteligente de Vox Danza para App Store y Google Play.
- `/clausura-2026`: página de El Legado, Clausura 2026. Todo su contenido (textos, precios y fechas) está en `app/clausura-2026/config.ts`; la página cambia sola de fase según la fecha.
- `/cancelar_cuenta_vox_danza`: instrucciones oficiales para solicitar la eliminación de una cuenta de la app Vox Danza.

## Dominio

El sitio está preparado para responder en `https://voxcorpusdanza.com`.
