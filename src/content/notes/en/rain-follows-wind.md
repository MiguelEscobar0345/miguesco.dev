---
title: 'Rain that falls the way the wind blows'
summary: 'The sky in MeAtmos is drawn on canvas from the real data: how much rain, which way it slants and when to stop animating.'
topic: 'MeAtmos'
date: 2026-11-16T14:00:00Z
---

In [MeAtmos](https://me-atmos.vercel.app/) the main card is a window onto the sky of the city you searched for. If it is raining there, it rains; if it is windy, the rain falls at a slant; at night the stars come out, fewer of them the cloudier it is.

It is not a video or a set of backgrounds. It is drawn on a `<canvas>` from the same data the app shows as figures.

## From data to a scene

One function turns the weather into a description of what to draw:

```js
skyConfig(weather)
// { rain: 130, drizzle: 0, snow: 0, stars: 0, clouds: 5,
//   fog: 0, lightning: false, night: false, slant: 0.31 }
```

The number of drops comes from the weather code: 80 for light rain, 190 for heavy rain. Stars only appear at night and fade with cloud cover: `110 * (1 - cover * 0.85)`. Clouds depend on how much of the sky is covered.

The drawing knows nothing about weather. It only receives those numbers.

## The wind comes from one side and the rain goes to the other

```js
// Direction is where the wind comes FROM; drops travel the other way
const toward = ((c.wind_direction_10m + 180) * Math.PI) / 180
const slant = Math.sin(toward) * Math.min(c.wind_speed_10m / 45, 0.55)
```

In meteorology, wind direction is where the wind comes from. A west wind, 270°, pushes the drops east: add 180° and the sine is 1, the maximum slant to the right. With a north wind the sine is 0 and the rain falls straight, because on a screen north points into the distance.

Speed decides how much, capped at 0.55. Any more slant than that stops reading as rain and starts looking like stripes.

## Positions from 0 to 1

Each drop stores its position as a fraction of the canvas, not in pixels:

```js
d.y += d.speed * dt
d.x += cfg.slant * d.speed * dt * (h / w)
if (d.y > 1.05) { d.y = -0.05; d.x = rnd(-0.2, 1.2) }
```

That way a resize never forces a reset: rotate the phone and the scene stretches and carries on.

The `h / w` is there because a fraction of the width and a fraction of the height are not the same length. Without that correction, on a wide card a drop would move at one angle and be drawn at another.

Drops are born between −0.2 and 1.2, slightly outside the edges. When it is windy, the ones coming in from the side have to come from somewhere.

## The time between frames

```js
const dt = Math.min(0.05, (t - last) / 1000)
```

Every movement is multiplied by `dt`, the seconds since the previous frame, so the rain falls just as fast on a 60 Hz screen as on a 120 Hz one.

The 0.05 cap covers the odd case: if the browser stalls for a while, the next frame does not jump several seconds ahead.

## Knowing when not to draw

A continuous animation drains battery even when nobody is looking, so the loop only runs when three things hold:

```js
const should = animate && visible && document.visibilityState === 'visible'
```

- **`visible`** is decided by an `IntersectionObserver`. If you scrolled down to the forecast and the card left the screen, it stops.
- **`visibilityState`**: if you switched tabs, it stops.
- **`animate`** is false for anyone who asked their system for less motion. They get a single frame —the right sky, standing still— and no loop.

And in React, the scene only restarts when the sky changes, not every time new data arrives:

```jsx
const config = JSON.stringify(skyConfig(weather))

useEffect(() => {
  return runSky(ref.current, JSON.parse(config), !prefersReducedMotion())
}, [config])
```

The configuration travels as a string for the same reason as [the coin list in MePulse](/en/notas/one-render-per-second): to React, two equal objects are not equal and two equal strings are.

## What I take from it

What makes the scene believable is not the number of particles: it is that each one obeys a real figure. And what makes it viable is knowing when not to draw it.
