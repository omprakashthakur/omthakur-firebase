/**
 * YouTube Data API Client
 * 
 * This utility provides functions to interact with the YouTube Data API v3
 * to automatically fetch videos from a specified YouTube channel.
 */

import { google } from 'googleapis';
import type { Vlog } from './data';

const youtube = google.youtube('v3');

export interface YouTubeVideo {
  id: string;
  title: string;
  description: string;
  publishedAt: string;
  thumbnailUrl: string;
  url: string;
  duration?: string;
  viewCount?: string;
  tags?: string[];
}

/**
 * Get the YouTube API key from environment variables
 */
function getYouTubeApiKey(): string {
  const apiKey = process.env.YOUTUBE_API_KEY;
  if (!apiKey) {
    throw new Error('YOUTUBE_API_KEY environment variable is not set');
  }
  return apiKey;
}

/**
 * Get the YouTube Channel ID from environment variables
 */
function getYouTubeChannelId(): string {
  const channelId = process.env.YOUTUBE_CHANNEL_ID;
  if (!channelId) {
    throw new Error('YOUTUBE_CHANNEL_ID environment variable is not set');
  }
  return channelId;
}

/**
 * Fetch the latest videos from a YouTube channel
 * @param maxResults Maximum number of videos to fetch (default: 10)
 * @param publishedAfter ISO string date to fetch videos published after this date
 * @returns Array of YouTube videos
 */
export async function fetchYouTubeVideos(
  maxResults: number = 10,
  publishedAfter?: string
): Promise<YouTubeVideo[]> {
  try {
    const apiKey = getYouTubeApiKey();
    const channelId = getYouTubeChannelId();

    // First, get the channel's uploads playlist ID
    const channelResponse = await youtube.channels.list({
      key: apiKey,
      id: [channelId],
      part: ['contentDetails'],
    });

    const uploadsPlaylistId = channelResponse.data.items?.[0]?.contentDetails?.relatedPlaylists?.uploads;
    
    if (!uploadsPlaylistId) {
      throw new Error('Could not find uploads playlist for the channel');
    }

    // Get the latest videos from the uploads playlist
    const playlistParams: any = {
      key: apiKey,
      playlistId: uploadsPlaylistId,
      part: ['snippet'],
      maxResults,
      order: 'date',
    };

    if (publishedAfter) {
      playlistParams.publishedAfter = publishedAfter;
    }

    const playlistResponse = await youtube.playlistItems.list(playlistParams);
    
    const videos: YouTubeVideo[] = [];
    
    if (playlistResponse.data.items) {
      for (const item of playlistResponse.data.items) {
        const snippet = item.snippet;
        if (!snippet || !snippet.resourceId?.videoId) continue;

        const video: YouTubeVideo = {
          id: snippet.resourceId.videoId,
          title: snippet.title || 'Untitled Video',
          description: snippet.description || '',
          publishedAt: snippet.publishedAt || new Date().toISOString(),
          thumbnailUrl: snippet.thumbnails?.maxresdefault?.url || 
                       snippet.thumbnails?.high?.url || 
                       snippet.thumbnails?.medium?.url || 
                       snippet.thumbnails?.default?.url || '',
          url: `https://www.youtube.com/watch?v=${snippet.resourceId.videoId}`,
          tags: snippet.tags || [],
        };

        videos.push(video);
      }

      // Optionally fetch additional details like duration and view count
      if (videos.length > 0) {
        const videoIds = videos.map(v => v.id);
        const videoDetailsResponse = await youtube.videos.list({
          key: apiKey,
          id: videoIds,
          part: ['contentDetails', 'statistics'],
        });

        if (videoDetailsResponse.data.items) {
          videoDetailsResponse.data.items.forEach((details, index) => {
            if (videos[index] && details.contentDetails?.duration) {
              videos[index].duration = details.contentDetails.duration;
            }
            if (videos[index] && details.statistics?.viewCount) {
              videos[index].viewCount = details.statistics.viewCount;
            }
          });
        }
      }
    }

    return videos;
  } catch (error) {
    console.error('Error fetching YouTube videos:', error);
    throw error;
  }
}

/**
 * Convert YouTube video data to Vlog format for database storage
 * @param youTubeVideo YouTube video data
 * @param category Category to assign to the vlog (default: 'Lifestyle')
 * @returns Vlog object ready for database insertion
 */
export function convertYouTubeVideoToVlog(
  youTubeVideo: YouTubeVideo,
  category: string = 'Lifestyle'
): Omit<Vlog, 'id'> {
  // Map new categories to existing ones for compatibility
  const categoryMapping: { [key: string]: string } = {
    'Tech': 'Tech',
    'Travel': 'Travel',
    'Food': 'Lifestyle',
    'Lifestyle': 'Lifestyle',
    'Education': 'Tech', // Map to closest existing category
    'Entertainment': 'Lifestyle'
  };

  const mappedCategory = categoryMapping[category] || 'Lifestyle';

  return {
    title: youTubeVideo.title,
    description: youTubeVideo.description,
    platform: 'YouTube',
    category: mappedCategory as any,
    thumbnail: youTubeVideo.thumbnailUrl,
    url: youTubeVideo.url,
    created_at: youTubeVideo.publishedAt,
    youtube_video_id: youTubeVideo.id,
    duration: youTubeVideo.duration,
    view_count: youTubeVideo.viewCount ? parseInt(youTubeVideo.viewCount) : undefined,
    tags: youTubeVideo.tags?.join(','),
  };
}

/**
 * Categorize YouTube video based on title and description
 * @param video YouTube video data
 * @returns Suggested category
 */
export function categorizeYouTubeVideo(video: YouTubeVideo): string {
  const title = video.title.toLowerCase();
  const description = video.description.toLowerCase();
  const content = `${title} ${description}`;

  // Define category keywords
  const categoryKeywords = {
    'Tech': ['tech', 'technology', 'coding', 'programming', 'software', 'development', 'tutorial', 'review', 'techlife'],
    'Travel': ['travel', 'trip', 'vacation', 'journey', 'explore', 'adventure', 'destination', 'tourism', 'uttarakhand', 'kathmandu'],
    'Food': ['food', 'cooking', 'recipe', 'restaurant', 'eating', 'cuisine', 'chef', 'kitchen'],
    'Daily': ['daily', 'routine', 'life', 'personal', 'vlog', 'day in the life', 'gym', 'workout', 'fitness', 'motivation', 'gymmotivation', 'exercise', 'bodybuilding', 'training', 'champion', 'beast', 'city', 'lifestyle'],
    'Education': ['education', 'learn', 'tutorial', 'how to', 'guide', 'tips', 'advice', 'explain'],
    'Entertainment': ['entertainment', 'fun', 'funny', 'comedy', 'music', 'movie', 'game', 'review'],
  };

  // Check for category matches
  for (const [category, keywords] of Object.entries(categoryKeywords)) {
    if (keywords.some(keyword => content.includes(keyword))) {
      return category;
    }
  }

  // Default category
  return 'Daily';
}

/**
 * Check if a YouTube video already exists in the database
 * @param videoId YouTube video ID
 * @param existingVlogs Array of existing vlogs to check against
 * @returns True if video already exists
 */
export function isVideoAlreadyExists(videoId: string, existingVlogs: Vlog[]): boolean {
  return existingVlogs.some(vlog => 
    vlog.youtube_video_id === videoId || 
    vlog.url?.includes(videoId)
  );
}
