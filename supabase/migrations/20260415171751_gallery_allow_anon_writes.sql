/*
  # Allow anon role to manage gallery content

  ## Summary
  Since the admin panel uses a client-side password gate rather than Supabase Auth,
  the anon role needs write access to gallery tables and storage.

  ## Changes
  - Add INSERT/DELETE policies for anon on gallery_events
  - Add INSERT/DELETE policies for anon on gallery_photos
  - Add INSERT/DELETE storage policies for anon on the gallery bucket
*/

CREATE POLICY "Anon can insert gallery events"
  ON gallery_events FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Anon can delete gallery events"
  ON gallery_events FOR DELETE
  TO anon
  USING (true);

CREATE POLICY "Anon can update gallery events"
  ON gallery_events FOR UPDATE
  TO anon
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Anon can insert gallery photos"
  ON gallery_photos FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Anon can delete gallery photos"
  ON gallery_photos FOR DELETE
  TO anon
  USING (true);

CREATE POLICY "Anon can upload gallery images"
  ON storage.objects FOR INSERT
  TO anon
  WITH CHECK (bucket_id = 'gallery');

CREATE POLICY "Anon can delete gallery images"
  ON storage.objects FOR DELETE
  TO anon
  USING (bucket_id = 'gallery');
