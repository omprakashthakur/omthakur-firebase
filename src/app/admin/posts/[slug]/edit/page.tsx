
"use client";

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import PostForm from '@/components/post-form';
import type { BlogPost } from '@/lib/data';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Spinner } from '@/components/ui/spinner';


export default function EditPostPage() {
  const params = useParams();
  const id = params.slug as string; // The slug is now the Firestore document ID
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
        const fetchPost = async () => {
            const postDoc = await getDoc(doc(db, 'posts', id));
            if (postDoc.exists()) {
                setPost({ ...postDoc.data(), id: postDoc.id } as BlogPost);
            }
            setLoading(false);
        }
        fetchPost().catch(() => setLoading(false));
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
