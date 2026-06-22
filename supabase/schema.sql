-- ============================================================================
-- TradeEdge — Supabase schema
-- Run this in the Supabase dashboard → SQL Editor → New query → Run.
-- Safe to re-run: it uses "if not exists" / "drop policy if exists".
-- ============================================================================

-- Each entity is stored as one row: a client-generated text id, the owner's
-- user_id, and the full object as jsonb. RLS scopes every row to its owner.

create extension if not exists "pgcrypto";

-- ── helper: generic owned table ────────────────────────────────────────────
create table if not exists public.accounts (
  id          text primary key,
  user_id     uuid not null default auth.uid() references auth.users(id) on delete cascade,
  data        jsonb not null,
  updated_at  timestamptz not null default now()
);

create table if not exists public.trades (
  id          text primary key,
  user_id     uuid not null default auth.uid() references auth.users(id) on delete cascade,
  data        jsonb not null,
  updated_at  timestamptz not null default now()
);

create table if not exists public.strategies (
  id          text primary key,
  user_id     uuid not null default auth.uid() references auth.users(id) on delete cascade,
  data        jsonb not null,
  updated_at  timestamptz not null default now()
);

create table if not exists public.missed_trades (
  id          text primary key,
  user_id     uuid not null default auth.uid() references auth.users(id) on delete cascade,
  data        jsonb not null,
  updated_at  timestamptz not null default now()
);

create table if not exists public.day_reviews (
  id          text primary key,
  user_id     uuid not null default auth.uid() references auth.users(id) on delete cascade,
  data        jsonb not null,
  updated_at  timestamptz not null default now()
);

create table if not exists public.profiles (
  user_id      uuid primary key references auth.users(id) on delete cascade,
  custom_tags  text[] not null default '{}'
);

-- indexes for per-user reads
create index if not exists accounts_user_idx       on public.accounts(user_id);
create index if not exists trades_user_idx         on public.trades(user_id);
create index if not exists strategies_user_idx     on public.strategies(user_id);
create index if not exists missed_trades_user_idx  on public.missed_trades(user_id);
create index if not exists day_reviews_user_idx    on public.day_reviews(user_id);

-- ── Row Level Security ─────────────────────────────────────────────────────
alter table public.accounts       enable row level security;
alter table public.trades         enable row level security;
alter table public.strategies     enable row level security;
alter table public.missed_trades  enable row level security;
alter table public.day_reviews    enable row level security;
alter table public.profiles       enable row level security;

do $$
declare t text;
begin
  foreach t in array array['accounts','trades','strategies','missed_trades','day_reviews']
  loop
    execute format('drop policy if exists "owner_all" on public.%I;', t);
    execute format(
      'create policy "owner_all" on public.%I
         for all
         using (auth.uid() = user_id)
         with check (auth.uid() = user_id);', t);
  end loop;
end$$;

drop policy if exists "owner_profile" on public.profiles;
create policy "owner_profile" on public.profiles
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- ── Storage: screenshots bucket (private, per-user folders) ─────────────────
insert into storage.buckets (id, name, public)
values ('screenshots', 'screenshots', false)
on conflict (id) do nothing;

-- Each user can only touch objects under a folder named after their uid:
--   screenshots/<auth.uid()>/<imageId>.jpg
drop policy if exists "screenshots_read"   on storage.objects;
drop policy if exists "screenshots_write"  on storage.objects;
drop policy if exists "screenshots_update" on storage.objects;
drop policy if exists "screenshots_delete" on storage.objects;

create policy "screenshots_read" on storage.objects
  for select using (
    bucket_id = 'screenshots' and (storage.foldername(name))[1] = auth.uid()::text
  );
create policy "screenshots_write" on storage.objects
  for insert with check (
    bucket_id = 'screenshots' and (storage.foldername(name))[1] = auth.uid()::text
  );
create policy "screenshots_update" on storage.objects
  for update using (
    bucket_id = 'screenshots' and (storage.foldername(name))[1] = auth.uid()::text
  );
create policy "screenshots_delete" on storage.objects
  for delete using (
    bucket_id = 'screenshots' and (storage.foldername(name))[1] = auth.uid()::text
  );

-- Done.
