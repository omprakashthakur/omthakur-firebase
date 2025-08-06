#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${YELLOW}Add Image Domain to Next.js Config${NC}"
echo -e "${BLUE}This script will add a new remote image domain to your Next.js configuration${NC}"
echo ""

# Check if a domain was provided
if [ -z "$1" ]; then
  echo -e "${YELLOW}Please provide a domain name as an argument:${NC}"
  echo -e "  ./scripts/add-image-domain.sh example.com"
  exit 1
fi

DOMAIN=$1
CONFIG_FILE="next.config.ts"

# Check if the config file exists
if [ ! -f "$CONFIG_FILE" ]; then
  echo -e "${YELLOW}Error: $CONFIG_FILE not found${NC}"
  exit 1
fi

# Check if the domain is already in the config
if grep -q "hostname: '$DOMAIN'" "$CONFIG_FILE"; then
  echo -e "${GREEN}Domain '$DOMAIN' is already configured in $CONFIG_FILE${NC}"
  exit 0
fi

# Add the new domain to the config
# This uses sed to add a new pattern after the last pattern in the remotePatterns array
sed -i "/remotePatterns: \[/,/\],/ {
  /\],/ {
    i\\      {\\n        protocol: 'https',\\n        hostname: '$DOMAIN',\\n        port: '',\\n        pathname: '/**',\\n      },
  }
}" "$CONFIG_FILE"

echo -e "${GREEN}Successfully added '$DOMAIN' to $CONFIG_FILE${NC}"
echo -e "${YELLOW}Please restart your development server for the changes to take effect${NC}"
echo -e "${BLUE}Run: npm run dev${NC}"
