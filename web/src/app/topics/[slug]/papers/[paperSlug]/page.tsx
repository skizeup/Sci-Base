import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getTopicSlugs, getTopicMeta, getPaperSummarySlugs, getPaperSummaryFull } from '@/lib/content';
import Breadcrumb from '@/components/Breadcrumb';
import MarkdownRenderer from '@/components/MarkdownRenderer';
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

export async function generateMetadata({ params }: { params: { slug: string; paperSlug: string } }): Promise<Metadata> {
  const summary = await getPaperSummaryFull(params.slug, params.paperSlug);
  const meta = getTopicMeta(params.slug);
  return {
    title: `${summary.title} — ${meta.title}`,
    description: `Résumé vulgarisé de ${summary.title}`,
  };
}

export default async function PaperSummaryPage({ params }: { params: { slug: string; paperSlug: string } }) {
  const topicSlugs = getTopicSlugs();
  if (!topicSlugs.includes(params.slug)) notFound();

  const summaries = getPaperSummarySlugs(params.slug);
  const currentIndex = summaries.findIndex((s) => s.slug === params.paperSlug);
  if (currentIndex === -1) notFound();

  const summary = await getPaperSummaryFull(params.slug, params.paperSlug);
  const meta = getTopicMeta(params.slug);

  const prevSummary = currentIndex > 0 ? summaries[currentIndex - 1] : null;
  const nextSummary = currentIndex < summaries.length - 1 ? summaries[currentIndex + 1] : null;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Breadcrumb
        items={[
          { label: 'Accueil', href: '/' },
          { label: meta.title, href: `/topics/${params.slug}` },
          { label: 'Papers', href: `/topics/${params.slug}/papers` },
          { label: summary.title },
        ]}
      />

      {/* Meta info */}
      {summary.generatedBy && (
        <p className="text-xs text-gray-400 mb-6">
          Généré par {summary.generatedBy}
          {summary.generatedAt && ` le ${new Date(summary.generatedAt).toLocaleDateString('fr-FR')}`}
        </p>
      )}

      {/* Content */}
      <MarkdownRenderer html={summary.html} />

      {/* Back link */}
      <div className="mt-8 pt-4 border-t border-gray-200">
        <Link
          href={`/topics/${params.slug}/papers`}
          className="text-sm text-brand-600 hover:text-brand-800"
        >
          ← Retour aux papers de {meta.title}
        </Link>
      </div>

      {/* Prev/Next navigation */}
      <nav className="flex items-center justify-between pt-6">
        {prevSummary ? (
          <Link
            href={`/topics/${params.slug}/papers/${prevSummary.slug}`}
            className="group flex items-center gap-2 text-sm text-gray-500 hover:text-brand-600 max-w-[45%]"
          >
            <svg className="w-4 h-4 shrink-0 group-hover:-translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span className="truncate">{prevSummary.title}</span>
          </Link>
        ) : <div />}
        {nextSummary ? (
          <Link
            href={`/topics/${params.slug}/papers/${nextSummary.slug}`}
            className="group flex items-center gap-2 text-sm text-gray-500 hover:text-brand-600 max-w-[45%] text-right"
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
