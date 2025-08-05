
import { NextResponse } from 'next/server';
import { getPost, updatePostAdmin, deletePostAdmin } from '@/lib/supabaseClient';


export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const post = await getPost(params.slug);
    if (!post) {
      return NextResponse.json({ message: 'Post not found' }, { status: 404 });
    }
    return NextResponse.json(post);
  } catch (error) {
     const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ message: 'Error fetching post', error: errorMessage }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const updatedData = await request.json();
    const updatedPost = await updatePostAdmin(params.slug, updatedData);
     if (!updatedPost) {
      return NextResponse.json({ message: 'Post not found' }, { status: 404 });
    }
    return NextResponse.json(updatedPost);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ message: 'Error updating post', error: errorMessage }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const success = await deletePostAdmin(params.slug);
    if (!success) {
       return NextResponse.json({ message: 'Post not found or could not be deleted' }, { status: 404 });
    }
    return NextResponse.json({ message: 'Post deleted successfully' });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ message: 'Error deleting post', error: errorMessage }, { status: 500 });
  }
}
