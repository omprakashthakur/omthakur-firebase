// src/lib/pexelsClient.ts
/**
 * Service to interact with Pexels API - only returns real data from your collection
 */

// Use environment variable
const API_KEY = process.env.PEXELS_API_KEY || process.env.NEXT_PUBLIC_PEXELS_API_KEY;

// Base64 encoded tiny transparent placeholder image for Next.js Image component
const TINY_PLACEHOLDER = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=";

/**
 * Fetch photos from Pexels API with error handling
 * @param perPage - Number of photos per page
 * @param page - Page number
 */
export async function fetchPexelsPhotos(perPage = 20, page = 1) {
  if (!API_KEY) {
    throw new Error('PEXELS_API_KEY is not configured. Cannot fetch photos.');
  }
  
  const fetchOptions: RequestInit = {
    headers: {
      Authorization: API_KEY,
    },
    ...(process.env.NODE_ENV !== 'production' && { cache: 'no-store' as RequestCache })
  };
  
  const response = await fetch(
    `https://api.pexels.com/v1/curated?per_page=${perPage}&page=${page}`,
    fetchOptions
  );

  if (!response.ok) {
    throw new Error(`Pexels API error: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  return data.photos || [];
}

/**
 * Fetch photos specifically from Om Prakash Thakur's collection
 * Collection ID: ofymzs7
 */
export async function fetchOmPrakashPhotos(perPage = 20, page = 1) {
  if (!API_KEY) {
    throw new Error('PEXELS_API_KEY is not configured. Cannot fetch photos from your collection.');
  }
  
  const collectionId = 'ofymzs7'; // Your collection ID
  console.log(`Fetching photos from Om Prakash Thakur's collection: ${collectionId}`);
  
  const fetchOptions: RequestInit = {
    headers: {
      Authorization: API_KEY,
    },
    ...(process.env.NODE_ENV !== 'production' && { cache: 'no-store' as RequestCache })
  };
  
  const response = await fetch(
    `https://api.pexels.com/v1/collections/${collectionId}?per_page=${perPage}&page=${page}`,
    fetchOptions
  );

  if (!response.ok) {
    throw new Error(`Pexels Collection API error: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  
  if (!data.media || data.media.length === 0) {
    throw new Error('No photos found in your Pexels collection');
  }
  
  console.log(`Found ${data.media.length} photos in your collection`);
  return data.media;
}

/**
 * Format Pexels photos to match your photography schema
 */
export function formatPexelsPhotos(photos: any[]) {
  if (!Array.isArray(photos) || photos.length === 0) {
    throw new Error('No valid photos to format');
  }
  
  return photos.map(photo => formatSinglePhoto(photo));
}

/**
 * Format a single photo with validation
 */
function formatSinglePhoto(photo: any) {
  if (!photo || typeof photo !== 'object') {
    throw new Error('Invalid photo object');
  }
  
  if (!photo.id || !photo.src) {
    throw new Error('Photo missing required fields (id or src)');
  }
  
  return {
    id: `pexels-${photo.id}`,
    title: photo.alt || `Photo by ${photo.photographer || 'Om Prakash Thakur'}`,
    description: `Photo by ${photo.photographer || 'Om Prakash Thakur'} from Om Prakash Thakur's Pexels collection`,
    src: photo.src.large2x || photo.src.large || photo.src.medium || photo.src.small,
    alt: photo.alt || photo.photographer || 'Photography image',
    category: 'pexels-collection',
    tags: ['pexels', 'om-prakash-thakur', 'photography'],
    photographerName: photo.photographer || 'Om Prakash Thakur',
    photographerUrl: photo.photographer_url || 'https://omthakur.site',
    width: photo.width || 800,
    height: photo.height || 600,
    originalUrl: photo.url || photo.src.original,
    downloadUrl: photo.src.original || photo.url,
    created_at: new Date().toISOString(),
    blurDataURL: TINY_PLACEHOLDER,
    placeholder: 'blur'
  };
}

/**
 * Generate a base64 tiny transparent placeholder for Next.js Image components
 */
export function getTinyPlaceholder() {
  return TINY_PLACEHOLDER;
}
