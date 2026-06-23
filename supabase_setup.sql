-- Create the teams table
CREATE TABLE teams (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  team_name TEXT NOT NULL UNIQUE,
  score INTEGER DEFAULT 0,
  time_remaining INTEGER DEFAULT 10800,
  active_chapter INTEGER DEFAULT 1,
  unlocked_chapters INTEGER[] DEFAULT '{1}',
  chapter1 JSONB DEFAULT '{}',
  chapter2 JSONB DEFAULT '{}',
  chapter3 JSONB DEFAULT '{}',
  chapter4 JSONB DEFAULT '{}',
  chapter5 JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE teams ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to read all teams (for leaderboard)
CREATE POLICY "Anyone can read teams" ON teams
  FOR SELECT USING (true);

-- Allow users to insert their own team row (on registration)
CREATE POLICY "Users can insert their own team" ON teams
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Allow users to update their own team row
CREATE POLICY "Users can update their own team" ON teams
  FOR UPDATE USING (auth.uid() = id);

-- Update timestamp trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_teams_updated_at
    BEFORE UPDATE ON teams
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
