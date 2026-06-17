insert into storage.buckets (id, name, public)
values ('site-assets', 'site-assets', true)
on conflict (id) do update set public = true;

drop policy if exists "Passcode dashboard uploads site assets" on storage.objects;
create policy "Passcode dashboard uploads site assets"
on storage.objects
for insert
with check (bucket_id = 'site-assets');

drop policy if exists "Passcode dashboard can add products" on public.products;
create policy "Passcode dashboard can add products"
on public.products
for insert
with check (true);

drop policy if exists "Passcode dashboard can add posts" on public.posts;
create policy "Passcode dashboard can add posts"
on public.posts
for insert
with check (true);

drop policy if exists "Passcode dashboard can update quotes" on public.quotes;
create policy "Passcode dashboard can update quotes"
on public.quotes
for update
using (true)
with check (true);

drop policy if exists "Passcode dashboard can add quote messages" on public.quote_messages;
create policy "Passcode dashboard can add quote messages"
on public.quote_messages
for insert
with check (true);
