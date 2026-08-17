import type { ServiceId } from './pricing'
import type { ProjectId } from '../projects'

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
  timeline: string
  revisions: string
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
