/**
 * Los dos proyectos que se muestran. Aquí sólo va lo que no depende del
 * idioma; los textos están en `src/i18n/{es,en}.ts`.
 */

export const PROJECT_IDS = ['mepulse', 'meatmos'] as const
export type ProjectId = (typeof PROJECT_IDS)[number]

export interface Project {
  demo: string
  code: string
  /** Se muestran como etiquetas bajo el título. */
  stack: string[]
}

export const PROJECTS: Record<ProjectId, Project> = {
  mepulse: {
    demo: 'https://me-pulse.vercel.app/',
    code: 'https://github.com/MiguelEscobar0345/MePulse',
    stack: ['React 18', 'Vite', 'Vercel Functions', 'CoinGecko API'],
  },
  meatmos: {
    demo: 'https://me-atmos.vercel.app/',
    code: 'https://github.com/MiguelEscobar0345/MeAtmos',
    stack: ['React 18', 'Vite', 'Open-Meteo', 'CSS-in-JS'],
  },
}

/** Tecnologías del "Sobre mí". Orden intencional: de lo más usado a lo más nuevo. */
export const STACK = [
  'JavaScript',
  'TypeScript',
  'React',
  'React Native',
  'Next.js',
  'Astro',
  'Tailwind CSS',
  'Node.js',
  'Express',
  'MongoDB',
  'PostgreSQL',
  'Firebase',
  'Git',
  'Figma',
  'Power Automate',
  'LLMs & RAG',
] as const
