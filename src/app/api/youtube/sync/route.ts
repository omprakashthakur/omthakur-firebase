import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';
import { 
  fetchYouTubeVideos, 
  convertYouTubeVideoToVlog, 
  categorizeYouTubeVideo,
  isVideoAlreadyExists,
  type YouTubeVideo 
} from '@/lib/youtubeClient';
import type { Vlog } from '@/lib/data';

/**
 * GET /api/youtube/sync
 * Fetches latest videos from YouTube channel and syncs them to the database
 * 
 * Query parameters:
 * - maxResults: Number of videos to fetch (default: 10)
 * - publishedAfter: ISO date string to fetch videos published after this date
 * - forceSync: If true, re-sync videos even if they already exist
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const maxResults = parseInt(searchParams.get('maxResults') || '10');
    const publishedAfter = searchParams.get('publishedAfter') || undefined;
    const forceSync = searchParams.get('forceSync') === 'true';

    // Check if YouTube API credentials are configured
    if (!process.env.YOUTUBE_API_KEY || !process.env.YOUTUBE_CHANNEL_ID) {
      return NextResponse.json({
        success: false,
        message: 'YouTube API credentials not configured',
        syncedVideos: 0,
        totalFetched: 0
      }, { status: 400 });
    }

    // Fetch existing vlogs from database to check for duplicates
    const { data: existingVlogs } = await supabase
      .from('vlogs')
      .select('*');

    const existingVlogsArray: Vlog[] = existingVlogs || [];

    // Fetch latest videos from YouTube
    const youtubeVideos: YouTubeVideo[] = await fetchYouTubeVideos(maxResults, publishedAfter);

    if (youtubeVideos.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'No new videos found',
        syncedVideos: 0,
        totalFetched: 0
      });
    }

    // Filter out videos that already exist (unless forceSync is true)
    const videosToSync = forceSync 
      ? youtubeVideos 
      : youtubeVideos.filter(video => !isVideoAlreadyExists(video.id, existingVlogsArray));

    if (videosToSync.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'All videos are already synced',
        syncedVideos: 0,
        totalFetched: youtubeVideos.length
      });
    }

    // Convert YouTube videos to vlog format and insert into database
    const vlogsToInsert = videosToSync.map(video => {
      const category = categorizeYouTubeVideo(video);
      
      // Only use fields that exist in the current schema
      const vlogData = {
        title: video.title,
        platform: 'YouTube' as const,
        category: category === 'Tech' ? 'Tech Talks' : 
                  category === 'Travel' ? 'Travel' : 'Daily Life',
        thumbnail: video.thumbnailUrl,
        url: video.url,
      };

      return vlogData;
    });

    // Insert vlogs into database
    const { data: insertedVlogs, error: insertError } = await supabase
      .from('vlogs')
      .insert(vlogsToInsert)
      .select();

    if (insertError) {
      console.error('Error inserting vlogs:', insertError);
      return NextResponse.json({
        success: false,
        message: 'Failed to sync videos to database',
        error: insertError.message,
        syncedVideos: 0,
        totalFetched: youtubeVideos.length
      }, { status: 500 });
    }

    // Return success response with sync details
    return NextResponse.json({
      success: true,
      message: `Successfully synced ${vlogsToInsert.length} new videos`,
      syncedVideos: vlogsToInsert.length,
      totalFetched: youtubeVideos.length,
      videos: insertedVlogs?.map((vlog: any) => ({
        id: vlog.id,
        title: vlog.title,
        category: vlog.category,
        url: vlog.url,
        created_at: vlog.created_at
      }))
    });

  } catch (error) {
    console.error('Error in YouTube sync API:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    
    return NextResponse.json({
      success: false,
      message: 'Failed to sync YouTube videos',
      error: errorMessage,
      syncedVideos: 0,
      totalFetched: 0
    }, { status: 500 });
  }
}

/**
 * POST /api/youtube/sync
 * Manual sync with specific parameters
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { 
      maxResults = 10, 
      publishedAfter, 
      forceSync = false,
      category 
    } = body;

    // Similar logic to GET but with custom parameters
    if (!process.env.YOUTUBE_API_KEY || !process.env.YOUTUBE_CHANNEL_ID) {
      return NextResponse.json({
        success: false,
        message: 'YouTube API credentials not configured'
      }, { status: 400 });
    }

    const { data: existingVlogs } = await supabase
      .from('vlogs')
      .select('*');

    const existingVlogsArray: Vlog[] = existingVlogs || [];
    const youtubeVideos: YouTubeVideo[] = await fetchYouTubeVideos(maxResults, publishedAfter);

    const videosToSync = forceSync 
      ? youtubeVideos 
      : youtubeVideos.filter(video => !isVideoAlreadyExists(video.id, existingVlogsArray));

    if (videosToSync.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'No new videos to sync',
        syncedVideos: 0
      });
    }

    const vlogsToInsert = videosToSync.map(video => {
      const videoCategory = category || categorizeYouTubeVideo(video);
      
      // Only use fields that exist in the current schema
      return {
        title: video.title,
        platform: 'YouTube' as const,
        category: videoCategory === 'Tech' ? 'Tech Talks' : 
                  videoCategory === 'Travel' ? 'Travel' : 'Daily Life',
        thumbnail: video.thumbnailUrl,
        url: video.url,
      };
    });

    const { data: insertedVlogs, error: insertError } = await supabase
      .from('vlogs')
      .insert(vlogsToInsert)
      .select();

    if (insertError) {
      throw new Error(insertError.message);
    }

    return NextResponse.json({
      success: true,
      message: `Successfully synced ${vlogsToInsert.length} videos`,
      syncedVideos: vlogsToInsert.length,
      videos: insertedVlogs
    });

  } catch (error) {
    console.error('Error in manual YouTube sync:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to sync YouTube videos',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
