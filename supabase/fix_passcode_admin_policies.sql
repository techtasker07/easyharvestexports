insert into storage.buckets (id, name, public)
values ('site-assets', 'site-assets', true)
on conflict (id) do update set public = true;

drop policy if exists "Passcode anon uploads site assets" on storage.objects;
create policy "Passcode anon uploads site assets"
on storage.objects
for insert
to anon
with check (bucket_id = 'site-assets');

drop policy if exists "Passcode anon updates site assets" on storage.objects;
create policy "Passcode anon updates site assets"
on storage.objects
for update
to anon
using (bucket_id = 'site-assets')
with check (bucket_id = 'site-assets');

drop policy if exists "Passcode anon deletes site assets" on storage.objects;
create policy "Passcode anon deletes site assets"
on storage.objects
for delete
to anon
using (bucket_id = 'site-assets');

drop policy if exists "Passcode anon inserts products" on public.products;
create policy "Passcode anon inserts products"
on public.products
for insert
to anon
with check (true);

drop policy if exists "Passcode anon updates products" on public.products;
create policy "Passcode anon updates products"
on public.products
for update
to anon
using (true)
with check (true);

drop policy if exists "Passcode anon deletes products" on public.products;
create policy "Passcode anon deletes products"
on public.products
for delete
to anon
using (true);

drop policy if exists "Passcode anon inserts posts" on public.posts;
create policy "Passcode anon inserts posts"
on public.posts
for insert
to anon
with check (true);

drop policy if exists "Passcode anon updates posts" on public.posts;
create policy "Passcode anon updates posts"
on public.posts
for update
to anon
using (true)
with check (true);

drop policy if exists "Passcode anon deletes posts" on public.posts;
create policy "Passcode anon deletes posts"
on public.posts
for delete
to anon
using (true);

drop policy if exists "Passcode anon updates quotes" on public.quotes;
create policy "Passcode anon updates quotes"
on public.quotes
for update
to anon
using (true)
with check (true);

drop policy if exists "Passcode anon inserts quote messages" on public.quote_messages;
create policy "Passcode anon inserts quote messages"
on public.quote_messages
for insert
to anon
with check (true);

alter table public.comments add column if not exists admin_reply text;
alter table public.comments add column if not exists admin_replied_at timestamptz;

drop policy if exists "Passcode anon updates comments" on public.comments;
create policy "Passcode anon updates comments"
on public.comments
for update
to anon
using (true)
with check (true);
