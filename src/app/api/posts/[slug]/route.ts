import { NextResponse } from 'next/server';
import { blogPosts } from '@/lib/data';
import type { BlogPost } from '@/lib/data';

// GET a single blog post by slug
export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  const post = blogPosts.find(p => p.slug === params.slug);
  if (post) {
    return NextResponse.json(post);
  }
  return NextResponse.json({ message: 'Post not found' }, { status: 404 });
}

// PUT (update) a blog post by slug
export async function PUT(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const updatedPostData: Partial<Omit<BlogPost, 'slug'>> = await request.json();
    const postIndex = blogPosts.findIndex(p => p.slug === params.slug);

    if (postIndex === -1) {
      return NextResponse.json({ message: 'Post not found' }, { status: 404 });
    }

    // Merge new data with existing data
    const updatedPost = { 
      ...blogPosts[postIndex], 
      ...updatedPostData,
      // Ensure tags are always an array
      tags: Array.isArray(updatedPostData.tags) ? updatedPostData.tags : blogPosts[postIndex].tags,
    };
    blogPosts[postIndex] = updatedPost;

    return NextResponse.json(updatedPost);
  } catch (error) {
    let errorMessage = 'Error updating post';
    if (error instanceof Error) {
        errorMessage = error.message;
    }
    return NextResponse.json({ message: errorMessage }, { status: 500 });
  }
}

// DELETE a blog post by slug
export async function DELETE(
  request: Request,
  { params }: { params: { slug: string } }
) {
  const postIndex = blogPosts.findIndex(p => p.slug === params.slug);

  if (postIndex === -1) {
    return NextResponse.json({ message: 'Post not found' }, { status: 404 });
  }

  const deletedPost = blogPosts.splice(postIndex, 1);

  return NextResponse.json({ message: 'Post deleted successfully', post: deletedPost[0] });
}
