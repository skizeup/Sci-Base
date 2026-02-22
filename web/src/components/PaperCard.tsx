import type { Paper } from '@/lib/types';
import Link from 'next/link';

interface Props {
  paper: Paper;
  topicSlug: string;
  summarySlug?: string;
}

export default function PaperCard({ paper, topicSlug, summarySlug }: Props) {
  return (
    <div className="p-4 rounded-lg bg-white border border-gray-200 hover:border-gray-300 transition">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h3 className="font-medium text-gray-900 text-sm leading-snug">
            {paper.title}
          </h3>
          <p className="text-xs text-gray-500 mt-1">
            {paper.authors.slice(0, 3).join(', ')}
            {paper.authors.length > 3 && ' et al.'} — {paper.year}
          </p>
          {paper.tags && paper.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {paper.tags.map((tag) => (
                <span key={tag} className="px-2 py-0.5 text-xs rounded bg-gray-100 text-gray-600">
                  {tag}
                </span>
              ))}
            </div>
          )}
          {paper.abstract && (
            <p className="text-xs text-gray-500 mt-2 line-clamp-2">{paper.abstract}</p>
          )}
        </div>
      </div>
      <div className="flex items-center gap-3 mt-3 pt-3 border-t border-gray-100">
        {summarySlug && (
          <Link
            href={`/topics/${topicSlug}/papers/${summarySlug}`}
            className="text-xs font-medium text-brand-600 hover:text-brand-800"
          >
            Lire le résumé
          </Link>
        )}
        {paper.url && (
          <a
            href={paper.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-gray-500 hover:text-gray-700"
          >
            Source
          </a>
        )}
        {paper.pdf_url && (
          <a
            href={paper.pdf_url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-gray-500 hover:text-gray-700"
          >
            PDF
          </a>
        )}
      </div>
    </div>
  );
}
