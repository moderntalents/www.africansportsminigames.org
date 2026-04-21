/*
  # Create Resource Posters System

  ## Summary
  Adds a table to store uploadable event posters/resources that admins can manage
  and visitors can download. Posters are stored in a dedicated Supabase Storage
  bucket named `posters`.

  ## New Tables
  - `resource_posters`
    - `id` (uuid, primary key)
    - `title` (text) — display name shown on the card
    - `description` (text) — optional subtitle/tagline
    - `storage_path` (text) — path inside the `posters` bucket
    - `public_url` (text) — full public CDN URL
    - `preview_url` (text, nullable) — optional separate preview image URL
    - `file_type` (text) — e.g. 'pdf', 'jpg', 'png'
    - `original_filename` (text)
    - `display_order` (integer, default 0) — controls card ordering
    - `created_at` (timestamptz)

  ## Security
  - RLS enabled
  - Public SELECT for all visitors
  - INSERT/UPDATE/DELETE allowed for anon (admin uses password-gate, not Supabase auth)

  ## Storage
  - `posters` bucket created as public with 20MB limit
  - Storage policies added for public read, anon write/delete
*/

CREATE TABLE IF NOT EXISTS resource_posters (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL DEFAULT '',
  description text NOT NULL DEFAULT '',
  storage_path text NOT NULL,
  public_url text NOT NULL,
  preview_url text,
  file_type text NOT NULL DEFAULT '',
  original_filename text NOT NULL DEFAULT '',
  display_order integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE resource_posters ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view resource posters"
  ON resource_posters FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Anon can insert resource posters"
  ON resource_posters FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Anon can update resource posters"
  ON resource_posters FOR UPDATE
  TO anon
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Anon can delete resource posters"
  ON resource_posters FOR DELETE
  TO anon
  USING (true);

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'posters',
  'posters',
  true,
  20971520,
  ARRAY[
    'image/jpeg','image/png','image/webp','image/gif',
    'application/pdf'
  ]
)
ON CONFLICT (id) DO UPDATE SET public = true;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'storage' AND tablename = 'objects'
    AND policyname = 'Public can view poster files'
  ) THEN
    CREATE POLICY "Public can view poster files"
      ON storage.objects FOR SELECT
      TO anon, authenticated
      USING (bucket_id = 'posters');
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'storage' AND tablename = 'objects'
    AND policyname = 'Anon can upload poster files'
  ) THEN
    CREATE POLICY "Anon can upload poster files"
      ON storage.objects FOR INSERT
      TO anon
      WITH CHECK (bucket_id = 'posters');
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'storage' AND tablename = 'objects'
    AND policyname = 'Anon can delete poster files'
  ) THEN
    CREATE POLICY "Anon can delete poster files"
      ON storage.objects FOR DELETE
      TO anon
      USING (bucket_id = 'posters');
  END IF;
END $$;
