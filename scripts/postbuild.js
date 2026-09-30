// Runs after `vite build`:
//  1. writes dist/_headers (noindex on every preview build), robots.txt and sitemap.xml
//  2. production builds FAIL if any "[CONFIRM" string remains in dist/, or if an
//     indexable page still carries a noindex robots meta.

import { globSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const dist = resolve(import.meta.dirname, '..', 'dist');
const business = JSON.parse(readFileSync(resolve(import.meta.dirname, '..', 'src/data/business.json'), 'utf8'));
const production = process.env.SITE_ENV === 'production';
const origin = business.url.replace(/\/$/, '');

const pages = globSync('**/*.html', { cwd: dist });
const errors = [];

const headers = [
  '/*',
  '  X-Content-Type-Options: nosniff',
  '  Referrer-Policy: strict-origin-when-cross-origin',
  '  Permissions-Policy: camera=(), microphone=(), geolocation=()',
  '  X-Frame-Options: DENY',
];
if (!production) headers.push('  X-Robots-Tag: noindex, nofollow');
headers.push('', '/assets/*', '  Cache-Control: public, max-age=31536000, immutable', '');
writeFileSync(resolve(dist, '_headers'), headers.join('\n'));

const indexable = [];
for (const page of pages) {
  const html = readFileSync(resolve(dist, page), 'utf8');
  if (production && html.includes('[CONFIRM')) errors.push(`[CONFIRM] placeholder left in ${page}`);
  const noindex = /<meta name="robots" content="noindex/.test(html);
  if (page === '404.html' || noindex) continue;
  indexable.push('/' + page.replace(/index\.html$/, ''));
}

writeFileSync(
  resolve(dist, 'robots.txt'),
  // Previews stay crawlable so crawlers can see the X-Robots-Tag/meta noindex and drop the URLs.
  production ? `User-agent: *\nAllow: /\n\nSitemap: ${origin}/sitemap.xml\n` : 'User-agent: *\nAllow: /\n',
);

const urls = indexable
  .sort()
  .map((path) => `  <url><loc>${origin}${path}</loc></url>`)
  .join('\n');
writeFileSync(
  resolve(dist, 'sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`,
);

if (production && indexable.length === 0) errors.push('Production build has no indexable pages.');

if (errors.length) {
  console.error(`\nBuild gate FAILED (${production ? 'production' : 'preview'}):\n - ${errors.join('\n - ')}\n`);
  process.exit(1);
}
console.log(
  `postbuild: ${pages.length} pages, ${indexable.length} in sitemap, env=${production ? 'production' : 'preview'}`,
);
