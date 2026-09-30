// Small in-repo templating for the static site.
//
//   <!-- @include name -->              → contents of src/partials/name.html (recursive)
//   {{ business.phone.display }}         → value from src/data/*.json (unknown key = build error)
//   <!-- @unconfirmed --> … <!-- @end-unconfirmed -->
//                                        → kept on preview builds, removed from production
//   [CONFIRM: description]               → amber <mark> on preview builds; production build
//                                          fails later (scripts/postbuild.js) if any remain
//   <!-- @noindex -->                    → page always gets robots noindex (styleguide, thank-you)

import { readFileSync, readdirSync } from 'node:fs';
import { resolve, basename } from 'node:path';

const INCLUDE_RE = /<!--\s*@include\s+([\w-]+)\s*-->/g;
const TOKEN_RE = /\{\{\s*([\w.-]+)\s*\}\}/g;
const UNCONFIRMED_RE = /<!--\s*@unconfirmed\s*-->[\s\S]*?<!--\s*@end-unconfirmed\s*-->/g;
const CONFIRM_RE = /\[CONFIRM:[^\]]*\]/g;
const NOINDEX_RE = /<!--\s*@noindex\s*-->/;

export function isProduction() {
  return process.env.SITE_ENV === 'production';
}

export function loadData(dataDir) {
  const data = {};
  for (const file of readdirSync(dataDir)) {
    if (file.endsWith('.json')) {
      data[basename(file, '.json')] = JSON.parse(readFileSync(resolve(dataDir, file), 'utf8'));
    }
  }
  return data;
}

function lookup(data, path, where) {
  const value = path.split('.').reduce((obj, key) => (obj == null ? undefined : obj[key]), data);
  if (value === undefined || value === null || typeof value === 'object') {
    throw new Error(`[partials] Unknown or non-scalar data key "{{ ${path} }}" in ${where}`);
  }
  return String(value);
}

function escapeHtml(value) {
  return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

export default function partials({ partialsDir, dataDir }) {
  return {
    name: 'regardin-partials',
    transformIndexHtml: {
      order: 'pre',
      handler(html, ctx) {
        const where = ctx.filename;
        const production = isProduction();
        const data = { ...loadData(dataDir), site: { env: production ? 'production' : 'preview' } };

        let out = html;
        for (let depth = 0; INCLUDE_RE.test(out); depth += 1) {
          if (depth > 10) throw new Error(`[partials] Include depth exceeded in ${where}`);
          INCLUDE_RE.lastIndex = 0;
          out = out.replace(INCLUDE_RE, (_, name) => readFileSync(resolve(partialsDir, `${name}.html`), 'utf8'));
        }
        INCLUDE_RE.lastIndex = 0;

        out = out.replace(TOKEN_RE, (_, path) => escapeHtml(lookup(data, path, where)));

        if (production) {
          out = out.replace(UNCONFIRMED_RE, '');
        } else {
          out = out.replace(/<!--\s*@(end-)?unconfirmed\s*-->/g, '');
          // Only mark text content, never attribute values.
          out = out.replace(
            />([^<]*)</g,
            (_, text) => `>${text.replace(CONFIRM_RE, (m) => `<mark class="confirm">${m}</mark>`)}<`,
          );
        }

        const noindex = !production || NOINDEX_RE.test(out);
        out = out.replace(NOINDEX_RE, '');
        if (noindex) {
          out = out.replace('</head>', '    <meta name="robots" content="noindex, nofollow" />\n  </head>');
        }
        return out;
      },
    },
  };
}
