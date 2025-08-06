#!/bin/bash

# Photography Page Production Deployment Checklist
# This script helps ensure the photography page works correctly in production

echo "🔍 Photography Page Deployment Checklist"
echo "========================================="

# Check if required files exist
echo "📁 Checking required files..."

if [ -f "public/placeholder-image.jpg" ]; then
    echo "✅ Placeholder image exists"
else
    echo "❌ Missing placeholder image: public/placeholder-image.jpg"
fi

if [ -f "src/app/photography/page.tsx" ]; then
    echo "✅ Photography page exists"
else
    echo "❌ Missing photography page"
fi

# Check environment variables
echo ""
echo "🔧 Checking environment variables..."

if [ -n "$NEXT_PUBLIC_SUPABASE_URL" ]; then
    echo "✅ NEXT_PUBLIC_SUPABASE_URL is set"
else
    echo "❌ Missing NEXT_PUBLIC_SUPABASE_URL"
fi

if [ -n "$NEXT_PUBLIC_SUPABASE_ANON_KEY" ]; then
    echo "✅ NEXT_PUBLIC_SUPABASE_ANON_KEY is set"
else
    echo "❌ Missing NEXT_PUBLIC_SUPABASE_ANON_KEY"
fi

if [ -n "$PEXELS_API_KEY" ]; then
    echo "✅ PEXELS_API_KEY is set"
else
    echo "⚠️  PEXELS_API_KEY not set (optional)"
fi

# Test API endpoints
echo ""
echo "🧪 Testing API endpoints..."

if command -v curl &> /dev/null; then
    echo "Testing /api/photography..."
    PHOTO_RESPONSE=$(curl -s -w "%{http_code}" -o /dev/null "http://localhost:8000/api/photography" 2>/dev/null || echo "000")
    
    if [ "$PHOTO_RESPONSE" = "200" ]; then
        echo "✅ Photography API working"
    else
        echo "❌ Photography API failed (HTTP $PHOTO_RESPONSE)"
    fi

    echo "Testing /api/pexels..."
    PEXELS_RESPONSE=$(curl -s -w "%{http_code}" -o /dev/null "http://localhost:8000/api/pexels" 2>/dev/null || echo "000")
    
    if [ "$PEXELS_RESPONSE" = "200" ]; then
        echo "✅ Pexels API working"
    else
        echo "❌ Pexels API failed (HTTP $PEXELS_RESPONSE)"
    fi
else
    echo "⚠️  curl not available, skipping API tests"
fi

# Check Next.js image configuration
echo ""
echo "🖼️  Checking image configuration..."

if grep -q "images.pexels.com" next.config.ts; then
    echo "✅ Pexels images configured"
else
    echo "❌ Missing Pexels image configuration"
fi

if grep -q "placehold" next.config.ts; then
    echo "✅ Placeholder domains configured"
else
    echo "⚠️  Placeholder domains might need configuration"
fi

# Performance recommendations
echo ""
echo "🚀 Performance Recommendations:"
echo "1. Enable image optimization in production"
echo "2. Use proper image sizes and formats"
echo "3. Consider adding image compression"
echo "4. Monitor API response times"

echo ""
echo "🛠️  Deployment Tips:"
echo "1. Set all environment variables in production"
echo "2. Ensure placeholder-image.jpg is in public folder"
echo "3. Test all API endpoints after deployment"
echo "4. Check browser console for any errors"

echo ""
echo "✨ Photography page deployment checklist complete!"
