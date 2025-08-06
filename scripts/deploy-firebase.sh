#!/bin/bash

echo "🔥 Starting Firebase Deployment..."

# Pull latest code
git pull origin main

# Install dependencies
npm install

# Build for static export
npm run build
npm run export

# Deploy to Firebase
firebase deploy --only hosting

if [ $? -eq 0 ]; then
    echo "✅ Firebase deployment successful!"
    echo "🌐 Live at: https://omthakur-firebase.web.app"
else
    echo "❌ Firebase deployment failed!"
    exit 1
fi
