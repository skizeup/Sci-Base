import type { Dictionary } from './dictionaries';

/**
 * Resolve a nested key like "quiz.title" from the dictionary object.
 * Supports interpolation: {count}, {title}, etc.
 */
export function translate(
  dict: Dictionary,
  key: string,
  params?: Record<string, string | number>
): string {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let value: any = dict;
  for (const part of key.split('.')) {
    value = value?.[part];
  }
  if (typeof value !== 'string') return key;
  if (!params) return value;
  return value.replace(/\{(\w+)\}/g, (_, k) =>
    params[k] !== undefined ? String(params[k]) : `{${k}}`
  );
}
