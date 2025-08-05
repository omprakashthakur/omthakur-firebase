import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

export async function GET(
  request: Request, 
  { params }: { params: { slug: string } }
) {
  try {
    const slug = params.slug;
    
    // Use maybeSingle() to handle cases where the slug doesn't exist
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .eq('slug', slug)
      .maybeSingle();

    if (error) {
      throw new Error(error.message);
    }

    if (!data) {
      return NextResponse.json({ message: 'Post not found' }, { status: 404 });
    }

    return NextResponse.json(data);
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
    const slug = await Promise.resolve(params.slug);
    const body = await request.json();
    const { data, error } = await supabase.from('posts').update(body).eq('id', slug).select();

    if (error) {
      throw new Error(error.message);
    }

    return NextResponse.json(data);
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
    const slug = await Promise.resolve(params.slug);
    const { error } = await supabase.from('posts').delete().eq('id', slug).select();

    if (error) {
      throw new Error(error.message);
    }

    return NextResponse.json({ message: 'Post deleted successfully' });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ message: 'Error deleting post', error: errorMessage }, { status: 500 });
  }
}
