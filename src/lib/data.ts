
export interface BlogPost {
  id: string; // Firestore document ID
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  image: string;
  category: 'Tech' | 'Current Affairs' | 'Personal';
  tags: string[];
  author: string;
  date: string;
}

export interface Vlog {
  id: string | number; // ID can be string (Firestore) or number (Supabase)
  title: string;
  description?: string;
  thumbnail: string;
  platform: 'YouTube' | 'YT Shorts' | 'Instagram Reels' | 'TikTok';
  url: string;
  category: 'Travel' | 'Tech' | 'Daily' | 'Food' | 'Education' | 'Entertainment';
  video_type?: 'long' | 'short'; // New field for video length type
  featured?: boolean; // New field for featured videos
  created_at?: string; // Optional for backwards compatibility
  // YouTube-specific fields
  youtube_video_id?: string;
  duration?: string; // ISO 8601 duration format (PT4M13S)
  view_count?: number;
  tags?: string; // Comma-separated tags
}

export interface Photography {
  id: string | number; // Firestore ID, Supabase ID, or "pexels-{id}"
  src: string;
  alt: string;
  title?: string;
  description?: string;
  downloadUrl?: string;
  category?: string;
  tags?: string[];
  created_at?: string;
  source?: 'personal' | 'pexels' | string; // Source of the photo
  // Fields for Pexels photos
  photographerName?: string;
  photographerUrl?: string;
  originalUrl?: string; // Link to original photo on Pexels
  width?: number;
  height?: number;
  // Next.js Image component optimizations
  blurDataURL?: string; // Base64 data URL for the blur placeholder
  placeholder?: 'blur' | 'empty'; // Type of placeholder to use
}

export const categories = ['Tech', 'Current Affairs', 'Personal'];
export const vlogCategories = [
  'All',
  'Travel', 
  'Food', 
  'Tech', 
  'Daily',
  'Education',
  'Entertainment'
] as const;
export const vlogPlatforms: Vlog['platform'][] = ['YouTube', 'YT Shorts', 'Instagram Reels', 'TikTok'];

// Mock data is no longer the source of truth, but can be useful for examples or fallbacks.
// Keeping tag list for now for filter UI.
export const allTags = [
    'React', 
    'JavaScript', 
    'Web Development',
    'AI', 
    'Technology', 
    'Future',
    'Travel', 
    'Adventure', 
    'Himalayas',
    'Next.js'
];
