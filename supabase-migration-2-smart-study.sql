-- Run this SQL in your Supabase project's SQL Editor
-- Adds smart study progress tracking table

CREATE TABLE IF NOT EXISTS smart_study_progress (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  card_id TEXT NOT NULL,
  topic TEXT NOT NULL,
  difficulty TEXT NOT NULL,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  last_reviewed BIGINT,
  next_review BIGINT,
  interval_days REAL DEFAULT 0,
  ease_factor REAL DEFAULT 2.5,
  repetitions INTEGER DEFAULT 0,
  practice_correct INTEGER DEFAULT 0,
  practice_total INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, card_id)
);

ALTER TABLE smart_study_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own smart study progress"
  ON smart_study_progress FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own smart study progress"
  ON smart_study_progress FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own smart study progress"
  ON smart_study_progress FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own smart study progress"
  ON smart_study_progress FOR DELETE
  USING (auth.uid() = user_id);

GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
