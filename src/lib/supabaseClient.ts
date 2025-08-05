
import { createClient } from '@supabase/supabase-js';
import type { BlogPost, Vlog, Photography } from '@/lib/data';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn("Supabase URL or Anon Key is missing. The app will not connect to Supabase.");
}

// This is the public client, safe for client-side fetching
export const supabase = createClient(supabaseUrl!, supabaseAnonKey!);

// Helper functions for PUBLIC data fetching (used by pages)
export const getPosts = async (): Promise<BlogPost[]> => {
    if (!supabaseUrl || !supabaseAnonKey) return [];
    const { data, error } = await supabase.from('posts').select('*').order('date', { ascending: false });
    if (error) {
        console.error('Error fetching posts:', error);
        return [];
    }
    return data as BlogPost[];
};

export const getPost = async (slug: string): Promise<BlogPost | null> => {
    if (!supabaseUrl || !supabaseAnonKey) return null;
    const { data, error } = await supabase.from('posts').select('*').eq('slug', slug).single();
    if (error) {
        // It's okay if a post is not found, so we don't need to log every "error"
        if (error.code !== 'PGRST116') {
             console.error(`Error fetching post with slug ${slug}:`, error);
        }
        return null;
    }
    return data as BlogPost;
}

export const getVlogs = async (): Promise<Vlog[]> => {
    if (!supabaseUrl || !supabaseAnonKey) return [];
    const { data, error } = await supabase.from('vlogs').select('*');
    if (error) {
        console.error('Error fetching vlogs:', error);
        return [];
    }
    return data as Vlog[];
}

export const getPhotos = async (): Promise<Photography[]> => {
    if (!supabaseUrl || !supabaseAnonKey) return [];
    const { data, error } = await supabase.from('photography').select('*');
    if (error) {
        console.error('Error fetching photos:', error);
        return [];
    }
    return data as Photography[];
}


// This is the admin client, for use in server-side API routes ONLY
// It requires the SERVICE_ROLE_KEY to be set in environment variables
const getSupabaseAdmin = () => {
    if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
        throw new Error('Supabase service role key is not set. Cannot perform admin operations.');
    }
    return createClient(supabaseUrl!, process.env.SUPABASE_SERVICE_ROLE_KEY, {
        auth: {
            autoRefreshToken: false,
            persistSession: false
        }
    });
}

// Admin functions for server-side CUD operations
export const createPostAdmin = async (postData: Partial<BlogPost>): Promise<BlogPost> => {
    const supabaseAdmin = getSupabaseAdmin();
    const { data, error } = await supabaseAdmin.from('posts').insert(postData).select().single();
    if (error) throw error;
    return data;
};

export const updatePostAdmin = async (slug: string, postData: Partial<BlogPost>): Promise<BlogPost | null> => {
    const supabaseAdmin = getSupabaseAdmin();
    const { data, error } = await supabaseAdmin.from('posts').update(postData).eq('slug', slug).select().single();
    if (error) throw error;
    return data;
};

export const deletePostAdmin = async (slug: string): Promise<boolean> => {
    const supabaseAdmin = getSupabaseAdmin();
    const { error } = await supabaseAdmin.from('posts').delete().eq('slug', slug);
    if (error) throw error;
    return true;
};
