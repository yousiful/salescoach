/*
  # Add premium features and analytics

  1. New Tables
    - `user_subscriptions`
      - Track subscription status and payment info
    - `coaching_sessions`
      - Store detailed session analytics
    - `ai_insights`
      - ML-driven performance metrics
    - `revenue_sharing`
      - Track revenue for cancer research donation

  2. Security
    - Enable RLS on all tables
    - Add strict access policies
*/

-- User Subscriptions
CREATE TABLE IF NOT EXISTS user_subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_ip text REFERENCES user_progress(ip),
  plan_type text NOT NULL,
  amount numeric NOT NULL,
  donation_percentage numeric DEFAULT 30,
  active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  next_billing_date timestamptz
);

-- Coaching Sessions
CREATE TABLE IF NOT EXISTS coaching_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_ip text REFERENCES user_progress(ip),
  session_type text NOT NULL,
  duration interval,
  sentiment_score numeric,
  engagement_metrics jsonb,
  video_analytics jsonb,
  voice_analytics jsonb,
  created_at timestamptz DEFAULT now()
);

-- AI Insights
CREATE TABLE IF NOT EXISTS ai_insights (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_ip text REFERENCES user_progress(ip),
  insight_type text NOT NULL,
  data jsonb,
  confidence_score numeric,
  created_at timestamptz DEFAULT now()
);

-- Revenue Sharing
CREATE TABLE IF NOT EXISTS revenue_sharing (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  amount numeric NOT NULL,
  donation_type text NOT NULL,
  status text DEFAULT 'pending',
  transaction_date timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE user_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE coaching_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_insights ENABLE ROW LEVEL SECURITY;
ALTER TABLE revenue_sharing ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Allow read own subscription"
  ON user_subscriptions
  FOR SELECT
  USING (auth.uid() IS NOT NULL AND user_ip = current_setting('request.headers')::json->>'x-real-ip');

CREATE POLICY "Allow read own sessions"
  ON coaching_sessions
  FOR SELECT
  USING (auth.uid() IS NOT NULL AND user_ip = current_setting('request.headers')::json->>'x-real-ip');

CREATE POLICY "Allow read own insights"
  ON ai_insights
  FOR SELECT
  USING (auth.uid() IS NOT NULL AND user_ip = current_setting('request.headers')::json->>'x-real-ip');

-- Add new columns to user_progress
ALTER TABLE user_progress 
ADD COLUMN IF NOT EXISTS premium_features jsonb DEFAULT '{}',
ADD COLUMN IF NOT EXISTS ai_coach_preferences jsonb DEFAULT '{}',
ADD COLUMN IF NOT EXISTS donation_impact numeric DEFAULT 0;