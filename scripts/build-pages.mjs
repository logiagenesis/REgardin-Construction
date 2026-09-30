// Generates every page into build/site/ (the Vite root) from the data in src/data/, and
// writes docs/TODO_CONFIRM.md from the placeholders the pages actually use.
//
//   node scripts/build-pages.mjs      (run automatically by `npm run build`)

import { cpSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { site, config, isConfigured } from '../src/data/site.js';
import { services } from '../src/data/services.js';
import { projects } from '../src/data/projects.js';
import { testimonials } from '../src/data/testimonials.js';
import { resolveDeployment } from './lib/deploy.mjs';
import { esc, nbsp, todo, todos, image, currentPage, configTodo } from './lib/html.mjs';

const repo = resolve(import.meta.dirname, '..');
const out = resolve(repo, 'build/site');
const deploy = resolveDeployment();

// Links: every internal href goes through u() so the preview works under /REgardin-Construction/.
const u = (path) => deploy.base + path.replace(/^\//, '');
const serviceBySlug = Object.fromEntries(services.map((s) => [s.slug, s]));
const whatsappReady = isConfigured(config.whatsappNumber);
const whatsappHref = `https://wa.me/${config.whatsappNumber}`;
if (!isConfigured(config.formspreeEndpoint)) configTodo('formspreeEndpoint', 'Formspree form endpoint (enquiry form)');
if (!isConfigured(config.ga4Id)) configTodo('ga4Id', 'GA4 measurement ID (analytics loads only once set)');
if (!whatsappReady) configTodo('whatsappNumber', 'WhatsApp number (floating button and contact page)');

const phoneLink = (className = '') =>
  `<a class="${className}" href="tel:${site.phone.tel}" data-track="click_call">${nbsp(site.phone.display)}</a>`;

// ------------------------------------------------------------------ structured data
const business = {
  '@type': 'GeneralContractor',
  '@id': `${site.canonicalOrigin}/#business`,
  name: site.name,
  url: `${site.canonicalOrigin}/`,
  telephone: site.phone.international.replace(/\s/g, ' '),
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Kensington, Cape Town',
    addressRegion: site.region,
    addressCountry: site.country,
  },
  areaServed: { '@type': 'City', name: site.city },
  image: `${site.canonicalOrigin}/og/og-default.jpg`,
  description: `${site.name} is a ${site.summary} in ${site.city}.`,
};

function breadcrumbs(trail) {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: trail.map(([name, path], i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name,
      item: `${site.canonicalOrigin}${path}`,
    })),
  };
}

// ------------------------------------------------------------------ layout
const NAV = [
  ['Services', '/services/'],
  ['Projects', '/projects/'],
  ['About', '/about/'],
  ['Contact', '/contact/'],
];

function layout({ path, title, description, body, schema = [], noindex = false, bodyClass = '' }) {
  const canonical = `${site.canonicalOrigin}${path}`;
  const served = `${deploy.origin}${deploy.base}${path.replace(/^\//, '')}`;
  const robots = noindex || deploy.target === 'pages' ? '<meta name="robots" content="noindex, nofollow" />' : '';
  const graph = schema.length
    ? `<script type="application/ld+json">${JSON.stringify({ '@context': 'https://schema.org', '@graph': schema })}</script>`
    : '';
  const nav = NAV.map(
    ([label, href]) =>
      `<li><a href="${u(href)}"${path.startsWith(href) ? ' aria-current="page"' : ''}>${label}</a></li>`,
  ).join('');

  return `<!doctype html>
<html lang="en-ZA"${isConfigured(config.ga4Id) ? ` data-ga4="${esc(config.ga4Id)}"` : ''}>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${esc(title)}</title>
    <meta name="description" content="${esc(description)}" />
    <link rel="canonical" href="${canonical}" />
    ${robots}
    <meta property="og:type" content="website" />
    <meta property="og:site_name" content="${esc(site.name)}" />
    <meta property="og:locale" content="en_ZA" />
    <meta property="og:title" content="${esc(title)}" />
    <meta property="og:description" content="${esc(description)}" />
    <meta property="og:url" content="${served}" />
    <meta property="og:image" content="${deploy.origin}${deploy.base}og/og-default.jpg" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="theme-color" content="#1e1f1c" />
    <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
    <link rel="stylesheet" href="/_src/css/site.css" />
    <script type="module" src="/_src/js/site.js"></script>
    ${graph}
  </head>
  <body class="${bodyClass}">
    <a class="skip" href="#main">Skip to content</a>
    <header class="masthead">
      <a class="brand" href="${u('/')}">
        <span class="brand__name">Regardin</span>
        <span class="brand__sub">Construction</span>
      </a>
      <nav class="nav" aria-label="Main">
        <ul>${nav}</ul>
      </nav>
      <p class="masthead__call">${phoneLink('button button--small')}</p>
    </header>
    <main id="main">
${body}
    </main>
    <footer class="footer">
      <div class="footer__grid">
        <div>
          <p class="footer__name">${esc(site.name)}</p>
          <p>${esc(site.locality)}</p>
        </div>
        <div>
          <p class="footer__label">Contact</p>
          <p>${esc(site.contactPerson)}</p>
          <p>${phoneLink()}</p>
          <p>${site.email ? `<a href="mailto:${esc(site.email)}" data-track="click_email">${esc(site.email)}</a>` : todo('email', 'public email address — info@regardinconstruction.co.za or regardbothma@icloud.com', 'Contact')}</p>
        </div>
        <div>
          <p class="footer__label">Pages</p>
          <ul class="footer__links">
            <li><a href="${u('/services/')}">Services</a></li>
            <li><a href="${u('/projects/')}">Projects</a></li>
            <li><a href="${u('/about/')}">About</a></li>
            <li><a href="${u('/contact/')}">Request a quote</a></li>
            <li><a href="${u('/privacy-policy/')}">Privacy notice</a></li>
          </ul>
        </div>
      </div>
      <p class="footer__small">© ${new Date().getFullYear()} ${esc(site.name)}. Website by <a href="${site.agency.url}">${site.agency.name}</a>.</p>
    </footer>
    <a class="whatsapp" href="${whatsappHref}" data-track="click_whatsapp" rel="noopener">
      <span class="whatsapp__icon" aria-hidden="true"></span>
      <span>WhatsApp</span>
    </a>
    <nav class="mobile-bar" aria-label="Quick contact">
      <a href="tel:${site.phone.tel}" data-track="click_call">Call</a>
      <a href="${u('/contact/')}">Request a quote</a>
    </nav>
  </body>
</html>
`;
}

// ------------------------------------------------------------------ shared blocks
const sectionHead = (index, label, heading, id) => `
      <div class="section-head">
        <p class="section-head__index">${index} <span>${label}</span></p>
        <h2${id ? ` id="${id}"` : ''}>${heading}</h2>
      </div>`;

const ctaBand = (heading = 'Tell us what you have planned.') => `
      <section class="band band--dark" aria-labelledby="cta-heading">
        <div class="band__inner cta">
          <h2 id="cta-heading">${heading}</h2>
          <p>Send photos and a short description, and ${esc(site.contactPerson.split(' ')[0])} will get back to you.</p>
          <p class="cta__actions">
            <a class="button button--light" href="${u('/contact/')}">Request a quote</a>
            ${phoneLink('button button--outline-light')}
          </p>
        </div>
      </section>`;

function projectFigure(p, { sizes = '(min-width: 64em) 30vw, (min-width: 40em) 45vw, 100vw' } = {}) {
  const s = serviceBySlug[p.service];
  return `<figure class="work" data-service="${p.service}">
          ${image({ name: p.image, alt: `${p.title} by ${site.name}`, note: `${p.title}: a real completed job (${s.name})`, sizes })}
          <figcaption><span class="work__title">${esc(p.title)}</span> <a href="${u(`/services/${s.slug}/`)}">${esc(s.name)}</a></figcaption>
        </figure>`;
}

function processSteps() {
  return `<ol class="steps">
          <li>
            <h3>Send the details</h3>
            <p>Use the enquiry form${whatsappReady ? ', WhatsApp' : ''} or call ${phoneLink()}. Photos and rough measurements help us understand the job.</p>
          </li>
          <li>
            <h3>We look at the job</h3>
            <p>${todo('site-visit', 'whether a site visit is arranged, when, and whether it is free', 'Commercial terms')}</p>
          </li>
          <li>
            <h3>You get a quote</h3>
            <p>${todo('quote-terms', 'written quote, how long it is valid (old terms say 30 days) and deposit terms', 'Commercial terms')}</p>
          </li>
          <li>
            <h3>The work is done</h3>
            <p>${todo('site-management', 'who manages the job on site and how progress is reported', 'Operations')}</p>
          </li>
        </ol>`;
}

// ------------------------------------------------------------------ pages
const pages = [];
const page = (path, fn) => pages.push({ path, fn });

page('/', () => {
  const featured = [
    'project-decking',
    'project-boundary-wall',
    'project-pool-plastering',
    'project-concrete-stairs',
  ].map((name) => projects.find((p) => p.image === name));
  return layout({
    path: '/',
    title: 'Regardin Construction | Renovations and Timber Work, Cape Town',
    description:
      'Renovations, brickwork, concrete, plastering, painting, decks and pergolas for homes in Cape Town. Regardin Construction, Kensington.',
    schema: [business, { '@type': 'WebSite', name: site.name, url: `${site.canonicalOrigin}/` }],
    bodyClass: 'home',
    body: `
      <section class="hero" aria-labelledby="hero-heading">
        <div class="hero__text">
          <p class="eyebrow">${esc(site.locality)}</p>
          <h1 id="hero-heading">Renovations, building and timber work for Cape Town homes.</h1>
          <p class="lede">Brickwork, concrete, plastering, painting, carpentry, decks and pergolas. See the work, then tell us what you have planned.</p>
          <p class="hero__actions">
            <a class="button" href="${u('/contact/')}">Request a quote</a>
            <a class="link-arrow" href="${u('/projects/')}">View projects</a>
          </p>
        </div>
        <div class="hero__media">
          ${image({ name: 'hero', alt: 'Completed Regardin Construction project', note: 'Home hero: the strongest finished project, landscape or portrait, at least 1920 px wide', ratio: '4 / 5', sizes: '(min-width: 64em) 45vw, 100vw', eager: true })}
        </div>
      </section>

      <ul class="ticker" aria-label="Services">
        ${services.map((s) => `<li>${esc(s.name)}</li>`).join('')}
      </ul>

      <section class="section" aria-labelledby="services-heading">
        ${sectionHead('01', 'Services', 'What we do', 'services-heading')}
        <ol class="service-list">
          ${services
            .map(
              (s, i) => `<li>
            <a class="service-row" href="${u(`/services/${s.slug}/`)}">
              <span class="service-row__num">${String(i + 1).padStart(2, '0')}</span>
              <span class="service-row__name">${esc(s.name)}</span>
              <span class="service-row__short">${esc(s.short)}</span>
            </a>
          </li>`,
            )
            .join('')}
        </ol>
      </section>

      <section class="section section--tint" aria-labelledby="work-heading">
        ${sectionHead('02', 'Projects', 'Selected work', 'work-heading')}
        <div class="work-grid work-grid--feature">
          ${featured.map((p) => projectFigure(p)).join('')}
        </div>
        <p><a class="link-arrow" href="${u('/projects/')}">All projects</a></p>
      </section>

      <section class="section" aria-labelledby="process-heading">
        ${sectionHead('03', 'Process', 'How a job starts', 'process-heading')}
        ${processSteps()}
      </section>

      <section class="section section--quotes" aria-labelledby="words-heading">
        ${sectionHead('04', 'Clients', 'In their words', 'words-heading')}
        <div class="quotes">
          ${testimonials
            .map(
              (t) => `<figure class="quote">
            <blockquote><p>${esc(t.quote)}</p></blockquote>
            <figcaption>${esc(t.name)}</figcaption>
          </figure>`,
            )
            .join('')}
        </div>
      </section>

      <section class="section split" aria-labelledby="about-heading">
        <div class="split__media">
          ${image({ name: 'about-regard-bothma', alt: `${site.contactPerson}, ${site.name}`, note: 'Portrait of Regard Bothma, on site or with a finished job', ratio: '4 / 5', sizes: '(min-width: 64em) 40vw, 100vw' })}
        </div>
        <div class="split__text">
          ${sectionHead('05', 'About', `Talk to ${esc(site.contactPerson)}`, 'about-heading')}
          <p>${esc(site.name)} is a ${esc(site.summary)} based in ${esc(site.locality)}. ${esc(site.contactPerson)} is your contact from the first enquiry.</p>
          <p><a class="link-arrow" href="${u('/about/')}">About ${esc(site.name)}</a></p>
        </div>
      </section>
${ctaBand()}`,
  });
});

page('/services/', () =>
  layout({
    path: '/services/',
    title: 'Building and Timber Services in Cape Town | Regardin Construction',
    description:
      'Carpentry, decks and pergolas, renovations, brickwork, concrete, plastering, screeds, pool plastering, painting and custom projects in Cape Town.',
    schema: [
      business,
      breadcrumbs([
        ['Home', '/'],
        ['Services', '/services/'],
      ]),
    ],
    body: `
      <header class="page-head">
        <p class="eyebrow">Services</p>
        <h1>Building and timber work for homes in Cape Town</h1>
        <p class="lede">${services.length} areas of work, from timber decks to boundary walls. Choose one for what it covers and what to send us for a quote.</p>
      </header>
      <div class="service-stack">
        ${services
          .map(
            (s, i) => `<section class="service-block" aria-labelledby="svc-${s.slug}">
          ${image({ name: s.image, alt: `${s.name} by ${site.name}`, note: s.imageNote, ratio: '3 / 2', sizes: '(min-width: 64em) 50vw, 100vw' })}
          <div class="service-block__text">
            <p class="service-block__num">${String(i + 1).padStart(2, '0')}</p>
            <h2 id="svc-${s.slug}">${esc(s.name)}</h2>
            <p>${esc(s.short)}</p>
            <ul class="tags">${s.includes.map((x) => `<li>${esc(x)}</li>`).join('')}</ul>
            <p><a class="link-arrow" href="${u(`/services/${s.slug}/`)}">${esc(s.name)}<span class="visually-hidden">: details</span></a></p>
          </div>
        </section>`,
          )
          .join('')}
      </div>
${ctaBand()}`,
  }),
);

for (const s of services) {
  page(`/services/${s.slug}/`, () => {
    const path = `/services/${s.slug}/`;
    const related = projects.filter((p) => p.service === s.slug);
    const others = services.filter((o) => o.slug !== s.slug);
    return layout({
      path,
      title: `${s.metaTitle} | Regardin`,
      description: s.metaDescription,
      schema: [
        business,
        {
          '@type': 'Service',
          name: s.name,
          serviceType: s.name,
          description: s.intro,
          provider: { '@id': `${site.canonicalOrigin}/#business` },
          areaServed: { '@type': 'City', name: site.city },
        },
        breadcrumbs([
          ['Home', '/'],
          ['Services', '/services/'],
          [s.name, path],
        ]),
      ],
      body: `
      <nav class="crumbs" aria-label="Breadcrumb">
        <ol><li><a href="${u('/')}">Home</a></li><li><a href="${u('/services/')}">Services</a></li><li><span aria-current="page">${esc(s.name)}</span></li></ol>
      </nav>
      <header class="page-head page-head--service">
        <h1>${esc(s.name)} in Cape Town</h1>
        <p class="lede">${esc(s.intro)}</p>
        <p><a class="button" href="${u(`/contact/?service=${s.slug}`)}">Request a quote</a></p>
      </header>
      <div class="service-hero">
        ${image({ name: s.image, alt: `${s.name} by ${site.name}`, note: s.imageNote, ratio: '16 / 9', sizes: '100vw', eager: true })}
      </div>
      <div class="columns">
        <section aria-labelledby="covers">
          <h2 id="covers">What this covers</h2>
          <ul class="checklist">${s.includes.map((x) => `<li>${esc(x)}</li>`).join('')}</ul>
          <p class="muted">Anything not listed? Ask. ${todo(`exclusions-${s.slug}`, `anything not offered under ${s.name.toLowerCase()}`, 'Services')}</p>
        </section>
        <section aria-labelledby="send">
          <h2 id="send">What to send for a quote</h2>
          <ul class="checklist">${s.send.map((x) => `<li>${esc(x)}</li>`).join('')}</ul>
        </section>
      </div>
      ${
        related.length
          ? `<section class="section section--tint" aria-labelledby="related-work">
        ${sectionHead('—', 'Projects', `${esc(s.name)}: recent work`, 'related-work')}
        <div class="work-grid">${related.map((p) => projectFigure(p)).join('')}</div>
      </section>`
          : ''
      }
      <section class="section" aria-labelledby="other-services">
        <h2 id="other-services">Other services</h2>
        <ul class="other-services">${others.map((o) => `<li><a href="${u(`/services/${o.slug}/`)}">${esc(o.name)}</a></li>`).join('')}</ul>
      </section>
${ctaBand(`Planning ${s.name.toLowerCase().replace(/ and .*/, '')} work?`)}`,
    });
  });
}

page('/projects/', () =>
  layout({
    path: '/projects/',
    title: 'Projects | Regardin Construction, Cape Town',
    description:
      'Decks, patios, closets, boundary walls, concrete stairs, plastering, screeds, pool plastering and painting by Regardin Construction in Cape Town.',
    schema: [
      business,
      breadcrumbs([
        ['Home', '/'],
        ['Projects', '/projects/'],
      ]),
    ],
    body: `
      <header class="page-head">
        <p class="eyebrow">Projects</p>
        <h1>Work by type</h1>
        <p class="lede">A selection of jobs, grouped by the kind of work. ${todo('project-details', 'project details (suburb, year and scope) for each photograph', 'Proof')}</p>
      </header>
      <div class="filters" data-filters hidden>
        <p id="filter-label">Show</p>
        <ul aria-labelledby="filter-label">
          <li><button type="button" data-filter="all" aria-pressed="true">All work</button></li>
          ${services
            .filter((s) => projects.some((p) => p.service === s.slug))
            .map(
              (s) =>
                `<li><button type="button" data-filter="${s.slug}" aria-pressed="false">${esc(s.name)}</button></li>`,
            )
            .join('')}
        </ul>
      </div>
      <div class="work-grid work-grid--all" data-work>
        ${projects.map((p) => projectFigure(p)).join('')}
      </div>
      <p class="visually-hidden" aria-live="polite" data-filter-status></p>
${ctaBand()}`,
  }),
);

page('/about/', () =>
  layout({
    path: '/about/',
    title: 'About Regardin Construction | Kensington, Cape Town',
    description: `${site.name} is a ${site.summary} based in Kensington, Cape Town. Your contact is ${site.contactPerson}.`,
    schema: [
      business,
      breadcrumbs([
        ['Home', '/'],
        ['About', '/about/'],
      ]),
    ],
    body: `
      <header class="page-head">
        <p class="eyebrow">About</p>
        <h1>About ${esc(site.name)}</h1>
      </header>
      <section class="split split--flush" aria-label="Who we are">
        <div class="split__media">
          ${image({ name: 'about-regard-bothma', alt: `${site.contactPerson}, ${site.name}`, note: 'Portrait of Regard Bothma, on site or with a finished job', ratio: '4 / 5', sizes: '(min-width: 64em) 40vw, 100vw', eager: true })}
        </div>
        <div class="split__text prose">
          <p class="lede">${esc(site.name)} is a ${esc(site.summary)} based in ${esc(site.locality)}.</p>
          <p>${esc(site.contactPerson)} is the contact for every enquiry. ${todo('owner-role', "Regard Bothma's role and title", 'Business')}</p>
          <p>Experience: ${todo('experience', 'years in the trade — old site says "nearly two decades", AcB Projects says since 2004', 'Business')}</p>
          <p>The work covers renovations and alterations, brickwork and boundary walls, concrete, plastering and screeds, painting, and timber work from decks and pergolas to walk-in closets.</p>
          <h2>Where we work</h2>
          <p>Based in ${esc(site.locality)}. ${todo('areas', 'suburbs and regions served', 'Areas')}</p>
          <h2>Registration and insurance</h2>
          <p>${todo('registrations', 'company registration (CIPC), VAT, COIDA, insurance and NHBRC status — published only if supplied', 'Business')}</p>
        </div>
      </section>
      <section class="section section--tint" aria-labelledby="services-heading">
        ${sectionHead('—', 'Services', 'What we do', 'services-heading')}
        <ul class="other-services">${services.map((s) => `<li><a href="${u(`/services/${s.slug}/`)}">${esc(s.name)}</a></li>`).join('')}</ul>
      </section>
${ctaBand()}`,
  }),
);

page('/contact/', () =>
  layout({
    path: '/contact/',
    title: 'Request a Quote | Regardin Construction, Cape Town',
    description: `Request a quote from ${site.name}. Call ${site.phone.display} or send your project details and photos.`,
    schema: [
      business,
      breadcrumbs([
        ['Home', '/'],
        ['Contact', '/contact/'],
      ]),
    ],
    body: `
      <header class="page-head">
        <p class="eyebrow">Contact</p>
        <h1>Request a quote</h1>
        <p class="lede">Tell us about the job. The more detail you give, the easier it is to quote.</p>
      </header>
      <div class="contact">
        <form class="form" action="${esc(config.formspreeEndpoint)}" method="post" data-form data-thanks="${u('/thank-you/')}"${isConfigured(config.formspreeEndpoint) ? '' : ' data-unconfigured'}>
          <div class="field">
            <label for="f-name">Your name <span class="req">(required)</span></label>
            <input id="f-name" name="name" type="text" autocomplete="name" required />
          </div>
          <div class="field-row">
            <div class="field">
              <label for="f-phone">Phone <span class="req">(required)</span></label>
              <input id="f-phone" name="phone" type="tel" autocomplete="tel" required />
            </div>
            <div class="field">
              <label for="f-email">Email <span class="req">(required)</span></label>
              <input id="f-email" name="email" type="email" autocomplete="email" required />
            </div>
          </div>
          <div class="field-row">
            <div class="field">
              <label for="f-suburb">Suburb of the project <span class="req">(required)</span></label>
              <input id="f-suburb" name="suburb" type="text" autocomplete="address-level3" required />
            </div>
            <div class="field">
              <label for="f-service">Type of work</label>
              <select id="f-service" name="service">
                <option value="">Choose a service</option>
                ${services.map((s) => `<option value="${s.slug}">${esc(s.name)}</option>`).join('')}
                <option value="other">Something else</option>
              </select>
            </div>
          </div>
          <div class="field">
            <label for="f-message">About the job <span class="req">(required)</span></label>
            <textarea id="f-message" name="message" rows="6" required aria-describedby="f-message-hint"></textarea>
            <p class="hint" id="f-message-hint">What you want done, rough sizes, and anything we should know about access to the site.</p>
          </div>
          <div class="field">
            <label for="f-timing">When would you like the work done? <span class="opt">(optional)</span></label>
            <input id="f-timing" name="timing" type="text" />
          </div>
          <input class="hp" type="text" name="_gotcha" tabindex="-1" autocomplete="off" aria-hidden="true" />
          <p class="hint">Photos help. After you send this form, you can send photos ${whatsappReady ? 'on WhatsApp or ' : ''}by replying to our response.</p>
          <p class="notice">We use your details only to reply to this enquiry. Read the <a href="${u('/privacy-policy/')}">privacy notice</a>.</p>
          <p><button class="button" type="submit">Request a project quote</button></p>
          <p class="form__status" role="status" aria-live="polite" data-form-status></p>
        </form>
        <aside class="contact__details" aria-label="Contact details">
          <h2>Contact ${esc(site.contactPerson)}</h2>
          <dl>
            <dt>Phone</dt><dd>${phoneLink()}</dd>
            <dt>WhatsApp</dt><dd>${whatsappReady ? `<a href="${whatsappHref}" data-track="click_whatsapp">${nbsp(site.phone.display)}</a>` : todo('whatsapp', 'WhatsApp number', 'Contact')}</dd>
            <dt>Email</dt><dd>${site.email ? `<a href="mailto:${esc(site.email)}" data-track="click_email">${esc(site.email)}</a>` : todo('email', 'public email address — info@regardinconstruction.co.za or regardbothma@icloud.com', 'Contact')}</dd>
            <dt>Based in</dt><dd>${esc(site.locality)}</dd>
            <dt>Areas</dt><dd>${todo('areas', 'suburbs and regions served', 'Areas')}</dd>
            <dt>Hours</dt><dd>${todo('hours', 'business hours', 'Contact')}</dd>
          </dl>
        </aside>
      </div>
      <section class="section" aria-labelledby="process-heading">
        ${sectionHead('—', 'Process', 'What happens next', 'process-heading')}
        ${processSteps()}
      </section>`,
  }),
);

page('/thank-you/', () =>
  layout({
    path: '/thank-you/',
    noindex: true,
    title: 'Thank You | Regardin Construction',
    description: 'Your enquiry has been sent to Regardin Construction.',
    body: `
      <header class="page-head page-head--short">
        <p class="eyebrow">Enquiry sent</p>
        <h1>Thank you. Your enquiry is on its way.</h1>
        <p class="lede">${esc(site.contactPerson)} will reply using the details you gave. If it is urgent, call ${phoneLink()}.</p>
        <p><a class="link-arrow" href="${u('/projects/')}">Look through the projects</a></p>
      </header>`,
  }),
);

page('/privacy-policy/', () =>
  layout({
    path: '/privacy-policy/',
    title: 'Privacy Notice | Regardin Construction',
    description: 'How Regardin Construction handles the personal information you send through this website.',
    schema: [
      breadcrumbs([
        ['Home', '/'],
        ['Privacy notice', '/privacy-policy/'],
      ]),
    ],
    body: `
      <header class="page-head page-head--short">
        <p class="eyebrow">Privacy</p>
        <h1>Privacy notice</h1>
        <p class="lede">${todo('privacy-review', 'owner or legal review of this privacy notice before launch', 'Legal')}</p>
      </header>
      <div class="prose prose--page">
        <h2>What this covers</h2>
        <p>This notice explains what happens to the personal information you give ${esc(site.name)} through this website, in line with the Protection of Personal Information Act (POPIA).</p>
        <h2>What we collect</h2>
        <p>When you send the enquiry form, we receive your name, phone number, email address, the suburb of the project, the type of work and your description of the job. If you call, WhatsApp or email us, we receive the details you share there.</p>
        <h2>Why we use it</h2>
        <p>Only to reply to your enquiry, prepare a quote and, if you go ahead, carry out the work. We do not sell your information or use it for marketing lists.</p>
        <h2>Who processes it</h2>
        <p>The enquiry form is delivered by Formspree, a form service that may store and process your submission outside South Africa before it reaches us by email.${isConfigured(config.ga4Id) ? ' The site uses Google Analytics to count visits and see which pages are useful. It sets cookies and does not receive the details you type into the form.' : ''}</p>
        <h2>How long we keep it</h2>
        <p>${todo('retention', 'how long enquiries are kept', 'Legal')}</p>
        <h2>Your rights</h2>
        <p>You may ask what personal information we hold about you, and ask us to correct or delete it. Contact ${esc(site.contactPerson)} on ${phoneLink()}.</p>
        <p>Information Officer: ${todo('information-officer', 'Information Officer name and contact details', 'Legal')}</p>
      </div>`,
  }),
);

page('/404.html', () =>
  layout({
    path: '/404.html',
    noindex: true,
    title: 'Page Not Found | Regardin Construction',
    description: 'The page you asked for does not exist.',
    body: `
      <header class="page-head page-head--short">
        <p class="eyebrow">404</p>
        <h1>That page is not here.</h1>
        <p class="lede">It may have moved when the website was rebuilt.</p>
        <p class="hero__actions"><a class="button" href="${u('/')}">Go to the homepage</a> <a class="link-arrow" href="${u('/services/')}">See the services</a></p>
      </header>`,
  }),
);

// ------------------------------------------------------------------ write
rmSync(out, { recursive: true, force: true });
for (const { path, fn } of pages) {
  currentPage.path = path;
  const file = path.endsWith('.html') ? resolve(out, path.slice(1)) : resolve(out, path.slice(1), 'index.html');
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, fn());
}
cpSync(resolve(repo, 'src/css'), resolve(out, '_src/css'), { recursive: true });
cpSync(resolve(repo, 'src/js'), resolve(out, '_src/js'), { recursive: true });

// docs/TODO_CONFIRM.md
const byGroup = {};
for (const [key, t] of todos.facts) (byGroup[t.group] ||= []).push({ key, ...t });
const pagesList = (set) => (set.size > 6 ? 'every page (footer)' : [...set].map((p) => `\`${p}\``).join(', '));
const md = [
  '# To supply or confirm',
  '',
  'Generated by `scripts/build-pages.mjs` on every build — do not edit by hand. Each item shows on the site as an amber `[CONFIRM: …]` marker or a hatched photo placeholder until it is supplied. `npm run package` refuses to create a cPanel release while any item remains.',
  '',
  '## Settings (`src/data/site.js` → `config`)',
  '',
  ...(todos.config.size
    ? [...todos.config].map(([key, label]) => `- [ ] \`${key}\`: ${label}`)
    : ['- None outstanding.']),
  '',
  '## Facts',
  '',
  ...Object.entries(byGroup).flatMap(([group, items]) => [
    `### ${group}`,
    '',
    ...items.map((t) => `- [ ] ${t.label} — ${pagesList(t.pages)}`),
    '',
  ]),
  `## Photographs (${todos.images.size})`,
  '',
  'Save each as a JPG (at least 1920 px wide for the hero, 1200 px for the rest) in `src/images/` with exactly this filename, then rebuild. Only real, approved photographs of Regardin work; no stock or AI images.',
  '',
  '| File | What it should show | Used on |',
  '| --- | --- | --- |',
  ...[...todos.images].map(([name, t]) => `| \`src/images/${name}.jpg\` | ${t.note} | ${pagesList(t.pages)} |`),
  '',
  '## Also needed',
  '',
  '- [ ] Approved logo files (the header uses a text wordmark until then).',
  '- [ ] Link-preview image: a real project photo, 1200 × 630 px, to replace `public/og/og-default.jpg` (currently a plain text card).',
  '- [ ] Owner approval of the two testimonial excerpts (Tarah Leonard, Beverley Kolbe), which are quoted word for word from the current site.',
  '- [ ] Whether the phone number may be advertised as WhatsApp-enabled.',
  '',
].join('\n');
writeFileSync(resolve(repo, 'docs/TODO_CONFIRM.md'), md);

console.log(
  `pages: ${pages.length} written (${deploy.target}); TODO_CONFIRM: ${todos.facts.size} facts, ${todos.images.size} photos, ${todos.config.size} settings`,
);
