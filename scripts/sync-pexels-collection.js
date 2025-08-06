#!/usr/bin/env node

/**
 * Script to sync photos from Om Prakash Thakur's Pexels collection to Supabase
 * Collection ID: ofymzs7
 * Collection URL: https://www.pexels.com/collections/my-collection-ofymzs7/
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// Configuration
const PEXELS_API_KEY = process.env.PEXELS_API_KEY;
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const COLLECTION_ID = 'ofymzs7'; // Your collection ID

// Initialize Supabase client
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function fetchPexelsCollection(collectionId, perPage = 40, page = 1) {
  try {
    console.log(`🔍 Fetching photos from Pexels collection: ${collectionId}`);
    
    const response = await fetch(
      `https://api.pexels.com/v1/collections/${collectionId}?per_page=${perPage}&page=${page}`,
      {
        headers: {
          'Authorization': PEXELS_API_KEY
        }
      }
    );

    if (!response.ok) {
      throw new Error(`Pexels API error: ${response.status} - ${response.statusText}`);
    }

    const data = await response.json();
    console.log(`✅ Found ${data.media?.length || 0} photos in collection`);
    
    return data.media || [];
  } catch (error) {
    console.error('❌ Error fetching from Pexels:', error);
    return [];
  }
}

function formatPhotoForDatabase(photo, index) {
  return {
    id: `pexels-${photo.id}`,
    title: photo.alt || `Photography by ${photo.photographer} - ${index + 1}`,
    description: `${photo.alt || 'Professional photography'} by ${photo.photographer}. From Om Prakash Thakur's curated Pexels collection.`,
    src: photo.src.large2x || photo.src.large || photo.src.medium,
    alt: photo.alt || `Photography by ${photo.photographer}`,
    category: 'pexels-collection',
    tags: ['pexels', 'om-prakash-thakur', 'professional', 'curated', photo.photographer?.toLowerCase().replace(/\s+/g, '-')].filter(Boolean),
    photographer_name: photo.photographer,
    photographer_url: photo.photographer_url,
    width: photo.width,
    height: photo.height,
    original_url: photo.url,
    download_url: photo.src.original || photo.src.large2x,
    pexels_id: photo.id,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
}

async function syncPhotosToSupabase(photos) {
  try {
    console.log(`📝 Preparing to sync ${photos.length} photos to Supabase...`);

    // Format photos for database
    const formattedPhotos = photos.map((photo, index) => formatPhotoForDatabase(photo, index));

    // Clear existing Pexels collection photos
    console.log('🧹 Clearing existing Pexels collection photos...');
    const { error: deleteError } = await supabase
      .from('photography')
      .delete()
      .eq('category', 'pexels-collection');

    if (deleteError) {
      console.warn('⚠️ Warning: Could not clear existing photos:', deleteError.message);
    } else {
      console.log('✅ Existing Pexels photos cleared');
    }

    // Insert new photos in batches to avoid overwhelming the database
    const batchSize = 10;
    let successCount = 0;
    let errorCount = 0;

    for (let i = 0; i < formattedPhotos.length; i += batchSize) {
      const batch = formattedPhotos.slice(i, i + batchSize);
      
      console.log(`📤 Uploading batch ${Math.floor(i/batchSize) + 1}/${Math.ceil(formattedPhotos.length/batchSize)} (${batch.length} photos)...`);
      
      const { data, error } = await supabase
        .from('photography')
        .insert(batch)
        .select();

      if (error) {
        console.error(`❌ Error inserting batch ${Math.floor(i/batchSize) + 1}:`, error.message);
        errorCount += batch.length;
      } else {
        console.log(`✅ Successfully inserted ${data.length} photos`);
        successCount += data.length;
      }

      // Small delay between batches to be nice to the database
      if (i + batchSize < formattedPhotos.length) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }

    console.log('\n📊 Sync Summary:');
    console.log(`✅ Successfully synced: ${successCount} photos`);
    console.log(`❌ Failed to sync: ${errorCount} photos`);
    console.log(`📁 Total processed: ${formattedPhotos.length} photos`);

    return { successCount, errorCount, total: formattedPhotos.length };

  } catch (error) {
    console.error('❌ Error syncing photos to Supabase:', error);
    throw error;
  }
}

async function verifySync() {
  try {
    console.log('\n🔍 Verifying sync...');
    
    const { data, error } = await supabase
      .from('photography')
      .select('id, title, category')
      .eq('category', 'pexels-collection');

    if (error) {
      console.error('❌ Error verifying sync:', error);
      return;
    }

    console.log(`✅ Found ${data.length} photos in database with category 'pexels-collection'`);
    
    if (data.length > 0) {
      console.log('📝 Sample photos:');
      data.slice(0, 3).forEach((photo, index) => {
        console.log(`  ${index + 1}. ${photo.title} (ID: ${photo.id})`);
      });
    }

  } catch (error) {
    console.error('❌ Error during verification:', error);
  }
}

async function main() {
  console.log('🚀 Starting Pexels Collection Sync');
  console.log('=====================================');
  
  // Validate environment variables
  if (!PEXELS_API_KEY) {
    console.error('❌ PEXELS_API_KEY not found in environment variables');
    process.exit(1);
  }
  
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    console.error('❌ Supabase credentials not found in environment variables');
    process.exit(1);
  }

  console.log(`🎯 Collection ID: ${COLLECTION_ID}`);
  console.log(`🔗 Collection URL: https://www.pexels.com/collections/my-collection-${COLLECTION_ID}/`);
  console.log('');

  try {
    // Fetch photos from your Pexels collection
    const photos = await fetchPexelsCollection(COLLECTION_ID);

    if (photos.length === 0) {
      console.log('⚠️ No photos found in your collection. Please check:');
      console.log('   1. Collection ID is correct');
      console.log('   2. Collection is public');
      console.log('   3. Pexels API key is valid');
      return;
    }

    // Sync to Supabase
    const result = await syncPhotosToSupabase(photos);

    // Verify the sync
    await verifySync();

    console.log('\n🎉 Sync completed successfully!');
    console.log('You can now visit your photography page to see the photos.');

  } catch (error) {
    console.error('💥 Sync failed:', error.message);
    process.exit(1);
  }
}

// Run the script
if (require.main === module) {
  main();
}

module.exports = { main, fetchPexelsCollection, syncPhotosToSupabase };
