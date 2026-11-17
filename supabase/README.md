# twenty49 database

Run the files in `migrations/` in order, in the Supabase dashboard under **SQL Editor** (paste each file, press Run):

1. `0001_core_schema.sql`: tables, types, limits, locks
2. `0002_sectors_seed.sql`: the 135 Gurugram sectors and localities
3. `0003_security.sql`: who can see what (row level security and the `*_public` views)
4. `0004_matching.sql`: the matching functions
5. `0005_storage.sql`: the photo bucket and its rules

Each file is meant to be run once, on an empty project. Reading the top comment of each file explains what it does.

## How the pieces fit

- **Demand side:** `profiles`, `seeker_preferences`, `seeker_sectors`
- **Supply side:** `profiles` (the host), `listings`, `listing_flatmates`, `listing_photos`
- **Where they meet:** `interests`. A host accepting an interest is a **match**, and that opens up the fields marked "matches only".
- **Matching:** `matching_listings()` for a seeker and `matching_seekers(listing_id)` for a host. The rules are at the top of `0004_matching.sql`.
- **Reading other people's data:** use `profiles_public`, `seekers_public`, `listings_public` and `listing_flatmates_public`, never the base tables. They hide private fields as `NULL`.
