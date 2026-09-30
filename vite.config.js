import { defineConfig } from 'vite';
import { globSync } from 'node:fs';
import { resolve } from 'node:path';
import { resolveDeployment } from './scripts/lib/deploy.mjs';

// Pages are generated into build/site/ by scripts/build-pages.mjs; one HTML entry per route.
const root = resolve(import.meta.dirname, 'build/site');
const deploy = resolveDeployment();

const input = Object.fromEntries(
  globSync('**/*.html', { cwd: root }).map((file) => [
    file
      .replace(/\/?index\.html$/, '')
      .replace(/\.html$/, '')
      .replace(/\//g, '-') || 'home',
    resolve(root, file),
  ]),
);

export default defineConfig({
  root,
  base: deploy.base,
  publicDir: resolve(import.meta.dirname, 'public'),
  appType: 'mpa',
  logLevel: 'warn',
  build: {
    outDir: resolve(import.meta.dirname, 'dist'),
    emptyOutDir: true,
    assetsDir: 'assets/build',
    modulePreload: { polyfill: false },
    rollupOptions: { input },
  },
});
