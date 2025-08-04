
import { NextResponse } from 'next/server';
import { photography } from '@/lib/data';
import type { Photography } from '@/lib/data';

// GET a single photo by id
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const photo = photography.find(p => p.id === Number(params.id));
  if (photo) {
    return NextResponse.json(photo);
  }
  return NextResponse.json({ message: 'Photo not found' }, { status: 404 });
}

// PUT (update) a photo by id
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const updatedPhotoData: Partial<Omit<Photography, 'id'>> = await request.json();
    const photoIndex = photography.findIndex(p => p.id === Number(params.id));

    if (photoIndex === -1) {
      return NextResponse.json({ message: 'Photo not found' }, { status: 404 });
    }

    const updatedPhoto = { 
      ...photography[photoIndex], 
      ...updatedPhotoData,
    };
    photography[photoIndex] = updatedPhoto;

    return NextResponse.json(updatedPhoto);
  } catch (error) {
    let errorMessage = 'Error updating photo';
    if (error instanceof Error) {
        errorMessage = error.message;
    }
    return NextResponse.json({ message: errorMessage }, { status: 500 });
  }
}

// DELETE a photo by id
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const photoIndex = photography.findIndex(p => p.id === Number(params.id));

  if (photoIndex === -1) {
    return NextResponse.json({ message: 'Photo not found' }, { status: 404 });
  }

  const deletedPhoto = photography.splice(photoIndex, 1);

  return NextResponse.json({ message: 'Photo deleted successfully', photo: deletedPhoto[0] });
}
