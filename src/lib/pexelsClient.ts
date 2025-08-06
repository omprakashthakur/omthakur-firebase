// src/lib/pexelsClient.ts
/**
 * Service to interact with Pexels API with improved production fallbacks
 */

// Use environment variable with NEXT_PUBLIC_ prefix for client-side access
const API_KEY = process.env.PEXELS_API_KEY || process.env.NEXT_PUBLIC_PEXELS_API_KEY;

// Base64 encoded tiny transparent placeholder image
// This is a 1x1 transparent PNG that can be used as a fallback in production
const TINY_PLACEHOLDER = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=";

/**
 * Fetch photos from Pexels API with improved error handling and caching
 * @param perPage - Number of photos per page
 * @param page - Page number
 */
export async function fetchPexelsPhotos(perPage = 20, page = 1) {
  try {
    // Check if API key is available
    if (!API_KEY) {
      console.warn('No Pexels API key found. Using placeholder photos instead.');
      // Return placeholder data if no API key
      return generatePlaceholderPhotos(perPage);
    }
    
    // Using the curated API endpoint with a reasonable cache duration
    // In production, a 1-hour cache is reasonable for photos that don't change frequently
    // For Next.js App Router, we need to handle caching differently
    let fetchOptions: RequestInit = {
      headers: {
        Authorization: API_KEY,
      }
    };
    
    // Add cache options based on environment
    if (process.env.NODE_ENV === 'production') {
      // For production, we'll rely on Next.js default caching behavior
      // The actual revalidation will be handled at the API route level
    } else {
      // For development, disable cache
      fetchOptions.cache = 'no-store' as RequestCache;
    }
    
    const response = await fetch(
      `https://api.pexels.com/v1/curated?per_page=${perPage}&page=${page}`,
      fetchOptions
    );

    if (!response.ok) {
      console.error(`Pexels API error: ${response.status}`);
      // Return placeholder data if API request fails
      return generatePlaceholderPhotos(perPage);
    }

    const data = await response.json();
    return data.photos;
  } catch (error) {
    console.error('Error fetching from Pexels:', error);
    // Return placeholders rather than throwing, for production stability
    return generatePlaceholderPhotos(perPage);
  }
}

/**
 * Fetch photos specifically from Om Prakash Thakur's Pexels collection
 * with improved production stability
 * @param perPage - Number of photos per page
 * @param page - Page number
 */
export async function fetchOmPrakashPhotos(perPage = 20, page = 1) {
  try {
    // Check if API key is available
    if (!API_KEY) {
      console.warn('No Pexels API key found. Using placeholder photos instead.');
      return generatePlaceholderPhotos(perPage);
    }
    
    // Fetch photos from Om Prakash Thakur's collection
    const collectionId = 'ofymzs7'; // Your collection ID
    console.log(`Fetching photos from Om Prakash Thakur's collection: ${collectionId}`);
    
    // Create fetch options with proper TypeScript types
    let fetchOptions: RequestInit = {
      headers: {
        Authorization: API_KEY,
      }
    };
    
    // Add cache options based on environment
    if (process.env.NODE_ENV === 'production') {
      // For production, we'll rely on Next.js default caching behavior
      // The actual revalidation will be handled at the API route level
    } else {
      // For development, disable cache
      fetchOptions.cache = 'no-store' as RequestCache;
    }
    
    const response = await fetch(
      `https://api.pexels.com/v1/collections/${collectionId}?per_page=${perPage}&page=${page}`,
      fetchOptions
    );

    if (!response.ok) {
      console.error(`Pexels Collection API error: ${response.status}`);
      // Try curated as first fallback
      try {
        console.log('Falling back to curated photos...');
        return await fetchPexelsPhotos(perPage, page);
      } catch (innerError) {
        // If even the curated fallback fails, return placeholder data
        console.error('Fallback to curated photos failed:', innerError);
        return generatePlaceholderPhotos(perPage);
      }
    }

    const data = await response.json();
    
    // The collection API returns media array
    if (data.media && data.media.length > 0) {
      console.log(`Found ${data.media.length} photos in your collection`);
      return data.media;
    } else {
      console.log('No photos found in your collection, using curated photos as fallback');
      // Try curated as fallback
      try {
        return await fetchPexelsPhotos(perPage, page);
      } catch (innerError) {
        // If even the curated fallback fails, return placeholder data
        console.error('Fallback to curated photos failed:', innerError);
        return generatePlaceholderPhotos(perPage);
      }
    }
  } catch (error) {
    console.error('Error fetching Om Prakash collection:', error);
    // Always return something rather than throwing in production
    return generatePlaceholderPhotos(perPage);
  }
}

/**
 * Generate placeholder photos when API is not available
 * Using local placeholder image to prevent external URL failures in production
 */
function generatePlaceholderPhotos(count: number) {
  return Array.from({ length: count }).map((_, index) => ({
    id: index + 1,
    width: 800,
    height: 600,
    url: `/placeholder-image.jpg`,
    photographer: 'Om Prakash Thakur',
    photographer_url: 'https://omthakur.site',
    src: {
      original: `/placeholder-image.jpg`,
      large2x: `/placeholder-image.jpg`,
      large: `/placeholder-image.jpg`,
      medium: `/placeholder-image.jpg`,
      small: `/placeholder-image.jpg`,
      portrait: `/placeholder-image.jpg`,
      landscape: `/placeholder-image.jpg`,
      tiny: `/placeholder-image.jpg`
    },
    alt: `Photography Collection - Sample ${index + 1}`
  }));
}

/**
 * Format Pexels photos to match your photography schema
 * with additional validation to ensure no missing fields
 */
export function formatPexelsPhotos(photos: any[]) {
  if (!Array.isArray(photos)) {
    console.error('Invalid photos data received:', photos);
    return generatePlaceholderPhotos(3).map(photo => formatSinglePhoto(photo));
  }
  
  return photos.map(photo => formatSinglePhoto(photo));
}

/**
 * Format a single photo with validation for production stability
 */
function formatSinglePhoto(photo: any) {
  // Validate that photo object exists and has required fields
  if (!photo || typeof photo !== 'object') {
    return createFallbackPhoto();
  }
  
  try {
    return {
      id: `pexels-${photo.id || Date.now()}`, // Ensure we always have an ID
      title: photo.alt || `Photo by ${photo.photographer || 'Om Prakash Thakur'}`,
      description: `Photo by ${photo.photographer || 'Om Prakash Thakur'} from Om Prakash Thakur's Pexels collection`,
      // Ensure we have a valid src with multiple fallbacks
      src: (photo.src?.large2x || photo.src?.large || photo.src?.medium || photo.src?.small || '/placeholder-image.jpg'),
      alt: photo.alt || photo.photographer || 'Photography image',
      category: 'pexels-collection',
      tags: ['pexels', 'om-prakash-thakur', 'photography'],
      photographerName: photo.photographer || 'Om Prakash Thakur',
      photographerUrl: photo.photographer_url || 'https://omthakur.site',
      width: photo.width || 800,
      height: photo.height || 600,
      originalUrl: photo.url || photo.src?.original || '/placeholder-image.jpg',
      downloadUrl: photo.src?.original || photo.url || '/placeholder-image.jpg',
      created_at: new Date().toISOString(),
      // Add blur data URL for Next.js Image component
      blurDataURL: TINY_PLACEHOLDER,
      placeholder: 'blur'
    };
  } catch (error) {
    console.error('Error formatting photo:', error);
    return createFallbackPhoto();
  }
}

/**
 * Create a single fallback photo with all required fields
 */
function createFallbackPhoto() {
  return {
    id: `fallback-${Date.now()}`,
    title: 'Photography by Om Prakash Thakur',
    description: 'Photography from Om Prakash Thakur\'s collection',
    src: '/placeholder-image.jpg',
    alt: 'Photography image',
    category: 'pexels-collection',
    tags: ['photography'],
    photographerName: 'Om Prakash Thakur',
    photographerUrl: 'https://omthakur.site',
    width: 800,
    height: 600,
    originalUrl: '/placeholder-image.jpg',
    downloadUrl: '/placeholder-image.jpg',
    created_at: new Date().toISOString(),
    blurDataURL: TINY_PLACEHOLDER,
    placeholder: 'blur'
  };
}

/**
 * Generate a base64 tiny transparent placeholder
 * For Next.js Image components
 */
export function getTinyPlaceholder() {
  return TINY_PLACEHOLDER;
}
