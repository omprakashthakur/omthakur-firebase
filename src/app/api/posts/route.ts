
import { NextResponse } from 'next/server';
import { getPosts, createPost } from '@/lib/supabaseClient';

export async function GET() {
  try {
    const posts = await getPosts();
    return NextResponse.json(posts);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ message: 'Error fetching posts', error: errorMessage }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const postData = await request.json();
    const newPost = await createPost(postData);
    return NextResponse.json(newPost, { status: 201 });
  } catch (error) {
     const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ message: 'Error creating post', error: errorMessage }, { status: 500 });
  }
}
