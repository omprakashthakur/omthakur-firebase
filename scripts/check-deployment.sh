#!/bin/bash

# Script to sync environment variables between Firebase and Vercel
# This script helps maintain consistency between your Firebase and Vercel deployments

# Check if required commands are available
command -v firebase >/dev/null 2>&1 || { echo "Firebase CLI is required but not installed. Aborting."; exit 1; }
command -v jq >/dev/null 2>&1 || { echo "jq is required but not installed. Install with 'sudo apt-get install jq' or similar."; exit 1; }

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

# Check Firebase deployment
if command -v firebase >/dev/null 2>&1; then
  echo ""
  echo "Firebase Status:"
  echo "================"
  firebase projects:list
  echo ""
  echo "To deploy to Firebase, run: npm run firebase:deploy:static"
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

echo ""
echo "For more information on dual deployment, see README.md"
