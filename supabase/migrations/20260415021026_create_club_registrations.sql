/*
  # Create club_registrations table

  ## Summary
  Creates a new table for external organizers (coaches and club owners) to register
  their clubs or teams and affiliate with the Modern African Sports Federation.

  ## New Tables
  - `club_registrations`
    - `id` (uuid, primary key)
    - `club_name` (text) — Name of the coach or club
    - `primary_sport` (text) — The primary sport discipline
    - `phone_number` (text) — Contact phone number
    - `mpesa_code` (text) — M-Pesa transaction reference code
    - `status` (text) — Submission status: pending, verified, rejected
    - `created_at` (timestamptz) — Submission timestamp

  ## Security
  - RLS enabled on `club_registrations`
  - Public INSERT allowed so unregistered organizers can submit (anonymous access)
  - No public SELECT — submissions are admin-only to protect transaction codes
*/

CREATE TABLE IF NOT EXISTS club_registrations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  club_name text NOT NULL,
  primary_sport text NOT NULL,
  phone_number text NOT NULL,
  mpesa_code text NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE club_registrations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit a club registration"
  ON club_registrations
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);
