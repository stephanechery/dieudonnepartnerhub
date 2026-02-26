-- dieudonnepartnerhub production schema
-- Run in Supabase SQL editor

create extension if not exists pgcrypto;

create table if not exists public.partner_profiles (
  uid uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  display_name text,
  provider text,
  profile_data jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  last_active_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_partner_profiles_last_active_at
  on public.partner_profiles (last_active_at desc);

create index if not exists idx_partner_profiles_profile_data_gin
  on public.partner_profiles using gin (profile_data);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_partner_profiles_updated_at on public.partner_profiles;
create trigger trg_partner_profiles_updated_at
before update on public.partner_profiles
for each row
execute function public.set_updated_at();

alter table public.partner_profiles enable row level security;

-- Users can read only their own profile
drop policy if exists "partner_profiles_select_own" on public.partner_profiles;
create policy "partner_profiles_select_own"
on public.partner_profiles
for select
using (auth.uid() = uid);

-- Users can insert only their own profile
drop policy if exists "partner_profiles_insert_own" on public.partner_profiles;
create policy "partner_profiles_insert_own"
on public.partner_profiles
for insert
with check (auth.uid() = uid);

-- Users can update only their own profile
drop policy if exists "partner_profiles_update_own" on public.partner_profiles;
create policy "partner_profiles_update_own"
on public.partner_profiles
for update
using (auth.uid() = uid)
with check (auth.uid() = uid);

revoke all on public.partner_profiles from anon;
grant select, insert, update on public.partner_profiles to authenticated;
