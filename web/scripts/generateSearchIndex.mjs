import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import matter from 'gray-matter';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PUBLIC_DIR = path.join(__dirname, '..', 'public');

function findDataDir() {
  const candidates = [
    path.join(__dirname, '..', '..', 'data'),
    path.join(process.cwd(), '..', 'data'),
    path.join(process.cwd(), 'data'),
  ];
  for (const dir of candidates) {
    if (fs.existsSync(dir)) return dir;
  }
  throw new Error(`Cannot find data/. cwd=${process.cwd()}, __dirname=${__dirname}`);
}

const DATA_DIR = findDataDir();
const TOPICS_DIR = path.join(DATA_DIR, 'topics');

const LOCALES = ['fr', 'en'];

function extractTitle(markdown, locale = 'fr') {
  const match = markdown.match(/^#\s+(.+)$/m);
  if (match) return match[1].replace(/\*\*/g, '').trim();
  const match2 = markdown.match(/^##\s*(.+)$/m);
  if (match2) return match2[1].replace(/\*\*/g, '').trim();
  return locale === 'en' ? 'Untitled' : 'Sans titre';
}

function extractFirstParagraph(markdown) {
  const lines = markdown.split('\n');
  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#') && !trimmed.startsWith('---') && !trimmed.startsWith('-') && !trimmed.startsWith('```')) {
      return trimmed.slice(0, 200);
    }
  }
  return '';
}

function readLearningPath() {
  const raw = fs.readFileSync(path.join(TOPICS_DIR, 'learning-path.json'), 'utf-8');
  return JSON.parse(raw);
}

function getTopicLevel(slug, learningPath) {
  for (const p of learningPath.paths) {
    const entry = p.topics.find((t) => t.topic_id === slug);
    if (entry) return entry.level;
  }
  return 'debutant';
}

/**
 * Read a file with locale fallback: try EN path first, fallback to FR.
 */
function readLocalizedFile(topicSlug, filename, locale) {
  if (locale !== 'fr') {
    const enPath = path.join(DATA_DIR, 'en', 'topics', topicSlug, filename);
    if (fs.existsSync(enPath)) {
      return fs.readFileSync(enPath, 'utf-8');
    }
  }
  const frPath = path.join(TOPICS_DIR, topicSlug, filename);
  if (fs.existsSync(frPath)) return fs.readFileSync(frPath, 'utf-8');
  return null;
}

const lp = readLearningPath();
const topicDirs = fs.readdirSync(TOPICS_DIR).filter((name) => {
  return fs.statSync(path.join(TOPICS_DIR, name)).isDirectory();
});

for (const locale of LOCALES) {
  const items = [];
  const prefix = `/${locale}`;
  const summaryLabel = locale === 'en' ? 'Simplified summary' : 'Résumé vulgarisé';
  const quizDesc = locale === 'en'
    ? (count, title) => `${count} questions to test your knowledge on ${title}`
    : (count, title) => `${count} questions pour tester vos connaissances sur ${title}`;

  for (const slug of topicDirs) {
    // Topic
    const indexRaw = readLocalizedFile(slug, '_index.md', locale);
    if (indexRaw) {
      const { content } = matter(indexRaw);
      const title = extractTitle(content, locale);
      items.push({
        type: 'topic',
        title,
        description: extractFirstParagraph(content),
        url: `${prefix}/topics/${slug}`,
        topicSlug: slug,
        topicTitle: title,
        level: getTopicLevel(slug, lp),
      });
    }

    // Papers (always from FR — content already in English)
    const papersPath = path.join(TOPICS_DIR, slug, 'papers.json');
    if (fs.existsSync(papersPath)) {
      const papers = JSON.parse(fs.readFileSync(papersPath, 'utf-8'));
      const topicTitle = items.find((i) => i.topicSlug === slug)?.topicTitle || slug;
      for (const paper of papers) {
        items.push({
          type: 'paper',
          title: paper.title,
          description: paper.abstract?.slice(0, 200) || '',
          url: `${prefix}/topics/${slug}/papers`,
          topicSlug: slug,
          topicTitle,
          tags: paper.tags || [],
        });
      }
    }

    // Quiz
    const quizRaw = readLocalizedFile(slug, 'quiz.json', locale);
    if (quizRaw) {
      const topicTitle = items.find((i) => i.topicSlug === slug)?.topicTitle || slug;
      const quiz = JSON.parse(quizRaw);
      items.push({
        type: 'quiz',
        title: `Quiz — ${topicTitle}`,
        description: quizDesc(quiz.questions.length, topicTitle),
        url: `${prefix}/topics/${slug}/quiz`,
        topicSlug: slug,
        topicTitle,
        level: getTopicLevel(slug, lp),
      });
    }

    // Paper summaries
    const summariesDir = path.join(TOPICS_DIR, slug, 'paper-summaries');
    if (fs.existsSync(summariesDir)) {
      const topicTitle = items.find((i) => i.topicSlug === slug)?.topicTitle || slug;
      const files = fs.readdirSync(summariesDir).filter((f) => f.endsWith('.md'));
      for (const file of files) {
        const paperSlug = file.replace(/\.md$/, '');
        // Try localized version for the title
        const raw = readLocalizedFile(slug, `paper-summaries/${file}`, locale) ||
                    fs.readFileSync(path.join(summariesDir, file), 'utf-8');
        const { content } = matter(raw);
        items.push({
          type: 'paper-summary',
          title: extractTitle(content, locale),
          description: `${summaryLabel} — ${topicTitle}`,
          url: `${prefix}/topics/${slug}/papers/${paperSlug}`,
          topicSlug: slug,
          topicTitle,
        });
      }
    }
  }

  const output = path.join(PUBLIC_DIR, `search-index-${locale}.json`);
  fs.mkdirSync(path.dirname(output), { recursive: true });
  fs.writeFileSync(output, JSON.stringify(items, null, 0));
  console.log(`Search index [${locale}]: ${items.length} items -> ${output}`);
}
