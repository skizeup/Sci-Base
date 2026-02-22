import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const webDir = path.join(__dirname, '..');

// Find the data directory
const candidates = [
  path.join(webDir, '..', 'data'),       // local dev: web/../data
  path.join(webDir, 'data'),             // already copied
];

const source = candidates.find((d) => fs.existsSync(path.join(d, 'topics')));

if (!source) {
  console.log('data/ directory not found, skipping copy');
  process.exit(0);
}

const dest = path.join(webDir, 'data');

// Skip if source === dest (already in web/)
if (path.resolve(source) === path.resolve(dest)) {
  console.log('data/ already in web/, skipping copy');
  process.exit(0);
}

// Recursive copy
function copyDir(src, dst) {
  fs.mkdirSync(dst, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const srcPath = path.join(src, entry.name);
    const dstPath = path.join(dst, entry.name);
    if (entry.isDirectory()) {
      copyDir(srcPath, dstPath);
    } else {
      fs.copyFileSync(srcPath, dstPath);
    }
  }
}

copyDir(source, dest);
console.log(`Copied data/ into web/data/ (from ${source})`);
