#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}==== YouTube Thumbnail Checker ====${NC}"
echo -e "${YELLOW}This script will check your database for YouTube vlogs and verify thumbnail URLs${NC}"
echo ""

# Check if we can connect to the API
PORT=${1:-4444}
BASE_URL="http://localhost:$PORT"
API_URL="$BASE_URL/api/vlogs"

echo -e "${BLUE}Testing connection to $API_URL...${NC}"

# Fetch vlogs data
response=$(curl -s "$API_URL")
http_code=$(curl -s -o /dev/null -w "%{http_code}" "$API_URL")

if [ "$http_code" != "200" ]; then
  echo -e "${RED}Failed to connect to API. HTTP Status: $http_code${NC}"
  exit 1
fi

echo -e "${GREEN}✓ API connection successful${NC}"

# Check if response contains YouTube vlogs
if ! echo "$response" | grep -q "YouTube"; then
  echo -e "${YELLOW}No YouTube vlogs found in the database${NC}"
  echo -e "To add a test YouTube vlog, try running:"
  echo -e "${BLUE}curl -X POST -H \"Content-Type: application/json\" -d '{\"title\":\"Test YouTube Video\",\"thumbnail\":\"https://i.ytimg.com/vi/dQw4w9WgXcQ/maxresdefault.jpg\",\"platform\":\"YouTube\",\"url\":\"https://www.youtube.com/watch?v=dQw4w9WgXcQ\",\"category\":\"Tech Talks\"}' $API_URL${NC}"
  exit 0
fi

echo -e "${GREEN}✓ YouTube vlogs found in database${NC}"

# Extract YouTube thumbnails
youtube_thumbnails=$(echo "$response" | grep -o '"thumbnail":"[^"]*"' | grep -i "youtube\|ytimg" | sed 's/"thumbnail":"//g' | sed 's/"//g')

if [ -z "$youtube_thumbnails" ]; then
  echo -e "${YELLOW}No YouTube thumbnail URLs found. Your vlogs might be using placeholder images.${NC}"
  echo -e "Consider adding proper YouTube thumbnails using the YouTube video ID:"
  echo -e "${BLUE}https://i.ytimg.com/vi/VIDEO_ID/maxresdefault.jpg${NC}"
else
  echo -e "${GREEN}Found YouTube thumbnails:${NC}"
  for url in $youtube_thumbnails; do
    echo "  - $url"
    
    # Try to download the thumbnail to verify it exists
    if curl --output /dev/null --silent --head --fail "$url"; then
      echo -e "    ${GREEN}✓ Valid URL${NC}"
    else
      echo -e "    ${RED}✗ Invalid URL${NC}"
    fi
  done
fi

echo ""
echo -e "${BLUE}Checking Next.js configuration...${NC}"
if grep -q "i.ytimg.com" next.config.ts; then
  echo -e "${GREEN}✓ YouTube image domains are configured${NC}"
else
  echo -e "${RED}✗ YouTube image domains are not configured properly${NC}"
  echo -e "   Please add the following domains to your next.config.ts:"
  echo -e "   - i.ytimg.com"
  echo -e "   - img.youtube.com"
  echo -e "   - i1.ytimg.com"
fi

echo ""
echo -e "${YELLOW}For correct YouTube thumbnails:${NC}"
echo "1. Extract the video ID from the YouTube URL (the part after v=)"
echo "2. Use this URL format: https://i.ytimg.com/vi/VIDEO_ID/maxresdefault.jpg"
echo "3. If a vlog has a YouTube URL but no thumbnail, update your database"
echo ""
echo -e "${GREEN}Done!${NC}"
