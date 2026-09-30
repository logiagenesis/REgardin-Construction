// Lighthouse CI (mobile, default emulation) over every indexable page of the cPanel build,
// served by `vite preview`. The thank-you and 404 pages are noindex by design, so they are
// covered by the Playwright + axe suite instead.
const { globSync, readFileSync } = require('node:fs');

const urls = globSync('**/index.html', { cwd: 'dist' })
  .filter((f) => !/<meta name="robots" content="noindex/.test(readFileSync(`dist/${f}`, 'utf8')))
  .map((f) => `http://localhost:4173/${f.replace(/index\.html$/, '')}`);

module.exports = {
  ci: {
    collect: {
      startServerCommand: 'npm run preview',
      startServerReadyPattern: 'localhost:4173',
      url: urls,
      numberOfRuns: 1,
      settings: {
        // Containers and CI runners often run as root, where Chrome will not start sandboxed.
        chromeFlags: process.getuid?.() === 0 ? '--no-sandbox --headless=new' : '--headless=new',
      },
    },
    assert: {
      assertions: {
        'categories:performance': ['error', { minScore: 0.9 }],
        'categories:accessibility': ['error', { minScore: 1 }],
        'categories:best-practices': ['error', { minScore: 0.95 }],
        'categories:seo': ['error', { minScore: 1 }],
      },
    },
    upload: { target: 'filesystem', outputDir: './lighthouse-reports' },
  },
};
