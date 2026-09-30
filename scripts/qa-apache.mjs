// Checks the generated .htaccess against a real Apache serving dist/ (cpanel build).
//   node scripts/qa-apache.mjs http://localhost:8088
// The server must run with AllowOverride All and mod_rewrite, mod_headers, mod_deflate enabled.
// Requests carry X-Forwarded-Proto: https to stand in for TLS, except the HTTPS test itself.

import http from 'node:http';

const base = (process.argv[2] || 'http://localhost:8088').replace(/\/$/, '');
const HTTPS = { 'x-forwarded-proto': 'https' };
const failures = [];
let passed = 0;

async function check(name, path, { headers = HTTPS, expect }) {
  const res = await fetch(base + path, { redirect: 'manual', headers: { 'accept-encoding': 'gzip', ...headers } });
  const problems = expect(res);
  if (problems) failures.push(`${name} (${path}): ${problems}`);
  else passed += 1;
}
const status = (code, location) => (res) => {
  if (res.status !== code) return `status ${res.status}, expected ${code}`;
  if (location && !String(res.headers.get('location')).endsWith(location))
    return `location ${res.headers.get('location')}, expected …${location}`;
  return null;
};

await check('HTTP → HTTPS', '/about/', { headers: {}, expect: status(301, '/about/') });
// fetch() will not send a custom Host header, so this one uses node:http.
{
  const { hostname, port } = new URL(base);
  const res = await new Promise((done, fail) =>
    http
      .get({ hostname, port, path: '/', headers: { ...HTTPS, host: 'www.regardinconstruction.co.za' } }, done)
      .on('error', fail),
  );
  res.resume();
  if (res.statusCode === 301 && res.headers.location === 'https://regardinconstruction.co.za/') passed += 1;
  else failures.push(`www → bare domain: status ${res.statusCode}, location ${res.headers.location}`);
}
await check('home 200 with headers', '/', {
  expect: (res) => {
    const missing = [
      'x-content-type-options',
      'referrer-policy',
      'x-frame-options',
      'content-security-policy',
      'permissions-policy',
    ].filter((h) => !res.headers.get(h));
    if (res.status !== 200) return `status ${res.status}`;
    if (missing.length) return `missing headers ${missing.join(', ')}`;
    if (res.headers.get('x-robots-tag')) return 'X-Robots-Tag present on a cpanel build';
    if (res.headers.get('content-encoding') !== 'gzip') return 'HTML not compressed';
    if (!/no-cache/.test(res.headers.get('cache-control'))) return 'HTML should be no-cache';
    return null;
  },
});
await check('directory without slash', '/services', { expect: status(301, '/services/') });
await check('index.html stripped', '/services/index.html', { expect: status(301, '/services/') });
await check('page.html cleaned', '/about.html', { expect: status(301, '/about/') });
await check('service page 200', '/services/painting/', { expect: status(200) });
await check('custom 404', '/no-such-page/', {
  expect: (res) => (res.status === 404 ? null : `status ${res.status}`),
});
await check('legacy redirect', '/about-us/', { expect: status(301, '/about/') });
await check('legacy redirect', '/our-portfolio/', { expect: status(301, '/projects/') });
await check('demo content gone', '/why-do-i-need-to-use-financial/', { expect: status(410) });
await check('demo content gone', '/portfolios/money-market/', { expect: status(410) });
await check('no directory listing', '/assets/build/', { expect: status(403) });

const res404 = await fetch(`${base}/no-such-page/`, { headers: HTTPS });
if (!(await res404.text()).includes('That page is not here')) failures.push('custom 404 page body not served');
else passed += 1;

const css = (await (await fetch(`${base}/`, { headers: HTTPS })).text()).match(/\/assets\/build\/[^"]+\.css/)?.[0];
await check('hashed assets cached a year', css, {
  expect: (r) =>
    /immutable/.test(r.headers.get('cache-control') || '') ? null : `cache-control ${r.headers.get('cache-control')}`,
});

if (failures.length) {
  console.error(`Apache .htaccess checks: ${passed} passed, ${failures.length} FAILED\n - ${failures.join('\n - ')}`);
  process.exit(1);
}
console.log(`Apache .htaccess checks: ${passed} passed, 0 failed (${base}).`);
