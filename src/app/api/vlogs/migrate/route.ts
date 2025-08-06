import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

export async function POST() {
  try {
    // Step 1: Check current schema and add column if needed
    console.log('🔧 Checking database schema...');
    
    // Try to fetch a record to see if video_type column exists
    const { data: testData, error: testError } = await supabase
      .from('vlogs')
      .select('id, platform, title, video_type')
      .limit(1);

    let columnExists = !testError || !testError.message?.includes('video_type does not exist');
    
    if (!columnExists) {
      console.log('📝 Adding video_type column via SQL...');
      
      // Use raw SQL to add the column
      const { error: sqlError } = await supabase
        .rpc('exec_sql', {
          sql: 'ALTER TABLE vlogs ADD COLUMN video_type VARCHAR(10) DEFAULT \'long\';'
        });
        
      if (sqlError && !sqlError.message?.includes('already exists')) {
        console.error('Failed to add column:', sqlError);
        return NextResponse.json({ 
          success: false, 
          message: 'Failed to add video_type column',
          error: sqlError 
        });
      }
      
      // Wait a moment for schema to update
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    // Step 2: Get all YouTube videos
    const { data: vlogs, error: fetchError } = await supabase
      .from('vlogs')
      .select('id, title, platform')
      .eq('platform', 'YouTube');

    if (fetchError) {
      return NextResponse.json({ 
        success: false, 
        message: 'Failed to fetch videos',
        error: fetchError 
      });
    }

    if (!vlogs || vlogs.length === 0) {
      return NextResponse.json({ 
        success: true, 
        message: 'No YouTube videos found to update',
        updated: 0
      });
    }

    let shortsUpdated = 0;
    let longUpdated = 0;

    // Step 3: Process each video individually
    for (const vlog of vlogs) {
      const title = vlog.title.toLowerCase();
      const isShort = title.includes('#shorts') || 
                     title.includes('#short') || 
                     title.includes('shorts') || 
                     title.includes('#reel') || 
                     title.includes('#reels');

      const updates = {
        video_type: isShort ? 'short' : 'long',
        platform: isShort ? 'YT Shorts' : 'YouTube'
      };

      const { error: updateError } = await supabase
        .from('vlogs')
        .update(updates)
        .eq('id', vlog.id);

      if (updateError) {
        console.error(`Failed to update video ${vlog.id}:`, updateError);
      } else {
        if (isShort) {
          shortsUpdated++;
        } else {
          longUpdated++;
        }
      }
    }

    // Step 4: Get final counts
    const { data: finalData, error: countError } = await supabase
      .from('vlogs')
      .select('platform, video_type');

    let counts: { [key: string]: number } = {};
    if (!countError && finalData) {
      finalData.forEach((row: any) => {
        const key = `${row.platform}${row.video_type ? `-${row.video_type}` : ''}`;
        counts[key] = (counts[key] || 0) + 1;
      });
    }

    return NextResponse.json({
      success: true,
      message: 'Database migration completed successfully',
      updated: {
        shorts: shortsUpdated,
        long: longUpdated,
        total: shortsUpdated + longUpdated
      },
      finalCounts: counts
    });

  } catch (error) {
    console.error('Migration error:', error);
    return NextResponse.json({
      success: false,
      message: 'Migration failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
