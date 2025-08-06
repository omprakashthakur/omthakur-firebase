#!/bin/bash

# This script helps diagnose and fix common issues with the omthakur-firebase project

echo "===== OmThakur Firebase Troubleshooter ====="
echo ""
echo "Checking your environment..."

# Check for required tools
command -v node >/dev/null 2>&1 || { echo "❌ Node.js is required but not installed. Please install Node.js first."; exit 1; }
command -v npm >/dev/null 2>&1 || { echo "❌ npm is required but not installed. Please install npm first."; exit 1; }

# Check Node version
NODE_VERSION=$(node -v | cut -d'v' -f2)
NODE_MAJOR=$(echo $NODE_VERSION | cut -d'.' -f1)
if [ "$NODE_MAJOR" -lt 16 ]; then
  echo "❌ Node.js version $NODE_VERSION is too old. Please upgrade to Node.js 16 or newer."
  exit 1
else
  echo "✅ Node.js version $NODE_VERSION detected"
fi

# Check npm version
NPM_VERSION=$(npm -v)
echo "✅ npm version $NPM_VERSION detected"

echo ""
echo "Checking for common issues..."

# Check for .env file
if [ ! -f .env ]; then
  echo "❌ .env file not found. Creating from .env.example..."
  if [ -f .env.example ]; then
    cp .env.example .env
    echo "✅ Created .env file from .env.example. Please fill in your credentials."
  else
    echo "❌ .env.example not found. Creating basic .env file..."
    echo "NEXT_PUBLIC_SUPABASE_URL=" > .env
    echo "NEXT_PUBLIC_SUPABASE_ANON_KEY=" >> .env
    echo "✅ Created basic .env file. Please fill in your credentials."
  fi
else
  echo "✅ .env file exists"
fi

# Check for common 400 errors (like the one in the screenshot)
echo ""
echo "Checking API endpoints..."
if grep -q "supabase.from('vlogs')" src/app/vlog/page.tsx; then
  echo "⚠️ Found direct Supabase calls in vlog page. Consider using API endpoints instead."
  echo "   This can cause 400 Bad Request errors if the Supabase credentials are invalid."
fi

# Check for API routes
if [ -f src/app/api/vlogs/route.ts ]; then
  if grep -q "export async function GET" src/app/api/vlogs/route.ts; then
    echo "✅ GET method found in vlogs API route"
  else
    echo "⚠️ GET method missing in vlogs API route. This might cause 400 Bad Request errors."
    echo "   Consider adding a GET method to src/app/api/vlogs/route.ts"
  fi
else
  echo "❌ vlogs API route not found"
fi

echo ""
echo "Running diagnostics..."

# Check for missing dependencies
echo "Checking for missing dependencies..."
if ! npm ls next >/dev/null 2>&1; then
  echo "⚠️ Next.js dependency issue detected. Try running 'npm install'"
fi

echo ""
echo "Recommended fixes:"
echo "1. Ensure your .env file has valid Supabase credentials"
echo "2. Run 'npm install' to ensure all dependencies are installed"
echo "3. Restart your development server with 'npm run dev'"

echo ""
echo "If you continue to experience issues, please contact support."
