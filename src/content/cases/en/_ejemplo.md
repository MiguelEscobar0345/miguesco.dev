---
draft: true
order: 1

client: Panadería La Espiga
sector: Neighbourhood bakery
year: 2026
service: landing

headline: From taking orders in Instagram comments to a single link
summary: A landing page for a bakery in Envigado that kept losing orders in its Instagram comments. WhatsApp orders went up 40% in the first month.

problem: >-
  They took orders through Instagram comments and DMs. When twenty came in at
  once, two or three got lost, with no way of telling which. They also had
  nowhere to send anyone who asked about prices.

# Careful: always quote each line. Unquoted, a ": " mid-sentence makes YAML
# read it as a key and a value, and the build fails.
work:
  - 'A single page with the catalogue, the prices and a WhatsApp button that opens the chat with the order already written'
  - 'Product photos recropped and optimised: the whole page weighs less than one of the images they were posting to Instagram'
  - 'Local business structured data, so they show up on the map for "panadería Envigado"'

result: >-
  Orders stopped getting lost because they all arrive in the same place and in
  the same format. In the first month they took 40% more WhatsApp orders than
  the month before, without spending a peso on ads.

metric:
  value: +40%
  label: WhatsApp orders in the first month

stack:
  - Astro
  - Tailwind CSS
  - Cloudflare

# url: https://ejemplo.com

# testimonial:
#   quote: We stopped losing orders in the first week.
#   author: Nombre Apellido
#   role: Owner, Panadería La Espiga
---

This file is a template. With `draft: true` it stays off the home page and no
page is generated for it. To publish a real case:

1. Copy this file and the matching one in `../es/` under the same new name, for
   example `panaderia-la-espiga.md`. The filename is the URL:
   `/en/casos/panaderia-la-espiga`.
2. Fill in the frontmatter. `metric` is required on purpose: if you cannot write
   a number, the case is not ready to publish yet.
3. Set `draft: false` in both languages.

Whatever you write below the frontmatter shows up as free text at the end of the
case page. Use it for the detail that does not fit the structure: a technical
decision worth explaining, something that went wrong and how you fixed it, or
why you ruled out the obvious solution.

It is optional. A case with the frontmatter properly filled in already stands on
its own.
