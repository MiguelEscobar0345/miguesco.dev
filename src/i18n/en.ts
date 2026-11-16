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
    notes: {
      title: 'Notes — miguesco',
      description:
        'Technical notes by Miguel Escobar: real problems from building websites, how I tracked down the cause and what I changed. Short, with the code in view.',
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
    notes: 'Notes',
    about: 'About',
    contact: 'Contact',
  },

  notes: {
    title: 'Notes',
    lead: 'Real problems I ran into while building, how I tracked down the cause and what I changed. Short, with the code in view.',
    all: 'All notes',
    back: 'Notes',
    readingTime: '{n} min read',
    updated: 'Updated {date}',
    outro: 'Did you hit something similar, or would you have solved it differently? Write to me and we can talk it through.',
    outroCta: 'Message on WhatsApp',
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
    timelineDays: '{min} to {max} business days',
    timelineWeeks: '{min} to {max} weeks',
  },

  estimate: {
    title: 'Build your estimate',
    lead: 'Tick what you need. The price and the timeline are worked out right here, and the summary goes with you to WhatsApp.',
    typeLegend: 'Type of project',
    pagesLegend: 'Pages',
    pagesHint: 'Up to {n} are included. Each extra page adds to the price and one day to the timeline.',
    extraPages: 'Extra pages × {n}',
    extrasLegend: 'Extras',
    extras: {
      language: {
        name: 'Second language',
        hint: 'The whole site in Spanish and English, with a switcher.',
      },
      copy: {
        name: 'Copywriting',
        hint: 'I write the copy myself, from a conversation with you.',
      },
      assistant: {
        name: 'AI assistant',
        hint: 'A chat that answers your customers from your own information.',
      },
    },
    customNote:
      'This one cannot be quoted with three checkboxes. The number is the starting point: you get the fixed price in writing after a 30-minute call.',
    summaryTitle: 'Your estimate',
    totalLabel: 'Total',
    cta: 'Send on WhatsApp',
    ctaQuote: 'Request a quote on WhatsApp',
    disclaimer:
      'This is an estimate. The final price is set in writing in the proposal before you pay anything.',
    messageIntro: 'Hi Miguel, I put this estimate together on miguesco.dev:',
    messageEstimate: 'Estimate',
    messageOutro: 'My business is:',
    messagePages: '{n} pages',
  },

  experience: {
    title: 'Experience',
    lead: 'Three years shipping product: first inside a multinational, now automating a company from the inside.',
    present: 'Present',
    educationLabel: 'Education',
    items: {
      trestrigos: {
        role: 'Web UI & Frontend Developer',
        org: 'Tres Trigos',
        place: 'Medellín',
        points: [
          'Designed and built the ticketing support app on PowerApps, Power Automate and Dataverse. Team productivity went up 80%.',
          'Automated workflows for the accounting team, removing manual steps and risk from their processes.',
          'Custom pages in HTML, CSS and JavaScript, integrated with WordPress.',
        ],
      },
      globant: {
        role: 'Web UI Developer',
        org: 'Globant',
        place: 'Medellín · remote teams, in English',
        points: [
          'Joined as an intern and was promoted to in-house developer.',
          'OurSpaces, a full-stack tool for booking meeting rooms: React components with Vite, client-side filtering and a Node and Express API.',
          'Mobile features in React Native for Builder.ai, plus proofs of concept for client visits and hackathons.',
        ],
      },
      sena: {
        role: 'Technologist degree in Software Analysis and Development',
        org: 'SENA',
        place: 'Medellín',
        points: [],
      },
    },
  },

  projects: {
    title: 'Projects',
    lead: 'Two products of my own, live in production and open source. You can open them right now and try to break them.',
    viewDemo: 'Live demo',
    viewCode: 'Source',
    items: {
      mepulse: {
        name: 'MePulse',
        tagline: 'Live crypto market',
        description:
          'Prices that move in real time over Binance’s WebSocket, a heatmap of the top 50 —area is market cap, color is the change— and a page for every coin with a chart you can scrub with the pointer or the arrow keys. Under the hood: Vercel serverless functions with edge caching to stay under CoinGecko’s rate limit, and price ticks batched so 50 changes a second cost a single render.',
        imageAlt:
          'MePulse in its dark theme: the total crypto market cap in large figures, a sentence summing up the day, a bar of how many coins are up and down, and the heatmap of the top 50',
      },
      meatmos: {
        name: 'MeAtmos',
        tagline: 'The weather, on local time',
        description:
          'Search a city and the main card becomes a window onto its sky: rain slanted by the real wind, fog, clouds sized by cloud cover and stars at night, drawn on canvas at that city’s local time. Below it, a sentence that sums up the day, a 24-hour curve you can scrub with the pointer, 7 days, air quality, wind and sun. All of it on Open-Meteo’s open APIs, without a single key to manage.',
        imageAlt:
          'MeAtmos showing the weather in Medellín: the current temperature over a drawing of the sky at that moment, a sentence about the next few hours and the curve for the next 24 hours',
      },
    },
  },

  about: {
    title: 'About me',
    paragraphs: [
      'From every project I keep a single question: what changed after it was installed. The stack matters less than that number, which is why I ask how we will measure success before I write any code.',
      'I work in Spanish and in English (C1) —at Globant the day-to-day was with remote teams— and I prefer to take on few projects at a time so I can reply the same day.',
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
