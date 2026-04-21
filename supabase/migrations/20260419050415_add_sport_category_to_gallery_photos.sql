/*
  # Add sport_category to gallery_photos

  ## Changes
  1. Modified Tables
    - `gallery_photos`
      - Added `sport_category` (text, nullable) — stores the sport category tag for each photo
        Valid values: 'Karate', 'Skating', 'Football', 'Ballet', 'Chess', 'General'

  ## Notes
  - Column is nullable so existing photos are not broken (they will have NULL, treated as 'General')
  - No RLS changes needed; existing policies already cover this column
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'gallery_photos' AND column_name = 'sport_category'
  ) THEN
    ALTER TABLE gallery_photos ADD COLUMN sport_category text DEFAULT 'General';
  END IF;
END $$;
