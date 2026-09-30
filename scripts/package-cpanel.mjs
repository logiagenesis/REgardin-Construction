// Zips the contents of dist/ (hidden .htaccess files included) for upload to cPanel's
// public_html: release/regardin-cpanel-YYYYMMDD.zip, dated in South African time.
// Refuses to package a preview build, or a build that still shows placeholders.

import { execFileSync } from 'node:child_process';
import { existsSync, globSync, mkdirSync, readFileSync, rmSync, statSync } from 'node:fs';
import { resolve } from 'node:path';

const dist = resolve(import.meta.dirname, '..', 'dist');
if (!existsSync(resolve(dist, 'index.html')) || !existsSync(resolve(dist, '.htaccess'))) {
  console.error('dist/ is missing index.html or .htaccess. Run npm run build:cpanel first.');
  process.exit(1);
}
const leftovers = globSync('**/*.html', { cwd: dist }).filter((f) =>
  /\[CONFIRM:|PLACEHOLDER|media--placeholder/.test(readFileSync(resolve(dist, f), 'utf8')),
);
if (leftovers.length && !process.argv.includes('--allow-placeholders')) {
  console.error(
    `Not packaging: placeholders remain on ${leftovers.length} page(s) (${leftovers.join(', ')}).\n` +
      'Resolve docs/TODO_CONFIRM.md, or pass --allow-placeholders for a test upload to a staging folder.',
  );
  process.exit(1);
}

const stamp = new Intl.DateTimeFormat('en-CA', { timeZone: 'Africa/Johannesburg' })
  .format(new Date())
  .replace(/-/g, '');
const outDir = resolve(import.meta.dirname, '..', 'release');
const out = resolve(outDir, `regardin-cpanel-${stamp}.zip`);
mkdirSync(outDir, { recursive: true });
rmSync(out, { force: true });
execFileSync('zip', ['-r', '-X', '-q', out, '.'], { cwd: dist });
console.log(`${out} (${Math.round(statSync(out).size / 1024)} KB)`);
