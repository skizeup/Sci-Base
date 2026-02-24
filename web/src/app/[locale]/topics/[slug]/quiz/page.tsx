import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getTopicSlugs, getTopicMeta, getQuiz } from '@/lib/content';
import type { Locale } from '@/lib/i18n/config';
import { getDictionary } from '@/lib/i18n/dictionaries';
import { translate } from '@/lib/i18n/translate';
import Breadcrumb from '@/components/Breadcrumb';
import QuizComponent from '@/components/Quiz';
import Link from 'next/link';

export function generateStaticParams() {
  return getTopicSlugs()
    .filter((slug) => getQuiz(slug) !== null)
    .map((slug) => ({ slug }));
}

export function generateMetadata({ params }: { params: { locale: string; slug: string } }): Metadata {
  const locale = params.locale as Locale;
  const dict = getDictionary(locale);
  const t = (key: string, p?: Record<string, string | number>) => translate(dict, key, p);
  const meta = getTopicMeta(params.slug, locale);
  return {
    title: t('quiz.title', { title: meta.title }),
    description: t('meta.quizDescription', { title: meta.title }),
    openGraph: {
      url: `/${locale}/topics/${params.slug}/quiz`,
    },
    alternates: {
      languages: {
        fr: `/fr/topics/${params.slug}/quiz`,
        en: `/en/topics/${params.slug}/quiz`,
      },
    },
  };
}

export default function QuizPage({ params }: { params: { locale: string; slug: string } }) {
  const locale = params.locale as Locale;
  const dict = getDictionary(locale);
  const t = (key: string, p?: Record<string, string | number>) => translate(dict, key, p);

  const slugs = getTopicSlugs();
  if (!slugs.includes(params.slug)) notFound();

  const quiz = getQuiz(params.slug, locale);
  if (!quiz) notFound();

  const meta = getTopicMeta(params.slug, locale);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Breadcrumb
        items={[
          { label: t('common.home'), href: `/${locale}` },
          { label: meta.title, href: `/${locale}/topics/${params.slug}` },
          { label: 'Quiz' },
        ]}
      />

      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          {t('quiz.title', { title: meta.title })}
        </h1>
        <p className="text-gray-500 dark:text-gray-400">
          {t('quiz.questionsCount', { count: quiz.questions.length })}
        </p>
      </div>

      <QuizComponent quiz={quiz} topicSlug={params.slug} />

      <div className="mt-12 pt-6 border-t border-gray-200 dark:border-gray-700 text-center">
        <Link
          href={`/${locale}/topics/${params.slug}`}
          className="text-sm text-brand-600 dark:text-brand-400 hover:text-brand-800 dark:hover:text-brand-300"
        >
          {t('quiz.backToTopic', { title: meta.title })}
        </Link>
      </div>
    </div>
  );
}
