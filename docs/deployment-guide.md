# Deployment Guide

This guide explains how to deploy your portfolio project to both Vercel and Firebase using GitHub Actions.

## Prerequisites

Before deploying, make sure you have:

1. A Vercel account connected to your GitHub
2. A Firebase project set up
3. GitHub repository with your code

## Setup Steps

### Step 1: Set Up Required Tokens

Run the setup script to get instructions on obtaining the necessary deployment tokens:

```bash
./scripts/setup-deployment-tokens.sh
```

### Step 2: Configure Environment Variables

Set up your environment variables for both platforms:

```bash
./scripts/setup-env-variables.sh
```

### Step 3: Add GitHub Secrets

Add the following secrets to your GitHub repository:

1. **For Vercel:**
   - `VERCEL_TOKEN`: API token from Vercel
   - `VERCEL_ORG_ID`: Your Vercel organization ID
   - `VERCEL_PROJECT_ID`: Your Vercel project ID

2. **For Firebase:**
   - `FIREBASE_SERVICE_ACCOUNT`: JSON service account key
   - `FIREBASE_PROJECT_ID`: Your Firebase project ID

3. **Environment Variables:**
   - `NEXT_PUBLIC_FIREBASE_API_KEY`
   - `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
   - `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
   - `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
   - `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
   - `NEXT_PUBLIC_FIREBASE_APP_ID`
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `GENKIT_API_KEY`

### Step 4: Push Your Code to GitHub

Once you push to the main branch, GitHub Actions will:
1. Deploy your Next.js application to Vercel
2. Deploy static assets to Firebase Hosting

## Manual Deployment

If you prefer to deploy manually:

### To Vercel

```bash
vercel deploy --prod
```

### To Firebase

```bash
npm run build
firebase deploy --only hosting
```

## Troubleshooting

If you encounter deployment issues:

1. Check your GitHub Actions logs for any errors
2. Verify that all required secrets are set correctly
3. Ensure your Firebase and Vercel projects are properly configured
4. Run the Firebase CLI locally to test your deployment

Need more help? Check the [Vercel documentation](https://vercel.com/docs) or [Firebase Hosting documentation](https://firebase.google.com/docs/hosting).
