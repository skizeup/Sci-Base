import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getTopicSlugs, getTopicMeta, getPapers, getPaperSummarySlugs } from '@/lib/content';
import type { Locale } from '@/lib/i18n/config';
import { getDictionary } from '@/lib/i18n/dictionaries';
import { translate } from '@/lib/i18n/translate';
import Breadcrumb from '@/components/Breadcrumb';
import PaperCard from '@/components/PaperCard';

export function generateStaticParams() {
  return getTopicSlugs().map((slug) => ({ slug }));
}

export function generateMetadata({ params }: { params: { locale: string; slug: string } }): Metadata {
  const locale = params.locale as Locale;
  const meta = getTopicMeta(params.slug, locale);
  const dict = getDictionary(locale);
  const t = (key: string, p?: Record<string, string | number>) => translate(dict, key, p);
  return {
    title: t('papers.title', { title: meta.title }),
    description: t('papers.count', { papers: meta.paperCount, summaries: 0 }),
    openGraph: {
      url: `/${locale}/topics/${params.slug}/papers`,
    },
    alternates: {
      languages: {
        fr: `/fr/topics/${params.slug}/papers`,
        en: `/en/topics/${params.slug}/papers`,
      },
    },
  };
}

export default function PapersPage({ params }: { params: { locale: string; slug: string } }) {
  const locale = params.locale as Locale;
  const dict = getDictionary(locale);
  const t = (key: string, p?: Record<string, string | number>) => translate(dict, key, p);

  const slugs = getTopicSlugs();
  if (!slugs.includes(params.slug)) notFound();

  const meta = getTopicMeta(params.slug, locale);
  const papers = getPapers(params.slug);
  const summaries = getPaperSummarySlugs(params.slug);

  function findSummarySlug(paperTitle: string): string | undefined {
    const normalized = paperTitle
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
    return summaries.find((s) => {
      return normalized.includes(s.slug) || s.slug.includes(normalized.slice(0, 30));
    })?.slug;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Breadcrumb
        items={[
          { label: t('common.home'), href: `/${locale}` },
          { label: meta.title, href: `/${locale}/topics/${meta.slug}` },
          { label: 'Papers' },
        ]}
      />

      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          {t('papers.title', { title: meta.title })}
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {t('papers.count', { papers: papers.length, summaries: summaries.length })}
        </p>
      </div>

      <div className="space-y-4">
        {papers.map((paper, i) => (
          <PaperCard
            key={i}
            paper={paper}
            topicSlug={params.slug}
            summarySlug={findSummarySlug(paper.title)}
            locale={locale}
          />
        ))}
      </div>
    </div>
  );
}
