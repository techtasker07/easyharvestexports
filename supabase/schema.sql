create extension if not exists pgcrypto;

insert into storage.buckets (id, name, public)
values ('site-assets', 'site-assets', true)
on conflict (id) do update set public = true;

create table if not exists public.admin_users (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  created_at timestamptz not null default now()
);

create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.admin_users
    where lower(email) = lower(coalesce(auth.jwt() ->> 'email', ''))
  );
$$;

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  summary text not null,
  description text not null default '',
  image_url text not null default '',
  specs text[] not null default '{}',
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.posts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  subtitle text,
  body text not null,
  image_url text not null default '',
  cta_label text,
  cta_url text,
  published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.posts add column if not exists subtitle text;

create table if not exists public.comments (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references public.posts(id) on delete cascade,
  author_name text not null,
  body text not null,
  admin_reply text,
  admin_replied_at timestamptz,
  visitor_id text,
  created_at timestamptz not null default now()
);

alter table public.comments add column if not exists admin_reply text;
alter table public.comments add column if not exists admin_replied_at timestamptz;

create type public.post_reaction_kind as enum ('like', 'dislike', 'share');

create table if not exists public.post_reactions (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references public.posts(id) on delete cascade,
  reaction public.post_reaction_kind not null,
  visitor_id text,
  created_at timestamptz not null default now()
);

create table if not exists public.quotes (
  id uuid primary key default gen_random_uuid(),
  tracking_code text not null unique,
  buyer_name text not null,
  email text not null,
  contact_number text,
  company text,
  product_interest text not null,
  quantity text not null,
  destination text not null,
  message text not null,
  status text not null default 'submitted',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.quotes add column if not exists contact_number text;

create table if not exists public.quote_messages (
  id uuid primary key default gen_random_uuid(),
  quote_id uuid not null references public.quotes(id) on delete cascade,
  sender_name text not null,
  sender_role text not null check (sender_role in ('buyer', 'admin')),
  message text not null,
  created_at timestamptz not null default now()
);

alter table public.admin_users enable row level security;
alter table public.products enable row level security;
alter table public.posts enable row level security;
alter table public.comments enable row level security;
alter table public.post_reactions enable row level security;
alter table public.quotes enable row level security;
alter table public.quote_messages enable row level security;

create policy "Admins can read admin users" on public.admin_users for select using (public.is_admin());

create policy "Anyone can read site assets" on storage.objects for select using (bucket_id = 'site-assets');
create policy "Admins upload site assets" on storage.objects for insert with check (bucket_id = 'site-assets' and public.is_admin());
create policy "Admins update site assets" on storage.objects for update using (bucket_id = 'site-assets' and public.is_admin()) with check (bucket_id = 'site-assets' and public.is_admin());
create policy "Admins delete site assets" on storage.objects for delete using (bucket_id = 'site-assets' and public.is_admin());

drop policy if exists "Passcode dashboard uploads site assets" on storage.objects;
create policy "Passcode dashboard uploads site assets" on storage.objects for insert with check (bucket_id = 'site-assets');
drop policy if exists "Passcode anon uploads site assets" on storage.objects;
create policy "Passcode anon uploads site assets" on storage.objects for insert to anon with check (bucket_id = 'site-assets');

create policy "Anyone can read active products" on public.products for select using (active = true or public.is_admin());
create policy "Admins manage products" on public.products for all using (public.is_admin()) with check (public.is_admin());
drop policy if exists "Passcode dashboard can add products" on public.products;
create policy "Passcode dashboard can add products" on public.products for insert with check (true);
drop policy if exists "Passcode anon inserts products" on public.products;
create policy "Passcode anon inserts products" on public.products for insert to anon with check (true);

create policy "Anyone can read published posts" on public.posts for select using (published = true or public.is_admin());
create policy "Admins manage posts" on public.posts for all using (public.is_admin()) with check (public.is_admin());
drop policy if exists "Passcode dashboard can add posts" on public.posts;
create policy "Passcode dashboard can add posts" on public.posts for insert with check (true);
drop policy if exists "Passcode anon inserts posts" on public.posts;
create policy "Passcode anon inserts posts" on public.posts for insert to anon with check (true);

create policy "Anyone can read comments" on public.comments for select using (true);
create policy "Anyone can add comments" on public.comments for insert with check (true);
create policy "Admins manage comments" on public.comments for all using (public.is_admin()) with check (public.is_admin());
drop policy if exists "Passcode anon updates comments" on public.comments;
create policy "Passcode anon updates comments" on public.comments for update to anon using (true) with check (true);

create policy "Anyone can read reactions" on public.post_reactions for select using (true);
create policy "Anyone can add reactions" on public.post_reactions for insert with check (true);
create policy "Admins manage reactions" on public.post_reactions for all using (public.is_admin()) with check (public.is_admin());

create policy "Anyone can submit quotes" on public.quotes for insert with check (true);
create policy "Admins manage quotes" on public.quotes for all using (public.is_admin()) with check (public.is_admin());
create policy "Quote tracking can read by code" on public.quotes for select using (true);
drop policy if exists "Passcode dashboard can update quotes" on public.quotes;
create policy "Passcode dashboard can update quotes" on public.quotes for update using (true) with check (true);
drop policy if exists "Passcode anon updates quotes" on public.quotes;
create policy "Passcode anon updates quotes" on public.quotes for update to anon using (true) with check (true);

create policy "Anyone can read quote messages" on public.quote_messages for select using (true);
create policy "Anyone can add buyer quote messages" on public.quote_messages for insert with check (sender_role = 'buyer' or public.is_admin());
create policy "Admins manage quote messages" on public.quote_messages for all using (public.is_admin()) with check (public.is_admin());
drop policy if exists "Passcode dashboard can add quote messages" on public.quote_messages;
create policy "Passcode dashboard can add quote messages" on public.quote_messages for insert with check (true);
drop policy if exists "Passcode anon inserts quote messages" on public.quote_messages;
create policy "Passcode anon inserts quote messages" on public.quote_messages for insert to anon with check (true);

insert into public.products (name, slug, summary, description, image_url, specs)
values
('Dried Hibiscus', 'dried-hibiscus', 'Deep red, export-ready hibiscus flowers sorted for color, aroma, and consistent moisture.', 'Sourced from Nigerian growing clusters and prepared for beverage, food, and wellness buyers that need clean, dependable batches.', '/products/hibiscus.webp', array['Whole dried petals','Moisture-controlled','Bulk export packaging','Documentation support']),
('Dried Ginger', 'dried-ginger', 'Split or whole ginger with strong aroma, careful handling, and reliable shipment preparation.', 'Prepared for spice processors, distributors, and industrial buyers seeking pungency, cleanliness, and traceable sourcing.', '/products/ginger.jpeg', array['Split or whole','Fresh and dried options','Sorted for defects','Container-ready supply']),
('Sesame Seeds', 'sesame-seeds', 'Natural or hulled sesame seed supply for global buyers that need purity and steady fulfillment.', 'Quality-checked sesame sourced through verified partners and prepared for international food and oilseed markets.', '/products/sesame.jpg', array['Natural or hulled','Purity checks','Export documentation','Flexible lot sizes']),
('Cocoa Beans', 'cocoa-beans', 'Dried and fermented cocoa beans selected for flavor, quality, and export readiness.', 'Built for cocoa processors and buyers who need a responsive Nigerian supply partner with shipment coordination.', '/products/cocoa.webp', array['Dried or fermented','Bagged lots','Quality inspection','Shipment support'])
on conflict (slug) do update set
  name = excluded.name,
  summary = excluded.summary,
  description = excluded.description,
  image_url = excluded.image_url,
  specs = excluded.specs,
  active = true,
  updated_at = now();

insert into public.posts (title, body, image_url, cta_label, cta_url)
select 'New hibiscus lots are being prepared for export buyers', 'Our sourcing team is validating color, dryness, and handling quality for the next hibiscus batch. Buyers can request destination-specific quotes and documentation guidance.', '/products/hibiscus.webp', 'Request hibiscus quote', '/contact'
where not exists (select 1 from public.posts where title = 'New hibiscus lots are being prepared for export buyers');

insert into public.posts (title, body, image_url, cta_label, cta_url)
select 'How we keep international buyers updated after a quote', 'Every submitted quote receives a tracking code. Buyers can return to the website, check response status, and continue the conversation with the export team.', '/easyharvest-logo.webp', 'Track a quote', '/track'
where not exists (select 1 from public.posts where title = 'How we keep international buyers updated after a quote');

-- The app admin dashboard now uses the passcode Admin@.7 instead of Supabase email magic links.
-- Because a client-side passcode is not visible to Postgres RLS, insert/upload policies above allow the anon key to add dashboard-created posts/products/assets.
