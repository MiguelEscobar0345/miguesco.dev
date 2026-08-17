---
draft: true
order: 1

client: Panadería La Espiga
sector: Panadería de barrio
year: 2026
service: landing

headline: De recibir pedidos por comentarios de Instagram a un solo enlace
summary: Landing para una panadería de Envigado que perdía pedidos entre los comentarios de Instagram. Los pedidos por WhatsApp subieron un 40% el primer mes.

problem: >-
  Tomaban los pedidos por comentarios y mensajes de Instagram. Cuando llegaban
  veinte a la vez, se perdían dos o tres, y no había forma de saber cuáles.
  Tampoco tenían dónde mandar a alguien que preguntara por precios.

# Ojo: entrecomilla siempre cada línea. Sin comillas, un ": " en mitad de la
# frase hace que YAML la lea como clave y valor, y el build falla.
work:
  - 'Una sola página con el catálogo, los precios y un botón de WhatsApp que abre el chat con el pedido ya escrito'
  - 'Fotos de producto reencuadradas y optimizadas: la página entera pesa menos que una sola de las que subían a Instagram'
  - 'Datos estructurados de negocio local, para que aparezcan en el mapa al buscar "panadería Envigado"'

result: >-
  Los pedidos dejaron de perderse porque todos llegan al mismo sitio y con el
  mismo formato. El primer mes hicieron un 40% más de pedidos por WhatsApp que
  el mes anterior, sin gastar un peso en publicidad.

metric:
  value: +40%
  label: pedidos por WhatsApp el primer mes

stack:
  - Astro
  - Tailwind CSS
  - Cloudflare

# url: https://ejemplo.com

# testimonial:
#   quote: Dejamos de perder pedidos la primera semana.
#   author: Nombre Apellido
#   role: Dueña, Panadería La Espiga
---

Este archivo es una plantilla. Con `draft: true` no sale en la portada ni tiene
página propia. Para publicar un caso real:

1. Copia este archivo y el de `../en/` con el mismo nombre nuevo, por ejemplo
   `panaderia-la-espiga.md`. El nombre es la URL: `/casos/panaderia-la-espiga`.
2. Rellena el frontmatter. El `metric` es obligatorio a propósito: si no puedes
   escribir un número, el caso todavía no está listo para publicarse.
3. Pon `draft: false` en los dos idiomas.

Lo que escribas aquí abajo, después del frontmatter, aparece como texto libre al
final de la página del caso. Sirve para el detalle que no cabe en la estructura:
una decisión técnica que quieras explicar, algo que salió mal y cómo lo
resolviste, o por qué descartaste la solución obvia.

Es opcional. Un caso con el frontmatter bien rellenado ya funciona solo.
