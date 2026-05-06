# Frontend — Estado Actual

> Última actualización: 2026-05-06

## Stack

| Tecnología | Versión | Rol |
|---|---|---|
| Next.js | 16.2.5 | Framework principal (App Router) |
| React | 19.2.4 | UI |
| TypeScript | ^5 | Tipado estático |
| Tailwind CSS | ^4 | Estilos utilitarios |
| GSAP | ^3.15.0 | Animaciones imperativas, timelines, ScrollTrigger |
| Framer Motion | ^12.38.0 | Animaciones declarativas en componentes React |
| Remotion | ^4.0.457 | Renderizado de video/animaciones con React |
| Recharts | ^3.8.1 | Gráficos (bar, line, pie, área, composable) |
| ESLint | ^9 | Linting (`eslint-config-next`) |

## Estructura de archivos

```
dataguard/
├── docs/
│   └── frontend-estado-actual.md   ← este archivo
├── public/
│   ├── file.svg
│   ├── globe.svg
│   ├── vercel.svg
│   └── window.svg
├── src/
│   └── app/
│       ├── favicon.ico
│       ├── globals.css              ← @import "tailwindcss", variables CSS
│       ├── layout.tsx               ← RootLayout, fuentes Geist, metadata
│       └── page.tsx                 ← Página principal (placeholder)
├── CLAUDE.md
├── AGENTS.md
├── eslint.config.mjs
├── package.json
├── postcss.config.mjs               ← @tailwindcss/postcss plugin
├── README.md
└── tsconfig.json
```

## Configuración relevante

### TypeScript (`tsconfig.json`)
- `strict: true`
- Path alias `@/*` → `./src/*`
- `moduleResolution: bundler` (compatible con Turbopack)

### Tailwind CSS v4
Configurado vía PostCSS plugin (`@tailwindcss/postcss`). No requiere `tailwind.config.js` — la config va inline en `globals.css` con directivas `@theme`.

```css
/* globals.css */
@import "tailwindcss";

@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --font-sans: var(--font-geist-sans);
  --font-mono: var(--font-geist-mono);
}
```

### Scripts disponibles

```bash
npm run dev      # servidor de desarrollo (Turbopack)
npm run build    # build de producción
npm run start    # servidor de producción
npm run lint     # ESLint
```

## Estado de la UI

| Ruta | Archivo | Estado |
|---|---|---|
| `/` | `src/app/page.tsx` | Placeholder — muestra "DataGuard / Listo para construir" |

## Pendiente / próximos pasos

- [ ] Definir estructura de carpetas para componentes (`src/components/`)
- [ ] Configurar variables de entorno (`.env.local`) para Supabase y Anthropic
- [ ] Crear layout de la aplicación (navbar, sidebar o shell principal)
- [ ] Configurar Remotion para composiciones de video
- [ ] Implementar módulos principales: ARCO Letter Generator, Fraud Detector, Dashboard
