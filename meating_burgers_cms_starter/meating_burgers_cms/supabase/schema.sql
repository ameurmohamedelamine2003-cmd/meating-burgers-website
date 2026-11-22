-- Run this entire file in Supabase SQL Editor.
create table if not exists public.dishes (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  price numeric(10,2) not null default 0,
  image_url text,
  category text default 'Burgers',
  is_available boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.restaurant_settings (
  id integer primary key default 1 check (id = 1),
  name text not null default 'MEATING BURGERS',
  tagline text default 'BIG FLAVOR. NO SHORTCUTS.',
  address text default '31 NW 9th St, Miami, FL 33136',
  phone text default '+1 786-881-1473',
  hours text default 'Check our current hours before visiting.'
);

insert into public.restaurant_settings (id) values (1) on conflict (id) do nothing;

alter table public.dishes enable row level security;
alter table public.restaurant_settings enable row level security;

-- Public visitors can read available dishes and public restaurant details.
create policy "Public can read available dishes" on public.dishes
for select using (is_available = true or auth.uid() is not null);

create policy "Authenticated owner can add dishes" on public.dishes
for insert to authenticated with check (true);

create policy "Authenticated owner can update dishes" on public.dishes
for update to authenticated using (true) with check (true);

create policy "Authenticated owner can delete dishes" on public.dishes
for delete to authenticated using (true);

create policy "Public can read restaurant settings" on public.restaurant_settings
for select using (true);

create policy "Authenticated owner can update restaurant settings" on public.restaurant_settings
for update to authenticated using (true) with check (true);
