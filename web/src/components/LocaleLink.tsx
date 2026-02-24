'use client';

import Link from 'next/link';
import type { ComponentProps } from 'react';
import { useLocale } from '@/contexts/LocaleContext';
import { localePath } from '@/lib/i18n/link';

type Props = Omit<ComponentProps<typeof Link>, 'href'> & { href: string };

export default function LocaleLink({ href, ...props }: Props) {
  const locale = useLocale();
  const prefixed = href.startsWith('http') || href.startsWith('#')
    ? href
    : localePath(locale, href);
  return <Link href={prefixed} {...props} />;
}
