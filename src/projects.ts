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
    stack: ['React 19', 'Vite', 'WebSocket', 'Vercel Functions', 'CoinGecko API'],
  },
  meatmos: {
    demo: 'https://me-atmos.vercel.app/',
    code: 'https://github.com/MiguelEscobar0345/MeAtmos',
    stack: ['React 19', 'Vite', 'Motion', 'Canvas', 'Open-Meteo'],
  },
}

/**
 * Tecnologías del "Sobre mí". Orden intencional: primero el recorrido de una
 * funcionalidad completa —lenguaje, interfaz, servidor, datos— y después el resto.
 */
export const STACK = [
  'TypeScript',
  'JavaScript',
  'React',
  'Next.js',
  'React Native',
  'Node.js',
  'Express',
  'PostgreSQL',
  'MongoDB',
  'Astro',
  'Tailwind CSS',
  'Firebase',
  'Git',
  'Figma',
  'LLMs & RAG',
] as const
