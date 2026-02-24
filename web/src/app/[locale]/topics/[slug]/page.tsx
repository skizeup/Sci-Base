import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getTopicSlugs, getTopicFull, getAllTopicsMeta } from '@/lib/content';
import type { Locale } from '@/lib/i18n/config';
import { getDictionary } from '@/lib/i18n/dictionaries';
import { translate } from '@/lib/i18n/translate';
import Breadcrumb from '@/components/Breadcrumb';
import LevelBadge from '@/components/LevelBadge';
import MarkdownRenderer from '@/components/MarkdownRenderer';
import BookmarkButton from '@/components/BookmarkButton';
import Link from 'next/link';

export function generateStaticParams() {
  return getTopicSlugs().map((slug) => ({ slug }));
}

export function generateMetadata({ params }: { params: { locale: string; slug: string } }): Metadata {
  const locale = params.locale as Locale;
  const topics = getAllTopicsMeta(locale);
  const topic = topics.find((t) => t.slug === params.slug);
  if (!topic) return {};
  return {
    title: topic.title,
    description: topic.description,
    openGraph: {
      url: `/${locale}/topics/${params.slug}`,
    },
    alternates: {
      languages: {
        fr: `/fr/topics/${params.slug}`,
        en: `/en/topics/${params.slug}`,
      },
    },
  };
}

export default async function TopicPage({ params }: { params: { locale: string; slug: string } }) {
  const locale = params.locale as Locale;
  const dict = getDictionary(locale);
  const t = (key: string, p?: Record<string, string | number>) => translate(dict, key, p);

  const slugs = getTopicSlugs();
  if (!slugs.includes(params.slug)) notFound();

  const topic = await getTopicFull(params.slug, locale);
  const allTopics = getAllTopicsMeta(locale);
  const currentIndex = allTopics.findIndex((tp) => tp.slug === params.slug);
  const prevTopic = currentIndex > 0 ? allTopics[currentIndex - 1] : null;
  const nextTopic = currentIndex < allTopics.length - 1 ? allTopics[currentIndex + 1] : null;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Breadcrumb
        items={[
          { label: t('common.home'), href: `/${locale}` },
          { label: t('common.topics'), href: `/${locale}` },
          { label: topic.title },
        ]}
      />

      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">{topic.title}</h1>
          <LevelBadge level={topic.level} locale={locale} />
          <BookmarkButton topicSlug={topic.slug} />
        </div>
        {topic.prerequisites.length > 0 && (
          <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
            <span>{t('topic.prerequisitesLabel')}</span>
            {topic.prerequisites.map((prereq) => {
              const prereqTopic = allTopics.find((tp) => tp.slug === prereq);
              return (
                <Link
                  key={prereq}
                  href={`/${locale}/topics/${prereq}`}
                  className="text-brand-600 dark:text-brand-400 hover:text-brand-800 dark:hover:text-brand-300 transition-colors"
                >
                  {prereqTopic?.title || prereq}
                </Link>
              );
            })}
          </div>
        )}
      </div>

      <section className="mb-12">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4 pb-2 border-b border-gray-200 dark:border-gray-700">
          {t('topic.overview')}
        </h2>
        <MarkdownRenderer html={topic.indexHtml} />
      </section>

      {topic.summaryHtml && (
        <section className="mb-12">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4 pb-2 border-b border-gray-200 dark:border-gray-700">
            {t('topic.summary')}
          </h2>
          <MarkdownRenderer html={topic.summaryHtml} />
        </section>
      )}

      {topic.quiz && (
        <section className="mb-12">
          <Link
            href={`/${locale}/topics/${topic.slug}/quiz`}
            className="block p-6 rounded-xl border-2 border-dashed border-brand-300 dark:border-brand-700 hover:border-brand-500 dark:hover:border-brand-500 bg-brand-50/50 dark:bg-brand-900/10 hover:bg-brand-50 dark:hover:bg-brand-900/20 transition-all group"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-brand-700 dark:text-brand-300 group-hover:text-brand-800 dark:group-hover:text-brand-200">
                  {t('topic.testKnowledge')}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {t('topic.questionsToValidate', { count: topic.quiz.questions.length })}
                </p>
              </div>
              <svg className="w-6 h-6 text-brand-500 dark:text-brand-400 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </Link>
        </section>
      )}

      <section className="mb-12">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4 pb-2 border-b border-gray-200 dark:border-gray-700">
          {t('topic.papers', { count: topic.papers.length })}
        </h2>
        <div className="space-y-3">
          {topic.papers.slice(0, 5).map((paper, i) => (
            <div key={i} className="flex items-start justify-between gap-4 p-4 rounded-lg bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700">
              <div className="min-w-0">
                <p className="font-medium text-gray-900 dark:text-gray-100 text-sm">{paper.title}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {paper.authors.slice(0, 3).join(', ')}
                  {paper.authors.length > 3 && ' et al.'} — {paper.year}
                </p>
              </div>
              {paper.url && (
                <a
                  href={paper.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="shrink-0 text-xs text-brand-600 dark:text-brand-400 hover:text-brand-800 dark:hover:text-brand-300"
                >
                  {t('topic.link')}
                </a>
              )}
            </div>
          ))}
        </div>
        {topic.papers.length > 5 && (
          <Link
            href={`/${locale}/topics/${topic.slug}/papers`}
            className="inline-block mt-4 text-sm text-brand-600 dark:text-brand-400 hover:text-brand-800 dark:hover:text-brand-300 font-medium"
          >
            {t('topic.viewAllPapers', { count: topic.papers.length })}
          </Link>
        )}
        {topic.paperSummaries.length > 0 && (
          <Link
            href={`/${locale}/topics/${topic.slug}/papers`}
            className="inline-block mt-2 ml-4 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
          >
            {t('topic.summariesAvailable', { count: topic.paperSummaries.length })}
          </Link>
        )}
      </section>

      {topic.resourcesHtml && (
        <section className="mb-12">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4 pb-2 border-b border-gray-200 dark:border-gray-700">
            {t('topic.resources')}
          </h2>
          <MarkdownRenderer html={topic.resourcesHtml} />
        </section>
      )}

      <nav className="flex items-center justify-between pt-8 border-t border-gray-200 dark:border-gray-700">
        {prevTopic ? (
          <Link href={`/${locale}/topics/${prevTopic.slug}`} className="group flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 hover:text-brand-600 dark:hover:text-brand-400">
            <svg className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            {prevTopic.title}
          </Link>
        ) : <div />}
        {nextTopic ? (
          <Link href={`/${locale}/topics/${nextTopic.slug}`} className="group flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 hover:text-brand-600 dark:hover:text-brand-400">
            {nextTopic.title}
            <svg className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        ) : <div />}
      </nav>
    </div>
  );
}
