---
title: 'A rate-limited API with a cache in front of it'
summary: "CoinGecko limits calls on its free plan. With one Vercel function and two cache directives, a burst of visitors costs a single call."
topic: 'MePulse'
date: 2026-11-16T12:00:00Z
---

[MePulse](https://me-pulse.vercel.app/) gets its ranking, charts and global figures from CoinGecko. The free plan allows few calls a minute, and opening the home page already takes two: the ranking and the market total. Every chart is one more.

The browser never talks to CoinGecko. It asks a function of mine on Vercel, and the function does the asking. That has a consequence: every visit shares the same quota. Without a cache, ten people opening the page at once would be twenty calls in a second.

## A function that only forwards

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

The two directives do all the work, and neither is aimed at the browser:

- **`s-maxage=60`**: Vercel's network may reuse this response for 60 seconds. During that minute the function does not even run.
- **`stale-while-revalidate=300`**: once the minute is up, and for five more, whoever arrives gets the previous copy instantly while the network fetches a new one in the background. Nobody waits for CoinGecko.

Each route decides how long its own answer lasts. The ranking and the market total, one minute. The one-day chart, two. The week, month and year charts, ten: a 30-day chart does not change in ten minutes.

## Errors are never stored

That `no-store` is the most important line. If CoinGecko answers with a 429 —too many requests— and that response were kept for a minute, everyone arriving in that minute would get the error, even after CoinGecko had recovered.

The status code is not disguised either: a 429 leaves my function as a 429. That lets the app tell "we are being rate limited" from "something is broken" and say something different in each case:

```js
if (res.status === 429) throw new ApiError('rate_limit')
if (!res.ok) throw new ApiError(`http_${res.status}`)
```

## Only what I expect to receive

The function builds a CoinGecko URL from parameters that come from outside, so it does not accept just anything:

```js
const isCoinId = (id) => typeof id === 'string' && /^[a-z0-9-]{1,80}$/.test(id)

if (!Number.isInteger(page) || page < 1 || page > 5) {
  return badRequest(res, 'page must be 1–5')
}
```

Whatever fails the format never reaches CoinGecko. And there is a second reason: every distinct URL is a distinct cache entry, so the fewer valid variants exist, the more often the cache hits.

## And in the browser, one more small cache

```js
const cache = new Map() // url → { data, ts, pending }

export function getJSON(url, { ttl = 60_000, force = false } = {}) {
  const entry = cache.get(url) ?? {}
  if (!force && entry.data !== undefined && Date.now() - entry.ts < ttl) {
    return Promise.resolve(entry.data)
  }
  if (entry.pending) return entry.pending
  // …fetch, store the answer and share the same promise
}
```

Two rules. An answer less than a minute old is returned without a request. And if two parts of the app ask for the same URL at once, they share a single request: the second one gets the first one's promise.

That last rule is what keeps React's strict mode, which runs every effect twice in development, from doubling every call.

If a request fails, the last good data stays. The table remains on screen with a "could not update" notice instead of going blank.

## What I take from it

Three layers, each doing one thing: the browser does not repeat itself, the network shares one answer, and the function only runs when there really is something to ask.
