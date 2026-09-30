# Handover

Maintained throughout the build. Last updated: 30/09/2026.

## Current state

- Phase 0.1: repository initialised. **One branch only: `main`** (Logi-Ink instruction, 30/09/2026).
- Phase 0.2: Vite scaffold, tooling and CI audit gate in place (CI green). Holding page and 404 only.
- Phase 0.3: hosting is **cPanel** (Logi-Ink instruction, 30/09/2026). Cloudflare steps dropped. Staging location and deploy method pending.

## Setup

See `README.md`. `npm ci && npm run build`.

## Hosting — cPanel / Apache

- `npm run build` writes `dist/.htaccess` and `dist/assets/.htaccess`. Tested locally on Apache 2.4.58 (30/09/2026): security headers, noindex header on preview, 404 status with custom page, no directory listing, gzip, one-year cache on hashed assets, HTTPS 301 on production builds.
- Upload the contents of `dist/`, including hidden files, to the document root. Do not edit `.htaccess` on the server; change `scripts/postbuild.js` instead.
- Leave `SITE_ENV` unset (preview/noindex) for staging. Build with `npm run build:production` only for the owner-approved cutover (Phase 11).
- Needs from Logi-Ink: cPanel staging location, deploy method, PHP version (for the enquiry handler).

## Deviations from MASTER_PROMPT.md

| Brief                                      | Now                                                                                                                                                                                                                                                                                                          |
| ------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Cloudflare Pages, stable `*.pages.dev` URL | cPanel staging location `[CONFIRM: staging URL]`                                                                                                                                                                                                                                                             |
| Per-commit preview URLs                    | Not available on cPanel. Pushes to `main` are recorded with their SHA in `docs/release-log.md`                                                                                                                                                                                                               |
| `public/_redirects`, `_headers`            | Generated `.htaccess` (mod_rewrite / mod_headers)                                                                                                                                                                                                                                                            |
| 410 via Pages Function if needed           | Apache `R=410` rewrite rules                                                                                                                                                                                                                                                                                 |
| Pages Functions + D1 + R2 (enquiries)      | Proposed: PHP handler on the same cPanel account, MySQL (durable lead storage), uploads stored outside `public_html`, SMTP via a cPanel mailbox or transactional provider `[CONFIRM]`. Spam protection: honeypot, rate limit, plus Turnstile or reCAPTCHA (both work without Cloudflare hosting) `[CONFIRM]` |

## Integrations

None configured yet. See `.env.example`.

## Open items

- Prior audit files were not supplied (`docs/document-inventory.md`).
- Owner and Logi-Ink questions: `docs/confirmation-register.md`.
- Dev-only `npm audit` advisories via `@lhci/cli` (see `docs/qa-log.md`).
