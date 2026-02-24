import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getTopicSlugs, getTopicMeta, getPaperSummarySlugs, getPaperSummaryFull } from '@/lib/content';
import type { Locale } from '@/lib/i18n/config';
import { getDictionary } from '@/lib/i18n/dictionaries';
import { translate } from '@/lib/i18n/translate';
import Breadcrumb from '@/components/Breadcrumb';
import MarkdownRenderer from '@/components/MarkdownRenderer';
import BookmarkButton from '@/components/BookmarkButton';
import Link from 'next/link';

export function generateStaticParams() {
  const topicSlugs = getTopicSlugs();
  const params: { slug: string; paperSlug: string }[] = [];
  for (const slug of topicSlugs) {
    const summaries = getPaperSummarySlugs(slug);
    for (const summary of summaries) {
      params.push({ slug, paperSlug: summary.slug });
    }
  }
  return params;
}

export async function generateMetadata({ params }: { params: { locale: string; slug: string; paperSlug: string } }): Promise<Metadata> {
  const locale = params.locale as Locale;
  const dict = getDictionary(locale);
  const t = (key: string, p?: Record<string, string | number>) => translate(dict, key, p);
  const summary = await getPaperSummaryFull(params.slug, params.paperSlug, locale);
  const meta = getTopicMeta(params.slug, locale);
  return {
    title: `${summary.title} — ${meta.title}`,
    description: t('meta.paperSummaryDescription', { title: summary.title }),
    openGraph: {
      url: `/${locale}/topics/${params.slug}/papers/${params.paperSlug}`,
    },
    alternates: {
      languages: {
        fr: `/fr/topics/${params.slug}/papers/${params.paperSlug}`,
        en: `/en/topics/${params.slug}/papers/${params.paperSlug}`,
      },
    },
  };
}

export default async function PaperSummaryPage({ params }: { params: { locale: string; slug: string; paperSlug: string } }) {
  const locale = params.locale as Locale;
  const dict = getDictionary(locale);
  const t = (key: string, p?: Record<string, string | number>) => translate(dict, key, p);

  const topicSlugs = getTopicSlugs();
  if (!topicSlugs.includes(params.slug)) notFound();

  const summaries = getPaperSummarySlugs(params.slug);
  const currentIndex = summaries.findIndex((s) => s.slug === params.paperSlug);
  if (currentIndex === -1) notFound();

  const summary = await getPaperSummaryFull(params.slug, params.paperSlug, locale);
  const meta = getTopicMeta(params.slug, locale);

  const prevSummary = currentIndex > 0 ? summaries[currentIndex - 1] : null;
  const nextSummary = currentIndex < summaries.length - 1 ? summaries[currentIndex + 1] : null;

  const generatedDate = summary.generatedAt
    ? new Date(summary.generatedAt).toLocaleDateString(locale === 'en' ? 'en-US' : 'fr-FR')
    : null;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Breadcrumb
        items={[
          { label: t('common.home'), href: `/${locale}` },
          { label: meta.title, href: `/${locale}/topics/${params.slug}` },
          { label: 'Papers', href: `/${locale}/topics/${params.slug}/papers` },
          { label: summary.title },
        ]}
      />

      <div className="flex items-center gap-4 mb-4">
        <BookmarkButton topicSlug={params.slug} paperSlug={params.paperSlug} />
      </div>

      {summary.generatedBy && (
        <p className="text-xs text-gray-400 dark:text-gray-500 mb-6">
          {t('papers.generatedBy', { provider: summary.generatedBy })}
          {generatedDate && t('papers.generatedOn', { date: generatedDate })}
        </p>
      )}

      <MarkdownRenderer html={summary.html} />

      <div className="mt-8 pt-4 border-t border-gray-200 dark:border-gray-700">
        <Link
          href={`/${locale}/topics/${params.slug}/papers`}
          className="text-sm text-brand-600 dark:text-brand-400 hover:text-brand-800 dark:hover:text-brand-300"
        >
          {t('papers.backToPapers', { title: meta.title })}
        </Link>
      </div>

      <nav className="flex items-center justify-between pt-6">
        {prevSummary ? (
          <Link
            href={`/${locale}/topics/${params.slug}/papers/${prevSummary.slug}`}
            className="group flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 hover:text-brand-600 dark:hover:text-brand-400 max-w-[45%]"
          >
            <svg className="w-4 h-4 shrink-0 group-hover:-translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span className="truncate">{prevSummary.title}</span>
          </Link>
        ) : <div />}
        {nextSummary ? (
          <Link
            href={`/${locale}/topics/${params.slug}/papers/${nextSummary.slug}`}
            className="group flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 hover:text-brand-600 dark:hover:text-brand-400 max-w-[45%] text-right"
          >
            <span className="truncate">{nextSummary.title}</span>
            <svg className="w-4 h-4 shrink-0 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        ) : <div />}
      </nav>
    </div>
  );
}
