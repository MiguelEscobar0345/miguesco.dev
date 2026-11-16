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
    notes: {
      title: 'Notas — miguesco',
      description:
        'Notas técnicas de Miguel Escobar: problemas reales al construir webs, cómo di con la causa y qué cambié. Cortas y con el código a la vista.',
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
    notes: 'Notas',
    about: 'Sobre mí',
    contact: 'Contacto',
  },

  notes: {
    title: 'Notas',
    lead: 'Problemas reales que me encontré construyendo, cómo di con la causa y qué cambié. Cortas y con el código a la vista.',
    all: 'Todas las notas',
    back: 'Notas',
    readingTime: '{n} min de lectura',
    updated: 'Actualizada el {date}',
    outro: '¿Te pasó algo parecido, o lo habrías resuelto de otra forma? Escríbeme y lo hablamos.',
    outroCta: 'Escribir por WhatsApp',
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
    timelineDays: '{min} a {max} días hábiles',
    timelineWeeks: '{min} a {max} semanas',
  },

  estimate: {
    title: 'Arma tu presupuesto',
    lead: 'Marca lo que necesitas. El precio y el plazo se calculan aquí mismo, y el resumen se va contigo a WhatsApp.',
    typeLegend: 'Tipo de proyecto',
    pagesLegend: 'Páginas',
    pagesHint: 'Hasta {n} van incluidas. Cada página de más suma al precio y un día al plazo.',
    extraPages: 'Páginas adicionales × {n}',
    extrasLegend: 'Extras',
    extras: {
      language: {
        name: 'Segundo idioma',
        hint: 'Todo el sitio en español e inglés, con su selector.',
      },
      copy: {
        name: 'Redacción de textos',
        hint: 'Los escribo yo a partir de una conversación contigo.',
      },
      assistant: {
        name: 'Asistente con IA',
        hint: 'Un chat que responde a tus clientes con tu propia información.',
      },
    },
    customNote:
      'Esto no se cotiza con tres casillas. El número es el punto de partida: el precio cerrado te lo doy por escrito después de una llamada de 30 minutos.',
    summaryTitle: 'Tu estimado',
    totalLabel: 'Total',
    cta: 'Enviar por WhatsApp',
    ctaQuote: 'Pedir cotización por WhatsApp',
    disclaimer:
      'Es un estimado. El precio final queda por escrito en la propuesta antes de que pagues nada.',
    messageIntro: 'Hola Miguel, armé este presupuesto en miguesco.dev:',
    messageEstimate: 'Estimado',
    messageOutro: 'Mi negocio es:',
    messagePages: '{n} páginas',
  },

  experience: {
    title: 'Trayectoria',
    lead: 'Tres años construyendo producto: primero dentro de una multinacional, ahora automatizando una empresa por dentro.',
    present: 'Actualidad',
    educationLabel: 'Formación',
    items: {
      trestrigos: {
        role: 'Web UI & Frontend Developer',
        org: 'Tres Trigos',
        place: 'Medellín',
        points: [
          'Diseñé y construí la app de soporte por tickets sobre PowerApps, Power Automate y Dataverse. La productividad del equipo subió un 80%.',
          'Automaticé flujos del área de contabilidad para quitarle pasos manuales y riesgo a sus procesos.',
          'Páginas a medida en HTML, CSS y JavaScript, integradas con WordPress.',
        ],
      },
      globant: {
        role: 'Web UI Developer',
        org: 'Globant',
        place: 'Medellín · equipos remotos, en inglés',
        points: [
          'Entré como practicante y me promovieron a desarrollador interno.',
          'OurSpaces, una herramienta full-stack para reservar salas de reuniones: componentes de React con Vite, filtros en el cliente y una API en Node y Express.',
          'Funcionalidades móviles en React Native para Builder.ai, y pruebas de concepto para visitas de clientes y hackatones.',
        ],
      },
      sena: {
        role: 'Tecnología en Análisis y Desarrollo de Software',
        org: 'SENA',
        place: 'Medellín',
        points: [],
      },
    },
  },

  projects: {
    title: 'Proyectos',
    lead: 'Dos productos propios, en producción y con el código abierto. Puedes abrirlos ahora mismo y romperlos si quieres.',
    viewDemo: 'Ver demo',
    viewCode: 'Código',
    items: {
      mepulse: {
        name: 'MePulse',
        tagline: 'Mercado cripto en vivo',
        description:
          'Precios que se mueven en tiempo real por el WebSocket de Binance, un mapa de calor del top 50 —el área es la capitalización y el color, el cambio— y una página por moneda con un gráfico que se recorre con el puntero o las flechas. Por dentro: funciones serverless en Vercel con caché en el edge para no chocar contra el límite de CoinGecko, y los precios se agrupan para que 50 cambios por segundo cuesten un solo render.',
        imageAlt:
          'MePulse en tema oscuro: la capitalización total del mercado cripto en cifras grandes, una frase que resume el día, la barra de cuántas monedas suben y bajan, y el mapa de calor del top 50',
      },
      meatmos: {
        name: 'MeAtmos',
        tagline: 'El clima, a la hora de allá',
        description:
          'Buscas una ciudad y la tarjeta principal se vuelve una ventana a su cielo: lluvia inclinada por el viento real, niebla, nubes según la nubosidad y estrellas de noche, dibujadas en canvas y a la hora local de esa ciudad. Debajo, una frase que resume el día, la curva de 24 horas para recorrer con el puntero, 7 días, calidad del aire, viento y sol. Todo sobre las APIs abiertas de Open-Meteo, sin una sola clave que gestionar.',
        imageAlt:
          'MeAtmos con el clima de Medellín: la temperatura actual sobre el cielo dibujado de ese momento, una frase que resume las próximas horas y la curva de las siguientes 24 horas',
      },
    },
  },

  about: {
    title: 'Sobre mí',
    paragraphs: [
      'De cada proyecto me quedo con una sola pregunta: qué cambió después de instalarlo. El stack importa menos que ese número, y por eso antes de escribir código pregunto cómo vamos a medir que funcionó.',
      'Trabajo en español y en inglés (C1) —en Globant el día a día era con equipos remotos— y prefiero llevar pocos proyectos a la vez para poder responder el mismo día.',
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
