-- Create Pexels photos table in Supabase

-- This SQL script can be run in the Supabase SQL editor
-- or used as documentation for your schema

CREATE TABLE pexels_photos (
  id TEXT PRIMARY KEY,  -- Format: "pexels-{id}"
  title TEXT,
  description TEXT,
  src TEXT NOT NULL,
  alt TEXT,
  category TEXT DEFAULT 'pexels',
  tags TEXT[], -- Array of tags
  photographer_name TEXT,
  photographer_url TEXT,
  width INTEGER,
  height INTEGER,
  original_url TEXT,
  featured BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Add Row Level Security (RLS) policies
ALTER TABLE pexels_photos ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read pexels photos
CREATE POLICY "Anyone can view pexels photos" 
ON pexels_photos FOR SELECT 
TO public 
USING (true);

-- Allow anyone to insert/update (for sync script with anon key)
CREATE POLICY "Allow public inserts for pexels photos" 
ON pexels_photos FOR INSERT 
TO public
WITH CHECK (true);

CREATE POLICY "Allow public updates for pexels photos" 
ON pexels_photos FOR UPDATE 
TO public
USING (true);

-- Create a function to sync photos from Pexels API to Supabase
-- This is for documentation purposes - actual sync will happen through the Next.js API
CREATE OR REPLACE FUNCTION sync_pexels_photos() RETURNS void AS $$
BEGIN
    -- This function would be implemented in your Next.js API
    -- It's included here just for documentation
    RAISE NOTICE 'This function should be called from your Next.js API';
END;
$$ LANGUAGE plpgsql;