'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';

const STORAGE_KEY = 'scibase-progress';

export function useProgress() {
  const { user } = useAuth();
  const [completed, setCompleted] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  // Load progress
  useEffect(() => {
    if (user) {
      // Logged in: load from Supabase
      supabase
        .from('topic_progress')
        .select('topic_slug')
        .eq('user_id', user.id)
        .then(({ data }) => {
          const slugs = new Set(data?.map(d => d.topic_slug) ?? []);
          setCompleted(slugs);
          // Also update localStorage cache
          try { localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(slugs))); } catch {}
          setLoading(false);
        });
    } else {
      // Anonymous: load from localStorage
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) setCompleted(new Set(JSON.parse(raw)));
      } catch {}
      setLoading(false);
    }
  }, [user]);

  const toggleCompleted = useCallback((slug: string) => {
    setCompleted(prev => {
      const next = new Set(prev);
      const wasCompleted = next.has(slug);

      if (wasCompleted) {
        next.delete(slug);
      } else {
        next.add(slug);
      }

      // Persist to localStorage (always, as cache)
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(next))); } catch {}

      // Persist to Supabase if logged in
      if (user) {
        if (wasCompleted) {
          supabase.from('topic_progress')
            .delete()
            .eq('user_id', user.id)
            .eq('topic_slug', slug)
            .then(() => {});
        } else {
          supabase.from('topic_progress')
            .insert({ user_id: user.id, topic_slug: slug })
            .then(() => {});
        }
      }

      return next;
    });
  }, [user]);

  return { completed, toggleCompleted, loading };
}
