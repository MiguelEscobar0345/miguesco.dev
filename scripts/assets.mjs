/**
 * Genera los assets estáticos que no cambian: tipografía auto-hospedada,
 * favicons y manifiesto.
 *
 *   node scripts/assets.mjs
 *
 * Las capturas de proyecto y las imágenes de Open Graph las hace scripts/shots.mjs,
 * que necesita un navegador de verdad para respetar la tipografía.
 */

import { copyFile, mkdir, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const PUBLIC = join(ROOT, 'public')

// Los mismos valores que `--accent` y `--bg` del tema oscuro en global.css.
const ACCENT = '#6ee787'
const INK = '#0b0b0c'

/** La marca: la "m" de miguesco, construida con un asta y dos arcos. */
function mark({ background, stroke, radius }) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="32" height="32">
  <rect width="32" height="32" rx="${radius}" fill="${background}"/>
  <path d="M9 23.5V12.5M9 17.2c0-2.6 1.7-4.7 3.9-4.7s3.9 2.1 3.9 4.7v6.3M16.8 17.2c0-2.6 1.7-4.7 3.9-4.7s3.9 2.1 3.9 4.7v6.3"
    fill="none" stroke="${stroke}" stroke-width="2.9" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`
}

const FAVICON_SVG = mark({ background: INK, stroke: ACCENT, radius: 7 })
// En iOS el icono ya viene recortado por el sistema: sin esquinas propias.
const TOUCH_SVG = mark({ background: INK, stroke: ACCENT, radius: 0 })

/**
 * sharp no sabe escribir .ico, pero el formato admite un PNG embebido tal cual.
 * Son 22 bytes de cabecera y el PNG detrás.
 */
function pngToIco(png, size) {
  const header = Buffer.alloc(6)
  header.writeUInt16LE(0, 0) // reservado
  header.writeUInt16LE(1, 2) // tipo: 1 = icono
  header.writeUInt16LE(1, 4) // número de imágenes

  const entry = Buffer.alloc(16)
  entry.writeUInt8(size === 256 ? 0 : size, 0) // ancho (0 significa 256)
  entry.writeUInt8(size === 256 ? 0 : size, 1) // alto
  entry.writeUInt8(0, 2) // paleta
  entry.writeUInt8(0, 3) // reservado
  entry.writeUInt16LE(1, 4) // planos
  entry.writeUInt16LE(32, 6) // bits por píxel
  entry.writeUInt32LE(png.length, 8)
  entry.writeUInt32LE(header.length + entry.length, 12)

  return Buffer.concat([header, entry, png])
}

async function copyFonts() {
  const from = join(ROOT, 'node_modules', '@fontsource-variable', 'onest', 'files')
  const to = join(PUBLIC, 'fonts')
  await mkdir(to, { recursive: true })

  // Sólo los subconjuntos latinos: el cirílico no lo usa ninguno de los dos idiomas.
  const files = ['onest-latin-wght-normal.woff2', 'onest-latin-ext-wght-normal.woff2']
  for (const file of files) {
    await copyFile(join(from, file), join(to, file))
  }
  return files.length
}

async function buildIcons() {
  await writeFile(join(PUBLIC, 'favicon.svg'), FAVICON_SVG, 'utf8')

  const png32 = await sharp(Buffer.from(FAVICON_SVG)).resize(32, 32).png().toBuffer()
  await writeFile(join(PUBLIC, 'favicon.ico'), pngToIco(png32, 32))

  const sizes = [
    { file: 'apple-touch-icon.png', size: 180, svg: TOUCH_SVG },
    { file: 'icon-192.png', size: 192, svg: FAVICON_SVG },
    { file: 'icon-512.png', size: 512, svg: FAVICON_SVG },
  ]

  for (const { file, size, svg } of sizes) {
    await sharp(Buffer.from(svg)).resize(size, size).png().toFile(join(PUBLIC, file))
  }

  return sizes.length + 2
}

async function buildManifest() {
  const manifest = {
    name: 'miguesco — Miguel Escobar',
    short_name: 'miguesco',
    description: 'Desarrollo web, apps a medida e integraciones con IA.',
    start_url: '/',
    scope: '/',
    display: 'standalone',
    background_color: INK,
    theme_color: INK,
    lang: 'es-CO',
    icons: [
      { src: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { src: '/icon-512.png', sizes: '512x512', type: 'image/png' },
      { src: '/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
    ],
  }

  await writeFile(
    join(PUBLIC, 'site.webmanifest'),
    `${JSON.stringify(manifest, null, 2)}\n`,
    'utf8',
  )
}

await mkdir(PUBLIC, { recursive: true })

const fonts = await copyFonts()
const icons = await buildIcons()
await buildManifest()

console.log(`assets: ${fonts} tipografías, ${icons} iconos y el manifiesto en public/`)
