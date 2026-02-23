-- ============================================
-- SciBase — Supabase Schema
-- ============================================
-- Exécuter ce SQL dans le SQL Editor de Supabase
-- après avoir créé le projet.
-- ============================================

-- 1. Profiles (auto-créé au signup)
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  display_name text,
  avatar_url text,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

alter table public.profiles enable row level security;

create policy "Users can view their own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update their own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
begin
  insert into public.profiles (id, display_name, avatar_url)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', new.raw_user_meta_data ->> 'name', split_part(new.email, '@', 1)),
    coalesce(new.raw_user_meta_data ->> 'avatar_url', null)
  );
  return new;
end;
$$;

create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- 2. Topic progress
create table if not exists public.topic_progress (
  id bigint generated always as identity primary key,
  user_id uuid references auth.users on delete cascade not null,
  topic_slug text not null,
  completed_at timestamptz default now() not null,
  unique (user_id, topic_slug)
);

alter table public.topic_progress enable row level security;

create policy "Users can view their own progress"
  on public.topic_progress for select
  using (auth.uid() = user_id);

create policy "Users can insert their own progress"
  on public.topic_progress for insert
  with check (auth.uid() = user_id);

create policy "Users can delete their own progress"
  on public.topic_progress for delete
  using (auth.uid() = user_id);

-- 3. Quiz scores
create table if not exists public.quiz_scores (
  id bigint generated always as identity primary key,
  user_id uuid references auth.users on delete cascade not null,
  topic_slug text not null,
  score integer not null,
  total integer not null,
  completed_at timestamptz default now() not null
);

alter table public.quiz_scores enable row level security;

create policy "Users can view their own scores"
  on public.quiz_scores for select
  using (auth.uid() = user_id);

create policy "Users can insert their own scores"
  on public.quiz_scores for insert
  with check (auth.uid() = user_id);

-- 4. Bookmarks
create table if not exists public.bookmarks (
  id bigint generated always as identity primary key,
  user_id uuid references auth.users on delete cascade not null,
  item_type text not null check (item_type in ('topic', 'paper')),
  topic_slug text not null,
  paper_slug text,
  created_at timestamptz default now() not null,
  unique (user_id, item_type, topic_slug, paper_slug)
);

alter table public.bookmarks enable row level security;

create policy "Users can view their own bookmarks"
  on public.bookmarks for select
  using (auth.uid() = user_id);

create policy "Users can insert their own bookmarks"
  on public.bookmarks for insert
  with check (auth.uid() = user_id);

create policy "Users can delete their own bookmarks"
  on public.bookmarks for delete
  using (auth.uid() = user_id);

-- Indexes for performance
create index if not exists idx_topic_progress_user on public.topic_progress (user_id);
create index if not exists idx_quiz_scores_user on public.quiz_scores (user_id);
create index if not exists idx_bookmarks_user on public.bookmarks (user_id);
