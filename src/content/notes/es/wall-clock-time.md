---
title: 'Las 11:00 de Tokio no son las 11:00 de tu navegador'
summary: 'new Date() lee una hora sin zona como si fuera la tuya. En una app del clima eso descuadra el reloj de cada ciudad; la salida es tratarla como UTC.'
topic: 'MeAtmos'
date: 2026-11-16T17:00:00Z
---

[MeAtmos](https://me-atmos.vercel.app/) enseña el clima de cualquier ciudad a la hora de esa ciudad. Open-Meteo lo pone fácil: con `timezone=auto` devuelve todas las horas ya en el reloj del lugar. Una respuesta para Tokio, recortada:

```json
{
  "utc_offset_seconds": 32400,
  "current": { "time": "2026-09-23T11:00" },
  "daily": { "sunrise": ["2026-09-23T05:31"], "sunset": ["2026-09-23T17:38"] }
}
```

Lo importante es lo que falta: ni `Z` ni `+09:00`. Eso no es un instante, es una hora de pared: lo que marca un reloj colgado en Tokio.

## Qué hace `new Date()` con eso

```js
new Date('2026-09-23T11:00') // las 11:00… de la zona de quien mira
new Date('2026-09-23')       // medianoche… en UTC
```

Son dos reglas distintas para dos textos casi iguales, y ninguna es «la hora de Tokio». Con fecha y hora, JavaScript asume la zona del navegador. Con la fecha sola, asume UTC.

Desde Medellín, que está en UTC−5, lo segundo se nota enseguida: `new Date('2026-09-23')` son las siete de la tarde del día 22, y al formatearlo sale «martes 22». El pronóstico entero, corrido un día.

Lo primero es más traicionero, porque casi siempre parece funcionar: lees las 11:00, formateas y salen las 11:00. Falla dos veces al año y sólo a algunos visitantes. En Madrid, la madrugada del cambio de hora de marzo, las 2:00 no existen: el reloj salta de la 1:59 a las 3:00. Ese día, el pronóstico por horas de cualquier ciudad enseñaría dos veces las 3:00 y ninguna las 2:00.

Yo desarrollo desde Colombia, donde no hay cambio de hora. Ese fallo no lo habría visto nunca en mi pantalla.

## UTC a la ida y a la vuelta

```js
// "2026-09-23T11:00" o "2026-09-23": el reloj de pared de la ciudad
const wallClock = (iso) =>
  new Date(iso.length === 10 ? `${iso}T00:00Z` : `${iso}Z`)

const fmt = (iso, opts) =>
  wallClock(iso).toLocaleString('es', { ...opts, timeZone: 'UTC' })
```

Se le añade una `Z` para que se lea como UTC, y se formatea pidiendo UTC. El objeto `Date` que queda en medio guarda un instante falso —en Tokio no eran las 11:00 UTC—, pero nunca se usa como instante: sólo para formatear y para restar.

Y UTC no tiene cambio de hora, así que todas las horas existen y las restas son exactas:

```js
const minutesBetween = (fromIso, toIso) =>
  Math.round((wallClock(toIso) - wallClock(fromIso)) / 60000)
```

De ahí sale cuánto dura el día y por dónde va el sol. Para enseñar la hora ni siquiera hace falta un `Date`: `iso.slice(11, 16)` ya es `11:00`.

## La hora de ahora mismo

Queda un detalle: `current.time` no es la hora actual, es la de la última medición, que se toma cada quince minutos. Para un reloj que avance hace falta el desfase que manda la API, y el mismo truco al revés:

```js
const cityNow = (offsetSeconds) =>
  new Date(Date.now() + offsetSeconds * 1000).toISOString().slice(0, 16)
```

Se corre el instante real tantos segundos como marca el desfase y se lee como si fuera UTC. `toISOString` devuelve algo como `2026-09-23T11:07`: el mismo formato que usa la API, así que las dos horas se pueden comparar como texto.

## Con qué me quedo

Una hora sin zona no es un instante: es un texto que alguien leyó en un reloj. `Date` sólo sabe guardar instantes, así que la conversión hay que decidirla a propósito, y hacerla igual a la ida que a la vuelta.

`Temporal.PlainDateTime` existe justo para esto. El día que esté en todos los navegadores, estas diez líneas sobran.
