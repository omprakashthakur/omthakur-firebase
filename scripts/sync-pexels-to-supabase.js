#!/usr/bin/env node

// Script to sync Om Prakash Thakur's Pexels collection to Supabase database
const { createClient } = require('@supabase/supabase-js');

// Load environment variables
require('dotenv').config();

const PEXELS_API_KEY = process.env.PEXELS_API_KEY;
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!PEXELS_API_KEY) {
  console.error('❌ PEXELS_API_KEY not found in environment variables');
  process.exit(1);
}

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error('❌ Supabase credentials not found in environment variables');
  process.exit(1);
}

// Initialize Supabase client
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

async function fetchPexelsCollection() {
  const collectionId = 'ofymzs7';
  console.log(`🔍 Fetching photos from Pexels collection: ${collectionId}`);
  
  try {
    const response = await fetch(
      `https://api.pexels.com/v1/collections/${collectionId}?per_page=50&page=1`,
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
      throw new Error('No photos found in your Pexels collection');
    }
    
    console.log(`✅ Found ${data.media.length} photos in your Pexels collection`);
    return data.media;
  } catch (error) {
    console.error('❌ Error fetching from Pexels:', error);
    throw error;
  }
}

function formatPhotoForDatabase(photo) {
  return {
    id: `pexels-${photo.id}`,
    title: photo.alt || `Photo by ${photo.photographer || 'Om Prakash Thakur'}`,
    description: `Photo by ${photo.photographer || 'Om Prakash Thakur'} from Om Prakash Thakur's Pexels collection`,
    src: photo.src.large2x || photo.src.large || photo.src.medium || photo.src.small,
    alt: photo.alt || photo.photographer || 'Photography image',
    category: 'pexels-collection',
    tags: ['pexels', 'om-prakash-thakur', 'photography'],
    photographer_name: photo.photographer || 'Om Prakash Thakur',
    photographer_url: photo.photographer_url || 'https://omthakur.site',
    width: photo.width || 800,
    height: photo.height || 600,
    original_url: photo.url || photo.src.original,
    download_url: photo.src.original || photo.url,
    source: 'pexels-collection',
    created_at: new Date().toISOString()
  };
}

async function syncToSupabase(photos) {
  console.log(`📝 Syncing ${photos.length} photos to Supabase...`);
  
  try {
    // First, check what table structure we have
    const { data: existingPhotos, error: selectError } = await supabase
      .from('pexels_photos')
      .select('id')
      .limit(1);

    if (selectError) {
      console.log('⚠️ pexels_photos table might not exist, trying photography table...');
      
      // Try the photography table instead
      const { data: photoTable, error: photoError } = await supabase
        .from('photography')
        .select('id')
        .limit(1);
        
      if (photoError) {
        console.error('❌ Neither pexels_photos nor photography table accessible:', photoError);
        return;
      }
      
      console.log('✅ Using photography table for sync');
      await syncToPhotographyTable(photos);
    } else {
      console.log('✅ Using pexels_photos table for sync');
      await syncToPexelsTable(photos);
    }
    
  } catch (error) {
    console.error('❌ Error syncing to Supabase:', error);
    throw error;
  }
}

async function syncToPexelsTable(photos) {
  // Clear existing pexels photos
  const { error: deleteError } = await supabase
    .from('pexels_photos')
    .delete()
    .eq('source', 'pexels-collection');

  if (deleteError) {
    console.log('⚠️ Could not clear existing photos (table might be empty):', deleteError.message);
  }

  // Insert new photos
  const formattedPhotos = photos.map(formatPhotoForDatabase);
  
  const { data, error } = await supabase
    .from('pexels_photos')
    .insert(formattedPhotos)
    .select();

  if (error) {
    console.error('❌ Error inserting into pexels_photos:', error);
    throw error;
  }

  console.log(`✅ Successfully synced ${data.length} photos to pexels_photos table`);
}

async function syncToPhotographyTable(photos) {
  // Clear existing pexels photos from photography table
  const { error: deleteError } = await supabase
    .from('photography')
    .delete()
    .like('id', 'pexels-%');

  if (deleteError) {
    console.log('⚠️ Could not clear existing photos (table might be empty):', deleteError.message);
  }

  // Insert new photos
  const formattedPhotos = photos.map(formatPhotoForDatabase);
  
  const { data, error } = await supabase
    .from('photography')
    .insert(formattedPhotos)
    .select();

  if (error) {
    console.error('❌ Error inserting into photography:', error);
    throw error;
  }

  console.log(`✅ Successfully synced ${data.length} photos to photography table`);
}

async function main() {
  console.log('🚀 Starting Pexels to Supabase sync...');
  
  try {
    // Fetch photos from Pexels collection
    const photos = await fetchPexelsCollection();
    
    // Sync to Supabase
    await syncToSupabase(photos);
    
    console.log('🎉 Sync completed successfully!');
    console.log('📸 Your photography page should now show real photos from your Pexels collection');
    
  } catch (error) {
    console.error('❌ Sync failed:', error.message);
    process.exit(1);
  }
}

// Run the script
if (require.main === module) {
  main();
}

module.exports = { main, fetchPexelsCollection, formatPhotoForDatabase };
