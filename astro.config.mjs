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
        // El beacon de Cloudflare Web Analytics manda las visitas a este host.
        "connect-src 'self' https://cloudflareinsights.com",
        "manifest-src 'self'",
        "base-uri 'none'",
        "form-action 'none'",
        "object-src 'none'",
        "frame-src 'none'",
        "worker-src 'none'",
      ],

      /**
       * Cloudflare inyecta su script de analítica en cada página. Es la única
       * pieza que no sale de este dominio, y hay que nombrarla aquí o la CSP la
       * bloquea. Los hashes de los scripts propios se siguen añadiendo solos.
       *
       * Si algún día prefieres cero scripts externos, quita esta sección y
       * desactiva Web Analytics en el panel de Cloudflare: las dos cosas van
       * juntas, dejar sólo una rompe la consola.
       */
      scriptDirective: {
        resources: ["'self'", 'https://static.cloudflareinsights.com'],
      },
    },
  },
})
