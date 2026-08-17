import { defineCollection } from 'astro:content'
import { glob } from 'astro/loaders'
// Astro 7 marcó como obsoleto el `z` que reexportaba: ahora se importa de zod.
import { z } from 'zod'

/**
 * Casos de estudio.
 *
 * Un caso son dos archivos —`es/<slug>.md` y `en/<slug>.md`— con el mismo
 * nombre. El idioma sale de la carpeta, no del frontmatter, para que no puedan
 * contradecirse.
 *
 * La estructura no es libre a propósito: problema → qué hice → resultado. Es el
 * orden en que un cliente potencial lee, y obliga a terminar con un hecho
 * comprobable en vez de con adjetivos.
 */
const cases = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/cases' }),
  schema: z.object({
    /** Mientras sea true, el caso no sale ni en la portada ni tiene página. */
    draft: z.boolean().default(false),
    /** Menor primero. Pon delante el caso que mejor represente lo que quieres vender. */
    order: z.number().default(0),

    client: z.string(),
    /** "Panadería", "Estudio de arquitectura"… ayuda a que el lector se reconozca. */
    sector: z.string(),
    year: z.number().int(),
    /** Debe coincidir con un servicio de pricing.ts: enlaza el caso con su tarifa. */
    service: z.enum(['landing', 'website', 'webapp', 'ai']),

    /** Una frase que resuma el caso entero. Es el titular de la tarjeta. */
    headline: z.string().max(90),
    /** Meta description de la página del caso. */
    summary: z.string().min(50).max(165),

    /** Qué le pasaba al cliente antes. En sus palabras, no en jerga. */
    problem: z.string(),
    /** Las decisiones que tomaste. Tres o cuatro, concretas. */
    work: z.array(z.string()).min(2),
    /** Qué cambió después. Si no puedes escribirlo, el caso no está listo. */
    result: z.string(),

    /**
     * El número. Es lo único que un cliente recuerda de un caso de estudio,
     * así que es obligatorio: sin dato medible no hay caso, hay anécdota.
     */
    metric: z.object({
      value: z.string(),
      label: z.string(),
    }),

    stack: z.array(z.string()).min(1),
    /** El sitio en vivo, si el cliente deja enseñarlo. */
    url: z.url().optional(),

    testimonial: z
      .object({
        quote: z.string(),
        author: z.string(),
        role: z.string(),
      })
      .optional(),
  }),
})

export const collections = { cases }
