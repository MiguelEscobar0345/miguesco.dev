---
title: '50 precios por segundo, un solo render'
summary: 'MePulse recibe un precio por moneda cada segundo. Un búfer y un reloj evitan que React pinte la pantalla cincuenta veces en ese segundo.'
topic: 'MePulse'
date: 2026-11-16T18:00:00Z
---

[MePulse](https://me-pulse.vercel.app/) muestra el mercado cripto en vivo. Los precios llegan por el WebSocket público de Binance: un mensaje por moneda, más o menos una vez por segundo. Con cincuenta monedas en pantalla son cincuenta mensajes por segundo, cada uno cuando le toca.

Lo directo sería guardar cada precio en el estado en cuanto llega:

```js
ws.onmessage = (event) => {
  const tick = parse(event.data)
  setTicks((prev) => ({ ...prev, [tick.symbol]: tick }))
}
```

React agrupa las actualizaciones que ocurren dentro de un mismo evento, pero cada mensaje del socket es un evento distinto. Ese código pinta la tabla, el mapa de calor y el total del mercado cincuenta veces por segundo, para enseñar números que nadie alcanza a leer.

## Un búfer y un reloj

En MePulse los mensajes no tocan React. Escriben en un objeto normal, y un reloj lo vacía una vez por segundo:

```js
let buffer = {}

ws.onmessage = (event) => {
  const tick = parse(event.data)
  if (tick) buffer[tick.symbol] = tick
}

const flush = setInterval(() => {
  if (!Object.keys(buffer).length) return
  const batch = buffer
  buffer = {}
  setTicks((prev) => ({ ...prev, ...batch }))
}, 1000)
```

Cincuenta mensajes, un `setTicks`, un render. Si una moneda mandó dos precios en ese segundo, el segundo pisa al primero: nadie habría visto el intermedio. Y si no llegó nada, no se pinta nada.

El segundo no es arbitrario. Binance manda cada precio más o menos una vez por segundo, así que vaciar el búfer más seguido no enseñaría datos más nuevos.

## La lista de monedas viaja como texto

El hook recibe los símbolos unidos por comas, `'btc,eth,sol'`, y no un array. Tiene motivo:

```js
useEffect(() => {
  conn.wanted = symbolKey ? symbolKey.split(',') : []
  subscribe(conn)
}, [symbolKey])
```

React decide si repite un efecto comparando sus dependencias, y dos arrays con las mismas monedas son dos objetos distintos: el efecto se dispararía en cada render. Dos textos iguales son iguales.

Además hay dos efectos y no uno. El primero abre la conexión una sola vez. El segundo sólo gestiona suscripciones, y `subscribe` pide únicamente las monedas que el socket todavía no manda. Al pulsar «Cargar 50 más», la conexión sigue abierta y sale un solo mensaje con las nuevas.

## Cuando el socket se cae

```js
ws.onclose = () => {
  retries += 1
  if (retries > MAX_RETRIES) {
    setStatus('offline')
    retryTimer = setTimeout(() => { retries = 0; connect() }, 60_000)
  } else {
    retryTimer = setTimeout(connect, 1000 * 2 ** retries)
  }
}
```

Reintenta a los 2, 4, 8 y 16 segundos. Si falla las cuatro veces se declara sin conexión y vuelve a probar cada minuto.

Mientras tanto la app no se queda congelada: el ranking ya se refrescaba por HTTP cada minuto, y eso sigue funcionando. La cabecera lo dice sin adornos. Donde ponía «En vivo» pasa a poner «Cada 60 s», para no enseñar como en vivo un precio que no lo es.

## Con qué me quedo

Cada cuánto llegan los datos y cada cuánto se pinta la pantalla son dos decisiones distintas. Entre una y otra cabe un búfer.
