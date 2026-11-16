---
title: 'How to split a rectangle between 50 coins'
summary: 'The MePulse heatmap uses a squarified treemap: an algorithm from 2000 that fits in one file and keeps every tile readable.'
topic: 'MePulse'
date: 2026-11-16T15:00:00Z
---

The heatmap in [MePulse](https://me-pulse.vercel.app/) draws the 50 largest cryptocurrencies. The area of each tile is its market cap and the color is how much its price moved. Bitcoin takes a huge block; number 50, a tiny square.

Underneath, it is a geometry problem: cut a rectangle into fifty rectangles with given areas. There are infinitely many ways to do it and almost all of them look bad.

## The easy way

The first idea is to slice it into strips: each coin, a column as wide as its share. The areas come out exact and the result is useless.

Small coins end up as stripes two pixels wide and 480 tall. A name does not fit, they cannot be clicked, and the eye cannot compare the area of a stripe with the area of a block.

What you want is for every tile to be as close to a square as possible.

## Rows that close when they get worse

The algorithm is called a *squarified treemap* and was published by Bruls, Huizing and van Wijk in 2000. With the coins sorted from largest to smallest, it does this:

1. Look at the free space and take its shorter side.
2. Start a row along that side and keep adding coins to it.
3. Before adding each one, ask: does the most distorted tile in the row end up worse than before?
4. If it does, close the row, subtract the space it used and go back to step 1 with what is left.

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

"The most distorted" has a formula:

```js
function worst(row, side) {
  // sum, max and min: the total of the row's areas, the largest and the smallest
  const s2 = side * side
  const sum2 = sum * sum
  return Math.max((s2 * max) / sum2, sum2 / (s2 * min))
}
```

It comes from two divisions. A row with total area `sum`, laid along a side of length `side`, has a thickness of `sum / side`. A tile of area `a` inside it is `a / thickness` long. Its ratio, length over thickness, is `a × side² / sum²`.

A 1 is a perfect square; the further from 1, the more distorted. The function returns the worst ratio in the row, which always belongs to either the largest tile or the smallest.

It is a greedy algorithm: it decides with what is in front of it and never goes back, so it does not guarantee the optimal layout. It gives a good one, in about seventy lines and with no dependencies.

## What is not in the paper

Three decisions belong to the app, not to the algorithm.

**Sizes do not move with prices.** Prices change every second, and if the layout were recomputed with each one, the tiles would dance. Size comes from the market snapshot that refreshes every minute, and the layout is only recomputed when that snapshot or the screen width changes. Color and figures do update live.

**Each tile shows what fits.** A large one carries symbol, change and price. A medium one, symbol and change. A small one, just the symbol, and the smallest, nothing. Five tiers decide it from the width and the height.

**2% does not weigh the same in an hour as in a day.** Each period has its own cap for the most intense color: 2% in an hour, 8% in 24 hours, 20% in a week. And intensity follows a square root, so a small move reads as a tint instead of vanishing into the gray:

```js
const t = Math.min(Math.abs(pct) / cap, 1)
const mix = Math.round(18 + 82 * Math.sqrt(t))
return `color-mix(in oklab, var(${pct > 0 ? '--heat-up' : '--heat-down'}) ${mix}%, var(--heat-flat))`
```

Each tile is also a link with a label that states the name, the change and the price, so the map can be walked with a keyboard and with a screen reader.

## What I take from it

Before installing a charting library, it is worth checking whether what you need is a one-page algorithm. This one is more than twenty years old and fits in a single file.
