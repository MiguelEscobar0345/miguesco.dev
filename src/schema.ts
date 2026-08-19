import { CONTACT, LOCALE_TAG, SITE, type Lang } from './consts'
import { PRICING, SERVICE_IDS } from './i18n/pricing'
import type { UIStrings } from './i18n/types'

/**
 * JSON-LD del sitio. Los precios salen de `pricing.ts`, los mismos que se ven
 * en pantalla: si cambias una tarifa, Google ve la nueva sin tocar nada más.
 */

const PERSON_ID = `${SITE.url}/#person`
const BUSINESS_ID = `${SITE.url}/#business`
const WEBSITE_ID = `${SITE.url}/#website`

function address() {
  return {
    '@type': 'PostalAddress',
    addressLocality: SITE.location.city,
    addressRegion: SITE.location.region,
    addressCountry: SITE.location.country,
  }
}

function offerCatalog(t: UIStrings) {
  return {
    '@type': 'OfferCatalog',
    name: t.services.title,
    itemListElement: SERVICE_IDS.map((id) => {
      const price = PRICING[id]
      const copy = t.services.items[id]

      // "desde X" se modela con minPrice; un precio cerrado, con price.
      const spec = (currency: 'COP' | 'USD', amount: number) => ({
        '@type': 'UnitPriceSpecification',
        priceCurrency: currency,
        ...(price.from ? { minPrice: amount } : { price: amount }),
        valueAddedTaxIncluded: false,
      })

      return {
        '@type': 'Offer',
        name: copy.name,
        description: copy.tagline,
        priceSpecification: [spec('COP', price.cop), spec('USD', price.usd)],
        itemOffered: {
          '@type': 'Service',
          name: copy.name,
          description: copy.tagline,
          serviceType: copy.name,
          provider: { '@id': BUSINESS_ID },
        },
      }
    }),
  }
}

export function buildSchema(options: {
  lang: Lang
  t: UIStrings
  canonical: string
  ogImage: string
  isHome: boolean
}) {
  const { lang, t, canonical, ogImage, isHome } = options
  const locale = LOCALE_TAG[lang]

  const person = {
    '@type': 'Person',
    '@id': PERSON_ID,
    name: SITE.author,
    alternateName: SITE.name,
    givenName: 'Miguel',
    familyName: 'Escobar',
    jobTitle: SITE.jobTitle,
    url: SITE.url,
    email: `mailto:${CONTACT.email}`,
    telephone: `+${CONTACT.whatsapp}`,
    address: address(),
    sameAs: [CONTACT.github, CONTACT.linkedin, CONTACT.instagram],
    knowsLanguage: ['es', 'en'],
    knowsAbout: [
      'Frontend development',
      'React',
      'Next.js',
      'Astro',
      'TypeScript',
      'Node.js',
      'Large language models',
      'Retrieval augmented generation',
      'Workflow automation',
    ],
  }

  const business = {
    '@type': 'ProfessionalService',
    '@id': BUSINESS_ID,
    name: SITE.name,
    description: t.meta.home.description,
    url: SITE.url,
    image: ogImage,
    email: `mailto:${CONTACT.email}`,
    telephone: `+${CONTACT.whatsapp}`,
    address: address(),
    founder: { '@id': PERSON_ID },
    employee: { '@id': PERSON_ID },
    areaServed: [
      { '@type': 'Country', name: 'Colombia' },
      { '@type': 'Place', name: 'Remote worldwide' },
    ],
    availableLanguage: ['es', 'en'],
    priceRange: `${PRICING.landing.usd}–${PRICING.webapp.usd} USD`,
    hasOfferCatalog: offerCatalog(t),
  }

  /**
   * Las referencias por `@id` sólo se emiten si la entidad viaja en el mismo
   * grafo. La 404 lleva un grafo reducido, y apuntar desde ahí a `#person` o
   * `#business` dejaría el dato sin sujeto: Google lo descarta en silencio.
   */
  const website = {
    '@type': 'WebSite',
    '@id': WEBSITE_ID,
    name: SITE.name,
    url: SITE.url,
    inLanguage: locale,
    ...(isHome ? { publisher: { '@id': BUSINESS_ID } } : {}),
  }

  /**
   * Tipo `WebPage`, no `ProfilePage`.
   *
   * `ProfilePage` es para páginas que perfilan a una persona dentro de una
   * plataforma —un foro, una red social—, y Google le exige `mainEntity`. Al
   * declararlo sin esa propiedad, Search Console marcaba «1 elemento no válido».
   *
   * Además la portada no es un perfil: es una página de servicios. `WebPage`
   * es lo honesto, no tiene requisitos que incumplir, y el vínculo con la
   * persona se mantiene explícito con `mainEntity` y `about`.
   */
  const webPage = {
    '@type': 'WebPage',
    '@id': `${canonical}#webpage`,
    url: canonical,
    name: isHome ? t.meta.home.title : t.meta.notFound.title,
    description: isHome ? t.meta.home.description : t.meta.notFound.description,
    inLanguage: locale,
    isPartOf: { '@id': WEBSITE_ID },
    ...(isHome ? { mainEntity: { '@id': PERSON_ID }, about: { '@id': PERSON_ID } } : {}),
    primaryImageOfPage: ogImage,
  }

  return {
    '@context': 'https://schema.org',
    '@graph': isHome ? [person, business, website, webPage] : [website, webPage],
  }
}
