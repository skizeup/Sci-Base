import Link from 'next/link';
import type { TopicMeta } from '@/lib/types';
import LevelBadge from './LevelBadge';

export default function TopicCard({ topic }: { topic: TopicMeta }) {
  return (
    <Link
      href={`/topics/${topic.slug}`}
      className="group block rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition hover:shadow-md hover:border-brand-300"
    >
      <div className="flex items-start justify-between gap-2 mb-3">
        <h3 className="text-lg font-semibold text-gray-900 group-hover:text-brand-600 transition-colors">
          {topic.title}
        </h3>
        <LevelBadge level={topic.level} />
      </div>
      <p className="text-sm text-gray-600 line-clamp-3 mb-4">
        {topic.description}
      </p>
      <div className="flex items-center gap-4 text-xs text-gray-500">
        <span className="flex items-center gap-1">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          {topic.paperCount} papers
        </span>
        {topic.prerequisites.length > 0 && (
          <span className="flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
            {topic.prerequisites.length} prérequis
          </span>
        )}
      </div>
    </Link>
  );
}
