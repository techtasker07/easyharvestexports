-- Run this in Supabase after the existing EasyHarvest schema.
-- Adds an optional H2-style subtitle for rich home-page posts.

alter table public.posts add column if not exists subtitle text;
