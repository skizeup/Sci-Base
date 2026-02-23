'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Fuse from 'fuse.js';
import type { SearchItem } from '@/lib/types';

export default function SearchBar({ fullPage = false }: { fullPage?: boolean }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchItem[]>([]);
  const [fuse, setFuse] = useState<Fuse<SearchItem> | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch('/search-index.json')
      .then((res) => res.json())
      .then((data: SearchItem[]) => {
        setFuse(
          new Fuse(data, {
            keys: [
              { name: 'title', weight: 2 },
              { name: 'description', weight: 1 },
              { name: 'tags', weight: 0.5 },
            ],
            threshold: 0.3,
            includeScore: true,
            minMatchCharLength: 2,
          })
        );
      });
  }, []);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const search = useCallback(
    (q: string) => {
      setQuery(q);
      if (!fuse || q.length < 2) {
        setResults([]);
        return;
      }
      const res = fuse.search(q, { limit: fullPage ? 50 : 5 });
      setResults(res.map((r) => r.item));
      setShowDropdown(!fullPage && res.length > 0);
    },
    [fuse, fullPage]
  );

  const typeLabels: Record<string, string> = {
    topic: 'Topic',
    paper: 'Paper',
    'paper-summary': 'Résumé',
  };

  const typeColors: Record<string, string> = {
    topic: 'bg-brand-100 text-brand-800 dark:bg-brand-900/30 dark:text-brand-300',
    paper: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300',
    'paper-summary': 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300',
  };

  return (
    <div ref={containerRef} className={fullPage ? '' : 'relative'}>
      <div className="relative">
        <svg
          className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          type="text"
          placeholder="Rechercher un topic, paper..."
          value={query}
          onChange={(e) => search(e.target.value)}
          onFocus={() => results.length > 0 && !fullPage && setShowDropdown(true)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !fullPage) {
              router.push(`/recherche?q=${encodeURIComponent(query)}`);
              setShowDropdown(false);
            }
          }}
          className={`w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent ${
            fullPage ? 'text-base py-3' : ''
          }`}
        />
      </div>

      {/* Dropdown (compact mode) */}
      {!fullPage && showDropdown && results.length > 0 && (
        <div className="absolute top-full mt-1 w-full bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-lg z-50 overflow-hidden">
          {results.map((item, i) => (
            <button
              key={i}
              onClick={() => {
                router.push(item.url);
                setShowDropdown(false);
              }}
              className="w-full px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700 border-b border-gray-100 dark:border-gray-700 last:border-0"
            >
              <div className="flex items-center gap-2">
                <span className={`px-1.5 py-0.5 text-[10px] font-medium rounded ${typeColors[item.type]}`}>
                  {typeLabels[item.type]}
                </span>
                <span className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">{item.title}</span>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 truncate">{item.topicTitle}</p>
            </button>
          ))}
          <button
            onClick={() => {
              router.push(`/recherche?q=${encodeURIComponent(query)}`);
              setShowDropdown(false);
            }}
            className="w-full px-4 py-2 text-xs text-brand-600 dark:text-brand-400 hover:bg-gray-50 dark:hover:bg-gray-700 font-medium"
          >
            Voir tous les résultats →
          </button>
        </div>
      )}

      {/* Full page results */}
      {fullPage && results.length > 0 && (
        <div className="mt-6 space-y-3">
          {results.map((item, i) => (
            <button
              key={i}
              onClick={() => router.push(item.url)}
              className="w-full p-4 text-left bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 hover:shadow-sm transition"
            >
              <div className="flex items-center gap-2 mb-1">
                <span className={`px-2 py-0.5 text-xs font-medium rounded ${typeColors[item.type]}`}>
                  {typeLabels[item.type]}
                </span>
                <span className="text-sm font-medium text-gray-900 dark:text-gray-100">{item.title}</span>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400">{item.description}</p>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{item.topicTitle}</p>
            </button>
          ))}
        </div>
      )}

      {fullPage && query.length >= 2 && results.length === 0 && (
        <p className="mt-6 text-sm text-gray-500 dark:text-gray-400 text-center">
          Aucun résultat pour &quot;{query}&quot;
        </p>
      )}
    </div>
  );
}
