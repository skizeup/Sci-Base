import type { Locale } from './config';

/**
 * Prefix a path with the locale: localePath('en', '/topics/ml') => '/en/topics/ml'
 */
export function localePath(locale: Locale, path: string): string {
  const clean = path.startsWith('/') ? path : `/${path}`;
  return `/${locale}${clean}`;
}
