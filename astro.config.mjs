// @ts-check
import { defineConfig } from 'astro/config'
import sitemap from '@astrojs/sitemap'
import tailwindcss from '@tailwindcss/vite'

import { readdirSync } from 'node:fs'

import { SITE } from './src/consts.ts'

/**
 * Rutas que son índice de carpeta (`src/pages/notas/index.astro` → `/notas`).
 * Con build.format 'preserve' el hosting las sirve con barra final, y así las
 * declara su canonical; el sitemap tiene que decir lo mismo.
 */
const INDEX_ROUTES = new Set(
  readdirSync('./src/pages', { recursive: true, withFileTypes: true })
    .filter((entry) => entry.isFile() && entry.name === 'index.astro')
    .map((entry) => {
      const dir = entry.parentPath.replaceAll('\\', '/').replace(/^\.?\/?src\/pages\/?/, '')
      return dir ? `/${dir}` : ''
    }),
)

/** Pone la barra final a las URLs de índice, para que coincidan con su canonical. */
function withIndexSlash(href) {
  const url = new URL(href)
  const bare = url.pathname.replace(/\/$/, '')
  if (INDEX_ROUTES.has(bare)) url.pathname = `${bare}/`
  return url.href
}

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
      // Cada URL del sitemap debe ser exactamente la del canonical de su página.
      serialize(item) {
        return {
          ...item,
          url: withIndexSlash(item.url),
          links: item.links?.map((link) => ({ ...link, url: withIndexSlash(link.url) })),
        }
      },
    }),
  ],

  markdown: {
    /**
     * Prism y no Shiki, que es el que trae Astro por defecto: Shiki colorea con
     * atributos `style` en cada palabra, y la CSP del sitio —sin unsafe-inline—
     * los bloquearía todos. Prism marca con clases y los colores van en
     * global.css, con las mismas variables del tema.
     */
    syntaxHighlight: 'prism',
  },

  vite: {
    plugins: [tailwindcss()],
    // Punto 18 de la lista: nada de source maps en el bundle público.
    build: { sourcemap: false },
  },

  build: {
    /**
     * 'preserve' genera `notas/mi-nota.html` en vez de `notas/mi-nota/index.html`.
     * Con el formato por defecto el hosting sirve cada pagina con barra final y
     * redirige la que no la lleva, que es justo la que declara el canonical.
     * Asi la URL que se anuncia es la que responde.
     */
    format: 'preserve',
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
