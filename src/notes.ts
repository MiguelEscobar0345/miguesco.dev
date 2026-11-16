import { getCollection, type CollectionEntry } from 'astro:content'

import { LOCALE_TAG, type Lang } from './consts'

export type NoteEntry = CollectionEntry<'notes'>

/** El idioma sale de la carpeta (`es/<slug>.md`), igual que en los casos. */
export function noteLang(entry: NoteEntry): string {
  return entry.id.split('/')[0] ?? ''
}

export function noteSlug(entry: NoteEntry): string {
  return entry.id.split('/').slice(1).join('/')
}

/** Ruta sin prefijo de idioma: es la que espera `Layout` para armar canonical y hreflang. */
export function notePath(slug: string): string {
  return `/notas/${slug}`
}

/**
 * Notas publicadas de un idioma, la más reciente primero.
 *
 * Cada nota tiene que existir en los dos idiomas. Si falta una, el build falla
 * aquí en vez de publicar un `hreflang` que apunta a una página que no existe.
 */
export async function publishedNotes(lang: Lang): Promise<NoteEntry[]> {
  const all = (await getCollection('notes')).filter((entry) => !entry.data.draft)

  const slugs = (language: string) =>
    new Set(all.filter((entry) => noteLang(entry) === language).map(noteSlug))
  const es = slugs('es')
  const en = slugs('en')
  const sinPareja = [...es].filter((slug) => !en.has(slug)).concat([...en].filter((slug) => !es.has(slug)))

  if (sinPareja.length > 0) {
    throw new Error(
      `Notas sin su versión en el otro idioma: ${sinPareja.join(', ')}. ` +
        'Cada nota necesita un archivo en src/content/notes/es/ y otro en en/ con el mismo nombre.',
    )
  }

  return all
    .filter((entry) => noteLang(entry) === lang)
    .sort((a, b) => b.data.date.getTime() - a.data.date.getTime())
}

/** Minutos de lectura, a 200 palabras por minuto y nunca menos de uno. */
export function readingMinutes(entry: NoteEntry): number {
  const words = (entry.body ?? '').trim().split(/\s+/).length
  return Math.max(1, Math.round(words / 200))
}

/**
 * La fecha en palabras, en UTC para que no baile un día según dónde se compile.
 * - 'long':  "16 de noviembre de 2026" / "November 16, 2026" — cabecera de la nota.
 * - 'short': "16 nov 2026" / "Nov 16, 2026" — listas, donde tiene que caber en una columna.
 */
export function formatNoteDate(date: Date, lang: Lang, style: 'long' | 'short' = 'long'): string {
  const format = new Intl.DateTimeFormat(LOCALE_TAG[lang], {
    day: 'numeric',
    month: style,
    year: 'numeric',
    timeZone: 'UTC',
  })

  if (style === 'long' || lang !== 'es') return format.format(date)

  // En español el formato corto sale "16 de nov de 2026": se arma sin los "de".
  const parts = format.formatToParts(date)
  const pick = (type: string) => parts.find((part) => part.type === type)?.value ?? ''
  return `${pick('day')} ${pick('month').replace('.', '')} ${pick('year')}`
}

/** `2026-11-16`, para el atributo `datetime`. */
export function isoDate(date: Date): string {
  return date.toISOString().slice(0, 10)
}
