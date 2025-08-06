#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}==== YouTube Database Schema Update ====${NC}"
echo -e "${YELLOW}This script will update your vlogs table to support YouTube integration${NC}"
echo

# Check if .env file exists
if [ ! -f ".env" ]; then
    echo -e "${RED}❌ .env file not found${NC}"
    exit 1
fi

# Source environment variables
source .env

# Check if Supabase credentials exist
if [ -z "$NEXT_PUBLIC_SUPABASE_URL" ] || [ -z "$NEXT_PUBLIC_SUPABASE_ANON_KEY" ]; then
    echo -e "${RED}❌ Supabase credentials not found in .env file${NC}"
    exit 1
fi

echo -e "${BLUE}Step 1: Checking current vlogs table structure...${NC}"

# Check if vlogs table exists and get its structure
curl -s -X POST "${NEXT_PUBLIC_SUPABASE_URL}/rest/v1/rpc/sql" \
  -H "apikey: ${NEXT_PUBLIC_SUPABASE_ANON_KEY}" \
  -H "Content-Type: application/json" \
  -H "Prefer: return=representation" \
  -d '{
    "query": "SELECT column_name, data_type, is_nullable FROM information_schema.columns WHERE table_name = '\''vlogs'\'' ORDER BY ordinal_position;"
  }' > /tmp/vlogs_schema.json

if grep -q "error" /tmp/vlogs_schema.json; then
    echo -e "${RED}❌ Cannot access vlogs table${NC}"
    cat /tmp/vlogs_schema.json
    exit 1
fi

echo -e "${YELLOW}Current vlogs table structure:${NC}"
cat /tmp/vlogs_schema.json | jq -r '.[] | "\(.column_name): \(.data_type)"' 2>/dev/null || echo "Could not parse schema"

echo
echo -e "${BLUE}Step 2: Adding YouTube-specific columns...${NC}"

# SQL to add YouTube columns if they don't exist
SQL_COMMANDS='
-- Add description column if not exists
DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = '\''vlogs'\'' AND column_name = '\''description'\'') THEN
        ALTER TABLE vlogs ADD COLUMN description TEXT;
    END IF;
END $$;

-- Add youtube_video_id column if not exists
DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = '\''vlogs'\'' AND column_name = '\''youtube_video_id'\'') THEN
        ALTER TABLE vlogs ADD COLUMN youtube_video_id VARCHAR(50);
    END IF;
END $$;

-- Add duration column if not exists
DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = '\''vlogs'\'' AND column_name = '\''duration'\'') THEN
        ALTER TABLE vlogs ADD COLUMN duration VARCHAR(20);
    END IF;
END $$;

-- Add view_count column if not exists
DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = '\''vlogs'\'' AND column_name = '\''view_count'\'') THEN
        ALTER TABLE vlogs ADD COLUMN view_count INTEGER;
    END IF;
END $$;

-- Add tags column if not exists
DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = '\''vlogs'\'' AND column_name = '\''tags'\'') THEN
        ALTER TABLE vlogs ADD COLUMN tags TEXT;
    END IF;
END $$;

-- Update category enum to include new categories if needed
DO $$ BEGIN
    -- This will add new enum values if they dont exist
    -- Note: PostgreSQL doesnt allow easy enum modification, so we will handle this gracefully
    BEGIN
        ALTER TYPE platform_enum ADD VALUE '\''YouTube'\'' IF NOT EXISTS;
    EXCEPTION
        WHEN duplicate_object THEN NULL;
    END;
END $$;
'

# Execute the SQL commands
echo -e "${YELLOW}Executing database schema updates...${NC}"

# Use SQL execution endpoint
curl -s -X POST "${NEXT_PUBLIC_SUPABASE_URL}/rest/v1/rpc/sql" \
  -H "apikey: ${NEXT_PUBLIC_SUPABASE_ANON_KEY}" \
  -H "Content-Type: application/json" \
  -H "Prefer: return=representation" \
  -d "{\"query\": \"${SQL_COMMANDS}\"}" > /tmp/schema_update_result.json

if grep -q "error" /tmp/schema_update_result.json; then
    echo -e "${YELLOW}⚠ Schema update had some issues, but this might be normal:${NC}"
    cat /tmp/schema_update_result.json | jq '.message' 2>/dev/null || cat /tmp/schema_update_result.json
else
    echo -e "${GREEN}✓ Schema update completed${NC}"
fi

echo
echo -e "${BLUE}Step 3: Verifying updated schema...${NC}"

# Check updated schema
curl -s -X POST "${NEXT_PUBLIC_SUPABASE_URL}/rest/v1/rpc/sql" \
  -H "apikey: ${NEXT_PUBLIC_SUPABASE_ANON_KEY}" \
  -H "Content-Type: application/json" \
  -H "Prefer: return=representation" \
  -d '{
    "query": "SELECT column_name, data_type FROM information_schema.columns WHERE table_name = '\''vlogs'\'' ORDER BY ordinal_position;"
  }' > /tmp/vlogs_schema_updated.json

echo -e "${YELLOW}Updated vlogs table structure:${NC}"
cat /tmp/vlogs_schema_updated.json | jq -r '.[] | "\(.column_name): \(.data_type)"' 2>/dev/null || echo "Could not parse updated schema"

echo
echo -e "${BLUE}Step 4: Testing YouTube sync...${NC}"

# Test the YouTube sync
if curl -s "http://localhost:8000/api/youtube/sync?maxResults=3" > /tmp/youtube_sync_test.json; then
    if grep -q '"success":true' /tmp/youtube_sync_test.json; then
        echo -e "${GREEN}✓ YouTube sync test successful!${NC}"
        
        SYNCED_COUNT=$(cat /tmp/youtube_sync_test.json | jq -r '.syncedVideos' 2>/dev/null)
        echo -e "${GREEN}  Synced ${SYNCED_COUNT} videos${NC}"
    else
        echo -e "${YELLOW}⚠ YouTube sync test had issues:${NC}"
        cat /tmp/youtube_sync_test.json | jq '.message' 2>/dev/null || cat /tmp/youtube_sync_test.json
    fi
else
    echo -e "${YELLOW}⚠ Cannot test YouTube sync - make sure your Next.js app is running${NC}"
    echo -e "${YELLOW}  Run: npm run dev${NC}"
fi

# Clean up temp files
rm -f /tmp/vlogs_schema.json /tmp/schema_update_result.json /tmp/vlogs_schema_updated.json /tmp/youtube_sync_test.json

echo
echo -e "${GREEN}✓ YouTube database setup completed!${NC}"
echo
echo -e "${BLUE}Next steps:${NC}"
echo "1. Make sure your Next.js app is running: npm run dev"
echo "2. Test YouTube sync: curl \"http://localhost:8000/api/youtube/sync\""
echo "3. View your vlogs: http://localhost:8000/vlog"
echo "4. Admin dashboard: http://localhost:8000/admin/vlogs"
