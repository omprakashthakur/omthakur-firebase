import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

export async function GET() {
  try {
    // Use a more reliable sorting method - in this case by id
    // This assumes that newer photos have higher IDs
    const { data, error } = await supabase
      .from('photography')
      .select('*')
      .order('id', { ascending: false });

    if (error) {
      throw new Error(error.message);
    }

    // Ensure we always return an array, even if data is null
    return NextResponse.json(data || []);
  } catch (error) {
    console.error('Error fetching photography data:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ message: 'Error fetching photos', error: errorMessage }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { data, error } = await supabase.from('photography').insert([body]).select();

    if (error) {
      throw new Error(error.message);
    }

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
     const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ message: 'Error adding photo', error: errorMessage }, { status: 500 });
  }
}
