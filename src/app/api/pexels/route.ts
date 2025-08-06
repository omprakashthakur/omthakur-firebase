import { NextResponse } from 'next/server';
import { fetchOmPrakashPhotos, formatPexelsPhotos } from '@/lib/pexelsClient';

// Define revalidation time for Next.js to cache this API endpoint
export const revalidate = 3600; // Revalidate every hour in production

/**
 * API Route to get photography from Om Prakash Thakur's Pexels collection
 * Only returns real photos from your collection
 */
export async function GET() {
  try {
    console.log('🎯 Fetching photos from Om Prakash Thakur Pexels collection...');
    
    // Fetch photos specifically from Om Prakash Thakur's collection
    const photos = await fetchOmPrakashPhotos(20, 1);
    
    // Format them to match your photography schema
    const formattedPhotos = formatPexelsPhotos(photos);
    
    console.log(`✅ Successfully fetched ${formattedPhotos.length} real photos from collection`);
    
    // Set appropriate cache headers for the response
    return NextResponse.json(
      formattedPhotos,
      {
        headers: {
          'Cache-Control': process.env.NODE_ENV === 'production' 
            ? 'public, s-maxage=3600, stale-while-revalidate=86400' 
            : 'no-cache, no-store, must-revalidate',
          'X-Photo-Source': 'pexels-collection',
          'X-Photo-Count': formattedPhotos.length.toString()
        }
      }
    );
  } catch (error) {
    console.error('❌ Error in Pexels API route:', error);
    
    // Return error response instead of dummy data
    return NextResponse.json(
      { 
        error: 'Unable to fetch photos from Pexels collection',
        message: error instanceof Error ? error.message : 'Unknown error occurred',
        suggestion: 'Please ensure PEXELS_API_KEY is configured correctly'
      }, 
      {
        status: 503,
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'X-Photo-Source': 'error',
          'X-Photo-Count': '0'
        }
      }
    );
  }
}
