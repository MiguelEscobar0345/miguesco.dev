---
title: 'The language switch that sent me to the footer'
summary: 'I switched language from the very top of the page and landed in the footer. The bug was trusting the URL, and my own test was hiding another.'
topic: 'miguesco.dev'
date: 2026-11-16T11:00:00Z
---

This site is in Spanish and English, and I wanted to get one detail right: if you are reading the pricing and switch language, you should stay on the pricing, not go back to the top.

The first version did the obvious thing. The sections share the same id in both languages, so it was enough to carry over the anchor in the URL:

```js
link.addEventListener('click', (event) => {
  const hash = window.location.hash
  if (!hash) return
  event.preventDefault()
  window.location.href = link.pathname + hash
})
```

It worked in every test I ran. Until I switched language from the very top of the page and landed in the footer.

## The anchor does not say where you are

Reproducing it took a specific sequence: click "Contact" in the menu, scroll back up with the wheel, and then switch language.

Clicking "Contact" makes the URL end in `#contact`. Scrolling up by hand moves the page, but **the URL does not change**: it still says `#contact` even though you are looking at the hero. My code read that stale anchor and sent you to contact, in the other language.

The anchor in the URL is not your position. It is the last link you clicked.

## Asking the page instead

The fix was to stop looking at the URL and look at which section actually fills the screen:

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

It looks for the section crossing an imaginary line a third of the way down the window. If there is none, you are on the hero and the link does the normal thing.

As a bonus it fixed a case the earlier version never covered: someone who scrolls down without touching the menu has no anchor in the URL, and used to be sent back to the top every time.

## The bug that was in my test

I wrote an automated test and it failed: it claimed that from "Pricing" you jumped to "Services", one section earlier. I spent a while hunting for the mistake in code that was fine.

The problem was the tool. Before clicking an element, Playwright makes sure it is in view, and with a sticky header that scrolled the page almost 500 pixels right before the click. The test was measuring a position it had just changed itself.

Clicking with the mouse at the button's coordinates, without that adjustment, everything came out as it should.

## What I take from it

It was the same mistake twice in different clothes: trusting a source that was not saying what I thought it said. First the URL, then my own test.
