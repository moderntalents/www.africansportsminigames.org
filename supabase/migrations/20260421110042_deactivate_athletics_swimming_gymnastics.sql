/*
  # Deactivate Athletics, Swimming, and Gymnastics

  1. Changes
    - Set `is_active = false` for the Athletics, Swimming, and Gymnastics
      entries in `sports_categories` so they are removed from the sports grid.
  2. Notes
    - No data is deleted; rows remain for historical reference and can be
      reactivated in the future if needed.
*/

UPDATE sports_categories
SET is_active = false
WHERE name IN ('Athletics', 'Swimming', 'Gymnastics');
