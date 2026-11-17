-- twenty49: core schema
--
-- Shape of the data
--   demand side  : profiles -> seeker_preferences -> seeker_sectors
--   supply side  : profiles -> listings -> listing_flatmates / listing_photos
--   in between   : interests (a seeker asks about a listing; the host accepts or declines)
--   a "match"    : an accepted interest. Fields marked "matches only" open up to matched people.
--
-- Matching is gender based (a seeker only matches households of their own gender), then
-- sector, room type, budget and move-in date. See 0004_matching.sql.
--
-- Money is whole rupees. Dates are plain dates. Everything the onboarding flow collects has a home here.

create schema if not exists private;

/* ───────────── Enums ───────────── */

create type public.intent_t          as enum ('seek', 'host');
create type public.gender_t          as enum ('male', 'female');
create type public.occupation_t      as enum ('working', 'student');
create type public.visibility_t      as enum ('everyone', 'matches');
create type public.household_t       as enum ('single', 'plusone');
create type public.room_type_t       as enum ('private', 'shared');
create type public.furnishing_t      as enum ('furnished', 'semi', 'unfurnished');
create type public.bhk_t             as enum ('rk', '1', '2', '3', '4', '5');
create type public.deal_breaker_t    as enum ('veg', 'parties', 'pets', 'smoking');
create type public.listing_status_t  as enum ('draft', 'active', 'paused', 'filled');
create type public.interest_status_t as enum ('pending', 'accepted', 'declined', 'withdrawn');

/* ───────────── Shared helpers ───────────── */

create function private.set_updated_at() returns trigger
language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end $$;

/* ───────────── Sectors and localities ───────────── */

create table public.sectors (
  id         smallint generated always as identity primary key,
  name       text     not null unique,
  kind       text     not null check (kind in ('sector', 'locality')),
  is_popular boolean  not null default false,
  sort_order smallint not null default 0
);

/* ───────────── People ───────────── */

create table public.profiles (
  id                      uuid primary key references auth.users (id) on delete cascade,
  intent                  public.intent_t     not null,
  full_name               text                not null check (char_length(btrim(full_name)) between 2 and 40),
  name_visibility         public.visibility_t not null default 'everyone',
  gender                  public.gender_t     not null,
  -- Age is collected as a number and stored as a birth year so it keeps itself current.
  birth_year              smallint            not null check (birth_year between 1900 and 2100),
  age_visibility          public.visibility_t not null default 'everyone',
  occupation              public.occupation_t not null,
  workplace               text                not null check (char_length(btrim(workplace)) between 1 and 60),
  workplace_visibility    public.visibility_t not null default 'matches',
  bio                     text                check (bio is null or char_length(bio) <= 100),
  onboarding_completed_at timestamptz,
  created_at              timestamptz         not null default now(),
  updated_at              timestamptz         not null default now()
);

create trigger profiles_updated_at before update on public.profiles
  for each row execute function private.set_updated_at();

-- Adults only, and name / gender / age are locked once onboarding is complete.
create function private.profiles_guard() returns trigger
language plpgsql as $$
begin
  if extract(year from now())::int - new.birth_year < 18 then
    raise exception 'You need to be 18 or older to use twenty49' using errcode = 'check_violation';
  end if;

  if tg_op = 'UPDATE' and old.onboarding_completed_at is not null then
    if new.full_name   is distinct from old.full_name
       or new.gender     is distinct from old.gender
       or new.birth_year is distinct from old.birth_year
       or new.intent     is distinct from old.intent then
      raise exception 'Name, gender and age cannot be changed after the profile is complete'
        using errcode = 'check_violation';
    end if;
    if new.onboarding_completed_at is null then
      raise exception 'A completed profile cannot be reopened' using errcode = 'check_violation';
    end if;
  end if;
  return new;
end $$;

create trigger profiles_guard before insert or update on public.profiles
  for each row execute function private.profiles_guard();

/* ───────────── Demand side: people looking for a room ───────────── */

create table public.seeker_preferences (
  profile_id   uuid primary key references public.profiles (id) on delete cascade,
  household    public.household_t   not null,
  room_type    public.room_type_t   not null,
  -- The most they would pay a month, all in. Never shown to anyone else.
  budget_max   integer              not null check (budget_max between 1000 and 500000),
  move_in      date                 not null,
  deal_breakers public.deal_breaker_t[] not null default '{}',
  created_at   timestamptz          not null default now(),
  updated_at   timestamptz          not null default now()
);

create trigger seeker_preferences_updated_at before update on public.seeker_preferences
  for each row execute function private.set_updated_at();

create index seeker_preferences_match_idx on public.seeker_preferences (room_type, budget_max);

-- Up to three sectors. The slot number (1 to 3) enforces the limit with no extra trigger.
create table public.seeker_sectors (
  seeker_id uuid     not null references public.seeker_preferences (profile_id) on delete cascade,
  slot      smallint not null check (slot between 1 and 3),
  sector_id smallint not null references public.sectors (id),
  primary key (seeker_id, slot),
  unique (seeker_id, sector_id)
);

-- Lets a host side lookup find every seeker for a sector quickly.
create index seeker_sectors_by_sector_idx on public.seeker_sectors (sector_id, seeker_id);

/* ───────────── Supply side: rooms to rent ───────────── */

create table public.listings (
  id                  uuid primary key default gen_random_uuid(),
  host_id             uuid not null references public.profiles (id) on delete cascade,
  status              public.listing_status_t not null default 'draft',
  bio                 text not null check (char_length(btrim(bio)) between 1 and 100),

  room_type           public.room_type_t not null,
  furnishing          public.furnishing_t not null,
  attached_washroom   boolean not null,
  bhk                 public.bhk_t not null,
  flatmate_count      smallint not null check (flatmate_count between 1 and 9),
  available_from      date not null,

  sector_id           smallint not null references public.sectors (id),
  society             text not null check (char_length(btrim(society)) between 1 and 60),
  society_visibility  public.visibility_t not null default 'matches',

  -- Costs, in whole rupees. Rent includes maintenance.
  rent                integer not null check (rent > 0),
  deposit             integer not null check (deposit >= 0),
  one_time_cost       integer not null default 0 check (one_time_cost >= 0),
  furniture_rent      integer not null default 0 check (furniture_rent >= 0),
  furniture_optional  boolean not null default false,
  maid_cost           integer not null default 0 check (maid_cost >= 0),
  maid_optional       boolean not null default false,
  cook_cost           integer not null default 0 check (cook_cost >= 0),
  cook_optional       boolean not null default false,

  -- What the household will not live with (the host's deal-breakers).
  house_rules         public.deal_breaker_t[] not null default '{}',

  -- Copied from the host's profile so matching can filter on one table.
  household_gender    public.gender_t not null,

  -- What a tenant has to pay each month: rent plus every extra that is not optional.
  -- Seekers are matched against this number.
  mandatory_monthly_cost integer generated always as (
    rent
    + case when furniture_optional then 0 else furniture_rent end
    + case when maid_optional      then 0 else maid_cost      end
    + case when cook_optional      then 0 else cook_cost      end
  ) stored,

  published_at        timestamptz,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);

create trigger listings_updated_at before update on public.listings
  for each row execute function private.set_updated_at();

create function private.listings_prepare() returns trigger
language plpgsql security definer set search_path = public, pg_temp as $$
begin
  select p.gender into new.household_gender from public.profiles p where p.id = new.host_id;
  if new.household_gender is null then
    raise exception 'The host needs a completed profile before listing a room' using errcode = 'check_violation';
  end if;
  if new.status = 'active' and (tg_op = 'INSERT' or old.status is distinct from 'active')
     and new.published_at is null then
    new.published_at = now();
  end if;
  return new;
end $$;

create trigger listings_prepare before insert or update on public.listings
  for each row execute function private.listings_prepare();

-- The match query: active listings by sector, then household gender and room type.
create index listings_match_idx on public.listings
  (sector_id, household_gender, room_type, mandatory_monthly_cost)
  where status = 'active';
create index listings_host_idx on public.listings (host_id, status);

-- Up to five people who already live there (position 0 to 4).
create table public.listing_flatmates (
  id         uuid primary key default gen_random_uuid(),
  listing_id uuid not null references public.listings (id) on delete cascade,
  position   smallint not null check (position between 0 and 4),
  gender     public.gender_t not null,
  occupation public.occupation_t not null,
  workplace  text not null check (char_length(btrim(workplace)) between 1 and 60),
  unique (listing_id, position)
);

-- Up to six photos (position 0 is the main one). Files live in Supabase Storage.
create table public.listing_photos (
  id           uuid primary key default gen_random_uuid(),
  listing_id   uuid not null references public.listings (id) on delete cascade,
  position     smallint not null check (position between 0 and 5),
  storage_path text not null,
  width        integer,
  height       integer,
  -- Deferred so photos can be reordered inside one transaction.
  unique (listing_id, position) deferrable initially deferred
);

/* ───────────── Interests: where the two sides meet ───────────── */

create table public.interests (
  id           uuid primary key default gen_random_uuid(),
  seeker_id    uuid not null references public.profiles (id) on delete cascade,
  listing_id   uuid not null references public.listings (id) on delete cascade,
  status       public.interest_status_t not null default 'pending',
  message      text check (message is null or char_length(message) <= 280),
  created_at   timestamptz not null default now(),
  responded_at timestamptz,
  unique (seeker_id, listing_id)
);

create index interests_by_listing_idx on public.interests (listing_id, status);
create index interests_by_seeker_idx  on public.interests (seeker_id, status);

-- A seeker can only reach out to a listing that suits their gender, and never to their own.
create function private.interests_guard() returns trigger
language plpgsql security definer set search_path = public, pg_temp as $$
declare
  l public.listings;
  seeker_gender public.gender_t;
  actor uuid := auth.uid();
begin
  if tg_op = 'INSERT' then
    select * into l from public.listings where id = new.listing_id;
    select gender into seeker_gender from public.profiles where id = new.seeker_id;
    if l.id is null or l.status <> 'active' then
      raise exception 'This room is not available' using errcode = 'check_violation';
    end if;
    if l.host_id = new.seeker_id then
      raise exception 'You cannot reach out to your own room' using errcode = 'check_violation';
    end if;
    if l.household_gender is distinct from seeker_gender then
      raise exception 'This room is not open to your gender' using errcode = 'check_violation';
    end if;
    new.status = 'pending';
    new.responded_at = null;
    return new;
  end if;

  -- UPDATE: only the status may change, and only in the allowed ways.
  if new.seeker_id <> old.seeker_id or new.listing_id <> old.listing_id
     or new.message is distinct from old.message or new.created_at <> old.created_at then
    raise exception 'Only the status of an interest can change' using errcode = 'check_violation';
  end if;
  if new.status = old.status then
    return new;
  end if;

  if actor is not null then  -- null means a trusted server-side change
    if actor = old.seeker_id and old.status = 'pending' and new.status = 'withdrawn' then
      null;
    elsif actor = (select host_id from public.listings where id = old.listing_id)
          and old.status = 'pending' and new.status in ('accepted', 'declined') then
      new.responded_at = now();
    else
      raise exception 'That status change is not allowed' using errcode = 'check_violation';
    end if;
  end if;
  return new;
end $$;

create trigger interests_guard before insert or update on public.interests
  for each row execute function private.interests_guard();

/* ───────────── Onboarding progress (replaces the browser-only draft) ───────────── */

create table public.onboarding_drafts (
  user_id    uuid primary key references auth.users (id) on delete cascade,
  step       text,
  data       jsonb not null default '{}',
  updated_at timestamptz not null default now()
);

create trigger onboarding_drafts_updated_at before update on public.onboarding_drafts
  for each row execute function private.set_updated_at();
