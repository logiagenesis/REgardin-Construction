// Phase 1.3–1.4: media index → docs/asset-manifest.csv + owner contact sheet.
//
// Reads research/_raw/media-index.json (written by scrape-live.js). Keeps any review columns
// already filled in docs/asset-manifest.csv (what it shows, demo/real, proposed name/alt, …)
// so re-running never loses manual review work.
//
// The contact sheet is written to research/_raw/contact-sheet.html (git-ignored) with small
// thumbnails, because photo use is not yet confirmed and this repository is public.

import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import sharp from 'sharp';

const repo = resolve(import.meta.dirname, '..', '..');
const indexPath = resolve(repo, 'research/_raw/media-index.json');
const manifestPath = resolve(repo, 'docs/asset-manifest.csv');
const sheetDir = resolve(repo, 'research/_raw/contact-sheet');

if (!existsSync(indexPath)) {
  console.error('No research/_raw/media-index.json — run scripts/research/scrape-live.js first.');
  process.exit(1);
}
const media = JSON.parse(readFileSync(indexPath, 'utf8'));

const COLUMNS = [
  'id',
  'original_filename',
  'source_url',
  'width',
  'height',
  'bytes',
  'sha256',
  'uploaded',
  'wp_title',
  'wp_alt',
  'what_it_visibly_shows',
  'demo_or_real',
  'proposed_filename',
  'proposed_alt',
  'service_category',
  'project_association',
  'permission',
];

// Minimal CSV parser (quoted fields, doubled quotes, embedded commas/newlines).
function parseCsv(textIn) {
  const rows = [];
  let row = [];
  let field = '';
  let quoted = false;
  for (let i = 0; i < textIn.length; i += 1) {
    const c = textIn[i];
    if (quoted) {
      if (c === '"' && textIn[i + 1] === '"') {
        field += '"';
        i += 1;
      } else if (c === '"') quoted = false;
      else field += c;
    } else if (c === '"') quoted = true;
    else if (c === ',') {
      row.push(field);
      field = '';
    } else if (c === '\n') {
      row.push(field);
      rows.push(row);
      row = [];
      field = '';
    } else if (c !== '\r') field += c;
  }
  if (field || row.length) rows.push([...row, field]);
  return rows;
}

const existing = new Map();
if (existsSync(manifestPath)) {
  const [header, ...rows] = parseCsv(readFileSync(manifestPath, 'utf8'));
  for (const r of rows) existing.set(r[header.indexOf('sha256')], Object.fromEntries(header.map((h, i) => [h, r[i]])));
}

const rows = media.map((m) => {
  const prev = existing.get(m.sha256) || {};
  return {
    id: m.id,
    original_filename: m.filename,
    source_url: m.source_url,
    width: m.width,
    height: m.height,
    bytes: m.bytes,
    sha256: m.sha256,
    uploaded: m.uploaded ? new Date(m.uploaded).toLocaleDateString('en-GB') : '',
    wp_title: m.title,
    wp_alt: m.alt_existing,
    what_it_visibly_shows: prev.what_it_visibly_shows || '',
    demo_or_real: prev.demo_or_real || '',
    proposed_filename: prev.proposed_filename || '',
    proposed_alt: prev.proposed_alt || '',
    service_category: prev.service_category || '',
    project_association: prev.project_association || '[CONFIRM]',
    permission: prev.permission || '[CONFIRM]',
  };
});

const q = (v) => `"${String(v ?? '').replace(/"/g, '""')}"`;
writeFileSync(manifestPath, [COLUMNS.map(q).join(','), ...rows.map((r) => COLUMNS.map((c) => q(r[c])).join(','))].join('\n') + '\n');

// Contact sheet with 400 px thumbnails (EXIF stripped by sharp by default).
mkdirSync(sheetDir, { recursive: true });
const cards = [];
for (const r of rows) {
  const m = media.find((x) => x.sha256 === r.sha256);
  if (!m.width) continue;
  const thumb = `${r.id}.jpg`;
  await sharp(resolve(repo, m.local)).rotate().resize({ width: 400, withoutEnlargement: true }).jpeg({ quality: 70 }).toFile(resolve(sheetDir, thumb));
  cards.push(`<figure>
  <img src="contact-sheet/${thumb}" alt="" loading="lazy" width="400">
  <figcaption><strong>#${r.id}</strong> ${r.original_filename}<br>${r.width}×${r.height} · uploaded ${r.uploaded}<br>
  ${r.demo_or_real ? `<em>${r.demo_or_real}</em> · ` : ''}${r.what_it_visibly_shows}
  <span class="ask">Project / suburb / year: ______ &nbsp; Before / during / after: ______ &nbsp; OK to publish? Y / N</span></figcaption>
</figure>`);
}
writeFileSync(
  resolve(repo, 'research/_raw/contact-sheet.html'),
  `<!doctype html><html lang="en-ZA"><head><meta charset="utf-8"><title>Regardin Construction — photo contact sheet</title>
<style>body{font:15px/1.5 system-ui,sans-serif;margin:24px;color:#1e1f1c;background:#f7f5f0}
main{display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:20px}
figure{margin:0;background:#fff;padding:10px;border:1px solid #e9e4da;break-inside:avoid}
img{width:100%;height:auto;display:block}.ask{display:block;margin-top:6px;color:#6b5a3a}</style></head>
<body><h1>Photo contact sheet (${cards.length} images)</h1>
<p>From the current website's media library. For each photo, please note the project, suburb and year, whether it is a before, during or after shot, and whether it may be published. Photos you do not recognise as Regardin work will not be used.</p>
<main>${cards.join('\n')}</main></body></html>`,
);
console.log(`asset manifest: ${rows.length} rows; contact sheet: ${cards.length} images → research/_raw/contact-sheet.html`);
