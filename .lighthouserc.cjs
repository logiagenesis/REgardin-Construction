// Lighthouse CI (mobile, default Lighthouse emulation) against the built dist/.
// Preview builds are deliberately noindex, so the `is-crawlable` audit is skipped here;
// crawlability is enforced on the production build by scripts/postbuild.js and
// re-checked with Lighthouse before launch (Phase 10/11). This is recorded in docs/qa-log.md.
module.exports = {
  ci: {
    collect: {
      staticDistDir: './dist',
      numberOfRuns: 1,
      settings: {
        skipAudits: ['is-crawlable'],
        // Containers and CI runners often run as root, where Chrome refuses to start sandboxed.
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
