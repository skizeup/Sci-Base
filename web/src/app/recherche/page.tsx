import type { Metadata } from 'next';
import Breadcrumb from '@/components/Breadcrumb';
import SearchBar from '@/components/SearchBar';

export const metadata: Metadata = {
  title: 'Recherche',
  description: 'Rechercher parmi les topics, papers et résumés de SciBase',
};

export default function RecherchePage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <Breadcrumb
        items={[
          { label: 'Accueil', href: '/' },
          { label: 'Recherche' },
        ]}
      />

      <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">Recherche</h1>

      <SearchBar fullPage />
    </div>
  );
}
