export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          display_name: string | null;
          avatar_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          display_name?: string | null;
          avatar_url?: string | null;
        };
        Update: {
          display_name?: string | null;
          avatar_url?: string | null;
          updated_at?: string;
        };
        Relationships: [];
      };
      topic_progress: {
        Row: {
          id: number;
          user_id: string;
          topic_slug: string;
          completed_at: string;
        };
        Insert: {
          user_id: string;
          topic_slug: string;
        };
        Update: {
          user_id?: string;
          topic_slug?: string;
          completed_at?: string;
        };
        Relationships: [];
      };
      quiz_scores: {
        Row: {
          id: number;
          user_id: string;
          topic_slug: string;
          score: number;
          total: number;
          completed_at: string;
        };
        Insert: {
          user_id: string;
          topic_slug: string;
          score: number;
          total: number;
        };
        Update: {
          user_id?: string;
          topic_slug?: string;
          score?: number;
          total?: number;
          completed_at?: string;
        };
        Relationships: [];
      };
      bookmarks: {
        Row: {
          id: number;
          user_id: string;
          item_type: 'topic' | 'paper';
          topic_slug: string;
          paper_slug: string | null;
          created_at: string;
        };
        Insert: {
          user_id: string;
          item_type: 'topic' | 'paper';
          topic_slug: string;
          paper_slug?: string | null;
        };
        Update: {
          user_id?: string;
          item_type?: 'topic' | 'paper';
          topic_slug?: string;
          paper_slug?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
  };
}
