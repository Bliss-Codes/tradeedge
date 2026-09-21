-- ─────────────────────────────────────────────────────────────────────────────
-- TradeEdge Pro — Supabase schema
-- Run once on a new project: Dashboard → SQL Editor → paste → Run.
-- Safe to re-run (all statements are idempotent).
-- ─────────────────────────────────────────────────────────────────────────────

-- Profiles table: one row per user.
-- custom_tags  → persisted tag list
-- profile      → jsonb blob for customViolations, customEmotions, display prefs
create table if not exists public.profiles (
  user_id     uuid primary key references auth.users(id) on delete cascade,
  custom_tags text[]  not null default '{}',
  profile     jsonb   not null default '{}'::jsonb
);
alter table public.profiles
  add column if not exists profile jsonb not null default '{}'::jsonb;

-- Generic entity tables (accounts, trades, strategies, missed_trades, day_reviews).
-- Each row: id (client-generated), user_id (FK to auth.users), data (JSONB).
create table if not exists public.accounts (
  id          text    primary key,
  user_id     uuid    not null references auth.users(id) on delete cascade,
  data        jsonb   not null,
  updated_at  timestamptz not null default now()
);
create table if not exists public.trades (
  id          text    primary key,
  user_id     uuid    not null references auth.users(id) on delete cascade,
  data        jsonb   not null,
  updated_at  timestamptz not null default now()
);
create table if not exists public.strategies (
  id          text    primary key,
  user_id     uuid    not null references auth.users(id) on delete cascade,
  data        jsonb   not null,
  updated_at  timestamptz not null default now()
);
create table if not exists public.missed_trades (
  id          text    primary key,
  user_id     uuid    not null references auth.users(id) on delete cascade,
  data        jsonb   not null,
  updated_at  timestamptz not null default now()
);
create table if not exists public.day_reviews (
  id          text    primary key,
  user_id     uuid    not null references auth.users(id) on delete cascade,
  data        jsonb   not null,
  updated_at  timestamptz not null default now()
);

-- Auto-update updated_at on upsert.
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end;
$$;
do $$ declare t text;
begin
  foreach t in array array['accounts','trades','strategies','missed_trades','day_reviews'] loop
    execute format(
      'create trigger if not exists set_updated_at before update on public.%I
       for each row execute function public.set_updated_at()', t);
  end loop;
end $$;

-- Row-Level Security: each user can only access their own rows.
alter table public.profiles     enable row level security;
alter table public.accounts     enable row level security;
alter table public.trades       enable row level security;
alter table public.strategies   enable row level security;
alter table public.missed_trades enable row level security;
alter table public.day_reviews  enable row level security;

create policy if not exists "own profile"      on public.profiles      using (user_id = auth.uid());
create policy if not exists "own accounts"     on public.accounts      using (user_id = auth.uid());
create policy if not exists "own trades"       on public.trades        using (user_id = auth.uid());
create policy if not exists "own strategies"   on public.strategies    using (user_id = auth.uid());
create policy if not exists "own missed"       on public.missed_trades using (user_id = auth.uid());
create policy if not exists "own reviews"      on public.day_reviews   using (user_id = auth.uid());

-- Screenshots bucket (if you use Supabase Storage for images).
insert into storage.buckets (id, name, public)
  values ('screenshots', 'screenshots', false)
  on conflict (id) do nothing;
create policy if not exists "own screenshots"
  on storage.objects for all
  using (bucket_id = 'screenshots' and (storage.foldername(name))[1] = auth.uid()::text);
