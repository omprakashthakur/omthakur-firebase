#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}==== Adding Test YouTube Vlog ====${NC}"

# Default port is 4444, but can be overridden
PORT=${1:-4444}
API_URL="http://localhost:$PORT/api/vlogs"

# YouTube video data - using a popular tech talk
VIDEO_ID="dQw4w9WgXcQ"  # This is a famous YouTube video
THUMBNAIL_URL="https://i.ytimg.com/vi/$VIDEO_ID/maxresdefault.jpg"
VIDEO_URL="https://www.youtube.com/watch?v=$VIDEO_ID"
VIDEO_TITLE="Tech Talk: Amazing Web Development Techniques"

# Create the JSON payload
JSON_PAYLOAD=$(cat <<EOF
{
  "title": "$VIDEO_TITLE",
  "thumbnail": "$THUMBNAIL_URL",
  "platform": "YouTube",
  "url": "$VIDEO_URL",
  "category": "Tech Talks"
}
EOF
)

echo -e "${YELLOW}Adding YouTube vlog with ID: $VIDEO_ID${NC}"
echo -e "URL: $VIDEO_URL"
echo -e "Thumbnail: $THUMBNAIL_URL"

# Send the POST request
HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" -X POST -H "Content-Type: application/json" -d "$JSON_PAYLOAD" "$API_URL")

if [ "$HTTP_STATUS" -eq 201 ]; then
  echo -e "${GREEN}✓ Successfully added test YouTube vlog${NC}"
  echo -e "${BLUE}Visit http://localhost:$PORT/vlog to see your new vlog${NC}"
else
  echo -e "${RED}Failed to add vlog. HTTP Status: $HTTP_STATUS${NC}"
  echo -e "${YELLOW}Trying to fetch current vlogs to check API...${NC}"
  
  curl -s "$API_URL" | grep -q "error" && echo -e "${RED}API returned an error. Please check your server logs.${NC}" || echo -e "${GREEN}API seems to be working. There might be an issue with the POST request.${NC}"
fi

echo ""
echo -e "${BLUE}Next steps:${NC}"
echo "1. Restart your Next.js server if needed"
echo "2. Go to http://localhost:$PORT/vlog to see if thumbnails are working"
echo "3. If you still have issues, try clearing your browser cache"
echo ""
echo -e "${GREEN}Done!${NC}"
