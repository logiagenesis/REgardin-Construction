import { site } from '../../src/data/site.js';

// One codebase, two build targets, chosen by DEPLOY_TARGET (default cpanel).
//
// cpanel: the live site at the root of https://regardinconstruction.co.za, served by Apache,
//         with a generated .htaccess.
// pages:  the preview at https://logiagenesis.github.io/REgardin-Construction/, deployed by
//         .github/workflows/deploy-pages.yml on every push to main. Every page carries
//         noindex, nofollow and no .htaccess ships.
//
// Canonical links, the sitemap, robots.txt and the schema always name the live domain.
// og:url and og:image follow the serving origin so link previews work on the preview too.
const TARGETS = {
  cpanel: { base: '/', origin: site.canonicalOrigin },
  pages: { base: '/REgardin-Construction/', origin: 'https://logiagenesis.github.io' },
};

export function resolveDeployment() {
  const target = process.env.DEPLOY_TARGET || 'cpanel';
  if (!TARGETS[target]) throw new Error(`DEPLOY_TARGET must be "pages" or "cpanel", not "${target}".`);
  return { target, ...TARGETS[target] };
}
