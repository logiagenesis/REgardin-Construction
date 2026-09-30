// Supplied photographs → responsive AVIF, WebP and JPEG derivatives.
//
// Put real, approved photographs in src/images/ as <name>.jpg, using the filenames listed in
// docs/TODO_CONFIRM.md. Derivatives are written to public/assets/img/ (git-ignored; rebuilt on
// every build). sharp drops EXIF/GPS metadata unless asked to keep it.

import { existsSync, globSync, mkdirSync } from 'node:fs';
import { basename, extname, resolve } from 'node:path';
import sharp from 'sharp';

const repo = resolve(import.meta.dirname, '..');
const sourceDir = resolve(repo, 'src/images');
const outDir = resolve(repo, 'public/assets/img');
const WIDTHS = [640, 1200, 1920];

mkdirSync(outDir, { recursive: true });
const files = existsSync(sourceDir) ? globSync('*.jpg', { cwd: sourceDir }) : [];
for (const file of files) {
  const name = basename(file, extname(file));
  const input = sharp(resolve(sourceDir, file)).rotate();
  for (const w of WIDTHS) {
    const target = (ext) => resolve(outDir, `${name}-${w}.${ext}`);
    if (existsSync(target('jpg'))) continue;
    const resized = input.clone().resize({ width: w, withoutEnlargement: true });
    await resized.clone().avif({ quality: 55 }).toFile(target('avif'));
    await resized.clone().webp({ quality: 72 }).toFile(target('webp'));
    await resized.clone().jpeg({ quality: 78, mozjpeg: true }).toFile(target('jpg'));
  }
}
console.log(`images: ${files.length} supplied photograph(s) processed`);
