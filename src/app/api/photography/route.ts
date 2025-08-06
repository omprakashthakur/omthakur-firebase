import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

export async function GET() {
  try {
    // Check if we're using a mock client
    if ((supabase as any).isMockClient) {
      // Return mock data with local images if we're using a mock client
      return NextResponse.json([
        {
          id: '1',
          title: 'Sample Photo 1',
          description: 'A beautiful landscape',
          src: '/placeholder-image.jpg',
          alt: 'Sample landscape photo',
          downloadUrl: '/placeholder-image.jpg',
          category: 'landscape',
          tags: ['nature', 'landscape'],
          created_at: new Date().toISOString()
        },
        {
          id: '2',
          title: 'Sample Photo 2',
          description: 'A cityscape view',
          src: '/placeholder-image.jpg',
          alt: 'Sample city photo',
          downloadUrl: '/placeholder-image.jpg',
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
      // Return fallback data instead of empty array to prevent external URL issues
      return NextResponse.json([
        {
          id: 'fallback-1',
          src: '/placeholder-image.jpg',
          alt: 'Photography Portfolio - Professional work showcase',
          downloadUrl: '/placeholder-image.jpg'
        },
        {
          id: 'fallback-2',
          src: '/placeholder-image.jpg',
          alt: 'Creative Photography - Artistic vision and composition',
          downloadUrl: '/placeholder-image.jpg'
        },
        {
          id: 'fallback-3',
          src: '/placeholder-image.jpg',
          alt: 'Visual Storytelling - Capturing moments and emotions',
          downloadUrl: '/placeholder-image.jpg'
        }
      ]);
    }

    // If database returns empty data, provide fallback content
    if (!data || data.length === 0) {
      return NextResponse.json([
        {
          id: 'default-1',
          src: '/placeholder-image.jpg',
          alt: 'Photography Collection - Sample work from portfolio',
          downloadUrl: '/placeholder-image.jpg'
        },
        {
          id: 'default-2',
          src: '/placeholder-image.jpg',
          alt: 'Professional Photography - High quality imaging services',
          downloadUrl: '/placeholder-image.jpg'
        },
        {
          id: 'default-3',
          src: '/placeholder-image.jpg',
          alt: 'Artistic Vision - Creative photography and composition',
          downloadUrl: '/placeholder-image.jpg'
        }
      ]);
    }

    // Ensure we always return an array, even if data is null
    return NextResponse.json(data || []);
  } catch (error) {
    console.error('Error fetching photography data:', error);
    // Return fallback data even when an error occurs
    return NextResponse.json([
      {
        id: 'error-1',
        src: '/placeholder-image.jpg',
        alt: 'Photography Portfolio - Professional work showcase',
        downloadUrl: '/placeholder-image.jpg'
      },
      {
        id: 'error-2',
        src: '/placeholder-image.jpg',
        alt: 'Creative Photography - Artistic vision and composition',
        downloadUrl: '/placeholder-image.jpg'
      },
      {
        id: 'error-3',
        src: '/placeholder-image.jpg',
        alt: 'Visual Storytelling - Capturing moments and emotions',
        downloadUrl: '/placeholder-image.jpg'
      }
    ]);
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
