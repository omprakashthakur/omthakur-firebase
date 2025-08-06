-- Add video_type column to vlogs table to support short vs long video categorization
ALTER TABLE vlogs ADD COLUMN IF NOT EXISTS video_type VARCHAR(10) DEFAULT 'long';

-- Update the platform column to support YT Shorts
-- First, check what platform values we currently have
SELECT DISTINCT platform FROM vlogs;

-- Add a check constraint to ensure valid platform values
ALTER TABLE vlogs DROP CONSTRAINT IF EXISTS vlogs_platform_check;
ALTER TABLE vlogs ADD CONSTRAINT vlogs_platform_check 
CHECK (platform IN ('YouTube', 'YT Shorts', 'Instagram Reels', 'TikTok'));

-- Add a check constraint for video_type
ALTER TABLE vlogs ADD CONSTRAINT vlogs_video_type_check 
CHECK (video_type IN ('short', 'long'));

-- Update existing videos to set video_type based on title analysis
UPDATE vlogs 
SET video_type = 'short',
    platform = 'YT Shorts'
WHERE platform = 'YouTube' 
  AND (
    LOWER(title) LIKE '%#shorts%' OR 
    LOWER(title) LIKE '%#short%' OR 
    LOWER(title) LIKE '%shorts%' OR
    LOWER(title) LIKE '%#reel%' OR
    LOWER(title) LIKE '%#reels%'
  );

-- Set all other YouTube videos to long format
UPDATE vlogs 
SET video_type = 'long'
WHERE platform = 'YouTube' AND video_type IS NULL;

-- Show the results
SELECT platform, video_type, COUNT(*) as count 
FROM vlogs 
GROUP BY platform, video_type 
ORDER BY platform, video_type;
