import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: {
    default: 'SciBase — Apprendre l\'IA et le Machine Learning',
    template: '%s | SciBase',
  },
  description: 'Plateforme d\'apprentissage scientifique open-source. Explorez 10 topics, 119 papers vulgarisés et un parcours structuré.',
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
