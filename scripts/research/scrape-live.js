// Phase 1: read-only archive of the live WordPress site.
//
//   node scripts/research/scrape-live.js [--base https://regardinconstruction.co.za] [--no-media] [--no-render]
//
// Passive GET requests only, one at a time, with a delay between requests. No forms, no logins,
// no probing beyond public, advertised endpoints (sitemaps, feeds, the public REST API).
//
// Output
//   research/live-site/raw/…          raw responses (public HTML/XML/JSON), committed
//   research/live-site/rendered/…     Playwright-rendered HTML, committed
//   research/live-site/fetch-log.csv  every request: url, status, redirect chain, type, bytes, date
//   docs/site-inventory.csv           one row per discovered internal page
//   research/_raw/media/…             media originals (git-ignored: permission unconfirmed)
//   research/_raw/media-index.json    media metadata for scripts/research/build-asset-manifest.js
//   research/live-site/screenshots/   old-site screenshots at 360/768/1440 px (JPEG)

import { mkdirSync, writeFileSync, existsSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { dirname, resolve } from 'node:path';

const args = process.argv.slice(2);
const flag = (name) => args.includes(name);
const opt = (name, fallback) => (args.includes(name) ? args[args.indexOf(name) + 1] : fallback);

const BASE = opt('--base', 'https://regardinconstruction.co.za').replace(/\/$/, '');
const HOST = new URL(BASE).host;
const DELAY_MS = Number(opt('--delay', 1500));
const UA = 'Mozilla/5.0 (compatible; LogiInk-SiteArchive/1.0; read-only audit for the site owner)';
const repo = resolve(import.meta.dirname, '..', '..');
const out = (...p) => resolve(repo, ...p);
const today = new Date().toLocaleDateString('en-GB', { timeZone: 'Africa/Johannesburg' });

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const log = [];

function save(path, body) {
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, body);
}

function localPath(folder, url, fallbackExt) {
  const u = new URL(url);
  let p = decodeURIComponent(u.pathname);
  if (p.endsWith('/')) p += `index${fallbackExt}`;
  else if (!/\.[a-z0-9]{2,5}$/i.test(p)) p += fallbackExt;
  if (u.search) p = p.replace(/(\.[a-z0-9]+)$/i, `__${u.search.slice(1).replace(/[^\w=-]+/g, '_')}$1`);
  return out(folder, HOST, p.replace(/^\/+/, ''));
}

// GET with manual redirect handling so the full chain is recorded.
async function get(url, { binary = false } = {}) {
  const chain = [];
  let current = url;
  for (let hop = 0; hop < 10; hop += 1) {
    await sleep(DELAY_MS);
    let res;
    try {
      res = await fetch(current, { redirect: 'manual', headers: { 'user-agent': UA } });
    } catch (err) {
      log.push({ url, status: 'ERR', chain: chain.join(' > '), type: '', bytes: 0, note: err.cause?.code || err.message });
      return null;
    }
    if (res.status >= 300 && res.status < 400 && res.headers.get('location')) {
      chain.push(`${res.status} ${current}`);
      current = new URL(res.headers.get('location'), current).href;
      continue;
    }
    const type = res.headers.get('content-type') || '';
    const body = binary ? Buffer.from(await res.arrayBuffer()) : await res.text();
    const headers = Object.fromEntries(res.headers);
    log.push({ url, status: res.status, chain: chain.join(' > '), type, bytes: body.length, note: current !== url ? `final ${current}` : '' });
    return { status: res.status, url: current, chain, type, body, headers };
  }
  log.push({ url, status: 'LOOP', chain: chain.join(' > '), type: '', bytes: 0, note: 'redirect limit' });
  return null;
}

const text = (s) => (s || '').replace(/<[^>]+>/g, ' ').replace(/&nbsp;|&#160;/g, ' ').replace(/\s+/g, ' ').trim();
const attr = (html, re) => (html.match(re) || [])[1] || '';

function describePage(html) {
  const body = html.replace(/<(script|style|noscript)[\s\S]*?<\/\1>/gi, ' ');
  const main = body.match(/<body[\s\S]*<\/body>/i)?.[0] || body;
  return {
    title: text(attr(html, /<title[^>]*>([\s\S]*?)<\/title>/i)),
    description: attr(html, /<meta[^>]+name=["']description["'][^>]+content=["']([^"']*)/i),
    h1: [...html.matchAll(/<h1[^>]*>([\s\S]*?)<\/h1>/gi)].map((m) => text(m[1])).join(' | '),
    canonical: attr(html, /<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']+)/i),
    robots: attr(html, /<meta[^>]+name=["']robots["'][^>]+content=["']([^"']*)/i),
    words: text(main).split(' ').filter(Boolean).length,
    links: [...html.matchAll(/href=["']([^"'#]+)["']/gi)].map((m) => m[1]),
  };
}

const locs = (xml) => [...xml.matchAll(/<loc>\s*([^<\s]+)\s*<\/loc>/gi)].map((m) => m[1].replace(/&amp;/g, '&'));
const isInternal = (u) => {
  try {
    return new URL(u, BASE).host === HOST;
  } catch {
    return false;
  }
};
const normalise = (u) => {
  const x = new URL(u, BASE);
  x.hash = '';
  return x.href;
};
const SKIP = /\/(wp-admin|wp-login\.php|xmlrpc\.php|wp-content|wp-includes|wp-json)\b|\/feed\/?$|\?replytocom=|\.(jpe?g|png|gif|webp|svg|pdf|zip|css|js|woff2?|ico)(\?|$)/i;

// ---------------------------------------------------------------- 1. fixed endpoints
const fixed = ['/robots.txt', '/sitemap.xml', '/wp-sitemap.xml', '/feed/', '/comments/feed/', '/wp-json/'];
const sitemapUrls = new Set();
for (const path of fixed) {
  const r = await get(BASE + path);
  if (!r) continue;
  const ext = path.startsWith('/wp-json') ? '.json' : path.includes('feed') ? '.xml' : '';
  save(localPath('research/live-site/raw', r.url, ext || '.txt'), r.body);
  if (path === '/wp-sitemap.xml' && r.status === 200) {
    for (const child of locs(r.body)) {
      const c = await get(child);
      if (!c) continue;
      save(localPath('research/live-site/raw', c.url, '.xml'), c.body);
      for (const u of locs(c.body)) sitemapUrls.add(normalise(u));
    }
  }
  if (path === '/sitemap.xml' && r.status === 200) for (const u of locs(r.body)) if (isInternal(u)) sitemapUrls.add(normalise(u));
}

// ---------------------------------------------------------------- 2. public REST API collections
const media = [];
for (const type of ['pages', 'posts', 'media', 'categories', 'tags']) {
  for (let page = 1; page < 50; page += 1) {
    const r = await get(`${BASE}/wp-json/wp/v2/${type}?per_page=100&page=${page}`);
    if (!r || r.status !== 200) break;
    save(out('research/live-site/raw', HOST, 'wp-json', `${type}-page-${page}.json`), r.body);
    let items;
    try {
      items = JSON.parse(r.body);
    } catch {
      break;
    }
    if (!Array.isArray(items) || items.length === 0) break;
    for (const item of items) {
      if (item.link && isInternal(item.link) && type !== 'media') sitemapUrls.add(normalise(item.link));
      if (type === 'media') media.push(item);
    }
    if (items.length < 100) break;
  }
}

// ---------------------------------------------------------------- 3. crawl every discovered internal page
const queue = [normalise(BASE + '/'), ...sitemapUrls];
const seen = new Set();
const pages = [];
while (queue.length) {
  const url = queue.shift();
  if (seen.has(url) || SKIP.test(new URL(url).pathname + new URL(url).search)) continue;
  seen.add(url);
  const r = await get(url);
  if (!r) continue;
  const isHtml = r.type.includes('html');
  save(localPath('research/live-site/raw', r.url, isHtml ? '.html' : '.txt'), r.body);
  const d = isHtml ? describePage(r.body) : { links: [] };
  pages.push({ url, r, d });
  for (const link of d.links) {
    if (!isInternal(link)) continue;
    const n = normalise(link);
    if (!seen.has(n) && !SKIP.test(new URL(n).pathname)) queue.push(n);
  }
}

// ---------------------------------------------------------------- 4. rendered pass, screenshots
const rendered = {};
if (!flag('--no-render')) {
  const { chromium } = await import('@playwright/test');
  const proxy = process.env.HTTPS_PROXY ? { server: process.env.HTTPS_PROXY } : undefined;
  const browser = await chromium.launch({ proxy });
  const context = await browser.newContext({ userAgent: UA });
  const page = await context.newPage();
  for (const { url, r } of pages) {
    if (!r.type.includes('html') || r.status !== 200) continue;
    await sleep(DELAY_MS);
    try {
      await page.goto(url, { waitUntil: 'networkidle', timeout: 45000 });
      const html = await page.content();
      save(localPath('research/live-site/rendered', url, '.html'), html);
      rendered[url] = describePage(html);
    } catch (err) {
      log.push({ url, status: 'RENDER-ERR', chain: '', type: '', bytes: 0, note: err.message.split('\n')[0] });
    }
  }
  // Old-site screenshots for the record (homepage and first-level pages).
  const shots = pages.filter(({ url, r }) => r.status === 200 && r.type.includes('html') && new URL(url).pathname.split('/').filter(Boolean).length <= 1);
  for (const { url } of shots) {
    for (const width of [360, 768, 1440]) {
      await page.setViewportSize({ width, height: 900 });
      await sleep(DELAY_MS);
      try {
        await page.goto(url, { waitUntil: 'networkidle', timeout: 45000 });
        const slug = new URL(url).pathname.replace(/^\/|\/$/g, '').replace(/\//g, '_') || 'home';
        const path = out('research/live-site/screenshots', `${slug}-${width}.jpg`);
        mkdirSync(dirname(path), { recursive: true });
        await page.screenshot({ path, fullPage: true, type: 'jpeg', quality: 60 });
      } catch (err) {
        log.push({ url, status: 'SHOT-ERR', chain: '', type: '', bytes: 0, note: `${width}px ${err.message.split('\n')[0]}` });
      }
    }
  }
  await browser.close();
}

// ---------------------------------------------------------------- 5. media originals (git-ignored)
const mediaIndex = [];
if (!flag('--no-media')) {
  const sharp = (await import('sharp')).default;
  for (const m of media) {
    const src = m.source_url;
    if (!src || !isInternal(src)) continue;
    const r = await get(src, { binary: true });
    if (!r || r.status !== 200) continue;
    const file = localPath('research/_raw/media', src, '');
    save(file, r.body);
    let width = '';
    let height = '';
    try {
      ({ width, height } = await sharp(r.body).metadata());
    } catch {
      /* not an image */
    }
    mediaIndex.push({
      id: m.id,
      filename: src.split('/').pop(),
      source_url: src,
      mime: m.mime_type,
      title: text(m.title?.rendered),
      alt_existing: m.alt_text || '',
      uploaded: m.date,
      width,
      height,
      bytes: r.body.length,
      sha256: createHash('sha256').update(r.body).digest('hex'),
      local: file.replace(repo + '/', ''),
    });
  }
  save(out('research/_raw/media-index.json'), JSON.stringify(mediaIndex, null, 2));
}

// ---------------------------------------------------------------- 6. write logs and inventory
const csv = (rows) => rows.map((r) => r.map((v) => `"${String(v ?? '').replace(/"/g, '""')}"`).join(',')).join('\n') + '\n';

save(
  out('research/live-site/fetch-log.csv'),
  csv([['url', 'status', 'redirect_chain', 'content_type', 'bytes', 'note', 'retrieved'], ...log.map((l) => [l.url, l.status, l.chain, l.type, l.bytes, l.note, today])]),
);

const inventory = [
  ['url', 'status', 'redirect_chain', 'title', 'meta_description', 'h1', 'canonical', 'robots', 'word_count_raw', 'word_count_rendered', 'in_sitemap', 'content_type', 'notes', 'decision'],
];
for (const { url, r, d } of pages) {
  const rd = rendered[url];
  inventory.push([
    url,
    r.status,
    r.chain.join(' > '),
    d.title,
    d.description,
    rd?.h1 || d.h1,
    d.canonical,
    d.robots || r.headers['x-robots-tag'] || '',
    d.words ?? '',
    rd?.words ?? '',
    sitemapUrls.has(url) ? 'yes' : 'no',
    r.type.split(';')[0],
    '',
    '',
  ]);
}
if (!existsSync(out('docs'))) mkdirSync(out('docs'));
save(out('docs/site-inventory.csv'), csv(inventory));

console.log(`scrape: ${log.length} requests, ${pages.length} pages, ${sitemapUrls.size} sitemap/API URLs, ${mediaIndex.length} media files`);
