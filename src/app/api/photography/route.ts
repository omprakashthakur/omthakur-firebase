import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';
import { fetchOmPrakashPhotos, formatPexelsPhotos } from '@/lib/pexelsClient';

export async function GET() {
  try {
    console.log('📸 Fetching photography data from Om Prakash Thakur collection...');
    
    let allPhotos: any[] = [];
    let sources: string[] = [];

    // First, try to get photos from Supabase database
    try {
      const { data: dbPhotos, error } = await supabase
        .from('photography')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && dbPhotos && dbPhotos.length > 0) {
        console.log(`✅ Found ${dbPhotos.length} photos in database`);
        allPhotos = [...allPhotos, ...dbPhotos];
        sources.push('database');
      } else {
        console.log('⚠️ No photos found in database, fetching from Pexels collection...');
      }
    } catch (dbError) {
      console.log('⚠️ Database connection failed, will use Pexels API directly');
    }

    // Fetch from your Pexels collection
    try {
      console.log('🔍 Fetching photos from your Pexels collection "ofymzs7"...');
      const pexelsPhotos = await fetchOmPrakashPhotos(20, 1);
      
      if (pexelsPhotos && pexelsPhotos.length > 0) {
        console.log(`✅ Found ${pexelsPhotos.length} photos from Pexels collection`);
        const formattedPexelsPhotos = formatPexelsPhotos(pexelsPhotos);
        allPhotos = [...allPhotos, ...formattedPexelsPhotos];
        sources.push('pexels-collection');
      } else {
        console.log('⚠️ No photos found in Pexels collection');
      }
    } catch (pexelsError) {
      console.error('❌ Error fetching from Pexels:', pexelsError);
      // If Pexels API fails, return an error instead of dummy data
      return NextResponse.json(
        { 
          error: 'Unable to fetch photography data. Please ensure PEXELS_API_KEY is configured.',
          message: 'Photography collection unavailable'
        }, 
        { 
          status: 503,
          headers: {
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'X-Photo-Sources': 'error',
            'X-Photo-Count': '0'
          }
        }
      );
    }

    // Remove duplicates based on ID
    const uniquePhotos = allPhotos.filter((photo, index, self) => 
      index === self.findIndex(p => p.id === photo.id)
    );

    if (uniquePhotos.length === 0) {
      return NextResponse.json(
        { 
          error: 'No photography data available',
          message: 'Please add photos to your collection or check API configuration'
        }, 
        { 
          status: 404,
          headers: {
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'X-Photo-Sources': 'none',
            'X-Photo-Count': '0'
          }
        }
      );
    }

    console.log(`📊 Returning ${uniquePhotos.length} real photos from sources: ${sources.join(', ')}`);

    return NextResponse.json(uniquePhotos, {
      headers: {
        'Cache-Control': 'public, s-maxage=1800, stale-while-revalidate=3600',
        'X-Photo-Sources': sources.join(','),
        'X-Photo-Count': uniquePhotos.length.toString()
      }
    });

  } catch (error) {
    console.error('❌ Error in photography API route:', error);
    
    return NextResponse.json(
      { 
        error: 'Photography service unavailable',
        message: 'Unable to load photography collection. Please try again later.'
      }, 
      { 
        status: 500,
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'X-Photo-Sources': 'error',
          'X-Photo-Count': '0'
        }
      }
    );
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
