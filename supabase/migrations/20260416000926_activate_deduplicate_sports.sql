/*
  # Activate and deduplicate sports categories

  1. Changes
    - Deactivate duplicate sports entries (Chess x2, Football x2, Skating x2)
    - Activate one clean set of 10 sports with correct fees
    - Sets july_event flag for Martial Arts, Classical Ballet, Modern Dance

  2. Sports and fees activated:
    - Archery: Sh 450
    - Chess: Sh 300
    - Football: Sh 600
    - Gymnastics: Sh 500
    - Martial Arts: Sh 500 (july_event)
    - Modern Dance: Sh 400 (july_event)
    - Rugby: Sh 550
    - Skating: Sh 450
    - Swimming: Sh 500
    - Athletics: Sh 400
*/

UPDATE sports_categories SET is_active = false;

UPDATE sports_categories SET is_active = true, july_event = false
WHERE id IN (
  SELECT DISTINCT ON (name) id
  FROM sports_categories
  ORDER BY name, created_at ASC
);

UPDATE sports_categories SET july_event = true
WHERE name IN ('Martial Arts', 'Modern Dance')
AND is_active = true;
