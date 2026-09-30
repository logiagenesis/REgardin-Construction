// Section 4, items 5–6: axe on every built route, keyboard path, screenshots at six widths.
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { globSync } from 'node:fs';
import { resolve } from 'node:path';

const dist = resolve(import.meta.dirname, '..', 'dist');
const routes = globSync('**/index.html', { cwd: dist }).map((f) => '/' + f.replace(/index\.html$/, ''));
const WIDTHS = [360, 390, 768, 1024, 1440, 1920];

for (const route of routes) {
  test.describe(`route ${route}`, () => {
    test('has no axe violations and no console errors', async ({ page }) => {
      const errors = [];
      page.on('console', (msg) => msg.type() === 'error' && errors.push(msg.text()));
      page.on('pageerror', (err) => errors.push(err.message));
      const response = await page.goto(route);
      expect(response.status()).toBe(200);
      const results = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
        .analyze();
      expect(results.violations.map((v) => `${v.id}: ${v.help}`)).toEqual([]);
      expect(errors).toEqual([]);
      await expect(page.locator('h1')).toHaveCount(1);
    });

    test('keyboard: every focusable element is reachable and visibly focused', async ({ page }) => {
      await page.goto(route);
      // Only elements a keyboard user can actually reach at this width.
      const focusable = await page.evaluate(
        () =>
          [...document.querySelectorAll('a[href], button, input, select, textarea, [tabindex]')].filter(
            (el) => el.tabIndex >= 0 && !el.disabled && el.checkVisibility({ visibilityProperty: true }),
          ).length,
      );
      expect(focusable).toBeGreaterThan(0);
      for (let i = 0; i < focusable; i += 1) {
        await page.keyboard.press('Tab');
        const outline = await page.evaluate(() => {
          const el = document.activeElement;
          const style = getComputedStyle(el);
          return el === document.body ? null : style.outlineStyle !== 'none' || style.boxShadow !== 'none';
        });
        expect(outline, `focus indicator on tab stop ${i + 1}`).toBe(true);
      }
    });

    for (const width of WIDTHS) {
      test(`screenshot and no horizontal overflow at ${width}px`, async ({ page }) => {
        await page.setViewportSize({ width, height: 900 });
        await page.goto(route);
        const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
        expect(overflow, 'horizontal overflow in px').toBeLessThanOrEqual(0);
        const broken = await page.evaluate(() =>
          [...document.images].filter((img) => img.complete && img.naturalWidth === 0).map((img) => img.src),
        );
        expect(broken).toEqual([]);
        const name = route === '/' ? 'home' : route.replace(/\//g, '_').replace(/^_|_$/g, '');
        await page.screenshot({ path: `test-results/screens/${name}-${width}.png`, fullPage: true });
      });
    }
  });
}
