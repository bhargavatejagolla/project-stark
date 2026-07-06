-- Run this in Supabase SQL Editor
ALTER TABLE study_sessions
ADD COLUMN skill_id UUID REFERENCES skills(id) ON DELETE SET NULL;
