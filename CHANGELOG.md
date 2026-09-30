# Changelog

Dates DD/MM/YYYY.

## Unreleased

### 30/09/2026

- chore: repository initialised (`MASTER_PROMPT.md`, `.gitignore`, `README.md`); `main` created.
- chore: Vite 8.3.1 multi-page scaffold, in-repo partials/data plugin, `[CONFIRM]` preview marker and production build gate, `_headers`/robots/sitemap generation, sharp image pipeline, holding page and 404.
- chore: audit tooling (Prettier, ESLint, Stylelint, html-validate, link check, banned-content grep, Playwright + axe, Lighthouse CI) and GitHub Actions audit gate.
- chore: hosting switched to cPanel — `_headers` replaced by generated `.htaccess` (headers, noindex on preview, 404, gzip, caching, HTTPS on production); Cloudflare dropped; single `main` branch.
- docs: document inventory, QA log, confirmation register, release log, handover.
