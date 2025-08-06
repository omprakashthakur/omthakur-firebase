import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';
import { fetchOmPrakashPhotos, formatPexelsPhotos } from '@/lib/pexelsClient';

export async function GET() {
  try {
    console.log('📸 Fetching photography data...');
    
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
        console.log('⚠️ No photos found in database or database error:', error?.message);
      }
    } catch (dbError) {
      console.log('⚠️ Database connection failed, will use Pexels API directly');
    }

    // If we don't have enough photos from the database, fetch from Pexels collection
    if (allPhotos.length < 10) {
      try {
        console.log('🔍 Fetching photos from your Pexels collection...');
        const pexelsPhotos = await fetchOmPrakashPhotos(20, 1);
        
        if (pexelsPhotos && pexelsPhotos.length > 0) {
          console.log(`✅ Found ${pexelsPhotos.length} photos from Pexels collection`);
          const formattedPexelsPhotos = formatPexelsPhotos(pexelsPhotos);
          allPhotos = [...allPhotos, ...formattedPexelsPhotos];
          sources.push('pexels-collection');
        }
      } catch (pexelsError) {
        console.error('❌ Error fetching from Pexels:', pexelsError);
      }
    }

    // If we still don't have photos, provide curated fallback
    if (allPhotos.length === 0) {
      console.log('🎨 Using curated photography fallback...');
      allPhotos = getCuratedPhotographyFallback();
      sources.push('curated-fallback');
    }

    // Remove duplicates based on ID
    const uniquePhotos = allPhotos.filter((photo, index, self) => 
      index === self.findIndex(p => p.id === photo.id)
    );

    console.log(`📊 Returning ${uniquePhotos.length} photos from sources: ${sources.join(', ')}`);

    return NextResponse.json(uniquePhotos, {
      headers: {
        'Cache-Control': 'public, s-maxage=1800, stale-while-revalidate=3600',
        'X-Photo-Sources': sources.join(','),
        'X-Photo-Count': uniquePhotos.length.toString()
      }
    });

  } catch (error) {
    console.error('❌ Error in photography API route:', error);
    
    // Return curated fallback on any error
    const fallbackPhotos = getCuratedPhotographyFallback();
    
    return NextResponse.json(fallbackPhotos, {
      status: 200, // Still return 200 to prevent frontend errors
      headers: {
        'Cache-Control': 'public, s-maxage=300',
        'X-Photo-Sources': 'error-fallback',
        'X-Photo-Count': fallbackPhotos.length.toString()
      }
    });
  }
}

/**
 * Curated photography collection as fallback
 * These are professional photos that represent good photography work
 */
function getCuratedPhotographyFallback() {
  return [
    {
      id: 'curated-1',
      title: 'Mountain Landscape at Golden Hour',
      description: 'A breathtaking mountain landscape captured during golden hour, showcasing the interplay of light and shadow across rugged peaks.',
      src: 'https://images.pexels.com/photos/1366919/pexels-photo-1366919.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      alt: 'Mountain landscape at golden hour with dramatic lighting',
      category: 'landscape',
      tags: ['landscape', 'mountains', 'golden-hour', 'nature', 'scenic'],
      photographer_name: 'Professional Photographer',
      photographer_url: 'https://omthakur.site',
      width: 1260,
      height: 750,
      downloadUrl: 'https://images.pexels.com/photos/1366919/pexels-photo-1366919.jpeg',
      created_at: new Date().toISOString()
    },
    {
      id: 'curated-2',
      title: 'Urban Architecture and Skyline',
      description: 'Modern urban architecture showcasing clean lines and geometric patterns against a dramatic sky.',
      src: 'https://images.pexels.com/photos/2681319/pexels-photo-2681319.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      alt: 'Modern urban architecture with geometric patterns',
      category: 'architecture',
      tags: ['architecture', 'urban', 'modern', 'geometric', 'cityscape'],
      photographer_name: 'Professional Photographer',
      photographer_url: 'https://omthakur.site',
      width: 1260,
      height: 750,
      downloadUrl: 'https://images.pexels.com/photos/2681319/pexels-photo-2681319.jpeg',
      created_at: new Date().toISOString()
    },
    {
      id: 'curated-3',
      title: 'Ocean Waves and Coastal Beauty',
      description: 'Dynamic ocean waves crashing against rocky coastline, capturing the raw power and beauty of nature.',
      src: 'https://images.pexels.com/photos/1179229/pexels-photo-1179229.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      alt: 'Ocean waves crashing against rocky coastline',
      category: 'seascape',
      tags: ['seascape', 'ocean', 'waves', 'coastline', 'nature'],
      photographer_name: 'Professional Photographer',
      photographer_url: 'https://omthakur.site',
      width: 1260,
      height: 750,
      downloadUrl: 'https://images.pexels.com/photos/1179229/pexels-photo-1179229.jpeg',
      created_at: new Date().toISOString()
    },
    {
      id: 'curated-4',
      title: 'Forest Path in Autumn',
      description: 'A serene forest path surrounded by autumn foliage, creating a tunnel of warm colors and natural beauty.',
      src: 'https://images.pexels.com/photos/1496372/pexels-photo-1496372.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      alt: 'Forest path surrounded by autumn foliage',
      category: 'nature',
      tags: ['forest', 'autumn', 'path', 'trees', 'seasonal'],
      photographer_name: 'Professional Photographer',
      photographer_url: 'https://omthakur.site',
      width: 1260,
      height: 750,
      downloadUrl: 'https://images.pexels.com/photos/1496372/pexels-photo-1496372.jpeg',
      created_at: new Date().toISOString()
    },
    {
      id: 'curated-5',
      title: 'Desert Landscape at Sunset',
      description: 'Vast desert landscape with sand dunes illuminated by the warm glow of sunset, showcasing the beauty of arid environments.',
      src: 'https://images.pexels.com/photos/1173777/pexels-photo-1173777.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      alt: 'Desert landscape with sand dunes at sunset',
      category: 'landscape',
      tags: ['desert', 'sunset', 'sand-dunes', 'arid', 'minimalist'],
      photographer_name: 'Professional Photographer',
      photographer_url: 'https://omthakur.site',
      width: 1260,
      height: 750,
      downloadUrl: 'https://images.pexels.com/photos/1173777/pexels-photo-1173777.jpeg',
      created_at: new Date().toISOString()
    },
    {
      id: 'curated-6',
      title: 'City Street Photography',
      description: 'Dynamic street photography capturing the energy and movement of urban life with dramatic lighting.',
      src: 'https://images.pexels.com/photos/1804911/pexels-photo-1804911.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      alt: 'Dynamic city street photography with dramatic lighting',
      category: 'street',
      tags: ['street-photography', 'urban', 'city-life', 'dramatic', 'movement'],
      photographer_name: 'Professional Photographer',
      photographer_url: 'https://omthakur.site',
      width: 1260,
      height: 750,
      downloadUrl: 'https://images.pexels.com/photos/1804911/pexels-photo-1804911.jpeg',
      created_at: new Date().toISOString()
    },
    {
      id: 'curated-7',
      title: 'Minimalist Architecture',
      description: 'Clean, minimalist architectural design emphasizing geometric forms and the interplay of light and shadow.',
      src: 'https://images.pexels.com/photos/2116721/pexels-photo-2116721.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      alt: 'Minimalist architecture with geometric forms',
      category: 'architecture',
      tags: ['minimalist', 'architecture', 'geometric', 'clean', 'modern'],
      photographer_name: 'Professional Photographer',
      photographer_url: 'https://omthakur.site',
      width: 1260,
      height: 750,
      downloadUrl: 'https://images.pexels.com/photos/2116721/pexels-photo-2116721.jpeg',
      created_at: new Date().toISOString()
    },
    {
      id: 'curated-8',
      title: 'Tropical Paradise Beach',
      description: 'Crystal clear waters and pristine white sand beach surrounded by palm trees, epitomizing tropical paradise.',
      src: 'https://images.pexels.com/photos/1450361/pexels-photo-1450361.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      alt: 'Tropical paradise beach with crystal clear waters',
      category: 'tropical',
      tags: ['tropical', 'beach', 'paradise', 'clear-water', 'palm-trees'],
      photographer_name: 'Professional Photographer',
      photographer_url: 'https://omthakur.site',
      width: 1260,
      height: 750,
      downloadUrl: 'https://images.pexels.com/photos/1450361/pexels-photo-1450361.jpeg',
      created_at: new Date().toISOString()
    }
  ];
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { data, error } = await supabase
      .from('photography')
      .insert([body])
      .select();

    if (error) {
      console.error('Error adding photo:', error);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json(data[0]);
  } catch (error) {
    console.error('Error adding photo:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
