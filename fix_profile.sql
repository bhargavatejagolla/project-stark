-- Run this in your Supabase SQL Editor to fix the Foreign Key Constraint

-- Insert just the required ID to satisfy the constraint
INSERT INTO profiles (id)
VALUES ('5ab9ee3e-4bfc-4e51-8935-cbb926668752')
ON CONFLICT (id) DO NOTHING;
