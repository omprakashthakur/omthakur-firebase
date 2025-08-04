"use client";

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import PostForm from '@/components/post-form';
import type { BlogPost } from '@/lib/data';

export default function EditPostPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (slug) {
      fetch(`/api/posts/${slug}`)
        .then(res => res.json())
        .then(data => {
          setPost(data);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  }, [slug]);

  if (loading) {
    return <div>Loading...</div>;
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
