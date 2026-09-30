// Internal link check over dist/: every href/src/srcset that points inside the site must
// resolve to a real file, every #fragment to a real id, and no link may be a bare "#".
// Works for either build target (the base path is read from the canonical-free served paths).
import { existsSync, globSync, readFileSync, statSync } from 'node:fs';
import { resolve } from 'node:path';
import { resolveDeployment } from './lib/deploy.mjs';

const dist = resolve(import.meta.dirname, '..', 'dist');
const { base } = resolveDeployment();
const problems = [];
let checked = 0;

const ids = new Map();
const pages = globSync('**/*.html', { cwd: dist });
for (const page of pages) {
  const html = readFileSync(resolve(dist, page), 'utf8');
  ids.set(page, new Set([...html.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1])));
}

function resolveTarget(fromPage, url) {
  const [pathAndQuery, fragment] = url.split('#');
  const path = pathAndQuery.split('?')[0];
  let target;
  if (path === '') target = fromPage;
  else {
    const abs = new URL(path, `https://site${base}${fromPage}`).pathname;
    if (!abs.startsWith(base)) return { error: `outside base ${base}` };
    target = decodeURIComponent(abs.slice(base.length));
    const file = resolve(dist, target);
    if (target === '' || (existsSync(file) && statSync(file).isDirectory()))
      target = `${target}${target && !target.endsWith('/') ? '/' : ''}index.html`;
  }
  if (!existsSync(resolve(dist, target))) return { error: 'missing file' };
  if (fragment && ids.has(target) && !ids.get(target).has(fragment)) return { error: `missing #${fragment}` };
  return {};
}

for (const page of pages) {
  const html = readFileSync(resolve(dist, page), 'utf8');
  const urls = [
    ...[...html.matchAll(/\s(?:href|src)="([^"]*)"/g)].map((m) => m[1]),
    ...[...html.matchAll(/\ssrcset="([^"]*)"/g)].flatMap((m) => m[1].split(',').map((s) => s.trim().split(/\s+/)[0])),
  ];
  for (const url of urls) {
    if (url === '#' || url === '') {
      problems.push(`${page}: empty or "#" link`);
      continue;
    }
    if (/^(https?:|mailto:|tel:|data:)/.test(url)) continue;
    checked += 1;
    const { error } = resolveTarget(page, url);
    if (error) problems.push(`${page}: ${url} → ${error}`);
  }
}

if (problems.length) {
  console.error(`Link check FAILED:\n - ${problems.join('\n - ')}`);
  process.exit(1);
}
console.log(`Link check: ${checked} internal links across ${pages.length} pages, 0 broken, 0 "#".`);
