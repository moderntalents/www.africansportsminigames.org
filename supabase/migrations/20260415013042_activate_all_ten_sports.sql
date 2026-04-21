/*
  # Activate All Ten Sports Categories

  1. Changes
    - Activate the 10 required sports: Martial Arts, Classical Ballet, Modern Dance,
      Chess, Skating, Football, Swimming, Rugby, Gymnastics, Archery
    - Set registration_fee = 1000 for all active sports
    - Update Martial Arts description to include sub-sections
    - Deduplicate Chess, Skating, Football by deactivating the older duplicate row
    - Add a boolean column `july_event` to flag sports competing on July 25th 2026

  2. New Column
    - `july_event` (boolean, default false) - marks sports active at July 25th 2026 event
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'sports_categories' AND column_name = 'july_event'
  ) THEN
    ALTER TABLE sports_categories ADD COLUMN july_event boolean NOT NULL DEFAULT false;
  END IF;
END $$;

UPDATE sports_categories SET is_active = false, july_event = false;

UPDATE sports_categories SET
  is_active = true, registration_fee = 1000, july_event = true,
  description = 'Sections: Point Sparring, Martial Arts Forms (Kata), and Power Breaking.'
WHERE id = '7ccbb806-5446-44ab-84da-c91b651bfc9c';

UPDATE sports_categories SET
  is_active = true, registration_fee = 1000, july_event = true,
  description = 'Traditional ballet performances and evaluations.'
WHERE id = '80be4c08-9297-46e0-93dd-7679afc927d9';

UPDATE sports_categories SET
  is_active = true, registration_fee = 1000, july_event = true,
  description = 'Contemporary and modern dance categories.'
WHERE id = '43bf10b3-9ed4-414c-b89e-0d1ac8b57bcd';

UPDATE sports_categories SET
  is_active = true, registration_fee = 1000,
  description = 'Strategic board game competition with rapid and classical formats.'
WHERE id = '270d111b-3cbe-4d2d-9088-0e6f540df791';

UPDATE sports_categories SET
  is_active = true, registration_fee = 1000,
  description = 'Roller skating competitions including speed skating and artistic performances.'
WHERE id = '5e621da7-40c9-4f9e-8355-585f51b72474';

UPDATE sports_categories SET
  is_active = true, registration_fee = 1000,
  description = 'Compete in exciting 5-a-side and 7-a-side football tournaments across all age categories.'
WHERE id = 'dc4b64ba-26ef-47ac-a224-088121947757';

UPDATE sports_categories SET
  is_active = true, registration_fee = 1000,
  description = 'Race through the water in freestyle, backstroke, breaststroke, and butterfly disciplines.'
WHERE id = 'c4f8f6f0-3c03-4a7d-80ae-6cee02afad60';

UPDATE sports_categories SET
  is_active = true, registration_fee = 1000,
  description = 'Build teamwork and strength competing in fast-paced tag and contact rugby tournaments.'
WHERE id = '6fc6e7c0-8f52-4556-8f2e-7722ea2ce4bb';

UPDATE sports_categories SET
  is_active = true, registration_fee = 1000,
  description = 'Demonstrate strength, flexibility, and balance across floor, beam, and vault events.'
WHERE id = 'dc863bc6-b88d-41f5-958f-6a47529065ca';

UPDATE sports_categories SET
  is_active = true, registration_fee = 1000,
  description = 'Test precision and focus as you aim for the bullseye in recurve and compound bow events.'
WHERE id = '2659cb56-e82b-4bf2-b456-b91cded915a4';
