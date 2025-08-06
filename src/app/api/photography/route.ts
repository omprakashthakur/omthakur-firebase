import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

export async function GET() {
  try {
    // Check if we're using a mock client
    if ((supabase as any).isMockClient) {
      // Return mock data if we're using a mock client
      return NextResponse.json([
        {
          id: '1',
          title: 'Sample Photo 1',
          description: 'A beautiful landscape',
          src: 'https://placehold.co/600x400?text=Sample+Photo+1',
          alt: 'Sample landscape photo',
          category: 'landscape',
          tags: ['nature', 'landscape'],
          created_at: new Date().toISOString()
        },
        {
          id: '2',
          title: 'Sample Photo 2',
          description: 'A cityscape view',
          src: 'https://placehold.co/600x400?text=Sample+Photo+2',
          alt: 'Sample city photo',
          category: 'cityscape',
          tags: ['city', 'urban'],
          created_at: new Date().toISOString()
        }
      ]);
    }
    
    // Use a more reliable sorting method - in this case by id
    const { data, error } = await supabase
      .from('photography')
      .select('*')
      .order('id', { ascending: false });

    if (error) {
      console.error('Supabase error:', error);
      // Return empty array instead of error
      return NextResponse.json([]);
    }

    // Ensure we always return an array, even if data is null
    return NextResponse.json(data || []);
  } catch (error) {
    console.error('Error fetching photography data:', error);
    // Return empty array instead of error to prevent page breaking
    return NextResponse.json([]);
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
