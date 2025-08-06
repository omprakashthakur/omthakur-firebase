#!/bin/bash
# Script to fix Pexels API integration in production

# Get the script's directory
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
ROOT_DIR="$(dirname "$SCRIPT_DIR")"

echo "🚀 Starting Pexels API production fix..."

# Check if placeholder image exists
if [ -f "$ROOT_DIR/public/placeholder-image.jpg" ]; then
  echo "✅ Placeholder image exists"
else
  echo "❌ Placeholder image missing! Creating a default one..."
  # Create a simple placeholder using ImageMagick if available
  if command -v convert &> /dev/null; then
    convert -size 800x600 canvas:gray -font Arial -pointsize 40 -gravity center \
      -annotate 0 "Image Placeholder" \
      "$ROOT_DIR/public/placeholder-image.jpg"
    echo "✅ Created placeholder image using ImageMagick"
  else
    echo "⚠️ ImageMagick not found. Please manually create a placeholder image at:"
    echo "$ROOT_DIR/public/placeholder-image.jpg"
    exit 1
  fi
fi

# Check if Pexels API key is set in environment
if [ -z "$PEXELS_API_KEY" ] && [ -z "$NEXT_PUBLIC_PEXELS_API_KEY" ]; then
  echo "⚠️ No Pexels API key found in environment variables"
  echo "  - Fallback images will be used in production"
  echo "  - To use Pexels API, set PEXELS_API_KEY in your environment"
fi

# Check Next.js config for image domains
if grep -q "images.pexels.com" "$ROOT_DIR/next.config.ts"; then
  echo "✅ Pexels image domain is properly configured in next.config.ts"
else
  echo "❌ Pexels image domain is not configured in next.config.ts"
  echo "  - Make sure to add 'images.pexels.com' to the remotePatterns array"
fi

# Verify pexelsClient.ts has proper fallback handling
if grep -q "generatePlaceholderPhotos" "$ROOT_DIR/src/lib/pexelsClient.ts"; then
  echo "✅ Fallback handling detected in pexelsClient.ts"
else
  echo "❌ No fallback handling detected in pexelsClient.ts"
  echo "  - Please implement proper fallbacks for API errors"
fi

# Check for client-side placeholder handling in Photography page
if grep -q "blurDataURL" "$ROOT_DIR/src/app/photography/page.tsx"; then
  echo "✅ Client-side placeholder handling detected in Photography page"
else
  echo "❌ No client-side placeholder handling detected in Photography page"
  echo "  - Please implement proper Image component placeholders"
fi

echo "✅ Pexels API production fix checks completed"
echo ""
echo "Next steps:"
echo "1. Ensure PEXELS_API_KEY is set in your production environment"
echo "2. Run a production build to verify images load correctly"
echo "3. Test the site with network throttling to verify fallbacks work"
echo ""
