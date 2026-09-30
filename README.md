# Regardin Construction — website rebuild

Static HTML, CSS and vanilla JS built with Vite (multi-page). Rebuild of https://regardinconstruction.co.za/ by Logi-Ink. Full brief: `MASTER_PROMPT.md`.

This repository is **public**. Never commit secrets, enquiry data, client plans or unconfirmed photographs. Raw scraped media stays in the git-ignored `research/_raw/`.

## Requirements

- Node ≥ 22.22 (CI uses Node 24 LTS, see `.nvmrc`), npm 10.

## Scripts

| Command                    | What it does                                                                                      |
| -------------------------- | ------------------------------------------------------------------------------------------------- |
| `npm run dev`              | Local dev server                                                                                  |
| `npm run images`           | Approved originals in `research/_raw/approved/` → AVIF/WebP/JPEG derivatives in `src/assets/img/` |
| `npm run build`            | Preview build (noindex everywhere, `[CONFIRM]` shown as amber markers)                            |
| `npm run build:production` | Production build — **fails** if any `[CONFIRM` remains in `dist/`                                 |
| `npm run lint`             | Prettier check, ESLint, Stylelint                                                                 |
| `npm run validate:html`    | html-validate on `dist/`                                                                          |
| `npm run check:links`      | Internal link check, no `href="#"`                                                                |
| `npm run check:banned`     | Banned demo/cliché content in `src/` and `dist/`                                                  |
| `npm run test:e2e`         | Playwright + axe, keyboard path, screenshots at 360–1920 px                                       |
| `npm run lighthouse`       | Lighthouse CI (mobile) with score thresholds                                                      |
| `npm run audit`            | All of the above in order (section 4 gate)                                                        |

In a root container, point Lighthouse at a Chrome binary with `CHROME_PATH=…`.

## Structure

```
src/            one index.html per route, partials/, data/*.json, styles/, scripts/, assets/
build/          in-repo Vite plugin (includes, {{ data.tokens }}, [CONFIRM] handling)
scripts/        postbuild (headers, robots, sitemap, build gate), checks, image pipeline
public/         copied verbatim (favicon, later _redirects)
tests/          Playwright specs
docs/           registers, logs and plans
```

## Templating

- `<!-- @include name -->` inserts `src/partials/name.html`.
- `{{ business.phone.display }}` inserts a value from `src/data/business.json` (unknown keys fail the build).
- `[CONFIRM: …]` marks a missing fact; `<!-- @unconfirmed --> … <!-- @end-unconfirmed -->` wraps optional claims removed from production.
- `<!-- @noindex -->` keeps a page out of the index in production too.

## Deploy

Cloudflare Pages (pending account access): build command `npm run build`, output `dist`, production branch `main`. Preview builds send `X-Robots-Tag: noindex`.

## URLs

- Repository: https://github.com/logiagenesis/REgardin-Construction
- Stable preview: not yet connected (see `HANDOVER.md`).
