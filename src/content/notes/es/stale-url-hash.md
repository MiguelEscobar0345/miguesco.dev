---
title: 'El cambio de idioma que me mandaba al pie de página'
summary: 'Cambié de idioma estando arriba del todo y aparecí en el pie. El fallo era confiar en la URL, y mi propia prueba escondía otro.'
topic: 'miguesco.dev'
date: 2026-11-16T11:00:00Z
---

Esta web está en español y en inglés, y quise cuidar un detalle: si estás leyendo los precios y cambias de idioma, deberías seguir en los precios, no volver al principio.

La primera versión hacía lo obvio. Las secciones tienen el mismo identificador en los dos idiomas, así que bastaba con conservar el ancla de la URL:

```js
link.addEventListener('click', (event) => {
  const hash = window.location.hash
  if (!hash) return
  event.preventDefault()
  window.location.href = link.pathname + hash
})
```

Funcionaba en todas mis pruebas. Hasta que cambié de idioma estando arriba del todo y aparecí en el pie de página.

## El ancla no dice dónde estás

Para reproducirlo hacía falta una secuencia concreta: pulsar «Contacto» en el menú, subir con la rueda hasta arriba y entonces cambiar de idioma.

Al pulsar «Contacto», la URL pasa a terminar en `#contact`. Al subir a mano la página se mueve, pero **la URL no cambia**: sigue diciendo `#contact` aunque estés mirando la portada. Mi código leía esa ancla vieja y te mandaba a contacto, en el otro idioma.

El ancla de la URL no es tu posición. Es el último enlace que pulsaste.

## Preguntarle a la página

La solución fue dejar de mirar la URL y mirar qué sección ocupa de verdad la pantalla:

```js
function visibleSectionId() {
  const marker = window.innerHeight * 0.35
  for (const section of document.querySelectorAll('main section[id]')) {
    const { top, bottom } = section.getBoundingClientRect()
    if (top <= marker && bottom > marker) return section.id
  }
  return ''
}
```

Busca la sección que cruza una línea imaginaria a un tercio de la altura de la ventana. Si no hay ninguna, estás en la portada y el enlace hace lo normal.

De regalo arregló un caso que la versión anterior no cubría: quien baja con la rueda sin tocar el menú no tiene ancla en la URL, y antes volvía siempre al principio.

## El fallo que estaba en mi prueba

Escribí una prueba automática y falló: decía que desde «Precios» se saltaba a «Servicios», una sección antes. Estuve un rato buscando el error en un código que estaba bien.

El problema era la herramienta. Antes de pulsar un elemento, Playwright se asegura de que esté a la vista, y con una cabecera fija eso desplazaba la página casi 500 píxeles justo antes del clic. La prueba medía una posición que ella misma acababa de cambiar.

Pulsando con el ratón en las coordenadas del botón, sin ese ajuste, todo salió como debía.

## Con qué me quedo

Fue dos veces el mismo error con distinta ropa: dar por buena una fuente que no decía lo que yo creía. Primero la URL, después mi propia prueba.
