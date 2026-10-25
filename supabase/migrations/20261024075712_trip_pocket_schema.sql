-- Trip Pocket: every row belongs to one signed-in user; RLS keeps each user's data private.
create table public.trips (
  id text primary key default gen_random_uuid()::text,
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  name text not null,
  destination text not null default '',
  start_date date not null,
  end_date date not null,
  home_currency text not null default 'SGD',
  local_currency text not null default 'SGD',
  budget numeric,
  scan_default text not null default '',
  people jsonb not null default '[{"id":"me","name":"You"}]',
  cover text,
  ideas jsonb not null default '[]',
  packing jsonb not null default '[]',
  bookings jsonb not null default '[]',
  notes text not null default '',
  example boolean not null default false,
  created_at timestamptz not null default now(),
  check (end_date >= start_date)
);

create table public.items (
  id text primary key default gen_random_uuid()::text,
  trip_id text not null references public.trips(id) on delete cascade,
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  day date not null,
  time text not null default '',
  title text not null,
  place text not null default '',
  type text not null default 'sightseeing',
  cost numeric,
  currency text not null default 'SGD',
  notes text not null default '',
  expense_id text,
  created_at timestamptz not null default now()
);

create table public.expenses (
  id text primary key default gen_random_uuid()::text,
  trip_id text not null references public.trips(id) on delete cascade,
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  date date not null,
  merchant text not null default '',
  amount numeric not null,
  currency text not null,
  home_currency text not null,
  rate numeric,
  rate_source text,
  rate_date date,
  rate_fetched_at timestamptz,
  rate_manual boolean not null default false,
  home_amount numeric,
  category text not null default 'other',
  paid_by text,
  split_among jsonb not null default '[]',
  receipt text,
  item_id text,
  note text not null default '',
  needs_review boolean not null default false,
  created_at timestamptz not null default now()
);

create table public.photos (
  id text primary key default gen_random_uuid()::text,
  trip_id text not null references public.trips(id) on delete cascade,
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  path text not null,
  caption text not null default '',
  day date,
  created_at timestamptz not null default now()
);

-- Each user's own cache of daily rate tables (base EUR), so one user can't affect another's rates.
create table public.rates (
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  date date not null,
  base text not null default 'EUR',
  source text not null,
  rates jsonb not null,
  fetched_at timestamptz not null default now(),
  primary key (user_id, date)
);

create table public.prefs (
  user_id uuid primary key default auth.uid() references auth.users(id) on delete cascade,
  last_convert text not null default 'SGD',
  last_convert_by_trip jsonb not null default '{}',
  example_seeded boolean not null default false
);

create index trips_user_idx on public.trips(user_id);
create index items_trip_idx on public.items(trip_id);
create index items_user_idx on public.items(user_id);
create index expenses_trip_idx on public.expenses(trip_id);
create index expenses_user_idx on public.expenses(user_id);
create index photos_trip_idx on public.photos(trip_id);
create index photos_user_idx on public.photos(user_id);

-- Child rows may only point at the same user's trip.
create or replace function public.owns_trip(t text) returns boolean
language sql stable security definer set search_path = '' as $$
  select exists (select 1 from public.trips where id = t and user_id = (select auth.uid()));
$$;
revoke execute on function public.owns_trip(text) from public, anon;
grant execute on function public.owns_trip(text) to authenticated;

alter table public.trips enable row level security;
alter table public.items enable row level security;
alter table public.expenses enable row level security;
alter table public.photos enable row level security;
alter table public.rates enable row level security;
alter table public.prefs enable row level security;

create policy "own trips" on public.trips for all to authenticated
  using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()));
create policy "own items" on public.items for all to authenticated
  using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()) and public.owns_trip(trip_id));
create policy "own expenses" on public.expenses for all to authenticated
  using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()) and public.owns_trip(trip_id));
create policy "own photos" on public.photos for all to authenticated
  using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()) and public.owns_trip(trip_id));
create policy "own rates" on public.rates for all to authenticated
  using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()));
create policy "own prefs" on public.prefs for all to authenticated
  using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()));

-- Live sync across devices
alter publication supabase_realtime add table public.trips, public.items, public.expenses, public.photos;

-- Private bucket for photos and receipts; files live under <user id>/...
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('trip-media', 'trip-media', false, 20971520, array['image/jpeg','image/png','image/webp','image/gif']);

create policy "read own media" on storage.objects for select to authenticated
  using (bucket_id = 'trip-media' and (storage.foldername(name))[1] = (select auth.uid())::text);
create policy "upload own media" on storage.objects for insert to authenticated
  with check (bucket_id = 'trip-media' and (storage.foldername(name))[1] = (select auth.uid())::text);
create policy "update own media" on storage.objects for update to authenticated
  using (bucket_id = 'trip-media' and (storage.foldername(name))[1] = (select auth.uid())::text);
create policy "delete own media" on storage.objects for delete to authenticated
  using (bucket_id = 'trip-media' and (storage.foldername(name))[1] = (select auth.uid())::text);
