-- Run this SQL in your Supabase project's SQL Editor (https://supabase.com/dashboard/project/_/sql/new)

-- Progress tracking table
-- Stores which questions a user has solved per lesson
CREATE TABLE IF NOT EXISTS progress (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  lesson_id TEXT NOT NULL,
  solved_question_indices INTEGER[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, lesson_id)
);

-- Enable Row Level Security
ALTER TABLE progress ENABLE ROW LEVEL SECURITY;

-- Users can only SELECT their own progress
CREATE POLICY "Users can read own progress"
  ON progress FOR SELECT
  USING (auth.uid() = user_id);

-- Users can only INSERT their own progress
CREATE POLICY "Users can insert own progress"
  ON progress FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can only UPDATE their own progress
CREATE POLICY "Users can update own progress"
  ON progress FOR UPDATE
  USING (auth.uid() = user_id);

-- Users can only DELETE their own progress
CREATE POLICY "Users can delete own progress"
  ON progress FOR DELETE
  USING (auth.uid() = user_id);

-- Optional: grant usage on the sequence
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
