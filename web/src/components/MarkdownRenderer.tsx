'use client';

import { useEffect, useRef, useCallback } from 'react';

export default function MarkdownRenderer({ html }: { html: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mermaidRef = useRef<typeof import('mermaid').default | null>(null);

  const renderMermaid = useCallback(async () => {
    const container = containerRef.current;
    if (!container) return;

    const mermaidElements = container.querySelectorAll('pre.mermaid');
    if (mermaidElements.length === 0) return;

    if (!mermaidRef.current) {
      const m = await import('mermaid');
      mermaidRef.current = m.default;
    }

    const isDark = document.documentElement.classList.contains('dark');
    mermaidRef.current.initialize({
      startOnLoad: false,
      theme: isDark ? 'dark' : 'neutral',
      fontFamily: 'Inter, system-ui, sans-serif',
    });

    // Reset mermaid elements so they can be re-rendered
    mermaidElements.forEach((el) => {
      const code = el.getAttribute('data-mermaid-source') || el.textContent || '';
      if (!el.getAttribute('data-mermaid-source')) {
        el.setAttribute('data-mermaid-source', code);
      }
      el.removeAttribute('data-processed');
      el.textContent = el.getAttribute('data-mermaid-source') || '';
    });

    mermaidRef.current.run({ nodes: Array.from(mermaidElements) as HTMLElement[] });
  }, []);

  useEffect(() => {
    renderMermaid();
  }, [html, renderMermaid]);

  // Watch for theme changes to re-render Mermaid
  useEffect(() => {
    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.attributeName === 'class') {
          renderMermaid();
          break;
        }
      }
    });

    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, [renderMermaid]);

  return (
    <div
      ref={containerRef}
      className="prose prose-lg max-w-none dark:prose-invert prose-headings:text-gray-900 dark:prose-headings:text-gray-100 prose-p:text-gray-700 dark:prose-p:text-gray-300 prose-li:text-gray-700 dark:prose-li:text-gray-300 prose-strong:text-gray-900 dark:prose-strong:text-gray-100"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
