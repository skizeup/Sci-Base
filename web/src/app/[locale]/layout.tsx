import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { LOCALES, isValidLocale } from '@/lib/i18n/config';
import type { Locale } from '@/lib/i18n/config';
import { getDictionary } from '@/lib/i18n/dictionaries';
import { LocaleProvider } from '@/contexts/LocaleContext';
import Providers from '@/components/Providers';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

export function generateMetadata({ params }: { params: { locale: string } }): Metadata {
  const locale = params.locale as Locale;
  const dict = getDictionary(isValidLocale(locale) ? locale : 'fr');
  const ogLocale = locale === 'en' ? 'en_US' : 'fr_FR';

  return {
    title: {
      default: dict.meta.siteTitle,
      template: '%s | SciBase',
    },
    description: dict.meta.siteDescription,
    openGraph: {
      type: 'website',
      locale: ogLocale,
      siteName: 'SciBase',
      title: dict.meta.siteTitle,
      description: dict.meta.siteDescription,
      url: `https://sci-base.vercel.app/${locale}`,
    },
    twitter: {
      card: 'summary_large_image',
    },
    alternates: {
      languages: {
        fr: `/fr`,
        en: `/en`,
      },
    },
  };
}

export default function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  if (!isValidLocale(params.locale)) notFound();

  return (
    <LocaleProvider locale={params.locale}>
      <Providers>
        <Header />
        <main className="min-h-[calc(100vh-12rem)]">
          {children}
        </main>
        <Footer />
      </Providers>
    </LocaleProvider>
  );
}
