import type { Metadata } from 'next';
import type { Locale } from '@/lib/i18n/config';
import { getDictionary } from '@/lib/i18n/dictionaries';
import { translate } from '@/lib/i18n/translate';
import Breadcrumb from '@/components/Breadcrumb';
import SearchBar from '@/components/SearchBar';

export function generateMetadata({ params }: { params: { locale: string } }): Metadata {
  const locale = params.locale as Locale;
  const dict = getDictionary(locale);
  return {
    title: dict.meta.searchTitle,
    description: dict.meta.searchDescription,
    alternates: {
      languages: { fr: '/fr/recherche', en: '/en/recherche' },
    },
  };
}

export default function RecherchePage({ params }: { params: { locale: string } }) {
  const locale = params.locale as Locale;
  const dict = getDictionary(locale);
  const t = (key: string, p?: Record<string, string | number>) => translate(dict, key, p);

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <Breadcrumb
        items={[
          { label: t('common.home'), href: `/${locale}` },
          { label: t('search.title') },
        ]}
      />

      <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">{t('search.title')}</h1>

      <SearchBar fullPage />
    </div>
  );
}
