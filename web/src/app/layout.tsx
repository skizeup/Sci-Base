import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  metadataBase: new URL('https://sci-base.vercel.app'),
  title: {
    default: 'SciBase — Apprendre l\'IA et le Machine Learning',
    template: '%s | SciBase',
  },
  description: 'Plateforme d\'apprentissage scientifique open-source. Explorez 10 topics, 119 papers vulgarisés et un parcours structuré.',
  openGraph: {
    type: 'website',
    locale: 'fr_FR',
    siteName: 'SciBase',
    title: 'SciBase — Apprendre l\'IA et le Machine Learning',
    description: 'Plateforme d\'apprentissage scientifique open-source. Explorez 10 topics, 119 papers vulgarisés et un parcours structuré.',
    url: 'https://sci-base.vercel.app',
  },
  twitter: {
    card: 'summary_large_image',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('theme');var d=t==='dark'||(t!=='light'&&(new Date().getHours()<7||new Date().getHours()>=20));if(d)document.documentElement.classList.add('dark')}catch(e){}})();`,
          }}
        />
      </head>
      <body className={`${inter.className} antialiased bg-[#fafbfc] dark:bg-gray-950 text-[#1a1a2e] dark:text-gray-100 transition-colors`}>
        <Header />
        <main className="min-h-[calc(100vh-12rem)]">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
