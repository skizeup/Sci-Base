'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLocale } from '@/contexts/LocaleContext';
import type { Locale } from '@/lib/i18n/config';
import { LOCALES } from '@/lib/i18n/config';

export default function LanguageSwitcher() {
  const locale = useLocale();
  const pathname = usePathname();

  function switchedPath(target: Locale): string {
    // Replace /fr/... or /en/... with /target/...
    const rest = pathname.replace(/^\/(fr|en)/, '') || '/';
    return `/${target}${rest}`;
  }

  const other = LOCALES.find((l) => l !== locale) as Locale;

  return (
    <Link
      href={switchedPath(other)}
      className="p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-sm font-medium"
      title={other === 'en' ? 'English' : 'Fran\u00e7ais'}
    >
      {other.toUpperCase()}
    </Link>
  );
}
