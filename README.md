# Om Thakur - Personal Portfolio

A comprehensive personal portfolio website built with Next.js, hosted on Firebase and Vercel, featuring blog posts, vlogs, and a photography gallery.

## Features

### Firebase Integration
- **Authentication**: Firebase Authentication for secure admin login and user management
- **Firestore**: Database for storing and retrieving blog posts, vlogs, and photography data
- **Hosting**: Firebase Hosting with App Hosting configuration for scalable deployment
- **Security Rules**: Secure data access through Firebase security rules

### Vercel Integration
- **Deployment**: Continuous deployment pipeline configured for Vercel
- **Edge Functions**: Optimized serverless functions for API routes
- **Analytics**: Performance monitoring and user analytics
- **Preview Deployments**: Automatic preview deployments for pull requests

### AI Features
- **SEO Optimizer**: AI-powered SEO suggestions for blog posts using Google Gemini 2.0 Flash
- **GenKit Integration**: AI workflow integration using GenKit and Google AI

### Key Technologies
- **Next.js 15**: App Router for efficient routing and server components
- **TypeScript**: Type-safe code for better development experience
- **Supabase**: Additional database functionality for specific features
- **TailwindCSS**: Utility-first CSS framework for responsive design
- **Radix UI**: Accessible component primitives for building the UI
- **Shadcn UI**: Component library built on Radix UI

## Content Management
- **Blog Posts**: Create, edit, and publish blog posts with SEO optimization
- **Photography Gallery**: Upload and manage photography collection with download options
- **Vlog Integration**: Embed and manage videos from YouTube, Instagram, and TikTok

## Getting Started

1. Clone the repository
```bash
git clone https://github.com/omprakashthakur/omthakur-firebase.git
cd omthakur-firebase
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables (create a .env.local file)
```env
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
```

4. Start the development server
```bash
npm run dev
```

The application will be available at http://localhost:8000

## API Testing

The project includes scripts for testing the API endpoints and adding test data:

### Run API Tests

```bash
chmod +x scripts/test-api.sh
./scripts/test-api.sh
```

This will test all main and dynamic API routes and report their status.

### Add Test Data

```bash
chmod +x scripts/add-test-data.sh
./scripts/add-test-data.sh
```

This script will add sample data to your Supabase database for testing purposes.

## Troubleshooting Common Issues

### API Dynamic Route Parameters

If you're experiencing issues with dynamic route parameters in Next.js 15, ensure you're accessing them correctly:

```typescript
// In Next.js 15, access params directly from the context object
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  // Convert string ID to number if needed
  const numericId = parseInt(params.id, 10);
  
  // Rest of your code...
}
```

### Supabase Connection

If Supabase connection fails, the application will fall back to using mock data. To fix:

1. Verify your Supabase credentials in .env
2. Ensure your IP address is allowed in Supabase
3. Check if the required tables exist in your Supabase database

You can run our diagnostic script to help identify Supabase connection issues:

```bash
./scripts/check-supabase.sh [port]
```

### "Error: Failed to fetch vlogs: 500" Issue

If you encounter a 500 error when loading the vlog page, it could be due to:

1. Schema mismatch between your code and database
2. Missing or incorrectly named columns in the vlogs table
3. Supabase connection issues

To fix this specific issue:
1. Make sure your vlogs table has all fields defined in the `Vlog` interface
2. Check for any sorting/ordering issues (especially with `created_at` field)
3. Try adding test data with `./scripts/add-test-data.sh`

### Image Domain Configuration

If you see errors about unconfigured hosts for images, you can use the provided script to add new domains:

```bash
./scripts/add-image-domain.sh example.com
```

Or manually add the domain to your Next.js configuration:

```typescript
// In next.config.ts
images: {
  remotePatterns: [
    // Existing patterns...
    {
      protocol: 'https',
      hostname: 'your-image-domain.com',
      port: '',
      pathname: '/**',
    },
  ],
},
```

The following domains are already configured:
- placehold.co
- images.pexels.com
- cdn.hashnode.com
- via.placeholder.com

### Recent API Fixes

We've recently fixed several issues with the API routes:

1. Fixed dynamic route parameter handling in Next.js 15
2. Updated schema compatibility for all database tables
3. Improved error handling for missing resources
4. Added proper database connection with fallback mock client

For detailed information on the fixes, see the [API Fixes Summary](docs/api-fixes-summary.md).

## Deployment

This project uses a hybrid deployment strategy with GitHub Actions for CI/CD:

### Primary Deployment: Vercel
The primary deployment for all server-side features is on Vercel:

1. Connect your GitHub repository to Vercel
2. Configure the environment variables in Vercel
3. Deploy automatically when pushing to the main branch

**Vercel Project ID:** `prj_MG7wWVlmNL1uJ8C63f07xh3U4xjb`

You can deploy manually to Vercel with:
```bash
npm run vercel:deploy
```

### Secondary Deployment: Firebase Hosting
Firebase Hosting is used for static content:

```bash
# For manual deployment
npm run build
firebase deploy --only hosting
```

The GitHub Action will automatically deploy static content to Firebase Hosting when pushing to the main branch.

### Accessing the App
- Vercel URL: https://yourapp.vercel.app
- Firebase URL: https://yourapp.web.app

### CI/CD Setup with GitHub Actions

This project includes GitHub Actions workflows for automatic deployment to both platforms.
For detailed setup instructions, see the [Deployment Guide](./docs/deployment-guide.md)

Quick setup:
```bash
# Get instructions for required tokens
./scripts/setup-deployment-tokens.sh

# Set up environment variables
./scripts/setup-env-variables.sh
```

## Troubleshooting

### Automated Troubleshooting Tools

This project includes scripts to help diagnose and fix common issues:

1. **General Troubleshooter**:
   ```bash
   ./scripts/troubleshoot.sh
   ```
   This script checks your environment, dependencies, and API configurations, then provides recommendations for fixing issues.

2. **Deployment Checker**:
   ```bash
   ./scripts/check-deployment.sh
   ```
   Verifies that all necessary files and configurations are in place for successful deployment to both Firebase and Vercel.

3. **Image Domain Checker**:
   ```bash
   ./scripts/check-image-domains.sh [port]
   ```
   Scans your pages for unconfigured image domains and offers to add them to your Next.js configuration automatically.

4. **Add Image Domain**:
   ```bash
   ./scripts/add-image-domain.sh example.com
   ```
   Quickly adds a new image domain to your Next.js configuration without manually editing the config file.

### Common Issues Documentation

For detailed solutions to common problems, please refer to:
- [Troubleshooting Guide](./docs/troubleshooting.md) - Solutions for API errors, deployment issues, and database problems

### Resolving GitHub Actions Issues

If you encounter GitHub Actions deployment issues related to missing APIs:

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your Firebase project
3. Navigate to "APIs & Services" > "Library"
4. Enable the following APIs:
   - Cloud Build API (cloudbuild.googleapis.com)
   - Artifact Registry API (artifactregistry.googleapis.com)

If you don't need server-side features on Firebase, you can use the static-only deployment configuration provided in this repository.

## License
MIT
