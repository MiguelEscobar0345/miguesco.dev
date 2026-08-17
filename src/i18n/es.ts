import type { UIStrings } from './types'

export const es: UIStrings = {
  meta: {
    home: {
      title: 'miguesco — Desarrollo web y automatización con IA',
      description:
        'Miguel Escobar, Frontend & AI Developer en Medellín. Landings, sitios web, apps a medida y automatización con IA. Precios públicos y entrega en días.',
    },
    notFound: {
      title: 'Página no encontrada — miguesco',
      description:
        'La página que buscas no existe o cambió de dirección. Vuelve al inicio para ver servicios, precios y proyectos.',
    },
    ogImageAlt:
      'miguesco — Miguel Escobar, Frontend & AI Developer. Desarrollo web y automatización con IA.',
  },

  a11y: {
    skipToContent: 'Saltar al contenido',
    toggleTheme: 'Cambiar entre tema claro y oscuro',
    toggleLanguage: 'Ver esta página en inglés',
    toggleCurrency: 'Cambiar la moneda de los precios',
    mainNav: 'Navegación principal',
    footerNav: 'Navegación del pie de página',
    opensInNewTab: 'se abre en una pestaña nueva',
  },

  nav: {
    services: 'Servicios',
    pricing: 'Precios',
    cases: 'Casos',
    projects: 'Proyectos',
    about: 'Sobre mí',
    contact: 'Contacto',
  },

  cases: {
    title: 'Casos',
    lead: 'Trabajos reales con clientes reales: qué problema tenían, qué hice y qué cambió después.',
    viewCase: 'Ver el caso',
    problemLabel: 'El problema',
    workLabel: 'Qué hice',
    resultLabel: 'El resultado',
    stackLabel: 'Con qué',
    clientLabel: 'Cliente',
    serviceLabel: 'Servicio',
    visitSite: 'Visitar el sitio',
    back: 'Volver a los casos',
    breadcrumb: 'Casos',
  },

  hero: {
    available: 'Disponible para proyectos',
    eyebrow: 'Hola, soy Miguel Escobar',
    headline: 'Construyo webs rápidas, apps a medida e integraciones con IA.',
    intro:
      'Frontend & AI Developer en Medellín, con tres años construyendo producto. Pasé por Globant —donde me promovieron de practicante a desarrollador interno— y hoy automatizo procesos internos en Tres Trigos. Trabajo con React, Next.js y Node, y meto IA donde de verdad ahorra tiempo.',
    ctaPrimary: 'Escríbeme por WhatsApp',
    ctaSecondary: 'Enviar un correo',
    responseNote: 'Respondo el mismo día hábil · Medellín, GMT-5',
  },

  services: {
    title: 'Servicios',
    lead: 'Cuatro maneras de trabajar juntos. Todas terminan igual: el sitio funcionando en producción y el código en tu propio GitHub.',
    items: {
      landing: {
        name: 'Landing page',
        tagline: 'Una página con un solo objetivo: que quien entre te escriba.',
        deliverables: [
          'Diseño a medida, pensado primero para móvil',
          'Estructura y textos ordenados para convertir',
          'Botón de WhatsApp o formulario integrado',
          'Despliegue, dominio conectado y métricas básicas',
        ],
        timeline: '5 a 7 días hábiles',
        revisions: '1 ronda de cambios',
      },
      website: {
        name: 'Sitio web multipágina',
        tagline: 'De 3 a 5 páginas para negocios que tienen más de una cosa que contar.',
        deliverables: [
          '3 a 5 páginas diseñadas a medida',
          'Navegación y jerarquía pensadas para SEO',
          'Metadatos, sitemap y datos estructurados listos',
          'Verificado en móvil, tablet y escritorio',
        ],
        timeline: '10 a 14 días hábiles',
        revisions: '2 rondas de cambios',
      },
      webapp: {
        name: 'Web app a medida',
        tagline: 'Cuando ya no basta una web: cuentas de usuario, paneles y datos en vivo.',
        deliverables: [
          'Frontend en React o Next.js con TypeScript',
          'API propia en Node.js y base de datos',
          'Autenticación, roles y panel de administración',
          'Integración con las APIs y servicios que ya usas',
        ],
        timeline: '3 a 5 semanas',
        revisions: 'Rondas a convenir',
      },
      ai: {
        name: 'Automatización + IA',
        tagline: 'El trabajo repetitivo de tu equipo, hecho por software.',
        deliverables: [
          'Asistente que responde sobre tus propios documentos (RAG)',
          'Agentes que atienden WhatsApp o correo',
          'Flujos con Power Automate, n8n o código a medida',
          'Medimos las horas antes y después: si no ahorra, no sirve',
        ],
        timeline: '1 a 3 semanas',
        revisions: 'Rondas a convenir',
      },
    },
  },

  pricing: {
    title: 'Precios',
    lead: 'Publicados, para que no tengas que agendar una reunión sólo para saber cuánto cuesta. Reservas con el 50% y pagas el resto al entregar.',
    currencyLabel: 'Moneda',
    from: 'desde',
    timelineLabel: 'Entrega',
    revisionsLabel: 'Incluye',
    depositLabel: 'Anticipo',
    ctaBook: 'Reservar cupo',
    ctaQuote: 'Pedir cotización',
    notes: [
      'Trabajo con pocos proyectos a la vez, así que la fecha de inicio depende del mes. Escríbeme y te la confirmo antes de que pagues nada.',
      'El dominio y el hosting los contratas tú directamente, a tu nombre. Suelen costar entre 15 y 60 USD al año y no cobro comisión por eso.',
      'Si tu proyecto no encaja en ninguna de las cuatro casillas, cuéntamelo igual y te digo un número.',
    ],
  },

  projects: {
    title: 'Proyectos',
    lead: 'Dos productos propios, en producción y con el código abierto. Puedes abrirlos ahora mismo y romperlos si quieres.',
    viewDemo: 'Ver demo',
    viewCode: 'Código',
    items: {
      mepulse: {
        name: 'MePulse',
        tagline: 'Mercado cripto en tiempo real',
        description:
          'Dashboard con las 50 criptomonedas más grandes por capitalización, sparklines de 7 días dibujadas a mano en SVG y un modal con el histórico de 30 días. Lo interesante está detrás: monté una capa de funciones serverless en Vercel para saltar el CORS de CoinGecko, con caché en memoria y guardas de StrictMode para no chocar contra el límite de peticiones del plan gratuito.',
        imageAlt:
          'Panel de MePulse con la tabla de criptomonedas por capitalización de mercado y sus gráficas de siete días',
      },
      meatmos: {
        name: 'MeAtmos',
        tagline: 'Clima y calidad del aire',
        description:
          'Panel meteorológico para cualquier ciudad del mundo: condiciones actuales, línea de tiempo de 24 horas, pronóstico a 7 días e índice de calidad del aire en escala europea con PM2.5, PM10, ozono y NO₂. El fondo cambia según el clima que esté haciendo. Todo sobre las APIs abiertas de Open-Meteo, sin una sola clave que gestionar.',
        imageAlt:
          'Panel de MeAtmos mostrando la temperatura actual, el pronóstico de siete días y el índice de calidad del aire',
      },
    },
  },

  about: {
    title: 'Sobre mí',
    paragraphs: [
      'Estudié análisis y desarrollo de software en el SENA y entré a Globant como practicante. Me quedé: me promovieron a desarrollador interno después de aportar en herramientas internas, aplicaciones de cliente e iniciativas de innovación, trabajando en inglés con equipos remotos.',
      'Ahí construí OurSpaces, una herramienta full-stack para gestionar salas de reuniones —componentes de React reutilizables, filtros en el cliente y una API en Node y Express—, y funcionalidades móviles en React Native para Builder.ai.',
      'Hoy, en Tres Trigos, hago aplicaciones de soporte con PowerApps y Power Automate. La app de tickets que diseñé subió un 80% la productividad del equipo. Ese número es lo que me interesa de este trabajo: no el stack, sino lo que cambia después de instalarlo.',
      'Fuera de la oficina estoy metido en LLMs, asistentes RAG y agentes. Es lo que más me divierte construir, y por eso lo ofrezco como servicio.',
    ],
    stackTitle: 'Con lo que trabajo',
  },

  contact: {
    title: 'Hablemos',
    lead: 'Cuéntame qué necesitas y te respondo si puedo ayudarte, cuánto cuesta y para cuándo lo tendrías. Sin compromiso y sin una reunión de una hora sólo para eso.',
    whatsapp: 'Escribir por WhatsApp',
    email: 'Enviar un correo',
    note: 'Respondo el mismo día hábil, hora de Colombia (GMT-5). También trabajo en inglés (C1) si tu equipo lo necesita.',
  },

  footer: {
    builtWith: 'Hecho con Astro y Tailwind. Sin plantillas.',
    github: 'GitHub',
    linkedin: 'LinkedIn',
    instagram: 'Instagram',
  },

  notFound: {
    code: 'Error 404',
    headline: 'Esta página no existe',
    text: 'El enlace que seguiste no lleva a ninguna parte. Puede que la haya movido o que la dirección tenga una errata.',
    cta: 'Volver al inicio',
  },

  messages: {
    generalSubject: 'Consulta desde miguesco.dev',
    generalBody:
      'Hola Miguel, vi tu web y quiero contarte sobre un proyecto.\n\nQué necesito:\n\nPara cuándo:\n\nPresupuesto aproximado:\n',
    bookSubject: (service) => `Quiero reservar cupo — ${service}`,
    bookBody: (service) =>
      `Hola Miguel, quiero reservar cupo para un proyecto de ${service}.\n\nDe qué se trata:\n\nPara cuándo lo necesito:\n`,
    quoteSubject: (service) => `Cotización — ${service}`,
    quoteBody: (service) =>
      `Hola Miguel, necesito una cotización de ${service}.\n\nQué quiero resolver:\n\nQué herramientas usamos hoy:\n\nPara cuándo:\n`,
  },
}
