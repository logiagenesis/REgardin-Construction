// Progressive enhancement only. Every page, link and the enquiry form work without this file.

const root = document.documentElement;
root.classList.add('js');

// ---------------------------------------------------------------- GA4 (gtag.js, no GTM)
// Loads only when a measurement ID is configured (src/data/site.js → config.ga4Id).
const ga4Id = root.dataset.ga4;
window.dataLayer = window.dataLayer || [];
function gtag() {
  window.dataLayer.push(arguments);
}
if (ga4Id) {
  window.gtag = gtag;
  gtag('js', new Date());
  gtag('config', ga4Id);
  const s = document.createElement('script');
  s.async = true;
  s.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(ga4Id)}`;
  document.head.append(s);
}
// Never send names, numbers, emails or messages: only the event name and where it happened.
const track = (name, params = {}) => {
  if (ga4Id) gtag('event', name, params);
};

document.addEventListener('click', (event) => {
  const link = event.target.closest('[data-track]');
  if (link)
    track(link.dataset.track, {
      link_location: link.closest('header, footer, main, nav, aside')?.tagName.toLowerCase() || 'page',
    });
});

// generate_lead fires once, on the thank-you page, only after Formspree accepted the form.
if (location.pathname.endsWith('/thank-you/')) {
  try {
    if (sessionStorage.getItem('regardin-lead') === 'sent') {
      track('generate_lead');
      sessionStorage.removeItem('regardin-lead');
    }
  } catch {
    /* storage blocked: skip the event rather than risk counting twice */
  }
}

// ---------------------------------------------------------------- project filter
const filterBar = document.querySelector('[data-filters]');
if (filterBar) {
  const items = [...document.querySelectorAll('[data-work] .work')];
  const status = document.querySelector('[data-filter-status]');
  filterBar.hidden = false;
  filterBar.addEventListener('click', (event) => {
    const button = event.target.closest('button[data-filter]');
    if (!button) return;
    const value = button.dataset.filter;
    for (const b of filterBar.querySelectorAll('button')) b.setAttribute('aria-pressed', String(b === button));
    let shown = 0;
    for (const item of items) {
      item.hidden = value !== 'all' && item.dataset.service !== value;
      if (!item.hidden) shown += 1;
    }
    status.textContent = `Showing ${shown} ${shown === 1 ? 'project' : 'projects'}: ${button.textContent}.`;
  });
}

// ---------------------------------------------------------------- enquiry form (Formspree)
const form = document.querySelector('[data-form]');
if (form) {
  const status = form.querySelector('[data-form-status]');
  const select = form.querySelector('select[name="service"]');
  const wanted = new URLSearchParams(location.search).get('service');
  if (wanted && select.querySelector(`option[value="${CSS.escape(wanted)}"]`)) select.value = wanted;

  form.addEventListener('submit', async (event) => {
    if (!form.checkValidity()) return; // the browser shows its own messages
    event.preventDefault();
    if (form.hasAttribute('data-unconfigured')) {
      status.textContent =
        'The enquiry form is not connected yet (Formspree endpoint to be supplied). Please call instead.';
      return;
    }
    const button = form.querySelector('button[type="submit"]');
    button.disabled = true;
    status.textContent = 'Sending…';
    try {
      const response = await fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { Accept: 'application/json' },
      });
      if (!response.ok) throw new Error(String(response.status));
      try {
        sessionStorage.setItem('regardin-lead', 'sent');
      } catch {
        /* ignore */
      }
      location.assign(form.dataset.thanks);
    } catch {
      // Keep everything the visitor typed.
      status.textContent = 'Your enquiry could not be sent. Please try again, or call us.';
      button.disabled = false;
    }
  });
}

// ---------------------------------------------------------------- floating WhatsApp guard
// Keep the floating button off the form while someone is typing (it stays visible otherwise).
const floating = document.querySelector('.whatsapp');
if (floating && form) {
  form.addEventListener('focusin', () => floating.classList.add('whatsapp--tucked'));
  form.addEventListener('focusout', () => floating.classList.remove('whatsapp--tucked'));
}
