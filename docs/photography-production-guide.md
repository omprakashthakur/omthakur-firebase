# Photography Page Production Deployment Guide

This guide covers everything you need to know for deploying the Photography page to production with proper image handling, error states, and fallbacks.

## 📋 Pre-Deployment Checklist

Before deploying your Photography page to production, ensure you have:

1. ✅ Static placeholder image in place
2. ✅ Next.js image domains properly configured  
3. ✅ Client-side error handling for images
4. ✅ Server-side API fallbacks
5. ✅ Blur placeholders for loading states
6. ✅ Environment variables configured (if using Pexels API)

## 🔧 Key Components & Their Production Fixes

### 1. Placeholder Image

Ensure you have a static placeholder image at:
```
/public/placeholder-image.jpg
```

This image will be used as a fallback when external images fail to load.

### 2. Next.js Image Configuration

Your `next.config.ts` must include all external image domains:

```typescript
images: {
  remotePatterns: [
    {
      protocol: 'https',
      hostname: 'images.pexels.com',
      port: '',
      pathname: '/**',
    },
    // Other domains...
  ],
}
```

### 3. Client-Side Error Handling

In your components, ensure Image components have proper fallbacks:

```tsx
<Image
  src={photo.src || '/placeholder-image.jpg'}
  alt={photo.alt || 'Photography image'}
  fill
  sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
  className="object-cover"
  placeholder="blur"
  blurDataURL={photo.blurDataURL || "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII="}
  onError={(e) => {
    const target = e.target as HTMLImageElement;
    target.onerror = null; // Prevent infinite error loops
    target.src = '/placeholder-image.jpg';
  }}
  loading="lazy"
  fetchPriority="auto"
/>
```

### 4. Server-Side API Fallbacks

The Pexels API route has been updated to provide fallback data when:
- The API key is missing
- The API request fails
- The response format is unexpected

Check `src/app/api/pexels/route.ts` for the implementation.

### 5. Pexels Client Implementation

The Pexels client (`src/lib/pexelsClient.ts`) has been improved with:
- Better error handling
- Production-specific caching strategies
- Fallback mechanisms for all failure modes
- Standardized photo formatting

## 🚀 Deployment Process

1. **Run Verification Scripts**
   ```bash
   # Make scripts executable
   chmod +x scripts/check-photography-production.sh
   chmod +x scripts/test-photography-fixes.sh
   
   # Run the verification scripts
   ./scripts/check-photography-production.sh
   ./scripts/test-photography-fixes.sh
   ```
   
   These scripts will verify:
   - All required files exist
   - Placeholder images are in place
   - Image domains are properly configured
   - Client and server fixes are implemented

2. **Build and Test Locally**
   ```bash
   npm run build
   npm run start
   ```
   
   If you encounter a port conflict (EADDRINUSE error):
   ```bash
   # Run on a different port
   npm run start -- -p 3001
   ```
   
   Visit http://localhost:3000/photography (or http://localhost:3001/photography) and verify:
   - Images load correctly
   - Placeholders appear while loading
   - No console errors
   - Try disabling your network to test offline fallbacks

3. **Set Environment Variables**

   For your production environment, set:
   - `PEXELS_API_KEY` (optional, for real photos from Pexels)

4. **Deploy**

   Deploy using your normal deployment process (Vercel, Netlify, etc.)

5. **Post-Deployment Verification**

   Run the production verification script:
   ```bash
   # Verify the default production site
   ./scripts/verify-production-photography.sh
   
   # Or specify a custom URL
   ./scripts/verify-production-photography.sh https://your-site-url.com
   ```
   
   The script checks:
   - Photography page accessibility
   - Placeholder image references
   - Blur data URL implementations
   - API endpoint functionality
   - Photo data response integrity
   
   Additionally, manually check:
   - Visit the production photography page
   - Check network requests for image failures
   - Test with network throttling to verify fallbacks

## 🔍 Troubleshooting Common Production Issues

### Build Warnings

**Symptom:** Warnings during the build process:
```
⚠ Compiled with warnings
Module not found: Can't resolve '@opentelemetry/exporter-jaeger'
⚠️ Node.js 18 and below are deprecated and will no longer be supported in future versions of @supabase/supabase-js
```

**Possible causes:**
1. Missing optional dependencies for tracing
2. Using an older version of Node.js

**Solution:**
1. These warnings are non-critical and won't affect the Photography page functionality
2. Consider upgrading to Node.js 20+ in the future for Supabase compatibility

### Images Not Loading

**Symptom:** White/blank spaces where images should be

**Possible causes:**
1. Image domain not configured in Next.js config
2. Missing placeholder image
3. onError handler not working

**Solution:**
Run `./scripts/check-image-domains.sh` to identify missing domains

### API Errors

**Symptom:** No photos loading, API response errors in console

**Possible causes:**
1. Missing API key
2. API rate limiting
3. Network errors

**Solution:**
Check if the API fallbacks are working correctly by examining the network responses

### Slow Loading Performance

**Symptom:** Page takes a long time to load or feels janky

**Possible causes:**
1. Missing blur placeholders
2. Too many large images
3. No image size optimization

**Solution:**
1. Ensure `placeholder="blur"` is set on Image components
2. Verify correct `sizes` property to load appropriate image sizes
3. Check that Next.js image optimization is enabled

### Port Conflicts

**Symptom:** Error when starting the server:
```
Error: listen EADDRINUSE: address already in use :::3000
```

**Possible causes:**
1. Another application is already using port 3000
2. A previous instance of the app is still running

**Solution:**
1. Find and close the other application using port 3000:
   ```bash
   # Find the process using port 3000
   lsof -i :3000
   
   # Kill the process
   kill -9 <PID>
   ```
2. Or start the app on a different port:
   ```bash
   npm run start -- -p 3001
   ```

## 📈 Monitoring and Maintenance

After deployment, monitor:

1. Image load failures in your error tracking system
2. API response times and error rates
3. User feedback about the photography page

Periodically check for new image domains that might need to be added to your Next.js configuration.

## 🔒 Security Considerations

1. Don't expose your Pexels API key in client-side code
2. Be mindful of hotlinking policies from external image sources
3. Consider implementing Content Security Policy headers for images

---

Following this guide should ensure your Photography page works reliably in production with proper image handling and fallbacks!

## ✅ Verification Results

The fixes implemented in this guide have been tested and verified:

```
🚀 Running Photography Page Production Readiness Check...

Checking for placeholder image...
✅ Found placeholder image at public/placeholder-image.jpg

Checking Next.js image configuration...
✅ Domain 'images.pexels.com' is properly configured

Checking for server-side API fallbacks...
✅ API route has proper fallback handling

Checking for blur placeholder usage...
✅ Photography page uses blur placeholders

==== Production Readiness Summary =====
✅ Basic production readiness checks passed
```

```
🧪 Testing Photography Page Production Fixes

Checking for updated files:
✅ Found: pexelsClient.ts
✅ Found: route.ts
✅ Found: page.tsx
✅ Found: placeholder-image.jpg

Testing for key fixes:
✅ Found blur placeholder implementation
✅ Found tiny placeholder implementation
✅ Found enhanced photo formatting
✅ Found API cache configuration

==== Summary ====
The Photography Page production fixes have been implemented.
```

The build process completes successfully, and the Photography page is now production-ready with all the necessary fallbacks and error handling in place.

## 📈 Future Improvements

While the current implementation is robust for production use, consider these future improvements:

1. **Upgrade to Node.js 20+** - Current warning from Supabase indicates Node.js 18 will soon be unsupported
2. **Implement image preloading** for critical images with `fetchPriority="high"`
3. **Add analytics** to track image load failures and performance metrics
4. **Implement progressive image loading** with low-quality placeholder images
5. **Implement responsive art direction** for different device types

These enhancements can further improve the user experience and performance of your Photography page.
