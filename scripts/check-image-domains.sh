#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}Checking for unconfigured image domains...${NC}"

# Default port is 8000, but can be overridden
PORT=${1:-8000}
BASE_URL="http://localhost:$PORT"
PAGES=(
  "/"
  "/blog"
  "/photography"
  "/vlog"
)

# Get configured domains from next.config.ts
CONFIGURED_DOMAINS=$(grep -o "hostname: '[^']*'" next.config.ts | sed "s/hostname: '//g" | sed "s/'//g" | sort)

echo -e "${YELLOW}Currently configured domains:${NC}"
for domain in $CONFIGURED_DOMAINS; do
  echo "  - $domain"
done
echo ""

FOUND_ERRORS=false

for page in "${PAGES[@]}"; do
  echo -e "${BLUE}Checking $BASE_URL$page${NC}"
  
  # Fetch the page and check for unconfigured image domain errors
  response=$(curl -s "$BASE_URL$page")
  
  # Extract domains from unconfigured host errors
  unconfigured_domains=$(echo "$response" | grep -o 'hostname "[^"]*" is not configured under images' | sed 's/hostname "//g' | sed 's/" is not configured under images//g' | sort -u)
  
  if [ -n "$unconfigured_domains" ]; then
    FOUND_ERRORS=true
    echo -e "${RED}Found unconfigured image domains:${NC}"
    for domain in $unconfigured_domains; do
      echo "  - $domain"
    done
    
    # Offer to fix them
    echo -e "${YELLOW}Would you like to add these domains to your Next.js config? (y/n)${NC}"
    read -r answer
    if [[ "$answer" =~ ^[Yy]$ ]]; then
      for domain in $unconfigured_domains; do
        ./scripts/add-image-domain.sh "$domain"
      done
      echo -e "${YELLOW}You'll need to restart your Next.js server for changes to take effect.${NC}"
    fi
  else
    echo -e "${GREEN}No unconfigured image domains found on this page.${NC}"
  fi
  echo ""
done

if [ "$FOUND_ERRORS" = false ]; then
  echo -e "${GREEN}All checked pages are using properly configured image domains.${NC}"
  exit 0
else
  echo -e "${YELLOW}After adding all domains, restart your Next.js server:${NC}"
  echo -e "  npm run dev"
  exit 1
fi
