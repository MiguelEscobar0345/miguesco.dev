/**
 * Datos que se repiten por todo el sitio. Un solo sitio donde cambiarlos.
 * No importa nada de Astro: `astro.config.mjs` también lee de aquí.
 */

export const SITE = {
  name: 'miguesco',
  /** Cambia esto el día que apuntes el dominio. Afecta canonical, sitemap y og:image. */
  url: 'https://miguesco.dev',
  author: 'Miguel Escobar',
  fullName: 'Miguel Eduardo Escobar Pereira',
  jobTitle: 'Frontend & AI Developer',
  location: {
    city: 'Medellín',
    region: 'Antioquia',
    country: 'CO',
    countryName: 'Colombia',
  },
  /** Zona horaria en la que respondo. Se usa en el copy de contacto. */
  timezone: 'GMT-5',
} as const

export const CONTACT = {
  /**
   * Va por Cloudflare Email Routing, que reenvía a la bandeja de Gmail de
   * siempre. En una página que publica precios, un @gmail.com resta.
   */
  email: 'hola@miguesco.dev',
  /** Formato internacional sin signos, tal y como lo quiere wa.me */
  whatsapp: '573151569787',
  whatsappDisplay: '+57 315 156 9787',
  github: 'https://github.com/MiguelEscobar0345',
  linkedin: 'https://www.linkedin.com/in/miguel-escobar-p',
  instagram: 'https://www.instagram.com/escomiguep',
} as const

/** Enlace de WhatsApp con el primer mensaje ya escrito, para bajar la fricción. */
export function whatsappUrl(message: string): string {
  return `https://wa.me/${CONTACT.whatsapp}?text=${encodeURIComponent(message)}`
}

/**
 * Nada de `URLSearchParams` aquí: codifica los espacios como `+`, que es lo que
 * pide un formulario HTML pero no lo que entiende `mailto:` (RFC 6068, que usa
 * percent-encoding). Con URLSearchParams, Gmail abre el borrador con el asunto
 * lleno de signos de suma.
 */
export function mailtoUrl(subject: string, body?: string): string {
  const params = [`subject=${encodeURIComponent(subject)}`]
  if (body) params.push(`body=${encodeURIComponent(body)}`)
  return `mailto:${CONTACT.email}?${params.join('&')}`
}

export const LANGUAGES = ['es', 'en'] as const
export type Lang = (typeof LANGUAGES)[number]

export const DEFAULT_LANG: Lang = 'es'

/** Etiqueta BCP-47 completa, para <html lang>, hreflang y sitemap. */
export const LOCALE_TAG: Record<Lang, string> = {
  es: 'es-CO',
  en: 'en',
}

export const OG_LOCALE: Record<Lang, string> = {
  es: 'es_CO',
  en: 'en_US',
}
