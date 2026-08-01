/*
  # Add trial tracking and subscription features

  1. New Columns
    - Add trial_started_at to user_progress
    - Add trial_completed to user_progress
    - Add subscription_status to user_progress

  2. Changes
    - Update user_progress table with new columns
    - Add check constraints for subscription status
*/

ALTER TABLE user_progress
ADD COLUMN IF NOT EXISTS trial_started_at timestamptz DEFAULT now(),
ADD COLUMN IF NOT EXISTS trial_completed boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS subscription_status text DEFAULT 'trial' CHECK (subscription_status IN ('trial', 'active', 'expired'));

-- Update existing rows to have trial_started_at set
UPDATE user_progress 
SET trial_started_at = created_at 
WHERE trial_started_at IS NULL;