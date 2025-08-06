
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
  thumbnail: string;
  platform: 'YouTube' | 'Instagram' | 'TikTok';
  url: string;
  category: 'Travel' | 'Tech Talks' | 'Daily Life';
  created_at?: string; // Optional for backwards compatibility
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
}

export const categories = ['Tech', 'Current Affairs', 'Personal'];
export const vlogCategories: Vlog['category'][] = ['Travel', 'Tech Talks', 'Daily Life'];
export const vlogPlatforms: Vlog['platform'][] = ['YouTube', 'Instagram', 'TikTok'];

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
