// src/lib/pexelsClient.ts
/**
 * Service to interact with Pexels API
 */

// Use environment variable with NEXT_PUBLIC_ prefix for client-side access
const API_KEY = process.env.PEXELS_API_KEY || process.env.NEXT_PUBLIC_PEXELS_API_KEY;

/**
 * Fetch photos from Pexels API
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
    
    // Using the curated API endpoint - in production you'd want to use collections or user's photos
    const response = await fetch(
      `https://api.pexels.com/v1/curated?per_page=${perPage}&page=${page}`,
      {
        headers: {
          Authorization: API_KEY,
        },
        cache: 'no-store' // Disable caching to always get fresh photos
      }
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
    throw error;
  }
}

/**
 * Fetch photos specifically from Om Prakash Thakur's Pexels collection
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
    
    const response = await fetch(
      `https://api.pexels.com/v1/collections/${collectionId}?per_page=${perPage}&page=${page}`,
      {
        headers: {
          Authorization: API_KEY,
        },
        cache: 'no-store'
      }
    );

    if (!response.ok) {
      console.error(`Pexels Collection API error: ${response.status}`);
      // Fallback to curated photos if collection fails
      console.log('Falling back to curated photos...');
      return await fetchPexelsPhotos(perPage, page);
    }

    const data = await response.json();
    
    // The collection API returns media array
    if (data.media && data.media.length > 0) {
      console.log(`Found ${data.media.length} photos in your collection`);
      return data.media;
    } else {
      console.log('No photos found in your collection, using curated photos as fallback');
      return await fetchPexelsPhotos(perPage, page);
    }
  } catch (error) {
    console.error('Error fetching Om Prakash collection:', error);
    // Fallback to curated photos
    return await fetchPexelsPhotos(perPage, page);
  }
}

/**
 * Generate placeholder photos when API is not available
 */
function generatePlaceholderPhotos(count: number) {
  return Array.from({ length: count }).map((_, index) => ({
    id: index + 1,
    width: 800,
    height: 600,
    url: `https://placeholder.com/photo/${index + 1}`,
    photographer: 'Placeholder',
    photographer_url: 'https://placeholder.com',
    src: {
      original: `https://placehold.co/800x600?text=Pexels+Photo+${index + 1}`,
      large: `https://placehold.co/800x600?text=Pexels+Photo+${index + 1}`,
      medium: `https://placehold.co/400x300?text=Pexels+Photo+${index + 1}`,
      small: `https://placehold.co/200x150?text=Pexels+Photo+${index + 1}`,
      portrait: `https://placehold.co/800x1200?text=Pexels+Photo+${index + 1}`,
      landscape: `https://placehold.co/1200x800?text=Pexels+Photo+${index + 1}`,
      tiny: `https://placehold.co/100x75?text=Pexels+Photo+${index + 1}`
    },
    alt: `Placeholder photo ${index + 1}`
  }));
}

/**
 * Format Pexels photos to match your photography schema
 */
export function formatPexelsPhotos(photos: any[]) {
  return photos.map(photo => ({
    id: `pexels-${photo.id}`, // Add prefix to distinguish from your own photos
    title: photo.alt || `Photo by ${photo.photographer}`,
    description: `Photo by ${photo.photographer} from Om Prakash Thakur's Pexels collection`,
    src: photo.src.large2x || photo.src.large, // Use higher resolution if available
    alt: photo.alt || photo.photographer,
    category: 'pexels-collection',
    tags: ['pexels', 'om-prakash-thakur', 'photography'],
    photographerName: photo.photographer,
    photographerUrl: photo.photographer_url,
    width: photo.width,
    height: photo.height,
    originalUrl: photo.url,
    downloadUrl: photo.src.original, // Highest resolution for download/modal
    created_at: new Date().toISOString()
  }));
}
