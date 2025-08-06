/**
 * YouTube Thumbnail Utility
 * 
 * This utility helps generate proper YouTube thumbnail URLs from YouTube video URLs
 * or video IDs. It's used throughout the application to ensure consistent and
 * working YouTube thumbnails.
 */

/**
 * Extract YouTube video ID from various YouTube URL formats
 */
export function extractYouTubeVideoId(url: string): string | null {
  if (!url) return null;
  
  // Handle various YouTube URL formats
  const patterns = [
    /(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?v=([^&]+)/i,  // Standard watch URL
    /(?:https?:\/\/)?(?:www\.)?youtube\.com\/embed\/([^?]+)/i,    // Embed URL
    /(?:https?:\/\/)?(?:www\.)?youtu\.be\/([^?]+)/i,              // Shortened URL
    /(?:https?:\/\/)?(?:www\.)?youtube\.com\/v\/([^?]+)/i,        // Old embed URL
    /(?:https?:\/\/)?(?:www\.)?youtube\.com\/user\/[^\/]+\/([^?]+)/i // User URL
  ];
  
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match && match[1]) {
      return match[1];
    }
  }
  
  // If it looks like just a video ID already, return it
  if (/^[a-zA-Z0-9_-]{11}$/.test(url)) {
    return url;
  }
  
  return null;
}

/**
 * Get the best quality thumbnail URL for a YouTube video
 * @param videoIdOrUrl The YouTube video ID or URL
 * @param quality The desired quality (maxresdefault, hqdefault, mqdefault, default)
 * @returns The URL to the YouTube thumbnail
 */
export function getYouTubeThumbnail(
  videoIdOrUrl: string,
  quality: 'maxresdefault' | 'hqdefault' | 'mqdefault' | 'default' = 'maxresdefault'
): string {
  // First try to extract a video ID if a URL was provided
  const videoId = extractYouTubeVideoId(videoIdOrUrl);
  
  // If we couldn't extract a video ID, return a placeholder
  if (!videoId) {
    return generatePlaceholderImage(800, 450, 'Invalid YouTube URL', '#1a1a1a', '#ff0000');
  }
  
  // Return the appropriate thumbnail URL
  return `https://i.ytimg.com/vi/${videoId}/${quality}.jpg`;
}

/**
 * Get an array of possible YouTube thumbnail URLs for a video
 * This is useful when you want to try multiple qualities
 * @param videoIdOrUrl The YouTube video ID or URL
 * @returns Array of thumbnail URLs in descending quality order
 */
export function getYouTubeThumbnailOptions(videoIdOrUrl: string): string[] {
  const videoId = extractYouTubeVideoId(videoIdOrUrl);
  
  if (!videoId) {
    return [generatePlaceholderImage(800, 450, 'Invalid YouTube URL', '#1a1a1a', '#ff0000')];
  }
  
  return [
    `https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`,
    `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`,
    `https://i.ytimg.com/vi/${videoId}/mqdefault.jpg`,
    `https://i.ytimg.com/vi/${videoId}/default.jpg`
  ];
}

import { generatePlaceholderImage } from './utils';
