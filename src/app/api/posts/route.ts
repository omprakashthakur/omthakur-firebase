import { NextResponse } from 'next/server';
import { blogPosts } from '@/lib/data';
import type { BlogPost } from '@/lib/data';

// GET all blog posts
export async function GET() {
  return NextResponse.json(blogPosts);
}

// POST a new blog post
export async function POST(request: Request) {
  try {
    const post: BlogPost = await request.json();
    
    // Basic validation
    if (!post.title || !post.content || !post.slug) {
        return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    // Check if slug already exists
    if (blogPosts.find(p => p.slug === post.slug)) {
        return NextResponse.json({ message: 'Slug already exists' }, { status: 409 });
    }

    blogPosts.unshift(post); // Add to the beginning of the array
    return NextResponse.json(post, { status: 201 });

  } catch (error) {
    return NextResponse.json({ message: 'Error creating post', error }, { status: 500 });
  }
}
