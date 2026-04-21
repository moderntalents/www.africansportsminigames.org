/*
  # Set registration fees: paid sports only

  ## Summary
  Only three sports have a registration fee of Sh 1,000:
    - Martial Arts
    - Modern Dance
    - Classical Ballet

  All other sports have their registration_fee set to NULL so the UI
  can cleanly hide the fee row on their cards.

  ## Changes
  - `registration_fee` = 1000 for Martial Arts, Modern Dance, Classical Ballet
  - `registration_fee` = NULL for every other sports_categories row
*/

UPDATE sports_categories
SET registration_fee = NULL
WHERE name NOT IN ('Martial Arts', 'Modern Dance', 'Classical Ballet');

UPDATE sports_categories
SET registration_fee = 1000
WHERE name IN ('Martial Arts', 'Modern Dance', 'Classical Ballet');
