# Handover

Maintained throughout the build. Last updated: 30/09/2026.

## Current state

- Site built: home, services hub, 7 service pages, projects gallery, about, contact (Formspree form), thank-you, privacy notice, 404.
- Preview: https://logiagenesis.github.io/REgardin-Construction/ via `.github/workflows/deploy-pages.yml` (standing rule: this workflow stays).
- Quality gate: `.github/workflows/ci.yml` on every push to `main`.
- No photographs have been supplied, so every image slot shows a hatched placeholder naming the file it needs.
- Research (live-site scraping) stopped on instruction, 30/09/2026. No external site was scraped.

## To supply

See `docs/TODO_CONFIRM.md` (regenerated on every build): 3 settings, the missing facts, and the photographs by filename.

## Integrations (single config values in `src/data/site.js`)

| Setting             | Behaviour until supplied                                                        |
| ------------------- | ------------------------------------------------------------------------------- |
| `formspreeEndpoint` | Form validates; with JavaScript it shows "not connected yet" instead of posting |
| `ga4Id`             | gtag.js is not loaded at all                                                    |
| `whatsappNumber`    | Floating button is visible but points to a placeholder number                   |

GA4 events (only when an ID is set): `click_call`, `click_whatsapp`, `click_email`, and `generate_lead` once on the thank-you page after Formspree accepts the form. No personal data is sent to analytics.

## Hosting — cPanel / Apache

`npm run build:cpanel` writes `dist/.htaccess`: HTTPS and www→bare-domain redirects, clean URLs (`/x/index.html` and `/x.html` → `/x/`), 301s from the old WordPress pages, 410 for the old demo content, security headers including a Content-Security-Policy, gzip, caching (a year for hashed assets), and the custom 404. Checked against Apache 2.4 by `npm run qa:apache` locally and in CI.

## Decisions

- One font family: Archivo (variable width and weight), self-hosted from `@fontsource-variable/archivo`.
- Testimonials are quoted word for word from the old site, excerpted with ellipses only.
- No prices, registrations, response times, areas or experience claims appear; they are `[CONFIRM]` markers until supplied.
- `npm run package` refuses to build a release zip while any placeholder remains.
