// scripts/sync-pexels-to-db.js
/**
 * Script to sync photos from Om Prakash Thakur's Pexels collection to Supabase database
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

// Configuration
const PEXELS_API_KEY = process.env.PEXELS_API_KEY;
const COLLECTION_ID = 'ofymzs7'; // Om Prakash Thakur's collection

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

/**
 * Fetch photos from Pexels collection
 */
async function fetchPexelsCollection(collectionId, perPage = 20, page = 1) {
  if (!PEXELS_API_KEY) {
    throw new Error('PEXELS_API_KEY is not configured');
  }

  console.log(`🔍 Fetching photos from Pexels collection: ${collectionId}`);
  
  const response = await fetch(
    `https://api.pexels.com/v1/collections/${collectionId}?per_page=${perPage}&page=${page}`,
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
  
  if (!data.media || data.media.length === 0) {
    throw new Error('No photos found in collection');
  }

  console.log(`✅ Found ${data.media.length} photos in collection`);
  return data.media;
}

/**
 * Format Pexels photo for database insertion
 * Using the actual table schema: id, src, alt, downloadurl, downloadUrl
 */
function formatPhotoForDB(photo) {
  return {
    src: photo.src.large2x || photo.src.large || photo.src.medium,
    alt: photo.alt || `Photo by ${photo.photographer}`,
    downloadurl: photo.src.original || photo.url,
    downloadUrl: photo.src.original || photo.url
  };
}

/**
 * Check if photography table exists
 */
async function ensurePhotographyTable() {
  console.log('📋 Checking photography table...');
  
  // Try to select from the table to see if it exists
  const { data, error } = await supabase
    .from('photography')
    .select('id')
    .limit(1);
    
  if (error) {
    console.error('❌ Database error:', error);
    throw error;
  } else {
    console.log('✅ Photography table exists and is accessible');
  }
}

/**
 * Sync photos to database
 */
async function syncPhotosToDatabase(photos) {
  console.log(`💾 Syncing ${photos.length} photos to database...`);
  
  for (const photo of photos) {
    const formattedPhoto = formatPhotoForDB(photo);
    
    // Check if photo already exists by src URL
    const { data: existing } = await supabase
      .from('photography')
      .select('id')
      .eq('src', formattedPhoto.src)
      .single();
    
    if (existing) {
      console.log(`⏭️  Photo with src ${formattedPhoto.src} already exists, skipping`);
      continue;
    }
    
    // Insert the photo
    const { data, error } = await supabase
      .from('photography')
      .insert([formattedPhoto])
      .select();
    
    if (error) {
      console.error(`❌ Failed to insert photo from Pexels ID ${photo.id}:`, error);
    } else {
      console.log(`✅ Inserted photo: ${photo.alt || 'Untitled'} (Pexels ID: ${photo.id})`);
    }
  }
}

/**
 * Main function
 */
async function main() {
  try {
    console.log('🚀 Starting Pexels to Database sync...');
    console.log(`📷 Collection ID: ${COLLECTION_ID}`);
    console.log(`🗄️  Database URL: ${process.env.NEXT_PUBLIC_SUPABASE_URL}`);
    
    // Ensure table exists
    await ensurePhotographyTable();
    
    // Fetch photos from Pexels
    const photos = await fetchPexelsCollection(COLLECTION_ID);
    
    // Sync to database
    await syncPhotosToDatabase(photos);
    
    // Verify the sync
    const { data: allPhotos, error } = await supabase
      .from('photography')
      .select('*')
      .order('id', { ascending: false });
    
    if (error) {
      console.error('❌ Failed to verify sync:', error);
    } else {
      console.log(`\n📊 Sync Summary:`);
      console.log(`   Total photos in database: ${allPhotos.length}`);
      console.log(`   Latest photo: ${allPhotos[0]?.alt || 'None'}`);
      console.log(`\n✅ Sync completed successfully!`);
      console.log(`🌐 Your photography page should now show real photos from your Pexels collection`);
    }
    
  } catch (error) {
    console.error('❌ Sync failed:', error);
    process.exit(1);
  }
}

// Run the script
main();
