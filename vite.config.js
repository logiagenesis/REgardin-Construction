import { defineConfig } from 'vite';
import { globSync } from 'node:fs';
import { resolve } from 'node:path';
import partials from './build/vite-plugin-partials.js';

const root = resolve(import.meta.dirname, 'src');

// One HTML entry per route: src/index.html, src/about/index.html, src/404.html …
const input = Object.fromEntries(
  globSync('**/*.html', { cwd: root, exclude: (p) => p.startsWith('partials') }).map((file) => [
    file.replace(/\/?index\.html$/, '').replace(/\.html$/, '') || 'home',
    resolve(root, file),
  ]),
);

export default defineConfig({
  root,
  publicDir: resolve(import.meta.dirname, 'public'),
  appType: 'mpa',
  build: {
    outDir: resolve(import.meta.dirname, 'dist'),
    emptyOutDir: true,
    modulePreload: { polyfill: false },
    rollupOptions: { input },
  },
  plugins: [
    partials({
      partialsDir: resolve(root, 'partials'),
      dataDir: resolve(root, 'data'),
    }),
  ],
});
