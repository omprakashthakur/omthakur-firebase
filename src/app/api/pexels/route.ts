import { NextResponse } from 'next/server';
import { fetchOmPrakashPhotos, formatPexelsPhotos } from '@/lib/pexelsClient';

export async function GET() {
  try {
    // Fetch photos specifically from Om Prakash Thakur's account
    const photos = await fetchOmPrakashPhotos(20, 1);
    
    // Format them to match your photography schema
    const formattedPhotos = formatPexelsPhotos(photos);
    
    return NextResponse.json(formattedPhotos);
  } catch (error) {
    console.error('Error fetching Om Prakash photos:', error);
    // Return empty array instead of error to prevent breaking the page
    return NextResponse.json([]);
  }
}
