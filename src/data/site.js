// Single source of truth for business facts and integration settings.
//
// Only facts already recorded in this repository appear here (MASTER_PROMPT.md §6,
// docs/evidence-register.csv, and the client brief from Logi-Ink on 30/09/2026).
// Anything missing is `null` and is rendered through todo(), which shows a visible
// [CONFIRM: …] marker and lists it in docs/TODO_CONFIRM.md.

export const site = {
  name: 'Regardin Construction',
  // Brief from Logi-Ink, 30/09/2026.
  summary: 'residential renovation and timber construction company',
  contactPerson: 'Regard Bothma',
  phone: {
    display: '079 454 9780',
    international: '+27 79 454 9780',
    tel: '+27794549780',
  },
  // Two addresses are published on the old site (iCloud on the homepage, info@ in the
  // terms). The owner has not chosen one, so none is shown yet.
  email: null,
  locality: 'Kensington, Cape Town',
  city: 'Cape Town',
  region: 'Western Cape',
  country: 'ZA',
  canonicalOrigin: 'https://regardinconstruction.co.za',
  // Suburbs / regions served — not yet confirmed.
  areas: null,
  // "nearly two decades" (old site) conflicts with "since 2004" (AcB Projects).
  experience: null,
  hours: null,
  agency: { name: 'Logi-Ink', url: 'https://logi-ink.co.za' },
};

// Integration settings. Replace the placeholder values when they are supplied and rebuild.
// A value containing "PLACEHOLDER" is treated as not configured.
export const config = {
  // Formspree form endpoint, e.g. https://formspree.io/f/abcdwxyz
  formspreeEndpoint: 'https://formspree.io/f/FORMSPREE_FORM_ID_PLACEHOLDER',
  // GA4 measurement ID, e.g. G-ABC123XYZ9. gtag.js only loads once this is set.
  ga4Id: 'G-GA4_ID_PLACEHOLDER',
  // WhatsApp number in international format without "+" or spaces, e.g. 27794549780.
  whatsappNumber: 'WHATSAPP_NUMBER_PLACEHOLDER',
};

export const isConfigured = (value) => Boolean(value) && !String(value).includes('PLACEHOLDER');
