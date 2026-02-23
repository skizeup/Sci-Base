'use client';

import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import Link from 'next/link';
import type { TopicMeta, Level } from '@/lib/types';

const LEVELS: Level[] = ['debutant', 'intermediaire', 'avance'];

const LEVEL_CONFIG: Record<Level, {
  label: string;
  icon: string;
  headerBorder: string;
  headerText: string;
  cardBorder: string;
  hoverRing: string;
  arrowColor: string;
  arrowColorDark: string;
  markerId: string;
}> = {
  debutant: {
    label: 'Débutant',
    icon: '🟢',
    headerBorder: 'border-emerald-300 dark:border-emerald-700',
    headerText: 'text-emerald-700 dark:text-emerald-400',
    cardBorder: 'border-emerald-200 dark:border-emerald-800',
    hoverRing: 'ring-2 ring-emerald-300/60 dark:ring-emerald-600/60',
    arrowColor: '#10b981',
    arrowColorDark: '#34d399',
    markerId: 'emerald',
  },
  intermediaire: {
    label: 'Intermédiaire',
    icon: '🟡',
    headerBorder: 'border-amber-300 dark:border-amber-700',
    headerText: 'text-amber-700 dark:text-amber-400',
    cardBorder: 'border-amber-200 dark:border-amber-800',
    hoverRing: 'ring-2 ring-amber-300/60 dark:ring-amber-600/60',
    arrowColor: '#f59e0b',
    arrowColorDark: '#fbbf24',
    markerId: 'amber',
  },
  avance: {
    label: 'Avancé',
    icon: '🟣',
    headerBorder: 'border-purple-300 dark:border-purple-700',
    headerText: 'text-purple-700 dark:text-purple-400',
    cardBorder: 'border-purple-200 dark:border-purple-800',
    hoverRing: 'ring-2 ring-purple-300/60 dark:ring-purple-600/60',
    arrowColor: '#8b5cf6',
    arrowColorDark: '#a78bfa',
    markerId: 'purple',
  },
};

interface ArrowData {
  from: string;
  to: string;
  path: string;
}

const STORAGE_KEY = 'scibase-progress';

export default function LearningPath({ topics }: { topics: TopicMeta[] }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef(new Map<string, HTMLDivElement>());

  const [arrows, setArrows] = useState<ArrowData[]>([]);
  const [hoveredTopic, setHoveredTopic] = useState<string | null>(null);
  const [completed, setCompleted] = useState<Set<string>>(new Set());
  const [isDark, setIsDark] = useState(false);

  // Group topics by level
  const topicsByLevel = useMemo(() => {
    const map = new Map<Level, TopicMeta[]>();
    LEVELS.forEach(l => map.set(l, []));
    topics.forEach(t => map.get(t.level)?.push(t));
    return map;
  }, [topics]);

  // Build dependents lookup (topic → topics that list it as prereq)
  const dependentsOf = useMemo(() => {
    const map = new Map<string, string[]>();
    topics.forEach(t => {
      t.prerequisites.forEach(prereq => {
        if (!map.has(prereq)) map.set(prereq, []);
        map.get(prereq)!.push(t.slug);
      });
    });
    return map;
  }, [topics]);

  // Load progress from localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setCompleted(new Set(JSON.parse(raw)));
    } catch { /* ignore */ }
  }, []);

  // Track dark mode via MutationObserver
  useEffect(() => {
    const update = () => setIsDark(document.documentElement.classList.contains('dark'));
    update();
    const obs = new MutationObserver(update);
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => obs.disconnect();
  }, []);

  // Compute SVG arrow paths from element positions
  const computeArrows = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;
    const cr = container.getBoundingClientRect();
    const result: ArrowData[] = [];

    topics.forEach(topic => {
      topic.prerequisites.forEach(prereqSlug => {
        const fromEl = cardRefs.current.get(prereqSlug);
        const toEl = cardRefs.current.get(topic.slug);
        if (!fromEl || !toEl) return;

        const fr = fromEl.getBoundingClientRect();
        const tr = toEl.getBoundingClientRect();

        const fromLevel = topics.find(t => t.slug === prereqSlug)?.level;
        const sameColumn = fromLevel === topic.level;

        let path: string;

        if (sameColumn) {
          // Same column: arc through the left side
          const x1 = fr.left - cr.left;
          const y1 = fr.top + fr.height / 2 - cr.top;
          const x2 = tr.left - cr.left;
          const y2 = tr.top + tr.height / 2 - cr.top;
          const bulge = -40;
          path = `M ${x1} ${y1} C ${x1 + bulge} ${y1}, ${x2 + bulge} ${y2}, ${x2} ${y2}`;
        } else {
          // Cross-column: right center → left center
          const x1 = fr.right - cr.left + 2;
          const y1 = fr.top + fr.height / 2 - cr.top;
          const x2 = tr.left - cr.left - 2;
          const y2 = tr.top + tr.height / 2 - cr.top;
          const dx = Math.abs(x2 - x1) * 0.35;
          path = `M ${x1} ${y1} C ${x1 + dx} ${y1}, ${x2 - dx} ${y2}, ${x2} ${y2}`;
        }

        result.push({ from: prereqSlug, to: topic.slug, path });
      });
    });

    setArrows(result);
  }, [topics]);

  // Recalculate arrows on mount and resize
  useEffect(() => {
    const timer = setTimeout(computeArrows, 50);
    const container = containerRef.current;
    const obs = new ResizeObserver(computeArrows);
    if (container) obs.observe(container);
    return () => {
      clearTimeout(timer);
      obs.disconnect();
    };
  }, [computeArrows]);

  // Toggle progress checkbox
  const toggleCompleted = useCallback((slug: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCompleted(prev => {
      const next = new Set(prev);
      if (next.has(slug)) next.delete(slug);
      else next.add(slug);
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(next))); } catch { /* ignore */ }
      return next;
    });
  }, []);

  // Connected topics for hover highlight
  const connectedSlugs = useMemo(() => {
    if (!hoveredTopic) return null;
    const set = new Set<string>();
    set.add(hoveredTopic);
    const topic = topics.find(t => t.slug === hoveredTopic);
    topic?.prerequisites.forEach(p => set.add(p));
    dependentsOf.get(hoveredTopic)?.forEach(d => set.add(d));
    return set;
  }, [hoveredTopic, topics, dependentsOf]);

  // Progress stats
  const completedCount = completed.size;
  const totalCount = topics.length;
  const progressPct = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  // Arrow colors for hover
  const hoveredLevel = hoveredTopic
    ? topics.find(t => t.slug === hoveredTopic)?.level ?? null
    : null;
  const defaultArrowColor = isDark ? '#374151' : '#d1d5db';
  const highlightArrowColor = hoveredLevel
    ? (isDark ? LEVEL_CONFIG[hoveredLevel].arrowColorDark : LEVEL_CONFIG[hoveredLevel].arrowColor)
    : defaultArrowColor;
  const highlightMarkerId = hoveredLevel ? LEVEL_CONFIG[hoveredLevel].markerId : 'default';

  return (
    <div className="space-y-6">
      {/* Progress bar */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Progression
          </span>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {completedCount} / {totalCount} topics complétés
          </span>
        </div>
        <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-emerald-500 via-amber-500 to-purple-500 rounded-full transition-all duration-500"
            style={{ width: `${progressPct}%` }}
          />
        </div>
      </div>

      {/* Grid + SVG arrows */}
      <div ref={containerRef} className="relative">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {LEVELS.map(level => {
            const cfg = LEVEL_CONFIG[level];
            const items = topicsByLevel.get(level) || [];

            return (
              <div key={level} className="space-y-3">
                {/* Column header */}
                <div className={`flex items-center gap-2 pb-2 border-b-2 ${cfg.headerBorder}`}>
                  <span>{cfg.icon}</span>
                  <h3 className={`font-semibold ${cfg.headerText}`}>{cfg.label}</h3>
                  <span className="text-xs text-gray-400 dark:text-gray-500 ml-auto">
                    {items.length} topics
                  </span>
                </div>

                {/* Topic cards */}
                {items.map(topic => {
                  const isHovered = hoveredTopic === topic.slug;
                  const isFaded = connectedSlugs !== null && !connectedSlugs.has(topic.slug);
                  const isDone = completed.has(topic.slug);

                  return (
                    <div
                      key={topic.slug}
                      ref={el => { if (el) cardRefs.current.set(topic.slug, el); }}
                      onMouseEnter={() => setHoveredTopic(topic.slug)}
                      onMouseLeave={() => setHoveredTopic(null)}
                      className={`transition-opacity duration-200 ${isFaded ? 'opacity-25' : 'opacity-100'}`}
                    >
                      <Link
                        href={`/topics/${topic.slug}`}
                        className={[
                          'block p-3 rounded-lg border-2 transition-all duration-200 group',
                          isDone
                            ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-400 dark:border-emerald-600'
                            : `bg-white dark:bg-gray-800/50 ${cfg.cardBorder}`,
                          isHovered ? `${cfg.hoverRing} shadow-md` : 'hover:shadow-sm',
                        ].join(' ')}
                      >
                        <div className="flex items-start gap-2">
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-sm text-gray-900 dark:text-gray-100 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors truncate">
                              {topic.title}
                            </h4>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">
                              {topic.description}
                            </p>
                            <span className="text-xs text-gray-400 dark:text-gray-500 mt-1 inline-block">
                              {topic.paperCount} papers
                            </span>
                          </div>

                          {/* Progress checkbox */}
                          <button
                            onClick={e => toggleCompleted(topic.slug, e)}
                            className={[
                              'flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-200',
                              isDone
                                ? 'bg-emerald-500 border-emerald-500 text-white'
                                : 'border-gray-300 dark:border-gray-600 hover:border-emerald-400 dark:hover:border-emerald-500',
                            ].join(' ')}
                            title={isDone ? 'Marquer comme non terminé' : 'Marquer comme terminé'}
                          >
                            {isDone && (
                              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                              </svg>
                            )}
                          </button>
                        </div>
                      </Link>
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>

        {/* SVG arrow overlay (desktop only) */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none hidden md:block"
          style={{ overflow: 'visible' }}
        >
          <defs>
            <marker id="lp-arrow-default" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
              <path d="M0 0 L8 3 L0 6Z" fill={defaultArrowColor} />
            </marker>
            <marker id="lp-arrow-emerald" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
              <path d="M0 0 L8 3 L0 6Z" fill={isDark ? LEVEL_CONFIG.debutant.arrowColorDark : LEVEL_CONFIG.debutant.arrowColor} />
            </marker>
            <marker id="lp-arrow-amber" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
              <path d="M0 0 L8 3 L0 6Z" fill={isDark ? LEVEL_CONFIG.intermediaire.arrowColorDark : LEVEL_CONFIG.intermediaire.arrowColor} />
            </marker>
            <marker id="lp-arrow-purple" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
              <path d="M0 0 L8 3 L0 6Z" fill={isDark ? LEVEL_CONFIG.avance.arrowColorDark : LEVEL_CONFIG.avance.arrowColor} />
            </marker>
          </defs>
          {arrows.map((arrow, i) => {
            const isConnected = hoveredTopic !== null &&
              (arrow.from === hoveredTopic || arrow.to === hoveredTopic);

            // Hidden by default, only visible on hover
            if (!hoveredTopic) return null;

            return (
              <path
                key={`${arrow.from}-${arrow.to}-${i}`}
                d={arrow.path}
                fill="none"
                stroke={isConnected ? highlightArrowColor : defaultArrowColor}
                strokeWidth={isConnected ? 2.5 : 1}
                markerEnd={isConnected ? `url(#lp-arrow-${highlightMarkerId})` : `url(#lp-arrow-default)`}
                className={`transition-all duration-200 ${isConnected ? 'opacity-100' : 'opacity-10'}`}
              />
            );
          })}
        </svg>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-gray-500 dark:text-gray-400 pt-4 border-t border-gray-200 dark:border-gray-700">
        <span>🟢 Débutant</span>
        <span>🟡 Intermédiaire</span>
        <span>🟣 Avancé</span>
        <span className="hidden md:inline text-gray-300 dark:text-gray-600">|</span>
        <span className="hidden md:flex items-center gap-1.5">
          <svg className="w-5 h-1" viewBox="0 0 20 4">
            <path d="M0 2 L20 2" stroke="currentColor" strokeWidth="1.5" />
            <path d="M16 0 L20 2 L16 4Z" fill="currentColor" />
          </svg>
          Prérequis
        </span>
        <span className="text-gray-300 dark:text-gray-600">|</span>
        <span className="flex items-center gap-1.5">
          <span className="inline-flex w-4 h-4 rounded-full bg-emerald-500 items-center justify-center">
            <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </span>
          Terminé
        </span>
      </div>
    </div>
  );
}
