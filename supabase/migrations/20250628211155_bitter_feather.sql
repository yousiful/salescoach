/*
  # Add usage tracking to user_progress

  1. Changes
    - Add usage_minutes column to track time spent
    - Update existing records to have 0 usage_minutes

  2. Security
    - Maintain existing RLS policies
*/

-- Add usage tracking column
ALTER TABLE user_progress
ADD COLUMN IF NOT EXISTS usage_minutes integer DEFAULT 0;

-- Update existing records to have 0 usage_minutes
UPDATE user_progress 
SET usage_minutes = 0 
WHERE usage_minutes IS NULL;