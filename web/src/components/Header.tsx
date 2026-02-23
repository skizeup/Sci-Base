'use client';

import Link from 'next/link';
import { useState } from 'react';
import ThemeToggle from './ThemeToggle';

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700">
      <nav className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-bold text-xl text-gray-900 dark:text-gray-100">
          <span className="text-brand-600 dark:text-brand-400">Sci</span>Base
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-6">
          <Link href="/" className="text-sm text-gray-600 dark:text-gray-400 hover:text-brand-600 dark:hover:text-brand-400 transition-colors">
            Topics
          </Link>
          <Link href="/parcours" className="text-sm text-gray-600 dark:text-gray-400 hover:text-brand-600 dark:hover:text-brand-400 transition-colors">
            Parcours
          </Link>
          <Link href="/recherche" className="text-sm text-gray-600 dark:text-gray-400 hover:text-brand-600 dark:hover:text-brand-400 transition-colors">
            Recherche
          </Link>
          <a
            href="https://github.com/skizeup/Sci-Base"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-gray-600 dark:text-gray-400 hover:text-brand-600 dark:hover:text-brand-400 transition-colors"
          >
            GitHub
          </a>
          <ThemeToggle />
        </div>

        {/* Mobile: theme toggle + burger */}
        <div className="flex md:hidden items-center gap-1">
          <ThemeToggle />
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
            aria-label="Menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {menuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
          <div className="px-4 py-3 space-y-3">
            <Link href="/" className="block text-sm text-gray-700 dark:text-gray-300 hover:text-brand-600 dark:hover:text-brand-400" onClick={() => setMenuOpen(false)}>
              Topics
            </Link>
            <Link href="/parcours" className="block text-sm text-gray-700 dark:text-gray-300 hover:text-brand-600 dark:hover:text-brand-400" onClick={() => setMenuOpen(false)}>
              Parcours
            </Link>
            <Link href="/recherche" className="block text-sm text-gray-700 dark:text-gray-300 hover:text-brand-600 dark:hover:text-brand-400" onClick={() => setMenuOpen(false)}>
              Recherche
            </Link>
            <a
              href="https://github.com/skizeup/Sci-Base"
              target="_blank"
              rel="noopener noreferrer"
              className="block text-sm text-gray-700 dark:text-gray-300 hover:text-brand-600 dark:hover:text-brand-400"
            >
              GitHub
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
