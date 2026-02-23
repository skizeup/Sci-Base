import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getTopicSlugs, getTopicMeta, getPapers, getPaperSummarySlugs } from '@/lib/content';
import Breadcrumb from '@/components/Breadcrumb';
import PaperCard from '@/components/PaperCard';

export function generateStaticParams() {
  return getTopicSlugs().map((slug) => ({ slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const meta = getTopicMeta(params.slug);
  return {
    title: `Papers — ${meta.title}`,
    description: `${meta.paperCount} papers de recherche en ${meta.title}`,
  };
}

export default function PapersPage({ params }: { params: { slug: string } }) {
  const slugs = getTopicSlugs();
  if (!slugs.includes(params.slug)) notFound();

  const meta = getTopicMeta(params.slug);
  const papers = getPapers(params.slug);
  const summaries = getPaperSummarySlugs(params.slug);

  // Try to match papers to their summaries by slug similarity
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
          { label: 'Accueil', href: '/' },
          { label: meta.title, href: `/topics/${meta.slug}` },
          { label: 'Papers' },
        ]}
      />

      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          Papers — {meta.title}
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {papers.length} papers · {summaries.length} résumés vulgarisés disponibles
        </p>
      </div>

      <div className="space-y-4">
        {papers.map((paper, i) => (
          <PaperCard
            key={i}
            paper={paper}
            topicSlug={params.slug}
            summarySlug={findSummarySlug(paper.title)}
          />
        ))}
      </div>
    </div>
  );
}
