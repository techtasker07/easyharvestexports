# EasyHarvest Exports

Modern Vercel-ready website for EasyHarvest Exports with public product pages, interactive posts, quote submission, quote tracking, and an owner admin console.

## Stack

- Next.js App Router
- TypeScript
- Supabase Auth and Database
- Vercel deployment

## Local setup

```powershell
npm install
npm run dev
```

Open `http://localhost:3000`.

## Supabase setup

1. Open Supabase SQL Editor.
2. Run `supabase/schema.sql`.
3. Add the owner email:

```sql
insert into public.admin_users (email)
values ('owner@example.com')
on conflict (email) do nothing;
```

4. In Supabase Auth, enable Email OTP magic links.
5. Set Vercel environment variables from `.env.example`.

## Deployment

Deploy the project to Vercel, then point `www.easyharvestexports.com` to the Vercel project from the domain vendor DNS settings.
