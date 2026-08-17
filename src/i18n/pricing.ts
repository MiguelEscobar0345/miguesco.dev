/**
 * Fuente única de precios.
 *
 * Los dos idiomas y el JSON-LD leen de aquí, así que una tarifa no puede
 * quedar desincronizada entre el español, el inglés y lo que ve Google.
 * Para cambiar un precio, cambia el número y ya.
 */

export const SERVICE_IDS = ['landing', 'website', 'webapp', 'ai'] as const
export type ServiceId = (typeof SERVICE_IDS)[number]

export interface ServicePrice {
  /** Pesos colombianos, sin decimales. */
  cop: number
  /** Dólares estadounidenses. */
  usd: number
  /** true => se muestra como "desde X" y el CTA lleva a cotización. */
  from: boolean
  /** Número de rondas de cambios incluidas. null => se acuerda por proyecto. */
  revisions: number | null
}

export const PRICING: Record<ServiceId, ServicePrice> = {
  landing: { cop: 1_800_000, usd: 450, from: false, revisions: 1 },
  website: { cop: 4_500_000, usd: 1_100, from: false, revisions: 2 },
  webapp: { cop: 8_000_000, usd: 2_000, from: true, revisions: null },
  ai: { cop: 3_500_000, usd: 900, from: true, revisions: null },
}

/** Anticipo necesario para reservar cupo, como fracción del total. */
export const DEPOSIT_RATIO = 0.5

export type Currency = 'cop' | 'usd'
export const CURRENCIES: Currency[] = ['cop', 'usd']

const COP_FORMAT = new Intl.NumberFormat('es-CO', { maximumFractionDigits: 0 })
const USD_FORMAT = new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 })

/**
 * Formatea con el código de moneda visible. En Colombia el símbolo `$` se usa
 * para las dos monedas, así que sin el sufijo el precio es ambiguo.
 */
export function formatPrice(price: ServicePrice, currency: Currency): string {
  return currency === 'cop'
    ? `$${COP_FORMAT.format(price.cop)} COP`
    : `$${USD_FORMAT.format(price.usd)} USD`
}

export function formatDeposit(price: ServicePrice, currency: Currency): string {
  const amount = currency === 'cop' ? price.cop : price.usd
  const deposit = Math.round(amount * DEPOSIT_RATIO)
  return currency === 'cop'
    ? `$${COP_FORMAT.format(deposit)} COP`
    : `$${USD_FORMAT.format(deposit)} USD`
}

/** Valor plano para el `price` del Offer de schema.org. */
export function schemaPrice(price: ServicePrice, currency: Currency): string {
  return String(currency === 'cop' ? price.cop : price.usd)
}
