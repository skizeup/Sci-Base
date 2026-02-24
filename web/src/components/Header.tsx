'use client';

import Link from 'next/link';
import { useState } from 'react';
import ThemeToggle from './ThemeToggle';
import LanguageSwitcher from './LanguageSwitcher';
import UserMenu from './UserMenu';
import AuthModal from './AuthModal';
import { useAuth } from '@/contexts/AuthContext';
import { useTranslation, useLocale } from '@/contexts/LocaleContext';

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const { user, loading } = useAuth();
  const { t } = useTranslation();
  const locale = useLocale();

  return (
    <>
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700">
        <nav className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href={`/${locale}`} className="flex items-center gap-2 font-bold text-xl text-gray-900 dark:text-gray-100">
            <span className="text-brand-600 dark:text-brand-400">Sci</span>Base
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-6">
            <Link href={`/${locale}`} className="text-sm text-gray-600 dark:text-gray-400 hover:text-brand-600 dark:hover:text-brand-400 transition-colors">
              {t('common.topics')}
            </Link>
            <Link href={`/${locale}/parcours`} className="text-sm text-gray-600 dark:text-gray-400 hover:text-brand-600 dark:hover:text-brand-400 transition-colors">
              {t('common.learningPath')}
            </Link>
            <Link href={`/${locale}/recherche`} className="text-sm text-gray-600 dark:text-gray-400 hover:text-brand-600 dark:hover:text-brand-400 transition-colors">
              {t('common.search')}
            </Link>
            <a
              href="https://github.com/skizeup/Sci-Base"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-gray-600 dark:text-gray-400 hover:text-brand-600 dark:hover:text-brand-400 transition-colors"
            >
              GitHub
            </a>
            <LanguageSwitcher />
            <ThemeToggle />
            {loading ? (
              <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse" />
            ) : user ? (
              <UserMenu />
            ) : (
              <button
                onClick={() => setAuthModalOpen(true)}
                className="text-sm font-medium px-4 py-1.5 rounded-lg bg-brand-600 text-white hover:bg-brand-700 transition-colors"
              >
                {t('common.login')}
              </button>
            )}
          </div>

          {/* Mobile: lang + theme + auth + burger */}
          <div className="flex md:hidden items-center gap-1">
            <LanguageSwitcher />
            <ThemeToggle />
            {!loading && (
              user ? (
                <UserMenu />
              ) : (
                <button
                  onClick={() => setAuthModalOpen(true)}
                  className="p-2 text-brand-600 dark:text-brand-400"
                  aria-label={t('common.login')}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </button>
              )
            )}
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

        {menuOpen && (
          <div className="md:hidden border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
            <div className="px-4 py-3 space-y-3">
              <Link href={`/${locale}`} className="block text-sm text-gray-700 dark:text-gray-300 hover:text-brand-600 dark:hover:text-brand-400" onClick={() => setMenuOpen(false)}>
                {t('common.topics')}
              </Link>
              <Link href={`/${locale}/parcours`} className="block text-sm text-gray-700 dark:text-gray-300 hover:text-brand-600 dark:hover:text-brand-400" onClick={() => setMenuOpen(false)}>
                {t('common.learningPath')}
              </Link>
              <Link href={`/${locale}/recherche`} className="block text-sm text-gray-700 dark:text-gray-300 hover:text-brand-600 dark:hover:text-brand-400" onClick={() => setMenuOpen(false)}>
                {t('common.search')}
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

      <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} />
    </>
  );
}
