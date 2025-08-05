
import { NextResponse } from 'next/server';
import { getPosts, createPostAdmin } from '@/lib/supabaseClient';
import type { BlogPost } from '@/lib/data';

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
    const postData: BlogPost = await request.json();
    // Use the admin version of the function for creation
    const newPost = await createPostAdmin(postData);
    return NextResponse.json(newPost, { status: 201 });
  } catch (error) {
     const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ message: 'Error creating post', error: errorMessage }, { status: 500 });
  }
}
