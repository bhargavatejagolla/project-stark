-- Run this in your Supabase SQL Editor

-- 1. Grant full CRUD access to the anonymous role for all tables
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon;

-- 2. Temporarily disable Row Level Security (RLS) so Jarvis can write freely
-- (Since this is your personal OS, we don't need complex auth policies right now)
ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE skills DISABLE ROW LEVEL SECURITY;
ALTER TABLE projects DISABLE ROW LEVEL SECURITY;
ALTER TABLE learning_courses DISABLE ROW LEVEL SECURITY;
ALTER TABLE company_requirements DISABLE ROW LEVEL SECURITY;
ALTER TABLE study_sessions DISABLE ROW LEVEL SECURITY;
ALTER TABLE tasks DISABLE ROW LEVEL SECURITY;
ALTER TABLE goals DISABLE ROW LEVEL SECURITY;
