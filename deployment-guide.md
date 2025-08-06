# Manual Deployment Guide - Firebase & Vercel

## 🚀 Overview

This guide explains how to manually deploy your Next.js application to both Firebase Hosting and Vercel. Since automated deployments were causing issues, this manual approach gives you full control over the deployment process.

## 📋 Prerequisites

### Required Tools
- **Node.js**: Version 20 or higher
- **Git**: For code management
- **Firebase CLI**: For Firebase deployments
- **Vercel CLI**: For Vercel deployments

### Install CLI Tools
```bash
# Install Firebase CLI
npm install -g firebase-tools

# Install Vercel CLI  
npm install -g vercel

# Verify installations
firebase --version
vercel --version
```

## 🔧 Project Setup

### 1. Environment Variables Setup

Create your environment files:

#### Local Development (.env.local)
```bash
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abcdef

# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your_project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# API Keys
PEXELS_API_KEY=your_pexels_api_key
YOUTUBE_API_KEY=your_youtube_api_key
YOUTUBE_CHANNEL_ID=your_youtube_channel_id
```

#### Production Environment (.env.production)
```bash
# Same as above but with production values
NEXT_PUBLIC_FIREBASE_API_KEY=production_firebase_key
NEXT_PUBLIC_SUPABASE_URL=https://production.supabase.co
# ... other production values
```

## 🔥 Firebase Hosting Deployment

Firebase Hosting is ideal for static content and can serve your Next.js app as a static site.

### Step 1: Initial Firebase Setup
```bash
# Login to Firebase (only needed once)
firebase login

# Initialize Firebase in your project (only needed once)
firebase init hosting

# Select configuration:
# - Use existing project: omthakur-firebase
# - Public directory: out
# - Single-page app: Yes
# - Overwrite index.html: No
```

### Step 2: Build for Static Export
```bash
# Install dependencies
npm install

# Build the project for static export
npm run build

# Export static files
npm run export
```

### Step 3: Deploy to Firebase
```bash
# Deploy to Firebase Hosting
firebase deploy --only hosting

# Deploy with custom message
firebase deploy --only hosting -m "Manual deployment $(date)"

# Preview before deploying (optional)
firebase hosting:channel:deploy preview
```

### Step 4: Verify Deployment
```bash
# Check deployment status
firebase hosting:sites:list

# View live site
echo "🌐 Your site is live at: https://your-project.web.app"
```

## ⚡ Vercel Deployment

Vercel is perfect for full Next.js applications with API routes and server-side features.

### Step 1: Initial Vercel Setup
```bash
# Login to Vercel (only needed once)
vercel login

# Link your project (only needed once)
vercel link
# Select: Link to existing project
# Choose: omthakur-firebase
```

### Step 2: Configure Environment Variables
```bash
# Add environment variables to Vercel
vercel env add NEXT_PUBLIC_FIREBASE_API_KEY
vercel env add NEXT_PUBLIC_SUPABASE_URL
vercel env add PEXELS_API_KEY
vercel env add YOUTUBE_API_KEY
# ... add all required variables

# Or bulk import from file
vercel env pull .env.vercel.local
```

### Step 3: Deploy to Vercel
```bash
# Build and deploy
vercel --prod

# Deploy to preview (staging)
vercel

# Deploy with custom message
vercel --prod -m "Manual deployment $(date)"
```

### Step 4: Verify Deployment
```bash
# Check deployment status
vercel ls

# View domains
vercel domains ls

# Check environment variables
vercel env ls
```

## 🛠️ Complete Deployment Workflow

### Daily Deployment Routine

#### 1. Pull Latest Changes
```bash
# Navigate to project directory
cd /path/to/omthakur-firebase

# Pull latest changes from GitHub
git pull origin main

# Install any new dependencies
npm install
```

#### 2. Test Locally (Optional but Recommended)
```bash
# Run development server
npm run dev

# Test build
npm run build

# Test production build locally
npm start
```

#### 3. Deploy to Vercel (Primary Platform)
```bash
# Deploy to production
vercel --prod

# Verify deployment
curl -I https://omthakur.site
```

#### 4. Deploy to Firebase (Backup/Static)
```bash
# Build for static export
npm run build
npm run export

# Deploy to Firebase
firebase deploy --only hosting

# Verify deployment
curl -I https://your-project.web.app
```

## 📁 Deployment Scripts

Create these helper scripts for easier deployment:

### scripts/deploy-vercel.sh
```bash
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
```

### scripts/deploy-firebase.sh
```bash
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
    echo "🌐 Live at: https://your-project.web.app"
else
    echo "❌ Firebase deployment failed!"
    exit 1
fi
```

### scripts/deploy-both.sh
```bash
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
echo "🔥 Firebase (Backup): https://your-project.web.app"
```

Make scripts executable:
```bash
chmod +x scripts/deploy-*.sh
```

## 🔧 Configuration Files

### next.config.ts (Updated for Both Platforms)
```typescript
/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  
  // For static export (Firebase)
  ...(process.env.EXPORT_MODE === 'static' && {
    output: 'export',
    trailingSlash: true,
    images: {
      unoptimized: true,
    },
  }),
  
  // Image optimization
  images: {
    domains: [
      'images.pexels.com',
      'img.youtube.com',
      'firebasestorage.googleapis.com',
    ],
  },
};

export default nextConfig;
```

### package.json (Add Export Script)
```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "export": "EXPORT_MODE=static next build && next export"
  }
}
```

### firebase.json (Updated Configuration)
```json
{
  "hosting": {
    "public": "out",
    "ignore": [
      "firebase.json",
      "**/.*",
      "**/node_modules/**"
    ],
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ],
    "headers": [
      {
        "source": "**/*",
        "headers": [
          {
            "key": "Cache-Control",
            "value": "public, max-age=3600"
          }
        ]
      }
    ]
  }
}
```

## 🐛 Troubleshooting

### Common Issues and Solutions

#### 1. Build Failures
```bash
# Clear cache and reinstall
rm -rf .next node_modules package-lock.json
npm install
npm run build
```

#### 2. Environment Variable Issues
```bash
# Check Vercel environment variables
vercel env ls

# Pull latest environment variables
vercel env pull .env.vercel.local

# Test with local environment
npm run dev
```

#### 3. Firebase Deployment Issues
```bash
# Check Firebase project status
firebase projects:list

# Reinitialize if needed
firebase init hosting --force

# Check hosting status
firebase hosting:sites:list
```

#### 4. Static Export Issues
```bash
# Check for dynamic routes that need static generation
# Update next.config.ts with generateStaticParams

# Test export locally
npm run export
cd out && python -m http.server 8000
```

## 📊 Deployment Comparison

| Feature | Vercel | Firebase Hosting |
|---------|--------|------------------|
| **API Routes** | ✅ Full Support | ❌ Static Only |
| **Server Functions** | ✅ Serverless | ❌ None |
| **Build Time** | ~2-3 minutes | ~1-2 minutes |
| **CDN** | ✅ Global | ✅ Global |
| **Custom Domains** | ✅ Free | ✅ Free |
| **Environment Variables** | ✅ UI + CLI | ❌ Build Time Only |
| **Database Integration** | ✅ Direct | ⚠️ Client Only |
| **Photo Sync API** | ✅ Works | ❌ Won't Work |
| **YouTube Sync API** | ✅ Works | ❌ Won't Work |

## 🎯 Recommended Strategy

### Primary: Vercel
- **Use for**: Full application with API routes
- **Benefits**: All features work, easy deployment
- **URL**: https://omthakur.site

### Secondary: Firebase Hosting  
- **Use for**: Static backup, CDN for assets
- **Benefits**: Fast static content delivery
- **URL**: https://your-project.web.app

### Deployment Schedule
```bash
# Daily or after major changes
./scripts/deploy-vercel.sh

# Weekly or for static content updates
./scripts/deploy-firebase.sh

# After major updates
./scripts/deploy-both.sh
```

## 🔐 Security Checklist

- [ ] Environment variables configured in both platforms
- [ ] API keys not exposed in client code
- [ ] Firebase rules properly configured
- [ ] Vercel environment variables set to production
- [ ] Domain SSL certificates active
- [ ] CORS properly configured for APIs

## 📞 Quick Commands Reference

```bash
# Vercel Commands
vercel --prod                    # Deploy to production
vercel domains                   # Manage domains
vercel env ls                    # List environment variables
vercel logs                      # View deployment logs

# Firebase Commands
firebase deploy --only hosting  # Deploy hosting only
firebase hosting:sites:list     # List hosting sites
firebase projects:list          # List projects
firebase serve                  # Test locally

# Git Commands
git pull origin main            # Pull latest changes
git status                      # Check working directory
git log --oneline -5           # View recent commits
```

---

**Last Updated**: August 7, 2025  
**Primary Platform**: ✅ Vercel (https://omthakur.site)  
**Backup Platform**: 🔥 Firebase Hosting  
**Deployment Method**: ✅ Manual (Reliable)  

## 🚀 Quick Start

1. **Install CLI tools**: `npm install -g vercel firebase-tools`
2. **Login to services**: `vercel login && firebase login`
3. **Pull latest code**: `git pull origin main`
4. **Deploy to Vercel**: `vercel --prod`
5. **Deploy to Firebase**: `npm run export && firebase deploy`
6. **✅ Done!** Both platforms updated
