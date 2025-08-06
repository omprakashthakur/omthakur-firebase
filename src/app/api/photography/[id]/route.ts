import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

export async function GET(
  request: Request, 
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    
    // Convert string ID to number if needed
    const numericId = parseInt(id, 10);
    
    // Check if conversion was successful
    if (isNaN(numericId)) {
      return NextResponse.json({ message: 'Invalid ID format' }, { status: 400 });
    }
    
    const { data, error } = await supabase
      .from('photography')
      .select('*')
      .eq('id', numericId)
      .maybeSingle();

    if (error) {
      throw new Error(error.message);
    }

    if (!data) {
      return NextResponse.json({ message: 'Photo not found' }, { status: 404 });
    }

    return NextResponse.json(data);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ message: 'Error fetching photo', error: errorMessage }, { status: 500 });
  }
}

export async function PUT(
  request: Request, 
  { params }: { params: { id: string } }
) {
  try {
    const id = await Promise.resolve(params.id);
    const body = await request.json();
    const { data, error } = await supabase.from('photography').update(body).eq('id', id).select();

    if (error) {
      throw new Error(error.message);
    }

    return NextResponse.json(data);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ message: 'Error updating photo', error: errorMessage }, { status: 500 });
  }
}

export async function DELETE(
  request: Request, 
  { params }: { params: { id: string } }
) {
  try {
    const id = await Promise.resolve(params.id);
    const { error } = await supabase.from('photography').delete().eq('id', id).select();

    if (error) {
      throw new Error(error.message);
    }

    return NextResponse.json({ message: 'Photo deleted successfully' });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ message: 'Error deleting photo', error: errorMessage }, { status: 500 });
  }
}
