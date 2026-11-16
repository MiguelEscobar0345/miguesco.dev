---
title: 'A CSP without unsafe-inline, and what it broke in production'
summary: 'A strict security policy that worked perfectly on my machine and, in production, blocked a script I had never added.'
topic: 'miguesco.dev'
date: 2026-11-16T13:00:00Z
---

A Content-Security-Policy tells the browser where a page is allowed to load things from. Most of the ones you see in the wild include `'unsafe-inline'`, which is roughly an armoured door with the key left in the lock: it allows any script written inside the HTML, which is exactly what an attacker is trying to slip in.

This site loads nothing from outside —no fonts, no CDNs, no tracking pixels— so I set out to have a policy without that exception.

## Hashes instead of blanket permissions

The catch is that the page does have inline scripts of its own: the one that applies the theme before first paint, and the language and currency switchers. The way to allow them without opening the door to everything is to declare the exact fingerprint of each one. Astro works it out at build time:

```js
// astro.config.mjs
security: {
  csp: {
    algorithm: 'SHA-384',
    directives: [
      "default-src 'self'",
      "img-src 'self' data:",
      "base-uri 'none'",
      "form-action 'none'",
    ],
  },
},
```

The result is a `<meta>` tag with one hash per script. If someone manages to inject code, its fingerprint is not on the list and the browser will not run it.

## Two things the tutorials leave out

**`frame-ancestors` does not work in a `<meta>`.** It is the directive that stops another site from putting yours inside an iframe, and the browser ignores it unless it arrives as an HTTP header. It lives separately, in the hosting configuration.

**Changing styles from JavaScript is allowed.** The policy blocks `style` attributes written in the HTML, but not `element.style.setProperty()`. That is why the project covers on this site can tilt towards the pointer without touching the policy.

## What it broke in production

Locally everything passed: a clean console on every page. I deployed, opened the console on the real site, and there was an error on each one.

Cloudflare, where the site is hosted, injects its analytics script into the HTML as it serves it. That script exists neither in my code nor in my build, so it was not on the list and the policy blocked it. I had analytics switched on and not working, and looking only at my local environment I would never have found out.

The fix was to name that origin, and only that one:

```js
scriptDirective: {
  resources: ["'self'", 'https://static.cloudflareinsights.com'],
},
```

## What I take from it

A strict policy gets tested against the deployed site, not against the build. Whatever your provider adds along the way is not in your repository, and it is exactly what a well-made CSP is going to block.
