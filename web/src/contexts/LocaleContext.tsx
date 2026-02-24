'use client';

import { createContext, useContext } from 'react';
import type { Locale } from '@/lib/i18n/config';
import type { Dictionary } from '@/lib/i18n/dictionaries';
import { getDictionary } from '@/lib/i18n/dictionaries';
import { translate } from '@/lib/i18n/translate';

interface LocaleContextType {
  locale: Locale;
  dict: Dictionary;
  t: (key: string, params?: Record<string, string | number>) => string;
}

const LocaleContext = createContext<LocaleContextType>({
  locale: 'fr',
  dict: getDictionary('fr'),
  t: (key) => key,
});

export function useLocale() {
  return useContext(LocaleContext).locale;
}

export function useTranslation() {
  const ctx = useContext(LocaleContext);
  return { t: ctx.t, dict: ctx.dict, locale: ctx.locale };
}

export function LocaleProvider({
  locale,
  children,
}: {
  locale: Locale;
  children: React.ReactNode;
}) {
  const dict = getDictionary(locale);
  const t = (key: string, params?: Record<string, string | number>) =>
    translate(dict, key, params);

  return (
    <LocaleContext.Provider value={{ locale, dict, t }}>
      {children}
    </LocaleContext.Provider>
  );
}
