'use client';

import Link from 'next/link';
import type { TopicMeta, Level } from '@/lib/types';

const levelColors: Record<Level, { bg: string; border: string; text: string; darkBg: string; darkBorder: string; darkText: string }> = {
  debutant: { bg: 'bg-emerald-50', border: 'border-emerald-300', text: 'text-emerald-800', darkBg: 'dark:bg-emerald-950/30', darkBorder: 'dark:border-emerald-700', darkText: 'dark:text-emerald-300' },
  intermediaire: { bg: 'bg-amber-50', border: 'border-amber-300', text: 'text-amber-800', darkBg: 'dark:bg-amber-950/30', darkBorder: 'dark:border-amber-700', darkText: 'dark:text-amber-300' },
  avance: { bg: 'bg-purple-50', border: 'border-purple-300', text: 'text-purple-800', darkBg: 'dark:bg-purple-950/30', darkBorder: 'dark:border-purple-700', darkText: 'dark:text-purple-300' },
};

const levelLabels: Record<Level, string> = {
  debutant: 'Débutant',
  intermediaire: 'Intermédiaire',
  avance: 'Avancé',
};

export default function LearningPath({ topics }: { topics: TopicMeta[] }) {
  const levels: Level[] = ['debutant', 'intermediaire', 'avance'];

  return (
    <div className="space-y-12">
      {levels.map((level) => {
        const levelTopics = topics.filter((t) => t.level === level);
        if (levelTopics.length === 0) return null;
        const c = levelColors[level];

        return (
          <div key={level}>
            <h2 className={`text-lg font-semibold mb-4 ${c.text} ${c.darkText}`}>
              {levelLabels[level]}
            </h2>
            <div className="space-y-3">
              {levelTopics.map((topic, i) => (
                <div key={topic.slug} className="flex items-start gap-4">
                  {/* Step number */}
                  <div className="flex flex-col items-center">
                    <div className={`w-10 h-10 rounded-full ${c.bg} ${c.darkBg} ${c.border} ${c.darkBorder} border-2 flex items-center justify-center text-sm font-bold ${c.text} ${c.darkText}`}>
                      {topic.order}
                    </div>
                    {i < levelTopics.length - 1 && (
                      <div className={`w-0.5 h-8 ${c.bg} ${c.darkBg}`} />
                    )}
                  </div>

                  {/* Card */}
                  <Link
                    href={`/topics/${topic.slug}`}
                    className={`flex-1 p-4 rounded-lg border ${c.border} ${c.darkBorder} ${c.bg} ${c.darkBg} hover:shadow-md transition group`}
                  >
                    <h3 className="font-medium text-gray-900 dark:text-gray-100 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                      {topic.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
                      {topic.description}
                    </p>
                    <div className="flex items-center gap-3 mt-2 text-xs text-gray-500 dark:text-gray-500">
                      <span>{topic.paperCount} papers</span>
                      {topic.prerequisites.length > 0 && (
                        <span>Prérequis : {topic.prerequisites.join(', ')}</span>
                      )}
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
