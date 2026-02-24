import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUTPUT = path.join(__dirname, '..', 'public', 'sitemap.xml');
const BASE_URL = 'https://sci-base.vercel.app';
const LOCALES = ['fr', 'en'];

function findTopicsDir() {
  const candidates = [
    path.join(__dirname, '..', '..', 'data', 'topics'),
    path.join(process.cwd(), '..', 'data', 'topics'),
    path.join(process.cwd(), 'data', 'topics'),
  ];
  for (const dir of candidates) {
    if (fs.existsSync(dir)) return dir;
  }
  throw new Error(`Cannot find data/topics. cwd=${process.cwd()}, __dirname=${__dirname}`);
}

const TOPICS_DIR = findTopicsDir();
const today = new Date().toISOString().split('T')[0];

// Collect base paths (without locale prefix)
const basePaths = [];

function addPath(pathStr, priority, changefreq = 'monthly') {
  basePaths.push({ path: pathStr, priority, changefreq });
}

// Static pages
addPath('/', 1.0, 'weekly');
addPath('/parcours', 0.8, 'monthly');
addPath('/recherche', 0.5, 'monthly');

// Dynamic pages from topics
const topicDirs = fs.readdirSync(TOPICS_DIR).filter((name) => {
  return fs.statSync(path.join(TOPICS_DIR, name)).isDirectory();
});

for (const slug of topicDirs) {
  addPath(`/topics/${slug}`, 0.9, 'monthly');
  addPath(`/topics/${slug}/papers`, 0.7, 'monthly');

  const quizPath = path.join(TOPICS_DIR, slug, 'quiz.json');
  if (fs.existsSync(quizPath)) {
    addPath(`/topics/${slug}/quiz`, 0.6, 'monthly');
  }

  const summariesDir = path.join(TOPICS_DIR, slug, 'paper-summaries');
  if (fs.existsSync(summariesDir)) {
    const files = fs.readdirSync(summariesDir).filter((f) => f.endsWith('.md'));
    for (const file of files) {
      const paperSlug = file.replace(/\.md$/, '');
      addPath(`/topics/${slug}/papers/${paperSlug}`, 0.6, 'monthly');
    }
  }
}

// Generate XML with hreflang alternates
const urlEntries = [];

for (const { path: basePath, priority, changefreq } of basePaths) {
  for (const locale of LOCALES) {
    const loc = `${BASE_URL}/${locale}${basePath === '/' ? '' : basePath}`;
    const alternates = LOCALES.map(
      (l) => `    <xhtml:link rel="alternate" hreflang="${l}" href="${BASE_URL}/${l}${basePath === '/' ? '' : basePath}" />`
    ).join('\n');
    const xDefault = `    <xhtml:link rel="alternate" hreflang="x-default" href="${BASE_URL}/fr${basePath === '/' ? '' : basePath}" />`;

    urlEntries.push(`  <url>
    <loc>${loc}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority.toFixed(1)}</priority>
${alternates}
${xDefault}
  </url>`);
  }
}

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urlEntries.join('\n')}
</urlset>
`;

fs.mkdirSync(path.dirname(OUTPUT), { recursive: true });
fs.writeFileSync(OUTPUT, xml);
console.log(`Sitemap generated: ${urlEntries.length} URLs (${basePaths.length} pages x ${LOCALES.length} locales) -> ${OUTPUT}`);
