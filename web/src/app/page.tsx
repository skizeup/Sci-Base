import type { Metadata } from 'next';
import { getAllTopicsMeta } from '@/lib/content';
import TopicCard from '@/components/TopicCard';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'SciBase — Apprendre l\'IA et le Machine Learning',
  description: 'Plateforme d\'apprentissage scientifique open-source. Explorez 10 topics, 119 papers vulgarisés et un parcours structuré en IA et Machine Learning.',
  openGraph: {
    url: '/',
  },
};

export default function HomePage() {
  const topics = getAllTopicsMeta();
  const totalPapers = topics.reduce((sum, t) => sum + t.paperCount, 0);

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-b from-brand-50 dark:from-gray-900 to-white dark:to-gray-950 py-16 sm:py-24">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            Apprendre l&apos;IA et le <span className="text-brand-600 dark:text-brand-400">Machine Learning</span>
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-8">
            Des ressources scientifiques vulgarisées, structurées par niveau.
            Papers de recherche expliqués simplement, parcours d&apos;apprentissage progressif.
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
              Parcours structuré
            </span>
          </div>
          <div className="flex items-center justify-center gap-3">
            <Link
              href="/parcours"
              className="inline-flex items-center px-5 py-2.5 rounded-lg bg-brand-600 text-white font-medium text-sm hover:bg-brand-700 transition-colors"
            >
              Voir le parcours
            </Link>
            <Link
              href="/recherche"
              className="inline-flex items-center px-5 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium text-sm hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              Rechercher
            </Link>
          </div>
        </div>
      </section>

      {/* Topic grid */}
      <section className="max-w-6xl mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-8">
          Tous les topics
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {topics.map((topic) => (
            <TopicCard key={topic.slug} topic={topic} />
          ))}
        </div>
      </section>
    </div>
  );
}
