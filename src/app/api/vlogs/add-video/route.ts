import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

export async function POST(request: Request) {
  try {
    const { videoUrl } = await request.json();
    
    if (!videoUrl) {
      return NextResponse.json({ 
        success: false, 
        message: 'Video URL is required' 
      });
    }

    // Extract video ID from URL
    const videoIdMatch = videoUrl.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/);
    const videoId = videoIdMatch ? videoIdMatch[1] : null;

    if (!videoId) {
      return NextResponse.json({ 
        success: false, 
        message: 'Invalid YouTube URL' 
      });
    }

    // Manual video data for the specific video (matching existing schema)
    const videoData = {
      title: "Specific Video from Om Thakur",
      platform: "YouTube",
      category: "Daily",
      thumbnail: `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`,
      url: videoUrl
    };

    // Insert into database
    const { data, error } = await supabase
      .from('vlogs')
      .insert([videoData])
      .select();

    if (error) {
      console.error('Error inserting video:', error);
      return NextResponse.json({ 
        success: false, 
        message: 'Failed to add video to database',
        error: error.message 
      });
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Video added successfully',
      video: data[0]
    });

  } catch (error) {
    console.error('Error adding video:', error);
    return NextResponse.json({ 
      success: false, 
      message: 'Failed to add video',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
