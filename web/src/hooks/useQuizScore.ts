'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';

export function useQuizScore(topicSlug: string) {
  const { user } = useAuth();
  const [bestScore, setBestScore] = useState<number | null>(null);
  const [bestTotal, setBestTotal] = useState<number | null>(null);

  const storageKey = `scibase-quiz-${topicSlug}`;

  // Load best score
  useEffect(() => {
    if (user) {
      // Logged in: load from Supabase
      supabase
        .from('quiz_scores')
        .select('score, total')
        .eq('user_id', user.id)
        .eq('topic_slug', topicSlug)
        .order('score', { ascending: false })
        .limit(1)
        .then(({ data }) => {
          if (data && data.length > 0) {
            setBestScore(data[0].score);
            setBestTotal(data[0].total);
            // Update localStorage cache
            try { localStorage.setItem(storageKey, data[0].score.toString()); } catch {}
          } else {
            // Check localStorage for any cached value
            try {
              const saved = localStorage.getItem(storageKey);
              if (saved !== null) setBestScore(parseInt(saved, 10));
            } catch {}
          }
        });
    } else {
      // Anonymous: load from localStorage
      try {
        const saved = localStorage.getItem(storageKey);
        if (saved !== null) setBestScore(parseInt(saved, 10));
      } catch {}
    }
  }, [user, topicSlug, storageKey]);

  const saveScore = useCallback((score: number, total: number) => {
    // Update best score locally
    if (bestScore === null || score > bestScore) {
      setBestScore(score);
      setBestTotal(total);
    }

    // Persist to localStorage
    try {
      const current = localStorage.getItem(storageKey);
      const currentBest = current !== null ? parseInt(current, 10) : 0;
      if (score > currentBest) {
        localStorage.setItem(storageKey, score.toString());
      }
    } catch {}

    // Persist to Supabase if logged in
    if (user) {
      supabase.from('quiz_scores')
        .insert({
          user_id: user.id,
          topic_slug: topicSlug,
          score,
          total,
        })
        .then(() => {});
    }
  }, [user, topicSlug, storageKey, bestScore]);

  return { bestScore, bestTotal, saveScore };
}
