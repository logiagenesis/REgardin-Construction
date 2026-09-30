// Prebuild image pipeline (sharp): approved originals → AVIF + WebP + JPEG at responsive widths.
//
// Originals live in the git-ignored research/_raw/approved/ folder (the repo is public and
// unconfirmed photos must never be committed). Only the derivatives in src/assets/img/ are
// committed. EXIF/GPS metadata is stripped because sharp drops metadata unless asked to keep it.
// If no originals are present (e.g. in CI), the committed derivatives are used as they are.

import { existsSync, globSync, mkdirSync } from 'node:fs';
import { basename, extname, resolve } from 'node:path';
import sharp from 'sharp';

const repo = resolve(import.meta.dirname, '..');
const sourceDir = resolve(repo, 'research/_raw/approved');
const outDir = resolve(repo, 'src/assets/img');
const WIDTHS = [480, 800, 1200, 1600, 2400];

if (!existsSync(sourceDir)) {
  console.log('images: no research/_raw/approved/ folder — using committed derivatives.');
  process.exit(0);
}
mkdirSync(outDir, { recursive: true });

for (const file of globSync('*.{jpg,jpeg,png,webp,tif,tiff}', { cwd: sourceDir })) {
  const name = basename(file, extname(file));
  const input = sharp(resolve(sourceDir, file)).rotate();
  const { width } = await input.metadata();
  for (const w of WIDTHS.filter((w) => w <= width)) {
    const resized = input.clone().resize({ width: w, withoutEnlargement: true });
    await resized
      .clone()
      .avif({ quality: 55 })
      .toFile(resolve(outDir, `${name}-${w}.avif`));
    await resized
      .clone()
      .webp({ quality: 72 })
      .toFile(resolve(outDir, `${name}-${w}.webp`));
    await resized
      .clone()
      .jpeg({ quality: 78, mozjpeg: true })
      .toFile(resolve(outDir, `${name}-${w}.jpg`));
  }
  console.log(`images: ${file} → ${name}-*.{avif,webp,jpg}`);
}
