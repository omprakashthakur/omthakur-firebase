#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}==== Setup Guide for Vercel and Firebase Deployment ====${NC}"
echo -e "${YELLOW}This script provides instructions to set up continuous deployment${NC}"
echo ""

# Step 1: Vercel Setup
echo -e "${BLUE}Step 1: Get Vercel Deployment Tokens${NC}"
echo "1. Log in to your Vercel account at https://vercel.com"
echo "2. Go to Settings > Tokens"
echo "3. Create a new token with a descriptive name (e.g., 'GitHub Actions')"
echo "4. Copy the generated token - this will be your VERCEL_TOKEN"
echo ""
echo "5. Go to the General Settings of your Vercel project"
echo "6. Scroll down to find your 'Project ID' - this will be your VERCEL_PROJECT_ID"
echo "7. In your Account Settings, find your 'Team ID' - this will be your VERCEL_ORG_ID"
echo ""

# Step 2: Firebase Setup
echo -e "${BLUE}Step 2: Get Firebase Service Account${NC}"
echo "1. Go to the Firebase Console at https://console.firebase.google.com"
echo "2. Select your project"
echo "3. Go to Project Settings > Service accounts"
echo "4. Click 'Generate new private key'"
echo "5. Download the JSON file - the contents will be your FIREBASE_SERVICE_ACCOUNT"
echo "6. Note your project ID - this will be your FIREBASE_PROJECT_ID"
echo ""

# Step 3: GitHub Secrets
echo -e "${BLUE}Step 3: Add Secrets to GitHub Repository${NC}"
echo "1. Go to your GitHub repository"
echo "2. Navigate to Settings > Secrets and variables > Actions"
echo "3. Click 'New repository secret'"
echo "4. Add the following secrets:"
echo "   - VERCEL_TOKEN"
echo "   - VERCEL_ORG_ID"
echo "   - VERCEL_PROJECT_ID"
echo "   - FIREBASE_SERVICE_ACCOUNT (paste the entire JSON content)"
echo "   - FIREBASE_PROJECT_ID"
echo ""

echo -e "${YELLOW}After adding all secrets, your GitHub Actions will be able to deploy to both platforms.${NC}"
echo ""
