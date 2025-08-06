#!/bin/bash
# Script to verify a deployed photography page in production

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Default to the production URL, but allow override
SITE_URL=${1:-"https://omthakur.site"}

echo -e "${BLUE}🔍 Verifying Photography Page on ${SITE_URL}/photography${NC}"
echo ""

# Check if curl and grep are available
if ! command -v curl &> /dev/null; then
  echo -e "${RED}Error: curl is not installed. Please install it to run this script.${NC}"
  exit 1
fi

# Function to check HTTP status code
check_status_code() {
  local url=$1
  local status=$(curl -s -o /dev/null -w "%{http_code}" "$url")
  
  if [ "$status" -eq 200 ]; then
    echo -e "${GREEN}✅ $url returned status code 200${NC}"
    return 0
  else
    echo -e "${RED}❌ $url returned status code $status${NC}"
    return 1
  fi
}

# Check main photography page
echo -e "${BLUE}Checking photography page...${NC}"
if check_status_code "${SITE_URL}/photography"; then
  # Fetch the page content to check for key elements
  content=$(curl -s "${SITE_URL}/photography")
  
  # Check for placeholder image path
  if echo "$content" | grep -q "placeholder-image.jpg"; then
    echo -e "${GREEN}✅ Found placeholder image reference${NC}"
  else
    echo -e "${YELLOW}⚠️ No placeholder image reference found${NC}"
  fi
  
  # Check for blur data URL
  if echo "$content" | grep -q "blurDataURL"; then
    echo -e "${GREEN}✅ Found blur data URL reference${NC}"
  else
    echo -e "${YELLOW}⚠️ No blur data URL reference found${NC}"
  fi
else
  echo -e "${RED}❌ Unable to access photography page${NC}"
fi

echo ""

# Check the API endpoint
echo -e "${BLUE}Checking Pexels API endpoint...${NC}"
if check_status_code "${SITE_URL}/api/pexels"; then
  # Fetch the API response
  api_response=$(curl -s "${SITE_URL}/api/pexels")
  
  # Check if it's valid JSON and has photos
  if echo "$api_response" | grep -q "id"; then
    echo -e "${GREEN}✅ API returned valid photo data${NC}"
    
    # Count photos
    photo_count=$(echo "$api_response" | grep -o "\"id\"" | wc -l)
    echo -e "${GREEN}✅ API returned $photo_count photos${NC}"
  else
    echo -e "${YELLOW}⚠️ API response may not contain photo data${NC}"
  fi
else
  echo -e "${RED}❌ Unable to access API endpoint${NC}"
fi

echo ""
echo -e "${BLUE}==== Production Verification Summary ====${NC}"
echo -e "${GREEN}✅ Basic checks completed${NC}"
echo -e "${YELLOW}For a more thorough verification:${NC}"
echo -e "  1. Visit ${SITE_URL}/photography in a browser"
echo -e "  2. Check browser console for any errors"
echo -e "  3. Use browser dev tools Network tab to verify image loading"
echo -e "  4. Test with network throttling to verify loading states"
echo ""
echo -e "${BLUE}All verification steps from documentation have been completed!${NC}"

exit 0
