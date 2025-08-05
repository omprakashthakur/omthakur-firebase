#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}==== Environment Variables Setup Guide ====${NC}"
echo -e "${YELLOW}This guide helps you set up environment variables for Vercel and Firebase${NC}"
echo ""

# Create a sample .env.local file if it doesn't exist
if [ ! -f .env.local ]; then
  echo -e "${BLUE}Creating sample .env.local file...${NC}"
  cat > .env.local << EOF
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_firebase_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_firebase_app_id

# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# GenKit API Configuration
GENKIT_API_KEY=your_genkit_api_key
EOF
  echo -e "${GREEN}✓ Sample .env.local created${NC}"
else
  echo -e "${GREEN}✓ .env.local file already exists${NC}"
fi

echo ""
echo -e "${BLUE}Step 1: Setting up Environment Variables in Vercel${NC}"
echo "1. Log in to your Vercel dashboard"
echo "2. Select your project"
echo "3. Go to Settings > Environment Variables"
echo "4. Add the following environment variables:"
echo "   - NEXT_PUBLIC_FIREBASE_API_KEY"
echo "   - NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN"
echo "   - NEXT_PUBLIC_FIREBASE_PROJECT_ID"
echo "   - NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET"
echo "   - NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID"
echo "   - NEXT_PUBLIC_FIREBASE_APP_ID"
echo "   - NEXT_PUBLIC_SUPABASE_URL"
echo "   - NEXT_PUBLIC_SUPABASE_ANON_KEY"
echo "   - GENKIT_API_KEY"
echo "5. Make sure to set them for Production, Preview, and Development environments"
echo ""

echo -e "${BLUE}Step 2: Setting up Environment Variables in GitHub Actions${NC}"
echo "1. Go to your GitHub repository"
echo "2. Navigate to Settings > Secrets and variables > Actions"
echo "3. Add all the environment variables listed above as secrets"
echo "4. These will be used by the GitHub Actions workflows"
echo ""

echo -e "${BLUE}Step 3: Verify Your Firebase Configuration${NC}"
echo "1. Check your firebase.json file to ensure it's configured correctly"
echo "2. Ensure your Firebase hosting configuration points to the correct build output"
echo ""

echo -e "${YELLOW}Important Notes:${NC}"
echo "- Environment variables starting with NEXT_PUBLIC_ will be exposed to the browser"
echo "- Keep sensitive variables like API keys secure and never commit them to Git"
echo "- The GitHub Actions workflows are set up to use these variables during build"
echo ""

echo -e "${GREEN}Done! Follow these steps to ensure your deployments work correctly.${NC}"
