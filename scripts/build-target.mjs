// Full build for one deployment target: node scripts/build-target.mjs pages|cpanel.
import { spawnSync } from 'node:child_process';

const target = process.argv[2];
if (!['pages', 'cpanel'].includes(target)) {
  console.error('Usage: node scripts/build-target.mjs pages|cpanel');
  process.exit(1);
}
const result = spawnSync('npm', ['run', 'build'], {
  stdio: 'inherit',
  shell: true,
  env: { ...process.env, DEPLOY_TARGET: target },
});
process.exit(result.status ?? 1);
