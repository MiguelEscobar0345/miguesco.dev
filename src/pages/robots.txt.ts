import type { APIRoute } from 'astro'
import { SITE } from '../consts'

/**
 * Se genera en el build para que la línea `Sitemap:` salga del dominio real
 * y no haya que acordarse de cambiarla a mano.
 *
 * Los rastreadores de IA entran a propósito: si alguien le pregunta a un
 * asistente por un desarrollador web en Medellín, quiero estar en la respuesta.
 * Bloquearlos aquí sería cerrarse una puerta, no protegerse de nada.
 */
const AI_CRAWLERS = [
  'GPTBot',
  'OAI-SearchBot',
  'ChatGPT-User',
  'ClaudeBot',
  'Claude-User',
  'Claude-SearchBot',
  'anthropic-ai',
  'PerplexityBot',
  'Perplexity-User',
  'Google-Extended',
  'Applebot-Extended',
  'CCBot',
  'Bytespider',
  'meta-externalagent',
  'cohere-ai',
  'DuckAssistBot',
]

export const GET: APIRoute = () => {
  const body = [
    '# https://www.robotstxt.org/robotstxt.html',
    '',
    'User-agent: *',
    'Allow: /',
    '',
    '# Rastreadores de IA: bienvenidos, con nombre y apellido.',
    ...AI_CRAWLERS.flatMap((agent) => [`User-agent: ${agent}`, 'Allow: /', '']),
    `Sitemap: ${new URL('/sitemap-index.xml', SITE.url).href}`,
    '',
  ].join('\n')

  return new Response(body, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  })
}
