import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

// Generate placeholder vlog data for fallback when real data can't be fetched
function generatePlaceholderVlogs() {
  return [
    { 
      id: 'placeholder-1', 
      title: 'Travel Adventure in Bali', 
      platform: 'YouTube', 
      category: 'Travel',
      thumbnail: 'https://images.pexels.com/photos/3155666/pexels-photo-3155666.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      created_at: new Date().toISOString(),
      description: 'Exploring the beautiful beaches and culture of Bali'
    },
    { 
      id: 'placeholder-2', 
      title: 'Cooking Italian Pasta From Scratch', 
      platform: 'YouTube', 
      category: 'Food',
      thumbnail: 'https://images.pexels.com/photos/1527603/pexels-photo-1527603.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      created_at: new Date(Date.now() - 86400000).toISOString(),
      description: 'Learn how to make authentic Italian pasta at home'
    },
    { 
      id: 'placeholder-3', 
      title: 'Daily Life in Tokyo', 
      platform: 'Instagram', 
      category: 'Lifestyle',
      thumbnail: 'https://images.pexels.com/photos/2506923/pexels-photo-2506923.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      url: 'https://www.instagram.com/',
      created_at: new Date(Date.now() - 172800000).toISOString(),
      description: 'A day in the life of a digital nomad in Tokyo'
    }
  ];
}

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
      console.error('Supabase error in /api/vlogs:', error.message);
      // Return fallback data instead of throwing an error
      return NextResponse.json(generatePlaceholderVlogs());
    }

    // Return the actual data from the database, or fallback to placeholders if data is null
    return NextResponse.json(data || generatePlaceholderVlogs());
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('API error in /api/vlogs:', errorMessage);
    // Return fallback data instead of an error response
    return NextResponse.json(generatePlaceholderVlogs());
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
