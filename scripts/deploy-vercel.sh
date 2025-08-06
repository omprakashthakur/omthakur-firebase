#!/bin/bash

echo "🚀 Starting Vercel Deployment..."

# Pull latest code
git pull origin main

# Install dependencies
npm install

# Deploy to Vercel
vercel --prod

if [ $? -eq 0 ]; then
    echo "✅ Vercel deployment successful!"
    echo "🌐 Live at: https://omthakur.site"
else
    echo "❌ Vercel deployment failed!"
    exit 1
fi
