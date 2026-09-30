# Changelog

Dates DD/MM/YYYY.

## Unreleased

### 30/09/2026 — site build

- feat: full site — home, services hub and 7 service pages, projects gallery with filter, about, contact with Formspree form, thank-you, privacy notice, 404.
- feat: GA4 via gtag (loads only when configured), floating WhatsApp button, mobile call/quote bar.
- seo: unique titles and descriptions, canonical URLs, Open Graph, GeneralContractor/Service/BreadcrumbList JSON-LD, sitemap.xml, robots.txt.
- chore: two build targets (cPanel, GitHub Pages) as on gas_gas; GitHub Pages preview workflow; `.htaccess` with clean URLs, redirects, 410s, CSP; cPanel release packaging.
- chore: own internal link checker; Apache `.htaccess` test; Lighthouse over every indexable page.
- chore: research tooling removed (research stopped on instruction).

### 30/09/2026 — setup

- chore: repository initialised (`MASTER_PROMPT.md`, `.gitignore`, `README.md`); `main` created.
- chore: Vite 8.3.1 multi-page scaffold, in-repo partials/data plugin, `[CONFIRM]` preview marker and production build gate, `_headers`/robots/sitemap generation, sharp image pipeline, holding page and 404.
- chore: audit tooling (Prettier, ESLint, Stylelint, html-validate, link check, banned-content grep, Playwright + axe, Lighthouse CI) and GitHub Actions audit gate.
- chore: hosting switched to cPanel — `_headers` replaced by generated `.htaccess` (headers, noindex on preview, 404, gzip, caching, HTTPS on production); Cloudflare dropped; single `main` branch.
- feat: Phase 1 research tooling — read-only live-site scraper (sitemaps, feeds, REST API, crawl, rendered pass, screenshots, media) and asset-manifest/contact-sheet builder.
- docs: evidence register and audit reconciliation seeded from the brief; live re-check pending network access.
- docs: document inventory, QA log, confirmation register, release log, handover.
