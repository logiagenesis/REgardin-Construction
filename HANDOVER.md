# Handover

Maintained throughout the build. Last updated: 30/09/2026.

## Current state

- Phase 0.1: repository initialised; `main` created (same commit as `claude/new-session-0ea69p`).
- Phase 0.2: Vite scaffold, tooling and CI audit gate in place. Holding page and 404 only.
- Phase 0.3: **blocked** — Cloudflare Pages not connected (needs account access).

## Setup

See `README.md`. `npm ci && npm run build`.

## Hosting (to do when access is granted)

1. Cloudflare dashboard → Workers & Pages → Create → Pages → connect GitHub `logiagenesis/REgardin-Construction`.
2. Production branch `main`; build command `npm run build`; output directory `dist`; environment variable `NODE_VERSION=24`.
3. Leave `SITE_ENV` unset (preview/noindex) until launch. Set `SITE_ENV=production` only at the owner-approved cutover (Phase 11).

## Integrations

None configured yet. See `.env.example` for the planned variables.

## Open items

- GitHub default branch should be `main` — verify in repo Settings → Branches.
- Prior audit files were not supplied (`docs/document-inventory.md`).
- Owner questions: `docs/confirmation-register.md`.
- Dev-only `npm audit` advisories via `@lhci/cli` (see `docs/qa-log.md`).
