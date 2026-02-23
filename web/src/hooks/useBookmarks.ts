'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';

export interface Bookmark {
  item_type: 'topic' | 'paper';
  topic_slug: string;
  paper_slug: string | null;
  created_at: string;
}

export function useBookmarks() {
  const { user } = useAuth();
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [loading, setLoading] = useState(true);

  // Load bookmarks from Supabase
  useEffect(() => {
    if (!user) {
      setBookmarks([]);
      setLoading(false);
      return;
    }

    supabase
      .from('bookmarks')
      .select('item_type, topic_slug, paper_slug, created_at')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .then(({ data }) => {
        setBookmarks((data as Bookmark[]) ?? []);
        setLoading(false);
      });
  }, [user]);

  const isBookmarked = useCallback((topicSlug: string, paperSlug?: string | null): boolean => {
    return bookmarks.some(b =>
      b.topic_slug === topicSlug &&
      (paperSlug ? b.paper_slug === paperSlug : b.item_type === 'topic')
    );
  }, [bookmarks]);

  const toggleBookmark = useCallback(async (topicSlug: string, paperSlug?: string | null) => {
    if (!user) return;

    const itemType = paperSlug ? 'paper' : 'topic';
    const existing = bookmarks.find(b =>
      b.topic_slug === topicSlug &&
      (paperSlug ? b.paper_slug === paperSlug : b.item_type === 'topic')
    );

    if (existing) {
      // Remove
      setBookmarks(prev => prev.filter(b => b !== existing));
      const query = supabase
        .from('bookmarks')
        .delete()
        .eq('user_id', user.id)
        .eq('item_type', itemType)
        .eq('topic_slug', topicSlug);
      if (paperSlug) {
        await query.eq('paper_slug', paperSlug);
      } else {
        await query.is('paper_slug', null);
      }
    } else {
      // Add
      const newBookmark: Bookmark = {
        item_type: itemType,
        topic_slug: topicSlug,
        paper_slug: paperSlug ?? null,
        created_at: new Date().toISOString(),
      };
      setBookmarks(prev => [newBookmark, ...prev]);
      await supabase.from('bookmarks').insert({
        user_id: user.id,
        item_type: itemType,
        topic_slug: topicSlug,
        paper_slug: paperSlug ?? null,
      });
    }
  }, [user, bookmarks]);

  return { bookmarks, isBookmarked, toggleBookmark, loading };
}
