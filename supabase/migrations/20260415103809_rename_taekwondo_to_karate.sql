/*
  # Rename Taekwondo to Karate

  1. Changes
    - Updates the `name` and `description` of the Taekwondo entry to Karate
    - Activates the entry so it appears on the Sports page
*/

UPDATE sports_categories
SET
  name = 'Karate',
  description = 'Traditional Japanese martial art emphasizing striking techniques including punches, kicks, and open-hand techniques across multiple weight categories.',
  is_active = true
WHERE id = '146e4a87-d0f3-44c1-bcbd-96cc845ff33b';
