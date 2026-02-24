'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/contexts/AuthContext';
import { useBookmarks } from '@/hooks/useBookmarks';
import { useProgress } from '@/hooks/useProgress';
import { useTranslation, useLocale } from '@/contexts/LocaleContext';
import { supabase } from '@/lib/supabase';

interface QuizScoreEntry {
  topic_slug: string;
  score: number;
  total: number;
  completed_at: string;
}

export default function ProfilPage() {
  const { user, loading: authLoading } = useAuth();
  const { bookmarks } = useBookmarks();
  const { completed } = useProgress();
  const { t } = useTranslation();
  const locale = useLocale();
  const [quizScores, setQuizScores] = useState<QuizScoreEntry[]>([]);

  useEffect(() => {
    if (!user) return;
    supabase
      .from('quiz_scores')
      .select('topic_slug, score, total, completed_at')
      .eq('user_id', user.id)
      .order('completed_at', { ascending: false })
      .then(({ data }) => {
        setQuizScores((data as QuizScoreEntry[]) ?? []);
      });
  }, [user]);

  const bestScores = quizScores.reduce<Record<string, QuizScoreEntry>>((acc, entry) => {
    if (!acc[entry.topic_slug] || entry.score > acc[entry.topic_slug].score) {
      acc[entry.topic_slug] = entry;
    }
    return acc;
  }, {});

  if (authLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-48 bg-gray-200 dark:bg-gray-700 rounded" />
          <div className="h-4 w-64 bg-gray-200 dark:bg-gray-700 rounded" />
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <svg className="w-16 h-16 mx-auto text-gray-300 dark:text-gray-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">{t('profil.loginRequired')}</h1>
        <p className="text-gray-500 dark:text-gray-400 mb-6">
          {t('profil.loginDescription')}
        </p>
        <Link
          href={`/${locale}`}
          className="text-brand-600 dark:text-brand-400 hover:underline font-medium"
        >
          {t('profil.backHome')}
        </Link>
      </div>
    );
  }

  const displayName = user.user_metadata?.full_name
    ?? user.user_metadata?.name
    ?? user.email?.split('@')[0]
    ?? 'User';
  const avatarUrl = user.user_metadata?.avatar_url;
  const memberSince = new Date(user.created_at).toLocaleDateString(locale === 'en' ? 'en-US' : 'fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const topicBookmarks = bookmarks.filter(b => b.item_type === 'topic');
  const paperBookmarks = bookmarks.filter(b => b.item_type === 'paper');

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center gap-4 mb-8">
        {avatarUrl ? (
          <Image src={avatarUrl} alt={displayName} width={64} height={64} className="w-16 h-16 rounded-full object-cover" />
        ) : (
          <div className="w-16 h-16 rounded-full bg-brand-100 dark:bg-brand-900/50 flex items-center justify-center text-2xl font-bold text-brand-700 dark:text-brand-300">
            {displayName.slice(0, 2).toUpperCase()}
          </div>
        )}
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{displayName}</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">{user.email}</p>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{t('profil.memberSince', { date: memberSince })}</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-10">
        <div className="p-4 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 text-center">
          <div className="text-2xl font-bold text-emerald-700 dark:text-emerald-400">{completed.size}</div>
          <div className="text-xs text-emerald-600 dark:text-emerald-500 mt-1">{t('profil.topicsCompleted')}</div>
        </div>
        <div className="p-4 rounded-lg bg-brand-50 dark:bg-brand-900/20 border border-brand-200 dark:border-brand-800 text-center">
          <div className="text-2xl font-bold text-brand-700 dark:text-brand-400">{Object.keys(bestScores).length}</div>
          <div className="text-xs text-brand-600 dark:text-brand-500 mt-1">{t('profil.quizPassed')}</div>
        </div>
        <div className="p-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-center">
          <div className="text-2xl font-bold text-red-600 dark:text-red-400">{bookmarks.length}</div>
          <div className="text-xs text-red-500 dark:text-red-500 mt-1">{t('profil.favorites')}</div>
        </div>
      </div>

      {Object.keys(bestScores).length > 0 && (
        <section className="mb-10">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 pb-2 border-b border-gray-200 dark:border-gray-700">
            {t('profil.bestScores')}
          </h2>
          <div className="space-y-2">
            {Object.entries(bestScores).map(([slug, entry]) => (
              <Link
                key={slug}
                href={`/${locale}/topics/${slug}/quiz`}
                className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700 hover:border-brand-300 dark:hover:border-brand-600 transition-colors"
              >
                <span className="text-sm font-medium text-gray-900 dark:text-gray-100 capitalize">
                  {slug.replace(/-/g, ' ')}
                </span>
                <span className="text-sm font-semibold text-brand-600 dark:text-brand-400">
                  {entry.score}{entry.total > 0 ? `/${entry.total}` : ''}
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {topicBookmarks.length > 0 && (
        <section className="mb-10">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 pb-2 border-b border-gray-200 dark:border-gray-700">
            {t('profil.favoriteTopics')}
          </h2>
          <div className="space-y-2">
            {topicBookmarks.map((b) => (
              <Link
                key={b.topic_slug}
                href={`/${locale}/topics/${b.topic_slug}`}
                className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700 hover:border-brand-300 dark:hover:border-brand-600 transition-colors"
              >
                <span className="text-sm font-medium text-gray-900 dark:text-gray-100 capitalize">
                  {b.topic_slug.replace(/-/g, ' ')}
                </span>
                <svg className="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </Link>
            ))}
          </div>
        </section>
      )}

      {paperBookmarks.length > 0 && (
        <section className="mb-10">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 pb-2 border-b border-gray-200 dark:border-gray-700">
            {t('profil.favoritePapers')}
          </h2>
          <div className="space-y-2">
            {paperBookmarks.map((b) => (
              <Link
                key={`${b.topic_slug}-${b.paper_slug}`}
                href={`/${locale}/topics/${b.topic_slug}/papers/${b.paper_slug}`}
                className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700 hover:border-brand-300 dark:hover:border-brand-600 transition-colors"
              >
                <div>
                  <span className="text-sm font-medium text-gray-900 dark:text-gray-100 capitalize">
                    {(b.paper_slug ?? '').replace(/-/g, ' ')}
                  </span>
                  <span className="text-xs text-gray-400 dark:text-gray-500 ml-2">
                    {b.topic_slug.replace(/-/g, ' ')}
                  </span>
                </div>
                <svg className="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </Link>
            ))}
          </div>
        </section>
      )}

      {bookmarks.length === 0 && Object.keys(bestScores).length === 0 && completed.size === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500 dark:text-gray-400 mb-4">
            {t('profil.emptyState')}
          </p>
          <Link
            href={`/${locale}`}
            className="inline-block px-6 py-2.5 bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition-colors font-medium"
          >
            {t('profil.exploreTopics')}
          </Link>
        </div>
      )}
    </div>
  );
}
