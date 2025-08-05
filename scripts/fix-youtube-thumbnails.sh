#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}==== Fix YouTube Thumbnails in Database ====${NC}"
echo -e "${YELLOW}This script will update all YouTube vlogs in your database with proper thumbnails${NC}"
echo ""

# Default port is 8000, but can be overridden
PORT=${1:-8000}
API_URL="http://localhost:$PORT/api/vlogs"

echo -e "${BLUE}Testing connection to $API_URL...${NC}"

# Check if the API is available
if ! curl --output /dev/null --silent --fail "$API_URL"; then
  echo -e "${RED}Error: Could not connect to API at $API_URL${NC}"
  echo "Make sure your development server is running on port $PORT"
  exit 1
fi

echo -e "${GREEN}✓ API connection successful${NC}"
echo -e "${BLUE}Fetching all vlogs...${NC}"

# Get all vlogs
VLOGS=$(curl -s "$API_URL")

# Check if we got a valid response
if echo "$VLOGS" | grep -q "error"; then
  echo -e "${RED}Error retrieving vlogs: $(echo "$VLOGS" | grep -o '"error":"[^"]*"' | sed 's/"error":"//g' | sed 's/"//g')${NC}"
  exit 1
fi

# Extract YouTube vlogs
YOUTUBE_VLOGS=$(echo "$VLOGS" | grep -o '{"id":"[^}]*,"platform":"YouTube"[^}]*}' | sed 's/\\"/"/g')

if [ -z "$YOUTUBE_VLOGS" ]; then
  echo -e "${YELLOW}No YouTube vlogs found in the database. Nothing to update.${NC}"
  exit 0
fi

echo -e "${GREEN}Found YouTube vlogs to update:${NC}"

# Function to extract YouTube video ID
function extract_video_id {
  URL=$1
  VIDEO_ID=$(echo "$URL" | grep -o 'v=[a-zA-Z0-9_-]*' | sed 's/v=//g')
  if [ -z "$VIDEO_ID" ]; then
    VIDEO_ID=$(echo "$URL" | grep -o 'youtu.be/[a-zA-Z0-9_-]*' | sed 's/youtu.be\///g')
  fi
  echo "$VIDEO_ID"
}

# For each YouTube vlog, update the thumbnail
echo "$YOUTUBE_VLOGS" | while read -r vlog; do
  ID=$(echo "$vlog" | grep -o '"id":"[^"]*"' | sed 's/"id":"//g' | sed 's/"//g')
  TITLE=$(echo "$vlog" | grep -o '"title":"[^"]*"' | sed 's/"title":"//g' | sed 's/"//g')
  URL=$(echo "$vlog" | grep -o '"url":"[^"]*"' | sed 's/"url":"//g' | sed 's/"//g')
  
  echo -e "- Processing: ${BLUE}$TITLE${NC} (ID: $ID)"
  
  # Extract video ID and generate thumbnail URL
  VIDEO_ID=$(extract_video_id "$URL")
  if [ -z "$VIDEO_ID" ]; then
    echo -e "  ${RED}× Could not extract video ID from URL: $URL${NC}"
    continue
  fi
  
  THUMBNAIL_URL="https://i.ytimg.com/vi/$VIDEO_ID/maxresdefault.jpg"
  
  # Create update payload
  UPDATE_PAYLOAD="{\"thumbnail\":\"$THUMBNAIL_URL\"}"
  
  # Send update request
  echo -e "  ${YELLOW}→ Updating with thumbnail: $THUMBNAIL_URL${NC}"
  UPDATE_RESULT=$(curl -s -X PUT -H "Content-Type: application/json" -d "$UPDATE_PAYLOAD" "$API_URL/$ID")
  
  if echo "$UPDATE_RESULT" | grep -q "error"; then
    ERROR=$(echo "$UPDATE_RESULT" | grep -o '"error":"[^"]*"' | sed 's/"error":"//g' | sed 's/"//g')
    echo -e "  ${RED}× Failed to update: $ERROR${NC}"
  else
    echo -e "  ${GREEN}✓ Successfully updated${NC}"
  fi
done

echo ""
echo -e "${GREEN}Done! YouTube thumbnails have been updated.${NC}"
echo -e "${YELLOW}Restart your Next.js server to see the changes.${NC}"
