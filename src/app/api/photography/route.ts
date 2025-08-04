
import { NextResponse } from 'next/server';
import { photography } from '@/lib/data';
import type { Photography } from '@/lib/data';

// GET all photos
export async function GET() {
  return NextResponse.json(photography);
}

// POST a new photo
export async function POST(request: Request) {
  try {
    const photoData: Omit<Photography, 'id'> = await request.json();
    
    if (!photoData.src || !photoData.alt || !photoData.downloadUrl) {
        return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }
    
    const newPhoto = {
        ...photoData,
        id: Date.now(), // simple unique id
    };

    photography.unshift(newPhoto);
    return NextResponse.json(newPhoto, { status: 201 });

  } catch (error) {
    return NextResponse.json({ message: 'Error creating photo entry', error }, { status: 500 });
  }
}
