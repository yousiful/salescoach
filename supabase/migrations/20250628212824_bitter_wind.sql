-- Add gamification columns to user_progress table
ALTER TABLE user_progress
ADD COLUMN IF NOT EXISTS total_points integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS level integer DEFAULT 1,
ADD COLUMN IF NOT EXISTS experience_points integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS achievements jsonb DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS badges jsonb DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS perfect_scores integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS longest_streak integer DEFAULT 0;

-- Update existing records to have default gamification values
UPDATE user_progress 
SET 
  total_points = 0,
  level = 1,
  experience_points = 0,
  achievements = '[]'::jsonb,
  badges = '[]'::jsonb,
  perfect_scores = 0,
  longest_streak = 0
WHERE total_points IS NULL;