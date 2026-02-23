import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import matter from 'gray-matter';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUTPUT = path.join(__dirname, '..', 'public', 'search-index.json');

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

function extractTitle(markdown) {
  const match = markdown.match(/^#\s+(.+)$/m);
  if (match) return match[1].replace(/\*\*/g, '').trim();
  const match2 = markdown.match(/^##\s*(.+)$/m);
  if (match2) return match2[1].replace(/\*\*/g, '').trim();
  return 'Sans titre';
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

const items = [];
const lp = readLearningPath();

const topicDirs = fs.readdirSync(TOPICS_DIR).filter((name) => {
  return fs.statSync(path.join(TOPICS_DIR, name)).isDirectory();
});

for (const slug of topicDirs) {
  const topicDir = path.join(TOPICS_DIR, slug);

  // Topic
  const indexPath = path.join(topicDir, '_index.md');
  if (fs.existsSync(indexPath)) {
    const raw = fs.readFileSync(indexPath, 'utf-8');
    const { content } = matter(raw);
    const title = extractTitle(content);
    items.push({
      type: 'topic',
      title,
      description: extractFirstParagraph(content),
      url: `/topics/${slug}`,
      topicSlug: slug,
      topicTitle: title,
      level: getTopicLevel(slug, lp),
    });
  }

  // Papers
  const papersPath = path.join(topicDir, 'papers.json');
  if (fs.existsSync(papersPath)) {
    const papers = JSON.parse(fs.readFileSync(papersPath, 'utf-8'));
    const topicTitle = items.find((i) => i.topicSlug === slug)?.topicTitle || slug;
    for (const paper of papers) {
      items.push({
        type: 'paper',
        title: paper.title,
        description: paper.abstract?.slice(0, 200) || '',
        url: `/topics/${slug}/papers`,
        topicSlug: slug,
        topicTitle,
        tags: paper.tags || [],
      });
    }
  }

  // Quiz
  const quizPath = path.join(topicDir, 'quiz.json');
  if (fs.existsSync(quizPath)) {
    const topicTitle = items.find((i) => i.topicSlug === slug)?.topicTitle || slug;
    const quiz = JSON.parse(fs.readFileSync(quizPath, 'utf-8'));
    items.push({
      type: 'quiz',
      title: `Quiz — ${topicTitle}`,
      description: `${quiz.questions.length} questions pour tester vos connaissances sur ${topicTitle}`,
      url: `/topics/${slug}/quiz`,
      topicSlug: slug,
      topicTitle,
      level: getTopicLevel(slug, lp),
    });
  }

  // Paper summaries
  const summariesDir = path.join(topicDir, 'paper-summaries');
  if (fs.existsSync(summariesDir)) {
    const topicTitle = items.find((i) => i.topicSlug === slug)?.topicTitle || slug;
    const files = fs.readdirSync(summariesDir).filter((f) => f.endsWith('.md'));
    for (const file of files) {
      const paperSlug = file.replace(/\.md$/, '');
      const raw = fs.readFileSync(path.join(summariesDir, file), 'utf-8');
      const { content } = matter(raw);
      items.push({
        type: 'paper-summary',
        title: extractTitle(content),
        description: `Résumé vulgarisé — ${topicTitle}`,
        url: `/topics/${slug}/papers/${paperSlug}`,
        topicSlug: slug,
        topicTitle,
      });
    }
  }
}

fs.mkdirSync(path.dirname(OUTPUT), { recursive: true });
fs.writeFileSync(OUTPUT, JSON.stringify(items, null, 0));
console.log(`Search index generated: ${items.length} items -> ${OUTPUT}`);
