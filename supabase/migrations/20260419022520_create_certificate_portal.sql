/*
  # Certificate Verification Portal

  ## Overview
  Adds two tables to support the Certificate Verification Portal feature:
  1. `certificates` — official records that can be looked up by a unique Certificate ID
  2. `certificate_requests` — renewal/replacement requests submitted by users

  ## New Tables

  ### `certificates`
  Stores issued certificates. Admins insert records here; users query by certificate_id.
  - `id` (uuid, PK) — internal row id
  - `certificate_id` (text, unique, NOT NULL) — human-readable ID (e.g. ASMG-2026-00123)
  - `holder_name` (text) — full name of certificate holder
  - `sport` (text) — sport category the certificate is for
  - `issue_date` (date) — date the certificate was issued
  - `expiry_date` (date, nullable) — optional expiry date
  - `status` (text) — 'valid', 'expired', or 'revoked'
  - `created_at` (timestamptz)

  ### `certificate_requests`
  Stores renewal/replacement requests from users.
  - `id` (uuid, PK)
  - `full_name` (text, NOT NULL)
  - `email` (text, NOT NULL)
  - `sport` (text, NOT NULL)
  - `issue_date` (text, nullable) — stored as text since user may not know exact date
  - `request_type` (text) — 'renewal' or 'replacement'
  - `status` (text) — 'pending', 'processing', 'sent', 'rejected'
  - `created_at` (timestamptz)

  ## Security
  - RLS enabled on both tables
  - `certificates`: public SELECT (anyone can verify), no public INSERT/UPDATE/DELETE
  - `certificate_requests`: public INSERT only (anyone can submit a request), no public SELECT
*/

CREATE TABLE IF NOT EXISTS certificates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  certificate_id text UNIQUE NOT NULL,
  holder_name text NOT NULL DEFAULT '',
  sport text NOT NULL DEFAULT '',
  issue_date date,
  expiry_date date,
  status text NOT NULL DEFAULT 'valid',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE certificates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can verify certificates by searching"
  ON certificates FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE TABLE IF NOT EXISTS certificate_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name text NOT NULL,
  email text NOT NULL,
  sport text NOT NULL,
  issue_date text DEFAULT '',
  request_type text NOT NULL DEFAULT 'replacement',
  status text NOT NULL DEFAULT 'pending',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE certificate_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit a certificate request"
  ON certificate_requests FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

INSERT INTO certificates (certificate_id, holder_name, sport, issue_date, status) VALUES
  ('ASMG-2026-00001', 'Amara Diallo', 'Football', '2026-01-15', 'valid'),
  ('ASMG-2026-00002', 'Chisom Okafor', 'Swimming', '2026-01-15', 'valid'),
  ('ASMG-2026-00003', 'Kofi Asante', 'Chess', '2026-01-20', 'valid'),
  ('ASMG-2026-00004', 'Fatima Nkosi', 'Classical Ballet', '2026-01-20', 'valid'),
  ('ASMG-2026-00005', 'Tendai Mwangi', 'Martial Arts', '2026-02-01', 'valid'),
  ('ASMG-2026-00006', 'Aisha Kamara', 'Modern Dance', '2026-02-01', 'valid'),
  ('ASMG-2026-00007', 'Emeka Eze', 'Athletics', '2026-02-10', 'valid'),
  ('ASMG-2026-00008', 'Zanele Dlamini', 'Gymnastics', '2026-02-10', 'valid'),
  ('ASMG-2026-00009', 'Kwame Boateng', 'Rugby', '2026-02-15', 'valid'),
  ('ASMG-2026-00010', 'Ngozi Adeyemi', 'Basketball', '2026-02-15', 'valid')
ON CONFLICT (certificate_id) DO NOTHING;
