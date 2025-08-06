-- SQL Script to update vlogs table for YouTube integration
-- Run this in your Supabase SQL editor

-- Add new columns to vlogs table
ALTER TABLE vlogs 
ADD COLUMN IF NOT EXISTS description TEXT,
ADD COLUMN IF NOT EXISTS youtube_video_id VARCHAR(50),
ADD COLUMN IF NOT EXISTS duration VARCHAR(20),
ADD COLUMN IF NOT EXISTS view_count INTEGER,
ADD COLUMN IF NOT EXISTS tags TEXT;

-- Update the category enum to include new categories
-- Note: In PostgreSQL, we need to be careful with enum modifications
-- First check if the enum type exists and what values it has

-- If you're using text for category instead of enum, you can skip this
-- Otherwise, you might need to alter the enum type

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_vlogs_youtube_video_id ON vlogs(youtube_video_id);
CREATE INDEX IF NOT EXISTS idx_vlogs_platform ON vlogs(platform);
CREATE INDEX IF NOT EXISTS idx_vlogs_category ON vlogs(category);
CREATE INDEX IF NOT EXISTS idx_vlogs_created_at ON vlogs(created_at);

-- Show the updated table structure
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'vlogs' 
ORDER BY ordinal_position;
