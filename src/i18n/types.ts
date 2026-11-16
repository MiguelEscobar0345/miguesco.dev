import type { ExperienceId } from '../experience'
import type { ProjectId } from '../projects'
import type { ExtraId, ServiceId } from './pricing'

/**
 * Contrato del copy. `es.ts` y `en.ts` lo implementan los dos, así que si
 * añades una cadena en un idioma y olvidas el otro, TypeScript avisa antes
 * de que se publique media web sin traducir.
 */

export interface MetaStrings {
  title: string
  description: string
}

export interface ServiceStrings {
  name: string
  tagline: string
  deliverables: string[]
  revisions: string
}

export interface ExtraStrings {
  name: string
  hint: string
}

export interface ExperienceStrings {
  role: string
  org: string
  place: string
  /** Logros concretos. Vacío en la formación, que no los necesita. */
  points: string[]
}

export interface ProjectStrings {
  name: string
  tagline: string
  description: string
  /** Texto alternativo real de la captura, no el nombre del archivo. */
  imageAlt: string
}

export interface UIStrings {
  meta: {
    home: MetaStrings
    notFound: MetaStrings
    ogImageAlt: string
  }

  a11y: {
    skipToContent: string
    toggleTheme: string
    toggleLanguage: string
    toggleCurrency: string
    mainNav: string
    footerNav: string
    opensInNewTab: string
  }

  nav: {
    services: string
    pricing: string
    cases: string
    projects: string
    about: string
    contact: string
  }

  cases: {
    title: string
    lead: string
    /** Enlace de la tarjeta a la página del caso. */
    viewCase: string
    problemLabel: string
    workLabel: string
    resultLabel: string
    stackLabel: string
    clientLabel: string
    serviceLabel: string
    visitSite: string
    back: string
    /** Migas de pan de la página del caso. */
    breadcrumb: string
  }

  hero: {
    available: string
    eyebrow: string
    headline: string
    intro: string
    ctaPrimary: string
    ctaSecondary: string
    responseNote: string
  }

  services: {
    title: string
    lead: string
    items: Record<ServiceId, ServiceStrings>
  }

  pricing: {
    title: string
    lead: string
    currencyLabel: string
    from: string
    timelineLabel: string
    revisionsLabel: string
    depositLabel: string
    ctaBook: string
    ctaQuote: string
    notes: string[]
    /**
     * Plantillas de plazo. `{min}` y `{max}` salen de pricing.ts, así que el
     * plazo de las tarjetas y el que calcula el configurador no pueden diferir.
     */
    timelineDays: string
    timelineWeeks: string
  }

  estimate: {
    title: string
    lead: string
    typeLegend: string
    pagesLegend: string
    /** `{n}` = páginas incluidas en el precio base. */
    pagesHint: string
    /** Línea del resumen para las páginas de más. `{n}` = cuántas. */
    extraPages: string
    extrasLegend: string
    extras: Record<ExtraId, ExtraStrings>
    /** Sustituye a los extras cuando el servicio es "desde" y no se puede calcular. */
    customNote: string
    summaryTitle: string
    totalLabel: string
    cta: string
    ctaQuote: string
    disclaimer: string
    /** Piezas del mensaje de WhatsApp que arma el configurador. */
    messageIntro: string
    messageEstimate: string
    messageOutro: string
    /** `{n}` = número total de páginas. */
    messagePages: string
  }

  experience: {
    title: string
    lead: string
    present: string
    educationLabel: string
    items: Record<ExperienceId, ExperienceStrings>
  }

  projects: {
    title: string
    lead: string
    viewDemo: string
    viewCode: string
    items: Record<ProjectId, ProjectStrings>
  }

  about: {
    title: string
    paragraphs: string[]
    stackTitle: string
  }

  contact: {
    title: string
    lead: string
    whatsapp: string
    email: string
    note: string
  }

  footer: {
    builtWith: string
    github: string
    linkedin: string
    instagram: string
  }

  notFound: {
    code: string
    headline: string
    text: string
    cta: string
  }

  /** Mensajes que se pre-rellenan en el enlace de WhatsApp y en el mailto. */
  messages: {
    generalSubject: string
    generalBody: string
    bookSubject: (service: string) => string
    bookBody: (service: string) => string
    quoteSubject: (service: string) => string
    quoteBody: (service: string) => string
  }
}
