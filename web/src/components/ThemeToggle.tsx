'use client';

import { useState, useEffect } from 'react';

type Theme = 'light' | 'dark' | 'auto';

function getAutoTheme(): 'light' | 'dark' {
  const hour = new Date().getHours();
  return (hour < 7 || hour >= 20) ? 'dark' : 'light';
}

function resolveTheme(theme: Theme): 'light' | 'dark' {
  return theme === 'auto' ? getAutoTheme() : theme;
}

function applyTheme(theme: Theme) {
  document.documentElement.classList.toggle('dark', resolveTheme(theme) === 'dark');
}

export default function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>('auto');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('theme') as Theme | null;
    if (stored === 'light' || stored === 'dark') {
      setTheme(stored);
    } else {
      setTheme('auto');
    }
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    if (theme === 'auto') {
      localStorage.removeItem('theme');
    } else {
      localStorage.setItem('theme', theme);
    }
    applyTheme(theme);

    // In auto mode, re-check every minute in case we cross the threshold
    if (theme === 'auto') {
      const interval = setInterval(() => applyTheme('auto'), 60_000);
      return () => clearInterval(interval);
    }
  }, [theme, mounted]);

  function cycle() {
    setTheme((prev) => {
      if (prev === 'auto') return 'light';
      if (prev === 'light') return 'dark';
      return 'auto';
    });
  }

  if (!mounted) {
    return <div className="w-9 h-9" />;
  }

  const resolved = resolveTheme(theme);
  const labels: Record<Theme, string> = {
    auto: `Auto (${resolved === 'dark' ? '20h-7h' : '7h-20h'})`,
    light: 'Clair',
    dark: 'Sombre',
  };

  return (
    <button
      onClick={cycle}
      className="p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
      aria-label={`Thème : ${labels[theme]}`}
      title={labels[theme]}
    >
      {theme === 'auto' ? (
        // Clock icon for auto/time-based
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ) : theme === 'dark' ? (
        // Moon icon
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
        </svg>
      ) : (
        // Sun icon
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      )}
    </button>
  );
}
