---
title: "11:00 in Tokyo is not 11:00 in your browser"
summary: 'new Date() reads a time without a zone as if it were yours. In a weather app that skews every city’s clock; the way out is to treat it as UTC.'
topic: 'MeAtmos'
date: 2026-11-16T17:00:00Z
---

[MeAtmos](https://me-atmos.vercel.app/) shows the weather in any city at that city's own time. Open-Meteo makes it easy: with `timezone=auto` it returns every time already on the local clock. A response for Tokyo, trimmed:

```json
{
  "utc_offset_seconds": 32400,
  "current": { "time": "2026-09-23T11:00" },
  "daily": { "sunrise": ["2026-09-23T05:31"], "sunset": ["2026-09-23T17:38"] }
}
```

What matters is what is missing: no `Z`, no `+09:00`. That is not an instant, it is a wall-clock time: what a clock hanging on a wall in Tokyo reads.

## What `new Date()` does with it

```js
new Date('2026-09-23T11:00') // 11:00… in the viewer's zone
new Date('2026-09-23')       // midnight… in UTC
```

Two different rules for two nearly identical strings, and neither one is "Tokyo time". Given a date and a time, JavaScript assumes the browser's zone. Given the date alone, it assumes UTC.

From Medellín, which sits at UTC−5, the second one shows up right away: `new Date('2026-09-23')` is seven in the evening on the 22nd, and formatting it prints "Tuesday 22". The whole forecast, shifted by a day.

The first one is sneakier, because it almost always seems to work: you read 11:00, you format it and 11:00 comes out. It fails twice a year and only for some visitors. In Madrid, on the night the clocks go forward in March, 2:00 does not exist: the clock jumps from 1:59 to 3:00. On that day, the hourly forecast of any city would show 3:00 twice and 2:00 not at all.

I develop from Colombia, where the clocks never change. I would never have seen that bug on my own screen.

## UTC on the way in and on the way out

```js
// "2026-09-23T11:00" or "2026-09-23": the city's wall clock
const wallClock = (iso) =>
  new Date(iso.length === 10 ? `${iso}T00:00Z` : `${iso}Z`)

const fmt = (iso, opts) =>
  wallClock(iso).toLocaleString('es', { ...opts, timeZone: 'UTC' })
```

A `Z` is appended so it is read as UTC, and it is formatted asking for UTC. The `Date` object in the middle holds a false instant —it was not 11:00 UTC in Tokyo— but it is never used as an instant: only to format and to subtract.

And UTC has no clock changes, so every hour exists and the subtractions are exact:

```js
const minutesBetween = (fromIso, toIso) =>
  Math.round((wallClock(toIso) - wallClock(fromIso)) / 60000)
```

That gives the length of the day and where the sun is along it. Showing the time does not even need a `Date`: `iso.slice(11, 16)` is already `11:00`.

## The time right now

One detail remains: `current.time` is not the current time, it is the time of the last sample, taken every fifteen minutes. A clock that moves needs the offset the API sends, and the same trick in reverse:

```js
const cityNow = (offsetSeconds) =>
  new Date(Date.now() + offsetSeconds * 1000).toISOString().slice(0, 16)
```

The real instant is shifted by as many seconds as the offset says and then read as if it were UTC. `toISOString` returns something like `2026-09-23T11:07`: the same format the API uses, so the two times can be compared as strings.

## What I take from it

A time without a zone is not an instant: it is text someone read off a clock. `Date` can only store instants, so the conversion has to be chosen on purpose, and done the same way in and out.

`Temporal.PlainDateTime` exists for exactly this. The day it ships in every browser, these ten lines can go.
