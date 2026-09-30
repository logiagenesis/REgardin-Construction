# Owner confirmation register

Questions for one conversation with Regard Bothma. Nothing below is published as fact until answered in writing. Status: **open** unless marked.

## 1. Contact

- [ ] Primary monitored email: `info@regardinconstruction.co.za` or `regardbothma@icloud.com`? (both published; conflict)
- [ ] Is 079 454 9780 WhatsApp-enabled, and may WhatsApp be advertised?
- [ ] Business hours.
- [ ] Publish the street address (139 12th Avenue, Kensington, per Terms) or suburb only? Do clients visit the address?

## 2. Business

- [ ] Legal entity and CIPC registration number; VAT; COIDA; insurance; NHBRC status.
- [ ] Regard's role and title.
- [ ] Founding date. Resolve "nearly two decades" (live site) vs "since 2004" (AcB Projects).
- [ ] Permission to use AcB Projects history (UK 2004, SA from 2006).

## 3. Services

- [ ] Which are current: Nanoscreed HD / decorative floors, hardscaping, new homes, civil, commercial, maintenance, walk-in closets, countertops.
- [ ] Exclusions; minimum or preferred job size.
- [ ] Are plans and council approvals handled?

## 4. Areas

- [ ] Exact suburbs / regions served (testimonial mentions Southern and Northern Suburbs; directory says "Cape Town CBD").

## 5. Commercial terms

- [ ] Quote validity (Terms say 30 days), deposit, free site visit / free quote (homepage says "Get a free quote today").
- [ ] Quote turnaround; response time; warranty period.
- [ ] Price-from ranges and typical durations, if willing to publish.
- [ ] Budget ranges for the quote form.

## 6. Operations

- [ ] Who manages each job on site; own team vs subcontractors.
- [ ] Progress updates; site protection; handover / snag process.

## 7. Proof

- [ ] Project photos with suburb, year, scope; before/after pairs; permission for each photo and client.
- [ ] Testimonial edits (e.g. "bar non" → "bar none"); Suzie testimonial (AcB site) permission and attribution.
- [ ] Owner and team photos.
- [ ] Google Business Profile URL.

## 8. Brand

- [ ] Approved logo files and colours (logo explored earlier in Genspark/Nano Banana; variants in the WordPress media library).
- [ ] Ownership of facebook.com/Regardin.Construction and instagram.com/regardin_construction.

## 9. Access (invitations only, never passwords)

- [ ] cPanel access for staging and, at launch, production hosting.
- [ ] Domain DNS holder.
- [ ] WordPress hosting (backup before cutover).
- [ ] GA4 / GTM / Site Kit (live site loads `GT-5DCV555P`), Search Console, Google Ads, Google Business Profile, Meta.
- [ ] Transactional email provider and the mailbox that receives enquiries.

## 10. Definitions

- [ ] Meaning of "ACO" (working interpretation: AEO plus full technical and local SEO).
- [ ] Google Ads budget.
- [ ] Meta Pixel / CAPI: yes or no.

## Repository / hosting (Logi-Ink)

- [x] One GitHub branch only: `main` (30/09/2026).
- [x] Hosting: cPanel, not Cloudflare (30/09/2026).
- [ ] Staging location on cPanel (e.g. a subdomain) and whether it is password-protected.
- [ ] Deploy method: cPanel Git Version Control with `.cpanel.yml`, GitHub Actions over FTP/SFTP, or manual upload of `dist/`.
- [ ] PHP version and MySQL availability on the account (enquiry backend).
- [ ] Web server: Apache or LiteSpeed (both read `.htaccess`).
- [ ] Allow `regardinconstruction.co.za` in the Claude Code environment's network settings (needed for the Phase 1 scrape).
- [ ] Default branch: GitHub API still reported `claude/new-session-0ea69p` as default on 30/09/2026 after the change; deletion of that branch is refused until it is not the default.
