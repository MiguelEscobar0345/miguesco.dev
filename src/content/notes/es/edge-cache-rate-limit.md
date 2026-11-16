---
title: 'Una API con límite de peticiones y un caché delante'
summary: 'CoinGecko limita las llamadas de su plan gratuito. Con una función en Vercel y dos directivas de caché, una ráfaga de visitas cuesta una sola.'
topic: 'MePulse'
date: 2026-11-16T12:00:00Z
---

[MePulse](https://me-pulse.vercel.app/) saca el ranking, los gráficos y las cifras globales de CoinGecko. Su plan gratuito admite pocas llamadas por minuto, y abrir la portada ya son dos: el ranking y el total del mercado. Cada gráfico, otra más.

El navegador nunca habla con CoinGecko. Le pregunta a una función mía en Vercel, y es la función la que pregunta. Eso tiene una consecuencia: todas las visitas comparten el mismo cupo. Sin caché, diez personas abriendo la página a la vez serían veinte llamadas en un segundo.

## Una función que sólo reenvía

```js
export async function proxy(res, path, maxAge) {
  const upstream = await fetch(BASE + path)
  const body = await upstream.text()

  res.setHeader(
    'Cache-Control',
    upstream.ok
      ? `public, s-maxage=${maxAge}, stale-while-revalidate=${maxAge * 5}`
      : 'no-store',
  )
  res.status(upstream.status).send(body)
}
```

Las dos directivas hacen todo el trabajo, y ninguna va dirigida al navegador:

- **`s-maxage=60`**: la red de Vercel puede reutilizar esta respuesta durante 60 segundos. En ese minuto la función ni siquiera se ejecuta.
- **`stale-while-revalidate=300`**: pasado el minuto, y durante cinco más, quien llegue recibe la copia anterior al instante mientras la red pide una nueva por detrás. Nadie espera a CoinGecko.

Cada ruta decide cuánto dura lo suyo. El ranking y el total del mercado, un minuto. El gráfico de un día, dos. Los de una semana, un mes o un año, diez: un gráfico de 30 días no cambia en diez minutos.

## Los errores no se guardan

Ese `no-store` es la línea más importante. Si CoinGecko responde con un 429 —demasiadas peticiones— y esa respuesta se guardara un minuto, todo el que llegara en ese minuto recibiría el error, aunque CoinGecko ya se hubiera recuperado.

El código de estado tampoco se disfraza: un 429 sale de mi función como 429. Así la app distingue «nos están limitando» de «algo está roto» y dice una cosa distinta en cada caso:

```js
if (res.status === 429) throw new ApiError('rate_limit')
if (!res.ok) throw new ApiError(`http_${res.status}`)
```

## Sólo lo que espero recibir

La función arma una URL de CoinGecko con parámetros que vienen de fuera, así que no acepta cualquier cosa:

```js
const isCoinId = (id) => typeof id === 'string' && /^[a-z0-9-]{1,80}$/.test(id)

if (!Number.isInteger(page) || page < 1 || page > 5) {
  return badRequest(res, 'page must be 1–5')
}
```

Lo que no cumple el formato nunca llega a CoinGecko. Y hay un segundo motivo: cada URL distinta es una entrada distinta del caché, así que cuantas menos variantes válidas existan, más veces acierta.

## Y en el navegador, otro caché pequeño

```js
const cache = new Map() // url → { data, ts, pending }

export function getJSON(url, { ttl = 60_000, force = false } = {}) {
  const entry = cache.get(url) ?? {}
  if (!force && entry.data !== undefined && Date.now() - entry.ts < ttl) {
    return Promise.resolve(entry.data)
  }
  if (entry.pending) return entry.pending
  // …pide, guarda la respuesta y comparte la misma promesa
}
```

Dos reglas. Una respuesta de hace menos de un minuto se devuelve sin pedir nada. Y si dos partes de la app piden la misma URL a la vez, comparten una sola petición: la segunda recibe la promesa de la primera.

Eso último es lo que evita que el modo estricto de React, que en desarrollo ejecuta cada efecto dos veces, duplique todas las llamadas.

Si una petición falla, el último dato bueno se queda. La tabla sigue en pantalla con un «No se pudo actualizar», en vez de vaciarse.

## Con qué me quedo

Tres capas y cada una hace una sola cosa: el navegador no repite, la red reparte y la función sólo corre cuando de verdad hay que preguntar.
