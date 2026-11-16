---
title: 'Una CSP sin unsafe-inline, y lo que rompió en producción'
summary: 'Una política de seguridad estricta que funcionaba perfecta en local y que en producción bloqueó un script que yo nunca había puesto.'
date: 2026-11-16T11:00:00Z
---

Una Content-Security-Policy le dice al navegador de dónde puede cargar cosas una página. La mayoría de las que se ven por ahí llevan `'unsafe-inline'`, que viene a ser una puerta blindada con la llave puesta: permite cualquier script escrito dentro del HTML, que es justo lo que un atacante intenta colar.

Esta web no carga nada de fuera —ni fuentes, ni CDNs, ni píxeles de seguimiento—, así que me propuse tener una política sin esa excepción.

## Hashes en vez de permisos generales

El problema es que la página sí tiene scripts propios escritos en línea: el que aplica el tema antes de pintar y los selectores de idioma y de moneda. La forma de permitirlos sin abrirle la puerta a todos es declarar la huella exacta de cada uno. Astro la calcula solo al compilar:

```js
// astro.config.mjs
security: {
  csp: {
    algorithm: 'SHA-384',
    directives: [
      "default-src 'self'",
      "img-src 'self' data:",
      "base-uri 'none'",
      "form-action 'none'",
    ],
  },
},
```

El resultado es una etiqueta `<meta>` con un hash por script. Si alguien consigue inyectar código, su huella no está en la lista y el navegador no lo ejecuta.

## Dos cosas que no salen en los tutoriales

**`frame-ancestors` no funciona en un `<meta>`.** Es la directiva que impide que otra web te meta dentro de un iframe, y el navegador la ignora si no llega como cabecera HTTP. Va aparte, en la configuración del hosting.

**Cambiar estilos desde JavaScript sí está permitido.** La política bloquea los atributos `style` escritos en el HTML, pero no `element.style.setProperty()`. Por eso las portadas de los proyectos de esta web pueden inclinarse siguiendo el puntero sin tocar la política.

## Lo que rompió en producción

En local todo pasaba: consola limpia en todas las páginas. Desplegué, abrí la consola del sitio real y había un error en cada una.

Cloudflare, donde está alojada la web, inyecta su script de analítica en el HTML al servirlo. Ese script no existe en mi código ni en mi compilación, así que no estaba en la lista y la política lo bloqueaba. Tenía la analítica activada y sin funcionar, y mirando sólo el entorno local no me habría enterado nunca.

La solución fue nombrar ese origen, y sólo ese:

```js
scriptDirective: {
  resources: ["'self'", 'https://static.cloudflareinsights.com'],
},
```

## Con qué me quedo

Una política estricta se prueba contra el sitio desplegado, no contra la compilación. Lo que tu proveedor añade por el camino no está en tu repositorio, y es justo lo que una CSP bien hecha va a bloquear.
