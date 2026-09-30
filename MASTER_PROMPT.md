# Regardin Construction — Claude Code Master Build Prompt

Ref: LI-PROMPT-REGARDIN-0926 · Rev 2 · 30/09/2026 · Logi-Ink

How to use: open Claude Code in an empty folder, save this file there as `MASTER_PROMPT.md`, put the prior audit files into `research/prior-audits/`, and paste the kickoff line from the chat. Everything below the line is written to Claude Code.

---

## 1. Role and mission

You are Claude Code acting as lead front-end engineer, art director, construction-sector copywriter, technical SEO/AEO lead, accessibility tester and release engineer.

You are rebuilding the website for **Regardin Construction** (Kensington, Cape Town, South Africa) from scratch. The current site (https://regardinconstruction.co.za/) is a WordPress/Elementor build cloned from a finance demo template, with real Regardin content layered on top of demo leftovers. The new site must be substantially better in look, content and lead generation. It must look like a bespoke architectural studio site, never like a template or a cheap AI site. For a construction company the look and feel IS the selling point, backed by real evidence of work.

Do the work. Do not stop at recommendations or wireframes.

## 2. Absolute rules

1. **Never invent facts.** No made-up statistics, reviews, ratings, registrations, insurance, prices, timelines, guarantees, response times, suburbs, project details, team members, founding dates or history. A claim published on the old site is a *published claim*, not an approved fact.
2. **Never guess.** If something is unknown: inspect, test, or log it in `docs/confirmation-register.md`. Record every check in `docs/qa-log.md`.
3. **UK / South African English** throughout (colour, metre, organise, centre). Dates DD/MM/YYYY. Currency ZAR (R). Timezone Africa/Johannesburg.
4. **Push to GitHub the moment anything is finished.** When unsure, push. If in doubt, push. A finished unit that is not pushed is a FAIL.
5. **Audit before every push.** A finished unit that has not been audited, with the faults found already fixed, is a FAIL. See section 4.
6. **Never publish AI-generated images as Regardin work.** Project, portfolio, case-study and before/after imagery must be real, approved photographs.
7. **No demo content survives.** No Lorem Ipsum, finance content, fake staff, "Johnson Group, US", ThemeForest references.
8. **Placeholders:** use `[CONFIRM: description]` for missing facts. On preview builds these render as a visible amber marker so gaps are obvious. The production build must FAIL if any `[CONFIRM` string remains in `dist/` (build gate). Unconfirmed optional claims are omitted from production, not shown.
9. **Do not touch the live WordPress site, DNS, mail records, Google accounts or ad spend.** Read-only passive inspection only. No intrusive security scans, no exploit payloads.
10. **The repository is PUBLIC.** Everything pushed is visible to anyone. Never commit secrets, API keys, lead/enquiry data, client plans, owner answers containing personal details beyond what the live site already publishes, or photos whose use is not yet confirmed. `.env.example` only. Raw scraped media originals stay in a git-ignored `research/_raw/` folder; only optimised derivatives of real work go into `src/`.

## 3. Git and preview contract

- Repo: `https://github.com/logiagenesis/REgardin-Construction.git` (capital "RE" is part of the name). Status on 30/09/2026: **public, and empty — no commits, no branches.** First task: confirm `gh auth status`, clone, set `main` as default branch, and make the first commit (`MASTER_PROMPT.md`, `.gitignore`, `README.md`). If the push is rejected (auth or a branch ruleset), STOP and report the exact error. Do not create another repo.
- Before changing anything after the first commit, re-read every file in the repo (including hidden files). Do not force-push or rewrite history. Do not overwrite a dirty working tree.
- Branch: push to `main`. The new site is not on the live domain, so `main` is the preview, not production. Domain cutover is a separate, owner-approved step (Phase 11).
- Hosting: Cloudflare Pages connected to the repo `[CONFIRM: host — default Cloudflare Pages]`. `main` deploys to the stable `*.pages.dev` URL; every commit also gets its own preview URL. A GitHub link is not a preview. Localhost is not a preview.
- Commit style: `feat:`, `fix:`, `content:`, `seo:`, `perf:`, `a11y:`, `docs:`, `audit:`, `chore:`.
- If interrupted, push a clearly named checkpoint commit (`chore: checkpoint – <what>`).
- **After every push, print this block:**

```
PUSHED
Commit: <sha>  (verified on remote: yes/no)
What changed: <one line>
Checks run: <list>  Faults found/fixed: <n>/<n>
Stable URL: https://<project>.pages.dev
Commit preview: <url>  (opened and checked: yes/no)
Open blockers: <list or none>
```

- Update `HANDOVER.md` in the same commit whenever a change affects setup, content, integrations or open items. The handover document is maintained for the whole build, not written at the end.

## 4. Audit-before-push gate (every unit)

Run, fix, re-run, then commit and push:

1. `npm run build` — zero errors, zero warnings.
2. Lint/format (Prettier + Stylelint + ESLint, minimal config).
3. `html-validate` on `dist/` — clean.
4. Link check (`linkinator` or `lychee`) — zero broken links, zero real CTAs pointing to `#`.
5. Playwright + `@axe-core/playwright` — zero axe violations on changed routes; keyboard path through header, menu, form.
6. Playwright screenshots at 360, 390, 768, 1024, 1440, 1920 px — inspect for overflow, clipping, orphans, contrast, broken images.
7. Lighthouse CI (mobile) on changed routes — targets: Performance ≥ 90, Accessibility 100, Best Practices ≥ 95, SEO 100. Record real scores; fix causes, never hide warnings.
8. Banned-content grep across `src/` and `dist/`: `lorem`, `ipsum`, `Steven Monroe`, `Michael King`, `Johnson Group`, `efinance`, `surielementor`, `themeforest`, `Finanve`, `Floorscreeed`, `Carpentery`, `seamless`, `dream home`, `top-notch`, `look no further`, `exceed your expectations`, `no project too big`, `one-stop`, `world-class`, `unmatched`, `flawless`.
9. Truth check: every factual claim on changed pages traces to an entry in `docs/evidence-register.csv` with status `owner-approved` or `verified-live` (or is wrapped in `[CONFIRM]`).
10. Append results to `docs/qa-log.md` (issue, severity, route, evidence, fix commit, retest result).

## 5. Stack

Logi-Ink house standard for this project: **static HTML, CSS, vanilla JS, built with Vite.** No React/Vue/Astro/Next, no Tailwind or UI kits, no page builders, no jQuery, no slider libraries.

- Vite multi-page build (one HTML entry per route). Verify the current stable Vite and Node versions from official docs before installing; pin versions in the lockfile; do not blindly install "latest".
- Shared header/footer/CTA partials via a small in-repo Vite plugin (`transformIndexHtml`) — write it yourself; no heavy templating dependency.
- Content and business facts as JSON in `src/data/` (`business.json`, `services.json`, `projects.json`, `testimonials.json`, `faqs.json`) injected at build, so one source feeds pages, schema, footer and llms-style summaries.
- Images: `sharp` prebuild script → AVIF + WebP, responsive `srcset`, explicit width/height, hero not lazy-loaded and ≤ ~200 KB, everything below the fold lazy.
- CSS: hand-written, design tokens as custom properties, modern layout (grid/flex, `clamp()`), no framework.
- JS: progressive enhancement only. The site must be fully usable and the quote form must submit without JavaScript.
- Enquiry backend: Cloudflare Pages Functions + D1 (durable lead storage) + R2 (private photo/plan uploads) + Turnstile + transactional email provider `[CONFIRM: provider and recipient mailbox]`.
- Dev-only tooling allowed: Playwright, axe-core, Lighthouse CI, html-validate, linkinator, Prettier, ESLint, Stylelint, sharp.
- Build scripts generate `sitemap.xml`, `robots.txt` and route-level meta from the data files.
- Separate preview and production config: previews get `X-Robots-Tag: noindex`; production must be verified crawlable.

## 6. Source of truth — audit reconciliation

Five prior audits were supplied (Kimi K3, GPT 6.1 ×2, Opus 5.5 ×2, GPT 5.5 Pro, plus the "Collective" merge). They conflict. Findings below were reconciled and, where marked, re-checked live on 30/09/2026. Re-verify everything yourself in Phase 1; this table is a lead, not a substitute.

### 6.1 Corrected or rejected prior findings

| Prior claim | Status | Correct position |
|---|---|---|
| Site is a single page; sitemap has 1 URL | Wrong | `/sitemap.xml` is a broken one-line file (`//regardinconstruction.co.za`). The real WP sitemap `/wp-sitemap.xml` lists 8 child sitemaps and 44 URLs. Re-checked live 30/09/2026. |
| Images hosted on sspark.genspark.ai | Wrong | All 12 homepage images load from `regardinconstruction.co.za` (`/wp-content/uploads/`). Genspark URLs were a crawler artefact. Re-checked live. |
| Service blocks have no body text | Wrong | Five service blurbs exist; headings link to `#`. |
| Contact details not retrievable | Wrong | Homepage shows `+27 79 454 9780`, `regardbothma@icloud.com`, "Kensington, Cape Town", with working `tel:` and `mailto:` links. Re-checked live. |
| Header Call/Email links go to `#` | Partly wrong | True on the standalone `/tf_header_footer/header/` template. Homepage header has working links (one other `href="#"` exists). Verify every page rendered. |
| No meta description / no schema | Homepage confirmed | Homepage has no meta description and no JSON-LD (re-checked live). Other pages not yet checked. |
| Admin username `xiluva` exposed | Partly | `/wp-json/wp/v2/users` publicly returns slug `xiluva` (re-checked). A public slug does not prove it is the login name. |
| `xmlrpc.php` exposed = vulnerability | Overstated | It is enabled and advertised; that is not proof of an exploitable configuration. Passive note only. |
| NHBRC does not apply to renovations | Unsafe as evergreen copy | The Housing Consumer Protection Act 2024 has not commenced; NHBRC operates under the 1998 Act until the commencement date is proclaimed, and its expanded mandate over extensions and renovations only applies from then (Minister of Human Settlements reply, PMG, 23/10/2025). One trade source expects full effect in 2027. Never publish an exemption statement or a registration claim. Any FAQ on this needs owner/legal sign-off. |
| FAQ schema gives rich results | Wrong | Google stopped showing FAQ rich results on 07/05/2026. Keep useful FAQs for users and AEO; do not promise rich results. |
| AggregateRating on own site for stars | Wrong | Self-serving review markup does not earn Google review stars. No AggregateRating workaround. |
| More Google reviews = more Ads spend | Wrong | Reviews do not measure ad spend. Use Google Ads Transparency Center for actual ad evidence. |
| "Owner on every job", "all trades in-house", "no surprises on the invoice", "engineer-spec'd", "on time and within budget" | Invented by earlier drafts | Not verified. Do not publish unless the owner approves in writing. |
| Nanoscreed HD = 25 MPa | Unverified for copy | Do not publish product specs without a current manufacturer document and owner confirmation that the service is offered. |
| Trak Construction, Grow Construction as local competitors | Rejected | Not established as Cape Town competitors. Design reference only. |
| Timezone set to GMT+0 | Not proven | Sitemap timestamps alone don't prove config. Irrelevant to the new static site anyway. |
| llms.txt helps rankings | Not a ranking factor | Google does not require llms.txt or special AI markup. You may ship a factual `llms.txt` as a harmless summary, but do not sell it as an SEO lever. |

### 6.2 Published evidence (usable only once owner-approved)

Re-checked on the live homepage 30/09/2026 unless noted.

| Item | Value | Status |
|---|---|---|
| Trading name | Regardin Construction | verified-live |
| Current tagline | "Excellence in Every Detail." | verified-live |
| Phone | 079 454 9780 / +27 79 454 9780 (`tel:+27794549780`) | verified-live |
| Email (homepage, contact) | regardbothma@icloud.com | verified-live — CONFLICT |
| Email (Terms/Privacy, per audits) | info@regardinconstruction.co.za | published-claim — CONFLICT |
| Location | Kensington, Cape Town | verified-live |
| Street address (Terms, per audits) | 139 12th Avenue, Kensington | published-claim — publish? unknown |
| Directory location (Business Pages 4 SA, Aug 2025) | "Cape Town CBD" | third-party-claim — CONFLICT |
| Experience | "nearly two decades" | verified-live — CONFLICT with "since 2004" (~22 years) |
| Positioning | high-end residential and commercial construction | verified-live |
| Services (site) | brickwork, renovations, alterations, painting, maintenance, carpentry, decking, timber pergolas, concrete (driveways, slabs, pool structures), custom work ("Imagination Creation") | verified-live |
| Services (footer) | garden hardscaping, new homes, civil projects (private and commercial) | verified-live |
| Portfolio labels (per audits) | Painting, Boundary Wall, Exterior Painting, Pool Plastering, Scratch Plaster, Floor Screed, Concrete Stairs, Walk-in Closet, Countertop, Carpentry, Decking, Patio Building, Concrete Walls | published-claim (live typos "Floorscreeed", "Carpentery") |
| Directory services (givingmore.co.za) | Nanoscreed HD flooring, plastering, staircases, walling, pool renovation, hardscaping, civil, new builds | third-party-claim |
| Existing "free quote" offer | "Get a free quote today" on homepage | verified-live — confirm it is actual policy |
| Terms (per audits) | quotes valid 30 days; deposit before work; final payment on completion unless agreed; warranty per contract; SA law | published-claim |
| Owner | Regard Bothma | published-claim (via AcB Projects and email); confirm role and legal entity |
| Owner history (acbp.co.za, AcB Projects, same phone) | 2004 UK junior foreman / first-fix carpenter; from 2006 SA site manager on high-end residential; later site/project manager on hardscaping, new homes, civil | third-party-claim — do not transfer AcB history, projects or reviews without approval |
| Social | facebook.com/Regardin.Construction; instagram.com/regardin_construction | third-party-claim — verify ownership before linking |
| Existing Google tag | `GT-5DCV555P` on live site (Site Kit) | verified-live — GA4/GSC properties may already exist; find them before creating new ones |
| Stack (per audits) | WordPress, Elementor, Slider Revolution, WPForms Lite (form 2262), Google Site Kit, cloned from surielementor.com/efinance | published evidence |

### 6.3 Testimonials (exact live text, 30/09/2026)

Show each once. Do not rewrite, embellish, add stars, dates or suburbs. Do not relabel as Google reviews. Excerpting with an ellipsis is allowed; any spelling correction (e.g. "bar non" → "bar none") requires owner approval `[CONFIRM]`.

Tarah Leonard:
> If you are looking for a Handyman to help around the house or looking to do major renovations or construction on your property Regard at Regardin Construction is amazing, professional and goes beyond to ensure you are a happy customer! His precision to detail is outstanding! I would recommend him over and over again! It's a bonus that he works in both Southern suburbs and Northern suburbs! Very happy customers this side 😊👍

Beverley Kolbe:
> I have been working with Regardin on my home renovations for the past 4 months having returned to Cape Town to semi retire. I purchased a fixer upper in the Southern Suburbs that needed to be gutted and modernized…. See pictures ..Not only is Regardin professional he is honest and knowledgeable on ALL aspects of building, interior and exterior work…his team of workers are bar non the most hardworking men, respectful and polite… I have just had my "UNDER THE TUSCAN SUN" (movie reference) welcome home! I highly recommend Regardin and his team for any building needs you may have.

"Suzie" (AcB Projects site): DO NOT PUBLISH until owner confirms permission, relationship and attribution.

### 6.4 Confirmed demo contamination (do not recreate)

- Posts: `/why-do-i-need-to-use-financial/` (still live 30/09/2026), `/why-your-sales-forecast-is-off/`, `/6-tips-to-retain-your-top-sales-talent/`, `/what-the-martian-can-teach-sales/`
- Portfolios `/portfolios/`: investment-planning, enterprise-loan, oak-tree-solutions, event-finder, financial-report, mo-insurance, money-market, business-solutions ("Johnson Group, US")
- `/our-team/`: "Steven Monroe – Founder & CEO", "Michael King", Lorem Ipsum
- `/blog/`: Lorem Ipsum
- Templates: `/tf_header_footer/header/`, `/tf_header_footer/footer/` ("My Blog", "My Home")
- Taxonomies: categories Business, Finanve, Insurance, Leasing; 9 tags incl. Themeforest; 7 portfolio categories; author `/author/xiluva/`
- Homepage "Who We Are" truncates at "enjoy…"; testimonials loop

## 7. Build phases

Each numbered item ends with: audit gate → commit → push → print PUSHED block.

### Phase 0 — Access and baseline
1. Verify Git auth, clone the empty repo, create `main`, first commit and push (see section 3). Create `docs/document-inventory.md` listing every supplied audit in `research/prior-audits/` with read status. The prior audits are: Instructions.txt (×2), KimiK3.txt, GPT6.1Sol.txt (×2), Opus5.5.txt (×2), GPT5.5Pro.txt, Collective.md. If any are missing from the folder, list them as unavailable; never claim to have read them. Section 6 of this prompt already reconciles them.
2. Scaffold Vite project, scripts, lint/test tooling, CI (GitHub Actions running the section 4 gate). Push.
3. Connect Cloudflare Pages `[CONFIRM: account access]`. Deploy a holding page. Open it. Print the stable URL. If you cannot connect the host, report the blocker and keep pushing.

### Phase 1 — Live-site scrape and archive (read-only)
1. Fetch and save under `research/live-site/`: `/`, `/robots.txt`, `/sitemap.xml`, `/wp-sitemap.xml` and all 8 children, `/wp-json/`, `/wp-json/wp/v2/pages?per_page=100`, `/posts`, `/media` (paginate until empty), `/feed/`, `/comments/feed/`, every discovered internal URL. Use raw HTML and a Playwright-rendered pass (content is partly JS-rendered). Respect rate limits.
2. `docs/site-inventory.csv`: URL, status, redirect chain, title, meta description, H1, canonical, robots, word count, sitemap inclusion, content type, notes, decision (keep / rewrite / 301 / 410).
3. Download media originals from real source URLs only. `docs/asset-manifest.csv`: original filename, source URL, dimensions, bytes, checksum, what it visibly shows, demo vs real, proposed descriptive filename, proposed alt text, service category, project association `[CONFIRM]`, permission `[CONFIRM]`. Never infer suburbs, dates, materials or scope from a photo. Exclude demo portraits, finance graphics, `.txt` log entries. Strip GPS/EXIF from public derivatives.
4. Generate a contact sheet (`research/contact-sheet.html`) for the owner to tag projects and before/after pairs.
5. Screenshots of the old site at 360/768/1440 px for the record.
6. `docs/audit-reconciliation.md` and `docs/evidence-register.csv` (claim, source, excerpt, retrieval date, status: verified-live / published-claim / owner-approved / third-party-claim / proposed / unverified / contradicted / blocked). Preserve supplied audits unchanged in `research/prior-audits/` (they contain no client-private data beyond what the live site publishes; if in doubt, keep them git-ignored and log that).

### Phase 2 — Competitor matrix
`docs/competitor-matrix.csv` for these 20 Cape Town / Western Cape businesses (a relevant comparison set, not a proven "top 20"). Separate direct competitors from aspirational benchmarks.

68 Projects · BOMO Renovations · CPT Builders · Constantiaberg Master Builders (CMB) · Pro Projects · Happy Home Construction · CapeStone · SK Projects · Cape Town Timber Decking · Canman Trades · Scotch Score Holdings · Peninsula Projects · Cockburn & Son · Tartan Construction · Nova Construction Services · BH Construction · Leukes Builders · R+N Master Builders · Phase Three · Urban Revamp.
Alternates: GA Building Projects, Bergstreme, TopBuild, Capecon, Renoman, Master Decks, Timber Construction, Bespoke Bathrooms. Avoid-examples: Nervison (template remnants, typos), keyword-stuffed suburb sites.

Record per site: URL, local relevance, positioning, hero, CTA route, proof (named reviews, dates, counts — as displayed, not verified), registrations shown, warranty/price/timeline claims, case-study depth, process, suburb pages, FAQs, WhatsApp, design strengths, defects, Google Ads evidence (Ads Transparency Center / Meta Ad Library; if blocked, record "blocked"), lesson for Regardin. Do not copy text, layouts or photos. Do not click competitor ads.

Prior findings worth testing (as leads): 68 Projects (suburb pages with real local detail, process, FAQs); BOMO (send photos → scope review → estimate → site visit; before/after); CPT Builders (named, dated reviews, hours, areas); CMB (registration/VAT/COIDA in footer); Scotch Score (price-from + timeline table, WhatsApp pre-fill, quote turnaround); Phase Three (case studies with suburb, date, collaborators); Cockburn & Son (stated site-supervision model); Cape Town Timber Decking (material education, premium tone).

### Phase 3 — Design system
Create `docs/design-system.md` and a `/styleguide/` route (noindex) showing tokens, type scale, spacing, buttons, cards, forms, captions, before/after component, CTA bar. Push. See section 9.

### Phase 4 — Pages (early preview first)
Build the homepage plus one service page and one project page first, deploy, review, fix, push. Then one push per page:

| Route | Purpose |
|---|---|
| `/` | Proposition → selected work → services → how we work → testimonials → about Regard → areas → FAQ preview → quote CTA |
| `/about/` | Approved business history, who manages projects, site standards, who we work for |
| `/services/` | Hub linking all confirmed services |
| `/services/renovations-alterations/` | fixer-uppers, alterations, additions, maintenance, trade coordination |
| `/services/brickwork-boundary-walls/` | walls, openings, additions, plastered finishes |
| `/services/painting/` | interior and exterior, preparation, Cape coastal weather |
| `/services/carpentry-decking-pergolas/` | pergolas, decks, walk-in closets, countertops if confirmed |
| `/services/concrete-work/` | driveways, slabs, stairs, floating steps, plinths, pool structures |
| `/services/plastering-screeds-pool-plastering/` | scratch plaster, floor screed, pool plastering |
| `/services/decorative-floors/` | Nanoscreed HD — ONLY if confirmed |
| `/services/custom-projects/` | replaces "Imagination Creation" |
| `/services/hardscaping/`, new homes, commercial | ONLY if confirmed with enough evidence |
| `/projects/` + `/projects/[slug]/` | filter by service; case studies only with approved context |
| `/how-we-work/` | process, quote, variations, site protection, communication, handover |
| `/reviews/` | approved testimonials; link to Google profile once confirmed |
| `/faq/` | real buying questions |
| `/contact/` | quote form, call, email, WhatsApp (if confirmed), what happens next |
| `/thank-you/` | noindex; shown only after backend acceptance |
| `/areas/` + `/areas/[suburb]/` | ONLY confirmed suburbs with genuinely local content; no doorway pages |
| `/privacy-policy/`, `/terms-of-service/` | keep these URLs |
| `404` | real 404 status |

Do NOT build: a team page with demo staff, a blog with filler, suburb × service combination pages. A `/guides/` section only later, with real reviewed articles.

Service page template: H1 "[Service] in Cape Town"; direct 1–2 sentence answer of what it is and who it's for (AEO); what's included; what's excluded `[CONFIRM]`; considerations (only verifiable, general construction knowledge — mark anything uncertain `[CONFIRM]`); real photos; what to send for a quote; process; related FAQs; CTA. Write as much as answers the customer's questions — no arbitrary word counts, no padding.

Case-study template: name, suburb `[CONFIRM]`, year `[CONFIRM]`, service, brief, Regardin's scope, constraints, materials `[CONFIRM]`, duration `[CONFIRM]`, before/progress/after photos, approved client quote. No exact residential street addresses without permission. Before/after slider must be keyboard-accessible with a static side-by-side fallback.

Mobile: sticky bottom bar — Call · WhatsApp (if confirmed) · Quote.

### Phase 5 — Enquiry system
Fields: name, phone (`type="tel"`, `autocomplete="tel"`), email, project suburb, service (dropdown from `services.json`), project brief, preferred timing (optional), budget range (optional, `[CONFIRM ranges]`), photos/plans (optional, multi, size- and type-limited). Separate POPIA notice (not a forced marketing opt-in); optional marketing opt-in unticked. Button: "Request a project quote".

Backend requirements: server-side validation; Turnstile + honeypot + rate limit; store in D1 before anything else; uploads to private R2 with type allowlist, size limits, no execution, expiring links; notify `[CONFIRM mailbox]` with customer as Reply-To (no spoofing); idempotency key to stop duplicates; success shown only after D1 accepts; notification failure must never lose the lead (retry + log); preserve entered data on recoverable errors; works without JS. Test end-to-end with synthetic data; mailbox receipt must be confirmed by the owner or authorised access — an API 200 is not delivery. Log results in `docs/qa-log.md`. An unconfigured backend is a launch blocker.

### Phase 6 — SEO and AEO

"Full ACO" is undefined in the brief. Working interpretation: **AEO (answer-engine optimisation) plus full technical and local SEO** `[CONFIRM: meaning of ACO]`. Deliver all of:

- Unique title (≤ 60 chars) and meta description (≤ 155 chars) per page; one H1; canonical; breadcrumbs; clean internal linking.
- Open Graph + Twitter cards per route with a real project image (1200×630).
- JSON-LD from `business.json`: `GeneralContractor`/`LocalBusiness` (name, telephone, url, areaServed, sameAs — address, geo and openingHours omitted until approved), `Service` per service page, `BreadcrumbList`, `FAQPage` where FAQs are visible (valid vocabulary, no rich-result expectation). Structured data must match visible content. No AggregateRating/Review markup for self-hosted testimonials.
- AEO: each service/FAQ answer leads with a direct factual sentence; consistent NAP everywhere; clear entity naming; crawlable text (nothing important in images or JS-only).
- `sitemap.xml` (real indexable pages only), `robots.txt`, optional factual `llms.txt`.
- Target themes (validate with Keyword Planner when access exists; no invented volumes): building contractor Cape Town, renovations Cape Town, alterations Cape Town, boundary walls Cape Town, exterior painting Cape Town, decking / pergolas Cape Town, concrete work / concrete stairs Cape Town, floor screed Cape Town, pool plastering Cape Town, Southern / Northern Suburbs renovations, Nanoscreed Cape Town `[CONFIRM]`.
- `docs/migration-map.csv` + Cloudflare `_redirects` (section 10).

### Phase 7 — Google stack (build-ready; accounts via invitation only)
Logi-Ink does not hold the client's Google credentials. Code the integration points; document every account step in `HANDOVER.md`; mark account tasks "blocked – needs access" rather than pretending they are done.

- Find existing GA4 / Search Console / Tag Manager / Site Kit properties first (live site loads `GT-5DCV555P`). No duplicates.
- GTM `[CONFIRM ID]` → GA4 `[CONFIRM ID]`, Consent Mode v2 defaults denied until consent; POPIA-appropriate consent banner; test accept/reject/withdraw/reload.
- Events: `generate_lead` (fired only after backend acceptance, deduplicated; a direct `/thank-you/` visit must not fire it), `click_call`, `click_whatsapp`, `click_email`, `view_project`, `file_upload`. Key events: generate_lead, click_call, click_whatsapp. Never send names, emails, phones, messages or files into analytics, URLs or dataLayer.
- Search Console: domain property via DNS TXT (owner/DNS holder), submit sitemap, URL Inspection on key pages, monitor 410s and redirects post-launch.
- Google Business Profile (formerly Google My Business): `docs/google-business-profile-plan.md` — find the existing profile before creating one; trading name; categories (verify available, likely General contractor/Construction company); confirmed services, hours, service area; hide address if clients don't visit `[CONFIRM]`; UTM-tagged website/quote links; photo plan; honest, non-incentivised review requests to all customers (no gating); response templates; weekly post ideas.
- Google Ads: `ads/google-ads-plan.md` (section 11). Campaigns stay paused; no spend, no account terms accepted without owner approval.

### Phase 8 — Social
- Route-specific OG images; test real share previews.
- `social/campaign-plan.md`: bio rewrites, profile/cover guidance, 30-day Facebook/Instagram calendar using approved work only (project reveals, before/after, material close-ups, process, testimonial cards, meet-the-owner if approved, "what to send for a quote"), captions in brand voice, hashtag sets, alt text, UTMs, Meta lead-ad concepts to `/contact/`. Meta Pixel / CAPI only with consent and owner approval `[CONFIRM]`.
- Templates at 1080×1350 and 1080×1920 for testimonial and project cards (HTML/CSS, exportable).

### Phase 9 — Legal
- Privacy policy rewritten for the actual data flows (form, D1, R2 uploads, email provider, analytics, ads, cross-border processing by providers), purpose, retention `[CONFIRM]`, data-subject rights, Information Officer `[CONFIRM]`, contact. A generated policy or cookie banner is not proof of compliance — flag for owner/legal review.
- Terms: carry over only owner-confirmed clauses. Remove absolute promises ("on time", "within budget", "flawless", "free quote" unless confirmed).
- Footer registration numbers (CIPC, VAT, COIDA, NHBRC) only if supplied and verified.

### Phase 10 — Full QA
Cross-page run of section 4 plus: all routes, redirects and 410s, trailing slashes, HTTPS/host behaviour, 404 status, form errors, duplicate submits, upload rejection, consent states, analytics deduplication, metadata and schema validation, no console errors, image weights, reduced-motion, 200 % zoom, touch targets ≥ 44 px. No unresolved critical/high defects. Push.

### Phase 11 — Handover and launch (owner-approved only)
Launch blockers: approved contact details, working mailbox delivery, legal pages approved, zero `[CONFIRM]` in production build. Before cutover: private backup of the WordPress site via authorised hosting access; keep mail DNS (MX/SPF/DKIM/DMARC) untouched; add custom domain on Cloudflare Pages; verify redirects and 410s live; submit sitemap; keep old hosting until rollback window passes. Do not use Search Console Change of Address (same domain).

## 8. Content and voice

- Voice: calm, precise, owner-led, specific. A master builder, not a salesman. Short declarative sentences. Concrete nouns (plaster, screed, boundary wall, hardwood, apron slab) over adjectives.
- Banned: see section 4 grep list, plus "bring your vision to life", "precision and professionalism", "quality craftsmanship", "stress-free", "hassle-free".
- Headline options (proposed copy, not verified promises):
  - Safe now: "Building, renovation and finishing work in Cape Town." Sub: "Brickwork, painting, carpentry, decking and concrete for homes and businesses. See the work, then tell us what you have planned." CTAs: "Request a written quote" · "View our work".
  - Brand line for approval: "Considered construction. Carefully finished."
  - Only if owner confirms personal management: "One builder. One point of contact. From first quote to final coat."
- About opening, only if owner approves AcB history: "Regard Bothma started on site in 2004 in the UK as a junior foreman and first-fix carpenter, and has managed high-end residential work in South Africa since 2006." Resolve "nearly two decades" vs 2004 first.
- Rename "Imagination Creation" → "Custom projects" unless the owner wants it kept.
- FAQ seeds (answer only with confirmed facts): Do you quote in writing? How long is a quote valid? (30 days, if confirmed) Is a deposit required? Is the site visit/quote free? Which areas do you cover? What should I send for a quote? Do you handle plans and council approvals? Can I supply my own materials? How is my property kept secure? What warranty applies? Is NHBRC registration needed for my job? (owner/legal-approved wording only). How long does a typical job take? (only if ranges supplied)

## 9. Design direction — must not look like AI

- Required: real project photography leads every page; editorial, asymmetric layouts; large confident type; generous whitespace; wide shots paired with close-up material details (plaster texture, timber grain, concrete arris); captions that name the work; restrained motion (fade/translate ≤ 300 ms, `prefers-reduced-motion` respected).
- Forbidden: gradient blobs, glassmorphism, generic 3-icon card grids, stock line-icons as decoration, emoji in UI, stock hard-hat/handshake photos, AI-generated houses, autoplay hero video, heavy sliders, animated counters, fake badges or star rows, "Trusted by" strips without real logos, purple/blue SaaS palettes, over-rounded panels, centred-everything layouts.
- Brand: use the approved logo and colours `[CONFIRM: approved logo files — a logo was explored for Regardin earlier in Genspark/Nano Banana; the live site also has logo variants in its media library]`. Fallback palette to propose: charcoal #1E1F1C, limestone #E9E4DA, off-white #F7F5F0, one accent — oxidised brass #A07A3F or terracotta #B5563A. Verify every text/background pair ≥ 4.5:1.
- Type: propose three heading faces (refined serif or grotesk) with rationale; self-hosted, subset, `font-display: swap`; clean sans body at 17–18 px, line-height ~1.6, modular scale.
- If existing photography cannot carry the premium look, say so in `HANDOVER.md` and recommend a photography brief (finished spaces, details, work in progress, owner portrait, consistent before/after pairs). Atmospheric AI imagery, if used at all, may only be abstract texture/background, labelled as AI-generated in the asset manifest, and never shown as completed work.

## 10. Redirects and retirement

`public/_redirects` (Cloudflare Pages) and `docs/migration-map.csv`. One-hop 301s:

```
/about-us/        /about/            301
/our-services/    /services/         301
/contact-us/      /contact/          301
/our-portfolio/   /projects/         301
/our-team/        /about/            301
```

410 (or 404 if 410 cannot be served; implement via a Pages Function if needed): the four demo posts, `/portfolios/*`, `/portfolios_category/*`, `/category/*`, `/tag/*`, `/author/*`, `/tf_header_footer/*`, `/feed/`, `/comments/feed/`, `/blog/` (unless real guides exist). Keep `/privacy-policy/` and `/terms-of-service/`. Never blanket-redirect demo URLs to the homepage. Check Search Console/backlink data (when access exists) before finalising.

## 11. Google Ads pack (plan only)

`ads/google-ads-plan.md`, prioritised by owner-confirmed capacity and margin, not by pages existing:
- Campaigns: Brand; Renovations & alterations; Brickwork & boundary walls; Painting; Decking & pergolas; Concrete, screeds & pool plastering; Decorative floors `[CONFIRM]`; area campaigns for confirmed suburbs only; remarketing only with compliant consent.
- Per campaign: ad groups, keyword themes (phrase/exact), negatives (jobs, careers, salary, course, learn, DIY, template, free, finance, insurance, loan, internship, supplies, hire; "tender" and "cheap" `[CONFIRM]`), 15 headlines ≤ 30 chars, 4 descriptions ≤ 90 chars (verify current limits), sitelinks, confirmed callouts only, call asset, dedicated landing page, presence-based location targeting `[CONFIRM radius/suburbs]`, schedule proposal, budget `[CONFIRM]`.
- Conversion mapping without double-counting (GA4 import vs native tag); calls/WhatsApp clicks are engagement, not qualified leads; define the funnel (enquiry → qualified → site visit → quote issued → accepted → completed); max cost per qualified lead = allowable acquisition cost per won job × qualified-lead win rate (owner supplies inputs). Enhanced conversions/Data Manager only after verifying current official docs and owner approval.

## 12. Required repo documents

`README.md` (setup, scripts, deploy, URLs) · `HANDOVER.md` (updated every relevant push) · `CHANGELOG.md` · `docs/document-inventory.md` · `docs/audit-reconciliation.md` · `docs/evidence-register.csv` · `docs/confirmation-register.md` · `docs/site-inventory.csv` · `docs/asset-manifest.csv` · `docs/competitor-matrix.csv` · `docs/content-plan.md` · `docs/design-system.md` · `docs/migration-map.csv` · `docs/tracking-plan.md` · `docs/google-business-profile-plan.md` · `ads/google-ads-plan.md` · `social/campaign-plan.md` · `docs/qa-log.md` · `docs/release-log.md` · `docs/runbook.md` · `.env.example`.

## 13. Owner confirmation register (seed `docs/confirmation-register.md`)

Grouped for one conversation with Regard:

1. Contact: primary monitored email (info@ vs iCloud); phone is WhatsApp-enabled and may be advertised?; hours; publish street address or suburb only; do clients visit the address?
2. Business: legal entity and registration (CIPC), VAT, COIDA, insurance, NHBRC status; Regard's role; founding date; "nearly two decades" vs since 2004; permission to use AcB Projects history.
3. Services: which are current (incl. Nanoscreed HD, hardscaping, new homes, civil, commercial, maintenance, walk-in closets/countertops); exclusions; minimum/preferred job size; plans and council approvals handled?
4. Areas: exact suburbs/regions served.
5. Commercial terms: quote validity, deposit, free site visit/quote?, quote turnaround, response time, warranty period, price-from ranges and typical durations (if willing to publish).
6. Operations: who manages each job on site; subcontractors vs own team; progress updates; site protection; handover/snag process.
7. Proof: project photos with suburb, year, scope; before/after pairs; photo and client permissions; testimonial edits; Suzie testimonial; owner/team photos; Google Business Profile URL.
8. Brand: approved logo files and colours; social account ownership.
9. Access (by invitation, never passwords): Cloudflare, domain DNS, WordPress hosting backup, GA4/GTM/Site Kit, Search Console, Google Ads, GBP, Meta; email provider for form notifications.
10. Definitions: meaning of "ACO"; ad budget; Meta Pixel yes/no.

## 14. Definition of done and final report

Never say "done" without evidence for every gate. Distinguish: implemented · tested locally · tested in preview · configured in production · externally verified · blocked · owner-approved. "Tracking-ready" is not a configured Ads account; "Search Console-ready" is not DNS-verified; an email API 200 is not mailbox receipt.

Final report (actual values, no blanks): branch, latest commit SHA, GitHub URL, stable preview URL, production URL (if launched), routes built, audits run with scores, issues found/fixed, remaining `[CONFIRM]` items grouped by owner question, blocked account tasks, exact next action for the client.

Start now with Phase 0, step 1.
