// Small HTML helpers shared by the page templates.

import { existsSync } from 'node:fs';
import { resolve } from 'node:path';

const repo = resolve(import.meta.dirname, '..', '..');

export const esc = (value) =>
  String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

// Everything still to be supplied or confirmed, collected while pages are generated and
// written to docs/TODO_CONFIRM.md, so the list always matches what the site shows.
export const todos = { facts: new Map(), images: new Map(), config: new Map() };

// Visible marker for a missing fact.
export function todo(key, label, group = 'Facts') {
  if (!todos.facts.has(key)) todos.facts.set(key, { label, group, pages: new Set() });
  todos.facts.get(key).pages.add(currentPage.path);
  return `<mark class="todo">[CONFIRM: ${esc(label)}]</mark>`;
}

export const currentPage = { path: '/' };

// Phone numbers read better and validate cleanly with non-breaking spaces.
export const nbsp = (text) => esc(text).replace(/ /g, '&nbsp;');

// Aspect ratios as classes (no inline styles: the CSP allows stylesheets only).
const RATIO_CLASS = { '4 / 3': 'r43', '3 / 2': 'r32', '4 / 5': 'r45', '16 / 9': 'r169', '1 / 1': 'r11' };

// Real photograph if src/images/<name>.jpg exists (derivatives built by scripts/images.js),
// otherwise a neutral placeholder block naming the intended file.
export function image({ name, alt, note, ratio = '4 / 3', sizes = '100vw', eager = false, className = '' }) {
  if (!RATIO_CLASS[ratio]) throw new Error(`Unsupported image ratio ${ratio}`);
  const source = resolve(repo, 'src/images', `${name}.jpg`);
  if (existsSync(source)) {
    const widths = [640, 1200, 1920];
    const set = (ext) => widths.map((w) => `/assets/img/${name}-${w}.${ext} ${w}w`).join(', ');
    return `<picture class="media media--${RATIO_CLASS[ratio]} ${className}">
      <source type="image/avif" srcset="${set('avif')}" sizes="${sizes}" />
      <source type="image/webp" srcset="${set('webp')}" sizes="${sizes}" />
      <img src="/assets/img/${name}-1200.jpg" srcset="${set('jpg')}" sizes="${sizes}" alt="${esc(alt)}" width="1200" height="${Math.round((1200 * Number(ratio.split('/')[1])) / Number(ratio.split('/')[0]))}" ${eager ? 'fetchpriority="high"' : 'loading="lazy" decoding="async"'} />
    </picture>`;
  }
  if (!todos.images.has(name)) todos.images.set(name, { note, pages: new Set() });
  todos.images.get(name).pages.add(currentPage.path);
  return `<div class="media media--placeholder media--${RATIO_CLASS[ratio]} ${className}">
      <p><span>Photograph to be supplied</span> <code>${esc(name)}.jpg</code></p>
    </div>`;
}

export function configTodo(key, label) {
  todos.config.set(key, label);
}
