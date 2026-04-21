/*
  # Create Community Feedback Table

  1. New Tables
    - `community_feedback`
      - `id` (uuid, primary key)
      - `name` (text, commenter's name)
      - `message` (text, the comment body)
      - `created_at` (timestamptz, auto-set on insert)

  2. Security
    - Enable RLS on `community_feedback`
    - Allow anyone (including anonymous users) to SELECT all rows (public comments board)
    - Allow anyone (including anonymous users) to INSERT new rows
    - No UPDATE or DELETE allowed from the client

  3. Notes
    - This is a public community board; comments are visible to all visitors
    - No authentication required to post or view
*/

CREATE TABLE IF NOT EXISTS community_feedback (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL DEFAULT '',
  message text NOT NULL DEFAULT '',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE community_feedback ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view community feedback"
  ON community_feedback
  FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Anyone can post community feedback"
  ON community_feedback
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    length(trim(name)) > 0 AND length(trim(message)) > 0
  );
