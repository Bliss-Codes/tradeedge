-- One-click MT5 connect: each linked account gets a private token baked into its EA file.
-- The EA sends only the token; the server looks up the owner + account from it.
-- Safe to re-run.
create table if not exists public.mt5_links (
  token       text primary key,
  user_id     uuid not null default auth.uid() references auth.users(id) on delete cascade,
  account_id  text not null,
  revoked     boolean not null default false,
  created_at  timestamptz not null default now(),
  last_seen   timestamptz,              -- updated by the EA heartbeat (every minute) and on each sync
  login       text,
  server      text,
  balance     numeric
);
create index if not exists mt5_links_user_idx on public.mt5_links(user_id);
alter table public.mt5_links enable row level security;
drop policy if exists "owner_all" on public.mt5_links;
create policy "owner_all" on public.mt5_links
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
