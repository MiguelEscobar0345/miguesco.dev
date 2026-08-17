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

  security: {
    /**
     * El sitio no carga nada de fuera —ni fuentes, ni analítica, ni CDNs—, así
     * que la política puede ser de las estrictas de verdad. Astro calcula el
     * hash de cada script y estilo en línea, de modo que no hace falta abrir la
     * mano con 'unsafe-inline'.
     *
     * `frame-ancestors` no funciona en una etiqueta <meta>; ese va como
     * cabecera HTTP en public/_headers.
     */
    csp: {
      algorithm: 'SHA-384',
      directives: [
        "default-src 'self'",
        "img-src 'self' data:",
        "font-src 'self'",
        "connect-src 'self'",
        "manifest-src 'self'",
        "base-uri 'none'",
        "form-action 'none'",
        "object-src 'none'",
        "frame-src 'none'",
        "worker-src 'none'",
      ],
    },
  },
})
