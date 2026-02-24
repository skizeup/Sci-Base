'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useBookmarks } from '@/hooks/useBookmarks';
import { useTranslation } from '@/contexts/LocaleContext';

interface BookmarkButtonProps {
  topicSlug: string;
  paperSlug?: string | null;
  className?: string;
}

export default function BookmarkButton({ topicSlug, paperSlug, className = '' }: BookmarkButtonProps) {
  const { user } = useAuth();
  const { isBookmarked, toggleBookmark } = useBookmarks();
  const { t } = useTranslation();

  if (!user) return null;

  const active = isBookmarked(topicSlug, paperSlug);

  return (
    <button
      onClick={() => toggleBookmark(topicSlug, paperSlug)}
      className={`inline-flex items-center gap-1.5 text-sm transition-colors ${
        active
          ? 'text-red-500 dark:text-red-400'
          : 'text-gray-400 dark:text-gray-500 hover:text-red-500 dark:hover:text-red-400'
      } ${className}`}
      title={active ? t('bookmark.removeTitle') : t('bookmark.addTitle')}
    >
      <svg
        className="w-5 h-5"
        fill={active ? 'currentColor' : 'none'}
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
        />
      </svg>
      {active ? t('bookmark.remove') : t('bookmark.add')}
    </button>
  );
}
