#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Get script directory
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
ROOT_DIR="$(dirname "$SCRIPT_DIR")"

echo -e "${BLUE}🚀 Running Photography Page Production Readiness Check...${NC}"
echo ""

# Check 1: Placeholder Image
echo -e "${BLUE}Checking for placeholder image...${NC}"
if [ -f "$ROOT_DIR/public/placeholder-image.jpg" ]; then
  echo -e "${GREEN}✅ Found placeholder image at public/placeholder-image.jpg${NC}"
else
  echo -e "${RED}❌ Missing placeholder image at public/placeholder-image.jpg${NC}"
  echo -e "${YELLOW}This is critical for production fallbacks.${NC}"
  echo -e "${YELLOW}Create a placeholder image or copy one from another source.${NC}"
  ERRORS=true
fi
echo ""

# Check 2: Next.js Image Configuration
echo -e "${BLUE}Checking Next.js image configuration...${NC}"

# Critical domains for the photography page
CRITICAL_DOMAINS=(
  "images.pexels.com" 
)

# Check for critical domains
for domain in "${CRITICAL_DOMAINS[@]}"; do
  if grep -q "hostname: '$domain'" "$ROOT_DIR/next.config.ts"; then
    echo -e "${GREEN}✅ Domain '$domain' is properly configured${NC}"
  else
    echo -e "${RED}❌ Domain '$domain' is missing from next.config.ts${NC}"
    echo -e "${YELLOW}Images from this domain will fail in production.${NC}"
    echo -e "${YELLOW}Run ./scripts/add-image-domain.sh '$domain' to add it.${NC}"
    ERRORS=true
  fi
done
echo ""

# Check 3: Client-side image error handling
echo -e "${BLUE}Checking for client-side image error handling...${NC}"
if grep -q "onError.*target.src = '/placeholder-image.jpg'" "$ROOT_DIR/src/app/photography/page.tsx"; then
  echo -e "${GREEN}✅ Client-side image error handling is in place${NC}"
else
  echo -e "${YELLOW}⚠️ Could not confirm proper client-side image error handling${NC}"
  echo -e "${YELLOW}Ensure all Image components have proper onError handlers.${NC}"
fi
echo ""

# Check 4: Server-side fallbacks
echo -e "${BLUE}Checking for server-side API fallbacks...${NC}"
if grep -q "tinyPlaceholder" "$ROOT_DIR/src/app/api/pexels/route.ts"; then
  echo -e "${GREEN}✅ API route has proper fallback handling${NC}"
else
  echo -e "${YELLOW}⚠️ API route may not have optimal fallback handling${NC}"
  echo -e "${YELLOW}Ensure the Pexels API route returns fallback data on errors.${NC}"
fi
echo ""

# Check 5: BlurDataURL usage
echo -e "${BLUE}Checking for blur placeholder usage...${NC}"
if grep -q "blurDataURL" "$ROOT_DIR/src/app/photography/page.tsx"; then
  echo -e "${GREEN}✅ Photography page uses blur placeholders${NC}"
else
  echo -e "${YELLOW}⚠️ No blur placeholders detected in Photography page${NC}"
  echo -e "${YELLOW}Consider adding blurDataURL for better loading experience.${NC}"
fi
echo ""

# Check 6: Environment variables
echo -e "${BLUE}Checking for Pexels API environment variables...${NC}"
if [ -n "$PEXELS_API_KEY" ] || [ -n "$NEXT_PUBLIC_PEXELS_API_KEY" ]; then
  echo -e "${GREEN}✅ Pexels API key is set in environment${NC}"
else
  echo -e "${YELLOW}⚠️ No Pexels API key found in environment${NC}"
  echo -e "${YELLOW}The app will use fallback images instead of real photos.${NC}"
  echo -e "${YELLOW}To use real photos, set PEXELS_API_KEY in your environment.${NC}"
fi
echo ""

# Summary
echo -e "${BLUE}==== Production Readiness Summary =====${NC}"
if [ "$ERRORS" = true ]; then
  echo -e "${RED}❌ Some critical issues need to be fixed before deployment${NC}"
  echo -e "${YELLOW}Review the errors above and fix them before deploying.${NC}"
  exit 1
else
  echo -e "${GREEN}✅ Basic production readiness checks passed${NC}"
  echo -e "${YELLOW}Recommended next steps:${NC}"
  echo -e "  1. Run a full production build: npm run build"
  echo -e "  2. Test the production build locally: npm run start"
  echo -e "  3. Check that images load correctly on the Photography page"
  echo -e "  4. Test with network throttling to verify fallbacks work"
  echo -e ""
  echo -e "${GREEN}The Photography page should now work correctly in production!${NC}"
  exit 0
fi
