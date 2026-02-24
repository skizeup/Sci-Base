import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { markdownToHtml, extractTitle, extractFirstParagraph } from './markdown';
import type { Locale } from './i18n/config';
import type {
  Paper,
  TopicMeta,
  TopicFull,
  PaperSummaryMeta,
  PaperSummaryFull,
  LearningPath,
  TopicEntry,
  SearchItem,
  Quiz,
} from './types';

function findDataDir(): string {
  const fromWeb = path.join(process.cwd(), '..', 'data');
  if (fs.existsSync(fromWeb)) return fromWeb;

  const fromRoot = path.join(process.cwd(), 'data');
  if (fs.existsSync(fromRoot)) return fromRoot;

  const fromDeep = path.join(process.cwd(), '..', '..', 'data');
  if (fs.existsSync(fromDeep)) return fromDeep;

  throw new Error(`Cannot find data/ directory. cwd=${process.cwd()}`);
}

const DATA_DIR = findDataDir();
const TOPICS_DIR = path.join(DATA_DIR, 'topics');

/**
 * Get the topics directory for a given locale.
 * FR reads from data/topics/ (original), EN reads from data/en/topics/ with fallback to FR.
 */
function getLocalizedTopicsDir(locale: Locale = 'fr'): string {
  if (locale === 'fr') return TOPICS_DIR;
  const enDir = path.join(DATA_DIR, 'en', 'topics');
  return enDir;
}

/**
 * Read a file with locale fallback: try EN path first, fallback to FR.
 */
function readLocalizedMarkdownFile(
  topicSlug: string,
  filename: string,
  locale: Locale = 'fr'
): { content: string; frontmatter: Record<string, unknown> } {
  if (locale !== 'fr') {
    const enPath = path.join(getLocalizedTopicsDir(locale), topicSlug, filename);
    if (fs.existsSync(enPath)) {
      const raw = fs.readFileSync(enPath, 'utf-8');
      const { data, content } = matter(raw);
      return { content, frontmatter: data };
    }
  }
  // Fallback to FR
  return readMarkdownFile(path.join(TOPICS_DIR, topicSlug, filename));
}

function readLocalizedJsonFile<T>(
  topicSlug: string,
  filename: string,
  locale: Locale = 'fr',
  fallback: T
): T {
  if (locale !== 'fr') {
    const enPath = path.join(getLocalizedTopicsDir(locale), topicSlug, filename);
    if (fs.existsSync(enPath)) {
      const raw = fs.readFileSync(enPath, 'utf-8');
      return JSON.parse(raw);
    }
  }
  return readJsonFile<T>(path.join(TOPICS_DIR, topicSlug, filename), fallback);
}

// ── Topic slugs (always from FR — canonical) ──

export function getTopicSlugs(): string[] {
  return fs
    .readdirSync(TOPICS_DIR)
    .filter((name) => {
      const fullPath = path.join(TOPICS_DIR, name);
      return fs.statSync(fullPath).isDirectory();
    });
}

// ── Learning path ──

export function getLearningPath(locale: Locale = 'fr'): LearningPath {
  if (locale !== 'fr') {
    const enPath = path.join(DATA_DIR, 'en', 'topics', 'learning-path.json');
    if (fs.existsSync(enPath)) {
      const raw = fs.readFileSync(enPath, 'utf-8');
      return JSON.parse(raw);
    }
  }
  const raw = fs.readFileSync(path.join(TOPICS_DIR, 'learning-path.json'), 'utf-8');
  return JSON.parse(raw);
}

function getTopicEntry(slug: string, locale: Locale = 'fr'): TopicEntry | undefined {
  const lp = getLearningPath(locale);
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

// ── Topic metadata ──

export function getTopicMeta(slug: string, locale: Locale = 'fr'): TopicMeta {
  const { content } = readLocalizedMarkdownFile(slug, '_index.md', locale);
  const entry = getTopicEntry(slug, locale);
  const papers = getPapers(slug);

  return {
    slug,
    title: extractTitle(content, locale) || slug,
    description: extractFirstParagraph(content),
    level: entry?.level ?? 'debutant',
    order: entry?.order ?? 99,
    prerequisites: entry?.prerequisites ?? [],
    paperCount: papers.length,
  };
}

export function getAllTopicsMeta(locale: Locale = 'fr'): TopicMeta[] {
  return getTopicSlugs()
    .map((slug) => getTopicMeta(slug, locale))
    .sort((a, b) => a.order - b.order);
}

// ── Full topic ──

export async function getTopicFull(slug: string, locale: Locale = 'fr'): Promise<TopicFull> {
  const meta = getTopicMeta(slug, locale);

  const indexMd = readLocalizedMarkdownFile(slug, '_index.md', locale);
  const summaryMd = readLocalizedMarkdownFile(slug, 'summary.md', locale);
  const resourcesMd = readLocalizedMarkdownFile(slug, 'resources.md', locale);

  const [indexHtml, summaryHtml, resourcesHtml] = await Promise.all([
    markdownToHtml(indexMd.content, locale),
    markdownToHtml(summaryMd.content, locale),
    markdownToHtml(resourcesMd.content, locale),
  ]);

  return {
    ...meta,
    indexHtml,
    summaryHtml,
    resourcesHtml,
    papers: getPapers(slug),
    paperSummaries: getPaperSummarySlugs(slug, locale),
    quiz: getQuiz(slug, locale),
  };
}

// ── Quiz ──

export function getQuiz(slug: string, locale: Locale = 'fr'): Quiz | null {
  return readLocalizedJsonFile<Quiz | null>(slug, 'quiz.json', locale, null);
}

// ── Papers (always from FR — content is already English) ──

export function getPapers(slug: string): Paper[] {
  return readJsonFile<Paper[]>(path.join(TOPICS_DIR, slug, 'papers.json'), []);
}

// ── Paper summaries ──

export function getPaperSummarySlugs(topicSlug: string, locale: Locale = 'fr'): PaperSummaryMeta[] {
  // Always enumerate from FR (canonical list of paper summaries)
  const dir = path.join(TOPICS_DIR, topicSlug, 'paper-summaries');
  if (!fs.existsSync(dir)) return [];

  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith('.md'))
    .map((f) => {
      const slug = f.replace(/\.md$/, '');
      // Try to read localized version for the title
      const { content } = readLocalizedPaperSummary(topicSlug, slug, locale);
      return {
        slug,
        title: extractTitle(content, locale),
        topicSlug,
      };
    });
}

function readLocalizedPaperSummary(
  topicSlug: string,
  paperSlug: string,
  locale: Locale = 'fr'
): { content: string; frontmatter: Record<string, unknown> } {
  if (locale !== 'fr') {
    const enPath = path.join(getLocalizedTopicsDir(locale), topicSlug, 'paper-summaries', `${paperSlug}.md`);
    if (fs.existsSync(enPath)) {
      const raw = fs.readFileSync(enPath, 'utf-8');
      const { data, content } = matter(raw);
      return { content, frontmatter: data };
    }
  }
  const frPath = path.join(TOPICS_DIR, topicSlug, 'paper-summaries', `${paperSlug}.md`);
  return readMarkdownFile(frPath);
}

export async function getPaperSummaryFull(
  topicSlug: string,
  paperSlug: string,
  locale: Locale = 'fr'
): Promise<PaperSummaryFull> {
  const { content, frontmatter } = readLocalizedPaperSummary(topicSlug, paperSlug, locale);
  const html = await markdownToHtml(content, locale);

  return {
    slug: paperSlug,
    topicSlug,
    title: extractTitle(content, locale),
    html,
    generatedBy: frontmatter.generated_by as string | undefined,
    generatedAt: frontmatter.generated_at as string | undefined,
  };
}

// ── Search index ──

export async function buildSearchIndex(locale: Locale = 'fr'): Promise<SearchItem[]> {
  const items: SearchItem[] = [];
  const metas = getAllTopicsMeta(locale);
  const prefix = `/${locale}`;

  for (const meta of metas) {
    items.push({
      type: 'topic',
      title: meta.title,
      description: meta.description,
      url: `${prefix}/topics/${meta.slug}`,
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
        url: `${prefix}/topics/${meta.slug}/papers`,
        topicSlug: meta.slug,
        topicTitle: meta.title,
        tags: paper.tags,
      });
    }

    const summaries = getPaperSummarySlugs(meta.slug, locale);
    for (const summary of summaries) {
      items.push({
        type: 'paper-summary',
        title: summary.title,
        description: locale === 'en' ? `Simplified summary — ${meta.title}` : `Résumé vulgarisé — ${meta.title}`,
        url: `${prefix}/topics/${meta.slug}/papers/${summary.slug}`,
        topicSlug: meta.slug,
        topicTitle: meta.title,
      });
    }
  }

  return items;
}
