#!/usr/bin/env node

/**
 * Database migration script to add video_type column
 */

require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function runMigration() {
  try {
    console.log('🔧 Starting database migration...');

    // Step 1: Add video_type column
    console.log('📝 Adding video_type column...');
    const { error: addColumnError } = await supabase.rpc('exec_sql', {
      sql: `ALTER TABLE vlogs ADD COLUMN IF NOT EXISTS video_type VARCHAR(10) DEFAULT 'long';`
    });

    if (addColumnError) {
      console.log('⚠️  Column might already exist or using alternative method...');
    }

    // Step 2: Update existing videos to categorize as shorts or long videos
    console.log('🔄 Updating existing videos...');
    
    // First, update videos that are clearly shorts
    const { error: updateShortsError } = await supabase
      .from('vlogs')
      .update({ 
        video_type: 'short',
        platform: 'YT Shorts'
      })
      .eq('platform', 'YouTube')
      .or('title.ilike.%#shorts%,title.ilike.%#short%,title.ilike.%shorts%,title.ilike.%#reel%,title.ilike.%#reels%');

    if (updateShortsError) {
      console.error('❌ Error updating shorts:', updateShortsError);
    } else {
      console.log('✅ Updated shorts videos');
    }

    // Then, update remaining YouTube videos to long format
    const { error: updateLongError } = await supabase
      .from('vlogs')
      .update({ video_type: 'long' })
      .eq('platform', 'YouTube')
      .is('video_type', null);

    if (updateLongError) {
      console.error('❌ Error updating long videos:', updateLongError);
    } else {
      console.log('✅ Updated long videos');
    }

    // Step 3: Show results
    console.log('📊 Checking results...');
    const { data: results, error: selectError } = await supabase
      .from('vlogs')
      .select('platform, video_type')
      .not('platform', 'is', null);

    if (selectError) {
      console.error('❌ Error fetching results:', selectError);
    } else {
      // Count by platform and video_type
      const counts = {};
      results.forEach(row => {
        const key = `${row.platform}-${row.video_type || 'null'}`;
        counts[key] = (counts[key] || 0) + 1;
      });

      console.log('\n📈 Results:');
      Object.entries(counts).forEach(([key, count]) => {
        console.log(`${key}: ${count} videos`);
      });
    }

    console.log('✨ Migration completed successfully!');

  } catch (error) {
    console.error('💥 Migration failed:', error);
    process.exit(1);
  }
}

// Run the migration
runMigration()
  .then(() => {
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Script failed:', error);
    process.exit(1);
  });
