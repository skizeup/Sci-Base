import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getTopicSlugs, getTopicMeta, getQuiz } from '@/lib/content';
import Breadcrumb from '@/components/Breadcrumb';
import QuizComponent from '@/components/Quiz';
import Link from 'next/link';

export function generateStaticParams() {
  return getTopicSlugs()
    .filter((slug) => getQuiz(slug) !== null)
    .map((slug) => ({ slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const meta = getTopicMeta(params.slug);
  return {
    title: `Quiz — ${meta.title}`,
    description: `Testez vos connaissances sur ${meta.title} avec ce quiz interactif.`,
    openGraph: {
      url: `/topics/${params.slug}/quiz`,
    },
  };
}

export default function QuizPage({ params }: { params: { slug: string } }) {
  const slugs = getTopicSlugs();
  if (!slugs.includes(params.slug)) notFound();

  const quiz = getQuiz(params.slug);
  if (!quiz) notFound();

  const meta = getTopicMeta(params.slug);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Breadcrumb
        items={[
          { label: 'Accueil', href: '/' },
          { label: meta.title, href: `/topics/${params.slug}` },
          { label: 'Quiz' },
        ]}
      />

      {/* Header */}
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          Quiz — {meta.title}
        </h1>
        <p className="text-gray-500 dark:text-gray-400">
          {quiz.questions.length} questions pour tester vos connaissances
        </p>
      </div>

      {/* Quiz */}
      <QuizComponent quiz={quiz} topicSlug={params.slug} />

      {/* Lien retour */}
      <div className="mt-12 pt-6 border-t border-gray-200 dark:border-gray-700 text-center">
        <Link
          href={`/topics/${params.slug}`}
          className="text-sm text-brand-600 dark:text-brand-400 hover:text-brand-800 dark:hover:text-brand-300"
        >
          &larr; Retour a {meta.title}
        </Link>
      </div>
    </div>
  );
}
