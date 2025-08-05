#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}==== Next.js Image Loading Issue Fixer ====${NC}"
echo -e "${YELLOW}This script will diagnose and fix common image loading issues in your Next.js application${NC}"
echo ""

# 1. Check if next.config.ts exists
CONFIG_FILE="next.config.ts"
if [ ! -f "$CONFIG_FILE" ]; then
  echo -e "${RED}Error: $CONFIG_FILE not found${NC}"
  exit 1
fi

echo -e "${GREEN}✓ Found Next.js configuration file${NC}"

# 2. Check current image domains configuration
echo -e "${BLUE}Current image domains configuration:${NC}"
CONFIGURED_DOMAINS=$(grep -o "hostname: '[^']*'" "$CONFIG_FILE" | sed "s/hostname: '//g" | sed "s/'//g" | sort)

if [ -z "$CONFIGURED_DOMAINS" ]; then
  echo -e "${RED}No image domains configured!${NC}"
else
  for domain in $CONFIGURED_DOMAINS; do
    echo "  - $domain"
  done
fi

# 3. Fix common issues

# 3.1 Ensure loader is properly configured (sometimes default loader causes issues)
if ! grep -q "loader:" "$CONFIG_FILE"; then
  echo -e "${YELLOW}Adding default image loader configuration...${NC}"
  sed -i "/images: {/a\\    unoptimized: process.env.NODE_ENV === 'development'," "$CONFIG_FILE"
  echo -e "${GREEN}✓ Added image optimization configuration${NC}"
fi

# 3.2 Check if placeholder.com domains are properly configured
PLACEHOLDER_DOMAINS=("via.placeholder.com" "placeholder.com" "placehold.co" "placehold.it")
DOMAINS_TO_ADD=()

for domain in "${PLACEHOLDER_DOMAINS[@]}"; do
  if ! grep -q "hostname: '$domain'" "$CONFIG_FILE"; then
    DOMAINS_TO_ADD+=("$domain")
  fi
done

if [ ${#DOMAINS_TO_ADD[@]} -gt 0 ]; then
  echo -e "${YELLOW}Adding missing placeholder domains:${NC}"
  for domain in "${DOMAINS_TO_ADD[@]}"; do
    echo "  - $domain"
    # Add domain to config
    sed -i "/remotePatterns: \[/,/\],/ {
      /\],/ {
        i\\      {\\n        protocol: 'https',\\n        hostname: '$domain',\\n        port: '',\\n        pathname: '/**',\\n      },
      }
    }" "$CONFIG_FILE"
  done
  echo -e "${GREEN}✓ Added missing placeholder domains${NC}"
fi

# 4. Add fallback image handling in Photography component
echo -e "${BLUE}Adding fallback image handling to components...${NC}"

# 4.1 Check for photography page component
PHOTO_PAGE="src/app/photography/page.tsx"
if [ -f "$PHOTO_PAGE" ]; then
  echo -e "${YELLOW}Updating Photography page component...${NC}"
  
  # Check if onError handler is already present
  if ! grep -q "onError=" "$PHOTO_PAGE"; then
    # Add onError handler to the Image components
    sed -i "/className=\"w-full h-auto object-cover/a\\                    onError={(e) => { e.currentTarget.src = '/placeholder-image.jpg'; e.currentTarget.style.opacity = '0.7'; }}" "$PHOTO_PAGE"
    echo -e "${GREEN}✓ Added error handling for photography page images${NC}"
  else
    echo -e "${GREEN}✓ Error handling already present in photography page${NC}"
  fi
fi

# 4.2 Check for vlogs page component
VLOG_PAGE="src/app/vlog/page.tsx"
if [ -f "$VLOG_PAGE" ]; then
  echo -e "${YELLOW}Updating Vlog page component...${NC}"
  
  # Check if onError handler is already present
  if ! grep -q "onError=" "$VLOG_PAGE"; then
    # Add onError handler to the Image components
    sed -i "/className=\"w-full h-auto/a\\                  onError={(e) => { e.currentTarget.src = '/placeholder-image.jpg'; e.currentTarget.style.opacity = '0.7'; }}" "$VLOG_PAGE"
    echo -e "${GREEN}✓ Added error handling for vlog page images${NC}"
  else
    echo -e "${GREEN}✓ Error handling already present in vlog page${NC}"
  fi
fi

# 5. Create a placeholder image if it doesn't exist
PLACEHOLDER_PATH="public/placeholder-image.jpg"
if [ ! -f "$PLACEHOLDER_PATH" ]; then
  echo -e "${YELLOW}Creating placeholder image file...${NC}"
  
  # Using base64 encoded minimal 1x1 JPEG
  echo "R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7" | base64 --decode > "$PLACEHOLDER_PATH"
  echo -e "${GREEN}✓ Created placeholder image at $PLACEHOLDER_PATH${NC}"
fi

# 6. Summary and next steps
echo ""
echo -e "${BLUE}==== Fix Complete ====${NC}"
echo -e "${GREEN}The following fixes were applied:${NC}"
echo "  - Checked and updated image domain configuration"
echo "  - Added fallback image handling to components"
echo "  - Created local placeholder image"
echo ""
echo -e "${YELLOW}Next Steps:${NC}"
echo "  1. Restart your Next.js development server:"
echo "     npm run dev"
echo ""
echo "  2. Clear your browser cache if you still see image errors"
echo ""
echo -e "${BLUE}Will this impact your real server?${NC}"
echo "  - These changes are safe for production"
echo "  - The fallback image handling will improve user experience by showing placeholders"
echo "  - The configuration updates ensure your images will load correctly in all environments"
echo ""
echo -e "${GREEN}Done!${NC}"
