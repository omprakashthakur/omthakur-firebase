import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

export async function GET(
  request: Request, 
  context: { params: { id: string } }
) {
  try {
    // In Next.js 15, we need to be careful with params
    // Get the ID directly from the context without destructuring
    const id = context.params.id;
    
    // Convert string ID to number if needed (Supabase often needs this)
    const numericId = parseInt(id, 10);
    
    // Check if conversion was successful
    if (isNaN(numericId)) {
      return NextResponse.json({ message: 'Invalid ID format' }, { status: 400 });
    }
    
    // Use the numeric ID for the query
    const { data, error } = await supabase
      .from('vlogs')
      .select('*')
      .eq('id', numericId)
      .maybeSingle(); // Use maybeSingle() instead of single() to avoid errors when no row is found

    if (error) {
      throw new Error(error.message);
    }

    if (!data) {
      return NextResponse.json({ message: 'Vlog not found' }, { status: 404 });
    }

    return NextResponse.json(data);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ message: 'Error fetching vlog', error: errorMessage }, { status: 500 });
  }
}

export async function PUT(
  request: Request, 
  { params }: { params: { id: string } }
) {
  try {
    const id = await Promise.resolve(params.id);
    const body = await request.json();
    const { data, error } = await supabase.from('vlogs').update(body).eq('id', id).select();

    if (error) {
      throw new Error(error.message);
    }

    return NextResponse.json(data);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ message: 'Error updating vlog', error: errorMessage }, { status: 500 });
  }
}

export async function DELETE(
  request: Request, 
  { params }: { params: { id: string } }
) {
  try {
    const id = await Promise.resolve(params.id);
    const { error } = await supabase.from('vlogs').delete().eq('id', id).select();

    if (error) {
      throw new Error(error.message);
    }

    return NextResponse.json({ message: 'Vlog deleted successfully' });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ message: 'Error deleting vlog', error: errorMessage }, { status: 500 });
  }
}
