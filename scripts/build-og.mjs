// Plain text link-preview card (1200 × 630) until a real project photo is supplied.
import { existsSync, mkdirSync } from 'node:fs';
import { resolve } from 'node:path';
import sharp from 'sharp';

const out = resolve(import.meta.dirname, '..', 'public/og/og-default.jpg');
if (!existsSync(out)) {
  mkdirSync(resolve(out, '..'), { recursive: true });
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630">
  <rect width="1200" height="630" fill="#1e1f1c"/>
  <rect x="80" y="440" width="120" height="6" fill="#d9774f"/>
  <text x="80" y="300" font-family="DejaVu Sans, Arial, sans-serif" font-weight="700" font-size="96" fill="#f7f5f0">REGARDIN</text>
  <text x="80" y="380" font-family="DejaVu Sans, Arial, sans-serif" font-size="44" letter-spacing="12" fill="#f7f5f0">CONSTRUCTION</text>
  <text x="80" y="520" font-family="DejaVu Sans, Arial, sans-serif" font-size="34" fill="#e9e4da">Renovations, building and timber work · Cape Town</text>
</svg>`;
  await sharp(Buffer.from(svg)).jpeg({ quality: 82 }).toFile(out);
  console.log('og: wrote public/og/og-default.jpg');
}
