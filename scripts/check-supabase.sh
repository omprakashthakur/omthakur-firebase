#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}Supabase Connection Diagnostics${NC}"
echo -e "${YELLOW}This script will help diagnose Supabase connection issues${NC}"
echo ""

# Check if .env file exists
if [ ! -f ".env" ] && [ ! -f ".env.local" ]; then
  echo -e "${RED}Error: No .env or .env.local file found${NC}"
  echo -e "${YELLOW}Create a .env.local file with your Supabase credentials:${NC}"
  echo "NEXT_PUBLIC_SUPABASE_URL=your_supabase_url"
  echo "NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key"
  exit 1
fi

# Check if environment variables are set
ENV_FILE=".env.local"
if [ ! -f "$ENV_FILE" ]; then
  ENV_FILE=".env"
fi

echo -e "${BLUE}Checking Supabase credentials in $ENV_FILE${NC}"

# Check Supabase URL
SUPABASE_URL=$(grep "NEXT_PUBLIC_SUPABASE_URL" $ENV_FILE | cut -d '=' -f2)
if [ -z "$SUPABASE_URL" ] || [ "$SUPABASE_URL" == "your_supabase_url" ] || [ "$SUPABASE_URL" == "your_supabase_url_here" ]; then
  echo -e "${RED}Error: NEXT_PUBLIC_SUPABASE_URL is not set correctly${NC}"
  echo -e "${YELLOW}Please set a valid Supabase URL in $ENV_FILE${NC}"
else
  echo -e "${GREEN}✓ NEXT_PUBLIC_SUPABASE_URL is set${NC}"
  
  # Validate URL format
  if [[ ! "$SUPABASE_URL" =~ ^https?://[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}(/.*)?$ ]]; then
    echo -e "${RED}  Warning: URL format might be invalid${NC}"
  fi
fi

# Check Supabase Anon Key
SUPABASE_KEY=$(grep "NEXT_PUBLIC_SUPABASE_ANON_KEY" $ENV_FILE | cut -d '=' -f2)
if [ -z "$SUPABASE_KEY" ] || [ "$SUPABASE_KEY" == "your_supabase_anon_key" ] || [ "$SUPABASE_KEY" == "your_supabase_anon_key_here" ]; then
  echo -e "${RED}Error: NEXT_PUBLIC_SUPABASE_ANON_KEY is not set correctly${NC}"
  echo -e "${YELLOW}Please set a valid Supabase anonymous key in $ENV_FILE${NC}"
else
  echo -e "${GREEN}✓ NEXT_PUBLIC_SUPABASE_ANON_KEY is set${NC}"
  
  # Check key format (typically starts with 'eyJ')
  if [[ ! "$SUPABASE_KEY" =~ ^eyJ.+ ]]; then
    echo -e "${RED}  Warning: Key format might be invalid${NC}"
  fi
fi

echo ""
echo -e "${BLUE}Testing API endpoints${NC}"

# Define the port (default to 8000, can be overridden)
PORT=${1:-8000}
BASE_URL="http://localhost:$PORT/api"

# Function to test an endpoint
test_endpoint() {
  local endpoint=$1
  echo -e "${YELLOW}Testing $BASE_URL/$endpoint${NC}"
  
  response=$(curl -s -o response.txt -w "%{http_code}" "$BASE_URL/$endpoint")
  
  if [ "$response" -ge 200 ] && [ "$response" -lt 300 ]; then
    echo -e "${GREEN}✓ Success: HTTP $response${NC}"
    
    # Check if response contains "mockClient": true
    if grep -q "mockClient" response.txt; then
      echo -e "${YELLOW}  Note: Using mock data (not connected to Supabase)${NC}"
    else
      echo -e "${GREEN}  Connected to Supabase successfully${NC}"
    fi
  else
    echo -e "${RED}✗ Error: HTTP $response${NC}"
    echo "Response content:"
    cat response.txt
  fi
  
  rm -f response.txt
  echo ""
}

# Test main endpoints
test_endpoint "vlogs"
test_endpoint "posts"
test_endpoint "photography"

echo -e "${BLUE}Recommendations:${NC}"
echo -e "1. Ensure you have the correct Supabase URL and anon key"
echo -e "2. Verify that your IP address is allowed in Supabase dashboard"
echo -e "3. Check if the required tables (vlogs, posts, photography) exist in your database"
echo -e "4. Try adding test data using: ${GREEN}./scripts/add-test-data.sh${NC}"

echo ""
echo -e "${YELLOW}For more information, see the Supabase documentation:${NC}"
echo -e "https://supabase.com/docs/guides/api/connecting-to-supabase"
