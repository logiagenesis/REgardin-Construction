# Regardin Construction — website

Static HTML, CSS and vanilla JS built with Vite. Production: cPanel (Apache). Preview: GitHub Pages.

- **Preview:** https://logiagenesis.github.io/REgardin-Construction/ (every push to `main`; noindex)
- **Live domain (after cutover):** https://regardinconstruction.co.za
- **One branch only:** `main`.

This repository is **public**. Never commit secrets, enquiry data or unapproved photographs.

## Requirements

Node ≥ 22.22 (CI uses Node 24, see `.nvmrc`).

## Where things live

| Path                                                     | What                                                                                                      |
| -------------------------------------------------------- | --------------------------------------------------------------------------------------------------------- |
| `src/data/site.js`                                       | Business facts and the three integration settings (`config`: Formspree endpoint, GA4 ID, WhatsApp number) |
| `src/data/services.js`, `projects.js`, `testimonials.js` | Services, gallery items and client words                                                                  |
| `src/images/`                                            | Supplied photographs, named as listed in `docs/TODO_CONFIRM.md`                                           |
| `src/css/site.css`, `src/js/site.js`                     | All styling and the progressive-enhancement script                                                        |
| `scripts/build-pages.mjs`                                | Generates every page into `build/site/` and writes `docs/TODO_CONFIRM.md`                                 |
| `scripts/postbuild.js`                                   | `.htaccess` (cPanel), `robots.txt`, `sitemap.xml`                                                         |
| `docs/TODO_CONFIRM.md`                                   | Everything still to be supplied — regenerated on every build                                              |

## Scripts

| Command                 | What it does                                                                                   |
| ----------------------- | ---------------------------------------------------------------------------------------------- |
| `npm run dev`           | Local dev server                                                                               |
| `npm run build:cpanel`  | Production build for cPanel (base `/`, `.htaccess`, indexable)                                 |
| `npm run build:pages`   | Preview build for GitHub Pages (base `/REgardin-Construction/`, noindex, no `.htaccess`)       |
| `npm run package`       | Zips `dist/` for cPanel into `release/`; refuses while placeholders remain                     |
| `npm run lint`          | Prettier, ESLint, Stylelint                                                                    |
| `npm run validate:html` | html-validate on `dist/`                                                                       |
| `npm run check:links`   | Every internal href/src/srcset and #fragment resolves; no `href="#"`                           |
| `npm run check:banned`  | Demo leftovers and cliché phrases in `src/` and `dist/`                                        |
| `npm run test:e2e`      | Playwright + axe on every page, keyboard path, screenshots at 360–1920 px                      |
| `npm run lighthouse`    | Lighthouse CI (mobile) on every indexable page                                                 |
| `npm run qa:apache`     | `.htaccess` behaviour against a local Apache serving `dist/` (default `http://localhost:8088`) |

## Adding photographs

1. Save each photo as JPG in `src/images/` with the exact filename from `docs/TODO_CONFIRM.md`.
2. `npm run build:cpanel` — the placeholder is replaced by responsive AVIF/WebP/JPEG automatically.

## Deploying to cPanel

1. Fill in `config` in `src/data/site.js` and resolve `docs/TODO_CONFIRM.md`.
2. `npm run build:cpanel && npm run package`.
3. Upload the zip to `public_html` in cPanel File Manager and extract it (hidden `.htaccess` files included).
