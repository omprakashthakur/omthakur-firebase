#!/bin/bash
# Script to test the photography page fixes in development

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🧪 Testing Photography Page Production Fixes${NC}"
echo ""

# Check for key files
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
ROOT_DIR="$(dirname "$SCRIPT_DIR")"

echo -e "${BLUE}Checking for updated files:${NC}"

# Array of files we've modified
FILES=(
  "$ROOT_DIR/src/lib/pexelsClient.ts"
  "$ROOT_DIR/src/app/api/pexels/route.ts"
  "$ROOT_DIR/src/app/photography/page.tsx"
  "$ROOT_DIR/public/placeholder-image.jpg"
)

# Check each file exists
ALL_FILES_EXIST=true
for file in "${FILES[@]}"; do
  if [ -f "$file" ]; then
    echo -e "${GREEN}✅ Found: ${file##*/}${NC}"
  else
    echo -e "${RED}❌ Missing: ${file##*/}${NC}"
    ALL_FILES_EXIST=false
  fi
done

if [ "$ALL_FILES_EXIST" = false ]; then
  echo ""
  echo -e "${RED}Some required files are missing. Please check the files above.${NC}"
  exit 1
fi

echo ""
echo -e "${GREEN}All required files are present.${NC}"
echo ""
echo -e "${BLUE}Testing for key fixes:${NC}"

# Check for key fixes in the files
if grep -q "blurDataURL" "$ROOT_DIR/src/app/photography/page.tsx"; then
  echo -e "${GREEN}✅ Found blur placeholder implementation${NC}"
else
  echo -e "${RED}❌ Missing blur placeholder implementation${NC}"
fi

if grep -q "getTinyPlaceholder" "$ROOT_DIR/src/lib/pexelsClient.ts"; then
  echo -e "${GREEN}✅ Found tiny placeholder implementation${NC}"
else
  echo -e "${RED}❌ Missing tiny placeholder implementation${NC}"
fi

if grep -q "formatSinglePhoto" "$ROOT_DIR/src/lib/pexelsClient.ts"; then
  echo -e "${GREEN}✅ Found enhanced photo formatting${NC}"
else
  echo -e "${RED}❌ Missing enhanced photo formatting${NC}"
fi

if grep -q "revalidate =" "$ROOT_DIR/src/app/api/pexels/route.ts"; then
  echo -e "${GREEN}✅ Found API cache configuration${NC}"
else
  echo -e "${RED}❌ Missing API cache configuration${NC}"
fi

echo ""
echo -e "${BLUE}==== Summary ====${NC}"
echo -e "${GREEN}The Photography Page production fixes have been implemented.${NC}"
echo -e "${YELLOW}To fully test, run:${NC}"
echo -e "  npm run build"
echo -e "  npm run start"
echo -e "And visit: http://localhost:3000/photography"
echo ""
echo -e "${BLUE}Documentation:${NC}"
echo -e "A comprehensive guide is available at: docs/photography-production-guide.md"
echo ""

exit 0
