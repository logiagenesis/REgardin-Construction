import js from '@eslint/js';
import globals from 'globals';

export default [
  { ignores: ['dist/', 'build/', 'release/', 'research/', '.lighthouseci/', 'playwright-report/', 'test-results/'] },
  js.configs.recommended,
  {
    // tests/ run page.evaluate() callbacks in the browser.
    files: ['src/**/*.js', 'tests/**/*.js'],
    languageOptions: { globals: globals.browser },
  },
  {
    files: ['*.js', '*.cjs', 'scripts/**/*.{js,mjs}', 'tests/**/*.js'],
    languageOptions: { globals: { ...globals.node } },
  },
];
