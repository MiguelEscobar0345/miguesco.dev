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
| `npm run verify` | `build` + auditoría |
| `npm run deploy` | `build` + auditoría + publicar en Cloudflare |
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
| Cabeceras de seguridad y caché | `public/_headers` |
| Configuración de Cloudflare | `wrangler.jsonc` |
| Proyectos (enlaces, stack) | `src/projects.ts` |
| Colores y tipografía | `src/styles/global.css` |
| Casos de estudio | `src/content/cases/{es,en}/*.md` |

## Añadir un caso de estudio

Un caso son dos archivos con el mismo nombre, uno por idioma. El nombre del
archivo es la URL: `panaderia-la-espiga.md` → `/casos/panaderia-la-espiga`.

1. Copia `src/content/cases/es/_ejemplo.md` y `en/_ejemplo.md` con el nombre nuevo.
2. Rellena el frontmatter siguiendo la plantilla. La estructura es fija a
   propósito: **problema → qué hice → resultado**, que es el orden en que lo lee
   un cliente potencial.
3. Pon `draft: false` en los dos idiomas.
4. `npm run verify` y despliega.

`metric` es obligatorio en el esquema: si no puedes escribir un número, el caso
no está listo. Mientras no haya ningún caso publicado, la sección no aparece en
la portada y «Casos» no sale en el menú — una sección vacía dice lo contrario de
lo que queremos que diga.

El proceso completo para llegar a ese número está en
[docs/proceso-cliente.md](docs/proceso-cliente.md).

Si añades una cadena en un idioma y te olvidas del otro, `npm run check` falla:
los dos archivos implementan la misma interfaz (`src/i18n/types.ts`).

## Auditoría

`npm run verify` revisa sobre `dist/` la lista de cosas que una web no debería
tener: un solo `<h1>` por página, títulos y descripciones únicos, `canonical`,
`hreflang`, `og:image` con dimensiones, `lang`, `alt` en todas las imágenes,
`404.html`, `sitemap-index.xml`, `robots.txt` con los rastreadores de IA
permitidos, `llms.txt`, cero source maps, cabeceras de seguridad, CSP con hashes
y sin `unsafe-inline`, presupuesto de JavaScript por debajo de 10 KB y precios
del JSON-LD coherentes con los que se ven en pantalla.

Sale con código 1 si algo falla, así que sirve tal cual como paso de CI, y
`npm run deploy` no publica si la auditoría no pasa.

Lo único que no comprueba el script son los errores de consola: para eso,
`npm run preview` y abre las herramientas de desarrollo.

## Publicar en Cloudflare

El dominio está registrado en Cloudflare, así que el sitio va en la misma casa:
no hay que tocar un solo registro DNS para conectarlo.

### 1. Crear el proyecto

*Workers & Pages → Create → Connect to Git →* `MiguelEscobar0345/miguesco.dev`.

| Campo | Valor |
| --- | --- |
| Build command | `npm run build` |
| Deploy command | `npx wrangler deploy` |
| Output directory | `dist` |

La versión de Node la coge del `.nvmrc` (22.15.1). Si el build falla por eso,
añade la variable de entorno `NODE_VERSION=22.15.1`.

Para publicar a mano desde tu equipo, sin pasar por Git: `npm run deploy`.

### 2. Conectar el dominio

En el Worker, *Settings → Domains & Routes → Add → Custom domain →*
`miguesco.dev`. Como el dominio está en la misma cuenta, Cloudflare crea el
registro y emite el certificado solo.

### 3. Redirigir el www al dominio pelado

*Rules → Redirect Rules → Create rule*: si el `Hostname` es
`www.miguesco.dev`, redirige a `https://miguesco.dev/${http.request.uri.path}`
con un **301**. Sin esto tendrías el sitio duplicado en dos direcciones y Google
lo nota.

### 4. Correo con el dominio

*Email → Email Routing → Get started.* Cloudflare añade solo los registros MX y
el SPF. Después, en *Routing rules*, crea `hola@miguesco.dev` y reenvíalo a tu
Gmail. Es gratis y sigues leyendo y respondiendo desde donde siempre.

Es la dirección que ya muestra la web (`CONTACT.email` en `src/consts.ts`).

**Añade también un DMARC**, o cualquiera puede mandar correos falsos en tu
nombre. En *DNS → Records*, un registro TXT:

| Nombre | Contenido |
| --- | --- |
| `_dmarc` | `v=DMARC1; p=reject; rua=mailto:hola@miguesco.dev` |

`p=reject` es lo correcto mientras el dominio sólo *reciba* correo. El día que
configures Gmail para *enviar* desde `hola@miguesco.dev`, hay que añadir antes
`include:_spf.google.com` al SPF o tus propios correos acabarán en spam.

### 5. Avisar a Google

Da de alta el sitio en [Google Search Console](https://search.google.com/search-console),
verifícalo con el registro TXT que te dé, y envía
`https://miguesco.dev/sitemap-index.xml`.

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
- **La CSP es estricta de verdad.** El sitio no pide nada a ningún servidor ajeno
  —ni fuentes, ni analítica, ni CDNs—, así que la política es `default-src 'self'`
  sin `unsafe-inline`: Astro calcula el hash de cada script y estilo en línea
  (`security.csp` en `astro.config.mjs`). Si algún día añades algo externo, habrá
  que abrirle la puerta ahí o la consola lo bloqueará.
- **`frame-ancestors` va aparte.** Una etiqueta `<meta>` no puede aplicarla, así
  que esa y el resto de cabeceras de seguridad viven en `public/_headers`, que
  Cloudflare lee del `dist/`.
