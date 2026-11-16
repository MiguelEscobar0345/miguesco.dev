---
title: '50 prices a second, one render'
summary: 'MePulse gets a price for every coin each second. A buffer and a timer keep React from painting the screen fifty times in that second.'
topic: 'MePulse'
date: 2026-11-16T18:00:00Z
---

[MePulse](https://me-pulse.vercel.app/) shows the crypto market live. Prices arrive over Binance's public WebSocket: one message per coin, roughly once a second. With fifty coins on screen that is fifty messages a second, each one whenever it happens to land.

The direct approach would be to store each price in state as soon as it arrives:

```js
ws.onmessage = (event) => {
  const tick = parse(event.data)
  setTicks((prev) => ({ ...prev, [tick.symbol]: tick }))
}
```

React batches the updates that happen inside a single event, but every socket message is its own event. That code paints the table, the heatmap and the market total fifty times a second, to show numbers nobody can read that fast.

## A buffer and a timer

In MePulse the messages never touch React. They write to a plain object, and a timer empties it once a second:

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

Fifty messages, one `setTicks`, one render. If a coin sent two prices within that second, the later one overwrites the earlier: nobody would have seen the one in between. And if nothing arrived, nothing is painted.

The second is not arbitrary. Binance sends each price roughly once a second, so emptying the buffer more often would not show newer data.

## The coin list travels as a string

The hook takes the symbols joined by commas, `'btc,eth,sol'`, rather than an array. There is a reason:

```js
useEffect(() => {
  conn.wanted = symbolKey ? symbolKey.split(',') : []
  subscribe(conn)
}, [symbolKey])
```

React decides whether to re-run an effect by comparing its dependencies, and two arrays holding the same coins are two different objects: the effect would fire on every render. Two equal strings are equal.

There are also two effects, not one. The first opens the connection exactly once. The second only manages subscriptions, and `subscribe` asks only for the coins the socket is not already streaming. When you press "Load 50 more", the connection stays open and a single message goes out with the new ones.

## When the socket drops

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

It retries after 2, 4, 8 and 16 seconds. If all four fail it declares itself offline and tries again every minute.

Meanwhile the app does not freeze: the ranking was already refreshing over HTTP every minute, and that keeps working. The header says so plainly. Where it read "Live" it now reads "Every 60 s", so a price that is not live is never shown as if it were.

## What I take from it

How often data arrives and how often the screen is painted are two separate decisions. There is room for a buffer between them.
