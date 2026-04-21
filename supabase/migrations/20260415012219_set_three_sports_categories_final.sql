/*
  # Set Exactly Three Sports Categories

  1. Changes
    - Deactivate ALL existing sports categories
    - Update Martial Arts: new description with three registration options, fee = 1000
    - Update Ballet -> rename to Classical Ballet, new description, fee = 1000
    - Update Modern Dance: new description, fee = 1000
    - Re-activate only the three above

  2. Result
    - Only Martial Arts, Classical Ballet, and Modern Dance are active
    - All others are hidden from the frontend
*/

UPDATE sports_categories SET is_active = false;

UPDATE sports_categories
SET
  name = 'Classical Ballet',
  description = 'Traditional ballet performances and evaluations.',
  icon = 'star',
  registration_fee = 1000,
  is_active = true
WHERE id = '80be4c08-9297-46e0-93dd-7679afc927d9';

UPDATE sports_categories
SET
  description = 'Registration options: Point Sparring, Martial Arts Forms (Kata), and Power Breaking.',
  icon = 'shield',
  registration_fee = 1000,
  is_active = true
WHERE id = '7ccbb806-5446-44ab-84da-c91b651bfc9c';

UPDATE sports_categories
SET
  description = 'Contemporary and modern dance categories.',
  icon = 'music2',
  registration_fee = 1000,
  is_active = true
WHERE id = '43bf10b3-9ed4-414c-b89e-0d1ac8b57bcd';
