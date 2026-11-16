import { DEFAULT_LANG, type Lang } from '../consts'
import type { Timeline } from './pricing'
import type { UIStrings } from './types'
import { es } from './es'
import { en } from './en'

export const ui: Record<Lang, UIStrings> = { es, en }

/** El idioma "al que se puede cambiar" desde el actual. Con dos idiomas es el otro. */
export const OTHER_LANG: Record<Lang, Lang> = { es: 'en', en: 'es' }

/** Etiqueta corta del selector de idioma. */
export const LANG_LABEL: Record<Lang, string> = { es: 'ES', en: 'EN' }

export function useTranslations(lang: Lang): UIStrings {
  return ui[lang]
}

/** Sustituye `{clave}` en una plantilla: `fill('{n} páginas', { n: 8 })`. */
export function fill(template: string, values: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (match, key: string) =>
    key in values ? String(values[key]) : match,
  )
}

/**
 * El plazo en palabras. Los números vienen de pricing.ts y la frase del idioma,
 * así que las tarjetas, el configurador y el llms.txt dicen siempre lo mismo.
 */
export function formatTimeline(t: UIStrings, timeline: Timeline): string {
  const template = timeline.unit === 'days' ? t.pricing.timelineDays : t.pricing.timelineWeeks
  return fill(template, { min: timeline.min, max: timeline.max })
}

/**
 * Añade o quita el prefijo de idioma a una ruta interna.
 * `localizePath('/', 'en')` => `/en/`; `localizePath('/404', 'es')` => `/404`.
 */
export function localizePath(path: string, lang: Lang): string {
  const clean = path.startsWith('/') ? path : `/${path}`
  if (lang === DEFAULT_LANG) return clean
  return clean === '/' ? '/en/' : `/en${clean}`
}
