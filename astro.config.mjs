// @ts-check
import { defineConfig } from 'astro/config'
import sitemap from '@astrojs/sitemap'
import tailwindcss from '@tailwindcss/vite'

import { SITE } from './src/consts.ts'

export default defineConfig({
  site: SITE.url,
  trailingSlash: 'ignore',

  i18n: {
    defaultLocale: 'es',
    locales: ['es', 'en'],
    routing: {
      // El español vive en la raíz (/), el inglés bajo /en/.
      prefixDefaultLocale: false,
      redirectToDefaultLocale: false,
    },
  },

  integrations: [
    sitemap({
      i18n: {
        defaultLocale: 'es',
        locales: { es: 'es-CO', en: 'en' },
      },
    }),
  ],

  vite: {
    plugins: [tailwindcss()],
    // Punto 18 de la lista: nada de source maps en el bundle público.
    build: { sourcemap: false },
  },

  build: {
    // Un solo archivo CSS en lugar de uno por página: menos peticiones.
    inlineStylesheets: 'auto',
  },
})
