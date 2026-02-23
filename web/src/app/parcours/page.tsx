import type { Metadata } from 'next';
import { getAllTopicsMeta } from '@/lib/content';
import Breadcrumb from '@/components/Breadcrumb';
import LearningPath from '@/components/LearningPath';

export const metadata: Metadata = {
  title: 'Parcours d\'apprentissage',
  description: 'Parcours progressif pour apprendre l\'IA et le Machine Learning, du débutant à l\'avancé.',
};

export default function ParcoursPage() {
  const topics = getAllTopicsMeta();

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <Breadcrumb
        items={[
          { label: 'Accueil', href: '/' },
          { label: 'Parcours' },
        ]}
      />

      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          Parcours d&apos;apprentissage
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Suivez ce parcours progressif pour maîtriser les fondamentaux de l&apos;IA
          et du Machine Learning. Chaque topic s&apos;appuie sur les précédents.
        </p>
      </div>

      <LearningPath topics={topics} />
    </div>
  );
}
