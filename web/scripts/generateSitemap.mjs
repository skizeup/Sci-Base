import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUTPUT = path.join(__dirname, '..', 'public', 'sitemap.xml');
const BASE_URL = 'https://sci-base.vercel.app';

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

const urls = [];

function addUrl(loc, priority, changefreq = 'monthly') {
  urls.push({ loc: `${BASE_URL}${loc}`, priority, changefreq, lastmod: today });
}

// Static pages
addUrl('/', 1.0, 'weekly');
addUrl('/parcours', 0.8, 'monthly');
addUrl('/recherche', 0.5, 'monthly');

// Dynamic pages from topics
const topicDirs = fs.readdirSync(TOPICS_DIR).filter((name) => {
  return fs.statSync(path.join(TOPICS_DIR, name)).isDirectory();
});

for (const slug of topicDirs) {
  addUrl(`/topics/${slug}`, 0.9, 'monthly');
  addUrl(`/topics/${slug}/papers`, 0.7, 'monthly');

  // Quiz
  const quizPath = path.join(TOPICS_DIR, slug, 'quiz.json');
  if (fs.existsSync(quizPath)) {
    addUrl(`/topics/${slug}/quiz`, 0.6, 'monthly');
  }

  // Paper summaries
  const summariesDir = path.join(TOPICS_DIR, slug, 'paper-summaries');
  if (fs.existsSync(summariesDir)) {
    const files = fs.readdirSync(summariesDir).filter((f) => f.endsWith('.md'));
    for (const file of files) {
      const paperSlug = file.replace(/\.md$/, '');
      addUrl(`/topics/${slug}/papers/${paperSlug}`, 0.6, 'monthly');
    }
  }
}

// Generate XML
const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (u) => `  <url>
    <loc>${u.loc}</loc>
    <lastmod>${u.lastmod}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority.toFixed(1)}</priority>
  </url>`
  )
  .join('\n')}
</urlset>
`;

fs.mkdirSync(path.dirname(OUTPUT), { recursive: true });
fs.writeFileSync(OUTPUT, xml);
console.log(`Sitemap generated: ${urls.length} URLs -> ${OUTPUT}`);
