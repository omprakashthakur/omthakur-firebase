
import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import type { BlogPost, Vlog, Photography } from '@/lib/data';

// IMPORTANT: These are placeholder values.
// You need to create a Supabase project and replace them with your actual keys.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'YOUR_SUPABASE_URL';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'YOUR_SUPABASE_ANON_KEY';

let supabase: SupabaseClient | null = null;

if (supabaseUrl !== 'YOUR_SUPABASE_URL' && supabaseAnonKey !== 'YOUR_SUPABASE_ANON_KEY') {
  supabase = createClient(supabaseUrl, supabaseAnonKey);
} else {
  console.warn('Supabase credentials are not set. Please update your environment variables. App will run with empty data.');
}


// Helper functions to fetch data

export const getPosts = async (): Promise<BlogPost[]> => {
    if (!supabase) return [];
    const { data, error } = await supabase.from('posts').select('*');
    if (error) {
        console.error('Error fetching posts:', error);
        return [];
    }
    return data as BlogPost[];
};

export const getPost = async (slug: string): Promise<BlogPost | null> => {
    if (!supabase) return null;
    const { data, error } = await supabase.from('posts').select('*').eq('slug', slug).single();
    if (error) {
        console.error(`Error fetching post with slug ${slug}:`, error);
        return null;
    }
    return data as BlogPost;
}

export const getVlogs = async (): Promise<Vlog[]> => {
    if (!supabase) return [];
    const { data, error } = await supabase.from('vlogs').select('*');
    if (error) {
        console.error('Error fetching vlogs:', error);
        return [];
    }
    return data as Vlog[];
}

export const getPhotos = async (): Promise<Photography[]> => {
    if (!supabase) return [];
    const { data, error } = await supabase.from('photography').select('*');
    if (error) {
        console.error('Error fetching photos:', error);
        return [];
    }
    return data as Photography[];
}
