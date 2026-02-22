import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { markdownToHtml, extractTitle, extractFirstParagraph } from './markdown';
import type {
  Paper,
  TopicMeta,
  TopicFull,
  PaperSummaryMeta,
  PaperSummaryFull,
  LearningPath,
  TopicEntry,
  SearchItem,
} from './types';

function findDataDir(): string {
  // Try ../data (when cwd is web/)
  const fromWeb = path.join(process.cwd(), '..', 'data');
  if (fs.existsSync(fromWeb)) return fromWeb;

  // Try ./data (when cwd is repo root)
  const fromRoot = path.join(process.cwd(), 'data');
  if (fs.existsSync(fromRoot)) return fromRoot;

  // Try ../../data (deeper nesting)
  const fromDeep = path.join(process.cwd(), '..', '..', 'data');
  if (fs.existsSync(fromDeep)) return fromDeep;

  throw new Error(`Cannot find data/ directory. cwd=${process.cwd()}`);
}

const DATA_DIR = findDataDir();
const TOPICS_DIR = path.join(DATA_DIR, 'topics');

// ── Topic slugs ──

export function getTopicSlugs(): string[] {
  return fs
    .readdirSync(TOPICS_DIR)
    .filter((name) => {
      const fullPath = path.join(TOPICS_DIR, name);
      return fs.statSync(fullPath).isDirectory();
    });
}

// ── Learning path ──

export function getLearningPath(): LearningPath {
  const raw = fs.readFileSync(path.join(TOPICS_DIR, 'learning-path.json'), 'utf-8');
  return JSON.parse(raw);
}

function getTopicEntry(slug: string): TopicEntry | undefined {
  const lp = getLearningPath();
  for (const p of lp.paths) {
    const entry = p.topics.find((t) => t.topic_id === slug);
    if (entry) return entry;
  }
  return undefined;
}

// ── Read helpers ──

function readMarkdownFile(filePath: string): { content: string; frontmatter: Record<string, unknown> } {
  if (!fs.existsSync(filePath)) return { content: '', frontmatter: {} };
  const raw = fs.readFileSync(filePath, 'utf-8');
  const { data, content } = matter(raw);
  return { content, frontmatter: data };
}

function readJsonFile<T>(filePath: string, fallback: T): T {
  if (!fs.existsSync(filePath)) return fallback;
  const raw = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(raw);
}

// ── Topic metadata (lightweight, for listings) ──

export function getTopicMeta(slug: string): TopicMeta {
  const indexPath = path.join(TOPICS_DIR, slug, '_index.md');
  const { content } = readMarkdownFile(indexPath);
  const entry = getTopicEntry(slug);
  const papers = getPapers(slug);

  return {
    slug,
    title: extractTitle(content) || slug,
    description: extractFirstParagraph(content),
    level: entry?.level ?? 'debutant',
    order: entry?.order ?? 99,
    prerequisites: entry?.prerequisites ?? [],
    paperCount: papers.length,
  };
}

export function getAllTopicsMeta(): TopicMeta[] {
  return getTopicSlugs()
    .map(getTopicMeta)
    .sort((a, b) => a.order - b.order);
}

// ── Full topic (for topic page) ──

export async function getTopicFull(slug: string): Promise<TopicFull> {
  const meta = getTopicMeta(slug);

  const indexMd = readMarkdownFile(path.join(TOPICS_DIR, slug, '_index.md'));
  const summaryMd = readMarkdownFile(path.join(TOPICS_DIR, slug, 'summary.md'));
  const resourcesMd = readMarkdownFile(path.join(TOPICS_DIR, slug, 'resources.md'));

  const [indexHtml, summaryHtml, resourcesHtml] = await Promise.all([
    markdownToHtml(indexMd.content),
    markdownToHtml(summaryMd.content),
    markdownToHtml(resourcesMd.content),
  ]);

  return {
    ...meta,
    indexHtml,
    summaryHtml,
    resourcesHtml,
    papers: getPapers(slug),
    paperSummaries: getPaperSummarySlugs(slug),
  };
}

// ── Papers ──

export function getPapers(slug: string): Paper[] {
  return readJsonFile<Paper[]>(path.join(TOPICS_DIR, slug, 'papers.json'), []);
}

// ── Paper summaries ──

export function getPaperSummarySlugs(topicSlug: string): PaperSummaryMeta[] {
  const dir = path.join(TOPICS_DIR, topicSlug, 'paper-summaries');
  if (!fs.existsSync(dir)) return [];

  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith('.md'))
    .map((f) => {
      const slug = f.replace(/\.md$/, '');
      const { content } = readMarkdownFile(path.join(dir, f));
      return {
        slug,
        title: extractTitle(content),
        topicSlug,
      };
    });
}

export async function getPaperSummaryFull(
  topicSlug: string,
  paperSlug: string
): Promise<PaperSummaryFull> {
  const filePath = path.join(TOPICS_DIR, topicSlug, 'paper-summaries', `${paperSlug}.md`);
  const { content, frontmatter } = readMarkdownFile(filePath);
  const html = await markdownToHtml(content);

  return {
    slug: paperSlug,
    topicSlug,
    title: extractTitle(content),
    html,
    generatedBy: frontmatter.generated_by as string | undefined,
    generatedAt: frontmatter.generated_at as string | undefined,
  };
}

// ── Search index ──

export async function buildSearchIndex(): Promise<SearchItem[]> {
  const items: SearchItem[] = [];
  const metas = getAllTopicsMeta();

  for (const meta of metas) {
    items.push({
      type: 'topic',
      title: meta.title,
      description: meta.description,
      url: `/topics/${meta.slug}`,
      topicSlug: meta.slug,
      topicTitle: meta.title,
      level: meta.level,
    });

    const papers = getPapers(meta.slug);
    for (const paper of papers) {
      items.push({
        type: 'paper',
        title: paper.title,
        description: paper.abstract?.slice(0, 200) ?? '',
        url: `/topics/${meta.slug}/papers`,
        topicSlug: meta.slug,
        topicTitle: meta.title,
        tags: paper.tags,
      });
    }

    const summaries = getPaperSummarySlugs(meta.slug);
    for (const summary of summaries) {
      items.push({
        type: 'paper-summary',
        title: summary.title,
        description: `Résumé vulgarisé — ${meta.title}`,
        url: `/topics/${meta.slug}/papers/${summary.slug}`,
        topicSlug: meta.slug,
        topicTitle: meta.title,
      });
    }
  }

  return items;
}
