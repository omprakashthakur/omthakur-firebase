#!/bin/bash

# Script to sync environment variables between Firebase and Vercel
# This script helps maintain consistency between your Firebase and Vercel deployments

# Check if required commands are available
if ! command -v firebase >/dev/null 2>&1; then
  echo "⚠️ Firebase CLI is not installed. Some checks will be skipped."
  echo "   To install Firebase CLI: npm install -g firebase-tools"
  FIREBASE_AVAILABLE=false
else
  FIREBASE_AVAILABLE=true
fi

if ! command -v jq >/dev/null 2>&1; then
  echo "⚠️ jq is not installed. Some checks will be skipped."
  echo "   To install jq: sudo apt-get install jq"
  JQ_AVAILABLE=false
else
  JQ_AVAILABLE=true
fi

# Load environment variables from .env file
if [ -f .env ]; then
  echo "Loading environment variables from .env file..."
  export $(grep -v '^#' .env | xargs)
else
  echo "No .env file found. Creating a template..."
  touch .env
  echo "NEXT_PUBLIC_SUPABASE_URL=" >> .env
  echo "NEXT_PUBLIC_SUPABASE_ANON_KEY=" >> .env
  echo "GENKIT_API_KEY=" >> .env
fi

# Display info about current setup
echo "Project Info:"
echo "=============="
echo "Vercel Project ID: prj_MG7wWVlmNL1uJ8C63f07xh3U4xjb"
echo "Firebase Project: $(cat .firebaserc 2>/dev/null | jq -r '.projects.default' 2>/dev/null || echo "Not configured")"

# Check configuration files
echo ""
echo "Configuration Status:"
echo "===================="
CONFIG_FILES=(
  "firebase.json"
  "next.config.ts"
  ".env"
  "package.json"
)

for file in "${CONFIG_FILES[@]}"; do
  if [ -f "$file" ]; then
    echo "✅ $file exists"
  else
    echo "❌ $file is missing!"
  fi
done

# Check Firebase deployment
if [ "$FIREBASE_AVAILABLE" = true ]; then
  echo ""
  echo "Firebase Status:"
  echo "================"
  firebase projects:list
  echo ""
  echo "To deploy to Firebase, run: npm run firebase:deploy:static"
else
  echo ""
  echo "Firebase Status:"
  echo "================"
  echo "⚠️ Firebase CLI not installed, skipping Firebase checks"
fi

# Environment variable check
echo ""
echo "Environment Variable Status:"
echo "==========================="

check_env_var() {
  if [ -z "${!1}" ]; then
    echo "❌ $1 is not set"
  else
    echo "✅ $1 is set"
  fi
}

check_env_var "NEXT_PUBLIC_SUPABASE_URL"
check_env_var "NEXT_PUBLIC_SUPABASE_ANON_KEY"
check_env_var "GENKIT_API_KEY"

# Check for required API endpoints
echo ""
echo "API Endpoints Status:"
echo "===================="

API_ENDPOINTS=(
  "src/app/api/photography/route.ts"
  "src/app/api/photography/[id]/route.ts"
  "src/app/api/posts/route.ts"
  "src/app/api/posts/[slug]/route.ts"
  "src/app/api/vlogs/route.ts"
  "src/app/api/vlogs/[id]/route.ts"
)

for endpoint in "${API_ENDPOINTS[@]}"; do
  if [ -f "$endpoint" ]; then
    # Check if file has GET method
    if grep -q "export async function GET" "$endpoint"; then
      echo "✅ $endpoint has GET method"
    else
      echo "⚠️ $endpoint is missing GET method"
    fi
  else
    echo "❌ $endpoint is missing!"
  fi
done

# Check for GitHub workflow files
echo ""
echo "GitHub Workflow Status:"
echo "======================"

if [ -d ".github/workflows" ]; then
  if [ -f ".github/workflows/firebase-hosting.yml" ]; then
    echo "✅ Firebase workflow exists"
    
    # Check for Vercel project ID in workflow file
    if grep -q "prj_MG7wWVlmNL1uJ8C63f07xh3U4xjb" .github/workflows/firebase-hosting.yml; then
      echo "✅ Vercel project ID found in workflow file"
    else
      echo "⚠️ Vercel project ID not found in workflow file"
    fi
  else
    echo "⚠️ Firebase workflow file missing"
  fi
else
  echo "❌ GitHub workflows directory missing"
fi

echo ""
echo "For more information on dual deployment, see README.md"
echo "If you encounter issues, check docs/troubleshooting.md for solutions"
