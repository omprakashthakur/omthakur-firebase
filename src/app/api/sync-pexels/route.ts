// src/app/api/sync-pexels/route.ts
/**
 * API endpoint to sync photos from Pexels collection to database
 * Can be called manually or via webhook/cron job
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const PEXELS_API_KEY = process.env.PEXELS_API_KEY;
const COLLECTION_ID = 'ofymzs7'; // Om Prakash Thakur's collection

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface PexelsPhoto {
  id: number;
  src: {
    large2x: string;
    large: string;
    medium: string;
    original: string;
  };
  alt: string;
  photographer: string;
  url: string;
}

/**
 * Fetch photos from Pexels collection
 */
async function fetchPexelsCollection(collectionId: string): Promise<PexelsPhoto[]> {
  if (!PEXELS_API_KEY) {
    throw new Error('PEXELS_API_KEY is not configured');
  }

  const response = await fetch(
    `https://api.pexels.com/v1/collections/${collectionId}?per_page=50`,
    {
      headers: {
        Authorization: PEXELS_API_KEY,
      }
    }
  );

  if (!response.ok) {
    throw new Error(`Pexels API error: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  return data.media || [];
}

/**
 * Format Pexels photo for database insertion
 */
function formatPhotoForDB(photo: PexelsPhoto) {
  return {
    src: photo.src.large2x || photo.src.large || photo.src.medium,
    alt: photo.alt || `Photo by ${photo.photographer}`,
    downloadurl: photo.src.original || photo.url,
    downloadUrl: photo.src.original || photo.url
  };
}

/**
 * Sync photos to database
 */
async function syncPhotosToDatabase(photos: PexelsPhoto[]) {
  const results = {
    total: photos.length,
    inserted: 0,
    skipped: 0,
    errors: 0,
    newPhotos: [] as string[]
  };

  for (const photo of photos) {
    const formattedPhoto = formatPhotoForDB(photo);
    
    try {
      // Check if photo already exists by src URL
      const { data: existing } = await supabase
        .from('photography')
        .select('id')
        .eq('src', formattedPhoto.src)
        .single();
      
      if (existing) {
        results.skipped++;
        continue;
      }
      
      // Insert the photo
      const { data, error } = await supabase
        .from('photography')
        .insert([formattedPhoto])
        .select();
      
      if (error) {
        console.error(`Failed to insert photo from Pexels ID ${photo.id}:`, error);
        results.errors++;
      } else {
        results.inserted++;
        results.newPhotos.push(photo.alt || `Pexels ID: ${photo.id}`);
      }
    } catch (error) {
      console.error(`Error processing photo ${photo.id}:`, error);
      results.errors++;
    }
  }

  return results;
}

export async function POST(request: NextRequest) {
  try {
    // Optional: Add authentication/authorization here
    const authHeader = request.headers.get('authorization');
    const expectedToken = process.env.SYNC_TOKEN; // Add this to your env vars for security
    
    if (expectedToken && authHeader !== `Bearer ${expectedToken}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    console.log('🚀 Starting Pexels sync via API...');
    
    // Fetch photos from Pexels
    const photos = await fetchPexelsCollection(COLLECTION_ID);
    
    if (photos.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'No photos found in collection',
        results: { total: 0, inserted: 0, skipped: 0, errors: 0, newPhotos: [] }
      });
    }
    
    // Sync to database
    const results = await syncPhotosToDatabase(photos);
    
    // Get updated count
    const { count } = await supabase
      .from('photography')
      .select('*', { count: 'exact', head: true });
    
    return NextResponse.json({
      success: true,
      message: results.inserted > 0 
        ? `Successfully synced ${results.inserted} new photos`
        : 'All photos already up to date',
      results: {
        ...results,
        totalInDatabase: count
      }
    });
    
  } catch (error: any) {
    console.error('❌ Sync failed:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error.message || 'Failed to sync photos',
        details: error.toString()
      }, 
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Pexels Photo Sync API',
    description: 'Use POST to sync photos from your Pexels collection to the database',
    collection: COLLECTION_ID,
    status: PEXELS_API_KEY ? 'API Key configured' : 'API Key missing'
  });
}
