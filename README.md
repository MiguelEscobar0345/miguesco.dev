# miguesco

Portfolio y landing de servicios de Miguel Escobar. Astro + Tailwind, estático,
bilingüe (español en `/`, inglés en `/en/`) y con los precios publicados en COP y USD.

## Requisitos

Node **22.12 o superior**. Tu Node por defecto es el 20, así que antes de cualquier
comando:

```bash
nvm use 22.15.1
```

(El `.nvmrc` ya apunta a esa versión.)

## Comandos

```bash
npm install
```

```bash
npm run dev
```

| Comando | Qué hace |
| --- | --- |
| `npm run dev` | Servidor de desarrollo en http://localhost:4321 |
| `npm run build` | Genera el sitio estático en `dist/` |
| `npm run preview` | Sirve `dist/` tal cual se va a publicar |
| `npm run verify` | `build` + auditoría de los 20 puntos |
| `npm run audit` | Sólo la auditoría, sobre el `dist/` que ya exista |
| `npm run assets` | Regenera tipografías, favicons y manifiesto |
| `npm run shots` | Recaptura los proyectos y las imágenes de Open Graph |
| `npm run check` | Comprobación de tipos de Astro |

## Dónde se cambian las cosas

| Qué | Archivo |
| --- | --- |
| **Precios** | `src/i18n/pricing.ts` — un solo sitio. La página, el `llms.txt` y el JSON-LD leen de ahí. |
| Textos en español | `src/i18n/es.ts` |
| Textos en inglés | `src/i18n/en.ts` |
| WhatsApp, correo, redes, dominio | `src/consts.ts` |
| Proyectos (enlaces, stack) | `src/projects.ts` |
| Colores y tipografía | `src/styles/global.css` |

Si añades una cadena en un idioma y te olvidas del otro, `npm run check` falla:
los dos archivos implementan la misma interfaz (`src/i18n/types.ts`).

## Auditoría

`npm run verify` revisa sobre `dist/` la lista de cosas que una web no debería
tener: un solo `<h1>` por página, títulos y descripciones únicos, `canonical`,
`hreflang`, `og:image` con dimensiones, `lang`, `alt` en todas las imágenes,
`404.html`, `sitemap-index.xml`, `robots.txt` con los rastreadores de IA
permitidos, `llms.txt`, cero source maps, presupuesto de JavaScript por debajo
de 10 KB y precios del JSON-LD coherentes con los que se ven en pantalla.

Sale con código 1 si algo falla, así que sirve tal cual como paso de CI.

Lo único que no comprueba el script son los errores de consola: para eso,
`npm run preview` y abre las herramientas de desarrollo.

## Publicar

1. **Compra el dominio.** El sitio está configurado para `miguesco.dev`
   (`SITE.url` en `src/consts.ts`). Si eliges otro, cámbialo ahí: de ese valor
   salen el `canonical`, el `sitemap` y las URLs de las imágenes sociales.
2. **Sube el repositorio a GitHub.**
3. **Importa el proyecto en Vercel.** Detecta Astro solo. Comprueba que la
   versión de Node del proyecto sea la 22 en *Settings → General → Node.js Version*.
4. **Conecta el dominio** en *Settings → Domains* y apunta los DNS.
5. Da de alta el sitio en [Google Search Console](https://search.google.com/search-console)
   y envía `https://tudominio/sitemap-index.xml`.

Mientras no tengas dominio, el sitio funcionará igual en la URL de `*.vercel.app`,
pero el `canonical` seguirá apuntando a `miguesco.dev`. No lo publiques en serio
hasta tener el dominio, o corrígelo antes en `src/consts.ts`.

## Detalles que conviene saber

- **La página 404.** Astro deja la española en `dist/404.html`, que es la que
  sirven Vercel y compañía ante cualquier ruta desconocida. La inglesa existe en
  `/en/404` como página normal, pero un alojamiento estático sólo puede tener una
  404 automática y será la española.
- **Las capturas de los proyectos** se generan con Playwright desde las demos en
  producción. Para actualizarlas: `npx playwright install chromium` una vez y
  luego `npm run shots`. Con `npm run shots -- --og` sólo se rehacen las imágenes
  de Open Graph, que es lo que cambia cuando retocas el copy.
- **Cero JavaScript de framework.** Los tres selectores —tema, idioma y moneda—
  son scripts sueltos de unas quince líneas. El de moneda se apoya en el atributo
  `data-currency` del `<html>` y deja que el CSS elija qué precio enseñar, así que
  las dos monedas están siempre en el HTML servido.
