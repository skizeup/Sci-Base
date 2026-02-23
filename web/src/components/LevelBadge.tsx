import type { Level } from '@/lib/types';

const config: Record<Level, { label: string; className: string }> = {
  debutant: {
    label: 'Débutant',
    className: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300',
  },
  intermediaire: {
    label: 'Intermédiaire',
    className: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300',
  },
  avance: {
    label: 'Avancé',
    className: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300',
  },
};

export default function LevelBadge({ level }: { level: Level }) {
  const { label, className } = config[level];
  return (
    <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium ${className}`}>
      {label}
    </span>
  );
}
