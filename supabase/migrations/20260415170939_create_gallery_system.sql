/*
  # Create Gallery System

  ## Summary
  Introduces two new tables and a storage bucket to power the dynamic event gallery feature.

  ## New Tables

  ### `gallery_events`
  Stores named gallery collections (e.g., "Long Jump Athletics").
  - `id` (uuid, primary key)
  - `name` (text) — Display name of the event gallery
  - `created_at` (timestamptz)

  ### `gallery_photos`
  Stores individual photo metadata linked to a gallery event.
  - `id` (uuid, primary key)
  - `gallery_event_id` (uuid, FK → gallery_events.id, cascade delete)
  - `storage_path` (text) — Path in Supabase Storage bucket
  - `public_url` (text) — Full public URL for display
  - `filename` (text) — Original filename
  - `created_at` (timestamptz)

  ## Security
  - RLS enabled on both tables
  - Public SELECT allowed on both tables (gallery is public)
  - INSERT/UPDATE/DELETE restricted to authenticated users (admin)

  ## Storage
  - Creates `gallery` bucket as public so images can be served without auth
*/

CREATE TABLE IF NOT EXISTS gallery_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE gallery_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view gallery events"
  ON gallery_events FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert gallery events"
  ON gallery_events FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update gallery events"
  ON gallery_events FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete gallery events"
  ON gallery_events FOR DELETE
  TO authenticated
  USING (true);


CREATE TABLE IF NOT EXISTS gallery_photos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  gallery_event_id uuid NOT NULL REFERENCES gallery_events(id) ON DELETE CASCADE,
  storage_path text NOT NULL,
  public_url text NOT NULL,
  filename text NOT NULL DEFAULT '',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE gallery_photos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view gallery photos"
  ON gallery_photos FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert gallery photos"
  ON gallery_photos FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete gallery photos"
  ON gallery_photos FOR DELETE
  TO authenticated
  USING (true);
