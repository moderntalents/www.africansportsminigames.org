/*
  # Gallery Storage Policies

  Adds RLS policies to the Supabase Storage `gallery` bucket so:
  - Anyone (anon) can read/download gallery images (public gallery)
  - Authenticated users (admins) can upload and delete images
*/

CREATE POLICY "Public can view gallery images"
  ON storage.objects FOR SELECT
  TO anon, authenticated
  USING (bucket_id = 'gallery');

CREATE POLICY "Authenticated users can upload gallery images"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'gallery');

CREATE POLICY "Authenticated users can delete gallery images"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'gallery');
