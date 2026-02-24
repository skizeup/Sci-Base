import type { Level } from '@/lib/types';
import type { Locale } from '@/lib/i18n/config';
import { getDictionary } from '@/lib/i18n/dictionaries';
import { translate } from '@/lib/i18n/translate';

const styles: Record<Level, string> = {
  debutant: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300',
  intermediaire: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300',
  avance: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300',
};

export default function LevelBadge({ level, locale = 'fr' }: { level: Level; locale?: Locale }) {
  const dict = getDictionary(locale);
  const label = translate(dict, `levels.${level}`);
  return (
    <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium ${styles[level]}`}>
      {label}
    </span>
  );
}
