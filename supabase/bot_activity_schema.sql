-- Run this file in the Supabase SQL editor after the existing EasyHarvest schema.
-- It stores assistant transcripts plus anonymous visit/activity records for the passcode dashboard.

create table if not exists public.bot_messages (
  id uuid primary key default gen_random_uuid(),
  visitor_id text not null,
  session_id text not null,
  role text not null check (role in ('user', 'bot')),
  content text not null,
  intent_id text,
  route text,
  page_path text,
  created_at timestamptz not null default now()
);

create table if not exists public.site_activity_sessions (
  id uuid primary key default gen_random_uuid(),
  visitor_id text not null,
  session_id text not null unique,
  started_at timestamptz not null default now(),
  last_seen_at timestamptz not null default now(),
  duration_seconds integer not null default 0,
  page_views integer not null default 0,
  last_path text,
  user_agent text,
  created_at timestamptz not null default now()
);

create table if not exists public.site_activity_events (
  id uuid primary key default gen_random_uuid(),
  visitor_id text not null,
  session_id text not null,
  event_type text not null,
  event_label text not null,
  page_path text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists bot_messages_created_at_idx on public.bot_messages (created_at desc);
create index if not exists bot_messages_visitor_id_idx on public.bot_messages (visitor_id, created_at desc);
create index if not exists site_activity_sessions_last_seen_idx on public.site_activity_sessions (last_seen_at desc);
create index if not exists site_activity_events_created_at_idx on public.site_activity_events (created_at desc);

alter table public.bot_messages enable row level security;
alter table public.site_activity_sessions enable row level security;
alter table public.site_activity_events enable row level security;

drop policy if exists "Anyone can log bot messages" on public.bot_messages;
create policy "Anyone can log bot messages" on public.bot_messages for insert to anon with check (true);
drop policy if exists "Passcode dashboard reads bot messages" on public.bot_messages;
create policy "Passcode dashboard reads bot messages" on public.bot_messages for select to anon using (true);

drop policy if exists "Anyone can create activity sessions" on public.site_activity_sessions;
create policy "Anyone can create activity sessions" on public.site_activity_sessions for insert to anon with check (true);
drop policy if exists "Anyone can update own activity session" on public.site_activity_sessions;
create policy "Anyone can update own activity session" on public.site_activity_sessions for update to anon using (true) with check (true);
drop policy if exists "Passcode dashboard reads activity sessions" on public.site_activity_sessions;
create policy "Passcode dashboard reads activity sessions" on public.site_activity_sessions for select to anon using (true);

drop policy if exists "Anyone can log activity events" on public.site_activity_events;
create policy "Anyone can log activity events" on public.site_activity_events for insert to anon with check (true);
drop policy if exists "Passcode dashboard reads activity events" on public.site_activity_events;
create policy "Passcode dashboard reads activity events" on public.site_activity_events for select to anon using (true);
