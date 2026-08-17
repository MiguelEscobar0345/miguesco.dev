/**
 * Auditor del build.
 *
 *   npm run build && node scripts/audit.mjs
 *
 * Comprueba, sobre `dist/`, la lista de cosas que una web no debería tener
 * nunca. Cada control lleva el número del punto que cubre, y el script sale
 * con código 1 si alguno falla, para que un despliegue no se lleve por delante
 * el SEO sin que nadie se entere.
 */

import { existsSync } from 'node:fs'
import { readFile, readdir } from 'node:fs/promises'
import { dirname, join, relative } from 'node:path'
import { fileURLToPath } from 'node:url'
import { parse } from 'node-html-parser'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const DIST = join(ROOT, 'dist')

const JS_BUDGET = 10 * 1024 // 10 KB para todo el JavaScript del sitio
const MAX_DESCRIPTION = 165 // lo que Google suele mostrar antes de cortar

/**
 * El dominio se lee de `src/consts.ts` en vez de repetirlo aquí: si algún día
 * cambia, el auditor sigue comprobando lo correcto sin que haya que acordarse
 * de tocar este archivo.
 */
const SITE_URL = (await readFile(join(ROOT, 'src', 'consts.ts'), 'utf8')).match(
  /url:\s*'([^']+)'/,
)?.[1]

if (!SITE_URL) {
  console.error('No pude leer SITE.url de src/consts.ts.')
  process.exit(1)
}

/**
 * Astro deja la 404 del idioma por defecto en `dist/404.html` —que es el
 * archivo que sirven Vercel y compañía cuando una ruta no existe— y la inglesa
 * como una página normal en `dist/en/404/`.
 */
const PAGES = [
  { file: 'index.html', lang: 'es-CO', path: '/' },
  { file: 'en/index.html', lang: 'en', path: '/en/' },
  { file: '404.html', lang: 'es-CO', path: '/404', noindex: true },
  { file: 'en/404/index.html', lang: 'en', path: '/en/404', noindex: true },
]

const REQUIRED_FILES = [
  '_headers',
  'robots.txt',
  'llms.txt',
  'sitemap-index.xml',
  'favicon.svg',
  'favicon.ico',
  'apple-touch-icon.png',
  'site.webmanifest',
  'og.png',
  'og-en.png',
]

const AI_BOTS = ['GPTBot', 'ClaudeBot', 'PerplexityBot', 'Google-Extended', 'Applebot-Extended']

const COP = new Intl.NumberFormat('es-CO', { maximumFractionDigits: 0 })
const USD = new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 })

const results = []
const warnings = []

const check = (point, name, ok, detail = '') => results.push({ point, name, ok, detail })
/** Cosas que conviene arreglar antes de publicar pero que no rompen el build. */
const warn = (name, detail) => warnings.push({ name, detail })

async function walk(dir) {
  const found = []
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name)
    if (entry.isDirectory()) found.push(...(await walk(full)))
    else found.push(full)
  }
  return found
}

if (!existsSync(DIST)) {
  console.error('No hay dist/. Ejecuta `npm run build` primero.')
  process.exit(1)
}

const allFiles = await walk(DIST)
const rel = (file) => relative(DIST, file).replaceAll('\\', '/')

// ── Archivos que tienen que existir ────────────────────────────────────────
const points = { 'robots.txt': 13, 'llms.txt': 12, 'sitemap-index.xml': 15, _headers: 21 }
for (const file of REQUIRED_FILES) {
  const point = points[file] ?? (file.startsWith('og') ? 7 : 14)
  check(point, `existe ${file}`, existsSync(join(DIST, file)))
}
check(3, 'existe 404.html', existsSync(join(DIST, '404.html')))
check(3, 'existe en/404/', existsSync(join(DIST, 'en', '404', 'index.html')))

// ── Páginas ────────────────────────────────────────────────────────────────
const titles = new Map()
const descriptions = new Map()

for (const page of PAGES) {
  const file = join(DIST, page.file)
  if (!existsSync(file)) {
    check(3, `página ${page.file}`, false, 'no se generó')
    continue
  }

  const html = await readFile(file, 'utf8')
  const doc = parse(html)
  const at = (label) => `${page.file}: ${label}`
  const meta = (selector) => doc.querySelector(selector)?.getAttribute('content')?.trim() ?? ''

  // 16 · atributo de idioma
  const lang = doc.querySelector('html')?.getAttribute('lang') ?? ''
  check(16, at('<html lang>'), lang === page.lang, lang || 'ausente')

  // 5 · título propio y único
  const title = doc.querySelector('title')?.text.trim() ?? ''
  check(5, at('<title>'), title.length > 10, title || 'ausente')
  titles.set(page.file, title)

  // 6 · meta description propia y de largo razonable
  const description = meta('meta[name="description"]')
  check(
    6,
    at('meta description'),
    description.length > 50 && description.length <= MAX_DESCRIPTION,
    description ? `${description.length} caracteres` : 'ausente',
  )
  descriptions.set(page.file, description)

  // 9 y 10 · exactamente un h1, y jerarquía sin saltos
  const headings = doc.querySelectorAll('h1, h2, h3, h4, h5, h6')
  const levels = headings.map((node) => Number(node.tagName[1]))
  const h1Count = levels.filter((level) => level === 1).length
  check(9, at('un solo <h1>'), h1Count === 1, `encontrados: ${h1Count}`)

  let skip = ''
  for (let i = 1; i < levels.length; i += 1) {
    if (levels[i] - levels[i - 1] > 1) {
      skip = `h${levels[i - 1]} → h${levels[i]}`
      break
    }
  }
  check(9, at('jerarquía de encabezados'), skip === '', skip)

  // 11 · canonical absoluto y apuntando a esta misma página
  const canonical = doc.querySelector('link[rel="canonical"]')?.getAttribute('href') ?? ''
  const expected = new URL(page.path, SITE_URL).href
  check(11, at('canonical'), canonical === expected, canonical || 'ausente')

  // 1 · dominio propio, no una URL de vercel.app
  check(1, at('dominio propio'), !canonical.includes('vercel.app'), canonical)

  // 11 · alternativas de idioma cruzadas
  const hreflangs = doc
    .querySelectorAll('link[rel="alternate"]')
    .map((node) => node.getAttribute('hreflang'))
  for (const tag of ['es-CO', 'en', 'x-default']) {
    check(11, at(`hreflang ${tag}`), hreflangs.includes(tag))
  }

  // 7 · og:image completa
  const ogImage = meta('meta[property="og:image"]')
  check(7, at('og:image'), ogImage.startsWith(SITE_URL), ogImage || 'ausente')
  check(7, at('og:image dimensiones'), meta('meta[property="og:image:width"]') === '1200' && meta('meta[property="og:image:height"]') === '630')
  check(7, at('og:image:alt'), meta('meta[property="og:image:alt"]').length > 10)
  check(7, at('twitter:card'), meta('meta[name="twitter:card"]') === 'summary_large_image')

  const ogFile = ogImage.split('/').pop() ?? ''
  check(7, at(`${ogFile} existe en dist`), existsSync(join(DIST, ogFile)))

  // 17 · alt en todas las imágenes
  const images = doc.querySelectorAll('img')
  const sinAlt = images.filter((img) => !(img.getAttribute('alt') ?? '').trim())
  check(17, at('alt en <img>'), sinAlt.length === 0, `${images.length} imágenes, ${sinAlt.length} sin alt`)

  // 2 · el HTML servido trae el contenido, no una cáscara vacía
  const mainText = (doc.querySelector('main')?.text ?? '').replace(/\s+/g, ' ').trim()
  const floor = page.noindex ? 80 : 2000
  check(2, at('contenido en el HTML'), mainText.length >= floor, `${mainText.length} caracteres en <main>`)

  // 3 · la 404 no debe indexarse
  if (page.noindex) {
    check(3, at('noindex'), (meta('meta[name="robots"]') ?? '').includes('noindex'))
  }

  // 21 · CSP con hashes en cada página, sin abrir la mano con 'unsafe-inline'.
  // Astro escribe el http-equiv en minúsculas, y los selectores CSS distinguen
  // mayúsculas en el valor de un atributo: hay que comparar a mano.
  const csp =
    doc
      .querySelectorAll('meta[http-equiv]')
      .find((node) => node.getAttribute('http-equiv')?.toLowerCase() === 'content-security-policy')
      ?.getAttribute('content') ?? ''

  check(21, at('CSP presente'), csp.includes("default-src 'self'"), csp ? '' : 'ausente')
  check(
    21,
    at('CSP sin unsafe-inline / unsafe-eval'),
    csp !== '' && !csp.includes('unsafe-inline') && !csp.includes('unsafe-eval'),
  )
  check(21, at('CSP con hashes de scripts y estilos'), /script-src[^;]*'sha\d{3}-/.test(csp) && /style-src[^;]*'sha\d{3}-/.test(csp))

  // 8 · datos estructurados válidos y coherentes con los precios visibles
  const ld = doc.querySelector('script[type="application/ld+json"]')?.text ?? ''
  let graph = null
  try {
    graph = JSON.parse(ld)
  } catch {
    graph = null
  }
  check(8, at('JSON-LD válido'), graph !== null && Array.isArray(graph['@graph']))

  if (graph && page.path === '/') {
    const business = graph['@graph'].find((node) => node['@type'] === 'ProfessionalService')
    const offers = business?.hasOfferCatalog?.itemListElement ?? []
    check(8, at('4 servicios en el catálogo'), offers.length === 4, `${offers.length} ofertas`)

    // La invariante que de verdad importa: lo que dice el JSON-LD es lo que
    // se ve en pantalla. Si alguien toca un precio a mano, esto salta.
    const text = doc.text
    const desajustes = []
    for (const offer of offers) {
      for (const spec of offer.priceSpecification ?? []) {
        const amount = spec.price ?? spec.minPrice
        const shown = spec.priceCurrency === 'COP' ? COP.format(amount) : USD.format(amount)
        if (!text.includes(shown)) desajustes.push(`${offer.name} ${spec.priceCurrency} ${shown}`)
      }
    }
    check(8, at('precios del JSON-LD visibles en la página'), desajustes.length === 0, desajustes.join(', '))
  }
}

// 5 y 6 · nada de repetir título ni descripción entre páginas
check(5, 'títulos únicos', new Set(titles.values()).size === titles.size)
check(6, 'descripciones únicas', new Set(descriptions.values()).size === descriptions.size)

// ── Bundle ─────────────────────────────────────────────────────────────────
/**
 * Astro empotra los scripts pequeños dentro del HTML en vez de servirlos como
 * archivos. Contar sólo los `.js` daría un flamante 0 KB que no significa nada,
 * así que aquí entra también el JavaScript en línea.
 */
const jsFiles = allFiles.filter((file) => file.endsWith('.js'))
const clientJs = []

for (const file of jsFiles) {
  clientJs.push({ from: rel(file), code: await readFile(file, 'utf8') })
}

let inlineCount = 0
for (const file of allFiles.filter((entry) => entry.endsWith('.html'))) {
  const doc = parse(await readFile(file, 'utf8'))
  for (const script of doc.querySelectorAll('script')) {
    const type = script.getAttribute('type') ?? ''
    if (type === 'application/ld+json' || script.getAttribute('src')) continue
    if (!script.text.trim()) continue
    inlineCount += 1
    clientJs.push({ from: `${rel(file)} (en línea)`, code: script.text })
  }
}

// La página más pesada manda: es lo que descarga un visitante, no la suma de todas.
const perPage = new Map()
for (const entry of clientJs) {
  const page = entry.from.replace(' (en línea)', '')
  const key = page.endsWith('.html') ? page : 'compartido'
  perPage.set(key, (perPage.get(key) ?? 0) + Buffer.byteLength(entry.code, 'utf8'))
}
const shared = perPage.get('compartido') ?? 0
const worst = Math.max(
  ...[...perPage].filter(([key]) => key !== 'compartido').map(([, bytes]) => bytes + shared),
)

check(
  20,
  'presupuesto de JavaScript',
  worst <= JS_BUDGET,
  `${(worst / 1024).toFixed(1)} KB en la página más pesada · ${jsFiles.length} archivos y ${inlineCount} bloques en línea (máximo ${JS_BUDGET / 1024} KB)`,
)

// 4 · nada de un framework entero para tres botones
const frameworkHits = clientJs
  .filter((entry) => /\b(react-dom|createElement|__vite_preload|preact|vue|svelte)\b/.test(entry.code))
  .map((entry) => entry.from)
check(4, 'sin runtime de framework en el cliente', frameworkHits.length === 0, frameworkHits.join(', '))

// 18 · ni un source map publicado
const maps = allFiles.filter((file) => file.endsWith('.map')).map(rel)
const inlineMaps = clientJs
  .filter((entry) => entry.code.includes('sourceMappingURL'))
  .map((entry) => entry.from)
check(18, 'sin source maps', maps.length === 0 && inlineMaps.length === 0, [...maps, ...inlineMaps].join(', '))

// ── robots.txt ─────────────────────────────────────────────────────────────
if (existsSync(join(DIST, 'robots.txt'))) {
  const robots = await readFile(join(DIST, 'robots.txt'), 'utf8')
  check(13, 'robots.txt declara el sitemap', /^Sitemap:\s*https:\/\//m.test(robots))
  check(13, 'robots.txt no bloquea el sitio', !/^Disallow:\s*\/\s*$/m.test(robots))
  const missing = AI_BOTS.filter((bot) => !robots.includes(bot))
  check(13, 'robots.txt permite a los rastreadores de IA', missing.length === 0, missing.join(', '))
}

// 21 · cabeceras de seguridad y caché que servirá Cloudflare
if (existsSync(join(DIST, '_headers'))) {
  const headers = await readFile(join(DIST, '_headers'), 'utf8')
  const required = [
    'Strict-Transport-Security',
    'X-Content-Type-Options',
    'Referrer-Policy',
    'Permissions-Policy',
    "frame-ancestors 'none'",
  ]
  const missing = required.filter((header) => !headers.includes(header))
  check(21, 'cabeceras de seguridad', missing.length === 0, missing.join(', '))
  check(
    21,
    'caché eterna para los assets con hash',
    /\/_astro\/\*[\s\S]*?max-age=31536000, immutable/.test(headers),
  )
}

// 12 · llms.txt con contenido de verdad
if (existsSync(join(DIST, 'llms.txt'))) {
  const llms = await readFile(join(DIST, 'llms.txt'), 'utf8')
  check(12, 'llms.txt con servicios y contacto', llms.includes('## Servicios') && llms.includes('## Contacto'), `${llms.length} caracteres`)
}

// 15 · sitemap con las dos portadas
const sitemapFile = allFiles.find((file) => /sitemap-\d+\.xml$/.test(file))
if (sitemapFile) {
  const sitemap = await readFile(sitemapFile, 'utf8')
  const home = new URL('/', SITE_URL).href
  check(
    15,
    'sitemap incluye las dos portadas',
    sitemap.includes(home) && sitemap.includes(new URL('/en/', SITE_URL).href),
  )
}

// ── Avisos: no rompen nada, pero no deberían llegar a producción ───────────
if (!SITE_URL.includes('.') || SITE_URL.includes('vercel.app')) {
  warn('SITE.url no apunta a un dominio propio', SITE_URL)
}

// ── Informe ────────────────────────────────────────────────────────────────
const failed = results.filter((result) => !result.ok)
const pad = (value, width) => String(value).padEnd(width)

console.log('\n  Auditoría del build\n')
for (const result of results) {
  const mark = result.ok ? '\x1b[32m✓\x1b[0m' : '\x1b[31m✗\x1b[0m'
  const detail = result.detail ? `\x1b[90m${result.detail}\x1b[0m` : ''
  console.log(`  ${mark} ${pad(`[${result.point}]`, 5)} ${pad(result.name, 46)} ${detail}`)
}

console.log(
  `\n  ${results.length - failed.length}/${results.length} controles superados.` +
    '\n  Punto 19 (errores en consola) se comprueba en el navegador: npm run preview.',
)

for (const warning of warnings) {
  console.log(`\n  \x1b[33m!\x1b[0m ${warning.name}\n    \x1b[90m${warning.detail}\x1b[0m`)
}

console.log('')

if (failed.length > 0) {
  console.error(`  \x1b[31m${failed.length} fallos.\x1b[0m\n`)
  process.exit(1)
}
