-- twenty49: who can see and change what
--
-- Base tables are private to their owner. Other people read through the *_public views below,
-- which hide anything marked "matches only" until the two people have an accepted interest.
-- Hidden fields come back as NULL, so the app can show "visible after you match".

/* ───────────── Helpers (not exposed through the API) ───────────── */

-- Two people are matched when one has an accepted interest in the other's room.
create function private.is_matched(p_a uuid, p_b uuid) returns boolean
language sql stable security definer set search_path = public, pg_temp as $$
  select exists (
    select 1
    from public.interests i
    join public.listings l on l.id = i.listing_id
    where i.status = 'accepted'
      and ((i.seeker_id = p_a and l.host_id = p_b) or (i.seeker_id = p_b and l.host_id = p_a))
  )
$$;

-- Can the signed-in person see a field that belongs to p_owner with this visibility?
create function private.can_see(p_owner uuid, p_vis public.visibility_t) returns boolean
language sql stable security definer set search_path = public, pg_temp as $$
  select auth.uid() = p_owner
      or p_vis = 'everyone'
      or (auth.uid() is not null and private.is_matched(auth.uid(), p_owner))
$$;

create function private.my_gender() returns public.gender_t
language sql stable security definer set search_path = public, pg_temp as $$
  select gender from public.profiles where id = auth.uid()
$$;

-- Rooms are only visible to their owner and, while active, to people of the same gender
-- (matching is gender based, so a room for one gender is not shown to the other).
create function private.listing_visible(p_listing uuid) returns boolean
language sql stable security definer set search_path = public, pg_temp as $$
  select exists (
    select 1 from public.listings l
    where l.id = p_listing
      and (l.host_id = auth.uid() or (l.status = 'active' and l.household_gender = private.my_gender()))
  )
$$;

create function private.is_listing_host(p_listing uuid) returns boolean
language sql stable security definer set search_path = public, pg_temp as $$
  select exists (select 1 from public.listings l where l.id = p_listing and l.host_id = auth.uid())
$$;

-- A profile can be looked up by others only when there is a reason to: it is yours, the person
-- has a room listed (same gender), they have reached out to one of your rooms, they are a seeker
-- of your gender and you have a room listed, or you are matched.
create function private.profile_visible(p_profile uuid) returns boolean
language sql stable security definer set search_path = public, pg_temp as $$
  select auth.uid() is not null and (
    p_profile = auth.uid()
    or exists (
      select 1 from public.listings l
      where l.host_id = p_profile and l.status = 'active' and l.household_gender = private.my_gender()
    )
    or exists (
      select 1 from public.interests i
      join public.listings l on l.id = i.listing_id
      where i.seeker_id = p_profile and l.host_id = auth.uid()
    )
    -- a host with a room listed can look at seekers of the same gender
    or (
      exists (select 1 from public.profiles s
              where s.id = p_profile and s.intent = 'seek' and s.gender = private.my_gender())
      and exists (select 1 from public.listings l where l.host_id = auth.uid() and l.status = 'active')
    )
    or private.is_matched(auth.uid(), p_profile)
  )
$$;

/* ───────────── Public views ───────────── */

create view public.profiles_public with (security_invoker = false) as
select
  p.id,
  p.intent,
  p.gender,
  p.occupation,
  p.bio,
  case when private.can_see(p.id, p.name_visibility)
       then split_part(btrim(p.full_name), ' ', 1) end                     as first_name,
  case when private.can_see(p.id, p.age_visibility)
       then extract(year from now())::int - p.birth_year end               as age,
  case when private.can_see(p.id, p.workplace_visibility)
       then p.workplace end                                                 as workplace
from public.profiles p
where p.onboarding_completed_at is not null
  and private.profile_visible(p.id);

-- What a host may know about a seeker. The budget is deliberately left out.
create view public.seekers_public with (security_invoker = false) as
select
  sp.profile_id,
  sp.household,
  sp.room_type,
  sp.move_in,
  sp.deal_breakers,
  array(
    select ss.sector_id from public.seeker_sectors ss
    where ss.seeker_id = sp.profile_id order by ss.slot
  ) as sector_ids
from public.seeker_preferences sp
where private.profile_visible(sp.profile_id);

create view public.listings_public with (security_invoker = false) as
select
  l.id, l.host_id, l.status, l.bio,
  l.room_type, l.furnishing, l.attached_washroom, l.bhk, l.flatmate_count, l.available_from,
  l.sector_id,
  case when private.can_see(l.host_id, l.society_visibility) then l.society end as society,
  l.rent, l.deposit, l.one_time_cost,
  l.furniture_rent, l.furniture_optional,
  l.maid_cost, l.maid_optional,
  l.cook_cost, l.cook_optional,
  l.mandatory_monthly_cost,
  l.house_rules, l.household_gender, l.published_at
from public.listings l
where l.host_id = auth.uid()
   or (l.status = 'active' and l.household_gender = private.my_gender());

-- Flatmates' workplace follows the host's own workplace setting.
create view public.listing_flatmates_public with (security_invoker = false) as
select
  f.listing_id, f.position, f.gender, f.occupation,
  case when private.can_see(l.host_id, hp.workplace_visibility) then f.workplace end as workplace
from public.listing_flatmates f
join public.listings l on l.id = f.listing_id
join public.profiles hp on hp.id = l.host_id
where private.listing_visible(f.listing_id);

/* ───────────── Row level security ───────────── */

alter table public.sectors            enable row level security;
alter table public.profiles           enable row level security;
alter table public.seeker_preferences enable row level security;
alter table public.seeker_sectors     enable row level security;
alter table public.listings           enable row level security;
alter table public.listing_flatmates  enable row level security;
alter table public.listing_photos     enable row level security;
alter table public.interests          enable row level security;
alter table public.onboarding_drafts  enable row level security;

create policy sectors_read on public.sectors for select to anon, authenticated using (true);

create policy profiles_select_own on public.profiles for select to authenticated using (id = auth.uid());
create policy profiles_insert_own on public.profiles for insert to authenticated with check (id = auth.uid());
create policy profiles_update_own on public.profiles for update to authenticated
  using (id = auth.uid()) with check (id = auth.uid());

create policy seeker_preferences_own on public.seeker_preferences for all to authenticated
  using (profile_id = auth.uid()) with check (profile_id = auth.uid());
create policy seeker_sectors_own on public.seeker_sectors for all to authenticated
  using (seeker_id = auth.uid()) with check (seeker_id = auth.uid());

create policy listings_own on public.listings for all to authenticated
  using (host_id = auth.uid()) with check (host_id = auth.uid());
create policy listing_flatmates_own on public.listing_flatmates for all to authenticated
  using (private.is_listing_host(listing_id)) with check (private.is_listing_host(listing_id));

create policy listing_photos_own on public.listing_photos for all to authenticated
  using (private.is_listing_host(listing_id)) with check (private.is_listing_host(listing_id));
create policy listing_photos_read on public.listing_photos for select to authenticated
  using (private.listing_visible(listing_id));

create policy interests_read on public.interests for select to authenticated
  using (seeker_id = auth.uid() or private.is_listing_host(listing_id));
create policy interests_create on public.interests for insert to authenticated
  with check (seeker_id = auth.uid());
create policy interests_respond on public.interests for update to authenticated
  using (seeker_id = auth.uid() or private.is_listing_host(listing_id))
  with check (seeker_id = auth.uid() or private.is_listing_host(listing_id));

create policy onboarding_drafts_own on public.onboarding_drafts for all to authenticated
  using (user_id = auth.uid()) with check (user_id = auth.uid());

/* ───────────── Grants ───────────── */

grant usage on schema private to authenticated;

-- Signed-out visitors can only read the sector list.
revoke all on all tables in schema public from anon;
grant select on public.sectors to anon, authenticated;

revoke all on public.profiles, public.seeker_preferences, public.seeker_sectors, public.listings,
              public.listing_flatmates, public.listing_photos, public.interests,
              public.onboarding_drafts from authenticated;

grant select, insert, update on public.profiles           to authenticated;
grant select, insert, update, delete on public.seeker_preferences, public.seeker_sectors,
                                        public.listings, public.listing_flatmates,
                                        public.listing_photos, public.onboarding_drafts to authenticated;
grant select, insert, update on public.interests          to authenticated;

grant select on public.profiles_public, public.seekers_public, public.listings_public,
                public.listing_flatmates_public to authenticated;
