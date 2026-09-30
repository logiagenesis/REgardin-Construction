# Audit reconciliation

Last updated: 30/09/2026

## Sources

- The nine prior audit files were **not supplied** (see `document-inventory.md`); none has been read.
- The reconciliation below is taken from `MASTER_PROMPT.md` §6.1, which records findings re-checked live by Logi-Ink on 30/09/2026.
- **Own live re-check: blocked.** This build environment's network policy denies `regardinconstruction.co.za` (proxy 403 on 30/09/2026). Once the host is allowed, `scripts/research/scrape-live.js` re-verifies every row, and this file is updated with the result.

## Findings

| #   | Prior claim                                   | Position per brief                                                                                    | Own re-check                                                                    |
| --- | --------------------------------------------- | ----------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------- |
| 1   | Single page; sitemap has 1 URL                | Wrong: `/sitemap.xml` is a broken one-line file; `/wp-sitemap.xml` lists 8 child sitemaps and 44 URLs | pending                                                                         |
| 2   | Images hosted on sspark.genspark.ai           | Wrong: all 12 homepage images load from `/wp-content/uploads/`                                        | pending                                                                         |
| 3   | Service blocks have no body text              | Wrong: five blurbs exist; headings link to `#`                                                        | pending                                                                         |
| 4   | Contact details not retrievable               | Wrong: phone, iCloud email and "Kensington, Cape Town" on homepage with working links                 | pending                                                                         |
| 5   | Header Call/Email links go to `#`             | Partly: true on `/tf_header_footer/header/` template only; one other `href="#"` on the homepage       | pending                                                                         |
| 6   | No meta description / no schema               | Confirmed on the homepage; other pages unchecked                                                      | pending                                                                         |
| 7   | Admin username `xiluva` exposed               | Partly: REST users endpoint returns the slug; a slug is not proof of the login name                   | not re-checked by design (no user enumeration beyond the public author archive) |
| 8   | `xmlrpc.php` exposed = vulnerability          | Overstated: enabled and advertised, not proof of exploitability                                       | passive note only                                                               |
| 9   | NHBRC does not apply to renovations           | Unsafe as evergreen copy (Housing Consumer Protection Act 2024 not yet commenced)                     | no publication without owner/legal sign-off                                     |
| 10  | FAQ schema gives rich results                 | Wrong: Google stopped showing FAQ rich results on 07/05/2026                                          | per brief                                                                       |
| 11  | AggregateRating on own site for stars         | Wrong: self-serving review markup earns no stars                                                      | per brief                                                                       |
| 12  | More Google reviews = more Ads spend          | Wrong                                                                                                 | per brief                                                                       |
| 13  | "Owner on every job" and similar promises     | Invented by earlier drafts                                                                            | not publishable without written approval                                        |
| 14  | Nanoscreed HD = 25 MPa                        | Unverified                                                                                            | not publishable                                                                 |
| 15  | Trak / Grow Construction as local competitors | Rejected                                                                                              | design reference only                                                           |
| 16  | Timezone GMT+0                                | Not proven; irrelevant to the static site                                                             | –                                                                               |
| 17  | llms.txt helps rankings                       | Not a ranking factor                                                                                  | optional factual summary only                                                   |

## Evidence

Claims and their status: `evidence-register.csv`. Statuses seeded from the brief are marked with source `MASTER_PROMPT.md`; they move to own `verified-live` only after the scrape.
