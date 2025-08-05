
import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import type { BlogPost, Vlog, Photography } from '@/lib/data';

// This is the public client, safe for client-side fetching
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

let supabase: SupabaseClient | null = null;
if (supabaseUrl && supabaseAnonKey) {
  supabase = createClient(supabaseUrl, supabaseAnonKey);
} else {
  console.warn('Supabase public credentials are not set. Client-side fetching will be disabled.');
}

// Helper functions for PUBLIC data fetching (used by pages)

export const getPosts = async (): Promise<BlogPost[]> => {
    if (!supabase) return [];
    const { data, error } = await supabase.from('posts').select('*').order('date', { ascending: false });
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

// Admin functions for server-side CUD operations
// This uses the service role key for elevated privileges.
// It should ONLY be used in server-side code (API routes).

let supabaseAdmin: SupabaseClient | null = null;
if (process.env.SUPABASE_SERVICE_ROLE_KEY) {
    supabaseAdmin = createClient(supabaseUrl, process.env.SUPABASE_SERVICE_ROLE_KEY, {
        auth: {
            autoRefreshToken: false,
            persistSession: false
        }
    });
} else {
    console.warn('Supabase service role key is not set. Admin operations will fail.');
}

export const createPost = async (postData: Partial<BlogPost>): Promise<BlogPost> => {
    if (!supabaseAdmin) throw new Error('Admin client not initialized.');
    const { data, error } = await supabaseAdmin.from('posts').insert(postData).select().single();
    if (error) throw error;
    return data;
};

export const updatePost = async (slug: string, postData: Partial<BlogPost>): Promise<BlogPost | null> => {
    if (!supabaseAdmin) throw new Error('Admin client not initialized.');
    const { data, error } = await supabaseAdmin.from('posts').update(postData).eq('slug', slug).select().single();
    if (error) throw error;
    return data;
};

export const deletePost = async (slug: string): Promise<boolean> => {
    if (!supabaseAdmin) throw new Error('Admin client not initialized.');
    const { error } = await supabaseAdmin.from('posts').delete().eq('slug', slug);
    if (error) throw error;
    return true;
};

// You can add similar create, update, delete functions for Vlogs and