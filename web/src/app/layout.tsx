import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  metadataBase: new URL('https://sci-base.vercel.app'),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('theme');var d=t==='dark'||(t!=='light'&&(new Date().getHours()<7||new Date().getHours()>=20));if(d)document.documentElement.classList.add('dark');var m=window.location.pathname.match(/^\\/(en|fr)/);document.documentElement.lang=m?m[1]:'fr'}catch(e){}})();`,
          }}
        />
      </head>
      <body className={`${inter.className} antialiased bg-[#fafbfc] dark:bg-gray-950 text-[#1a1a2e] dark:text-gray-100 transition-colors`}>
        {children}
      </body>
    </html>
  );
}
