'use client';

import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import Link from 'next/link';
import type { TopicMeta, Level } from '@/lib/types';
import type { Locale } from '@/lib/i18n/config';
import { useProgress } from '@/hooks/useProgress';
import { useTranslation } from '@/contexts/LocaleContext';

const LEVELS: Level[] = ['debutant', 'intermediaire', 'avance'];

const LEVEL_CONFIG: Record<Level, {
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
    icon: '\uD83D\uDFE2',
    headerBorder: 'border-emerald-300 dark:border-emerald-700',
    headerText: 'text-emerald-700 dark:text-emerald-400',
    cardBorder: 'border-emerald-200 dark:border-emerald-800',
    hoverRing: 'ring-2 ring-emerald-300/60 dark:ring-emerald-600/60',
    arrowColor: '#10b981',
    arrowColorDark: '#34d399',
    markerId: 'emerald',
  },
  intermediaire: {
    icon: '\uD83D\uDFE1',
    headerBorder: 'border-amber-300 dark:border-amber-700',
    headerText: 'text-amber-700 dark:text-amber-400',
    cardBorder: 'border-amber-200 dark:border-amber-800',
    hoverRing: 'ring-2 ring-amber-300/60 dark:ring-amber-600/60',
    arrowColor: '#f59e0b',
    arrowColorDark: '#fbbf24',
    markerId: 'amber',
  },
  avance: {
    icon: '\uD83D\uDFE3',
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

export default function LearningPath({ topics, locale = 'fr' }: { topics: TopicMeta[]; locale?: Locale }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef(new Map<string, HTMLDivElement>());

  const [arrows, setArrows] = useState<ArrowData[]>([]);
  const [hoveredTopic, setHoveredTopic] = useState<string | null>(null);
  const [isDark, setIsDark] = useState(false);

  const { completed, toggleCompleted } = useProgress();
  const { t } = useTranslation();

  const topicsByLevel = useMemo(() => {
    const map = new Map<Level, TopicMeta[]>();
    LEVELS.forEach(l => map.set(l, []));
    topics.forEach(tp => map.get(tp.level)?.push(tp));
    return map;
  }, [topics]);

  const dependentsOf = useMemo(() => {
    const map = new Map<string, string[]>();
    topics.forEach(tp => {
      tp.prerequisites.forEach(prereq => {
        if (!map.has(prereq)) map.set(prereq, []);
        map.get(prereq)!.push(tp.slug);
      });
    });
    return map;
  }, [topics]);

  useEffect(() => {
    const update = () => setIsDark(document.documentElement.classList.contains('dark'));
    update();
    const obs = new MutationObserver(update);
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => obs.disconnect();
  }, []);

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

        const fromLevel = topics.find(tp => tp.slug === prereqSlug)?.level;
        const sameColumn = fromLevel === topic.level;

        let path: string;

        if (sameColumn) {
          const x1 = fr.left - cr.left;
          const y1 = fr.top + fr.height / 2 - cr.top;
          const x2 = tr.left - cr.left;
          const y2 = tr.top + tr.height / 2 - cr.top;
          const bulge = -40;
          path = `M ${x1} ${y1} C ${x1 + bulge} ${y1}, ${x2 + bulge} ${y2}, ${x2} ${y2}`;
        } else {
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

  const handleToggle = useCallback((slug: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleCompleted(slug);
  }, [toggleCompleted]);

  const connectedSlugs = useMemo(() => {
    if (!hoveredTopic) return null;
    const set = new Set<string>();
    set.add(hoveredTopic);
    const topic = topics.find(tp => tp.slug === hoveredTopic);
    topic?.prerequisites.forEach(p => set.add(p));
    dependentsOf.get(hoveredTopic)?.forEach(d => set.add(d));
    return set;
  }, [hoveredTopic, topics, dependentsOf]);

  const completedCount = completed.size;
  const totalCount = topics.length;
  const progressPct = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  const hoveredLevel = hoveredTopic
    ? topics.find(tp => tp.slug === hoveredTopic)?.level ?? null
    : null;
  const defaultArrowColor = isDark ? '#374151' : '#d1d5db';
  const highlightArrowColor = hoveredLevel
    ? (isDark ? LEVEL_CONFIG[hoveredLevel].arrowColorDark : LEVEL_CONFIG[hoveredLevel].arrowColor)
    : defaultArrowColor;
  const highlightMarkerId = hoveredLevel ? LEVEL_CONFIG[hoveredLevel].markerId : 'default';

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {t('parcours.progression')}
          </span>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {t('parcours.topicsCompleted', { count: completedCount, total: totalCount })}
          </span>
        </div>
        <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-emerald-500 via-amber-500 to-purple-500 rounded-full transition-all duration-500"
            style={{ width: `${progressPct}%` }}
          />
        </div>
      </div>

      <div ref={containerRef} className="relative">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {LEVELS.map(level => {
            const cfg = LEVEL_CONFIG[level];
            const items = topicsByLevel.get(level) || [];

            return (
              <div key={level} className="space-y-3">
                <div className={`flex items-center gap-2 pb-2 border-b-2 ${cfg.headerBorder}`}>
                  <span>{cfg.icon}</span>
                  <h3 className={`font-semibold ${cfg.headerText}`}>{t(`levels.${level}`)}</h3>
                  <span className="text-xs text-gray-400 dark:text-gray-500 ml-auto">
                    {t('parcours.topicsCount', { count: items.length })}
                  </span>
                </div>

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
                        href={`/${locale}/topics/${topic.slug}`}
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

                          <button
                            onClick={e => handleToggle(topic.slug, e)}
                            className={[
                              'flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-200',
                              isDone
                                ? 'bg-emerald-500 border-emerald-500 text-white'
                                : 'border-gray-300 dark:border-gray-600 hover:border-emerald-400 dark:hover:border-emerald-500',
                            ].join(' ')}
                            title={isDone ? t('parcours.markUndone') : t('parcours.markDone')}
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

      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-gray-500 dark:text-gray-400 pt-4 border-t border-gray-200 dark:border-gray-700">
        <span>{LEVEL_CONFIG.debutant.icon} {t('levels.debutant')}</span>
        <span>{LEVEL_CONFIG.intermediaire.icon} {t('levels.intermediaire')}</span>
        <span>{LEVEL_CONFIG.avance.icon} {t('levels.avance')}</span>
        <span className="hidden md:inline text-gray-300 dark:text-gray-600">|</span>
        <span className="hidden md:flex items-center gap-1.5">
          <svg className="w-5 h-1" viewBox="0 0 20 4">
            <path d="M0 2 L20 2" stroke="currentColor" strokeWidth="1.5" />
            <path d="M16 0 L20 2 L16 4Z" fill="currentColor" />
          </svg>
          {t('parcours.legendPrerequisites')}
        </span>
        <span className="text-gray-300 dark:text-gray-600">|</span>
        <span className="flex items-center gap-1.5">
          <span className="inline-flex w-4 h-4 rounded-full bg-emerald-500 items-center justify-center">
            <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </span>
          {t('parcours.legendDone')}
        </span>
      </div>
    </div>
  );
}
