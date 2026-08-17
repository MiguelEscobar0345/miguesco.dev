import type { UIStrings } from './types'

export const en: UIStrings = {
  meta: {
    home: {
      title: 'miguesco — Web development and AI automation',
      description:
        'Miguel Escobar, Frontend & AI Developer based in Medellín. Landing pages, websites, custom web apps and AI automation. Public pricing, delivery in days.',
    },
    notFound: {
      title: 'Page not found — miguesco',
      description:
        'The page you are looking for does not exist or has moved. Head back home for services, pricing and projects.',
    },
    ogImageAlt:
      'miguesco — Miguel Escobar, Frontend & AI Developer. Web development and AI automation.',
  },

  a11y: {
    skipToContent: 'Skip to content',
    toggleTheme: 'Switch between light and dark theme',
    toggleLanguage: 'View this page in Spanish',
    toggleCurrency: 'Change the pricing currency',
    mainNav: 'Main navigation',
    footerNav: 'Footer navigation',
    opensInNewTab: 'opens in a new tab',
  },

  nav: {
    services: 'Services',
    pricing: 'Pricing',
    cases: 'Case studies',
    projects: 'Projects',
    about: 'About',
    contact: 'Contact',
  },

  cases: {
    title: 'Case studies',
    lead: 'Real work for real clients: the problem they had, what I did, and what changed afterwards.',
    viewCase: 'Read the case',
    problemLabel: 'The problem',
    workLabel: 'What I did',
    resultLabel: 'The result',
    stackLabel: 'Built with',
    clientLabel: 'Client',
    serviceLabel: 'Service',
    visitSite: 'Visit the site',
    back: 'Back to case studies',
    breadcrumb: 'Case studies',
  },

  hero: {
    available: 'Available for new projects',
    eyebrow: "Hi, I'm Miguel Escobar",
    headline: 'I build fast websites, custom web apps and AI integrations.',
    intro:
      'Frontend & AI Developer based in Medellín, three years shipping product. I came up through Globant —promoted from intern to in-house developer— and today I automate internal processes at Tres Trigos. I work with React, Next.js and Node, and I bring AI in where it actually saves time.',
    ctaPrimary: 'Message me on WhatsApp',
    ctaSecondary: 'Send an email',
    responseNote: 'I reply the same business day · Medellín, GMT-5',
  },

  services: {
    title: 'Services',
    lead: 'Four ways to work together. They all end the same way: the site live in production and the code in your own GitHub.',
    items: {
      landing: {
        name: 'Landing page',
        tagline: 'One page with one job: getting the visitor to write to you.',
        deliverables: [
          'Custom design, built mobile-first',
          'Structure and copy arranged to convert',
          'WhatsApp button or contact form built in',
          'Deployment, domain hookup and basic analytics',
        ],
        timeline: '5 to 7 business days',
        revisions: '1 round of revisions',
      },
      website: {
        name: 'Multi-page website',
        tagline: '3 to 5 pages for businesses with more than one thing to say.',
        deliverables: [
          '3 to 5 custom-designed pages',
          'Navigation and hierarchy built for SEO',
          'Metadata, sitemap and structured data in place',
          'Verified on mobile, tablet and desktop',
        ],
        timeline: '10 to 14 business days',
        revisions: '2 rounds of revisions',
      },
      webapp: {
        name: 'Custom web app',
        tagline: 'When a website is no longer enough: user accounts, dashboards, live data.',
        deliverables: [
          'React or Next.js frontend with TypeScript',
          'Your own Node.js API and database',
          'Authentication, roles and an admin panel',
          'Integration with the APIs and services you already use',
        ],
        timeline: '3 to 5 weeks',
        revisions: 'Revisions agreed per project',
      },
      ai: {
        name: 'AI & automation',
        tagline: "Your team's repetitive work, handed over to software.",
        deliverables: [
          'Assistant that answers from your own documents (RAG)',
          'Agents that handle WhatsApp or email',
          'Workflows with Power Automate, n8n or custom code',
          "We measure the hours before and after: if it doesn't save time, it isn't worth it",
        ],
        timeline: '1 to 3 weeks',
        revisions: 'Revisions agreed per project',
      },
    },
  },

  pricing: {
    title: 'Pricing',
    lead: 'Published up front, so you never have to book a call just to find out the number. You reserve with 50% and pay the rest on delivery.',
    currencyLabel: 'Currency',
    from: 'from',
    timelineLabel: 'Delivery',
    revisionsLabel: 'Includes',
    depositLabel: 'Deposit',
    ctaBook: 'Reserve a slot',
    ctaQuote: 'Request a quote',
    notes: [
      "I take on few projects at a time, so the start date depends on the month. Write to me and I'll confirm it before you pay anything.",
      'You buy the domain and hosting directly, in your own name. They usually run 15 to 60 USD a year and I take no cut of that.',
      "If your project doesn't fit any of the four boxes, tell me anyway and I'll give you a number.",
    ],
  },

  projects: {
    title: 'Projects',
    lead: 'Two products of my own, live in production and open source. You can open them right now and try to break them.',
    viewDemo: 'Live demo',
    viewCode: 'Source',
    items: {
      mepulse: {
        name: 'MePulse',
        tagline: 'Real-time crypto market',
        description:
          'A dashboard covering the 50 largest cryptocurrencies by market cap, with 7-day sparklines hand-drawn in SVG and a modal holding 30 days of history. The interesting part is behind it: I built a Vercel serverless layer to get around CoinGecko’s CORS policy, with in-memory caching and StrictMode guards so it never hits the free tier’s rate limit.',
        imageAlt:
          'MePulse dashboard showing the cryptocurrency table ranked by market cap with their seven-day charts',
      },
      meatmos: {
        name: 'MeAtmos',
        tagline: 'Weather and air quality',
        description:
          'A weather dashboard for any city in the world: current conditions, a 24-hour timeline, a 7-day forecast and the air quality index on the European scale with PM2.5, PM10, ozone and NO₂. The background shifts with the weather outside. All of it on Open-Meteo’s open APIs, without a single key to manage.',
        imageAlt:
          'MeAtmos dashboard showing the current temperature, the seven-day forecast and the air quality index',
      },
    },
  },

  about: {
    title: 'About me',
    paragraphs: [
      'I studied software analysis and development at SENA and joined Globant as an intern. I stayed: they promoted me to in-house developer after I contributed to internal tools, client-facing applications and innovation initiatives, working in English with remote teams.',
      'There I built OurSpaces, a full-stack tool for managing meeting rooms —reusable React components, client-side filtering and a Node and Express API— plus mobile features in React Native for Builder.ai.',
      'Today, at Tres Trigos, I build support applications with PowerApps and Power Automate. The ticketing app I designed raised the team’s productivity by 80%. That number is what interests me about this work: not the stack, but what changes after you install it.',
      'Outside the office I am deep in LLMs, RAG assistants and agents. It is what I most enjoy building, which is why I offer it as a service.',
    ],
    stackTitle: 'What I work with',
  },

  contact: {
    title: "Let's talk",
    lead: "Tell me what you need and I'll come back with whether I can help, what it costs and when you would have it. No commitment, and no hour-long call just to get there.",
    whatsapp: 'Message on WhatsApp',
    email: 'Send an email',
    note: 'I reply the same business day, Colombia time (GMT-5). I also work in English (C1) if your team needs it.',
  },

  footer: {
    builtWith: 'Built with Astro and Tailwind. No templates.',
    github: 'GitHub',
    linkedin: 'LinkedIn',
    instagram: 'Instagram',
  },

  notFound: {
    code: 'Error 404',
    headline: 'This page does not exist',
    text: 'The link you followed leads nowhere. I may have moved the page, or the address has a typo in it.',
    cta: 'Back to home',
  },

  messages: {
    generalSubject: 'Enquiry from miguesco.dev',
    generalBody:
      'Hi Miguel, I saw your site and I want to tell you about a project.\n\nWhat I need:\n\nTimeline:\n\nRough budget:\n',
    bookSubject: (service) => `I want to reserve a slot — ${service}`,
    bookBody: (service) =>
      `Hi Miguel, I want to reserve a slot for a ${service} project.\n\nWhat it is about:\n\nWhen I need it:\n`,
    quoteSubject: (service) => `Quote — ${service}`,
    quoteBody: (service) =>
      `Hi Miguel, I need a quote for ${service}.\n\nWhat I want to solve:\n\nWhat tools we use today:\n\nTimeline:\n`,
  },
}
