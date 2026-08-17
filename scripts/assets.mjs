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

/**
 * La marca: la "m" de miguesco, un asta y dos arcos.
 *
 * `weight` y `inset` se ajustan por tamaño: a 16 píxeles un trazo fino se
 * convierte en una mancha gris, así que la versión pequeña lleva el trazo más
 * grueso y la letra más grande dentro de la caja.
 */
function mark({ background, stroke, radius, weight = 2.9, scale = 1 }) {
  // La letra se dibuja centrada en la rejilla de 32 y se escala desde el centro.
  const transform = scale === 1 ? '' : ` transform="translate(16 16) scale(${scale}) translate(-16 -16)"`

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
  <rect width="32" height="32" rx="${radius}" fill="${background}"/>
  <path d="M9 23.5V12.5M9 17.2c0-2.6 1.7-4.7 3.9-4.7s3.9 2.1 3.9 4.7v6.3M16.8 17.2c0-2.6 1.7-4.7 3.9-4.7s3.9 2.1 3.9 4.7v6.3"
    fill="none" stroke="${stroke}" stroke-width="${weight}" stroke-linecap="round" stroke-linejoin="round"${transform}/>
</svg>`
}

/** Sin width ni height: un favicon SVG debe escalar a cualquier tamaño. */
const FAVICON_SVG = mark({ background: INK, stroke: ACCENT, radius: 7 })
// En iOS el icono ya viene recortado por el sistema: sin esquinas propias.
const TOUCH_SVG = mark({ background: INK, stroke: ACCENT, radius: 0 })
/**
 * Para 16 px: trazo más grueso y letra un 5% mayor. Con el trazo del tamaño
 * normal las astas salen entrecortadas; con más de 3.4 se cierran los huecos
 * de la letra y deja de leerse una "m".
 */
const SMALL_SVG = mark({ background: INK, stroke: ACCENT, radius: 5, weight: 3.4, scale: 1.05 })

/**
 * sharp no sabe escribir .ico, pero el formato admite PNG embebidos tal cual.
 *
 * Va con tres tamaños a propósito: 16 y 32 para la pestaña del navegador, y
 * **48 porque Google exige que el favicon de los resultados de búsqueda sea un
 * cuadrado múltiplo de 48**. Con sólo 32x32, Google descarta el icono y pinta
 * el globo terráqueo genérico.
 */
function buildIco(frames) {
  const header = Buffer.alloc(6)
  header.writeUInt16LE(0, 0) // reservado
  header.writeUInt16LE(1, 2) // tipo: 1 = icono
  header.writeUInt16LE(frames.length, 4)

  const directory = Buffer.alloc(16 * frames.length)
  let offset = header.length + directory.length

  frames.forEach((frame, index) => {
    const at = index * 16
    directory.writeUInt8(frame.size === 256 ? 0 : frame.size, at) // ancho (0 = 256)
    directory.writeUInt8(frame.size === 256 ? 0 : frame.size, at + 1) // alto
    directory.writeUInt8(0, at + 2) // colores de paleta
    directory.writeUInt8(0, at + 3) // reservado
    directory.writeUInt16LE(1, at + 4) // planos
    directory.writeUInt16LE(32, at + 6) // bits por píxel
    directory.writeUInt32LE(frame.png.length, at + 8)
    directory.writeUInt32LE(offset, at + 12)
    offset += frame.png.length
  })

  return Buffer.concat([header, directory, ...frames.map((frame) => frame.png)])
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

/** Rasteriza el SVG al tamaño pedido. `density` alta para que el trazo no se rompa. */
async function raster(svg, size) {
  return sharp(Buffer.from(svg), { density: 384 })
    .resize(size, size, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png({ compressionLevel: 9 })
    .toBuffer()
}

async function buildIcons() {
  await writeFile(join(PUBLIC, 'favicon.svg'), FAVICON_SVG, 'utf8')

  const ico = buildIco([
    { size: 16, png: await raster(SMALL_SVG, 16) },
    { size: 32, png: await raster(FAVICON_SVG, 32) },
    { size: 48, png: await raster(FAVICON_SVG, 48) },
  ])
  await writeFile(join(PUBLIC, 'favicon.ico'), ico)

  const sizes = [
    { file: 'apple-touch-icon.png', size: 180, svg: TOUCH_SVG },
    // 96 y 192 son múltiplos de 48: candidatos válidos para Google.
    { file: 'icon-96.png', size: 96, svg: FAVICON_SVG },
    { file: 'icon-192.png', size: 192, svg: FAVICON_SVG },
    { file: 'icon-512.png', size: 512, svg: FAVICON_SVG },
  ]

  for (const { file, size, svg } of sizes) {
    await writeFile(join(PUBLIC, file), await raster(svg, size))
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
      { src: '/icon-96.png', sizes: '96x96', type: 'image/png' },
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
