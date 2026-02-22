'use client';

import { useEffect, useRef } from 'react';

export default function MarkdownRenderer({ html }: { html: string }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const mermaidElements = container.querySelectorAll('pre.mermaid');
    if (mermaidElements.length > 0) {
      import('mermaid').then((m) => {
        m.default.initialize({
          startOnLoad: false,
          theme: 'neutral',
          fontFamily: 'Inter, system-ui, sans-serif',
        });
        m.default.run({ nodes: Array.from(mermaidElements) as HTMLElement[] });
      });
    }
  }, [html]);

  return (
    <div
      ref={containerRef}
      className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 prose-li:text-gray-700 prose-strong:text-gray-900"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
