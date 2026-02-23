'use client';

import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import type { User, Session } from '@supabase/supabase-js';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signInWithEmail: (email: string, password: string) => Promise<{ error: string | null }>;
  signUpWithEmail: (email: string, password: string) => Promise<{ error: string | null }>;
  signInWithProvider: (provider: 'google' | 'github') => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  loading: true,
  signInWithEmail: async () => ({ error: null }),
  signUpWithEmail: async () => ({ error: null }),
  signInWithProvider: async () => {},
  signOut: async () => {},
});

export const useAuth = () => useContext(AuthContext);

const MIGRATION_KEY = 'scibase-migrated';
const PROGRESS_KEY = 'scibase-progress';

async function migrateLocalStorage(userId: string) {
  // Skip if already migrated for this user
  try {
    if (localStorage.getItem(MIGRATION_KEY) === userId) return;
  } catch { return; }

  // Migrate topic progress
  try {
    const raw = localStorage.getItem(PROGRESS_KEY);
    if (raw) {
      const slugs: string[] = JSON.parse(raw);
      if (slugs.length > 0) {
        // Get existing progress
        const { data: existing } = await supabase
          .from('topic_progress')
          .select('topic_slug')
          .eq('user_id', userId);
        const existingSlugs = new Set(existing?.map(e => e.topic_slug) ?? []);
        const toInsert = slugs
          .filter(s => !existingSlugs.has(s))
          .map(topic_slug => ({ user_id: userId, topic_slug }));
        if (toInsert.length > 0) {
          await supabase.from('topic_progress').insert(toInsert);
        }
      }
    }
  } catch { /* ignore migration errors */ }

  // Migrate quiz scores
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (!key?.startsWith('scibase-quiz-')) continue;
      const topicSlug = key.replace('scibase-quiz-', '');
      const score = parseInt(localStorage.getItem(key) ?? '0', 10);
      if (score <= 0) continue;

      // Check if we have a better score in DB already
      const { data: existing } = await supabase
        .from('quiz_scores')
        .select('score')
        .eq('user_id', userId)
        .eq('topic_slug', topicSlug)
        .order('score', { ascending: false })
        .limit(1);

      const bestInDb = existing?.[0]?.score ?? 0;
      if (score > bestInDb) {
        // We don't know the total from localStorage, use 0 as marker
        await supabase.from('quiz_scores').insert({
          user_id: userId,
          topic_slug: topicSlug,
          score,
          total: 0, // unknown from localStorage
        });
      }
    }
  } catch { /* ignore migration errors */ }

  // Mark as migrated
  try {
    localStorage.setItem(MIGRATION_KEY, userId);
  } catch { /* ignore */ }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isSupabaseConfigured()) {
      setLoading(false);
      return;
    }

    // Get initial session
    supabase.auth.getSession().then(({ data: { session: s } }) => {
      setSession(s);
      setUser(s?.user ?? null);
      setLoading(false);
      if (s?.user) {
        migrateLocalStorage(s.user.id);
      }
    });

    // Listen to auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(s);
      setUser(s?.user ?? null);
      if (_event === 'SIGNED_IN' && s?.user) {
        migrateLocalStorage(s.user.id);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const signInWithEmail = useCallback(async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error: error?.message ?? null };
  }, []);

  const signUpWithEmail = useCallback(async (email: string, password: string) => {
    const { error } = await supabase.auth.signUp({ email, password });
    return { error: error?.message ?? null };
  }, []);

  const signInWithProvider = useCallback(async (provider: 'google' | 'github') => {
    await supabase.auth.signInWithOAuth({
      provider,
      options: { redirectTo: window.location.origin },
    });
  }, []);

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
  }, []);

  return (
    <AuthContext.Provider value={{ user, session, loading, signInWithEmail, signUpWithEmail, signInWithProvider, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}
