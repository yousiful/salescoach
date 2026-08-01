/*
  # Create user progress tracking table

  1. New Tables
    - `user_progress`
      - `id` (uuid, primary key)
      - `ip` (text, unique)
      - `completed_modules` (text array)
      - `role_play_sessions` (integer)
      - `average_score` (numeric)
      - `learning_streak` (integer)
      - `last_active` (timestamptz)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on `user_progress` table
    - Add policies for read/write access
*/

CREATE TABLE IF NOT EXISTS user_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ip text UNIQUE NOT NULL,
  completed_modules text[] DEFAULT '{}',
  role_play_sessions integer DEFAULT 0,
  average_score numeric DEFAULT 0,
  learning_streak integer DEFAULT 0,
  last_active timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Allow read own progress"
  ON user_progress
  FOR SELECT
  USING (true);

CREATE POLICY "Allow update own progress"
  ON user_progress
  FOR UPDATE
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow insert own progress"
  ON user_progress
  FOR INSERT
  WITH CHECK (true);