/**
 * Trayectoria. Aquí va lo que no depende del idioma —fechas, tipo y stack—;
 * los textos están en `src/i18n/{es,en}.ts`.
 *
 * El orden del array es el orden en pantalla: lo más reciente primero.
 */

export const EXPERIENCE_IDS = ['trestrigos', 'globant', 'sena'] as const
export type ExperienceId = (typeof EXPERIENCE_IDS)[number]

export interface ExperienceEntry {
  /** Año y mes, `AAAA-MM`. */
  start: string
  /** `null` => sigue en curso y se muestra como "Actualidad". */
  end: string | null
  kind: 'work' | 'education'
  stack: string[]
}

export const EXPERIENCE: Record<ExperienceId, ExperienceEntry> = {
  trestrigos: {
    start: '2025-12',
    end: null,
    kind: 'work',
    stack: ['PowerApps', 'Power Automate', 'Dataverse', 'JavaScript', 'WordPress'],
  },
  globant: {
    start: '2024-01',
    end: '2025-06',
    kind: 'work',
    stack: ['React', 'React Native', 'TypeScript', 'Node.js', 'Express'],
  },
  sena: {
    start: '2022-07',
    end: '2024-10',
    kind: 'education',
    stack: [],
  },
}
