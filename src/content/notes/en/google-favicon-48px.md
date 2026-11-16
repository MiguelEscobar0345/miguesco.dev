---
title: "Why Google would not show my site's favicon"
summary: 'The icon looked fine in the browser, but Google drew a generic globe. The cause: a size rule almost nobody mentions.'
date: 2026-11-16T12:00:00Z
---

I published this site, searched for it on Google, and next to the result my logo was missing: in its place was the grey globe Google uses when it has nothing better. In the browser tab, meanwhile, the icon looked perfect.

My first thought was what everybody thinks: it just needs time. It did not.

## The 48-pixel rule

Google documents a requirement that browsers do not have: the favicon it shows in search results must be **a square whose side is a multiple of 48 pixels**. That means 48, 96, 144 or 192. SVGs are exempt, because they have no fixed size.

My `favicon.ico` held a single 32×32 image. For a browser tab that is exactly right; for Google it does not qualify, so it was discarded without a word. No error shows up in Search Console or anywhere else: you simply get the globe.

## What I changed

An `.ico` can hold several images. Mine went to three —16, 32 and 48— and I also declared a 192 PNG, which is 48 × 4:

```html
<link rel="icon" href="/favicon.ico" sizes="16x16 32x32 48x48" />
<link rel="icon" href="/favicon.svg" type="image/svg+xml" sizes="any" />
<link rel="icon" href="/icon-192.png" type="image/png" sizes="192x192" />
```

While I was there I removed the fixed `width` and `height` from the SVG, which were stopping it from scaling.

## How to see what Google has

This was the most useful thing I learned. Google has a service that returns the favicon it holds for any domain:

```
https://www.google.com/s2/favicons?domain=yourdomain.com&sz=128
```

If it answers with the globe, it has not picked up your icon yet. If it answers with your logo, it already has it and what is lagging is the search listing.

## What I did not know

- **Requesting indexing does not refresh the icon.** Google crawls favicons with a separate, far less frequent process. The "Request indexing" queue has nothing to do with it.
- **Changing the icon restarts the wait.** Each new version is evaluated from scratch, so once it is fixed the best move is to leave it alone.
- **It does not affect ranking.** It is cosmetic. Annoying, but it will not cost you a position.

I left the check in the script that audits the site before every deploy: if the `.ico` has no image of 48 pixels or more, the deploy does not go out.
