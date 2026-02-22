export interface Paper {
  title: string;
  authors: string[];
  year: number;
  abstract?: string;
  url: string;
  pdf_url?: string;
  local_pdf?: string;
  source?: 'arxiv' | 'semantic_scholar' | 'pubmed' | 'papers_with_code' | 'hal' | 'core' | 'dblp' | 'manual';
  tags?: string[];
  doi?: string;
}

export type Level = 'debutant' | 'intermediaire' | 'avance';

export interface TopicEntry {
  topic_id: string;
  level: Level;
  order: number;
  prerequisites: string[];
}

export interface LearningPath {
  version: string;
  title: string;
  description?: string;
  paths: {
    id: string;
    title: string;
    description?: string;
    topics: TopicEntry[];
  }[];
}

export interface TopicMeta {
  slug: string;
  title: string;
  description: string;
  level: Level;
  order: number;
  prerequisites: string[];
  paperCount: number;
}

export interface TopicFull extends TopicMeta {
  indexHtml: string;
  summaryHtml: string;
  resourcesHtml: string;
  papers: Paper[];
  paperSummaries: PaperSummaryMeta[];
}

export interface PaperSummaryMeta {
  slug: string;
  title: string;
  topicSlug: string;
}

export interface PaperSummaryFull extends PaperSummaryMeta {
  html: string;
  generatedBy?: string;
  generatedAt?: string;
}

export interface SearchItem {
  type: 'topic' | 'paper' | 'paper-summary';
  title: string;
  description: string;
  url: string;
  topicSlug: string;
  topicTitle: string;
  level?: Level;
  tags?: string[];
}
