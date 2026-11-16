/**
 * Fuente única de precios y plazos.
 *
 * Las tarjetas, el configurador, el llms.txt y el JSON-LD leen de aquí, así
 * que una tarifa no puede quedar desincronizada entre el español, el inglés,
 * lo que calcula el configurador y lo que ve Google.
 * Para cambiar un precio o un plazo, cambia el número y ya.
 */

export const SERVICE_IDS = ['landing', 'website', 'webapp', 'ai'] as const
export type ServiceId = (typeof SERVICE_IDS)[number]

/** Plazo de entrega. Los días son hábiles. */
export interface Timeline {
  unit: 'days' | 'weeks'
  min: number
  max: number
}

export interface ServicePrice {
  /** Pesos colombianos, sin decimales. */
  cop: number
  /** Dólares estadounidenses. */
  usd: number
  /** true => se muestra como "desde X" y el CTA lleva a cotización. */
  from: boolean
  /** Número de rondas de cambios incluidas. null => se acuerda por proyecto. */
  revisions: number | null
  timeline: Timeline
}

export const PRICING: Record<ServiceId, ServicePrice> = {
  landing: {
    cop: 1_800_000,
    usd: 450,
    from: false,
    revisions: 1,
    timeline: { unit: 'days', min: 5, max: 7 },
  },
  website: {
    cop: 4_500_000,
    usd: 1_100,
    from: false,
    revisions: 2,
    timeline: { unit: 'days', min: 10, max: 14 },
  },
  webapp: {
    cop: 8_000_000,
    usd: 2_000,
    from: true,
    revisions: null,
    timeline: { unit: 'weeks', min: 3, max: 5 },
  },
  ai: {
    cop: 3_500_000,
    usd: 900,
    from: true,
    revisions: null,
    timeline: { unit: 'weeks', min: 1, max: 3 },
  },
}

/** Anticipo necesario para reservar cupo, como fracción del total. */
export const DEPOSIT_RATIO = 0.5

// ── Configurador ─────────────────────────────────────────────────────────────

/**
 * Extras que se pueden sumar a una landing o a un sitio web en el configurador.
 * Cada uno añade precio y días hábiles al estimado.
 */
export const EXTRA_IDS = ['language', 'copy', 'assistant'] as const
export type ExtraId = (typeof EXTRA_IDS)[number]

export interface Extra {
  cop: number
  usd: number
  /** Días hábiles que añade al plazo: [mínimo, máximo]. */
  days: [number, number]
  /** true => su precio es "desde", y contagia el "desde" al total. */
  from: boolean
}

export const EXTRAS: Record<ExtraId, Extra> = {
  /** Segundo idioma: el sitio completo en español e inglés, con su selector. */
  language: { cop: 600_000, usd: 150, days: [2, 3], from: false },
  /** Redacción de los textos, cuando el cliente no los trae. */
  copy: { cop: 500_000, usd: 125, days: [2, 3], from: false },
  /**
   * Un asistente con IA dentro del sitio. Es el servicio de automatización
   * sumado a una web, así que hereda su precio de entrada en vez de repetirlo.
   */
  assistant: { cop: PRICING.ai.cop, usd: PRICING.ai.usd, days: [5, 10], from: true },
}

/** Páginas del sitio web multipágina: cuántas incluye el precio y cuánto cuesta cada una de más. */
export const PAGES = {
  min: 3,
  included: 5,
  max: 10,
  extra: { cop: 400_000, usd: 100, days: 1 },
} as const

/** Servicios que el configurador puede calcular: precio cerrado, sin "desde". */
export function isConfigurable(id: ServiceId): boolean {
  return !PRICING[id].from
}

// ── Formato ──────────────────────────────────────────────────────────────────

export type Currency = 'cop' | 'usd'
export const CURRENCIES: Currency[] = ['cop', 'usd']

/** Los mismos locales que usa el configurador en el navegador: deben coincidir. */
export const CURRENCY_LOCALE: Record<Currency, string> = { cop: 'es-CO', usd: 'en-US' }

const FORMATS: Record<Currency, Intl.NumberFormat> = {
  cop: new Intl.NumberFormat(CURRENCY_LOCALE.cop, { maximumFractionDigits: 0 }),
  usd: new Intl.NumberFormat(CURRENCY_LOCALE.usd, { maximumFractionDigits: 0 }),
}

/**
 * Formatea con el código de moneda visible. En Colombia el símbolo `$` se usa
 * para las dos monedas, así que sin el sufijo el precio es ambiguo.
 */
export function formatAmount(amount: number, currency: Currency): string {
  return `$${FORMATS[currency].format(amount)} ${currency.toUpperCase()}`
}

export function formatPrice(price: { cop: number; usd: number }, currency: Currency): string {
  return formatAmount(price[currency], currency)
}

export function formatDeposit(price: { cop: number; usd: number }, currency: Currency): string {
  return formatAmount(Math.round(price[currency] * DEPOSIT_RATIO), currency)
}

/** Valor plano para el `price` del Offer de schema.org. */
export function schemaPrice(price: ServicePrice, currency: Currency): string {
  return String(price[currency])
}
