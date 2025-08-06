import { NextResponse } from 'next/server';
import { fetchYouTubeVideos, categorizeYouTubeVideo } from '@/lib/youtubeClient';

/**
 * GET /api/youtube/videos
 * Fetches latest videos from YouTube channel (for testing purposes)
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const maxResults = parseInt(searchParams.get('maxResults') || '5');

    // Check if YouTube API credentials are configured
    if (!process.env.YOUTUBE_API_KEY || !process.env.YOUTUBE_CHANNEL_ID) {
      return NextResponse.json({
        error: 'YouTube API credentials not configured',
        message: 'Please set YOUTUBE_API_KEY and YOUTUBE_CHANNEL_ID environment variables'
      }, { status: 400 });
    }

    // Fetch videos from YouTube
    const videos = await fetchYouTubeVideos(maxResults);
    
    // Add suggested categories
    const videosWithCategories = videos.map(video => ({
      ...video,
      suggestedCategory: categorizeYouTubeVideo(video)
    }));

    return NextResponse.json({
      success: true,
      count: videos.length,
      videos: videosWithCategories
    });

  } catch (error) {
    console.error('Error fetching YouTube videos:', error);
    return NextResponse.json({
      error: 'Failed to fetch YouTube videos',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
