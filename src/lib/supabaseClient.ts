
import { createClient } from '@supabase/supabase-js';
import type { BlogPost, Vlog, Photography } from '@/lib/data';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// This is the public client, safe for client-side fetching
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Helper functions for PUBLIC data fetching (used by pages)
export const getPosts = async (): Promise<BlogPost[]> => {
    const { data, error } = await supabase.from('posts').select('*').order('date', { ascending: false });
    if (error) {
        console.error('Error fetching posts:', error);
        return [];
    }
    return data as BlogPost[];
};

export const getPost = async (slug: string): Promise<BlogPost | null> => {
    const { data, error } = await supabase.from('posts').select('*').eq('slug', slug).single();
    if (error) {
        console.error(`Error fetching post with slug ${slug}:`, error);
        return null;
    }
    return data as BlogPost;
}

export const getVlogs = async (): Promise<Vlog[]> => {
    const { data, error } = await supabase.from('vlogs').select('*');
    if (error) {
        console.error('Error fetching vlogs:', error);
        return [];
    }
    return data as Vlog[];
}

export const getPhotos = async (): Promise<Photography[]> => {
    const { data, error } = await supabase.from('photography').select('*');
    if (error) {
        console.error('Error fetching photos:', error);
        return [];
    }
    return data as Photography[];
}


// This is the admin client, for use in server-side API routes ONLY
const getSupabaseAdmin = () => {
    if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
        // This is a fallback for local development if the service key isn't set.
        // It's not secure for production but allows the app to run.
        console.warn('Supabase service role key is not set. Using anon key for admin operations. THIS IS NOT SECURE FOR PRODUCTION.');
        return supabase;
    }
    return createClient(supabaseUrl, process.env.SUPABASE_SERVICE_ROLE_KEY, {
        auth: {
            autoRefreshToken: false,
            persistSession: false
        }
    });
}

// Admin functions for server-side CUD operations
export const createPost = async (postData: Partial<BlogPost>): Promise<BlogPost> => {
    const supabaseAdmin = getSupabaseAdmin();
    const { data, error } = await supabaseAdmin.from('posts').insert(postData).select().single();
    if (error) throw error;
    return data;
};

export const updatePost = async (slug: string, postData: Partial<BlogPost>): Promise<BlogPost | null> => {
    const supabaseAdmin = getSupabaseAdmin();
    const { data, error } = await supabaseAdmin.from('posts').update(postData).eq('slug', slug).select().single();
    if (error) throw error;
    return data;
};

export const deletePost = async (slug: string): Promise<boolean> => {
    const supabaseAdmin = getSupabaseAdmin();
    const { error } = await supabaseAdmin.from('posts').delete().eq('slug', slug);
    if (error) throw error;
    return true;
};
