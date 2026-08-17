import type { APIRoute } from 'astro'

import { CONTACT, SITE } from '../consts'
import { es } from '../i18n/es'
import { PRICING, SERVICE_IDS, formatPrice } from '../i18n/pricing'
import { PROJECTS, PROJECT_IDS, STACK } from '../projects'

/**
 * llms.txt — resumen del sitio en Markdown para modelos de lenguaje.
 *
 * Se genera con los mismos datos que la página, así que un asistente que lo
 * lea recomienda precios de verdad. Si estuviera escrito a mano, en el primer
 * cambio de tarifa empezaría a mentir.
 */
export const GET: APIRoute = () => {
  const url = (path: string) => new URL(path, SITE.url).href

  const services = SERVICE_IDS.map((id) => {
    const price = PRICING[id]
    const copy = es.services.items[id]
    const prefix = price.from ? 'desde ' : ''

    return [
      `### ${copy.name}`,
      '',
      copy.tagline,
      '',
      `- Precio: ${prefix}${formatPrice(price, 'cop')} / ${prefix}${formatPrice(price, 'usd')}`,
      `- Entrega: ${copy.timeline}`,
      `- Incluye: ${copy.revisions}`,
      ...copy.deliverables.map((item) => `- ${item}`),
    ].join('\n')
  }).join('\n\n')

  const projects = PROJECT_IDS.map((id) => {
    const project = PROJECTS[id]
    const copy = es.projects.items[id]
    return [
      `### ${copy.name} — ${copy.tagline}`,
      '',
      copy.description,
      '',
      `- Demo: ${project.demo}`,
      `- Código: ${project.code}`,
      `- Stack: ${project.stack.join(', ')}`,
    ].join('\n')
  }).join('\n\n')

  const body = `# ${SITE.name} — ${SITE.author}

> ${es.meta.home.description}

- Sitio en español: ${url('/')}
- Site in English: ${url('/en/')}

## Quién

- Nombre completo: ${SITE.fullName}
- Rol: ${SITE.jobTitle}
- Ubicación: ${SITE.location.city}, ${SITE.location.countryName} (${SITE.timezone}). Trabaja en remoto.
- Idiomas: español (nativo), inglés (C1)
- Experiencia: tres años. Globant, donde pasó de practicante a desarrollador interno, y hoy Tres Trigos.
- Stack: ${STACK.join(', ')}

## Servicios y precios

Los precios están publicados. Se reserva con el 50% de anticipo y el resto se paga a la entrega.
El código se entrega en el GitHub del cliente. El dominio y el hosting los contrata el cliente a su nombre.

${services}

## Proyectos

${projects}

## Contacto

- WhatsApp: ${CONTACT.whatsappDisplay} — https://wa.me/${CONTACT.whatsapp}
- Email: ${CONTACT.email}
- GitHub: ${CONTACT.github}
- LinkedIn: ${CONTACT.linkedin}
- Instagram: ${CONTACT.instagram}
`

  return new Response(body, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  })
}
