---
title: 'Por qué Google no mostraba el favicon de mi web'
summary: 'En el navegador el icono salía bien, pero Google pintaba un globo genérico. La causa: una regla de tamaño que casi nadie menciona.'
topic: 'miguesco.dev'
date: 2026-11-16T16:00:00Z
---

Publiqué esta web, la busqué en Google y junto al resultado no estaba mi logo: estaba el globo terráqueo gris que Google pone cuando no tiene nada mejor. En la pestaña del navegador, en cambio, el icono se veía perfecto.

Lo primero que pensé fue lo que piensa todo el mundo: que era cuestión de esperar. No lo era.

## La regla de los 48 píxeles

Google documenta un requisito que los navegadores no tienen: el favicon que muestra en los resultados debe ser **un cuadrado cuyo lado sea múltiplo de 48 píxeles**. Vale 48, 96, 144 o 192. Los SVG se libran, porque no tienen tamaño fijo.

Mi `favicon.ico` llevaba una sola imagen de 32×32. Para una pestaña es justo lo que hace falta; para Google no cumple, así que lo descartaba sin avisar. No aparece ningún error en Search Console ni en ninguna otra parte: simplemente sale el globo.

## Lo que cambié

Un `.ico` puede llevar varias imágenes dentro. El mío pasó a tener tres —16, 32 y 48— y además declaré un PNG de 192, que es 48 × 4:

```html
<link rel="icon" href="/favicon.ico" sizes="16x16 32x32 48x48" />
<link rel="icon" href="/favicon.svg" type="image/svg+xml" sizes="any" />
<link rel="icon" href="/icon-192.png" type="image/png" sizes="192x192" />
```

De paso le quité al SVG el `width` y el `height` fijos, que le impedían escalar.

## Cómo saber qué tiene Google

Esto fue lo más útil que aprendí. Google tiene un servicio que devuelve el favicon que guarda de cualquier dominio:

```
https://www.google.com/s2/favicons?domain=tudominio.com&sz=128
```

Si responde con el globo, todavía no ha recogido tu icono. Si responde con tu logo, ya lo tiene y lo que va atrasado es la ficha del buscador.

## Lo que no sabía

- **Pedir que indexen la página no actualiza el icono.** Google rastrea los favicons con un proceso aparte y mucho menos frecuente. La cola de «Solicitar indexación» no tiene nada que ver con él.
- **Cambiar el icono reinicia la espera.** Cada versión nueva la evalúa desde cero, así que después de arreglarlo lo mejor es no volver a tocarlo.
- **No afecta al posicionamiento.** Es cosmético. Molesta, pero no te baja un puesto.

Dejé la comprobación en el script que audita el sitio antes de cada despliegue: si el `.ico` no trae una imagen de 48 píxeles o más, el despliegue no sale.
