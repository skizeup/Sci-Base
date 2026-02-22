import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getTopicSlugs, getTopicFull, getAllTopicsMeta } from '@/lib/content';
import Breadcrumb from '@/components/Breadcrumb';
import LevelBadge from '@/components/LevelBadge';
import MarkdownRenderer from '@/components/MarkdownRenderer';
import Link from 'next/link';

export function generateStaticParams() {
  return getTopicSlugs().map((slug) => ({ slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const topics = getAllTopicsMeta();
  const topic = topics.find((t) => t.slug === params.slug);
  if (!topic) return {};
  return {
    title: topic.title,
    description: topic.description,
  };
}

export default async function TopicPage({ params }: { params: { slug: string } }) {
  const slugs = getTopicSlugs();
  if (!slugs.includes(params.slug)) notFound();

  const topic = await getTopicFull(params.slug);
  const allTopics = getAllTopicsMeta();
  const currentIndex = allTopics.findIndex((t) => t.slug === params.slug);
  const prevTopic = currentIndex > 0 ? allTopics[currentIndex - 1] : null;
  const nextTopic = currentIndex < allTopics.length - 1 ? allTopics[currentIndex + 1] : null;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Breadcrumb
        items={[
          { label: 'Accueil', href: '/' },
          { label: 'Topics', href: '/' },
          { label: topic.title },
        ]}
      />

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-3xl font-bold text-gray-900">{topic.title}</h1>
          <LevelBadge level={topic.level} />
        </div>
        {topic.prerequisites.length > 0 && (
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <span>Prérequis :</span>
            {topic.prerequisites.map((prereq) => {
              const prereqTopic = allTopics.find((t) => t.slug === prereq);
              return (
                <Link
                  key={prereq}
                  href={`/topics/${prereq}`}
                  className="text-brand-600 hover:text-brand-800 transition-colors"
                >
                  {prereqTopic?.title || prereq}
                </Link>
              );
            })}
          </div>
        )}
      </div>

      {/* Vue d'ensemble */}
      <section className="mb-12">
        <h2 className="text-xl font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">
          Vue d&apos;ensemble
        </h2>
        <MarkdownRenderer html={topic.indexHtml} />
      </section>

      {/* Résumé IA */}
      {topic.summaryHtml && (
        <section className="mb-12">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">
            Résumé vulgarisé
          </h2>
          <MarkdownRenderer html={topic.summaryHtml} />
        </section>
      )}

      {/* Papers preview */}
      <section className="mb-12">
        <h2 className="text-xl font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">
          Papers ({topic.papers.length})
        </h2>
        <div className="space-y-3">
          {topic.papers.slice(0, 5).map((paper, i) => (
            <div key={i} className="flex items-start justify-between gap-4 p-4 rounded-lg bg-gray-50 border border-gray-100">
              <div className="min-w-0">
                <p className="font-medium text-gray-900 text-sm">{paper.title}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {paper.authors.slice(0, 3).join(', ')}
                  {paper.authors.length > 3 && ' et al.'} — {paper.year}
                </p>
              </div>
              {paper.url && (
                <a
                  href={paper.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="shrink-0 text-xs text-brand-600 hover:text-brand-800"
                >
                  Lien
                </a>
              )}
            </div>
          ))}
        </div>
        {topic.papers.length > 5 && (
          <Link
            href={`/topics/${topic.slug}/papers`}
            className="inline-block mt-4 text-sm text-brand-600 hover:text-brand-800 font-medium"
          >
            Voir les {topic.papers.length} papers →
          </Link>
        )}
        {topic.paperSummaries.length > 0 && (
          <Link
            href={`/topics/${topic.slug}/papers`}
            className="inline-block mt-2 ml-4 text-sm text-gray-500 hover:text-gray-700"
          >
            {topic.paperSummaries.length} résumés disponibles
          </Link>
        )}
      </section>

      {/* Ressources */}
      {topic.resourcesHtml && (
        <section className="mb-12">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">
            Ressources
          </h2>
          <MarkdownRenderer html={topic.resourcesHtml} />
        </section>
      )}

      {/* Navigation prev/next */}
      <nav className="flex items-center justify-between pt-8 border-t border-gray-200">
        {prevTopic ? (
          <Link href={`/topics/${prevTopic.slug}`} className="group flex items-center gap-2 text-sm text-gray-500 hover:text-brand-600">
            <svg className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            {prevTopic.title}
          </Link>
        ) : <div />}
        {nextTopic ? (
          <Link href={`/topics/${nextTopic.slug}`} className="group flex items-center gap-2 text-sm text-gray-500 hover:text-brand-600">
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
