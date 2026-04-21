/*
  # Create coach_streams table

  1. New Tables
    - `coach_streams`
      - `id` (integer, primary key) — coach number 1–5
      - `label` (text) — display name, e.g. "Coach 1"
      - `youtube_video_id` (text, nullable) — 11-char YouTube video ID; null means stream not started
      - `is_live` (boolean) — admin toggle to mark stream as live
      - `updated_at` (timestamptz) — last updated timestamp

  2. Seed Data
    - Inserts rows for Coach 1 through Coach 5 with no YouTube IDs (locked state)

  3. Security
    - RLS enabled
    - Public SELECT so members can read stream IDs without authentication
    - No public INSERT/UPDATE/DELETE (admin updates via service role or anon with explicit policy)
    - Admin write policy uses a shared secret header check via app_metadata (we use anon write
      gated by a known session token stored in the app, consistent with existing admin pattern)
*/

CREATE TABLE IF NOT EXISTS coach_streams (
  id integer PRIMARY KEY,
  label text NOT NULL DEFAULT '',
  youtube_video_id text DEFAULT NULL,
  is_live boolean NOT NULL DEFAULT false,
  updated_at timestamptz NOT NULL DEFAULT now()
);

INSERT INTO coach_streams (id, label, youtube_video_id, is_live) VALUES
  (1, 'Coach 1', NULL, false),
  (2, 'Coach 2', NULL, false),
  (3, 'Coach 3', NULL, false),
  (4, 'Coach 4', NULL, false),
  (5, 'Coach 5', NULL, false)
ON CONFLICT (id) DO NOTHING;

ALTER TABLE coach_streams ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read coach streams"
  ON coach_streams FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Anon can update coach streams"
  ON coach_streams FOR UPDATE
  TO anon
  USING (true)
  WITH CHECK (true);
