#!/usr/bin/env node

/**
 * Script to update existing YouTube videos to properly categorize them as YouTube vs YT Shorts
 * This will analyze video titles, descriptions, and update the platform and video_type fields
 */

require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials');
  console.error('NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl ? '✅' : '❌');
  console.error('SUPABASE_KEY:', supabaseKey ? '✅' : '❌');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

/**
 * Determine if a video is a Short based on title and description
 */
function isYouTubeShort(title, description = '') {
  const content = `${title} ${description}`.toLowerCase();
  const shortsKeywords = ['#shorts', '#short', 'shorts', '#reel', '#reels'];
  
  return shortsKeywords.some(keyword => content.includes(keyword));
}

/**
 * Update video types and platforms in the database
 */
async function updateVideoTypes() {
  try {
    console.log('🔍 Fetching all YouTube videos...');
    
    // Fetch all YouTube videos
    const { data: vlogs, error: fetchError } = await supabase
      .from('vlogs')
      .select('*')
      .eq('platform', 'YouTube');
    
    if (fetchError) {
      throw fetchError;
    }
    
    if (!vlogs || vlogs.length === 0) {
      console.log('📭 No YouTube videos found.');
      return;
    }
    
    console.log(`📊 Found ${vlogs.length} YouTube videos to analyze...`);
    
    let updatedCount = 0;
    let shortsCount = 0;
    let longVideosCount = 0;
    
    // Process each video
    for (const vlog of vlogs) {
      const isShort = isYouTubeShort(vlog.title, vlog.description);
      const newPlatform = isShort ? 'YT Shorts' : 'YouTube';
      const videoType = isShort ? 'short' : 'long';
      
      // Only update if platform needs to change
      if (vlog.platform !== newPlatform || vlog.video_type !== videoType) {
        const { error: updateError } = await supabase
          .from('vlogs')
          .update({ 
            platform: newPlatform,
            video_type: videoType
          })
          .eq('id', vlog.id);
        
        if (updateError) {
          console.error(`❌ Error updating video ${vlog.id}:`, updateError);
        } else {
          console.log(`✅ Updated "${vlog.title.substring(0, 50)}..." → ${newPlatform}`);
          updatedCount++;
        }
      }
      
      if (isShort) {
        shortsCount++;
      } else {
        longVideosCount++;
      }
    }
    
    console.log('\n📈 Update Summary:');
    console.log(`🔄 Videos updated: ${updatedCount}`);
    console.log(`📱 Total YouTube Shorts: ${shortsCount}`);
    console.log(`🎬 Total YouTube Long Videos: ${longVideosCount}`);
    console.log(`📺 Total Videos: ${vlogs.length}`);
    
  } catch (error) {
    console.error('💥 Error updating video types:', error);
    process.exit(1);
  }
}

// Run the script
updateVideoTypes()
  .then(() => {
    console.log('✨ Video type update completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Script failed:', error);
    process.exit(1);
  });
