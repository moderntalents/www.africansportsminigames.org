/*
  # Add email column to club_registrations

  1. Changes
    - `club_registrations` table: add optional `email` (text) column for coach/club email address
      Used to send Resend confirmation emails to the registrant.
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'club_registrations' AND column_name = 'email'
  ) THEN
    ALTER TABLE club_registrations ADD COLUMN email text;
  END IF;
END $$;
