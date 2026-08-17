/**
 * Capturas reales de los proyectos y las imágenes de Open Graph.
 *
 *   npx playwright install chromium   # una sola vez
 *   node scripts/shots.mjs
 *
 * Las OG se pintan en un navegador de verdad, no con un rasterizador de SVG,
 * porque así salen con Onest —la tipografía del sitio— y no con la que haya
 * suelta en el sistema.
 */

import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { chromium } from 'playwright'
import sharp from 'sharp'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const SHOTS_DIR = join(ROOT, 'src', 'assets', 'projects')
const PUBLIC = join(ROOT, 'public')

const VIEWPORT = { width: 1440, height: 900 } // 16:10, la misma proporción de la tarjeta
const OUTPUT = { width: 1600, height: 1000 }

const SHOTS = [
  { name: 'mepulse', url: 'https://me-pulse.vercel.app/' },
  {
    name: 'meatmos',
    url: 'https://me-atmos.vercel.app/',
    // Arranca en un estado vacío que pide una ciudad. Sin esto, la captura
    // sería una pantalla de bienvenida en vez del panel que quiero enseñar.
    async prepare(page) {
      await page.getByPlaceholder(/search city/i).fill('Medellín')
      await page.getByRole('button', { name: /^search$/i }).click()
      await page.waitForTimeout(6_000)
    },
  },
]

const OG = [
  {
    file: 'og.png',
    headline: 'Desarrollo web, apps a medida e integraciones con IA.',
    footer: 'Miguel Escobar · Frontend &amp; AI Developer · Medellín',
  },
  {
    file: 'og-en.png',
    headline: 'Web development, custom apps and AI integrations.',
    footer: 'Miguel Escobar · Frontend &amp; AI Developer · Medellín',
  },
]

async function fontFaceCss() {
  const woff2 = await readFile(join(PUBLIC, 'fonts', 'onest-latin-wght-normal.woff2'))
  return `@font-face{font-family:'Onest Variable';font-weight:100 900;font-style:normal;src:url(data:font/woff2;base64,${woff2.toString('base64')}) format('woff2-variations')}`
}

function ogHtml({ headline, footer }, fontCss) {
  return `<!doctype html><html><head><meta charset="utf-8"><style>
${fontCss}
*{margin:0;padding:0;box-sizing:border-box}
body{width:1200px;height:630px;background:#0b0b0c;color:#eceae8;
  font-family:'Onest Variable',sans-serif;display:flex;flex-direction:column;
  justify-content:space-between;padding:72px;position:relative;overflow:hidden}
body::before{content:'';position:absolute;inset:0 0 auto 0;height:5px;background:#6ee787}
.brand{display:flex;align-items:center;gap:14px;font-size:26px;font-weight:600;letter-spacing:-.02em}
/* El logotipo va en un solo elemento: si "migue" y "sco" fueran dos hijos del
   flex, el gap de 14px se colaría en mitad de la palabra. */
.brand b{font-weight:600}
.brand b i{font-style:normal;color:#6ee787}
h1{font-size:64px;font-weight:600;line-height:1.08;letter-spacing:-.03em;max-width:1000px}
.foot{display:flex;align-items:center;justify-content:space-between;
  border-top:1px solid #262a26;padding-top:26px;font-size:24px;color:#999d97}
.url{color:#6ee787;font-weight:600}
</style></head><body>
<div class="brand">
  <svg width="40" height="40" viewBox="0 0 32 32"><rect width="32" height="32" rx="7" fill="#141614"/>
  <path d="M9 23.5V12.5M9 17.2c0-2.6 1.7-4.7 3.9-4.7s3.9 2.1 3.9 4.7v6.3M16.8 17.2c0-2.6 1.7-4.7 3.9-4.7s3.9 2.1 3.9 4.7v6.3"
  fill="none" stroke="#6ee787" stroke-width="2.9" stroke-linecap="round" stroke-linejoin="round"/></svg>
  <b>migue<i>sco</i></b>
</div>
<h1>${headline}</h1>
<div class="foot"><span>${footer}</span><span class="url">miguesco.dev</span></div>
</body></html>`
}

// `node scripts/shots.mjs --og` rehace sólo las Open Graph, que es lo que
// cambia cuando se retoca el copy. Las capturas tardan bastante más.
const onlyOg = process.argv.includes('--og')

const browser = await chromium.launch()
const failures = []

try {
  await mkdir(SHOTS_DIR, { recursive: true })

  // 1. Capturas de los proyectos, con datos reales ya cargados.
  const context = await browser.newContext({
    viewport: VIEWPORT,
    deviceScaleFactor: 2,
    colorScheme: 'dark',
    locale: 'es-CO',
  })

  for (const shot of onlyOg ? [] : SHOTS) {
    const page = await context.newPage()
    try {
      await page.goto(shot.url, { waitUntil: 'networkidle', timeout: 60_000 })
      // Las dos apps piden datos a una API: hay que dejarlas terminar de pintar.
      await page.waitForTimeout(5_000)
      if (shot.prepare) await shot.prepare(page)

      const buffer = await page.screenshot({ type: 'png' })
      await sharp(buffer)
        .resize(OUTPUT.width, OUTPUT.height, { fit: 'cover', position: 'top' })
        .png({ compressionLevel: 9 })
        .toFile(join(SHOTS_DIR, `${shot.name}.png`))

      console.log(`captura ok: ${shot.name}.png`)
    } catch (error) {
      failures.push(`${shot.name}: ${error.message}`)
      console.error(`captura falló: ${shot.name} — ${error.message}`)
    } finally {
      await page.close()
    }
  }

  await context.close()

  // 2. Imágenes de Open Graph, 1200x630 exactos.
  const fontCss = await fontFaceCss()
  const ogContext = await browser.newContext({
    viewport: { width: 1200, height: 630 },
    deviceScaleFactor: 1,
  })

  for (const card of OG) {
    const page = await ogContext.newPage()
    try {
      await page.setContent(ogHtml(card, fontCss), { waitUntil: 'load' })
      await page.evaluate(() => document.fonts.ready)
      const buffer = await page.screenshot({ type: 'png' })
      await writeFile(join(PUBLIC, card.file), buffer)
      console.log(`og ok: ${card.file}`)
    } catch (error) {
      failures.push(`${card.file}: ${error.message}`)
      console.error(`og falló: ${card.file} — ${error.message}`)
    } finally {
      await page.close()
    }
  }

  await ogContext.close()
} finally {
  await browser.close()
}

if (failures.length > 0) {
  console.error(`\n${failures.length} assets sin generar:\n  ${failures.join('\n  ')}`)
  process.exit(1)
}

console.log('\nlisto: capturas en src/assets/projects/ y OG en public/')
