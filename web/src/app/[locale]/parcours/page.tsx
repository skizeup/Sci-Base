import type { Metadata } from 'next';
import { getAllTopicsMeta } from '@/lib/content';
import type { Locale } from '@/lib/i18n/config';
import { getDictionary } from '@/lib/i18n/dictionaries';
import { translate } from '@/lib/i18n/translate';
import Breadcrumb from '@/components/Breadcrumb';
import LearningPath from '@/components/LearningPath';

export function generateMetadata({ params }: { params: { locale: string } }): Metadata {
  const locale = params.locale as Locale;
  const dict = getDictionary(locale);
  return {
    title: dict.meta.parcoursTitle,
    description: dict.meta.parcoursDescription,
    alternates: {
      languages: { fr: '/fr/parcours', en: '/en/parcours' },
    },
  };
}

export default function ParcoursPage({ params }: { params: { locale: string } }) {
  const locale = params.locale as Locale;
  const dict = getDictionary(locale);
  const t = (key: string, p?: Record<string, string | number>) => translate(dict, key, p);

  const topics = getAllTopicsMeta(locale);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <Breadcrumb
        items={[
          { label: t('common.home'), href: `/${locale}` },
          { label: t('common.learningPath') },
        ]}
      />

      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          {t('parcours.title')}
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          {t('parcours.description')}
        </p>
      </div>

      <LearningPath topics={topics} locale={locale} />
    </div>
  );
}
