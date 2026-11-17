-- twenty49: photo storage (Supabase only)
--
-- Files are saved as  <host id>/<listing id>/<file>.webp  in a public bucket, so photos are visible to
-- everyone and only the owner can add, replace or remove their own.

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('listing-photos', 'listing-photos', true, 2097152, array['image/webp', 'image/jpeg'])
on conflict (id) do nothing;

create policy listing_photos_upload on storage.objects for insert to authenticated
  with check (bucket_id = 'listing-photos' and (storage.foldername(name))[1] = auth.uid()::text);
create policy listing_photos_replace on storage.objects for update to authenticated
  using (bucket_id = 'listing-photos' and (storage.foldername(name))[1] = auth.uid()::text);
create policy listing_photos_remove on storage.objects for delete to authenticated
  using (bucket_id = 'listing-photos' and (storage.foldername(name))[1] = auth.uid()::text);
