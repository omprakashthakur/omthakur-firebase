#!/usr/bin/env node

/**
 * Script to add sample photography data to the database for testing
 */

require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function addSamplePhotos() {
  try {
    console.log('📸 Adding sample photography data...');

    const samplePhotos = [
      {
        src: '/placeholder-image.jpg',
        alt: 'Mountain landscape photography - Beautiful mountain scenery during golden hour',
        downloadUrl: '/placeholder-image.jpg'
      },
      {
        src: '/placeholder-image.jpg',
        alt: 'Urban architecture photography - Modern architecture in the city',
        downloadUrl: '/placeholder-image.jpg'
      },
      {
        src: '/placeholder-image.jpg',
        alt: 'Portrait photography - Professional portrait session',
        downloadUrl: '/placeholder-image.jpg'
      }
    ];

    // Check if photography table exists and has any data
    const { data: existingData, error: fetchError } = await supabase
      .from('photography')
      .select('id')
      .limit(1);

    if (fetchError) {
      console.log('⚠️  Photography table might not exist. Creating sample data anyway...');
    }

    if (existingData && existingData.length > 0) {
      console.log('📷 Photography data already exists. Skipping sample data creation.');
      return;
    }

    // Insert sample photos
    const { data, error } = await supabase
      .from('photography')
      .insert(samplePhotos)
      .select();

    if (error) {
      console.error('❌ Error inserting sample photos:', error);
      console.log('💡 You may need to create the photography table first in Supabase');
    } else {
      console.log('✅ Sample photography data added successfully!');
      console.log(`📊 Added ${data.length} sample photos`);
    }

  } catch (error) {
    console.error('💥 Script failed:', error);
  }
}

// Run the script
addSamplePhotos()
  .then(() => {
    console.log('✨ Photography setup completed!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Setup failed:', error);
    process.exit(1);
  });
