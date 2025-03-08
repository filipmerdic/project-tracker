-- First, drop the table if it exists to avoid conflicts
DROP TABLE IF EXISTS projects;

-- Projects table
CREATE TABLE projects (
  id UUID PRIMARY KEY,
  name TEXT NOT NULL,
  status TEXT NOT NULL,
  "finalDeadline" TIMESTAMPTZ NOT NULL,
  "nextPhaseDate" TIMESTAMPTZ NOT NULL,
  "createdAt" TIMESTAMPTZ DEFAULT NOW(),
  "updatedAt" TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- Create a policy that allows all operations for now
-- In a production app, you would want more restrictive policies
CREATE POLICY "Allow all operations for all users" ON projects
  FOR ALL
  USING (true)
  WITH CHECK (true); 