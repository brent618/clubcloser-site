# Club Closer — funnel site

The Club Closer landing page and post-booking thank-you page. It's plain HTML, CSS and JavaScript with no build step, and it's hosted on Vercel.

| Page | File |
|---|---|
| Landing page (`/`) | `index.html` |
| Thank-you page (`/thank-you`) | `thank-you/index.html` |
| Styles (brand colours, fonts) | `assets/css/styles.css` |
| **Settings: calendar, form, videos, pixel** | `assets/js/config.js` |
| Behaviour (tracking, pop-ups, FAQs) | `assets/js/main.js` |

## Plugging things in

Open `assets/js/config.js` and fill in:

- `calendarUrl` / `calendarType`: your iClosed, GoHighLevel or Calendly booking link. In that tool, set the redirect after booking to `https://YOUR-DOMAIN/thank-you`.
- `joinFormEndpoint`: a webhook URL for the free sign-up form (GoHighLevel, Zapier, Make, Kit…).
- `videos.founder` / `videos.precall`: Wistia video IDs.
- `metaPixelId`: your Meta Pixel ID.

Every booking automatically carries the visitor's UTM tags plus `lp_variant`. That means bookings can be traced back to the exact YouTube or Instagram link and page version they came from.

## Brand fonts

Put the licensed web font files in `assets/fonts/` with these names:

- `AliasBoldExpanded.woff2`
- `Gotham-Book.woff2`
- `Gotham-Bold.woff2`

They take over automatically. Until then, Archivo Expanded and Montserrat are used as stand-ins.

## Adding content

- **Member interview:** in `index.html`, put the Wistia ID in `data-wistia=""` on the interview button and replace the bracketed text.
- **Win screenshot:** save the image to `assets/img/wins/`, then replace `[Win screenshot]` with `<img src="/assets/img/wins/name.jpg" alt="Win from Name">`.
- **FAQ video answer:** on the thank-you page, put the Wistia ID in `data-wistia=""` on `.faq-video`.

## Publishing

Every push to the `main` branch deploys to Vercel automatically. Other branches get their own preview link.
