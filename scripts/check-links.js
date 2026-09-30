// Section 4, item 4: zero broken links in dist/ and zero real CTAs pointing to "#".
import { globSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { LinkChecker } from 'linkinator';

const dist = resolve(import.meta.dirname, '..', 'dist');
const problems = [];

for (const page of globSync('**/*.html', { cwd: dist })) {
  const html = readFileSync(resolve(dist, page), 'utf8');
  for (const [tag] of html.matchAll(/<a\b[^>]*href="#"[^>]*>/g)) problems.push(`${page}: href="#" → ${tag}`);
}

const checker = new LinkChecker();
const result = await checker.check({
  path: dist,
  recurse: true,
  // External links are checked separately (they may rate-limit or block CI).
  linksToSkip: ['^https?://(?!localhost)'],
});
for (const link of result.links) {
  if (link.state === 'BROKEN') problems.push(`BROKEN ${link.status} ${link.url} (from ${link.parent})`);
}

if (problems.length) {
  console.error(`Link check FAILED:\n - ${problems.join('\n - ')}`);
  process.exit(1);
}
console.log(`Link check: ${result.links.length} links scanned, 0 broken, 0 href="#".`);
