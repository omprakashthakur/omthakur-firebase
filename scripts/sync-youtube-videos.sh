#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}==== YouTube Video Sync ====${NC}"
echo -e "${YELLOW}This script will sync your latest YouTube videos to your vlog database${NC}"
echo

# Default values
MAX_RESULTS=10
FORCE_SYNC=false
BASE_URL="http://localhost:8000"

# Parse command line arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        -n|--max-results)
            MAX_RESULTS="$2"
            shift 2
            ;;
        -f|--force)
            FORCE_SYNC=true
            shift
            ;;
        -u|--url)
            BASE_URL="$2"
            shift 2
            ;;
        -h|--help)
            echo "Usage: $0 [OPTIONS]"
            echo "Options:"
            echo "  -n, --max-results NUMBER    Maximum number of videos to sync (default: 10)"
            echo "  -f, --force                 Force sync even if videos already exist"
            echo "  -u, --url URL              Base URL of your app (default: http://localhost:8000)"
            echo "  -h, --help                 Show this help message"
            exit 0
            ;;
        *)
            echo -e "${RED}Unknown option: $1${NC}"
            exit 1
            ;;
    esac
done

# Check if YouTube credentials are configured
if [ ! -f ".env" ]; then
    echo -e "${RED}❌ .env file not found${NC}"
    echo -e "${YELLOW}Run ./scripts/setup-youtube-api.sh first${NC}"
    exit 1
fi

if ! grep -q "YOUTUBE_API_KEY=" .env || ! grep -q "YOUTUBE_CHANNEL_ID=" .env; then
    echo -e "${RED}❌ YouTube credentials not found in .env file${NC}"
    echo -e "${YELLOW}Run ./scripts/setup-youtube-api.sh to configure YouTube API${NC}"
    exit 1
fi

# Build sync URL
SYNC_URL="${BASE_URL}/api/youtube/sync?maxResults=${MAX_RESULTS}"
if [ "$FORCE_SYNC" = true ]; then
    SYNC_URL="${SYNC_URL}&forceSync=true"
fi

echo -e "${BLUE}Syncing YouTube videos...${NC}"
echo -e "${YELLOW}URL: ${SYNC_URL}${NC}"
echo -e "${YELLOW}Max results: ${MAX_RESULTS}${NC}"
echo -e "${YELLOW}Force sync: ${FORCE_SYNC}${NC}"
echo

# Make the sync request
RESPONSE=$(curl -s "$SYNC_URL")
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$SYNC_URL")

if [ "$HTTP_CODE" -eq 200 ]; then
    echo -e "${GREEN}✓ Sync request successful${NC}"
    
    # Parse response
    SUCCESS=$(echo "$RESPONSE" | grep -o '"success":[^,]*' | cut -d':' -f2)
    MESSAGE=$(echo "$RESPONSE" | grep -o '"message":"[^"]*' | cut -d'"' -f4)
    SYNCED_COUNT=$(echo "$RESPONSE" | grep -o '"syncedVideos":[^,]*' | cut -d':' -f2)
    TOTAL_FETCHED=$(echo "$RESPONSE" | grep -o '"totalFetched":[^,]*' | cut -d':' -f2)
    
    echo -e "${BLUE}Results:${NC}"
    echo -e "  Message: ${MESSAGE}"
    echo -e "  Videos synced: ${SYNCED_COUNT:-0}"
    echo -e "  Total fetched: ${TOTAL_FETCHED:-0}"
    
    if echo "$RESPONSE" | grep -q '"videos":\['; then
        echo -e "${GREEN}Synced videos:${NC}"
        # Extract video titles
        echo "$RESPONSE" | grep -o '"title":"[^"]*' | cut -d'"' -f4 | while read -r title; do
            echo -e "  • ${title}"
        done
    fi
    
else
    echo -e "${RED}❌ Sync failed with HTTP code: ${HTTP_CODE}${NC}"
    
    # Try to extract error message
    ERROR_MSG=$(echo "$RESPONSE" | grep -o '"message":"[^"]*' | cut -d'"' -f4)
    if [ ! -z "$ERROR_MSG" ]; then
        echo -e "${RED}Error: ${ERROR_MSG}${NC}"
    fi
    
    echo -e "${YELLOW}Response:${NC}"
    echo "$RESPONSE" | head -3
    exit 1
fi

echo
echo -e "${BLUE}Next steps:${NC}"
echo "1. View your vlogs at: ${BASE_URL}/vlog"
echo "2. Check the admin dashboard: ${BASE_URL}/admin/vlogs"
echo "3. To sync more videos, run this script again with -n option"
echo

echo -e "${GREEN}✓ YouTube sync completed!${NC}"
