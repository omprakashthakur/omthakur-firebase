import { NextResponse } from 'next/server';
import { fetchOmPrakashPhotos, formatPexelsPhotos, getTinyPlaceholder } from '@/lib/pexelsClient';

// Define revalidation time for Next.js to cache this API endpoint
export const revalidate = 3600; // Revalidate every hour in production

/**
 * API Route to get photography from Pexels
 * With improved error handling and production stability
 */
export async function GET() {
  try {
    // Fetch photos specifically from Om Prakash Thakur's account
    const photos = await fetchOmPrakashPhotos(20, 1);
    
    // Format them to match your photography schema
    const formattedPhotos = formatPexelsPhotos(photos);
    
    // Set appropriate cache headers for the response
    return NextResponse.json(
      formattedPhotos,
      {
        headers: {
          'Cache-Control': process.env.NODE_ENV === 'production' 
            ? 'public, s-maxage=3600, stale-while-revalidate=86400' 
            : 'no-cache, no-store, must-revalidate'
        }
      }
    );
  } catch (error) {
    console.error('Error in Pexels API route:', error);
    
    // Create fallback data with enhanced production reliability
    // Each image has proper blur data URL and placeholder settings
    const tinyPlaceholder = getTinyPlaceholder();
    
    // Return fallback data with local image paths instead of empty array
    return NextResponse.json([
      {
        id: 'pexels-fallback-1',
        title: 'Landscape Photography',
        description: 'Landscape photography by Om Prakash Thakur',
        src: '/placeholder-image.jpg',
        alt: 'Landscape Photography - Mountains and valleys',
        category: 'pexels-collection',
        tags: ['pexels', 'om-prakash-thakur', 'photography', 'landscape'],
        photographerName: 'Om Prakash Thakur',
        photographerUrl: 'https://omprakashthakur.com',
        width: 800,
        height: 600,
        originalUrl: '/placeholder-image.jpg',
        downloadUrl: '/placeholder-image.jpg',
        created_at: new Date().toISOString(),
        blurDataURL: tinyPlaceholder,
        placeholder: 'blur'
      },
      {
        id: 'pexels-fallback-2',
        title: 'Portrait Photography',
        description: 'Portrait photography by Om Prakash Thakur',
        src: '/placeholder-image.jpg',
        alt: 'Portrait Photography - Professional portraits',
        category: 'pexels-collection',
        tags: ['pexels', 'om-prakash-thakur', 'photography', 'portrait'],
        photographerName: 'Om Prakash Thakur',
        photographerUrl: 'https://omprakashthakur.com',
        width: 800,
        height: 600,
        originalUrl: '/placeholder-image.jpg',
        downloadUrl: '/placeholder-image.jpg',
        created_at: new Date().toISOString(),
        blurDataURL: tinyPlaceholder,
        placeholder: 'blur'
      },
      {
        id: 'pexels-fallback-3',
        title: 'Street Photography',
        description: 'Street photography by Om Prakash Thakur',
        src: '/placeholder-image.jpg',
        alt: 'Street Photography - Urban life and culture',
        category: 'pexels-collection',
        tags: ['pexels', 'om-prakash-thakur', 'photography', 'street'],
        photographerName: 'Om Prakash Thakur',
        photographerUrl: 'https://omprakashthakur.com',
        width: 800,
        height: 600,
        originalUrl: '/placeholder-image.jpg',
        downloadUrl: '/placeholder-image.jpg',
        created_at: new Date().toISOString(),
        blurDataURL: tinyPlaceholder,
        placeholder: 'blur'
      }
    ], 
    {
      status: 200,
      headers: {
        // Even for errors, we want to cache the response to prevent repeated failed requests
        'Cache-Control': 'public, s-maxage=600, stale-while-revalidate=86400' // Cache for 10 minutes, stale for 24 hours
      }
    });
  }
}
