import type { Paper } from '@/lib/types';
import type { Locale } from '@/lib/i18n/config';
import { getDictionary } from '@/lib/i18n/dictionaries';
import { translate } from '@/lib/i18n/translate';
import Link from 'next/link';

interface Props {
  paper: Paper;
  topicSlug: string;
  summarySlug?: string;
  locale?: Locale;
}

export default function PaperCard({ paper, topicSlug, summarySlug, locale = 'fr' }: Props) {
  const dict = getDictionary(locale);
  const t = (key: string, p?: Record<string, string | number>) => translate(dict, key, p);

  return (
    <div className="p-4 rounded-lg bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 transition">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h3 className="font-medium text-gray-900 dark:text-gray-100 text-sm leading-snug">
            {paper.title}
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            {paper.authors.slice(0, 3).join(', ')}
            {paper.authors.length > 3 && ' et al.'} — {paper.year}
          </p>
          {paper.tags && paper.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {paper.tags.map((tag) => (
                <span key={tag} className="px-2 py-0.5 text-xs rounded bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300">
                  {tag}
                </span>
              ))}
            </div>
          )}
          {paper.abstract && (
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 line-clamp-2">{paper.abstract}</p>
          )}
        </div>
      </div>
      <div className="flex items-center gap-3 mt-3 pt-3 border-t border-gray-100 dark:border-gray-800">
        {summarySlug && (
          <Link
            href={`/${locale}/topics/${topicSlug}/papers/${summarySlug}`}
            className="text-xs font-medium text-brand-600 dark:text-brand-400 hover:text-brand-800 dark:hover:text-brand-300"
          >
            {t('papers.readSummary')}
          </Link>
        )}
        {paper.url && (
          <a
            href={paper.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
          >
            {t('papers.source')}
          </a>
        )}
        {paper.pdf_url && (
          <a
            href={paper.pdf_url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
          >
            {t('papers.pdf')}
          </a>
        )}
      </div>
    </div>
  );
}
