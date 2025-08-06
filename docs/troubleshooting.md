# Common Errors and Solutions

This document contains solutions for common errors you might encounter when working with this project.

## 400 Bad Request Error in Vlog Page

### Symptoms
- Vlog page shows "Error loading vlogs" message
- Console shows 400 Bad Request error
- No vlogs are displayed on the page

### Solutions
1. **Check API Implementation**:
   - Ensure `src/app/api/vlogs/route.ts` has a proper GET method implemented
   - Ensure `src/app/api/vlogs/[id]/route.ts` has a proper GET method implemented

2. **Environment Variables**:
   - Verify your `.env` file contains valid Supabase credentials:
     - `NEXT_PUBLIC_SUPABASE_URL`
     - `NEXT_PUBLIC_SUPABASE_ANON_KEY`

3. **Database Connection**:
   - Check if your Supabase database exists and has a `vlogs` table
   - Verify that you have proper permissions to access this table

4. **Client-Side Implementation**:
   - Ensure your frontend is correctly calling the API endpoints
   - Check for proper error handling in `src/app/vlog/page.tsx`

## Deployment Issues

### Firebase Deployment Failing

#### Symptoms
- GitHub Action workflow fails with Firebase errors
- Firebase site not updating after push

#### Solutions
1. **Check Firebase Configuration**:
   - Verify `firebase.json` has correct configuration
   - Ensure `public` directory is set to `out`
   
2. **Build Process**:
   - Make sure `next build && next export` commands are running successfully
   - Verify that the `out` directory is created before deployment

3. **Firebase CLI Token**:
   - Check if the `FIREBASE_TOKEN` secret is correctly set in GitHub repository secrets
   - Regenerate the token if necessary

### Vercel Deployment Issues

#### Symptoms
- Vercel deployment fails
- Changes not reflecting on Vercel deployment

#### Solutions
1. **Project ID**:
   - Verify Vercel Project ID (prj_MG7wWVlmNL1uJ8C63f07xh3U4xjb) is correctly set in workflow files
   
2. **Vercel CLI Token**:
   - Check if `VERCEL_TOKEN` is correctly set in GitHub repository secrets
   
3. **Build Configuration**:
   - Review `next.config.js` for any configuration issues
   - Check if build commands are correctly defined in Vercel project settings

## Database Issues

### Unable to Connect to Supabase

#### Symptoms
- Pages show database connection errors
- API endpoints return 500 errors

#### Solutions
1. **Environment Variables**:
   - Verify `.env` file has correct Supabase credentials
   - Check if Supabase project is active and not in maintenance mode
   
2. **RLS Policies**:
   - Review Row Level Security (RLS) policies in Supabase
   - Ensure anonymous access is allowed if needed for public pages

3. **API Implementation**:
   - Check error handling in API routes
   - Verify that Supabase client is correctly initialized

## Running the Troubleshooter

If you encounter any issues, run our automated troubleshooter:

```bash
./scripts/troubleshoot.sh
```

This script will check for common issues and provide recommendations for fixing them.

## Getting Additional Help

If you continue to experience issues:

1. Check the GitHub repository issues tab
2. Review the error logs in the browser console
3. Check Vercel and Firebase deployment logs
4. Contact the repository maintainer
