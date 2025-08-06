import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

export async function GET(request: Request) {
  try {
    // Get the search params from the request URL
    const { searchParams } = new URL(request.url);
    const order = searchParams.get('order');
    
    // Build the query
    let query = supabase.from('vlogs').select('*');
    
    // Add order by if specified and only if we're not in mock mode
    // This avoids issues with columns that may not exist in the actual database
    try {
      if (order === 'created_at_desc') {
        // Try to order by id instead if created_at is not available
        query = query.order('id', { ascending: false });
      }
    } catch (orderError) {
      console.warn('Order parameter ignored:', orderError);
      // Continue without ordering if there's an error
    }
    
    // Execute the query
    const { data, error } = await query;

    if (error) {
      throw new Error(error.message);
    }

    return NextResponse.json(data);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('API error in /api/vlogs:', errorMessage);
    return NextResponse.json({ message: 'Error fetching vlogs', error: errorMessage }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { data, error } = await supabase.from('vlogs').insert([body]).select();

    if (error) {
      throw new Error(error.message);
    }

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
     const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ message: 'Error creating vlog', error: errorMessage }, { status: 500 });
  }
}
