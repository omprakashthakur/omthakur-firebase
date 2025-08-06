#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}==== YouTube API Setup ====${NC}"
echo -e "${YELLOW}This script will help you set up YouTube Data API integration${NC}"
echo

# Check if .env file exists
if [ ! -f ".env" ]; then
    echo -e "${YELLOW}Creating .env file from .env.example...${NC}"
    cp .env.example .env
fi

echo -e "${BLUE}Step 1: Get YouTube Data API Key${NC}"
echo "1. Go to Google Cloud Console: https://console.cloud.google.com/"
echo "2. Create a new project or select an existing one"
echo "3. Enable YouTube Data API v3"
echo "4. Create credentials (API Key)"
echo "5. Restrict the API key to YouTube Data API v3"
echo

read -p "Enter your YouTube Data API Key: " YOUTUBE_API_KEY

if [ -z "$YOUTUBE_API_KEY" ]; then
    echo -e "${RED}❌ YouTube API Key cannot be empty${NC}"
    exit 1
fi

echo -e "${BLUE}Step 2: Get YouTube Channel ID${NC}"
echo "1. Go to your YouTube channel"
echo "2. Copy the channel ID from the URL (after /channel/)"
echo "   OR use this tool: https://commentpicker.com/youtube-channel-id.php"
echo

read -p "Enter your YouTube Channel ID: " YOUTUBE_CHANNEL_ID

if [ -z "$YOUTUBE_CHANNEL_ID" ]; then
    echo -e "${RED}❌ YouTube Channel ID cannot be empty${NC}"
    exit 1
fi

# Add or update YouTube credentials in .env file
echo -e "${YELLOW}Updating .env file...${NC}"

# Remove existing YouTube entries if they exist
sed -i '/^YOUTUBE_API_KEY=/d' .env
sed -i '/^YOUTUBE_CHANNEL_ID=/d' .env

# Add new YouTube credentials
echo "" >> .env
echo "# YouTube Data API Configuration" >> .env
echo "YOUTUBE_API_KEY=$YOUTUBE_API_KEY" >> .env
echo "YOUTUBE_CHANNEL_ID=$YOUTUBE_CHANNEL_ID" >> .env

echo -e "${GREEN}✓ YouTube API credentials added to .env file${NC}"
echo

# Test the API connection
echo -e "${BLUE}Testing YouTube API connection...${NC}"

# Check if the app is running
if curl -s "http://localhost:8000/api/youtube/videos?maxResults=1" > /tmp/youtube_test.json 2>/dev/null; then
    if grep -q '"success":true' /tmp/youtube_test.json; then
        echo -e "${GREEN}✓ YouTube API connection successful!${NC}"
        
        # Show first video
        VIDEO_TITLE=$(cat /tmp/youtube_test.json | grep -o '"title":"[^"]*' | head -1 | cut -d'"' -f4)
        if [ ! -z "$VIDEO_TITLE" ]; then
            echo -e "${GREEN}  Found video: $VIDEO_TITLE${NC}"
        fi
    else
        echo -e "${YELLOW}⚠ API credentials saved but connection test failed${NC}"
        echo -e "${YELLOW}  Make sure your API key and channel ID are correct${NC}"
        echo -e "${YELLOW}  Error details:${NC}"
        cat /tmp/youtube_test.json | grep -o '"message":"[^"]*' | cut -d'"' -f4
    fi
else
    echo -e "${YELLOW}⚠ Cannot test connection - make sure your Next.js app is running${NC}"
    echo -e "${YELLOW}  Run: npm run dev${NC}"
    echo -e "${YELLOW}  Then test manually: http://localhost:8000/api/youtube/videos${NC}"
fi

# Clean up
rm -f /tmp/youtube_test.json

echo
echo -e "${BLUE}Next Steps:${NC}"
echo "1. Restart your Next.js development server if it's running"
echo "2. Test the integration by visiting: http://localhost:8000/api/youtube/videos"
echo "3. Sync your videos: http://localhost:8000/api/youtube/sync"
echo "4. View your vlogs at: http://localhost:8000/vlog"
echo

echo -e "${GREEN}✓ YouTube API setup complete!${NC}"
