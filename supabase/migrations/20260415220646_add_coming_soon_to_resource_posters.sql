/*
  # Add coming_soon flag to resource_posters

  1. Changes
    - `resource_posters` table: add `coming_soon` boolean column (default false)
    - This lets us mark specific posters as "Coming Soon" while still displaying them in the grid

  2. Seed Data
    - Insert the two martial arts & ballet tournament posters as coming-soon entries
    - They reference files already served as static assets from the /public folder
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'resource_posters' AND column_name = 'coming_soon'
  ) THEN
    ALTER TABLE resource_posters ADD COLUMN coming_soon boolean NOT NULL DEFAULT false;
  END IF;
END $$;

INSERT INTO resource_posters (title, description, storage_path, public_url, preview_url, file_type, original_filename, display_order, coming_soon)
VALUES
  (
    'ASMG Martial Arts & Ballet Tournament — Wide',
    'Official tournament poster for the Kenyatta University Martial Arts & Ballet Tournament, 25th July 2026.',
    '',
    '/martial_art_poster_1.png',
    '/martial_art_poster_1.png',
    'png',
    'martial_art_poster_1.png',
    0,
    true
  ),
  (
    'ASMG Martial Arts & Ballet Tournament — Portrait',
    'Official portrait poster for the Kenyatta University Martial Arts & Ballet Tournament, 25th July 2026.',
    '',
    '/original_poster_#1.png.jpeg',
    '/original_poster_#1.png.jpeg',
    'jpeg',
    'original_poster_1.jpeg',
    1,
    true
  )
ON CONFLICT DO NOTHING;
