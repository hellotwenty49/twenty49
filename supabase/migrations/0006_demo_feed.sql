-- twenty49: shared matching core, plus a temporary feed for the demo dashboard
--
-- The matching rules now live in one place, private.match_listings(), and are used by
--   * public.matching_listings()  : the real function for a signed-in seeker
--   * public.demo_feed()          : TEMPORARY. Lets the dashboard show rooms before sign-in exists.
-- Drop demo_feed() (see the bottom of this file) when sign-in is built.

create function private.match_listings(
  p_gender public.gender_t,
  p_room_type public.room_type_t,
  p_budget integer,
  p_move_in date,
  p_sector_ids smallint[],
  p_exclude uuid,
  p_limit integer,
  p_offset integer
)
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
  select
    l.id,
    (100
      - least(abs(l.available_from - p_move_in), 60)
      + round(20 * (1 - l.mandatory_monthly_cost::numeric / p_budget))::int
    ),
    l.sector_id, l.rent, l.mandatory_monthly_cost, l.available_from, l.bhk, l.room_type, l.furnishing,
    (select ph.storage_path from public.listing_photos ph where ph.listing_id = l.id and ph.position = 0)
  from public.listings l
  where l.sector_id = any (p_sector_ids)
    and l.status = 'active'
    and l.household_gender = p_gender
    and l.room_type = p_room_type
    and l.mandatory_monthly_cost <= p_budget
    and l.available_from <= p_move_in + 30
    and l.host_id is distinct from p_exclude
    and not exists (
          select 1 from public.listing_flatmates f where f.listing_id = l.id and f.gender <> p_gender)
    and not exists (
          select 1 from public.interests i
          where i.seeker_id = p_exclude and i.listing_id = l.id and i.status = 'declined')
  order by 2 desc, l.published_at desc nulls last, l.id
  limit greatest(p_limit, 0) offset greatest(p_offset, 0)
$$;

create or replace function public.matching_listings(p_limit integer default 20, p_offset integer default 0)
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
  select m.*
  from (
    select p.id, p.gender, sp.room_type, sp.budget_max, sp.move_in,
           array(select ss.sector_id from public.seeker_sectors ss where ss.seeker_id = p.id) as sectors
    from public.profiles p
    join public.seeker_preferences sp on sp.profile_id = p.id
    where p.id = auth.uid() and p.onboarding_completed_at is not null
  ) me,
  lateral private.match_listings(me.gender, me.room_type, me.budget_max, me.move_in, me.sectors,
                                 me.id, p_limit, p_offset) m
$$;

/* ───────────── TEMPORARY: demo feed for the dashboard (no sign-in needed) ─────────────
   Takes what a seeker chose in onboarding and returns ready-to-show room cards as JSON.
   It only returns what everyone is allowed to see: anything marked "matches only" comes back
   null, because a signed-out visitor is never matched with anyone. */

create function public.demo_feed(
  p_gender public.gender_t,
  p_sector_names text[],
  p_room_type public.room_type_t,
  p_budget_max integer,
  p_move_in date,
  p_limit integer default 24,
  p_offset integer default 0
) returns jsonb
language sql stable security definer set search_path = public, pg_temp as $$
  with ids as (
    select coalesce(array_agg(s.id), '{}') as sector_ids from public.sectors s where s.name = any (p_sector_names)
  ),
  hits as (
    select m.*
    from ids,
    lateral private.match_listings(p_gender, p_room_type, greatest(p_budget_max, 1), p_move_in, ids.sector_ids,
                                   null, least(greatest(p_limit, 0), 50), greatest(p_offset, 0)) m
  )
  select coalesce(jsonb_agg(card order by (card ->> 'score')::int desc, card ->> 'listing_id'), '[]'::jsonb)
  from (
    select jsonb_build_object(
      'listing_id', l.id,
      'score', h.score,
      'bio', l.bio,
      'sector', s.name,
      'society', case when l.society_visibility = 'everyone' then l.society end,
      'bhk', l.bhk,
      'room_type', l.room_type,
      'furnishing', l.furnishing,
      'attached_washroom', l.attached_washroom,
      'flatmate_count', l.flatmate_count,
      'available_from', l.available_from,
      'rent', l.rent,
      'deposit', l.deposit,
      'one_time_cost', l.one_time_cost,
      'furniture_rent', l.furniture_rent,
      'furniture_optional', l.furniture_optional,
      'maid_cost', l.maid_cost,
      'maid_optional', l.maid_optional,
      'cook_cost', l.cook_cost,
      'cook_optional', l.cook_optional,
      'mandatory_monthly_cost', l.mandatory_monthly_cost,
      'house_rules', l.house_rules,
      'photos', coalesce((select jsonb_agg(ph.storage_path order by ph.position)
                          from public.listing_photos ph where ph.listing_id = l.id), '[]'::jsonb),
      'host', jsonb_build_object(
        'first_name', case when hp.name_visibility = 'everyone' then split_part(btrim(hp.full_name), ' ', 1) end,
        'age', case when hp.age_visibility = 'everyone' then extract(year from now())::int - hp.birth_year end,
        'occupation', hp.occupation,
        'workplace', case when hp.workplace_visibility = 'everyone' then hp.workplace end
      ),
      'flatmates', coalesce((
        select jsonb_agg(jsonb_build_object(
                 'gender', f.gender,
                 'occupation', f.occupation,
                 'workplace', case when hp.workplace_visibility = 'everyone' then f.workplace end
               ) order by f.position)
        from public.listing_flatmates f where f.listing_id = l.id), '[]'::jsonb)
    ) as card
    from hits h
    join public.listings l on l.id = h.listing_id
    join public.sectors s on s.id = l.sector_id
    join public.profiles hp on hp.id = l.host_id
  ) cards
$$;

comment on function public.demo_feed is 'TEMPORARY demo feed for the dashboard before sign-in exists. Drop it when sign-in is built.';

revoke all on function public.demo_feed(public.gender_t, text[], public.room_type_t, integer, date, integer, integer) from public;
grant execute on function public.demo_feed(public.gender_t, text[], public.room_type_t, integer, date, integer, integer)
  to anon, authenticated;

-- When sign-in is built, remove the demo feed with:
--   drop function public.demo_feed(public.gender_t, text[], public.room_type_t, integer, date, integer, integer);
