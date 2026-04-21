/*
  # African Sports Mini Games - Database Schema

  ## Overview
  Complete database schema for managing the African Sports Mini Games platform including
  sports categories, participant registrations, events, results, and user management.

  ## Tables Created

  ### 1. `sports_categories`
  Stores all available sports/competitions
  - `id` (uuid, primary key)
  - `name` (text) - Sport name (e.g., Taekwondo, Football)
  - `description` (text) - Sport description and rules
  - `icon` (text) - Icon identifier for UI
  - `min_age` (integer) - Minimum age requirement
  - `max_age` (integer) - Maximum age requirement
  - `registration_fee` (decimal) - Fee in local currency
  - `is_active` (boolean) - Whether accepting registrations
  - `created_at` (timestamptz)

  ### 2. `participants`
  Stores all registered participants
  - `id` (uuid, primary key)
  - `user_id` (uuid, foreign key to auth.users) - Linked user account
  - `full_name` (text) - Participant's full name
  - `email` (text) - Contact email
  - `phone` (text) - Contact phone number
  - `date_of_birth` (date) - For age verification
  - `country` (text) - Country of origin
  - `school_club` (text) - School or club affiliation
  - `registration_type` (text) - 'individual', 'school', 'club'
  - `photo_url` (text) - Profile photo URL
  - `id_document_url` (text) - ID/school letter URL
  - `created_at` (timestamptz)

  ### 3. `registrations`
  Tracks sport registrations for each participant
  - `id` (uuid, primary key)
  - `participant_id` (uuid, foreign key) - Who registered
  - `sport_id` (uuid, foreign key) - Which sport
  - `payment_status` (text) - 'pending', 'completed', 'failed'
  - `payment_method` (text) - 'mpesa', 'card', etc.
  - `payment_reference` (text) - Transaction reference
  - `registration_date` (timestamptz)
  - `status` (text) - 'registered', 'confirmed', 'cancelled'

  ### 4. `events`
  Stores scheduled events and fixtures
  - `id` (uuid, primary key)
  - `sport_id` (uuid, foreign key)
  - `title` (text) - Event title
  - `description` (text) - Event details
  - `event_date` (timestamptz) - When the event occurs
  - `venue` (text) - Location
  - `status` (text) - 'scheduled', 'ongoing', 'completed'
  - `created_at` (timestamptz)

  ### 5. `results`
  Records competition results
  - `id` (uuid, primary key)
  - `event_id` (uuid, foreign key)
  - `participant_id` (uuid, foreign key)
  - `position` (integer) - Final position (1st, 2nd, etc.)
  - `score` (text) - Score/time/points
  - `medal` (text) - 'gold', 'silver', 'bronze', null
  - `created_at` (timestamptz)

  ## Security
  - RLS enabled on all tables
  - Public read access for sports_categories and events
  - Authenticated users can view their own participant/registration data
  - Only admins can modify data (admin role check via JWT)
*/

-- Sports Categories Table
CREATE TABLE IF NOT EXISTS sports_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text DEFAULT '',
  icon text DEFAULT 'trophy',
  min_age integer DEFAULT 5,
  max_age integer DEFAULT 18,
  registration_fee decimal(10,2) DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE sports_categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active sports"
  ON sports_categories FOR SELECT
  USING (is_active = true);

CREATE POLICY "Admins can manage sports"
  ON sports_categories FOR ALL
  TO authenticated
  USING ((auth.jwt()->>'role')::text = 'admin')
  WITH CHECK ((auth.jwt()->>'role')::text = 'admin');

-- Participants Table
CREATE TABLE IF NOT EXISTS participants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text NOT NULL,
  email text NOT NULL,
  phone text DEFAULT '',
  date_of_birth date NOT NULL,
  country text DEFAULT 'Kenya',
  school_club text DEFAULT '',
  registration_type text DEFAULT 'individual',
  photo_url text DEFAULT '',
  id_document_url text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  CONSTRAINT valid_registration_type CHECK (registration_type IN ('individual', 'school', 'club'))
);

ALTER TABLE participants ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own participant profile"
  ON participants FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own participant profile"
  ON participants FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own participant profile"
  ON participants FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all participants"
  ON participants FOR SELECT
  TO authenticated
  USING ((auth.jwt()->>'role')::text = 'admin');

-- Registrations Table
CREATE TABLE IF NOT EXISTS registrations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  participant_id uuid REFERENCES participants(id) ON DELETE CASCADE NOT NULL,
  sport_id uuid REFERENCES sports_categories(id) ON DELETE CASCADE NOT NULL,
  payment_status text DEFAULT 'pending',
  payment_method text DEFAULT '',
  payment_reference text DEFAULT '',
  registration_date timestamptz DEFAULT now(),
  status text DEFAULT 'registered',
  CONSTRAINT valid_payment_status CHECK (payment_status IN ('pending', 'completed', 'failed')),
  CONSTRAINT valid_status CHECK (status IN ('registered', 'confirmed', 'cancelled'))
);

ALTER TABLE registrations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own registrations"
  ON registrations FOR SELECT
  TO authenticated
  USING (
    participant_id IN (
      SELECT id FROM participants WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create own registrations"
  ON registrations FOR INSERT
  TO authenticated
  WITH CHECK (
    participant_id IN (
      SELECT id FROM participants WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can manage all registrations"
  ON registrations FOR ALL
  TO authenticated
  USING ((auth.jwt()->>'role')::text = 'admin')
  WITH CHECK ((auth.jwt()->>'role')::text = 'admin');

-- Events Table
CREATE TABLE IF NOT EXISTS events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sport_id uuid REFERENCES sports_categories(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  description text DEFAULT '',
  event_date timestamptz NOT NULL,
  venue text DEFAULT '',
  status text DEFAULT 'scheduled',
  created_at timestamptz DEFAULT now(),
  CONSTRAINT valid_event_status CHECK (status IN ('scheduled', 'ongoing', 'completed', 'cancelled'))
);

ALTER TABLE events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view events"
  ON events FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage events"
  ON events FOR ALL
  TO authenticated
  USING ((auth.jwt()->>'role')::text = 'admin')
  WITH CHECK ((auth.jwt()->>'role')::text = 'admin');

-- Results Table
CREATE TABLE IF NOT EXISTS results (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id uuid REFERENCES events(id) ON DELETE CASCADE NOT NULL,
  participant_id uuid REFERENCES participants(id) ON DELETE CASCADE NOT NULL,
  position integer DEFAULT 0,
  score text DEFAULT '',
  medal text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  CONSTRAINT valid_medal CHECK (medal IN ('gold', 'silver', 'bronze', ''))
);

ALTER TABLE results ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view results"
  ON results FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage results"
  ON results FOR ALL
  TO authenticated
  USING ((auth.jwt()->>'role')::text = 'admin')
  WITH CHECK ((auth.jwt()->>'role')::text = 'admin');

-- Insert sample sports categories
INSERT INTO sports_categories (name, description, icon, min_age, max_age, registration_fee, is_active) VALUES
  ('Taekwondo', 'Korean martial art featuring powerful kicks and strikes. Categories for different belt levels and age groups.', 'hand', 6, 18, 500, true),
  ('Skating', 'Roller skating competitions including speed skating and artistic performances.', 'circle', 7, 18, 450, true),
  ('Football', '5-a-side and 7-a-side football tournaments for various age categories.', 'goal', 8, 18, 600, true),
  ('Chess', 'Strategic board game competition with rapid and blitz formats.', 'brain', 6, 18, 300, true),
  ('Basketball', '3x3 basketball tournaments promoting fast-paced action and skill.', 'basketball', 10, 18, 550, true),
  ('Athletics', 'Track and field events including sprints, relays, long jump, and high jump.', 'zap', 8, 18, 400, true)
ON CONFLICT DO NOTHING;
