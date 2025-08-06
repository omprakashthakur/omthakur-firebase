#!/bin/bash

echo "🚀 Starting Full Deployment to Both Platforms..."

# Pull latest code
git pull origin main
npm install

# Deploy to Vercel first (primary)
echo "📡 Deploying to Vercel..."
vercel --prod

# Deploy to Firebase (static backup)
echo "🔥 Deploying to Firebase..."
npm run build
npm run export
firebase deploy --only hosting

echo "✅ Deployment completed!"
echo "🌐 Vercel (Primary): https://omthakur.site"
echo "🔥 Firebase (Backup): https://omthakur-firebase.web.app"
