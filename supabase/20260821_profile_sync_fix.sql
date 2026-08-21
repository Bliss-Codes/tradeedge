-- TradeEdge profile sync fix for existing Supabase projects.
-- Run this once in Supabase SQL Editor.

alter table public.profiles
  add column if not exists profile jsonb not null default '{}'::jsonb;

alter table public.profiles enable row level security;

drop policy if exists "owner_profile" on public.profiles;
create policy "owner_profile" on public.profiles
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
