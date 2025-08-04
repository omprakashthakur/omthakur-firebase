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
    const updatedPostData: Partial<BlogPost> = await request.json();
    const postIndex = blogPosts.findIndex(p => p.slug === params.slug);

    if (postIndex === -1) {
      return NextResponse.json({ message: 'Post not found' }, { status: 404 });
    }

    const updatedPost = { ...blogPosts[postIndex], ...updatedPostData };
    blogPosts[postIndex] = updatedPost;

    return NextResponse.json(updatedPost);
  } catch (error) {
    return NextResponse.json({ message: 'Error updating post', error }, { status: 500 });
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
