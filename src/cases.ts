import { getCollection, type CollectionEntry } from 'astro:content'

import type { Lang } from './consts'

export type CaseEntry = CollectionEntry<'cases'>

/**
 * El idioma sale de la carpeta (`es/<slug>.md`), no del frontmatter: así no
 * puede haber un archivo en `en/` que se declare español.
 */
export function caseLang(entry: CaseEntry): string {
  return entry.id.split('/')[0] ?? ''
}

export function caseSlug(entry: CaseEntry): string {
  return entry.id.split('/').slice(1).join('/')
}

/** Ruta de la página del caso, ya con el prefijo de idioma que toque. */
export function casePath(slug: string, lang: Lang): string {
  return lang === 'es' ? `/casos/${slug}` : `/en/casos/${slug}`
}

/**
 * Casos publicados de un idioma, ordenados. Los borradores no salen ni en la
 * portada ni generan página, así que se puede dejar una plantilla en el repo
 * sin que llegue a producción.
 */
export async function publishedCases(lang: Lang): Promise<CaseEntry[]> {
  const all = await getCollection('cases')
  return all
    .filter((entry) => caseLang(entry) === lang && !entry.data.draft)
    .sort((a, b) => a.data.order - b.data.order)
}
