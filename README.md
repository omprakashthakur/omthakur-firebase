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
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. Run the development server
```bash
npm run dev
```

5. Open [http://localhost:9002](http://localhost:9002) in your browser

## Deployment

This project uses a hybrid deployment strategy:

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

## Resolving GitHub Actions Issues

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
