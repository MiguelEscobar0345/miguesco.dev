---
title: 'Lluvia que cae hacia donde sopla el viento'
summary: 'El cielo de MeAtmos se dibuja en canvas con los datos reales: cuánta lluvia, hacia dónde se inclina y cuándo dejar de animar.'
topic: 'MeAtmos'
date: 2026-11-16T14:00:00Z
---

En [MeAtmos](https://me-atmos.vercel.app/) la tarjeta principal es una ventana al cielo de la ciudad que buscaste. Si allá llueve, llueve; si hay viento, la lluvia cae inclinada; de noche salen estrellas, y menos cuantas más nubes haya.

No es un vídeo ni una colección de fondos. Se dibuja en un `<canvas>` con los mismos datos que la app enseña en cifras.

## De los datos a una escena

Una función convierte el clima en la descripción de lo que hay que dibujar:

```js
skyConfig(weather)
// { rain: 130, drizzle: 0, snow: 0, stars: 0, clouds: 5,
//   fog: 0, lightning: false, night: false, slant: 0.31 }
```

La cantidad de gotas sale del código meteorológico: 80 para lluvia débil, 190 para lluvia fuerte. Las estrellas sólo aparecen de noche y se van apagando con la nubosidad: `110 * (1 - cover * 0.85)`. Las nubes dependen de cuánto cielo está cubierto.

El dibujo no sabe nada del clima. Sólo recibe esos números.

## El viento viene de un lado y la lluvia va al otro

```js
// La dirección es de DÓNDE viene el viento; las gotas van al lado contrario
const toward = ((c.wind_direction_10m + 180) * Math.PI) / 180
const slant = Math.sin(toward) * Math.min(c.wind_speed_10m / 45, 0.55)
```

En meteorología, la dirección del viento es de dónde viene. Un viento del oeste, 270°, empuja las gotas hacia el este: se le suman 180° y el seno da 1, la inclinación máxima hacia la derecha. Con viento del norte el seno da 0 y la lluvia cae recta, porque en una pantalla el norte queda hacia el fondo.

La velocidad decide cuánto, con un tope de 0,55. Más inclinada que eso deja de leerse como lluvia y empieza a parecer rayas.

## Posiciones de 0 a 1

Cada gota guarda su posición como una fracción del lienzo, no en píxeles:

```js
d.y += d.speed * dt
d.x += cfg.slant * d.speed * dt * (h / w)
if (d.y > 1.05) { d.y = -0.05; d.x = rnd(-0.2, 1.2) }
```

Así un cambio de tamaño no obliga a reiniciar nada: al girar el móvil la escena se estira y sigue.

El `h / w` está porque una fracción del ancho y una fracción del alto no miden lo mismo. Sin esa corrección, en una tarjeta ancha la gota se movería en un ángulo y estaría dibujada en otro.

Las gotas nacen entre −0,2 y 1,2, un poco fuera de los bordes. Con viento, las que entran de lado tienen que venir de algún sitio.

## El tiempo entre fotogramas

```js
const dt = Math.min(0.05, (t - last) / 1000)
```

Todo movimiento se multiplica por `dt`, los segundos desde el fotograma anterior, para que la lluvia caiga igual de rápido en una pantalla de 60 Hz que en una de 120.

El tope de 0,05 cubre el caso raro: si el navegador se queda parado un rato, el siguiente fotograma no da un salto de varios segundos.

## Saber cuándo no dibujar

Una animación continua gasta batería aunque nadie la mire, así que el bucle sólo corre si se cumplen tres cosas:

```js
const should = animate && visible && document.visibilityState === 'visible'
```

- **`visible`** lo decide un `IntersectionObserver`. Si bajaste a ver el pronóstico y la tarjeta salió de pantalla, se para.
- **`visibilityState`**: si cambiaste de pestaña, se para.
- **`animate`** es falso para quien pidió menos movimiento en su sistema. Ahí se pinta un solo fotograma —el cielo correcto, quieto— y no hay bucle.

Y en React, la escena sólo se reinicia cuando cambia el cielo, no cada vez que llegan datos nuevos:

```jsx
const config = JSON.stringify(skyConfig(weather))

useEffect(() => {
  return runSky(ref.current, JSON.parse(config), !prefersReducedMotion())
}, [config])
```

La configuración viaja como texto por el mismo motivo que [la lista de monedas de MePulse](/notas/one-render-per-second): para React, dos objetos iguales no son iguales y dos textos sí.

## Con qué me quedo

Lo que hace creíble la escena no es la cantidad de partículas: es que cada una obedece a un dato real. Y lo que la hace viable es saber cuándo no dibujarla.
