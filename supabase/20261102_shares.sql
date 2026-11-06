-- Mentor sharing: read-only links. Safe to re-run.
create table if not exists public.shares (
  token       text primary key,
  user_id     uuid not null default auth.uid() references auth.users(id) on delete cascade,
  label       text,
  account_id  text,                      -- null = all accounts
  hide_money  boolean not null default true,
  expires_at  timestamptz,
  revoked     boolean not null default false,
  created_at  timestamptz not null default now()
);
create index if not exists shares_user_idx on public.shares(user_id);
alter table public.shares enable row level security;
drop policy if exists "owner_all" on public.shares;
create policy "owner_all" on public.shares
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
-- No anon policy on purpose: the public page reads through /api/share/[token]
-- with the server-only service-role key, after validating the token.
