/*
  # Add skip tracking for payment wall

  1. Changes
    - Add `skip_count` column to track how many times user has skipped payment
    - Default value is 0
    - Users can skip up to 3 times before being forced to pay

  2. Security
    - No changes to RLS policies needed
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'user_progress' AND column_name = 'skip_count'
  ) THEN
    ALTER TABLE user_progress ADD COLUMN skip_count integer DEFAULT 0;
  END IF;
END $$;