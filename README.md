# Rockwall Partners

Marketing site for [rockwallpartners.com](https://rockwallpartners.com).

Static HTML. Cloudflare Pages: empty build command, output `/`.

## Files
- `index.html`, `how-it-works.html`, `vendor-savings.html`, `contact.html`
- `styles.css` — full design system (navy #10243E, clay #B4552F, warm paper #FAF8F4; Archivo + IBM Plex Mono).
- `script.js` — nav toggle, phone reveal, mailto form, print button. Unchanged.
- `favicon.svg`, `og-image.png` — new RP mark and share card.
- `owner.jpg` — Anthony portrait.

## Notes
- Phone is live: (806) 433-2461 (set via `data-phone` on `#owner-phone`).
- Calendar button stays hidden until a URL is set in `data-booking-url` on `#open-calendar`.
- Nav's last link renders as the primary CTA button automatically.
