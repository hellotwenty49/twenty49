-- twenty49: matching
--
-- Hard rules (a room must pass all of them):
--   1. same gender: the listing's household gender equals the seeker's gender, and no flatmate listed
--      for the room is of a different gender
--   2. one of the seeker's sectors
--   3. the room type the seeker wants
--   4. what the tenant must pay each month (rent plus compulsory extras) is within the budget
--   5. the room is free by 30 days after the seeker's move-in date
-- Then rooms are ranked: closer to the move-in date first, with a small bonus for fitting the budget easily.
--
-- Deal-breakers are shown to both sides but not used to filter yet, because we do not ask whether a
-- household has pets, parties or smokers.

-- Rooms for the signed-in seeker.
create function public.matching_listings(p_limit integer default 20, p_offset integer default 0)
returns table (
  listing_id uuid,
  score integer,
  sector_id smallint,
  rent integer,
  mandatory_monthly_cost integer,
  available_from date,
  bhk public.bhk_t,
  room_type public.room_type_t,
  furnishing public.furnishing_t,
  cover_path text
)
language sql stable security definer set search_path = public, pg_temp as $$
  with me as (
    select p.id, p.gender, sp.room_type, sp.budget_max, sp.move_in
    from public.profiles p
    join public.seeker_preferences sp on sp.profile_id = p.id
    where p.id = auth.uid() and p.onboarding_completed_at is not null
  )
  select
    l.id,
    (100
      - least(abs(l.available_from - me.move_in), 60)
      + round(20 * (1 - l.mandatory_monthly_cost::numeric / me.budget_max))::int
    ),
    l.sector_id, l.rent, l.mandatory_monthly_cost, l.available_from, l.bhk, l.room_type, l.furnishing,
    (select ph.storage_path from public.listing_photos ph where ph.listing_id = l.id and ph.position = 0)
  from me
  join public.seeker_sectors ss on ss.seeker_id = me.id
  join public.listings l
    on  l.sector_id = ss.sector_id
    and l.status = 'active'
    and l.household_gender = me.gender
    and l.room_type = me.room_type
    and l.mandatory_monthly_cost <= me.budget_max
    and l.available_from <= me.move_in + 30
    and l.host_id <> me.id
  where not exists (
          select 1 from public.listing_flatmates f where f.listing_id = l.id and f.gender <> me.gender)
    and not exists (
          select 1 from public.interests i
          where i.seeker_id = me.id and i.listing_id = l.id and i.status = 'declined')
  order by 2 desc, l.published_at desc nulls last, l.id
  limit greatest(p_limit, 0) offset greatest(p_offset, 0)
$$;

-- Seekers who fit one of the signed-in host's rooms. Budgets are never returned.
create function public.matching_seekers(p_listing uuid, p_limit integer default 20, p_offset integer default 0)
returns table (profile_id uuid, score integer, move_in date)
language sql stable security definer set search_path = public, pg_temp as $$
  with l as (
    select * from public.listings
    where id = p_listing and host_id = auth.uid() and status = 'active'
  )
  select
    p.id,
    (100
      - least(abs(l.available_from - sp.move_in), 60)
      + round(20 * (1 - l.mandatory_monthly_cost::numeric / sp.budget_max))::int
    ),
    sp.move_in
  from l
  join public.seeker_sectors ss on ss.sector_id = l.sector_id
  join public.seeker_preferences sp on sp.profile_id = ss.seeker_id
  join public.profiles p on p.id = sp.profile_id
  where p.onboarding_completed_at is not null
    and p.gender = l.household_gender
    and sp.room_type = l.room_type
    and l.mandatory_monthly_cost <= sp.budget_max
    and l.available_from <= sp.move_in + 30
    and p.id <> l.host_id
    and not exists (
          select 1 from public.listing_flatmates f where f.listing_id = l.id and f.gender <> p.gender)
    and not exists (
          select 1 from public.interests i
          where i.seeker_id = p.id and i.listing_id = l.id and i.status = 'declined')
  order by 2 desc, p.id
  limit greatest(p_limit, 0) offset greatest(p_offset, 0)
$$;

revoke all on function public.matching_listings(integer, integer) from public, anon;
revoke all on function public.matching_seekers(uuid, integer, integer) from public, anon;
grant execute on function public.matching_listings(integer, integer) to authenticated;
grant execute on function public.matching_seekers(uuid, integer, integer) to authenticated;
