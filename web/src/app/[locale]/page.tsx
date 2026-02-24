import type { Metadata } from 'next';
import { getAllTopicsMeta } from '@/lib/content';
import type { Locale } from '@/lib/i18n/config';
import { getDictionary } from '@/lib/i18n/dictionaries';
import { translate } from '@/lib/i18n/translate';
import TopicCard from '@/components/TopicCard';
import Link from 'next/link';

export function generateMetadata({ params }: { params: { locale: string } }): Metadata {
  const locale = params.locale as Locale;
  const dict = getDictionary(locale);
  return {
    title: dict.meta.siteTitle,
    description: dict.meta.siteDescription,
    openGraph: {
      url: `/${locale}`,
    },
    alternates: {
      languages: { fr: '/fr', en: '/en' },
    },
  };
}

export default function HomePage({ params }: { params: { locale: string } }) {
  const locale = params.locale as Locale;
  const dict = getDictionary(locale);
  const t = (key: string, p?: Record<string, string | number>) => translate(dict, key, p);

  const topics = getAllTopicsMeta(locale);
  const totalPapers = topics.reduce((sum, tp) => sum + tp.paperCount, 0);

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-b from-brand-50 dark:from-gray-900 to-white dark:to-gray-950 py-16 sm:py-24">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            {locale === 'fr' ? (
              <>Apprendre l&apos;IA et le <span className="text-brand-600 dark:text-brand-400">Machine Learning</span></>
            ) : (
              <>Learn AI and <span className="text-brand-600 dark:text-brand-400">Machine Learning</span></>
            )}
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-8">
            {t('home.subtitle')}
          </p>
          <div className="flex items-center justify-center gap-6 text-sm text-gray-500 dark:text-gray-400 mb-8">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-brand-500" />
              {topics.length} topics
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              {totalPapers} papers
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-purple-500" />
              {t('home.structuredPath')}
            </span>
          </div>
          <div className="flex items-center justify-center gap-3">
            <Link
              href={`/${locale}/parcours`}
              className="inline-flex items-center px-5 py-2.5 rounded-lg bg-brand-600 text-white font-medium text-sm hover:bg-brand-700 transition-colors"
            >
              {t('home.viewPath')}
            </Link>
            <Link
              href={`/${locale}/recherche`}
              className="inline-flex items-center px-5 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium text-sm hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              {t('home.searchAction')}
            </Link>
          </div>
        </div>
      </section>

      {/* Topic grid */}
      <section className="max-w-6xl mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-8">
          {t('home.allTopics')}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {topics.map((topic) => (
            <TopicCard key={topic.slug} topic={topic} locale={locale} />
          ))}
        </div>
      </section>
    </div>
  );
}
