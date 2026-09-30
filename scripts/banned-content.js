// Section 4, item 8: banned-content grep across src/ and dist/ (case-insensitive).
import { existsSync, globSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const BANNED = [
  'lorem',
  'ipsum',
  'Steven Monroe',
  'Michael King',
  'Johnson Group',
  'efinance',
  'surielementor',
  'themeforest',
  'Finanve',
  'Floorscreeed',
  'Carpentery',
  'seamless',
  'dream home',
  'top-notch',
  'look no further',
  'exceed your expectations',
  'no project too big',
  'one-stop',
  'world-class',
  'unmatched',
  'flawless',
  // Section 8 voice bans
  'bring your vision to life',
  'precision and professionalism',
  'quality craftsmanship',
  'stress-free',
  'hassle-free',
];

const repo = resolve(import.meta.dirname, '..');
const hits = [];
for (const dir of ['src', 'dist']) {
  if (!existsSync(resolve(repo, dir))) continue;
  for (const file of globSync(`${dir}/**/*.{html,css,js,json,txt,xml,svg,md}`, { cwd: repo })) {
    const text = readFileSync(resolve(repo, file), 'utf8').toLowerCase();
    for (const term of BANNED) {
      if (text.includes(term.toLowerCase())) hits.push(`${file}: "${term}"`);
    }
  }
}

if (hits.length) {
  console.error(`Banned content found:\n - ${hits.join('\n - ')}`);
  process.exit(1);
}
console.log('Banned-content check: clean (src/, dist/).');
