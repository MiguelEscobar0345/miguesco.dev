---
title: 'Cómo repartir un rectángulo entre 50 monedas'
summary: 'El mapa de calor de MePulse usa un treemap «squarified»: un algoritmo del año 2000 que cabe en un archivo y mantiene cada cuadro legible.'
topic: 'MePulse'
date: 2026-11-16T15:00:00Z
---

El mapa de calor de [MePulse](https://me-pulse.vercel.app/) dibuja las 50 criptomonedas más grandes. El área de cada cuadro es su capitalización y el color, cuánto cambió su precio. Bitcoin se lleva un bloque enorme; la número 50, un cuadrito.

El problema de fondo es de geometría: partir un rectángulo en cincuenta rectángulos con áreas dadas. Hay infinitas formas de hacerlo y casi todas quedan mal.

## La forma fácil

Lo primero que se ocurre es cortar en tiras: cada moneda, una columna tan ancha como le corresponda. Las áreas salen exactas y el resultado no sirve.

Las monedas pequeñas quedan como rayas de dos píxeles de ancho y 480 de alto. No cabe un nombre, no se pueden pulsar, y el ojo no sabe comparar el área de una raya con la de un bloque.

Lo que se busca es que cada cuadro se parezca lo más posible a un cuadrado.

## Filas que se cierran cuando empeoran

El algoritmo se llama *squarified treemap* y lo publicaron Bruls, Huizing y van Wijk en el año 2000. Con las monedas ordenadas de mayor a menor, hace esto:

1. Mira el espacio libre y toma su lado más corto.
2. Empieza una fila apoyada en ese lado y le va añadiendo monedas.
3. Antes de añadir cada una, pregunta: ¿el cuadro más deforme de la fila queda peor que antes?
4. Si queda peor, cierra la fila, descuenta el espacio que ocupó y vuelve al paso 1 con lo que sobra.

```js
for (let i = 0; i < nodes.length; ) {
  const side = Math.min(rect.w, rect.h)
  const candidate = [...row, nodes[i]]
  if (!row.length || worst(candidate, side) <= worst(row, side)) {
    row = candidate
    i++
  } else {
    rect = layoutRow(row, rect, out)
    row = []
  }
}
```

«El más deforme» tiene una fórmula:

```js
function worst(row, side) {
  // sum, max y min: la suma de las áreas de la fila, la mayor y la menor
  const s2 = side * side
  const sum2 = sum * sum
  return Math.max((s2 * max) / sum2, sum2 / (s2 * min))
}
```

Sale de dos divisiones. Una fila con área total `sum`, apoyada en un lado de longitud `side`, tiene un grosor de `sum / side`. Un cuadro de área `a` dentro de ella mide `a / grosor` de largo. Su proporción, largo entre grosor, es `a × side² / sum²`.

Un 1 es un cuadrado perfecto; cuanto más lejos del 1, más deforme. La función devuelve la peor proporción de la fila, que siempre es la del cuadro más grande o la del más pequeño.

Es un algoritmo voraz: decide con lo que tiene delante y no vuelve atrás, así que no garantiza el reparto óptimo. Da uno bueno, en unas setenta líneas y sin dependencias.

## Lo que no viene en el artículo

Tres decisiones son de la app, no del algoritmo.

**Los tamaños no se mueven con los precios.** Los precios cambian cada segundo, y si el reparto se recalculara con cada uno, los cuadros bailarían. El tamaño sale de la foto del mercado que se refresca cada minuto, y el reparto sólo se recalcula cuando cambia esa foto o el ancho de la pantalla. El color y las cifras sí van en vivo.

**Cada cuadro enseña lo que le cabe.** Uno grande lleva símbolo, cambio y precio. Uno mediano, símbolo y cambio. Uno pequeño, sólo el símbolo, y los mínimos, nada. Lo deciden cinco escalones según el ancho y el alto.

**Un 2% no pesa igual en una hora que en un día.** Cada periodo tiene su propio tope para el color más intenso: 2% en una hora, 8% en 24 horas, 20% en una semana. Y la intensidad sigue una raíz cuadrada, para que un movimiento pequeño se vea como un tinte y no se pierda en el gris:

```js
const t = Math.min(Math.abs(pct) / cap, 1)
const mix = Math.round(18 + 82 * Math.sqrt(t))
return `color-mix(in oklab, var(${pct > 0 ? '--heat-up' : '--heat-down'}) ${mix}%, var(--heat-flat))`
```

Cada cuadro es además un enlace con una etiqueta que dice el nombre, el cambio y el precio, así que el mapa se puede recorrer con teclado y con lector de pantalla.

## Con qué me quedo

Antes de instalar una librería de gráficos conviene mirar si lo que hace falta es un algoritmo de una página. Este tiene más de veinte años y cabe en un archivo.
