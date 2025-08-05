
"use client";

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import PostForm from '@/components/post-form';
import type { BlogPost } from '@/lib/data';
import { Spinner } from '@/components/ui/spinner';
import { supabase } from '@/lib/supabaseClient';


export default function EditPostPage() {
  const params = useParams();
  const id = params.slug as string;
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
        const fetchPost = async () => {
            const { data, error } = await supabase
                .from('posts')
                .select('*')
                .eq('id', id)
                .single();

            if (error) {
                console.error('Error fetching post:', error);
                setLoading(false);
                return;
            }
            
            setPost(data as BlogPost);
            setLoading(false);
        }
        fetchPost();
    }
  }, [id]);

  if (loading) {
    return <div className="flex h-[50vh] w-full items-center justify-center"><Spinner /></div>;
  }
  
  if (!post) {
    return <div>Post not found.</div>;
  }

  return (
    <>
      <header className="mb-12">
        <h1 className="text-5xl font-headline font-bold">Edit Post</h1>
        <p className="text-xl text-muted-foreground">Make changes to your article below.</p>
      </header>
      <PostForm post={post} />
    </>
  );
}
