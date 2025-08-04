"use client";

import PostForm from '@/components/post-form';

export default function NewPostPage() {
  return (
     <>
        <header className="mb-12">
            <h1 className="text-5xl font-headline font-bold">Create New Post</h1>
            <p className="text-xl text-muted-foreground">Fill out the form below to publish a new article.</p>
        </header>
        <PostForm />
    </>
  );
}
